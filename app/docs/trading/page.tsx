"use client";

import { BarChart3, ExternalLink, RefreshCw, DollarSign, TrendingUp, Wallet } from "lucide-react";

export default function TradingDocsPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-violet-500/10">
                        <TrendingUp className="w-6 h-6 text-violet-500" />
                    </div>
                    <h1 className="text-3xl font-bold">Trading Terminal</h1>
                </div>
                <p className="text-muted-foreground">
                    Real-time XAND prices, charts, and trading via Jupiter aggregator.
                </p>
            </div>

            {/* Overview */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b border-border pb-2">Overview</h2>
                <p className="text-sm leading-relaxed">
                    The Trading Terminal provides a comprehensive view of XAND token performance with real-time price data
                    from CoinGecko, interactive charts from Birdeye, and direct trading links to Jupiter aggregator.
                </p>
            </section>

            {/* Features */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b border-border pb-2">Features</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="p-4 rounded-lg border border-border bg-card">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-5 h-5 text-green-500" />
                            <h3 className="font-medium">Live Prices</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Real-time XAND and SOL prices from CoinGecko API with 24h change indicators. Auto-refreshes every 30 seconds.
                        </p>
                    </div>
                    <div className="p-4 rounded-lg border border-border bg-card">
                        <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="w-5 h-5 text-blue-500" />
                            <h3 className="font-medium">Interactive Chart</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Birdeye TradingView widget with candlestick charts, multiple timeframes, and technical indicators.
                        </p>
                    </div>
                    <div className="p-4 rounded-lg border border-border bg-card">
                        <div className="flex items-center gap-2 mb-2">
                            <Wallet className="w-5 h-5 text-violet-500" />
                            <h3 className="font-medium">Jupiter Integration</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Quick links to Buy XAND (SOL→XAND), Sell XAND (XAND→USDC), and swap with other tokens.
                        </p>
                    </div>
                    <div className="p-4 rounded-lg border border-border bg-card">
                        <div className="flex items-center gap-2 mb-2">
                            <RefreshCw className="w-5 h-5 text-orange-500" />
                            <h3 className="font-medium">Exchange Rate</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Live calculated exchange rate showing how many XAND tokens you get per SOL.
                        </p>
                    </div>
                </div>
            </section>

            {/* Data Sources */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b border-border pb-2">Data Sources</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-2 font-medium">Data</th>
                                <th className="text-left py-2 font-medium">Source</th>
                                <th className="text-left py-2 font-medium">Refresh Rate</th>
                            </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                            <tr className="border-b border-border/50">
                                <td className="py-2">Token Prices</td>
                                <td className="py-2">CoinGecko API</td>
                                <td className="py-2">30 seconds</td>
                            </tr>
                            <tr className="border-b border-border/50">
                                <td className="py-2">Price Charts</td>
                                <td className="py-2">Birdeye TradingView</td>
                                <td className="py-2">Real-time</td>
                            </tr>
                            <tr className="border-b border-border/50">
                                <td className="py-2">24h Volume</td>
                                <td className="py-2">CoinGecko API</td>
                                <td className="py-2">30 seconds</td>
                            </tr>
                            <tr>
                                <td className="py-2">Exchange Rate</td>
                                <td className="py-2">Calculated (SOL/XAND)</td>
                                <td className="py-2">30 seconds</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Quick Links */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b border-border pb-2">External Resources</h2>
                <div className="flex flex-wrap gap-3">
                    <a
                        href="https://jup.ag/swap/SOL-XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm"
                    >
                        Jupiter <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                        href="https://birdeye.so/token/XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx?chain=solana"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm"
                    >
                        Birdeye <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                        href="https://www.coingecko.com/en/coins/xandeum"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm"
                    >
                        CoinGecko <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                        href="https://solscan.io/token/XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm"
                    >
                        Solscan <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </section>

            {/* Spotlight Access */}
            <section className="p-4 rounded-lg border border-violet-500/30 bg-violet-500/5">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-500 text-xs font-mono">⌘J</span>
                    Quick Access
                </h3>
                <p className="text-sm text-muted-foreground">
                    Open Spotlight Search and type "trading" to quickly navigate to the Trading Terminal.
                </p>
            </section>
        </div>
    );
}
