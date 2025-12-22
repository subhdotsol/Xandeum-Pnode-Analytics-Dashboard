import { NextResponse } from "next/server";
import { pnodeClient } from "@/lib/pnode-client";
import { getCache, setCache } from "@/lib/redis";
import type { PNodeInfo } from "@/types/pnode";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export async function GET() {
  try {
    const CACHE_KEY = "pnodes:list";

    // 1. Try cache first (FAST - 1-5ms)
    const cached = await getCache<PNodeInfo[]>(CACHE_KEY);
    if (cached) {
      console.log("[API] Returning cached pNodes list");
      return NextResponse.json({ pnodes: cached, cached: true });
    }

    // 2. Fetch from pNodes directly (skip DB for now - DB is for historical data only)
    console.log("[API] Cache miss - fetching fresh data from pNodes...");
    const pnodes = await pnodeClient.getAllPNodes();

    // Cache the result for next time
    await setCache(CACHE_KEY, pnodes);

    return NextResponse.json({ pnodes, cached: false });
  } catch (error) {
    console.error("Error fetching pnodes:", error);
    return NextResponse.json(
      { error: "Failed to fetch pnodes", pnodes: [] },
      { status: 500 }
    );
  }
}
