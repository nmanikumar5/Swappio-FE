'use client'

import { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types'
import { useStore } from '@/store'
import { Heart } from 'lucide-react'

export default function FavouritesPage() {
  const { favourites, products } = useStore()
  const [favouriteProducts, setFavouriteProducts] = useState<Product[]>([])

  useEffect(() => {
    const filtered = products.filter(p => favourites.includes(p.id))
    setFavouriteProducts(filtered)
  }, [favourites, products])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Favourites</h1>
          <p className="text-muted-foreground">
            {favouriteProducts.length} {favouriteProducts.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {favouriteProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favouriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">No favourites yet</h2>
            <p className="text-muted-foreground">
              Start adding items to your favourites to see them here
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
