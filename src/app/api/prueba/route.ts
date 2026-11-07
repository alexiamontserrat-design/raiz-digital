import { NextResponse } from "next/server";
import { checkDatabaseHealth } from "@/services/health.service";

export async function GET() {
  const health = await checkDatabaseHealth();
  const status = health.ok
    ? 200
    : health.database === "unavailable"
      ? 503
      : 500;

  return NextResponse.json(health, { status });
}
