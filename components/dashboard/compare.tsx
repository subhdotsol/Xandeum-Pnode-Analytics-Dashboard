"use client";

import { useState, useMemo } from "react";
import { GitCompare, Search, ArrowUp, ArrowDown, Minus, ChevronLeft, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getNodeHealth } from "@/lib/network-analytics";
import { formatBytes, formatUptime } from "@/lib/utils";
import type { PNodeInfo, PNodeStats } from "@/types/pnode";

interface CompareProps {
    nodes: PNodeInfo[];
}

interface NodeWithStats extends PNodeInfo {
    stats?: PNodeStats | null;
}

const PAGE_SIZE = 10;

export function Compare({ nodes }: CompareProps) {
    const [search, setSearch] = useState("");
    const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());
    const [showComparison, setShowComparison] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [nodeStats, setNodeStats] = useState<Map<string, PNodeStats>>(new Map());
    const [loadingStats, setLoadingStats] = useState(false);

    // AI Comparison state
    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
    const [loadingAi, setLoadingAi] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);

    // Filter nodes by search
    const filteredNodes = useMemo(() => {
        if (!search) return nodes;
        return nodes.filter(
            (node) =>
                node.address.toLowerCase().includes(search.toLowerCase()) ||
                node.pubkey?.toLowerCase().includes(search.toLowerCase())
        );
    }, [nodes, search]);

    // Pagination
    const totalPages = Math.ceil(filteredNodes.length / PAGE_SIZE);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = Math.min(startIndex + PAGE_SIZE, filteredNodes.length);
    const displayedNodes = filteredNodes.slice(startIndex, endIndex);

    const toggleNode = (address: string) => {
        const newSelected = new Set(selectedNodes);
        if (newSelected.has(address)) {
            newSelected.delete(address);
        } else {
            newSelected.add(address);
        }
        setSelectedNodes(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectedNodes.size === displayedNodes.length) {
            setSelectedNodes(new Set());
        } else {
            setSelectedNodes(new Set(displayedNodes.map(n => n.address)));
        }
    };

    const handleCompare = async () => {
        if (selectedNodes.size >= 2) {
            setLoadingStats(true);
            setShowComparison(true);
            setAiAnalysis(null);
            setAiError(null);

            // Fetch stats for selected nodes
            const statsMap = new Map<string, PNodeStats>();
            await Promise.all(
                Array.from(selectedNodes).map(async (address) => {
                    try {
                        const res = await fetch(`/api/pnodes/${encodeURIComponent(address)}`);
                        if (res.ok) {
                            const response = await res.json();
                            if (response?.success && response?.data?.stats) {
                                statsMap.set(address, response.data.stats);
                            }
                        }
                    } catch (error) {
                        console.error(`Failed to fetch stats for ${address}:`, error);
                    }
                })
            );

            setNodeStats(statsMap);
            setLoadingStats(false);
        }
    };

    const handleAiCompare = async () => {
        const selectedNodesData = getSelectedNodesData();
        if (selectedNodesData.length < 2) return;

        setLoadingAi(true);
        setAiError(null);

        try {
            const res = await fetch("/api/compare-nodes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nodes: selectedNodesData.map(n => ({ address: n.address, pubkey: n.pubkey }))
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setAiError(data.error || "Failed to generate analysis");
            } else {
                setAiAnalysis(data.analysis);
            }
        } catch (error) {
            console.error("AI comparison error:", error);
            setAiError("Failed to connect to AI service");
        } finally {
            setLoadingAi(false);
        }
    };

    const getSelectedNodesData = (): NodeWithStats[] => {
        return nodes
            .filter(node => selectedNodes.has(node.address))
            .map(node => ({
                ...node,
                stats: nodeStats.get(node.address) || null
            }));
    };

    const getHealthBadge = (timestamp: number) => {
        const health = getNodeHealth(timestamp);
        const colors: Record<string, string> = {
            healthy: "bg-green-500/20 text-green-600 border-green-500/30",
            degraded: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
            offline: "bg-red-500/20 text-red-600 border-red-500/30",
        };
        return (
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${colors[health.status] || colors.offline}`}>
                {health.text}
            </span>
        );
    };

    const getTimeAgo = (timestamp: number) => {
        const diff = Date.now() / 1000 - timestamp;
        if (diff < 60) return `${Math.floor(diff)}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    const ComparisonIndicator = ({ values, higherIsBetter = true }: { values: number[]; higherIsBetter?: boolean }) => {
        const max = Math.max(...values);
        const min = Math.min(...values);

        return values.map((value, index) => {
            if (value === max && value === min) {
                return <Minus key={index} className="w-4 h-4 text-muted-foreground" />;
            }
            const isBest = higherIsBetter ? value === max : value === min;
            return isBest ? (
                <ArrowUp key={index} className="w-4 h-4 text-green-500" />
            ) : (
                <ArrowDown key={index} className="w-4 h-4 text-red-500" />
            );
        });
    };

    if (showComparison) {
        const selectedNodesData = getSelectedNodesData();

        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                            <GitCompare className="w-6 h-6" />
                            Node Comparison
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Comparing {selectedNodesData.length} nodes
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleAiCompare}
                            disabled={loadingAi || selectedNodesData.length < 2}
                            className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 rounded-md font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingAi ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Sparkles className="w-4 h-4" />
                            )}
                            {loadingAi ? "Analyzing..." : "AI Compare"}
                        </button>
                        <button
                            onClick={() => {
                                setShowComparison(false);
                                setAiAnalysis(null);
                                setAiError(null);
                            }}
                            className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-md text-sm font-medium transition-colors"
                        >
                            ← Back
                        </button>
                    </div>
                </div>

                {/* AI Analysis Card */}
                {(aiAnalysis || loadingAi || aiError) && (
                    <Card className="border border-violet-500/30 bg-gradient-to-r from-violet-500/5 to-purple-500/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2 text-violet-600 dark:text-violet-400">
                                <Sparkles className="w-4 h-4" />
                                AI Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loadingAi && (
                                <div className="flex items-center gap-3 py-4">
                                    <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
                                    <span className="text-sm text-muted-foreground">Analyzing node performance...</span>
                                </div>
                            )}
                            {aiError && (
                                <p className="text-sm text-red-500">{aiError}</p>
                            )}
                            {aiAnalysis && !loadingAi && (
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{aiAnalysis}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Comparison Table */}
                <Card className="border border-border">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto scrollbar-hide">
                            <table className="w-full min-w-[800px]">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="py-3 px-4 text-center text-xs font-medium text-muted-foreground w-12">
                                            #
                                        </th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground">
                                            Address
                                        </th>
                                        <th className="py-3 px-4 text-center text-xs font-medium text-muted-foreground">
                                            Status
                                        </th>
                                        <th className="py-3 px-4 text-center text-xs font-medium text-muted-foreground">
                                            Version
                                        </th>
                                        <th className="py-3 px-4 text-center text-xs font-medium text-muted-foreground">
                                            CPU
                                        </th>
                                        <th className="py-3 px-4 text-center text-xs font-medium text-muted-foreground">
                                            RAM
                                        </th>
                                        <th className="py-3 px-4 text-center text-xs font-medium text-muted-foreground">
                                            Storage
                                        </th>
                                        <th className="py-3 px-4 text-center text-xs font-medium text-muted-foreground">
                                            Uptime
                                        </th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground">
                                            Public Key
                                        </th>
                                        <th className="py-3 px-4 text-center text-xs font-medium text-muted-foreground">
                                            Last Seen
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadingStats ? (
                                        <tr>
                                            <td colSpan={10} className="py-12 text-center">
                                                <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground mt-2">Loading node statistics...</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        selectedNodesData.map((node, index) => {
                                            const stats = node.stats;

                                            return (
                                                <tr key={node.address} className="border-b border-border last:border-0 hover:bg-muted/30">
                                                    <td className="py-3 px-4 text-center text-sm font-medium text-muted-foreground">
                                                        {index + 1}
                                                    </td>
                                                    <td className="py-3 px-4 text-xs font-mono">
                                                        {node.address}
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        {getHealthBadge(node.last_seen_timestamp)}
                                                    </td>
                                                    <td className="py-3 px-4 text-center text-sm">
                                                        {node.version || "–"}
                                                    </td>
                                                    <td className="py-3 px-4 text-center text-sm">
                                                        {stats?.cpu_percent !== undefined ? `${stats.cpu_percent.toFixed(1)}%` : "–"}
                                                    </td>
                                                    <td className="py-3 px-4 text-center text-sm">
                                                        {stats?.ram_used && stats?.ram_total
                                                            ? `${formatBytes(stats.ram_used)} / ${formatBytes(stats.ram_total)}`
                                                            : "–"}
                                                    </td>
                                                    <td className="py-3 px-4 text-center text-sm">
                                                        {stats?.total_bytes ? formatBytes(stats.total_bytes) : "–"}
                                                    </td>
                                                    <td className="py-3 px-4 text-center text-sm">
                                                        {stats?.uptime ? formatUptime(stats.uptime) : "–"}
                                                    </td>
                                                    <td className="py-3 px-4 text-xs font-mono">
                                                        {node.pubkey ? `${node.pubkey.slice(0, 16)}...` : "–"}
                                                    </td>
                                                    <td className="py-3 px-4 text-center text-xs text-muted-foreground">
                                                        {getTimeAgo(node.last_seen_timestamp)}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <GitCompare className="w-6 h-6" />
                        Compare Nodes
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Select nodes to compare their performance and metrics
                    </p>
                </div>

                {selectedNodes.size >= 2 && (
                    <button
                        onClick={handleCompare}
                        className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium transition-colors flex items-center gap-2"
                    >
                        <GitCompare className="w-4 h-4" />
                        Compare {selectedNodes.size} Nodes
                    </button>
                )}
            </div>

            {/* Selection Info */}
            {selectedNodes.size > 0 && (
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                    <span className="text-sm">
                        {selectedNodes.size} node{selectedNodes.size !== 1 ? 's' : ''} selected
                    </span>
                    <button
                        onClick={() => setSelectedNodes(new Set())}
                        className="text-xs text-muted-foreground hover:text-foreground"
                    >
                        Clear Selection
                    </button>
                </div>
            )}

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search by address or pubkey..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="pl-10"
                />
            </div>

            {/* Node Selection Table */}
            <Card className="border border-border">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Select Nodes to Compare</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                                    <th className="py-2 px-2 w-12">
                                        <input
                                            type="checkbox"
                                            checked={selectedNodes.size === displayedNodes.length && displayedNodes.length > 0}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 rounded border-border cursor-pointer"
                                        />
                                    </th>
                                    <th className="py-2 px-2">Status</th>
                                    <th className="py-2 px-2">Address</th>
                                    <th className="py-2 px-2">Version</th>
                                    <th className="py-2 px-2">Last Seen</th>
                                    <th className="py-2 px-2">Public Key</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedNodes.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No nodes found
                                        </td>
                                    </tr>
                                ) : (
                                    displayedNodes.map((node) => (
                                        <tr
                                            key={node.address}
                                            className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                                            onClick={() => toggleNode(node.address)}
                                        >
                                            <td className="py-2 px-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedNodes.has(node.address)}
                                                    onChange={() => toggleNode(node.address)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="w-4 h-4 rounded border-border cursor-pointer"
                                                />
                                            </td>
                                            <td className="py-2 px-2">
                                                {getHealthBadge(node.last_seen_timestamp)}
                                            </td>
                                            <td className="py-2 px-2 font-mono text-xs">
                                                {node.address}
                                            </td>
                                            <td className="py-2 px-2 font-mono text-xs">
                                                {node.version || "–"}
                                            </td>
                                            <td className="py-2 px-2 text-xs text-muted-foreground">
                                                {getTimeAgo(node.last_seen_timestamp)}
                                            </td>
                                            <td className="py-2 px-2 font-mono text-xs">
                                                {node.pubkey ? `${node.pubkey.slice(0, 8)}...` : "–"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <span className="text-sm text-muted-foreground">
                            Item {startIndex + 1} to {endIndex} of {filteredNodes.length}
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="px-3 py-1 text-sm">{currentPage} / {totalPages || 1}</span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage >= totalPages}
                                className="p-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Helper Text */}
            {selectedNodes.size < 2 && (
                <Card className="border border-border bg-muted/30">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground text-center">
                            💡 Select at least 2 nodes to enable comparison
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
