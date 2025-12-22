"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, X, Server, Cpu, HardDrive, Clock, Wifi, Eye, Copy, Check, MapPin, Globe, Loader2, Star } from "lucide-react";
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
import { useWatchlist } from "@/contexts/watchlist-context";
import type { PNodeInfo, PNodeStats } from "@/types/pnode";

interface NodesTableProps {
    nodes: PNodeInfo[];
}

interface NodeWithStats extends PNodeInfo {
    stats?: PNodeStats | null;
    geo?: {
        country: string;
        city: string;
        regionName: string;
        lat: number;
        lon: number;
        timezone: string;
    } | null;
    statsLoading?: boolean;
}

const PAGE_SIZES = [10, 25, 50, 100];

// Click to Copy Component with animated popup
function ClickToCopy({ value, display }: { value: string; display?: string }) {
    const [showCopied, setShowCopied] = useState(false);

    const handleClick = async () => {
        await navigator.clipboard.writeText(value);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 1500);
    };

    return (
        <div className="relative inline-block">
            <button
                onClick={handleClick}
                className="font-mono text-sm hover:text-primary hover:underline cursor-pointer transition-colors"
                title="Click to copy"
            >
                {display || value}
            </button>
            {showCopied && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded shadow-lg animate-fade-in-out whitespace-nowrap z-50">
                    ✓ Copied!
                </div>
            )}
        </div>
    );
}

// Copyable Field Component for modal
function CopyableField({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-1">
            <label className="text-xs text-muted-foreground">{label}</label>
            <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md group">
                <code className={`text-sm flex-1 break-all ${mono ? 'font-mono' : ''}`}>{value}</code>
                <button
                    onClick={handleCopy}
                    className="p-1 rounded hover:bg-background/50 transition-colors opacity-0 group-hover:opacity-100"
                    title="Copy to clipboard"
                >
                    {copied ? (
                        <Check className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                </button>
            </div>
        </div>
    );
}

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
    const [loadingVisibleStats, setLoadingVisibleStats] = useState(false);
    const statsCache = useRef<Map<string, PNodeStats>>(new Map());
    const { isInWatchlist, toggleWatchlist } = useWatchlist();

    useEffect(() => {
        setNodesWithStats(nodes.map(n => ({ ...n, stats: statsCache.current.get(n.address) || null, geo: null })));
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

    // Fetch stats for visible nodes
    const fetchVisibleStats = useCallback(async (nodesToFetch: NodeWithStats[]) => {
        const nodesToLoad = nodesToFetch.filter(n => !statsCache.current.has(n.address));
        if (nodesToLoad.length === 0) return;

        setLoadingVisibleStats(true);

        // Fetch ALL visible nodes in parallel for maximum speed
        const promises = nodesToLoad.map(async (node) => {
            try {
                const res = await fetch(`/api/pnodes/${encodeURIComponent(node.address)}`);
                if (res.ok) {
                    const response = await res.json();
                    if (response?.success && response?.data?.stats) {
                        statsCache.current.set(node.address, response.data.stats);
                        return { address: node.address, stats: response.data.stats };
                    }
                }
            } catch { }
            return { address: node.address, stats: null };
        });

        const results = await Promise.all(promises);

        // Update state with fetched stats
        setNodesWithStats(prev => prev.map(n => {
            const result = results.find(r => r.address === n.address);
            if (result && result.stats) {
                return { ...n, stats: result.stats };
            }
            return n;
        }));

        setLoadingVisibleStats(false);
    }, []);

    // Fetch stats when displayed nodes change
    useEffect(() => {
        if (displayedNodes.length > 0) {
            fetchVisibleStats(displayedNodes);
        }
    }, [currentPage, pageSize, search, statusFilter, fetchVisibleStats, displayedNodes.map(n => n.address).join(',')]);

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
        setLoadingNodeStats(true);

        const ip = node.address.split(':')[0];

        // Fetch stats and geo in parallel
        try {
            const [statsRes, geoRes] = await Promise.all([
                fetch(`/api/pnodes/${encodeURIComponent(node.address)}`).catch(() => null),
                fetch(`/api/geo?ip=${ip}`).catch(() => null)
            ]);

            let stats = node.stats;
            let geo = null;

            if (statsRes?.ok) {
                const response = await statsRes.json();
                // Extract stats from nested data.stats structure
                if (response?.success && response?.data?.stats) {
                    stats = response.data.stats;
                    statsCache.current.set(node.address, response.data.stats);
                }
            }

            if (geoRes?.ok) {
                const geoData = await geoRes.json();
                if (geoData.status !== 'fail') {
                    geo = {
                        country: geoData.country,
                        city: geoData.city,
                        regionName: geoData.regionName,
                        lat: geoData.lat,
                        lon: geoData.lon,
                        timezone: geoData.timezone
                    };
                }
            }

            setSelectedNode({ ...node, stats, geo });
        } catch { }

        setLoadingNodeStats(false);
    };

    const closeModal = () => setSelectedNode(null);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter, pageSize]);

    const getIpAndPort = (address: string) => {
        const parts = address.split(':');
        return { ip: parts[0], port: parts[1] || '9001' };
    };

    return (
        <>
            <Card className="border border-border bg-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                            <Server className="w-5 h-5" />
                            Node Directory
                            {loadingVisibleStats && (
                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                            )}
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
                                            <TableCell>
                                                <ClickToCopy value={node.address} />
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">{node.version || "–"}</TableCell>
                                            <TableCell className="text-sm">
                                                {node.stats?.cpu_percent !== undefined ? (
                                                    `${node.stats.cpu_percent.toFixed(1)}%`
                                                ) : loadingVisibleStats && !statsCache.current.has(node.address) ? (
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : "–"}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {node.stats ? formatRamPercent(node.stats) : loadingVisibleStats && !statsCache.current.has(node.address) ? (
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : "–"}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {node.stats ? formatStorage(node.stats) : loadingVisibleStats && !statsCache.current.has(node.address) ? (
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : "–"}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {node.stats ? formatNodeUptime(node.stats) : loadingVisibleStats && !statsCache.current.has(node.address) ? (
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : "–"}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">{getTimeAgo(node.last_seen_timestamp)}</TableCell>
                                            <TableCell>
                                                {node.pubkey ? (
                                                    <ClickToCopy
                                                        value={node.pubkey}
                                                        display={`${node.pubkey.slice(0, 8)}...`}
                                                    />
                                                ) : "–"}
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

                    <div className="relative bg-card border border-border rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto">
                        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
                            <h3 className="text-lg font-semibold">Node Details</h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleWatchlist(selectedNode.address)}
                                    className="p-2 rounded-md hover:bg-muted transition-colors"
                                    title={isInWatchlist(selectedNode.address) ? "Remove from watchlist" : "Add to watchlist"}
                                >
                                    <Star
                                        className={`w-5 h-5 transition-colors ${isInWatchlist(selectedNode.address)
                                                ? "fill-yellow-500 text-yellow-500"
                                                : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    />
                                </button>
                                <button onClick={closeModal} className="p-2 rounded-md hover:bg-muted transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4 space-y-4">
                            {loadingNodeStats ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full" />
                                </div>
                            ) : (
                                <>
                                    {/* Node ID (Pubkey) */}
                                    <CopyableField
                                        label="Node ID (Pubkey)"
                                        value={selectedNode.pubkey || "Unknown"}
                                    />

                                    {/* Gossip Address */}
                                    <CopyableField
                                        label="Gossip Address"
                                        value={selectedNode.address}
                                    />

                                    {/* RPC Address */}
                                    <CopyableField
                                        label="RPC Address"
                                        value={`${getIpAndPort(selectedNode.address).ip}:6000`}
                                    />

                                    {/* Version & Status */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground">Version</label>
                                            <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md">
                                                {selectedNode.version || "Unknown"}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground">Status</label>
                                            <div className="bg-muted px-3 py-2 rounded-md">
                                                {getHealthBadge(selectedNode.last_seen_timestamp)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    {selectedNode.geo && (
                                        <div className="space-y-2">
                                            <label className="text-xs text-muted-foreground flex items-center gap-1">
                                                <MapPin className="w-3 h-3" /> Location
                                            </label>
                                            <div className="bg-muted px-3 py-3 rounded-md space-y-1">
                                                <p className="text-sm font-medium flex items-center gap-2">
                                                    <Globe className="w-4 h-4 text-muted-foreground" />
                                                    {selectedNode.geo.country}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {selectedNode.geo.city}, {selectedNode.geo.regionName}
                                                </p>
                                                <p className="text-xs text-muted-foreground font-mono">
                                                    {selectedNode.geo.lat.toFixed(2)}°, {selectedNode.geo.lon.toFixed(2)}°
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    ({selectedNode.geo.timezone})
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Last Seen */}
                                    <div className="space-y-1">
                                        <label className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> Last Seen
                                        </label>
                                        <p className="text-sm bg-muted px-3 py-2 rounded-md">
                                            {new Date(selectedNode.last_seen_timestamp * 1000).toLocaleString()}
                                        </p>
                                    </div>

                                    {/* Resources (if available) */}
                                    {selectedNode.stats && (
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

                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">Storage:</span>{' '}
                                                    <span>{formatBytes(selectedNode.stats.total_bytes || 0)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Uptime:</span>{' '}
                                                    <span>{formatUptime(selectedNode.stats.uptime || 0)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Streams:</span>{' '}
                                                    <span>{selectedNode.stats.active_streams || 0}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Pages:</span>{' '}
                                                    <span>{selectedNode.stats.total_pages?.toLocaleString() || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
