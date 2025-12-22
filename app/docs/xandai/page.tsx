"use client";

import { motion } from "framer-motion";

const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
};

const useCases = [
    { category: "Network Questions", example: "What is Xandeum? How do pNodes work?" },
    { category: "Token Info", example: "What is XAND? Where can I buy it?" },
    { category: "Dashboard Help", example: "How do I read the analytics charts?" },
    { category: "Technical Concepts", example: "Explain the health scoring algorithm" },
    { category: "Troubleshooting", example: "Why is my node showing as offline?" },
];

const examples = [
    "What is Xandeum?",
    "How do pNodes work?",
    "What is the XAND token used for?",
    "How is network health calculated?",
];

const technicalDetails = [
    { label: "AI Model", value: "Google Gemini 2.5 Flash" },
    { label: "Response Time", value: "1-3 seconds" },
    { label: "Context", value: "Live pNode data access" },
];

const quickPrompts = [
    { emoji: "💡", text: "What is Xandeum?" },
    { emoji: "🔧", text: "How do pNodes work?" },
    { emoji: "🪙", text: "What is XAND token?" },
];

export default function XandAIDocsPage() {
    return (
        <motion.article {...fadeIn}>
            <header className="mb-8 border-b border-border pb-4">
                <h1 className="text-2xl font-bold tracking-tight mb-2">XandAI</h1>
                <p className="text-muted-foreground">
                    AI assistant for Xandeum questions, powered by Google Gemini.
                </p>
            </header>

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4">How to Use</h2>
                <div className="rounded-lg border border-border p-4 bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-2">
                        Open with keyboard shortcut:
                    </p>
                    <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono">⌘</kbd>
                        <span className="text-muted-foreground">+</span>
                        <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono">I</kbd>
                        <span className="text-sm text-muted-foreground ml-2">or click "Ask AI" button</span>
                    </div>
                </div>
            </motion.section>

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4">What Can XandAI Help With?</h2>
                <div className="space-y-2">
                    {useCases.map((useCase, idx) => (
                        <motion.div
                            key={idx}
                            className="rounded-lg border border-border p-3"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + idx * 0.05 }}
                        >
                            <span className="text-sm font-medium">{useCase.category}</span>
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
                <h2 className="text-lg font-semibold mb-4">Example Questions</h2>
                <div className="rounded-lg border border-border p-4">
                    <ul className="space-y-2">
                        {examples.map((example, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground">
                                "{example}"
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
                <h2 className="text-lg font-semibold mb-4">Quick Prompts</h2>
                <div className="flex flex-wrap gap-2">
                    {quickPrompts.map((prompt, idx) => (
                        <span key={idx} className="text-xs bg-muted px-3 py-1.5 rounded-full">
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
                <h2 className="text-lg font-semibold mb-4">Technical Details</h2>
                <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm">
                        <tbody>
                            {technicalDetails.map((detail) => (
                                <tr key={detail.label} className="border-b border-border last:border-0">
                                    <td className="p-3 font-medium">{detail.label}</td>
                                    <td className="p-3 text-muted-foreground">{detail.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.section>
        </motion.article>
    );
}
