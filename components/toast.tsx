"use client"

import { useEffect } from "react"
import { AlertTriangle, X } from "lucide-react"

export function Toast({
  message,
  onClose,
  duration = 6000,
}: {
  message: string
  onClose: () => void
  duration?: number
}) {
  useEffect(() => {
    const id = setTimeout(onClose, duration)
    return () => clearTimeout(id)
  }, [onClose, duration])

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 animate-in slide-in-from-bottom-4"
    >
      <div className="flex items-start gap-3 rounded-xl border border-warn/40 bg-card px-4 py-3 shadow-2xl">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warn" />
        <p className="flex-1 font-mono text-xs leading-relaxed text-foreground">{message}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-md p-0.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}
