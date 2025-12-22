import { NextResponse } from "next/server";
import { pnodeClient } from "@/lib/pnode-client";
import { analyzeNetwork } from "@/lib/network-analytics";
import { getCache, setCache } from "@/lib/redis";
import type { NetworkAnalytics } from "@/types/pnode";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export async function GET() {
  try {
    const CACHE_KEY = "network:overview";

    // 1. Try cache first
    const cached = await getCache<NetworkAnalytics>(CACHE_KEY);
    if (cached) {
      console.log("[API] Returning cached network overview");
      return NextResponse.json({
        success: true,
        data: {
          ...cached,
          lastUpdated: new Date().toISOString(),
        },
        cached: true,
      });
    }

    // 2. Fetch fresh data and analyze
    const pnodes = await pnodeClient.getAllPNodes();
    const analytics = analyzeNetwork(pnodes);

    // Cache the result
    await setCache(CACHE_KEY, analytics);

    return NextResponse.json({
      success: true,
      data: {
        ...analytics,
        lastUpdated: new Date().toISOString(),
        nodeCount: pnodes.length,
      },
      cached: false,
    });
  } catch (error: any) {
    console.error("Error fetching network overview:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch network overview",
      },
      { status: 500 }
    );
  }
}
