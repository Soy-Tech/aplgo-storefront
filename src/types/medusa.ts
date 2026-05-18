import type { HttpTypes } from "@medusajs/types"

export type CustomerRole = "customer" | "distribuidor"

export type CustomerWithRole = HttpTypes.StoreCustomer & {
  metadata: {
    role: CustomerRole
    [key: string]: unknown
  }
}

export type ProductWithPV = HttpTypes.StoreProduct & {
  metadata: {
    pv_value: number
    [key: string]: unknown
  }
}

export type CollectionWithPrice = HttpTypes.StoreCollection & {
  metadata: {
    price: number
    [key: string]: unknown
  }
}

// Collection handles map to display names
export const COLLECTION_HANDLES = {
  diaria: "Colección Diaria",
  premier: "Colección Premier",
  plus: "Colección Plus",
} as const

export type CollectionHandle = keyof typeof COLLECTION_HANDLES
