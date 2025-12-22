"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
    code: string;
    language?: string;
    filename?: string;
}

// Token types for syntax highlighting
type TokenType = 'key' | 'string' | 'number' | 'boolean' | 'null' | 'comment' | 'command' | 'flag' | 'url' | 'keyword' | 'plain';

interface Token {
    type: TokenType;
    value: string;
}

const tokenColors: Record<TokenType, string> = {
    key: 'text-sky-400',
    string: 'text-amber-300',
    number: 'text-purple-400',
    boolean: 'text-orange-400',
    null: 'text-gray-400',
    comment: 'text-gray-500',
    command: 'text-emerald-400',
    flag: 'text-sky-400',
    url: 'text-amber-300',
    keyword: 'text-purple-400',
    plain: '',
};

// Simple tokenizer for JSON
function tokenizeJSON(code: string): Token[] {
    const tokens: Token[] = [];
    const lines = code.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let remaining = line;

        while (remaining.length > 0) {
            // Check for comments
            const commentMatch = remaining.match(/^(\/\/.*)/);
            if (commentMatch) {
                tokens.push({ type: 'comment', value: commentMatch[1] });
                remaining = remaining.slice(commentMatch[1].length);
                continue;
            }

            // Check for key (quoted string followed by colon)
            const keyMatch = remaining.match(/^(\s*"[^"]+"\s*):/);
            if (keyMatch) {
                tokens.push({ type: 'key', value: keyMatch[1] + ':' });
                remaining = remaining.slice(keyMatch[0].length);
                continue;
            }

            // Check for string value
            const stringMatch = remaining.match(/^(\s*"[^"]*")/);
            if (stringMatch) {
                tokens.push({ type: 'string', value: stringMatch[1] });
                remaining = remaining.slice(stringMatch[1].length);
                continue;
            }

            // Check for number
            const numberMatch = remaining.match(/^(\s*-?\d+\.?\d*)/);
            if (numberMatch) {
                tokens.push({ type: 'number', value: numberMatch[1] });
                remaining = remaining.slice(numberMatch[1].length);
                continue;
            }

            // Check for boolean
            const boolMatch = remaining.match(/^(\s*)(true|false)/);
            if (boolMatch) {
                tokens.push({ type: 'plain', value: boolMatch[1] });
                tokens.push({ type: 'boolean', value: boolMatch[2] });
                remaining = remaining.slice(boolMatch[0].length);
                continue;
            }

            // Check for null
            const nullMatch = remaining.match(/^(\s*)(null)/);
            if (nullMatch) {
                tokens.push({ type: 'plain', value: nullMatch[1] });
                tokens.push({ type: 'null', value: nullMatch[2] });
                remaining = remaining.slice(nullMatch[0].length);
                continue;
            }

            // Default: take one character
            tokens.push({ type: 'plain', value: remaining[0] });
            remaining = remaining.slice(1);
        }

        if (i < lines.length - 1) {
            tokens.push({ type: 'plain', value: '\n' });
        }
    }

    return tokens;
}

// Simple tokenizer for bash/shell
function tokenizeBash(code: string): Token[] {
    const tokens: Token[] = [];
    const lines = code.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let remaining = line;
        let isStart = true;

        while (remaining.length > 0) {
            // Check for comments
            const commentMatch = remaining.match(/^(#.*)/);
            if (commentMatch) {
                tokens.push({ type: 'comment', value: commentMatch[1] });
                remaining = remaining.slice(commentMatch[1].length);
                continue;
            }

            // Check for command at start
            if (isStart) {
                const commandMatch = remaining.match(/^(git|npm|pnpm|npx|cd|cp|curl|node)\b/);
                if (commandMatch) {
                    tokens.push({ type: 'command', value: commandMatch[1] });
                    remaining = remaining.slice(commandMatch[1].length);
                    isStart = false;
                    continue;
                }
            }

            // Check for flags
            const flagMatch = remaining.match(/^(\s)(-{1,2}[\w-]+)/);
            if (flagMatch) {
                tokens.push({ type: 'plain', value: flagMatch[1] });
                tokens.push({ type: 'flag', value: flagMatch[2] });
                remaining = remaining.slice(flagMatch[0].length);
                continue;
            }

            // Check for URLs
            const urlMatch = remaining.match(/^(https?:\/\/[^\s]+)/);
            if (urlMatch) {
                tokens.push({ type: 'url', value: urlMatch[1] });
                remaining = remaining.slice(urlMatch[1].length);
                continue;
            }

            // Check for quoted strings
            const stringMatch = remaining.match(/^"([^"]*)"/);
            if (stringMatch) {
                tokens.push({ type: 'string', value: `"${stringMatch[1]}"` });
                remaining = remaining.slice(stringMatch[0].length);
                continue;
            }

            // Default: take one character
            if (remaining[0] !== ' ') isStart = false;
            tokens.push({ type: 'plain', value: remaining[0] });
            remaining = remaining.slice(1);
        }

        if (i < lines.length - 1) {
            tokens.push({ type: 'plain', value: '\n' });
        }
    }

    return tokens;
}

function renderTokens(tokens: Token[]): React.ReactNode {
    return tokens.map((token, idx) => {
        const colorClass = tokenColors[token.type];
        if (colorClass) {
            return <span key={idx} className={colorClass}>{token.value}</span>;
        }
        return <span key={idx}>{token.value}</span>;
    });
}

export function CodeBlock({ code, language = "typescript", filename }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    // Tokenize and render based on language
    let renderedCode: React.ReactNode;
    if (language === "json") {
        renderedCode = renderTokens(tokenizeJSON(code));
    } else if (language === "bash" || language === "shell") {
        renderedCode = renderTokens(tokenizeBash(code));
    } else {
        // Default: just render as plain text
        renderedCode = code;
    }

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
                    <code className="font-mono">{renderedCode}</code>
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
