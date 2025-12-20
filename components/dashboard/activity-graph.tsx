"use client";

import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface ActivityGraphProps {
    packets: number;
    streams: number;
}

// Generate mock activity data based on current values
// In a real app, this would come from historical data
function generateActivityData(packets: number, streams: number) {
    const data = [];
    const basePackets = packets / 12; // Distribute across 12 points
    const baseStreams = streams / 12;

    for (let i = 0; i < 12; i++) {
        // Add some variance to make it look like real activity
        const variance = 0.7 + Math.random() * 0.6;
        data.push({
            time: `${i * 5}m`,
            packets: Math.floor(basePackets * variance),
            streams: Math.floor(baseStreams * variance * 5 + Math.random() * 10), // Scale up for visibility
        });
    }
    return data;
}

export function ActivityGraph({ packets, streams }: ActivityGraphProps) {
    const data = generateActivityData(packets, streams);

    return (
        <div className="h-[120px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                    <defs>
                        <linearGradient id="packetsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#14F1C6" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#14F1C6" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="streamsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.05} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="time"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#888' }}
                        interval="preserveStartEnd"
                    />
                    <YAxis hide />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '12px'
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="packets"
                        stroke="#14F1C6"
                        strokeWidth={2}
                        fill="url(#packetsGradient)"
                        name="Packets"
                    />
                    <Area
                        type="monotone"
                        dataKey="streams"
                        stroke="#8B5CF6"
                        strokeWidth={2}
                        fill="url(#streamsGradient)"
                        name="Streams"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
