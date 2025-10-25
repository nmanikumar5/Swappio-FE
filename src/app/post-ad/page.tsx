"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCategories } from "@/lib/mockData";
import { Upload, X } from "lucide-react";
import { listingService, uploadService } from "@/services/api";

export default function PostAdPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
  });

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

      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating listing:", error);
      alert("Failed to create listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Post Your Ad</h1>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="rounded-lg object-cover"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute -right-2 -top-2 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {imagePreviews.length < 8 && (
                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50">
                      <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
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
                <p className="text-sm text-muted-foreground">
                  Upload up to 8 images. First image will be the cover photo.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Basic Details */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Ad Title*</Label>
                <Input
                  id="title"
                  placeholder="e.g., iPhone 13 Pro Max - 256GB"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description*</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your item in detail..."
                  rows={6}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category*</Label>
                  <select
                    id="category"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                  >
                    <option value="">Select a category</option>
                    {mockCategories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)*</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="5000"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location*</Label>
                <Input
                  id="location"
                  placeholder="e.g., Mumbai, Maharashtra"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Posting..." : "Post Ad"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
