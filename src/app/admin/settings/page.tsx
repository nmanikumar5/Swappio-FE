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
  Settings,
  Save,
  RotateCcw,
  Shield,
  Mail,
  Globe,
  Database,
  Bell,
  Lock,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import { toast } from "sonner";

interface AdminSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportEmail: string;
  phoneNumber: string;
  maintenanceMode: boolean;
  autoApproveListings: boolean;
  commissionPercentage: number;
  maxListingsPerUser: number;
  minListingPrice: number;
  maxListingPrice: number;
  emailNotifications: boolean;
  userRegistrationEnabled: boolean;
  socialLinksEnabled: boolean;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>({
    siteName: "Swappio",
    siteDescription: "Online platform for buying, selling, and swapping items",
    contactEmail: "contact@swappio.com",
    supportEmail: "support@swappio.com",
    phoneNumber: "+91 1234567890",
    maintenanceMode: false,
    autoApproveListings: false,
    commissionPercentage: 5,
    maxListingsPerUser: 10,
    minListingPrice: 100,
    maxListingPrice: 10000000,
    emailNotifications: true,
    userRegistrationEnabled: true,
    socialLinksEnabled: true,
  });

  const [originalSettings, setOriginalSettings] =
    useState<AdminSettings>(settings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"
        }/admin/settings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch settings");
      const result = await response.json();
      if (result.data) {
        setSettings(result.data);
        setOriginalSettings(result.data);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error("Failed to load settings, using defaults");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"
        }/admin/settings`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(settings),
        }
      );

      if (!response.ok) throw new Error("Failed to save settings");
      toast.success("Settings saved successfully");
      setOriginalSettings(settings);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = () => {
    setSettings(originalSettings);
    toast.info("Settings reset to last saved values");
  };

  const hasChanges =
    JSON.stringify(settings) !== JSON.stringify(originalSettings);

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
              Admin Settings
            </h1>
            <p className="mt-2 text-muted-foreground">
              Configure platform settings and preferences
            </p>
          </div>
          <div className="flex gap-2">
            {hasChanges && (
              <>
                <Button variant="outline" onClick={handleResetSettings}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button onClick={handleSaveSettings} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            )}
            <Button
              onClick={() => (window.location.href = "/admin")}
              variant="outline"
            >
              ← Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 font-medium ${
            activeTab === "general"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
        >
          <Globe className="mr-2 inline h-4 w-4" />
          General Settings
        </button>
        <button
          onClick={() => setActiveTab("features")}
          className={`px-4 py-2 font-medium ${
            activeTab === "features"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
        >
          <Shield className="mr-2 inline h-4 w-4" />
          Feature Flags
        </button>
        <button
          onClick={() => setActiveTab("business")}
          className={`px-4 py-2 font-medium ${
            activeTab === "business"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
        >
          <Database className="mr-2 inline h-4 w-4" />
          Business Rules
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 font-medium ${
            activeTab === "notifications"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
        >
          <Bell className="mr-2 inline h-4 w-4" />
          Notifications
        </button>
      </div>

      {/* General Settings Tab */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <Card className="gradient-border">
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>
                Basic information about your platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Site Name</label>
                <Input
                  value={settings.siteName}
                  onChange={(e) =>
                    setSettings({ ...settings, siteName: e.target.value })
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Site Description</label>
                <Textarea
                  value={settings.siteDescription}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      siteDescription: e.target.value,
                    })
                  }
                  rows={3}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-border">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Email and phone details for support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Contact Email</label>
                <Input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, contactEmail: e.target.value })
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Support Email</label>
                <Input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, supportEmail: e.target.value })
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  type="tel"
                  value={settings.phoneNumber}
                  onChange={(e) =>
                    setSettings({ ...settings, phoneNumber: e.target.value })
                  }
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Feature Flags Tab */}
      {activeTab === "features" && (
        <div className="space-y-6">
          <Card className="gradient-border">
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>
                Enable or disable platform features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Maintenance Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Put the platform in maintenance mode
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maintenanceMode: e.target.checked,
                      })
                    }
                    className="h-4 w-4"
                  />
                  {settings.maintenanceMode && (
                    <Badge variant="destructive">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      Enabled
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Auto-Approve Listings</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically approve new listings without review
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.autoApproveListings}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        autoApproveListings: e.target.checked,
                      })
                    }
                    className="h-4 w-4"
                  />
                  {settings.autoApproveListings && (
                    <Badge className="bg-success text-success-foreground">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Enabled
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">User Registration</p>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to register on the platform
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.userRegistrationEnabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        userRegistrationEnabled: e.target.checked,
                      })
                    }
                    className="h-4 w-4"
                  />
                  {settings.userRegistrationEnabled && (
                    <Badge className="bg-success text-success-foreground">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Enabled
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Social Links</p>
                  <p className="text-sm text-muted-foreground">
                    Show social media links in footer
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.socialLinksEnabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialLinksEnabled: e.target.checked,
                      })
                    }
                    className="h-4 w-4"
                  />
                  {settings.socialLinksEnabled && (
                    <Badge className="bg-success text-success-foreground">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Enabled
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Business Rules Tab */}
      {activeTab === "business" && (
        <div className="space-y-6">
          <Card className="gradient-border">
            <CardHeader>
              <CardTitle>Commission & Pricing</CardTitle>
              <CardDescription>
                Configure commission and pricing rules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Commission Percentage (%)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={settings.commissionPercentage}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      commissionPercentage: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="mt-2"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Platform commission on each transaction
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">
                    Minimum Listing Price (₹)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.minListingPrice}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        minListingPrice: parseInt(e.target.value) || 0,
                      })
                    }
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Maximum Listing Price (₹)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.maxListingPrice}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maxListingPrice: parseInt(e.target.value) || 0,
                      })
                    }
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-border">
            <CardHeader>
              <CardTitle>Listing Limits</CardTitle>
              <CardDescription>
                Restrict user activity on the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Max Listings Per User
                </label>
                <Input
                  type="number"
                  min="1"
                  value={settings.maxListingsPerUser}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maxListingsPerUser: parseInt(e.target.value) || 1,
                    })
                  }
                  className="mt-2"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Maximum number of active listings per user
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <Card className="gradient-border">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Send email notifications to users
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        emailNotifications: e.target.checked,
                      })
                    }
                    className="h-4 w-4"
                  />
                  {settings.emailNotifications && (
                    <Badge className="bg-success text-success-foreground">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Enabled
                    </Badge>
                  )}
                </div>
              </div>

              <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                <CardContent className="flex gap-3 p-4">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900 dark:text-blue-100">
                    <p className="font-medium">Email Configuration</p>
                    <p className="mt-1">
                      To configure email settings, use the environment variables
                      in your deployment. Email notifications are essential for
                      user engagement.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
