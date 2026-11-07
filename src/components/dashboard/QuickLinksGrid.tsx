import Link from "next/link";

interface QuickLinkCardProps {
  href: string;
  icon: string;
  title: string;
  text: string;
}

function QuickLinkCard({ href, icon, title, text }: QuickLinkCardProps) {
  return (
    <Link href={href} className="quick-link-card">
      <span className="quick-icon" aria-hidden="true">
        {icon}
      </span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
      <span className="arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}

export function QuickLinksGrid() {
  return (
    <section className="quick-links" aria-label="Accesos rápidos">
      <QuickLinkCard
        href="/salud"
        icon="♡"
        title="Salud y seguimiento"
        text="Signos vitales, notas y recetas médicas."
      />
      <QuickLinkCard
        href="/inventario"
        icon="□"
        title="Inventario"
        text="Medicamentos e insumos por debajo del mínimo."
      />
      <QuickLinkCard
        href="/residentes"
        icon="▱"
        title="Avisos a familiares"
        text="Mantén la comunicación cercana y clara."
      />
    </section>
  );
}
