"use client";

import { useState, useMemo } from "react";
import { parseCSV } from "@/lib/parsers";
import { RunData, PersonMetrics } from "@/lib/types";
import { FileUploader } from "./FileUploader";
import { MetricCard } from "./MetricCard";
import { ActivityChart } from "./ActivityChart";
import { RunnersTable } from "./RunnersTable";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Activity, Calendar, Trophy, AlertCircle, RefreshCcw } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export function DashboardView() {
    const [data, setData] = useState<RunData[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileSelect = async (file: File) => {
        setIsLoading(true);
        setErrors([]);
        try {
            const result = await parseCSV(file);
            if (result.errors.length > 0) {
                setErrors(result.errors);
            }
            if (result.data.length > 0) {
                setData(result.data);
            }
        } catch (e) {
            setErrors(["Failed to parse file."]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setData([]);
        setErrors([]);
    };

    const overallMetrics = useMemo(() => {
        if (data.length === 0) return null;
        const totalMiles = data.reduce((acc, curr) => acc + curr.miles, 0);
        const avgMiles = totalMiles / data.length;
        const maxMiles = Math.max(...data.map(d => d.miles));
        return {
            totalMiles,
            avgMiles,
            maxMiles,
            count: data.length
        };
    }, [data]);

    const personMetrics = useMemo(() => {
        const map = new Map<string, PersonMetrics>();

        data.forEach(run => {
            // Normalize person name
            const name = run.person.trim();
            const existing = map.get(name) || {
                person: name,
                totalMiles: 0,
                runCount: 0,
                avgMiles: 0,
                lastRun: new Date(0), // epoch
            };

            existing.totalMiles += run.miles;
            existing.runCount += 1;
            if (run.date > existing.lastRun) {
                existing.lastRun = run.date;
            }
            map.set(name, existing);
        });

        // Calculate avgs
        Array.from(map.values()).forEach(m => {
            m.avgMiles = m.totalMiles / m.runCount;
        });

        return Array.from(map.values());
    }, [data]);

    if (data.length === 0) {
        return (
            <div className="w-full max-w-2xl space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Run Analytics</h1>
                    <p className="text-muted-foreground">Upload your CSV to visualize the data.</p>
                </div>

                <FileUploader onFileSelect={handleFileSelect} />

                {errors.length > 0 && (
                    <div className="space-y-2">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error Parsing CSV</AlertTitle>
                            <AlertDescription>
                                <ul className="list-disc pl-4 text-sm space-y-1">
                                    {errors.slice(0, 5).map((err, i) => (
                                        <li key={i}>{err}</li>
                                    ))}
                                    {errors.length > 5 && <li>...and {errors.length - 5} more errors</li>}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
            </div>
        );
    }

    // Dashboard View
    return (
        <div className="space-y-8 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex gap-2">
                    <ModeToggle />
                    <Button variant="outline" onClick={handleReset}>
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Upload New File
                    </Button>
                </div>
            </div>

            {overallMetrics && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                        title="Total Miles"
                        value={overallMetrics.totalMiles.toFixed(1)}
                        icon={Activity}
                        description="All time distance"
                    />
                    <MetricCard
                        title="Avg. Distance"
                        value={overallMetrics.avgMiles.toFixed(2)}
                        icon={Trophy}
                        description="Miles per run"
                    />
                    <MetricCard
                        title="Longest Run"
                        value={overallMetrics.maxMiles.toFixed(2)}
                        icon={Trophy}
                        description="Max single distance"
                    />
                    <MetricCard
                        title="Total Runs"
                        value={overallMetrics.count}
                        icon={Calendar}
                        description="Recorded sessions"
                    />
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <ActivityChart data={data} />
                <RunnersTable metrics={personMetrics} />
            </div>

            {errors.length > 0 && (
                <Alert variant="destructive" className="mt-8">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Warnings</AlertTitle>
                    <AlertDescription>
                        Some rows were skipped due to errors.
                        <ul className="list-disc pl-4 text-sm mt-2">
                            {errors.slice(0, 3).map((err, i) => (
                                <li key={i}>{err}</li>
                            ))}
                            {errors.length > 3 && <li>...and {errors.length - 3} more</li>}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
