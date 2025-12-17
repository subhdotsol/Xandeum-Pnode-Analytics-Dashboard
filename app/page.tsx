import { Server, Database, Cpu, HardDrive, Activity, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { pnodeClient } from "@/lib/pnode-client";
import { analyzeNetwork } from "@/lib/network-analytics";
import { NetworkHealthCard } from "@/components/dashboard/network-health-card";
import { MetricCard } from "@/components/dashboard/metric-card";
import { NodesTable } from "@/components/dashboard/nodes-table";
import { VersionDistribution } from "@/components/dashboard/version-distribution";
import { AutoRefresh } from "@/components/dashboard/auto-refresh";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
    <main className="min-h-screen">
      <AutoRefresh interval={60000} />

      {/* Premium Glass Header */}
      <div className="glass-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl border border-primary/30 glow-primary">
                <Activity className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold gradient-text-vibrant">
                  Xandeum Analytics
                </h1>
                <p className="text-sm text-muted-foreground font-medium">
                  Real-time Network Monitoring • {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-card/40 border border-border/50">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium">Live</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* Top Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Nodes"
            value={analytics.totals.total}
            icon={<Server className="w-6 h-6" />}
            colorClass="chart1"
            delay={0}
          />
          <MetricCard
            title="Health Score"
            value={`${analytics.health.score}/100`}
            icon={<Activity className="w-6 h-6" />}
            colorClass="accent"
            delay={0.1}
          />
          <MetricCard
            title="Network Storage"
            value={formatBytes(analytics.storage.totalCapacity)}
            icon={<Database className="w-6 h-6" />}
            colorClass="chart2"
            delay={0.2}
          />
          <MetricCard
            title="Avg CPU Usage"
            value={`${analytics.performance.averageCPU.toFixed(1)}%`}
            icon={<Cpu className="w-6 h-6" />}
            colorClass="chart3"
            delay={0.3}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Network Health (Larger) */}
          <div className="lg:col-span-2">
            <NetworkHealthCard
              score={analytics.health.score}
              totals={analytics.totals}
              health={analytics.health}
            />
          </div>

          {/* Right column - Version Distribution */}
          <div>
            <VersionDistribution
              distribution={analytics.versions.distribution}
              latest={analytics.versions.latest}
              outdatedCount={analytics.versions.outdatedCount}
              outdatedPercentage={analytics.versions.outdatedPercentage}
              total={analytics.totals.total}
            />
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Avg Storage/Node"
            value={formatBytes(analytics.storage.averagePerNode)}
            icon={<HardDrive className="w-6 h-6" />}
            colorClass="chart4"
            delay={0}
          />
          <MetricCard
            title="Storage Utilization"
            value={`${analytics.storage.utilizationPercentage.toFixed(1)}%`}
            icon={<Database className="w-6 h-6" />}
            colorClass="chart5"
            delay={0.1}
          />
          <MetricCard
            title="Avg RAM Usage"
            value={`${analytics.performance.averageRAM.toFixed(1)}%`}
            icon={<Cpu className="w-6 h-6" />}
            colorClass="primary"
            delay={0.2}
          />
        </div>

        {/* Nodes Table */}
        <NodesTable nodes={pnodes} />
      </div>
    </main>
  );
}
