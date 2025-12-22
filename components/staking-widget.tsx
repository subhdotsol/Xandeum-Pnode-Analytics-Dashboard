"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, ExternalLink, Info, ArrowDown, RefreshCw, Loader2 } from "lucide-react";
import { CustomWalletButton } from "@/components/ui/custom-wallet-button";
import { LiquidButton } from "@/components/ui/liquid-button";
import { useStakingData, useWalletBalance } from "@/hooks/use-staking-data";

export function StakingWidget() {
    const [amount, setAmount] = useState("");
    const { connected, publicKey, disconnect } = useWallet();

    // Fetch dynamic staking data
    const stakingData = useStakingData();
    const walletBalance = useWalletBalance();

    // Helper to format wallet address
    const formatAddress = (address: string) => {
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    };

    return (
        <div className="max-w-lg mx-auto">
            <Card className="border border-border bg-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                            <Coins className="w-5 h-5" />
                            Liquid Staking
                        </CardTitle>
                        <div className="px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20">
                            <span className="text-xs font-medium text-green-600 dark:text-green-500">Live Prices</span>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Stake SOL and receive XANDsol - a liquid staking token
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Wallet Connection Status */}
                    {connected && publicKey && (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-sm font-medium">
                                    {formatAddress(publicKey.toString())}
                                </span>
                            </div>
                            <button
                                onClick={disconnect}
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Disconnect
                            </button>
                        </div>
                    )}

                    {/* Staking Input */}
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-muted/50 border border-border">
                            <label className="text-sm text-muted-foreground mb-2 block">You stake</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    placeholder="0.0"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="flex-1 bg-transparent text-2xl font-semibold outline-none placeholder:text-muted-foreground/50"
                                    disabled={!connected}
                                />
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-lg border border-border">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
                                    <span className="font-medium">SOL</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <div className="p-2 rounded-lg bg-muted">
                                <ArrowDown className="w-4 h-4" />
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-muted/50 border border-border">
                            <label className="text-sm text-muted-foreground mb-2 block">You receive</label>
                            <div className="flex items-center gap-3">
                                <span className="flex-1 text-2xl font-semibold text-muted-foreground">
                                    {amount ? (parseFloat(amount) * stakingData.exchangeRate).toFixed(4) : "0.0"}
                                </span>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-lg border border-border">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-teal-500" />
                                    <span className="font-medium">XANDsol</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-muted/30">
                            <p className="text-xs text-muted-foreground">APY</p>
                            {stakingData.isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-green-500" />
                                    <p className="text-sm text-muted-foreground">Loading...</p>
                                </div>
                            ) : (
                                <p className="text-lg font-semibold text-green-500">
                                    ~{stakingData.apy.toFixed(2)}%
                                </p>
                            )}
                        </div>
                        <div className="p-3 rounded-lg bg-muted/30">
                            <p className="text-xs text-muted-foreground">Exchange Rate</p>
                            {stakingData.isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <p className="text-sm text-muted-foreground">Loading...</p>
                                </div>
                            ) : (
                                <p className="text-lg font-semibold">
                                    1 : {stakingData.exchangeRate.toFixed(4)}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Live Price Notice */}
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                        <Info className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-muted-foreground">
                            <p className="font-medium text-green-500 mb-1">Real-Time Market Prices</p>
                            <p className="text-xs">
                                Exchange rate calculated from live SOL and XAND prices via CoinGecko. APY estimate: 7.2%
                            </p>
                        </div>
                    </div>

                    {/* Wallet Balance */}
                    {connected && (
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Available:</span>
                            {walletBalance.isLoading ? (
                                <div className="flex items-center gap-1">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    <span className="text-muted-foreground text-xs">Loading...</span>
                                </div>
                            ) : (
                                <span className="font-medium">{walletBalance.sol.toFixed(4)} SOL</span>
                            )}
                        </div>
                    )}


                    {/* Connect Wallet / Stake Button */}
                    {!connected ? (
                        <CustomWalletButton />
                    ) : (
                        <LiquidButton
                            className="w-full py-3 px-4 rounded-xl text-white font-semibold"
                            disabled={!amount || parseFloat(amount) <= 0}
                        >
                            Stake SOL
                        </LiquidButton>
                    )}

                    {/* Info */}
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">
                            XANDsol is a liquid staking token. You can use it in DeFi while earning staking rewards.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Info Cards */}
            <div className="grid gap-4 mt-6">
                <Card className="border border-border bg-card">
                    <CardContent className="p-4">
                        <h3 className="font-medium mb-2">How Liquid Staking Works</h3>
                        <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                            <li>Stake your SOL in the Xandeum staking pool</li>
                            <li>Receive XANDsol tokens representing your stake</li>
                            <li>Use XANDsol in DeFi or hold for staking rewards</li>
                            <li>Unstake anytime by returning XANDsol</li>
                        </ol>
                    </CardContent>
                </Card>

                <Card className="border border-border bg-card">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Learn more about XANDsol</span>
                            <a
                                href="https://xandeum.network"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                                Xandeum Docs <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
