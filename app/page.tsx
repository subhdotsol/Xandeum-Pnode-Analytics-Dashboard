import { pnodeClient } from "@/lib/pnode-client";
import { analyzeNetwork } from "@/lib/network-analytics";
import { NetworkHealthCard } from "@/components/dashboard/network-health-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { NodesTable } from "@/components/dashboard/nodes-table";
import { VersionDistribution } from "@/components/dashboard/version-distribution";
import { AutoRefresh } from "@/components/dashboard/auto-refresh";
import { formatBytes } from "@/lib/utils";

async function getNetworkData() {
  try {
    const pnodes = await pnodeClient.getAllPNodes();
    const analytics = analyzeNetwork(pnodes);

    return {
      pnodes,
      analytics,
    };
  } catch (error) {
    console.error("Error fetching network data:", error);
    return {
      pnodes: [],
      analytics: null,
    };
  }
}

export default async function HomePage() {
  const { pnodes, analytics } = await getNetworkData();

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Failed to load network data</h2>
          <p className="text-muted-foreground">
            Please check your connection and try again
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <AutoRefresh interval={60000} />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-5xl md:text-7xl font-bold gradient-text">
            Xandeum Analytics
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time monitoring and visualization of the Xandeum distributed
            storage network
          </p>
        </div>

        {/* Network Health Card */}
        <div className="max-w-2xl mx-auto">
          <NetworkHealthCard
            score={analytics.health.score}
            totals={analytics.totals}
            health={analytics.health}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Nodes"
            value={analytics.totals.total}
            subtitle="Active pNodes"
            iconName="Server"
            delay={0}
          />
          <StatCard
            title="Network Storage"
            value={formatBytes(analytics.storage.totalCapacity)}
            subtitle={`${analytics.storage.utilizationPercentage.toFixed(1)}% utilized`}
            iconName="Database"
            delay={0.1}
          />
          <StatCard
            title="Avg CPU Usage"
            value={`${analytics.performance.averageCPU.toFixed(1)}%`}
            subtitle="Across all nodes"
            iconName="Cpu"
            delay={0.2}
          />
          <StatCard
            title="Avg Storage/Node"
            value={formatBytes(analytics.storage.averagePerNode)}
            subtitle="Per node capacity"
            iconName="HardDrive"
            delay={0.3}
          />
        </div>

        {/* Version Distribution */}
        <div className="max-w-2xl mx-auto">
          <VersionDistribution
            distribution={analytics.versions.distribution}
            latest={analytics.versions.latest}
            outdatedCount={analytics.versions.outdatedCount}
            outdatedPercentage={analytics.versions.outdatedPercentage}
            total={analytics.totals.total}
          />
        </div>

        {/* Nodes Table */}
        <NodesTable nodes={pnodes} />

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground py-8">
          <p>Last updated: {new Date().toLocaleString()}</p>
          <p className="mt-2">Auto-refreshing every 60 seconds</p>
        </div>
      </div>
    </main>
  );
}
