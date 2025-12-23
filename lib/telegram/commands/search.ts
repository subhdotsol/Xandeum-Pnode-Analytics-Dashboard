import { Context, NarrowedContext } from "telegraf";
import { Message, Update } from "telegraf/types";
import { pnodeClient } from "@/lib/pnode-client";

type TextContext = NarrowedContext<Context<Update>, Update.MessageUpdate<Message.TextMessage>>;

export async function handleSearch(ctx: TextContext) {
  try {
    const text = ctx.message.text;
    const query = text.replace("/search", "").trim();
    
    if (!query) {
      await ctx.reply(
        "Usage: /search <query>\n\n" +
        "Search by pubkey, IP address, or version.\n\n" +
        "Examples:\n" +
        "/search EcTqXgB6\n" +
        "/search 173.212\n" +
        "/search 0.8.0"
      );
      return;
    }
    
    await ctx.sendChatAction("typing");
    
    const pnodes = await pnodeClient.getAllPNodes();
    
    // Search nodes
    const results = pnodes.filter((n: any) => 
      n.pubkey?.toLowerCase().includes(query.toLowerCase()) || 
      n.address?.includes(query) ||
      n.version?.includes(query)
    ).slice(0, 5) as any[];
    
    if (results.length === 0) {
      await ctx.reply(`🔍 No nodes found matching: "${query}"`);
      return;
    }
    
    const resultList = results.map((node: any, i: number) => {
      const now = Math.floor(Date.now() / 1000);
      const minutesAgo = (now - node.last_seen_timestamp) / 60;
      const status = minutesAgo < 5 ? "🟢" : minutesAgo < 60 ? "🟡" : "🔴";
      return `${i + 1}. ${status} ${node.pubkey?.slice(0, 12)}...\n   📍 ${node.address} | v${node.version}`;
    }).join("\n\n");
    
    await ctx.reply(
      `🔍 Search Results for "${query}"\n\n` +
      `Found ${results.length} node${results.length > 1 ? "s" : ""}:\n\n` +
      `${resultList}\n\n` +
      `💡 Use /node <pubkey> for details`
    );
  } catch (error) {
    console.error("Search command error:", error);
    await ctx.reply("❌ Error searching nodes. Try again later.");
  }
}
