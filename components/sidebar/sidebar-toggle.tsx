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
            className="fixed top-4 left-4 sm:top-6 sm:left-6 z-30 p-2 sm:p-2.5 rounded-lg bg-card/80 backdrop-blur-sm border border-border shadow-lg hover:bg-muted transition-colors"
            aria-label="Toggle sidebar"
        >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
        </motion.button>
    );
}
