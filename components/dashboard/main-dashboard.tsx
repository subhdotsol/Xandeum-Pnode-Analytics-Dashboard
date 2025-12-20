"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Server, Globe, Package, MapPin, HardDrive, Cpu, Clock, Activity, FileText, Database, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NetworkHealthCard } from "@/components/dashboard/network-health-card";
import { NodesTable } from "@/components/dashboard/nodes-table";
import { VersionDistribution } from "@/components/dashboard/version-distribution";
import { formatBytes, formatUptime } from "@/lib/utils";
import type { NetworkAnalytics, PNodeInfo } from "@/types/pnode";

// Dynamically import map component (client-side only)
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
    ssr: false,
    loading: () => (
        <div className="h-[500px] bg-muted/50 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Loading map...</p>
        </div>
    ),
});

interface MainDashboardProps {
    analytics: NetworkAnalytics;
    pnodes: PNodeInfo[];
    estimatedCountries: number;
    aggregateStats: {
        totalStorage: number;
        totalRam: number;
        avgCpu: number;
        avgUptime: number;
        totalData: number;
        totalPages: number;
    };
}

type TabType = "dashboard" | "analytics" | "map" | "nodes";

const tabs: { id: TabType; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "analytics", label: "Analytics" },
    { id: "map", label: "Map" },
    { id: "nodes", label: "Nodes Data" },
];

// Stat Card Component
function StatCard({
    title,
    value,
    subtitle,
    icon: Icon
}: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ElementType;
}) {
    return (
        <Card className="border border-border bg-card">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{title}</p>
                        <p className="text-3xl font-bold">{value}</p>
                        <p className="text-xs text-muted-foreground">{subtitle}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted">
                        <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Metric Row Component
function MetricRow({ label, value, icon: Icon }: { label: string; value: string; icon?: React.ElementType }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div className="flex items-center gap-2">
                {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
                <span className="text-sm text-muted-foreground">{label}</span>
            </div>
            <span className="text-sm font-medium">{value}</span>
        </div>
    );
}

export function MainDashboard({ analytics, pnodes, estimatedCountries, aggregateStats }: MainDashboardProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>("dashboard");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [secondsAgo, setSecondsAgo] = useState(0);
    const [pnodesWithGeo, setPnodesWithGeo] = useState<any[]>([]);
    const [isLoadingGeo, setIsLoadingGeo] = useState(false);

    // Update seconds counter
    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsAgo((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Fetch geo data when map tab is selected (client-side only)
    useEffect(() => {
        if (activeTab === "map" && pnodesWithGeo.length === 0 && !isLoadingGeo) {
            setIsLoadingGeo(true);

            // Fetch geo for first 50 nodes only
            const fetchGeo = async () => {
                const geoPromises = pnodes.slice(0, 50).map(async (node) => {
                    try {
                        const ip = node.address.split(':')[0];
                        const res = await fetch(`/api/geo?ip=${ip}`);
                        if (res.ok) {
                            const geo = await res.json();
                            return { ...node, lat: geo.lat, lng: geo.lon, city: geo.city, country: geo.country };
                        }
                    } catch {
                        // Silently fail
                    }
                    return node;
                });

                const results = await Promise.all(geoPromises);
                setPnodesWithGeo(results);
                setIsLoadingGeo(false);
            };

            fetchGeo();
        }
    }, [activeTab, pnodes, pnodesWithGeo.length, isLoadingGeo]);

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        setSecondsAgo(0);
        router.refresh();
        setTimeout(() => setIsRefreshing(false), 1500);
    }, [router]);

    const formatTime = (seconds: number) => {
        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        return `${Math.floor(seconds / 3600)}h ago`;
    };

    const onlinePercentage = ((analytics.health.healthy / analytics.totals.total) * 100).toFixed(0);
    const uniqueVersions = Object.keys(analytics.versions.distribution).length;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-background sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center justify-between h-14">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <Image
                                src="/xandeum-logo.png"
                                alt="Xandeum"
                                width={28}
                                height={28}
                                className="rounded"
                            />
                            <span className="font-semibold">Xandeum</span>
                        </div>

                        {/* Center Tabs */}
                        <nav className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === tab.id
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>

                        {/* Right: Last Sync + Theme Toggle */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="text-xs hidden sm:inline">Last sync {formatTime(secondsAgo)}</span>
                                <button
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                    className="p-1.5 rounded-md hover:bg-muted transition-colors disabled:opacity-50"
                                    title="Refresh data"
                                >
                                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                </button>
                            </div>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Dashboard Tab */}
                {activeTab === "dashboard" && (
                    <div className="space-y-8">
                        {/* Header */}
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight mb-2">
                                Xandeum pNode Analytics
                            </h1>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span>{analytics.totals.total} nodes active</span>
                            </div>
                        </div>

                        {/* Primary Stats Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard
                                title="Total Nodes"
                                value={analytics.totals.total}
                                subtitle="Active in cluster"
                                icon={Server}
                            />
                            <StatCard
                                title="Online Status"
                                value={analytics.health.healthy}
                                subtitle={`${onlinePercentage}% operational`}
                                icon={Globe}
                            />
                            <StatCard
                                title="Version Count"
                                value={uniqueVersions}
                                subtitle={`Latest: ${analytics.versions.latest}`}
                                icon={Package}
                            />
                            <StatCard
                                title="Locations"
                                value={estimatedCountries}
                                subtitle="Countries worldwide"
                                icon={MapPin}
                            />
                        </div>

                        {/* Resources, Performance, Throughput Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="border border-border bg-card">
                                <CardContent className="p-6">
                                    <h3 className="text-sm font-medium mb-4">Resources</h3>
                                    <MetricRow
                                        label="Storage"
                                        value={formatBytes(aggregateStats.totalStorage)}
                                        icon={HardDrive}
                                    />
                                    <MetricRow
                                        label="RAM"
                                        value={formatBytes(aggregateStats.totalRam)}
                                        icon={Database}
                                    />
                                </CardContent>
                            </Card>

                            <Card className="border border-border bg-card">
                                <CardContent className="p-6">
                                    <h3 className="text-sm font-medium mb-4">Performance</h3>
                                    <MetricRow
                                        label="Avg CPU"
                                        value={`${aggregateStats.avgCpu.toFixed(1)}%`}
                                        icon={Cpu}
                                    />
                                    <MetricRow
                                        label="Uptime"
                                        value={formatUptime(aggregateStats.avgUptime)}
                                        icon={Clock}
                                    />
                                </CardContent>
                            </Card>

                            <Card className="border border-border bg-card">
                                <CardContent className="p-6">
                                    <h3 className="text-sm font-medium mb-4">Throughput</h3>
                                    <MetricRow
                                        label="Data"
                                        value={formatBytes(aggregateStats.totalData)}
                                        icon={Activity}
                                    />
                                    <MetricRow
                                        label="Pages"
                                        value={aggregateStats.totalPages.toLocaleString()}
                                        icon={FileText}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Network Health + Version Distribution */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <NetworkHealthCard
                                    score={analytics.health.score}
                                    totals={analytics.totals}
                                    health={analytics.health}
                                />
                            </div>
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
                )}

                {/* Analytics Tab */}
                {activeTab === "analytics" && (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center space-y-4">
                            <h2 className="text-2xl font-semibold">Analytics</h2>
                            <p className="text-muted-foreground">
                                Advanced analytics coming soon...
                            </p>
                        </div>
                    </div>
                )}

                {/* Map Tab */}
                {activeTab === "map" && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Network Map</h2>
                        <Card className="border border-border overflow-hidden">
                            <div className="h-[500px]">
                                {isLoadingGeo ? (
                                    <div className="h-full flex items-center justify-center bg-muted/50">
                                        <p className="text-muted-foreground">Loading node locations...</p>
                                    </div>
                                ) : (
                                    <MapComponent pnodes={pnodesWithGeo.length > 0 ? pnodesWithGeo : pnodes} />
                                )}
                            </div>
                        </Card>
                    </div>
                )}

                {/* Nodes Data Tab */}
                {activeTab === "nodes" && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Node Registry</h2>
                        <NodesTable nodes={pnodes} />
                    </div>
                )}
            </main>
        </div>
    );
}
