import { NextResponse } from "next/server"

const TAOSTATS_ENDPOINT = "https://api.taostats.io/api/subnet/latest/v1"

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_TAOSTATS_API_KEY ?? process.env.TAOSTATS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "Taostats API key is not configured" }, { status: 503 })
  }

  try {
    const response = await fetch(TAOSTATS_ENDPOINT, {
      headers: {
        Accept: "application/json",
        // Taostats expects the API key value directly in Authorization.
        Authorization: apiKey,
        "x-api-key": apiKey,
      },
      cache: "no-store",
    })

    const body = await response.text()
    return new NextResponse(body, {
      status: response.status,
      headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
    })
  } catch {
    return NextResponse.json({ error: "Unable to reach Taostats API" }, { status: 502 })
  }
}
