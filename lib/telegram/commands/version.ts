import { Context } from "telegraf";
import { pnodeClient } from "@/lib/pnode-client";
import { analyzeNetwork } from "@/lib/network-analytics";

export async function handleVersion(ctx: Context) {
  try {
    await ctx.sendChatAction("typing");
    
    const pnodes = await pnodeClient.getAllPNodes();
    const analytics = analyzeNetwork(pnodes);
    
    // Get version distribution sorted by count
    const versions = Object.entries(analytics.versions.distribution)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 8);
    
    const total = analytics.totals.total;
    const versionList = versions
      .map(([v, count]) => {
        const percent = ((count as number / total) * 100).toFixed(1);
        const isLatest = v === analytics.versions.latest;
        return `${isLatest ? "✅" : "⚠️"} v${v}: ${count} nodes (${percent}%)`;
      })
      .join("\n");
    
    const outdatedPercent = analytics.versions.outdatedPercentage.toFixed(1);
    
    await ctx.reply(
      `📦 pNode Version Distribution\n\n` +
      `Latest: v${analytics.versions.latest}\n\n` +
      `${versionList}\n\n` +
      `⚠️ Outdated: ${analytics.versions.outdatedCount} nodes (${outdatedPercent}%)`
    );
  } catch (error) {
    console.error("Version command error:", error);
    await ctx.reply("❌ Error fetching version stats. Try again later.");
  }
}
