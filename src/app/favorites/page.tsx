"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FavoritesPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Favorites</h1>
        <p className="mt-2 text-muted-foreground">
          Items you&apos;ve saved for later
        </p>
      </div>

      <Card>
        <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-6">
          <Heart className="mb-4 h-16 w-16 text-muted-foreground" />
          <p className="mb-2 text-xl font-semibold">No favorites yet</p>
          <p className="mb-6 text-center text-muted-foreground">
            Save items you like by clicking the heart icon on listings
          </p>
          <Link href="/">
            <Button>Browse Listings</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
