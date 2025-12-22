"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Server, Layers, Keyboard, BarChart3, Trophy, Map as MapIcon, Database, Bot, ArrowLeftRight, Coins } from "lucide-react";

const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
};

const shortcuts = [
    { label: "Toggle Sidebar", key: "⌘K", color: "text-sky-400" },
    { label: "Spotlight Search", key: "⌘J", color: "text-violet-400" },
    { label: "Open AI Assistant", key: "⌘I", color: "text-emerald-400" },
    { label: "Toggle Dark Mode", key: "⌘D", color: "text-amber-400" },
];

const features = [
    { icon: Server, title: "pNodes", description: "Learn about persistent nodes", href: "/docs/pnodes", color: "text-sky-500", bgColor: "bg-sky-500/10" },
    { icon: Layers, title: "Architecture", description: "How Xandeum is built", href: "/docs/architecture", color: "text-violet-500", bgColor: "bg-violet-500/10" },
    { icon: BarChart3, title: "Analytics", description: "Real-time network metrics", href: "/docs/analytics", color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
    { icon: Trophy, title: "Leaderboard", description: "Pod credits scoring", href: "/docs/leaderboard", color: "text-amber-500", bgColor: "bg-amber-500/10" },
    { icon: MapIcon, title: "Global Map", description: "Geographic distribution", href: "/docs/map", color: "text-rose-500", bgColor: "bg-rose-500/10" },
    { icon: Database, title: "API Reference", description: "REST API endpoints", href: "/docs/api", color: "text-cyan-500", bgColor: "bg-cyan-500/10" },
];

const concepts = [
    { title: "pNodes (Persistent Nodes)", description: "Individual nodes storing and serving data chunks", color: "text-sky-400" },
    { title: "Decentralized Discovery", description: "P2P discovery where each pNode maintains knowledge of others", color: "text-violet-400" },
    { title: "Health Monitoring", description: "Status reporting through timestamps and availability metrics", color: "text-emerald-400" },
    { title: "No Central Authority", description: "Nodes discover each other through seed nodes", color: "text-amber-400" },
    { title: "AI-Powered Insights", description: "Natural language queries with XandAI assistant", color: "text-rose-400" },
];

const dashboardFeatures = [
    { title: "Real-Time Analytics", description: "Monitor network health, node versions, and performance metrics", color: "text-sky-400" },
    { title: "Geographic Visualization", description: "Interactive map showing global node distribution", color: "text-violet-400" },
    { title: "Pod Credits Leaderboard", description: "Track top-performing nodes based on scoring criteria", color: "text-emerald-400" },
    { title: "Historical Charts", description: "View trends over 1H, 4H, 7D, 30D, and 90D time ranges", color: "text-amber-400" },
    { title: "Smart Sidebar Navigation", description: "Quick access with keyboard shortcuts", color: "text-rose-400" },
];

export default function DocsPage() {
    return (
        <motion.article {...fadeIn}>
            <header className="mb-8 border-b border-border pb-4">
                <h1 className="text-2xl font-bold tracking-tight mb-2">Xandeum pNode Analytics</h1>
                <p className="text-muted-foreground">
                    Real-time monitoring and analytics for the <span className="text-sky-400 font-medium">Xandeum</span> distributed storage network.
                </p>
            </header>

            {/* Keyboard Shortcuts */}
            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                <div className="flex items-center gap-2 mb-4">
                    <Keyboard className="w-4 h-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-muted-foreground">Keyboard Shortcuts</h2>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {shortcuts.map((shortcut) => (
                        <div key={shortcut.key} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                            <span className="text-sm text-muted-foreground">{shortcut.label}</span>
                            <kbd className={`px-2 py-1 bg-zinc-900 rounded border border-zinc-700 font-mono text-xs ${shortcut.color}`}>{shortcut.key}</kbd>
                        </div>
                    ))}
                </div>
            </motion.section>

            {/* Feature Cards */}
            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
            >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <Link
                                key={feature.href}
                                href={feature.href}
                                prefetch={true}
                                className="block p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors group"
                            >
                                <div className={`w-8 h-8 rounded-lg ${feature.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                    <Icon className={`w-4 h-4 ${feature.color}`} />
                                </div>
                                <h3 className={`font-medium text-sm mb-1 ${feature.color}`}>{feature.title}</h3>
                                <p className="text-xs text-muted-foreground">{feature.description}</p>
                            </Link>
                        );
                    })}
                </div>
            </motion.section>

            {/* What is Xandeum */}
            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4 text-sky-500">What is Xandeum?</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    <span className="text-sky-400 font-medium">Xandeum</span> is a decentralized distributed storage layer built on <span className="text-violet-400 font-medium">Solana</span> that enables efficient data storage and retrieval across a network of participating nodes called <span className="text-emerald-400 font-medium">pNodes</span> (persistent nodes).
                </p>
            </motion.section>

            {/* Key Concepts */}
            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4 text-violet-500">Key Concepts</h2>
                <div className="rounded-lg border border-border p-4">
                    <ul className="space-y-3">
                        {concepts.map((concept, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                                <span className={`w-1.5 h-1.5 mt-1.5 rounded-full ${concept.color.replace('text-', 'bg-')} flex-shrink-0`} />
                                <div>
                                    <span className={concept.color}>{concept.title}</span>
                                    <span className="text-muted-foreground"> — {concept.description}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </motion.section>

            {/* Dashboard Features */}
            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4 text-emerald-500">Dashboard Features</h2>
                <div className="rounded-lg border border-border p-4">
                    <ul className="space-y-3">
                        {dashboardFeatures.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                                <span className={`w-1.5 h-1.5 mt-1.5 rounded-full ${feature.color.replace('text-', 'bg-')} flex-shrink-0`} />
                                <div>
                                    <span className={feature.color}>{feature.title}</span>
                                    <span className="text-muted-foreground"> — {feature.description}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </motion.section>

            {/* XAND Token */}
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4 text-amber-500">The XAND Token</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    <span className="text-amber-400 font-medium">XAND</span> is the governance token for the Xandeum network. Token holders participate in the project's DAO, influencing treasury decisions and storage layer development.
                </p>
                <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm">
                        <tbody>
                            <tr className="border-b border-border">
                                <td className="p-3 font-medium">Token Address</td>
                                <td className="p-3">
                                    <code className="text-xs text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded">XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx</code>
                                </td>
                            </tr>
                            <tr className="border-b border-border">
                                <td className="p-3 font-medium">Network</td>
                                <td className="p-3 text-violet-400">Solana Mainnet</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-medium">Launch Date</td>
                                <td className="p-3 text-emerald-400">October 29, 2024</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </motion.section>
        </motion.article>
    );
}
