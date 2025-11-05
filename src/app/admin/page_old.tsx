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
import {
  Users,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Image as ImageIcon,
  MapPin,
  IndianRupee,
  Search,
  Ban,
  Trash2,
  UserX,
  ShieldAlert,
  TrendingUp,
  Activity,
  Filter,
} from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboard, setDashboard] = useState<any>(null);
  const [pendingListings, setPendingListings] = useState<any[]>([]);
  const [approvedListings, setApprovedListings] = useState<any[]>([]);
  const [rejectedListings, setRejectedListings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState<any>(null);
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      showToast({ type: "error", title: "Failed to load rejected listings" });
    }
  };

  const loadUsers = async () => {
    try {
      const data = await adminService.getUsers({ limit: 100 });
      setUsers(data.users || []);
    } catch (error) {
      showToast({ type: "error", title: "Failed to load users" });
    }
  };

  const loadReports = async () => {
    try {
      const data = await adminService.getReports({ limit: 100 });
      setReports(data.reports || []);
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      showToast({ type: "error", title: "Failed to delete listing" });
    }
  };

  const handleSuspendUser = async (id: string) => {
    try {
      await adminService.suspendUser(id);
      showToast({ type: "success", title: "User status updated" });
      loadUsers();
    } catch (error) {
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
    } catch (error) {
      showToast({ type: "error", title: "Failed to delete user" });
    }
  };

  const handleReviewReport = (report: any) => {
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
    } catch (error) {
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
    return (
      statusFilter === "all" ||
      report.status === statusFilter
    );
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
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage users, listings, and reports
        </p>
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
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pending">
            Pending Approval
            {stats.pendingApproval > 0 && (
              <Badge className="ml-2 bg-warning text-warning-foreground">
                {stats.pendingApproval}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

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
                <p className="text-3xl font-bold text-gradient">
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
                <p className="text-3xl font-bold text-gradient">
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
                    {dashboard.pendingListings
                      .slice(0, 5)
                      .map((listing: any) => (
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
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="bg-warning/10 text-warning"
                            >
                              Pending
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
        </TabsContent>

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
                {pendingListings.map((listing: any) => (
                  <Card
                    key={listing._id}
                    className="gradient-border overflow-hidden"
                  >
                    <div className="relative h-48 bg-muted">
                      {listing.images && listing.images[0] ? (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="h-full w-full object-cover"
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

        <TabsContent value="approved" className="mt-6">
          <Card className="gradient-border">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="mb-4 h-12 w-12 text-success" />
              <p className="font-semibold">Approved Listings</p>
              <p className="mt-1 text-sm text-muted-foreground">
                View all approved listings here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          <Card className="gradient-border">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <XCircle className="mb-4 h-12 w-12 text-destructive" />
              <p className="font-semibold">Rejected Listings</p>
              <p className="mt-1 text-sm text-muted-foreground">
                View all rejected listings here
              </p>
            </CardContent>
          </Card>
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
                  disabled={!rejectionReason.trim()}
                >
                  Reject Listing
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
