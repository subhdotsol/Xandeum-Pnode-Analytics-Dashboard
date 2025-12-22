"use client";

import { Keyboard, Command, Search, Bot, Sun, PanelLeft, ArrowUp, ArrowDown, CornerDownLeft } from "lucide-react";

const shortcuts = [
    {
        category: "Navigation",
        color: "from-blue-500 to-cyan-500",
        items: [
            {
                keys: ["⌘", "J"],
                windowsKeys: ["Ctrl", "J"],
                label: "Open Spotlight Search",
                description: "Quick navigation to any page or documentation",
                icon: Search,
            },
            {
                keys: ["⌘", "K"],
                windowsKeys: ["Ctrl", "K"],
                label: "Toggle Sidebar",
                description: "Show or hide the navigation sidebar",
                icon: PanelLeft,
            },
        ],
    },
    {
        category: "Features",
        color: "from-purple-500 to-pink-500",
        items: [
            {
                keys: ["⌘", "I"],
                windowsKeys: ["Ctrl", "I"],
                label: "Open AI Assistant",
                description: "Ask XandAI about network stats and Xandeum",
                icon: Bot,
            },
            {
                keys: ["⌘", "D"],
                windowsKeys: ["Ctrl", "D"],
                label: "Toggle Theme",
                description: "Switch between dark and light mode",
                icon: Sun,
            },
        ],
    },
    {
        category: "Spotlight Search",
        color: "from-orange-500 to-amber-500",
        items: [
            {
                keys: ["↑", "↓"],
                windowsKeys: ["↑", "↓"],
                label: "Navigate Results",
                description: "Move up and down through search results",
                icon: ArrowUp,
            },
            {
                keys: ["↵"],
                windowsKeys: ["↵"],
                label: "Select Result",
                description: "Go to the selected page",
                icon: CornerDownLeft,
            },
            {
                keys: ["Esc"],
                windowsKeys: ["Esc"],
                label: "Close",
                description: "Close spotlight search",
                icon: Command,
            },
        ],
    },
];

function KeyBadge({ children }: { children: React.ReactNode }) {
    return (
        <kbd className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 bg-muted border border-border rounded-md text-xs font-mono shadow-sm">
            {children}
        </kbd>
    );
}

export default function ShortcutsPage() {
    return (
        <article>
            <header className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500">
                        <Keyboard className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Keyboard Shortcuts</h1>
                </div>
                <p className="text-lg text-muted-foreground">
                    Navigate faster with these keyboard shortcuts.
                </p>
            </header>

            {/* Tip */}
            <div className="mb-8 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-sm text-green-600 dark:text-green-400">
                    <strong>Pro tip:</strong> All shortcuts use <KeyBadge>⌘</KeyBadge> on Mac and <KeyBadge>Ctrl</KeyBadge> on Windows/Linux.
                </p>
            </div>

            {shortcuts.map((category) => (
                <section key={category.category} className="mb-8">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${category.color}`} />
                        {category.category}
                    </h2>
                    <div className="space-y-3">
                        {category.items.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <div key={idx} className="bg-card border border-border rounded-lg overflow-hidden">
                                    <div className={`h-1 bg-gradient-to-r ${category.color}`} />
                                    <div className="p-4 flex items-center gap-4">
                                        <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color} flex-shrink-0`}>
                                            <Icon className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium">{item.label}</h3>
                                            <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                                        </div>
                                        <div className="flex items-center gap-4 flex-shrink-0">
                                            {/* Mac */}
                                            <div className="hidden sm:flex items-center gap-1">
                                                {item.keys.map((key, kIdx) => (
                                                    <span key={kIdx} className="flex items-center">
                                                        <KeyBadge>{key}</KeyBadge>
                                                        {kIdx < item.keys.length - 1 && <span className="text-muted-foreground mx-0.5">+</span>}
                                                    </span>
                                                ))}
                                            </div>
                                            {/* Show simplified on mobile */}
                                            <div className="sm:hidden flex items-center gap-1">
                                                {item.keys.map((key, kIdx) => (
                                                    <KeyBadge key={kIdx}>{key}</KeyBadge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            ))}

            {/* Quick Reference Card */}
            <section className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-violet-600 dark:text-violet-400">Quick Reference</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                            <KeyBadge>⌘</KeyBadge>
                            <KeyBadge>J</KeyBadge>
                        </div>
                        <span className="text-sm">Search</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                            <KeyBadge>⌘</KeyBadge>
                            <KeyBadge>I</KeyBadge>
                        </div>
                        <span className="text-sm">AI</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                            <KeyBadge>⌘</KeyBadge>
                            <KeyBadge>K</KeyBadge>
                        </div>
                        <span className="text-sm">Sidebar</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                            <KeyBadge>⌘</KeyBadge>
                            <KeyBadge>D</KeyBadge>
                        </div>
                        <span className="text-sm">Theme</span>
                    </div>
                </div>
            </section>
        </article>
    );
}
