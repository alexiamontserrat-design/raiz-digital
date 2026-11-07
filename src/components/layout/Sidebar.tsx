import { SidebarNav } from "./SidebarNav";

export function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Navegación principal">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          ✦
        </span>
        <div>
          <strong>Raíz</strong>
          <span>Digital</span>
        </div>
      </div>

      <SidebarNav />

      <div className="sidebar-bottom">
        <div className="help-card">
          <span className="help-icon" aria-hidden="true">
            ?
          </span>
          <div>
            <strong>¿Necesitas ayuda?</strong>
            <small>Consulta la guía del sistema</small>
          </div>
        </div>

        <div className="profile">
          <div className="avatar" aria-hidden="true">
            AM
          </div>
          <div>
            <strong>Administración</strong>
            <small>Personal de Raíz</small>
          </div>
          <span className="more" aria-hidden="true">
            ···
          </span>
        </div>
      </div>
    </aside>
  );
}
