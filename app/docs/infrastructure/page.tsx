"use client";

import { Database, Zap, Clock, Server, GitBranch, BarChart3, Shield } from "lucide-react";

export default function InfrastructurePage() {
    return (
        <article>
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-3">Infrastructure</h1>
                <p className="text-lg text-muted-foreground">
                    How we handle caching, data storage, and automated analytics collection.
                </p>
            </header>

            {/* Overview */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Server className="w-5 h-5 text-primary" />
                    Architecture Overview
                </h2>
                <div className="bg-muted/30 rounded-lg p-6 font-mono text-sm leading-relaxed">
                    <pre>{`┌────────────────────────────────────────────────────────────────┐
│                    USER REQUEST                                │
└──────────────────────────┬─────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────────┐
│                  UPSTASH REDIS (Cache Layer)                   │
│   • pnodes:list → 60s TTL                                      │
│   • network:overview → 60s TTL                                 │
│   • pnodes:stats:{address} → 30s TTL                           │
├────────────────────────────────────────────────────────────────┤
│   Cache Hit? → Return instantly (~10ms)                        │
│   Cache Miss? → Fetch from pNode RPC → Cache → Return          │
└────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────────┐
│                  XANDEUM SEED NODES (JSON-RPC)                 │
│   8 seed nodes for redundancy                                  │
│   Methods: pnode_getList + pnode_getStats                      │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                  GITHUB ACTIONS (Every 5 min)                  │
└──────────────────────────┬─────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────────┐
│              /api/cron/collect-snapshot                        │
│   • Fetch all pNodes                                           │
│   • Calculate analytics                                        │
│   • Save snapshot to Supabase                                  │
│   • Clear Redis cache                                          │
└──────────────────────────┬─────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────────┐
│                  SUPABASE (PostgreSQL)                         │
│   historical_snapshots table                                   │
│   • timestamp, total_nodes, online_nodes                       │
│   • avg_cpu, avg_ram, total_storage                            │
│   • unique_countries, unique_versions                          │
└────────────────────────────────────────────────────────────────┘`}</pre>
                </div>
            </section>

            {/* Redis Caching */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Redis Caching (Upstash)
                </h2>
                <p className="text-muted-foreground mb-4">
                    We use Upstash Redis to cache API responses, making the dashboard feel instant after the first load.
                </p>
                <div className="space-y-4">
                    <div className="bg-card border border-border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Cache Keys & TTL</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <code className="text-primary">pnodes:list</code>
                                <span className="text-muted-foreground">60 seconds</span>
                            </div>
                            <div className="flex justify-between">
                                <code className="text-primary">network:overview</code>
                                <span className="text-muted-foreground">60 seconds</span>
                            </div>
                            <div className="flex justify-between">
                                <code className="text-primary">pnodes:stats:{'{address}'}</code>
                                <span className="text-muted-foreground">30 seconds</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Performance Improvement</h3>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold text-red-500">3-5s</p>
                                <p className="text-xs text-muted-foreground">Without Cache</p>
                            </div>
                            <div className="flex items-center justify-center">
                                <span className="text-muted-foreground">→</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-500">10ms</p>
                                <p className="text-xs text-muted-foreground">With Cache</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Historical Analytics */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Historical Analytics (Supabase)
                </h2>
                <p className="text-muted-foreground mb-4">
                    Network snapshots are collected every 5 minutes via GitHub Actions and stored in Supabase PostgreSQL.
                </p>
                <div className="bg-card border border-border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Snapshot Data</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span>Total Nodes</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span>Online Nodes</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span>Avg CPU Usage</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500" />
                            <span>Avg RAM Usage</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                            <span>Total Storage</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-500" />
                            <span>Unique Versions</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cron Job */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Automated Snapshots
                </h2>
                <p className="text-muted-foreground mb-4">
                    GitHub Actions runs every 5 minutes to collect and store network analytics.
                </p>
                <div className="space-y-4">
                    <div className="bg-card border border-border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Cron Schedule</h3>
                        <code className="text-sm text-primary">*/5 * * * *</code>
                        <span className="text-sm text-muted-foreground ml-2">— Every 5 minutes</span>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Collection Process</h3>
                        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                            <li>Fetch all pNodes from seed nodes (~5 seconds)</li>
                            <li>Sample 5 nodes for CPU/RAM stats (~10 seconds)</li>
                            <li>Calculate network analytics</li>
                            <li>Save snapshot to Supabase (~2 seconds)</li>
                            <li>Clear Redis cache</li>
                        </ol>
                        <p className="text-xs text-muted-foreground mt-2">Total execution time: ~20 seconds</p>
                    </div>
                </div>
            </section>

            {/* Security */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Security
                </h2>
                <div className="space-y-4">
                    <div className="bg-card border border-border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Cron Endpoint Protection</h3>
                        <p className="text-sm text-muted-foreground">
                            The <code>/api/cron/collect-snapshot</code> endpoint requires a <code>CRON_SECRET</code> header for authentication.
                        </p>
                        <div className="mt-2 bg-muted/50 p-3 rounded font-mono text-xs">
                            <span className="text-muted-foreground">Authorization:</span> Bearer YOUR_CRON_SECRET
                        </div>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Environment Variables</h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li><code>SUPABASE_URL</code> — Supabase project URL</li>
                            <li><code>SUPABASE_KEY</code> — Supabase service role key</li>
                            <li><code>UPSTASH_REDIS_REST_URL</code> — Redis URL</li>
                            <li><code>UPSTASH_REDIS_REST_TOKEN</code> — Redis auth token</li>
                            <li><code>CRON_SECRET</code> — Protects cron endpoint</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* GitHub Actions Setup */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-primary" />
                    GitHub Actions Setup
                </h2>
                <p className="text-muted-foreground mb-4">
                    To enable automated snapshot collection, add these secrets to your GitHub repository:
                </p>
                <div className="bg-card border border-border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Repository Secrets</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li><code>API_URL</code> — Your production URL (e.g., https://explorerxandeum.vercel.app)</li>
                        <li><code>CRON_SECRET</code> — Same as your Vercel environment variable</li>
                    </ul>
                </div>
            </section>

            {/* Data Retention */}
            <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    Data Retention
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card border border-border rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-primary">∞</p>
                        <p className="text-sm text-muted-foreground">Historical Snapshots</p>
                        <p className="text-xs text-muted-foreground mt-1">No auto-deletion</p>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-primary">288</p>
                        <p className="text-sm text-muted-foreground">Snapshots/Day</p>
                        <p className="text-xs text-muted-foreground mt-1">Every 5 minutes</p>
                    </div>
                </div>
            </section>
        </article>
    );
}
