import { Context } from "telegraf";
import { pnodeClient } from "@/lib/pnode-client";
import { analyzeNetwork } from "@/lib/network-analytics";

export async function handleTop(ctx: Context) {
  try {
    await ctx.sendChatAction("typing");
    
    const pnodes = await pnodeClient.getAllPNodes();
    const analytics = analyzeNetwork(pnodes);
    
    // Calculate pod credits and get top 10
    const topNodes = pnodes
      .filter((n: any) => !n.address?.includes('127.0.0.1') && !n.pubkey?.includes('testpubkey'))
      .map((node: any) => {
        const now = Math.floor(Date.now() / 1000);
        const minutesAgo = (now - node.last_seen_timestamp) / 60;
        const uptimeScore = minutesAgo < 5 ? 40 : minutesAgo < 15 ? 30 : minutesAgo < 60 ? 20 : minutesAgo < 360 ? 10 : 0;
        const rpcScore = (node.rpc || node.gossip_rpc) ? 30 : 0;
        const versionScore = node.version === analytics.versions.latest ? 30 : 0;
        return {
          pubkey: node.pubkey?.slice(0, 12) + "...",
          fullPubkey: node.pubkey || "unknown",
          address: node.address || "unknown",
          credits: uptimeScore + rpcScore + versionScore,
          version: node.version,
        };
      })
      .sort((a: any, b: any) => b.credits - a.credits)
      .slice(0, 10);
    
    const leaderboard = topNodes
      .map((n: any, i: number) => {
        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;
        return `${medal} ${n.credits}/100 pts\n🔑 ${n.fullPubkey}\n📍 ${n.address}`;
      })
      .join("\n\n");
    
    await ctx.reply(
      `🏆 Top 10 pNodes by Pod Credits\n\n` +
      `${leaderboard}\n\n` +
      `💡 Copy any pubkey to look up with /node\n` +
      `📊 Full dashboard: explorerxandeum.vercel.app`
    );
  } catch (error) {
    console.error("Top command error:", error);
    await ctx.reply("❌ Error fetching leaderboard. Try again later.");
  }
}
