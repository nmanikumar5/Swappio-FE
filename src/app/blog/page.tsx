"use client";

import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  image: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with Swappio: A Beginner's Guide",
    excerpt:
      "Learn how to create your account, list items, and make your first trade on Swappio. We'll walk you through every step.",
    author: "Sarah Johnson",
    date: "Nov 1, 2025",
    category: "Tutorial",
    image: "🎯",
  },
  {
    id: "2",
    title: "5 Tips for Successful Trades",
    excerpt:
      "Discover proven strategies to make your trading experience smoother and more rewarding. From pricing to communication.",
    author: "Mike Chen",
    date: "Oct 28, 2025",
    category: "Tips & Tricks",
    image: "✨",
  },
  {
    id: "3",
    title: "How Swappio is Reducing Waste",
    excerpt:
      "Explore our mission to promote sustainability through peer-to-peer trading and environmental impact metrics.",
    author: "Emma Davis",
    date: "Oct 25, 2025",
    category: "Sustainability",
    image: "🌍",
  },
  {
    id: "4",
    title: "Community Spotlight: Stories from Our Users",
    excerpt:
      "Meet amazing members of the Swappio community and learn about their unique trading journeys and experiences.",
    author: "Alex Rodriguez",
    date: "Oct 22, 2025",
    category: "Community",
    image: "👥",
  },
  {
    id: "5",
    title: "New Features Update: November 2025",
    excerpt:
      "Check out the latest improvements and new features we've added to make your trading experience even better.",
    author: "Dev Team",
    date: "Oct 20, 2025",
    category: "Updates",
    image: "🚀",
  },
  {
    id: "6",
    title: "Safety Best Practices for Online Trading",
    excerpt:
      "Important tips to keep yourself safe while trading online. Learn about verification, communication, and secure transactions.",
    author: "Security Team",
    date: "Oct 18, 2025",
    category: "Safety",
    image: "🔒",
  },
];

export default function BlogPage() {
  return (
    <div>
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Swappio Blog</h1>
            <p className="text-xl text-muted-foreground">
              Tips, stories, and updates from the Swappio community
            </p>
          </div>

          {/* Featured Post */}
          {blogPosts.length > 0 && (
            <div className="mb-12 bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-8">
                <div className="text-4xl mb-4">{blogPosts[0].image}</div>
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                  {blogPosts[0].category}
                </span>
                <h2 className="text-3xl font-bold mb-4">
                  {blogPosts[0].title}
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {blogPosts[0].author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {blogPosts[0].date}
                  </span>
                </div>
                <Button>
                  Read More <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(1).map((post) => (
              <div
                key={post.id}
                className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-colors"
              >
                <div className="p-6">
                  <div className="text-4xl mb-4">{post.image}</div>
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium mb-4">
                    {post.category}
                  </span>
                  <h3 className="font-bold text-lg mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                  </div>
                  <Button variant="ghost" className="w-full">
                    Read More <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Subscribe to Our Blog</h3>
            <p className="text-muted-foreground mb-6">
              Get the latest tips, stories, and updates delivered to your inbox
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background"
              />
              <Button>Subscribe</Button>
            </div>
          </div>

          <div className="mt-12 flex gap-4">
            <Button asChild>
              <Link href="/">
                <ArrowRight className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
