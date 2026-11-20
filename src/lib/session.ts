import "server-only";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { verifyUserSession } from "@/repositories/users.repository";

/**
 * Verifica activamente en PostgreSQL que la sesión del usuario sigue siendo válida
 * en cada petición de servidor.
 *
 * Reglas de denegación (en orden):
 *  1. Sin sesión JWT o sin `user.id`               → redirige a /login
 *  2. `id` no es un entero positivo válido          → redirige a /login
 *  3. `tokenVersion` ausente o inválido en sesión   → redirige a /login
 *  4. PostgreSQL no disponible                      → redirige a /login (nunca acceso no verificado)
 *  5. Usuario no encontrado                         → redirige a /login
 *  6. `estado` !== 'activo' (suspendido/pendiente)  → redirige a /login
 *  7. `token_version` no coincide en DB             → redirige a /login (sesión revocada)
 *
 * @returns La sesión de Auth.js si y solo si la cuenta está activa y verificada en DB.
 */
export async function requireActiveSession() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = Number(session.user.id);
  if (!Number.isFinite(userId) || userId <= 0 || !Number.isInteger(userId)) {
    redirect("/login");
  }

  const { tokenVersion } = session.user;
  if (typeof tokenVersion !== "number" || !Number.isFinite(tokenVersion)) {
    redirect("/login");
  }

  let verified;
  try {
    verified = await verifyUserSession(userId, tokenVersion);
  } catch {
    // PostgreSQL no disponible → denegar por precaución (regla 4)
    console.error(
      "[session/requireActiveSession] PostgreSQL no disponible. Acceso denegado por precaución.",
    );
    redirect("/login");
  }

  if (!verified) {
    // Usuario suspendido, pendiente, eliminado o token_version revocado
    redirect("/login");
  }

  return session;
}

/**
 * Variante para rutas API: devuelve `null` en lugar de redirigir.
 * Si PostgreSQL falla, devuelve `null` (denegar por precaución — nunca acceso no verificado).
 */
export async function getVerifiedSession() {
  const session = await auth();

  if (!session?.user?.id) return null;

  const userId = Number(session.user.id);
  if (!Number.isFinite(userId) || userId <= 0 || !Number.isInteger(userId)) {
    return null;
  }

  const { tokenVersion } = session.user;
  if (typeof tokenVersion !== "number" || !Number.isFinite(tokenVersion)) {
    return null;
  }

  try {
    const verified = await verifyUserSession(userId, tokenVersion);
    if (!verified) return null;
  } catch {
    console.error(
      "[session/getVerifiedSession] PostgreSQL no disponible. Acceso denegado por precaución.",
    );
    return null;
  }

  return session;
}
