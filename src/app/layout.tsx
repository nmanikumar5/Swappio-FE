import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Swappio - Buy & Sell Near You | OLX Style Marketplace",
  description: "Discover great deals on electronics, vehicles, property, fashion and more. Buy and sell locally with Swappio - your trusted marketplace.",
  keywords: "marketplace, buy, sell, classified ads, electronics, vehicles, property, fashion, furniture",
  authors: [{ name: "Swappio" }],
  openGraph: {
    title: "Swappio - Buy & Sell Near You",
    description: "Your trusted marketplace for buying and selling locally",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
