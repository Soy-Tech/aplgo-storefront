/**
 * lib/payments/paypal.ts
 * Utilidades server-side para PayPal REST API v2 (Orders API).
 * Solo se ejecuta en el servidor (Next.js App Router / Route Handlers).
 *
 * SECURITY_RULES aplicadas:
 *   Rule 8:  credenciales leídas de variables de entorno; nunca hardcodeadas.
 *   Rule 11: mínimo de PII; nunca loguear payloads completos ni emails.
 *   Rule 12: no almacenar ni transmitir PAN, CVV ni datos de banda magnética.
 */

const PAYPAL_BASE =
  process.env.PAYPAL_ENVIRONMENT === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com"

// ─── Access Token OAuth 2.0 ──────────────────────────────────────────────────

export async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId) throw new Error("NEXT_PUBLIC_PAYPAL_CLIENT_ID no configurado")
  if (!clientSecret) throw new Error("PAYPAL_CLIENT_SECRET no configurado")

  // Rule 8: credenciales en Basic Auth; nunca en el body ni en logs.
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  })

  if (!res.ok) {
    // Rule 11: no loguear el body — puede contener información de credenciales.
    throw new Error(`PayPal token request failed: ${res.status}`)
  }

  const json = (await res.json()) as { access_token: string }
  return json.access_token
}

// ─── Crear orden ─────────────────────────────────────────────────────────────

export interface PayPalOrderItem {
  name: string
  quantity: string
  unit_amount: { currency_code: string; value: string }
}

export async function createPayPalOrder(
  amountUSD: number,
  items: PayPalOrderItem[],
  medusaCartId?: string
): Promise<string> {
  const accessToken = await getPayPalAccessToken()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

  const body = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: amountUSD.toFixed(2),
          breakdown: {
            item_total: { currency_code: "USD", value: amountUSD.toFixed(2) },
          },
        },
        items,
        // Usamos custom_id para pasar el cart_id de Medusa al webhook.
        ...(medusaCartId ? { custom_id: medusaCartId } : {}),
      },
    ],
    payment_source: {
      paypal: {
        experience_context: {
          payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
          brand_name: "APL Go",
          locale: "es-DO",
          landing_page: "LOGIN",
          user_action: "PAY_NOW",
          return_url: `${appUrl}/confirmacion`,
          cancel_url: `${appUrl}/carrito`,
        },
      },
    },
  }

  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  })

  if (!res.ok) {
    // Rule 11: solo loguear el código de status.
    console.error(`[paypal] create-order failed status=${res.status}`)
    throw new Error(`PayPal create-order failed: ${res.status}`)
  }

  const json = (await res.json()) as { id: string }
  return json.id
}

// ─── Capturar orden ──────────────────────────────────────────────────────────

export interface PayPalCaptureResult {
  orderId: string
  status: string
  medusaCartId?: string
}

export async function capturePayPalOrder(
  paypalOrderId: string
): Promise<PayPalCaptureResult> {
  const accessToken = await getPayPalAccessToken()

  const res = await fetch(
    `${PAYPAL_BASE}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  )

  if (!res.ok) {
    console.error(
      `[paypal] capture-order failed status=${res.status} orderId=${paypalOrderId}`
    )
    throw new Error(`PayPal capture failed: ${res.status}`)
  }

  const json = (await res.json()) as {
    id: string
    status: string
    purchase_units?: Array<{ custom_id?: string }>
  }

  const medusaCartId = json.purchase_units?.[0]?.custom_id

  // Rule 11: solo loguear IDs y estado, nunca email del pagador.
  console.log(
    `[paypal] captured orderId=${json.id} status=${json.status} cartId=${medusaCartId ?? "n/a"}`
  )

  return { orderId: json.id, status: json.status, medusaCartId }
}

// ─── Verificar firma del webhook via PayPal API ──────────────────────────────

export interface PayPalWebhookHeaders {
  transmissionId: string
  transmissionTime: string
  certUrl: string
  authAlgo: string
  transmissionSig: string
}

export async function verifyPayPalWebhook(
  headers: PayPalWebhookHeaders,
  rawBody: string
): Promise<void> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID
  if (!webhookId) throw new Error("PAYPAL_WEBHOOK_ID no configurado")

  const accessToken = await getPayPalAccessToken()

  const verifyPayload = {
    auth_algo: headers.authAlgo,
    cert_url: headers.certUrl,
    transmission_id: headers.transmissionId,
    transmission_sig: headers.transmissionSig,
    transmission_time: headers.transmissionTime,
    webhook_id: webhookId,
    webhook_event: JSON.parse(rawBody) as Record<string, unknown>,
  }

  const res = await fetch(
    `${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(verifyPayload),
      cache: "no-store",
    }
  )

  if (!res.ok) {
    console.error(`[paypal] webhook verify request failed status=${res.status}`)
    throw new Error(`PayPal webhook verify request failed: ${res.status}`)
  }

  const json = (await res.json()) as { verification_status: string }

  if (json.verification_status !== "SUCCESS") {
    throw new Error(`Firma inválida: verification_status=${json.verification_status}`)
  }
}
