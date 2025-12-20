import { Card, CardContent, CardHeader } from "@/components/ui/card";

function SkeletonBox({ className }: { className?: string }) {
    return <div className={`animate-pulse bg-muted rounded ${className}`} />;
}

export default function Loading() {
    return (
        <div className="min-h-screen bg-background">
            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Header skeleton */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <SkeletonBox className="w-8 h-8 rounded" />
                        <SkeletonBox className="w-24 h-5" />
                    </div>
                    <div className="flex items-center gap-2">
                        <SkeletonBox className="w-20 h-4" />
                        <SkeletonBox className="w-8 h-8 rounded" />
                        <SkeletonBox className="w-8 h-8 rounded" />
                    </div>
                </div>

                {/* Title skeleton */}
                <div className="text-center mb-4">
                    <SkeletonBox className="w-72 h-8 mx-auto mb-2" />
                    <SkeletonBox className="w-96 h-5 mx-auto" />
                </div>

                {/* Tabs skeleton */}
                <div className="flex justify-center mb-8">
                    <SkeletonBox className="w-80 h-10 rounded-lg" />
                </div>

                {/* Stats skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="border border-border">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-3">
                                        <SkeletonBox className="w-20 h-4" />
                                        <SkeletonBox className="w-16 h-8" />
                                        <SkeletonBox className="w-24 h-3" />
                                    </div>
                                    <SkeletonBox className="w-10 h-10 rounded-lg" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Resource cards skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="border border-border">
                            <CardContent className="p-6">
                                <SkeletonBox className="w-20 h-4 mb-4" />
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <SkeletonBox className="w-16 h-4" />
                                        <SkeletonBox className="w-12 h-4" />
                                    </div>
                                    <div className="flex justify-between">
                                        <SkeletonBox className="w-16 h-4" />
                                        <SkeletonBox className="w-12 h-4" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Health + Version skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 border border-border">
                        <CardHeader>
                            <SkeletonBox className="w-32 h-5" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <SkeletonBox className="w-full h-24" />
                                <div className="grid grid-cols-3 gap-4">
                                    <SkeletonBox className="h-16" />
                                    <SkeletonBox className="h-16" />
                                    <SkeletonBox className="h-16" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border border-border">
                        <CardHeader>
                            <SkeletonBox className="w-32 h-5" />
                        </CardHeader>
                        <CardContent>
                            <SkeletonBox className="w-full h-40 mb-4" />
                            <div className="space-y-2">
                                <SkeletonBox className="w-full h-8" />
                                <SkeletonBox className="w-full h-8" />
                                <SkeletonBox className="w-full h-8" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
