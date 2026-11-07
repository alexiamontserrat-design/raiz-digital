import { Pool, type QueryResult, type QueryResultRow } from "pg";

const globalForDb = globalThis as unknown as {
  raizPool?: Pool;
  raizDbWarned?: boolean;
};

function createDatabasePool(): Pool {
  const connectionString = process.env.DATABASE_URL;

  return new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });
}

export const pool = globalForDb.raizPool ?? createDatabasePool();

if (process.env.NODE_ENV !== "production") {
  globalForDb.raizPool = pool;
}

/**
 * Ejecuta una consulta SQL parametrizada y tipada sobre el pool de PostgreSQL.
 */
export async function dbQuery<TRow extends QueryResultRow>(
  text: string,
  params?: readonly unknown[],
): Promise<QueryResult<TRow>> {
  if (!process.env.DATABASE_URL && !globalForDb.raizDbWarned) {
    console.warn(
      "[config/db] La variable de entorno DATABASE_URL no está definida. Verifica tu archivo .env.local.",
    );
    globalForDb.raizDbWarned = true;
  }

  return pool.query<TRow>(text, params ? [...params] : undefined);
}
