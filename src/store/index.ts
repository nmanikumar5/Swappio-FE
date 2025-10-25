import { create } from 'zustand'
import { Product, Filter, User } from '@/types'

interface AppState {
  // User state
  user: User | null
  setUser: (user: User | null) => void
  
  // Products state
  products: Product[]
  setProducts: (products: Product[]) => void
  
  // Filters
  filters: Filter
  setFilters: (filters: Partial<Filter>) => void
  resetFilters: () => void
  
  // Favourites
  favourites: string[]
  addFavourite: (productId: string) => void
  removeFavourite: (productId: string) => void
  isFavourite: (productId: string) => boolean
  
  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void
  
  // UI State
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const defaultFilters: Filter = {
  category: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  condition: undefined,
  location: undefined,
  search: undefined,
  sortBy: 'newest'
}

export const useStore = create<AppState>((set, get) => ({
  // User
  user: null,
  setUser: (user) => set({ user }),
  
  // Products
  products: [],
  setProducts: (products) => set({ products }),
  
  // Filters
  filters: defaultFilters,
  setFilters: (newFilters) => set((state) => ({ 
    filters: { ...state.filters, ...newFilters } 
  })),
  resetFilters: () => set({ filters: defaultFilters }),
  
  // Favourites
  favourites: [],
  addFavourite: (productId) => set((state) => ({
    favourites: [...state.favourites, productId]
  })),
  removeFavourite: (productId) => set((state) => ({
    favourites: state.favourites.filter(id => id !== productId)
  })),
  isFavourite: (productId) => get().favourites.includes(productId),
  
  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  // UI
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading })
}))
