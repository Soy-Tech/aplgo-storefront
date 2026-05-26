import type { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/cuenta/LoginForm"

export const metadata: Metadata = {
  title: "Ingresar",
  description: "Accede a tu cuenta APL Go.",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16">
      { console.log("KEY:", process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY, process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL)}
      <div className="w-full max-w-sm">
        {/* Logo mark */}
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
            AG
          </span>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Bienvenido de vuelta
          </h1>
          <p className="text-sm text-muted-foreground">
            Ingresa a tu cuenta APL Go
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <LoginForm />
        </div>

        {/* Links */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="font-medium text-primary hover:underline">
            Registrarse
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          <Link
            href="/distribuidores"
            className="font-medium text-primary hover:underline"
          >
            Quiero ser distribuidor
          </Link>
        </p>
      </div>
    </div>
  )
}
