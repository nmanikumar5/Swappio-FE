"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Activity,
} from "lucide-react";

interface DashboardStats {
  revenue?: {
    total: number;
    thisMonth: number;
    growth: number;
  };
  users?: {
    total: number;
    active: number;
    new: number;
  };
  listings?: {
    total: number;
    active: number;
    pending: number;
  };
  payments?: {
    total: number;
    thisMonth: number;
    pending: number;
  };
}

interface RecentActivity {
  _id: string;
  type: "listing" | "user" | "payment" | "report";
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

// Sample data for charts
const revenueChartData = [
  { month: "Jan", revenue: 2400, target: 2400 },
  { month: "Feb", revenue: 1398, target: 2210 },
  { month: "Mar", revenue: 9800, target: 2290 },
  { month: "Apr", revenue: 3908, target: 2000 },
  { month: "May", revenue: 4800, target: 2181 },
  { month: "Jun", revenue: 3800, target: 2500 },
];

const listingDistributionData = [
  { name: "Approved", value: 45 },
  { name: "Pending", value: 12 },
  { name: "Rejected", value: 8 },
];

const userGrowthData = [
  { week: "W1", users: 120, active: 100 },
  { week: "W2", users: 180, active: 150 },
  { week: "W3", users: 200, active: 160 },
  { week: "W4", users: 280, active: 220 },
];

// Capture a stable "now" once per module load to avoid impure calls during render
const NOW = Date.now();

export function DashboardStatsCards() {
  const [stats, setStats] = useState<DashboardStats>({});

  useEffect(() => {
    let cancelled = false;
    import("@/services/api")
      .then(({ adminService }) => adminService.getStats())
      .then((data) => {
        if (!cancelled) setStats(data as DashboardStats);
      })
      .catch(() => {
        // fallback demo values
        if (!cancelled)
          setStats({
            revenue: { total: 125000, thisMonth: 25000, growth: 12.5 },
            users: { total: 1250, active: 892, new: 45 },
            listings: { total: 3420, active: 2100, pending: 45 },
            payments: { total: 4520, thisMonth: 520, pending: 12 },
          });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {/* Revenue Card */}
      <Card className="gradient-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="mt-2 text-3xl font-bold">
                ₹{(stats.revenue?.total || 0) / 100000}L
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-success">
                <ArrowUpRight className="h-3 w-3" />
                {stats.revenue?.growth}% this month
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-accent/20 to-primary/20">
              <DollarSign className="h-6 w-6 text-accent" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Card */}
      <Card className="gradient-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="mt-2 text-3xl font-bold">
                {stats.users?.total || 0}
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Activity className="h-3 w-3" />
                {stats.users?.active || 0} active
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Listings Card */}
      <Card className="gradient-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Listings</p>
              <p className="mt-2 text-3xl font-bold">
                {stats.listings?.total || 0}
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-warning">
                <Clock className="h-3 w-3" />
                {stats.listings?.pending || 0} pending
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-success/20 to-primary/20">
              <Package className="h-6 w-6 text-success" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Card */}
      <Card className="gradient-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Payments</p>
              <p className="mt-2 text-3xl font-bold">
                {stats.payments?.total || 0}
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                <AlertTriangle className="h-3 w-3" />
                {stats.payments?.pending || 0} pending
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-destructive/20 to-warning/20">
              <TrendingUp className="h-6 w-6 text-destructive" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function RevenueChart() {
  return (
    <Card className="gradient-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Revenue Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#3b82f6" name="Actual Revenue" />
            <Bar dataKey="target" fill="#d1d5db" name="Target" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function UserGrowthChart() {
  return (
    <Card className="gradient-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          User Growth
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#3b82f6"
              name="Total Users"
            />
            <Line
              type="monotone"
              dataKey="active"
              stroke="#10b981"
              name="Active Users"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ListingDistributionChart() {
  return (
    <Card className="gradient-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Listings Status
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={listingDistributionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {listingDistributionData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function QuickActions() {
  const actions = [
    {
      label: "Users",
      href: "/admin/users",
      icon: <Users className="h-4 w-4" />,
      color: "primary",
    },
    {
      label: "Listings",
      href: "/admin/listings",
      icon: <Package className="h-4 w-4" />,
      color: "success",
    },
    {
      label: "Payments",
      href: "/admin/payments",
      icon: <DollarSign className="h-4 w-4" />,
      color: "accent",
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: <Package className="h-4 w-4" />,
      color: "secondary",
    },
  ];

  return (
    <Card className="gradient-border">
      <CardHeader>
        <CardTitle>Quick Access</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {actions.map((action) => (
            <Button
              key={action.href}
              variant="outline"
              className="h-auto flex-col gap-2 py-3"
              onClick={() => (window.location.href = action.href)}
            >
              {action.icon}
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function RecentActivityFeed() {
  const activities: RecentActivity[] = [
    {
      _id: "1",
      type: "listing",
      title: "New Listing Pending",
      description: "iPhone 14 Pro - ₹75,000",
      timestamp: new Date(NOW - 5 * 60000).toISOString(),
      status: "pending",
    },
    {
      _id: "2",
      type: "user",
      title: "New User Registration",
      description: "John Doe (john@example.com)",
      timestamp: new Date(NOW - 15 * 60000).toISOString(),
    },
    {
      _id: "3",
      type: "payment",
      title: "Payment Received",
      description: "TXN-2024-001: ₹5,000",
      timestamp: new Date(NOW - 30 * 60000).toISOString(),
      status: "completed",
    },
    {
      _id: "4",
      type: "report",
      title: "New Report",
      description: "Suspicious listing reported",
      timestamp: new Date(NOW - 60 * 60000).toISOString(),
      status: "pending",
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "listing":
        return <Package className="h-4 w-4 text-primary" />;
      case "user":
        return <Users className="h-4 w-4 text-success" />;
      case "payment":
        return <DollarSign className="h-4 w-4 text-accent" />;
      case "report":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    return (
      <Badge
        variant={status === "completed" ? "default" : "secondary"}
        className="text-xs"
      >
        {status}
      </Badge>
    );
  };

  return (
    <Card className="gradient-border">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity._id}
              className="flex items-start gap-3 border-b pb-3 last:border-0"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-muted to-muted-foreground/20">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{activity.title}</p>
                  {getStatusBadge(activity.status)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
