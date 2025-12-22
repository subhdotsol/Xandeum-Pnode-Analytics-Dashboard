"use client";

import { motion } from "framer-motion";

const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
};

const releases = [
    {
        version: "1.3.0",
        date: "December 2024",
        title: "Historical Analytics & Infrastructure",
        changes: [
            { type: "new", text: "Supabase integration for historical snapshots" },
            { type: "new", text: "Redis (Upstash) caching for 10ms API responses" },
            { type: "new", text: "GitHub Actions cron for automated data collection" },
            { type: "new", text: "Infrastructure documentation page" },
            { type: "improved", text: "Optimized cron job to complete in ~8 seconds" },
        ],
    },
    {
        version: "1.2.0",
        date: "December 2024",
        title: "AI Assistant & DeFi Integration",
        changes: [
            { type: "new", text: "XandAI assistant powered by Google Gemini 2.5 Flash" },
            { type: "new", text: "Liquid staking with real-time SOL/XAND prices" },
            { type: "new", text: "Jupiter DEX swap integration" },
            { type: "new", text: "Animated liquid morphing button" },
            { type: "improved", text: "AI assistant now has live pNode data access" },
        ],
    },
    {
        version: "1.1.0",
        date: "December 2024",
        title: "Enhanced UX & Navigation",
        changes: [
            { type: "new", text: "Spotlight Search (Cmd+J)" },
            { type: "new", text: "Collapsible sidebar with persistence" },
            { type: "new", text: "Keyboard shortcuts (Cmd+K, Cmd+I, Cmd+D)" },
            { type: "new", text: "Watchlist and Compare features" },
            { type: "improved", text: "Smooth tab animations with cursor following" },
            { type: "fixed", text: "Theme toggle animation" },
        ],
    },
    {
        version: "1.0.0",
        date: "December 2024",
        title: "Initial Release",
        changes: [
            { type: "new", text: "Real-time monitoring of 250+ pNodes" },
            { type: "new", text: "Pod Credits leaderboard with scoring system" },
            { type: "new", text: "Interactive world map with node locations" },
            { type: "new", text: "Version distribution charts" },
            { type: "new", text: "Network health dashboard" },
        ],
    },
];

const typeLabels: Record<string, string> = {
    new: "New",
    improved: "Improved",
    fixed: "Fixed",
};

export default function ChangelogPage() {
    return (
        <motion.article {...fadeIn}>
            <header className="mb-8 border-b border-border pb-4">
                <h1 className="text-2xl font-bold tracking-tight mb-2">Changelog</h1>
                <p className="text-muted-foreground">
                    What's new in each release.
                </p>
            </header>

            <div className="space-y-8">
                {releases.map((release, idx) => (
                    <motion.section
                        key={release.version}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.3 }}
                        className="relative pl-6 border-l-2 border-border"
                    >
                        {/* Timeline dot */}
                        <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary" />

                        <div className="mb-2">
                            <span className="text-xs font-medium bg-muted px-2 py-0.5 rounded">
                                v{release.version}
                            </span>
                            <span className="text-xs text-muted-foreground ml-2">{release.date}</span>
                        </div>

                        <h3 className="font-semibold mb-3">{release.title}</h3>

                        <ul className="space-y-2">
                            {release.changes.map((change, cIdx) => (
                                <li key={cIdx} className="flex items-start gap-2 text-sm">
                                    <span className="text-xs font-medium text-muted-foreground w-16 flex-shrink-0">
                                        {typeLabels[change.type]}
                                    </span>
                                    <span className="text-muted-foreground">{change.text}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.section>
                ))}
            </div>

            <motion.section
                className="mt-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
            >
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <h3 className="font-medium mb-2">Coming Soon</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Version Intelligence with upgrade recommendations</li>
                        <li>• Email/Discord alerts for node status changes</li>
                        <li>• Multi-language support</li>
                    </ul>
                </div>
            </motion.section>
        </motion.article>
    );
}
