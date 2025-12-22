"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
    code: string;
    language?: string;
    filename?: string;
}

// Simple syntax highlighting for JSON and common code patterns
function highlightCode(code: string, language: string): React.ReactNode {
    if (language === "json") {
        return highlightJSON(code);
    }
    if (language === "bash" || language === "shell") {
        return highlightBash(code);
    }
    // Default: minimal highlighting
    return highlightDefault(code);
}

function highlightJSON(code: string): React.ReactNode {
    const lines = code.split('\n');
    return lines.map((line, i) => {
        const highlighted = line
            // Keys (before colon)
            .replace(/"([^"]+)"(?=\s*:)/g, '<span class="text-sky-400">"$1"</span>')
            // String values (after colon)
            .replace(/:\s*"([^"]+)"/g, ': <span class="text-amber-300">"$1"</span>')
            // Numbers
            .replace(/:\s*(\d+\.?\d*)/g, ': <span class="text-purple-400">$1</span>')
            // Booleans
            .replace(/:\s*(true|false)/g, ': <span class="text-orange-400">$1</span>')
            // null
            .replace(/:\s*(null)/g, ': <span class="text-gray-400">$1</span>')
            // Comments
            .replace(/(\/\/.*)$/g, '<span class="text-gray-500">$1</span>');

        return (
            <span key={i} dangerouslySetInnerHTML={{ __html: highlighted + (i < lines.length - 1 ? '\n' : '') }} />
        );
    });
}

function highlightBash(code: string): React.ReactNode {
    const lines = code.split('\n');
    return lines.map((line, i) => {
        const highlighted = line
            // Comments
            .replace(/(#.*)$/g, '<span class="text-gray-500">$1</span>')
            // Commands at start
            .replace(/^(git|npm|pnpm|npx|cd|cp|curl|node)\b/g, '<span class="text-emerald-400">$1</span>')
            // Flags
            .replace(/(\s-{1,2}[\w-]+)/g, '<span class="text-sky-400">$1</span>')
            // URLs
            .replace(/(https?:\/\/[^\s]+)/g, '<span class="text-amber-300">$1</span>')
            // Strings
            .replace(/"([^"]+)"/g, '<span class="text-amber-300">"$1"</span>');

        return (
            <span key={i} dangerouslySetInnerHTML={{ __html: highlighted + (i < lines.length - 1 ? '\n' : '') }} />
        );
    });
}

function highlightDefault(code: string): React.ReactNode {
    const lines = code.split('\n');
    return lines.map((line, i) => {
        const highlighted = line
            // Comments
            .replace(/(\/\/.*)$/g, '<span class="text-gray-500">$1</span>')
            // Strings
            .replace(/"([^"]+)"/g, '<span class="text-amber-300">"$1"</span>')
            // Keywords
            .replace(/\b(const|let|var|function|return|import|export|from|async|await)\b/g, '<span class="text-purple-400">$1</span>')
            // Numbers
            .replace(/\b(\d+\.?\d*)\b/g, '<span class="text-orange-400">$1</span>');

        return (
            <span key={i} dangerouslySetInnerHTML={{ __html: highlighted + (i < lines.length - 1 ? '\n' : '') }} />
        );
    });
}

export function CodeBlock({ code, language = "typescript", filename }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const highlightedCode = useMemo(() => highlightCode(code, language), [code, language]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className="relative group rounded-lg border border-border overflow-hidden my-4">
            {filename && (
                <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
                    <span className="text-xs font-mono text-muted-foreground">{filename}</span>
                    <button
                        onClick={handleCopy}
                        className="p-1.5 rounded-md hover:bg-muted transition-colors"
                        aria-label="Copy code"
                    >
                        <AnimatePresence mode="wait">
                            {copied ? (
                                <motion.div
                                    key="check"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                >
                                    <Check className="w-4 h-4 text-green-500" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="copy"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                >
                                    <Copy className="w-4 h-4 text-muted-foreground" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            )}
            <div className="relative">
                <pre className="p-4 overflow-x-auto text-sm bg-zinc-950 dark:bg-zinc-900/50">
                    <code className={`language-${language} font-mono`}>{highlightedCode}</code>
                </pre>
                {!filename && (
                    <button
                        onClick={handleCopy}
                        className="absolute top-2 right-2 p-1.5 rounded-md bg-zinc-800/50 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-zinc-700"
                        aria-label="Copy code"
                    >
                        <AnimatePresence mode="wait">
                            {copied ? (
                                <motion.div
                                    key="check"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                >
                                    <Check className="w-4 h-4 text-green-500" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="copy"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                >
                                    <Copy className="w-4 h-4 text-zinc-400" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                )}
            </div>
        </div>
    );
}
