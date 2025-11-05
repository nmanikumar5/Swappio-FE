"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Heart,
  Shield,
  TrendingUp,
  Loader2,
} from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterConfig {
  sections: FooterSection[];
  brandName: string;
  brandDescription: string;
  contactEmail: string;
  contactPhone: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

const Footer: React.FC = () => {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const [footerConfig, setFooterConfig] = useState<FooterConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooterConfig = async () => {
      try {
        setLoading(true);
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
        const response = await fetch(`${API_URL}/footer/config`);

        if (!response.ok) {
          throw new Error("Failed to fetch footer configuration");
        }

        const response_data = await response.json();
        // Handle response structure: { success: true, data: {...} }
        const footerData = response_data?.data || response_data;
        setFooterConfig(footerData);
      } catch (err) {
        console.error("Error fetching footer config:", err);
        setFooterConfig({
          sections: [
            {
              title: "Platform",
              links: [
                { label: "Browse Listings", href: "/" },
                { label: "Post an Ad", href: "/post-ad" },
                { label: "My Dashboard", href: "/dashboard" },
                { label: "Pricing Plans", href: "/plans" },
              ],
            },
            {
              title: "User",
              links: [
                { label: "My Favorites", href: "/favorites" },
                { label: "Messages", href: "/chat" },
                { label: "Profile Settings", href: "/dashboard/profile" },
              ],
            },
            {
              title: "Support",
              links: [
                { label: "Help Center", href: "/help" },
                { label: "Contact Us", href: "/contact" },
                { label: "Safety Tips", href: "/safety" },
                { label: "Report Problem", href: "/contact?subject=report" },
              ],
            },
            {
              title: "Legal",
              links: [
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Security", href: "/security" },
              ],
            },
          ],
          brandName: "Swappio",
          brandDescription:
            "Your trusted platform for secure item exchanges and swaps.",
          contactEmail: "support@swappio.com",
          contactPhone: "+1 (234) 567-8900",
          socialLinks: {
            facebook: "https://facebook.com/swappio",
            twitter: "https://twitter.com/swappio",
            instagram: "https://instagram.com/swappio",
            linkedin: "https://linkedin.com/company/swappio",
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFooterConfig();
  }, []);

  const isAuthPage =
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/admin/") ||
    pathname === "/admin";

  if (isAuthPage) {
    return null;
  }

  if (loading) {
    return (
      <footer className="border-t border-border/50 bg-gradient-to-b from-background to-muted/20 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </footer>
    );
  }

  if (!footerConfig) {
    return null;
  }

  return (
    <footer className="border-t border-border/50 bg-gradient-to-b from-background to-muted/20 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 mb-8">
          <div className="lg:col-span-1">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
              {footerConfig.brandName}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-3">
              {footerConfig.brandDescription}
            </p>

            <div className="space-y-2 mb-4">
              {footerConfig.contactEmail && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <a href={`mailto:${footerConfig.contactEmail}`}>
                    {footerConfig.contactEmail}
                  </a>
                </div>
              )}
              {footerConfig.contactPhone && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <a href={`tel:${footerConfig.contactPhone}`}>
                    {footerConfig.contactPhone}
                  </a>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              {footerConfig.socialLinks?.facebook && (
                <a
                  href={footerConfig.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {footerConfig.socialLinks?.twitter && (
                <a
                  href={footerConfig.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {footerConfig.socialLinks?.instagram && (
                <a
                  href={footerConfig.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {footerConfig.socialLinks?.linkedin && (
                <a
                  href={footerConfig.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {Array.isArray(footerConfig.sections) &&
          footerConfig.sections.length > 0 ? (
            footerConfig.sections.map((section) => (
              <div key={section.title} className="min-h-[100px]">
                <h3 className="font-semibold text-foreground mb-3 text-sm sm:text-base">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {Array.isArray(section.links) && section.links.length > 0 ? (
                    section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-muted-foreground/50">
                      No links
                    </li>
                  )}
                </ul>
              </div>
            ))
          ) : (
            <div className="text-xs text-muted-foreground/50">
              No sections available
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 py-6 border-y border-border/30">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <div className="text-xs sm:text-sm">
              <p className="font-semibold text-foreground">Secure Trading</p>
              <p className="text-muted-foreground">Verified users & payments</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-secondary flex-shrink-0" />
            <div className="text-xs sm:text-sm">
              <p className="font-semibold text-foreground">Fair Pricing</p>
              <p className="text-muted-foreground">Market-driven prices</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-accent flex-shrink-0" />
            <div className="text-xs sm:text-sm">
              <p className="font-semibold text-foreground">Community First</p>
              <p className="text-muted-foreground">Trusted by thousands</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border/30 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>
              © {currentYear} {footerConfig.brandName}. All rights reserved.
              Made with <span className="text-accent inline-block">♡</span>
            </p>

            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <Link
                href="/privacy"
                className="hover:text-primary transition-colors"
              >
                Privacy
              </Link>
              <span className="text-border/50">•</span>
              <Link
                href="/terms"
                className="hover:text-primary transition-colors"
              >
                Terms
              </Link>
              <span className="text-border/50">•</span>
              <Link
                href="/security"
                className="hover:text-primary transition-colors"
              >
                Security
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
