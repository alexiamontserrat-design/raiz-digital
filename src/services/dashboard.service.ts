import { isDatabaseConnectionError } from "@/lib/db-errors";
import { countTodayActivities } from "@/repositories/activities.repository";
import { countActiveReplenishmentAlerts } from "@/repositories/alerts.repository";
import { countLowStockProducts } from "@/repositories/inventory.repository";
import {
  countTotalResidents,
  findDashboardResidents,
} from "@/repositories/residents.repository";
import type { DashboardOverviewResponse } from "@/types/dashboard.types";

const DEFAULT_DASHBOARD_RESIDENTS_LIMIT = 5;

const EMPTY_STATS = {
  residentsTotal: 0,
  alerts: 0,
  activities: 0,
  stock: 0,
} as const;

/**
 * Orquesta los repositorios para construir el resumen general del dashboard.
 * Diferencia errores de conectividad/configuración (`unavailable` -> HTTP 503)
 * de errores internos o de consultas SQL inválidas (`error` -> HTTP 500).
 */
export async function getDashboardOverview(
  residentsLimit = DEFAULT_DASHBOARD_RESIDENTS_LIMIT,
): Promise<DashboardOverviewResponse> {
  try {
    const [residents, residentsTotal, alerts, activities, stock] =
      await Promise.all([
        findDashboardResidents(residentsLimit),
        countTotalResidents(),
        countActiveReplenishmentAlerts(),
        countTodayActivities(),
        countLowStockProducts(),
      ]);

    return {
      residents,
      stats: {
        residentsTotal,
        alerts,
        activities,
        stock,
      },
      database: "connected",
    };
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      console.warn(
        "[dashboard.service] PostgreSQL no disponible; devolviendo estado inicial sin conexión.",
      );
      return {
        residents: [],
        stats: { ...EMPTY_STATS },
        database: "unavailable",
      };
    }

    console.error(
      "[dashboard.service] Error interno al consultar datos del dashboard:",
      error,
    );
    return {
      residents: [],
      stats: { ...EMPTY_STATS },
      database: "error",
    };
  }
}
