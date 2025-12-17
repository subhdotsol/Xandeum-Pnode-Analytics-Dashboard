import { Server, Database, Cpu, HardDrive, Activity } from "lucide-react";
import { pnodeClient } from "@/lib/pnode-client";
import { analyzeNetwork } from "@/lib/network-analytics";
import { NetworkHealthCard } from "@/components/dashboard/network-health-card";
import { NodesTable } from "@/components/dashboard/nodes-table";
import { VersionDistribution } from "@/components/dashboard/version-distribution";
import { AutoRefresh } from "@/components/dashboard/auto-refresh";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { FeatureCard } from "@/components/ui/feature-card";
import { Tag } from "@/components/ui/tag";
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
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Failed to load network data</h2>
            <p className="text-muted-foreground">
              Please check your connection and try again
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AutoRefresh interval={60000} />
      <Navbar />

      <main className="flex-1">
        {/* Hero Section with Tag */}
        <div id="dashboard" className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Tag>Real-time Network Monitoring</Tag>
            <h1 className="text-4xl md:text-6xl font-bold gradient-text-vibrant">
              Xandeum pNode Analytics
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Monitor and visualize the health, distribution, and performance of
              pNodes in the Xandeum distributed storage network.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-muted-foreground">
                Live • {analytics.totals.total} nodes online
              </span>
            </div>
          </div>
        </div>

        {/* Stats Overview - Feature Cards */}
        <div id="analytics" className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              title="Total Nodes"
              description="Active pNodes in the network"
              icon={<Server className="w-6 h-6" />}
              value={analytics.totals.total}
            />
            <FeatureCard
              title="Health Score"
              description="Overall network health rating"
              icon={<Activity className="w-6 h-6" />}
              value={`${analytics.health.score}/100`}
            />
            <FeatureCard
              title="Network Storage"
              description={`${analytics.storage.utilizationPercentage.toFixed(1)}% utilized`}
              icon={<Database className="w-6 h-6" />}
              value={formatBytes(analytics.storage.totalCapacity)}
            />
            <FeatureCard
              title="Avg CPU Usage"
              description="Across all active nodes"
              icon={<Cpu className="w-6 h-6" />}
              value={`${analytics.performance.averageCPU.toFixed(1)}%`}
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div id="network" className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Network Health Card - larger */}
            <div className="lg:col-span-2">
              <NetworkHealthCard
                score={analytics.health.score}
                totals={analytics.totals}
                health={analytics.health}
              />
            </div>

            {/* Version Distribution */}
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
        </div>

        {/* Additional Stats */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              title="Avg Storage/Node"
              description="Per node storage capacity"
              icon={<HardDrive className="w-6 h-6" />}
              value={formatBytes(analytics.storage.averagePerNode)}
            />
            <FeatureCard
              title="Storage Utilization"
              description="Network-wide storage usage"
              icon={<Database className="w-6 h-6" />}
              value={`${analytics.storage.utilizationPercentage.toFixed(1)}%`}
            />
            <FeatureCard
              title="Avg RAM Usage"
              description="Average memory consumption"
              icon={<Cpu className="w-6 h-6" />}
              value={`${analytics.performance.averageRAM.toFixed(1)}%`}
            />
          </div>
        </div>

        {/* Nodes Table */}
        <div id="nodes" className="container mx-auto px-4 py-8">
          <NodesTable nodes={pnodes} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
