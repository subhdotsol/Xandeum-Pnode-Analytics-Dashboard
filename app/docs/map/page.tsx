"use client";

import { motion } from "framer-motion";

const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
};

const markerColors = [
    { color: "bg-green-500", label: "Healthy", description: "Node is online and responsive" },
    { color: "bg-yellow-500", label: "Degraded", description: "Recently went offline" },
    { color: "bg-red-500", label: "Offline", description: "Down for 1+ hour" },
];

const nodeDetails = [
    "IP address and port",
    "City and country location",
    "Node version",
    "Last seen timestamp",
];

const geoFeatures = [
    "City-level accuracy",
    "Country identification",
    "Latitude/longitude coordinates",
    "7-day caching to reduce API calls",
];

export default function MapDocsPage() {
    return (
        <motion.article {...fadeIn}>
            <header className="mb-8 border-b border-border pb-4">
                <h1 className="text-2xl font-bold tracking-tight mb-2">Global Map</h1>
                <p className="text-muted-foreground">
                    Interactive visualization of pNode geographic distribution.
                </p>
            </header>

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4">Node Markers</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Each pNode is represented by a color-coded marker based on health status:
                </p>
                <div className="space-y-2">
                    {markerColors.map((marker, idx) => (
                        <motion.div
                            key={marker.label}
                            className="flex items-center gap-3 rounded-lg border border-border p-3"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + idx * 0.05 }}
                        >
                            <span className={`w-3 h-3 rounded-full ${marker.color}`} />
                            <div>
                                <span className="text-sm font-medium">{marker.label}</span>
                                <span className="text-sm text-muted-foreground ml-2">— {marker.description}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4">Click for Details</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Click any marker to view node details:
                </p>
                <div className="rounded-lg border border-border p-4">
                    <ul className="space-y-2">
                        {nodeDetails.map((detail, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                {detail}
                            </li>
                        ))}
                    </ul>
                </div>
            </motion.section>

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4">Geo-location</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Node locations are determined by IP address lookup:
                </p>
                <div className="rounded-lg border border-border p-4">
                    <ul className="space-y-2">
                        {geoFeatures.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>
            </motion.section>

            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
            >
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <h3 className="font-medium text-sm mb-2">Progressive Loading</h3>
                    <p className="text-sm text-muted-foreground">
                        Nodes load in batches of 20 for smooth performance. A progress indicator shows loading status.
                    </p>
                </div>
            </motion.section>
        </motion.article>
    );
}
