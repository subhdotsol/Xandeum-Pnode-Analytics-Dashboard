import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { PNodeStats } from "@/types/pnode";
import { pnodeClient } from "@/lib/pnode-client";
import { getNodeHealth } from "@/lib/network-analytics";
import {
    RadialProgress,
    AnimatedStatCard,
    GlassCard,
    InfoItem,
    MetricBox,
    AnimatedBar,
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

function getStatusColor(status: string) {
    switch (status) {
        case "healthy":
            return {
                bg: "bg-green-500/20",
                border: "border-green-500/50",
                text: "text-green-400",
                glow: "shadow-green-500/20"
            };
        case "degraded":
            return {
                bg: "bg-yellow-500/20",
                border: "border-yellow-500/50",
                text: "text-yellow-400",
                glow: "shadow-yellow-500/20"
            };
        case "offline":
            return {
                bg: "bg-red-500/20",
                border: "border-red-500/50",
                text: "text-red-400",
                glow: "shadow-red-500/20"
            };
        default:
            return {
                bg: "bg-primary/20",
                border: "border-primary/50",
                text: "text-primary",
                glow: "shadow-primary/20"
            };
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
                <div className="text-center max-w-md glass-card p-8 rounded-2xl border border-border/50">
                    <div className="text-6xl mb-4">🔍</div>
                    <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        pNode Not Found
                    </h1>
                    <p className="text-muted-foreground mb-6">
                        Unable to fetch data for this node. It may be offline or unreachable.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const { stats, health } = response.data;
    const ip = decodedAddress.split(":")[0];
    const geoData = await getGeoLocation(ip);
    const statusColors = getStatusColor(health.status);

    const cpuPercentage = Math.min(stats.cpu_percent, 100);
    const ramPercentage = Math.min((stats.ram_used / stats.ram_total) * 100, 100);
    const storagePercentage = Math.min((stats.total_bytes / stats.file_size) * 100, 100);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted pb-16">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
            </div>

            {/* Header */}
            <div className="sticky top-0 z-50 glass-card border-b border-border/50 backdrop-blur-xl">
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
                            <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                                Node Analytics
                            </h1>
                            <div className="flex items-center gap-3 flex-wrap">
                                <code className="text-sm glass-card px-4 py-2 rounded-lg border border-border/50 font-mono backdrop-blur-sm">
                                    {decodedAddress}
                                </code>
                                <span
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border ${statusColors.border} ${statusColors.bg} ${statusColors.text} backdrop-blur-sm animate-pulse-slow shadow-lg ${statusColors.glow}`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${health.status === 'healthy' ? 'bg-green-400' : health.status === 'degraded' ? 'bg-yellow-400' : 'bg-red-400'} animate-ping absolute`}></span>
                                    <span className={`w-2 h-2 rounded-full ${health.status === 'healthy' ? 'bg-green-400' : health.status === 'degraded' ? 'bg-yellow-400' : 'bg-red-400'} relative`}></span>
                                    {health.text.toUpperCase()}
                                </span>
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

                {/* Stats Grid */}
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

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Node Information - Spans 2 columns */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* System Info */}
                        <GlassCard title="System Information" icon="🖥️">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoItem label="Gossip Address" value={decodedAddress} />
                                <InfoItem label="RPC Address" value={`${ip}:6000`} />
                                <InfoItem label="Version" value={stats.version || "Unknown"} />
                                <InfoItem label="CPU Cores" value={`${stats.cpu_percent.toFixed(1)}%`} />
                                <InfoItem
                                    label="RAM"
                                    value={`${formatBytes(stats.ram_used)} / ${formatBytes(stats.ram_total)}`}
                                />
                                <InfoItem label="Last Updated" value={new Date(stats.last_updated * 1000).toLocaleString()} />
                            </div>
                        </GlassCard>

                        {/* Network Activity */}
                        <GlassCard title="Network Activity" icon="📶">
                            <div className="space-y-6">
                                <div className="grid grid-cols-3 gap-4">
                                    <MetricBox
                                        label="Streams"
                                        value={stats.active_streams}
                                        color="from-blue-500 to-cyan-500"
                                    />
                                    <MetricBox
                                        label="RX/s"
                                        value={stats.packets_received}
                                        color="from-green-500 to-emerald-500"
                                    />
                                    <MetricBox
                                        label="TX/s"
                                        value={stats.packets_sent}
                                        color="from-orange-500 to-red-500"
                                    />
                                </div>

                                {/* Network Activity Bars */}
                                <div className="space-y-4">
                                    <AnimatedBar
                                        label="Packets Received"
                                        value={stats.packets_received}
                                        max={Math.max(stats.packets_received, stats.packets_sent)}
                                        color="bg-gradient-to-r from-green-500 to-emerald-500"
                                    />
                                    <AnimatedBar
                                        label="Packets Sent"
                                        value={stats.packets_sent}
                                        max={Math.max(stats.packets_received, stats.packets_sent)}
                                        color="bg-gradient-to-r from-orange-500 to-red-500"
                                    />
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Location */}
                        {geoData && (
                            <GlassCard title="Location" icon="🌍">
                                <div className="space-y-3">
                                    <InfoItem label="Country" value={geoData.country} />
                                    <InfoItem label="City" value={geoData.city} />
                                    <InfoItem label="Coordinates" value={`${geoData.lat.toFixed(4)}, ${geoData.lon.toFixed(4)}`} />
                                </div>
                            </GlassCard>
                        )}

                        {/* Storage Heatmap */}
                        <GlassCard title="Storage Utilization" icon="💿">
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
                                        {storagePercentage.toFixed(1)}%
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {formatBytes(stats.total_bytes)} / {formatBytes(stats.file_size)}
                                    </div>
                                </div>

                                {/* Storage visualization */}
                                <StorageHeatmap percentage={storagePercentage} />
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </main>
        </div>
    );
}

