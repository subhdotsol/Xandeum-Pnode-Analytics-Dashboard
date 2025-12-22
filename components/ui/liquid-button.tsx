"use client";

import { motion } from "framer-motion";
import { ReactNode, useState } from "react";

interface LiquidButtonProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}

export function LiquidButton({ children, onClick, className = "", disabled = false }: LiquidButtonProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative overflow-hidden ${className}`}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
            {/* Liquid morphing background layers */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500"
                animate={{
                    scale: isHovered ? 1.05 : 1,
                    rotate: isHovered ? 2 : 0,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            />

            {/* Animated blob 1 */}
            <motion.div
                className="absolute w-32 h-32 bg-teal-400 rounded-full blur-2xl opacity-50"
                animate={{
                    x: isHovered ? [0, 30, -20, 0] : 0,
                    y: isHovered ? [0, -20, 20, 0] : 0,
                    scale: isHovered ? [1, 1.2, 0.9, 1] : 1,
                }}
                transition={{
                    duration: 3,
                    repeat: isHovered ? Infinity : 0,
                    ease: "easeInOut",
                }}
                style={{
                    left: "10%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            />

            {/* Animated blob 2 */}
            <motion.div
                className="absolute w-40 h-40 bg-green-400 rounded-full blur-2xl opacity-40"
                animate={{
                    x: isHovered ? [0, -30, 25, 0] : 0,
                    y: isHovered ? [0, 25, -15, 0] : 0,
                    scale: isHovered ? [1, 0.8, 1.3, 1] : 1,
                }}
                transition={{
                    duration: 3.5,
                    repeat: isHovered ? Infinity : 0,
                    ease: "easeInOut",
                    delay: 0.2,
                }}
                style={{
                    right: "10%",
                    top: "50%",
                    transform: "translate(50%, -50%)",
                }}
            />

            {/* Shimmer effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                    x: isHovered ? ["-100%", "200%"] : "-100%",
                }}
                transition={{
                    duration: 1.5,
                    repeat: isHovered ? Infinity : 0,
                    ease: "easeInOut",
                }}
            />

            {/* Border glow effect */}
            <motion.div
                className="absolute inset-0 rounded-xl"
                animate={{
                    boxShadow: isHovered
                        ? ["0 0 20px rgba(20, 241, 198, 0.3)", "0 0 40px rgba(20, 241, 198, 0.5)", "0 0 20px rgba(20, 241, 198, 0.3)"]
                        : "0 0 0px rgba(20, 241, 198, 0)",
                }}
                transition={{
                    duration: 2,
                    repeat: isHovered ? Infinity : 0,
                    ease: "easeInOut",
                }}
            />

            {/* Content */}
            <motion.span
                className="relative z-10 flex items-center justify-center gap-2"
                animate={{
                    scale: isHovered ? 1.05 : 1,
                }}
                transition={{ duration: 0.2 }}
            >
                {children}
            </motion.span>

            {/* Ripple effect on hover */}
            {isHovered && (
                <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-white/30"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1.1, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                />
            )}
        </motion.button>
    );
}
