import { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export default async function Head({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const id = params.id;
  try {
    const revalidateSecs = parseInt(
      process.env.NEXT_METADATA_REVALIDATE_SECONDS || "60"
    );
    const res = await fetch(`${API_URL}/listings/${encodeURIComponent(id)}`, {
      next: { revalidate: revalidateSecs } as { revalidate: number },
    });
    if (!res.ok) {
      return { title: "Listing — Swappio", description: "Listing details" };
    }
    const body = await res.json().catch(() => null);
    const listing = body?.data?.listing;
    if (!listing)
      return { title: "Listing — Swappio", description: "Listing details" };

    const title = `${listing.title} — Swappio`;
    const desc = listing.description
      ? listing.description.slice(0, 160)
      : "View listing details on Swappio.";
    return { title, description: desc } as Metadata;
  } catch {
    return { title: "Listing — Swappio", description: "Listing details" };
  }
}
