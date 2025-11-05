"use client";

import { useEffect } from "react";

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
  style?: React.CSSProperties;
  className?: string;
  fullWidthResponsive?: boolean;
}

/**
 * Google AdSense Component
 *
 * Usage:
 * <AdSenseAd
 *   adSlot="1234567890"
 *   adFormat="auto"
 *   fullWidthResponsive={true}
 * />
 *
 * Make sure to add the AdSense script in your layout.tsx:
 * <script
 *   async
 *   src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
 *   crossOrigin="anonymous"
 * />
 */
export default function AdSenseAd({
  adSlot,
  adFormat = "auto",
  style = { display: "block" },
  className = "",
  fullWidthResponsive = true,
}: AdSenseAdProps) {
  useEffect(() => {
    try {
      // Push ad to AdSense
      if (typeof window !== "undefined" && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  // Don't show ads in development
  if (
    process.env.NODE_ENV === "development" ||
    !process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID
  ) {
    return (
      <div
        className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center ${className}`}
        style={{
          minHeight: "250px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="text-gray-500">
          <p className="font-semibold">Ad Space</p>
          <p className="text-sm">
            Google AdSense will appear here in production
          </p>
        </div>
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
    />
  );
}

// Declare global adsbygoogle
declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}
