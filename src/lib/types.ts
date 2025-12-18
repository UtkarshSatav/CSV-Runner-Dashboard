export interface RunData {
    id: string;
    date: Date;
    person: string;
    miles: number;
    originalDateString: string; // for display/debugging if needed
}

export interface ParseResult {
    data: RunData[];
    errors: string[];
}

export interface DashboardMetrics {
    totalMiles: number;
    avgMilesPerRun: number;
    maxDistance: number;
    totalRuns: number;
}

export interface PersonMetrics {
    person: string;
    totalMiles: number;
    avgMiles: number;
    runCount: number;
    lastRun: Date;
}
