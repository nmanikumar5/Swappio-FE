'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function PostAdPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    location: '',
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      // In a real app, upload to Cloudinary here
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setImages(prev => [...prev, ...newImages].slice(0, 10))
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      router.push('/')
    }, 2000)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Post Your Ad</CardTitle>
            <CardDescription>
              Fill in the details below to list your product
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Images */}
              <div className="space-y-2">
                <Label>Product Images (Max 10)</Label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={image}
                        alt={`Product ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {images.length < 10 && (
                    <label className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload up to 10 images. First image will be the cover photo.
                </p>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., iPhone 14 Pro Max 256GB"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product in detail..."
                  rows={5}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(v) => handleChange('category', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="vehicles">Vehicles</SelectItem>
                    <SelectItem value="property">Property</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="computers">Computers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price and Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition *</Label>
                  <Select value={formData.condition} onValueChange={(v) => handleChange('condition', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="like-new">Like New</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Mumbai, Maharashtra"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    'Post Ad'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
