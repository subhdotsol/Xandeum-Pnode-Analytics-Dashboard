import { Telegraf } from "telegraf";

// Import command handlers
import { handlePrice } from "./commands/price";
import { handleNodes } from "./commands/nodes";
import { handleHealth } from "./commands/health";
import { handleNode } from "./commands/node";

// Create bot instance
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

// Register commands
bot.start((ctx) => ctx.reply(
  "🌐 Welcome to Xandeum pNode Analytics Bot!\n\n" +
  "Commands:\n" +
  "/price - XAND & SOL prices\n" +
  "/nodes - Network statistics\n" +
  "/health - Network health score\n" +
  "/node <pubkey> - Node details\n\n" +
  "🔗 Dashboard: explorerxandeum.vercel.app"
));

bot.help((ctx) => ctx.reply(
  "📊 Xandeum pNode Bot Commands:\n\n" +
  "/price - Get current XAND and SOL prices\n" +
  "/nodes - Get network node statistics\n" +
  "/health - Get network health score\n" +
  "/node <pubkey> - Get details for a specific node\n\n" +
  "Example: /node EcTqXgB6VJ..."
));

bot.command("price", handlePrice);
bot.command("nodes", handleNodes);
bot.command("health", handleHealth);
bot.command("node", handleNode);

export { bot };
