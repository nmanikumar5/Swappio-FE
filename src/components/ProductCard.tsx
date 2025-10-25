'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, MapPin, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Product } from '@/types'
import { formatPrice, formatRelativeTime } from '@/lib/utils'
import { useStore } from '@/store'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isFavourite, addFavourite, removeFavourite } = useStore()
  const favourite = isFavourite(product.id)

  const toggleFavourite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (favourite) {
      removeFavourite(product.id)
    } else {
      addFavourite(product.id)
    }
  }

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Favourite Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white",
              favourite && "text-red-500 hover:text-red-600"
            )}
            onClick={toggleFavourite}
          >
            <Heart className={cn("h-4 w-4", favourite && "fill-current")} />
          </Button>

          {/* Featured Badge */}
          {product.isFeatured && (
            <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
              Featured
            </Badge>
          )}

          {/* Condition Badge */}
          <Badge 
            variant="secondary" 
            className="absolute bottom-2 left-2 capitalize"
          >
            {product.condition}
          </Badge>
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            {/* Price */}
            <div className="text-xl font-bold text-primary">
              {formatPrice(product.price)}
            </div>

            {/* Title */}
            <h3 className="font-semibold line-clamp-2 text-sm">
              {product.title}
            </h3>

            {/* Location and Time */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="line-clamp-1">{product.location}</span>
              </div>
              <span>{formatRelativeTime(product.createdAt)}</span>
            </div>

            {/* Views */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              <span>{product.views} views</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
