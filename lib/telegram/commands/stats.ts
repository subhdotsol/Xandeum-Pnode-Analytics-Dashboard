import { Context } from "telegraf";
import { pnodeClient } from "@/lib/pnode-client";
import { analyzeNetwork } from "@/lib/network-analytics";

export async function handleStats(ctx: Context) {
  try {
    await ctx.sendChatAction("typing");
    
    // Fetch both network data and token prices
    const [pnodes, priceRes] = await Promise.all([
      pnodeClient.getAllPNodes(),
      fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana,xandeum&vs_currencies=usd")
    ]);
    
    const analytics = analyzeNetwork(pnodes);
    const priceData = await priceRes.json();
    
    const solPrice = priceData.solana?.usd || 0;
    const xandPrice = priceData.xandeum?.usd || 0;
    
    // Count RPC-enabled nodes
    const rpcCount = pnodes.filter((n: any) => n.rpc || n.gossip_rpc).length;
    const rpcPercent = ((rpcCount / analytics.totals.total) * 100).toFixed(1);
    
    await ctx.reply(
      `📊 Xandeum Network Dashboard\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `🌐 NETWORK\n` +
      `• Total Nodes: ${analytics.totals.total}\n` +
      `• Online: ${analytics.totals.healthy} (${analytics.health.healthyPercentage}%)\n` +
      `• Health Score: ${analytics.health.score}/100\n\n` +
      `📡 RPC STATUS\n` +
      `• RPC Enabled: ${rpcCount} (${rpcPercent}%)\n` +
      `• Latest Version: v${analytics.versions.latest}\n\n` +
      `💰 TOKEN PRICES\n` +
      `• SOL: $${solPrice.toFixed(2)}\n` +
      `• XAND: $${xandPrice.toFixed(6)}\n\n` +
      `🔗 Dashboard: explorerxandeum.vercel.app`
    );
  } catch (error) {
    console.error("Stats command error:", error);
    await ctx.reply("❌ Error fetching stats. Try again later.");
  }
}
