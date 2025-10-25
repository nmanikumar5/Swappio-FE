'use client'

import { useEffect, useMemo } from 'react'
import ProductCard from '@/components/ProductCard'
import CategoryFilter from '@/components/CategoryFilter'
import FilterSidebar from '@/components/FilterSidebar'
import { Product } from '@/types'
import { useStore } from '@/store'
import { Loader2 } from 'lucide-react'

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    id: '1',
    title: 'iPhone 14 Pro Max 256GB - Space Black',
    description: 'Brand new iPhone 14 Pro Max with 1 year warranty',
    price: 125000,
    images: ['https://images.unsplash.com/photo-1678652197950-1cdd5b4e0d1f?w=500&h=500&fit=crop'],
    category: 'electronics',
    condition: 'new',
    location: 'Mumbai, Maharashtra',
    userId: 'user1',
    createdAt: new Date('2025-10-20'),
    updatedAt: new Date('2025-10-20'),
    views: 234,
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Honda City 2020 - Excellent Condition',
    description: 'Well maintained Honda City with full service history',
    price: 850000,
    images: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=500&fit=crop'],
    category: 'vehicles',
    condition: 'like-new',
    location: 'Delhi, Delhi',
    userId: 'user2',
    createdAt: new Date('2025-10-22'),
    updatedAt: new Date('2025-10-22'),
    views: 456,
    isFeatured: false,
  },
  {
    id: '3',
    title: 'MacBook Pro M2 16" - 512GB SSD',
    description: 'Latest MacBook Pro with M2 chip, perfect for professionals',
    price: 195000,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop'],
    category: 'computers',
    condition: 'new',
    location: 'Bangalore, Karnataka',
    userId: 'user3',
    createdAt: new Date('2025-10-23'),
    updatedAt: new Date('2025-10-23'),
    views: 189,
    isFeatured: true,
  },
  {
    id: '4',
    title: '2BHK Apartment for Rent - Fully Furnished',
    description: 'Spacious 2BHK apartment in prime location',
    price: 25000,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=500&fit=crop'],
    category: 'property',
    condition: 'good',
    location: 'Pune, Maharashtra',
    userId: 'user4',
    createdAt: new Date('2025-10-24'),
    updatedAt: new Date('2025-10-24'),
    views: 567,
    isFeatured: false,
  },
  {
    id: '5',
    title: 'Sofa Set - 3+2+1 Seater',
    description: 'Premium quality leather sofa set in excellent condition',
    price: 45000,
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop'],
    category: 'furniture',
    condition: 'good',
    location: 'Chennai, Tamil Nadu',
    userId: 'user5',
    createdAt: new Date('2025-10-21'),
    updatedAt: new Date('2025-10-21'),
    views: 123,
    isFeatured: false,
  },
  {
    id: '6',
    title: 'Designer Saree Collection - Wedding Special',
    description: 'Beautiful designer sarees for special occasions',
    price: 8500,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=500&fit=crop'],
    category: 'fashion',
    condition: 'new',
    location: 'Hyderabad, Telangana',
    userId: 'user6',
    createdAt: new Date('2025-10-25'),
    updatedAt: new Date('2025-10-25'),
    views: 89,
    isFeatured: false,
  },
]

export default function HomePage() {
  const { products, setProducts, filters, searchQuery, isLoading, setIsLoading } = useStore()

  // Load mock products on mount
  useEffect(() => {
    setIsLoading(true)
    // Simulate API call
    const timer = setTimeout(() => {
      setProducts(mockProducts)
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [setProducts, setIsLoading])

  // Apply filters using useMemo
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category)
    }

    // Price filter
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= filters.minPrice!)
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice!)
    }

    // Condition filter
    if (filters.condition && filters.condition.length > 0) {
      filtered = filtered.filter(p => filters.condition!.includes(p.condition))
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(p => 
        p.location.toLowerCase().includes(filters.location!.toLowerCase())
      )
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        filtered.sort((a, b) => b.views - a.views)
        break
    }

    return filtered
  }, [products, filters, searchQuery])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Filter */}
      <CategoryFilter />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-20">
              <FilterSidebar />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <details className="bg-white rounded-lg border p-4">
                <summary className="cursor-pointer font-semibold">
                  Filters & Sort
                </summary>
                <div className="mt-4">
                  <FilterSidebar />
                </div>
              </details>
            </div>

            {/* Results Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
              </h1>
              <p className="text-muted-foreground">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'ad' : 'ads'} found
              </p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* No Results */}
            {!isLoading && filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground mb-2">No products found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
