"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { medusa } from "@/lib/medusa/client"

type Status = "idle" | "loading" | "error"

export function RegisterForm() {
  const router = useRouter()
  const [firstName, setFirstName]   = useState("")
  const [lastName, setLastName]     = useState("")
  const [email, setEmail]           = useState("")
  const [password, setPassword]     = useState("")
  const [showPw, setShowPw]         = useState(false)
  const [status, setStatus]         = useState<Status>("idle")
  const [error, setError]           = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    setError("")

    try {
      // 1. Create auth identity — returns a one-time registration token
      const token = await medusa.auth.register("customer", "emailpass", {
        email,
        password,
      })

      // 2. Create the customer profile using the registration token
      await medusa.store.customer.create(
        { email, first_name: firstName, last_name: lastName },
        {},
        { Authorization: `Bearer ${token}` }
      )

      // 3. Log in to start a session
      await medusa.auth.login("customer", "emailpass", { email, password })

      router.push("/mi-cuenta")
      router.refresh()
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : String(err)
      const lower = raw.toLowerCase()
      const msg = lower.includes("exists") || lower.includes("already")
        ? "Ya existe una cuenta con ese correo. ¿Quieres ingresar?"
        : lower.includes("unauthorized") || lower.includes("401")
        ? "No se pudo crear la cuenta. Verifica tus datos e intenta de nuevo."
        : lower.includes("password")
        ? "La contraseña no cumple los requisitos mínimos."
        : "Hubo un problema al crear tu cuenta. Intenta de nuevo."
      setError(msg)
      setStatus("error")
    }
  }

  const inputBase =
    "w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Nombre
          </label>
          <input
            type="text"
            required
            autoComplete="given-name"
            placeholder="Juan"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputBase}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Apellido
          </label>
          <input
            type="text"
            required
            autoComplete="family-name"
            placeholder="Pérez"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={inputBase}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Correo electrónico
        </label>
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputBase}
        />
      </div>

      {/* Password */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Contraseña
        </label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputBase} pr-10`}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Mínimo 8 caracteres</p>
      </div>

      {/* Error */}
      {status === "error" && (
        <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Disclaimer */}
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Al registrarte aceptas nuestros términos de servicio. Los suplementos
        APL Go no son medicamentos y no reemplazan tratamientos médicos.
      </p>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-70 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Creando cuenta…
          </>
        ) : (
          "Crear cuenta"
        )}
      </button>
    </form>
  )
}
