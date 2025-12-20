"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";

interface LastSyncProps {
    onRefresh: () => void;
    isRefreshing?: boolean;
}

export function LastSync({ onRefresh, isRefreshing = false }: LastSyncProps) {
    const [secondsAgo, setSecondsAgo] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsAgo((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Reset counter when refresh happens
    useEffect(() => {
        if (!isRefreshing) {
            setSecondsAgo(0);
        }
    }, [isRefreshing]);

    const formatTime = (seconds: number) => {
        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        return `${Math.floor(seconds / 3600)}h ago`;
    };

    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Last sync {formatTime(secondsAgo)}</span>
            <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="p-1.5 rounded-md hover:bg-muted transition-colors disabled:opacity-50"
                title="Refresh data"
            >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
        </div>
    );
}
