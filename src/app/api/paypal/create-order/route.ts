/**
 * app/api/paypal/create-order/route.ts
 * Crea un carrito en Medusa y una orden en PayPal con el total del carrito.
 * Ruta: POST /api/paypal/create-order
 *
 * SECURITY_RULES aplicadas:
 *   Rule 8:  credenciales de PayPal y Medusa leídas de variables de entorno.
 *   Rule 11: mínimo de PII; no loguear datos del comprador.
 *   Rule 12: no procesar ni almacenar PAN, CVV ni datos de banda magnética.
 */

import { type NextRequest, NextResponse } from "next/server"
import { createPayPalOrder, type PayPalOrderItem } from "@/lib/payments/paypal"

export const dynamic = "force-dynamic"

interface CreateOrderBody {
  items: Array<{
    variantId: string
    title: string
    priceUsd: number
    quantity: number
  }>
  totalUsd: number
}

const MEDUSA_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000"
const MEDUSA_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ??
  process.env.MEDUSA_PUBLISHABLE_KEY ??
  ""

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as CreateOrderBody
    const { items, totalUsd } = body

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "El carrito no puede estar vacío" },
        { status: 400 }
      )
    }
    if (typeof totalUsd !== "number" || totalUsd <= 0) {
      return NextResponse.json(
        { error: "totalUsd inválido" },
        { status: 400 }
      )
    }

    // ── 1. Crear carrito en Medusa (no fatal si falla) ───────────────────────
    let medusaCartId: string | undefined
    try {
      const cartRes = await fetch(`${MEDUSA_URL}/store/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": MEDUSA_KEY,
        },
        body: JSON.stringify({
          items: items.map((i) => ({
            variant_id: i.variantId,
            quantity: i.quantity,
          })),
        }),
        cache: "no-store",
      })
      if (cartRes.ok) {
        const { cart } = (await cartRes.json()) as { cart: { id: string } }
        medusaCartId = cart.id
      } else {
        console.warn(
          `[paypal/create-order] Medusa cart failed status=${cartRes.status}`
        )
      }
    } catch (e) {
      // Rule 11: loguear solo el mensaje, no el objeto completo.
      console.warn(
        "[paypal/create-order] Medusa no disponible:",
        e instanceof Error ? e.message : String(e)
      )
    }

    // ── 2. Construir line items para PayPal ──────────────────────────────────
    const paypalItems: PayPalOrderItem[] = items.map((i) => ({
      name: i.title.slice(0, 127), // PayPal límite: 127 caracteres
      quantity: String(i.quantity),
      unit_amount: {
        currency_code: "USD",
        value: i.priceUsd.toFixed(2),
      },
    }))

    // ── 3. Crear orden en PayPal ─────────────────────────────────────────────
    const paypalOrderId = await createPayPalOrder(totalUsd, paypalItems, medusaCartId)

    return NextResponse.json({ paypalOrderId, medusaCartId })
  } catch (err) {
    console.error(
      "[paypal/create-order] error:",
      err instanceof Error ? err.message : String(err)
    )
    return NextResponse.json(
      { error: "No se pudo iniciar el pago. Intenta de nuevo." },
      { status: 500 }
    )
  }
}
