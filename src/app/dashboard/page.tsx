'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import ProductCard from '@/components/ProductCard'
import { Package, Heart, MessageSquare } from 'lucide-react'
import { Product } from '@/types'

const mockUserProducts: Product[] = [
  {
    id: '1',
    title: 'iPhone 14 Pro Max 256GB',
    description: 'Brand new iPhone',
    price: 125000,
    images: ['https://images.unsplash.com/photo-1678652197950-1cdd5b4e0d1f?w=500&h=500&fit=crop'],
    category: 'electronics',
    condition: 'new',
    location: 'Mumbai',
    userId: 'me',
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 234,
    isFeatured: true,
  },
]

export default function DashboardPage() {
  const [stats] = useState({
    totalAds: 5,
    activeAds: 3,
    soldItems: 2,
    totalViews: 1250,
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Ads</p>
                  <p className="text-2xl font-bold">{stats.totalAds}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Ads</p>
                  <p className="text-2xl font-bold">{stats.activeAds}</p>
                </div>
                <Badge className="h-8 w-8 rounded-full flex items-center justify-center">
                  {stats.activeAds}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sold Items</p>
                  <p className="text-2xl font-bold">{stats.soldItems}</p>
                </div>
                <Heart className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold">{stats.totalViews}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active Ads</TabsTrigger>
            <TabsTrigger value="sold">Sold</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Active Listings</h2>
              <Button>Post New Ad</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mockUserProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sold">
            <div className="text-center py-20">
              <p className="text-muted-foreground">No sold items yet</p>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Profile Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Update your profile details and preferences
                  </p>
                  <Button variant="outline" className="mt-2">Edit Profile</Button>
                </div>
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your notification preferences
                  </p>
                  <Button variant="outline" className="mt-2">Configure</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
