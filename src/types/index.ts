// User types
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  location?: string;
  createdAt: string;
  role: "user" | "admin";
}

// Listing types
export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: string[];
  userId: string;
  user: User;
  status: "active" | "sold" | "pending";
  createdAt: string;
  updatedAt: string;
  views: number;
  isFavorite?: boolean;
}

// Category type
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count?: number;
}

// Chat types
export interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  listingId?: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  listing?: Listing;
  unreadCount: number;
}

// Filter types
export interface ListingFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  search?: string;
}

// Form types
export interface CreateListingInput {
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: File[] | string[];
}

export interface UpdateProfileInput {
  name: string;
  phone?: string;
  location?: string;
  image?: File | string;
}
