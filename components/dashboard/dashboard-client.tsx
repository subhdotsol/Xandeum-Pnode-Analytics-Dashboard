"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Server, Globe, Package, MapPin, HardDrive, Cpu, Clock, Activity, FileText, Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatBytes, formatUptime } from "@/lib/utils";
import { LastSync } from "./last-sync";
import { VersionChart } from "./version-chart";
import { ActivityCard } from "./activity-card";
import type { NetworkAnalytics } from "@/types/pnode";

interface DashboardClientProps {
    analytics: NetworkAnalytics;
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

export function DashboardClient({ analytics, estimatedCountries, aggregateStats }: DashboardClientProps) {
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        router.refresh();
        // Reset after a short delay
        setTimeout(() => setIsRefreshing(false), 1500);
    }, [router]);

    const onlinePercentage = ((analytics.health.healthy / analytics.totals.total) * 100).toFixed(0);
    const uniqueVersions = Object.keys(analytics.versions.distribution).length;

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
            {/* Header with Last Sync */}
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Xandeum pNode Analytics
                    </h1>
                    <p className="text-muted-foreground">
                        Real-time monitoring of the Xandeum distributed storage network
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-muted-foreground">{analytics.totals.total} nodes</span>
                    </div>
                    <LastSync onRefresh={handleRefresh} isRefreshing={isRefreshing} />
                </div>
            </div>

            {/* Primary Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Resources Card */}
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

                {/* Performance Card */}
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

                {/* Throughput Card */}
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

            {/* Version Chart & Activity Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <VersionChart distribution={analytics.versions.distribution} />
                <ActivityCard />
            </div>
        </div>
    );
}
