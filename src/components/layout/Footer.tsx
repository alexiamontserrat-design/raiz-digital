import { es } from "@/constants";
import type { DatabaseStatus } from "@/types/dashboard.types";

interface FooterProps {
  databaseStatus?: DatabaseStatus;
}

export function Footer({ databaseStatus }: FooterProps) {
  const isOffline = databaseStatus === "unavailable";

  return (
    <footer className="app-footer">
      <span>Raíz Digital</span>
      <span>Un espacio para cuidar con intención.</span>
      <span className="connection">
        <i aria-hidden="true" />
        {isOffline ? es.databaseOffline : "Sistema listo"}
      </span>
    </footer>
  );
}
