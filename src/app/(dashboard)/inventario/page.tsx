import { EmptyState } from "@/components/ui/EmptyState";
import { Panel } from "@/components/ui/Panel";

export default function InventarioPage() {
  return (
    <div className="module-page">
      <section className="welcome">
        <div>
          <p className="eyebrow">Módulo de abastecimiento</p>
          <h1 className="page-title">
            Inventario <span aria-hidden="true">□</span>
          </h1>
          <p className="subtitle">
            Gestión de medicamentos e insumos por residente, fechas de caducidad
            y alertas por stock mínimo.
          </p>
        </div>
      </section>

      <Panel
        title="Control de medicamentos e insumos"
        subtitle="Entidades vinculadas: productos y alertas_reabastecimiento"
        linkLabel="Volver al resumen"
        linkHref="/"
      >
        <EmptyState
          icon="□"
          title="Módulo de Inventario en preparación"
          description="Esta vista permitirá administrar las existencias de productos por residente y atender las alertas activas de reabastecimiento."
        />
      </Panel>
    </div>
  );
}

