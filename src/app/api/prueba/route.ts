import { NextResponse } from "next/server";
import { getVerifiedSession } from "@/lib/session";
import { checkDatabaseHealth } from "@/services/health.service";

export async function GET() {
  const session = await getVerifiedSession();

  if (!session) {
    return NextResponse.json(
      { error: "No autorizado. Inicie sesión para continuar." },
      { status: 401 },
    );
  }

  const health = await checkDatabaseHealth();
  const status = health.ok
    ? 200
    : health.database === "unavailable"
      ? 503
      : 500;

  return NextResponse.json(health, { status });
}
