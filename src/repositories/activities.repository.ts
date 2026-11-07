import { dbQuery } from "@/config/db";

interface CountRow {
  total: number;
}

/**
 * Obtiene el total de actividades programadas para el día actual en PostgreSQL.
 */
export async function countTodayActivities(): Promise<number> {
  const result = await dbQuery<CountRow>(
    "SELECT COUNT(*)::int AS total FROM actividades WHERE fecha = CURRENT_DATE",
  );
  return result.rows[0]?.total ?? 0;
}

