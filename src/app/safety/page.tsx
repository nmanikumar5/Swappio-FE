"use client";

import React from "react";
import { ChevronRight, Home, Shield, AlertCircle, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SafetyPage() {
  const tips = [
    {
      icon: Shield,
      title: "Verify Users",
      description:
        "Check user profiles, ratings, and reviews before making a transaction. Trust verified badges.",
    },
    {
      icon: AlertCircle,
      title: "Inspect Items",
      description:
        "Always inspect items in person before completing the purchase. Test electronics and check condition.",
    },
    {
      icon: Users,
      title: "Meet Safely",
      description:
        "Meet in public places, bring a friend, and inform someone of your location. Use our messaging system.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-primary font-semibold">Safety Tips</span>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-3xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Safety Tips & Best Practices
          </h1>
          <p className="text-muted-foreground">
            Learn how to stay safe while buying and selling on Swappio
          </p>
        </div>

        {/* Main Tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {tips.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <div
                key={idx}
                className="p-6 border border-border/50 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <Icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">
                  {tip.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {tip.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Detailed Sections */}
        <article className="prose prose-sm dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Before You Trade
            </h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Review the seller&apos;s profile and trading history</li>
              <li>Read all item descriptions and examine photos carefully</li>
              <li>Ask clarifying questions through the messaging system</li>
              <li>Agree on a meeting location and time</li>
              <li>
                Trust your instincts - if something feels off, it probably is
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Payment Safety
            </h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Never wire money or pay through untraceable methods</li>
              <li>Use Swappio&apos;s secure payment system only</li>
              <li>
                Don&apos;t share your payment information outside the platform
              </li>
              <li>Verify payment before handing over the item</li>
              <li>Keep payment receipts and transaction records</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              During the Transaction
            </h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Meet in a public location during daylight hours</li>
              <li>Bring a trusted friend or family member with you</li>
              <li>Share your location with someone you trust</li>
              <li>Test the item thoroughly before making payment</li>
              <li>Document the condition of the item with photos or video</li>
              <li>Complete the transaction within the messaging system</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Red Flags to Watch For
            </h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Unusually low prices or too-good-to-be-true offers</li>
              <li>Sellers who refuse to meet in person or use the platform</li>
              <li>Requests to pay through external payment methods</li>
              <li>Pressure to complete the transaction quickly</li>
              <li>Grammatical errors or suspicious communication patterns</li>
              <li>Users with no trading history or bad reviews</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Reporting Issues
            </h2>
            <p className="text-muted-foreground">
              If you experience any problems or suspicious activity:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
              <li>Report the user immediately through the platform</li>
              <li>Contact our support team at support@swappio.com</li>
              <li>Save all communication records and evidence</li>
              <li>File a dispute if necessary</li>
              <li>Report fraud to local authorities if needed</li>
            </ul>
          </section>
        </article>

        {/* Action buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline">← Back to Home</Button>
          </Link>
          <Link href="/contact">
            <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
              Report a Safety Issue
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
