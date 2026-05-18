import Link from "next/link"
import type { HttpTypes } from "@medusajs/types"
import { CollectionBadge } from "./CollectionBadge"

interface ProductCardProps {
  product: HttpTypes.StoreProduct
}

// Fallback prices in case the API variant prices aren't populated
const FALLBACK_PRICE_USD: Record<string, number> = {
  diaria:  50,
  premier: 75,
  plus:    100,
}

type VariantWithPrices = HttpTypes.StoreProductVariant & {
  prices?: { amount: number; currency_code: string }[]
}

function LeafIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}

export function ProductCard({ product }: ProductCardProps) {
  const collectionHandle = product.collection?.handle ?? ""
  const variant = product.variants?.[0] as VariantWithPrices | undefined
  const apiPrice = variant?.prices?.find((p) => p.currency_code === "usd")?.amount
  const priceUsd = apiPrice != null
    ? apiPrice / 100
    : (FALLBACK_PRICE_USD[collectionHandle] ?? 0)
  const pv = (product.metadata?.pv_value as number | undefined) ?? 0

  return (
    <article className="group flex flex-col rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      {/* Placeholder image area */}
      <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-t-lg bg-gradient-to-br from-primary/5 via-background to-secondary/8">
        <div className="flex flex-col items-center gap-1.5 opacity-25 text-primary">
          <LeafIcon />
          <span className="text-[10px] font-semibold uppercase tracking-widest">APL Go</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Badges */}
        <div className="mb-3 flex items-center justify-between">
          <CollectionBadge handle={collectionHandle} />
          {pv > 0 && (
            <span className="inline-flex items-center rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
              {pv} PV
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-1 font-heading text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
          {product.title}
        </h3>

        {/* Price */}
        <p className="mb-3 flex items-baseline gap-1">
          <span className="text-2xl font-bold text-primary">${priceUsd}</span>
          <span className="text-sm text-muted-foreground">USD</span>
        </p>

        {/* Description */}
        <p className="mb-4 flex-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        {/* Disclaimer */}
        <p className="mb-4 text-[10px] italic text-muted-foreground">
          Suplemento alimenticio. No es un medicamento.
        </p>

        {/* CTA */}
        <Link
          href={`/producto/${product.handle}`}
          className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          Ver producto
        </Link>
      </div>
    </article>
  )
}
