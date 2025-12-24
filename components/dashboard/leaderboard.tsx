"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Trophy, Medal, Crown, Cpu, Clock, HardDrive, TrendingUp, Eye, X, Copy, Check, MapPin, Loader2, Star, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBytes, formatUptime } from "@/lib/utils";
import { useWatchlist } from "@/contexts/watchlist-context";
import type { PNodeInfo, PNodeStats } from "@/types/pnode";

interface LeaderboardProps {
    nodes: PNodeInfo[];
}

interface NodeWithScore extends PNodeInfo {
    stats?: PNodeStats | null;
    credits: number;
    rank?: number;
}

type SortCategory = "credits" | "uptime" | "cpu" | "storage";

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

// Format large numbers with commas
function formatCredits(num: number): string {
    return num.toLocaleString();
}

export function Leaderboard({ nodes }: LeaderboardProps) {
    const [category, setCategory] = useState<SortCategory>("credits");
    const [nodeStats, setNodeStats] = useState<Map<string, PNodeStats>>(new Map());
    const [podCredits, setPodCredits] = useState<Record<string, number>>({});
    const [loadingStats, setLoadingStats] = useState(false);
    const [loadingCredits, setLoadingCredits] = useState(true);
    const [hasLoadedStats, setHasLoadedStats] = useState(false);
    const [totalNetworkCredits, setTotalNetworkCredits] = useState(0);
    const [maxCredits, setMaxCredits] = useState(0);
    const { isInWatchlist, toggleWatchlist } = useWatchlist();

    // Try to get prefetched stats
    let prefetchedStats: Map<string, PNodeStats> | null = null;
    try {
        const { usePrefetch } = require("@/contexts/prefetch-context");
        const prefetch = usePrefetch();
        if (prefetch.leaderboardStats && prefetch.leaderboardStats.size > 0) {
            prefetchedStats = prefetch.leaderboardStats;
        }
    } catch {
        // Context not available
    }

    // Modal state
    const [selectedNode, setSelectedNode] = useState<NodeWithScore | null>(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [geoData, setGeoData] = useState<{ country: string; city: string; regionName: string; isp: string } | null>(null);

    // Fetch real pod credits from API
    useEffect(() => {
        async function fetchCredits() {
            try {
                const res = await fetch("/api/pods-credits");
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.data) {
                        setPodCredits(data.data.credits);
                        setTotalNetworkCredits(data.data.totalCredits);
                        setMaxCredits(data.data.maxCredits);
                    }
                }
            } catch (error) {
                console.error("Error fetching pod credits:", error);
            } finally {
                setLoadingCredits(false);
            }
        }
        fetchCredits();
    }, []);

    // Use prefetched stats or fetch
    useEffect(() => {
        if (prefetchedStats && prefetchedStats.size > 0) {
            setNodeStats(prefetchedStats);
            setHasLoadedStats(true);
            return;
        }
    }, [prefetchedStats]);

    // Fetch stats for specific nodes
    const fetchStatsForNodes = useCallback(async (nodesToFetch: PNodeInfo[]) => {
        const newStats = new Map<string, PNodeStats>();

        await Promise.all(
            nodesToFetch.map(async (node) => {
                // Skip if we already have stats for this node
                if (nodeStats.has(node.address)) return;

                try {
                    const res = await fetch(`/api/pnodes/${encodeURIComponent(node.address)}`);
                    if (res.ok) {
                        const response = await res.json();
                        if (response?.success && response?.data?.stats) {
                            newStats.set(node.address, response.data.stats);
                        }
                    }
                } catch { }
            })
        );

        if (newStats.size > 0) {
            setNodeStats(prev => {
                const merged = new Map(prev);
                newStats.forEach((v, k) => merged.set(k, v));
                return merged;
            });
        }
    }, [nodeStats]);

    // Initial stats fetch for first 50 nodes
    useEffect(() => {
        if (nodes.length > 0 && !hasLoadedStats && (!prefetchedStats || prefetchedStats.size === 0)) {
            setLoadingStats(true);
            fetchStatsForNodes(nodes.slice(0, 50)).then(() => {
                setLoadingStats(false);
                setHasLoadedStats(true);
            });
        }
    }, [nodes, hasLoadedStats, fetchStatsForNodes, prefetchedStats]);

    // When credits load, fetch stats for top credit holders that don't have stats yet
    const [creditsFetchDone, setCreditsFetchDone] = useState(false);
    useEffect(() => {
        if (!loadingCredits && Object.keys(podCredits).length > 0 && !creditsFetchDone && nodes.length > 0) {
            setCreditsFetchDone(true);

            // Get top 25 nodes by credits
            const topCreditNodes = [...nodes]
                .filter(n => n.pubkey && podCredits[n.pubkey])
                .sort((a, b) => (podCredits[b.pubkey!] || 0) - (podCredits[a.pubkey!] || 0))
                .slice(0, 25);

            // Fetch stats for any that don't have stats yet
            const needsStats = topCreditNodes.filter(n => !nodeStats.has(n.address));
            if (needsStats.length > 0) {
                setLoadingStats(true);
                fetchStatsForNodes(needsStats).then(() => setLoadingStats(false));
            }
        }
    }, [loadingCredits, podCredits, creditsFetchDone, nodes, nodeStats, fetchStatsForNodes]);

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

    // Calculate scores for each node with real credits
    const rankedNodes = useMemo(() => {
        const nodesWithScores: NodeWithScore[] = nodes.map((node) => {
            const stats = nodeStats.get(node.address);
            // Get real credits from API (match by pubkey)
            const credits = node.pubkey ? (podCredits[node.pubkey] || 0) : 0;

            return { ...node, stats, credits };
        });

        // Sort by credits (default) or other categories
        nodesWithScores.sort((a, b) => {
            switch (category) {
                case "uptime":
                    const aUptime = a.stats?.uptime || 0;
                    const bUptime = b.stats?.uptime || 0;
                    return bUptime - aUptime;
                case "cpu":
                    const aCpu = a.stats?.cpu_percent !== undefined ? 100 - a.stats.cpu_percent : 0;
                    const bCpu = b.stats?.cpu_percent !== undefined ? 100 - b.stats.cpu_percent : 0;
                    return bCpu - aCpu;
                case "storage":
                    const aStorage = a.stats?.file_size || 0;
                    const bStorage = b.stats?.file_size || 0;
                    return bStorage - aStorage;
                default: // credits
                    return b.credits - a.credits;
            }
        });

        return nodesWithScores.map((node, index) => ({ ...node, rank: index + 1 }));
    }, [nodes, nodeStats, podCredits, category]);

    const categories = [
        { id: "credits" as SortCategory, label: "Credits", icon: Coins },
        { id: "uptime" as SortCategory, label: "Uptime", icon: Clock },
        { id: "cpu" as SortCategory, label: "CPU", icon: Cpu },
        { id: "storage" as SortCategory, label: "Storage", icon: HardDrive },
    ];

    const getCreditsColor = (credits: number) => {
        if (credits >= 50000) return "text-green-500";
        if (credits >= 30000) return "text-yellow-500";
        if (credits >= 10000) return "text-orange-500";
        return "text-muted-foreground";
    };

    const getCreditsPercentage = (credits: number) => {
        if (maxCredits === 0) return 0;
        return (credits / maxCredits) * 100;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-yellow-500" />
                        Pod Credits Leaderboard
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        {loadingCredits ? "Loading credits..." : `${formatCredits(totalNetworkCredits)} total network credits`}
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

            {(loadingStats || loadingCredits) && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {loadingCredits ? "Loading pod credits..." : "Loading node stats..."}
                </div>
            )}

            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {rankedNodes.slice(0, 3).map((node, index) => {
                    const RankIcon = RANK_ICONS[index];
                    const rankColor = RANK_COLORS[index];

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
                                    <div className="text-right">
                                        <span className={`text-xl font-bold ${getCreditsColor(node.credits)}`}>
                                            {formatCredits(node.credits)}
                                        </span>
                                        <p className="text-xs text-muted-foreground">credits</p>
                                    </div>
                                </div>
                                <p className="font-mono text-xs truncate mb-3" title={node.pubkey || node.address}>
                                    {node.pubkey ? `${node.pubkey.slice(0, 8)}...${node.pubkey.slice(-8)}` : node.address}
                                </p>
                                <div className="w-full bg-muted rounded-full h-1.5 mb-3">
                                    <div
                                        className="bg-gradient-to-r from-yellow-500 to-amber-500 h-1.5 rounded-full transition-all"
                                        style={{ width: `${getCreditsPercentage(node.credits)}%` }}
                                    />
                                </div>
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
                                        {node.stats?.file_size ? formatBytes(node.stats.file_size) : "–"}
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
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                                    <th className="py-2 px-2 w-12">#</th>
                                    <th className="py-2 px-2">Pod ID</th>
                                    <th className="py-2 px-2 text-right">Credits</th>
                                    <th className="py-2 px-2 text-center">Uptime</th>
                                    <th className="py-2 px-2 text-center">CPU</th>
                                    <th className="py-2 px-2 text-center">Storage</th>
                                    <th className="py-2 px-2">Ver</th>
                                    <th className="py-2 px-2 w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rankedNodes.slice(0, 25).map((node) => (
                                    <tr key={node.address} className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer" onClick={() => openNodeModal(node)}>
                                        <td className="py-2 px-2">
                                            <span className={`font-bold text-sm ${node.rank && node.rank <= 3 ? RANK_COLORS[node.rank - 1] : ''}`}>
                                                {node.rank}
                                            </span>
                                        </td>
                                        <td className="py-2 px-2 font-mono text-xs">
                                            {node.pubkey ? `${node.pubkey.slice(0, 12)}...` : node.address}
                                        </td>
                                        <td className="py-2 px-2 text-right">
                                            <span className={`font-bold text-sm ${getCreditsColor(node.credits)}`}>
                                                {formatCredits(node.credits)}
                                            </span>
                                        </td>
                                        <td className="py-2 px-2 text-center text-xs text-muted-foreground">
                                            {node.stats?.uptime ? formatUptime(node.stats.uptime) : "–"}
                                        </td>
                                        <td className="py-2 px-2 text-center text-xs text-muted-foreground">
                                            {node.stats?.cpu_percent?.toFixed(1) || "–"}%
                                        </td>
                                        <td className="py-2 px-2 text-center text-xs text-muted-foreground">
                                            {node.stats?.file_size ? formatBytes(node.stats.file_size) : "–"}
                                        </td>
                                        <td className="py-2 px-2 text-xs text-muted-foreground">
                                            {node.version || "–"}
                                        </td>
                                        <td className="py-2 px-2">
                                            <Eye className="w-3 h-3 text-muted-foreground" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Network Credits Info */}
            <Card className="border border-border bg-muted/30">
                <CardContent className="p-4">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Coins className="w-4 h-4 text-yellow-500" />
                        Pod Credits
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        Pod Credits are earned by participating in the Xandeum network. Credits reflect your node&apos;s
                        contribution to the network through uptime, storage, and processing work.
                    </p>
                </CardContent>
            </Card>

            {/* Node Details Modal */}
            {selectedNode && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedNode(null)}>
                    <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg">Node Details</CardTitle>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleWatchlist(selectedNode.address)}
                                    className="p-1.5 rounded-md hover:bg-muted transition-colors"
                                    title={isInWatchlist(selectedNode.address) ? "Remove from watchlist" : "Add to watchlist"}
                                >
                                    <Star
                                        className={`w-5 h-5 transition-colors ${isInWatchlist(selectedNode.address)
                                            ? "fill-yellow-500 text-yellow-500"
                                            : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    />
                                </button>
                                <button onClick={() => setSelectedNode(null)} className="p-1 rounded-md hover:bg-muted">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Rank & Credits Badge */}
                            <div className="flex items-center justify-between">
                                <span className={`text-2xl font-bold ${selectedNode.rank && selectedNode.rank <= 3 ? RANK_COLORS[selectedNode.rank - 1] : ''}`}>
                                    Rank #{selectedNode.rank}
                                </span>
                                <div className="text-right">
                                    <span className={`text-2xl font-bold ${getCreditsColor(selectedNode.credits)}`}>
                                        {formatCredits(selectedNode.credits)}
                                    </span>
                                    <p className="text-xs text-muted-foreground">pod credits</p>
                                </div>
                            </div>

                            <CopyableField label="Address" value={selectedNode.address} />
                            {selectedNode.pubkey && <CopyableField label="Pod ID (Public Key)" value={selectedNode.pubkey} />}

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
                                    <p className="text-lg font-semibold">{selectedNode.stats?.file_size ? formatBytes(selectedNode.stats.file_size) : "–"}</p>
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
