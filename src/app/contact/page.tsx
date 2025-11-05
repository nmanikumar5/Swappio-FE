"use client";

import React from "react";
import { ChevronRight, Home, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/contact/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to submit contact form");
      }

      const result = await response.json();
      toast.success(
        result.message ||
          "Thank you for your message! We'll get back to you soon."
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit contact form. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-primary font-semibold">Contact Us</span>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Contact Us
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a question? We&apos;d love to hear from you. Send us a message
            and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Email */}
            <div className="p-6 border border-border/50 rounded-lg hover:border-primary/50 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Email</h3>
              </div>
              <a
                href="mailto:support@swappio.com"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                support@swappio.com
              </a>
              <p className="text-xs text-muted-foreground mt-2">
                Response time: Within 24 hours
              </p>
            </div>

            {/* Phone */}
            <div className="p-6 border border-border/50 rounded-lg hover:border-primary/50 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Phone className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground">Phone</h3>
              </div>
              <a
                href="tel:+1234567890"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                +1 (234) 567-8900
              </a>
              <p className="text-xs text-muted-foreground mt-2">
                Mon-Fri, 9AM-6PM PST
              </p>
            </div>

            {/* Address */}
            <div className="p-6 border border-border/50 rounded-lg hover:border-primary/50 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground">Address</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                San Francisco, CA 94105
                <br />
                United States
              </p>
            </div>

            {/* Response Time Info */}
            <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> For urgent issues, please call us during
                business hours.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-6 border border-border/50 rounded-lg bg-gradient-to-br from-muted/30 to-background"
            >
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 rounded-lg border-2 bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus-visible:outline-none transition-all ${
                    errors.name
                      ? "border-destructive focus:border-destructive"
                      : "border-border focus:border-primary"
                  }`}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 rounded-lg border-2 bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus-visible:outline-none transition-all ${
                    errors.email
                      ? "border-destructive focus:border-destructive"
                      : "border-border focus:border-primary"
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 rounded-lg border-2 bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus-visible:outline-none transition-all ${
                    errors.subject
                      ? "border-destructive focus:border-destructive"
                      : "border-border focus:border-primary"
                  }`}
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="report">Report a Problem</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">Partnership</option>
                </select>
                {errors.subject && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.subject}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className={`w-full px-4 py-2 rounded-lg border-2 bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus-visible:outline-none transition-all resize-none ${
                    errors.message
                      ? "border-destructive focus:border-destructive"
                      : "border-border focus:border-primary"
                  }`}
                  placeholder="Tell us how we can help..."
                />
                {errors.message && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold h-10 transition-all"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-lg text-center">
          <p className="text-muted-foreground mb-4">
            Can&apos;t find what you&apos;re looking for?
          </p>
          <Link href="/help">
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              Visit Help Center & FAQs
            </Button>
          </Link>
        </div>

        {/* Action button */}
        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline">← Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
