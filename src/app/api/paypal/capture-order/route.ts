/**
 * app/api/paypal/capture-order/route.ts
 * Captura el pago de una orden PayPal aprobada por el usuario.
 * Ruta: POST /api/paypal/capture-order
 *
 * SECURITY_RULES aplicadas:
 *   Rule 8:  credenciales leídas de variables de entorno.
 *   Rule 11: no se expone email del pagador en la respuesta al cliente.
 *   Rule 12: no se almacenan ni transmiten PAN, CVV ni datos de banda magnética.
 */

import { type NextRequest, NextResponse } from "next/server"
import { capturePayPalOrder } from "@/lib/payments/paypal"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { paypalOrderId } = (await req.json()) as { paypalOrderId: string }

    if (!paypalOrderId || typeof paypalOrderId !== "string") {
      return NextResponse.json(
        { error: "paypalOrderId es requerido" },
        { status: 400 }
      )
    }

    const result = await capturePayPalOrder(paypalOrderId)

    if (result.status !== "COMPLETED") {
      return NextResponse.json(
        { error: `Pago no completado. Estado: ${result.status}` },
        { status: 402 }
      )
    }

    // TODO: completar la orden en Medusa una vez que tengas configurado
    // el payment provider de PayPal en el backend:
    //   POST ${MEDUSA_URL}/store/carts/${result.medusaCartId}/complete
    // Por ahora el webhook PAYMENT.CAPTURE.COMPLETED es la fuente de verdad.

    // Rule 11: no devolver email del pagador al cliente.
    return NextResponse.json({
      orderId: result.orderId,
      status: result.status,
    })
  } catch (err) {
    console.error(
      "[paypal/capture-order] error:",
      err instanceof Error ? err.message : String(err)
    )
    return NextResponse.json(
      { error: "Error al procesar el pago. Contacta soporte si el cargo fue realizado." },
      { status: 500 }
    )
  }
}
