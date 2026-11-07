import { dbQuery } from "@/config/db";
import type { ResidentDashboardItem } from "@/types/dashboard.types";

interface CountRow {
  total: number;
}

/**
 * Obtiene un listado limitado de residentes para el resumen del dashboard,
 * excluyendo información clínica sensible (`condicion_medica`).
 */
export async function findDashboardResidents(
  limit = 5,
): Promise<ResidentDashboardItem[]> {
  const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 5;
  const result = await dbQuery<ResidentDashboardItem>(
    `SELECT id_residente, nombre, edad, habitacion
     FROM residentes
     ORDER BY nombre ASC
     LIMIT $1`,
    [safeLimit],
  );
  return result.rows;
}

/**
 * Obtiene el conteo total de residentes registrados en el sistema.
 */
export async function countTotalResidents(): Promise<number> {
  const result = await dbQuery<CountRow>(
    "SELECT COUNT(*)::int AS total FROM residentes",
  );
  return result.rows[0]?.total ?? 0;
}

