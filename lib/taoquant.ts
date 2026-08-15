// Deterministic risk model for Bittensor subnets. No AI, pure statistics.

export interface Subnet {
  id: number
  name: string
  apy: number // average annualized return %
  cv: number // coefficient of variation (volatility), typically 0..1+
  hhi: number // Herfindahl-Hirschman staking concentration, 0..1
  churn: number // miner churn rate %, 0..100
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
    // churn is a percentage (0..100); churn > 100 => floored at 0
    efficiency: Math.max(0, 1 - s.churn / 100),
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

const TAOSTATS_ENDPOINT = "https://api.taostats.io/v1/subnets"

// Shape of a single record returned by the Taostats API (fields we consume).
interface TaostatsRecord {
  netuid: number
  name?: string
  apy?: number
  cv?: number
  hhi?: number
  churn?: number
}

// Maps the raw Taostats API response into the exact Subnet shape the table
// expects: netuid -> id, apy -> apy, cv -> cv, hhi -> hhi, churn -> churn.
export function mapData(raw: unknown): Subnet[] {
  const list: TaostatsRecord[] = Array.isArray(raw)
    ? (raw as TaostatsRecord[])
    : Array.isArray((raw as { data?: unknown })?.data)
      ? ((raw as { data: TaostatsRecord[] }).data)
      : []

  return list.map((r) => ({
    id: Number(r.netuid),
    name: r.name ?? `Subnet ${r.netuid}`,
    apy: Number(r.apy ?? 0),
    cv: Number(r.cv ?? 0),
    hhi: Number(r.hhi ?? 0),
    churn: Number(r.churn ?? 0),
  }))
}

// Live fetch throws on any failure (missing API key, rate limit, network) so
// the caller can surface a toast and keep the mock data on screen.
export async function fetchSubnets(source: DataSource): Promise<Subnet[]> {
  if (source === "mock") return MOCK_SUBNETS

  const apiKey = process.env.NEXT_PUBLIC_TAOSTATS_API_KEY
  const res = await fetch(TAOSTATS_ENDPOINT, {
    headers: apiKey ? { Authorization: apiKey } : undefined,
  })
  if (!res.ok) {
    throw new Error(`Taostats API error: ${res.status}`)
  }
  const json = await res.json()
  const mapped = mapData(json)
  if (mapped.length === 0) {
    throw new Error("Taostats API returned no usable records")
  }
  return mapped
}
