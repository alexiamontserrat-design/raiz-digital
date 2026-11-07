import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { QuickLinksGrid } from "@/components/dashboard/QuickLinksGrid";
import { ResidentSummaryList } from "@/components/dashboard/ResidentSummaryList";
import { StatCard } from "@/components/ui/StatCard";
import { es } from "@/constants";
import { getDashboardOverview } from "@/services/dashboard.service";

export const dynamic = "force-dynamic";

const STAT_CARDS = [
  { key: "residents", label: "Residentes", icon: "♧", trend: "Total" },
  { key: "activities", label: "Actividades hoy", icon: "◷", trend: "Hoy" },
  { key: "alerts", label: "Alertas activas", icon: "!", trend: "Hoy" },
  { key: "stock", label: "Inventario bajo", icon: "□", trend: "Hoy" },
] as const;

export default async function Home() {
  const data = await getDashboardOverview();

  const values = {
    residents: data.stats.residentsTotal ?? data.residents.length,
    activities: data.stats.activities,
    alerts: data.stats.alerts,
    stock: data.stats.stock,
  };

  return (
    <>
      <section className="welcome">
        <div>
          <p className="eyebrow">{es.greeting}, equipo</p>
          <h1 className="page-title">
            {es.dashboard} <span aria-hidden="true">✦</span>
          </h1>
          <p className="subtitle">
            Todo lo importante para cuidar mejor, en un solo lugar.
          </p>
        </div>
        <button type="button" className="primary-button">
          + Registrar residente
        </button>
      </section>

      <section className="stats-grid" aria-label="Indicadores del día">
        {STAT_CARDS.map((card) => (
          <StatCard
            key={card.key}
            label={card.label}
            icon={card.icon}
            value={values[card.key]}
            trendLabel={card.trend}
          />
        ))}
      </section>

      <section className="content-grid">
        <ResidentSummaryList
          residents={data.residents}
          databaseStatus={data.database}
        />
        <ActivityTimeline />
      </section>

      <QuickLinksGrid />
    </>
  );
}
