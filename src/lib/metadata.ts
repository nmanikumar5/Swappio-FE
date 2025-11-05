import { Metadata } from "next";

export const defaultMetadata: Metadata = {
    title: {
        default: "Swappio - Buy, Sell & Exchange Pre-owned Items",
        template: "%s | Swappio",
    },
    description:
        "Your trusted marketplace for buying, selling, and exchanging pre-owned items. Find great deals on electronics, furniture, vehicles, and more. Join thousands of users trading safely.",
    keywords: [
        "marketplace",
        "buy sell",
        "pre-owned",
        "second hand",
        "exchange",
        "electronics",
        "furniture",
        "vehicles",
        "classifieds",
        "local deals",
    ],
    authors: [{ name: "Swappio Team" }],
    creator: "Swappio",
    publisher: "Swappio",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"
    ),
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "/",
        siteName: "Swappio",
        title: "Swappio - Buy, Sell & Exchange Pre-owned Items",
        description:
            "Your trusted marketplace for buying, selling, and exchanging pre-owned items.",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Swappio Marketplace",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Swappio - Buy, Sell & Exchange Pre-owned Items",
        description:
            "Your trusted marketplace for buying, selling, and exchanging pre-owned items.",
        images: ["/og-image.png"],
        creator: "@swappio",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    verification: {
        google: "your-google-verification-code",
        yandex: "your-yandex-verification-code",
    },
    alternates: {
        canonical: "/",
    },
};

export function generateListingMetadata(listing: {
    title: string;
    description: string;
    price: number;
    images?: string[];
    category: string;
    location: string;
}): Metadata {
    return {
        title: `${listing.title} - ₹${listing.price.toLocaleString()}`,
        description: listing.description.slice(0, 160),
        keywords: [
            listing.category,
            listing.location,
            "buy",
            "sell",
            listing.title,
            "marketplace",
        ],
        openGraph: {
            title: listing.title,
            description: listing.description.slice(0, 160),
            type: "article",
            images: listing.images?.[0]
                ? [
                    {
                        url: listing.images[0],
                        width: 800,
                        height: 600,
                        alt: listing.title,
                    },
                ]
                : [],
        },
        twitter: {
            card: "summary_large_image",
            title: listing.title,
            description: listing.description.slice(0, 160),
            images: listing.images?.[0] ? [listing.images[0]] : [],
        },
    };
}

export function generateCategoryMetadata(category: string): Metadata {
    const categoryName =
        category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ");

    return {
        title: `${categoryName} - Browse & Shop`,
        description: `Browse ${categoryName.toLowerCase()} listings. Find the best deals on pre-owned ${categoryName.toLowerCase()} items in your area.`,
        keywords: [category, "buy", "sell", "marketplace", categoryName],
        openGraph: {
            title: `${categoryName} - Swappio`,
            description: `Browse ${categoryName.toLowerCase()} listings on Swappio.`,
            type: "website",
        },
    };
}
