/**
 * lib/payments/errors.ts
 * Tipos de error de dominio para la capa de pagos (PayPal).
 *
 * SECURITY_RULES aplicadas:
 *   Rule 11: solo propaga IDs y códigos; nunca datos personales ni de tarjeta.
 *   Rule 12: no almacena ni expone PAN, CVV ni datos de banda magnética.
 */

// ─── Códigos canónicos ───────────────────────────────────────────────────────

export type PaymentErrorCode =
  | "INVALID_SIGNATURE"         // firma inválida en webhook
  | "DUPLICATE_EVENT"           // evento ya procesado (deduplicación)
  | "MISSING_ENV"               // variable de entorno requerida ausente
  | "ORDER_CREATION_FAILED"     // no se pudo crear la orden en PayPal
  | "CAPTURE_FAILED"            // no se pudo capturar el pago
  | "WEBHOOK_VERIFY_FAILED"     // fallo al verificar firma con PayPal API
  | "UNKNOWN"

// ─── Clase base ─────────────────────────────────────────────────────────────

export class PaymentError extends Error {
  public readonly code: PaymentErrorCode

  constructor(code: PaymentErrorCode, message: string) {
    super(message)
    this.name = "PaymentError"
    this.code = code
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PaymentError)
    }
  }
}

// ─── Helpers de construcción ─────────────────────────────────────────────────

export function invalidSignatureError(): PaymentError {
  return new PaymentError("INVALID_SIGNATURE", "Firma inválida en el payload del webhook.")
}

export function duplicateEventError(eventId: string): PaymentError {
  return new PaymentError("DUPLICATE_EVENT", `Evento duplicado ignorado: ${eventId}`)
}

export function missingEnvError(varName: string): PaymentError {
  return new PaymentError("MISSING_ENV", `Variable de entorno requerida ausente: ${varName}`)
}

export function orderCreationFailedError(reason: string): PaymentError {
  return new PaymentError("ORDER_CREATION_FAILED", `No se pudo crear la orden: ${reason}`)
}

export function captureFailedError(reason: string): PaymentError {
  return new PaymentError("CAPTURE_FAILED", `No se pudo capturar el pago: ${reason}`)
}

export function webhookVerifyFailedError(reason: string): PaymentError {
  return new PaymentError("WEBHOOK_VERIFY_FAILED", `Verificación de webhook fallida: ${reason}`)
}
