import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Leaf, ShieldCheck, Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "APL Go — Suplementos Naturales",
  description:
    "15 suplementos alimenticios naturales en 3 colecciones. Cuida tu bienestar con APL Go.",
}

const COLLECTIONS = [
  {
    handle:      "diaria",
    name:        "Colección Diaria",
    price:       "$50 USD",
    pv:          "50 PV",
    products:    8,
    description: "Esenciales para el bienestar diario. Fórmulas naturales para apoyar tu vitalidad cada día.",
    badge:       "bg-primary/10 text-primary border-primary/20",
    cta:         "bg-primary/5 hover:bg-primary/10 text-primary border-primary/20",
    border:      "border-t-primary",
  },
  {
    handle:      "premier",
    name:        "Colección Premier",
    price:       "$75 USD",
    pv:          "75 PV",
    products:    5,
    description: "Fórmulas especializadas con mayor concentración para necesidades específicas de salud.",
    badge:       "bg-secondary/10 text-secondary border-secondary/20",
    cta:         "bg-secondary/5 hover:bg-secondary/10 text-secondary border-secondary/20",
    border:      "border-t-secondary",
  },
  {
    handle:      "plus",
    name:        "Colección Plus",
    price:       "$100 USD",
    pv:          "100 PV",
    products:    2,
    description: "Línea premium con los ingredientes más avanzados para rendimiento y resultados superiores.",
    badge:       "bg-accent/20 text-accent-foreground border-accent/30",
    cta:         "bg-accent/10 hover:bg-accent/20 text-accent-foreground border-accent/30",
    border:      "border-t-[oklch(0.74_0.17_78)]",
  },
] as const

const FEATURES = [
  {
    icon:  Leaf,
    title: "100% Naturales",
    desc:  "Ingredientes naturales seleccionados sin aditivos artificiales.",
  },
  {
    icon:  ShieldCheck,
    title: "Sin Claims Médicos",
    desc:  "Suplementos alimenticios. No son medicamentos ni tratamientos.",
  },
  {
    icon:  Zap,
    title: "Sistema PV",
    desc:  "Cada compra acumula Puntos de Valor para distribuidores activos.",
  },
] as const

export default function HomePage() {
  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        {/* Decorative circles */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary/5 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Disclaimer badge */}
            <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <Leaf className="size-3 text-primary" />
              Suplementos alimenticios · No son medicamentos
            </span>

            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Bienestar natural.{" "}
              <span className="text-primary">Desde adentro.</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              15 suplementos naturales en 3 colecciones diseñadas para apoyar
              tu vitalidad, concentración y bienestar general.
            </p>

            {/* Dual CTA */}
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/catalogo"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-7 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                Comprar ahora
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/distribuidores"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-card px-7 text-base font-semibold text-foreground transition-colors hover:bg-muted hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                Únete a la red
              </Link>
            </div>

            {/* Social proof strip */}
            <p className="mt-8 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">15 productos</span> ·{" "}
              <span className="font-semibold text-foreground">3 colecciones</span> ·{" "}
              envío a toda América Latina
            </p>
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Nuestras Colecciones
          </h2>
          <p className="mt-3 text-muted-foreground">
            Elige la colección que se adapta a tus objetivos y presupuesto
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {COLLECTIONS.map((col) => (
            <div
              key={col.handle}
              className={`flex flex-col rounded-xl border-t-4 border border-border bg-card p-6 transition-shadow hover:shadow-md ${col.border}`}
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    {col.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {col.products} productos
                  </p>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${col.badge}`}
                >
                  {col.pv}
                </span>
              </div>

              {/* Price */}
              <p className="mb-3 text-3xl font-bold text-foreground">
                {col.price}
              </p>

              {/* Description */}
              <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
                {col.description}
              </p>

              {/* CTA */}
              <Link
                href={`/catalogo?coleccion=${col.handle}`}
                className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border px-4 text-sm font-medium transition-colors ${col.cta}`}
              >
                Ver productos
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DISTRIBUTOR CTA ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-secondary px-8 py-14 text-center text-primary-foreground sm:px-16">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">
            ¿Quieres generar ingresos adicionales?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base opacity-90">
            Únete a la red de distribuidores de APL Go. Gana comisiones por cada
            venta y construye tu equipo a tu ritmo.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/distribuidores"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-7 text-base font-semibold text-primary transition-all hover:bg-white/90 hover:shadow-lg"
            >
              Conviértete en distribuidor
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/catalogo"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/30 px-7 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Ver catálogo primero
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
