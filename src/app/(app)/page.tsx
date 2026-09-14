import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { DueSoonPanel } from "@/components/dashboard/DueSoonPanel";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-subtle-foreground">
          Herd overview and what needs attention.
        </p>
      </div>
      <SummaryCards />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DueSoonPanel />
        <ActivityFeed />
      </div>
    </div>
  );
}
