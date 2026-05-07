"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { baseApi } from "@/store/api/baseApi";

/** Set by `useLogout` before navigating to `/login`. */
export const POST_LOGOUT_API_RESET_KEY = "linetrack_post_logout_reset";

/**
 * After SPA navigation to `/login`, clears RTK Query cache without triggering refetches
 * from the dashboard subtree (which is already unmounted). Avoids `resetApiState` while
 * `useGetMeQuery` / summary hooks are still mounted (which caused ERR_CONNECTION_REFUSED when the API was down).
 */
export function PostLogoutApiReset() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    try {
      if (sessionStorage.getItem(POST_LOGOUT_API_RESET_KEY)) {
        sessionStorage.removeItem(POST_LOGOUT_API_RESET_KEY);
        dispatch(baseApi.util.resetApiState());
      }
    } catch {
      /* private mode / no sessionStorage */
    }
  }, [dispatch]);
  return null;
}
