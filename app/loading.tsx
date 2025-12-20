import Image from "next/image";

export default function Loading() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    <Image
                        src="/icon.png"
                        alt="Xandeum"
                        width={64}
                        height={64}
                        className="rounded-lg"
                    />
                    {/* Spinning ring */}
                    <div className="absolute inset-0 -m-2">
                        <div className="w-20 h-20 rounded-full border-2 border-transparent border-t-foreground/30 animate-spin" />
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <h1 className="text-xl font-semibold">Xandeum Analytics</h1>
                    <p className="text-sm text-muted-foreground">Loading network data...</p>
                </div>

                <div className="flex gap-1">
                    <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </div>
    );
}
