"use client";

export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4 overflow-hidden relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
            </div>

            <div className="glass-card p-12 rounded-3xl border border-border/50 text-center space-y-8 relative z-10 max-w-md">
                {/* Crazy Animated Icon Container */}
                <div className="relative">
                    {/* Outer rotating ring */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    </div>

                    {/* Middle counter-rotating ring */}
                    <div className="absolute inset-0 flex items-center justify-center" style={{ animation: "spin 3s linear infinite reverse" }}>
                        <div className="w-24 h-24 border-4 border-transparent border-r-secondary rounded-full"></div>
                    </div>

                    {/* Inner pulsing circle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full animate-pulse shadow-2xl shadow-primary/50"></div>
                    </div>

                    {/* Central Icon - Bouncing rocket */}
                    <div className="relative flex items-center justify-center h-32">
                        <div className="text-5xl animate-bounce" style={{ animationDuration: "1s" }}>
                            🚀
                        </div>
                    </div>
                </div>

                {/* Loading Text with Gradient Animation */}
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold relative">
                        <span className="dark:notion-text-gradient animate-pulse">
                            Fetching pNode Data
                        </span>
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Connecting to decentralized network
                    </p>
                </div>

                {/* Animated Progress Bar */}
                <div className="space-y-4">
                    <div className="h-2 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm">
                        <div className="h-full w-1/3 bg-gradient-to-r from-primary via-secondary to-accent rounded-full shadow-lg shimmer"></div>
                    </div>

                    {/* Animated Dots */}
                    <div className="flex justify-center gap-3">
                        <div className="w-4 h-4 bg-gradient-to-r from-primary to-secondary rounded-full animate-bounce shadow-lg shadow-primary/30" style={{ animationDelay: "0ms", animationDuration: "0.6s" }}></div>
                        <div className="w-4 h-4 bg-gradient-to-r from-secondary to-accent rounded-full animate-bounce shadow-lg shadow-secondary/30" style={{ animationDelay: "150ms", animationDuration: "0.6s" }}></div>
                        <div className="w-4 h-4 bg-gradient-to-r from-accent to-primary rounded-full animate-bounce shadow-lg shadow-accent/30" style={{ animationDelay: "300ms", animationDuration: "0.6s" }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
