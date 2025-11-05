"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, ArrowLeft } from "lucide-react";
import { sendPhoneVerificationCode, verifyPhoneCode } from "@/services/auth";
import { useAuthStore } from "@/stores/authStore";
import { showToast } from "@/components/ui/toast";
import Spinner from "@/components/ui/Spinner";

export default function PhoneLoginPage() {
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [expiresIn, setExpiresIn] = useState(0);
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await sendPhoneVerificationCode(phone);
      setExpiresIn(result.expiresIn);
      setStep("code");
      showToast({
        type: "success",
        title: "Code sent!",
        description: `Verification code sent to ${phone}`,
      });
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as Record<string, unknown>).message)
          : "Failed to send code";
      showToast({ type: "error", title: "Error", description: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await verifyPhoneCode(phone, code, name);
      setUser(result.user, result.token);
      showToast({
        type: "success",
        title: "Welcome!",
        description: "Phone verified successfully",
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

  const handleResendCode = async () => {
    setLoading(true);
    try {
      await sendPhoneVerificationCode(phone);
      showToast({ type: "success", title: "Code resent!" });
    } catch (err: unknown) {
      showToast({ type: "error", title: "Failed to resend code" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            {step === "code" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep("phone")}
                className="p-0 h-auto hover:bg-transparent"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <CardTitle className="text-2xl font-bold">
              {step === "phone" ? "Sign In with Phone" : "Verify Code"}
            </CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            {step === "phone"
              ? "Enter your phone number to receive a verification code"
              : `We sent a code to ${phone}`}
          </p>
        </CardHeader>
        <CardContent>
          {step === "phone" ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+919876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Include country code (e.g., +91 for India)
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner />
                    <span>Sending code...</span>
                  </div>
                ) : (
                  "Send Verification Code"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name (Optional)</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Required for new accounts
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                  required
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  Enter the 6-digit code sent to your phone
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || code.length !== 6}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Verify & Sign In"
                )}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendCode}
                  disabled={loading}
                  className="text-sm"
                >
                  Didn&apos;t receive code? Resend
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
                Sign in with Email
              </Button>
            </Link>
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
