"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

const PUBLIC_ROUTES = [
  "/auth/signin",
  "/auth/signup",
  "/auth/phone",
  "/auth/forgot-password",
];

const ADMIN_ROUTES = ["/admin"];

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Allow public routes
    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    // Check if it's an admin route
    const isAdminRoute = ADMIN_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    if (isPublicRoute) {
      // If authenticated and on auth page, redirect to home
      if (isAuthenticated) {
        router.replace("/");
      }
      return;
    }

    // For protected routes
    if (!isAuthenticated) {
      // Not authenticated, redirect to signin
      router.replace("/auth/signin");
      return;
    }

    // Check admin access
    if (isAdminRoute && user?.role !== "admin") {
      // Not an admin, redirect to home
      router.replace("/");
      return;
    }
  }, [pathname, isAuthenticated, user, router]);

  return <>{children}</>;
}
