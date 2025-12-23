import { NextResponse } from "next/server";
import { pnodeClient } from "@/lib/pnode-client";
import { analyzeNetwork } from "@/lib/network-analytics";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function GET() {
  try {
    // Fetch all pNodes and analyze network
    const allPnodes = await pnodeClient.getAllPNodes();
    const analytics = analyzeNetwork(allPnodes);

    // Calculate key metrics
    const now = Math.floor(Date.now() / 1000);
    let recentlyActiveCount = 0;

    for (const node of allPnodes) {
      const lastSeen = typeof node.last_seen === 'number' ? node.last_seen : 0;
      const lastSeenAgo = now - lastSeen;
      const minutesAgo = lastSeenAgo / 60;
      if (minutesAgo < 60) recentlyActiveCount++;
    }

    const latestVersion = analytics.versions.latest;
    const nodesOnLatest = analytics.versions.distribution[latestVersion] || 0;
    const outdatedNodes = allPnodes.length - nodesOnLatest;

    // Count nodes by health status
    const healthyNodes = analytics.health.healthy;
    const degradedNodes = analytics.health.degraded;
    const offlineNodes = analytics.health.offline;

    // Prepare metrics
    const metrics = {
      totalNodes: analytics.totals.total,
      healthyNodes,
      degradedNodes,
      offlineNodes,
      healthScore: analytics.health.score,
      latestVersion,
      nodesOnLatest,
      outdatedNodes,
      avgUptime: "0"
    };

    // Try AI summary, but fallback to generated one if it fails
    const apiKey = process.env.GEMINI_API_KEY;
    let summary: string;

    if (apiKey) {
      try {
        // Build network context for AI
        const networkContext = `
XANDEUM pNODE NETWORK STATUS:
Total Nodes: ${analytics.totals.total}
Healthy: ${healthyNodes} (${((healthyNodes / analytics.totals.total) * 100).toFixed(1)}%)
Degraded: ${degradedNodes}
Offline: ${offlineNodes}
Health Score: ${analytics.health.score}/100
Latest Version: ${latestVersion}
On Latest: ${nodesOnLatest}/${analytics.totals.total}
Outdated: ${outdatedNodes}
Recently Active: ${recentlyActiveCount}/${analytics.totals.total}`;

        const prompt = `You are a network analyst. Generate a 2-3 sentence summary of this pNode network status. Be concise and professional. No markdown formatting.

${networkContext}`;

        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 150 }
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const aiSummary = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiSummary) {
            summary = aiSummary.replace(/\*\*/g, '').replace(/__/g, '').replace(/\*/g, '').trim();
          } else {
            throw new Error("No AI response");
          }
        } else {
          throw new Error(`API error: ${response.status}`);
        }
      } catch {
        // Fallback to generated summary
        summary = generateFallbackSummary(metrics);
      }
    } else {
      summary = generateFallbackSummary(metrics);
    }

    return NextResponse.json({
      success: true,
      summary,
      metrics,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error("Network summary error:", error);
    return NextResponse.json(
      { error: "Failed to generate network summary" },
      { status: 500 }
    );
  }
}

function generateFallbackSummary(metrics: {
  totalNodes: number;
  healthyNodes: number;
  offlineNodes: number;
  healthScore: number;
  outdatedNodes: number;
}): string {
  const healthStatus = metrics.healthScore >= 80 ? "excellent" : metrics.healthScore >= 60 ? "good" : "concerning";
  const healthyPercent = ((metrics.healthyNodes / metrics.totalNodes) * 100).toFixed(0);
  
  let summary = `Network health is ${healthStatus} with ${healthyPercent}% of ${metrics.totalNodes} nodes healthy.`;
  
  if (metrics.outdatedNodes > 0) {
    summary += ` ${metrics.outdatedNodes} node${metrics.outdatedNodes > 1 ? 's' : ''} running outdated versions.`;
  }
  
  if (metrics.offlineNodes > 0) {
    summary += ` ${metrics.offlineNodes} node${metrics.offlineNodes > 1 ? 's' : ''} currently offline.`;
  }
  
  return summary;
}
