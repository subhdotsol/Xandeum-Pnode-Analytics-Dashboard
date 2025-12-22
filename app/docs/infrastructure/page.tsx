"use client";

import { motion } from "framer-motion";
import { CodeBlock } from "@/components/ui/code-block";

const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
};

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
                <h2 className="text-lg font-semibold mb-4">Architecture</h2>
                <div className="rounded-lg border border-border bg-muted/30 p-4 overflow-x-auto">
                    <pre className="text-xs font-mono text-muted-foreground whitespace-pre">{`
User Request
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
└─────────────────┘`}</pre>
                </div>
            </motion.section>

            {/* Redis Caching */}
            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4">Redis Caching</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Upstash Redis provides instant API responses after the first request.
                </p>
                <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left p-3 font-medium">Cache Key</th>
                                <th className="text-left p-3 font-medium">TTL</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-border">
                                <td className="p-3"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">pnodes:list</code></td>
                                <td className="p-3 text-muted-foreground">60 seconds</td>
                            </tr>
                            <tr className="border-t border-border">
                                <td className="p-3"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">network:overview</code></td>
                                <td className="p-3 text-muted-foreground">60 seconds</td>
                            </tr>
                            <tr className="border-t border-border">
                                <td className="p-3"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">pnodes:stats:*</code></td>
                                <td className="p-3 text-muted-foreground">30 seconds</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-border p-3 text-center">
                        <p className="text-2xl font-bold">3-5s</p>
                        <p className="text-xs text-muted-foreground">Without cache</p>
                    </div>
                    <div className="rounded-lg border border-border p-3 text-center">
                        <p className="text-2xl font-bold text-primary">10ms</p>
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
                <h2 className="text-lg font-semibold mb-4">Historical Storage</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Supabase PostgreSQL stores network snapshots every 5 minutes.
                </p>
                <div className="rounded-lg border border-border p-4">
                    <h3 className="text-sm font-medium mb-3">Snapshot Data</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            total_nodes
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            online_nodes
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            avg_cpu
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            avg_ram
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            total_storage
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            unique_versions
                        </div>
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
                <h2 className="text-lg font-semibold mb-4">Automated Collection</h2>
                <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center gap-4 mb-4">
                        <code className="text-xs bg-muted px-2 py-1 rounded">*/5 * * * *</code>
                        <span className="text-sm text-muted-foreground">Every 5 minutes</span>
                    </div>
                    <ol className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs flex-shrink-0">1</span>
                            Fetch all pNodes from seed nodes
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs flex-shrink-0">2</span>
                            Sample 5 nodes for CPU/RAM stats
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs flex-shrink-0">3</span>
                            Save snapshot to Supabase
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs flex-shrink-0">4</span>
                            Clear Redis cache
                        </li>
                    </ol>
                </div>
            </motion.section>

            {/* Environment Variables */}
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4">Environment Variables</h2>
                <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left p-3 font-medium">Variable</th>
                                <th className="text-left p-3 font-medium">Purpose</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-border">
                                <td className="p-3"><code className="text-xs">SUPABASE_URL</code></td>
                                <td className="p-3 text-muted-foreground">Supabase project URL</td>
                            </tr>
                            <tr className="border-t border-border">
                                <td className="p-3"><code className="text-xs">SUPABASE_KEY</code></td>
                                <td className="p-3 text-muted-foreground">Service role key</td>
                            </tr>
                            <tr className="border-t border-border">
                                <td className="p-3"><code className="text-xs">UPSTASH_REDIS_REST_URL</code></td>
                                <td className="p-3 text-muted-foreground">Redis URL</td>
                            </tr>
                            <tr className="border-t border-border">
                                <td className="p-3"><code className="text-xs">CRON_SECRET</code></td>
                                <td className="p-3 text-muted-foreground">Protects cron endpoint</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </motion.section>
        </motion.article>
    );
}
