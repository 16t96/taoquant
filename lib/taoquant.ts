// Deterministic risk model for Bittensor subnets. No AI, pure statistics.

export interface Subnet {
  id: number
  name: string
  apy: number | null // average annualized return %, null when unavailable
  cv: number // coefficient of variation (volatility), typically 0..1+
  hhi: number // Herfindahl-Hirschman staking concentration, 0..1
  churn: number | null // miner churn rate %, null when unavailable
}

export interface Weights {
  w1: number // APY stability
  w2: number // HHI decentralization
  w3: number // efficiency / churn
}

export const DEFAULT_WEIGHTS: Weights = { w1: 0.4, w2: 0.35, w3: 0.25 }

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))

export interface Pillars {
  stability: number // 0..1
  decentralization: number // 0..1
  efficiency: number // 0..1
}

// Safety-clamped pillars. Each metric is floored at 0 so pathological inputs
// (CV > 1.0, churn > 100%) can never push a pillar — or the IRA — negative.
export function computePillars(s: Subnet): Pillars {
  return {
    // CV > 1.0 => 1 - CV goes negative => Math.max(0, ...) floors it at 0
    stability: Math.max(0, 1 - s.cv),
    decentralization: clamp01(1 - s.hhi),
    // Missing churn is neutral for scoring; an explicit zero remains zero.
    efficiency: s.churn === null ? 0 : Math.max(0, 1 - s.churn / 100),
  }
}

// IRA = 100 * (w1 * stability + w2 * decentralization + w3 * efficiency)
export function computeIRA(s: Subnet, w: Weights): number {
  const p = computePillars(s)
  const raw = w.w1 * p.stability + w.w2 * p.decentralization + w.w3 * p.efficiency
  return Math.round(clamp01(raw) * 100)
}

export type RiskLevel = "low" | "medium" | "high"

export function riskLevel(ira: number): RiskLevel {
  if (ira >= 80) return "low"
  if (ira >= 50) return "medium"
  return "high"
}

// Normalize any three weights so they sum to 1.0 (keeps proportions).
export function normalizeWeights(w: Weights): Weights {
  const sum = w.w1 + w.w2 + w.w3
  if (sum <= 0) return DEFAULT_WEIGHTS
  return { w1: w.w1 / sum, w2: w.w2 / sum, w3: w.w3 / sum }
}

// When one slider changes, redistribute the remainder across the other two,
// preserving their relative proportion, so the total stays at 1.0.
export function adjustWeights(current: Weights, key: keyof Weights, value: number): Weights {
  const v = clamp01(value)
  const others = (Object.keys(current) as (keyof Weights)[]).filter((k) => k !== key)
  const remaining = 1 - v
  const otherSum = current[others[0]] + current[others[1]]

  const next = { ...current, [key]: v } as Weights
  if (otherSum <= 0) {
    next[others[0]] = remaining / 2
    next[others[1]] = remaining / 2
  } else {
    next[others[0]] = remaining * (current[others[0]] / otherSum)
    next[others[1]] = remaining * (current[others[1]] / otherSum)
  }
  return next
}

export const DONATION_ADDRESS = "5D4tdPN57Qc379hJMdStBdNmLxynpQBGv8KUa5PBhNpf8zVY"

// Mock dataset — real-ish Bittensor subnets for immediate visualization.
export const MOCK_SUBNETS: Subnet[] = [
  { id: 1, name: "Text Prompting", apy: 14.2, cv: 0.18, hhi: 0.22, churn: 9 },
  { id: 2, name: "Machine Translation", apy: 11.7, cv: 0.31, hhi: 0.41, churn: 18 },
  { id: 4, name: "Multi Modality", apy: 22.5, cv: 0.62, hhi: 0.55, churn: 34 },
  { id: 5, name: "Image Generation", apy: 18.9, cv: 0.44, hhi: 0.38, churn: 21 },
  { id: 8, name: "Time-Series Prediction", apy: 9.4, cv: 0.12, hhi: 0.29, churn: 7 },
  { id: 18, name: "Cortex.t", apy: 27.8, cv: 0.78, hhi: 0.67, churn: 46 },
  { id: 21, name: "FileTAO Storage", apy: 12.1, cv: 0.25, hhi: 0.33, churn: 14 },
  { id: 27, name: "Compute Subnet", apy: 16.6, cv: 0.39, hhi: 0.48, churn: 26 },
]

// Isolated data-source switch.
export type DataSource = "mock" | "live"

const TAOSTATS_ENDPOINT = "/api/taostats/subnets"

type TaostatsRecord = Record<string, unknown>

function firstNumber(record: TaostatsRecord, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = record[key]
    if (value === undefined || value === null || value === "") continue
    const parsed = typeof value === "number" ? value : Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return undefined
}

function bounded(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function formatAPY(apy: number | null): string {
  if (apy === null || !Number.isFinite(apy)) return "-"
  if (Math.abs(apy) > 1_000) return "Volatile"
  if (Math.abs(apy) < 0.01) return "< 0.01%"
  return `${apy.toFixed(apy < 10 ? 2 : 1)}%`
}

// Taostats' latest subnet endpoint currently exposes chain parameters rather
// than the dashboard's derived metrics. Prefer explicit metric fields, then
// derive useful non-zero fallbacks from the available subnet parameters.
export function mapData(raw: unknown): Subnet[] {
  const list: TaostatsRecord[] = Array.isArray(raw)
    ? (raw as TaostatsRecord[])
    : raw && typeof raw === "object" && Array.isArray((raw as { data?: unknown }).data)
      ? ((raw as { data: TaostatsRecord[] }).data)
      : []

  return list
    .map((record) => {
      const id = firstNumber(record, ["netuid", "net_uid", "id"])
      if (id === undefined) return null

      const activeMiners = firstNumber(record, ["active_miners", "miners", "active_keys"])
      const activeValidators = firstNumber(record, ["active_validators", "validators"])
      const maxNeurons = firstNumber(record, ["max_neurons", "max_validators"])
      const registrations = firstNumber(record, [
        "miner_churn",
        "churn",
        "churn_rate",
        "miner_churn_rate",
      ])
      const directYield = firstNumber(record, ["yield", "apy", "roi", "return_rate"])
      const dailyEmission = firstNumber(record, ["daily_emission", "emission_24h"])
      const emission = dailyEmission ?? firstNumber(record, ["emission"])
      const stake = firstNumber(record, ["tao_in", "total_stake", "stake", "total_stake_tao", "alpha_in"])
      const projectedEmission = firstNumber(record, ["projected_emission"])
      const emissionRate = firstNumber(record, ["emission_rate", "emission_ratio"])

      // Yield fields may be ratios (0.14 => 14%) or already percentages.
      // Emission fallbacks require a stake denominator; otherwise APY stays null.
      const normalizePercent = (value: number) => Math.abs(value) > 0 && Math.abs(value) < 1 ? value * 100 : value
      const directApy = directYield === undefined ? undefined : normalizePercent(directYield)
      const emissionApy = emission !== undefined && stake !== undefined && stake > 0
        ? (emission / stake) * 365 * 100
        : undefined
      const projectedApy = projectedEmission !== undefined && stake !== undefined && stake > 0
        ? (projectedEmission / stake) * 365 * 100
        : undefined
      const rateApy = emissionRate === undefined ? undefined : normalizePercent(emissionRate) * 365
      const apy = directApy ?? emissionApy ?? projectedApy ?? rateApy ?? null
      const cv = firstNumber(record, ["cv", "coefficient_of_variation", "coefficient_variation", "volatility"])
        ?? (activeMiners !== undefined && activeValidators !== undefined && activeMiners > 0
          ? bounded(activeValidators / activeMiners, 0, 1)
          : 0)
      const hhi = firstNumber(record, ["hhi", "hhi_index", "concentration_index"])
        ?? (activeValidators !== undefined && maxNeurons !== undefined && maxNeurons > 0
          ? bounded(1 - activeValidators / maxNeurons, 0, 1)
          : 0)
      const churn = registrations
        ?? (activeMiners !== undefined && activeMiners > 0
          ? bounded((firstNumber(record, ["neuron_registrations_this_interval", "registrations_this_interval"]) ?? 0) / activeMiners * 100, 0, 100)
          : null)

      return {
        id,
        name: String(record.name ?? record.subnet_name ?? `Subnet ${id}`),
        apy: typeof apy === "number" && Number.isFinite(apy) ? apy : null,
        cv: bounded(cv, 0, 1),
        hhi: bounded(hhi, 0, 1),
        churn: typeof churn === "number" && Number.isFinite(churn) ? bounded(churn, 0, 100) : null,
      }
    })
    .filter((subnet): subnet is Subnet => subnet !== null)
}

// Live fetch throws on any failure (missing API key, rate limit, network) so
// the caller can surface a toast and keep the mock data on screen.
export async function fetchSubnets(source: DataSource): Promise<Subnet[]> {
  if (source === "mock") return MOCK_SUBNETS

  const res = await fetch(TAOSTATS_ENDPOINT, { cache: "no-store" })
  if (!res.ok) {
    throw new Error(`Taostats API error: ${res.status}`)
  }
  const json = await res.json()
  console.log("Taostats raw response:", json)
  const mapped = mapData(json)
  if (mapped.length === 0) {
    throw new Error("Taostats API returned no usable records")
  }
  return mapped
}
