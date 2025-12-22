"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export function AiAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Hide button until dashboard loads completely
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsMounted(true);
        }, 3000); // Show after 3 seconds to ensure data is loaded

        return () => clearTimeout(timer);
    }, []);

    // Auto-focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            // Small delay to ensure the animation completes
            setTimeout(() => {
                inputRef.current?.focus();
            }, 150);
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await response.json();

            if (data.success && data.response) {
                setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
            } else {
                setMessages(prev => [...prev, { role: "assistant", content: data.error || "Sorry, I encountered an error. Please try again." }]);
            }
        } catch {
            setMessages(prev => [...prev, { role: "assistant", content: "Network error. Please check your connection." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Ask AI Button - Only visible after dashboard loads */}
            <AnimatePresence>
                {isMounted && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Ask AI"
                        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg transition-all ${isOpen
                            ? "bg-muted text-foreground"
                            : "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-purple-500/25"
                            }`}
                    >
                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    <span className="text-sm font-medium">Close</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="open"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <Bot className="w-4 h-4" />
                                    <span className="text-sm font-medium">Ask AI</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-20 right-6 z-50 w-[420px] max-h-[600px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-violet-500/10 to-purple-500/10">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">XandAI</h3>
                                    <p className="text-xs text-muted-foreground">Your Xandeum Assistant</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px] max-h-[450px]">
                            {messages.length === 0 && (
                                <div className="text-center text-muted-foreground text-sm py-8">
                                    <Bot className="w-10 h-10 mx-auto mb-3 text-purple-500/50" />
                                    <p className="font-medium">Hi! I'm XandAI 👋</p>
                                    <p className="text-xs mt-1">Ask me anything about Xandeum pNodes</p>
                                    <div className="mt-4 space-y-2">
                                        <button
                                            onClick={() => setInput("What is Xandeum?")}
                                            className="block w-full text-left px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-xs"
                                        >
                                            💡 What is Xandeum?
                                        </button>
                                        <button
                                            onClick={() => setInput("How do pNodes work?")}
                                            className="block w-full text-left px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-xs"
                                        >
                                            🔧 How do pNodes work?
                                        </button>
                                        <button
                                            onClick={() => setInput("What is XAND token?")}
                                            className="block w-full text-left px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-xs"
                                        >
                                            🪙 What is XAND token?
                                        </button>
                                    </div>
                                </div>
                            )}

                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm break-words whitespace-pre-wrap ${msg.role === "user"
                                            ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-br-md"
                                            : "bg-muted text-foreground rounded-bl-md"
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.6s' }} />
                                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms', animationDuration: '0.6s' }} />
                                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '0.6s' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-border">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about Xandeum network..."
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2.5 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 text-sm"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="p-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
