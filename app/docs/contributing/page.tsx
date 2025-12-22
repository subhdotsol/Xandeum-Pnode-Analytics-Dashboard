"use client";

import { motion } from "framer-motion";
import { CodeBlock } from "@/components/ui/code-block";

const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
};

const steps = [
    {
        number: "01",
        title: "Fork & Clone",
        code: `git clone https://github.com/YOUR_USERNAME/Xandeum-Pnode-Analytics-Dashboard.git
cd Xandeum-Pnode-Analytics-Dashboard`,
    },
    {
        number: "02",
        title: "Install Dependencies",
        code: "pnpm install",
    },
    {
        number: "03",
        title: "Set Up Environment",
        code: "cp .env.example .env.local",
        note: "Required: GEMINI_API_KEY, NEXT_PUBLIC_SOLANA_RPC_URL",
    },
    {
        number: "04",
        title: "Start Development",
        code: "pnpm dev",
        note: "Open http://localhost:3000",
    },
    {
        number: "05",
        title: "Create a Branch",
        code: "git checkout -b feature/amazing-feature",
    },
    {
        number: "06",
        title: "Submit Pull Request",
        code: "git push origin feature/amazing-feature",
        note: "Include a clear description of your changes",
    },
];

const guidelines = [
    "Follow TypeScript best practices",
    "Use Prettier for code formatting",
    "Write meaningful commit messages",
    "Test changes before submitting PR",
    "Update documentation as needed",
];

const contributionIdeas = [
    { title: "Bug Fixes", description: "Fix existing issues from GitHub" },
    { title: "New Features", description: "Add new dashboard components" },
    { title: "Documentation", description: "Improve guides and examples" },
    { title: "Testing", description: "Add unit and integration tests" },
];

export default function ContributingPage() {
    return (
        <motion.article {...fadeIn}>
            <header className="mb-8 border-b border-border pb-4">
                <h1 className="text-2xl font-bold tracking-tight mb-2">Contributing</h1>
                <p className="text-muted-foreground">
                    Help us improve the Xandeum pNode Analytics Dashboard.
                </p>
            </header>

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4">Getting Started</h2>
                <div className="space-y-6">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={step.number}
                            className="flex gap-4"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + idx * 0.05, duration: 0.3 }}
                        >
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                                {step.number}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm mb-2">{step.title}</h3>
                                <CodeBlock code={step.code} filename={step.title} />
                                {step.note && (
                                    <p className="text-xs text-muted-foreground mt-2">{step.note}</p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4">Development Guidelines</h2>
                <div className="rounded-lg border border-border p-4">
                    <ul className="space-y-2">
                        {guidelines.map((g, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                {g}
                            </li>
                        ))}
                    </ul>
                </div>
            </motion.section>

            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4">Ideas for Contributions</h2>
                <div className="grid grid-cols-2 gap-3">
                    {contributionIdeas.map((idea, idx) => (
                        <div key={idx} className="rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors">
                            <h3 className="font-medium text-sm mb-1">{idea.title}</h3>
                            <p className="text-xs text-muted-foreground">{idea.description}</p>
                        </div>
                    ))}
                </div>
            </motion.section>
        </motion.article>
    );
}
