import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { publicEnv } from "@/shared/config/env";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${publicEnv.apiBaseUrl}/api`,
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: [
    "CurrentUser",
    "Dashboard",
    "AdminUsers",
    "Alerts",
    "Inventory",
    "Locations",
    "Settings",
    "Scans",
  ],
  endpoints: () => ({}),
  /** Fewer surprise refetches; dashboard data still refreshes on tag invalidation / navigation. */
  refetchOnFocus: false,
  refetchOnReconnect: true,
});
