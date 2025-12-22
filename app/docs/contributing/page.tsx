"use client";

import { GitBranch, GitPullRequest, Code, CheckCircle, Terminal, FileText, Heart, Sparkles } from "lucide-react";

const steps = [
    {
        number: 1,
        title: "Fork & Clone",
        icon: GitBranch,
        color: "from-blue-500 to-cyan-500",
        content: (
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Fork the repository on GitHub, then clone your fork:</p>
                <div className="bg-muted rounded-lg p-3 font-mono text-sm">
                    <p>git clone https://github.com/YOUR_USERNAME/Xandeum-Pnode-Analytics-Dashboard.git</p>
                    <p>cd Xandeum-Pnode-Analytics-Dashboard</p>
                </div>
            </div>
        ),
    },
    {
        number: 2,
        title: "Install Dependencies",
        icon: Terminal,
        color: "from-purple-500 to-pink-500",
        content: (
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">We use pnpm for package management:</p>
                <div className="bg-muted rounded-lg p-3 font-mono text-sm">
                    <p>pnpm install</p>
                </div>
            </div>
        ),
    },
    {
        number: 3,
        title: "Set Up Environment",
        icon: FileText,
        color: "from-orange-500 to-amber-500",
        content: (
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Copy the example env file and add your keys:</p>
                <div className="bg-muted rounded-lg p-3 font-mono text-sm">
                    <p>cp .env.example .env.local</p>
                </div>
                <p className="text-xs text-muted-foreground">Required: GEMINI_API_KEY, NEXT_PUBLIC_SOLANA_RPC_URL</p>
            </div>
        ),
    },
    {
        number: 4,
        title: "Start Development",
        icon: Code,
        color: "from-green-500 to-emerald-500",
        content: (
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Run the development server:</p>
                <div className="bg-muted rounded-lg p-3 font-mono text-sm">
                    <p>pnpm dev</p>
                </div>
                <p className="text-xs text-muted-foreground">Open http://localhost:3000 in your browser</p>
            </div>
        ),
    },
    {
        number: 5,
        title: "Create a Branch",
        icon: GitBranch,
        color: "from-violet-500 to-purple-500",
        content: (
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Create a feature branch for your changes:</p>
                <div className="bg-muted rounded-lg p-3 font-mono text-sm">
                    <p>git checkout -b feature/amazing-feature</p>
                </div>
            </div>
        ),
    },
    {
        number: 6,
        title: "Submit Pull Request",
        icon: GitPullRequest,
        color: "from-pink-500 to-rose-500",
        content: (
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Push your changes and open a PR:</p>
                <div className="bg-muted rounded-lg p-3 font-mono text-sm">
                    <p>git push origin feature/amazing-feature</p>
                </div>
                <p className="text-xs text-muted-foreground">Include a clear description of your changes</p>
            </div>
        ),
    },
];

const guidelines = [
    { icon: CheckCircle, text: "Follow TypeScript best practices", color: "text-green-500" },
    { icon: CheckCircle, text: "Use Prettier for code formatting", color: "text-blue-500" },
    { icon: CheckCircle, text: "Write meaningful commit messages", color: "text-purple-500" },
    { icon: CheckCircle, text: "Test changes before submitting PR", color: "text-orange-500" },
    { icon: CheckCircle, text: "Update documentation as needed", color: "text-pink-500" },
];

export default function ContributingPage() {
    return (
        <article>
            <header className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500">
                        <Heart className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Contributing</h1>
                </div>
                <p className="text-lg text-muted-foreground">
                    Help us improve the Xandeum pNode Analytics Dashboard!
                </p>
            </header>

            {/* Steps */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    Getting Started
                </h2>
                <div className="space-y-4">
                    {steps.map((step) => {
                        const Icon = step.icon;
                        return (
                            <div key={step.number} className="bg-card border border-border rounded-lg overflow-hidden">
                                <div className={`h-1 bg-gradient-to-r ${step.color}`} />
                                <div className="p-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}>
                                            <span className="text-white font-bold">{step.number}</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Icon className="w-4 h-4 text-muted-foreground" />
                                                <h3 className="font-medium">{step.title}</h3>
                                            </div>
                                            {step.content}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Guidelines */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Development Guidelines</h2>
                <div className="bg-card border border-border rounded-lg p-4">
                    <div className="space-y-3">
                        {guidelines.map((g, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <g.icon className={`w-5 h-5 ${g.color}`} />
                                <span className="text-sm">{g.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What to Contribute */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Ideas for Contributions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
                        <h3 className="font-medium text-green-600 dark:text-green-400 mb-2">🐛 Bug Fixes</h3>
                        <p className="text-sm text-muted-foreground">Fix existing issues from GitHub</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-4">
                        <h3 className="font-medium text-blue-600 dark:text-blue-400 mb-2">✨ New Features</h3>
                        <p className="text-sm text-muted-foreground">Add new dashboard components</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
                        <h3 className="font-medium text-purple-600 dark:text-purple-400 mb-2">📝 Documentation</h3>
                        <p className="text-sm text-muted-foreground">Improve guides and examples</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-lg p-4">
                        <h3 className="font-medium text-orange-600 dark:text-orange-400 mb-2">🧪 Testing</h3>
                        <p className="text-sm text-muted-foreground">Add unit and integration tests</p>
                    </div>
                </div>
            </section>

            {/* Thank You */}
            <section className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-lg p-6 text-center">
                <Heart className="w-8 h-8 text-pink-500 mx-auto mb-3" />
                <h2 className="text-xl font-semibold mb-2 text-pink-600 dark:text-pink-400">Thank You!</h2>
                <p className="text-muted-foreground">
                    Every contribution, no matter how small, helps make this project better for everyone.
                </p>
            </section>
        </article>
    );
}
