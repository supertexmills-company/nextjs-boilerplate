"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { clearUser } from "@/features/auth/store/authSlice";
import { POST_LOGOUT_API_RESET_KEY } from "@/features/auth/components/PostLogoutApiReset";

/**
 * Clears client auth and navigates to login. Does not call `resetApiState` here — that would
 * refetch all active queries while the dashboard layout is still mounted (noisy errors if the API is stopped).
 * Cache is cleared on `/login` via {@link PostLogoutApiReset}.
 *
 * httpOnly cookie is unchanged until the backend exposes `POST /api/auth/logout`.
 */
export function useLogout() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  return useCallback(() => {
    dispatch(clearUser());
    try {
      sessionStorage.setItem(POST_LOGOUT_API_RESET_KEY, "1");
    } catch {
      /* ignore */
    }
    router.replace("/login");
  }, [dispatch, router]);
}
