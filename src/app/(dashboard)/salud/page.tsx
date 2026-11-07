import { EmptyState } from "@/components/ui/EmptyState";
import { Panel } from "@/components/ui/Panel";

export default function SaludPage() {
  return (
    <div className="module-page">
      <section className="welcome">
        <div>
          <p className="eyebrow">Módulo clínico</p>
          <h1 className="page-title">
            Salud y seguimiento <span aria-hidden="true">♡</span>
          </h1>
          <p className="subtitle">
            Control de signos vitales, bitácora de notas médicas y seguimiento
            de recetas activas por residente.
          </p>
        </div>
      </section>

      <Panel
        title="Expediente y monitoreo clínico"
        subtitle="Entidades vinculadas: signos_vitales, notas, recetas_medicas y receta_detalle"
        linkLabel="Volver al resumen"
        linkHref="/"
      >
        <EmptyState
          icon="♡"
          title="Módulo de Salud en preparación"
          description="Aquí se registrarán y consultarán los signos vitales, observaciones clínicas y prescripciones médicas de cada residente."
        />
      </Panel>
    </div>
  );
}

