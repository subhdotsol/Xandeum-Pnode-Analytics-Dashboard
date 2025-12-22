"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import type { PNodeStats } from "@/types/pnode";

interface HistoricalDataPoint {
    timestamp: number;
    totalNodes: number;
    healthyNodes: number;
    degradedNodes: number;
    offlineNodes: number;
    avgCpu: number;
    avgRam: number;
    totalStorage: number;
    uniqueCountries: number;
    uniqueVersions: number;
}

interface PrefetchState {
    // Historical data for Analytics
    historicalData: HistoricalDataPoint[] | null;
    historicalLoading: boolean;

    // Leaderboard node stats
    leaderboardStats: Map<string, PNodeStats>;
    leaderboardLoading: boolean;

    // Track if prefetch has started
    hasPrefetched: boolean;
}

interface PrefetchContextType extends PrefetchState {
    startPrefetch: (nodeAddresses: string[]) => void;
}

const PrefetchContext = createContext<PrefetchContextType | null>(null);

export function usePrefetch() {
    const context = useContext(PrefetchContext);
    if (!context) {
        throw new Error("usePrefetch must be used within DataPrefetchProvider");
    }
    return context;
}

export function DataPrefetchProvider({ children }: { children: React.ReactNode }) {
    const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[] | null>(null);
    const [historicalLoading, setHistoricalLoading] = useState(false);
    const [leaderboardStats, setLeaderboardStats] = useState<Map<string, PNodeStats>>(new Map());
    const [leaderboardLoading, setLeaderboardLoading] = useState(false);
    const [hasPrefetched, setHasPrefetched] = useState(false);

    const prefetchStarted = useRef(false);

    const startPrefetch = useCallback(async (nodeAddresses: string[]) => {
        if (prefetchStarted.current) return;
        prefetchStarted.current = true;
        setHasPrefetched(true);

        // Prefetch historical data for Analytics tab
        setHistoricalLoading(true);
        fetch("/api/historical?range=1h")
            .then(res => res.ok ? res.json() : null)
            .then(response => {
                if (response?.data) {
                    setHistoricalData(response.data);
                }
            })
            .catch(() => { })
            .finally(() => setHistoricalLoading(false));

        // Prefetch leaderboard stats (top 50 nodes)
        setLeaderboardLoading(true);
        const nodesToFetch = nodeAddresses.slice(0, 50);
        const newStats = new Map<string, PNodeStats>();

        await Promise.all(
            nodesToFetch.map(async (address) => {
                try {
                    const res = await fetch(`/api/pnodes/${encodeURIComponent(address)}`);
                    if (res.ok) {
                        const response = await res.json();
                        if (response?.success && response?.data?.stats) {
                            newStats.set(address, response.data.stats);
                        }
                    }
                } catch { }
            })
        );

        setLeaderboardStats(newStats);
        setLeaderboardLoading(false);
    }, []);

    return (
        <PrefetchContext.Provider
            value={{
                historicalData,
                historicalLoading,
                leaderboardStats,
                leaderboardLoading,
                hasPrefetched,
                startPrefetch,
            }}
        >
            {children}
        </PrefetchContext.Provider>
    );
}
