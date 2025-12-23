import { NextRequest, NextResponse } from "next/server";
import { pnodeClient } from "@/lib/pnode-client";
import { analyzeNetwork } from "@/lib/network-analytics";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// Helper functions for assessments
function getUptimeRating(minutesAgo: number): { score: number; label: string; emoji: string } {
  if (minutesAgo < 5) return { score: 100, label: "Excellent", emoji: "🟢" };
  if (minutesAgo < 15) return { score: 80, label: "Very Good", emoji: "🟢" };
  if (minutesAgo < 60) return { score: 60, label: "Good", emoji: "🟡" };
  if (minutesAgo < 360) return { score: 30, label: "Degraded", emoji: "🟠" };
  return { score: 0, label: "Offline", emoji: "🔴" };
}

function getVersionAssessment(isLatest: boolean): string {
  return isLatest ? "Running latest version - optimal performance" : "Outdated version - should upgrade for best performance";
}

function getRpcAssessment(hasRpc: boolean): string {
  return hasRpc ? "RPC enabled - full network participation" : "RPC disabled - limited network participation";
}

export async function POST(req: NextRequest) {
  try {
    const { nodes } = await req.json();
    
    if (!nodes || !Array.isArray(nodes) || nodes.length < 2) {
      return NextResponse.json({ error: "At least 2 nodes required for comparison" }, { status: 400 });
    }
    
    if (nodes.length > 5) {
      return NextResponse.json({ error: "Maximum 5 nodes can be compared at once" }, { status: 400 });
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
    }
    
    // Fetch all pNodes to get latest version and network context
    const allPnodes = await pnodeClient.getAllPNodes();
    const analytics = analyzeNetwork(allPnodes);
    
    // Calculate network averages for comparison
    const now = Math.floor(Date.now() / 1000);
    const networkStats = {
      avgUptime: 0,
      nodesOnLatest: 0,
      rpcEnabled: 0,
      totalActive: 0
    };
    
    allPnodes.forEach((n: any) => {
      const mins = (now - n.last_seen_timestamp) / 60;
      if (mins < 60) {
        networkStats.totalActive++;
        networkStats.avgUptime += mins < 5 ? 100 : mins < 15 ? 80 : 60;
      }
      if (n.version === analytics.versions.latest) networkStats.nodesOnLatest++;
      if (n.rpc || n.gossip_rpc) networkStats.rpcEnabled++;
    });
    networkStats.avgUptime = networkStats.totalActive > 0 ? networkStats.avgUptime / networkStats.totalActive : 0;
    
    // Find the nodes and calculate their detailed metrics
    const nodesData = nodes.map((nodeQuery: { address?: string; pubkey?: string }, index: number) => {
      const node = allPnodes.find((n: any) =>
        n.address === nodeQuery.address || n.pubkey === nodeQuery.pubkey
      ) as any;
      
      if (!node) return null;
      
      // Calculate detailed metrics
      const minutesAgo = (now - node.last_seen_timestamp) / 60;
      const uptimeRating = getUptimeRating(minutesAgo);
      const hasRpc = !!(node.rpc || node.gossip_rpc);
      const isLatestVersion = node.version === analytics.versions.latest;
      
      // Pod credits breakdown
      const uptimeScore = minutesAgo < 5 ? 40 : minutesAgo < 15 ? 30 : minutesAgo < 60 ? 20 : minutesAgo < 360 ? 10 : 0;
      const rpcScore = hasRpc ? 30 : 0;
      const versionScore = isLatestVersion ? 30 : 0;
      const totalCredits = uptimeScore + rpcScore + versionScore;
      
      const lastSeenText = minutesAgo < 1 ? "Just now" : 
                           minutesAgo < 60 ? `${Math.floor(minutesAgo)} minutes ago` :
                           `${Math.floor(minutesAgo / 60)} hours ago`;
      
      return {
        nodeNumber: index + 1,
        pubkey: node.pubkey,
        pubkeyShort: node.pubkey?.slice(0, 16) + "...",
        address: node.address,
        version: node.version,
        status: uptimeRating.label,
        statusEmoji: uptimeRating.emoji,
        lastSeen: lastSeenText,
        minutesAgo,
        hasRpc,
        isLatestVersion,
        podCredits: {
          total: totalCredits,
          uptime: uptimeScore,
          rpc: rpcScore,
          version: versionScore
        },
        assessments: {
          uptime: uptimeRating,
          version: getVersionAssessment(isLatestVersion),
          rpc: getRpcAssessment(hasRpc)
        }
      };
    }).filter(Boolean);
    
    if (nodesData.length < 2) {
      return NextResponse.json({ error: "Could not find enough valid nodes" }, { status: 404 });
    }
    
    // Build comprehensive comparison data for AI
    const nodesDescription = nodesData.map((node: any) => 
      `NODE ${node.nodeNumber} (${node.pubkeyShort}):
• Address: ${node.address}
• Status: ${node.statusEmoji} ${node.status} (last seen: ${node.lastSeen})
• Version: ${node.version} ${node.isLatestVersion ? "(✓ Latest)" : "(⚠️ Outdated)"}
• RPC: ${node.hasRpc ? "Enabled ✓" : "Disabled ✗"}
• Pod Credits: ${node.podCredits.total}/100
  - Uptime Score: ${node.podCredits.uptime}/40
  - RPC Score: ${node.podCredits.rpc}/30  
  - Version Score: ${node.podCredits.version}/30
• Uptime Assessment: ${node.assessments.uptime.label}
• Version Assessment: ${node.assessments.version}
• RPC Assessment: ${node.assessments.rpc}`
    ).join("\n\n");
    
    // Find winner - safe since we verified nodesData.length >= 2 above
    const sortedNodes = [...nodesData].sort((a: any, b: any) => b.podCredits.total - a.podCredits.total) as any[];
    const winner = sortedNodes[0]!;
    const loser = sortedNodes[sortedNodes.length - 1]!;
    const isTie = winner.podCredits.total === loser.podCredits.total;

    const prompt = `You are an expert Xandeum pNode network analyst. Provide a comprehensive comparison of these ${nodesData.length} pNodes with actionable insights.

${nodesDescription}

NETWORK CONTEXT:
• Latest pNode Version: ${analytics.versions.latest}
• Network Health Score: ${analytics.health.score}/100
• Total Active Nodes: ${analytics.totals.healthy}/${analytics.totals.total}
• Network Average Performance: ${networkStats.avgUptime.toFixed(0)}%
• Nodes on Latest Version: ${networkStats.nodesOnLatest}/${analytics.totals.total} (${((networkStats.nodesOnLatest/analytics.totals.total)*100).toFixed(1)}%)
• RPC-Enabled Nodes: ${networkStats.rpcEnabled}/${analytics.totals.total}

WINNER: ${isTie ? "TIE" : `Node ${winner.nodeNumber} (${winner.pubkeyShort}) with ${winner.podCredits.total}/100 Pod Credits`}

Provide analysis in this EXACT format. DO NOT use any markdown formatting like ** or __ or #. Use plain text only with numbered lists (1. 2. 3.) or bullet points (•).

🏆 WINNER ANNOUNCEMENT
State which node wins and by how many points, or if it's a tie.

📊 PERFORMANCE OVERVIEW
For each node, give a 1-2 sentence performance summary:
1. Node 1: [summary and rating]
2. Node 2: [summary and rating]

⚖️ KEY DIFFERENCES
List the most important differences:
1. [First difference]
2. [Second difference]
3. [Third difference]

💪 STRENGTHS & WEAKNESSES
Node 1:
• Strengths: [list]
• Weaknesses: [list]

Node 2:
• Strengths: [list]
• Weaknesses: [list]

🎯 RECOMMENDATIONS
For underperforming nodes:
1. [First recommendation]
2. [Second recommendation]
3. [Third recommendation]

🔮 VERDICT
A 2-3 sentence final verdict on which node is better.

IMPORTANT: Do NOT use ** or __ for bold/italic. Use PLAIN TEXT only. Use numbered lists (1. 2. 3.) and bullet points (•).`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1500 }
      }),
    });
    
    const data = await response.json();
    let analysis = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!analysis) {
      return NextResponse.json({ error: "Failed to generate analysis" }, { status: 500 });
    }
    
    // Post-process to remove any remaining markdown
    analysis = analysis
      .replace(/\*\*/g, '')  // Remove **
      .replace(/__/g, '')     // Remove __
      .replace(/\*/g, '')     // Remove single *
      .replace(/_/g, ' ')     // Replace _ with space
      .replace(/#{1,6}\s/g, '') // Remove # headers
    
    return NextResponse.json({
      success: true,
      nodes: nodesData,
      analysis,
      winner: isTie ? null : {
        nodeNumber: winner.nodeNumber,
        pubkey: winner.pubkey,
        podCredits: winner.podCredits.total
      },
      metadata: {
        comparedAt: new Date().toISOString(),
        latestVersion: analytics.versions.latest,
        networkHealth: analytics.health.score,
        networkAvgPerformance: networkStats.avgUptime
      }
    });
  } catch (error) {
    console.error("[AI Compare] Error:", error);
    return NextResponse.json({ error: "Failed to compare nodes" }, { status: 500 });
  }
}
