"use client";

import { motion } from "framer-motion";

const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
};

const useCases = [
    { category: "Network Questions", example: "What is Xandeum? How do pNodes work?", color: "text-sky-500" },
    { category: "Token Info", example: "What is XAND? Where can I buy it?", color: "text-amber-500" },
    { category: "Dashboard Help", example: "How do I read the analytics charts?", color: "text-violet-500" },
    { category: "Technical Concepts", example: "Explain the health scoring algorithm", color: "text-emerald-500" },
    { category: "Troubleshooting", example: "Why is my node showing as offline?", color: "text-rose-500" },
];

const examples = [
    { text: "What is Xandeum?", color: "text-sky-400" },
    { text: "How do pNodes work?", color: "text-violet-400" },
    { text: "What is the XAND token used for?", color: "text-amber-400" },
    { text: "How is network health calculated?", color: "text-emerald-400" },
];

const technicalDetails = [
    { label: "AI Model", value: "Google Gemini 2.5 Flash", color: "text-sky-400" },
    { label: "Response Time", value: "1-3 seconds", color: "text-violet-400" },
    { label: "Context", value: "Live pNode data access", color: "text-emerald-400" },
];

const quickPrompts = [
    { emoji: "💡", text: "What is Xandeum?", color: "text-sky-400" },
    { emoji: "🔧", text: "How do pNodes work?", color: "text-violet-400" },
    { emoji: "🪙", text: "What is XAND token?", color: "text-amber-400" },
];

export default function XandAIDocsPage() {
    return (
        <motion.article {...fadeIn}>
            <header className="mb-8 border-b border-border pb-4">
                <h1 className="text-2xl font-bold tracking-tight mb-2">XandAI</h1>
                <p className="text-muted-foreground">
                    AI assistant for Xandeum questions, powered by <span className="text-sky-400 font-medium">Google Gemini</span>.
                </p>
            </header>

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4 text-violet-500">How to Use</h2>
                <div className="rounded-lg border border-border p-4 bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-2">
                        Open with keyboard shortcut:
                    </p>
                    <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-xs font-mono text-violet-400">⌘</kbd>
                        <span className="text-muted-foreground">+</span>
                        <kbd className="px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-xs font-mono text-violet-400">I</kbd>
                        <span className="text-sm text-muted-foreground ml-2">or click <span className="text-violet-400">"Ask AI"</span> button</span>
                    </div>
                </div>
            </motion.section>

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4 text-sky-500">What Can XandAI Help With?</h2>
                <div className="space-y-2">
                    {useCases.map((useCase, idx) => (
                        <motion.div
                            key={idx}
                            className="rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + idx * 0.05 }}
                        >
                            <span className={`text-sm font-medium ${useCase.color}`}>{useCase.category}</span>
                            <p className="text-xs text-muted-foreground mt-1">{useCase.example}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4 text-amber-500">Example Questions</h2>
                <div className="rounded-lg border border-border p-4">
                    <ul className="space-y-2">
                        {examples.map((example, idx) => (
                            <li key={idx} className={`text-sm ${example.color}`}>
                                "{example.text}"
                            </li>
                        ))}
                    </ul>
                </div>
            </motion.section>

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4 text-emerald-500">Quick Prompts</h2>
                <div className="flex flex-wrap gap-2">
                    {quickPrompts.map((prompt, idx) => (
                        <span key={idx} className={`text-xs bg-muted px-3 py-1.5 rounded-full ${prompt.color}`}>
                            {prompt.emoji} {prompt.text}
                        </span>
                    ))}
                </div>
            </motion.section>

            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4 text-rose-500">Technical Details</h2>
                <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm">
                        <tbody>
                            {technicalDetails.map((detail) => (
                                <tr key={detail.label} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                                    <td className="p-3 font-medium">{detail.label}</td>
                                    <td className={`p-3 ${detail.color}`}>{detail.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.section>
        </motion.article>
    );
}
