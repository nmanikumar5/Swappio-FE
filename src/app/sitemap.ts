import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://swappio.in';

    // Static routes
    const routes = [
        '',
        '/auth/signin',
        '/auth/signup',
        '/post-ad',
        '/favorites',
        '/dashboard',
        '/chat',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Category routes
    const categories = [
        'electronics',
        'furniture',
        'vehicles',
        'fashion',
        'books',
        'sports',
        'home-garden',
        'pets',
        'services',
    ];

    const categoryRoutes = categories.map((category) => ({
        url: `${baseUrl}/?category=${category}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
    }));

    // TODO: Add dynamic listing routes from database
    // This would require fetching from your API
    // const listings = await fetchRecentListings();
    // const listingRoutes = listings.map(listing => ({
    //   url: `${baseUrl}/listing/${listing.id}`,
    //   lastModified: new Date(listing.updatedAt),
    //   changeFrequency: 'weekly',
    //   priority: 0.6,
    // }));

    return [...routes, ...categoryRoutes];
}
