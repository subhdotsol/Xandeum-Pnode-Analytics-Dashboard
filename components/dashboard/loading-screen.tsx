"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function Skeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse bg-muted rounded ${className}`} />;
}

function SpinnerScreen() {
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
                        priority
                    />
                    <div className="absolute inset-0 -m-3">
                        <div className="w-[88px] h-[88px] rounded-full border-2 border-transparent border-t-foreground/30 animate-spin" />
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <h1 className="text-xl font-semibold">Xandeum Analytics</h1>
                    <p className="text-sm text-muted-foreground">Connecting to network...</p>
                </div>

                <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </div>
    );
}

export function SkeletonScreen() {
    return (
        <div className="min-h-screen bg-background">
            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Header skeleton */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded" />
                        <Skeleton className="w-24 h-5" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-20 h-4" />
                        <Skeleton className="w-8 h-8 rounded" />
                        <Skeleton className="w-8 h-8 rounded" />
                    </div>
                </div>

                {/* Title skeleton */}
                <div className="text-center mb-4">
                    <Skeleton className="w-72 h-8 mx-auto mb-2" />
                    <Skeleton className="w-96 h-5 mx-auto" />
                </div>

                {/* Tabs skeleton */}
                <div className="flex justify-center mb-8">
                    <Skeleton className="w-80 h-10 rounded-lg" />
                </div>

                {/* Status */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <Skeleton className="w-2 h-2 rounded-full" />
                    <Skeleton className="w-24 h-4" />
                </div>

                {/* Stats skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

                {/* Resource cards skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

                {/* Health + Version skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 border border-border">
                        <CardHeader>
                            <Skeleton className="w-32 h-5" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="w-full h-24 rounded-lg mb-4" />
                            <div className="grid grid-cols-3 gap-4">
                                <Skeleton className="h-16 rounded-lg" />
                                <Skeleton className="h-16 rounded-lg" />
                                <Skeleton className="h-16 rounded-lg" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border border-border">
                        <CardHeader>
                            <Skeleton className="w-32 h-5" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="w-full h-40 rounded-lg mb-4" />
                            <div className="space-y-2">
                                <Skeleton className="w-full h-8 rounded" />
                                <Skeleton className="w-full h-8 rounded" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}

export function LoadingScreen() {
    const [mounted, setMounted] = useState(false);
    const [showSkeleton, setShowSkeleton] = useState(false);

    useEffect(() => {
        setMounted(true);

        // After 3 seconds, switch to skeleton
        const timer = setTimeout(() => {
            setShowSkeleton(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    // Always show spinner on server and initial render
    if (!mounted || !showSkeleton) {
        return <SpinnerScreen />;
    }

    return <SkeletonScreen />;
}
