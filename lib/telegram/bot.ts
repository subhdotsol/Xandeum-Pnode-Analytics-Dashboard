import { Telegraf } from "telegraf";

// Import command handlers
import { handlePrice } from "./commands/price";
import { handleNodes } from "./commands/nodes";
import { handleHealth } from "./commands/health";
import { handleNode } from "./commands/node";
import { handleTop } from "./commands/top";
import { handleVersion } from "./commands/version";
import { handleStats } from "./commands/stats";
import { handleCompare } from "./commands/compare";
import { handleSearch } from "./commands/search";
import { handleAsk } from "./commands/ask";

// Create bot instance
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

// Set bot description (shown before /start)
const botDescription = `🌐 What can this bot do?

📊 Real-time pNode Analytics — live network monitoring at your fingertips!

⚡ Instant access to network health, node stats, and XAND prices.

🤖 AI-Powered — ask XandAI anything about Xandeum!

🏆 Track top performers and version distribution across 250+ nodes.

🚀 Start exploring the Xandeum network now!`;

const shortDescription = "Real-time Xandeum pNode analytics, prices, and AI assistant";

// Set descriptions on bot startup
bot.telegram.setMyDescription(botDescription).catch(() => {});
bot.telegram.setMyShortDescription(shortDescription).catch(() => {});

// Register commands
bot.start((ctx) => ctx.reply(
  "🌐 Welcome to Xandeum pNode Analytics Bot!\n\n" +
  "Your real-time gateway to Xandeum network data.\n\n" +
  "🤖 AI ASSISTANT:\n" +
  "/ask <question> - Ask XandAI anything!\n\n" +
  "📊 Quick Commands:\n" +
  "/stats - Full dashboard overview\n" +
  "/price - XAND & SOL prices\n" +
  "/health - Network health score\n" +
  "/top - Top 10 nodes by Pod Credits\n\n" +
  "🔍 Node Commands:\n" +
  "/nodes - Network statistics\n" +
  "/node <pubkey> - Node details\n" +
  "/search <query> - Search nodes\n" +
  "/compare <n1> <n2> - Compare two nodes\n" +
  "/version - Version distribution\n\n" +
  "🔗 Dashboard: explorerxandeum.vercel.app"
));

bot.help((ctx) => ctx.reply(
  "📊 Xandeum pNode Bot Commands\n\n" +
  "━━━ AI ASSISTANT ━━━\n" +
  "/ask <question> - Ask XandAI\n\n" +
  "━━━ OVERVIEW ━━━\n" +
  "/stats - Full dashboard view\n" +
  "/health - Network health score\n" +
  "/nodes - Node count statistics\n\n" +
  "━━━ TOKENS ━━━\n" +
  "/price - XAND & SOL prices\n\n" +
  "━━━ LEADERBOARD ━━━\n" +
  "/top - Top 10 nodes\n" +
  "/version - Version distribution\n\n" +
  "━━━ NODE LOOKUP ━━━\n" +
  "/node <pubkey> - Get node details\n" +
  "/search <query> - Find nodes\n" +
  "/compare <n1> <n2> - Compare nodes\n\n" +
  "🔗 explorerxandeum.vercel.app"
));

// Basic commands
bot.command("price", handlePrice);
bot.command("nodes", handleNodes);
bot.command("health", handleHealth);
bot.command("node", handleNode);

// Advanced commands
bot.command("top", handleTop);
bot.command("version", handleVersion);
bot.command("stats", handleStats);
bot.command("compare", handleCompare);
bot.command("search", handleSearch);

// AI command
bot.command("ask", handleAsk);

export { bot };
