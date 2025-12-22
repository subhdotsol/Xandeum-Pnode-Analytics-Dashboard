"use client";

import { useState, useEffect } from "react";
import { MainDashboard } from "@/components/dashboard/main-dashboard";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { NetworkAnalytics, PNodeInfo, PNodeStats } from "@/types/pnode";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded ${className}`} />;
}

function SpinnerScreen() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <Image src="/icon.png" alt="Xandeum" width={64} height={64} className="rounded-lg" priority />
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

function SkeletonScreen() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-6 py-8">
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
        <div className="text-center mb-4">
          <Skeleton className="w-72 h-8 mx-auto mb-2" />
          <Skeleton className="w-96 h-5 mx-auto" />
        </div>
        <div className="flex justify-center mb-8">
          <Skeleton className="w-80 h-10 rounded-lg" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-8">
          <Skeleton className="w-2 h-2 rounded-full" />
          <Skeleton className="w-24 h-4" />
        </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border border-border">
            <CardHeader><Skeleton className="w-32 h-5" /></CardHeader>
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
            <CardHeader><Skeleton className="w-32 h-5" /></CardHeader>
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

type LoadingPhase = "spinner" | "skeleton" | "ready";

export default function HomePage() {
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>("spinner");
  const [pnodes, setPnodes] = useState<PNodeInfo[]>([]);
  const [analytics, setAnalytics] = useState<NetworkAnalytics | null>(null);
  const [aggregateStats, setAggregateStats] = useState<any>(null);
  const [estimatedCountries, setEstimatedCountries] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user has already visited - skip spinner delay if so
    const hasVisited = sessionStorage.getItem('dashboard-visited') === 'true';
    if (hasVisited) {
      // Skip spinner, go straight to skeleton while data loads
      setLoadingPhase("skeleton");
    }

    // Mark dashboard as visited
    sessionStorage.setItem('dashboard-visited', 'true');

    // Fetch data immediately
    fetchData();

    // Phase 1: Show spinner for 3 seconds max, then skeleton while loading (only if not visited)
    if (!hasVisited) {
      const spinnerTimer = setTimeout(() => {
        setLoadingPhase((current) => current === "spinner" ? "skeleton" : current);
      }, 3000);
      return () => clearTimeout(spinnerTimer);
    }
  }, []);

  async function fetchData() {
    try {
      // Check if we have cached data from this session
      const cachedData = sessionStorage.getItem('dashboard-data');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        setPnodes(parsed.pnodes || []);
        setAnalytics(parsed.analytics);
        setAggregateStats(parsed.aggregateStats);
        setEstimatedCountries(parsed.estimatedCountries);
        setLoadingPhase("ready");

        // Still fetch fresh data in background and update
        fetchFreshData();
        return;
      }

      await fetchFreshData();
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
      setLoadingPhase("ready");
    }
  }

  async function fetchFreshData() {
    try {
      // Fetch pnodes list
      const pnodesRes = await fetch("/api/pnodes");
      if (!pnodesRes.ok) throw new Error("Failed to fetch pnodes");
      const pnodesData = await pnodesRes.json();
      setPnodes(pnodesData.pnodes || []);

      // Analyze network
      const analyticsRes = await fetch("/api/analytics");
      if (!analyticsRes.ok) throw new Error("Failed to fetch analytics");
      const analyticsData = await analyticsRes.json();
      setAnalytics(analyticsData);

      // Fetch aggregate stats from reliable seed nodes
      const statsRes = await fetch("/api/stats");
      let statsData = null;
      if (statsRes.ok) {
        statsData = await statsRes.json();
        setAggregateStats({
          totalStorage: statsData.totalStorage || 0,
          totalRam: statsData.totalRam || 0,
          avgCpu: statsData.avgCpu || 0,
          avgUptime: statsData.avgUptime || 0,
          totalData: statsData.totalData || 0,
          totalPages: statsData.totalPages || 0,
          totalPackets: statsData.totalPackets || 0,
          totalStreams: statsData.totalStreams || 0,
          publicRpcCount: statsData.nodeCount || 0,
        });
      }

      // Estimate countries
      const uniqueIPs: Set<string> = new Set((pnodesData.pnodes || []).map((node: PNodeInfo) => node.address.split(':')[0]));
      const uniquePrefixes = new Set(Array.from(uniqueIPs).map((ip) => ip.split('.').slice(0, 2).join('.')));
      const countries = Math.min(uniquePrefixes.size, 20);
      setEstimatedCountries(countries);

      // Cache the data
      sessionStorage.setItem('dashboard-data', JSON.stringify({
        pnodes: pnodesData.pnodes || [],
        analytics: analyticsData,
        aggregateStats: statsData ? {
          totalStorage: statsData.totalStorage || 0,
          totalRam: statsData.totalRam || 0,
          avgCpu: statsData.avgCpu || 0,
          avgUptime: statsData.avgUptime || 0,
          totalData: statsData.totalData || 0,
          totalPages: statsData.totalPages || 0,
          totalPackets: statsData.totalPackets || 0,
          totalStreams: statsData.totalStreams || 0,
          publicRpcCount: statsData.nodeCount || 0,
        } : null,
        estimatedCountries: countries,
      }));

      setLoadingPhase("ready");
    } catch (err) {
      console.error("Error fetching fresh data:", err);
      // Don't set error if we have cached data showing
      if (!sessionStorage.getItem('dashboard-data')) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      }
      setLoadingPhase("ready");
    }
  }

  // Show spinner phase
  if (loadingPhase === "spinner") {
    return <SpinnerScreen />;
  }

  // Show skeleton phase
  if (loadingPhase === "skeleton") {
    return <SkeletonScreen />;
  }

  // Show error
  if (error || !analytics || !aggregateStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Failed to load network data</h2>
          <p className="text-muted-foreground">{error || "Please check your connection and try again"}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show dashboard
  return (
    <MainDashboard
      analytics={analytics}
      pnodes={pnodes}
      estimatedCountries={estimatedCountries}
      aggregateStats={aggregateStats}
    />
  );
}
