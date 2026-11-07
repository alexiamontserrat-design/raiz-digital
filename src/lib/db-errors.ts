/**
 * Códigos de error del sistema operativo/Node.js y de PostgreSQL (SQLSTATE Clase 08 y Clase 57P03)
 * que indican fallos de conectividad, red o ausencia de configuración de base de datos.
 */
const CONNECTION_ERROR_CODES = new Set([
  // Códigos de red y sistema en Node.js
  "ECONNREFUSED",
  "ECONNRESET",
  "ETIMEDOUT",
  "ENOTFOUND",
  "EHOSTUNREACH",
  "ENETUNREACH",
  "EAI_AGAIN",
  "EPIPE",
  // PostgreSQL SQLSTATE Class 08 — Connection Exception
  "08000", // connection_exception
  "08003", // connection_does_not_exist
  "08006", // connection_failure
  "08001", // sqlclient_unable_to_establish_sqlconnection
  "08004", // sqlserver_rejected_establishment_of_sqlconnection
  "08007", // transaction_resolution_unknown
  "08P01", // protocol_violation
  // PostgreSQL SQLSTATE Class 28 / 3D / 57 (Configuración / Inicio de servidor)
  "28P01", // invalid_password
  "28000", // invalid_authorization_specification
  "3D000", // invalid_catalog_name (base de datos aún no creada)
  "57P03", // cannot_connect_now (servidor iniciando)
]);

interface ErrorWithCode {
  code?: string;
  message?: string;
  errors?: unknown[];
}

/**
 * Determina si un error capturado corresponde a un problema de conectividad o configuración
 * de PostgreSQL (HTTP 503) frente a un error interno o de programación SQL (HTTP 500).
 */
export function isDatabaseConnectionError(error: unknown): boolean {
  if (!process.env.DATABASE_URL) {
    return true;
  }

  if (!error || typeof error !== "object") {
    return false;
  }

  const candidate = error as ErrorWithCode;

  if (
    typeof candidate.code === "string" &&
    CONNECTION_ERROR_CODES.has(candidate.code)
  ) {
    return true;
  }

  // Manejo de AggregateError (p. ej. dual-stack IPv4/IPv6 ECONNREFUSED en Node.js)
  if (Array.isArray(candidate.errors) && candidate.errors.length > 0) {
    return candidate.errors.some((inner) => isDatabaseConnectionError(inner));
  }

  if (typeof candidate.message === "string") {
    const msg = candidate.message.toLowerCase();
    return (
      msg.includes("connection terminated") ||
      msg.includes("connect econnrefused") ||
      msg.includes("timeout expired") ||
      msg.includes("client password must be a string") ||
      msg.includes("role") && msg.includes("does not exist") ||
      msg.includes("database") && msg.includes("does not exist")
    );
  }

  return false;
}

