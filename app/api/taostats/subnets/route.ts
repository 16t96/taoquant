import { NextResponse } from "next/server"

const TAOSTATS_ENDPOINTS = [
  "https://api.taostats.io/v1/subnets",
  "https://api.taostats.io/api/subnet/latest/v1",
]

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_TAOSTATS_API_KEY ?? process.env.TAOSTATS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "Taostats API key is not configured" }, { status: 503 })
  }

  try {
    const headers = {
      Accept: "application/json",
      // Keep the secret server-side; support both Taostats auth conventions.
      Authorization: apiKey,
      "x-api-key": apiKey,
    }

    let response: Response | undefined
    for (const endpoint of TAOSTATS_ENDPOINTS) {
      response = await fetch(endpoint, { headers, cache: "no-store" })
      if (response.status !== 404) break
    }

    if (!response) {
      return NextResponse.json({ error: "Unable to reach Taostats API" }, { status: 502 })
    }

    const body = await response.text()
    return new NextResponse(body, {
      status: response.status,
      headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
    })
  } catch {
    return NextResponse.json({ error: "Unable to reach Taostats API" }, { status: 502 })
  }
}
