import { baseApi } from "@/store/api/baseApi";
import type {
  DashboardSummary,
  LocationBreakdownRow,
  StatusBreakdownRow,
} from "@/entities/dashboard/types";
import { unwrapApiData } from "@/shared/api/types";

export type DashboardSummaryParams = { windowHours?: number };

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSummary: build.query<DashboardSummary, DashboardSummaryParams | void>({
      query: (params) => ({
        url: "/dashboard/summary",
        params:
          params && typeof params.windowHours === "number"
            ? { windowHours: params.windowHours }
            : {},
      }),
      transformResponse: (response: unknown) => unwrapApiData<DashboardSummary>(response),
      providesTags: ["Dashboard"],
    }),
    getStatusBreakdown: build.query<StatusBreakdownRow[], void>({
      query: () => "/dashboard/status-breakdown",
      transformResponse: (response: unknown) => unwrapApiData<StatusBreakdownRow[]>(response),
      providesTags: ["Dashboard"],
    }),
    getLocationBreakdown: build.query<LocationBreakdownRow[], void>({
      query: () => "/dashboard/location-breakdown",
      transformResponse: (response: unknown) => unwrapApiData<LocationBreakdownRow[]>(response),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetSummaryQuery,
  useGetStatusBreakdownQuery,
  useGetLocationBreakdownQuery,
} = dashboardApi;
