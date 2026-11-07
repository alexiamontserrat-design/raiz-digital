import { EmptyState } from "@/components/ui/EmptyState";
import { Panel } from "@/components/ui/Panel";

export default function ActividadesPage() {
  return (
    <div className="module-page">
      <section className="welcome">
        <div>
          <p className="eyebrow">Módulo de agenda</p>
          <h1 className="page-title">
            Actividades <span aria-hidden="true">◷</span>
          </h1>
          <p className="subtitle">
            Programación diaria de cuidados, rutinas y seguimiento de estados de
            atención por enfermero y residente.
          </p>
        </div>
      </section>

      <Panel
        title="Agenda de actividades y cuidados"
        subtitle="Entidad vinculada: actividades (pendiente, confirmado, rechazado)"
        linkLabel="Volver al resumen"
        linkHref="/"
      >
        <EmptyState
          icon="◷"
          title="Módulo de Actividades en preparación"
          description="Aquí se gestionará el calendario diario de actividades, asignación de personal de enfermería y confirmación de tareas."
        />
      </Panel>
    </div>
  );
}

