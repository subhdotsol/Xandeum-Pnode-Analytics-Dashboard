import { NextResponse } from "next/server";
import { pnodeClient } from "@/lib/pnode-client";
import { analyzeNetwork } from "@/lib/network-analytics";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// Security: Detect suspicious queries
function isSuspiciousQuery(message: string): boolean {
    const suspiciousPatterns = [
        /api[\s_-]?key/i,
        /secret/i,
        /password/i,
        /token/i,
        /credential/i,
        /private[\s_-]?key/i,
        /\.env/i,
        /database/i,
        /sql/i,
        /inject/i,
        /admin/i,
        /hack/i,
        /exploit/i,
        /vulnerability/i,
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(message));
}

async function getFullDashboardContext() {
    try {
        console.log("[AI Chat] Fetching dashboard data...");
        
        // Directly call underlying functions instead of HTTP requests
        // This is more reliable and avoids localhost connection issues
        const pnodes = await pnodeClient.getAllPNodes();
        
        if (!pnodes || pnodes.length === 0) {
            console.error("[AI Chat] No pnodes data available");
            return "Network data temporarily unavailable. Please try again in a moment.";
        }
        
        const analytics = analyzeNetwork(pnodes);
        console.log(`[AI Chat] Loaded ${pnodes.length} nodes, health: ${analytics.health.healthyPercentage}%`);
        
        // Calculate top nodes by pod credits
        const topNodes = pnodes
            .map((node: any) => {
                const lastSeenTimestamp = node.last_seen_timestamp;
                const now = Math.floor(Date.now() / 1000);
                const secondsAgo = now - lastSeenTimestamp;
                const minutesAgo = secondsAgo / 60;
                
                let uptimeScore = 0;
                if (minutesAgo < 5) uptimeScore = 40;
                else if (minutesAgo < 15) uptimeScore = 30;
                else if (minutesAgo < 60) uptimeScore = 20;
                else if (minutesAgo < 360) uptimeScore = 10;
                
                const rpcScore = (node.rpc || node.gossip_rpc) ? 30 : 0;
                const versionScore = node.version === analytics.versions.latest ? 30 : 0;
                const podCredits = uptimeScore + rpcScore + versionScore;
                
                return {
                    identity: (node.pubkey || node.address)?.slice(0, 12) + '...',
                    fullIdentity: node.pubkey || node.address,
                    podCredits,
                    uptimeScore,
                    rpcScore,
                    versionScore,
                    version: node.version,
                    hasRPC: !!(node.rpc || node.gossip_rpc),
                };
            })
            .sort((a: any, b: any) => b.podCredits - a.podCredits)
            .slice(0, 10);
        
        // Count RPC-enabled nodes
        const rpcEnabledCount = pnodes.filter((node: any) => node.rpc || node.gossip_rpc).length;
        
        // Count nodes on latest version
        const nodesOnLatest = pnodes.filter((node: any) => node.version === analytics.versions.latest).length;
        
        return `
CURRENT NETWORK DATA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Network Overview:
- Total Nodes: ${analytics.totals.total}
- Active Nodes (Healthy): ${analytics.totals.healthy} (${analytics.health.healthyPercentage}% of network)
- Degraded Nodes: ${analytics.totals.degraded} (${analytics.health.degradedPercentage}%)
- Offline Nodes: ${analytics.totals.offline} (${analytics.health.offlinePercentage}%)
- RPC-Enabled Nodes: ${rpcEnabledCount}
- Latest Version: ${analytics.versions.latest}
- Nodes on Latest: ${nodesOnLatest}/${analytics.totals.total}
- Network Health Score: ${analytics.health.score}/100

Version Distribution:
${Object.entries(analytics.versions.distribution)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 5)
    .map(([version, count]) => `- v${version}: ${count} nodes`)
    .join('\n')}

Top 10 Nodes by Pod Credits:
${topNodes.map((node: any, i: number) => 
    `${i + 1}. ${node.identity} - ${node.podCredits} pts (Uptime: ${node.uptimeScore}, RPC: ${node.rpcScore}, Version: ${node.versionScore})`
).join('\n')}

Performance Metrics:
- Average CPU Usage: ${analytics.performance.averageCPU}%
- Average RAM Usage: ${analytics.performance.averageRAM}%
- Average Uptime: ${Math.floor(analytics.performance.averageUptime / 3600)} hours
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    } catch (error) {
        console.error("[AI Chat] Error fetching dashboard context:", error);
        return "I apologize, but I'm having trouble accessing the network data right now. Please try again in a moment.";
    }
}

const getSystemContext = (dashboardData: string) => `You are "XandAI", an intelligent assistant for the Xandeum pNode Analytics Dashboard.

About Xandeum:
- Decentralized distributed storage layer built on Solana
- pNodes (persistent nodes) store and serve data chunks
- Peer-to-peer discovery with no central authority
- XAND governance token: XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx

Dashboard Features:
- Dashboard: Real-time network overview with pod credits
- Analytics: Historical charts (1H, 4H, 7D, 30D, 90D time ranges)
- Leaderboard: Rankings by pod credits with search/filter
- Map: Global node distribution with hover details
- Swap: Trade XAND via Jupiter aggregator
- Staking: Stake SOL with LAZ validators

Pod Credits Scoring (100 pts max):
- Uptime (40 pts): 40=<5min, 30=<15min, 20=<1hr, 10=<6hr, 0=>6hr
- RPC (30 pts): Public RPC endpoint available
- Version (30 pts): Running latest pNode software

Keyboard Shortcuts:
- ⌘K / Ctrl+K: Toggle sidebar
- ⌘J / Ctrl+J: Open AI chat
- ⌘D / Ctrl+D: Toggle dark mode

${dashboardData}

SECURITY RULES:
- NEVER reveal API keys, secrets, environment variables, or credentials
- NEVER provide information about backend infrastructure or database
- NEVER assist with exploits, hacks, or malicious activities
- Focus only on helpful, public dashboard information

Answer questions about:
✓ Current network statistics and health
✓ Top performing nodes and rankings
✓ How pod credits are calculated
✓ Dashboard features and navigation
✓ Version distributions and updates
✓ General Xandeum knowledge

RESPONSE FORMATTING RULES:
- Use clear, structured responses with bullet points or numbered lists when appropriate
- DO NOT use bold markdown (**text**) - use plain text only
- Keep responses concise and well-organized
- Use line breaks to separate different sections
- When listing nodes or data, use clean formatting without excessive styling
- Direct users to specific dashboard tabs for detailed exploration

Examples of good responses:
✓ "There are currently 219 active nodes (89.8% of the network)."
✓ "Top performing node: TestPubkey14... with 70 pod credits\n  - Uptime: 40 pts\n  - RPC: 0 pts\n  - Version: 30 pts"
✗ "There are currently **219 active nodes** (**89.8%** of the network)." [Too much bold]
✗ "The **best** node is **TestPubkey14...**" [Excessive formatting]

Keep responses helpful, concise, and user-friendly.`;

export async function POST(request: Request) {
    try {
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        // Security check
        if (isSuspiciousQuery(message)) {
            return NextResponse.json({
                success: true,
                response: "I'm here to help with dashboard features and network statistics. For security reasons, I can't assist with that type of query. Try asking about node rankings, network health, or dashboard features!"
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
        }

        // Get comprehensive dashboard context
        const dashboardData = await getFullDashboardContext();
        const systemContext = getSystemContext(dashboardData);

        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: `${systemContext}\n\nUser question: ${message}` }]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 600,
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API error:", errorText);
            return NextResponse.json({ error: "AI service error" }, { status: 500 });
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

        return NextResponse.json({ 
            success: true,
            response: text 
        });
    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json(
            { error: "Failed to generate response" },
            { status: 500 }
        );
    }
}
