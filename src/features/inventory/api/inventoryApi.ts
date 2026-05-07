import type { LinenItem } from "@/entities/inventory/types";
import type { Paginated } from "@/entities/shared/pagination";
import { cleanParams } from "@/lib/api-params";
import { baseApi } from "@/store/api/baseApi";
import { unwrapApiData } from "@/shared/api/types";

export type InventoryListParams = {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  location?: string;
  isMissing?: boolean;
  search?: string;
};

export type CreateInventoryBody = {
  itemCode: string;
  rfidTagId: string;
  type: string;
  location?: string | null;
  washCount?: number;
  status?: string;
  isMissing?: boolean;
  lastScannedAt?: string | null;
};

export type UpdateInventoryBody = Partial<
  Omit<CreateInventoryBody, "itemCode" | "rfidTagId">
> & {
  itemCode?: string;
  rfidTagId?: string;
};

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listInventory: build.query<Paginated<LinenItem>, InventoryListParams | void>({
      query: (params) => ({
        url: "/inventory",
        params: cleanParams((params ?? {}) as Record<string, unknown>),
      }),
      transformResponse: (response: unknown) => unwrapApiData<Paginated<LinenItem>>(response),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((row) => {
                const id = row._id ?? row.id ?? "";
                return { type: "Inventory" as const, id };
              }),
              { type: "Inventory" as const, id: "LIST" },
            ]
          : [{ type: "Inventory" as const, id: "LIST" }],
    }),
    getInventoryItem: build.query<LinenItem, string>({
      query: (id) => `/inventory/${id}`,
      transformResponse: (response: unknown) => unwrapApiData<LinenItem>(response),
      providesTags: (_r, _e, id) => [{ type: "Inventory" as const, id }],
    }),
    createInventoryItem: build.mutation<LinenItem, CreateInventoryBody>({
      query: (body) => ({
        url: "/inventory",
        method: "POST",
        body,
      }),
      transformResponse: (response: unknown) => unwrapApiData<LinenItem>(response),
      invalidatesTags: [{ type: "Inventory" as const, id: "LIST" }, "Dashboard", "Alerts"],
    }),
    updateInventoryItem: build.mutation<LinenItem, { id: string; body: UpdateInventoryBody }>({
      query: ({ id, body }) => ({
        url: `/inventory/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: unknown) => unwrapApiData<LinenItem>(response),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Inventory" as const, id },
        { type: "Inventory" as const, id: "LIST" },
        "Dashboard",
        "Alerts",
      ],
    }),
    markInventoryMissing: build.mutation<LinenItem, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/inventory/${id}/mark-missing`,
        method: "PATCH",
        body: { reason: reason ?? "" },
      }),
      transformResponse: (response: unknown) => unwrapApiData<LinenItem>(response),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Inventory" as const, id },
        { type: "Inventory" as const, id: "LIST" },
        "Dashboard",
        "Alerts",
      ],
    }),
  }),
});

export const {
  useListInventoryQuery,
  useGetInventoryItemQuery,
  useCreateInventoryItemMutation,
  useUpdateInventoryItemMutation,
  useMarkInventoryMissingMutation,
} = inventoryApi;
