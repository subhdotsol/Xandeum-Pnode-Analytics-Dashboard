"use client";

import { ExternalLink, Bell, BarChart3, Server, Zap, MessageCircle } from "lucide-react";

export default function TelegramDocsPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-[#0088cc]/10">
                        <svg className="w-6 h-6 text-[#0088cc]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold">Telegram Bot</h1>
                </div>
                <p className="text-muted-foreground">
                    Get real-time pNode network updates and analytics directly in Telegram.
                </p>
            </div>

            {/* CTA */}
            <a
                href="https://t.me/xandeum_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg bg-[#0088cc] text-white font-medium hover:bg-[#0077b5] transition-colors"
            >
                Open @xandeum_bot
                <ExternalLink className="w-4 h-4" />
            </a>

            {/* Features */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b border-border pb-2">Features</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="p-4 rounded-lg border border-border bg-card">
                        <div className="flex items-center gap-2 mb-2">
                            <Server className="w-5 h-5 text-green-500" />
                            <h3 className="font-medium">Network Status</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Check the current status of the pNode network including total nodes, health scores, and uptime.
                        </p>
                    </div>
                    <div className="p-4 rounded-lg border border-border bg-card">
                        <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="w-5 h-5 text-blue-500" />
                            <h3 className="font-medium">Version Analytics</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Get insights on version distribution across the network and see how many nodes are up to date.
                        </p>
                    </div>
                    <div className="p-4 rounded-lg border border-border bg-card">
                        <div className="flex items-center gap-2 mb-2">
                            <Bell className="w-5 h-5 text-yellow-500" />
                            <h3 className="font-medium">Alerts</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Receive notifications about important network events and status changes.
                        </p>
                    </div>
                    <div className="p-4 rounded-lg border border-border bg-card">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-5 h-5 text-violet-500" />
                            <h3 className="font-medium">Quick Commands</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Simple slash commands for instant access to network data anytime, anywhere.
                        </p>
                    </div>
                </div>
            </section>

            {/* Commands */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b border-border pb-2">Available Commands</h2>
                <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <code className="px-2 py-1 rounded bg-card border border-border text-sm font-mono">/start</code>
                        <span className="text-sm text-muted-foreground">Start the bot and see welcome message</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <code className="px-2 py-1 rounded bg-card border border-border text-sm font-mono">/status</code>
                        <span className="text-sm text-muted-foreground">Get current network status and health score</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <code className="px-2 py-1 rounded bg-card border border-border text-sm font-mono">/version</code>
                        <span className="text-sm text-muted-foreground">View version distribution across all nodes</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <code className="px-2 py-1 rounded bg-card border border-border text-sm font-mono">/help</code>
                        <span className="text-sm text-muted-foreground">Show all available commands</span>
                    </div>
                </div>
            </section>

            {/* Example Output */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b border-border pb-2">Example Response</h2>
                <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-sm">
                    <div className="text-green-400 mb-2">📊 Network Status</div>
                    <div className="text-zinc-300 space-y-1">
                        <p>Total Nodes: <span className="text-white">247</span></p>
                        <p>Healthy: <span className="text-green-400">231</span> (93.5%)</p>
                        <p>Degraded: <span className="text-yellow-400">12</span> (4.9%)</p>
                        <p>Offline: <span className="text-red-400">4</span> (1.6%)</p>
                        <p className="mt-2">Health Score: <span className="text-green-400">87/100</span></p>
                    </div>
                </div>
            </section>

            {/* Quick Access */}
            <section className="p-4 rounded-lg border border-[#0088cc]/30 bg-[#0088cc]/5">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#0088cc]" />
                    Quick Access
                </h3>
                <p className="text-sm text-muted-foreground">
                    Click the Telegram icon in the bottom-right corner of the dashboard to quickly access the bot.
                </p>
            </section>
        </div>
    );
}
