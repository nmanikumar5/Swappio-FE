"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, MapPin, Loader2, ArrowLeft } from "lucide-react";
import { listingService, uploadService, categoryService } from "@/services/api";
import { Category } from "@/types";
import MapboxPlaceAutocomplete from "@/components/location/MapboxPlaceAutocomplete";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditAdPage() {
  const router = useRouter();
  const params = useParams();
  const listingId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetchingListing, setFetchingListing] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
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

  // Fetch listing data on mount
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listing = await listingService.getListing(listingId);

        if (!listing) {
          toast.error("Listing not found");
          router.push("/dashboard");
          return;
        }

        setFormData({
          title: listing.title,
          description: listing.description,
          price: listing.price.toString(),
          category: listing.category,
          subcategory: "",
          location: listing.location,
        });

        setExistingImageUrls(listing.images || []);
      } catch (error) {
        console.error("Failed to fetch listing:", error);
        toast.error("Failed to load listing");
        router.push("/dashboard");
      } finally {
        setFetchingListing(false);
      }
    };

    if (listingId) {
      fetchListing();
    }
  }, [listingId, router]);

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

      // Don't reset subcategory if it exists (initial load)
      if (!formData.subcategory) {
        setFormData((prev) => ({ ...prev, subcategory: "" }));
      }
    } else {
      setSubcategories([]);
    }
  }, [formData.category, categories, formData.subcategory]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Check if total images exceed 8
    const totalImages =
      existingImageUrls.length + imagePreviews.length + files.length;
    if (totalImages > 8) {
      toast.error("Maximum 8 images allowed");
      return;
    }

    setImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate location
    if (!formData.location || formData.location.trim() === "") {
      toast.error("Please provide a location for your listing");
      return;
    }

    // Validate at least one image
    if (existingImageUrls.length === 0 && images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setLoading(true);

    try {
      // Upload new images if any
      let newImageUrls: string[] = [];
      if (images.length > 0) {
        newImageUrls = await uploadService.uploadImages(images);
      }

      // Combine existing and new image URLs
      const allImageUrls = [...existingImageUrls, ...newImageUrls];

      // Update listing
      await listingService.updateListing(listingId, {
        ...formData,
        price: parseFloat(formData.price),
        images: allImageUrls,
      });

      toast.success("Listing updated successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error("Failed to update listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingListing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-32 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
              Edit Your Ad
            </h1>
            <p className="text-muted-foreground">Update your listing details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Image Upload */}
            <Card className="border-2 shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Images
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {/* Existing images */}
                    {existingImageUrls.map((url, index) => (
                      <div
                        key={`existing-${index}`}
                        className="relative aspect-square group"
                      >
                        <Image
                          src={url}
                          alt={`Existing ${index + 1}`}
                          fill
                          className="rounded-xl object-cover border-2 border-border shadow-md group-hover:shadow-xl transition-all"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute -right-2 -top-2 h-7 w-7 shadow-lg hover:scale-110 transition-transform"
                          onClick={() => removeExistingImage(index)}
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

                    {/* New images */}
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={`new-${index}`}
                        className="relative aspect-square group"
                      >
                        <Image
                          src={preview}
                          alt={`New ${index + 1}`}
                          fill
                          className="rounded-xl object-cover border-2 border-green-500 shadow-md group-hover:shadow-xl transition-all"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute -right-2 -top-2 h-7 w-7 shadow-lg hover:scale-110 transition-transform"
                          onClick={() => removeNewImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-md font-medium shadow-lg">
                          New
                        </div>
                      </div>
                    ))}

                    {/* Upload button */}
                    {existingImageUrls.length + imagePreviews.length < 8 && (
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
                    Upload up to 8 images total. First image will be the cover
                    photo.
                    {imagePreviews.length > 0 && (
                      <span className="block mt-1 text-green-600 dark:text-green-400 font-medium">
                        ✓ {imagePreviews.length} new image
                        {imagePreviews.length > 1 ? "s" : ""} ready to upload
                      </span>
                    )}
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
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
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
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all min-w-[140px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Ad"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
