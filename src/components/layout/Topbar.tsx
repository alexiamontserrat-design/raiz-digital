"use client";

import { Menu } from "lucide-react";
import { formatSpanishLongDate } from "@/lib/formatters";
import { useSidebar } from "./SidebarContext";

interface TopbarProps {
  currentDateLabel?: string;
}

export function Topbar({ currentDateLabel }: TopbarProps) {
  const dateLabel = currentDateLabel ?? formatSpanishLongDate();
  const { openMobile, isMobileOpen } = useSidebar();

  return (
    <header className="topbar">
      <div className="mobile-header-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={openMobile}
          aria-label="Abrir menú lateral"
          aria-expanded={isMobileOpen}
          aria-controls="app-sidebar"
          title="Abrir menú"
        >
          <Menu size={22} strokeWidth={2} />
        </button>

        <div className="mobile-brand">
          <span className="brand-mark" aria-hidden="true">
            ✦
          </span>
          <strong>Raíz Digital</strong>
        </div>
      </div>

      <div className="top-actions">
        <button
          type="button"
          className="icon-button"
          aria-label="Buscar en el sistema"
          title="Buscar"
        >
          ⌕
        </button>
        <button
          type="button"
          className="icon-button notification"
          aria-label="Ver notificaciones"
          title="Notificaciones"
        >
          <span aria-hidden="true">♧</span>
          <i aria-hidden="true" />
        </button>
        <div className="date">{dateLabel}</div>
      </div>
    </header>
  );
}


