"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
};

const faqs = [
    {
        category: "General",
        color: "text-sky-500",
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
        color: "text-emerald-500",
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
        category: "Technical",
        color: "text-violet-500",
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

function FAQItem({ q, a, index, accentColor }: { q: string; a: string; index: number; accentColor: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            className="border-b border-border last:border-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-4 text-left group"
            >
                <span className={`text-sm font-medium group-hover:${accentColor} transition-colors pr-4`}>{q}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className={`w-4 h-4 ${isOpen ? accentColor : 'text-muted-foreground'} flex-shrink-0`} />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-4 text-sm text-muted-foreground">{a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function FAQPage() {
    return (
        <motion.article {...fadeIn}>
            <header className="mb-8 border-b border-border pb-4">
                <h1 className="text-2xl font-bold tracking-tight mb-2">FAQ</h1>
                <p className="text-muted-foreground">
                    Frequently asked questions about the dashboard.
                </p>
            </header>

            {faqs.map((category, catIdx) => (
                <motion.section
                    key={category.category}
                    className="mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: catIdx * 0.1, duration: 0.3 }}
                >
                    <h2 className={`text-sm font-semibold mb-3 ${category.color}`}>{category.category}</h2>
                    <div className="rounded-lg border border-border px-4">
                        {category.questions.map((faq, idx) => (
                            <FAQItem key={idx} q={faq.q} a={faq.a} index={idx} accentColor={category.color} />
                        ))}
                    </div>
                </motion.section>
            ))}

            <motion.div
                className="mt-8 rounded-lg border border-border bg-muted/30 p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
            >
                <h3 className="font-medium text-sm mb-2 text-amber-500">Still have questions?</h3>
                <p className="text-sm text-muted-foreground">
                    Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs border border-border text-sky-400">⌘I</kbd> to ask XandAI.
                </p>
            </motion.div>
        </motion.article>
    );
}
