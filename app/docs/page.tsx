import { Server, Layers, Zap, Shield, Globe, Database } from "lucide-react";

export default function DocsPage() {
    return (
        <article className="prose dark:prose-invert max-w-none">
            <h1 className="text-4xl font-bold mb-2">Xandeum Documentation</h1>
            <p className="text-xl text-muted-foreground mb-8">
                Everything you need to understand the Xandeum distributed storage network
            </p>

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
                    icon={Zap}
                    title="Performance"
                    description="Explore network health and monitoring"
                    href="/docs/architecture#performance"
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
                network architecture, or integrating with our API.
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
        <a
            href={href}
            className="block p-6 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors group"
        >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </a>
    );
}
