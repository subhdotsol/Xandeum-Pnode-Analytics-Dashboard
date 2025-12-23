import { Context } from "telegraf";
import { pnodeClient } from "@/lib/pnode-client";
import { analyzeNetwork } from "@/lib/network-analytics";

export async function handleHealth(ctx: Context) {
  try {
    await ctx.sendChatAction("typing");
    
    const pnodes = await pnodeClient.getAllPNodes();
    const analytics = analyzeNetwork(pnodes);
    
    // Health emoji based on score
    const healthEmoji = analytics.health.score >= 80 ? "🟢" : 
                        analytics.health.score >= 60 ? "🟡" : "🔴";
    
    await ctx.reply(
      `🏥 Network Health\n\n` +
      `${healthEmoji} Score: ${analytics.health.score}/100\n\n` +
      `✅ Healthy: ${analytics.totals.healthy} nodes (${analytics.health.healthyPercentage}%)\n` +
      `⚠️ Degraded: ${analytics.totals.degraded} nodes (${analytics.health.degradedPercentage}%)\n` +
      `❌ Offline: ${analytics.totals.offline} nodes (${analytics.health.offlinePercentage}%)\n\n` +
      `📦 Latest Version: v${analytics.versions.latest}\n` +
      `🔄 Nodes on Latest: ${pnodes.filter((n: any) => n.version === analytics.versions.latest).length}/${analytics.totals.total}`
    );
  } catch (error) {
    console.error("Health command error:", error);
    await ctx.reply("❌ Error fetching network health. Try again later.");
  }
}
