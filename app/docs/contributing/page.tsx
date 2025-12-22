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
        code: `git clone https://github.com/subhdotsol/Xandeum-Pnode-Analytics-Dashboard.git
cd Xandeum-Pnode-Analytics-Dashboard`,
        color: "text-sky-500",
    },
    {
        number: "02",
        title: "Install Dependencies",
        code: "pnpm install",
        color: "text-violet-500",
    },
    {
        number: "03",
        title: "Set Up Environment",
        code: "cp .env.example .env.local",
        note: "Required: GEMINI_API_KEY, NEXT_PUBLIC_SOLANA_RPC_URL",
        color: "text-emerald-500",
    },
    {
        number: "04",
        title: "Start Development",
        code: "pnpm dev",
        note: "Open http://localhost:3000",
        color: "text-amber-500",
    },
    {
        number: "05",
        title: "Create a Branch",
        code: "git checkout -b feature/amazing-feature",
        color: "text-rose-500",
    },
    {
        number: "06",
        title: "Submit Pull Request",
        code: "git push origin feature/amazing-feature",
        note: "Include a clear description of your changes",
        color: "text-cyan-500",
    },
];

const guidelines = [
    { text: "Follow TypeScript best practices", color: "text-sky-500" },
    { text: "Use Prettier for code formatting", color: "text-violet-500" },
    { text: "Write meaningful commit messages", color: "text-emerald-500" },
    { text: "Test changes before submitting PR", color: "text-amber-500" },
    { text: "Update documentation as needed", color: "text-rose-500" },
];

const contributionIdeas = [
    { title: "Bug Fixes", description: "Fix existing issues from GitHub", color: "text-rose-500" },
    { title: "New Features", description: "Add new dashboard components", color: "text-emerald-500" },
    { title: "Documentation", description: "Improve guides and examples", color: "text-sky-500" },
    { title: "Testing", description: "Add unit and integration tests", color: "text-violet-500" },
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
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium ${step.color}`}>
                                {step.number}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className={`font-medium text-sm mb-2 ${step.color}`}>{step.title}</h3>
                                <CodeBlock code={step.code} language="bash" filename={step.title} />
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
                <h2 className="text-lg font-semibold mb-4 text-amber-500">Development Guidelines</h2>
                <div className="rounded-lg border border-border p-4">
                    <ul className="space-y-2">
                        {guidelines.map((g, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                                <span className={`w-1.5 h-1.5 rounded-full ${g.color.replace('text-', 'bg-')} flex-shrink-0`} />
                                <span className={g.color}>{g.text}</span>
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
                        <div key={idx} className="rounded-lg border border-border p-4 hover:bg-muted/30 transition-colors">
                            <h3 className={`font-medium text-sm mb-1 ${idea.color}`}>{idea.title}</h3>
                            <p className="text-xs text-muted-foreground">{idea.description}</p>
                        </div>
                    ))}
                </div>
            </motion.section>
        </motion.article>
    );
}
