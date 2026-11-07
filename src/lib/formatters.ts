/**
 * Formatea una fecha en español (México) con el día de la semana capitalizado.
 * Ejemplo: "Viernes, 06 de noviembre de 2026"
 */
export function formatSpanishLongDate(date: Date = new Date()): string {
  const formatted = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/**
 * Obtiene las iniciales de un nombre (máximo 2 letras en mayúsculas).
 */
export function getInitials(fullName: string): string {
  const trimmed = fullName.trim();
  if (!trimmed) return "RD";

  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

