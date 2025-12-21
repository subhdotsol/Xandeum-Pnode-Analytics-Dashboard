export default function MapDocsPage() {
    return (
        <article>
            <h1>Global Map</h1>
            <p>
                The interactive map visualizes the geographic distribution of pNodes
                around the world, showing where storage capacity is located.
            </p>

            <h2>Features</h2>

            <h3>Node Markers</h3>
            <p>
                Each pNode is represented by a marker on the map. Markers are color-coded
                based on node health status:
            </p>
            <ul>
                <li>🟢 <strong>Green</strong> - Healthy node (online)</li>
                <li>🟡 <strong>Yellow</strong> - Degraded (recently offline)</li>
                <li>🔴 <strong>Red</strong> - Offline (down for 1+ hour)</li>
            </ul>

            <h3>Click for Details</h3>
            <p>
                Click any marker to view node details including:
            </p>
            <ul>
                <li>IP address and port</li>
                <li>City and country location</li>
                <li>Node version</li>
                <li>Last seen timestamp</li>
            </ul>

            <h3>Progressive Loading</h3>
            <p>
                The map loads nodes in batches to ensure smooth performance. A progress
                indicator shows how many nodes have been geolocated.
            </p>

            <h2>Geo-location</h2>
            <p>
                Node locations are determined by IP address lookup. The geo-location
                service provides:
            </p>
            <ul>
                <li>City-level accuracy</li>
                <li>Country identification</li>
                <li>Latitude/longitude coordinates</li>
                <li>Timezone information</li>
            </ul>

            <h2>Global Distribution</h2>
            <p>
                The map helps identify network decentralization - a healthy network
                should have nodes distributed across multiple countries and continents.
            </p>
        </article>
    );
}
