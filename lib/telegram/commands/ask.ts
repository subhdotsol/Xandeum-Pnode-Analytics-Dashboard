import { Context, NarrowedContext } from "telegraf";
import { Message, Update } from "telegraf/types";
import { pnodeClient } from "@/lib/pnode-client";
import { analyzeNetwork } from "@/lib/network-analytics";

type TextContext = NarrowedContext<Context<Update>, Update.MessageUpdate<Message.TextMessage>>;

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export async function handleAsk(ctx: TextContext) {
  try {
    const text = ctx.message.text;
    const question = text.replace("/ask", "").trim();
    
    if (!question) {
      await ctx.reply(
        "🤖 Ask XandAI anything about Xandeum!\n\n" +
        "Usage: /ask <your question>\n\n" +
        "Examples:\n" +
        "/ask What is Xandeum?\n" +
        "/ask How do pNodes work?\n" +
        "/ask What is the XAND token used for?\n" +
        "/ask How to set up a pNode?\n" +
        "/ask What are sedApps?\n" +
        "/ask What is peek and poke?"
      );
      return;
    }
    
    await ctx.sendChatAction("typing");
    
    // Fetch live network data for context
    const [pnodes, priceRes] = await Promise.all([
      pnodeClient.getAllPNodes(),
      fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana,xandeum&vs_currencies=usd")
    ]);
    
    const analytics = analyzeNetwork(pnodes);
    const priceData = await priceRes.json();
    const solPrice = priceData.solana?.usd || 0;
    const xandPrice = priceData.xandeum?.usd || 0;
    const exchangeRate = xandPrice > 0 ? (solPrice / xandPrice).toFixed(0) : "N/A";
    
    // Fetch pod credits from API
    let podCredits: Record<string, number> = {};
    try {
      const creditsRes = await fetch("https://podcredits.xandeum.network/api/pods-credits");
      if (creditsRes.ok) {
        const creditsData = await creditsRes.json();
        for (const pod of creditsData.pods_credits || []) {
          podCredits[pod.pod_id] = pod.credits;
        }
      }
    } catch { /* ignore */ }
    
    // Get top 10 nodes by real credits
    const topNodes = pnodes
      .filter((n: any) => !n.address?.includes('127.0.0.1') && !n.pubkey?.includes('testpubkey'))
      .map((node: any) => {
        const now = Math.floor(Date.now() / 1000);
        const minutesAgo = (now - node.last_seen_timestamp) / 60;
        return {
          pubkey: node.pubkey,
          address: node.address,
          credits: node.pubkey ? (podCredits[node.pubkey] || 0) : 0,
          version: node.version,
          status: minutesAgo < 5 ? "healthy" : minutesAgo < 60 ? "degraded" : "offline",
        };
      })
      .filter((n: any) => n.credits > 0)
      .sort((a: any, b: any) => b.credits - a.credits)
      .slice(0, 10);

    // Build top 10 leaderboard string
    const leaderboardStr = topNodes
      .map((n: any, i: number) => `#${i + 1}: ${n.pubkey} @ ${n.address} - ${n.credits.toLocaleString()} credits (${n.status})`)
      .join("\n");

    // Version distribution string
    const versionDistStr = Object.entries(analytics.versions.distribution)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .slice(0, 5)
      .map(([version, count]) => `v${version}: ${count} nodes`)
      .join(", ");

    // Sample nodes by status for lookups
    const sampleHealthy = pnodes.filter((n: any) => {
      const delta = Math.floor(Date.now() / 1000) - n.last_seen_timestamp;
      return delta < 300;
    }).slice(0, 3).map((n: any) => n.pubkey?.slice(0, 16)).join(", ");

    // Build comprehensive system context (same as web XandAI)
    const systemPrompt = `You are XandAI, an expert assistant for Xandeum - the decentralized storage layer for Solana. You have comprehensive knowledge from official documentation AND live network data.

WHAT IS XANDEUM?
Xandeum is building a revolutionary scalable storage layer for Solana, addressing the "blockchain storage trilemma":
1. Scalability - Can scale to exabytes of data
2. Smart Contract-Native Integration - Seamlessly integrates with Solana smart contracts
3. Random Access to Data - Provides file-system-like random access

Unlike traditional Solana accounts (stored across ~2,000 validator nodes), Xandeum offloads storage to pNodes. This adds the "hard drive" to Solana's "world computer".

XANDEUM BUCKETS:
- Decentralized file system abstraction
- Scales to exabytes of capacity
- Random-access, file-system-like storage
- Accessible by smart contracts

PEEK AND POKE PRIMITIVES:
- "Peek" - Read data from Xandeum storage into Solana accounts
- "Poke" - Write data from Solana accounts to Xandeum storage
- Extended Solana primitives for seamless data transfers
- Xandeum-enabled RPC nodes provide these operations
- Incur fees in SOL (XTransactions)

pNODES (PROVIDER NODES):
- Decentralized storage units powering Xandeum
- Store data using erasure coding with configurable redundancy
- Data remains available even if some nodes go offline
- Supervised cryptographically by vNodes (validator nodes)
- Use P2P gossip protocol for decentralized discovery

pNODE RESPONSIBILITIES:
1. Store encrypted data chunks
2. Serve data to authorized clients
3. Maintain peer connections
4. Broadcast health metrics

pNODE REQUIREMENTS:
- Minimal: VPS at $5.50/month
- 8GB RAM, 100GB+ storage
- Stable internet
- Latest pNode software (v0.8.x)
- XAND stake required

pNODE REWARDS:
- Formula: Performance × Storage × XAND Stake
- Devnet: ~10,000 XAND/month (12-month lock)
- Mainnet: SOL from storage fees

DEEP SOUTH ERA (CURRENT):
- 300 pNodes available
- 3 per wallet max
- 35,000 XAND each (~$100)
- Devnet launched March 25, 2025

XAND TOKEN:
Contract: XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx

Utilities:
1. DAO governance voting
2. pNode staking requirement
3. Storage fee payment
4. Operator rewards
5. SOL staking rewards

Tokenomics:
- 4% of XTransaction fees → XAND DAO
- Rest → pNode operators

Where to buy: Jupiter, Raydium, MEXC

sedApps (STORAGE-ENABLED dApps):
- Apps using Xandeum storage layer
- Use XTransactions for data operations
- Use cases: databases, NFT metadata, games, analytics
- Coming soon: Decentralized Wikipedia

=== LIVE NETWORK DATA ===

NETWORK OVERVIEW:
- Total Nodes: ${analytics.totals.total}
- Healthy: ${analytics.totals.healthy} (${analytics.health.healthyPercentage}%)
- Degraded: ${analytics.totals.degraded}
- Offline: ${analytics.totals.offline}
- Health Score: ${analytics.health.score}/100
- Latest Version: v${analytics.versions.latest}

TOKEN PRICES:
- SOL: $${solPrice.toFixed(2)}
- XAND: $${xandPrice.toFixed(6)}
- Rate: 1 SOL = ${exchangeRate} XAND

VERSION DISTRIBUTION: ${versionDistStr}

=== TOP 10 NODES LEADERBOARD ===
${leaderboardStr}

=== SAMPLE HEALTHY NODES ===
${sampleHealthy}

=== HOW TO ANSWER NODE QUERIES ===
When users ask about specific nodes, top performers, or addresses:
- If they ask for "top node" or "best node", give the #1 from the leaderboard with FULL pubkey and address
- If they ask for "top 5" or "top 10", list them from the leaderboard
- If they ask about a specific node (partial pubkey match), try to find it in the data
- Always include the full pubkey and IP address when discussing specific nodes
- Pod Credits scoring: Uptime (40pts) + RPC enabled (30pts) + Latest version (30pts)

LINKS:
- Dashboard: explorerxandeum.vercel.app
- Docs: docs.xandeum.network
- Setup Guide: docs.xandeum.network/xandeum-pnode-setup-guide
- Jupiter: jup.ag/swap/SOL-XAND
- pNode Store: pnodestore.xandeum.network

Keep responses concise (max 300 words) for Telegram. Be helpful, accurate, and friendly. When providing node addresses, format them clearly so users can copy them.`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      await ctx.reply("❌ AI service not configured. Please try the web dashboard at explorerxandeum.vercel.app");
      return;
    }
    
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: systemPrompt }] },
          { role: "model", parts: [{ text: "I understand. I'm XandAI with comprehensive Xandeum knowledge and live network data. Ready to help!" }] },
          { role: "user", parts: [{ text: question }] }
        ],
        generationConfig: { temperature: 0.7, maxOutputTokens: 600 }
      }),
    });
    
    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!answer) {
      await ctx.reply("❌ Couldn't generate a response. Please try again or visit the dashboard.");
      return;
    }
    
    // Truncate if too long for Telegram
    const truncatedAnswer = answer.length > 4000 ? answer.slice(0, 3997) + "..." : answer;
    
    await ctx.reply(`🤖 XandAI:\n\n${truncatedAnswer}`);
  } catch (error) {
    console.error("Ask command error:", error);
    await ctx.reply("❌ Error processing your question. Try again or visit explorerxandeum.vercel.app");
  }
}
