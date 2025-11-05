"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { adminService } from "@/services/api";
import { showToast } from "@/components/ui/toast";
import ConfigManagement from "@/components/admin/ConfigManagement";
import ConfigurationStatus from "@/components/admin/ConfigurationStatus";
import FooterManagement from "@/components/admin/FooterManagement";
import PagesManagement from "@/components/admin/PagesManagement";
import {
  DashboardStatsCards,
  RevenueChart,
  UserGrowthChart,
  ListingDistributionChart,
  QuickActions,
  RecentActivityFeed,
} from "@/components/admin/ImprovedDashboard";
import {
  Users,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  ImageIcon,
  MapPin,
  IndianRupee,
  Search,
  Ban,
  Trash2,
  ShieldAlert,
} from "lucide-react";
import Image from "next/image";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboard, setDashboard] = useState<{
    stats?: {
      totalUsers?: number;
      totalListings?: number;
      pendingApproval?: number;
      pendingReports?: number;
      approvedListings?: number;
      rejectedListings?: number;
      activeListings?: number;
    };
    pendingListings?: Array<{
      _id: string;
      title: string;
      location: string;
      ownerId?: { name?: string };
    }>;
  } | null>(null);
  const [pendingListings, setPendingListings] = useState<
    Array<{
      _id: string;
      title: string;
      description?: string;
      price?: number;
      location?: string;
      images?: string[];
      ownerId?: { name?: string };
    }>
  >([]);
  const [approvedListings, setApprovedListings] = useState<
    typeof pendingListings
  >([]);
  const [rejectedListings, setRejectedListings] = useState<
    typeof pendingListings
  >([]);
  const [users, setUsers] = useState<
    Array<{
      _id: string;
      name?: string;
      email?: string;
      phone?: string;
      role?: string;
      isActive?: boolean;
      isSuspended?: boolean;
      createdAt?: string;
    }>
  >([]);
  const [reports, setReports] = useState<
    Array<{
      _id: string;
      reason?: string;
      description?: string;
      status?: string;
      reportedBy?: { name?: string; email?: string };
      listingId?: { title?: string; _id?: string };
      createdAt?: string;
      reviewNote?: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState<
    (typeof reports)[0] | null
  >(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReview, setReportReview] = useState("");

  useEffect(() => {
    loadDashboard();
    loadPendingListings();
  }, []);

  useEffect(() => {
    if (activeTab === "users") loadUsers();
    if (activeTab === "approved") loadApprovedListings();
    if (activeTab === "rejected") loadRejectedListings();
    if (activeTab === "reports") loadReports();
  }, [activeTab]);

  const loadDashboard = async () => {
    try {
      const data = await adminService.getDashboard();
      setDashboard(data);
    } catch {
      showToast({ type: "error", title: "Failed to load dashboard" });
    } finally {
      setLoading(false);
    }
  };

  const loadPendingListings = async () => {
    try {
      const data = await adminService.getListings({
        approvalStatus: "pending",
        limit: 50,
      });
      setPendingListings(data.listings || []);
    } catch {
      showToast({ type: "error", title: "Failed to load pending listings" });
    }
  };

  const loadApprovedListings = async () => {
    try {
      const data = await adminService.getListings({
        approvalStatus: "approved",
        limit: 50,
      });
      setApprovedListings(data.listings || []);
    } catch {
      showToast({ type: "error", title: "Failed to load approved listings" });
    }
  };

  const loadRejectedListings = async () => {
    try {
      const data = await adminService.getListings({
        approvalStatus: "rejected",
        limit: 50,
      });
      setRejectedListings(data.listings || []);
    } catch {
      showToast({ type: "error", title: "Failed to load rejected listings" });
    }
  };

  const loadUsers = async () => {
    try {
      const data = await adminService.getUsers({ limit: 100 });
      setUsers(data.users || []);
    } catch {
      showToast({ type: "error", title: "Failed to load users" });
    }
  };

  const loadReports = async () => {
    try {
      const data = await adminService.getReports({ limit: 100 });
      setReports(data.reports || []);
    } catch {
      showToast({ type: "error", title: "Failed to load reports" });
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await adminService.approveListing(id);
      showToast({ type: "success", title: "Listing approved successfully" });
      loadDashboard();
      loadPendingListings();
      if (activeTab === "approved") loadApprovedListings();
    } catch {
      showToast({ type: "error", title: "Failed to approve listing" });
    }
  };

  const openRejectModal = (id: string) => {
    setSelectedListing(id);
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!selectedListing || !rejectionReason.trim()) {
      showToast({ type: "error", title: "Please provide a rejection reason" });
      return;
    }

    try {
      await adminService.rejectListing(selectedListing, rejectionReason);
      showToast({ type: "success", title: "Listing rejected" });
      setShowRejectModal(false);
      setRejectionReason("");
      setSelectedListing(null);
      loadDashboard();
      loadPendingListings();
      if (activeTab === "rejected") loadRejectedListings();
    } catch {
      showToast({ type: "error", title: "Failed to reject listing" });
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      await adminService.deleteListing(id);
      showToast({ type: "success", title: "Listing deleted successfully" });
      loadDashboard();
      if (activeTab === "pending") loadPendingListings();
      if (activeTab === "approved") loadApprovedListings();
      if (activeTab === "rejected") loadRejectedListings();
    } catch {
      showToast({ type: "error", title: "Failed to delete listing" });
    }
  };

  const handleSuspendUser = async (id: string) => {
    try {
      await adminService.suspendUser(id);
      showToast({ type: "success", title: "User status updated" });
      loadUsers();
    } catch {
      showToast({ type: "error", title: "Failed to update user status" });
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await adminService.deleteUser(id);
      showToast({ type: "success", title: "User deleted successfully" });
      loadUsers();
      loadDashboard();
    } catch {
      showToast({ type: "error", title: "Failed to delete user" });
    }
  };

  const handleReviewReport = (report: (typeof reports)[0]) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const handleUpdateReport = async (status: string) => {
    if (!selectedReport) return;

    try {
      await adminService.updateReport(selectedReport._id, status, reportReview);
      showToast({ type: "success", title: "Report updated successfully" });
      setShowReportModal(false);
      setReportReview("");
      setSelectedReport(null);
      loadReports();
      loadDashboard();
    } catch {
      showToast({ type: "error", title: "Failed to update report" });
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchQuery ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive && !user.isSuspended) ||
      (statusFilter === "suspended" && user.isSuspended) ||
      (statusFilter === "inactive" && !user.isActive);

    return matchesSearch && matchesStatus;
  });

  const filteredReports = reports.filter((report) => {
    return statusFilter === "all" || report.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const stats = dashboard?.stats || {};

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-muted-foreground">
              Manage users, listings, and reports
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/admin/payment-plans")}
            >
              💳 Payment Plans
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/admin/pricing")}
            >
              💰 Pricing Config
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <Card className="gradient-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalUsers || 0}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-success/20 to-primary/20">
                <Package className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalListings || 0}</p>
                <p className="text-sm text-muted-foreground">Total Listings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-warning/20 to-accent/20">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats.pendingApproval || 0}
                </p>
                <p className="text-sm text-muted-foreground">
                  Pending Approval
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-destructive/20 to-warning/20">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats.pendingReports || 0}
                </p>
                <p className="text-sm text-muted-foreground">Pending Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="gradient-bg">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="pending">
            Pending{" "}
            {(stats.pendingApproval || 0) > 0 && (
              <Badge className="ml-2 bg-warning text-warning-foreground">
                {stats.pendingApproval}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reports">
            Reports{" "}
            {(stats.pendingReports || 0) > 0 && (
              <Badge className="ml-2 bg-destructive text-destructive-foreground">
                {stats.pendingReports}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="config">⚙️ Configuration</TabsTrigger>
          <TabsTrigger value="config-status">📊 Config Status</TabsTrigger>
          <TabsTrigger value="footer">🔗 Footer</TabsTrigger>
          <TabsTrigger value="pages">📄 Pages</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab - New Improved Dashboard */}
        <TabsContent value="dashboard" className="mt-6 space-y-6">
          {/* Stats Cards */}
          <DashboardStatsCards />

          {/* Charts and Analytics */}
          <div className="grid gap-6 md:grid-cols-2">
            <RevenueChart />
            <UserGrowthChart />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <ListingDistributionChart />
            <QuickActions />
            <RecentActivityFeed />
          </div>
        </TabsContent>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="gradient-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  Approved Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold bg-gradient-to-r from-success to-primary bg-clip-text text-transparent">
                  {stats.approvedListings || 0}
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-destructive" />
                  Rejected Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {stats.rejectedListings || 0}
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Active Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {stats.activeListings || 0}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Pending Listings */}
          {dashboard?.pendingListings &&
            dashboard.pendingListings.length > 0 && (
              <Card className="gradient-border">
                <CardHeader>
                  <CardTitle>Recent Pending Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboard.pendingListings.slice(0, 5).map((listing) => (
                      <div
                        key={listing._id}
                        className="flex items-center justify-between border-b pb-4 last:border-0"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{listing.title}</p>
                          <p className="text-sm text-muted-foreground">
                            by {listing.ownerId?.name || "Unknown"} •{" "}
                            {listing.location}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-warning/10 text-warning"
                        >
                          Pending
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
        </TabsContent>

        {/* Pending Listings Tab */}
        <TabsContent value="pending" className="mt-6">
          <div className="space-y-4">
            {pendingListings.length === 0 ? (
              <Card className="gradient-border">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Clock className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="font-semibold">No pending listings</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    All listings have been reviewed
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pendingListings.map((listing) => (
                  <Card
                    key={listing._id}
                    className="gradient-border overflow-hidden"
                  >
                    <div className="relative h-48 bg-muted">
                      {listing.images && listing.images[0] ? (
                        <Image
                          src={listing.images[0]}
                          alt={listing.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          priority={true}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <Badge className="absolute right-2 top-2 bg-warning text-warning-foreground">
                        Pending
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold line-clamp-1">
                        {listing.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {listing.description}
                      </p>
                      <div className="mt-3 space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <IndianRupee className="h-4 w-4" />
                          <span className="font-semibold text-primary">
                            ₹{listing.price?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{listing.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{listing.ownerId?.name || "Unknown"}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button
                          className="flex-1 bg-gradient-to-r from-success to-primary"
                          onClick={() => handleApprove(listing._id)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          className="flex-1"
                          onClick={() => openRejectModal(listing._id)}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Users Management Tab */}
        <TabsContent value="users" className="mt-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "active" ? "default" : "outline"}
                onClick={() => setStatusFilter("active")}
              >
                Active
              </Button>
              <Button
                variant={statusFilter === "suspended" ? "default" : "outline"}
                onClick={() => setStatusFilter("suspended")}
              >
                Suspended
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <Card className="gradient-border">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="font-semibold">No users found</p>
                </CardContent>
              </Card>
            ) : (
              filteredUsers.map((user) => (
                <Card key={user._id} className="gradient-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">
                              {user.name || "Unknown"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-3">
                          <Badge
                            variant={
                              user.role === "admin" ? "default" : "secondary"
                            }
                          >
                            {user.role}
                          </Badge>
                          {user.isSuspended && (
                            <Badge variant="destructive">
                              <Ban className="mr-1 h-3 w-3" />
                              Suspended
                            </Badge>
                          )}
                          {!user.isActive && (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuspendUser(user._id)}
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          {user.isSuspended ? "Unsuspend" : "Suspend"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="mt-6 space-y-4">
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "pending" ? "default" : "outline"}
              onClick={() => setStatusFilter("pending")}
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === "reviewed" ? "default" : "outline"}
              onClick={() => setStatusFilter("reviewed")}
            >
              Reviewed
            </Button>
            <Button
              variant={statusFilter === "resolved" ? "default" : "outline"}
              onClick={() => setStatusFilter("resolved")}
            >
              Resolved
            </Button>
          </div>

          <div className="space-y-4">
            {filteredReports.length === 0 ? (
              <Card className="gradient-border">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <ShieldAlert className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="font-semibold">No reports found</p>
                </CardContent>
              </Card>
            ) : (
              filteredReports.map((report) => (
                <Card key={report._id} className="gradient-border">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                          <div>
                            <p className="font-semibold">{report.reason}</p>
                            <p className="text-sm text-muted-foreground">
                              {report.description}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 space-y-2 text-sm">
                          <p className="text-muted-foreground">
                            <span className="font-medium">Reported by:</span>{" "}
                            {report.reportedBy?.name} (
                            {report.reportedBy?.email})
                          </p>
                          <p className="text-muted-foreground">
                            <span className="font-medium">Listing:</span>{" "}
                            {report.listingId?.title}
                          </p>
                          {report.reviewNote && (
                            <p className="text-muted-foreground">
                              <span className="font-medium">Review:</span>{" "}
                              {report.reviewNote}
                            </p>
                          )}
                        </div>
                        <div className="mt-3">
                          <Badge
                            variant={
                              report.status === "pending"
                                ? "destructive"
                                : report.status === "reviewed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {report.status}
                          </Badge>
                        </div>
                      </div>
                      <Button onClick={() => handleReviewReport(report)}>
                        Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Approved Listings Tab */}
        <TabsContent value="approved" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {approvedListings.length === 0 ? (
              <Card className="gradient-border col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="mb-4 h-12 w-12 text-success" />
                  <p className="font-semibold">No approved listings yet</p>
                </CardContent>
              </Card>
            ) : (
              approvedListings.map((listing) => (
                <Card
                  key={listing._id}
                  className="gradient-border overflow-hidden"
                >
                  <div className="relative h-48 bg-muted">
                    {listing.images?.[0] ? (
                      <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={true}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{listing.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {listing.description}
                    </p>
                    <div className="mt-3 flex justify-between">
                      <span className="font-semibold text-primary">
                        ₹{listing.price?.toLocaleString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteListing(listing._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Rejected Listings Tab */}
        <TabsContent value="rejected" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rejectedListings.length === 0 ? (
              <Card className="gradient-border col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <XCircle className="mb-4 h-12 w-12 text-destructive" />
                  <p className="font-semibold">No rejected listings</p>
                </CardContent>
              </Card>
            ) : (
              rejectedListings.map((listing) => (
                <Card
                  key={listing._id}
                  className="gradient-border overflow-hidden"
                >
                  <div className="relative h-48 bg-muted">
                    {listing.images?.[0] ? (
                      <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={true}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{listing.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {listing.description}
                    </p>
                    <div className="mt-3 flex justify-between">
                      <span className="font-semibold text-primary">
                        ₹{listing.price?.toLocaleString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteListing(listing._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="config" className="mt-6">
          <ConfigManagement />
        </TabsContent>

        {/* Configuration Status Tab */}
        <TabsContent value="config-status" className="mt-6">
          <ConfigurationStatus />
        </TabsContent>

        <TabsContent value="footer" className="mt-6">
          <FooterManagement />
        </TabsContent>

        <TabsContent value="pages" className="mt-6">
          <PagesManagement />
        </TabsContent>
      </Tabs>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md gradient-border">
            <CardHeader>
              <CardTitle>Reject Listing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Rejection Reason</label>
                <Textarea
                  placeholder="Explain why this listing is being rejected..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                    setSelectedListing(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleReject}
                >
                  Confirm Rejection
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Report Review Modal */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md gradient-border">
            <CardHeader>
              <CardTitle>Review Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Report Details</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-medium">Reason:</span>{" "}
                  {selectedReport.reason}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Description:</span>{" "}
                  {selectedReport.description}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">
                  Review Note (Optional)
                </label>
                <Textarea
                  placeholder="Add your review notes..."
                  value={reportReview}
                  onChange={(e) => setReportReview(e.target.value)}
                  rows={3}
                  className="mt-2"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowReportModal(false);
                    setReportReview("");
                    setSelectedReport(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => handleUpdateReport("reviewed")}
                >
                  Mark Reviewed
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-success to-primary"
                  onClick={() => handleUpdateReport("resolved")}
                >
                  Resolve
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
