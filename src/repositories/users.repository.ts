import "server-only";

import { dbQuery } from "@/config/db";
import type { EstadoUsuario, RolUsuario, UsuarioRow } from "@/types/database.types";

/**
 * Subset de `usuarios` necesario para autenticación y verificación de sesión.
 * Incluye `contrasena` (hash) exclusivamente para el proceso de authorize.
 * NUNCA debe exponerse en respuestas HTTP, sesiones o componentes cliente.
 */
export type UsuarioAuth = Pick<
  UsuarioRow,
  "id_usuario" | "nombre" | "correo" | "contrasena" | "rol" | "estado" | "token_version"
>;

/**
 * Busca las credenciales de un usuario por correo electrónico para verificación de autenticación.
 * Incluye `estado` y `token_version` para control de acceso.
 * USO EXCLUSIVO: Servidor — proceso de autenticación en `auth.ts`.
 */
export async function findUserAuthByEmail(
  email: string,
): Promise<UsuarioAuth | null> {
  const normalizedEmail = email?.trim();
  if (!normalizedEmail) {
    return null;
  }

  const result = await dbQuery<UsuarioAuth>(
    `SELECT
       id_usuario,
       nombre,
       correo,
       contrasena,
       rol,
       estado,
       token_version
     FROM usuarios
     WHERE LOWER(correo) = LOWER($1)
     LIMIT 1`,
    [normalizedEmail],
  );

  return result.rows[0] ?? null;
}

/**
 * Verifica que una sesión JWT sigue siendo válida contra el estado actual en PostgreSQL.
 * Devuelve `null` si el usuario está suspendido, pendiente o si el `token_version` no coincide.
 * USO EXCLUSIVO: Callback `jwt` de Auth.js para revalidación de sesiones existentes.
 */
export async function verifyUserSession(
  id: number,
  tokenVersion: number,
): Promise<{ estado: EstadoUsuario; rol: RolUsuario; token_version: number } | null> {
  const result = await dbQuery<{
    estado: EstadoUsuario;
    rol: RolUsuario;
    token_version: number;
  }>(
    `SELECT estado, rol, token_version
     FROM usuarios
     WHERE id_usuario = $1
     LIMIT 1`,
    [id],
  );

  const row = result.rows[0];
  if (!row) return null;
  if (row.estado !== "activo") return null;
  if (row.token_version !== tokenVersion) return null;

  return row;
}
