"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Trophy, Medal, Crown, Cpu, Clock, HardDrive, TrendingUp, Eye, X, Copy, Check, MapPin, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBytes, formatUptime } from "@/lib/utils";
import type { PNodeInfo, PNodeStats } from "@/types/pnode";

interface LeaderboardProps {
    nodes: PNodeInfo[];
}

interface NodeWithScore extends PNodeInfo {
    stats?: PNodeStats | null;
    score: number;
    uptimeScore: number;
    cpuScore: number;
    storageScore: number;
    rank?: number;
}

type SortCategory = "overall" | "uptime" | "cpu" | "storage";

const RANK_ICONS = [Crown, Medal, Medal];
const RANK_COLORS = ["text-yellow-500", "text-gray-400", "text-amber-600"];

// Copyable Field Component
function CopyableField({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{label}</p>
            <div className="flex items-center gap-2">
                <p className={`text-sm break-all ${mono ? 'font-mono' : ''}`}>{value}</p>
                <button onClick={handleCopy} className="p-1 rounded hover:bg-muted transition-colors flex-shrink-0">
                    {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
                </button>
            </div>
        </div>
    );
}

export function Leaderboard({ nodes }: LeaderboardProps) {
    const [category, setCategory] = useState<SortCategory>("overall");
    const [nodeStats, setNodeStats] = useState<Map<string, PNodeStats>>(new Map());
    const [loadingStats, setLoadingStats] = useState(false);
    const [hasLoadedStats, setHasLoadedStats] = useState(false);

    // Modal state
    const [selectedNode, setSelectedNode] = useState<NodeWithScore | null>(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [geoData, setGeoData] = useState<{ country: string; city: string; regionName: string; isp: string } | null>(null);

    // Fetch stats for top nodes
    const fetchStats = useCallback(async () => {
        if (hasLoadedStats || loadingStats) return;
        setLoadingStats(true);

        const nodesToFetch = nodes.slice(0, 50);
        const newStats = new Map(nodeStats);

        // Fetch in batches of 10
        const batchSize = 10;
        for (let i = 0; i < nodesToFetch.length; i += batchSize) {
            const batch = nodesToFetch.slice(i, i + batchSize);
            await Promise.all(
                batch.map(async (node) => {
                    try {
                        const res = await fetch(`/api/pnodes/${encodeURIComponent(node.address)}`);
                        if (res.ok) {
                            const stats = await res.json();
                            if (stats) newStats.set(node.address, stats);
                        }
                    } catch { }
                })
            );
            setNodeStats(new Map(newStats));
        }

        setLoadingStats(false);
        setHasLoadedStats(true);
    }, [nodes, hasLoadedStats, loadingStats, nodeStats]);

    useEffect(() => {
        if (nodes.length > 0 && !hasLoadedStats) {
            fetchStats();
        }
    }, [nodes, hasLoadedStats, fetchStats]);

    // Open node modal
    const openNodeModal = async (node: NodeWithScore) => {
        setSelectedNode(node);
        setModalLoading(true);
        setGeoData(null);

        // Extract IP from address
        const ip = node.address.split(':')[0];

        try {
            const geoRes = await fetch(`/api/geo?ip=${ip}`);
            if (geoRes.ok) {
                const data = await geoRes.json();
                if (data.status !== 'fail') {
                    setGeoData({
                        country: data.country,
                        city: data.city,
                        regionName: data.regionName,
                        isp: data.isp,
                    });
                }
            }
        } catch { }

        setModalLoading(false);
    };

    // Calculate scores for each node
    const rankedNodes = useMemo(() => {
        const nodesWithScores: NodeWithScore[] = nodes.map((node) => {
            const stats = nodeStats.get(node.address);

            const uptimeScore = stats?.uptime
                ? Math.min(100, (stats.uptime / (30 * 24 * 60 * 60)) * 100)
                : 0;

            const cpuScore = stats?.cpu_percent !== undefined
                ? Math.max(0, 100 - stats.cpu_percent)
                : 0;

            const storageScore = stats?.total_bytes
                ? Math.min(100, (stats.total_bytes / (1024 * 1024 * 1024 * 100)) * 100)
                : 0;

            const score = (uptimeScore * 0.4) + (cpuScore * 0.3) + (storageScore * 0.3);

            return { ...node, stats, score, uptimeScore, cpuScore, storageScore };
        });

        nodesWithScores.sort((a, b) => {
            switch (category) {
                case "uptime": return b.uptimeScore - a.uptimeScore;
                case "cpu": return b.cpuScore - a.cpuScore;
                case "storage": return b.storageScore - a.storageScore;
                default: return b.score - a.score;
            }
        });

        return nodesWithScores.map((node, index) => ({ ...node, rank: index + 1 }));
    }, [nodes, nodeStats, category]);

    const categories = [
        { id: "overall" as SortCategory, label: "All", icon: Trophy },
        { id: "uptime" as SortCategory, label: "Uptime", icon: Clock },
        { id: "cpu" as SortCategory, label: "CPU", icon: Cpu },
        { id: "storage" as SortCategory, label: "Storage", icon: HardDrive },
    ];

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-500";
        if (score >= 60) return "text-yellow-500";
        if (score >= 40) return "text-orange-500";
        return "text-red-500";
    };

    const getScoreForCategory = (node: NodeWithScore) => {
        switch (category) {
            case "uptime": return node.uptimeScore;
            case "cpu": return node.cpuScore;
            case "storage": return node.storageScore;
            default: return node.score;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-yellow-500" />
                        Performance Leaderboard
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Top performing nodes ranked by efficiency
                    </p>
                </div>

                {/* Compact Category Tabs */}
                <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${category === cat.id
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <cat.icon className="w-3 h-3" />
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {loadingStats && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading node stats...
                </div>
            )}

            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {rankedNodes.slice(0, 3).map((node, index) => {
                    const RankIcon = RANK_ICONS[index];
                    const rankColor = RANK_COLORS[index];
                    const score = getScoreForCategory(node);

                    return (
                        <Card
                            key={node.address}
                            className={`border-2 cursor-pointer hover:border-primary/50 transition-colors ${index === 0 ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-border'}`}
                            onClick={() => openNodeModal(node)}
                        >
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <RankIcon className={`w-5 h-5 ${rankColor}`} />
                                        <span className="text-xl font-bold">#{index + 1}</span>
                                    </div>
                                    <span className={`text-xl font-bold ${getScoreColor(score)}`}>
                                        {score.toFixed(0)}
                                    </span>
                                </div>
                                <p className="font-mono text-xs truncate mb-3" title={node.address}>
                                    {node.address}
                                </p>
                                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                                    <div className="text-center">
                                        <Clock className="w-3 h-3 mx-auto mb-1" />
                                        {node.stats?.uptime ? formatUptime(node.stats.uptime) : "–"}
                                    </div>
                                    <div className="text-center">
                                        <Cpu className="w-3 h-3 mx-auto mb-1" />
                                        {node.stats?.cpu_percent?.toFixed(1) || "–"}%
                                    </div>
                                    <div className="text-center">
                                        <HardDrive className="w-3 h-3 mx-auto mb-1" />
                                        {node.stats?.total_bytes ? formatBytes(node.stats.total_bytes) : "–"}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Full Leaderboard Table */}
            <Card className="border border-border">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Full Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                                    <th className="py-2 px-2 w-12">#</th>
                                    <th className="py-2 px-2">Address</th>
                                    <th className="py-2 px-2 text-center">Score</th>
                                    <th className="py-2 px-2 text-center">Uptime</th>
                                    <th className="py-2 px-2 text-center">CPU</th>
                                    <th className="py-2 px-2 text-center">Storage</th>
                                    <th className="py-2 px-2">Ver</th>
                                    <th className="py-2 px-2 w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rankedNodes.slice(0, 25).map((node) => {
                                    const score = getScoreForCategory(node);
                                    return (
                                        <tr key={node.address} className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer" onClick={() => openNodeModal(node)}>
                                            <td className="py-2 px-2">
                                                <span className={`font-bold text-sm ${node.rank && node.rank <= 3 ? RANK_COLORS[node.rank - 1] : ''}`}>
                                                    {node.rank}
                                                </span>
                                            </td>
                                            <td className="py-2 px-2 font-mono text-xs">
                                                {node.address}
                                            </td>
                                            <td className="py-2 px-2 text-center">
                                                <span className={`font-bold text-sm ${getScoreColor(score)}`}>
                                                    {score.toFixed(0)}
                                                </span>
                                            </td>
                                            <td className="py-2 px-2 text-center text-xs text-muted-foreground">
                                                {node.stats?.uptime ? formatUptime(node.stats.uptime) : "–"}
                                            </td>
                                            <td className="py-2 px-2 text-center text-xs text-muted-foreground">
                                                {node.stats?.cpu_percent?.toFixed(1) || "–"}%
                                            </td>
                                            <td className="py-2 px-2 text-center text-xs text-muted-foreground">
                                                {node.stats?.total_bytes ? formatBytes(node.stats.total_bytes) : "–"}
                                            </td>
                                            <td className="py-2 px-2 text-xs text-muted-foreground">
                                                {node.version || "–"}
                                            </td>
                                            <td className="py-2 px-2">
                                                <Eye className="w-3 h-3 text-muted-foreground" />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Scoring Explanation */}
            <Card className="border border-border bg-muted/30">
                <CardContent className="p-4">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Scoring Formula
                    </h3>
                    <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground">
                        <div>
                            <p className="font-medium text-foreground">Uptime (40%)</p>
                            <p>30 days = 100 pts</p>
                        </div>
                        <div>
                            <p className="font-medium text-foreground">CPU (30%)</p>
                            <p>0% usage = 100 pts</p>
                        </div>
                        <div>
                            <p className="font-medium text-foreground">Storage (30%)</p>
                            <p>100GB = 100 pts</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Node Details Modal */}
            {selectedNode && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedNode(null)}>
                    <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg">Node Details</CardTitle>
                            <button onClick={() => setSelectedNode(null)} className="p-1 rounded-md hover:bg-muted">
                                <X className="w-5 h-5" />
                            </button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Rank Badge */}
                            <div className="flex items-center gap-2">
                                <span className={`text-2xl font-bold ${selectedNode.rank && selectedNode.rank <= 3 ? RANK_COLORS[selectedNode.rank - 1] : ''}`}>
                                    Rank #{selectedNode.rank}
                                </span>
                                <span className={`text-xl font-bold ${getScoreColor(getScoreForCategory(selectedNode))}`}>
                                    ({getScoreForCategory(selectedNode).toFixed(0)} pts)
                                </span>
                            </div>

                            <CopyableField label="Address" value={selectedNode.address} />
                            {selectedNode.pubkey && <CopyableField label="Public Key" value={selectedNode.pubkey} />}

                            {/* Location */}
                            {modalLoading ? (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Loading location...
                                </div>
                            ) : geoData && (
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> Location
                                    </p>
                                    <p className="text-sm">{geoData.city}, {geoData.regionName}, {geoData.country}</p>
                                    {geoData.isp && <p className="text-xs text-muted-foreground">{geoData.isp}</p>}
                                </div>
                            )}

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">CPU Usage</p>
                                    <p className="text-lg font-semibold">{selectedNode.stats?.cpu_percent?.toFixed(1) || "–"}%</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">RAM</p>
                                    <p className="text-lg font-semibold">
                                        {selectedNode.stats?.ram_used && selectedNode.stats?.ram_total
                                            ? `${formatBytes(selectedNode.stats.ram_used)} / ${formatBytes(selectedNode.stats.ram_total)}`
                                            : "–"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Storage</p>
                                    <p className="text-lg font-semibold">{selectedNode.stats?.total_bytes ? formatBytes(selectedNode.stats.total_bytes) : "–"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Uptime</p>
                                    <p className="text-lg font-semibold">{selectedNode.stats?.uptime ? formatUptime(selectedNode.stats.uptime) : "–"}</p>
                                </div>
                            </div>

                            {/* Version */}
                            <div className="space-y-1 pt-2 border-t border-border">
                                <p className="text-xs text-muted-foreground">Version</p>
                                <p className="text-sm font-mono">{selectedNode.version || "–"}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
