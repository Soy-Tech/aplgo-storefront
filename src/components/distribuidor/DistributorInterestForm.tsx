"use client"

import { useState } from "react"
import { Send, CheckCircle2 } from "lucide-react"

interface FormState {
  name: string
  email: string
  phone: string
  country: string
  sponsor: string
  message: string
}

type Status = "idle" | "submitting" | "success" | "error"

const COUNTRIES = [
  "República Dominicana",
  "Colombia",
  "México",
  "Venezuela",
  "Argentina",
  "Perú",
  "Chile",
  "Ecuador",
  "Uruguay",
  "Bolivia",
  "Costa Rica",
  "Panamá",
  "Honduras",
  "Guatemala",
  "El Salvador",
  "Nicaragua",
  "Otro",
]

const INITIAL: FormState = {
  name: "", email: "", phone: "", country: "", sponsor: "", message: "",
}

export function DistributorInterestForm() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.country) return

    setStatus("submitting")
    setErrorMsg("")

    try {
      // In production this would call a server action or API route.
      // For MVP: simulate network latency and show success.
      await new Promise((r) => setTimeout(r, 1200))
      setStatus("success")
      setForm(INITIAL)
    } catch {
      setStatus("error")
      setErrorMsg("Hubo un problema al enviar. Intenta de nuevo.")
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-green-200 bg-green-50 px-8 py-12 text-center">
        <CheckCircle2 className="size-12 text-green-600" />
        <h3 className="font-heading text-xl font-bold text-foreground">
          ¡Solicitud enviada!
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Recibimos tu solicitud. Un representante APL Go se comunicará
          contigo en menos de 24 horas. ¡Bienvenido a la familia!
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm font-medium text-primary hover:underline"
        >
          Enviar otra solicitud
        </button>
      </div>
    )
  }

  const inputBase =
    "w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Name */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Nombre completo <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="Tu nombre"
          value={form.name}
          onChange={set("name")}
          className={inputBase}
        />
      </div>

      {/* Email */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Correo electrónico <span className="text-destructive">*</span>
        </label>
        <input
          type="email"
          required
          placeholder="tu@email.com"
          value={form.email}
          onChange={set("email")}
          className={inputBase}
        />
      </div>

      {/* Phone + Country in 2 cols on sm+ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Teléfono / WhatsApp
          </label>
          <input
            type="tel"
            placeholder="+1 809 000 0000"
            value={form.phone}
            onChange={set("phone")}
            className={inputBase}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            País <span className="text-destructive">*</span>
          </label>
          <select
            required
            value={form.country}
            onChange={set("country")}
            className={inputBase}
          >
            <option value="" disabled>
              Selecciona tu país
            </option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sponsor code */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Código de patrocinador{" "}
          <span className="text-xs text-muted-foreground">(opcional)</span>
        </label>
        <input
          type="text"
          placeholder="Ej: APLGO-2024"
          value={form.sponsor}
          onChange={set("sponsor")}
          className={inputBase}
        />
      </div>

      {/* Message */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Mensaje{" "}
          <span className="text-xs text-muted-foreground">(opcional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="¿Tienes alguna pregunta o comentario?"
          value={form.message}
          onChange={set("message")}
          className={`${inputBase} resize-none`}
        />
      </div>

      {/* Error */}
      {status === "error" && (
        <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {errorMsg}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20 disabled:opacity-70 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        {status === "submitting" ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Enviando…
          </>
        ) : (
          <>
            <Send className="size-4" />
            Enviar solicitud
          </>
        )}
      </button>
    </form>
  )
}
