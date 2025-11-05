"use client";

import React from "react";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-primary font-semibold">Terms of Service</span>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-3xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content sections */}
        <article className="prose prose-sm dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using Swappio, you accept and agree to be bound
              by the terms and provision of this agreement. If you do not agree
              to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              2. Use License
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Permission is granted to temporarily download one copy of the
              materials (information or software) on Swappio for personal,
              non-commercial transitory viewing only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              3. Disclaimer
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The materials on Swappio are provided on an &quot;as is&quot;
              basis. Swappio makes no warranties, expressed or implied, and
              hereby disclaims and negates all other warranties including,
              without limitation, implied warranties or conditions of
              merchantability, fitness for a particular purpose, or
              non-infringement of intellectual property.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              4. Limitations
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall Swappio or its suppliers be liable for any
              damages (including, without limitation, damages for loss of data
              or profit, or due to business interruption) arising out of the use
              or inability to use the materials on Swappio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              5. Accuracy of Materials
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The materials appearing on Swappio could include technical,
              typographical, or photographic errors. Swappio does not warrant
              that any of the materials on our site are accurate, complete, or
              current.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              6. User Conduct
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
              <li>Engage in fraudulent or deceptive practices</li>
              <li>Post prohibited, offensive, or illegal content</li>
              <li>Violate intellectual property rights</li>
              <li>Harass or abuse other users</li>
              <li>Attempt to gain unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              7. Modifications
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Swappio may revise these terms of service for our website at any
              time without notice. By using this website you are agreeing to be
              bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              8. Governing Law
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              These terms and conditions are governed by and construed in
              accordance with the laws of the United States, and you irrevocably
              submit to the exclusive jurisdiction of the courts located in that
              state or location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              9. Contact Information
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Email: legal@swappio.com
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
              Questions? Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
