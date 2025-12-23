import { Context } from "telegraf";

export async function handlePrice(ctx: Context) {
  try {
    // Send "typing" indicator
    await ctx.sendChatAction("typing");
    
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana,xandeum&vs_currencies=usd"
    );
    const data = await response.json();
    
    const solPrice = data.solana?.usd || 0;
    const xandPrice = data.xandeum?.usd || 0;
    const rate = xandPrice > 0 ? (solPrice / xandPrice).toFixed(0) : "N/A";
    
    await ctx.replyWithMarkdownV2(
      escapeMarkdown(`💰 Token Prices\n\n` +
      `SOL: $${solPrice.toFixed(2)}\n` +
      `XAND: $${xandPrice.toFixed(6)}\n` +
      `Rate: 1 SOL = ${rate} XAND\n\n` +
      `🔗 Trade on Jupiter: jup.ag/swap/SOL-XAND`)
    );
  } catch (error) {
    console.error("Price command error:", error);
    await ctx.reply("❌ Error fetching prices. Try again later.");
  }
}

// Helper to escape special characters for MarkdownV2
function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}
