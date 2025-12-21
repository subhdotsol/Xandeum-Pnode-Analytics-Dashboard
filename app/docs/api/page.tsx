export default function ApiPage() {
    return (
        <article className="prose dark:prose-invert max-w-none">
            <h1>API Reference</h1>
            <p className="text-xl text-muted-foreground">
                REST API endpoints for integrating with Xandeum Analytics
            </p>

            <h2>Base URL</h2>
            <pre className="bg-muted rounded-lg p-4"><code>https://explorerxandeum.vercel.app/api</code></pre>

            <h2>Endpoints</h2>

            <h3>GET /pnodes</h3>
            <p>Get all pNodes in the network.</p>
            <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm">
                {`// Response
{
  "pnodes": [
    {
      "address": "173.212.207.32:9001",
      "pubkey": "EcTqXgB...",
      "version": "0.8.0",
      "last_seen_timestamp": 1766328515
    }
  ]
}`}
            </pre>

            <h3>GET /pnodes/[address]</h3>
            <p>Get detailed stats for a specific pNode.</p>
            <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm">
                {`// Response
{
  "success": true,
  "data": {
    "address": "173.212.207.32:9001",
    "stats": {
      "cpu_percent": 0.49,
      "ram_used": 735506432,
      "ram_total": 12541607936,
      "uptime": 558702,
      "file_size": 340000000000,
      "active_streams": 2
    },
    "health": {
      "status": "healthy",
      "color": "#22C55E"
    }
  }
}`}
            </pre>

            <h3>GET /analytics</h3>
            <p>Get network-wide analytics and health metrics.</p>
            <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm">
                {`// Response
{
  "totals": { "total": 245, "online": 180 },
  "health": {
    "healthy": 150,
    "degraded": 30,
    "offline": 65,
    "score": 85
  },
  "versions": {
    "latest": "0.8.0",
    "distribution": { "0.8.0": 200, "0.7.3": 45 }
  }
}`}
            </pre>

            <h3>GET /stats</h3>
            <p>Get aggregate statistics from seed nodes.</p>
            <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm">
                {`// Response
{
  "totalStorage": 2800000000000,
  "totalRam": 100000000000,
  "avgCpu": 2.5,
  "avgUptime": 500000,
  "totalPackets": 293960000,
  "totalStreams": 45
}`}
            </pre>

            <h3>GET /geo</h3>
            <p>Get geo-location for an IP address.</p>
            <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm">
                {`// GET /geo?ip=173.212.207.32
// Response
{
  "country": "Germany",
  "city": "Nuremberg",
  "lat": 49.4478,
  "lon": 11.0683,
  "timezone": "Europe/Berlin"
}`}
            </pre>

            <h3>GET /historical</h3>
            <p>Get historical snapshots for analytics charts.</p>
            <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm">
                {`// GET /historical?range=24h
// Response
{
  "success": true,
  "data": [
    {
      "timestamp": "2024-12-21T10:00:00Z",
      "total_nodes": 245,
      "online_nodes": 180,
      "avg_cpu": 2.5,
      "total_storage": 2800000000000
    }
  ]
}`}
            </pre>

            <h2>Rate Limits</h2>
            <p>
                API endpoints are rate-limited to ensure fair usage. Current limits:
            </p>
            <ul>
                <li><strong>Public endpoints</strong>: 100 requests/minute</li>
                <li><strong>Geo endpoint</strong>: 45 requests/minute (ip-api.com limit)</li>
            </ul>

            <h2>Error Responses</h2>
            <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm">
                {`// 404 Not Found
{ "success": false, "error": "Node not found or unavailable" }

// 500 Server Error
{ "error": "Internal server error" }`}
            </pre>
        </article>
    );
}
