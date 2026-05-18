import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CheckCircle2, TrendingUp, Users, Zap } from "lucide-react"
import { DistributorInterestForm } from "@/components/distribuidor/DistributorInterestForm"

export const metadata: Metadata = {
  title: "Distribuidores",
  description:
    "Únete a la red de distribuidores de APL Go. Vende suplementos naturales y genera ingresos adicionales desde casa.",
}

const BENEFITS = [
  {
    icon: TrendingUp,
    title: "Ingresos en USD",
    desc: "Gana comisiones por cada venta directa en dólares estadounidenses.",
  },
  {
    icon: Users,
    title: "Red de apoyo",
    desc: "Accede a materiales de capacitación y apoyo de tu equipo APL Go.",
  },
  {
    icon: Zap,
    title: "Sistema PV",
    desc: "Acumula Puntos de Valor con cada compra y monitorea tu progreso.",
  },
  {
    icon: CheckCircle2,
    title: "Productos reales",
    desc: "Vende 15 suplementos naturales respaldados por formulaciones de calidad.",
  },
] as const

const STEPS = [
  { step: "01", title: "Regístrate",    desc: "Crea tu cuenta y selecciona tu código de referido." },
  { step: "02", title: "Actívate",      desc: "Realiza tu primera compra para activar tu cuenta de distribuidor." },
  { step: "03", title: "Comparte",      desc: "Comparte tu link único y lleva clientes a tu tienda APL Go." },
  { step: "04", title: "Gana",          desc: "Recibe comisiones directamente en USD cada período." },
] as const

export default function DistribuidoresPage() {
  return (
    <>
      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              Oportunidad de negocio
            </span>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Construye tu negocio con{" "}
              <span className="text-primary">APL Go</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Vende suplementos naturales de calidad y genera ingresos adicionales
              en USD. Tú pones el ritmo, nosotros ponemos los productos.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href="#formulario"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-7 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
              >
                Quiero ser distribuidor
                <ArrowRight className="size-4" />
              </a>
              <Link
                href="/catalogo"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-card px-7 text-base font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Ver los productos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            ¿Por qué unirte a APL Go?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Un modelo de negocio simple con productos naturales que las personas
            necesitan
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-sm"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="size-5 text-primary" />
              </div>
              <h3 className="mb-2 font-heading text-sm font-bold text-foreground">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Cómo funciona
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {step}
                </span>
                <h3 className="mb-2 font-heading text-base font-bold text-foreground">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTEREST FORM ───────────────────────────────────────────────────── */}
      <section id="formulario" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              ¡Quiero ser distribuidor!
            </h2>
            <p className="mt-3 text-muted-foreground">
              Déjanos tus datos y un representante APL Go se comunicará contigo en
              menos de 24 horas.
            </p>
          </div>
          <DistributorInterestForm />
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Al enviar este formulario aceptas que nos comuniquemos contigo para
            brindarte información sobre la oportunidad de negocio APL Go.
          </p>
        </div>
      </section>
    </>
  )
}
