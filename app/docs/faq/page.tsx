"use client";

import { HelpCircle, MessageCircle, ChevronDown, ChevronUp, Server, BarChart3, Coins, Bot, Map, Shield, Zap } from "lucide-react";
import { useState } from "react";

const faqs = [
    {
        category: "General",
        color: "from-blue-500 to-cyan-500",
        icon: HelpCircle,
        questions: [
            {
                q: "What is the Xandeum pNode Analytics Dashboard?",
                a: "A real-time monitoring platform for the Xandeum distributed storage network. It tracks 250+ pNodes, shows network health, and provides historical analytics.",
            },
            {
                q: "Is this an official Xandeum project?",
                a: "This is a community-built dashboard that uses public pNode RPC endpoints. It's not officially maintained by the Xandeum team.",
            },
            {
                q: "How often is the data updated?",
                a: "Live data refreshes every 30 seconds. Historical snapshots are collected every 5 minutes via automated GitHub Actions.",
            },
        ],
    },
    {
        category: "pNodes",
        color: "from-green-500 to-emerald-500",
        icon: Server,
        questions: [
            {
                q: "What is a pNode?",
                a: "A pNode (Persistent Node) is a distributed storage node in the Xandeum network. It stores blockchain state data and helps scale Solana.",
            },
            {
                q: "What are Pod Credits?",
                a: "A scoring system based on: Uptime (40 points), RPC availability (30 points), and Version compliance (30 points). Max score is 100.",
            },
            {
                q: "How do I run my own pNode?",
                a: "Visit the official Xandeum documentation at xandeum.com for pNode setup instructions and hardware requirements.",
            },
        ],
    },
    {
        category: "Analytics",
        color: "from-purple-500 to-pink-500",
        icon: BarChart3,
        questions: [
            {
                q: "What data is shown in Historical Analytics?",
                a: "Node population trends, online/offline counts, average CPU & RAM usage, total storage capacity, and version distribution over time.",
            },
            {
                q: "How far back does historical data go?",
                a: "Data is stored indefinitely in Supabase. The free tier provides 500MB which can hold years of snapshot data (each snapshot is ~500 bytes).",
            },
            {
                q: "Why is CPU/RAM data sometimes zero?",
                a: "Performance stats are sampled from 5 random nodes every 5 minutes. If those nodes don't respond, values may be zero for that snapshot.",
            },
        ],
    },
    {
        category: "DeFi & Staking",
        color: "from-orange-500 to-amber-500",
        icon: Coins,
        questions: [
            {
                q: "How does liquid staking work?",
                a: "You stake SOL and receive XANDsol tokens. The exchange rate is calculated from live market prices (SOL/XAND ratio from CoinGecko).",
            },
            {
                q: "What wallet do I need?",
                a: "Any Solana wallet: Phantom, Solflare, Coinbase Wallet, or other Solana Wallet Adapter compatible wallets.",
            },
            {
                q: "Where do token prices come from?",
                a: "SOL and XAND prices are fetched from CoinGecko API. DEX liquidity data comes from Raydium. All cached for 60 seconds.",
            },
        ],
    },
    {
        category: "AI Assistant",
        color: "from-violet-500 to-purple-500",
        icon: Bot,
        questions: [
            {
                q: "What can XandAI answer?",
                a: "Questions about network stats, node rankings, Xandeum technology, XAND token, and general blockchain topics.",
            },
            {
                q: "Does XandAI have access to live data?",
                a: "Yes! XandAI receives current network analytics and can answer questions about specific nodes, version distribution, etc.",
            },
            {
                q: "How do I open XandAI?",
                a: "Click the 'Ask AI' button in the bottom-right corner, or press Cmd+I (Mac) or Ctrl+I (Windows/Linux).",
            },
        ],
    },
    {
        category: "Technical",
        color: "from-red-500 to-rose-500",
        icon: Zap,
        questions: [
            {
                q: "What tech stack is this built with?",
                a: "Next.js 15, TypeScript, TailwindCSS, Framer Motion, Recharts, Leaflet, Supabase, Upstash Redis, Google Gemini AI.",
            },
            {
                q: "Is the source code available?",
                a: "Yes! The project is open-source on GitHub. Contributions are welcome.",
            },
            {
                q: "How do I self-host this dashboard?",
                a: "Fork the repo, add your API keys (Gemini, Alchemy, Supabase), and deploy to Vercel. See the Contributing docs for details.",
            },
        ],
    },
];

function FAQItem({ q, a }: { q: string; a: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-border last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-4 text-left hover:text-primary transition-colors"
            >
                <span className="font-medium pr-4">{q}</span>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                )}
            </button>
            {isOpen && (
                <div className="pb-4 text-sm text-muted-foreground">
                    {a}
                </div>
            )}
        </div>
    );
}

export default function FAQPage() {
    return (
        <article>
            <header className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                        <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">FAQ</h1>
                </div>
                <p className="text-lg text-muted-foreground">
                    Frequently asked questions about the pNode Analytics Dashboard.
                </p>
            </header>

            {faqs.map((category) => {
                const Icon = category.icon;
                return (
                    <section key={category.category} className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <div className={`p-1.5 rounded-lg bg-gradient-to-br ${category.color}`}>
                                <Icon className="w-4 h-4 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold">{category.category}</h2>
                        </div>
                        <div className="bg-card border border-border rounded-lg overflow-hidden">
                            <div className={`h-1 bg-gradient-to-r ${category.color}`} />
                            <div className="px-4">
                                {category.questions.map((faq, idx) => (
                                    <FAQItem key={idx} q={faq.q} a={faq.a} />
                                ))}
                            </div>
                        </div>
                    </section>
                );
            })}

            {/* Still have questions */}
            <section className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-lg p-6 text-center">
                <Bot className="w-8 h-8 text-violet-500 mx-auto mb-3" />
                <h2 className="text-xl font-semibold mb-2 text-violet-600 dark:text-violet-400">Still Have Questions?</h2>
                <p className="text-muted-foreground mb-4">
                    Ask XandAI! Press <kbd className="px-2 py-0.5 bg-muted rounded text-xs">⌘I</kbd> to open the AI assistant.
                </p>
            </section>
        </article>
    );
}
