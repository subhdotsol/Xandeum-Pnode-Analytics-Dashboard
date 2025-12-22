import { NextResponse } from "next/server";
import { saveSnapshot, type HistoricalSnapshot } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * POST /api/historical/save
 * 
 * Saves a snapshot to Supabase. Called by GitHub Actions cron.
 * Requires Authorization header with CRON_SECRET.
 */
export async function POST(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET;

    if (!expectedSecret) {
      return NextResponse.json(
        { error: "CRON_SECRET not configured" },
        { status: 500 }
      );
    }

    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (token !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse snapshot data from request body
    const body = await request.json();
    
    const snapshot: Omit<HistoricalSnapshot, 'id' | 'created_at'> = {
      timestamp: body.timestamp || Math.floor(Date.now() / 1000),
      total_nodes: body.total_nodes || 0,
      online_nodes: body.online_nodes || 0,
      offline_nodes: body.offline_nodes || 0,
      avg_cpu: body.avg_cpu || 0,
      avg_ram: body.avg_ram || 0,
      total_storage: body.total_storage || 0,
      unique_countries: body.unique_countries || 0,
      unique_versions: body.unique_versions || 0,
    };

    const success = await saveSnapshot(snapshot);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to save snapshot" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Snapshot saved",
      snapshot,
    });
  } catch (error: any) {
    console.error("Error saving snapshot:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save snapshot" },
      { status: 500 }
    );
  }
}
