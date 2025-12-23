import { Context, NarrowedContext } from "telegraf";
import { Message, Update } from "telegraf/types";
import { pnodeClient } from "@/lib/pnode-client";
import { analyzeNetwork } from "@/lib/network-analytics";

type TextContext = NarrowedContext<Context<Update>, Update.MessageUpdate<Message.TextMessage>>;

export async function handleCompare(ctx: TextContext) {
  try {
    const text = ctx.message.text;
    const parts = text.split(" ").filter(p => p.trim());
    
    if (parts.length < 3) {
      await ctx.reply(
        "Usage: /compare <node1> <node2>\n\n" +
        "Example:\n" +
        "/compare EcTqXgB6VJ 6PbJSbfG4p"
      );
      return;
    }
    
    const query1 = parts[1];
    const query2 = parts[2];
    
    await ctx.sendChatAction("typing");
    
    const pnodes = await pnodeClient.getAllPNodes();
    const analytics = analyzeNetwork(pnodes);
    
    // Find both nodes
    const node1 = pnodes.find((n: any) => 
      n.pubkey?.toLowerCase().includes(query1.toLowerCase()) || 
      n.address?.includes(query1)
    ) as any;
    
    const node2 = pnodes.find((n: any) => 
      n.pubkey?.toLowerCase().includes(query2.toLowerCase()) || 
      n.address?.includes(query2)
    ) as any;
    
    if (!node1) {
      await ctx.reply(`❌ Node 1 not found: ${query1}`);
      return;
    }
    if (!node2) {
      await ctx.reply(`❌ Node 2 not found: ${query2}`);
      return;
    }
    
    // Calculate metrics for both
    const calcMetrics = (node: any) => {
      const now = Math.floor(Date.now() / 1000);
      const minutesAgo = (now - node.last_seen_timestamp) / 60;
      const uptimeScore = minutesAgo < 5 ? 40 : minutesAgo < 15 ? 30 : minutesAgo < 60 ? 20 : minutesAgo < 360 ? 10 : 0;
      const hasRpc = !!(node.rpc || node.gossip_rpc);
      const rpcScore = hasRpc ? 30 : 0;
      const isLatest = node.version === analytics.versions.latest;
      const versionScore = isLatest ? 30 : 0;
      const total = uptimeScore + rpcScore + versionScore;
      const status = minutesAgo < 5 ? "🟢" : minutesAgo < 60 ? "🟡" : "🔴";
      return { uptimeScore, rpcScore, versionScore, total, hasRpc, isLatest, status };
    };
    
    const m1 = calcMetrics(node1);
    const m2 = calcMetrics(node2);
    
    const winner = m1.total > m2.total ? "1️⃣ Node 1 wins!" : 
                   m2.total > m1.total ? "2️⃣ Node 2 wins!" : "🤝 It's a tie!";
    
    await ctx.reply(
      `⚔️ Node Comparison\n━━━━━━━━━━━━━━━━━━━━\n\n` +
      `1️⃣ ${node1.pubkey?.slice(0, 10)}...\n` +
      `${m1.status} Status | v${node1.version}\n` +
      `⭐ ${m1.total}/100 pts\n` +
      `  • Uptime: ${m1.uptimeScore}/40\n` +
      `  • RPC: ${m1.rpcScore}/30\n` +
      `  • Version: ${m1.versionScore}/30\n\n` +
      `2️⃣ ${node2.pubkey?.slice(0, 10)}...\n` +
      `${m2.status} Status | v${node2.version}\n` +
      `⭐ ${m2.total}/100 pts\n` +
      `  • Uptime: ${m2.uptimeScore}/40\n` +
      `  • RPC: ${m2.rpcScore}/30\n` +
      `  • Version: ${m2.versionScore}/30\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🏆 ${winner}`
    );
  } catch (error) {
    console.error("Compare command error:", error);
    await ctx.reply("❌ Error comparing nodes. Try again later.");
  }
}
