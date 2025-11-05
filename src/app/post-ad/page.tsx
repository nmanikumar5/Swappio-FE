"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, AlertCircle, MapPin } from "lucide-react";
import { listingService, uploadService, categoryService } from "@/services/api";
import PaymentModal from "@/components/payment/PaymentModal";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/types";
import MapboxPlaceAutocomplete from "@/components/location/MapboxPlaceAutocomplete";
import { toast } from "sonner";

interface QuotaInfo {
  freeAdsQuota: number;
  freeAdsUsed: number;
  freeAdsRemaining: number;
  canPostFree: boolean;
}

export default function PostAdPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [quotaInfo, setQuotaInfo] = useState<QuotaInfo | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    priorityLevel?: string;
    duration?: number;
  } | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    location: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories({
          parentOnly: true,
          includeSubcategories: true,
        });
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Update subcategories when main category changes
  useEffect(() => {
    if (formData.category) {
      const selectedCat = categories.find((c) => c.slug === formData.category);
      if (selectedCat && selectedCat.subcategories) {
        setSubcategories(selectedCat.subcategories as Category[]);
      } else {
        setSubcategories([]);
      }
      // Reset subcategory when main category changes
      setFormData((prev) => ({ ...prev, subcategory: "" }));
    } else {
      setSubcategories([]);
    }
  }, [formData.category, categories]);

  // Check quota on component mount
  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const token = localStorage.getItem("swappio_token");
        if (!token) {
          router.push("/auth/signin");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/check-quota`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to check quota");
        }

        const data = await response.json();
        setQuotaInfo(data.data.quota);
      } catch (error) {
        console.error("Error checking quota:", error);
      }
    };
    fetchQuota();
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // validate location
    if (!formData.location || formData.location.trim() === "") {
      toast.error("Please provide a location for your listing.");
      return;
    }

    // Validate images
    if (images.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    // Check quota before submitting
    if (quotaInfo && !quotaInfo.canPostFree && !paymentData) {
      setShowPaymentModal(true);
      return;
    }

    setLoading(true);

    try {
      // Upload images
      const imageUrls = await uploadService.uploadImages(images);

      // Create listing
      await listingService.createListing({
        ...formData,
        price: parseFloat(formData.price),
        images: imageUrls,
      });

      toast.success("Listing created successfully!");

      // Refresh quota after successful post
      const token = localStorage.getItem("swappio_token");
      if (token) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/check-quota`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setQuotaInfo(data.data.quota);
        }
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating listing:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create listing. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (data: {
    orderId: string;
    paymentId: string;
    priorityLevel?: string;
    duration?: number;
  }) => {
    setPaymentData({
      priorityLevel: data.priorityLevel,
      duration: data.duration,
    });
    setShowPaymentModal(false);
    // Auto-submit the form after successful payment
    setTimeout(() => {
      const form = document.querySelector("form");
      if (form) {
        form.requestSubmit();
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
        quotaInfo={quotaInfo || undefined}
      />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
            Post Your Ad
          </h1>
          <p className="text-muted-foreground">
            Share what you have to offer with our community
          </p>
        </div>

        {/* Quota Information Banner */}
        {quotaInfo && (
          <Card className="mb-6 border-2">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`rounded-full p-2 ${
                      quotaInfo.canPostFree
                        ? "bg-green-100 dark:bg-green-900/20"
                        : "bg-amber-100 dark:bg-amber-900/20"
                    }`}
                  >
                    <AlertCircle
                      className={`h-5 w-5 ${
                        quotaInfo.canPostFree
                          ? "text-green-600 dark:text-green-400"
                          : "text-amber-600 dark:text-amber-400"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base mb-1">
                      {quotaInfo.canPostFree
                        ? "Free Ads Available"
                        : "Free Quota Exhausted"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {quotaInfo.canPostFree
                        ? `You have ${quotaInfo.freeAdsRemaining} of ${quotaInfo.freeAdsQuota} free ads remaining this month.`
                        : `You've used all ${quotaInfo.freeAdsQuota} free ads this month. Choose a paid option to continue.`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-sm">
                    {quotaInfo.freeAdsUsed}/{quotaInfo.freeAdsQuota} Used
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Image Upload */}
            <Card className="border-2 shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Upload Images
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-square group">
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="rounded-xl object-cover border-2 border-border shadow-md group-hover:shadow-xl transition-all"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute -right-2 -top-2 h-7 w-7 shadow-lg hover:scale-110 transition-transform"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md font-medium shadow-lg">
                            Cover
                          </div>
                        )}
                      </div>
                    ))}

                    {imagePreviews.length < 8 && (
                      <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 transition-all group shadow-md hover:shadow-lg">
                        <Upload className="mb-2 h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-sm text-muted-foreground font-medium">
                          Upload
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg border-l-4 border-primary">
                    Upload up to 8 images. First image will be the cover photo.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Basic Details */}
            <Card className="border-2 shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="bg-gradient-to-r from-secondary/5 to-accent/5">
                <CardTitle>Basic Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-semibold">
                    Ad Title*
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., iPhone 13 Pro Max - 256GB"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="border-2 focus:border-primary transition-colors"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-base font-semibold"
                  >
                    Description*
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your item in detail..."
                    rows={6}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="border-2 focus:border-primary transition-colors"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="category"
                      className="text-base font-semibold"
                    >
                      Category*
                    </Label>
                    <select
                      id="category"
                      className="flex h-10 w-full rounded-xl border-2 border-border bg-transparent px-3 py-2 text-sm shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 focus-visible:outline-none"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      required
                      disabled={loadingCategories}
                    >
                      <option value="">
                        {loadingCategories ? "Loading..." : "Select a category"}
                      </option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="subcategory"
                      className="text-base font-semibold"
                    >
                      Subcategory {subcategories.length > 0 && "*"}
                    </Label>
                    <select
                      id="subcategory"
                      className="flex h-10 w-full rounded-xl border-2 border-border bg-transparent px-3 py-2 text-sm shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 focus-visible:outline-none disabled:opacity-50"
                      value={formData.subcategory}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subcategory: e.target.value,
                        })
                      }
                      required={subcategories.length > 0}
                      disabled={
                        !formData.category || subcategories.length === 0
                      }
                    >
                      <option value="">
                        {!formData.category
                          ? "Select category first"
                          : subcategories.length === 0
                          ? "No subcategories"
                          : "Select a subcategory"}
                      </option>
                      {subcategories.map((subcat) => (
                        <option key={subcat.id} value={subcat.slug}>
                          {subcat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-base font-semibold">
                      Price (₹)*
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="5000"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="border-2 focus:border-primary transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-base font-semibold">
                    Location*
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <div className="pl-10">
                      <MapboxPlaceAutocomplete
                        value={formData.location}
                        onChange={(val) =>
                          setFormData({ ...formData, location: val })
                        }
                        onSelect={(val) =>
                          setFormData({ ...formData, location: val })
                        }
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Start typing to search for a location
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="border-2 hover:border-primary/50 transition-all"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all min-w-[120px]"
              >
                {loading ? "Posting..." : "Post Ad"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
