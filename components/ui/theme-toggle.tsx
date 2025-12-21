"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = async () => {
        const newTheme = resolvedTheme === "dark" ? "light" : "dark";

        // Check if View Transitions API is supported
        if (
            typeof document !== "undefined" &&
            "startViewTransition" in document &&
            buttonRef.current
        ) {
            // Get button position for the animation origin
            const rect = buttonRef.current.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            // Calculate the max radius needed to cover the entire screen
            const endRadius = Math.hypot(
                Math.max(x, window.innerWidth - x),
                Math.max(y, window.innerHeight - y)
            );

            // Start the view transition
            const transition = (document as any).startViewTransition(() => {
                setTheme(newTheme);
            });

            // Wait for the transition to be ready
            await transition.ready;

            // Animate the clip-path
            document.documentElement.animate(
                {
                    clipPath: [
                        `circle(0px at ${x}px ${y}px)`,
                        `circle(${endRadius}px at ${x}px ${y}px)`,
                    ],
                },
                {
                    duration: 500,
                    easing: "ease-out",
                    pseudoElement: "::view-transition-new(root)",
                }
            );
        } else {
            // Fallback for browsers without View Transitions API
            setTheme(newTheme);
        }
    };

    if (!mounted) {
        return (
            <div className="p-3 rounded-lg bg-card border border-border">
                <div className="h-5 w-5" />
            </div>
        );
    }

    return (
        <motion.button
            ref={buttonRef}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="relative p-3 rounded-lg bg-card border border-border hover:bg-accent transition-colors"
            aria-label="Toggle theme"
        >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute top-3 left-3 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </motion.button>
    );
}
