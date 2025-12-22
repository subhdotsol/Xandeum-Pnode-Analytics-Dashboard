"use client";

import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Database, Wifi, Clock, Shield, Terminal, HelpCircle } from "lucide-react";

const issues = [
    {
        category: "API & Data",
        color: "from-red-500 to-orange-500",
        items: [
            {
                title: "Dashboard shows 'Failed to load' error",
                solution: "Check if seed nodes are responding. The app tries 8 nodes with failover. Wait 30 seconds and refresh.",
                icon: XCircle,
            },
            {
                title: "Historical charts show 'No data available'",
                solution: "Snapshots are collected every 5 minutes. If just deployed, wait for GitHub Actions to run. Check Supabase credentials.",
                icon: Database,
            },
            {
                title: "Stale data / outdated node count",
                solution: "Redis cache has 60s TTL. Click refresh button or wait 60 seconds for fresh data.",
                icon: RefreshCw,
            },
        ]
    },
    {
        category: "Cron Job",
        color: "from-purple-500 to-pink-500",
        items: [
            {
                title: "Cron job returns 401 Unauthorized",
                solution: "CRON_SECRET in GitHub Actions must match Vercel environment variable exactly. No extra spaces or quotes.",
                icon: Shield,
            },
            {
                title: "Cron job times out (504 error)",
                solution: "Vercel Hobby plan has 10s timeout. Function should complete in ~8 seconds. Check if stats sampling is too aggressive.",
                icon: Clock,
            },
            {
                title: "Snapshots not being saved",
                solution: "Verify Supabase table 'historical_snapshots' exists. Check SUPABASE_URL and SUPABASE_KEY in Vercel.",
                icon: Database,
            },
        ]
    },
    {
        category: "Deployment",
        color: "from-blue-500 to-cyan-500",
        items: [
            {
                title: "Build fails on Vercel",
                solution: "Run 'pnpm build' locally first. Check for TypeScript errors. Ensure all env vars are set in Vercel.",
                icon: Terminal,
            },
            {
                title: "Map not showing nodes",
                solution: "Geo-location API (ip-api.com) requires HTTP on localhost but HTTPS in production. Check browser console for errors.",
                icon: Wifi,
            },
            {
                title: "Environment variables not loading",
                solution: "For client-side vars, prefix with NEXT_PUBLIC_. Redeploy after adding new env vars.",
                icon: AlertTriangle,
            },
        ]
    },
];

export default function TroubleshootingPage() {
    return (
        <article>
            <header className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-orange-500">
                        <HelpCircle className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Troubleshooting</h1>
                </div>
                <p className="text-lg text-muted-foreground">
                    Common issues and how to fix them quickly.
                </p>
            </header>

            {issues.map((category) => (
                <section key={category.category} className="mb-10">
                    <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2`}>
                        <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${category.color}`} />
                        {category.category}
                    </h2>
                    <div className="space-y-4">
                        {category.items.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <div key={idx} className="bg-card border border-border rounded-lg overflow-hidden">
                                    <div className={`h-1 bg-gradient-to-r ${category.color}`} />
                                    <div className="p-4">
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color} flex-shrink-0`}>
                                                <Icon className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium mb-1">{item.title}</h3>
                                                <p className="text-sm text-muted-foreground">{item.solution}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            ))}

            {/* Quick Checks */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Quick Health Checks
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
                        <h3 className="font-medium text-green-600 dark:text-green-400 mb-2">Test API Endpoints</h3>
                        <code className="text-xs bg-muted px-2 py-1 rounded">/api/pnodes</code>
                        <p className="text-sm text-muted-foreground mt-2">Should return list of 250+ nodes</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-4">
                        <h3 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Test Historical API</h3>
                        <code className="text-xs bg-muted px-2 py-1 rounded">/api/historical?range=1h</code>
                        <p className="text-sm text-muted-foreground mt-2">Should return snapshot array</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
                        <h3 className="font-medium text-purple-600 dark:text-purple-400 mb-2">Test Staking API</h3>
                        <code className="text-xs bg-muted px-2 py-1 rounded">/api/staking/pool-stats</code>
                        <p className="text-sm text-muted-foreground mt-2">Should return SOL/XAND prices</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-lg p-4">
                        <h3 className="font-medium text-orange-600 dark:text-orange-400 mb-2">Test Geo API</h3>
                        <code className="text-xs bg-muted px-2 py-1 rounded">/api/geo?ip=8.8.8.8</code>
                        <p className="text-sm text-muted-foreground mt-2">Should return location data</p>
                    </div>
                </div>
            </section>

            {/* Still stuck */}
            <section className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-2 text-violet-600 dark:text-violet-400">Still Stuck?</h2>
                <p className="text-muted-foreground mb-4">
                    Open an issue on GitHub with:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Browser console errors (if any)</li>
                    <li>Network tab screenshot</li>
                    <li>Vercel function logs</li>
                    <li>Steps to reproduce</li>
                </ul>
                <a
                    href="https://github.com/subhdotsol/Xandeum-Pnode-Analytics-Dashboard/issues/new"
                    target="_blank"
                    className="inline-block mt-4 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                    Open GitHub Issue →
                </a>
            </section>
        </article>
    );
}
