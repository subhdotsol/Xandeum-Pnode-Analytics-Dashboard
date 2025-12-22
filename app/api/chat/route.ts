import { NextResponse } from "next/server";

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
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        
        // Fetch all dashboard data in parallel
        const [analyticsRes, pnodesRes, statsRes] = await Promise.all([
            fetch(`${baseUrl}/api/analytics`, { cache: 'no-store' }),
            fetch(`${baseUrl}/api/pnodes`, { cache: 'no-store' }),
            fetch(`${baseUrl}/api/stats`, { cache: 'no-store' }),
        ]);
        
        const analytics = analyticsRes.ok ? await analyticsRes.json() : null;
        const pnodesData = pnodesRes.ok ? await pnodesRes.json() : null;
        const stats = statsRes.ok ? await statsRes.json() : null;
        
        if (!analytics || !pnodesData) {
            return "Network data temporarily unavailable";
        }
        
        const pnodes = pnodesData.pnodes || [];
        
        // Calculate top nodes by pod credits
        const topNodes = pnodes
            .map((node: any) => {
                const lastSeenDate = new Date(node.lastSeen);
                const now = new Date();
                const minutesAgo = (now.getTime() - lastSeenDate.getTime()) / 60000;
                
                let uptimeScore = 0;
                if (minutesAgo < 5) uptimeScore = 40;
                else if (minutesAgo < 15) uptimeScore = 30;
                else if (minutesAgo < 60) uptimeScore = 20;
                else if (minutesAgo < 360) uptimeScore = 10;
                
                const rpcScore = (node.rpc || node.gossipRPC) ? 30 : 0;
                const versionScore = node.version === analytics.latestVersion ? 30 : 0;
                const podCredits = uptimeScore + rpcScore + versionScore;
                
                return {
                    identity: node.identity?.slice(0, 8) + '...',
                    podCredits,
                    uptimeScore,
                    rpcScore,
                    versionScore,
                    version: node.version,
                    hasRPC: !!(node.rpc || node.gossipRPC),
                };
            })
            .sort((a: any, b: any) => b.podCredits - a.podCredits)
            .slice(0, 10);
        
        // Version distribution
        const versionCounts = pnodes.reduce((acc: any, node: any) => {
            acc[node.version] = (acc[node.version] || 0) + 1;
            return acc;
        }, {});
        
        return `
CURRENT NETWORK DATA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Network Overview:
- Total Nodes: ${analytics.totalNodes}
- Active Nodes: ${analytics.activeNodes} (${analytics.healthyPercentage}% healthy)
- RPC-Enabled Nodes: ${analytics.rpcNodes}
- Latest Version: ${analytics.latestVersion}
- Nodes on Latest: ${analytics.nodesOnLatestVersion}/${analytics.totalNodes}

Version Distribution:
${Object.entries(versionCounts)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 5)
    .map(([version, count]) => `- v${version}: ${count} nodes`)
    .join('\n')}

Top 10 Nodes by Pod Credits:
${topNodes.map((node: any, i: number) => 
    `${i + 1}. ${node.identity} - ${node.podCredits} pts (Uptime: ${node.uptimeScore}, RPC: ${node.rpcScore}, Version: ${node.versionScore})`
).join('\n')}

Network Statistics:
- Total Storage: ${stats?.totalStorage || 'N/A'} GB
- Total RAM: ${stats?.totalRam || 'N/A'} GB
- Avg CPU: ${stats?.avgCpu || 'N/A'}%
- Public RPC Count: ${stats?.nodeCount || analytics.rpcNodes}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    } catch (error) {
        console.error("Error fetching dashboard context:", error);
        return "Network data temporarily unavailable";
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

Keep responses helpful, concise, and user-friendly. Direct users to specific tabs for detailed exploration.`;

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
