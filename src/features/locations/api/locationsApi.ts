import type { LocationRecord } from "@/entities/locations/types";
import type { Paginated } from "@/entities/shared/pagination";
import { cleanParams } from "@/lib/api-params";
import { baseApi } from "@/store/api/baseApi";
import { unwrapApiData } from "@/shared/api/types";

export type LocationListParams = {
  page?: number;
  limit?: number;
  category?: string;
  isActive?: boolean;
  search?: string;
};

export type CreateLocationBody = {
  name: string;
  code: string;
  category: string;
};

export type UpdateLocationBody = Partial<CreateLocationBody> & {
  isActive?: boolean;
};

export const locationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listLocations: build.query<Paginated<LocationRecord>, LocationListParams | void>({
      query: (params) => ({
        url: "/locations",
        params: cleanParams((params ?? {}) as Record<string, unknown>),
      }),
      transformResponse: (response: unknown) => unwrapApiData<Paginated<LocationRecord>>(response),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((row) => {
                const id = row._id ?? row.id ?? "";
                return { type: "Locations" as const, id };
              }),
              { type: "Locations" as const, id: "LIST" },
            ]
          : [{ type: "Locations" as const, id: "LIST" }],
    }),
    getLocation: build.query<LocationRecord, string>({
      query: (id) => `/locations/${id}`,
      transformResponse: (response: unknown) => unwrapApiData<LocationRecord>(response),
      providesTags: (_r, _e, id) => [{ type: "Locations" as const, id }],
    }),
    createLocation: build.mutation<LocationRecord, CreateLocationBody>({
      query: (body) => ({
        url: "/locations",
        method: "POST",
        body,
      }),
      transformResponse: (response: unknown) => unwrapApiData<LocationRecord>(response),
      invalidatesTags: [{ type: "Locations" as const, id: "LIST" }],
    }),
    updateLocation: build.mutation<LocationRecord, { id: string; body: UpdateLocationBody }>({
      query: ({ id, body }) => ({
        url: `/locations/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: unknown) => unwrapApiData<LocationRecord>(response),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Locations" as const, id },
        { type: "Locations" as const, id: "LIST" },
      ],
    }),
    deactivateLocation: build.mutation<LocationRecord, string>({
      query: (id) => ({
        url: `/locations/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: unknown) => unwrapApiData<LocationRecord>(response),
      invalidatesTags: (_r, _e, id) => [
        { type: "Locations" as const, id },
        { type: "Locations" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useListLocationsQuery,
  useGetLocationQuery,
  useCreateLocationMutation,
  useUpdateLocationMutation,
  useDeactivateLocationMutation,
} = locationsApi;
