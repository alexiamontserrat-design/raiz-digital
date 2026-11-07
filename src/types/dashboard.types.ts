import type { ResidenteRow } from "./database.types";

/**
 * Proyección pública de un residente para la vista de resumen del dashboard.
 * Excluye explícitamente `condicion_medica` e identificadores de usuario/familiar.
 */
export type ResidentDashboardItem = Pick<
  ResidenteRow,
  "id_residente" | "nombre" | "edad" | "habitacion"
>;

export interface DashboardStats {
  residentsTotal?: number;
  alerts: number;
  activities: number;
  stock: number;
}

export type DatabaseStatus = "connected" | "unavailable" | "error";

export interface DashboardOverviewResponse {
  residents: ResidentDashboardItem[];
  stats: DashboardStats;
  database?: DatabaseStatus;
}

export interface HealthCheckResponse {
  ok: boolean;
  database: DatabaseStatus;
  now?: string;
}
