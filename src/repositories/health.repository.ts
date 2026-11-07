import { dbQuery } from "@/config/db";

interface NowRow {
  now: string;
}

/**
 * Comprueba la conectividad con PostgreSQL obteniendo la marca de tiempo actual del servidor.
 */
export async function queryDatabaseNow(): Promise<string> {
  const result = await dbQuery<NowRow>("SELECT NOW()::text AS now");
  return result.rows[0].now;
}

