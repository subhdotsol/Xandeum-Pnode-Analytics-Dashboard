"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    TrendingUp,
    TrendingDown,
    RefreshCw,
    ExternalLink,
    Activity,
    DollarSign,
    BarChart3,
    Clock,
    Wallet,
    ArrowRightLeft
} from "lucide-react";

const XAND_TOKEN = "XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx";

interface PriceData {
    xand: number;
    sol: number;
    xandChange24h: number;
    solChange24h: number;
    xandVolume: number;
}

export function TradingTerminal() {
    const [prices, setPrices] = useState<PriceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    // Fetch real prices from CoinGecko
    const fetchPrices = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        try {
            const res = await fetch(
                "https://api.coingecko.com/api/v3/simple/price?ids=solana,xandeum&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true"
            );
            const data = await res.json();

            setPrices({
                xand: data.xandeum?.usd || 0,
                sol: data.solana?.usd || 0,
                xandChange24h: data.xandeum?.usd_24h_change || 0,
                solChange24h: data.solana?.usd_24h_change || 0,
                xandVolume: data.xandeum?.usd_24h_vol || 0
            });
            setLastUpdate(new Date());
        } catch (error) {
            console.error("Failed to fetch prices:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPrices();
        const interval = setInterval(fetchPrices, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatPrice = (price: number) => {
        if (!price || price === 0) return "$0.00";
        if (price < 0.0001) return `$${price.toFixed(8)}`;
        if (price < 0.01) return `$${price.toFixed(6)}`;
        if (price < 1) return `$${price.toFixed(4)}`;
        return `$${price.toFixed(2)}`;
    };

    const formatVolume = (volume: number) => {
        if (!volume) return "$0";
        if (volume >= 1000000000) return `$${(volume / 1000000000).toFixed(2)}B`;
        if (volume >= 1000000) return `$${(volume / 1000000).toFixed(2)}M`;
        if (volume >= 1000) return `$${(volume / 1000).toFixed(1)}K`;
        return `$${volume.toFixed(0)}`;
    };

    const exchangeRate = prices && prices.xand > 0 && prices.sol > 0
        ? Math.floor(prices.sol / prices.xand)
        : 0;

    return (
        <div className="space-y-8">
            {/* Header - Matching Dashboard Style */}
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-1">Trading Terminal</h1>
                <p className="text-muted-foreground">Real-time XAND prices and trading via Jupiter</p>
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Live prices</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                    Updated {lastUpdate.toLocaleTimeString()}
                </span>
                <button
                    onClick={() => fetchPrices(true)}
                    disabled={refreshing}
                    className="p-1.5 rounded-md hover:bg-muted transition-colors disabled:opacity-50"
                    title="Refresh prices"
                >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Price Cards - Matching Dashboard StatCard Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* XAND Price */}
                <Card className="border border-border bg-card">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">XAND Price</p>
                                <p className="text-3xl font-bold">
                                    {loading ? "..." : formatPrice(prices?.xand || 0)}
                                </p>
                                {!loading && prices && (
                                    <p className={`text-xs ${(prices.xandChange24h || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {(prices.xandChange24h || 0) >= 0 ? '↑' : '↓'} {Math.abs(prices.xandChange24h || 0).toFixed(2)}% 24h
                                    </p>
                                )}
                            </div>
                            <div className="p-2 rounded-lg bg-muted">
                                <TrendingUp className="w-5 h-5 text-muted-foreground" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* SOL Price */}
                <Card className="border border-border bg-card">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">SOL Price</p>
                                <p className="text-3xl font-bold">
                                    {loading ? "..." : formatPrice(prices?.sol || 0)}
                                </p>
                                {!loading && prices && (
                                    <p className={`text-xs ${(prices.solChange24h || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {(prices.solChange24h || 0) >= 0 ? '↑' : '↓'} {Math.abs(prices.solChange24h || 0).toFixed(2)}% 24h
                                    </p>
                                )}
                            </div>
                            <div className="p-2 rounded-lg bg-muted">
                                <DollarSign className="w-5 h-5 text-muted-foreground" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Exchange Rate */}
                <Card className="border border-border bg-card">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Exchange Rate</p>
                                <p className="text-3xl font-bold">
                                    {loading ? "..." : exchangeRate > 0 ? exchangeRate.toLocaleString() : "N/A"}
                                </p>
                                <p className="text-xs text-muted-foreground">XAND per SOL</p>
                            </div>
                            <div className="p-2 rounded-lg bg-muted">
                                <ArrowRightLeft className="w-5 h-5 text-muted-foreground" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 24h Volume */}
                <Card className="border border-border bg-card">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">24h Volume</p>
                                <p className="text-3xl font-bold">
                                    {loading ? "..." : formatVolume(prices?.xandVolume || 0)}
                                </p>
                                <p className="text-xs text-muted-foreground">XAND trading volume</p>
                            </div>
                            <div className="p-2 rounded-lg bg-muted">
                                <BarChart3 className="w-5 h-5 text-muted-foreground" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Trading Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Section - Using Birdeye embed */}
                <Card className="lg:col-span-2 border border-border overflow-hidden">
                    <CardHeader className="pb-2 border-b border-border">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                XAND/USD Chart
                            </span>
                            <div className="flex items-center gap-3">
                                <a
                                    href={`https://birdeye.so/token/${XAND_TOKEN}?chain=solana`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:underline flex items-center gap-1"
                                >
                                    Birdeye <ExternalLink className="w-3 h-3" />
                                </a>
                                <a
                                    href={`https://dexscreener.com/solana/${XAND_TOKEN}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                                >
                                    DexScreener <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* Birdeye Chart Embed */}
                        <div className="w-full h-[450px] bg-background">
                            <iframe
                                src={`https://birdeye.so/tv-widget/${XAND_TOKEN}?chain=solana&viewMode=pair&chartInterval=15&chartType=CANDLE&chartTimezone=Asia%2FKolkata&chartLeftToolbar=show&theme=dark`}
                                className="w-full h-full border-0"
                                title="XAND Price Chart"
                                loading="lazy"
                                allowFullScreen
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Swap Card - Links to Jupiter */}
                <Card className="border border-border">
                    <CardHeader className="pb-4 border-b border-border">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Wallet className="w-4 h-4" />
                            Trade XAND
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {/* Token Info */}
                            <div className="p-4 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-xl border border-violet-500/20">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                        X
                                    </div>
                                    <div>
                                        <p className="font-semibold">XAND</p>
                                        <p className="text-xs text-muted-foreground">Xandeum Token</p>
                                    </div>
                                </div>
                                <div className="text-2xl font-bold">
                                    {loading ? "..." : formatPrice(prices?.xand || 0)}
                                </div>
                            </div>

                            {/* Swap Options */}
                            <div className="space-y-3">
                                <p className="text-sm text-muted-foreground">Swap on Jupiter Aggregator</p>

                                {/* Buy XAND */}
                                <a
                                    href={`https://jup.ag/swap/SOL-${XAND_TOKEN}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-xl transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-500/20 rounded-lg">
                                            <TrendingUp className="w-5 h-5 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Buy XAND</p>
                                            <p className="text-xs text-muted-foreground">SOL → XAND</p>
                                        </div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </a>

                                {/* Sell XAND */}
                                <a
                                    href={`https://jup.ag/swap/${XAND_TOKEN}-USDC`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-500/20 rounded-lg">
                                            <TrendingDown className="w-5 h-5 text-red-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Sell XAND</p>
                                            <p className="text-xs text-muted-foreground">XAND → USDC</p>
                                        </div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </a>

                                {/* Swap */}
                                <a
                                    href={`https://jup.ag/swap/USDC-${XAND_TOKEN}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-4 bg-muted hover:bg-muted/80 border border-border rounded-xl transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <ArrowRightLeft className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Swap USDC</p>
                                            <p className="text-xs text-muted-foreground">USDC → XAND</p>
                                        </div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </a>
                            </div>

                            {/* Info */}
                            <p className="text-xs text-muted-foreground text-center">
                                Opens Jupiter in a new tab • Connect your wallet there
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Links Footer */}
            <Card className="border border-border">
                <CardContent className="p-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Live data from CoinGecko • Auto-refresh: 30s
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                            <a
                                href={`https://jup.ag/swap/SOL-${XAND_TOKEN}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                            >
                                Jupiter <ExternalLink className="w-3 h-3" />
                            </a>
                            <a
                                href={`https://birdeye.so/token/${XAND_TOKEN}?chain=solana`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                            >
                                Birdeye <ExternalLink className="w-3 h-3" />
                            </a>
                            <a
                                href={`https://solscan.io/token/${XAND_TOKEN}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                            >
                                Solscan <ExternalLink className="w-3 h-3" />
                            </a>
                            <a
                                href="https://www.coingecko.com/en/coins/xandeum"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                            >
                                CoinGecko <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
