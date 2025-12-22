"use client";

import { motion } from "framer-motion";
import { CodeBlock } from "@/components/ui/code-block";

const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
};

const architectureDiagram = `┌─────────────────────────────────────────────────────────────┐
│                    XANDEUM NETWORK                          │
│              pNodes emit heartbeats via gossip              │
└──────────────────────────┬──────────────────────────────────┘
                           │
              ┌────────────▼────────────┐
              │     SEED NODES (9)      │
              │                         │
              │  • 173.212.203.145      │
              │  • 173.212.220.65       │
              │  • 161.97.97.41         │
              │  • ... and more         │
              └────────────┬────────────┘
                           │
              ┌────────────▼────────────┐
              │   ANALYTICS DASHBOARD   │
              │      (Next.js 15)       │
              │                         │
              │  • Real-time charts     │
              │  • Interactive map      │
              │  • Node leaderboard     │
              │  • Historical data      │
              └─────────────────────────┘`;

const dataFlow = [
    { step: "Node Discovery", description: "Query 9 seed pNodes via JSON-RPC (get-pods)", color: "text-sky-500" },
    { step: "Deduplication", description: "Merge results, keeping latest timestamps", color: "text-violet-500" },
    { step: "Stats Aggregation", description: "Parallel fetch from reliable seed nodes", color: "text-emerald-500" },
    { step: "Geo-location", description: "Batch lookup via ip-api.com with caching", color: "text-amber-500" },
    { step: "Historical", description: "Cron job saves snapshots every 5 minutes to Supabase", color: "text-rose-500" },
];

const techStack = [
    { component: "Framework", tech: "Next.js 15 (App Router)", color: "text-sky-400" },
    { component: "Language", tech: "TypeScript 5.0", color: "text-violet-400" },
    { component: "Styling", tech: "TailwindCSS 4.0", color: "text-emerald-400" },
    { component: "Database", tech: "Supabase (PostgreSQL)", color: "text-amber-400" },
    { component: "Caching", tech: "Upstash Redis", color: "text-rose-400" },
    { component: "Charts", tech: "Recharts", color: "text-cyan-400" },
    { component: "Maps", tech: "Leaflet + react-leaflet", color: "text-emerald-400" },
    { component: "AI", tech: "Google Gemini 2.5 Flash", color: "text-sky-400" },
];

const topology = [
    { feature: "No Single Point of Failure", description: "Data is replicated across multiple nodes", color: "text-sky-500" },
    { feature: "Gossip Protocol", description: "Nodes share information about peers", color: "text-violet-500" },
    { feature: "Seed Nodes", description: "Bootstrap nodes help new peers discover the network", color: "text-emerald-500" },
    { feature: "Dynamic Scaling", description: "Network grows as new pNodes join", color: "text-amber-500" },
];

export default function ArchitecturePage() {
    return (
        <motion.article {...fadeIn}>
            <header className="mb-8 border-b border-border pb-4">
                <h1 className="text-2xl font-bold tracking-tight mb-2">Architecture</h1>
                <p className="text-muted-foreground">
                    How Xandeum's distributed storage layer is built.
                </p>
            </header>

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4 text-sky-500">System Overview</h2>
                <CodeBlock code={architectureDiagram} language="plain" filename="Architecture Diagram" />
            </motion.section>

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4 text-violet-500">Data Flow</h2>
                <div className="space-y-2">
                    {dataFlow.map((item, idx) => (
                        <motion.div
                            key={idx}
                            className="flex items-start gap-3"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + idx * 0.05 }}
                        >
                            <span className={`w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium flex-shrink-0 ${item.color}`}>
                                {idx + 1}
                            </span>
                            <div>
                                <span className={`text-sm font-medium ${item.color}`}>{item.step}</span>
                                <span className="text-sm text-muted-foreground ml-2">— {item.description}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4 text-emerald-500">Performance Scoring</h2>
                <div className="rounded-lg border border-border p-4 bg-muted/30">
                    <p className="text-sm font-mono text-muted-foreground">
                        score = (<span className="text-emerald-400">healthy_nodes%</span> × <span className="text-amber-400">60</span>) + (<span className="text-sky-400">up_to_date_versions%</span> × <span className="text-amber-400">30</span>) + (<span className="text-violet-400">degraded_nodes%</span> × <span className="text-amber-400">10</span>)
                    </p>
                </div>
            </motion.section>

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4 text-amber-500">Technology Stack</h2>
                <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left p-3 font-medium">Component</th>
                                <th className="text-left p-3 font-medium">Technology</th>
                            </tr>
                        </thead>
                        <tbody>
                            {techStack.map((item) => (
                                <tr key={item.component} className="border-t border-border hover:bg-muted/30 transition-colors">
                                    <td className="p-3">{item.component}</td>
                                    <td className={`p-3 ${item.color}`}>{item.tech}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.section>

            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4 text-rose-500">Network Topology</h2>
                <div className="space-y-2">
                    {topology.map((item, idx) => (
                        <div key={idx} className="rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors">
                            <span className={`text-sm font-medium ${item.color}`}>{item.feature}</span>
                            <span className="text-sm text-muted-foreground ml-2">— {item.description}</span>
                        </div>
                    ))}
                </div>
            </motion.section>
        </motion.article>
    );
}
