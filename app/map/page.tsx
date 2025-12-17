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
        <div className="relative w-full h-screen bg-background overflow-hidden">
            <Link
                href="/"
                className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 border border-border bg-background/80 backdrop-blur-sm text-accent hover:bg-accent/10 transition-all"
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
                <span className="font-medium">Back</span>
            </Link>

            <InteractiveGlobe pnodes={pnodes} />
        </div>
    );
}
