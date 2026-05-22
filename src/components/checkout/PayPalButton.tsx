"use client"

/**
 * components/checkout/PayPalButton.tsx
 * Botón de pago PayPal con overlay popup.
 * Usa @paypal/react-paypal-js para renderizar los botones oficiales de PayPal.
 *
 * SECURITY_RULES aplicadas:
 *   Rule 8:  NEXT_PUBLIC_PAYPAL_CLIENT_ID leído de variables de entorno.
 *   Rule 11: no se envía ni almacena información personal del comprador.
 *   Rule 12: no se procesa PAN ni CVV — PayPal maneja todos los datos de pago.
 */

import { useState } from "react"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart/context"

interface CartItemPayload {
  variantId: string
  title: string
  priceUsd: number
  quantity: number
}

interface Props {
  items: CartItemPayload[]
  totalUsd: number
  onError?: (message: string) => void
}

export function PayPalButton({ items, totalUsd, onError }: Props) {
  const router = useRouter()
  const { clearCart } = useCart()
  const [processing, setProcessing] = useState(false)

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

  if (!clientId) {
    return (
      <p className="mt-4 text-xs text-destructive">
        PayPal no está configurado. Contacta al soporte.
      </p>
    )
  }

  return (
    <div className="mt-4">
      {processing && (
        <p className="mb-2 text-center text-xs text-muted-foreground">
          Procesando pago…
        </p>
      )}

      <PayPalScriptProvider
        options={{
          clientId,
          currency: "USD",
          locale: "es_DO",
          intent: "capture",
        }}
      >
        <PayPalButtons
          style={{
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "pay",
            height: 44,
          }}
          disabled={processing}
          forceReRender={[totalUsd]}
          createOrder={async () => {
            setProcessing(true)
            onError?.(undefined as unknown as string) // limpiar error previo

            const res = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ items, totalUsd }),
            })

            if (!res.ok) {
              const data = (await res.json()) as { error?: string }
              setProcessing(false)
              const msg = data.error ?? "No se pudo iniciar el pago"
              onError?.(msg)
              throw new Error(msg)
            }

            const { paypalOrderId } = (await res.json()) as { paypalOrderId: string }
            return paypalOrderId
          }}
          onApprove={async (data) => {
            const res = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paypalOrderId: data.orderID }),
            })

            if (!res.ok) {
              const errData = (await res.json()) as { error?: string }
              setProcessing(false)
              onError?.(errData.error ?? "Error al confirmar el pago")
              return
            }

            const { orderId } = (await res.json()) as { orderId: string }
            clearCart()
            router.push(`/confirmacion?order_id=${orderId}`)
          }}
          onCancel={() => {
            setProcessing(false)
          }}
          onError={(err) => {
            setProcessing(false)
            console.error("[PayPalButton] SDK error:", err)
            onError?.("Ocurrió un error en el proceso de pago. Por favor intenta de nuevo.")
          }}
        />
      </PayPalScriptProvider>

      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        Pago seguro procesado por PayPal.
      </p>
    </div>
  )
}
