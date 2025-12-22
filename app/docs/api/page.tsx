"use client";

import { motion } from "framer-motion";
import { CodeBlock } from "@/components/ui/code-block";

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

const endpoints = [
  {
    method: "GET",
    path: "/pnodes",
    description: "Get all pNodes in the network.",
    response: `{
  "pnodes": [
    {
      "address": "173.212.207.32:9001",
      "pubkey": "EcTqXgB...",
      "version": "0.8.0",
      "last_seen_timestamp": 1766328515
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/pnodes/[address]",
    description: "Get detailed stats for a specific pNode.",
    response: `{
  "success": true,
  "data": {
    "address": "173.212.207.32:9001",
    "stats": {
      "cpu_percent": 0.49,
      "ram_used": 735506432,
      "ram_total": 12541607936,
      "uptime": 558702
    },
    "health": {
      "status": "healthy",
      "color": "#22C55E"
    }
  }
}`,
  },
  {
    method: "GET",
    path: "/analytics",
    description: "Get network-wide analytics and health metrics.",
    response: `{
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
}`,
  },
  {
    method: "GET",
    path: "/historical?range=24h",
    description: "Get historical snapshots for analytics charts.",
    response: `{
  "success": true,
  "data": [
    {
      "timestamp": 1766328515,
      "total_nodes": 245,
      "online_nodes": 180,
      "avg_cpu": 2.5,
      "total_storage": 2800000000000
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/geo?ip=173.212.207.32",
    description: "Get geo-location for an IP address.",
    response: `{
  "country": "Germany",
  "city": "Nuremberg",
  "lat": 49.4478,
  "lon": 11.0683,
  "timezone": "Europe/Berlin"
}`,
  },
];

const rateLimits = [
  { endpoint: "Public endpoints", limit: "100 requests/minute" },
  { endpoint: "Geo endpoint", limit: "45 requests/minute" },
];

export default function ApiPage() {
  return (
    <motion.article {...fadeIn}>
      <header className="mb-8 border-b border-border pb-4">
        <h1 className="text-2xl font-bold tracking-tight mb-2">API Reference</h1>
        <p className="text-muted-foreground">
          REST API endpoints for integrating with Xandeum Analytics.
        </p>
      </header>

      <motion.section
        className="mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <h2 className="text-lg font-semibold mb-4">Base URL</h2>
        <CodeBlock
          code="https://explorerxandeum.vercel.app/api"
          filename="Base URL"
        />
      </motion.section>

      <motion.section
        className="mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <h2 className="text-lg font-semibold mb-4">Endpoints</h2>
        <div className="space-y-6">
          {endpoints.map((endpoint, idx) => (
            <motion.div
              key={endpoint.path}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.05 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-mono rounded">
                  {endpoint.method}
                </span>
                <code className="text-sm">{endpoint.path}</code>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{endpoint.description}</p>
              <CodeBlock
                code={endpoint.response}
                language="json"
                filename="Response"
              />
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <h2 className="text-lg font-semibold mb-4">Rate Limits</h2>
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Endpoint</th>
                <th className="text-left p-3 font-medium">Limit</th>
              </tr>
            </thead>
            <tbody>
              {rateLimits.map((limit) => (
                <tr key={limit.endpoint} className="border-t border-border">
                  <td className="p-3">{limit.endpoint}</td>
                  <td className="p-3 text-muted-foreground">{limit.limit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.3 }}
      >
        <h2 className="text-lg font-semibold mb-4">Error Responses</h2>
        <CodeBlock
          code={`// 404 Not Found
{ "success": false, "error": "Node not found or unavailable" }

// 500 Server Error
{ "error": "Internal server error" }`}
          language="json"
          filename="Errors"
        />
      </motion.section>
    </motion.article>
  );
}
