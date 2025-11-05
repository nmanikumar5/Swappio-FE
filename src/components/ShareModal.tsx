"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Facebook,
  Twitter,
  Mail,
  Copy,
  Check,
  MessageCircle,
} from "lucide-react";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  url: string;
}

export default function ShareModal({
  open,
  onOpenChange,
  title,
  description,
  url,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareText = description
    ? `${title} - ${description.substring(0, 100)}${
        description.length > 100 ? "..." : ""
      }`
    : title;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Handle error silently or show a notification if needed
    }
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(`Check out this ad: ${shareText}\n${url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareViaFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
    window.open(fbUrl, "_blank", "width=600,height=400");
  };

  const shareViaTwitter = () => {
    const text = encodeURIComponent(shareText);
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${text}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out: ${title}`);
    const body = encodeURIComponent(
      `I found this interesting ad on Swappio:\n\n${title}\n${
        description ? description + "\n\n" : ""
      }${url}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gradient">
            Share This Ad
          </DialogTitle>
          <DialogDescription>
            Share this listing with your friends and family
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Social Media Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {/* WhatsApp */}
            <Button
              variant="outline"
              className="flex flex-col h-auto py-4 gap-2 hover:bg-[#25D366]/10 hover:border-[#25D366]/50 transition-all group"
              onClick={shareViaWhatsApp}
            >
              <div className="h-10 w-10 rounded-full bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors">
                <MessageCircle className="h-5 w-5 text-[#25D366]" />
              </div>
              <span className="text-sm font-semibold">WhatsApp</span>
            </Button>

            {/* Facebook */}
            <Button
              variant="outline"
              className="flex flex-col h-auto py-4 gap-2 hover:bg-[#1877F2]/10 hover:border-[#1877F2]/50 transition-all group"
              onClick={shareViaFacebook}
            >
              <div className="h-10 w-10 rounded-full bg-[#1877F2]/10 flex items-center justify-center group-hover:bg-[#1877F2]/20 transition-colors">
                <Facebook className="h-5 w-5 text-[#1877F2]" />
              </div>
              <span className="text-sm font-semibold">Facebook</span>
            </Button>

            {/* Twitter */}
            <Button
              variant="outline"
              className="flex flex-col h-auto py-4 gap-2 hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2]/50 transition-all group"
              onClick={shareViaTwitter}
            >
              <div className="h-10 w-10 rounded-full bg-[#1DA1F2]/10 flex items-center justify-center group-hover:bg-[#1DA1F2]/20 transition-colors">
                <Twitter className="h-5 w-5 text-[#1DA1F2]" />
              </div>
              <span className="text-sm font-semibold">Twitter</span>
            </Button>

            {/* Email */}
            <Button
              variant="outline"
              className="flex flex-col h-auto py-4 gap-2 hover:bg-accent/10 hover:border-accent/50 transition-all group"
              onClick={shareViaEmail}
            >
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Mail className="h-5 w-5 text-accent" />
              </div>
              <span className="text-sm font-semibold">Email</span>
            </Button>
          </div>

          {/* Copy Link */}
          <div className="pt-2 border-t border-border/50">
            <p className="text-sm font-semibold mb-2">Or copy link</p>
            <div className="flex gap-2">
              <Input
                value={url}
                readOnly
                className="flex-1 bg-muted/50 cursor-text select-all"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                onClick={handleCopyLink}
                className={`min-w-[100px] transition-all ${
                  copied
                    ? "bg-success hover:bg-success/90"
                    : "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
