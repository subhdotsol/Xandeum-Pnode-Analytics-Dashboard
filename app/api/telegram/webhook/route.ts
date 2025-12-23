import { NextRequest, NextResponse } from "next/server";
import { bot } from "@/lib/telegram/bot";

export async function POST(req: NextRequest) {
  try {
    // Verify webhook secret for security
    const secret = req.headers.get("X-Telegram-Bot-Api-Secret-Token");
    if (process.env.TELEGRAM_WEBHOOK_SECRET && secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
      console.warn("[Telegram Webhook] Invalid secret token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    console.log("[Telegram Webhook] Received update:", body.update_id);
    
    // Handle the update with Telegraf
    await bot.handleUpdate(body);
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Telegram Webhook] Error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: "ok", 
    bot: "Xandeum pNode Analytics Bot",
    commands: ["/price", "/nodes", "/health", "/node <pubkey>"]
  });
}
