import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
        <main className="relative h-screen w-full overflow-hidden bg-black">
            <Link
                href="/"
                className="fixed left-6 top-6 z-50 flex items-center gap-2 rounded-lg border border-border/50 bg-background/80 px-3 py-3 backdrop-blur-sm transition-colors hover:bg-background"
            >
                <ArrowLeft className="h-5 w-5" />
            </Link>

            <InteractiveGlobe pnodes={pnodes} />
        </main>
    );
}
