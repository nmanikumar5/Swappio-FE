"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  login as loginRequest,
  fetchProfile,
  googleLogin,
  sendPhoneVerificationCode,
  verifyPhoneCode,
} from "@/services/auth";
import { useUserStore } from "@/stores/userStore";
import { showToast } from "@/components/ui/toast";
import Spinner from "@/components/ui/Spinner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { Phone, Mail, CheckCircle2 } from "lucide-react";
import PhoneInput from "@/components/ui/phone-input";

export default function SignInPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);

  // Email/Password state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Phone/OTP state
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [phoneStep, setPhoneStep] = useState<"phone" | "otp">("phone");
  const [countdown, setCountdown] = useState(0);

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential received");
      }

      const token = credentialResponse.credential;
      await googleLogin(token);

      // Fetch user profile
      const user = await fetchProfile();
      setUser(user, null);
      try {
        useUserStore.getState().setUser?.(user);
      } catch {}

      showToast({ type: "success", title: "Signed in with Google" });
      router.push("/");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as Record<string, unknown>).message)
          : "Google login failed";
      showToast({
        type: "error",
        title: "Google sign in failed",
        description: msg,
      });
    }
  };

  const handleGoogleError = () => {
    showToast({
      type: "error",
      title: "Google sign in failed",
      description: "Failed to authenticate with Google",
    });
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (async () => {
      setLoading(true);
      try {
        await loginRequest({ email, password });
        // server sets httpOnly cookie; hydrate user from profile endpoint
        const user = await fetchProfile();
        setUser(user, null);
        try {
          useUserStore.getState().setUser?.(user);
        } catch {}
        showToast({ type: "success", title: "Signed in" });
        router.push("/");
      } catch (err: unknown) {
        const msg =
          err && typeof err === "object" && "message" in err
            ? String((err as Record<string, unknown>).message)
            : "Login failed";
        showToast({ type: "error", title: "Sign in failed", description: msg });
      } finally {
        setLoading(false);
      }
    })();
  };

  const handleSendPhoneOTP = async (e: React.FormEvent) => {
    e.preventDefault();

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
      setPhoneStep("otp");

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

  const handleVerifyPhoneOTP = async (e: React.FormEvent) => {
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
      await verifyPhoneCode(phone, code);

      // Fetch user profile
      const user = await fetchProfile();
      setUser(user, null);
      try {
        useUserStore.getState().setUser?.(user);
      } catch {}

      showToast({
        type: "success",
        title: "Signed in",
        description: "Welcome back!",
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
            Sign In
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            Welcome back! Choose your preferred sign-in method
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="phone">
                <Phone className="mr-2 h-4 w-4" />
                Phone
              </TabsTrigger>
            </TabsList>

            {/* Email/Password Tab */}
            <TabsContent value="email" className="space-y-4">
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Spinner />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In with Email"
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Phone/OTP Tab */}
            <TabsContent value="phone" className="space-y-4">
              {phoneStep === "phone" ? (
                <form onSubmit={handleSendPhoneOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone-signin">Phone Number</Label>
                    <PhoneInput
                      id="phone-signin"
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
                <form onSubmit={handleVerifyPhoneOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="code-signin">Verification Code</Label>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                      <Input
                        id="code-signin"
                        type="text"
                        placeholder="123456"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        maxLength={6}
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter the 6-digit code sent to {phone}
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Spinner />
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      "Verify & Sign In"
                    )}
                  </Button>

                  <div className="flex items-center justify-between text-sm">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setPhoneStep("phone");
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
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              width="384"
              text="continue_with"
            />
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
