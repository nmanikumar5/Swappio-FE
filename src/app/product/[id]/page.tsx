'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, Share2, MapPin, Eye, Phone, MessageSquare, Flag } from 'lucide-react'
import { Product } from '@/types'
import { formatPrice, formatRelativeTime } from '@/lib/utils'
import { useStore } from '@/store'
import { cn } from '@/lib/utils'

// Mock product data
const mockProduct: Product = {
  id: '1',
  title: 'iPhone 14 Pro Max 256GB - Space Black',
  description: `Brand new iPhone 14 Pro Max with 1 year warranty. Never used, sealed pack.

Features:
- 6.7-inch Super Retina XDR display
- A16 Bionic chip
- Pro camera system
- All-day battery life
- 5G capable

Includes:
- Original box
- Charging cable
- Documentation
- 1 year Apple warranty

Price is slightly negotiable. Serious buyers only please.`,
  price: 125000,
  images: [
    'https://images.unsplash.com/photo-1678652197950-1cdd5b4e0d1f?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1592286927505-38e31c0c81b6?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=800&fit=crop',
  ],
  category: 'electronics',
  condition: 'new',
  location: 'Mumbai, Maharashtra',
  userId: 'user1',
  user: {
    id: 'user1',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    role: 'user',
    createdAt: new Date('2024-01-15'),
  },
  createdAt: new Date('2025-10-20'),
  updatedAt: new Date('2025-10-20'),
  views: 234,
  isFeatured: true,
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState(0)
  const { isFavourite, addFavourite, removeFavourite } = useStore()

  const product = useMemo(() => {
    // In a real app, fetch product by ID from API
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _id = params.id
    return mockProduct
  }, [])

  if (!product) {
    return <div className="container mx-auto px-4 py-20 text-center">Loading...</div>
  }

  const favourite = isFavourite(product.id)

  const toggleFavourite = () => {
    if (favourite) {
      removeFavourite(product.id)
    } else {
      addFavourite(product.id)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.title,
        text: `Check out this listing: ${product.title}`,
        url: window.location.href,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Image */}
            <Card className="overflow-hidden">
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.title}
                  fill
                  className="object-contain"
                  priority
                />
                {product.isFeatured && (
                  <Badge className="absolute top-4 left-4 bg-yellow-500 text-white">
                    Featured
                  </Badge>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        "relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                        selectedImage === index ? "border-primary" : "border-transparent"
                      )}
                    >
                      <Image
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium capitalize">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Condition</p>
                    <p className="font-medium capitalize">{product.condition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{product.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Posted</p>
                    <p className="font-medium">{formatRelativeTime(product.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Price and Actions */}
          <div className="space-y-4">
            {/* Price Card */}
            <Card className="sticky top-20">
              <CardContent className="p-6 space-y-4">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {formatPrice(product.price)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{product.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{product.views} views</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button className="w-full" size="lg">
                    <Phone className="mr-2 h-4 w-4" />
                    Show Phone Number
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="lg"
                    onClick={() => router.push('/chat')}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat with Seller
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleFavourite}
                    className={cn(favourite && "text-red-500 border-red-500")}
                  >
                    <Heart className={cn("h-4 w-4", favourite && "fill-current")} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Seller Information</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                    {product.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-medium">{product.user?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Member since {formatRelativeTime(product.user?.createdAt || new Date())}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push(`/user/${product.userId}`)}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
