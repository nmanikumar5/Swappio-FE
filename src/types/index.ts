export interface User {
  id: string
  name: string
  email: string
  image?: string
  role: 'user' | 'admin'
  createdAt: Date
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  category: string
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor'
  location: string
  userId: string
  user?: User
  createdAt: Date
  updatedAt: Date
  views: number
  isFeatured: boolean
}

export interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  productId?: string
  createdAt: Date
  read: boolean
}

export interface Chat {
  id: string
  participants: User[]
  product?: Product
  lastMessage?: Message
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  count?: number
}

export interface Filter {
  category?: string
  minPrice?: number
  maxPrice?: number
  condition?: string[]
  location?: string
  search?: string
  sortBy?: 'newest' | 'price-low' | 'price-high' | 'popular'
}

export interface FavouriteProduct {
  id: string
  userId: string
  productId: string
  product: Product
  createdAt: Date
}
