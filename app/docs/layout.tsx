"use client";

import { useState, ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Home, Server, Code, Layers, ArrowLeft, PanelLeftClose, PanelLeft, Bot, ArrowLeftRight, Coins, BarChart3, Trophy, Globe } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";

interface DocsLayoutProps {
    children: ReactNode;
}

const sidebarSections = [
    {
        title: "Getting Started",
        items: [
            { href: "/", label: "Home", icon: Home },
            { href: "/docs", label: "Overview", icon: Home },
            { href: "/docs/pnodes", label: "pNodes", icon: Server },
            { href: "/docs/architecture", label: "Architecture", icon: Layers },
        ]
    },
    {
        title: "Dashboard Features",
        items: [
            { href: "/docs/analytics", label: "Analytics", icon: BarChart3 },
            { href: "/docs/leaderboard", label: "Pod Credits", icon: Trophy },
            { href: "/docs/map", label: "Global Map", icon: Globe },
        ]
    },
    {
        title: "DeFi",
        items: [
            { href: "/docs/swap", label: "Token Swap", icon: ArrowLeftRight },
            { href: "/docs/staking", label: "Stake SOL", icon: Coins },
        ]
    },
    {
        title: "AI & API",
        items: [
            { href: "/docs/xandai", label: "XandAI Bot", icon: Bot },
            { href: "/docs/api", label: "API Reference", icon: Code },
        ]
    },
];

export default function DocsLayout({ children }: DocsLayoutProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Cmd/Ctrl + K for docs sidebar toggle
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsCollapsed(prev => !prev);
            }

            // Cmd/Ctrl + J for AI assistant
            if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
                e.preventDefault();
                const askAiButton = document.querySelector('[aria-label="Ask AI"]') as HTMLButtonElement;
                if (askAiButton) {
                    askAiButton.click();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="min-h-screen bg-background flex">
            {/* Desktop Docs Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 64 : 280 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="hidden lg:flex flex-col fixed top-0 left-0 h-full bg-card border-r border-border z-20 rounded-r-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border h-14">
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    <ArrowLeft className="w-4 h-4 flex-shrink-0" />
                                    <span className="whitespace-nowrap">Back to Dashboard</span>
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 rounded-md hover:bg-muted transition-colors flex-shrink-0"
                    >
                        {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto p-3">
                    {sidebarSections.map((section, sectionIdx) => (
                        <div key={section.title} className={sectionIdx > 0 ? "mt-6" : ""}>
                            <AnimatePresence>
                                {!isCollapsed && (
                                    <motion.h2
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2"
                                    >
                                        {section.title}
                                    </motion.h2>
                                )}
                            </AnimatePresence>
                            <nav className="space-y-1">
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            title={isCollapsed ? item.label : undefined}
                                            prefetch={true}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${isActive
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                } ${isCollapsed ? "justify-center" : ""}`}
                                        >
                                            <Icon className="w-4 h-4 flex-shrink-0" />
                                            <AnimatePresence>
                                                {!isCollapsed && (
                                                    <motion.span
                                                        initial={{ opacity: 0, width: 0 }}
                                                        animate={{ opacity: 1, width: "auto" }}
                                                        exit={{ opacity: 0, width: 0 }}
                                                        className="whitespace-nowrap overflow-hidden"
                                                    >
                                                        {item.label}
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className={`p-3 border-t border-border ${isCollapsed ? "flex justify-center" : ""}`}>
                    <ThemeToggle />
                </div>
            </motion.aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border h-14 flex items-center px-4">
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="p-2 rounded-md hover:bg-muted"
                >
                    <PanelLeft className="w-5 h-5" />
                </button>
                <span className="ml-3 font-semibold">Documentation</span>
                <div className="ml-auto">
                    <ThemeToggle />
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="lg:hidden fixed top-0 left-0 z-50 h-full w-[300px] bg-card border-r border-border overflow-y-auto"
                        >
                            <div className="p-4 border-b border-border h-14 flex items-center justify-between">
                                <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Dashboard
                                </Link>
                                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-md hover:bg-muted">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="p-4">
                                {sidebarSections.map((section, sectionIdx) => (
                                    <div key={section.title} className={sectionIdx > 0 ? "mt-6" : ""}>
                                        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                            {section.title}
                                        </h2>
                                        <nav className="space-y-1">
                                            {section.items.map((item) => {
                                                const Icon = item.icon;
                                                const isActive = pathname === item.href;
                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setMobileOpen(false)}
                                                        prefetch={true}
                                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive
                                                            ? "bg-primary/10 text-primary font-medium"
                                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                            }`}
                                                    >
                                                        <Icon className="w-4 h-4" />
                                                        {item.label}
                                                    </Link>
                                                );
                                            })}
                                        </nav>
                                    </div>
                                ))}
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main content */}
            <motion.main
                animate={{
                    marginLeft: isCollapsed ? 64 : 280,
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex-1 pt-14 lg:pt-0 hidden lg:block"
            >
                <div className="max-w-3xl mx-auto px-8 py-12">
                    <div className="docs-content">
                        {children}
                    </div>
                </div>
            </motion.main>

            {/* Mobile main content */}
            <main className="flex-1 pt-14 lg:hidden">
                <div className="max-w-3xl mx-auto px-6 py-8">
                    <div className="docs-content">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
