import { isDatabaseConnectionError } from "@/lib/db-errors";
import { queryDatabaseNow } from "@/repositories/health.repository";
import type { HealthCheckResponse } from "@/types/dashboard.types";

/**
 * Ejecuta el chequeo de salud de la conexión a PostgreSQL.
 * Distingue entre indisponibilidad de conexión (unavailable -> 503) y error interno (error -> 500).
 */
export async function checkDatabaseHealth(): Promise<HealthCheckResponse> {
  try {
    const now = await queryDatabaseNow();
    return {
      ok: true,
      database: "connected",
      now,
    };
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      console.warn(
        "[health.service] PostgreSQL no disponible o pendiente de configuración.",
      );
      return {
        ok: false,
        database: "unavailable",
      };
    }

    console.error("[health.service] Error interno al verificar PostgreSQL:", error);
    return {
      ok: false,
      database: "error",
    };
  }
}
