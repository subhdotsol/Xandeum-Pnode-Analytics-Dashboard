export default function PNodesPage() {
    return (
        <article className="prose dark:prose-invert max-w-none">
            <h1>pNodes (Persistent Nodes)</h1>
            <p className="text-xl text-muted-foreground">
                Understanding the backbone of the Xandeum storage network
            </p>

            <h2>What are pNodes?</h2>
            <p>
                pNodes (Persistent Nodes) are the fundamental building blocks of the Xandeum
                distributed storage network. Each pNode is an individual server that participates
                in storing and serving data chunks across the network.
            </p>

            <h2>pNode Responsibilities</h2>
            <ul>
                <li><strong>Data Storage</strong>: Store encrypted data chunks assigned by the network</li>
                <li><strong>Data Retrieval</strong>: Serve requested data to authorized clients</li>
                <li><strong>Peer Discovery</strong>: Maintain connections with other pNodes</li>
                <li><strong>Health Reporting</strong>: Broadcast status and availability metrics</li>
            </ul>

            <h2>Health Classification</h2>
            <p>
                pNodes are classified based on their last seen timestamp:
            </p>
            <table>
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Condition</th>
                        <th>Color</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Healthy</td>
                        <td>Last seen &lt; 5 minutes ago</td>
                        <td>🟢 Green</td>
                    </tr>
                    <tr>
                        <td>Degraded</td>
                        <td>Last seen &lt; 1 hour ago</td>
                        <td>🟡 Yellow</td>
                    </tr>
                    <tr>
                        <td>Offline</td>
                        <td>Last seen &gt; 1 hour ago</td>
                        <td>🔴 Red</td>
                    </tr>
                </tbody>
            </table>

            <h2>pNode Statistics</h2>
            <p>
                Each pNode reports the following metrics:
            </p>
            <ul>
                <li><strong>CPU Percent</strong>: Current CPU utilization</li>
                <li><strong>RAM Usage</strong>: Memory consumption (used/total)</li>
                <li><strong>Storage</strong>: Total file size being stored</li>
                <li><strong>Uptime</strong>: Time since last restart</li>
                <li><strong>Active Streams</strong>: Number of concurrent connections</li>
                <li><strong>Packets</strong>: Sent and received packet counts</li>
            </ul>

            <h2>Running a pNode</h2>
            <p>
                To run your own pNode, you'll need:
            </p>
            <ol>
                <li>A server with stable internet connection</li>
                <li>Minimum 8GB RAM and 100GB storage</li>
                <li>The Xandeum pNode software</li>
                <li>Configuration for network access</li>
            </ol>
            <p>
                For detailed setup instructions, visit the
                <a href="https://xandeum.network" target="_blank" rel="noopener noreferrer"> official Xandeum website</a>.
            </p>
        </article>
    );
}
