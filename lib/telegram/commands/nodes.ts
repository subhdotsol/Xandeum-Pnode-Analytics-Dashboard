import { Context } from "telegraf";
import { pnodeClient } from "@/lib/pnode-client";
import { analyzeNetwork } from "@/lib/network-analytics";

export async function handleNodes(ctx: Context) {
  try {
    await ctx.sendChatAction("typing");
    
    const pnodes = await pnodeClient.getAllPNodes();
    const analytics = analyzeNetwork(pnodes);
    
    // Version distribution (top 3)
    const versions = Object.entries(analytics.versions.distribution)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 3)
      .map(([v, count]) => `  v${v}: ${count}`)
      .join("\n");
    
    await ctx.reply(
      `📊 Network Statistics\n\n` +
      `Total Nodes: ${analytics.totals.total}\n` +
      `✅ Online: ${analytics.totals.healthy} (${analytics.health.healthyPercentage}%)\n` +
      `⚠️ Degraded: ${analytics.totals.degraded} (${analytics.health.degradedPercentage}%)\n` +
      `❌ Offline: ${analytics.totals.offline} (${analytics.health.offlinePercentage}%)\n\n` +
      `📦 Version Distribution:\n${versions}\n\n` +
      `Latest Version: v${analytics.versions.latest}`
    );
  } catch (error) {
    console.error("Nodes command error:", error);
    await ctx.reply("❌ Error fetching node stats. Try again later.");
  }
}
