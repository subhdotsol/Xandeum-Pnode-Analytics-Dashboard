"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PackageCheck, AlertTriangle, ExternalLink } from "lucide-react";
import Link from "next/link";

interface VersionNode {
    address: string;
    health: string;
    lastSeen: number;
}

interface OutdatedNode {
    address: string;
    version: string;
    health: string;
    lastSeen: number;
}

interface VersionIntelligenceClientProps {
    versionDistribution: Record<string, number>;
    latestVersion: string;
    versionDetails: Record<string, { count: number; nodes: VersionNode[] }>;
    outdatedNodes: OutdatedNode[];
    totalNodes: number;
}

const CHART_COLORS = [
    "hsl(217, 91%, 60%)", // Blue
    "hsl(142, 71%, 45%)", // Green
    "hsl(25, 95%, 53%)", // Orange
    "hsl(280, 65%, 60%)", // Purple
    "hsl(340, 82%, 52%)", // Pink
    "hsl(190, 90%, 50%)", // Cyan
];

function getHealthBadge(health: string) {
    switch (health) {
        case "healthy":
            return (
                <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-500">
                    Healthy
                </span>
            );
        case "degraded":
            return (
                <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-500">
                    Degraded
                </span>
            );
        default:
            return (
                <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-500">
                    Offline
                </span>
            );
    }
}

function formatLastSeen(timestamp: number): string {
    const now = Math.floor(Date.now() / 1000);
    const delta = now - timestamp;

    if (delta < 60) return "Just now";
    if (delta < 3600) return `${Math.floor(delta / 60)}m ago`;
    if (delta < 86400) return `${Math.floor(delta / 3600)}h ago`;
    return `${Math.floor(delta / 86400)}d ago`;
}

export function VersionIntelligenceClient({
    versionDistribution,
    latestVersion,
    versionDetails,
    outdatedNodes,
    totalNodes,
}: VersionIntelligenceClientProps) {
    // Prepare chart data
    const pieData = Object.entries(versionDistribution)
        .map(([version, count]) => ({
            name: version,
            value: count,
            percentage: ((count / totalNodes) * 100).toFixed(1),
        }))
        .sort((a, b) => b.value - a.value);

    const barData = pieData.map((item) => ({
        version: `v${item.name}`,
        nodes: item.value,
        percentage: parseFloat(item.percentage),
    }));

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <Card className="glass-card-strong border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PackageCheck className="w-5 h-5 text-primary" />
                            Version Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percentage }) => `v${name} (${percentage}%)`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieData.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "rgba(0, 0, 0, 0.9)",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "8px",
                                            color: "#ffffff",
                                        }}
                                        itemStyle={{ color: "#ffffff" }}
                                        labelStyle={{ color: "#ffffff" }}
                                        formatter={(value: number, name: string) => [
                                            `${value} nodes`,
                                            `v${name}`,
                                        ]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Bar Chart */}
                <Card className="glass-card-strong border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PackageCheck className="w-5 h-5 text-primary" />
                            Node Count by Version
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} layout="vertical">
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="hsl(var(--border))"
                                    />
                                    <XAxis
                                        type="number"
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="version"
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        width={80}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "rgba(0, 0, 0, 0.9)",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "8px",
                                            color: "#ffffff",
                                        }}
                                        itemStyle={{ color: "#ffffff" }}
                                        labelStyle={{ color: "#ffffff" }}
                                        formatter={(value: number) => [`${value} nodes`, "Count"]}
                                    />
                                    <Bar dataKey="nodes" fill="hsl(217, 91%, 60%)" radius={4} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Tables */}
            <Tabs defaultValue="outdated" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="outdated" className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Outdated Nodes ({outdatedNodes.length})
                    </TabsTrigger>
                    <TabsTrigger value="all" className="flex items-center gap-2">
                        <PackageCheck className="w-4 h-4" />
                        All Versions
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="outdated" className="mt-6">
                    <Card className="glass-card-strong border-border">
                        <CardHeader>
                            <CardTitle>Nodes Requiring Upgrade</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {outdatedNodes.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <PackageCheck className="w-12 h-12 mx-auto mb-4 text-green-500" />
                                    <p>All nodes are running the latest version!</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Address</TableHead>
                                                <TableHead>Version</TableHead>
                                                <TableHead>Health</TableHead>
                                                <TableHead>Last Seen</TableHead>
                                                <TableHead></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {outdatedNodes.slice(0, 50).map((node, index) => (
                                                <motion.tr
                                                    key={node.address}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.02 }}
                                                    className="border-b border-border"
                                                >
                                                    <TableCell className="font-mono text-sm">
                                                        {node.address}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-500">
                                                            v{node.version}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>{getHealthBadge(node.health)}</TableCell>
                                                    <TableCell className="text-muted-foreground text-sm">
                                                        {formatLastSeen(node.lastSeen)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Link
                                                            href={`/pnode/${encodeURIComponent(node.address)}`}
                                                            className="text-primary hover:underline inline-flex items-center gap-1"
                                                        >
                                                            <ExternalLink className="w-3 h-3" />
                                                        </Link>
                                                    </TableCell>
                                                </motion.tr>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    {outdatedNodes.length > 50 && (
                                        <p className="text-center text-sm text-muted-foreground mt-4">
                                            Showing 50 of {outdatedNodes.length} outdated nodes
                                        </p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="all" className="mt-6">
                    <div className="space-y-4">
                        {Object.entries(versionDetails)
                            .sort((a, b) => b[1].count - a[1].count)
                            .map(([version, details], vIndex) => (
                                <motion.div
                                    key={version}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: vIndex * 0.1 }}
                                >
                                    <Card className="glass-card-strong border-border">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-4 h-4 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                CHART_COLORS[vIndex % CHART_COLORS.length],
                                                        }}
                                                    />
                                                    <span className="font-mono">v{version}</span>
                                                    {version === latestVersion && (
                                                        <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-500">
                                                            Latest
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-sm text-muted-foreground">
                                                    {details.count} nodes (
                                                    {((details.count / totalNodes) * 100).toFixed(1)}%)
                                                </span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="overflow-x-auto max-h-48">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Address</TableHead>
                                                            <TableHead>Health</TableHead>
                                                            <TableHead>Last Seen</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {details.nodes.slice(0, 10).map((node) => (
                                                            <TableRow key={node.address}>
                                                                <TableCell className="font-mono text-sm">
                                                                    <Link
                                                                        href={`/pnode/${encodeURIComponent(node.address)}`}
                                                                        className="text-primary hover:underline"
                                                                    >
                                                                        {node.address}
                                                                    </Link>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {getHealthBadge(node.health)}
                                                                </TableCell>
                                                                <TableCell className="text-muted-foreground text-sm">
                                                                    {formatLastSeen(node.lastSeen)}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                                {details.nodes.length > 10 && (
                                                    <p className="text-center text-xs text-muted-foreground mt-2">
                                                        +{details.nodes.length - 10} more nodes
                                                    </p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
