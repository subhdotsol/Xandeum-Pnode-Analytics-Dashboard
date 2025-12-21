import { NextResponse } from "next/server";

// Use gemini-2.5-flash model (has separate quota from 2.0)
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const SYSTEM_CONTEXT = `You are "XandAI", a helpful AI assistant for the Xandeum pNode Analytics Dashboard.

About Xandeum:
- Xandeum is a decentralized distributed storage layer built on Solana
- pNodes (persistent nodes) are individual nodes that store and serve data chunks
- The network uses peer-to-peer discovery where each pNode maintains knowledge of other active pNodes
- XAND is the governance token (address: XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx)
- pNodes report health through timestamps, version info, and availability metrics

Dashboard Features:
- Dashboard: Real-time network overview with health scoring
- Analytics: Historical charts showing network trends
- Leaderboard: Node rankings by uptime, CPU, and storage
- Map: Interactive global node distribution
- Directory: Full node registry with filtering and pagination
- Swap: Trade XAND tokens via Jupiter
- Stake: Stake SOL to receive XANDsol (liquid staking)

Health Classification:
- Healthy (green): Last seen < 5 minutes ago
- Degraded (yellow): Last seen < 1 hour ago  
- Offline (red): Last seen > 1 hour ago

Keep responses concise, helpful, and focused on Xandeum/pNodes.`;

export async function POST(request: Request) {
    try {
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
        }

        // Use direct REST API call instead of SDK
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: `${SYSTEM_CONTEXT}\n\nUser question: ${message}` }]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500,
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API error:", errorText);
            return NextResponse.json({ error: "AI service error" }, { status: 500 });
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

        return NextResponse.json({ 
            success: true,
            response: text 
        });
    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json(
            { error: "Failed to generate response" },
            { status: 500 }
        );
    }
}
