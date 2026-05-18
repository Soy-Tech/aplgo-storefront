import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getProduct } from "@/lib/medusa/queries"
import { CollectionBadge } from "@/components/store/CollectionBadge"
import { AddToCartButton } from "@/components/store/AddToCartButton"
import type { HttpTypes } from "@medusajs/types"

type VariantWithPrices = HttpTypes.StoreProductVariant & {
  prices?: { amount: number; currency_code: string }[]
}

const FALLBACK_PRICE_USD: Record<string, number> = {
  diaria:  50,
  premier: 75,
  plus:    100,
}

interface Props {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  try {
    const product = await getProduct(handle)
    return {
      title: product.title,
      description: product.description ?? undefined,
    }
  } catch {
    return { title: "Producto" }
  }
}

function LeafIcon() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params

  let product: HttpTypes.StoreProduct
  try {
    product = await getProduct(handle)
  } catch {
    notFound()
  }

  if (!product) notFound()

  const collectionHandle = product.collection?.handle ?? ""
  const variant = product.variants?.[0] as VariantWithPrices | undefined
  const apiPrice = variant?.prices?.find((p) => p.currency_code === "usd")?.amount
  const priceUsd = apiPrice != null
    ? apiPrice / 100
    : (FALLBACK_PRICE_USD[collectionHandle] ?? 0)
  const pv = (product.metadata?.pv_value as number | undefined) ?? 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-1 hover:text-primary transition-colors"
        >
          <ChevronLeft className="size-3.5" />
          Catálogo
        </Link>
        {product.collection && (
          <>
            <span>/</span>
            <Link
              href={`/catalogo?coleccion=${collectionHandle}`}
              className="hover:text-primary transition-colors"
            >
              {product.collection.title}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-foreground">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Product image */}
        <div className="flex items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-secondary/8 p-12 lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-col items-center gap-3 opacity-20 text-primary">
            <LeafIcon />
            <span className="text-xs font-semibold uppercase tracking-widest">
              APL Go
            </span>
          </div>
        </div>

        {/* Product details */}
        <div className="flex flex-col">
          {/* Badges */}
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <CollectionBadge handle={collectionHandle} />
            {pv > 0 && (
              <span className="inline-flex items-center rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                {pv} PV
              </span>
            )}
            <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
              En stock
            </span>
          </div>

          {/* Title */}
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            {product.title}
          </h1>

          {/* Collection */}
          {product.collection && (
            <p className="mt-1 text-sm text-muted-foreground">
              {product.collection.title}
            </p>
          )}

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">${priceUsd}</span>
            <span className="text-lg text-muted-foreground">USD</span>
          </div>

          {/* Description */}
          <div className="mt-6 prose prose-sm max-w-none text-muted-foreground">
            <p className="leading-relaxed">{product.description}</p>
          </div>

          {/* SKU */}
          {variant?.sku && (
            <p className="mt-4 text-xs text-muted-foreground">
              SKU: <span className="font-mono">{variant.sku}</span>
            </p>
          )}

          {/* Add to cart */}
          <div className="mt-8">
            {variant ? (
              <AddToCartButton
                variantId={variant.id}
                productId={product.id}
                title={product.title ?? ""}
                variantTitle={variant.title ?? "Estándar"}
                priceUsd={priceUsd}
                pv={pv}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Producto no disponible actualmente.
              </p>
            )}
          </div>

          {/* Disclaimer */}
          <div className="mt-6 rounded-lg border border-border bg-muted/40 px-4 py-3">
            <p className="text-xs leading-relaxed text-muted-foreground">
              <strong className="font-semibold text-foreground">Aviso importante:</strong>{" "}
              Este producto es un suplemento alimenticio. No es un medicamento, no
              diagnostica, no trata ni previene enfermedades. Consulta a tu médico
              antes de consumirlo si tienes alguna condición de salud.
            </p>
          </div>

          {/* Back link */}
          <Link
            href="/catalogo"
            className="mt-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="size-4" />
            Volver al catálogo
          </Link>
        </div>
      </div>
    </div>
  )
}
