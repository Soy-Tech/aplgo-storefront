import type { Metadata } from "next"
import Link from "next/link"
import { Package, User, LogOut } from "lucide-react"

export const metadata: Metadata = {
  title: "Mi cuenta",
  description: "Gestiona tu cuenta y revisa tu historial de pedidos.",
}

export default function MiCuentaPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User className="size-6" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Mi cuenta</h1>
          <p className="text-sm text-muted-foreground">Bienvenido de vuelta</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Orders */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-3 flex items-center gap-2 text-primary">
            <Package className="size-5" />
            <h2 className="font-semibold">Mis pedidos</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Revisa el estado y el historial de tus órdenes.
          </p>
          <Link
            href="/mi-cuenta/pedidos"
            className="mt-4 inline-flex h-9 items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Ver pedidos
          </Link>
        </div>

        {/* Profile */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-3 flex items-center gap-2 text-primary">
            <User className="size-5" />
            <h2 className="font-semibold">Mis datos</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Actualiza tu información personal y contraseña.
          </p>
          <Link
            href="/mi-cuenta/perfil"
            className="mt-4 inline-flex h-9 items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Editar perfil
          </Link>
        </div>
      </div>

      {/* Logout */}
      <div className="mt-8 flex justify-end">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-destructive"
        >
          <LogOut className="size-4" />
          Cerrar sesión
        </Link>
      </div>
    </div>
  )
}
