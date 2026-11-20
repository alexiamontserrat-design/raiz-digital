import { NextResponse } from "next/server";
import { getVerifiedSession } from "@/lib/session";
import { getDashboardOverview } from "@/services/dashboard.service";

export async function GET() {
  // Verifica activamente en PostgreSQL que la cuenta sigue activa y no revocada.
  // Si la DB falla, getVerifiedSession devuelve null → 401 (nunca acceso no verificado).
  const session = await getVerifiedSession();

  if (!session) {
    return NextResponse.json(
      { error: "No autorizado. Inicie sesión para continuar." },
      { status: 401 },
    );
  }

  const overview = await getDashboardOverview();
  const status =
    overview.database === "connected"
      ? 200
      : overview.database === "unavailable"
        ? 503
        : 500;

  return NextResponse.json(overview, { status });
}
