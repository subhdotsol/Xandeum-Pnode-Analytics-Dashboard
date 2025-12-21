export default function AnalyticsDocsPage() {
    return (
        <article>
            <h1>Analytics Dashboard</h1>
            <p>
                The Analytics tab provides historical insights into the Xandeum network's
                performance over time with interactive charts and visualizations.
            </p>

            <h2>Available Charts</h2>

            <h3>Node Population</h3>
            <p>
                Track the total number of nodes in the network over time. This gradient area
                chart shows network growth and helps identify trends.
            </p>

            <h3>Availability Rate</h3>
            <p>
                Monitor the percentage of nodes that are online at any given time. A healthy
                network maintains high availability (80%+).
            </p>

            <h3>Resource Utilization</h3>
            <p>
                Two dotted lines showing average CPU and RAM usage across all nodes. Helps
                identify if the network is under-utilized or stressed.
            </p>

            <h3>Storage Capacity</h3>
            <p>
                Aggregate storage provided by all pNodes. Shows network capacity growth over time.
            </p>

            <h3>Geographic Spread</h3>
            <p>
                Track the number of countries and version diversity across the network.
            </p>

            <h2>Time Range Filters</h2>
            <ul>
                <li><strong>1H</strong> - Last hour (12 data points)</li>
                <li><strong>4H</strong> - Last 4 hours (48 data points)</li>
                <li><strong>12H</strong> - Last 12 hours (144 data points)</li>
                <li><strong>24H</strong> - Last 24 hours (288 data points)</li>
                <li><strong>7D</strong> - Last 7 days (2,016 data points)</li>
                <li><strong>30D</strong> - Last 30 days</li>
                <li><strong>All</strong> - All available data</li>
            </ul>

            <h2>Data Collection</h2>
            <p>
                Snapshots are collected every <strong>5 minutes</strong> via an automated cron job.
                Data is stored in Supabase with a 7-day retention policy for granular data.
            </p>
        </article>
    );
}
