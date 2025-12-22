import { NextResponse } from "next/server";
import { pnodeClient } from "@/lib/pnode-client";
import { analyzeNetwork } from "@/lib/network-analytics";
import { clearAllCache } from "@/lib/redis";
import { saveSnapshot } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * GET /api/cron/collect-snapshot
 * 
 * Lightweight cron endpoint that:
 * 1. Fetches pNode data
 * 2. Calculates network analytics
 * 3. Saves snapshot to Supabase (simple table, no Prisma)
 * 4. Clears cache
 * 
 * Much faster than before - no individual pNode upserts!
 */
export async function GET(request: Request) {
  const startTime = Date.now();

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
      console.log("[Cron] Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Cron] Starting snapshot collection...");

    // 1. Fetch all pNodes (fast - just list, no stats)
    const pnodes = await pnodeClient.getAllPNodes();
    console.log(`[Cron] Fetched ${pnodes.length} pNodes`);

    if (pnodes.length === 0) {
      return NextResponse.json(
        { error: "No pNodes found" },
        { status: 500 }
      );
    }

    // 2. Fetch stats from sample nodes (optimized for speed)
    const statsMap = new Map<string, any>();
    const sampleSize = Math.min(5, pnodes.length);
    const sampleNodes = pnodes.slice(0, sampleSize);
    
    console.log(`[Cron] Fetching stats from ${sampleSize} sample nodes...`);
    
    await Promise.allSettled(
      sampleNodes.map(async (node) => {
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000));
        try {
          const stats = await Promise.race([pnodeClient.getPNodeStats(node.address), timeout]);
          if (stats) statsMap.set(node.address, stats);
        } catch (err) {
          // Skip slow nodes
        }
      })
    );
    console.log(`[Cron] Got stats from ${statsMap.size} nodes`);

    // 3. Calculate analytics with stats
    const analytics = analyzeNetwork(pnodes, statsMap);
    console.log("[Cron] Calculated analytics");

    // 3. Save snapshot to Supabase (single row insert - FAST!)
    const snapshot = {
      timestamp: Math.floor(Date.now() / 1000),
      total_nodes: analytics.totals.total,
      online_nodes: analytics.totals.healthy,
      offline_nodes: analytics.totals.offline,
      avg_cpu: analytics.performance.averageCPU,
      avg_ram: analytics.performance.averageRAM,
      total_storage: analytics.storage.totalCapacity,
      unique_countries: 0, // Would need geo lookup
      unique_versions: Object.keys(analytics.versions.distribution).length,
    };

    const saved = await saveSnapshot(snapshot);
    if (!saved) {
      console.log("[Cron] Failed to save snapshot to Supabase");
      return NextResponse.json(
        { error: "Failed to save snapshot" },
        { status: 500 }
      );
    }
    console.log("[Cron] Saved snapshot to Supabase");

    // 4. Clear cache
    await clearAllCache();
    console.log("[Cron] Cleared cache");

    const duration = Date.now() - startTime;
    console.log(`[Cron] Complete in ${duration}ms`);

    return NextResponse.json({
      success: true,
      snapshot: {
        timestamp: snapshot.timestamp,
        totalNodes: snapshot.total_nodes,
        onlineNodes: snapshot.online_nodes,
        offlineNodes: snapshot.offline_nodes,
      },
      duration: `${duration}ms`,
    });
  } catch (error: any) {
    console.error("[Cron] Error:", error);
    return NextResponse.json(
      { error: error.message || "Snapshot collection failed" },
      { status: 500 }
    );
  }
}
