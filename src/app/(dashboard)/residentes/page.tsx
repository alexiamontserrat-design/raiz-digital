import { EmptyState } from "@/components/ui/EmptyState";
import { Panel } from "@/components/ui/Panel";

export default function ResidentesPage() {
  return (
    <div className="module-page">
      <section className="welcome">
        <div>
          <p className="eyebrow">Módulo operativo</p>
          <h1 className="page-title">
            Residentes <span aria-hidden="true">♧</span>
          </h1>
          <p className="subtitle">
            Administración del padrón de residentes, asignación de habitaciones,
            familiares responsables y avisos.
          </p>
        </div>
      </section>

      <Panel
        title="Padrón de residentes"
        subtitle="Entidades vinculadas: residentes, familiares y avisos"
        linkLabel="Volver al resumen"
        linkHref="/"
      >
        <EmptyState
          icon="♧"
          title="Módulo de Residentes en preparación"
          description="Esta sección alojará el directorio completo de residentes, su perfil de ingreso, contacto familiar y envío de avisos."
        />
      </Panel>
    </div>
  );
}

