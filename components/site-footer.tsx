"use client"

import { useEffect, useState } from "react"
import { Scale, ShieldCheck, Lock, X } from "lucide-react"
import type { Dict } from "@/lib/i18n"

type LegalTab = "terms" | "privacy"

function LegalModal({
  open,
  tab,
  onClose,
  t,
}: {
  open: boolean
  tab: LegalTab
  onClose: () => void
  t: Dict
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  const l = t.legal
  const title = tab === "terms" ? l.termsTitle : l.privacyTitle

  const sections =
    tab === "terms"
      ? [l.sections.liability, l.sections.nonCustodial]
      : [l.sections.privacy, l.sections.nonCustodial]

  const icons = tab === "terms" ? [Scale, ShieldCheck] : [Lock, ShieldCheck]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label={l.close}
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="font-mono text-sm font-semibold text-foreground">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={l.close}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="flex flex-col gap-5 p-5">
          {sections.map((s, i) => {
            const Icon = icons[i]
            return (
              <div key={s.title} className="flex gap-3">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </div>
                <div>
                  <h4 className="font-mono text-sm font-medium text-foreground">{s.title}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              </div>
            )
          })}
        </div>
        <div className="border-t border-border px-5 py-4 text-right">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-primary px-4 py-2 font-mono text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {l.close}
          </button>
        </div>
      </div>
    </div>
  )
}

export function SiteFooter({ t }: { t: Dict }) {
  const [modal, setModal] = useState<{ open: boolean; tab: LegalTab }>({
    open: false,
    tab: "terms",
  })

  const openModal = (tab: LegalTab) => setModal({ open: true, tab })

  const links = [
    { href: "#dashboard", label: t.nav.dashboard },
    { href: "#ira-model", label: t.nav.model },
    { href: "#donations", label: t.nav.donations },
  ]

  return (
    <footer id="legal" className="mt-4 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:px-6">
        {/* Sitemap */}
        <nav aria-label={t.nav.title} className="flex flex-col gap-3">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t.nav.title}
          </h2>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-muted-foreground transition-colors hover:text-neon-blue"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => openModal("terms")}
                className="font-mono text-muted-foreground transition-colors hover:text-neon-blue"
              >
                {t.nav.legal}
              </button>
            </li>
          </ul>
        </nav>

        {/* Financial disclaimer */}
        <p className="rounded-lg border border-border bg-secondary/40 px-4 py-3 font-mono text-xs leading-relaxed text-muted-foreground">
          {t.legal.disclaimer}
        </p>

        {/* Bottom row */}
        <div className="flex flex-col items-start justify-between gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-xs text-muted-foreground">{t.footer}</p>
          <div className="flex items-center gap-4 font-mono text-xs">
            <button
              type="button"
              onClick={() => openModal("terms")}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.legal.terms}
            </button>
            <span aria-hidden className="text-border">
              |
            </span>
            <button
              type="button"
              onClick={() => openModal("privacy")}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.legal.privacy}
            </button>
          </div>
        </div>
      </div>

      <LegalModal
        open={modal.open}
        tab={modal.tab}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        t={t}
      />
    </footer>
  )
}
