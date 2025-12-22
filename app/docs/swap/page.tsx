"use client";

import { motion } from "framer-motion";
import { CodeBlock } from "@/components/ui/code-block";

const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
};

const steps = [
    { text: "Connect your Solana wallet", color: "text-sky-500" },
    { text: "Select the token to swap from", color: "text-violet-500" },
    { text: "Enter the amount", color: "text-emerald-500" },
    { text: "XAND is pre-selected as output", color: "text-amber-500" },
    { text: "Review the rate and click Swap", color: "text-rose-500" },
    { text: "Confirm in your wallet", color: "text-cyan-500" },
];

const tokenInfo = [
    { label: "Name", value: "Xandeum", color: "text-sky-400" },
    { label: "Symbol", value: "XAND", color: "text-amber-400" },
    { label: "Network", value: "Solana Mainnet", color: "text-violet-400" },
];

const dexes = [
    { name: "Raydium", color: "text-sky-400" },
    { name: "Orca", color: "text-violet-400" },
    { name: "Meteora", color: "text-emerald-400" },
    { name: "And more...", color: "text-muted-foreground" },
];

const fees = [
    { label: "Platform fee", value: "0%", note: "We don't charge", color: "text-emerald-400" },
    { label: "Jupiter fee", value: "0.5-1%", note: "Varies by route", color: "text-amber-400" },
    { label: "Network fee", value: "~0.00001 SOL", note: "", color: "text-violet-400" },
];

export default function SwapDocsPage() {
    return (
        <motion.article {...fadeIn}>
            <header className="mb-8 border-b border-border pb-4">
                <h1 className="text-2xl font-bold tracking-tight mb-2">Token Swap</h1>
                <p className="text-muted-foreground">
                    Trade <span className="text-amber-400 font-medium">XAND</span> using Jupiter, the leading DEX aggregator on Solana.
                </p>
            </header>

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4 text-sky-500">How It Works</h2>
                <div className="space-y-2">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + idx * 0.05 }}
                        >
                            <span className={`w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium flex-shrink-0 ${step.color}`}>
                                {idx + 1}
                            </span>
                            <span className={`text-sm ${step.color}`}>{step.text}</span>
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
                <h2 className="text-lg font-semibold mb-4 text-amber-500">XAND Token</h2>
                <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm">
                        <tbody>
                            {tokenInfo.map((info) => (
                                <tr key={info.label} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                                    <td className="p-3 font-medium w-32">{info.label}</td>
                                    <td className={`p-3 ${info.color}`}>{info.value}</td>
                                </tr>
                            ))}
                            <tr className="border-b border-border">
                                <td className="p-3 font-medium align-top">Address</td>
                                <td className="p-3">
                                    <code className="text-xs text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded break-all">
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
                <h2 className="text-lg font-semibold mb-4 text-violet-500">Jupiter Aggregation</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Jupiter finds the best rate across multiple DEXs:
                </p>
                <div className="flex flex-wrap gap-2">
                    {dexes.map((dex) => (
                        <span key={dex.name} className={`text-xs bg-muted px-2 py-1 rounded ${dex.color}`}>
                            {dex.name}
                        </span>
                    ))}
                </div>
            </motion.section>

            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4 text-emerald-500">Fees</h2>
                <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm">
                        <tbody>
                            {fees.map((fee) => (
                                <tr key={fee.label} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                                    <td className="p-3 font-medium">{fee.label}</td>
                                    <td className={`p-3 font-mono ${fee.color}`}>{fee.value}</td>
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
