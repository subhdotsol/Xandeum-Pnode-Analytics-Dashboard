import { NextResponse } from "next/server";
import { getOnlinePNodeStats, getAllPNodeStats, PNodeStats } from "@/lib/supabase";

/**
 * GET /api/stats
 * Returns pNode stats from Supabase for performance charts
 * Query params:
 *   - online: if "true", only return online nodes (last seen < 5 min)
 *   - limit: max number of nodes to return (default 100)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const onlineOnly = searchParams.get("online") === "true";
  const limit = parseInt(searchParams.get("limit") || "100", 10);

  try {
    // Fetch from Supabase
    const allStats = onlineOnly 
      ? await getOnlinePNodeStats()
      : await getAllPNodeStats();

    // Apply limit
    const stats = allStats.slice(0, limit);

    // Calculate online nodes
    const now = Math.floor(Date.now() / 1000);
    const onlineNodes = allStats.filter(s => {
      return s.last_seen_timestamp && now - s.last_seen_timestamp < 300;
    });

    // Nodes with valid CPU stats
    const nodesWithStats = onlineNodes.filter(s => s.cpu_percent !== null);
    
    const avgCpu = nodesWithStats.length > 0
      ? nodesWithStats.reduce((sum, s) => sum + (s.cpu_percent || 0), 0) / nodesWithStats.length
      : 0;

    // Nodes with valid RAM stats
    const nodesWithRam = onlineNodes.filter(s => s.ram_used !== null && s.ram_total !== null);
    const avgRam = nodesWithRam.length > 0
      ? nodesWithRam.reduce((sum, s) => {
          const ramPercent = s.ram_total! > 0 ? (s.ram_used! / s.ram_total!) * 100 : 0;
          return sum + ramPercent;
        }, 0) / nodesWithRam.length
      : 0;

    // Aggregate traffic and streams
    const totalTraffic = onlineNodes.reduce(
      (sum, s) => sum + (s.packets_received || 0) + (s.packets_sent || 0),
      0
    );

    const totalStreams = onlineNodes.reduce(
      (sum, s) => sum + (s.active_streams || 0),
      0
    );

    // Also include legacy format for backwards compatibility
    const legacyFormat = {
      totalStorage: onlineNodes.reduce((sum, s) => sum + (s.total_bytes || 0), 0),
      totalRam: onlineNodes.reduce((sum, s) => sum + (s.ram_total || 0), 0),
      avgCpu: Math.round(avgCpu * 10) / 10,
      avgUptime: nodesWithStats.length > 0
        ? onlineNodes.reduce((sum, s) => sum + (s.uptime_seconds || 0), 0) / onlineNodes.length
        : 0,
      totalData: onlineNodes.reduce((sum, s) => sum + (s.file_size || 0), 0),
      totalPages: onlineNodes.reduce((sum, s) => sum + (s.total_pages || 0), 0),
      totalPackets: totalTraffic,
      totalStreams,
      nodeCount: nodesWithStats.length,
    };

    return NextResponse.json({
      success: true,
      // Legacy format (root level)
      ...legacyFormat,
      // New format with full data
      data: {
        nodes: stats,
        summary: {
          total: allStats.length,
          online: onlineNodes.length,
          withStats: nodesWithStats.length,
          avgCpu: Math.round(avgCpu * 10) / 10,
          avgRam: Math.round(avgRam * 10) / 10,
          totalTraffic,
          totalStreams,
        },
      },
      lastSynced: new Date().toISOString(),
    });

  } catch (error) {
    console.error("[Stats API] Error:", error);
    // Return empty data on error
    return NextResponse.json({
      success: false,
      totalStorage: 0,
      totalRam: 0,
      avgCpu: 0,
      avgUptime: 0,
      totalData: 0,
      totalPages: 0,
      totalPackets: 0,
      totalStreams: 0,
      nodeCount: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
