"use client";

import Image from "next/image";
import Link from "next/link";
import {
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import { SidebarNav } from "./SidebarNav";
import { useSidebar } from "./SidebarContext";

export function Sidebar() {
  const { isCollapsed, isMobileOpen, toggleCollapse, closeMobile } = useSidebar();

  return (
    <>
      {/* Overlay oscuro para drawer móvil */}
      <div
        className={`sidebar-overlay ${isMobileOpen ? "open" : ""}`}
        onClick={closeMobile}
        aria-hidden="true"
      />

      <aside
        id="app-sidebar"
        className={`sidebar ${isCollapsed ? "collapsed" : ""} ${
          isMobileOpen ? "mobile-open" : ""
        }`}
        aria-label="Navegación principal"
      >
        <div className="sidebar-header">
          {/* Botón de cerrar (X) solo en móvil */}
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={closeMobile}
            aria-label="Cerrar menú lateral"
            title="Cerrar menú"
          >
            <X size={20} strokeWidth={2} />
          </button>

          <div className="brand">
            <Link
              href="/"
              className="brand-link"
              aria-label="Ir al resumen de Raíz Digital"
              onClick={closeMobile}
            >
              <div className="brand-logo-wrap">
                <Image
                  src="/Logo-Raíz-Digital-Layout.svg"
                  alt="Raíz Digital"
                  width={185}
                  height={172}
                  priority
                  className="brand-logo"
                />
              </div>
              <span className="brand-fallback-mark" aria-hidden="true">
                RD
              </span>
            </Link>
          </div>

          {/* Botón expandir/contraer solo en escritorio */}
          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={toggleCollapse}
            aria-label={
              isCollapsed
                ? "Expandir barra lateral"
                : "Contraer barra lateral"
            }
            aria-expanded={!isCollapsed}
            aria-controls="app-sidebar"
            title={
              isCollapsed
                ? "Expandir barra lateral"
                : "Contraer barra lateral"
            }
          >
            {isCollapsed ? (
              <PanelLeftOpen size={18} strokeWidth={2} />
            ) : (
              <PanelLeftClose size={18} strokeWidth={2} />
            )}
          </button>
        </div>

        {/* Zona desplazable que aloja únicamente la navegación */}
        <div className="sidebar-scrollable">
          <SidebarNav />
        </div>

        {/* Sección inferior anclada fija (nunca se desplaza ni se oculta por contenido) */}
        <div className="sidebar-bottom">
          <div className="sidebar-divider" aria-hidden="true" />
          <button
            type="button"
            className="nav-item nav-item-logout"
            disabled
            aria-disabled="true"
            title="El cierre de sesión estará disponible cuando se integre la autenticación."
          >
            <span className="nav-icon" aria-hidden="true">
              <LogOut size={22} strokeWidth={2} />
            </span>
            <span className="nav-label">Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}


