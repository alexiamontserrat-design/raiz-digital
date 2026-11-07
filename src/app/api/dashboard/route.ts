import { NextResponse } from "next/server";
import { getDashboardOverview } from "@/services/dashboard.service";

export async function GET() {
  const overview = await getDashboardOverview();
  const status =
    overview.database === "connected"
      ? 200
      : overview.database === "unavailable"
        ? 503
        : 500;

  return NextResponse.json(overview, { status });
}
