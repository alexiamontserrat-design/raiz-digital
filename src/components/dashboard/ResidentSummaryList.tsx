import { EmptyState } from "@/components/ui/EmptyState";
import { Panel } from "@/components/ui/Panel";
import { es } from "@/constants";
import { getInitials } from "@/lib/formatters";
import type {
  DatabaseStatus,
  ResidentDashboardItem,
} from "@/types/dashboard.types";

interface ResidentSummaryListProps {
  residents: ResidentDashboardItem[];
  loading?: boolean;
  databaseStatus?: DatabaseStatus;
}

export function ResidentSummaryList({
  residents,
  loading = false,
  databaseStatus,
}: ResidentSummaryListProps) {
  const isOffline = databaseStatus === "unavailable";
  const hasInternalError = databaseStatus === "error";

  return (
    <Panel
      id="residentes"
      title="Residentes"
      subtitle="Seguimiento general de las personas a tu cuidado"
      linkLabel="Ver todos"
      linkHref="/residentes"
    >
      {loading ? (
        <EmptyState
          icon="◷"
          title="Cargando residentes..."
          description="Consultando el padrón actual de residentes."
        />
      ) : isOffline ? (
        <EmptyState
          icon="♧"
          title={es.databaseOffline}
          description={es.emptyResidentsHint}
        />
      ) : hasInternalError ? (
        <EmptyState
          icon="!"
          title="Error al consultar residentes"
          description="Ocurrió un problema interno al procesar la consulta. Revisa los registros del servidor."
        />
      ) : residents.length === 0 ? (
        <EmptyState
          icon="♧"
          title={es.emptyResidents}
          description="Registra al primer residente para comenzar el seguimiento."
          actionLabel="Registrar primer residente"
        />
      ) : (
        <div className="resident-list">
          {residents.slice(0, 5).map((resident) => (
            <div className="resident-row" key={resident.id_residente}>
              <div className="resident-avatar" aria-hidden="true">
                {getInitials(resident.nombre)}
              </div>
              <div>
                <strong>{resident.nombre}</strong>
                <small>
                  Habitación {resident.habitacion ?? "—"} ·{" "}
                  {resident.edad ?? "—"} años
                </small>
              </div>
              <span className="status-pill">
                Hab. {resident.habitacion ?? "Asignada"}
              </span>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}
