import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Swappio - Buy, Sell, Exchange Pre-owned Items",
  description: "Your trusted marketplace for buying, selling, and exchanging pre-owned items. Find great deals on electronics, furniture, vehicles, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
