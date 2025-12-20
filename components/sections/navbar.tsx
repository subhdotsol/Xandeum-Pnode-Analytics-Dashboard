"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BarChart3, Map } from "lucide-react";

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
        <div className="border-b border-border bg-background sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Image
                            src="/xandeum-logo.png"
                            alt="Xandeum Logo"
                            width={28}
                            height={28}
                            className="rounded"
                        />
                        <span className="font-semibold">Xandeum Explorer</span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={(e) => handleScroll(e, link.href)}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center gap-2">
                        <Link
                            href="/version-intelligence"
                            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md hover:bg-accent transition-colors"
                        >
                            <BarChart3 className="w-4 h-4" />
                            <span>Version Intel</span>
                        </Link>
                        <Link
                            href="/map"
                            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md hover:bg-accent transition-colors"
                        >
                            <Map className="w-4 h-4" />
                            <span>Network Map</span>
                        </Link>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </div>
    );
}
