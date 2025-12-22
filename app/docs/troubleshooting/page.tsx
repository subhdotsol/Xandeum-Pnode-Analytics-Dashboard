"use client";

import { motion } from "framer-motion";

const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
};

const issues = [
    {
        category: "API & Data",
        items: [
            {
                title: "Dashboard shows 'Failed to load' error",
                solution: "Check if seed nodes are responding. The app tries 8 nodes with failover. Wait 30 seconds and refresh.",
            },
            {
                title: "Historical charts show 'No data available'",
                solution: "Snapshots are collected every 5 minutes. If just deployed, wait for GitHub Actions to run. Check Supabase credentials.",
            },
            {
                title: "Stale data / outdated node count",
                solution: "Redis cache has 60s TTL. Click refresh button or wait 60 seconds for fresh data.",
            },
        ]
    },
    {
        category: "Cron Job",
        items: [
            {
                title: "Cron job returns 401 Unauthorized",
                solution: "CRON_SECRET in GitHub Actions must match Vercel environment variable exactly. No extra spaces or quotes.",
            },
            {
                title: "Cron job times out (504 error)",
                solution: "Vercel Hobby plan has 10s timeout. Function should complete in ~8 seconds. Check if stats sampling is too aggressive.",
            },
            {
                title: "Snapshots not being saved",
                solution: "Verify Supabase table 'historical_snapshots' exists. Check SUPABASE_URL and SUPABASE_KEY in Vercel.",
            },
        ]
    },
    {
        category: "Deployment",
        items: [
            {
                title: "Build fails on Vercel",
                solution: "Run 'pnpm build' locally first. Check for TypeScript errors. Ensure all env vars are set in Vercel.",
            },
            {
                title: "Map not showing nodes",
                solution: "Geo-location API (ip-api.com) requires HTTP on localhost but HTTPS in production. Check browser console for errors.",
            },
            {
                title: "Environment variables not loading",
                solution: "For client-side vars, prefix with NEXT_PUBLIC_. Redeploy after adding new env vars.",
            },
        ]
    },
];

const healthChecks = [
    { endpoint: "/api/pnodes", description: "Should return list of 250+ nodes" },
    { endpoint: "/api/historical?range=1h", description: "Should return snapshot array" },
    { endpoint: "/api/staking/pool-stats", description: "Should return SOL/XAND prices" },
    { endpoint: "/api/geo?ip=8.8.8.8", description: "Should return location data" },
];

export default function TroubleshootingPage() {
    return (
        <motion.article {...fadeIn}>
            <header className="mb-8 border-b border-border pb-4">
                <h1 className="text-2xl font-bold tracking-tight mb-2">Troubleshooting</h1>
                <p className="text-muted-foreground">
                    Common issues and how to fix them.
                </p>
            </header>

            {issues.map((category, catIdx) => (
                <motion.section
                    key={category.category}
                    className="mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: catIdx * 0.1, duration: 0.3 }}
                >
                    <h2 className="text-lg font-semibold mb-4">{category.category}</h2>
                    <div className="space-y-4">
                        {category.items.map((item, idx) => (
                            <div key={idx} className="rounded-lg border border-border bg-card p-4">
                                <h3 className="font-medium text-sm mb-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.solution}</p>
                            </div>
                        ))}
                    </div>
                </motion.section>
            ))}

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4">Quick Health Checks</h2>
                <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left p-3 font-medium">Endpoint</th>
                                <th className="text-left p-3 font-medium">Expected</th>
                            </tr>
                        </thead>
                        <tbody>
                            {healthChecks.map((check, idx) => (
                                <tr key={idx} className="border-t border-border">
                                    <td className="p-3">
                                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{check.endpoint}</code>
                                    </td>
                                    <td className="p-3 text-muted-foreground">{check.description}</td>
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
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <h3 className="font-medium mb-2">Still stuck?</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                        Open an issue on GitHub with browser console errors and steps to reproduce.
                    </p>
                    <a
                        href="https://github.com/subhdotsol/Xandeum-Pnode-Analytics-Dashboard/issues/new"
                        target="_blank"
                        className="text-sm font-medium text-primary hover:underline"
                    >
                        Open GitHub Issue →
                    </a>
                </div>
            </motion.section>
        </motion.article>
    );
}
