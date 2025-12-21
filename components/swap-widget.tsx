"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftRight, ExternalLink, Wallet } from "lucide-react";

const XAND_TOKEN = "XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx";

export function SwapWidget() {
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load Jupiter Terminal script
        const script = document.createElement("script");
        script.src = "https://terminal.jup.ag/main-v2.js";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            if (terminalRef.current && (window as any).Jupiter) {
                (window as any).Jupiter.init({
                    displayMode: "integrated",
                    integratedTargetId: "jupiter-terminal",
                    endpoint: "https://api.mainnet-beta.solana.com",
                    defaultExplorer: "Solscan",
                    formProps: {
                        fixedOutputMint: false,
                        initialOutputMint: XAND_TOKEN,
                        initialInputMint: "So11111111111111111111111111111111111111112", // SOL
                    },
                });
            }
        };

        return () => {
            script.remove();
        };
    }, []);

    return (
        <div className="max-w-lg mx-auto">
            <Card className="border border-border bg-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                        <ArrowLeftRight className="w-5 h-5" />
                        Swap Tokens
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Trade tokens using Jupiter aggregator for the best rates
                    </p>
                </CardHeader>
                <CardContent>
                    {/* Jupiter Terminal Container */}
                    <div
                        id="jupiter-terminal"
                        ref={terminalRef}
                        className="min-h-[400px] rounded-xl overflow-hidden"
                    />

                    {/* Fallback if terminal doesn't load */}
                    <noscript>
                        <div className="text-center py-8">
                            <Wallet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground mb-4">
                                JavaScript is required for the swap widget
                            </p>
                        </div>
                    </noscript>

                    <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Powered by</span>
                            <a
                                href="https://jup.ag"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary hover:underline"
                            >
                                Jupiter <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Info Cards */}
            <div className="grid gap-4 mt-6">
                <Card className="border border-border bg-card">
                    <CardContent className="p-4">
                        <h3 className="font-medium mb-2">About XAND</h3>
                        <p className="text-sm text-muted-foreground">
                            XAND is the governance token for the Xandeum network.
                            Holders can participate in DAO decisions and influence
                            the development of the storage layer.
                        </p>
                        <div className="mt-3 p-2 bg-muted rounded-lg">
                            <p className="text-xs text-muted-foreground">Token Address</p>
                            <code className="text-xs font-mono break-all">{XAND_TOKEN}</code>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
