/**
 * app/api/webhook/paypal/route.ts
 * Webhook handler para eventos de PayPal Business.
 * Ruta: POST /api/webhook/paypal
 *
 * Verifica firma mediante la API de PayPal (verify-webhook-signature),
 * que es el método oficial recomendado por PayPal — más robusto que HMAC manual
 * porque PayPal rota sus certificados de firma.
 *
 * SECURITY_RULES aplicadas:
 *   Rule 8:  PAYPAL_WEBHOOK_ID leído de variables de entorno; nunca hardcodeado.
 *   Rule 11: solo se logean IDs y tipos de evento; nunca el payload completo.
 *   Rule 12: no se almacenan ni procesan PAN, CVV ni datos de banda magnética.
 */

import { type NextRequest, NextResponse } from "next/server"
import { verifyPayPalWebhook } from "@/lib/payments/paypal"

export const dynamic = "force-dynamic"

const MAX_BODY_BYTES = 256 * 1024 // 256 KB

// ─── Deduplicación en memoria ────────────────────────────────────────────────
/**
 * NOTA DE ARQUITECTURA — Persistencia en producción:
 * Este Set deduplica dentro de la misma instancia serverless. En Vercel con
 * múltiples instancias, el Set se reinicia por instancia y NO garantiza
 * deduplicación global.
 *
 * Para producción, persiste el transmission_id en una tabla:
 *   CREATE TABLE paypal_webhook_events (
 *     transmission_id VARCHAR(255) PRIMARY KEY,
 *     event_type      VARCHAR(100) NOT NULL,
 *     processed_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
 *   );
 * Realiza INSERT ... ON CONFLICT DO NOTHING antes de procesar cada evento.
 * Añade la migración en aplgo-backend/apps/backend/src/modules/ cuando estés listo.
 */
const processedTransmissionIds = new Set<string>()

// ─── Tipos de payload de PayPal ──────────────────────────────────────────────

interface PayPalWebhookEvent {
  id: string
  event_type: string
  create_time: string
  resource?: Record<string, unknown>
}

// ─── Handler principal ───────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // ── 1. Leer el body raw (necesario para verificación de firma) ───────────
    const rawBuffer = await req.arrayBuffer()

    if (rawBuffer.byteLength > MAX_BODY_BYTES) {
      console.warn(`[webhook/paypal] payload demasiado grande: ${rawBuffer.byteLength} bytes`)
      return NextResponse.json({ error: "Payload demasiado grande" }, { status: 413 })
    }

    const rawBody = new TextDecoder().decode(rawBuffer)

    // ── 2. Extraer cabeceras de firma de PayPal ──────────────────────────────
    const transmissionId   = req.headers.get("paypal-transmission-id")
    const transmissionTime = req.headers.get("paypal-transmission-time")
    const certUrl          = req.headers.get("paypal-cert-url")
    const authAlgo         = req.headers.get("paypal-auth-algo")
    const transmissionSig  = req.headers.get("paypal-transmission-sig")

    if (!transmissionId || !transmissionTime || !certUrl || !authAlgo || !transmissionSig) {
      console.warn("[webhook/paypal] cabeceras de firma ausentes o incompletas")
      return NextResponse.json({ error: "Cabeceras de firma ausentes" }, { status: 401 })
    }

    // ── 3. Verificar firma mediante PayPal API ───────────────────────────────
    // Rule 8: verifyPayPalWebhook usa PAYPAL_WEBHOOK_ID del entorno.
    await verifyPayPalWebhook(
      { transmissionId, transmissionTime, certUrl, authAlgo, transmissionSig },
      rawBody
    )

    // ── 4. Parsear el payload ────────────────────────────────────────────────
    const event = JSON.parse(rawBody) as PayPalWebhookEvent

    // Rule 11: solo loguear IDs y tipo de evento, nunca el payload completo.
    console.log(
      `[webhook/paypal] id=${event.id} type=${event.event_type} ts=${event.create_time}`
    )

    // ── 5. Deduplicación por transmission_id ─────────────────────────────────
    if (processedTransmissionIds.has(transmissionId)) {
      console.info(`[webhook/paypal] evento duplicado ignorado: ${transmissionId}`)
      return NextResponse.json({ received: true, duplicate: true }, { status: 200 })
    }
    processedTransmissionIds.add(transmissionId)

    // ── 6. Enrutar el evento ─────────────────────────────────────────────────
    await routePayPalEvent(event)

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)

    if (message.includes("Firma inválida") || message.includes("verification_status")) {
      console.warn("[webhook/paypal] firma inválida rechazada")
      return NextResponse.json({ error: "Firma inválida" }, { status: 401 })
    }
    if (message.includes("PAYPAL_WEBHOOK_ID no configurado")) {
      console.error("[webhook/paypal] PAYPAL_WEBHOOK_ID ausente en el entorno")
      return NextResponse.json({ error: "Error de configuración del servidor" }, { status: 500 })
    }

    console.error("[webhook/paypal] error inesperado:", message)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

// ─── Router de eventos ───────────────────────────────────────────────────────

async function routePayPalEvent(event: PayPalWebhookEvent): Promise<void> {
  const resource = event.resource as {
    id?: string
    custom_id?: string
    amount?: { value?: string; currency_code?: string }
    status?: string
  } | undefined

  switch (event.event_type) {
    case "CHECKOUT.ORDER.APPROVED":
      // El cliente inicia la captura desde /api/paypal/capture-order tras la aprobación.
      console.log(`[webhook/paypal] order approved id=${event.id}`)
      break

    case "PAYMENT.CAPTURE.COMPLETED":
      console.log(
        `[webhook/paypal] capture completed` +
        ` capture_id=${resource?.id ?? "?"}` +
        ` medusa_cart_id=${resource?.custom_id ?? "n/a"}` +
        ` amount=${resource?.amount?.value ?? "?"} ${resource?.amount?.currency_code ?? ""}`
      )
      // TODO: marcar la orden como pagada en Medusa.
      // Usa resource.custom_id como medusa_cart_id para completar el carrito:
      //   POST ${MEDUSA_BACKEND_URL}/store/carts/${resource.custom_id}/complete
      break

    case "PAYMENT.CAPTURE.DENIED":
    case "PAYMENT.CAPTURE.REVERSED":
      console.warn(
        `[webhook/paypal] ${event.event_type}` +
        ` capture_id=${resource?.id ?? "?"}` +
        ` medusa_cart_id=${resource?.custom_id ?? "n/a"}`
      )
      // TODO: marcar la orden como fallida / revertida en Medusa.
      break

    case "PAYMENT.CAPTURE.REFUNDED":
      console.log(
        `[webhook/paypal] refunded capture_id=${resource?.id ?? "?"} cartId=${resource?.custom_id ?? "n/a"}`
      )
      // TODO: registrar el reembolso en Medusa.
      break

    default:
      // Rule 11: nunca loguear el payload completo — puede contener PII.
      console.log(`[webhook/paypal] evento no manejado: ${event.event_type}`)
  }
}
