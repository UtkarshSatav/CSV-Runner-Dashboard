import { DashboardView } from "@/components/dashboard/DashboardView";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background py-10">
      <DashboardView />
    </main>
  );
}
