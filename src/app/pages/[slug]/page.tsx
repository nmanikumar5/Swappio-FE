"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import Footer from "@/components/layout/Footer";

interface PageData {
  _id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  isPublished: boolean;
}

export default function DynamicPageComponent() {
  const params = useParams();
  const slug = params?.slug as string;
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

        const response = await fetch(`${API_URL}/pages/${slug}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Page not found");
          } else {
            setError("Failed to load page");
          }
          return;
        }

        const data = await response.json();
        setPage(data.data);
      } catch (err) {
        console.error("Error fetching page:", err);
        setError("Failed to load page");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPage();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>
          <p className="text-muted-foreground mb-4">
            {error || "The page you're looking for doesn't exist"}
          </p>
          <Link href="/" className="text-primary hover:underline">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
          <p className="text-lg text-muted-foreground mb-8">
            {page.description}
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
