import { Context, NarrowedContext } from "telegraf";
import { Message, Update } from "telegraf/types";
import { pnodeClient } from "@/lib/pnode-client";
import { analyzeNetwork } from "@/lib/network-analytics";

type TextContext = NarrowedContext<Context<Update>, Update.MessageUpdate<Message.TextMessage>>;

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
    
    const pnodes = await pnodeClient.getAllPNodes();
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
    
    // Calculate pod credits
    const now = Math.floor(Date.now() / 1000);
    const minutesAgo = (now - node.last_seen_timestamp) / 60;
    const uptimeScore = minutesAgo < 5 ? 40 : minutesAgo < 15 ? 30 : minutesAgo < 60 ? 20 : minutesAgo < 360 ? 10 : 0;
    const hasRpc = !!(node.rpc || node.gossip_rpc);
    const rpcScore = hasRpc ? 30 : 0;
    const versionScore = node.version === analytics.versions.latest ? 30 : 0;
    const podCredits = uptimeScore + rpcScore + versionScore;
    
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
      `⭐ Pod Credits: ${podCredits}/100\n` +
      `  • Uptime: ${uptimeScore}/40\n` +
      `  • RPC: ${rpcScore}/30\n` +
      `  • Version: ${versionScore}/30`
    );
  } catch (error) {
    console.error("Node command error:", error);
    await ctx.reply("❌ Error fetching node details. Try again later.");
  }
}
