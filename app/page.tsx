import { pnodeClient } from "@/lib/pnode-client";
import { analyzeNetwork } from "@/lib/network-analytics";
import { MainDashboard } from "@/components/dashboard/main-dashboard";
import { AutoRefresh } from "@/components/dashboard/auto-refresh";
import type { PNodeStats } from "@/types/pnode";

async function getNetworkData() {
  try {
    const pnodes = await pnodeClient.getAllPNodes();
    const analytics = analyzeNetwork(pnodes);

    // Fetch stats for a small sample of nodes (10 only for faster load)
    const statsPromises = pnodes.slice(0, 10).map(async (node) => {
      try {
        const stats = await pnodeClient.getPNodeStats(node.address);
        return { address: node.address, stats };
      } catch {
        return { address: node.address, stats: null };
      }
    });

    const statsResults = await Promise.all(statsPromises);
    const validStats = statsResults
      .filter((r): r is { address: string; stats: PNodeStats } => r.stats !== null)
      .map(r => r.stats);

    // Calculate aggregate stats
    const aggregateStats = {
      totalStorage: validStats.reduce((sum, s) => sum + (s.total_bytes || 0), 0),
      totalRam: validStats.reduce((sum, s) => sum + (s.ram_total || 0), 0),
      avgCpu: validStats.length > 0
        ? validStats.reduce((sum, s) => sum + (s.cpu_percent || 0), 0) / validStats.length
        : 0,
      avgUptime: validStats.length > 0
        ? validStats.reduce((sum, s) => sum + (s.uptime || 0), 0) / validStats.length
        : 0,
      totalData: validStats.reduce((sum, s) => sum + (s.file_size || 0), 0),
      totalPages: validStats.reduce((sum, s) => sum + (s.total_pages || 0), 0),
    };

    // Get unique locations from IP addresses
    const uniqueIPs = new Set(pnodes.map(node => node.address.split(':')[0]));
    const uniquePrefixes = new Set(
      Array.from(uniqueIPs).map(ip => ip.split('.').slice(0, 2).join('.'))
    );
    const estimatedCountries = Math.min(uniquePrefixes.size, 20);

    return {
      pnodes,
      analytics,
      aggregateStats,
      estimatedCountries,
    };
  } catch (error) {
    console.error("Error fetching network data:", error);
    return {
      pnodes: [],
      analytics: null,
      aggregateStats: null,
      estimatedCountries: 0,
    };
  }
}

export default async function HomePage() {
  const { pnodes, analytics, aggregateStats, estimatedCountries } = await getNetworkData();

  if (!analytics || !aggregateStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Failed to load network data</h2>
          <p className="text-muted-foreground">
            Please check your connection and try again
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AutoRefresh interval={60000} />
      <MainDashboard
        analytics={analytics}
        pnodes={pnodes}
        estimatedCountries={estimatedCountries}
        aggregateStats={aggregateStats}
      />
    </>
  );
}
