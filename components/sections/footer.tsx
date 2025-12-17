import Link from "next/link";
import { Activity, Github, Twitter } from "lucide-react";

const footerLinks = [
    {
        title: "Product",
        links: [
            { label: "Dashboard", href: "/" },
            { label: "Analytics", href: "#analytics" },
            { label: "Network", href: "#network" },
            { label: "Documentation", href: "#docs" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "About", href: "#about" },
            { label: "Blog", href: "#blog" },
            { label: "Careers", href: "#careers" },
            { label: "Contact", href: "#contact" },
        ],
    },
    {
        title: "Resources",
        links: [
            { label: "Community", href: "#community" },
            { label: "Support", href: "#support" },
            { label: "Status", href: "#status" },
            { label: "Terms", href: "#terms" },
        ],
    },
];

const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/xandeum", label: "Twitter" },
    { icon: Github, href: "https://github.com/xandeum", label: "GitHub" },
];

export function Footer() {
    return (
        <footer className="border-t border-border/50 mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                                <Activity className="w-5 h-5 text-accent" />
                            </div>
                            <span className="font-bold text-lg">Xandeum Analytics</span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs mb-4">
                            Real-time monitoring and visualization of the Xandeum distributed
                            storage network.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    className="w-9 h-9 rounded-full border border-border/50 flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    {footerLinks.map((column) => (
                        <div key={column.title}>
                            <h3 className="font-semibold mb-4">{column.title}</h3>
                            <ul className="space-y-3">
                                {column.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Xandeum Labs. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link
                            href="#privacy"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="#terms"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
