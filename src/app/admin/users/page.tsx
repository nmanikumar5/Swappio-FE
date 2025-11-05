"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Search,
  Ban,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/services/api";

interface User {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
  isSuspended?: boolean;
  createdAt?: string;
  profileImage?: string;
  location?: string;
  totalListings?: number;
  totalSales?: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [actionNote, setActionNote] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const result = await adminService.getUsers({ limit: 100 });
      setUsers(result.users || []);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
      // Mock data for demo
      setUsers([
        {
          _id: "1",
          name: "John Doe",
          email: "john@example.com",
          phone: "+91 98765 43210",
          role: "user",
          isActive: true,
          isSuspended: false,
          createdAt: new Date(
            Date.now() - 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          location: "Mumbai, India",
          totalListings: 5,
          totalSales: 2,
        },
        {
          _id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "+91 87654 32109",
          role: "user",
          isActive: true,
          isSuspended: false,
          createdAt: new Date(
            Date.now() - 15 * 24 * 60 * 60 * 1000
          ).toISOString(),
          location: "Bangalore, India",
          totalListings: 3,
          totalSales: 1,
        },
        {
          _id: "3",
          name: "Admin User",
          email: "admin@example.com",
          phone: "+91 76543 21098",
          role: "admin",
          isActive: true,
          isSuspended: false,
          createdAt: new Date(
            Date.now() - 60 * 24 * 60 * 60 * 1000
          ).toISOString(),
          location: "Delhi, India",
          totalListings: 0,
          totalSales: 0,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      await adminService.suspendUser(userId);
      toast.success("User status updated");
      loadUsers();
      setShowUserModal(false);
      setActionNote("");
    } catch (error) {
      console.error("Error suspending user:", error);
      toast.error("Failed to update user status");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await adminService.deleteUser(userId);
      toast.success("User deleted successfully");
      loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
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
      (statusFilter === "inactive" && !user.isActive) ||
      (statusFilter === "admin" && user.role === "admin");

    return matchesSearch && matchesStatus;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "newest")
      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      );
    if (sortBy === "oldest")
      return (
        new Date(a.createdAt || 0).getTime() -
        new Date(b.createdAt || 0).getTime()
      );
    if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
    return 0;
  });

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.isActive && !u.isSuspended).length,
    suspendedUsers: users.filter((u) => u.isSuspended).length,
    adminUsers: users.filter((u) => u.role === "admin").length,
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Users Management
            </h1>
            <p className="mt-2 text-muted-foreground">
              Manage platform users and their accounts
            </p>
          </div>
          <Button onClick={() => (window.location.href = "/admin")}>
            ← Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card className="gradient-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-success/20 to-primary/20">
                <Activity className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeUsers}</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-destructive/20 to-warning/20">
                <Ban className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.suspendedUsers}</p>
                <p className="text-sm text-muted-foreground">Suspended</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-accent/20 to-primary/20">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.adminUsers}</p>
                <p className="text-sm text-muted-foreground">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8 gradient-border">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
                <option value="admin">Admins</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">By Name</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="space-y-4">
        {sortedUsers.length === 0 ? (
          <Card className="gradient-border">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="font-semibold">No users found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedUsers.map((user) => (
            <Card key={user._id} className="gradient-border overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
                        <Users className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <div className="mt-2 space-y-1">
                          <p className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            {user.email}
                          </p>
                          {user.phone && (
                            <p className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              {user.phone}
                            </p>
                          )}
                          {user.location && (
                            <p className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {user.location}
                            </p>
                          )}
                          {user.createdAt && (
                            <p className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              Joined{" "}
                              {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 md:gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {user.totalListings || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Listings</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-accent">
                        {user.totalSales || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Sales</p>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col items-start gap-3 md:items-end">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                      {user.isSuspended ? (
                        <Badge variant="destructive">
                          <Ban className="mr-1 h-3 w-3" />
                          Suspended
                        </Badge>
                      ) : !user.isActive ? (
                        <Badge variant="outline">Inactive</Badge>
                      ) : (
                        <Badge className="bg-success text-success-foreground">
                          <Activity className="mr-1 h-3 w-3" />
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
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
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Action Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md gradient-border">
            <CardHeader>
              <CardTitle>
                {selectedUser.isSuspended ? "Unsuspend" : "Suspend"} User
              </CardTitle>
              <CardDescription>{selectedUser.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  {selectedUser.isSuspended
                    ? "Reason for Unsuspending"
                    : "Reason for Suspending"}
                </label>
                <Textarea
                  placeholder="Provide a reason for this action..."
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowUserModal(false);
                    setActionNote("");
                    setSelectedUser(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant={selectedUser.isSuspended ? "default" : "destructive"}
                  className="flex-1"
                  onClick={() => handleSuspendUser(selectedUser._id)}
                >
                  Confirm
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
