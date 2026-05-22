"use client"

import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart/context"
import { useState } from "react"
import { PayPalButton } from "@/components/checkout/PayPalButton"

export default function CarritoPage() {
  const { items, count, total, removeItem, updateQty, clearCart } = useCart()
  const [error, setError] = useState<string | null>(null)

  if (count === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <ShoppingBag className="size-9" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Tu carrito está vacío</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Agrega productos del catálogo para continuar.
          </p>
        </div>
        <Link
          href="/catalogo"
          className="inline-flex h-10 items-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Ver catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
        Tu carrito
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {count} {count === 1 ? "artículo" : "artículos"}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.variantId}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
            >
              {/* Placeholder thumbnail */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                AG
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.variantTitle}</p>
                {item.pv > 0 && (
                  <p className="mt-0.5 text-xs font-medium text-accent-foreground">
                    {item.pv} PV
                  </p>
                )}
              </div>

              {/* Qty controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateQty(item.variantId, item.quantity - 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted"
                  aria-label="Restar"
                >
                  <Minus className="size-3" />
                </button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQty(item.variantId, item.quantity + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted"
                  aria-label="Sumar"
                >
                  <Plus className="size-3" />
                </button>
              </div>

              {/* Line total */}
              <p className="w-20 text-right text-sm font-semibold text-foreground">
                ${(item.priceUsd * item.quantity).toFixed(0)} USD
              </p>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.variantId)}
                className="text-muted-foreground transition-colors hover:text-destructive"
                aria-label="Eliminar"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-xs text-muted-foreground underline-offset-2 hover:underline"
          >
            Vaciar carrito
          </button>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-semibold text-foreground">
              Resumen del pedido
            </h2>

            <div className="mt-4 space-y-2">
              {items.map((item) => (
                <div key={item.variantId} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.title} ×{item.quantity}
                  </span>
                  <span className="font-medium">${(item.priceUsd * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>

            <div className="my-4 border-t border-border" />

            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(0)} USD</span>
            </div>

            {error && (
              <p className="mt-3 text-xs text-destructive">{error}</p>
            )}

            <PayPalButton
              items={items.map((i) => ({
                variantId: i.variantId,
                title: i.title,
                priceUsd: i.priceUsd,
                quantity: i.quantity,
              }))}
              totalUsd={total}
              onError={(msg) => setError(msg ?? null)}
            />

            <Link
              href="/catalogo"
              className="mt-3 block text-center text-xs text-muted-foreground hover:text-primary"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
