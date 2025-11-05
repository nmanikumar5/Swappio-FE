"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Save,
  RefreshCw,
  Package,
  Crown,
  Star,
  Zap,
} from "lucide-react";

interface PricingConfig {
  _id?: string;
  // Free Tier
  freeAdsPerMonth: number;
  freeAdDuration: number;

  // Priority Pricing
  featuredAdPrice: number;
  featuredAdDuration: number;
  premiumAdPrice: number;
  premiumAdDuration: number;
  platinumAdPrice: number;
  platinumAdDuration: number;

  // Additional Ad
  additionalAdPrice: number;

  // Bulk Packages
  bulkPackages: Array<{
    adCount: number;
    price: number;
    discountPercentage: number;
  }>;

  // Subscription Plans
  subscriptionPlans: Array<{
    name: string;
    price: number;
    freeAds: number;
    discount: number;
    features: string[];
  }>;

  // Tax & Fees
  taxPercentage: number;
  platformFee: number;

  // Payment Gateway
  razorpayEnabled: boolean;
  razorpayKeyId: string;
  stripeEnabled: boolean;
  stripePublishableKey: string;
}

export default function PricingConfigPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<PricingConfig>({
    freeAdsPerMonth: 10,
    freeAdDuration: 30,
    featuredAdPrice: 99,
    featuredAdDuration: 7,
    premiumAdPrice: 199,
    premiumAdDuration: 15,
    platinumAdPrice: 399,
    platinumAdDuration: 30,
    additionalAdPrice: 49,
    bulkPackages: [
      { adCount: 10, price: 399, discountPercentage: 18 },
      { adCount: 25, price: 899, discountPercentage: 27 },
      { adCount: 50, price: 1599, discountPercentage: 35 },
    ],
    subscriptionPlans: [
      {
        name: "Basic",
        price: 199,
        freeAds: 15,
        discount: 20,
        features: [
          "15 free ads/month",
          "20% discount on premium ads",
          "Email support",
        ],
      },
      {
        name: "Pro",
        price: 499,
        freeAds: 40,
        discount: 30,
        features: [
          "40 free ads/month",
          "30% discount on premium ads",
          "Verified seller badge",
          "Priority support",
        ],
      },
      {
        name: "Business",
        price: 999,
        freeAds: 100,
        discount: 40,
        features: [
          "100 free ads/month",
          "40% discount on premium ads",
          "Verified seller badge",
          "Premium support",
          "Analytics dashboard",
          "API access",
        ],
      },
    ],
    taxPercentage: 18,
    platformFee: 0,
    razorpayEnabled: true,
    razorpayKeyId: "",
    stripeEnabled: false,
    stripePublishableKey: "",
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem("swappio_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/pricing-config`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setConfig(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching config:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("swappio_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/pricing-config`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(config),
        }
      );

      if (response.ok) {
        alert("Pricing configuration saved successfully!");
      } else {
        throw new Error("Failed to save configuration");
      }
    } catch (error) {
      console.error("Error saving config:", error);
      alert("Failed to save pricing configuration");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (
    field: keyof PricingConfig,
    value: string | number | boolean | unknown
  ) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const updateBulkPackage = (index: number, field: string, value: number) => {
    setConfig((prev) => {
      const bulkPackages = [...prev.bulkPackages];
      bulkPackages[index] = { ...bulkPackages[index], [field]: value };
      return { ...prev, bulkPackages };
    });
  };

  const updateSubscriptionPlan = (
    index: number,
    field: string,
    value: string | number | string[]
  ) => {
    setConfig((prev) => {
      const subscriptionPlans = [...prev.subscriptionPlans];
      subscriptionPlans[index] = {
        ...subscriptionPlans[index],
        [field]: value,
      };
      return { ...prev, subscriptionPlans };
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Pricing Configuration
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage all pricing tiers, bulk packages, and subscription plans
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-primary to-secondary"
          >
            {saving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {/* Free Tier Settings */}
        <Card className="border-2">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              Free Tier Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Free Ads Per Month</Label>
                <Input
                  type="number"
                  value={config.freeAdsPerMonth}
                  onChange={(e) =>
                    updateField("freeAdsPerMonth", parseInt(e.target.value))
                  }
                  min="0"
                />
              </div>
              <div>
                <Label>Free Ad Duration (days)</Label>
                <Input
                  type="number"
                  value={config.freeAdDuration}
                  onChange={(e) =>
                    updateField("freeAdDuration", parseInt(e.target.value))
                  }
                  min="1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Priority Listing Pricing */}
        <Card className="border-2">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Priority Listing Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Featured */}
            <div className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-lg">Featured</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    value={config.featuredAdPrice}
                    onChange={(e) =>
                      updateField("featuredAdPrice", parseInt(e.target.value))
                    }
                    min="0"
                  />
                </div>
                <div>
                  <Label>Duration (days)</Label>
                  <Input
                    type="number"
                    value={config.featuredAdDuration}
                    onChange={(e) =>
                      updateField(
                        "featuredAdDuration",
                        parseInt(e.target.value)
                      )
                    }
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Premium */}
            <div className="border-l-4 border-purple-500 pl-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold text-lg">Premium</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    value={config.premiumAdPrice}
                    onChange={(e) =>
                      updateField("premiumAdPrice", parseInt(e.target.value))
                    }
                    min="0"
                  />
                </div>
                <div>
                  <Label>Duration (days)</Label>
                  <Input
                    type="number"
                    value={config.premiumAdDuration}
                    onChange={(e) =>
                      updateField("premiumAdDuration", parseInt(e.target.value))
                    }
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Platinum */}
            <div className="border-l-4 border-amber-500 pl-4">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold text-lg">Platinum</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    value={config.platinumAdPrice}
                    onChange={(e) =>
                      updateField("platinumAdPrice", parseInt(e.target.value))
                    }
                    min="0"
                  />
                </div>
                <div>
                  <Label>Duration (days)</Label>
                  <Input
                    type="number"
                    value={config.platinumAdDuration}
                    onChange={(e) =>
                      updateField(
                        "platinumAdDuration",
                        parseInt(e.target.value)
                      )
                    }
                    min="1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Ad Price */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Additional Ad Pricing</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="max-w-xs">
              <Label>Single Additional Ad Price (₹)</Label>
              <Input
                type="number"
                value={config.additionalAdPrice}
                onChange={(e) =>
                  updateField("additionalAdPrice", parseInt(e.target.value))
                }
                min="0"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Price charged when user exceeds monthly quota
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Packages */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Bulk Ad Packages</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {config.bulkPackages.map((pkg, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Package {index + 1}</h3>
                  <Badge>{pkg.discountPercentage}% OFF</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Ad Count</Label>
                    <Input
                      type="number"
                      value={pkg.adCount}
                      onChange={(e) =>
                        updateBulkPackage(
                          index,
                          "adCount",
                          parseInt(e.target.value)
                        )
                      }
                      min="1"
                    />
                  </div>
                  <div>
                    <Label>Price (₹)</Label>
                    <Input
                      type="number"
                      value={pkg.price}
                      onChange={(e) =>
                        updateBulkPackage(
                          index,
                          "price",
                          parseInt(e.target.value)
                        )
                      }
                      min="0"
                    />
                  </div>
                  <div>
                    <Label>Discount (%)</Label>
                    <Input
                      type="number"
                      value={pkg.discountPercentage}
                      onChange={(e) =>
                        updateBulkPackage(
                          index,
                          "discountPercentage",
                          parseInt(e.target.value)
                        )
                      }
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Subscription Plans */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Subscription Plans</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {config.subscriptionPlans.map((plan, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <h3 className="font-semibold text-lg">{plan.name} Plan</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Monthly Price (₹)</Label>
                    <Input
                      type="number"
                      value={plan.price}
                      onChange={(e) =>
                        updateSubscriptionPlan(
                          index,
                          "price",
                          parseInt(e.target.value)
                        )
                      }
                      min="0"
                    />
                  </div>
                  <div>
                    <Label>Free Ads/Month</Label>
                    <Input
                      type="number"
                      value={plan.freeAds}
                      onChange={(e) =>
                        updateSubscriptionPlan(
                          index,
                          "freeAds",
                          parseInt(e.target.value)
                        )
                      }
                      min="0"
                    />
                  </div>
                  <div>
                    <Label>Premium Ad Discount (%)</Label>
                    <Input
                      type="number"
                      value={plan.discount}
                      onChange={(e) =>
                        updateSubscriptionPlan(
                          index,
                          "discount",
                          parseInt(e.target.value)
                        )
                      }
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tax & Fees */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Tax & Platform Fees</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4 max-w-2xl">
              <div>
                <Label>Tax Percentage (%)</Label>
                <Input
                  type="number"
                  value={config.taxPercentage}
                  onChange={(e) =>
                    updateField("taxPercentage", parseFloat(e.target.value))
                  }
                  min="0"
                  max="100"
                  step="0.1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  GST or applicable tax rate
                </p>
              </div>
              <div>
                <Label>Platform Fee (₹)</Label>
                <Input
                  type="number"
                  value={config.platformFee}
                  onChange={(e) =>
                    updateField("platformFee", parseFloat(e.target.value))
                  }
                  min="0"
                  step="0.01"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Fixed fee per transaction
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Gateway Settings */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Payment Gateway Configuration</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Razorpay</h3>
                  <p className="text-sm text-muted-foreground">
                    Primary payment gateway for India
                  </p>
                </div>
                <Badge
                  variant={config.razorpayEnabled ? "default" : "secondary"}
                >
                  {config.razorpayEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Razorpay Key ID</Label>
                  <Input
                    type="text"
                    value={config.razorpayKeyId}
                    onChange={(e) =>
                      updateField("razorpayKeyId", e.target.value)
                    }
                    placeholder="rzp_live_xxxxx or rzp_test_xxxxx"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Public key for client-side integration
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Stripe</h3>
                  <p className="text-sm text-muted-foreground">
                    International payment gateway
                  </p>
                </div>
                <Badge variant={config.stripeEnabled ? "default" : "secondary"}>
                  {config.stripeEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Stripe Publishable Key</Label>
                  <Input
                    type="text"
                    value={config.stripePublishableKey}
                    onChange={(e) =>
                      updateField("stripePublishableKey", e.target.value)
                    }
                    placeholder="pk_live_xxxxx or pk_test_xxxxx"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Public key for client-side integration
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary min-w-[200px]"
          >
            {saving ? (
              <>
                <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                Save All Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
