import { pnodeClient } from "@/lib/pnode-client";
import { analyzeNetwork, getNodeHealth } from "@/lib/network-analytics";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { Tag } from "@/components/ui/tag";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VersionIntelligenceClient } from "./version-intelligence-client";
import { compareVersions } from "@/lib/utils";
import {
    PackageCheck,
    AlertTriangle,
    CheckCircle,
    ArrowUpCircle,
    Clock,
    Server,
} from "lucide-react";

async function getVersionData() {
    try {
        const pnodes = await pnodeClient.getAllPNodes();
        const analytics = analyzeNetwork(pnodes);

        // Build version details with node list
        const versionDetails: Record<
            string,
            {
                count: number;
                nodes: Array<{
                    address: string;
                    health: string;
                    lastSeen: number;
                }>;
            }
        > = {};

        pnodes.forEach((node) => {
            const version = node.version || "unknown";
            if (!versionDetails[version]) {
                versionDetails[version] = { count: 0, nodes: [] };
            }
            versionDetails[version].count++;
            versionDetails[version].nodes.push({
                address: node.address,
                health: getNodeHealth(node.last_seen_timestamp).status,
                lastSeen: node.last_seen_timestamp,
            });
        });

        // Get outdated nodes list
        const outdatedNodes = pnodes
            .filter(
                (node) =>
                    node.version &&
                    node.version !== "unknown" &&
                    compareVersions(node.version, analytics.versions.latest) < 0
            )
            .map((node) => ({
                address: node.address,
                version: node.version,
                health: getNodeHealth(node.last_seen_timestamp).status,
                lastSeen: node.last_seen_timestamp,
            }));

        return {
            analytics,
            versionDetails,
            outdatedNodes,
            totalNodes: pnodes.length,
        };
    } catch (error) {
        console.error("Error fetching version data:", error);
        return null;
    }
}

export default async function VersionIntelligencePage() {
    const data = await getVersionData();

    if (!data) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <h2 className="text-2xl font-bold">Failed to load version data</h2>
                        <p className="text-muted-foreground">
                            Please check your connection and try again
                        </p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const { analytics, versionDetails, outdatedNodes, totalNodes } = data;
    const upToDateCount = totalNodes - analytics.versions.outdatedCount;
    const upToDatePercentage = ((upToDateCount / totalNodes) * 100).toFixed(1);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <div className="container mx-auto px-4 py-12 md:py-16">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <Tag>Network Intelligence</Tag>
                        <h1 className="text-4xl md:text-6xl font-bold gradient-text-vibrant">
                            Version Intelligence
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                            Deep dive into pNode version distribution, identify outdated nodes,
                            and track network-wide upgrade progress.
                        </p>
                    </div>
                </div>

                {/* Key Stats */}
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="glass-card-strong border-border">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <PackageCheck className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{analytics.versions.latest}</p>
                                        <p className="text-sm text-muted-foreground">Latest Version</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-card-strong border-border">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{upToDatePercentage}%</p>
                                        <p className="text-sm text-muted-foreground">Up to Date</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-card-strong border-border">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                                        <AlertTriangle className="w-6 h-6 text-yellow-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{analytics.versions.outdatedCount}</p>
                                        <p className="text-sm text-muted-foreground">Outdated Nodes</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-card-strong border-border">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                        <Server className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">
                                            {Object.keys(analytics.versions.distribution).length}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Unique Versions</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Version Distribution Dominance Warning */}
                {analytics.risks.singleVersionDominance && (
                    <div className="container mx-auto px-4 py-4">
                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <div className="flex items-start gap-3">
                                <ArrowUpCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-blue-500">
                                        High Version Consistency
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Over 80% of nodes are running the same version. This is great for
                                        network consistency but consider monitoring for any version that
                                        falls behind.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Interactive Charts and Tables */}
                <VersionIntelligenceClient
                    versionDistribution={analytics.versions.distribution}
                    latestVersion={analytics.versions.latest}
                    versionDetails={versionDetails}
                    outdatedNodes={outdatedNodes}
                    totalNodes={totalNodes}
                />

                {/* Recommendations */}
                <div className="container mx-auto px-4 py-8">
                    <Card className="glass-card-strong border-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" />
                                Recommendations
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {analytics.versions.outdatedPercentage > 20 ? (
                                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                    <p className="text-sm font-medium text-yellow-500">
                                        ⚠️ High number of outdated nodes detected
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {analytics.versions.outdatedPercentage.toFixed(1)}% of nodes are
                                        running outdated versions. Node operators should upgrade to v
                                        {analytics.versions.latest} for optimal performance and security.
                                    </p>
                                </div>
                            ) : analytics.versions.outdatedPercentage > 5 ? (
                                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                    <p className="text-sm font-medium text-blue-500">
                                        📊 Some nodes need updates
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {analytics.versions.outdatedCount} nodes are running older
                                        versions. Consider reaching out to operators to encourage upgrades.
                                    </p>
                                </div>
                            ) : (
                                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                                    <p className="text-sm font-medium text-green-500">
                                        ✅ Network is well-maintained
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        The vast majority of nodes are running the latest version. Great
                                        job keeping the network up to date!
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
}
