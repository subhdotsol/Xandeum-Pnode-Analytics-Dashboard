import { NextResponse } from "next/server";
import { pnodeClient } from "@/lib/pnode-client";
import { upsertPNodeStats, PNodeStats } from "@/lib/supabase";

// Concurrency limit for stats fetching
const CONCURRENCY_LIMIT = 15;

// Batch function with concurrency limit
async function batchWithLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  const executing: Promise<void>[] = [];

  for (const item of items) {
    const promise = fn(item).then((result) => {
      results.push(result);
    });

    executing.push(promise);

    if (executing.length >= limit) {
      await Promise.race(executing);
      // Remove completed promises
      const completed = executing.filter(
        (p) => p.then(() => true).catch(() => true)
      );
      executing.length = 0;
      executing.push(...completed.filter((p) => executing.includes(p)));
    }
  }

  await Promise.all(executing);
  return results;
}

// This endpoint syncs pNode data from the network to Supabase
// Can be called by Vercel cron or external service
export async function POST(request: Request) {
  const startTime = Date.now();
  
  // Optional: Verify cron secret for security
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("[Sync] Starting pNode sync...");

  try {
    // 1. Fetch all pNodes from seed nodes
    const pods = await pnodeClient.getAllPNodes();
    
    if (!pods.length) {
      console.warn("[Sync] No pods returned from get-pods");
      return NextResponse.json({ 
        success: false, 
        error: "No pods returned" 
      }, { status: 500 });
    }

    console.log(`[Sync] Got ${pods.length} pods from network`);

    // 2. Deduplicate by IP (keep most recent)
    const podsByIp = new Map<string, typeof pods[0]>();
    for (const pod of pods) {
      const ip = pod.address.split(":")[0];
      const existing = podsByIp.get(ip);
      
      if (!existing || pod.last_seen_timestamp > existing.last_seen_timestamp) {
        podsByIp.set(ip, pod);
      }
    }

    const uniquePods = Array.from(podsByIp.values());
    console.log(`[Sync] Deduplicated to ${uniquePods.length} unique IPs`);

    // 3. Fetch stats for online nodes in parallel
    const now = Math.floor(Date.now() / 1000);
    const onlinePods = uniquePods.filter(
      (p) => now - p.last_seen_timestamp < 300
    );

    console.log(`[Sync] Fetching stats for ${onlinePods.length} online nodes...`);

    let successCount = 0;
    let failCount = 0;

    const statsResults = await batchWithLimit(
      onlinePods,
      CONCURRENCY_LIMIT,
      async (pod) => {
        try {
          const stats = await pnodeClient.getPNodeStats(pod.address);
          if (stats) {
            successCount++;
            return { pod, stats };
          }
        } catch (e) {
          // Silently fail
        }
        failCount++;
        return { pod, stats: null };
      }
    );

    console.log(`[Sync] Stats fetched: ${successCount} success, ${failCount} failed`);

    // 4. Prepare data for Supabase upsert
    const updateNowTimestamp = Math.floor(Date.now() / 1000);
    const pnodeStatsToUpsert: Omit<PNodeStats, 'id' | 'created_at'>[] = [];

    for (const { pod, stats } of statsResults) {
      const ip = pod.address.split(":")[0];

      const nodeStats: Omit<PNodeStats, 'id' | 'created_at'> = {
        ip,
        address: pod.address,
        pubkey: pod.pubkey || null,
        version: pod.version || null,
        last_seen_timestamp: stats ? updateNowTimestamp : pod.last_seen_timestamp,
        
        // Stats (only if we got them)
        cpu_percent: stats?.cpu_percent ?? null,
        ram_used: stats?.ram_used ?? null,
        ram_total: stats?.ram_total ?? null,
        uptime_seconds: stats?.uptime ?? null,
        total_bytes: stats?.total_bytes ?? null,
        file_size: stats?.file_size ?? null,
        total_pages: stats?.total_pages ?? null,
        packets_received: stats?.packets_received ?? null,
        packets_sent: stats?.packets_sent ?? null,
        active_streams: stats?.active_streams ?? null,
        
        // Geolocation (populated separately via /api/geo)
        latitude: null,
        longitude: null,
        country: null,
        city: null,
      };

      pnodeStatsToUpsert.push(nodeStats);
    }

    // Also add offline nodes (no stats, just base info)
    const offlinePods = uniquePods.filter(
      (p) => now - p.last_seen_timestamp >= 300
    );

    for (const pod of offlinePods) {
      const ip = pod.address.split(":")[0];
      
      pnodeStatsToUpsert.push({
        ip,
        address: pod.address,
        pubkey: pod.pubkey || null,
        version: pod.version || null,
        last_seen_timestamp: pod.last_seen_timestamp,
        cpu_percent: null,
        ram_used: null,
        ram_total: null,
        uptime_seconds: null,
        total_bytes: null,
        file_size: null,
        total_pages: null,
        packets_received: null,
        packets_sent: null,
        active_streams: null,
        latitude: null,
        longitude: null,
        country: null,
        city: null,
      });
    }

    // 5. Upsert all to Supabase
    console.log(`[Sync] Upserting ${pnodeStatsToUpsert.length} nodes to Supabase...`);
    const upsertResult = await upsertPNodeStats(pnodeStatsToUpsert);

    const duration = Date.now() - startTime;
    const successRate = onlinePods.length > 0 
      ? ((successCount / onlinePods.length) * 100).toFixed(1)
      : "0";

    console.log(`[Sync] Complete in ${(duration / 1000).toFixed(2)}s`);

    return NextResponse.json({
      success: true,
      summary: {
        totalFromNetwork: pods.length,
        uniqueIps: uniquePods.length,
        onlineNodes: onlinePods.length,
        statsSuccess: successCount,
        statsFailed: failCount,
        successRate: `${successRate}%`,
        upserted: upsertResult.success,
        durationMs: duration,
      },
    });

  } catch (error) {
    console.error("[Sync] Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}

// GET endpoint for manual testing
export async function GET(request: Request) {
  return POST(request);
}
