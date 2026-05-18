"use client"

import { useState } from "react"
import { ShoppingCart, Check, Loader2 } from "lucide-react"
import { useCart } from "@/lib/cart/context"

interface AddToCartButtonProps {
  variantId: string
  productId: string
  title: string
  variantTitle: string
  priceUsd: number
  pv: number
  className?: string
}

type State = "idle" | "loading" | "added"

export function AddToCartButton({
  variantId,
  productId,
  title,
  variantTitle,
  priceUsd,
  pv,
  className = "",
}: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [state, setState] = useState<State>("idle")

  async function handleClick() {
    if (state !== "idle") return
    setState("loading")

    // Small artificial delay for UX feedback
    await new Promise((r) => setTimeout(r, 300))

    addItem({ variantId, productId, title, variantTitle, priceUsd, pv })
    setState("added")

    setTimeout(() => setState("idle"), 2000)
  }

  const base =
    "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50"

  if (state === "added") {
    return (
      <button disabled className={`${base} bg-green-600 text-white ${className}`}>
        <Check className="size-4" />
        Añadido al carrito
      </button>
    )
  }

  if (state === "loading") {
    return (
      <button disabled className={`${base} bg-primary text-primary-foreground ${className}`}>
        <Loader2 className="size-4 animate-spin" />
        Añadiendo…
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={`${base} bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20 ${className}`}
    >
      <ShoppingCart className="size-4" />
      Añadir al carrito
    </button>
  )
}
