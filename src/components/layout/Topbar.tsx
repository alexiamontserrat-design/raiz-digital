import { formatSpanishLongDate } from "@/lib/formatters";

interface TopbarProps {
  currentDateLabel?: string;
}

export function Topbar({ currentDateLabel }: TopbarProps) {
  const dateLabel = currentDateLabel ?? formatSpanishLongDate();

  return (
    <header className="topbar">
      <div className="mobile-brand">
        <span className="brand-mark" aria-hidden="true">
          ✦
        </span>
        <strong>Raíz Digital</strong>
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

