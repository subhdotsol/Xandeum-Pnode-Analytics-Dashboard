import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { PNodeStats } from "@/types/pnode";
import { pnodeClient } from "@/lib/pnode-client";
import { getNodeHealth } from "@/lib/network-analytics";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    RadialProgress,
    AnimatedStatCard,
    StorageHeatmap,
} from "./components";

async function getPNodeData(address: string) {
    try {
        const stats = await pnodeClient.getPNodeStats(address);

        if (!stats) {
            return null;
        }

        const version = await pnodeClient.getPNodeVersion(address);
        const health = getNodeHealth(stats.last_updated);

        return {
            success: true,
            data: {
                stats: {
                    ...stats,
                    version: version || "Unknown",
                },
                health,
            }
        };
    } catch (error) {
        console.error("Error fetching node data:", error);
        return null;
    }
}

async function getGeoLocation(ip: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/geo?ip=${ip}`,
            { cache: "no-store" }
        );
        const data = await res.json();
        if (data.status !== "fail") return data;
    } catch (error) {
        console.error("Geolocation error:", error);
    }
    return null;
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

function formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);

    return parts.join(" ") || "0m";
}

function getStatusVariant(status: string) {
    switch (status) {
        case "healthy":
            return "default";
        case "degraded":
            return "degraded";
        case "offline":
            return "offline";
        default:
            return "default";
    }
}

export default async function PNodeDetailPage({
    params,
}: {
    params: Promise<{ address: string }>;
}) {
    const { address } = await params;
    const decodedAddress = decodeURIComponent(address);

    const response = await getPNodeData(decodedAddress);

    if (!response || !response.success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
                <Card className="max-w-md">
                    <CardHeader className="text-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <CardTitle className="text-3xl">pNode Not Found</CardTitle>
                        <CardDescription>
                            Unable to fetch data for this node. It may be offline or unreachable.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-all"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const { stats, health } = response.data;
    const ip = decodedAddress.split(":")[0];
    const geoData = await getGeoLocation(ip);

    const cpuPercentage = Math.min(stats.cpu_percent, 100);
    const ramPercentage = Math.min((stats.ram_used / stats.ram_total) * 100, 100);
    const storagePercentage = Math.min((stats.total_bytes / stats.file_size) * 100, 100);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted pb-16">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
            </div>

            {/* Header */}
            <div className="sticky top-0 z-50 glass-card border-b backdrop-blur-xl">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all mb-4 hover:gap-3"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>

                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                                Node Analytics
                            </h1>
                            <div className="flex items-center gap-3 flex-wrap">
                                <code className="text-sm bg-muted px-4 py-2 rounded-lg border font-mono">
                                    {decodedAddress}
                                </code>
                                <Badge variant={getStatusVariant(health.status) as any} className="animate-pulse-slow">
                                    {health.icon} {health.text.toUpperCase()}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {/* Performance Rings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <RadialProgress
                        label="CPU Usage"
                        value={cpuPercentage}
                        icon="🖥️"
                        color="from-blue-500 to-cyan-500"
                    />
                    <RadialProgress
                        label="RAM Usage"
                        value={ramPercentage}
                        icon="💾"
                        color="from-purple-500 to-pink-500"
                    />
                    <RadialProgress
                        label="Storage"
                        value={storagePercentage}
                        icon="💿"
                        color="from-green-500 to-emerald-500"
                    />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <AnimatedStatCard
                        label="Total Data"
                        value={formatBytes(stats.total_bytes)}
                        icon="📊"
                        delay={0}
                    />
                    <AnimatedStatCard
                        label="Pages Processed"
                        value={stats.total_pages.toLocaleString()}
                        icon="📄"
                        delay={100}
                    />
                    <AnimatedStatCard
                        label="Active Streams"
                        value={stats.active_streams.toString()}
                        icon="⚡"
                        delay={200}
                    />
                    <AnimatedStatCard
                        label="Uptime"
                        value={formatUptime(stats.uptime)}
                        icon="⏱️"
                        delay={300}
                    />
                </div>

                {/* Detailed Information Tabs */}
                <Tabs defaultValue="system" className="space-y-6">
                    <TabsList className="glass-card">
                        <TabsTrigger value="system">System Info</TabsTrigger>
                        <TabsTrigger value="network">Network</TabsTrigger>
                        <TabsTrigger value="storage">Storage</TabsTrigger>
                        {geoData && <TabsTrigger value="location">Location</TabsTrigger>}
                    </TabsList>

                    {/* System Info Tab */}
                    <TabsContent value="system" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span>🖥️</span>
                                    System Information
                                </CardTitle>
                                <CardDescription>Hardware and software details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm text-muted-foreground">Gossip Address</label>
                                        <p className="font-mono text-sm">{decodedAddress}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-muted-foreground">RPC Address</label>
                                        <p className="font-mono text-sm">{ip}:6000</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-muted-foreground">Version</label>
                                        <p className="font-mono text-sm">{stats.version || "Unknown"}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-muted-foreground">Last Updated</label>
                                        <p className="text-sm">{new Date(stats.last_updated * 1000).toLocaleString()}</p>
                                    </div>
                                </div>

                                <Separator />

                                {/* CPU Progress */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">CPU Usage</span>
                                        <span className="font-semibold">{cpuPercentage.toFixed(1)}%</span>
                                    </div>
                                    <Progress value={cpuPercentage} className="h-2" />
                                </div>

                                {/* RAM Progress */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">RAM Usage</span>
                                        <span className="font-semibold">
                                            {formatBytes(stats.ram_used)} / {formatBytes(stats.ram_total)} ({ramPercentage.toFixed(1)}%)
                                        </span>
                                    </div>
                                    <Progress value={ramPercentage} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Network Tab */}
                    <TabsContent value="network" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span>📶</span>
                                    Network Activity
                                </CardTitle>
                                <CardDescription>Real-time network metrics</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-4 glass-card rounded-lg">
                                        <div className="text-3xl font-bold text-primary">{stats.active_streams}</div>
                                        <div className="text-xs text-muted-foreground mt-1">Active Streams</div>
                                    </div>
                                    <div className="text-center p-4 glass-card rounded-lg">
                                        <div className="text-3xl font-bold text-primary">{stats.packets_received}</div>
                                        <div className="text-xs text-muted-foreground mt-1">RX/s</div>
                                    </div>
                                    <div className="text-center p-4 glass-card rounded-lg">
                                        <div className="text-3xl font-bold text-primary">{stats.packets_sent}</div>
                                        <div className="text-xs text-muted-foreground mt-1">TX/s</div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Packets Received</span>
                                            <span className="font-mono">{stats.packets_received}/s</span>
                                        </div>
                                        <Progress
                                            value={(stats.packets_received / Math.max(stats.packets_received, stats.packets_sent)) * 100}
                                            className="h-2"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Packets Sent</span>
                                            <span className="font-mono">{stats.packets_sent}/s</span>
                                        </div>
                                        <Progress
                                            value={(stats.packets_sent / Math.max(stats.packets_received, stats.packets_sent)) * 100}
                                            className="h-2"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Storage Tab */}
                    <TabsContent value="storage" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span>💿</span>
                                    Storage Utilization
                                </CardTitle>
                                <CardDescription>Disk usage and capacity</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="text-center">
                                    <div className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
                                        {storagePercentage.toFixed(1)}%
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {formatBytes(stats.total_bytes)} / {formatBytes(stats.file_size)}
                                    </div>
                                </div>

                                <Progress value={storagePercentage} className="h-3" />

                                <Separator />

                                <StorageHeatmap percentage={storagePercentage} />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 glass-card rounded-lg">
                                        <div className="text-2xl font-bold text-primary">
                                            {formatBytes(stats.total_bytes)}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">Used</div>
                                    </div>
                                    <div className="text-center p-4 glass-card rounded-lg">
                                        <div className="text-2xl font-bold text-muted-foreground">
                                            {formatBytes(stats.file_size)}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">Capacity</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Location Tab */}
                    {geoData && (
                        <TabsContent value="location">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <span>🌍</span>
                                        Geographic Location
                                    </CardTitle>
                                    <CardDescription>IP-based geolocation data</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm text-muted-foreground">Country</label>
                                            <p className="text-lg font-semibold">{geoData.country}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-muted-foreground">City</label>
                                            <p className="text-lg font-semibold">{geoData.city}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-muted-foreground">Coordinates</label>
                                            <p className="font-mono text-sm">
                                                {geoData.lat.toFixed(4)}, {geoData.lon.toFixed(4)}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    )}
                </Tabs>
            </main>
        </div>
    );
}
