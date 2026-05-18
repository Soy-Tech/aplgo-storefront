"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart/context"

export function CartCount() {
  const { count } = useCart()

  return (
    <Link
      href="/carrito"
      aria-label={`Carrito (${count} artículos)`}
      className="relative inline-flex items-center justify-center rounded-md p-2 text-foreground/70 transition-colors hover:text-primary"
    >
      <ShoppingCart className="size-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  )
}
