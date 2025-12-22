"use client";

import { useState, useMemo } from "react";
import { Star, Eye, Search, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useWatchlist } from "@/contexts/watchlist-context";
import { getNodeHealth } from "@/lib/network-analytics";
import type { PNodeInfo } from "@/types/pnode";

interface WatchlistProps {
    nodes: PNodeInfo[];
}

export function Watchlist({ nodes }: WatchlistProps) {
    const { watchlist, removeFromWatchlist, clearWatchlist } = useWatchlist();
    const [search, setSearch] = useState("");
    const [selectedNode, setSelectedNode] = useState<PNodeInfo | null>(null);

    // Filter nodes to only show watchlisted ones
    const watchlistedNodes = useMemo(() => {
        return nodes.filter((node) => watchlist.includes(node.address));
    }, [nodes, watchlist]);

    // Apply search filter
    const filteredNodes = useMemo(() => {
        if (!search) return watchlistedNodes;
        return watchlistedNodes.filter(
            (node) =>
                node.address.toLowerCase().includes(search.toLowerCase()) ||
                node.pubkey?.toLowerCase().includes(search.toLowerCase())
        );
    }, [watchlistedNodes, search]);

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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                        Watchlist
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        {watchlistedNodes.length} node{watchlistedNodes.length !== 1 ? "s" : ""} saved
                    </p>
                </div>

                {watchlistedNodes.length > 0 && (
                    <button
                        onClick={clearWatchlist}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-md transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Clear All
                    </button>
                )}
            </div>

            {/* Search */}
            {watchlistedNodes.length > 0 && (
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search watchlist..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
            )}

            {/* Empty State */}
            {watchlistedNodes.length === 0 ? (
                <Card className="border border-border">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Star className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No nodes in watchlist</h3>
                        <p className="text-sm text-muted-foreground text-center max-w-md">
                            Add nodes to your watchlist by clicking the star icon in node details.
                            Your watchlist will be saved locally.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Saved Nodes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                                        <th className="py-2 px-2">Status</th>
                                        <th className="py-2 px-2">Address</th>
                                        <th className="py-2 px-2">Version</th>
                                        <th className="py-2 px-2">Last Seen</th>
                                        <th className="py-2 px-2">Public Key</th>
                                        <th className="py-2 px-2 w-20">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredNodes.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-8 text-muted-foreground">
                                                No nodes match your search
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredNodes.map((node) => (
                                            <tr
                                                key={node.address}
                                                className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                                            >
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
                                                <td className="py-2 px-2">
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => setSelectedNode(node)}
                                                            className="p-1.5 rounded-md hover:bg-muted transition-colors"
                                                            title="View details"
                                                        >
                                                            <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                                                        </button>
                                                        <button
                                                            onClick={() => removeFromWatchlist(node.address)}
                                                            className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors"
                                                            title="Remove from watchlist"
                                                        >
                                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 hover:fill-transparent" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Simple Modal (can be enhanced later) */}
            {selectedNode && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedNode(null)}
                >
                    <Card
                        className="w-full max-w-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <CardHeader>
                            <CardTitle>Node Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-xs text-muted-foreground">Address</p>
                                <p className="text-sm font-mono">{selectedNode.address}</p>
                            </div>
                            {selectedNode.pubkey && (
                                <div>
                                    <p className="text-xs text-muted-foreground">Public Key</p>
                                    <p className="text-sm font-mono break-all">{selectedNode.pubkey}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-xs text-muted-foreground">Version</p>
                                <p className="text-sm">{selectedNode.version || "Unknown"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Status</p>
                                {getHealthBadge(selectedNode.last_seen_timestamp)}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
