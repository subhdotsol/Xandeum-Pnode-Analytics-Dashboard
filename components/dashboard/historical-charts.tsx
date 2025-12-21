"use client";

import { useState, useEffect, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, Activity, HardDrive, Clock } from "lucide-react";

interface HistoricalDataPoint {
    timestamp: number;
    totalNodes: number;
    onlineNodes: number;
    offlineNodes: number;
    avgCpu: number;
    avgRam: number;
    totalStorage: number;
    uniqueCountries: number;
    uniqueVersions: number;
}

const TIME_RANGES = [
    { label: "1H", value: 1 * 60 * 60 * 1000 },
    { label: "4H", value: 4 * 60 * 60 * 1000 },
    { label: "12H", value: 12 * 60 * 60 * 1000 },
    { label: "24H", value: 24 * 60 * 60 * 1000 },
    { label: "7D", value: 7 * 24 * 60 * 60 * 1000 },
    { label: "30D", value: 30 * 24 * 60 * 60 * 1000 },
    { label: "All", value: Infinity },
];

const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const formatStorage = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function HistoricalCharts() {
    const [data, setData] = useState<HistoricalDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [reloading, setReloading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState(TIME_RANGES[4].value); // Default 7D

    // Handle time range change with reload effect
    const handleTimeRangeChange = (newRange: number) => {
        if (newRange === timeRange) return;
        setReloading(true);
        setTimeout(() => {
            setTimeRange(newRange);
            setReloading(false);
        }, 300); // Short delay for visual feedback
    };

    useEffect(() => {
        async function fetchHistoricalData() {
            try {
                const res = await fetch("/api/historical");
                if (res.ok) {
                    const historicalData = await res.json();
                    setData(historicalData);
                } else {
                    setError("Failed to fetch historical data");
                }
            } catch (err) {
                setError("Error loading historical data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchHistoricalData();
    }, []);

    // Filter data based on time range
    const filteredData = useMemo(() => {
        if (timeRange === Infinity) return data;
        const cutoff = Date.now() - timeRange;
        return data.filter(point => point.timestamp >= cutoff);
    }, [data, timeRange]);

    // Format data for charts
    const chartData = useMemo(() => {
        return filteredData.map(point => ({
            ...point,
            time: formatTime(point.timestamp),
            date: formatDate(point.timestamp),
            fullTime: `${formatDate(point.timestamp)} ${formatTime(point.timestamp)}`,
            uptimePercent: point.totalNodes > 0 ? ((point.onlineNodes / point.totalNodes) * 100).toFixed(1) : 0,
            storageGB: point.totalStorage / (1024 * 1024 * 1024),
        }));
    }, [filteredData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error || data.length === 0) {
        return (
            <Card className="border border-border bg-card">
                <CardContent className="p-12 text-center">
                    <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Historical Data Yet</h3>
                    <p className="text-muted-foreground text-sm">
                        Historical data will be collected every 5 minutes once the cron job is set up.
                    </p>
                    <p className="text-muted-foreground text-xs mt-2">
                        Trigger manually: <code className="bg-muted px-2 py-1 rounded">/api/cron/collect-snapshot</code>
                    </p>
                </CardContent>
            </Card>
        );
    }

    const tooltipStyle = {
        backgroundColor: 'hsl(var(--card))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '8px',
        fontSize: '12px'
    };

    return (
        <div className="space-y-6">
            {/* Time Range Selector */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                        Showing {chartData.length} data points
                    </p>
                    {reloading && (
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    )}
                </div>
                <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                    {TIME_RANGES.map((range) => (
                        <button
                            key={range.label}
                            onClick={() => handleTimeRangeChange(range.value)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${timeRange === range.value
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Charts with fade transition */}
            <div className={`space-y-8 transition-opacity duration-300 ${reloading ? 'opacity-30' : 'opacity-100'}`}>

                {/* Row 1: Network Growth & Network Uptime */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Node Population */}
                    <Card className="border border-border bg-card">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                Node Population
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">Active pNodes in the network</p>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[220px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                        <defs>
                                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#14F1C6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#14F1C6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis dataKey="time" tick={{ fontSize: 10 }} tickLine={false} />
                                        <YAxis tick={{ fontSize: 10 }} tickLine={false} />
                                        <Tooltip contentStyle={tooltipStyle} />
                                        <Area
                                            type="monotone"
                                            dataKey="totalNodes"
                                            stroke="#14F1C6"
                                            strokeWidth={2}
                                            fill="url(#colorTotal)"
                                            name="Total Nodes"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Availability Rate */}
                    <Card className="border border-border bg-card">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                <Clock className="w-4 h-4 text-blue-500" />
                                Availability Rate
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">Percentage of online nodes</p>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[220px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                        <defs>
                                            <linearGradient id="colorUptime" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis dataKey="time" tick={{ fontSize: 10 }} tickLine={false} />
                                        <YAxis tick={{ fontSize: 10 }} tickLine={false} domain={[0, 100]} unit="%" />
                                        <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`, 'Uptime']} />
                                        <Area
                                            type="monotone"
                                            dataKey="uptimePercent"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            strokeDasharray="5 5"
                                            fill="url(#colorUptime)"
                                            name="Uptime %"
                                            dot={{ r: 3, fill: '#3b82f6' }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Row 2: Average Performance & Total Storage */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Resource Utilization */}
                    <Card className="border border-border bg-card">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                <Activity className="w-4 h-4 text-orange-500" />
                                Resource Utilization
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">Average CPU and memory usage</p>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[220px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis dataKey="time" tick={{ fontSize: 10 }} tickLine={false} />
                                        <YAxis tick={{ fontSize: 10 }} tickLine={false} domain={[0, 100]} unit="%" />
                                        <Tooltip contentStyle={tooltipStyle} />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="avgCpu"
                                            stroke="#f97316"
                                            strokeWidth={2}
                                            strokeDasharray="5 5"
                                            dot={{ r: 3, fill: '#f97316' }}
                                            name="CPU %"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="avgRam"
                                            stroke="#8B5CF6"
                                            strokeWidth={2}
                                            strokeDasharray="5 5"
                                            dot={{ r: 3, fill: '#8B5CF6' }}
                                            name="RAM %"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Storage Capacity */}
                    <Card className="border border-border bg-card">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                <HardDrive className="w-4 h-4 text-purple-500" />
                                Storage Capacity
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">Aggregate storage across nodes</p>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[220px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                        <defs>
                                            <linearGradient id="colorStorage" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis dataKey="time" tick={{ fontSize: 10 }} tickLine={false} />
                                        <YAxis
                                            tick={{ fontSize: 10 }}
                                            tickLine={false}
                                            tickFormatter={(value) => `${value.toFixed(1)} GB`}
                                        />
                                        <Tooltip
                                            contentStyle={tooltipStyle}
                                            formatter={(value: number) => [`${value.toFixed(2)} GB`, 'Storage']}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="storageGB"
                                            stroke="#8B5CF6"
                                            strokeWidth={2}
                                            fill="url(#colorStorage)"
                                            name="Storage"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
