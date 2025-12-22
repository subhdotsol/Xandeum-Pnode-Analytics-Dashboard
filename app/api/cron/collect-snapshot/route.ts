import { NextResponse } from "next/server";
import { pnodeClient } from "@/lib/pnode-client";
import { analyzeNetwork } from "@/lib/network-analytics";
import { prisma } from "@/lib/prisma";
import { clearAllCache } from "@/lib/redis";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60 seconds for snapshot collection

/**
 * Cron Snapshot Collection Endpoint
 * 
 * This endpoint should be called by cron-job.org every 5 minutes
 * to collect and store network snapshots.
 * 
 * Required header: Authorization: Bearer YOUR_CRON_SECRET
 */
export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

    if (!authHeader || authHeader !== expectedAuth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[Cron] Starting snapshot collection...");
    const startTime = Date.now();

    // 1. Fetch fresh pNode data
    const pnodes = await pnodeClient.getAllPNodes();
    console.log(`[Cron] Fetched ${pnodes.length} pNodes`);

    if (pnodes.length === 0) {
      return NextResponse.json(
        { error: "No pNodes found", success: false },
        { status: 500 }
      );
    }

    // 2. Fetch detailed stats (optimized for speed)
    console.log(`[Cron] Fetching stats from sample nodes...`);
    const statsMap = new Map<string, any>();
    
    // Only sample 10 nodes for stats (reduced from 50)
    const sampleSize = Math.min(10, pnodes.length);
    const sampleNodes = pnodes.slice(0, sampleSize);
    
    // Fetch with aggressive 5-second timeout per node
    const statsFetches = sampleNodes.map(async (node) => {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('timeout')), 5000)
      );
      
      try {
        const stats = await Promise.race([
          pnodeClient.getPNodeStats(node.address),
          timeoutPromise
        ]);
        if (stats) {
          statsMap.set(node.address, stats);
        }
      } catch (err) {
        // Skip slow/failing nodes
      }
    });
    
    await Promise.allSettled(statsFetches);
    console.log(`[Cron] Fetched stats from ${statsMap.size}/${sampleSize} nodes`);

    // 3. Calculate network analytics with stats
    const analytics = analyzeNetwork(pnodes, statsMap);
    console.log(`[Cron] Calculated analytics`);

    // 3. Store pNodes in database (upsert in batches to avoid connection pool exhaustion)
    console.log(`[Cron] Storing ${pnodes.length} pNodes in batches...`);
    const batchSize = 10;
    let stored = 0;
    
    for (let i = 0; i < pnodes.length; i += batchSize) {
      const batch = pnodes.slice(i, i + batchSize);
      const batchPromises = batch.map(async (pnode) => {
        const ipAddress = pnode.address.split(":")[0];
        const lastSeen = pnode.last_seen || new Date(pnode.last_seen_timestamp * 1000).toISOString();
        
        return prisma.pNode.upsert({
          where: { address: pnode.address },
          update: {
            version: pnode.version,
            lastSeenTimestamp: pnode.last_seen_timestamp,
            lastSeen: lastSeen,
            ipAddress,
            updatedAt: new Date(),
          },
          create: {
            address: pnode.address,
            version: pnode.version,
            lastSeenTimestamp: pnode.last_seen_timestamp,
            lastSeen: lastSeen,
            ipAddress,
          },
        });
      });
      
      await Promise.all(batchPromises);
      stored += batch.length;
      console.log(`[Cron] Stored ${stored}/${pnodes.length} pNodes`);
    }

    console.log(`[Cron] Stored all ${pnodes.length} pNodes in database`);

    // 4. Create snapshot record
    const timestamp = BigInt(Math.floor(Date.now() / 1000));
    
    const snapshot = await prisma.snapshot.create({
      data: {
        timestamp,
        totalNodes: analytics.totals.total,
        healthyNodes: analytics.totals.healthy,
        degradedNodes: analytics.totals.degraded,
        offlineNodes: analytics.totals.offline,
        avgCpu: analytics.performance.averageCPU,
        avgRam: analytics.performance.averageRAM,
        totalStorage: BigInt(analytics.storage.totalCapacity),
        uniqueCountries: 0, // Will be calculated with geo data
        uniqueVersions: Object.keys(analytics.versions.distribution).length,
        latestVersion: analytics.versions.latest,
        outdatedCount: analytics.versions.outdatedCount,
        healthScore: analytics.health.score,
      },
    });

    console.log(`[Cron] Created snapshot ${snapshot.id}`);

    // 5. Invalidate all caches
    await clearAllCache();
    console.log(`[Cron] Cleared all caches`);

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      snapshot: {
        id: snapshot.id,
        timestamp: snapshot.timestamp.toString(),
        totalNodes: snapshot.totalNodes,
        healthScore: snapshot.healthScore,
      },
      stats: {
        pnodesStored: pnodes.length,
        duration: `${duration}ms`,
      },
    });
  } catch (error: any) {
    console.error("[Cron] Error collecting snapshot:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to collect snapshot",
      },
      { status: 500 }
    );
  }
}
