"use client";

import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, X, Server, Cpu, HardDrive, Clock, Wifi, Eye } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getNodeHealth } from "@/lib/network-analytics";
import { formatUptime, formatBytes } from "@/lib/utils";
import type { PNodeInfo, PNodeStats } from "@/types/pnode";

interface NodesTableProps {
    nodes: PNodeInfo[];
}

interface NodeWithStats extends PNodeInfo {
    stats?: PNodeStats | null;
}

const PAGE_SIZES = [10, 25, 50, 100];

export function NodesTable({ nodes }: NodesTableProps) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [sortField, setSortField] = useState<"address" | "version" | "lastSeen" | "cpu" | "ram">("lastSeen");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [nodesWithStats, setNodesWithStats] = useState<NodeWithStats[]>([]);
    const [selectedNode, setSelectedNode] = useState<NodeWithStats | null>(null);
    const [loadingNodeStats, setLoadingNodeStats] = useState(false);

    useEffect(() => {
        setNodesWithStats(nodes.map(n => ({ ...n, stats: null })));
    }, [nodes]);

    const filteredAndSortedNodes = (() => {
        let filtered = nodesWithStats.filter((node) => {
            const matchesSearch =
                search === "" ||
                node.address.toLowerCase().includes(search.toLowerCase()) ||
                node.pubkey?.toLowerCase().includes(search.toLowerCase());

            if (!matchesSearch) return false;
            if (statusFilter === "all") return true;

            const health = getNodeHealth(node.last_seen_timestamp);
            return health.status === statusFilter;
        });

        filtered.sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case "address":
                    comparison = a.address.localeCompare(b.address);
                    break;
                case "version":
                    comparison = (a.version || "").localeCompare(b.version || "");
                    break;
                case "lastSeen":
                    comparison = a.last_seen_timestamp - b.last_seen_timestamp;
                    break;
                case "cpu":
                    comparison = (a.stats?.cpu_percent || 0) - (b.stats?.cpu_percent || 0);
                    break;
                case "ram":
                    const aRam = a.stats ? (a.stats.ram_used / a.stats.ram_total) * 100 : 0;
                    const bRam = b.stats ? (b.stats.ram_used / b.stats.ram_total) * 100 : 0;
                    comparison = aRam - bRam;
                    break;
            }
            return sortOrder === "asc" ? comparison : -comparison;
        });

        return filtered;
    })();

    const totalNodes = filteredAndSortedNodes.length;
    const totalPages = Math.ceil(totalNodes / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalNodes);
    const displayedNodes = filteredAndSortedNodes.slice(startIndex, endIndex);

    const handleSort = (field: typeof sortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("desc");
        }
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

    const formatRamPercent = (stats: PNodeStats | null | undefined) => {
        if (!stats || !stats.ram_total) return "–";
        return `${((stats.ram_used / stats.ram_total) * 100).toFixed(0)}%`;
    };

    const formatStorage = (stats: PNodeStats | null | undefined) => {
        if (!stats) return "–";
        return formatBytes(stats.file_size || stats.total_bytes || 0);
    };

    const formatNodeUptime = (stats: PNodeStats | null | undefined) => {
        if (!stats || !stats.uptime) return "–";
        return formatUptime(stats.uptime);
    };

    const openNodeModal = async (node: NodeWithStats) => {
        setSelectedNode(node);

        if (!node.stats) {
            setLoadingNodeStats(true);
            try {
                const res = await fetch(`/api/pnodes/${encodeURIComponent(node.address)}`);
                if (res.ok) {
                    const data = await res.json();
                    setSelectedNode({ ...node, stats: data });
                }
            } catch { }
            setLoadingNodeStats(false);
        }
    };

    const closeModal = () => setSelectedNode(null);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter, pageSize]);

    return (
        <>
            <Card className="border border-border bg-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                            <Server className="w-5 h-5" />
                            Node Registry
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">
                            {totalNodes} nodes
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Filters */}
                    <div className="flex gap-4 flex-wrap">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by address or pubkey..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 rounded-md bg-background border border-input text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="healthy">Healthy</option>
                            <option value="degraded">Degraded</option>
                            <option value="offline">Offline</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="rounded-md border border-border overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="cursor-pointer hover:text-foreground" onClick={() => handleSort("address")}>
                                        Address {sortField === "address" && (sortOrder === "asc" ? "↑" : "↓")}
                                    </TableHead>
                                    <TableHead className="cursor-pointer hover:text-foreground" onClick={() => handleSort("version")}>
                                        Version {sortField === "version" && (sortOrder === "asc" ? "↑" : "↓")}
                                    </TableHead>
                                    <TableHead className="cursor-pointer hover:text-foreground" onClick={() => handleSort("cpu")}>
                                        <div className="flex items-center gap-1">
                                            <Cpu className="w-3 h-3" />
                                            CPU {sortField === "cpu" && (sortOrder === "asc" ? "↑" : "↓")}
                                        </div>
                                    </TableHead>
                                    <TableHead className="cursor-pointer hover:text-foreground" onClick={() => handleSort("ram")}>
                                        RAM {sortField === "ram" && (sortOrder === "asc" ? "↑" : "↓")}
                                    </TableHead>
                                    <TableHead>
                                        <div className="flex items-center gap-1">
                                            <HardDrive className="w-3 h-3" />
                                            Storage
                                        </div>
                                    </TableHead>
                                    <TableHead>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            Uptime
                                        </div>
                                    </TableHead>
                                    <TableHead className="cursor-pointer hover:text-foreground" onClick={() => handleSort("lastSeen")}>
                                        Last Seen {sortField === "lastSeen" && (sortOrder === "asc" ? "↑" : "↓")}
                                    </TableHead>
                                    <TableHead>Public Key</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {displayedNodes.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center py-8">
                                            <p className="text-muted-foreground">No nodes found</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    displayedNodes.map((node) => (
                                        <TableRow key={node.address} className="hover:bg-muted/50 transition-colors">
                                            <TableCell>{getHealthBadge(node.last_seen_timestamp)}</TableCell>
                                            <TableCell className="font-mono text-sm">{node.address}</TableCell>
                                            <TableCell className="font-mono text-sm">{node.version || "–"}</TableCell>
                                            <TableCell className="text-sm">
                                                {node.stats?.cpu_percent !== undefined ? `${node.stats.cpu_percent.toFixed(1)}%` : "–"}
                                            </TableCell>
                                            <TableCell className="text-sm">{formatRamPercent(node.stats)}</TableCell>
                                            <TableCell className="text-sm">{formatStorage(node.stats)}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{formatNodeUptime(node.stats)}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground">{getTimeAgo(node.last_seen_timestamp)}</TableCell>
                                            <TableCell className="font-mono text-xs text-muted-foreground">
                                                {node.pubkey ? `${node.pubkey.slice(0, 8)}...` : "–"}
                                            </TableCell>
                                            <TableCell>
                                                <button
                                                    onClick={() => openNodeModal(node)}
                                                    className="p-2 rounded-md hover:bg-muted transition-colors"
                                                    title="View node details"
                                                >
                                                    <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Show</span>
                            <select
                                value={pageSize}
                                onChange={(e) => setPageSize(Number(e.target.value))}
                                className="px-2 py-1 rounded-md bg-background border border-input text-sm"
                            >
                                {PAGE_SIZES.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                            <span>per page</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                                Item {startIndex + 1} to {endIndex} of {totalNodes}
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
                    </div>
                </CardContent>
            </Card>

            {/* Node Details Modal */}
            {selectedNode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={closeModal} />

                    <div className="relative bg-card border border-border rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Node Details</h3>
                            <button onClick={closeModal} className="p-2 rounded-md hover:bg-muted transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                {getHealthBadge(selectedNode.last_seen_timestamp)}
                                <span className="text-xs text-muted-foreground">
                                    Last seen: {getTimeAgo(selectedNode.last_seen_timestamp)}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-muted-foreground">Address</label>
                                <code className="block text-sm bg-muted px-3 py-2 rounded-md break-all">{selectedNode.address}</code>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground">Version</label>
                                    <p className="text-sm font-mono">{selectedNode.version || "Unknown"}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground">Public Key</label>
                                    <p className="text-sm font-mono truncate" title={selectedNode.pubkey || undefined}>
                                        {selectedNode.pubkey ? `${selectedNode.pubkey.slice(0, 12)}...` : "–"}
                                    </p>
                                </div>
                            </div>

                            {loadingNodeStats ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full" />
                                </div>
                            ) : selectedNode.stats ? (
                                <>
                                    <div className="border-t border-border pt-4 space-y-4">
                                        <h4 className="text-sm font-medium flex items-center gap-2">
                                            <Cpu className="w-4 h-4" /> Resources
                                        </h4>

                                        <div className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">CPU</span>
                                                <span>{selectedNode.stats.cpu_percent?.toFixed(1) || 0}%</span>
                                            </div>
                                            <Progress value={selectedNode.stats.cpu_percent || 0} className="h-2" />
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">RAM</span>
                                                <span>{formatBytes(selectedNode.stats.ram_used || 0)} / {formatBytes(selectedNode.stats.ram_total || 0)}</span>
                                            </div>
                                            <Progress value={selectedNode.stats.ram_total ? (selectedNode.stats.ram_used / selectedNode.stats.ram_total) * 100 : 0} className="h-2" />
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Storage</span>
                                                <span>{formatBytes(selectedNode.stats.total_bytes || 0)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-border pt-4 grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> Uptime
                                            </label>
                                            <p className="text-sm">{formatUptime(selectedNode.stats.uptime || 0)}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Wifi className="w-3 h-3" /> Active Streams
                                            </label>
                                            <p className="text-sm">{selectedNode.stats.active_streams || 0}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground">Pages Processed</label>
                                            <p className="text-sm">{selectedNode.stats.total_pages?.toLocaleString() || 0}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground">Packets RX/TX</label>
                                            <p className="text-sm">{selectedNode.stats.packets_received || 0} / {selectedNode.stats.packets_sent || 0}</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>Stats not available for this node</p>
                                    <p className="text-xs mt-1">The node may be behind a firewall</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
