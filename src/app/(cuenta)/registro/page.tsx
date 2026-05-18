import type { Metadata } from "next"
import Link from "next/link"
import { RegisterForm } from "@/components/cuenta/RegisterForm"

export const metadata: Metadata = {
  title: "Registrarse",
  description: "Crea tu cuenta APL Go.",
}

export default function RegistroPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        {/* Logo mark */}
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
            AG
          </span>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Crea tu cuenta
          </h1>
          <p className="text-sm text-muted-foreground">
            Únete a APL Go hoy
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <RegisterForm />
        </div>

        {/* Links */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Ingresar
          </Link>
        </p>
      </div>
    </div>
  )
}
