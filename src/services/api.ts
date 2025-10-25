import { Listing, ListingFilters, CreateListingInput } from "@/types";
import { mockListings } from "@/lib/mockData";

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const listingService = {
  async getListings(filters?: ListingFilters): Promise<Listing[]> {
    await delay(500);

    let filtered = [...mockListings];

    if (filters?.category) {
      filtered = filtered.filter((l) => l.category === filters.category);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.title.toLowerCase().includes(search) ||
          l.description.toLowerCase().includes(search)
      );
    }

    if (filters?.minPrice !== undefined) {
      filtered = filtered.filter((l) => l.price >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined) {
      filtered = filtered.filter((l) => l.price <= filters.maxPrice!);
    }

    if (filters?.location) {
      filtered = filtered.filter((l) =>
        l.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    return filtered;
  },

  async getListing(id: string): Promise<Listing | null> {
    await delay(300);
    return mockListings.find((l) => l.id === id) || null;
  },

  async createListing(data: CreateListingInput): Promise<Listing> {
    await delay(1000);
    
    const newListing: Listing = {
      id: Math.random().toString(36).substr(2, 9),
      title: data.title,
      description: data.description,
      price: data.price,
      category: data.category,
      location: data.location,
      images: data.images as string[],
      userId: "1",
      user: {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        location: data.location,
        createdAt: new Date().toISOString(),
        role: "user",
      },
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
    };

    return newListing;
  },

  async updateListing(id: string, data: Partial<CreateListingInput>): Promise<Listing> {
    await delay(1000);
    const listing = mockListings.find((l) => l.id === id);
    if (!listing) throw new Error("Listing not found");

    // id is used in the find operation above
    console.log(`Updated listing ${id}`);
    
    return {
      ...listing,
      ...data,
      updatedAt: new Date().toISOString(),
    } as Listing;
  },

  async deleteListing(listingId: string): Promise<void> {
    await delay(500);
    console.log(`Deleted listing ${listingId}`);
  },
};

export const uploadService = {
  async uploadImages(files: File[]): Promise<string[]> {
    await delay(2000);
    
    // Simulate image upload and return mock URLs
    return files.map(
      (_, index) =>
        `https://images.unsplash.com/photo-${1500000000000 + index}?w=800&h=600&fit=crop`
    );
  },
};
