"use client";

import { motion } from "framer-motion";

const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
};

const charts = [
    { name: "Node Population", description: "Track total nodes over time with gradient area chart" },
    { name: "Availability Rate", description: "Monitor online percentage (healthy: 80%+)" },
    { name: "Resource Utilization", description: "Average CPU and RAM usage across nodes" },
    { name: "Storage Capacity", description: "Aggregate storage provided by all pNodes" },
    { name: "Geographic Spread", description: "Countries and version diversity metrics" },
];

const timeRanges = [
    { range: "1H", description: "Last hour (12 data points)" },
    { range: "4H", description: "Last 4 hours (48 data points)" },
    { range: "12H", description: "Last 12 hours (144 data points)" },
    { range: "24H", description: "Last 24 hours (288 data points)" },
    { range: "7D", description: "Last 7 days (2,016 data points)" },
    { range: "30D", description: "Last 30 days" },
    { range: "All", description: "All available data" },
];

export default function AnalyticsDocsPage() {
    return (
        <motion.article {...fadeIn}>
            <header className="mb-8 border-b border-border pb-4">
                <h1 className="text-2xl font-bold tracking-tight mb-2">Analytics</h1>
                <p className="text-muted-foreground">
                    Historical insights into network performance with interactive charts.
                </p>
            </header>

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4">Available Charts</h2>
                <div className="space-y-3">
                    {charts.map((chart, idx) => (
                        <motion.div
                            key={chart.name}
                            className="rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + idx * 0.05 }}
                        >
                            <h3 className="font-medium text-sm mb-1">{chart.name}</h3>
                            <p className="text-sm text-muted-foreground">{chart.description}</p>
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
                <h2 className="text-lg font-semibold mb-4">Time Range Filters</h2>
                <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left p-3 font-medium w-20">Range</th>
                                <th className="text-left p-3 font-medium">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timeRanges.map((tr) => (
                                <tr key={tr.range} className="border-t border-border">
                                    <td className="p-3">
                                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{tr.range}</code>
                                    </td>
                                    <td className="p-3 text-muted-foreground">{tr.description}</td>
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
                <h2 className="text-lg font-semibold mb-4">Data Collection</h2>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-sm text-muted-foreground">
                        Snapshots are collected every <strong className="text-foreground">5 minutes</strong> via GitHub Actions.
                        Data is stored in Supabase PostgreSQL with unlimited retention.
                    </p>
                </div>
            </motion.section>
        </motion.article>
    );
}
