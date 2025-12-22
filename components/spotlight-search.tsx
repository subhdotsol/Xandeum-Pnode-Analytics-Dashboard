"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, ExternalLink } from "lucide-react";
import {
    LayoutDashboard,
    BarChart3,
    Trophy,
    Map,
    Server,
    Star,
    GitCompare,
    ArrowRightLeft,
    Coins,
    BookOpen,
    Layers,
    Database,
    Zap
} from "lucide-react";

type TabType = "dashboard" | "analytics" | "leaderboard" | "map" | "nodes" | "swap" | "stake" | "watchlist" | "compare";

interface SearchItem {
    id: TabType | string;
    label: string;
    icon: React.ElementType;
    keywords: string[];
    type: "tab" | "docs";
    href?: string;
}

interface SpotlightSearchProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (tab: TabType) => void;
}

const searchableItems: SearchItem[] = [
    // Main tabs
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, keywords: ["dashboard", "home", "overview", "main"], type: "tab" },
    { id: "analytics", label: "Analytics", icon: BarChart3, keywords: ["analytics", "charts", "metrics", "data", "historical", "performance"], type: "tab" },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy, keywords: ["leaderboard", "rankings", "top", "best", "credits", "pods"], type: "tab" },
    { id: "map", label: "Map", icon: Map, keywords: ["map", "geography", "location", "world"], type: "tab" },
    { id: "nodes", label: "Directory", icon: Server, keywords: ["nodes", "directory", "list", "table"], type: "tab" },
    { id: "watchlist", label: "Watchlist", icon: Star, keywords: ["watchlist", "favorites", "starred", "saved"], type: "tab" },
    { id: "compare", label: "Compare", icon: GitCompare, keywords: ["compare", "comparison", "diff"], type: "tab" },
    { id: "swap", label: "Swap", icon: ArrowRightLeft, keywords: ["swap", "exchange", "trade"], type: "tab" },
    { id: "stake", label: "Stake", icon: Coins, keywords: ["stake", "staking", "earn", "rewards", "sol"], type: "tab" },

    // Documentation pages
    { id: "docs", label: "Documentation", icon: BookOpen, keywords: ["docs", "documentation", "help", "guide"], type: "docs", href: "/docs" },
    { id: "docs-pnodes", label: "Docs: pNodes", icon: Server, keywords: ["pnodes", "persistent nodes", "node setup", "docs"], type: "docs", href: "/docs/pnodes" },
    { id: "docs-architecture", label: "Docs: Architecture", icon: Layers, keywords: ["architecture", "structure", "design", "solana", "docs"], type: "docs", href: "/docs/architecture" },
    { id: "docs-analytics", label: "Docs: Analytics", icon: BarChart3, keywords: ["analytics docs", "metrics guide", "charts", "docs"], type: "docs", href: "/docs/analytics" },
    { id: "docs-leaderboard", label: "Docs: Leaderboard", icon: Trophy, keywords: ["leaderboard docs", "pod credits", "ranking system", "docs"], type: "docs", href: "/docs/leaderboard" },
    { id: "docs-map", label: "Docs: Global Map", icon: Map, keywords: ["map docs", "geographic distribution", "docs"], type: "docs", href: "/docs/map" },
    { id: "docs-api", label: "Docs: API Reference", icon: Database, keywords: ["api", "reference", "endpoints", "rest", "docs"], type: "docs", href: "/docs/api" },
    { id: "docs-swap", label: "Docs: Swap", icon: ArrowRightLeft, keywords: ["swap docs", "exchange", "trade", "docs"], type: "docs", href: "/docs/swap" },
    { id: "docs-staking", label: "Docs: Staking", icon: Coins, keywords: ["staking docs", "stake guide", "rewards", "docs"], type: "docs", href: "/docs/staking" },
    { id: "docs-xandai", label: "Docs: XandAI", icon: Zap, keywords: ["xandai", "ai assistant", "chatbot", "docs"], type: "docs", href: "/docs/xandai" },
];

export function SpotlightSearch({ isOpen, onClose, onNavigate }: SpotlightSearchProps) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // Fuzzy search implementation
    const filteredItems = useMemo(() => {
        if (!query.trim()) return searchableItems;

        const lowerQuery = query.toLowerCase();
        return searchableItems.filter(item => {
            // Check if query matches label or any keyword
            return item.label.toLowerCase().includes(lowerQuery) ||
                item.keywords.some(keyword => keyword.includes(lowerQuery));
        });
    }, [query]);

    // Handle item selection
    const handleItemSelect = (item: SearchItem) => {
        if (item.type === "docs" && item.href) {
            // Navigate to docs page
            router.push(item.href);
        } else if (item.type === "tab") {
            // Switch to tab
            onNavigate(item.id as TabType);
        }
        onClose();
    };

    // Reset state when opened/closed
    useEffect(() => {
        if (isOpen) {
            setQuery("");
            setSelectedIndex(0);
            // Focus input after a short delay to ensure modal is rendered
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    // Prefetch all doc pages for instant navigation
    useEffect(() => {
        if (isOpen) {
            // Prefetch all documentation pages when spotlight opens
            searchableItems.forEach(item => {
                if (item.type === "docs" && item.href) {
                    router.prefetch(item.href);
                }
            });
        }
    }, [isOpen, router]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % filteredItems.length);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
            } else if (e.key === "Enter" && filteredItems.length > 0) {
                e.preventDefault();
                const selected = filteredItems[selectedIndex];
                if (selected) {
                    handleItemSelect(selected);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, filteredItems, selectedIndex, onClose, onNavigate]);

    // Reset selected index when filtered items change
    useEffect(() => {
        setSelectedIndex(0);
    }, [filteredItems.length]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop with blur */}
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/40 z-50"
                        onClick={onClose}
                    />

                    {/* Search Modal */}
                    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="w-full max-w-2xl mx-4 pointer-events-auto"
                        >
                            <div className="bg-card border-2 border-border rounded-2xl shadow-2xl overflow-hidden">
                                {/* Search Input */}
                                <div className="flex items-center gap-3 p-4 border-b border-border">
                                    <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Search for pages..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
                                    />
                                    <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs font-mono border border-border">
                                        ESC
                                    </kbd>
                                </div>

                                {/* Results */}
                                <div className="max-h-[400px] overflow-y-auto">
                                    {filteredItems.length > 0 ? (
                                        <div className="p-2">
                                            {filteredItems.map((item, index) => {
                                                const Icon = item.icon;
                                                const isSelected = index === selectedIndex;

                                                return (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => handleItemSelect(item)}
                                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150 ${isSelected
                                                            ? "bg-primary text-primary-foreground shadow-sm"
                                                            : "hover:bg-muted text-foreground"
                                                            }`}
                                                    >
                                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                                        <span className="font-medium">{item.label}</span>
                                                        {item.type === "docs" && (
                                                            <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-50" />
                                                        )}
                                                        {isSelected && (
                                                            <kbd className="ml-auto flex items-center gap-1 px-2 py-1 bg-primary-foreground/20 rounded text-xs font-mono">
                                                                ↵
                                                            </kbd>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-muted-foreground">
                                            No results found for "{query}"
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="px-4 py-3 bg-muted/30 border-t border-border">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1">
                                                <kbd className="px-1.5 py-0.5 bg-background rounded border border-border">↑</kbd>
                                                <kbd className="px-1.5 py-0.5 bg-background rounded border border-border">↓</kbd>
                                                <span className="ml-1">Navigate</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <kbd className="px-1.5 py-0.5 bg-background rounded border border-border">↵</kbd>
                                                <span className="ml-1">Select</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Command className="w-3 h-3" />
                                            <span>+J to open</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
