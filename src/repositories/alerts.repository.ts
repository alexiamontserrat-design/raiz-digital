import { dbQuery } from "@/config/db";

interface CountRow {
  total: number;
}

/**
 * Obtiene el total de alertas de reabastecimiento que se encuentran activas.
 */
export async function countActiveReplenishmentAlerts(): Promise<number> {
  const result = await dbQuery<CountRow>(
    "SELECT COUNT(*)::int AS total FROM alertas_reabastecimiento WHERE alerta_activa = $1",
    [true],
  );
  return result.rows[0]?.total ?? 0;
}

