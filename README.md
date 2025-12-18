# CSV Runner Dashboard

A Next.js application for parsing, validating, and visualizing runner data from CSV files. Built with shadcn/ui and Recharts.

## Overview
This project allows users to upload a CSV file containing running data (date, person, miles). It parses the file client-side, validates the headers and data types, and presents a responsive dashboard with key metrics and interactive charts.

## Assumptions
- **CSV Format**: Expects columns `Date`, `Person`, `Miles`. Header matching is case-insensitive.
- **Data Types**: `Miles` must be a number. `Date` must be a valid date string.
- **Privacy**: All processing happens client-side in the browser; no data is uploaded to a server.
- **Theme**: Dark mode is enabled by default for a premium aesthetic.

## Prerequisites
- Node.js 18+
- npm

## Setup

1.  **Install dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    This project does not currently require specific environment variables for local development. A `.env.example` is provided for future extensibility.
    ```bash
    cp .env.example .env
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app.

## Sample CSV + Instructions

1. Download `sample-runners.csv` from repo
2. Upload via dashboard
3. Expected results:
   - Overall: 16 runs, avg 6.48 miles, min 3.8, max 10.2
   - Utkarsh: avg 5.0 miles (4 runs)
   - Amit: avg 7.13 miles (5 runs) 
   - Priya: avg 5.0 miles (4 runs)
   - Rahul: avg 9.33 miles (3 runs)

Test edge cases:
- Empty file → Error: "No data found"
- Wrong headers → Error: "Missing required columns: date,person,miles"
- Invalid date → Error: "Invalid date format on row X"

## Features & Limitations
### Features
- **File Upload**: Drag & drop support with type validation.
- **Robust Parsing**: Detailed error reporting for schema violations and data type mismatches.
- **Visualizations**: 
    - **Global Stats**: Total miles, average distance, max run, total count.
    - **Activity Chart**: Daily mileage bar chart.
    - **Leaderboard**: Per-person aggregations with sortable metrics.
- **UX**: Loading states, empty states, and "Reset" functionality.
- **Dark Mode**: Polished default dark theme.

### Limitations
- **Client-Side Only**: Large files (e.g., >100MB) might cause browser lag.
- **Persistence**: Data is lost on page refresh (by design for this dashboard).

## Architecture
- **Framework**: Next.js 14 (App Router).
- **Styling**: Tailwind CSS + shadcn/ui.
- **State Management**: React `useState` / `useMemo` for derived metrics.
- **Parsing**: `papaparse` for fast CSV processing.
- **Charts**: `recharts` for responsive visualizations.

**Folder Structure**:
- `src/components/dashboard`: Core domain components (`FileUploader`, `DashboardView`, etc.).
- `src/lib`: Utilities and Types (`parsers.ts`, `types.ts`).
- `src/app`: Page routes and global styles.

## Accessibility & UI
- **Colors**: Used a high-contrast dark theme (Zinc).
- **Semantics**: Proper HTML5 tags (`main`, `h1`, `table`).
- **Focus**: Interactive elements have visible focus states.
- **Feedback**: Immediate error alerts for invalid inputs.
