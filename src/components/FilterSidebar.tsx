'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useStore } from '@/store'
import { Filter, X } from 'lucide-react'

export default function FilterSidebar() {
  const { filters, setFilters, resetFilters } = useStore()
  const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() || '')
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() || '')

  const handlePriceFilter = () => {
    setFilters({
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
    })
  }

  const handleConditionChange = (value: string) => {
    if (value === 'all') {
      setFilters({ condition: undefined })
    } else {
      setFilters({ condition: [value] })
    }
  }

  const handleSortChange = (value: string) => {
    setFilters({ sortBy: value as 'newest' | 'price-low' | 'price-high' | 'popular' })
  }

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>

      {/* Sort */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Sort By</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={filters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="minPrice">Min Price</Label>
            <Input
              id="minPrice"
              type="number"
              placeholder="₹0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxPrice">Max Price</Label>
            <Input
              id="maxPrice"
              type="number"
              placeholder="₹100000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <Button onClick={handlePriceFilter} className="w-full" size="sm">
            Apply
          </Button>
        </CardContent>
      </Card>

      {/* Condition */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Condition</CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={filters.condition?.[0] || 'all'} 
            onValueChange={handleConditionChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Conditions</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="like-new">Like New</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Location</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Enter location..."
            value={filters.location || ''}
            onChange={(e) => setFilters({ location: e.target.value })}
          />
        </CardContent>
      </Card>
    </div>
  )
}
