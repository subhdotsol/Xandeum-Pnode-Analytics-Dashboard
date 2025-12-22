"use client";

import { motion } from "framer-motion";
import { CodeBlock } from "@/components/ui/code-block";

const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
};

const architectureDiagram = `User Request
     │
     ▼
┌─────────────────┐
│  Upstash Redis  │◄─── Cache Hit? Return in 10ms
│   (60s TTL)     │
└────────┬────────┘
         │ Cache Miss
         ▼
┌─────────────────┐
│ Xandeum pNodes  │◄─── 8 seed nodes (failover)
│   (JSON-RPC)    │
└─────────────────┘

GitHub Actions (every 5 min)
     │
     ▼
┌─────────────────┐
│  Supabase       │◄─── historical_snapshots table
│  (PostgreSQL)   │
└─────────────────┘`;

const cacheKeys = [
    { key: "pnodes:list", ttl: "60 seconds", color: "text-sky-400" },
    { key: "network:overview", ttl: "60 seconds", color: "text-violet-400" },
    { key: "pnodes:stats:*", ttl: "30 seconds", color: "text-emerald-400" },
];

const snapshotData = [
    { field: "total_nodes", color: "text-sky-400" },
    { field: "online_nodes", color: "text-violet-400" },
    { field: "avg_cpu", color: "text-emerald-400" },
    { field: "avg_ram", color: "text-amber-400" },
    { field: "total_storage", color: "text-rose-400" },
    { field: "unique_versions", color: "text-cyan-400" },
];

const cronSteps = [
    { step: "Fetch all pNodes from seed nodes", color: "text-sky-500" },
    { step: "Sample 5 nodes for CPU/RAM stats", color: "text-violet-500" },
    { step: "Save snapshot to Supabase", color: "text-emerald-500" },
    { step: "Clear Redis cache", color: "text-amber-500" },
];

const envVars = [
    { variable: "SUPABASE_URL", purpose: "Supabase project URL", color: "text-sky-400" },
    { variable: "SUPABASE_KEY", purpose: "Service role key", color: "text-violet-400" },
    { variable: "UPSTASH_REDIS_REST_URL", purpose: "Redis URL", color: "text-emerald-400" },
    { variable: "CRON_SECRET", purpose: "Protects cron endpoint", color: "text-amber-400" },
];

export default function InfrastructurePage() {
    return (
        <motion.article {...fadeIn}>
            <header className="mb-8 border-b border-border pb-4">
                <h1 className="text-2xl font-bold tracking-tight mb-2">Infrastructure</h1>
                <p className="text-muted-foreground">
                    Caching, storage, and automated data collection.
                </p>
            </header>

            {/* Architecture Diagram */}
            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4 text-sky-500">Architecture</h2>
                <CodeBlock code={architectureDiagram} language="plain" filename="System Architecture" />
            </motion.section>

            {/* Redis Caching */}
            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4 text-violet-500">Redis Caching</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    <span className="text-violet-400 font-medium">Upstash Redis</span> provides instant API responses after the first request.
                </p>
                <div className="rounded-lg border border-border overflow-hidden mb-4">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left p-3 font-medium">Cache Key</th>
                                <th className="text-left p-3 font-medium">TTL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cacheKeys.map((cache) => (
                                <tr key={cache.key} className="border-t border-border hover:bg-muted/30 transition-colors">
                                    <td className="p-3">
                                        <code className={`text-xs ${cache.color} bg-muted px-1.5 py-0.5 rounded`}>{cache.key}</code>
                                    </td>
                                    <td className="p-3 text-muted-foreground">{cache.ttl}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-border p-3 text-center">
                        <p className="text-2xl font-bold text-rose-400">3-5s</p>
                        <p className="text-xs text-muted-foreground">Without cache</p>
                    </div>
                    <div className="rounded-lg border border-border p-3 text-center">
                        <p className="text-2xl font-bold text-emerald-400">10ms</p>
                        <p className="text-xs text-muted-foreground">With cache</p>
                    </div>
                </div>
            </motion.section>

            {/* Supabase */}
            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4 text-emerald-500">Historical Storage</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    <span className="text-emerald-400 font-medium">Supabase PostgreSQL</span> stores network snapshots every 5 minutes.
                </p>
                <div className="rounded-lg border border-border p-4">
                    <h3 className="text-sm font-medium mb-3">Snapshot Data</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {snapshotData.map((data) => (
                            <div key={data.field} className="flex items-center gap-2 text-sm">
                                <span className={`w-1.5 h-1.5 rounded-full ${data.color.replace('text-', 'bg-')}`} />
                                <span className={data.color}>{data.field}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Cron Job */}
            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4 text-amber-500">Automated Collection</h2>
                <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center gap-4 mb-4">
                        <code className="text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded">*/5 * * * *</code>
                        <span className="text-sm text-muted-foreground">Every 5 minutes via GitHub Actions</span>
                    </div>
                    <ol className="space-y-2">
                        {cronSteps.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                                <span className={`w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs flex-shrink-0 ${item.color}`}>{idx + 1}</span>
                                <span className={`text-sm ${item.color}`}>{item.step}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </motion.section>

            {/* Environment Variables */}
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4 text-rose-500">Environment Variables</h2>
                <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left p-3 font-medium">Variable</th>
                                <th className="text-left p-3 font-medium">Purpose</th>
                            </tr>
                        </thead>
                        <tbody>
                            {envVars.map((env) => (
                                <tr key={env.variable} className="border-t border-border hover:bg-muted/30 transition-colors">
                                    <td className="p-3">
                                        <code className={`text-xs ${env.color}`}>{env.variable}</code>
                                    </td>
                                    <td className="p-3 text-muted-foreground">{env.purpose}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.section>
        </motion.article>
    );
}
