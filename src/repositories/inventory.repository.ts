import { dbQuery } from "@/config/db";

interface CountRow {
  total: number;
}

/**
 * Obtiene el total de productos cuyo inventario actual es menor o igual al mínimo requerido.
 */
export async function countLowStockProducts(): Promise<number> {
  const result = await dbQuery<CountRow>(
    "SELECT COUNT(*)::int AS total FROM productos WHERE cantidad <= cantidad_minima",
  );
  return result.rows[0]?.total ?? 0;
}

