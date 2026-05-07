import type { LinenItem } from "@/entities/inventory/types";
import type { Paginated } from "@/entities/shared/pagination";
import type { ProcessScanRequest, ScanEventRecord } from "@/entities/scans/types";
import { cleanParams } from "@/lib/api-params";
import { baseApi } from "@/store/api/baseApi";
import { unwrapApiData } from "@/shared/api/types";

export type ScanListParams = {
  page?: number;
  limit?: number;
  eventType?: string;
  linenItem?: string;
  /** Admin only — all scans in the system */
  all?: boolean;
};

export type ProcessScanResult = {
  linenItem: LinenItem;
  scanEvent: ScanEventRecord;
};

export const scansApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listScans: build.query<Paginated<ScanEventRecord>, ScanListParams | void>({
      query: (params) => ({
        url: "/scans",
        params: cleanParams((params ?? {}) as Record<string, unknown>),
      }),
      transformResponse: (response: unknown) =>
        unwrapApiData<Paginated<ScanEventRecord>>(response),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((row) => ({
                type: "Scans" as const,
                id: row._id ?? row.id ?? "",
              })),
              { type: "Scans" as const, id: "LIST" },
            ]
          : [{ type: "Scans" as const, id: "LIST" }],
    }),
    processScan: build.mutation<ProcessScanResult, ProcessScanRequest>({
      query: (body) => ({
        url: "/scans/process",
        method: "POST",
        body,
      }),
      transformResponse: (response: unknown) => unwrapApiData<ProcessScanResult>(response),
      invalidatesTags: ["Dashboard", "Inventory", "Alerts", "Scans"],
    }),
  }),
});

export const { useListScansQuery, useProcessScanMutation } = scansApi;
