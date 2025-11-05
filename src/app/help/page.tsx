"use client";

import React from "react";
import {
  ChevronRight,
  Home,
  HelpCircle,
  MessageCircle,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HelpPage() {
  const faqs = [
    {
      category: "Getting Started",
      items: [
        {
          q: "How do I create an account?",
          a: "Click the Sign Up button and fill in your details. Verify your email and you're ready to go!",
        },
        {
          q: "How do I post an item for sale?",
          a: "Navigate to 'Post Ad' from the menu, fill in item details, upload photos, set a price, and publish.",
        },
      ],
    },
    {
      category: "Trading",
      items: [
        {
          q: "How do I make an offer on an item?",
          a: "Click on an item, review details, and use the messaging feature to negotiate with the seller.",
        },
        {
          q: "Is it safe to trade on Swappio?",
          a: "Yes! We verify users, provide secure messaging, and offer dispute resolution for added safety.",
        },
      ],
    },
    {
      category: "Payments",
      items: [
        {
          q: "What payment methods are accepted?",
          a: "We accept credit/debit cards, PayPal, and bank transfers. All payments are secured and encrypted.",
        },
        {
          q: "Are there transaction fees?",
          a: "Yes, a small fee applies to each transaction to maintain our platform and security services.",
        },
      ],
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
          <span className="text-primary font-semibold">Help Center</span>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Help Center
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions and learn how to get the most out
            of Swappio
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <Link href="/contact">
            <div className="p-4 border border-border/50 rounded-lg hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
              <Mail className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold text-foreground">Contact Support</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Get in touch with our support team
              </p>
            </div>
          </Link>
          <Link href="/faqs">
            <div className="p-4 border border-border/50 rounded-lg hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
              <HelpCircle className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold text-foreground">FAQs</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Browse frequently asked questions
              </p>
            </div>
          </Link>
          <Link href="/safety">
            <div className="p-4 border border-border/50 rounded-lg hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
              <MessageCircle className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold text-foreground">Safety Tips</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Stay safe while trading
              </p>
            </div>
          </Link>
        </div>

        {/* FAQs by Category */}
        <div className="space-y-8">
          {faqs.map((section, idx) => (
            <section key={idx}>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {section.category}
              </h2>
              <div className="space-y-4">
                {section.items.map((item, itemIdx) => (
                  <details
                    key={itemIdx}
                    className="group p-4 border border-border/50 rounded-lg hover:border-primary/50 transition-all cursor-pointer"
                  >
                    <summary className="flex items-center justify-between font-semibold text-foreground hover:text-primary transition-colors">
                      <span>{item.q}</span>
                      <span className="text-primary group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>
                    <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Action buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline">← Back to Home</Button>
          </Link>
          <Link href="/contact">
            <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
              Still need help? Contact us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
