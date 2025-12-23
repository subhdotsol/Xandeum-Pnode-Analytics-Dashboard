"use client";

import { useState, useEffect, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, AreaChart, Area } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, HardDrive, Network, Activity, Loader2, RefreshCw } from "lucide-react";
import type { PNodeInfo } from "@/types/pnode";

interface NodePerformanceData {
    label: string;
    value: number;
    incoming?: number;
    outgoing?: number;
}

interface PerformanceCardProps {
    title: string;
    description: string;
    currentValue: string;
    icon: React.ReactNode;
    color: string;
    data: NodePerformanceData[];
    isLoading?: boolean;
    showDualBars?: boolean;
}

function PerformanceCard({
    title,
    description,
    currentValue,
    icon,
    color,
    data,
    isLoading = false,
    showDualBars = false,
}: PerformanceCardProps) {
    if (isLoading) {
        return (
            <Card className="border border-border bg-card">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">{icon} {title}</CardTitle>
                    <p className="text-xs text-muted-foreground">Loading...</p>
                </CardHeader>
                <CardContent className="h-[280px] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    const tooltipStyle = {
        backgroundColor: 'hsl(var(--card))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '8px',
        fontSize: '12px',
        color: 'hsl(var(--foreground))',
    };

    return (
        <Card className="border border-border bg-card">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base flex items-center gap-2 text-foreground">
                            {icon} {title}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                    <div className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-xs font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                    </div>
                </div>
                <div className="flex items-center gap-3 mt-2">
                    <span className="text-2xl font-bold text-foreground" style={{ color }}>{currentValue}</span>
                </div>
            </CardHeader>
            <CardContent>
                {/* Main Bar Chart */}
                <div className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ left: 0, right: 0, top: 5, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} vertical={false} />
                            <XAxis
                                dataKey="label"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 9 }}
                                stroke="currentColor"
                                style={{ fill: 'currentColor', opacity: 0.6 }}
                                interval={0}
                                angle={-45}
                                textAnchor="end"
                                height={50}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 10 }}
                                stroke="currentColor"
                                style={{ fill: 'currentColor', opacity: 0.6 }}
                            />
                            <Tooltip contentStyle={tooltipStyle} />
                            {showDualBars ? (
                                <>
                                    <Bar dataKey="incoming" fill="#3B82F6" radius={[2, 2, 0, 0]} name="Incoming" />
                                    <Bar dataKey="outgoing" fill="#EF4444" radius={[2, 2, 0, 0]} name="Outgoing" />
                                </>
                            ) : (
                                <Bar dataKey="value" fill={color} radius={[2, 2, 0, 0]} />
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Mini sparkline preview */}
                <div className="mt-2 h-[40px] bg-muted/30 rounded overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <Area
                                type="monotone"
                                dataKey={showDualBars ? "incoming" : "value"}
                                fill={color}
                                fillOpacity={0.3}
                                stroke={color}
                                strokeWidth={1}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

// Process pNodes for performance charts - uses REAL stats from pNodes
function processNodesForChart(nodes: PNodeInfo[], metric: 'cpu' | 'ram' | 'traffic' | 'streams') {
    const onlineNodes = nodes.filter(n => {
        const now = Math.floor(Date.now() / 1000);
        const delta = now - n.last_seen_timestamp;
        return delta < 300; // Online if seen in last 5 minutes
    });

    console.log(`[processNodesForChart] ${metric}: ${onlineNodes.length} online nodes, ${nodes.filter(n => (n as any).stats).length} have stats`);

    // Filter nodes that have actual stats data for this metric
    const nodesWithStats = onlineNodes.filter(node => {
        const stats = (node as any).stats;
        if (!stats) return false;

        switch (metric) {
            case 'cpu':
                return stats.cpu_percent !== undefined && stats.cpu_percent !== null;
            case 'ram':
                return stats.ram_used !== undefined && stats.ram_total !== undefined;
            case 'traffic':
                return stats.packets_received !== undefined || stats.packets_sent !== undefined;
            case 'streams':
                return stats.active_streams !== undefined;
            default:
                return true;
        }
    });

    return nodesWithStats
        .slice(0, 15) // Top 15 nodes
        .map((node, index) => {
            // Use short node identifier: last 2 octets of IP
            const ipParts = node.address.split(':')[0].split('.');
            const shortId = ipParts.length >= 2
                ? `${ipParts[ipParts.length - 2]}.${ipParts[ipParts.length - 1]}`
                : `N${index + 1}`;

            const stats = (node as any).stats;

            switch (metric) {
                case 'cpu':
                    return {
                        label: shortId,
                        value: Math.min(100, stats.cpu_percent || 0)
                    };
                case 'ram':
                    // Calculate RAM percentage from ram_used / ram_total
                    const ramPercent = stats.ram_total > 0
                        ? (stats.ram_used / stats.ram_total) * 100
                        : 0;
                    return {
                        label: shortId,
                        value: Math.min(100, ramPercent)
                    };
                case 'traffic':
                    return {
                        label: shortId,
                        incoming: stats.packets_received || 0,
                        outgoing: stats.packets_sent || 0,
                        value: 0,
                    };
                case 'streams':
                    return {
                        label: shortId,
                        value: stats.active_streams || 0
                    };
                default:
                    return { label: shortId, value: 0 };
            }
        })
        .sort((a, b) => {
            // Sort by value descending
            const aVal = 'incoming' in a && a.incoming !== undefined
                ? (a.incoming + (a.outgoing || 0))
                : (a.value ?? 0);
            const bVal = 'incoming' in b && b.incoming !== undefined
                ? (b.incoming + (b.outgoing || 0))
                : (b.value ?? 0);
            return bVal - aVal;
        });
}

function calculateStats(data: { cpu: NodePerformanceData[]; ram: NodePerformanceData[]; traffic: NodePerformanceData[]; streams: NodePerformanceData[] }) {
    const avgCpu = data.cpu.length > 0 ? data.cpu.reduce((sum, d) => sum + d.value, 0) / data.cpu.length : 0;
    const avgRam = data.ram.length > 0 ? data.ram.reduce((sum, d) => sum + d.value, 0) / data.ram.length : 0;
    const totalTraffic = data.traffic.reduce((sum, d) => sum + (d.incoming || 0) + (d.outgoing || 0), 0);
    const totalStreams = data.streams.reduce((sum, d) => sum + d.value, 0);

    return {
        avgCpu: Math.round(avgCpu * 10) / 10,
        avgRam: Math.round(avgRam * 10) / 10,
        totalTraffic,
        totalStreams,
    };
}

// Generate initial placeholder data for instant rendering
function generatePlaceholderData(metric: 'cpu' | 'ram' | 'traffic' | 'streams'): NodePerformanceData[] {
    const labels = ['N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8'];
    return labels.map(label => {
        switch (metric) {
            case 'cpu':
                return { label, value: 15 + Math.random() * 30 };
            case 'ram':
                return { label, value: 35 + Math.random() * 25 };
            case 'traffic':
                return { label, incoming: 1000 + Math.random() * 2000, outgoing: 500 + Math.random() * 1000, value: 0 };
            case 'streams':
                return { label, value: 10 + Math.random() * 30 };
            default:
                return { label, value: 0 };
        }
    });
}

interface PerformanceChartsProps {
    pnodes?: PNodeInfo[];
}

export function PerformanceCharts({ pnodes: propNodes }: PerformanceChartsProps = {}) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [nodes, setNodes] = useState<PNodeInfo[]>([]);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [hasInitialData, setHasInitialData] = useState(false);

    // Generate initial placeholder data for instant rendering
    const [placeholderData] = useState(() => ({
        cpu: generatePlaceholderData('cpu'),
        ram: generatePlaceholderData('ram'),
        traffic: generatePlaceholderData('traffic'),
        streams: generatePlaceholderData('streams'),
    }));

    // Fetch nodes and their stats from Supabase-backed API
    const fetchData = async (showRefreshIndicator = false) => {
        if (showRefreshIndicator) setIsRefreshing(true);

        try {
            // Fetch from /api/stats which serves data from Supabase
            const res = await fetch('/api/stats?online=true&limit=100');
            if (!res.ok) return;

            const data = await res.json();

            if (data.success && data.data?.nodes) {
                // Transform Supabase data to match expected format
                const nodesWithStats = data.data.nodes.map((node: any) => {
                    // Only create stats object if we have actual stats data
                    const hasStats = node.cpu_percent !== null;

                    return {
                        address: node.address,
                        pubkey: node.pubkey,
                        version: node.version,
                        last_seen_timestamp: node.last_seen_timestamp,
                        stats: hasStats ? {
                            cpu_percent: node.cpu_percent,
                            ram_used: node.ram_used,
                            ram_total: node.ram_total,
                            uptime: node.uptime_seconds,
                            total_bytes: node.total_bytes,
                            file_size: node.file_size,
                            total_pages: node.total_pages,
                            packets_received: node.packets_received,
                            packets_sent: node.packets_sent,
                            active_streams: node.active_streams,
                        } : null,
                    };
                });

                console.log(`[PerformanceCharts] Loaded ${nodesWithStats.length} nodes from Supabase`);
                console.log(`[PerformanceCharts] Summary: ${data.data.summary.withStats} with stats, avg CPU: ${data.data.summary.avgCpu}%`);

                setNodes(nodesWithStats);
                setLastUpdated(new Date());
                setHasInitialData(true);
            } else {
                console.log('[PerformanceCharts] No data from /api/stats, trying direct fetch...');
                // Fallback to direct RPC if Supabase is empty (first time setup)
                const fallbackRes = await fetch('/api/pnodes');
                if (fallbackRes.ok) {
                    const fallbackData = await fallbackRes.json();
                    const pnodesList = fallbackData.pnodes || [];
                    setNodes(pnodesList);
                    setHasInitialData(true);
                }
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setIsRefreshing(false);
            setLastUpdated(new Date());
        }
    };

    // Initial fetch on mount
    useEffect(() => {
        fetchData(false);
        // Auto-refresh every 30 seconds
        const interval = setInterval(() => fetchData(true), 30000);
        return () => clearInterval(interval);
    }, []);

    const performanceData = useMemo(() => {
        // Check how many nodes have stats
        const nodesWithStats = nodes.filter((n: any) => n.stats !== null);
        console.log(`[PerformanceCharts useMemo] Total nodes: ${nodes.length}, with stats: ${nodesWithStats.length}`);

        // If no nodes with stats yet, use placeholder data
        if (nodesWithStats.length === 0) {
            return placeholderData;
        }
        return {
            cpu: processNodesForChart(nodes, 'cpu'),
            ram: processNodesForChart(nodes, 'ram'),
            traffic: processNodesForChart(nodes, 'traffic'),
            streams: processNodesForChart(nodes, 'streams'),
        };
    }, [nodes, placeholderData]);

    const stats = useMemo(() => {
        return calculateStats(performanceData);
    }, [performanceData]);

    return (
        <div className="space-y-6">
            {/* Header with refresh - Stack on mobile, centered */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 items-center text-center sm:text-left">
                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                        Live node performance metrics
                    </p>
                    {isRefreshing && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                        Updated {lastUpdated.toLocaleTimeString()}
                    </span>
                    <button
                        onClick={() => fetchData(false)}
                        className="p-1.5 rounded-md hover:bg-muted transition-colors"
                        disabled={isRefreshing}
                    >
                        <RefreshCw className={`w-4 h-4 text-muted-foreground ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Performance Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PerformanceCard
                    title="Network Traffic"
                    description="Packets sent/received per node"
                    currentValue={`${stats.totalTraffic.toLocaleString()} pkts`}
                    icon={<Network className="h-4 w-4 text-purple-500" />}
                    color="#A855F7"
                    data={performanceData.traffic}
                    isLoading={false}
                    showDualBars={true}
                />

                <PerformanceCard
                    title="Active Streams"
                    description="Data streams per node"
                    currentValue={`${stats.totalStreams} total`}
                    icon={<Activity className="h-4 w-4 text-emerald-500" />}
                    color="#10B981"
                    data={performanceData.streams}
                    isLoading={false}
                />

                <PerformanceCard
                    title="CPU Usage"
                    description="CPU utilization per node"
                    currentValue={`${stats.avgCpu}% avg`}
                    icon={<Cpu className="h-4 w-4 text-orange-500" />}
                    color="#F97316"
                    data={performanceData.cpu}
                    isLoading={false}
                />

                <PerformanceCard
                    title="RAM Usage"
                    description="Memory utilization per node"
                    currentValue={`${stats.avgRam}% avg`}
                    icon={<HardDrive className="h-4 w-4 text-cyan-500" />}
                    color="#06B6D4"
                    data={performanceData.ram}
                    isLoading={false}
                />
            </div>
        </div>
    );
}
