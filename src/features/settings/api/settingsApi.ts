import type { SystemSettings } from "@/entities/settings/types";
import { baseApi } from "@/store/api/baseApi";
import { unwrapApiData } from "@/shared/api/types";

export type UpdateSettingsBody = Partial<{
  maxWashCycles: number;
  replaceSoonThresholdPercent: number;
  missingAfterHours: number;
  defaultLowInventoryThreshold: number;
  lowInventoryThresholdByType: Record<string, number>;
}>;

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSettings: build.query<SystemSettings, void>({
      query: () => "/settings",
      transformResponse: (response: unknown) => unwrapApiData<SystemSettings>(response),
      providesTags: [{ type: "Settings" as const, id: "GLOBAL" }],
    }),
    updateSettings: build.mutation<SystemSettings, UpdateSettingsBody>({
      query: (body) => ({
        url: "/settings",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: unknown) => unwrapApiData<SystemSettings>(response),
      invalidatesTags: [{ type: "Settings" as const, id: "GLOBAL" }, "Dashboard", "Alerts"],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;
