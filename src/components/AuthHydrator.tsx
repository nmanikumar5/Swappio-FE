"use client";

import { useEffect } from "react";
import { fetchProfile } from "@/services/auth";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { getClientToken } from "@/lib/auth";

export default function AuthHydrator() {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    (async () => {
      try {
        // fetchProfile will only work if localStorage token exists
        // This prevents cookie-based auto-login after logout
        const user = await fetchProfile();

        if (user) {
          const token = getClientToken();
          setUser(user, token);
          // cache user in userStore for quick access elsewhere
          try {
            useUserStore.getState().setUser?.(user);
          } catch {}
        }
      } catch {
        // Not authenticated or token invalid - this is expected after logout
        // No need to log errors here
      }
    })();
  }, [setUser]);

  return null;
}
