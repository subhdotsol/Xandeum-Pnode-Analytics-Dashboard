import { Context, NarrowedContext } from "telegraf";
import { Message, Update } from "telegraf/types";
import { pnodeClient } from "@/lib/pnode-client";
import { analyzeNetwork } from "@/lib/network-analytics";

type TextContext = NarrowedContext<Context<Update>, Update.MessageUpdate<Message.TextMessage>>;

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

export async function handleNode(ctx: TextContext) {
  try {
    const text = ctx.message.text;
    const parts = text.split(" ");
    const query = parts.slice(1).join(" ").trim();
    
    if (!query) {
      await ctx.reply(
        "Usage: /node <pubkey or IP>\n\n" +
        "Examples:\n" +
        "/node EcTqXgB6VJ\n" +
        "/node 173.212.207.32"
      );
      return;
    }
    
    await ctx.sendChatAction("typing");
    
    const [pnodes, podCredits] = await Promise.all([
      pnodeClient.getAllPNodes(),
      fetchPodCredits()
    ]);
    
    const analytics = analyzeNetwork(pnodes);
    
    // Find node by partial pubkey or IP address
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const node = pnodes.find((n: any) => 
      n.pubkey?.toLowerCase().includes(query.toLowerCase()) || 
      n.address?.includes(query)
    ) as any;
    
    if (!node) {
      await ctx.reply(`❌ Node not found: ${query}\n\nTry searching with a different pubkey or IP.`);
      return;
    }
    
    // Get real pod credits
    const credits = node.pubkey ? (podCredits[node.pubkey] || 0) : 0;
    
    // Calculate all pods ranking
    const allPodsRanked = pnodes
      .filter((n: any) => n.pubkey && podCredits[n.pubkey])
      .map((n: any) => ({ pubkey: n.pubkey, credits: podCredits[n.pubkey] }))
      .sort((a: any, b: any) => b.credits - a.credits);
    
    const rank = allPodsRanked.findIndex((p: any) => p.pubkey === node.pubkey) + 1;
    const totalPods = allPodsRanked.length;
    
    // Status calculation
    const now = Math.floor(Date.now() / 1000);
    const minutesAgo = (now - node.last_seen_timestamp) / 60;
    const hasRpc = !!(node.rpc || node.gossip_rpc);
    
    // Status emoji
    const statusEmoji = minutesAgo < 5 ? "🟢" : minutesAgo < 60 ? "🟡" : "🔴";
    const lastSeenText = minutesAgo < 1 ? "Just now" : 
                         minutesAgo < 60 ? `${Math.floor(minutesAgo)}m ago` :
                         `${Math.floor(minutesAgo / 60)}h ago`;
    
    await ctx.reply(
      `🖥️ Node Details\n\n` +
      `${statusEmoji} Status: ${minutesAgo < 5 ? "Healthy" : minutesAgo < 60 ? "Degraded" : "Offline"}\n\n` +
      `📍 Address: ${node.address}\n` +
      `🔑 Pubkey: ${node.pubkey?.slice(0, 16)}...\n` +
      `📦 Version: ${node.version}${node.version === analytics.versions.latest ? " ✅" : " ⚠️"}\n` +
      `🕐 Last Seen: ${lastSeenText}\n` +
      `📡 RPC: ${hasRpc ? "Enabled ✅" : "Disabled ❌"}\n\n` +
      `⭐ Pod Credits: ${credits.toLocaleString()}\n` +
      (rank > 0 ? `🏆 Rank: #${rank} of ${totalPods} pods` : `📊 Not ranked (no credits yet)`)
    );
  } catch (error) {
    console.error("Node command error:", error);
    await ctx.reply("❌ Error fetching node details. Try again later.");
  }
}
