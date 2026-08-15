import { NextResponse } from "next/server"

const ENDPOINTS = [
  "https://api.taostats.io/v1/subnets",
  "https://api.taostats.io/api/subnets",
  "https://api.taostats.io/api/subnet/latest/v1",
]

export const dynamic = "force-dynamic"

export async function GET() {
  const apiKey = process.env.TAOSTATS_API_KEY ?? process.env.NEXT_PUBLIC_TAOSTATS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "Taostats API key is not configured" }, { status: 503 })
  }

  const headers = {
    Accept: "application/json",
    Authorization: apiKey,
    "x-api-key": apiKey,
  }

  try {
    let response: Response | undefined
    for (const endpoint of ENDPOINTS) {
      response = await fetch(endpoint, { headers, cache: "no-store" })
      if (response.status !== 404) break
    }

    if (!response?.ok) {
      return NextResponse.json(
        { error: `Taostats API returned ${response?.status ?? 502}` },
        { status: response?.status && response.status >= 400 ? response.status : 502 },
      )
    }

    const text = await response.text()
    try {
      const data = JSON.parse(text)
      return NextResponse.json(data, { status: 200 })
    } catch {
      return NextResponse.json({ error: "Taostats returned invalid JSON" }, { status: 502 })
    }
  } catch {
    return NextResponse.json({ error: "Unable to reach Taostats API" }, { status: 502 })
  }
}
