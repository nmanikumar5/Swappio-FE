"use client";

import Link from "next/link";
import { Download, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";

export default function PressKitPage() {
  return (
    <div>
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">Press Kit</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Official resources for journalists, bloggers, and media partners
          </p>

          <div className="space-y-12">
            {/* Company Overview */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Company Overview</h2>
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">What is Swappio?</h3>
                  <p className="text-muted-foreground">
                    Swappio is a leading peer-to-peer trading platform that
                    empowers users to securely exchange items and build
                    community connections. Founded with a mission to promote
                    sustainability and reduce waste, Swappio serves thousands of
                    active users across 150+ countries.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Our Mission</h3>
                  <p className="text-muted-foreground">
                    To make peer-to-peer trading secure, simple, and enjoyable
                    for everyone, while promoting environmental sustainability
                    through item reuse and circulation.
                  </p>
                </div>
              </div>
            </section>

            {/* Key Facts */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Key Facts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="font-semibold text-primary">10,000+</p>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="font-semibold text-secondary">50,000+</p>
                  <p className="text-sm text-muted-foreground">
                    Successful Trades
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="font-semibold text-accent">$5M+</p>
                  <p className="text-sm text-muted-foreground">
                    Items Traded Value
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="font-semibold text-purple-500">150+</p>
                  <p className="text-sm text-muted-foreground">
                    Countries Served
                  </p>
                </div>
              </div>
            </section>

            {/* Downloadable Assets */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Downloadable Assets</h2>
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Logo Files</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Official Swappio logos in various formats and sizes for
                    media use.
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Logos
                  </Button>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Brand Guidelines</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comprehensive brand guidelines for proper use of Swappio
                    branding.
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Guidelines
                  </Button>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Founder Photos</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    High-resolution photos of our founders for media coverage.
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Photos
                  </Button>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Product Screenshots</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    High-quality screenshots of Swappio&apos;s key features and
                    interface.
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Screenshots
                  </Button>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Company Fact Sheet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    One-page overview with key facts, metrics, and contact
                    information.
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Fact Sheet
                  </Button>
                </div>
              </div>
            </section>

            {/* Recent News */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Recent News</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <p className="font-semibold">
                    Swappio Reaches 10,000 Active Users Milestone
                  </p>
                  <p className="text-sm text-muted-foreground">October 2025</p>
                </div>
                <div className="border-l-4 border-secondary pl-4">
                  <p className="font-semibold">
                    New Features Update: Enhanced Safety Features
                  </p>
                  <p className="text-sm text-muted-foreground">
                    September 2025
                  </p>
                </div>
                <div className="border-l-4 border-accent pl-4">
                  <p className="font-semibold">
                    Swappio Expands to 150+ Countries
                  </p>
                  <p className="text-sm text-muted-foreground">August 2025</p>
                </div>
              </div>
            </section>

            {/* Media Contact */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Media Contact</h2>
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-8">
                <p className="text-muted-foreground mb-4">
                  For press inquiries, interview requests, or media coverage,
                  please contact:
                </p>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <Link
                    href="mailto:press@swappio.com"
                    className="text-primary hover:underline font-semibold"
                  >
                    press@swappio.com
                  </Link>
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
