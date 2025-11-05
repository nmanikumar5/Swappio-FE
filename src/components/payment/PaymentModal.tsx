"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  CreditCard,
  Star,
  Zap,
  Crown,
  Check,
  AlertCircle,
} from "lucide-react";

interface PaymentOption {
  id: string;
  name: string;
  price: number;
  duration: number; // days
  icon: React.ReactNode;
  features: string[];
  recommended?: boolean;
  color: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (paymentData: {
    orderId: string;
    paymentId: string;
    priorityLevel?: string;
    duration?: number;
  }) => void;
  quotaInfo?: {
    freeAdsRemaining: number;
    freeAdsQuota: number;
    freeAdsUsed: number;
  };
}

const paymentOptions: PaymentOption[] = [
  {
    id: "single-ad",
    name: "Single Ad",
    price: 49,
    duration: 30,
    icon: <CreditCard className="h-6 w-6" />,
    features: [
      "Post 1 additional ad",
      "Valid for 30 days",
      "Standard visibility",
    ],
    color: "from-gray-500 to-gray-600",
  },
  {
    id: "featured",
    name: "Featured",
    price: 99,
    duration: 7,
    icon: <Star className="h-6 w-6" />,
    features: [
      "Highlighted in listings",
      "2x visibility",
      "Featured badge",
      "Valid for 7 days",
    ],
    recommended: true,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "premium",
    name: "Premium",
    price: 199,
    duration: 15,
    icon: <Zap className="h-6 w-6" />,
    features: [
      "Top of search results",
      "5x visibility",
      "Premium badge",
      "Valid for 15 days",
    ],
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "platinum",
    name: "Platinum",
    price: 399,
    duration: 30,
    icon: <Crown className="h-6 w-6" />,
    features: [
      "Always on top",
      "10x visibility",
      "Platinum badge",
      "Featured homepage",
      "Valid for 30 days",
    ],
    color: "from-amber-500 to-amber-600",
  },
];

export default function PaymentModal({
  isOpen,
  onClose,
  onPaymentSuccess,
  quotaInfo,
}: PaymentModalProps) {
  const [selectedOption, setSelectedOption] = useState<string>("featured");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!isOpen) return null;

  const selected = paymentOptions.find((opt) => opt.id === selectedOption);

  const handlePayment = async () => {
    if (!selected) return;

    setLoading(true);

    try {
      // Create order on backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("swappio_token")}`,
          },
          body: JSON.stringify({
            type:
              selectedOption === "single-ad"
                ? "additional_ad"
                : "listing_priority",
            priorityLevel:
              selectedOption !== "single-ad" ? selectedOption : undefined,
            amount: selected.price,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const { orderId, amount, currency } = await response.json();

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: amount,
        currency: currency,
        name: "Swappio",
        description: `${selected.name} - ${selected.duration} days`,
        order_id: orderId,
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/payments/verify`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem(
                    "swappio_token"
                  )}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed");
            }

            const paymentData = await verifyResponse.json();
            onPaymentSuccess({
              ...paymentData,
              priorityLevel:
                selectedOption !== "single-ad" ? selectedOption : undefined,
              duration: selected.duration,
            });
          } catch (error) {
            console.error("Payment verification error:", error);
            alert("Payment verification failed. Please contact support.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#3b82f6",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b z-10 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Upgrade Your Ad
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Choose a plan to continue posting your ad
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quota Info */}
          {quotaInfo && (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-100">
                  Free Quota Exhausted
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-200 mt-1">
                  You&apos;ve used {quotaInfo.freeAdsUsed} of{" "}
                  {quotaInfo.freeAdsQuota} free ads this month. Choose a payment
                  option to continue.
                </p>
              </div>
            </div>
          )}

          {/* Payment Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentOptions.map((option) => {
              const isSelected = selectedOption === option.id;
              return (
                <Card
                  key={option.id}
                  className={`cursor-pointer transition-all hover:shadow-lg relative ${
                    isSelected
                      ? "border-2 border-primary shadow-xl scale-105"
                      : "border-2 border-transparent hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedOption(option.id)}
                >
                  {option.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg">
                        Recommended
                      </Badge>
                    </div>
                  )}
                  <CardHeader
                    className={`bg-gradient-to-r ${option.color} text-white rounded-t-lg`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {option.icon}
                        <CardTitle className="text-xl">{option.name}</CardTitle>
                      </div>
                      {isSelected && (
                        <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">
                        ₹{option.price}
                      </span>
                      <span className="text-sm opacity-90 ml-2">
                        / {option.duration} days
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {option.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {selected && (
                <>
                  Total:{" "}
                  <span className="text-2xl font-bold text-foreground ml-2">
                    ₹{selected.price}
                  </span>
                </>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                disabled={loading || !selected}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 min-w-[140px]"
              >
                {loading ? "Processing..." : `Pay ₹${selected?.price || 0}`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
