"use client";

import {
  DashboardStatsCards,
  RevenueChart,
  UserGrowthChart,
  ListingDistributionChart,
  QuickActions,
  RecentActivityFeed,
} from "@/components/admin/ImprovedDashboard";

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to your admin control center
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStatsCards />

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RevenueChart />
        <UserGrowthChart />
        <ListingDistributionChart />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity Feed */}
      <RecentActivityFeed />
    </div>
  );
};

export default AdminDashboard;
