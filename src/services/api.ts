import { Listing, ListingFilters, CreateListingInput, Pagination, Message, Conversation } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

function authHeaders(contentType?: string) {
  const headers: Record<string, string> = {};
  if (contentType) headers['Content-Type'] = contentType;
  try {
    const token = localStorage.getItem('swappio_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  } catch { }
  return headers;
}

function toQueryString(params: Record<string, unknown>) {
  const qs = new URLSearchParams();
  for (const key in params) {
    const value = params[key];
    if (value !== undefined && value !== null) {
      qs.append(key, String(value));
    }
  }
  return qs.toString();
}

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit, retry = true) {
  // ensure cookies are sent for endpoints that rely on httpOnly cookies (refresh)
  const baseInit: RequestInit = { ...(init || {}), credentials: (init && init.credentials) || 'include' } as RequestInit;
  const res = await fetch(input, baseInit);
  if (res.status === 401 && retry) {
    // try refresh
    try {
      const r = await fetch(`${API_URL}/auth/refresh`, { method: 'POST', credentials: 'include' });
      if (r.ok) {
        const body = await r.json().catch(() => null);
        const token = body?.data?.token;
        if (token) {
          try { localStorage.setItem('swappio_token', token); } catch { }
        }
        // retry original request with updated header
        const headers = (baseInit && baseInit.headers) ? new Headers(baseInit.headers as HeadersInit) : new Headers();
        try {
          const token2 = localStorage.getItem('swappio_token');
          if (token2) headers.set('Authorization', `Bearer ${token2}`);
        } catch { }
        const newInit = { ...(baseInit || {}), headers, credentials: (baseInit && baseInit.credentials) || 'include' } as RequestInit;
        return fetch(input, newInit);
      }
      // if refresh failed (r not ok), only clear client storage when the original
      // request used a client token/Authorization header (avoid clearing for
      // cookie-based profile requests which rely on httpOnly cookies)
      try {
        let hadAuth = false;
        try {
          // check explicit header
          const headers = baseInit && baseInit.headers ? new Headers(baseInit.headers as HeadersInit) : null;
          if (headers && headers.get('Authorization')) hadAuth = true;
        } catch { }
        try {
          // fallback: check localStorage token presence
          const t = localStorage.getItem('swappio_token');
          if (t) hadAuth = true;
        } catch { }
        if (hadAuth) {
          const { clearSwappioStorage } = await import('./auth');
          clearSwappioStorage();
        }
      } catch { }
    } catch { }
  }
  return res;
}

export const listingService = {
  async getListings(filters?: ListingFilters): Promise<{ listings: Listing[]; pagination: Pagination }> {
    const qs = toQueryString({
      category: filters?.category,
      minPrice: filters?.minPrice,
      maxPrice: filters?.maxPrice,
      location: filters?.location,
      keyword: filters?.search,
      page: filters?.page || 1,
      limit: filters?.limit || 20,
    });

    const headers = authHeaders();
    const res = await fetchWithAuth(`${API_URL}/listings?${qs}`, { headers });
    if (!res.ok) throw new Error(`Listing fetch failed: ${res.status}`);
    const body = await res.json();
    return { listings: body.data.listings as Listing[], pagination: body.data.pagination };
  },

  async getListing(id: string): Promise<Listing | null> {
    const headers = authHeaders();
    const res = await fetchWithAuth(`${API_URL}/listings/${id}`, { headers });
    if (!res.ok) return null;
    const body = await res.json();
    return body.data.listing as Listing;
  },

  async createListing(data: CreateListingInput): Promise<Listing> {
    const headers = authHeaders('application/json');
    const res = await fetchWithAuth(`${API_URL}/listings`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Create listing failed');
    const body = await res.json();
    return body.data.listing as Listing;
  },

  async updateListing(id: string, data: Partial<CreateListingInput>): Promise<Listing> {
    const headers = authHeaders('application/json');
    const res = await fetchWithAuth(`${API_URL}/listings/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Update listing failed');
    const body = await res.json();
    return body.data.listing as Listing;
  },

  async deleteListing(listingId: string): Promise<void> {
    const headers = authHeaders();
    await fetchWithAuth(`${API_URL}/listings/${listingId}`, { method: 'DELETE', headers });
  },
  async getMyListings(page = 1, limit = 50): Promise<{ listings: Listing[]; pagination: Pagination }> {
    const headers = authHeaders();
    const res = await fetchWithAuth(`${API_URL}/listings/my?page=${page}&limit=${limit}`, { headers });
    if (!res.ok) throw new Error(`My listings fetch failed: ${res.status}`);
    const body = await res.json();
    return { listings: body.data.listings as Listing[], pagination: body.data.pagination };
  },
};

export const uploadService = {
  async uploadImages(files: File[], folder?: string): Promise<string[]> {
    // Use FormData to upload files to backend
    const form = new FormData();
    files.forEach((f) => form.append('images', f));
    if (folder) form.append('folder', folder);

    const headers = authHeaders();
    const res = await fetchWithAuth(`${API_URL}/upload/images`, {
      method: 'POST',
      headers,
      body: form,
    });
    if (!res.ok) throw new Error('Upload failed');
    const body = await res.json();
    return body.data.urls as string[];
  },
  // single-file upload with progress callback using XMLHttpRequest
  uploadImage(file: File, onProgress?: (percent: number) => void, folder?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      let url = `${API_URL}/upload/images`;
      if (folder) url += `?folder=${encodeURIComponent(folder)}`;
      xhr.open('POST', url, true);

      // set auth header if available
      try {
        const token = localStorage.getItem('swappio_token');
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      } catch { }

      xhr.upload.onprogress = function (e) {
        if (e.lengthComputable && typeof onProgress === 'function') {
          const pct = Math.round((e.loaded / e.total) * 100);
          onProgress(pct);
        }
      };

      xhr.onload = function () {
        try {
          if (xhr.status >= 200 && xhr.status < 300) {
            const parsed = JSON.parse(xhr.responseText);
            // prefer single url, fall back to array
            const urls = parsed?.data?.urls || (parsed?.data?.url ? [parsed.data.url] : []);
            resolve(urls[0] || '');
          } else {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        } catch (err) {
          reject(err);
        }
      };

      xhr.onerror = function () {
        reject(new Error('Upload network error'));
      };

      const form = new FormData();
      form.append('images', file);
      xhr.send(form);
    });
  },
};

export const messageService = {
  async getConversations(): Promise<Conversation[]> {
    const headers = authHeaders();
    const res = await fetchWithAuth(`${API_URL}/messages/conversations`, { headers });
    if (!res.ok) throw new Error('Failed to fetch conversations');
    const body = await res.json();
    return body.data.conversations as Conversation[];
  },

  async getMessages(userId: string, page = 1, limit = 50): Promise<{ messages: Message[]; pagination: Pagination }> {
    const headers = authHeaders();
    const res = await fetchWithAuth(`${API_URL}/messages/${encodeURIComponent(userId)}?page=${page}&limit=${limit}`, { headers });
    if (!res.ok) throw new Error('Failed to fetch messages');
    const body = await res.json();
    // Normalize messages from backend (Mongoose may return _id and populated sender/receiver objects)
    const rawMessages: Record<string, unknown>[] = (body && body.data && Array.isArray(body.data.messages))
      ? (body.data.messages as Record<string, unknown>[])
      : [];

    const messages: Message[] = rawMessages.map((m) => {
      const rec = m as Record<string, unknown>;
      const rawSender = rec['senderId'];
      const rawReceiver = rec['receiverId'];

      const senderId = (rawSender && typeof rawSender === 'object')
        ? String(((rawSender as Record<string, unknown>)['_id'] || (rawSender as Record<string, unknown>)['id']) ?? '')
        : String(rawSender ?? '');

      const receiverId = (rawReceiver && typeof rawReceiver === 'object')
        ? String(((rawReceiver as Record<string, unknown>)['_id'] || (rawReceiver as Record<string, unknown>)['id']) ?? '')
        : String(rawReceiver ?? '');

      const listingRaw = rec['listingId'];
      const listingId = listingRaw
        ? (typeof listingRaw === 'object' && listingRaw !== null
          ? String(((listingRaw as Record<string, unknown>)['_id'] || listingRaw) ?? '')
          : String(listingRaw))
        : undefined;

      const id = String(rec['_id'] ?? rec['id'] ?? '');
      const text = String(rec['text'] ?? '');
      const createdAt = String(rec['createdAt'] ?? new Date().toISOString());
      const readRaw = rec['isRead'] ?? rec['read'];
      const read = Boolean(readRaw);
      const isDeliveredRaw = rec['isDelivered'] ?? false;
      const isDelivered = Boolean(isDeliveredRaw);
      const deliveredAt = rec['deliveredAt'] ? String(rec['deliveredAt']) : undefined;

      return {
        id,
        text,
        senderId,
        receiverId,
        listingId,
        createdAt,
        read,
        isDelivered,
        deliveredAt,
      } as Message;
    });

    return { messages, pagination: body.data.pagination as Pagination };
  },

  async sendMessage(payload: { receiverId: string; text: string; listingId?: string }) {
    const headers = authHeaders('application/json');
    const res = await fetchWithAuth(`${API_URL}/messages`, { method: 'POST', headers, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error('Send message failed');
    const body = await res.json();
    const m = body?.data?.message;
    if (!m) return null;
    const senderId = typeof m.senderId === 'object' ? String(m.senderId._id || m.senderId.id) : String(m.senderId);
    const receiverId = typeof m.receiverId === 'object' ? String(m.receiverId._id || m.receiverId.id) : String(m.receiverId);
    const message: Message = {
      id: String(m._id || m.id),
      text: m.text || '',
      senderId,
      receiverId,
      listingId: m.listingId ? String(m.listingId._id || m.listingId) : undefined,
      createdAt: m.createdAt || new Date().toISOString(),
      read: m.isRead ?? m.read ?? false,
      isDelivered: m.isDelivered ?? false,
      deliveredAt: m.deliveredAt ? String(m.deliveredAt) : undefined,
    };
    return message;
  },

  async getUnreadCount(): Promise<number> {
    const headers = authHeaders();
    const res = await fetchWithAuth(`${API_URL}/messages/unread/count`, { headers });
    if (!res.ok) throw new Error('Failed to fetch unread count');
    const body = await res.json();
    return body.data.count as number;
  },
};

export const favoriteService = {
  async addFavorite(listingId: string): Promise<void> {
    const headers = authHeaders('application/json');
    const res = await fetchWithAuth(`${API_URL}/favorites`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ listingId }),
    });
    if (!res.ok) throw new Error('Failed to add favorite');
  },

  async removeFavorite(listingId: string): Promise<void> {
    const headers = authHeaders();
    const res = await fetchWithAuth(`${API_URL}/favorites/${listingId}`, {
      method: 'DELETE',
      headers,
    });
    if (!res.ok) throw new Error('Failed to remove favorite');
  },

  async getFavorites(): Promise<Listing[]> {
    const headers = authHeaders();
    const res = await fetchWithAuth(`${API_URL}/favorites`, { headers });
    if (!res.ok) throw new Error('Failed to fetch favorites');
    const body = await res.json();
    const favorites = body.data.favorites || body.data || [];

    // Transform backend response to Listing type
    return favorites.map((fav: unknown) => {
      const f = fav as Record<string, unknown>;
      const listing = (f.listingId || f) as Record<string, unknown>;
      const owner = (listing.ownerId || {}) as Record<string, unknown>;
      const ownerId = typeof owner === 'object' && owner !== null
        ? String((owner as { _id?: string; id?: string })._id || (owner as { _id?: string; id?: string }).id || '')
        : String(owner || '');

      return {
        id: String((listing._id as string) || (listing.id as string) || ''),
        title: String(listing.title || ''),
        description: String(listing.description || ''),
        price: Number(listing.price || 0),
        category: String(listing.category || ''),
        location: String(listing.location || ''),
        images: (listing.images as string[]) || [],
        userId: ownerId,
        user: {
          id: ownerId,
          name: String((owner as { name?: string }).name || 'Unknown'),
          email: String((owner as { email?: string }).email || ''),
          photo: (owner as { photo?: string; image?: string }).photo || (owner as { photo?: string; image?: string }).image,
          location: String((owner as { location?: string }).location || ''),
          createdAt: String((owner as { createdAt?: string }).createdAt || new Date().toISOString()),
          role: String((owner as { role?: string }).role || 'user') as 'user' | 'admin',
        },
        status: String(listing.status || 'active') as 'active' | 'sold' | 'pending',
        createdAt: String(listing.createdAt || new Date().toISOString()),
        updatedAt: String(listing.updatedAt || new Date().toISOString()),
        views: Number(listing.views || 0),
        isFavorite: true, // All items from this endpoint are favorites
      } as Listing;
    });
  },
};

// Admin API
export const adminService = {
  // Dashboard
  async getDashboard() {
    const res = await fetchWithAuth(`${API_URL}/admin/dashboard`, {
      headers: authHeaders('application/json'),
    });
    if (!res.ok) throw new Error('Failed to fetch admin dashboard');
    const data = await res.json();
    return data.data;
  },
  async getStats() {
    const res = await fetchWithAuth(`${API_URL}/admin/stats`, {
      headers: authHeaders('application/json'),
    });
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    const data = await res.json();
    return data.data;
  },

  // Listings Management
  async getListings(params?: { page?: number; limit?: number; approvalStatus?: string; status?: string }) {
    const query = params ? `?${toQueryString(params)}` : '';
    const res = await fetchWithAuth(`${API_URL}/admin/listings${query}`, {
      headers: authHeaders('application/json'),
    });
    if (!res.ok) throw new Error('Failed to fetch listings');
    const data = await res.json();
    return data.data;
  },

  async approveListing(id: string) {
    const res = await fetchWithAuth(`${API_URL}/admin/listings/${id}/approve`, {
      method: 'PUT',
      headers: authHeaders('application/json'),
    });
    if (!res.ok) throw new Error('Failed to approve listing');
    const data = await res.json();
    return data.data;
  },

  async rejectListing(id: string, reason: string) {
    const res = await fetchWithAuth(`${API_URL}/admin/listings/${id}/reject`, {
      method: 'PUT',
      headers: authHeaders('application/json'),
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) throw new Error('Failed to reject listing');
    const data = await res.json();
    return data.data;
  },

  async deleteListing(id: string) {
    const res = await fetchWithAuth(`${API_URL}/admin/listings/${id}`, {
      method: 'DELETE',
      headers: authHeaders('application/json'),
    });
    if (!res.ok) throw new Error('Failed to delete listing');
    return true;
  },

  // Users Management
  async getUsers(params?: { page?: number; limit?: number; search?: string; role?: string }) {
    const query = params ? `?${toQueryString(params)}` : '';
    const res = await fetchWithAuth(`${API_URL}/admin/users${query}`, {
      headers: authHeaders('application/json'),
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    const data = await res.json();
    return data.data;
  },

  async suspendUser(id: string) {
    const res = await fetchWithAuth(`${API_URL}/admin/users/${id}/suspend`, {
      method: 'PUT',
      headers: authHeaders('application/json'),
    });
    if (!res.ok) throw new Error('Failed to suspend user');
    const data = await res.json();
    return data.data;
  },

  async deleteUser(id: string) {
    const res = await fetchWithAuth(`${API_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: authHeaders('application/json'),
    });
    if (!res.ok) throw new Error('Failed to delete user');
    return true;
  },

  // Reports Management
  async getReports(params?: { page?: number; limit?: number; status?: string }) {
    const query = params ? `?${toQueryString(params)}` : '';
    const res = await fetchWithAuth(`${API_URL}/reports${query}`, {
      headers: authHeaders('application/json'),
    });
    if (!res.ok) throw new Error('Failed to fetch reports');
    const data = await res.json();
    return data.data;
  },

  async updateReport(id: string, status: string, reviewNote?: string) {
    const res = await fetchWithAuth(`${API_URL}/reports/${id}`, {
      method: 'PUT',
      headers: authHeaders('application/json'),
      body: JSON.stringify({ status, reviewNote }),
    });
    if (!res.ok) throw new Error('Failed to update report');
    const data = await res.json();
    return data.data;
  },
};

// Payments (Admin)
export const paymentAdminService = {
  async getAll(params?: { page?: number; limit?: number; status?: string; type?: string; gateway?: string }) {
    const query = params ? `?${toQueryString(params)}` : '';
    const res = await fetchWithAuth(`${API_URL}/payments/admin/all${query}`, {
      headers: authHeaders('application/json'),
    });
    if (!res.ok) throw new Error('Failed to fetch payments');
    const data = await res.json();
    return data.data as { payments: unknown[]; stats: unknown[]; pagination: Pagination };
  },
};

// Rating Service
export const ratingService = {
  async createRating(data: {
    revieweeId: string;
    listingId?: string;
    rating: number;
    review?: string;
    type: 'buyer' | 'seller';
  }) {
    const res = await fetchWithAuth(`${API_URL}/ratings`, {
      method: 'POST',
      headers: authHeaders('application/json'),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to create rating' }));
      throw new Error(error.message || 'Failed to create rating');
    }
    const result = await res.json();
    return result.data;
  },

  async getUserRatings(userId: string, params?: { page?: number; limit?: number; type?: 'buyer' | 'seller' }) {
    const query = params ? `?${toQueryString(params)}` : '';
    const res = await fetch(`${API_URL}/ratings/user/${userId}${query}`);
    if (!res.ok) throw new Error('Failed to fetch ratings');
    const data = await res.json();
    return data.data;
  },

  async getUserRatingSummary(userId: string) {
    const res = await fetch(`${API_URL}/ratings/user/${userId}/summary`);
    if (!res.ok) throw new Error('Failed to fetch rating summary');
    const data = await res.json();
    return data.data;
  },

  async updateRating(id: string, data: { rating?: number; review?: string }) {
    const res = await fetchWithAuth(`${API_URL}/ratings/${id}`, {
      method: 'PUT',
      headers: authHeaders('application/json'),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update rating');
    const result = await res.json();
    return result.data;
  },

  async deleteRating(id: string) {
    const res = await fetchWithAuth(`${API_URL}/ratings/${id}`, {
      method: 'DELETE',
      headers: authHeaders('application/json'),
    });
    if (!res.ok) throw new Error('Failed to delete rating');
    return true;
  },

  async canRateUser(userId: string, listingId?: string) {
    const query = listingId ? `?listingId=${listingId}` : '';
    const res = await fetchWithAuth(`${API_URL}/ratings/can-rate/${userId}${query}`, {
      headers: authHeaders('application/json'),
    });
    if (!res.ok) throw new Error('Failed to check rating status');
    const data = await res.json();
    return data.data;
  },
};

// Category API
export const categoryService = {
  async getCategories(options?: { parentOnly?: boolean; includeSubcategories?: boolean }) {
    const query = options ? toQueryString(options as Record<string, unknown>) : '';
    const res = await fetch(`${API_URL}/categories${query ? `?${query}` : ''}`, {
      headers: authHeaders('application/json'),
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    return data.data.categories;
  },

  async getCategoryTree() {
    const res = await fetch(`${API_URL}/categories/tree`, {
      headers: authHeaders('application/json'),
    });
    if (!res.ok) throw new Error('Failed to fetch category tree');
    const data = await res.json();
    return data.data.categories;
  },

  async getCategoryBySlug(slug: string) {
    const res = await fetch(`${API_URL}/categories/${slug}`, {
      headers: authHeaders('application/json'),
    });
    if (!res.ok) throw new Error('Failed to fetch category');
    const data = await res.json();
    return data.data.category;
  },
};

// Admin Config API
export const configService = {
  async getPublicConfigs() {
    const res = await fetch(`${API_URL}/config/public`);
    if (!res.ok) throw new Error('Failed to fetch public configurations');
    const data = await res.json();
    return data.data.configs || {};
  },

  async getAllConfigs(params?: { category?: string; search?: string }) {
    const query = params ? toQueryString(params as Record<string, unknown>) : '';
    const res = await fetchWithAuth(`${API_URL}/admin/config${query ? `?${query}` : ''}`, {
      headers: authHeaders('application/json'),
    });
    if (!res.ok) throw new Error('Failed to fetch configurations');
    const data = await res.json();
    return data.data.configs || [];
  },

  async getConfigByKey(key: string) {
    const res = await fetchWithAuth(`${API_URL}/admin/config/${key}`, {
      headers: authHeaders('application/json'),
    });
    if (!res.ok) throw new Error('Failed to fetch configuration');
    const data = await res.json();
    return data.data.config;
  },

  async getConfigsByCategory(category: string) {
    const res = await fetchWithAuth(`${API_URL}/admin/config/category/${category}`, {
      headers: authHeaders('application/json'),
    });
    if (!res.ok) throw new Error('Failed to fetch configurations');
    const data = await res.json();
    return data.data.configs || [];
  },

  async createConfig(config: {
    key: string;
    value: string;
    encrypted?: boolean;
    category: string;
    description?: string;
    metadata?: Record<string, unknown>;
  }) {
    const res = await fetchWithAuth(`${API_URL}/admin/config`, {
      method: 'POST',
      headers: authHeaders('application/json'),
      body: JSON.stringify(config),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create configuration');
    }
    const data = await res.json();
    return data.data.config;
  },

  async updateConfig(key: string, updates: {
    value?: string;
    encrypted?: boolean;
    category?: string;
    description?: string;
    metadata?: Record<string, unknown>;
    isActive?: boolean;
  }) {
    const res = await fetchWithAuth(`${API_URL}/admin/config/${key}`, {
      method: 'PUT',
      headers: authHeaders('application/json'),
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to update configuration');
    }
    const data = await res.json();
    return data.data.config;
  },

  async deleteConfig(key: string) {
    const res = await fetchWithAuth(`${API_URL}/admin/config/${key}`, {
      method: 'DELETE',
      headers: authHeaders('application/json'),
    });
    if (!res.ok) throw new Error('Failed to delete configuration');
    return true;
  },

  async seedDefaultConfigs() {
    const res = await fetchWithAuth(`${API_URL}/admin/config/seed`, {
      method: 'POST',
      headers: authHeaders('application/json'),
    });
    if (!res.ok) throw new Error('Failed to seed configurations');
    const data = await res.json();
    return data.data;
  },
};

// Report Service
export const reportService = {
  async createReport(data: {
    listingId: string;
    reason: string;
    description?: string;
  }) {
    const res = await fetchWithAuth(`${API_URL}/reports`, {
      method: 'POST',
      headers: authHeaders('application/json'),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create report');
    }
    const result = await res.json();
    return result.data;
  },
};
