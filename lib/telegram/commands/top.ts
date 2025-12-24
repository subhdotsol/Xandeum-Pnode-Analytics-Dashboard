import { Context } from "telegraf";
import { pnodeClient } from "@/lib/pnode-client";

// Fetch real pod credits from API
async function fetchPodCredits(): Promise<Record<string, number>> {
  try {
    const response = await fetch("https://podcredits.xandeum.network/api/pods-credits");
    if (!response.ok) return {};
    const data = await response.json();
    const credits: Record<string, number> = {};
    for (const pod of data.pods_credits || []) {
      credits[pod.pod_id] = pod.credits;
    }
    return credits;
  } catch {
    return {};
  }
}

export async function handleTop(ctx: Context) {
  try {
    await ctx.sendChatAction("typing");
    
    const [pnodes, podCredits] = await Promise.all([
      pnodeClient.getAllPNodes(),
      fetchPodCredits()
    ]);
    
    // Get top 10 pods by real credits
    const topNodes = pnodes
      .filter((n: any) => !n.address?.includes('127.0.0.1') && !n.pubkey?.includes('testpubkey'))
      .map((node: any) => ({
        pubkey: node.pubkey?.slice(0, 12) + "...",
        fullPubkey: node.pubkey || "unknown",
        address: node.address || "unknown",
        credits: node.pubkey ? (podCredits[node.pubkey] || 0) : 0,
        version: node.version,
      }))
      .filter((n: any) => n.credits > 0)
      .sort((a: any, b: any) => b.credits - a.credits)
      .slice(0, 10);
    
    if (topNodes.length === 0) {
      await ctx.reply("❌ No pods with credits found. Try again later.");
      return;
    }
    
    const leaderboard = topNodes
      .map((n: any, i: number) => {
        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;
        return `${medal} ${n.credits.toLocaleString()} credits\n🔑 ${n.fullPubkey}\n📍 ${n.address}`;
      })
      .join("\n\n");
    
    const totalCredits = Object.values(podCredits).reduce((sum, c) => sum + c, 0);
    
    await ctx.reply(
      `🏆 Top 10 pNodes by Pod Credits\n\n` +
      `${leaderboard}\n\n` +
      `📊 Network Total: ${totalCredits.toLocaleString()} credits\n` +
      `💡 Copy any pubkey to look up with /node\n` +
      `🌐 Full dashboard: explorerxandeum.vercel.app`
    );
  } catch (error) {
    console.error("Top command error:", error);
    await ctx.reply("❌ Error fetching leaderboard. Try again later.");
  }
}
