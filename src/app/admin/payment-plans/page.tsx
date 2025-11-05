"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Save, X, DollarSign, Package } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

interface PaymentPlan {
  _id?: string;
  name: string;
  type: "subscription" | "credits" | "priority";
  description: string;
  price: number;
  currency: string;
  numberOfDays?: number; // days for subscription (renamed from duration)
  adsPerMonth?: number; // number of ads allowed per month for subscription
  credits?: number; // number of credits for credit packages
  features: string[];
  isActive: boolean;
  priorityLevel?: "featured" | "urgent" | "standard";
  adBoost?: number; // percentage boost
}

export default function PaymentPlansPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<PaymentPlan | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<PaymentPlan>({
    name: "",
    type: "subscription",
    description: "",
    price: 0,
    currency: "INR",
    numberOfDays: 30,
    adsPerMonth: 10,
    credits: 0,
    features: [],
    isActive: true,
    priorityLevel: "standard",
    adBoost: 0,
  });

  const [newFeature, setNewFeature] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }
    fetchPlans();
  }, [user, router]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("swappio_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/payment-plans`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch plans");

      const data = await response.json();
      setPlans(data.data?.plans || []);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Failed to load payment plans");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("swappio_token");
      const url = editingPlan
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/payment-plans/${editingPlan._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/payment-plans`;

      const response = await fetch(url, {
        method: editingPlan ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save plan");

      toast.success(
        editingPlan
          ? "Payment plan updated successfully"
          : "Payment plan created successfully"
      );

      resetForm();
      fetchPlans();
    } catch (error) {
      console.error("Error saving plan:", error);
      toast.error("Failed to save payment plan");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;

    try {
      const token = localStorage.getItem("swappio_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/payment-plans/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete plan");

      toast.success("Payment plan deleted successfully");
      fetchPlans();
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error("Failed to delete payment plan");
    }
  };

  const handleEdit = (plan: PaymentPlan) => {
    setEditingPlan(plan);
    setFormData(plan);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "subscription",
      description: "",
      price: 0,
      currency: "INR",
      numberOfDays: 30,
      adsPerMonth: 10,
      credits: 0,
      features: [],
      isActive: true,
      priorityLevel: "standard",
      adBoost: 0,
    });
    setEditingPlan(null);
    setShowForm(false);
    setNewFeature("");
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Payment Plans Management</h1>
          <p className="text-muted-foreground">
            Configure subscription plans, credit packages, and priority ad
            options
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          New Plan
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <Card className="mb-8 border-primary shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardTitle className="flex items-center justify-between">
              <span>{editingPlan ? "Edit" : "Create"} Payment Plan</span>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-5 w-5" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Plan Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Premium Monthly"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type">Plan Type *</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as PaymentPlan["type"],
                      })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    <option value="subscription">Subscription</option>
                    <option value="credits">Credit Package</option>
                    <option value="priority">Priority Ad</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value),
                      })
                    }
                    placeholder="999"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>

                {formData.type === "subscription" && (
                  <>
                    <div>
                      <Label htmlFor="numberOfDays">Duration (days) *</Label>
                      <Input
                        id="numberOfDays"
                        type="number"
                        value={formData.numberOfDays}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            numberOfDays: parseInt(e.target.value),
                          })
                        }
                        placeholder="30"
                        min="1"
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        How many days the subscription lasts
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="adsPerMonth">Ads Per Month *</Label>
                      <Input
                        id="adsPerMonth"
                        type="number"
                        value={formData.adsPerMonth}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            adsPerMonth: parseInt(e.target.value),
                          })
                        }
                        placeholder="10"
                        min="1"
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Number of ads user can post per month
                      </p>
                    </div>
                  </>
                )}

                {formData.type === "credits" && (
                  <div>
                    <Label htmlFor="credits">Number of Credits</Label>
                    <Input
                      id="credits"
                      type="number"
                      value={formData.credits}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          credits: parseInt(e.target.value),
                        })
                      }
                      placeholder="10"
                      min="1"
                    />
                  </div>
                )}

                {formData.type === "priority" && (
                  <>
                    <div>
                      <Label htmlFor="priorityLevel">Priority Level</Label>
                      <select
                        id="priorityLevel"
                        value={formData.priorityLevel}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            priorityLevel: e.target
                              .value as PaymentPlan["priorityLevel"],
                          })
                        }
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                      >
                        <option value="standard">Standard</option>
                        <option value="featured">Featured</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="adBoost">Ad Boost (%)</Label>
                      <Input
                        id="adBoost"
                        type="number"
                        value={formData.adBoost}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            adBoost: parseInt(e.target.value),
                          })
                        }
                        placeholder="50"
                        min="0"
                        max="100"
                      />
                    </div>
                  </>
                )}

                <div className="md:col-span-2">
                  <Label htmlFor="isActive">Status</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="h-4 w-4"
                    />
                    <label htmlFor="isActive" className="text-sm">
                      Active (visible to users)
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe what this plan offers..."
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label>Features</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                  />
                  <Button type="button" onClick={addFeature}>
                    Add
                  </Button>
                </div>
                <div className="mt-4 space-y-2">
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-muted/50 p-2 rounded"
                    >
                      <span className="text-sm">✓ {feature}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  {editingPlan ? "Update" : "Create"} Plan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Plans List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading payment plans...</p>
        </div>
      ) : plans.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-semibold mb-2">No payment plans yet</p>
            <p className="text-muted-foreground mb-4">
              Create your first payment plan to get started
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan._id}
              className={`relative overflow-hidden ${
                !plan.isActive ? "opacity-60" : ""
              }`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-bl-full" />

              {!plan.isActive && (
                <div className="absolute top-2 right-2 bg-destructive text-white px-2 py-1 rounded text-xs font-semibold">
                  Inactive
                </div>
              )}

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <div className="flex items-baseline gap-1 mb-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <span className="text-3xl font-bold text-primary">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground">
                        {plan.currency}
                      </span>
                    </div>
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                      {plan.type}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.description}
                </p>

                {plan.type === "subscription" && (
                  <div className="mb-4 p-3 bg-primary/5 rounded-lg border">
                    {plan.numberOfDays && (
                      <p className="text-sm font-semibold mb-1">
                        📅 Duration: {plan.numberOfDays} days
                      </p>
                    )}
                    {plan.adsPerMonth && (
                      <p className="text-sm font-semibold">
                        📢 Ads Allowed: {plan.adsPerMonth} per month
                      </p>
                    )}
                  </div>
                )}

                {plan.type === "credits" && plan.credits && (
                  <p className="text-sm font-semibold mb-2">
                    Credits: {plan.credits}
                  </p>
                )}

                {plan.type === "priority" && (
                  <div className="mb-2">
                    <p className="text-sm">
                      <span className="font-semibold">Level:</span>{" "}
                      {plan.priorityLevel}
                    </p>
                    {plan.adBoost && (
                      <p className="text-sm">
                        <span className="font-semibold">Boost:</span>{" "}
                        {plan.adBoost}%
                      </p>
                    )}
                  </div>
                )}

                {plan.features.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-semibold">Features:</p>
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(plan)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => plan._id && handleDelete(plan._id)}
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
