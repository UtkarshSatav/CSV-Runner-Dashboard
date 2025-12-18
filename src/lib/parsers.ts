import Papa from "papaparse";
import { ParseResult, RunData } from "./types";
// uuid import removed

// Required headers (case-insensitive check)
const REQUIRED_HEADERS = ["Date", "Person", "Miles"];

export const parseCSV = (file: File): Promise<ParseResult> => {
    return new Promise((resolve) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const data: RunData[] = [];
                const errors: string[] = [];

                // 1. Validate Headers
                const headers = results.meta.fields || [];
                const lowerHeaders = headers.map(h => h.toLowerCase());
                const missingHeaders = REQUIRED_HEADERS.filter(
                    h => !lowerHeaders.includes(h.toLowerCase())
                );

                if (missingHeaders.length > 0) {
                    resolve({
                        data: [],
                        errors: ["Missing columns: " + missingHeaders.join(", ")]
                    });
                    return;
                }

                // Map actual headers to standard keys
                const headerMap: Record<string, string> = {};
                headers.forEach(h => {
                    const lower = h.toLowerCase();
                    if (lower === "date") headerMap.date = h;
                    if (lower === "person") headerMap.person = h;
                    if (lower === "miles") headerMap.miles = h;
                });

                // 2. Process Rows
                results.data.forEach((row: any, index) => {
                    const rowNum = index + 2; // +1 for 0-index, +1 for header
                    const dateStr = row[headerMap.date];
                    const personStr = row[headerMap.person];
                    const milesStr = row[headerMap.miles];

                    if (!dateStr || !personStr || !milesStr) {
                        // finding likely reason
                        let missing = [];
                        if (!dateStr) missing.push("Date");
                        if (!personStr) missing.push("Person");
                        if (!milesStr) missing.push("Miles");
                        errors.push("Row " + rowNum + ": Missing values for " + missing.join(", "));
                        return;
                    }

                    const miles = parseFloat(milesStr);
                    if (isNaN(miles)) {
                        errors.push("Row " + rowNum + ": Invalid 'Miles' value (\"" + milesStr + "\")");
                        return;
                    }

                    const date = new Date(dateStr);
                    if (isNaN(date.getTime())) {
                        errors.push("Row " + rowNum + ": Invalid 'Date' value (\"" + dateStr + "\")");
                        return;
                    }

                    data.push({
                        id: crypto.randomUUID(), // using native crypto, no need for external uuid lib if env is modern
                        date: date,
                        person: personStr.trim(),
                        miles: miles,
                        originalDateString: dateStr,
                    });
                });

                resolve({ data, errors });
            },
            error: (error) => {
                resolve({ data: [], errors: [error.message] });
            },
        });
    });
};
