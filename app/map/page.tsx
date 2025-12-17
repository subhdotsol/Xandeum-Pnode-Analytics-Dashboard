import Link from "next/link";
import { InteractiveGlobe } from "@/components/dashboard/interactive-globe";
import type { PNodeInfo } from "@/types/pnode";

async function getPNodes(): Promise<PNodeInfo[]> {
    try {
        const res = await fetch("http://localhost:3000/api/pnodes", {
            cache: "no-store",
        });
        const data = await res.json();
        return data.data || [];
    } catch (error) {
        console.error("Failed to fetch pNodes:", error);
        return [];
    }
}

export default async function MapPage() {
    const pnodes = await getPNodes();

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border/50 bg-background/80 backdrop-blur-md">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-accent hover:opacity-80 transition-opacity"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                            <span className="font-medium">Back to Dashboard</span>
                        </Link>
                        <h1 className="text-2xl font-bold">pNode Network Map</h1>
                        <div className="w-32" /> {/* Spacer for centering */}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col items-center gap-8">
                    {/* Description */}
                    <div className="text-center max-w-2xl">
                        <h2 className="text-3xl font-bold gradient-text-vibrant mb-4">
                            Global pNode Distribution
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Real-time visualization of {pnodes.length} pNodes distributed across the Xandeum network.
                            Each glowing dot represents an active storage node.
                        </p>
                    </div>

                    {/* Globe */}
                    <div className="glass-card p-8 rounded-2xl">
                        <InteractiveGlobe pnodes={pnodes} />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
                        <div className="glass-card p-6 text-center">
                            <div className="text-3xl font-bold gradient-text-vibrant">
                                {pnodes.length}
                            </div>
                            <div className="text-sm text-muted-foreground mt-2">Total Nodes</div>
                        </div>
                        <div className="glass-card p-6 text-center">
                            <div className="text-3xl font-bold text-[#14F1C6]">
                                {pnodes.filter(node => {
                                    const delta = Math.floor(Date.now() / 1000) - node.last_seen_timestamp;
                                    return delta < 300;
                                }).length}
                            </div>
                            <div className="text-sm text-muted-foreground mt-2">Healthy Nodes</div>
                        </div>
                        <div className="glass-card p-6 text-center">
                            <div className="text-3xl font-bold text-[#FFA500]">
                                {pnodes.filter(node => {
                                    const delta = Math.floor(Date.now() / 1000) - node.last_seen_timestamp;
                                    return delta >= 300 && delta < 3600;
                                }).length}
                            </div>
                            <div className="text-sm text-muted-foreground mt-2">Degraded Nodes</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
