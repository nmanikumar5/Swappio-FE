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
  Package,
  Search,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  ImageIcon,
  MapPin,
  User,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { adminService } from "@/services/api";

interface Listing {
  _id: string;
  title: string;
  description?: string;
  price?: number;
  location?: string;
  images?: string[];
  approvalStatus?: string;
  ownerId?: { _id: string; name?: string; email?: string };
  createdAt?: string;
  updatedAt?: string;
  category?: string;
  views?: number;
  isActive?: boolean;
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  // const [actionType, setActionType] = useState<"reject" | "view">("reject");
  const [actionNote, setActionNote] = useState("");

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      const result = await adminService.getListings({ limit: 100 });
      setListings(result.listings || []);
    } catch (error) {
      console.error("Error loading listings:", error);
      toast.error("Failed to load listings");
      // Mock data for demo
      setListings([
        {
          _id: "1",
          title: "iPhone 14 Pro",
          description: "Excellent condition, all accessories included",
          price: 75000,
          location: "Mumbai, India",
          images: ["https://via.placeholder.com/400x300"],
          approvalStatus: "pending",
          ownerId: { _id: "u1", name: "John Doe", email: "john@example.com" },
          createdAt: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
          category: "Electronics",
          views: 45,
          isActive: true,
        },
        {
          _id: "2",
          title: "Mountain Bike",
          description: "Trek brand, 1 year old, well maintained",
          price: 25000,
          location: "Bangalore, India",
          images: ["https://via.placeholder.com/400x300"],
          approvalStatus: "approved",
          ownerId: { _id: "u2", name: "Jane Smith", email: "jane@example.com" },
          createdAt: new Date(
            Date.now() - 10 * 24 * 60 * 60 * 1000
          ).toISOString(),
          category: "Sports",
          views: 120,
          isActive: true,
        },
        {
          _id: "3",
          title: "Vintage Watch",
          description: "Rolex Submariner, needs restoration",
          price: 150000,
          location: "Delhi, India",
          images: ["https://via.placeholder.com/400x300"],
          approvalStatus: "rejected",
          ownerId: {
            _id: "u3",
            name: "Mike Johnson",
            email: "mike@example.com",
          },
          createdAt: new Date(
            Date.now() - 20 * 24 * 60 * 60 * 1000
          ).toISOString(),
          category: "Accessories",
          views: 200,
          isActive: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveListing = async (listingId: string) => {
    try {
      await adminService.approveListing(listingId);
      toast.success("Listing approved successfully");
      loadListings();
    } catch (error) {
      console.error("Error approving listing:", error);
      toast.error("Failed to approve listing");
    }
  };

  const handleRejectListing = async (listingId: string) => {
    if (!actionNote.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      await adminService.rejectListing(listingId, actionNote);
      toast.success("Listing rejected successfully");
      loadListings();
      setShowActionModal(false);
      setActionNote("");
    } catch (error) {
      console.error("Error rejecting listing:", error);
      toast.error("Failed to reject listing");
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      await adminService.deleteListing(listingId);
      toast.success("Listing deleted successfully");
      loadListings();
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Failed to delete listing");
    }
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      !searchQuery ||
      listing.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || listing.approvalStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
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
    if (sortBy === "price") return (a.price || 0) - (b.price || 0);
    if (sortBy === "views") return (b.views || 0) - (a.views || 0);
    return 0;
  });

  const stats = {
    totalListings: listings.length,
    pendingListings: listings.filter((l) => l.approvalStatus === "pending")
      .length,
    approvedListings: listings.filter((l) => l.approvalStatus === "approved")
      .length,
    rejectedListings: listings.filter((l) => l.approvalStatus === "rejected")
      .length,
    activeListings: listings.filter((l) => l.isActive).length,
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
              Listings Management
            </h1>
            <p className="mt-2 text-muted-foreground">
              Manage and approve user listings
            </p>
          </div>
          <Button onClick={() => (window.location.href = "/admin")}>
            ← Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-8 grid gap-4 md:grid-cols-5">
        <Card className="gradient-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalListings}</p>
                <p className="text-sm text-muted-foreground">Total</p>
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
                <p className="text-2xl font-bold">{stats.pendingListings}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-success/20 to-primary/20">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.approvedListings}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-destructive/20 to-warning/20">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.rejectedListings}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-accent/20 to-primary/20">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeListings}</p>
                <p className="text-sm text-muted-foreground">Active</p>
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
                placeholder="Search by title or description..."
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
                <option value="all">All Listings</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price">Price: Low to High</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Listings Grid */}
      <div className="space-y-4">
        {sortedListings.length === 0 ? (
          <Card className="gradient-border">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="font-semibold">No listings found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedListings.map((listing) => (
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
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <Badge
                    className="absolute right-2 top-2"
                    variant={
                      listing.approvalStatus === "approved"
                        ? "default"
                        : listing.approvalStatus === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {listing.approvalStatus}
                  </Badge>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold line-clamp-2">
                    {listing.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {listing.description}
                  </p>

                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-primary">
                        ₹{listing.price?.toLocaleString()}
                      </span>
                      {listing.views && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {listing.views} views
                        </span>
                      )}
                    </div>
                    {listing.location && (
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {listing.location}
                      </p>
                    )}
                    {listing.ownerId && (
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        {listing.ownerId.name}
                      </p>
                    )}
                    {listing.createdAt && (
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    {listing.approvalStatus === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-gradient-to-r from-success to-primary text-sm"
                          onClick={() => handleApproveListing(listing._id)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          className="flex-1 text-sm"
                          onClick={() => {
                            setSelectedListing(listing);
                            setShowActionModal(true);
                          }}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      className="w-full text-sm"
                      onClick={() => handleDeleteListing(listing._id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Action Modal */}
      {showActionModal && selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md gradient-border">
            <CardHeader>
              <CardTitle>Reject Listing</CardTitle>
              <CardDescription>{selectedListing.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Rejection Reason</label>
                <Textarea
                  placeholder="Explain why this listing is being rejected..."
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
                    setShowActionModal(false);
                    setActionNote("");
                    setSelectedListing(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleRejectListing(selectedListing._id)}
                >
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
