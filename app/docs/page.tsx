import Link from "next/link";
import { Server, Layers, Zap, Shield, Globe, Database, Keyboard, BarChart3, Trophy, Map as MapIcon } from "lucide-react";

export default function DocsPage() {
    return (
        <article className="prose dark:prose-invert max-w-none">
            <h1 className="text-4xl font-bold mb-2">Xandeum pNode Analytics</h1>
            <p className="text-xl text-muted-foreground mb-8">
                Real-time monitoring and analytics for the Xandeum distributed storage network
            </p>

            {/* Keyboard Shortcuts */}
            <div className="not-prose mb-12 p-6 rounded-xl border border-border bg-card/50">
                <div className="flex items-center gap-2 mb-4">
                    <Keyboard className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold m-0">Keyboard Shortcuts</h2>
                </div>
                <div className="grid gap-3 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Toggle Sidebar</span>
                        <kbd className="px-3 py-1.5 bg-muted rounded border border-border font-mono text-xs">⌘K</kbd>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Spotlight Search</span>
                        <kbd className="px-3 py-1.5 bg-muted rounded border border-border font-mono text-xs">⌘J</kbd>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Open AI Assistant</span>
                        <kbd className="px-3 py-1.5 bg-muted rounded border border-border font-mono text-xs">⌘A</kbd>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Toggle Dark Mode</span>
                        <kbd className="px-3 py-1.5 bg-muted rounded border border-border font-mono text-xs">⌘D</kbd>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 not-prose mb-12">
                <FeatureCard
                    icon={Server}
                    title="pNodes"
                    description="Learn about persistent nodes that power the network"
                    href="/docs/pnodes"
                />
                <FeatureCard
                    icon={Layers}
                    title="Architecture"
                    description="Understand how Xandeum is built on Solana"
                    href="/docs/architecture"
                />
                <FeatureCard
                    icon={BarChart3}
                    title="Analytics"
                    description="Real-time network metrics and historical data"
                    href="/docs/analytics"
                />
                <FeatureCard
                    icon={Trophy}
                    title="Leaderboard"
                    description="Pod credits system and top performing nodes"
                    href="/docs/leaderboard"
                />
                <FeatureCard
                    icon={MapIcon}
                    title="Global Map"
                    description="Geographic distribution of nodes worldwide"
                    href="/docs/map"
                />
                <FeatureCard
                    icon={Database}
                    title="API Reference"
                    description="Integrate with our REST API endpoints"
                    href="/docs/api"
                />
            </div>

            <h2>What is Xandeum?</h2>
            <p>
                <strong>Xandeum</strong> is a decentralized distributed storage layer built on Solana
                that enables efficient data storage and retrieval across a network of participating
                nodes called <strong>pNodes</strong> (persistent nodes).
            </p>

            <h3>Key Concepts</h3>
            <ul>
                <li>
                    <strong>pNodes (Persistent Nodes)</strong>: Individual nodes in the Xandeum network
                    that store and serve data chunks
                </li>
                <li>
                    <strong>Decentralized Discovery</strong>: Peer-to-peer discovery mechanism where
                    each pNode maintains knowledge of other active pNodes
                </li>
                <li>
                    <strong>Health Monitoring</strong>: pNodes report their status through timestamps,
                    version information, and availability metrics
                </li>
                <li>
                    <strong>No Central Authority</strong>: Nodes discover each other through seed nodes
                    and maintain a distributed registry
                </li>
                <li>
                    <strong>AI-Powered Insights</strong>: Ask questions about the network using natural language
                    with our integrated AI assistant
                </li>
            </ul>

            <h3>Dashboard Features</h3>
            <ul>
                <li>
                    <strong>Real-Time Analytics</strong>: Monitor network health, node versions, and performance metrics
                </li>
                <li>
                    <strong>Geographic Visualization</strong>: Interactive map showing global node distribution
                </li>
                <li>
                    <strong>Pod Credits Leaderboard</strong>: Track top-performing nodes based on uptime, RPC availability, and version compliance
                </li>
                <li>
                    <strong>Historical Charts</strong>: View trends over 1H, 4H, 7D, 30D, and 90D time ranges
                </li>
                <li>
                    <strong>Smart Sidebar Navigation</strong>: Quick access to all features with keyboard shortcuts
                </li>
            </ul>

            <h3>The XAND Token</h3>
            <p>
                XAND is the governance token for the Xandeum network. Token holders can participate
                in the project's Decentralized Autonomous Organization (DAO), influencing decisions
                related to the DAO's treasury, delegation strategy, and storage layer development.
            </p>
            <ul>
                <li><strong>Token Address</strong>: <code>XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx</code></li>
                <li><strong>Network</strong>: Solana Mainnet</li>
                <li><strong>Launch Date</strong>: October 29, 2024</li>
            </ul>

            <h2>Getting Started</h2>
            <p>
                Explore the documentation to learn more about running a pNode, understanding the
                network architecture, analyzing network metrics, or integrating with our API.
            </p>
        </article>
    );
}

function FeatureCard({
    icon: Icon,
    title,
    description,
    href
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    href: string;
}) {
    return (
        <Link
            href={href}
            prefetch={true}
            className="block p-6 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors group"
        >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </Link>
    );
}
