import type { AlertRecord } from "@/entities/alerts/types";
import type { Paginated } from "@/entities/shared/pagination";
import { cleanParams } from "@/lib/api-params";
import { baseApi } from "@/store/api/baseApi";
import { unwrapApiData } from "@/shared/api/types";

export type AlertListParams = {
  page?: number;
  limit?: number;
  type?: string;
  severity?: string;
  isResolved?: boolean;
};

export const alertsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listAlerts: build.query<Paginated<AlertRecord>, AlertListParams | void>({
      query: (params) => ({
        url: "/alerts",
        params: cleanParams((params ?? {}) as Record<string, unknown>),
      }),
      transformResponse: (response: unknown) => unwrapApiData<Paginated<AlertRecord>>(response),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((a) => {
                const id = a._id ?? a.id ?? "";
                return { type: "Alerts" as const, id };
              }),
              { type: "Alerts" as const, id: "LIST" },
            ]
          : [{ type: "Alerts" as const, id: "LIST" }],
    }),
    getAlert: build.query<AlertRecord, string>({
      query: (id) => `/alerts/${id}`,
      transformResponse: (response: unknown) => unwrapApiData<AlertRecord>(response),
      providesTags: (_r, _e, id) => [{ type: "Alerts" as const, id }],
    }),
    resolveAlert: build.mutation<AlertRecord, string>({
      query: (id) => ({
        url: `/alerts/${id}/resolve`,
        method: "PATCH",
      }),
      transformResponse: (response: unknown) => unwrapApiData<AlertRecord>(response),
      invalidatesTags: (_r, _e, id) => [
        { type: "Alerts" as const, id },
        { type: "Alerts" as const, id: "LIST" },
        "Dashboard",
      ],
    }),
  }),
});

export const { useListAlertsQuery, useGetAlertQuery, useResolveAlertMutation } = alertsApi;
