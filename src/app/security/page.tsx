"use client";

import React from "react";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-primary font-semibold">Security</span>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-3xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Security & Safety
          </h1>
          <p className="text-muted-foreground">
            Your security is our top priority
          </p>
        </div>

        {/* Content sections */}
        <article className="prose prose-sm dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Our Security Commitment
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              At Swappio, we implement comprehensive security measures to
              protect your personal information, financial data, and
              transactions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Data Encryption
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              All communications between your browser and our servers are
              encrypted using SSL/TLS encryption. We use industry-standard
              encryption protocols to protect sensitive information including
              payment details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Account Protection
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We recommend:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
              <li>Using strong, unique passwords</li>
              <li>Enabling two-factor authentication</li>
              <li>Never sharing your login credentials</li>
              <li>Logging out after each session</li>
              <li>Reporting suspicious activity immediately</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Payment Security
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Swappio partners with trusted payment processors that comply with
              PCI DSS standards. We never store your full credit card
              information on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              User Verification
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We verify user identities through multiple methods including email
              verification, phone verification, and optional ID verification to
              maintain a trustworthy community.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Fraud Prevention
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Our advanced fraud detection systems monitor transactions and user
              behavior to identify and prevent fraudulent activities. All
              suspicious accounts are subject to review.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Dispute Resolution
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If you experience issues with a transaction, our dispute
              resolution team will investigate and work to resolve the matter
              fairly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Reporting Security Issues
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If you discover a security vulnerability, please report it to:
            </p>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground font-semibold">
                security@swappio.com
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Please do not disclose security issues publicly before we have
                had a chance to address them.
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
              Security Concerns? Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
