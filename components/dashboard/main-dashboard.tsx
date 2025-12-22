"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Server, Globe, Package, MapPin, HardDrive, Cpu, Clock, Activity, FileText, Database, RefreshCw, Wifi, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NetworkHealthCard } from "@/components/dashboard/network-health-card";
import { NodesTable } from "@/components/dashboard/nodes-table";
import { VersionDistribution } from "@/components/dashboard/version-distribution";
import { ActivityGraph } from "@/components/dashboard/activity-graph";
import { HistoricalCharts } from "@/components/dashboard/historical-charts";
import { PerformanceCharts } from "@/components/dashboard/performance-charts";
import { Leaderboard } from "@/components/dashboard/leaderboard";
import { GeographicDistribution } from "@/components/dashboard/geographic-distribution";
import { GlobalNodeDistribution } from "@/components/dashboard/global-node-distribution";
import { GeographicInsights } from "@/components/dashboard/geographic-insights";
import { StatusDistribution } from "@/components/dashboard/status-distribution";
import { MarketDataCharts } from "@/components/dashboard/market-data-charts";
import { SwapWidget } from "@/components/swap-widget";
import { StakingWidget } from "@/components/staking-widget";
import { MapSkeleton } from "@/components/dashboard/skeletons";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarToggle } from "@/components/sidebar/sidebar-toggle";
import { formatBytes, formatUptime } from "@/lib/utils";
import type { NetworkAnalytics, PNodeInfo } from "@/types/pnode";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
    ssr: false,
    loading: () => <MapSkeleton />,
});

const DashboardNodeMap = dynamic(
    () => import("@/components/dashboard/dashboard-node-map").then(mod => ({ default: mod.DashboardNodeMap })),
    {
        ssr: false,
        loading: () => (
            <div className="h-[320px] bg-muted/50 rounded-lg flex items-center justify-center">
                <div className="animate-spin w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full" />
            </div>
        ),
    }
);

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
        totalPackets?: number;
        totalStreams?: number;
        publicRpcCount?: number;
    };
}

type TabType = "dashboard" | "analytics" | "leaderboard" | "map" | "nodes" | "swap" | "stake";

// Format large numbers (e.g., 293960000 -> "293.96M")
function formatLargeNumber(num: number): string {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toLocaleString();
}

const tabs: { id: TabType; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "analytics", label: "Analytics" },
    { id: "leaderboard", label: "Leaderboard" },
    { id: "map", label: "Map" },
    { id: "nodes", label: "Directory" },
    { id: "swap", label: "Swap" },
    { id: "stake", label: "Stake" },
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

// Analytics Tab with toggle between Historical and Performance
function AnalyticsTabContent() {
    const [view, setView] = useState<"historical" | "performance">("historical");

    return (
        <div className="space-y-6 max-w-[1400px]">
            {/* Header with Toggle */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                    {view === "historical" ? "Historical Analytics" : "Performance Metrics"}
                </h2>
                <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                    <button
                        onClick={() => setView("historical")}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${view === "historical"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Historical
                    </button>
                    <button
                        onClick={() => setView("performance")}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${view === "performance"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Performance
                    </button>
                </div>
            </div>

            {/* Content based on view with slide animation */}
            <div className="relative overflow-hidden">
                <div
                    className={`transition-transform duration-500 ease-in-out ${view === "historical" ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    {view === "historical" && <HistoricalCharts />}
                </div>
                <div
                    className={`transition-transform duration-500 ease-in-out ${view === "performance" ? "translate-x-0" : "translate-x-full"
                        } ${view === "historical" ? "absolute inset-0" : ""}`}
                >
                    {view === "performance" && <PerformanceCharts />}
                </div>
            </div>

            {/* Market Data Charts - Common to both views */}
            <MarketDataCharts />
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
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Sidebar persistence and keyboard shortcuts
    useEffect(() => {
        const saved = localStorage.getItem('sidebar-open');
        if (saved) setSidebarOpen(saved === 'true');

        const handleKeyDown = (e: KeyboardEvent) => {
            // Cmd/Ctrl + K for sidebar
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSidebarOpen(prev => !prev);
            }

            // Cmd/Ctrl + Space for AI assistant
            if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
                e.preventDefault();
                // Find and click the Ask AI button
                const askAiButton = document.querySelector('[aria-label="Ask AI"]') as HTMLButtonElement;
                if (askAiButton) {
                    askAiButton.click();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        localStorage.setItem('sidebar-open', sidebarOpen.toString());
    }, [sidebarOpen]);


    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsAgo((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const geoFetchStarted = useRef(false);

    useEffect(() => {
        // Start geo-fetching on dashboard tab (or map tab)
        if ((activeTab === "dashboard" || activeTab === "map") && !geoFetchStarted.current && pnodes.length > 0) {
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
    }, [activeTab, pnodes.length, pnodes]);

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
            {/* Sidebar */}
            <AppSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Sidebar Toggle - Only show when sidebar is closed */}
            {!sidebarOpen && <SidebarToggle onClick={() => setSidebarOpen(true)} />}

            {/* Main Content - Shifts when sidebar is open on desktop */}
            <div className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-[280px]' : 'ml-0'}`}>
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
                            <Link
                                href="/docs"
                                className="p-1.5 rounded-md hover:bg-muted transition-colors flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                            >
                                <BookOpen className="w-4 h-4" />
                                <span className="hidden sm:inline">Docs</span>
                            </Link>
                            <ThemeToggle />
                        </div>
                    </div>

                    <div className="text-center mb-4">
                        <h1 className="text-3xl font-bold tracking-tight mb-1">Xandeum pNode Analytics</h1>
                        <p className="text-muted-foreground">Real-time monitoring of the Xandeum distributed storage network</p>
                    </div>

                    {/* Tabs - Hidden when sidebar is open, smooth fade transition */}
                    <div
                        className={`flex justify-center mb-8 transition-all duration-200 ${sidebarOpen ? 'opacity-0 max-h-0 overflow-hidden' : 'opacity-100 max-h-20'
                            }`}
                    >
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
                        <div className="space-y-10">
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span>{analytics.totals.total} nodes active</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard title="Total Nodes" value={analytics.totals.total} subtitle="Active in cluster" icon={Server} />
                                <StatCard title="Online Status" value={analytics.health.healthy} subtitle={`${onlinePercentage}% operational`} icon={Globe} />
                                <StatCard title="Version Count" value={uniqueVersions} subtitle={`Latest: ${analytics.versions.latest}`} icon={Package} />
                                <StatCard title="Locations" value={estimatedCountries} subtitle="Countries worldwide" icon={MapPin} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                            {/* Activity Monitor + Network Health | Version Distribution */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column: Activity + Health */}
                                <div className="space-y-6">
                                    {/* Activity Monitor */}
                                    <Card className="border border-border bg-card">
                                        <CardContent className="p-6">
                                            <h3 className="text-sm font-medium mb-4">Activity Monitor</h3>
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-[#14F1C6]" />
                                                    <span className="text-xs text-muted-foreground">Packets</span>
                                                    <span className="text-sm font-medium ml-auto">{formatLargeNumber(aggregateStats.totalPackets || 0)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                                                    <span className="text-xs text-muted-foreground">Streams</span>
                                                    <span className="text-sm font-medium ml-auto">{(aggregateStats.totalStreams || 0).toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <ActivityGraph packets={aggregateStats.totalPackets || 0} streams={aggregateStats.totalStreams || 0} />
                                        </CardContent>
                                    </Card>

                                    {/* Status Distribution with pie chart */}
                                    <StatusDistribution totals={analytics.totals} publicRpcCount={aggregateStats.publicRpcCount || 0} />
                                </div>

                                {/* Right Column: Version Distribution (full height) */}
                                <div className="h-full">
                                    <VersionDistribution distribution={analytics.versions.distribution} latest={analytics.versions.latest} outdatedCount={analytics.versions.outdatedCount} outdatedPercentage={analytics.versions.outdatedPercentage} total={analytics.totals.total} />
                                </div>
                            </div>

                            {/* Geographic Distribution Section - Map + Network Health | Insights */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    <DashboardNodeMap
                                        nodes={pnodesWithGeo}
                                        isLoading={isLoadingGeo || (!geoLoadingComplete && pnodesWithGeo.length < totalNodes)}
                                        loadedCount={geoLoadedCount}
                                        totalCount={totalNodes}
                                    />
                                    {/* Network Health under the map */}
                                    <NetworkHealthCard score={analytics.health.score} totals={analytics.totals} health={analytics.health} />
                                </div>
                                <div className="lg:col-span-1">
                                    <GeographicInsights
                                        nodes={pnodesWithGeo}
                                        isLoading={isLoadingGeo}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "analytics" && (
                        <AnalyticsTabContent />
                    )}

                    {activeTab === "leaderboard" && (
                        <Leaderboard nodes={pnodes} />
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

                    {activeTab === "swap" && <SwapWidget />}

                    {activeTab === "stake" && <StakingWidget />}
                </main>
            </div>
        </div>
    );
}

