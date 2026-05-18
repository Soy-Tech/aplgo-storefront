import type { Metadata } from "next"
import Link from "next/link"
import { listCollections, listProducts } from "@/lib/medusa/queries"
import { ProductCard } from "@/components/store/ProductCard"

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Explora los 15 suplementos naturales de APL Go en tres colecciones: Diaria ($50), Premier ($75) y Plus ($100).",
}

const COLLECTION_ORDER = ["diaria", "premier", "plus"] as const

const COLLECTION_PRICE: Record<string, string> = {
  diaria:  "$50",
  premier: "$75",
  plus:    "$100",
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ coleccion?: string }>
}) {
  const { coleccion } = await searchParams

  const [collections, products] = await Promise.all([
    listCollections(),
    listProducts(),
  ])

  const APL_GO_HANDLES = new Set(COLLECTION_ORDER)

  // Only APL Go collections — guards against Medusa demo data
  const aplProducts = products.filter((p) =>
    APL_GO_HANDLES.has((p.collection?.handle ?? "") as typeof COLLECTION_ORDER[number])
  )

  const sortedCollections = [...collections]
    .filter((c) => APL_GO_HANDLES.has((c.handle ?? "") as typeof COLLECTION_ORDER[number]))
    .sort(
      (a, b) =>
        COLLECTION_ORDER.indexOf((a.handle ?? "") as typeof COLLECTION_ORDER[number]) -
        COLLECTION_ORDER.indexOf((b.handle ?? "") as typeof COLLECTION_ORDER[number])
    )

  const filtered = coleccion
    ? aplProducts.filter((p) => p.collection?.handle === coleccion)
    : aplProducts

  const sorted = [...filtered].sort((a, b) => {
    const ai = COLLECTION_ORDER.indexOf((a.collection?.handle ?? "") as typeof COLLECTION_ORDER[number])
    const bi = COLLECTION_ORDER.indexOf((b.collection?.handle ?? "") as typeof COLLECTION_ORDER[number])
    return ai - bi
  })

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-10 text-center">
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Catálogo de Productos
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          {sorted.length} suplemento{sorted.length !== 1 ? "s" : ""} natural
          {sorted.length !== 1 ? "es" : ""} para tu bienestar
        </p>
      </div>

      {/* Collection filter tabs */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        <Link
          href="/catalogo"
          className={[
            "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            !coleccion
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-muted/70",
          ].join(" ")}
        >
          Todos
          <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold">
            {aplProducts.length}
          </span>
        </Link>

        {sortedCollections.map((col) => {
          const active = coleccion === col.handle
          const count = products.filter((p) => p.collection?.handle === col.handle).length
          const price = COLLECTION_PRICE[col.handle ?? ""] ?? ""

          return (
            <Link
              key={col.id}
              href={`/catalogo?coleccion=${col.handle}`}
              className={[
                "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/70",
              ].join(" ")}
            >
              {col.title}
              <span className={[
                "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                active ? "bg-white/20" : "bg-background",
              ].join(" ")}>
                {price} · {count}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Products grid */}
      {sorted.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-muted-foreground">
            No se encontraron productos en esta colección.
          </p>
          <Link
            href="/catalogo"
            className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            Ver todos los productos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
