"use client";

import { History, Sparkles, Bug, Zap, Database, Bot, Globe, BarChart3, Star, ArrowRight } from "lucide-react";

const releases = [
    {
        version: "1.3.0",
        date: "December 2024",
        title: "Historical Analytics & Infrastructure",
        color: "from-violet-500 to-purple-500",
        icon: Database,
        changes: [
            { type: "feature", text: "Added Supabase integration for historical snapshots" },
            { type: "feature", text: "Added Redis (Upstash) caching for 10ms API responses" },
            { type: "feature", text: "Added Infrastructure documentation page" },
            { type: "feature", text: "Added GitHub Actions cron for automated data collection" },
            { type: "improvement", text: "Optimized cron job to complete in ~8 seconds" },
            { type: "improvement", text: "Added batch processing for database operations" },
        ],
    },
    {
        version: "1.2.0",
        date: "December 2024",
        title: "AI Assistant & DeFi Integration",
        color: "from-pink-500 to-rose-500",
        icon: Bot,
        changes: [
            { type: "feature", text: "Added XandAI assistant powered by Google Gemini 2.5 Flash" },
            { type: "feature", text: "Added liquid staking with real-time SOL/XAND prices" },
            { type: "feature", text: "Added Jupiter DEX swap integration" },
            { type: "feature", text: "Added animated liquid morphing button" },
            { type: "improvement", text: "AI assistant now has live pNode data access" },
        ],
    },
    {
        version: "1.1.0",
        date: "December 2024",
        title: "Enhanced UX & Navigation",
        color: "from-blue-500 to-cyan-500",
        icon: Sparkles,
        changes: [
            { type: "feature", text: "Added Spotlight Search (Cmd+J)" },
            { type: "feature", text: "Added collapsible sidebar with persistence" },
            { type: "feature", text: "Added keyboard shortcuts (Cmd+K, Cmd+I, Cmd+D)" },
            { type: "feature", text: "Added Watchlist and Compare features" },
            { type: "improvement", text: "Added smooth tab animations with cursor following" },
            { type: "fix", text: "Fixed theme toggle animation" },
        ],
    },
    {
        version: "1.0.0",
        date: "December 2024",
        title: "Initial Release",
        color: "from-green-500 to-emerald-500",
        icon: Zap,
        changes: [
            { type: "feature", text: "Real-time monitoring of 250+ pNodes" },
            { type: "feature", text: "Pod Credits leaderboard with scoring system" },
            { type: "feature", text: "Interactive world map with node locations" },
            { type: "feature", text: "Version distribution charts" },
            { type: "feature", text: "Network health dashboard" },
            { type: "feature", text: "Comprehensive documentation" },
        ],
    },
];

const typeColors: Record<string, { bg: string; text: string; label: string }> = {
    feature: { bg: "bg-green-500/10", text: "text-green-600 dark:text-green-400", label: "New" },
    improvement: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", label: "Improved" },
    fix: { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", label: "Fixed" },
};

export default function ChangelogPage() {
    return (
        <article>
            <header className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500">
                        <History className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Changelog</h1>
                </div>
                <p className="text-lg text-muted-foreground">
                    What's new in each release of the Xandeum pNode Analytics Dashboard.
                </p>
            </header>

            {/* Timeline */}
            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border" />

                <div className="space-y-8">
                    {releases.map((release, idx) => {
                        const Icon = release.icon;
                        return (
                            <div key={release.version} className="relative pl-12">
                                {/* Timeline dot */}
                                <div className={`absolute left-0 w-10 h-10 rounded-full bg-gradient-to-br ${release.color} flex items-center justify-center shadow-lg`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>

                                {/* Card */}
                                <div className="bg-card border border-border rounded-lg overflow-hidden">
                                    <div className={`h-1 bg-gradient-to-r ${release.color}`} />
                                    <div className="p-5">
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r ${release.color} text-white`}>
                                                    v{release.version}
                                                </span>
                                                <span className="text-xs text-muted-foreground ml-2">{release.date}</span>
                                            </div>
                                            {idx === 0 && (
                                                <span className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                                                    <Star className="w-3 h-3 fill-current" /> Latest
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-semibold mb-4">{release.title}</h3>

                                        {/* Changes */}
                                        <div className="space-y-2">
                                            {release.changes.map((change, cIdx) => {
                                                const { bg, text, label } = typeColors[change.type];
                                                return (
                                                    <div key={cIdx} className="flex items-start gap-2">
                                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${bg} ${text}`}>
                                                            {label}
                                                        </span>
                                                        <span className="text-sm text-muted-foreground">{change.text}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Coming Soon */}
            <section className="mt-10 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                    <Sparkles className="w-5 h-5" />
                    Coming Soon
                </h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-yellow-500" />
                        Version Intelligence page with upgrade recommendations
                    </li>
                    <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-yellow-500" />
                        Email/Discord alerts for node status changes
                    </li>
                    <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-yellow-500" />
                        Multi-language support
                    </li>
                    <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-yellow-500" />
                        Mobile app (React Native)
                    </li>
                </ul>
            </section>
        </article>
    );
}
