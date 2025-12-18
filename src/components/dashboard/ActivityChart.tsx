"use client";

import { useMemo } from "react";
import { parseISO, format } from "date-fns";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import { RunData } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityChartProps {
    data: RunData[];
}

export function ActivityChart({ data }: ActivityChartProps) {
    const chartData = useMemo(() => {
        // Group by date (assuming 'date' is Date object)
        // We want to sort by date
        const sorted = [...data].sort((a, b) => a.date.getTime() - b.date.getTime());

        // Aggregate by date to avoid multiple bars for same day if needing 'Daily Activity'
        // Or just show individual runs. Let's aggregate by date for cleaner chart.
        const aggregated: Record<string, number> = {};

        sorted.forEach(run => {
            // Use simpler date string key
            const key = run.date.toISOString().split("T")[0]; // YYYY-MM-DD
            aggregated[key] = (aggregated[key] || 0) + run.miles;
        });

        return Object.entries(aggregated).map(([date, miles]) => ({
            date,
            miles,
            formattedDate: format(parseISO(date), "MMM d"),
        }));
    }, [data]);

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Daily Running Activity</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="formattedDate"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => value + " mi"}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)" }}
                                cursor={{ fill: "transparent" }}
                            />
                            <Bar
                                dataKey="miles"
                                fill="currentColor"
                                radius={[4, 4, 0, 0]}
                                className="fill-primary"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
