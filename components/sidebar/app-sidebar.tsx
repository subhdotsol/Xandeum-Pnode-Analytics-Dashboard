"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    BarChart3,
    Trophy,
    Map,
    BookOpen,
    X,
    Command,
    Home,
    Star,
    GitCompare,
    Server,
    ArrowRightLeft,
    Coins,
    TrendingUp
} from "lucide-react";

interface AppSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    activeTab: string;
    onTabChange: (tab: 'dashboard' | 'analytics' | 'leaderboard' | 'map' | 'nodes' | 'trading' | 'swap' | 'stake' | 'watchlist' | 'compare') => void;
}

const navigationItems: Array<{
    id: string;
    icon: typeof LayoutDashboard;
    label: string;
    isExternal: boolean;
    href?: string;
}> = [
        { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", isExternal: false },
        { id: "analytics", icon: BarChart3, label: "Analytics", isExternal: false },
        { id: "leaderboard", icon: Trophy, label: "Leaderboard", isExternal: false },
        { id: "map", icon: Map, label: "Map", isExternal: false },
        { id: "nodes", icon: Server, label: "Directory", isExternal: false },
        { id: "watchlist", icon: Star, label: "Watchlist", isExternal: false },
        { id: "compare", icon: GitCompare, label: "Compare", isExternal: false },
        { id: "trading", icon: TrendingUp, label: "Trading", isExternal: false },
        { id: "swap", icon: ArrowRightLeft, label: "Swap", isExternal: false },
        { id: "stake", icon: Coins, label: "Stake", isExternal: false },
        { id: "docs", icon: BookOpen, label: "Documentation", isExternal: true, href: "/docs" },
    ];

export function AppSidebar({ isOpen, onClose, activeTab, onTabChange }: AppSidebarProps) {
    // Close on mobile after navigation
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768 && isOpen) {
                onClose();
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isOpen, onClose]);

    const handleItemClick = (item: typeof navigationItems[0]) => {
        if (item.isExternal) {
            // Docs is external - do nothing, let Link handle it
            return;
        }

        // Switch tabs
        onTabChange(item.id as 'dashboard' | 'analytics' | 'leaderboard' | 'map' | 'nodes' | 'trading' | 'swap' | 'stake' | 'watchlist' | 'compare');

        // Auto-close on mobile
        if (window.innerWidth < 768) {
            onClose();
        }
    };

    return (
        <>
            {/* Backdrop for mobile */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed left-0 top-0 h-screen w-[280px] bg-card border-r border-border z-50 flex flex-col shadow-lg rounded-r-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <div className="flex items-center gap-3">
                                <Image
                                    src="/icon.png"
                                    alt="Xandeum"
                                    width={32}
                                    height={32}
                                    className="rounded-lg"
                                />
                                <div>
                                    <span className="font-semibold text-foreground text-base">Xandeum</span>
                                    <p className="text-xs text-muted-foreground">Explorer</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-muted rounded-lg transition-colors lg:hidden"
                                aria-label="Close sidebar"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 p-4 space-y-1">
                            <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Navigation
                            </p>
                            {navigationItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeTab === item.id;

                                if (item.isExternal) {
                                    // Home and Docs are links
                                    return (
                                        <Link
                                            key={item.id}
                                            href={item.href || "/docs"}
                                            onClick={onClose}
                                            prefetch={true}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ease-in-out text-muted-foreground hover:bg-muted hover:text-foreground group"
                                        >
                                            <Icon className="w-5 h-5 transition-colors" />
                                            <span className="font-medium text-sm">{item.label}</span>
                                        </Link>
                                    );
                                }

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleItemClick(item)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ease-in-out ${isActive
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium text-sm">{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Footer with keyboard shortcuts */}
                        <div className="p-4 border-t border-border space-y-3">
                            <div className="space-y-2">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Shortcuts
                                </p>
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Toggle Sidebar</span>
                                        <kbd className="px-2 py-1 bg-muted rounded text-[10px] font-mono border border-border flex items-center gap-0.5">
                                            <Command className="w-2.5 h-2.5" />
                                            <span>K</span>
                                        </kbd>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Spotlight</span>
                                        <kbd className="px-2 py-1 bg-muted rounded text-[10px] font-mono border border-border flex items-center gap-0.5">
                                            <Command className="w-2.5 h-2.5" />
                                            <span>J</span>
                                        </kbd>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Ask AI</span>
                                        <kbd className="px-2 py-1 bg-muted rounded text-[10px] font-mono border border-border flex items-center gap-0.5">
                                            <Command className="w-2.5 h-2.5" />
                                            <span>A</span>
                                        </kbd>
                                    </div>
                                </div>
                            </div>

                            {/* Status indicator */}
                            <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                <span className="text-xs text-muted-foreground">Network</span>
                                <span className="flex items-center gap-1.5 text-xs text-foreground">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    Online
                                </span>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
}
