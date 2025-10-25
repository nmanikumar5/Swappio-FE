'use client'

import { Smartphone, Laptop, Home, Car, ShoppingBag, Briefcase, Shirt, Book } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store'
import { cn } from '@/lib/utils'

const categories = [
  { id: 'all', name: 'All Categories', icon: ShoppingBag },
  { id: 'electronics', name: 'Electronics', icon: Smartphone },
  { id: 'vehicles', name: 'Vehicles', icon: Car },
  { id: 'property', name: 'Property', icon: Home },
  { id: 'fashion', name: 'Fashion', icon: Shirt },
  { id: 'furniture', name: 'Furniture', icon: Briefcase },
  { id: 'books', name: 'Books', icon: Book },
  { id: 'computers', name: 'Computers', icon: Laptop },
]

export default function CategoryFilter() {
  const { filters, setFilters } = useStore()

  const handleCategoryClick = (categoryId: string) => {
    setFilters({ category: categoryId === 'all' ? undefined : categoryId })
  }

  return (
    <div className="border-b bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon
            const isActive = category.id === 'all' 
              ? !filters.category 
              : filters.category === category.id

            return (
              <Button
                key={category.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryClick(category.id)}
                className={cn(
                  "flex-shrink-0 gap-2",
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{category.name}</span>
                <span className="sm:hidden">{category.name.split(' ')[0]}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
