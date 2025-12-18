import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { PNodeStats } from "@/types/pnode";
import { pnodeClient } from "@/lib/pnode-client";
import { getNodeHealth } from "@/lib/network-analytics";

async function getPNodeData(address: string) {
    try {
        // Directly call pnodeClient instead of HTTP fetch (avoids ECONNREFUSED in SSR)
        const stats = await pnodeClient.getPNodeStats(address);

        if (!stats) {
            return null;
        }

        // Get version separately
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

function getStatusColor(health: any) {
    switch (health.status) {
        case "healthy":
            return "border-green-500/50 bg-green-500/10";
        case "degraded":
            return "border-yellow-500/50 bg-yellow-500/10";
        case "offline":
            return "border-red-500/50 bg-red-500/10";
        default:
            return "border-border/50 bg-card/10";
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
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <h1 className="text-3xl font-bold mb-4">pNode Not Found</h1>
                    <p className="text-muted-foreground mb-6">
                        Unable to fetch data for this node. It may be offline or unreachable.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
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

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>

                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold mb-3">Node Details</h1>
                            <div className="flex items-center gap-3 flex-wrap">
                                <code className="text-sm bg-muted px-3 py-1.5 rounded border font-mono">
                                    {decodedAddress}
                                </code>
                                <span
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(health)}`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${health.status === 'healthy' ? 'bg-green-500' : health.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                                    {health.text}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Top Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        label="Storage Used"
                        value={formatBytes(stats.total_bytes)}
                        icon="💾"
                    />
                    <StatCard
                        label="Total Pages"
                        value={stats.total_pages.toLocaleString()}
                        icon="📊"
                    />
                    <StatCard
                        label="Active Streams"
                        value={stats.active_streams.toString()}
                        icon="⚡"
                    />
                    <StatCard
                        label="Uptime"
                        value={formatUptime(stats.uptime)}
                        icon="⏱️"
                    />
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Node Information */}
                    <div className="bg-card border rounded-lg p-6 hover:border-primary/50 transition-colors">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <span>🖥️</span>
                            Node Information
                        </h2>

                        <div className="space-y-3">
                            <InfoRow label="Gossip Address" value={decodedAddress} />
                            <InfoRow label="RPC Address" value={`${ip}:6000`} />
                            <InfoRow label="Version" value={stats.version || "Unknown"} />
                            <InfoRow label="CPU Usage" value={`${stats.cpu_percent.toFixed(1)}%`} />
                            <InfoRow
                                label="RAM Usage"
                                value={`${formatBytes(stats.ram_used)} / ${formatBytes(stats.ram_total)}`}
                            />
                            <InfoRow label="Packets RX" value={`${stats.packets_received}/s`} />
                            <InfoRow label="Packets TX" value={`${stats.packets_sent}/s`} />
                        </div>
                    </div>

                    {/* Location */}
                    {geoData && (
                        <div className="bg-card border rounded-lg p-6 hover:border-primary/50 transition-colors">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <span>🌍</span>
                                Location
                            </h2>

                            <div className="space-y-3">
                                <InfoRow label="Country" value={geoData.country} />
                                <InfoRow label="City" value={geoData.city} />
                                <InfoRow label="Coordinates" value={`${geoData.lat}, ${geoData.lon}`} />
                            </div>
                        </div>
                    )}

                    {/* Storage Stats */}
                    <div className="bg-card border rounded-lg p-6 hover:border-primary/50 transition-colors">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <span>💿</span>
                            Storage Statistics
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                                    <span>Utilization</span>
                                    <span>
                                        {((stats.total_bytes / stats.file_size) * 100).toFixed(1)}%
                                    </span>
                                </div>
                                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                                    <div
                                        className="h-2 bg-primary transition-all duration-500"
                                        style={{
                                            width: `${Math.min((stats.total_bytes / stats.file_size) * 100, 100)}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="text-center p-4 bg-muted rounded-lg">
                                    <div className="text-2xl font-bold text-primary">
                                        {formatBytes(stats.total_bytes)}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">Used</div>
                                </div>
                                <div className="text-center p-4 bg-muted rounded-lg">
                                    <div className="text-2xl font-bold text-muted-foreground">
                                        {formatBytes(stats.file_size)}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">Capacity</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Network Activity */}
                    <div className="bg-card border rounded-lg p-6 hover:border-primary/50 transition-colors">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <span>📶</span>
                            Network Activity
                        </h2>

                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="text-center p-3 bg-muted rounded-lg">
                                <div className="text-2xl font-bold text-primary">
                                    {stats.active_streams}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">Streams</div>
                            </div>
                            <div className="text-center p-3 bg-muted rounded-lg">
                                <div className="text-2xl font-bold text-primary">
                                    {stats.packets_received}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">RX/s</div>
                            </div>
                            <div className="text-center p-3 bg-muted rounded-lg">
                                <div className="text-2xl font-bold text-primary">
                                    {stats.packets_sent}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">TX/s</div>
                            </div>
                        </div>

                        <div className="bg-muted rounded-lg p-3 text-center">
                            <div className="text-xs text-muted-foreground">Last Updated</div>
                            <div className="text-sm font-medium mt-1">
                                {new Date(stats.last_updated * 1000).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="mt-6 bg-card border rounded-lg p-6 hover:border-primary/50 transition-colors">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span>📈</span>
                        Performance Metrics
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <div className="flex justify-between text-sm text-muted-foreground mb-2">
                                <span>CPU Usage</span>
                                <span>{stats.cpu_percent.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-2 bg-primary transition-all"
                                    style={{ width: `${Math.min(stats.cpu_percent, 100)}%` }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm text-muted-foreground mb-2">
                                <span>RAM Usage</span>
                                <span>
                                    {((stats.ram_used / stats.ram_total) * 100).toFixed(1)}%
                                </span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-2 bg-primary transition-all"
                                    style={{
                                        width: `${Math.min((stats.ram_used / stats.ram_total) * 100, 100)}%`,
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm text-muted-foreground mb-2">
                                <span>Storage</span>
                                <span>
                                    {((stats.total_bytes / stats.file_size) * 100).toFixed(1)}%
                                </span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-2 bg-primary transition-all"
                                    style={{
                                        width: `${Math.min((stats.total_bytes / stats.file_size) * 100, 100)}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: string;
}) {
    return (
        <div className="bg-card border rounded-lg p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-muted-foreground mb-1">{label}</p>
                    <p className="text-xl font-bold">{value}</p>
                </div>
                <div className="text-3xl opacity-60">{icon}</div>
            </div>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between py-2 border-b last:border-0">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-mono text-right break-all max-w-[60%]">
                {value}
            </span>
        </div>
    );
}
