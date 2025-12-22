"use client";

import { motion } from "framer-motion";
import { Menu } from "lucide-react";

interface SidebarToggleProps {
    onClick: () => void;
}

export function SidebarToggle({ onClick }: SidebarToggleProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="fixed top-6 left-6 z-30 p-2.5 rounded-lg bg-card border border-border shadow-lg hover:bg-muted transition-colors"
            aria-label="Toggle sidebar"
        >
            <Menu className="w-5 h-5 text-foreground" />
        </motion.button>
    );
}
