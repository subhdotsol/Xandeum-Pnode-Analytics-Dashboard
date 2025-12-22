import { NextResponse } from "next/server";
import { getSnapshotsByRange, type HistoricalSnapshot } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * GET /api/historical
 * 
 * Fetches historical snapshots from Supabase.
 * Query params:
 *   - range: "1h" | "6h" | "24h" | "7d" | "30d" (default: "24h")
 *   - limit: number (default: 100)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "24h";
    const limit = parseInt(searchParams.get("limit") || "100");

    // Calculate time ranges
    const now = Date.now();
    const ranges: Record<string, number> = {
      "1h": 60 * 60 * 1000,
      "6h": 6 * 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
    };

    const timeRange = ranges[range] || ranges["24h"];
    const startTimestamp = Math.floor((now - timeRange) / 1000);
    const endTimestamp = Math.floor(now / 1000);

    // Fetch from Supabase
    const snapshots = await getSnapshotsByRange(startTimestamp, endTimestamp, limit);

    // Transform for frontend (matching component's expected format)
    const data = snapshots.map((snapshot: HistoricalSnapshot) => ({
      timestamp: snapshot.timestamp,
      date: new Date(snapshot.timestamp * 1000).toISOString(),
      totalNodes: snapshot.total_nodes,
      healthyNodes: snapshot.online_nodes,
      degradedNodes: 0,
      offlineNodes: snapshot.offline_nodes,
      avgCpu: snapshot.avg_cpu,
      avgRam: snapshot.avg_ram,
      totalStorage: snapshot.total_storage,
      uniqueCountries: snapshot.unique_countries,
      uniqueVersions: snapshot.unique_versions,
      healthScore: snapshot.total_nodes > 0 
        ? Math.round((snapshot.online_nodes / snapshot.total_nodes) * 100) 
        : 0,
      latestVersion: null,
      outdatedCount: 0,
    }));

    return NextResponse.json({
      success: true,
      data,
      meta: {
        range,
        count: data.length,
        startTime: data[0]?.date,
        endTime: data[data.length - 1]?.date,
      },
    });
  } catch (error: any) {
    console.error("Error fetching historical data:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch historical data",
      },
      { status: 500 }
    );
  }
}
