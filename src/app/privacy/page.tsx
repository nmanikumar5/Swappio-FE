"use client";

import React from "react";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-primary font-semibold">Privacy Policy</span>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-3xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content sections */}
        <article className="prose prose-sm dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              1. Introduction
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              At Swappio, we are committed to protecting your privacy. This
              Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our marketplace platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              2. Information We Collect
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We collect information you provide directly to us, such as:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
              <li>Account registration information (name, email, phone)</li>
              <li>Profile information and preferences</li>
              <li>Payment and billing information</li>
              <li>Messages and communications</li>
              <li>Photos and descriptions of items</li>
              <li>Location data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              3. How We Use Your Information
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
              <li>Provide and improve our services</li>
              <li>Process transactions</li>
              <li>Send promotional emails and updates</li>
              <li>Prevent fraud and maintain security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              4. Information Sharing
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell your personal information. We may share information
              with service providers, legal authorities when required, and other
              parties as necessary to operate our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              5. Data Security
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational measures to
              protect your personal information. However, no method of
              transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              6. Your Rights
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You have the right to access, correct, or delete your personal
              information. Contact us at support@swappio.com for requests.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              7. Contact Us
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy, please contact us
              at:
            </p>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Email: support@swappio.com
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Address: San Francisco, CA 94105, USA
              </p>
            </div>
          </section>
        </article>

        {/* Action buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link href="/">
            <Button variant="outline">← Back to Home</Button>
          </Link>
          <Link href="/contact">
            <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
              Have Questions? Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
