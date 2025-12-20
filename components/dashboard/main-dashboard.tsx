"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Server, Globe, Package, MapPin, HardDrive, Cpu, Clock, Activity, FileText, Database, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NetworkHealthCard } from "@/components/dashboard/network-health-card";
import { NodesTable } from "@/components/dashboard/nodes-table";
import { VersionDistribution } from "@/components/dashboard/version-distribution";
import { MapSkeleton } from "@/components/dashboard/skeletons";
import { formatBytes, formatUptime } from "@/lib/utils";
import type { NetworkAnalytics, PNodeInfo } from "@/types/pnode";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
    ssr: false,
    loading: () => <MapSkeleton />,
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
    { id: "nodes", label: "Registry" },
];

function StatCard({ title, value, subtitle, icon: Icon }: { title: string; value: string | number; subtitle: string; icon: React.ElementType }) {
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
    const [geoLoadedCount, setGeoLoadedCount] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [geoLoadingComplete, setGeoLoadingComplete] = useState(false);
    const totalNodes = pnodes.length;

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsAgo((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const geoFetchStarted = useRef(false);

    useEffect(() => {
        if (activeTab === "map" && !geoFetchStarted.current && pnodes.length > 0) {
            geoFetchStarted.current = true;
            setIsLoadingGeo(true);
            setGeoLoadedCount(0);

            const fetchGeo = async () => {
                const BATCH_SIZE = 20;
                const results: any[] = [];
                const nodesToFetch = [...pnodes]; // Copy to avoid issues

                for (let i = 0; i < nodesToFetch.length; i += BATCH_SIZE) {
                    const batch = nodesToFetch.slice(i, i + BATCH_SIZE);

                    // Fetch batch in parallel
                    const batchPromises = batch.map(async (node) => {
                        try {
                            const ip = node.address.split(':')[0];
                            const res = await fetch(`/api/geo?ip=${ip}`);
                            if (res.ok) {
                                const geo = await res.json();
                                return { ...node, lat: geo.lat, lng: geo.lon, city: geo.city, country: geo.country };
                            }
                        } catch { }
                        return node;
                    });

                    const batchResults = await Promise.all(batchPromises);
                    results.push(...batchResults);

                    setGeoLoadedCount(results.length);
                    setPnodesWithGeo([...results]);

                    // After first batch, hide loading spinner and show toast
                    if (i === 0) {
                        setIsLoadingGeo(false);
                        setShowToast(true);
                    }
                }

                setGeoLoadingComplete(true);
                setTimeout(() => setShowToast(false), 3000);
            };
            fetchGeo();
        }
    }, [activeTab, pnodes.length]);

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        setSecondsAgo(0);
        window.location.reload();
    }, []);

    const formatTime = (seconds: number) => {
        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        return `${Math.floor(seconds / 3600)}h ago`;
    };

    const onlinePercentage = ((analytics.health.healthy / analytics.totals.total) * 100).toFixed(0);
    const uniqueVersions = Object.keys(analytics.versions.distribution).length;

    return (
        <div className="min-h-screen bg-background">
            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Image src="/icon.png" alt="Xandeum" width={32} height={32} className="rounded" />
                        <span className="font-semibold text-lg">Xandeum</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Last sync {formatTime(secondsAgo)}</span>
                        <button onClick={handleRefresh} disabled={isRefreshing} className="p-1.5 rounded-md hover:bg-muted transition-colors disabled:opacity-50">
                            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </button>
                        <ThemeToggle />
                    </div>
                </div>

                <div className="text-center mb-4">
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Xandeum pNode Analytics</h1>
                    <p className="text-muted-foreground">Real-time monitoring of the Xandeum distributed storage network</p>
                </div>

                <div className="flex justify-center mb-8">
                    <nav className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === tab.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {activeTab === "dashboard" && (
                    <div className="space-y-8">
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span>{analytics.totals.total} nodes active</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard title="Total Nodes" value={analytics.totals.total} subtitle="Active in cluster" icon={Server} />
                            <StatCard title="Online Status" value={analytics.health.healthy} subtitle={`${onlinePercentage}% operational`} icon={Globe} />
                            <StatCard title="Version Count" value={uniqueVersions} subtitle={`Latest: ${analytics.versions.latest}`} icon={Package} />
                            <StatCard title="Locations" value={estimatedCountries} subtitle="Countries worldwide" icon={MapPin} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="border border-border bg-card">
                                <CardContent className="p-6">
                                    <h3 className="text-sm font-medium mb-4">Resources</h3>
                                    <MetricRow label="Storage" value={formatBytes(aggregateStats.totalStorage)} icon={HardDrive} />
                                    <MetricRow label="RAM" value={formatBytes(aggregateStats.totalRam)} icon={Database} />
                                </CardContent>
                            </Card>
                            <Card className="border border-border bg-card">
                                <CardContent className="p-6">
                                    <h3 className="text-sm font-medium mb-4">Performance</h3>
                                    <MetricRow label="Avg CPU" value={`${aggregateStats.avgCpu.toFixed(1)}%`} icon={Cpu} />
                                    <MetricRow label="Uptime" value={formatUptime(aggregateStats.avgUptime)} icon={Clock} />
                                </CardContent>
                            </Card>
                            <Card className="border border-border bg-card">
                                <CardContent className="p-6">
                                    <h3 className="text-sm font-medium mb-4">Throughput</h3>
                                    <MetricRow label="Data" value={formatBytes(aggregateStats.totalData)} icon={Activity} />
                                    <MetricRow label="Pages" value={aggregateStats.totalPages.toLocaleString()} icon={FileText} />
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <NetworkHealthCard score={analytics.health.score} totals={analytics.totals} health={analytics.health} />
                            </div>
                            <div>
                                <VersionDistribution distribution={analytics.versions.distribution} latest={analytics.versions.latest} outdatedCount={analytics.versions.outdatedCount} outdatedPercentage={analytics.versions.outdatedPercentage} total={analytics.totals.total} />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "analytics" && (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center space-y-4">
                            <h2 className="text-2xl font-semibold">Analytics</h2>
                            <p className="text-muted-foreground">Advanced analytics coming soon...</p>
                        </div>
                    </div>
                )}

                {activeTab === "map" && (
                    <>
                        {isLoadingGeo ? (
                            <Card className="border border-border overflow-hidden rounded-xl">
                                <div className="h-[700px] flex flex-col items-center justify-center bg-muted/30">
                                    <div className="animate-spin w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full mb-4" />
                                    <p className="text-lg font-medium mb-2">Loading node locations...</p>
                                    <p className="text-muted-foreground">{geoLoadedCount} out of {totalNodes} nodes loaded</p>
                                </div>
                            </Card>
                        ) : (
                            <Card className="border border-border overflow-hidden rounded-xl">
                                <div className="h-[700px]">
                                    <MapComponent pnodes={pnodesWithGeo.length > 0 ? pnodesWithGeo : pnodes} />
                                </div>
                            </Card>
                        )}

                        {/* Progress Toast */}
                        {showToast && !geoLoadingComplete && (
                            <div className="fixed bottom-4 right-4 bg-card border border-border rounded-lg shadow-lg p-4 z-50 min-w-[280px]">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="animate-spin w-4 h-4 border-2 border-foreground/20 border-t-foreground rounded-full" />
                                    <span className="text-sm font-medium">Loading nodes...</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-foreground/70 rounded-full transition-all duration-300"
                                            style={{ width: `${(geoLoadedCount / totalNodes) * 100}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground text-right">{geoLoadedCount} / {totalNodes}</p>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {activeTab === "nodes" && <NodesTable nodes={pnodes} />}
            </main>
        </div>
    );
}

