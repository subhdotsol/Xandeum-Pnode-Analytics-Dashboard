"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface WatchlistContextType {
    watchlist: string[];
    addToWatchlist: (address: string) => void;
    removeFromWatchlist: (address: string) => void;
    isInWatchlist: (address: string) => boolean;
    toggleWatchlist: (address: string) => void;
    clearWatchlist: () => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

const STORAGE_KEY = "pnode-watchlist";

export function WatchlistProvider({ children }: { children: ReactNode }) {
    const [watchlist, setWatchlist] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setWatchlist(Array.isArray(parsed) ? parsed : []);
            }
        } catch (error) {
            console.error("Failed to load watchlist from localStorage:", error);
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever watchlist changes
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
            } catch (error) {
                console.error("Failed to save watchlist to localStorage:", error);
            }
        }
    }, [watchlist, isLoaded]);

    const addToWatchlist = (address: string) => {
        setWatchlist((prev) => {
            if (prev.includes(address)) return prev;
            return [...prev, address];
        });
    };

    const removeFromWatchlist = (address: string) => {
        setWatchlist((prev) => prev.filter((addr) => addr !== address));
    };

    const isInWatchlist = (address: string) => {
        return watchlist.includes(address);
    };

    const toggleWatchlist = (address: string) => {
        if (isInWatchlist(address)) {
            removeFromWatchlist(address);
        } else {
            addToWatchlist(address);
        }
    };

    const clearWatchlist = () => {
        setWatchlist([]);
    };

    return (
        <WatchlistContext.Provider
            value={{
                watchlist,
                addToWatchlist,
                removeFromWatchlist,
                isInWatchlist,
                toggleWatchlist,
                clearWatchlist,
            }}
        >
            {children}
        </WatchlistContext.Provider>
    );
}

export function useWatchlist() {
    const context = useContext(WatchlistContext);
    if (context === undefined) {
        throw new Error("useWatchlist must be used within a WatchlistProvider");
    }
    return context;
}
