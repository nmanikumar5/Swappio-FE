"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ListingCard from "@/components/listing/ListingCard";
import { mockListings, mockUser } from "@/lib/mockData";
import { User, Package, Heart, MessageSquare } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("listings");
  const userListings = mockListings.filter((l) => l.userId === mockUser.id);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your listings, favorites, and account
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Stats Cards */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userListings.length}</p>
                <p className="text-sm text-muted-foreground">Active Ads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Favorites</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Messages</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Profile</p>
                <Link href="/dashboard/profile">
                  <Button variant="link" className="h-auto p-0 text-xs">
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">My Listings</h2>
              <Link href="/post-ad">
                <Button>Post New Ad</Button>
              </Link>
            </div>

            {userListings.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {userListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex min-h-[300px] flex-col items-center justify-center p-6">
                  <Package className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="mb-2 text-lg font-semibold">No listings yet</p>
                  <p className="mb-4 text-center text-muted-foreground">
                    Start selling by posting your first ad
                  </p>
                  <Link href="/post-ad">
                    <Button>Post Your First Ad</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <Card>
              <CardContent className="flex min-h-[300px] flex-col items-center justify-center p-6">
                <Heart className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="mb-2 text-lg font-semibold">No favorites yet</p>
                <p className="text-center text-muted-foreground">
                  Save items you like to view them later
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <Card>
              <CardContent className="flex min-h-[300px] flex-col items-center justify-center p-6">
                <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="mb-2 text-lg font-semibold">No messages yet</p>
                <p className="text-center text-muted-foreground">
                  Your conversations will appear here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
