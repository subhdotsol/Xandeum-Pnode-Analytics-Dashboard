import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Get historical snapshots for time-series analytics
 * 
 * Query params:
 * - range: 1h, 6h, 24h, 7d, 30d (default: 24h)
 * - limit: number of data points (default: 100)
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
    const startTimestamp = BigInt(Math.floor((now - timeRange) / 1000));

    // Fetch snapshots from database
    const snapshots = await prisma.snapshot.findMany({
      where: {
        timestamp: {
          gte: startTimestamp,
        },
      },
      orderBy: { timestamp: "asc" },
      take: limit,
    });

    // Transform data for frontend
    const data = snapshots.map((snapshot: any) => ({
      timestamp: Number(snapshot.timestamp),
      date: new Date(Number(snapshot.timestamp) * 1000).toISOString(),
      totalNodes: snapshot.totalNodes,
      healthyNodes: snapshot.healthyNodes,
      degradedNodes: snapshot.degradedNodes,
      offlineNodes: snapshot.offlineNodes,
      avgCpu: snapshot.avgCpu,
      avgRam: snapshot.avgRam,
      totalStorage: Number(snapshot.totalStorage),
      uniqueCountries: snapshot.uniqueCountries,
      uniqueVersions: snapshot.uniqueVersions,
      healthScore: snapshot.healthScore,
      latestVersion: snapshot.latestVersion,
      outdatedCount: snapshot.outdatedCount,
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
