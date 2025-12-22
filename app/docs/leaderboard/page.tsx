export default function LeaderboardDocsPage() {
    return (
        <article className="prose dark:prose-invert max-w-none">
            <h1>Pod Credits & Leaderboard</h1>
            <p className="lead">
                Understanding the pod credits system and how nodes are ranked based on performance, uptime, and network contribution.
            </p>

            <h2>What are Pod Credits?</h2>
            <p>
                Pod Credits are a scoring system that evaluates pNodes based on multiple performance criteria. This system helps identify the most reliable and well-maintained nodes in the network.
            </p>

            <h2>Scoring Criteria</h2>
            <p>The pod credits score is calculated based on three main factors:</p>

            <h3>1. Uptime Score (40 points max)</h3>
            <p>
                Measures how recently the node has been seen online. The score decreases as time passes since the last update:
            </p>
            <ul>
                <li><strong>40 points</strong>: Last seen within 5 minutes (highly active)</li>
                <li><strong>30 points</strong>: Last seen within 15 minutes</li>
                <li><strong>20 points</strong>: Last seen within 1 hour</li>
                <li><strong>10 points</strong>: Last seen within 6 hours</li>
                <li><strong>0 points</strong>: Last seen more than 6 hours ago</li>
            </ul>

            <h3>2. RPC Availability (30 points max)</h3>
            <p>
                Awards points for nodes that provide public RPC endpoints, making the network more accessible:
            </p>
            <ul>
                <li><strong>30 points</strong>: Has a public RPC endpoint available</li>
                <li><strong>0 points</strong>: No public RPC endpoint</li>
            </ul>
            <p className="text-sm text-muted-foreground">
                Public RPC nodes are identified by having non-null <code>rpc</code> or <code>gossipRPC</code> values.
            </p>

            <h3>3. Version Compliance (30 points max)</h3>
            <p>
                Rewards nodes running the latest software version, ensuring network security and feature compatibility:
            </p>
            <ul>
                <li><strong>30 points</strong>: Running the latest version</li>
                <li><strong>0 points</strong>: Running an outdated version</li>
            </ul>

            <h2>Total Score Calculation</h2>
            <div className="not-prose p-6 rounded-lg bg-card border border-border my-6">
                <p className="text-sm font-mono mb-2">
                    <strong>Maximum Score:</strong> 100 points
                </p>
                <p className="text-sm font-mono">
                    Total Score = Uptime Score (40) + RPC Availability (30) + Version Compliance (30)
                </p>
            </div>

            <h2>Best Nodes</h2>
            <p>
                The "Best Nodes" are those with the highest pod credits scores. These nodes typically:
            </p>
            <ul>
                <li>Maintain 99%+ uptime</li>
                <li>Provide public RPC endpoints for the community</li>
                <li>Keep their software updated to the latest version</li>
                <li>Contribute to network stability and accessibility</li>
            </ul>

            <h2>Leaderboard Features</h2>
            <ul>
                <li><strong>Real-Time Rankings</strong>: Scores update automatically as node status changes</li>
                <li><strong>Search & Filter</strong>: Find specific nodes by identity or filter by criteria</li>
                <li><strong>Sortable Columns</strong>: Sort by pod credits, uptime, version, or RPC status</li>
                <li><strong>Performance Indicators</strong>: Visual badges show online status, RPC availability, and version compliance</li>
            </ul>

            <h2>Why Pod Credits Matter</h2>
            <p>
                Pod credits provide a transparent, objective measure of node quality. This helps:
            </p>
            <ul>
                <li><strong>Users</strong>: Identify reliable nodes for data storage and retrieval</li>
                <li><strong>Node Operators</strong>: Understand performance expectations and areas for improvement</li>
                <li><strong>Network Health</strong>: Encourage best practices and maintain high service standards</li>
                <li><strong>Future Rewards</strong>: May influence future token distribution or incentive programs</li>
            </ul>

            <h2>Improving Your Score</h2>
            <p>To maximize your pod credits:</p>
            <ol>
                <li><strong>Maintain High Uptime</strong>: Keep your node online and regularly reporting status</li>
                <li><strong>Enable Public RPC</strong>: Configure and advertise your RPC endpoint</li>
                <li><strong>Stay Updated</strong>: Regularly update to the latest pNode software version</li>
                <li><strong>Monitor Performance</strong>: Use the dashboard to track your node's status and score</li>
            </ol>

            <div className="not-prose mt-8 p-6 rounded-xl border border-primary/20 bg-primary/5">
                <p className="text-sm">
                    <strong>💡 Tip:</strong> Check the leaderboard daily to see how your node ranks and identify areas for improvement. Nodes in the top 10% receive special recognition on the dashboard.
                </p>
            </div>
        </article>
    );
}
