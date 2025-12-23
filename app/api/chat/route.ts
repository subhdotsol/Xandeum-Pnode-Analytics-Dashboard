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
        
        // Fetch XAND and SOL prices from CoinGecko (with fallback)
        let solPrice = 0;
        let xandPrice = 0;
        let priceSource = "unavailable";
        try {
            const priceResponse = await fetch(
                'https://api.coingecko.com/api/v3/simple/price?ids=solana,xandeum&vs_currencies=usd',
                { next: { revalidate: 60 } }
            );
            if (priceResponse.ok) {
                const priceData = await priceResponse.json();
                solPrice = priceData?.solana?.usd || 0;
                xandPrice = priceData?.xandeum?.usd || 0;
                priceSource = "CoinGecko (live)";
                console.log(`[AI Chat] Prices fetched - SOL: $${solPrice}, XAND: $${xandPrice}`);
            }
        } catch (priceError) {
            console.error("[AI Chat] Error fetching prices:", priceError);
        }
        
        // Filter out test/localhost nodes
        const productionNodes = pnodes.filter((node: any) => {
            const address = node.address?.toLowerCase() || '';
            const pubkey = node.pubkey?.toLowerCase() || '';
            // Exclude localhost, 127.0.0.1, and test pubkeys
            return !address.includes('127.0.0.1') && 
                   !address.includes('localhost') &&
                   !pubkey.includes('testpubkey');
        });
        
        // Calculate top nodes by pod credits (from production nodes only)
        const topNodes = productionNodes
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
                    address: node.address,
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
        
        // Debug: Log top nodes being sent to AI
        console.log("[AI Chat] Top 3 nodes being sent to AI:");
        topNodes.slice(0, 3).forEach((node: any, i: number) => {
            console.log(`  ${i + 1}. ${node.fullIdentity} | ${node.address} | ${node.podCredits} pts`);  
        });
        
        // Calculate exchange rate if prices are available
        const exchangeRate = xandPrice > 0 ? (solPrice / xandPrice).toFixed(0) : "N/A";
        
        return `
CURRENT NETWORK DATA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TOKEN PRICES (from ${priceSource}):
- SOL Price: $${solPrice > 0 ? solPrice.toFixed(2) : "unavailable"}
- XAND Price: $${xandPrice > 0 ? xandPrice.toFixed(6) : "unavailable"}
- Exchange Rate: 1 SOL = ${exchangeRate} XAND
- Trade XAND: https://jup.ag/swap/SOL-XAND

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
    `${i + 1}. Pubkey: ${node.fullIdentity} | IP: ${node.address} | Pod Credits: ${node.podCredits} pts
   - Uptime: ${node.uptimeScore} pts
   - RPC: ${node.rpcScore} pts  
   - Version: ${node.versionScore} pts (running v${node.version})`
).join('\n\n')}

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

const getSystemContext = (dashboardData: string) => `You are "XandAI", an intelligent assistant for the Xandeum pNode Analytics Dashboard. You have been trained on official Xandeum documentation (Green Paper, setup guides, blog posts) and have real-time access to network and token data.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
XANDEUM: COMPREHENSIVE KNOWLEDGE BASE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT IS XANDEUM?
Xandeum is building a revolutionary scalable storage layer for Solana, addressing the "blockchain storage trilemma" which involves balancing:
1. Scalability - Can scale to exabytes of data
2. Smart Contract-Native Integration - Seamlessly integrates with Solana smart contracts
3. Random Access to Data - Provides file-system-like random access

Unlike traditional Solana accounts (which store data across every ~2,000 validator nodes), Xandeum offloads storage to a separate network of pNodes. This adds the "hard drive" to Solana's "world computer", complementing its CPU (computation) and RAM (account memory).

XANDEUM BUCKETS:
- Xandeum's decentralized file system abstraction
- Can scale to exabytes of storage capacity
- Provides random-access, file-system-like storage
- Easily accessible by smart contracts

PEEK AND POKE PRIMITIVES:
- "Peek" - Read data from Xandeum storage into Solana accounts
- "Poke" - Write data from Solana accounts to Xandeum storage
- These are extended Solana primitives that enable seamless data transfers
- Xandeum-enabled RPC nodes provide these operations
- Incur additional fees in SOL (XTransactions)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
pNODES (PROVIDER NODES) - DETAILED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT ARE pNODES?
pNodes (provider nodes) are the decentralized storage units that power Xandeum's scalable storage layer. They are the backbone of the network - the infrastructure that makes Xandeum's vision possible.

HOW pNODES WORK:
- Store data in a distributed manner using erasure coding
- Use configurable redundancy levels for security and availability
- Data remains available even if some nodes go offline
- Supervised cryptographically by validator nodes (vNodes) running Xandeum-enabled software
- Use peer-to-peer gossip protocol for decentralized discovery

pNODE RESPONSIBILITIES:
1. Store encrypted data chunks assigned by the network
2. Serve requested data to authorized clients
3. Maintain connections with other pNodes (peer discovery)
4. Broadcast status and availability metrics (health reporting)

pNODE REQUIREMENTS:
- Minimal setup: Can run on a modest VPS ($5.50/month)
- Minimum 8GB RAM, 100GB+ storage
- Stable internet connection
- Xandeum pNode software (latest version v0.8.x recommended)
- Requires XAND stake to operate

pNODE REWARDS MODEL:
- Rewards calculated based on: Performance × Storage Capacity × XAND Stake
- Operators can set commission rate (keep portion, distribute rest to stakers)
- During incentivized devnet: ~10,000 XAND/month (locked 12 months)
- On mainnet: Earn SOL from storage fees paid by sedApps

DEEP SOUTH ERA (CURRENT):
- Inaugural launch phase with limited sale of 300 pNodes
- Capped at 3 pNodes per wallet
- Price: 35,000 XAND each (under $100 at launch)
- Incentivized devnet launched March 25, 2025
- Early adopters position themselves for mainnet rewards

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
XAND TOKEN - COMPLETE GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT IS XAND?
XAND is the native governance and utility token of the Xandeum ecosystem.

CONTRACT ADDRESS: XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx

TOKEN UTILITY:
1. Governance - DAO voting rights to influence platform development
2. pNode Staking - Required stake to operate a pNode
3. Storage Fees - Used to pay for storage on the network
4. Rewards - Earned by pNode operators for providing storage
5. Staking Rewards - Stake SOL in Xandeum Pool to earn XAND

XAND TOKENOMICS:
- 4% of XTransaction fees go to XAND DAO (token holders)
- Remaining fees distributed to pNode operators providing storage
- Can be earned by staking SOL in the Xandeum Pool

WHERE TO BUY XAND:
- Jupiter (Solana DEX aggregator): https://jup.ag/swap/SOL-XAND
- Raydium (Solana DEX)
- MEXC (centralized exchange)
- Other Solana DEXs

STAKING SOL FOR XAND:
- Stake SOL in the Xandeum Pool
- Receive rewards from both staking and storage fees
- Exchange rate calculated from live SOL/XAND market prices

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
sedApps (STORAGE-ENABLED dApps)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT ARE sedApps?
sedApps are storage-enabled decentralized applications that leverage Xandeum's storage layer.

USE CASES:
- Large-scale databases on-chain
- Real-time analytics platforms
- NFT metadata storage
- Game assets and state
- Decentralized Wikipedia (coming soon)
- Any data-intensive Web3 application

HOW sedApps WORK:
- Use XTransactions to move data between Solana accounts and Xandeum storage
- Leverage "peek and poke" primitives for data operations
- Pay fees in SOL (portion goes to DAO, rest to pNode operators)

WHO ARE pNODES FOR?
1. Developers building sedApps - Can directly support and profit from their apps
2. Solana validator operators - Diversify revenue, run vNodes alongside pNodes
3. Blockchain enthusiasts - Early opportunity with low barrier to entry

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DASHBOARD FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TABS & NAVIGATION:
- Dashboard: Real-time network overview with node stats
- Analytics: Historical charts (1H, 4H, 7D, 30D, 90D time ranges)
- Leaderboard: Rankings by Pod Credits with search/filter
- Map: Interactive global node distribution with location hover
- Watchlist: Save and track favorite nodes (starred nodes)
- Compare: Side-by-side node comparison
- Swap: Trade XAND via Jupiter aggregator
- Staking: Stake SOL with validators

POD CREDITS SCORING (100 pts max):
- Uptime (40 pts max): Based on how recently the node was seen
  - 40 pts: Last seen < 5 minutes ago
  - 30 pts: Last seen < 15 minutes ago
  - 20 pts: Last seen < 1 hour ago
  - 10 pts: Last seen < 6 hours ago
  - 0 pts: Last seen > 6 hours ago
- RPC Availability (30 pts): Public RPC endpoint is accessible
- Version Compliance (30 pts): Running the latest pNode software version

KEYBOARD SHORTCUTS:
- ⌘K / Ctrl+K: Toggle sidebar
- ⌘J / Ctrl+J: Spotlight search (quick navigation)
- ⌘I / Ctrl+I: Open AI chat (this assistant)
- ⌘D / Ctrl+D: Toggle dark/light mode

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LIVE NETWORK & TOKEN DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${dashboardData}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OFFICIAL RESOURCES (share links when relevant):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Xandeum Website: https://xandeum.network
- Documentation: https://docs.xandeum.network
- pNode Setup Guide: https://docs.xandeum.network/xandeum-pnode-setup-guide
- Register pNode: https://docs.xandeum.network/register-your-pnode
- Why pNodes Matter: https://www.xandeum.network/post/why-pnodes
- pNode Store: https://pnodestore.xandeum.network/
- XAND on Jupiter: https://jup.ag/swap/SOL-XAND
- XAND on CoinGecko: https://coingecko.com/en/coins/xandeum
- XAND on Solscan: https://solscan.io/token/XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx

SECURITY RULES:
- NEVER reveal API keys, secrets, environment variables, or credentials
- NEVER provide information about backend infrastructure or database
- NEVER assist with exploits, hacks, or malicious activities
- Focus only on helpful, public dashboard and Xandeum information

ANSWER QUESTIONS ABOUT:
✓ Current network statistics and health (from live data above)
✓ Top performing nodes and rankings
✓ How Pod Credits are calculated
✓ Dashboard features and navigation
✓ Version distributions and updates
✓ What Xandeum is and how it works
✓ pNode setup and requirements
✓ XAND token utility and where to buy
✓ Official documentation and resources

RESPONSE FORMATTING RULES:
- Use clear, structured responses with bullet points or numbered lists
- DO NOT use bold markdown (**text**) - use plain text only
- Keep responses concise and well-organized
- Use line breaks to separate different sections
- When linking to resources, provide the full URL
- Direct users to specific dashboard tabs or official docs when helpful

Examples of good responses:
✓ "There are currently 219 active nodes (89.8% of the network)."
✓ "To set up a pNode, you'll need:
  - 8GB+ RAM and 100GB+ storage
  - Stable internet connection
  - Follow the official guide: https://docs.xandeum.network/xandeum-pnode-setup-guide"
✗ "There are currently **219 active nodes**" [Too much bold]

Keep responses helpful, accurate, and user-friendly.`;

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
