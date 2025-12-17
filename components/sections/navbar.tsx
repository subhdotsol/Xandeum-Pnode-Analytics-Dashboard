"use client";

import Link from "next/link";
import { Activity } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button-custom";

const navLinks = [
    { label: "Dashboard", href: "/" },
    { label: "Network", href: "#network" },
    { label: "Nodes", href: "#nodes" },
    { label: "Analytics", href: "#analytics" },
];

export function Navbar() {
    return (
        <div className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-accent" />
                        </div>
                        <span className="font-bold text-lg">Xandeum</span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Button variant="primary" size="sm" className="hidden md:inline-flex">
                            Connect
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
