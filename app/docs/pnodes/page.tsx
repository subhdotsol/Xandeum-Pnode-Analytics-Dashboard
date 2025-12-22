"use client";

import { motion } from "framer-motion";
import { CodeBlock } from "@/components/ui/code-block";

const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
};

const responsibilities = [
    { title: "Data Storage", description: "Store encrypted data chunks assigned by the network", color: "text-sky-500" },
    { title: "Data Retrieval", description: "Serve requested data to authorized clients", color: "text-violet-500" },
    { title: "Peer Discovery", description: "Maintain connections with other pNodes", color: "text-emerald-500" },
    { title: "Health Reporting", description: "Broadcast status and availability metrics", color: "text-amber-500" },
];

const healthStatuses = [
    { status: "Healthy", condition: "Last seen < 5 minutes ago", color: "text-emerald-500", dot: "bg-emerald-500" },
    { status: "Degraded", condition: "Last seen < 1 hour ago", color: "text-amber-500", dot: "bg-amber-500" },
    { status: "Offline", condition: "Last seen > 1 hour ago", color: "text-rose-500", dot: "bg-rose-500" },
];

const stats = [
    { metric: "CPU Percent", description: "Current CPU utilization", color: "text-sky-400" },
    { metric: "RAM Usage", description: "Memory consumption (used/total)", color: "text-violet-400" },
    { metric: "Storage", description: "Total file size being stored", color: "text-emerald-400" },
    { metric: "Uptime", description: "Time since last restart", color: "text-amber-400" },
    { metric: "Active Streams", description: "Number of concurrent connections", color: "text-rose-400" },
    { metric: "Packets", description: "Sent and received packet counts", color: "text-cyan-400" },
];

const requirements = [
    { text: "A server with stable internet connection", color: "text-sky-400" },
    { text: "Minimum 8GB RAM and 100GB storage", color: "text-violet-400" },
    { text: "The Xandeum pNode software", color: "text-emerald-400" },
    { text: "Configuration for network access", color: "text-amber-400" },
];

export default function PNodesPage() {
    return (
        <motion.article {...fadeIn}>
            <header className="mb-8 border-b border-border pb-4">
                <h1 className="text-2xl font-bold tracking-tight mb-2">pNodes</h1>
                <p className="text-muted-foreground">
                    Understanding the backbone of the Xandeum storage network.
                </p>
            </header>

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4 text-sky-500">What are pNodes?</h2>
                <p className="text-sm text-muted-foreground">
                    pNodes (<span className="text-sky-400">Persistent Nodes</span>) are the fundamental building blocks of the Xandeum distributed storage network. Each pNode is an individual server that participates in storing and serving data chunks across the network.
                </p>
            </motion.section>

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4 text-violet-500">Responsibilities</h2>
                <div className="grid grid-cols-2 gap-3">
                    {responsibilities.map((item, idx) => (
                        <div key={idx} className="rounded-lg border border-border p-4 hover:bg-muted/30 transition-colors">
                            <h3 className={`font-medium text-sm mb-1 ${item.color}`}>{item.title}</h3>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                    ))}
                </div>
            </motion.section>

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4 text-emerald-500">Health Classification</h2>
                <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left p-3 font-medium">Status</th>
                                <th className="text-left p-3 font-medium">Condition</th>
                            </tr>
                        </thead>
                        <tbody>
                            {healthStatuses.map((status) => (
                                <tr key={status.status} className="border-t border-border hover:bg-muted/30 transition-colors">
                                    <td className="p-3 flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                                        <span className={status.color}>{status.status}</span>
                                    </td>
                                    <td className="p-3 text-muted-foreground">{status.condition}</td>
                                </tr>
                            ))}
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
                <h2 className="text-lg font-semibold mb-4 text-amber-500">Statistics</h2>
                <p className="text-sm text-muted-foreground mb-4">Each pNode reports the following metrics:</p>
                <div className="rounded-lg border border-border p-4">
                    <ul className="space-y-2">
                        {stats.map((stat, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                                <span className={`w-1.5 h-1.5 rounded-full ${stat.color.replace('text-', 'bg-')} flex-shrink-0`} />
                                <span className={stat.color}>{stat.metric}</span>
                                <span className="text-muted-foreground">— {stat.description}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </motion.section>

            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4 text-rose-500">Running a pNode</h2>
                <p className="text-sm text-muted-foreground mb-4">To run your own pNode, you'll need:</p>
                <div className="rounded-lg border border-border p-4 mb-4">
                    <ol className="space-y-2">
                        {requirements.map((req, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                                <span className={`w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-medium ${req.color}`}>{idx + 1}</span>
                                <span className={req.color}>{req.text}</span>
                            </li>
                        ))}
                    </ol>
                </div>
                <a
                    href="https://xandeum.network"
                    target="_blank"
                    className="text-sm font-medium text-sky-500 hover:text-sky-400 transition-colors"
                >
                    Visit official Xandeum website →
                </a>
            </motion.section>
        </motion.article>
    );
}
