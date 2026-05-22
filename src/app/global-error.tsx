"use client"

import * as Sentry from "@sentry/nextjs"
import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="es">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Algo salió mal
          </h1>
          <p className="text-gray-500">
            Ocurrió un error inesperado. Por favor intenta de nuevo.
          </p>
          <button
            onClick={reset}
            className="rounded-lg bg-[#0F5132] px-6 py-2 text-white hover:bg-[#198754] transition-colors"
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  )
}
