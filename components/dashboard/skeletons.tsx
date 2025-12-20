"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

function Skeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse bg-muted rounded ${className}`} />;
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            {/* Status indicator skeleton */}
            <div className="flex items-center justify-center gap-2">
                <Skeleton className="w-2 h-2 rounded-full" />
                <Skeleton className="w-24 h-4" />
            </div>

            {/* Stats skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="border border-border">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-3">
                                    <Skeleton className="w-20 h-4" />
                                    <Skeleton className="w-16 h-8" />
                                    <Skeleton className="w-24 h-3" />
                                </div>
                                <Skeleton className="w-10 h-10 rounded-lg" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Resource cards skeleton (3 cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="border border-border">
                        <CardContent className="p-6">
                            <Skeleton className="w-20 h-4 mb-4" />
                            <div className="space-y-4">
                                <div className="flex justify-between py-3 border-b border-border">
                                    <Skeleton className="w-16 h-4" />
                                    <Skeleton className="w-12 h-4" />
                                </div>
                                <div className="flex justify-between py-3">
                                    <Skeleton className="w-16 h-4" />
                                    <Skeleton className="w-12 h-4" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Activity + Health | Distribution (2-column layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Activity Monitor Skeleton */}
                    <Card className="border border-border">
                        <CardContent className="p-6">
                            <Skeleton className="w-28 h-4 mb-4" />
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="w-2 h-2 rounded-full" />
                                    <Skeleton className="w-12 h-3" />
                                    <Skeleton className="w-16 h-4 ml-auto" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Skeleton className="w-2 h-2 rounded-full" />
                                    <Skeleton className="w-12 h-3" />
                                    <Skeleton className="w-16 h-4 ml-auto" />
                                </div>
                            </div>
                            <Skeleton className="w-full h-[120px] rounded-lg" />
                        </CardContent>
                    </Card>

                    {/* Network Health Skeleton */}
                    <Card className="border border-border">
                        <CardHeader>
                            <Skeleton className="w-32 h-5" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Skeleton className="w-full h-20 rounded-lg" />
                                <div className="grid grid-cols-3 gap-4">
                                    <Skeleton className="h-12 rounded-lg" />
                                    <Skeleton className="h-12 rounded-lg" />
                                    <Skeleton className="h-12 rounded-lg" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Version Distribution */}
                <Card className="border border-border h-full">
                    <CardHeader>
                        <Skeleton className="w-32 h-5" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="w-full h-40 rounded-lg mb-4" />
                        <div className="space-y-2">
                            <Skeleton className="w-full h-8 rounded" />
                            <Skeleton className="w-full h-8 rounded" />
                            <Skeleton className="w-full h-8 rounded" />
                            <Skeleton className="w-full h-8 rounded" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export function MapSkeleton() {
    return (
        <Card className="border border-border overflow-hidden rounded-xl">
            <div className="h-[600px] flex items-center justify-center bg-muted/30">
                <div className="text-center space-y-4">
                    <Skeleton className="w-12 h-12 rounded-full mx-auto" />
                    <Skeleton className="w-32 h-4 mx-auto" />
                </div>
            </div>
        </Card>
    );
}

export function TableSkeleton() {
    return (
        <Card className="border border-border">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <Skeleton className="w-32 h-5" />
                    <Skeleton className="w-24 h-4" />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-4">
                    <Skeleton className="flex-1 h-10 rounded-md" />
                    <Skeleton className="w-32 h-10 rounded-md" />
                </div>
                <div className="border border-border rounded-md">
                    <div className="border-b border-border p-4">
                        <div className="flex gap-4">
                            <Skeleton className="w-20 h-4" />
                            <Skeleton className="w-32 h-4" />
                            <Skeleton className="w-20 h-4" />
                            <Skeleton className="w-24 h-4" />
                            <Skeleton className="w-28 h-4" />
                        </div>
                    </div>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="border-b border-border p-4 last:border-0">
                            <div className="flex gap-4 items-center">
                                <Skeleton className="w-16 h-6 rounded-full" />
                                <Skeleton className="w-32 h-4" />
                                <Skeleton className="w-16 h-4" />
                                <Skeleton className="w-20 h-4" />
                                <Skeleton className="w-24 h-4" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
