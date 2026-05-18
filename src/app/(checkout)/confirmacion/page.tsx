import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Pedido confirmado",
  description: "Tu pedido ha sido recibido.",
}

interface Props {
  searchParams: Promise<{ order_id?: string; cart_id?: string }>
}

export default async function ConfirmacionPage({ searchParams }: Props) {
  const { order_id } = await searchParams

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
        <CheckCircle2 className="size-10" />
      </div>

      <h1 className="mt-6 font-heading text-3xl font-bold text-foreground">
        ¡Pedido confirmado!
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Gracias por tu compra. Recibirás un correo con los detalles.
      </p>

      {order_id && (
        <p className="mt-4 rounded-lg bg-muted px-4 py-2 text-xs font-mono text-muted-foreground">
          Orden: {order_id}
        </p>
      )}

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/mi-cuenta/pedidos"
          className="inline-flex h-10 items-center rounded-lg border border-border bg-card px-6 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Ver mis pedidos
        </Link>
        <Link
          href="/catalogo"
          className="inline-flex h-10 items-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  )
}
