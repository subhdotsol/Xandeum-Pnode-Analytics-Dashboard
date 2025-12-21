export default function ArchitecturePage() {
    return (
        <article className="prose dark:prose-invert max-w-none">
            <h1>Architecture</h1>
            <p className="text-xl text-muted-foreground">
                How Xandeum's distributed storage layer is built
            </p>

            <h2>System Overview</h2>
            <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm">
                {`┌─────────────────────────────────────────────────────────────┐
│                    XANDEUM NETWORK                          │
│              pNodes emit heartbeats via gossip              │
└──────────────────────────┬──────────────────────────────────┘
                           │
              ┌────────────▼────────────┐
              │     SEED NODES (9)      │
              │                         │
              │  • 173.212.203.145      │
              │  • 173.212.220.65       │
              │  • 161.97.97.41         │
              │  • ... and more         │
              └────────────┬────────────┘
                           │
              ┌────────────▼────────────┐
              │   ANALYTICS DASHBOARD   │
              │      (Next.js 15)       │
              │                         │
              │  • Real-time charts     │
              │  • Interactive map      │
              │  • Node leaderboard     │
              │  • Historical data      │
              └─────────────────────────┘`}
            </pre>

            <h2>Data Flow</h2>
            <ol>
                <li><strong>Node Discovery</strong>: Query 9 seed pNodes via JSON-RPC (<code>get-pods</code>)</li>
                <li><strong>Deduplication</strong>: Merge results, keeping latest timestamps</li>
                <li><strong>Stats Aggregation</strong>: Parallel fetch from reliable seed nodes</li>
                <li><strong>Geo-location</strong>: Batch lookup via ip-api.com with caching</li>
                <li><strong>Historical</strong>: Cron job saves snapshots every 5 minutes to Supabase</li>
            </ol>

            <h2 id="performance">Performance Monitoring</h2>
            <p>
                The dashboard monitors network health using a scoring algorithm:
            </p>
            <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm">
                {`score = (healthy_nodes% × 60) + (up_to_date_versions% × 30) + (degraded_nodes% × 10)`}
            </pre>

            <h2>Technology Stack</h2>
            <table>
                <thead>
                    <tr>
                        <th>Component</th>
                        <th>Technology</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Framework</td><td>Next.js 15 (App Router)</td></tr>
                    <tr><td>Language</td><td>TypeScript 5.0</td></tr>
                    <tr><td>Styling</td><td>TailwindCSS 4.0</td></tr>
                    <tr><td>Database</td><td>Supabase (PostgreSQL)</td></tr>
                    <tr><td>Charts</td><td>Recharts</td></tr>
                    <tr><td>Maps</td><td>Leaflet + react-leaflet</td></tr>
                    <tr><td>AI</td><td>Google Gemini</td></tr>
                </tbody>
            </table>

            <h2>Network Topology</h2>
            <p>
                Xandeum uses a decentralized peer-to-peer topology:
            </p>
            <ul>
                <li><strong>No Single Point of Failure</strong>: Data is replicated across multiple nodes</li>
                <li><strong>Gossip Protocol</strong>: Nodes share information about peers</li>
                <li><strong>Seed Nodes</strong>: Bootstrap nodes help new peers discover the network</li>
                <li><strong>Dynamic Scaling</strong>: Network grows as new pNodes join</li>
            </ul>
        </article>
    );
}
