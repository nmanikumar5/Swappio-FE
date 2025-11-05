"use client";

import Link from "next/link";
import { Shield, Users, Zap, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <div>
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">About Swappio</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Empowering secure item exchanges and building community through
            trust.
          </p>

          <div className="space-y-12">
            {/* Mission */}
            <section>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-4">
                At Swappio, we believe everyone should have access to a trusted
                platform for exchanging items and building meaningful
                connections. We're committed to making peer-to-peer trading
                secure, simple, and enjoyable for everyone.
              </p>
              <p className="text-lg text-muted-foreground">
                Our goal is to reduce waste, promote sustainability, and create
                a vibrant community where people can trade, share, and discover
                new items.
              </p>
            </section>

            {/* Values */}
            <section>
              <h2 className="text-3xl font-bold mb-6">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <Shield className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        Trust & Safety
                      </h3>
                      <p className="text-muted-foreground">
                        We prioritize user safety through verification, secure
                        payment, and dispute resolution.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <Users className="h-8 w-8 text-secondary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        Community First
                      </h3>
                      <p className="text-muted-foreground">
                        We build features based on community feedback and foster
                        meaningful connections.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <Zap className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Innovation</h3>
                      <p className="text-muted-foreground">
                        We continuously improve our platform with cutting-edge
                        technology and features.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <Heart className="h-8 w-8 text-destructive flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        Sustainability
                      </h3>
                      <p className="text-muted-foreground">
                        We promote environmental responsibility through item
                        reuse and circulation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Story */}
            <section>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Swappio was founded with a simple idea: what if there was a
                better way to trade items with others? We noticed that so many
                valuable items go to waste because people don't have a safe,
                convenient way to exchange them.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                We started Swappio to solve this problem. Today, we serve
                thousands of users across the globe who are discovering,
                trading, and building relationships through our platform.
              </p>
              <p className="text-lg text-muted-foreground">
                Every day, we work to make trading easier, safer, and more
                rewarding for our community members.
              </p>
            </section>

            {/* Stats */}
            <section>
              <h2 className="text-3xl font-bold mb-6">By The Numbers</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    10K+
                  </div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">
                    50K+
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Successful Trades
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-accent mb-2">
                    $5M+
                  </div>
                  <p className="text-sm text-muted-foreground">Items Traded</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-purple-500 mb-2">
                    150+
                  </div>
                  <p className="text-sm text-muted-foreground">Countries</p>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-12 flex gap-4">
            <Button asChild>
              <Link href="/">
                <ArrowRight className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
