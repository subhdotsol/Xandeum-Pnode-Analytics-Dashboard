"use client";

import { motion } from "framer-motion";

const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
};

const benefits = [
    "Earns staking rewards automatically",
    "Can be traded, used as collateral, or sold",
    "Remains liquid — no unbonding period",
];

const steps = [
    "Connect your Solana wallet",
    "Enter the amount of SOL to stake",
    "Click 'Stake SOL'",
    "Receive XANDsol tokens",
    "Hold or use XANDsol in DeFi",
];

const rewardsInfo = [
    { label: "Current APY", value: "~7.2%" },
    { label: "Rewards frequency", value: "Every epoch (~2 days)" },
    { label: "Compound", value: "Yes, auto-compounded" },
];

const risks = [
    { name: "Smart contract risk", description: "As with all DeFi protocols" },
    { name: "Slashing risk", description: "Minimal on Solana" },
    { name: "Price risk", description: "XANDsol may trade at slight discount" },
];

export default function StakingDocsPage() {
    return (
        <motion.article {...fadeIn}>
            <header className="mb-8 border-b border-border pb-4">
                <h1 className="text-2xl font-bold tracking-tight mb-2">Stake SOL</h1>
                <p className="text-muted-foreground">
                    Liquid staking — earn rewards while keeping your tokens usable.
                </p>
            </header>

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4">What is Liquid Staking?</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Stake SOL and receive XANDsol, a liquid staking token that:
                </p>
                <div className="rounded-lg border border-border p-4">
                    <ul className="space-y-2">
                        {benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                {benefit}
                            </li>
                        ))}
                    </ul>
                </div>
            </motion.section>

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4">How It Works</h2>
                <div className="space-y-2">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + idx * 0.05 }}
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
                <h2 className="text-lg font-semibold mb-4">Rewards</h2>
                <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm">
                        <tbody>
                            {rewardsInfo.map((info) => (
                                <tr key={info.label} className="border-b border-border last:border-0">
                                    <td className="p-3 font-medium">{info.label}</td>
                                    <td className="p-3 text-muted-foreground">{info.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.section>

            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4">Risks</h2>
                <div className="space-y-2">
                    {risks.map((risk, idx) => (
                        <div key={idx} className="rounded-lg border border-border p-3">
                            <span className="text-sm font-medium">{risk.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">— {risk.description}</span>
                        </div>
                    ))}
                </div>
            </motion.section>
        </motion.article>
    );
}
