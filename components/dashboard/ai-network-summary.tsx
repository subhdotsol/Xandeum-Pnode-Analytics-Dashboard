"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, RefreshCw, AlertCircle, TrendingUp, Shield, Clock, Zap } from "lucide-react";

interface NetworkMetrics {
    totalNodes: number;
    healthyNodes: number;
    degradedNodes: number;
    offlineNodes: number;
    healthScore: number;
    latestVersion: string;
    nodesOnLatest: number;
    outdatedNodes: number;
    avgUptime: string;
}

interface SummaryData {
    summary: string;
    metrics: NetworkMetrics;
    generatedAt: string;
}

export function AINetworkSummary() {
    const [data, setData] = useState<SummaryData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastFetch, setLastFetch] = useState<Date | null>(null);

    const fetchSummary = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/network-summary");
            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || "Failed to fetch summary");
            }

            setData(result);
            setLastFetch(new Date());
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load AI summary");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, []);

    const getHealthColor = (score: number) => {
        if (score >= 80) return "text-green-500";
        if (score >= 60) return "text-yellow-500";
        return "text-red-500";
    };

    return (
        <Card className="border border-border bg-card">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-violet-500" />
                        AI Network Insights
                    </CardTitle>
                    <div className="flex items-center gap-3">
                        {lastFetch && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {lastFetch.toLocaleTimeString()}
                            </span>
                        )}
                        <button
                            onClick={fetchSummary}
                            disabled={loading}
                            className="p-1.5 rounded-md hover:bg-muted transition-colors disabled:opacity-50"
                            title="Refresh summary"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {loading && !data ? (
                    <div className="space-y-3">
                        <div className="h-4 bg-muted rounded animate-pulse w-full" />
                        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                        <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                    </div>
                ) : error ? (
                    <div className="flex items-center gap-2 text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                    </div>
                ) : data ? (
                    <div className="space-y-4">
                        {/* AI Summary */}
                        <p className="text-sm leading-relaxed">{data.summary}</p>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-border">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Health Score</p>
                                <p className={`text-lg font-semibold ${getHealthColor(data.metrics.healthScore)}`}>
                                    {data.metrics.healthScore}/100
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Healthy Nodes</p>
                                <p className="text-lg font-semibold">
                                    <span className="text-green-500">{data.metrics.healthyNodes}</span>
                                    <span className="text-muted-foreground text-sm">/{data.metrics.totalNodes}</span>
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Outdated</p>
                                <p className={`text-lg font-semibold ${data.metrics.outdatedNodes > 0 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                                    {data.metrics.outdatedNodes}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Latest Version</p>
                                <p className="text-sm font-mono">{data.metrics.latestVersion || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                            <Zap className="w-3 h-3" />
                            <span>Powered by Gemini AI</span>
                        </div>
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}
