import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="mb-3 flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold tracking-tight">
                AG
              </span>
              <span className="font-heading text-lg font-bold text-primary">APL Go</span>
            </Link>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Suplementos alimenticios naturales de calidad. No somos médicos ni
              ofrecemos diagnósticos ni tratamientos.
            </p>
          </div>

          {/* Link columns */}
          <div className="flex gap-12 sm:gap-16">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">
                Tienda
              </p>
              <nav className="flex flex-col gap-2">
                <Link href="/catalogo" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Catálogo
                </Link>
                <Link href="/catalogo?coleccion=diaria" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Colección Diaria
                </Link>
                <Link href="/catalogo?coleccion=premier" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Colección Premier
                </Link>
                <Link href="/catalogo?coleccion=plus" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Colección Plus
                </Link>
              </nav>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">
                Empresa
              </p>
              <nav className="flex flex-col gap-2">
                <Link href="/distribuidores" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Distribuidores
                </Link>
                <Link href="/login" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Mi Cuenta
                </Link>
                <Link href="/registro" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Registrarse
                </Link>
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} APL Go. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground italic">
            Los productos no son medicamentos. Consulta a tu médico antes de consumirlos.
          </p>
        </div>
      </div>
    </footer>
  )
}
