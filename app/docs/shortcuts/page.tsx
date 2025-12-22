"use client";

import { motion } from "framer-motion";

const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
};

const shortcuts = [
    {
        category: "Navigation",
        color: "text-sky-500",
        items: [
            { keys: ["⌘", "J"], label: "Open Spotlight Search", description: "Quick navigation to any page" },
            { keys: ["⌘", "K"], label: "Toggle Sidebar", description: "Show or hide navigation" },
        ],
    },
    {
        category: "Features",
        color: "text-violet-500",
        items: [
            { keys: ["⌘", "I"], label: "Open AI Assistant", description: "Ask XandAI a question" },
            { keys: ["⌘", "D"], label: "Toggle Theme", description: "Switch dark/light mode" },
        ],
    },
    {
        category: "Spotlight Search",
        color: "text-emerald-500",
        items: [
            { keys: ["↑", "↓"], label: "Navigate Results", description: "Move between items" },
            { keys: ["↵"], label: "Select Result", description: "Go to selected page" },
            { keys: ["Esc"], label: "Close", description: "Close spotlight" },
        ],
    },
];

function KeyBadge({ children, color }: { children: React.ReactNode; color: string }) {
    return (
        <kbd className={`inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-zinc-900 border border-zinc-700 rounded text-xs font-mono ${color}`}>
            {children}
        </kbd>
    );
}

export default function ShortcutsPage() {
    return (
        <motion.article {...fadeIn}>
            <header className="mb-8 border-b border-border pb-4">
                <h1 className="text-2xl font-bold tracking-tight mb-2">Keyboard Shortcuts</h1>
                <p className="text-muted-foreground">
                    Navigate faster with keyboard shortcuts.
                </p>
            </header>

            <div className="text-sm text-muted-foreground mb-6 p-3 rounded-lg bg-muted/30 border border-border">
                <strong className="text-foreground">Note:</strong> Use <KeyBadge color="text-sky-400">⌘</KeyBadge> on Mac and <KeyBadge color="text-sky-400">Ctrl</KeyBadge> on Windows/Linux.
            </div>

            {shortcuts.map((category, catIdx) => (
                <motion.section
                    key={category.category}
                    className="mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: catIdx * 0.1, duration: 0.3 }}
                >
                    <h2 className={`text-sm font-semibold mb-3 ${category.color}`}>{category.category}</h2>
                    <div className="rounded-lg border border-border overflow-hidden">
                        {category.items.map((item, idx) => (
                            <motion.div
                                key={idx}
                                className="flex items-center justify-between p-3 border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: catIdx * 0.1 + idx * 0.05 }}
                            >
                                <div>
                                    <p className={`text-sm font-medium ${category.color}`}>{item.label}</p>
                                    <p className="text-xs text-muted-foreground">{item.description}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    {item.keys.map((key, kIdx) => (
                                        <span key={kIdx} className="flex items-center">
                                            <KeyBadge color={category.color}>{key}</KeyBadge>
                                            {kIdx < item.keys.length - 1 && (
                                                <span className="text-muted-foreground mx-0.5 text-xs">+</span>
                                            )}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
            ))}

            <motion.div
                className="mt-8 grid grid-cols-2 gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
            >
                <div className="rounded-lg border border-border p-3 text-center hover:bg-muted/30 transition-colors">
                    <div className="flex justify-center gap-1 mb-2">
                        <KeyBadge color="text-sky-400">⌘</KeyBadge>
                        <KeyBadge color="text-sky-400">J</KeyBadge>
                    </div>
                    <p className="text-xs text-sky-500">Search</p>
                </div>
                <div className="rounded-lg border border-border p-3 text-center hover:bg-muted/30 transition-colors">
                    <div className="flex justify-center gap-1 mb-2">
                        <KeyBadge color="text-violet-400">⌘</KeyBadge>
                        <KeyBadge color="text-violet-400">I</KeyBadge>
                    </div>
                    <p className="text-xs text-violet-500">AI</p>
                </div>
            </motion.div>
        </motion.article>
    );
}
