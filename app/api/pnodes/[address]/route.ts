import { NextResponse } from "next/server";
import { pnodeClient } from "@/lib/pnode-client";
import { getNodeHealth } from "@/lib/network-analytics";
import { getCache, setCache } from "@/lib/redis";
import type { PNodeStats } from "@/types/pnode";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const decodedAddress = decodeURIComponent(address);
    const CACHE_KEY = `pnodes:stats:${decodedAddress}`;

    // 1. Try cache first
    const cached = await getCache<PNodeStats>(CACHE_KEY);
    if (cached) {
      const health = getNodeHealth(cached.last_updated);
      return NextResponse.json({
        success: true,
        data: {
          address: decodedAddress,
          stats: cached,
          health,
          lastUpdated: new Date().toISOString(),
        },
        cached: true,
      });
    }

    // 2. Fetch fresh stats from pNode
    const stats = await pnodeClient.getPNodeStats(decodedAddress);

    if (!stats) {
      return NextResponse.json(
        {
          success: false,
          error: "Node not found or unavailable",
        },
        { status: 404 }
      );
    }

    // Cache the result
    await setCache(CACHE_KEY, stats);

    // Get health status
    const health = getNodeHealth(stats.last_updated);

    return NextResponse.json({
      success: true,
      data: {
        address: decodedAddress,
        stats,
        health,
        lastUpdated: new Date().toISOString(),
      },
      cached: false,
    });
  } catch (error: any) {
    console.error("Error fetching pNode stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch pNode stats",
      },
      { status: 500 }
    );
  }
}
