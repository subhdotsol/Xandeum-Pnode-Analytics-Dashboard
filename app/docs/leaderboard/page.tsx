export default function LeaderboardDocsPage() {
    return (
        <article>
            <h1>Pod Credits (Leaderboard)</h1>
            <p>
                The Leaderboard ranks pNodes based on their performance metrics, helping
                identify the most reliable and high-performing nodes in the network.
            </p>

            <h2>Ranking Categories</h2>

            <h3>Overall Score</h3>
            <p>
                A weighted composite score based on:
            </p>
            <ul>
                <li><strong>40%</strong> - Uptime (longer running = better)</li>
                <li><strong>30%</strong> - CPU Efficiency (lower usage = better)</li>
                <li><strong>30%</strong> - Storage Contribution (more storage = better)</li>
            </ul>

            <h3>Uptime Leaders</h3>
            <p>
                Nodes ranked by their continuous uptime. Measures reliability and stability
                of the node operator.
            </p>

            <h3>CPU Efficiency</h3>
            <p>
                Nodes using the least CPU resources while still serving data. Indicates
                efficient hardware and optimized configurations.
            </p>

            <h3>Storage Champions</h3>
            <p>
                Nodes contributing the most storage capacity to the network. These nodes
                are critical for network scale.
            </p>

            <h2>Podium Display</h2>
            <p>
                The top 3 nodes in each category are displayed on a podium with:
            </p>
            <ul>
                <li>🥇 <strong>Gold</strong> - 1st place</li>
                <li>🥈 <strong>Silver</strong> - 2nd place</li>
                <li>🥉 <strong>Bronze</strong> - 3rd place</li>
            </ul>

            <h2>Full Rankings</h2>
            <p>
                Below the podium, you can view the top 25 nodes with detailed statistics
                including address, version, CPU, RAM, storage, and uptime.
            </p>
        </article>
    );
}
