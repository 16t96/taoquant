"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode"
import { Check, Copy, Heart } from "lucide-react"
import type { Dict } from "@/lib/i18n"
import { DONATION_ADDRESS } from "@/lib/taoquant"

export function DonationCard({ t }: { t: Dict }) {
  const [copied, setCopied] = useState(false)
  const [qr, setQr] = useState<string>("")

  useEffect(() => {
    QRCode.toDataURL(DONATION_ADDRESS, {
      width: 220,
      margin: 1,
      color: { dark: "#e6edf3", light: "#0d111700" },
      errorCorrectionLevel: "M",
    })
      .then(setQr)
      .catch(() => setQr(""))
  }, [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(DONATION_ADDRESS)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard unavailable — no-op
    }
  }

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:p-8">
        <div className="flex-1">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-neon-green/30 bg-neon-green/10 px-3 py-1 font-mono text-xs text-neon-green">
            <Heart className="size-3.5" />
            Public Goods Funding
          </div>
          <h2 className="text-balance font-mono text-lg font-semibold text-foreground md:text-xl">
            {t.donation.title}
          </h2>
          <p className="mt-2 max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground">
            {t.donation.text}
          </p>

          <div className="mt-4">
            <label className="font-mono text-xs text-muted-foreground">{t.donation.address}</label>
            <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
              <code className="flex-1 truncate rounded-lg border border-border bg-background px-3 py-2.5 font-mono text-xs text-neon-blue">
                {DONATION_ADDRESS}
              </code>
              <button
                type="button"
                onClick={copy}
                className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 font-mono text-xs font-semibold transition-colors ${
                  copied
                    ? "bg-neon-green text-background"
                    : "bg-primary text-primary-foreground hover:bg-accent"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="size-4" />
                    {t.donation.copied}
                  </>
                ) : (
                  <>
                    <Copy className="size-4" />
                    {t.donation.copy}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* QR code */}
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-xl border border-border bg-background p-3">
            {qr ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qr || "/placeholder.svg"} alt="TAO donation address QR code" width={180} height={180} className="size-[180px]" />
            ) : (
              <div className="size-[180px] animate-pulse rounded bg-secondary" />
            )}
          </div>
          <span className="font-mono text-xs text-muted-foreground">{t.donation.scan}</span>
        </div>
      </div>
    </section>
  )
}
