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
    
    // Build comprehensive system context (same as web XandAI)
    const systemPrompt = `You are XandAI, an expert assistant for Xandeum - the decentralized storage layer for Solana. You have comprehensive knowledge from official documentation.

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

LIVE NETWORK DATA:
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

LINKS:
- Dashboard: explorerxandeum.vercel.app
- Docs: docs.xandeum.network
- Setup Guide: docs.xandeum.network/xandeum-pnode-setup-guide
- Jupiter: jup.ag/swap/SOL-XAND
- pNode Store: pnodestore.xandeum.network

Keep responses concise (max 250 words) for Telegram. Be helpful, accurate, and friendly.`;

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
