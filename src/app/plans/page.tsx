"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Check,
  Sparkles,
  Zap,
  Crown,
  ArrowRight,
  Shield,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

interface PaymentPlan {
  _id: string;
  name: string;
  type: "subscription" | "credits" | "priority";
  description: string;
  price: number;
  currency: string;
  numberOfDays?: number;
  adsPerMonth?: number;
  credits?: number;
  features: string[];
  isActive: boolean;
  priorityLevel?: "featured" | "urgent" | "standard";
  adBoost?: number;
}

export default function PlansPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<
    "all" | "subscription" | "credits" | "priority"
  >("all");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("swappio_token");
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/payment-plans?isActive=true`,
        { headers }
      );

      if (!response.ok) throw new Error("Failed to fetch plans");

      const data = await response.json();
      setPlans(data.data?.plans || []);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Failed to load pricing plans");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyPlan = async (planId: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to purchase a plan");
      router.push("/auth/signin");
      return;
    }

    // TODO: Integrate with payment gateway
    toast.info("Payment integration coming soon!");
    console.log("Purchasing plan:", planId);
  };

  const filteredPlans =
    selectedType === "all"
      ? plans
      : plans.filter((p) => p.type === selectedType);

  const getPlanIcon = (type: string) => {
    switch (type) {
      case "subscription":
        return <Crown className="h-6 w-6" />;
      case "credits":
        return <Zap className="h-6 w-6" />;
      case "priority":
        return <TrendingUp className="h-6 w-6" />;
      default:
        return <Sparkles className="h-6 w-6" />;
    }
  };

  const getPlanColor = (type: string) => {
    switch (type) {
      case "subscription":
        return "from-purple-500/20 to-pink-500/20 border-purple-500/50";
      case "credits":
        return "from-blue-500/20 to-cyan-500/20 border-blue-500/50";
      case "priority":
        return "from-amber-500/20 to-orange-500/20 border-amber-500/50";
      default:
        return "from-primary/20 to-secondary/20 border-primary/50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b-2">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 text-lg px-6 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              Pricing Plans
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Choose Your Perfect Plan
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Unlock premium features and boost your listings with our flexible
              pricing options
            </p>

            {/* Type Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { type: "all", label: "All Plans", icon: Sparkles },
                { type: "subscription", label: "Subscriptions", icon: Crown },
                { type: "credits", label: "Credit Packs", icon: Zap },
                { type: "priority", label: "Priority Ads", icon: TrendingUp },
              ].map(({ type, label, icon: Icon }) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="lg"
                  onClick={() => setSelectedType(type as typeof selectedType)}
                  className="rounded-full transition-all hover:scale-105"
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">
              Loading pricing plans...
            </p>
          </div>
        ) : filteredPlans.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="py-12 text-center">
              <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-semibold mb-2">No plans available</p>
              <p className="text-muted-foreground">
                Check back later for new pricing options
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlans.map((plan) => (
              <Card
                key={plan._id}
                className={`relative overflow-hidden border-2 transition-all hover:shadow-2xl hover:scale-105 bg-gradient-to-br ${getPlanColor(
                  plan.type
                )}`}
              >
                {/* Plan Type Badge */}
                <div className="absolute top-4 right-4">
                  <Badge className="capitalize font-semibold">
                    {plan.type}
                  </Badge>
                </div>

                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      {getPlanIcon(plan.type)}
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-primary">
                        ₹{plan.price}
                      </span>
                      <span className="text-muted-foreground">
                        {plan.currency}
                      </span>
                    </div>
                    {plan.type === "subscription" && plan.numberOfDays && (
                      <p className="text-sm text-muted-foreground mt-1">
                        for {plan.numberOfDays} days
                      </p>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-2 p-3 bg-background/60 backdrop-blur-sm rounded-xl border">
                    {plan.type === "subscription" && (
                      <>
                        {plan.numberOfDays && (
                          <div className="text-center p-2">
                            <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
                            <p className="text-xs text-muted-foreground">
                              Duration
                            </p>
                            <p className="font-bold">{plan.numberOfDays}d</p>
                          </div>
                        )}
                        {plan.adsPerMonth && (
                          <div className="text-center p-2">
                            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-primary" />
                            <p className="text-xs text-muted-foreground">
                              Ads/Month
                            </p>
                            <p className="font-bold">{plan.adsPerMonth}</p>
                          </div>
                        )}
                      </>
                    )}
                    {plan.type === "credits" && plan.credits && (
                      <div className="text-center p-2 col-span-2">
                        <Zap className="h-5 w-5 mx-auto mb-1 text-primary" />
                        <p className="text-xs text-muted-foreground">Credits</p>
                        <p className="font-bold text-lg">{plan.credits}</p>
                      </div>
                    )}
                    {plan.type === "priority" && (
                      <>
                        {plan.priorityLevel && (
                          <div className="text-center p-2">
                            <Shield className="h-5 w-5 mx-auto mb-1 text-primary" />
                            <p className="text-xs text-muted-foreground">
                              Level
                            </p>
                            <p className="font-bold capitalize text-xs">
                              {plan.priorityLevel}
                            </p>
                          </div>
                        )}
                        {plan.adBoost && (
                          <div className="text-center p-2">
                            <Sparkles className="h-5 w-5 mx-auto mb-1 text-primary" />
                            <p className="text-xs text-muted-foreground">
                              Boost
                            </p>
                            <p className="font-bold">{plan.adBoost}%</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Features */}
                  {plan.features.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold mb-3">Features:</p>
                      {plan.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Buy Button */}
                  <Button
                    onClick={() => handleBuyPlan(plan._id)}
                    className="w-full mt-4 rounded-xl h-12 text-base font-semibold transition-all hover:scale-105"
                    size="lg"
                  >
                    Get Started
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Trust Section */}
      <div className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Shield className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">
                Your transactions are safe and encrypted
              </p>
            </div>
            <div>
              <Sparkles className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Instant Activation</h3>
              <p className="text-sm text-muted-foreground">
                Plans activate immediately after purchase
              </p>
            </div>
            <div>
              <TrendingUp className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Flexible Options</h3>
              <p className="text-sm text-muted-foreground">
                Choose what works best for your needs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
