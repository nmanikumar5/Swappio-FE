import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthHydrator from "@/components/AuthHydrator";
import FavoritesHydrator from "@/components/FavoritesHydrator";
import SocketProvider from "@/components/SocketProvider";
import { GoogleOAuthProvider } from "@/components/GoogleOAuthProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import RouteGuard from "@/components/RouteGuard";
import { ConfigProvider } from "@/contexts/ConfigContext";
import Script from "next/script";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Swappio - Buy, Sell, Exchange Pre-owned Items",
  description:
    "Your trusted marketplace for buying, selling, and exchanging pre-owned items. Find great deals on electronics, furniture, vehicles, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="antialiased">
        <ErrorBoundary>
          <ConfigProvider>
            <GoogleOAuthProvider>
              <SocketProvider>
                <AuthHydrator />
                <FavoritesHydrator />
                <RouteGuard>
                  <Navbar />
                  <main className="min-h-screen">{children}</main>
                  <Footer />
                </RouteGuard>
                <Toaster position="top-right" richColors />
              </SocketProvider>
            </GoogleOAuthProvider>
          </ConfigProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
