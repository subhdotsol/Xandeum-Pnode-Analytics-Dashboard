"use client";

import { motion } from "framer-motion";

const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
};

const scoringCriteria = [
    {
        name: "Uptime Score",
        max: 40,
        description: "Measures how recently the node was online",
        breakdown: [
            { condition: "Last seen within 5 min", points: 40 },
            { condition: "Last seen within 15 min", points: 30 },
            { condition: "Last seen within 1 hour", points: 20 },
            { condition: "Last seen within 6 hours", points: 10 },
            { condition: "Last seen 6+ hours ago", points: 0 },
        ]
    },
    {
        name: "RPC Availability",
        max: 30,
        description: "Awards points for public RPC endpoints",
        breakdown: [
            { condition: "Has public RPC endpoint", points: 30 },
            { condition: "No public RPC", points: 0 },
        ]
    },
    {
        name: "Version Compliance",
        max: 30,
        description: "Rewards nodes on latest version",
        breakdown: [
            { condition: "Running latest version", points: 30 },
            { condition: "Running outdated version", points: 0 },
        ]
    },
];

const features = [
    "Real-time rankings with automatic updates",
    "Search and filter by identity or criteria",
    "Sortable columns for all metrics",
    "Visual badges for status indicators",
];

export default function LeaderboardDocsPage() {
    return (
        <motion.article {...fadeIn}>
            <header className="mb-8 border-b border-border pb-4">
                <h1 className="text-2xl font-bold tracking-tight mb-2">Pod Credits & Leaderboard</h1>
                <p className="text-muted-foreground">
                    Scoring system that evaluates pNodes based on performance criteria.
                </p>
            </header>

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4">Scoring Criteria</h2>
                <div className="space-y-4">
                    {scoringCriteria.map((criteria, idx) => (
                        <motion.div
                            key={criteria.name}
                            className="rounded-lg border border-border overflow-hidden"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + idx * 0.1 }}
                        >
                            <div className="p-4 bg-muted/30 flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-sm">{criteria.name}</h3>
                                    <p className="text-xs text-muted-foreground">{criteria.description}</p>
                                </div>
                                <span className="text-sm font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
                                    max {criteria.max}
                                </span>
                            </div>
                            <div className="p-4">
                                <ul className="space-y-2">
                                    {criteria.breakdown.map((item, bIdx) => (
                                        <li key={bIdx} className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">{item.condition}</span>
                                            <span className="font-mono">{item.points} pts</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4">Total Score</h2>
                <div className="rounded-lg border border-border p-4 bg-muted/30">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium">Maximum Score</span>
                        <span className="text-2xl font-bold">100</span>
                    </div>
                    <div className="text-sm font-mono text-muted-foreground">
                        Total = Uptime (40) + RPC (30) + Version (30)
                    </div>
                </div>
            </motion.section>

            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4">Leaderboard Features</h2>
                <div className="rounded-lg border border-border p-4">
                    <ul className="space-y-2">
                        {features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>
            </motion.section>
        </motion.article>
    );
}
