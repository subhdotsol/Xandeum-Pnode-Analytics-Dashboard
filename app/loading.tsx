import Image from "next/image";

export default function Loading() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
            {/* Logo and spinner */}
            <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    <Image
                        src="/xandeum-logo.png"
                        alt="Xandeum"
                        width={64}
                        height={64}
                        className="rounded-lg"
                    />
                    {/* Spinning ring around logo */}
                    <div className="absolute inset-0 -m-2">
                        <div className="w-[80px] h-[80px] rounded-full border-2 border-transparent border-t-primary animate-spin" />
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <h1 className="text-xl font-semibold">Xandeum Analytics</h1>
                    <p className="text-sm text-muted-foreground">Loading network data...</p>
                </div>

                {/* Loading bar */}
                <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-pulse w-1/2" />
                </div>
            </div>
        </div>
    );
}
