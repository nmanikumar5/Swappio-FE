"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { updateProfile } from "@/services/auth";
import { uploadService, listingService } from "@/services/api";
import { showToast } from "@/components/ui/toast";
import Spinner from "@/components/ui/Spinner";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Upload,
  Camera,
  Package,
  Heart,
  MessageSquare,
  TrendingUp,
  Shield,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { format } from "date-fns";

export default function EditProfilePage() {
  const authUser = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    totalViews: 0,
    totalMessages: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // track the last object URL so we can revoke it
  const [lastObjectUrl, setLastObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (authUser) {
      setName(authUser.name || "");
      setPhone(authUser.phone || "");
      setLocation(authUser.location || "");
      setPhoto(authUser.photo || "");
      setPreview(authUser.photo || null);
    }

    // Load user statistics
    const loadStats = async () => {
      try {
        setStatsLoading(true);
        const listings = await listingService.getMyListings(1, 100);
        setStats({
          totalListings: listings.listings?.length || 0,
          activeListings:
            listings.listings?.filter((l: any) => l.isActive !== false)
              .length || 0,
          totalViews:
            listings.listings?.reduce(
              (sum: number, l: any) => sum + (l.views || 0),
              0
            ) || 0,
          totalMessages: 0, // Will be updated when we have message stats
        });
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    if (authUser) {
      loadStats();
    }
  }, [authUser]);

  useEffect(() => {
    return () => {
      if (lastObjectUrl) {
        try {
          URL.revokeObjectURL(lastObjectUrl);
        } catch {}
      }
    };
  }, [lastObjectUrl]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await updateProfile({ name, phone, location, photo });
      // persist in auth store (no token change)
      setUser(
        {
          id: updated.id,
          name: updated.name,
          email: authUser?.email || "",
          phone: updated.phone,
          photo: updated.photo,
          location: updated.location,
          createdAt: authUser?.createdAt || new Date().toISOString(),
          role: authUser?.role || "user",
        },
        null
      );

      // persist user locally so reloads show updated image even when token isn't present
      try {
        const persisted = {
          ...(authUser || {}),
          id: updated.id,
          name: updated.name,
          email: authUser?.email || "",
          phone: updated.phone,
          photo: updated.photo,
          location: updated.location,
        };
        localStorage.setItem("swappio_user", JSON.stringify(persisted));
      } catch {}

      // ensure preview reflects saved remote URL
      if (updated.photo) setPreview(updated.photo);

      showToast({ type: "success", title: "Profile updated" });
    } catch (err: unknown) {
      let msg = "Update failed";
      if (err && typeof err === "object" && "message" in err)
        msg = String((err as Record<string, unknown>).message || "");
      showToast({ type: "error", title: "Save failed", description: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 p-4 md:p-8 animate-fade-in">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gradient">
            My Profile
          </h1>
          <p className="text-lg text-muted-foreground flex items-center gap-2">
            <User className="h-5 w-5" />
            Manage your account settings and view your stats
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <Card className="glass border-primary/20 hover:shadow-xl transition-shadow">
              <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 p-6">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <User className="h-6 w-6 text-primary" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-border/50">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full ring-4 ring-primary/20 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:ring-primary/40 transition-all">
                        {preview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={preview}
                            alt="Profile"
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <User className="h-16 w-16 text-primary/40" />
                          </div>
                        )}
                      </div>
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all hover:scale-110"
                      >
                        <Camera className="h-5 w-5 text-white" />
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (!file.type.startsWith("image/")) {
                            showToast({
                              type: "error",
                              title: "Invalid file",
                              description: "Please select an image file.",
                            });
                            return;
                          }
                          if (file.size > 2 * 1024 * 1024) {
                            showToast({
                              type: "error",
                              title: "File too large",
                              description: "Max 2MB allowed.",
                            });
                            return;
                          }

                          try {
                            if (lastObjectUrl) {
                              URL.revokeObjectURL(lastObjectUrl);
                              setLastObjectUrl(null);
                            }
                          } catch {}

                          const url = URL.createObjectURL(file);
                          setPreview(url);
                          setLastObjectUrl(url);

                          try {
                            setUploading(true);
                            setUploadProgress(0);
                            const uploaded = await uploadService.uploadImage(
                              file,
                              (pct) => setUploadProgress(pct),
                              "swappio/profiles"
                            );

                            try {
                              if (lastObjectUrl) {
                                URL.revokeObjectURL(lastObjectUrl);
                                setLastObjectUrl(null);
                              }
                            } catch {}

                            setPhoto(uploaded);
                            setPreview(uploaded);
                            showToast({
                              type: "success",
                              title: "Upload complete",
                            });
                          } catch (err) {
                            console.error("Upload error", err);
                            showToast({
                              type: "error",
                              title: "Upload failed",
                              description: String((err as Error).message || ""),
                            });
                            setPhoto("");
                            try {
                              if (lastObjectUrl)
                                URL.revokeObjectURL(lastObjectUrl);
                            } catch {}
                            setPreview(null);
                          } finally {
                            setUploading(false);
                            setUploadProgress(null);
                          }
                        }}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold mb-1">
                        Profile Photo
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Max 2MB • JPG, PNG recommended
                      </p>
                      {uploading && uploadProgress !== null && (
                        <div className="w-full max-w-xs mt-3">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Uploading: {uploadProgress}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-semibold">
                        <User className="h-4 w-4 text-primary" />
                        Full Name
                      </Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="border-primary/20 focus-visible:ring-primary/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-semibold">
                        <Mail className="h-4 w-4 text-secondary" />
                        Email Address
                      </Label>
                      <Input
                        value={authUser?.email || ""}
                        disabled
                        className="bg-muted/50 cursor-not-allowed"
                      />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-semibold">
                        <Phone className="h-4 w-4 text-accent" />
                        Phone Number
                      </Label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="border-primary/20 focus-visible:ring-primary/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-semibold">
                        <MapPin className="h-4 w-4 text-info" />
                        Location
                      </Label>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City, State"
                        className="border-primary/20 focus-visible:ring-primary/50"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-end pt-4 border-t border-border/50">
                    <Button
                      type="submit"
                      disabled={loading || uploading}
                      size="lg"
                      className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Spinner />
                          <span>Saving Changes...</span>
                        </div>
                      ) : uploading ? (
                        <div className="flex items-center gap-2">
                          <Spinner />
                          <span>Uploading...</span>
                        </div>
                      ) : (
                        <>
                          <CheckCircle2 className="h-5 w-5 mr-2" />
                          Save Profile
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Info */}
          <div className="space-y-6">
            {/* Account Info Card */}
            <Card className="glass border-info/20 hover:shadow-xl transition-shadow">
              <CardHeader className="border-b border-border/50 bg-gradient-to-br from-info/5 to-primary/5 p-5">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-info" />
                  Account Info
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Joined</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {authUser?.createdAt
                      ? format(new Date(authUser.createdAt), "MMM d, yyyy")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Role</span>
                  </div>
                  <span className="text-sm font-semibold capitalize">
                    {authUser?.role || "User"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Status</span>
                  </div>
                  <span className="text-sm font-semibold text-success flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    Active
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Card */}
            <Card className="glass border-primary/20 hover:shadow-xl transition-shadow">
              <CardHeader className="border-b border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5 p-5">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Your Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {statsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Spinner />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/10 to-transparent hover:from-primary/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-sm font-medium">
                          Total Listings
                        </span>
                      </div>
                      <span className="text-xl font-bold text-primary">
                        {stats.totalListings}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-secondary/10 to-transparent hover:from-secondary/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-secondary" />
                        </div>
                        <span className="text-sm font-medium">Active Ads</span>
                      </div>
                      <span className="text-xl font-bold text-secondary">
                        {stats.activeListings}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-accent/10 to-transparent hover:from-accent/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                          <Heart className="h-5 w-5 text-accent" />
                        </div>
                        <span className="text-sm font-medium">Total Views</span>
                      </div>
                      <span className="text-xl font-bold text-accent">
                        {stats.totalViews}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-info/10 to-transparent hover:from-info/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-info/20 to-info/10 flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-info" />
                        </div>
                        <span className="text-sm font-medium">Messages</span>
                      </div>
                      <span className="text-xl font-bold text-info">
                        {stats.totalMessages}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass border-accent/20 hover:shadow-xl transition-shadow">
              <CardHeader className="border-b border-border/50 bg-gradient-to-br from-accent/5 to-primary/5 p-5">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start border-primary/20 hover:bg-primary/10 hover:border-primary/40"
                  onClick={() => (window.location.href = "/dashboard")}
                >
                  <Package className="h-4 w-4 mr-2" />
                  View My Listings
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-secondary/20 hover:bg-secondary/10 hover:border-secondary/40"
                  onClick={() => (window.location.href = "/post-ad")}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Post New Ad
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-accent/20 hover:bg-accent/10 hover:border-accent/40"
                  onClick={() => (window.location.href = "/chat")}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  My Messages
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
