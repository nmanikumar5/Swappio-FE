"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  sendPhoneVerificationCode,
  verifyPhoneCode,
  fetchProfile,
} from "@/services/auth";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { showToast } from "@/components/ui/toast";
import Spinner from "@/components/ui/Spinner";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import PhoneInput from "@/components/ui/phone-input";

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  // UI state
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast({
        type: "error",
        title: "Name required",
        description: "Please enter your name",
      });
      return;
    }

    if (!phone.trim()) {
      showToast({
        type: "error",
        title: "Phone required",
        description: "Please enter your phone number",
      });
      return;
    }

    setLoading(true);
    try {
      await sendPhoneVerificationCode(phone);
      showToast({
        type: "success",
        title: "OTP sent",
        description: `Verification code sent to ${phone}`,
      });
      setStep("otp");

      // Start 60 second countdown
      setCountdown(60);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as Record<string, unknown>).message)
          : "Failed to send OTP";
      showToast({
        type: "error",
        title: "Failed to send OTP",
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and create account
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      showToast({
        type: "error",
        title: "OTP required",
        description: "Please enter the verification code",
      });
      return;
    }

    setLoading(true);
    try {
      await verifyPhoneCode(phone, code, name);

      // Fetch user profile
      const user = await fetchProfile();
      setUser(user, null);
      try {
        useUserStore.getState().setUser?.(user);
      } catch {}

      showToast({
        type: "success",
        title: "Account created",
        description: "Welcome to Swappio!",
      });
      router.push("/");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as Record<string, unknown>).message)
          : "Verification failed";
      showToast({
        type: "error",
        title: "Verification failed",
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setLoading(true);
    try {
      await sendPhoneVerificationCode(phone);
      showToast({
        type: "success",
        title: "OTP resent",
        description: "New verification code sent",
      });

      // Restart countdown
      setCountdown(60);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as Record<string, unknown>).message)
          : "Failed to resend OTP";
      showToast({
        type: "error",
        title: "Failed to resend OTP",
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">
            {step === "phone" ? "Create Account" : "Verify Phone Number"}
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            {step === "phone"
              ? "Sign up with your phone number"
              : `Enter the code sent to ${phone}`}
          </p>
        </CardHeader>
        <CardContent>
          {step === "phone" ? (
            // Step 1: Phone Number Input
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <PhoneInput
                  id="phone"
                  value={phone}
                  onChange={setPhone}
                  placeholder="98765 43210"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Select your country code and enter your phone number
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner />
                    <span>Sending OTP...</span>
                  </div>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>
          ) : (
            // Step 2: OTP Verification
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                  <Input
                    id="code"
                    type="text"
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter the 6-digit code sent to your phone
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Verify & Create Account"
                )}
              </Button>

              <div className="flex items-center justify-between text-sm">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStep("phone");
                    setCode("");
                  }}
                >
                  Change Number
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResendOTP}
                  disabled={countdown > 0 || loading}
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                </Button>
              </div>
            </form>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Link href="/auth/signin">
              <Button variant="outline" className="w-full">
                Sign In Instead
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link
              href="/terms"
              className="font-medium text-primary hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-medium text-primary hover:underline"
            >
              Privacy Policy
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
