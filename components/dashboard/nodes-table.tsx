"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ChevronDown } from "lucide-react";
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
import { formatUptime } from "@/lib/utils";
import type { PNodeInfo } from "@/types/pnode";

interface NodesTableProps {
    nodes: PNodeInfo[];
}

const INITIAL_DISPLAY_COUNT = 10;

export function NodesTable({ nodes }: NodesTableProps) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [sortField, setSortField] = useState<"address" | "version" | "lastSeen">(
        "lastSeen"
    );
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [showAll, setShowAll] = useState(false);

    const filteredAndSortedNodes = (() => {
        let filtered = nodes.filter((node) => {
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

    return (
        <Card className="light-card dark:glass-card border-border">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-accent" />
                        <span className="notion-text-gradient dark:text-foreground">Network Nodes</span>
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                        {displayedNodes.length} / {filteredAndSortedNodes.length} nodes
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
                <div className="rounded-md border border-border overflow-hidden relative">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead
                                    className="cursor-pointer hover:text-foreground"
                                    onClick={() => handleSort("address")}
                                >
                                    Address{" "}
                                    {sortField === "address" && (sortOrder === "asc" ? "↑" : "↓")}
                                </TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead
                                    className="cursor-pointer hover:text-foreground"
                                    onClick={() => handleSort("version")}
                                >
                                    Version{" "}
                                    {sortField === "version" && (sortOrder === "asc" ? "↑" : "↓")}
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
                                    <TableCell colSpan={5} className="text-center py-8">
                                        <p className="text-muted-foreground">No nodes found</p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {displayedNodes.map((node, index) => (
                                        <motion.tr
                                            key={node.address}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: index * 0.02 }}
                                            className="border-b border-border hover:bg-muted/50 transition-colors"
                                        >
                                            <TableCell className="font-mono text-sm">
                                                {node.address}
                                            </TableCell>
                                            <TableCell>{getHealthBadge(node.last_seen_timestamp)}</TableCell>
                                            <TableCell>
                                                <span className="font-mono text-sm">{node.version || "unknown"}</span>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {getTimeAgo(node.last_seen_timestamp)}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs text-muted-foreground truncate max-w-[200px]">
                                                {node.pubkey || "N/A"}
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            )}
                        </TableBody>
                    </Table>

                    {/* Blur overlay and View More button */}
                    {hasMore && !showAll && (
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent flex items-end justify-center pb-4">
                            <Button
                                variant="secondary"
                                onClick={() => setShowAll(true)}
                                className="gap-2"
                            >
                                View More ({filteredAndSortedNodes.length - INITIAL_DISPLAY_COUNT} more)
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
                                className="gap-2"
                            >
                                Show Less
                                <ChevronDown className="w-4 h-4 rotate-180" />
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
