"use client";

import { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, ArrowUpRight, Cpu, HardDrive, Clock } from "lucide-react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button-custom";
import { getNodeHealth } from "@/lib/network-analytics";
import { formatUptime, formatBytes } from "@/lib/utils";
import type { PNodeInfo, PNodeStats } from "@/types/pnode";

interface NodesTableProps {
    nodes: PNodeInfo[];
}

interface NodeWithStats extends PNodeInfo {
    stats?: PNodeStats | null;
}

const INITIAL_DISPLAY_COUNT = 10;

export function NodesTable({ nodes }: NodesTableProps) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [sortField, setSortField] = useState<"address" | "version" | "lastSeen" | "cpu" | "ram">(
        "lastSeen"
    );
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [showAll, setShowAll] = useState(false);
    const [nodesWithStats, setNodesWithStats] = useState<NodeWithStats[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch stats for all nodes
    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const nodesData: NodeWithStats[] = await Promise.all(
                nodes.map(async (node) => {
                    try {
                        const res = await fetch(`/api/pnodes/${encodeURIComponent(node.address)}`);
                        if (res.ok) {
                            const data = await res.json();
                            return { ...node, stats: data.stats };
                        }
                    } catch {
                        // Silently fail for individual nodes
                    }
                    return { ...node, stats: null };
                })
            );
            setNodesWithStats(nodesData);
            setLoading(false);
        };

        if (nodes.length > 0) {
            fetchStats();
        }
    }, [nodes]);

    const filteredAndSortedNodes = (() => {
        const dataSource = nodesWithStats.length > 0 ? nodesWithStats : nodes.map(n => ({ ...n, stats: null }));

        let filtered = dataSource.filter((node) => {
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
                    const ramA = a.stats ? (a.stats.ram_used / a.stats.ram_total) * 100 : 0;
                    const ramB = b.stats ? (b.stats.ram_used / b.stats.ram_total) * 100 : 0;
                    comparison = ramA - ramB;
                    break;
            }

            return sortOrder === "asc" ? comparison : -comparison;
        });

        return filtered;
    })();

    const displayedNodes = showAll
        ? filteredAndSortedNodes
        : filteredAndSortedNodes.slice(0, INITIAL_DISPLAY_COUNT);

    const hasMore = filteredAndSortedNodes.length > INITIAL_DISPLAY_COUNT;

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
        return (
            <Badge variant={health.status as any}>
                {health.icon} {health.text}
            </Badge>
        );
    };

    const getTimeAgo = (timestamp: number) => {
        const now = Math.floor(Date.now() / 1000);
        const delta = now - timestamp;
        return formatUptime(delta) + " ago";
    };

    const formatRamPercent = (stats: PNodeStats | null | undefined) => {
        if (!stats || !stats.ram_total) return "–";
        return ((stats.ram_used / stats.ram_total) * 100).toFixed(1) + "%";
    };

    const formatStorage = (stats: PNodeStats | null | undefined) => {
        if (!stats) return "–";
        return formatBytes(stats.file_size || stats.total_bytes || 0);
    };

    const formatNodeUptime = (stats: PNodeStats | null | undefined) => {
        if (!stats || !stats.uptime) return "–";
        return formatUptime(stats.uptime);
    };

    return (
        <Card className="border border-border bg-card">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <Filter className="w-5 h-5" />
                        Node Registry
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                        {displayedNodes.length} / {filteredAndSortedNodes.length} nodes
                        {loading && <span className="ml-2">(Loading stats...)</span>}
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
                                <TableHead
                                    className="cursor-pointer hover:text-foreground"
                                    onClick={() => handleSort("address")}
                                >
                                    Address{" "}
                                    {sortField === "address" && (sortOrder === "asc" ? "↑" : "↓")}
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:text-foreground"
                                    onClick={() => handleSort("version")}
                                >
                                    Version{" "}
                                    {sortField === "version" && (sortOrder === "asc" ? "↑" : "↓")}
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:text-foreground"
                                    onClick={() => handleSort("cpu")}
                                >
                                    <div className="flex items-center gap-1">
                                        <Cpu className="w-3 h-3" />
                                        CPU{" "}
                                        {sortField === "cpu" && (sortOrder === "asc" ? "↑" : "↓")}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:text-foreground"
                                    onClick={() => handleSort("ram")}
                                >
                                    RAM{" "}
                                    {sortField === "ram" && (sortOrder === "asc" ? "↑" : "↓")}
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
                                <TableHead
                                    className="cursor-pointer hover:text-foreground"
                                    onClick={() => handleSort("lastSeen")}
                                >
                                    Last Seen{" "}
                                    {sortField === "lastSeen" && (sortOrder === "asc" ? "↑" : "↓")}
                                </TableHead>
                                <TableHead>Public Key</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayedNodes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-8">
                                        <p className="text-muted-foreground">No nodes found</p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                displayedNodes.map((node) => (
                                    <TableRow
                                        key={node.address}
                                        className="hover:bg-muted/50 transition-colors"
                                    >
                                        <TableCell>{getHealthBadge(node.last_seen_timestamp)}</TableCell>
                                        <TableCell className="font-mono text-sm">
                                            <div className="flex items-center gap-2">
                                                <span>{node.address}</span>
                                                <Link
                                                    href={`/pnode/${encodeURIComponent(node.address)}`}
                                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                                    title="View node details"
                                                >
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-mono text-sm">{node.version || "–"}</span>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {node.stats?.cpu_percent !== undefined
                                                ? `${node.stats.cpu_percent.toFixed(1)}%`
                                                : "–"}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {formatRamPercent(node.stats)}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {formatStorage(node.stats)}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formatNodeUptime(node.stats)}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {getTimeAgo(node.last_seen_timestamp)}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            {node.pubkey ? `${node.pubkey.slice(0, 8)}...` : "–"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* View More button */}
                {hasMore && !showAll && (
                    <div className="flex justify-center py-4">
                        <Button
                            variant="secondary"
                            onClick={() => setShowAll(true)}
                            className="inline-flex items-center gap-2"
                        >
                            <span>View More ({filteredAndSortedNodes.length - INITIAL_DISPLAY_COUNT} more)</span>
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                {/* Show Less button */}
                {showAll && hasMore && (
                    <div className="flex justify-center py-4 border-t border-border">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setShowAll(false)}
                            className="inline-flex items-center gap-2"
                        >
                            <span>Show Less</span>
                            <ChevronDown className="w-4 h-4 rotate-180" />
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
