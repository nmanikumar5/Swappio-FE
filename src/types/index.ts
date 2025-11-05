// User types
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  photo?: string;
  phone?: string;
  location?: string;
  createdAt: string;
  role: "user" | "admin";
  averageRating?: number;
  totalRatings?: number;
  ratingBreakdown?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
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
  favoriteCount?: number;
  ownerId?: {
    _id?: string;
    name?: string;
    email?: string;
    photo?: string;
  };
}

// Category type
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count?: number;
  description?: string;
  parentCategory?: string | Category;
  subcategories?: Category[];
  isActive?: boolean;
  order?: number;
  image?: string;
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
  isDelivered?: boolean;
  deliveredAt?: string;
}



export interface Sender {
  _id: string
  name: string
  email: string
  passwordHash: string
  role: string
  isActive: boolean
  isSuspended: boolean
  refreshTokens: RefreshToken[]
  createdAt: string
  updatedAt: string
  __v: number
}

export interface RefreshToken {
  tokenHash: string
  createdAt: string
  expiresAt: string
  _id: string
}

export interface Receiver {
  _id: string
  name: string
  email: string
  role: string
  isActive: boolean
  isSuspended: boolean
  __v: number
  createdAt: string
  updatedAt: string
  passwordHash: string
  refreshTokens: RefreshToken2[]
}

export interface RefreshToken2 {
  tokenHash: string
  createdAt: string
  expiresAt: string
  _id: string
}


export interface Conversation {
  id: string
  sender: Sender
  receiver: Receiver
  text: string
  createdAt: string
}

export interface Notification {
  id: string;
  userId: string;
  senderId?: string;
  listingId?: string;
  messageId?: string;
  text?: string;
  read: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Filter types
export interface ListingFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
  // optional coordinates to bias/filter results
  lat?: number;
  lng?: number;
  // Advanced filters
  condition?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
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

// Rating types
export interface Rating {
  id: string;
  reviewer: {
    id: string;
    name: string;
    photo?: string;
  };
  reviewee: {
    id: string;
    name: string;
    photo?: string;
  };
  listing?: {
    id: string;
    title: string;
  };
  rating: number; // 1-5
  review?: string;
  type: 'buyer' | 'seller';
  createdAt: string;
  updatedAt: string;
}

export interface RatingSummary {
  averageRating: number;
  totalRatings: number;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface CreateRatingInput {
  revieweeId: string;
  listingId?: string;
  rating: number;
  review?: string;
  type: 'buyer' | 'seller';
}
