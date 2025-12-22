"use client";

import { motion } from "framer-motion";

const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
};

const steps = [
    "Connect your Solana wallet",
    "Select the token to swap from",
    "Enter the amount",
    "XAND is pre-selected as output",
    "Review the rate and click Swap",
    "Confirm in your wallet",
];

const tokenInfo = [
    { label: "Name", value: "Xandeum" },
    { label: "Symbol", value: "XAND" },
    { label: "Network", value: "Solana Mainnet" },
];

const dexes = ["Raydium", "Orca", "Meteora", "And more..."];

const fees = [
    { label: "Platform fee", value: "0%", note: "We don't charge" },
    { label: "Jupiter fee", value: "0.5-1%", note: "Varies by route" },
    { label: "Network fee", value: "~0.00001 SOL", note: "" },
];

export default function SwapDocsPage() {
    return (
        <motion.article {...fadeIn}>
            <header className="mb-8 border-b border-border pb-4">
                <h1 className="text-2xl font-bold tracking-tight mb-2">Token Swap</h1>
                <p className="text-muted-foreground">
                    Trade XAND using Jupiter, the leading DEX aggregator on Solana.
                </p>
            </header>

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4">How It Works</h2>
                <div className="space-y-2">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + idx * 0.05 }}
                        >
                            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium flex-shrink-0">
                                {idx + 1}
                            </span>
                            <span className="text-sm">{step}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4">XAND Token</h2>
                <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm">
                        <tbody>
                            {tokenInfo.map((info) => (
                                <tr key={info.label} className="border-b border-border last:border-0">
                                    <td className="p-3 font-medium w-32">{info.label}</td>
                                    <td className="p-3 text-muted-foreground">{info.value}</td>
                                </tr>
                            ))}
                            <tr className="border-b border-border">
                                <td className="p-3 font-medium align-top">Address</td>
                                <td className="p-3">
                                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded break-all">
                                        XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx
                                    </code>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </motion.section>

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4">Jupiter Aggregation</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Jupiter finds the best rate across multiple DEXs:
                </p>
                <div className="flex flex-wrap gap-2">
                    {dexes.map((dex) => (
                        <span key={dex} className="text-xs bg-muted px-2 py-1 rounded">
                            {dex}
                        </span>
                    ))}
                </div>
            </motion.section>

            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4">Fees</h2>
                <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm">
                        <tbody>
                            {fees.map((fee) => (
                                <tr key={fee.label} className="border-b border-border last:border-0">
                                    <td className="p-3 font-medium">{fee.label}</td>
                                    <td className="p-3 font-mono">{fee.value}</td>
                                    <td className="p-3 text-muted-foreground text-xs">{fee.note}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.section>
        </motion.article>
    );
}
