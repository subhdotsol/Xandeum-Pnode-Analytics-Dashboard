"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navLinks = [
    { label: "Dashboard", href: "#dashboard" },
    { label: "Network", href: "#network" },
    { label: "Nodes", href: "#nodes" },
    { label: "Analytics", href: "#analytics" },
];

export function Navbar() {
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Image
                            src="/xandeum-logo.png"
                            alt="Xandeum Logo"
                            width={32}
                            height={32}
                            className="rounded-lg"
                        />
                        <span className="font-bold text-lg">Xandeum Explorer</span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={(e) => handleScroll(e, link.href)}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/map"
                            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent transition-colors"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                                />
                            </svg>
                            <span className="font-medium">Network Map</span>
                        </Link>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </div>
    );
}
