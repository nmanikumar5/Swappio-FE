"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";

export default function CookiesPage() {
  return (
    <div>
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">What Are Cookies?</h2>
              <p className="text-muted-foreground">
                Cookies are small files stored on your computer or mobile device
                when you visit websites. They help websites remember your
                preferences, improve your experience, and analyze how you use
                the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">How We Use Cookies</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">Essential Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies are necessary for the website to function
                    properly. They enable core functionality such as user
                    authentication and security.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Performance Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies help us understand how visitors use our site
                    by collecting anonymous information about page visits and
                    interactions.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Preference Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies remember your choices to provide a more
                    personalized experience, such as language preferences and
                    display settings.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Marketing Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies track your activity across websites to display
                    relevant advertisements and measure campaign effectiveness.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Managing Cookies</h2>
              <p className="text-muted-foreground">
                You can control cookies through your browser settings. Most
                browsers allow you to refuse cookies or alert you when cookies
                are being sent. Please note that blocking essential cookies may
                affect website functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Third-Party Cookies</h2>
              <p className="text-muted-foreground">
                Some cookies may be set by third parties, such as advertising
                networks and analytics providers. We are not responsible for
                their cookie practices, and we encourage you to review their
                privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">
                Updates to This Policy
              </h2>
              <p className="text-muted-foreground">
                We may update this Cookie Policy from time to time. Changes will
                be effective immediately upon posting. We encourage you to
                review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about our use of cookies, please contact
                us at{" "}
                <Link
                  href="mailto:support@swappio.com"
                  className="text-primary hover:underline"
                >
                  support@swappio.com
                </Link>
              </p>
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
              <Link href="/privacy">View Privacy Policy</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
