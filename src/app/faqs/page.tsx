"use client";

import React, { useState } from "react";
import { ChevronRight, Home, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQsPage() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs: FAQItem[] = [
    // Getting Started
    {
      category: "Getting Started",
      question: "How do I create an account?",
      answer:
        "Click the Sign Up button and enter your email, phone number, and password. Verify your email and you're ready to start buying and selling!",
    },
    {
      category: "Getting Started",
      question: "Is there a fee to join Swappio?",
      answer:
        "No, creating an account is completely free. We only charge a small commission on successful sales.",
    },
    {
      category: "Getting Started",
      question: "Do I need to provide ID verification?",
      answer:
        "Basic registration is free without ID verification. However, ID verification increases your credibility and transaction limits.",
    },

    // Posting Items
    {
      category: "Posting Items",
      question: "How do I post an item for sale?",
      answer:
        "Go to 'Post Ad', fill in the item details including title, description, condition, and price. Upload clear photos and set your listing to active.",
    },
    {
      category: "Posting Items",
      question: "What details should I include in my listing?",
      answer:
        "Include a clear title, detailed description, condition (new/like new/good/fair), price, and multiple high-quality photos from different angles.",
    },
    {
      category: "Posting Items",
      question: "How many photos can I upload?",
      answer:
        "You can upload up to 10 high-quality photos per listing. We recommend at least 4-5 photos for better visibility.",
    },
    {
      category: "Posting Items",
      question: "How long does my listing stay active?",
      answer:
        "Listings remain active for 60 days. You can renew them for free or manually edit and repost listings.",
    },

    // Buying
    {
      category: "Buying",
      question: "How do I make an offer on an item?",
      answer:
        "Click on an item and use the messaging feature to negotiate with the seller. Agree on price and meeting location through the chat.",
    },
    {
      category: "Buying",
      question: "Can I make an offer lower than the asking price?",
      answer:
        "Yes! Use the messaging system to negotiate. Many sellers are open to reasonable offers.",
    },
    {
      category: "Buying",
      question: "Is it safe to buy on Swappio?",
      answer:
        "Yes. We verify users, provide secure messaging, escrow payments, and dispute resolution to keep you safe.",
    },

    // Payments
    {
      category: "Payments",
      question: "What payment methods do you accept?",
      answer:
        "We accept credit cards, debit cards, PayPal, and bank transfers. All payments are encrypted and secure.",
    },
    {
      category: "Payments",
      question: "How much does Swappio charge in fees?",
      answer:
        "We charge a 5-8% commission on the final sale price, depending on the category. This helps us maintain the platform.",
    },
    {
      category: "Payments",
      question: "How do I get paid as a seller?",
      answer:
        "After a successful transaction, your earnings are transferred to your linked bank account within 3-5 business days.",
    },

    // Disputes & Returns
    {
      category: "Disputes & Returns",
      question: "What if I don't receive the item?",
      answer:
        "Contact our support team immediately. We have a dispute resolution process and can help you recover your money if the seller doesn't deliver.",
    },
    {
      category: "Disputes & Returns",
      question: "Can I return an item?",
      answer:
        "Returns depend on the seller's policy. Discuss this before making the purchase. Most items are non-refundable unless there's a dispute.",
    },
    {
      category: "Disputes & Returns",
      question: "How long does dispute resolution take?",
      answer:
        "Our team typically resolves disputes within 5-7 business days. We review evidence and documentation from both parties.",
    },

    // Account & Security
    {
      category: "Account & Security",
      question: "How do I change my password?",
      answer:
        "Go to Account Settings, click 'Change Password', enter your current password and new password, then save.",
    },
    {
      category: "Account & Security",
      question: "What should I do if my account is compromised?",
      answer:
        "Change your password immediately and contact our support team. We can help secure your account and review any suspicious activity.",
    },
    {
      category: "Account & Security",
      question: "Can I delete my account?",
      answer:
        "Yes. Go to Account Settings and click 'Delete Account'. This will remove all your data permanently.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-primary font-semibold">FAQs</span>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-3xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground mb-6">
            Find answers to the most common questions about Swappio
          </p>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-2 border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus-visible:outline-none"
            />
          </div>
        </div>

        {/* FAQs by Category */}
        {categories.map((category) => {
          const categoryFaqs = filteredFaqs.filter(
            (f) => f.category === category
          );
          if (categoryFaqs.length === 0) return null;

          return (
            <div key={category} className="mb-8">
              <h2 className="text-xl font-bold text-foreground mb-4">
                {category}
              </h2>
              <div className="space-y-3">
                {categoryFaqs.map((faq) => {
                  const globalIdx = faqs.indexOf(faq);
                  const isExpanded = expandedIdx === globalIdx;

                  return (
                    <button
                      key={globalIdx}
                      onClick={() =>
                        setExpandedIdx(isExpanded ? null : globalIdx)
                      }
                      className="w-full text-left p-4 border border-border/50 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span
                          className={`font-semibold transition-colors ${
                            isExpanded
                              ? "text-primary"
                              : "text-foreground group-hover:text-primary"
                          }`}
                        >
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 flex-shrink-0 text-primary transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {isExpanded && (
                        <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No questions found matching your search.
            </p>
            <Link href="/contact">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                Contact Support
              </Button>
            </Link>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline">← Back to Home</Button>
          </Link>
          <Link href="/contact">
            <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
              Still have questions? Contact us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
