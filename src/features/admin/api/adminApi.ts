import { baseApi } from "@/store/api/baseApi";
import type { User } from "@/entities/user/types";
import { normalizeUser } from "@/entities/user/normalize";
import { unwrapApiData } from "@/shared/api/types";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listUsers: build.query<User[], void>({
      query: () => "/admin/users",
      transformResponse: (response: unknown) =>
        unwrapApiData<unknown[]>(response).map((row) => normalizeUser(row)),
      providesTags: (result) =>
        result
          ? [
              ...result.map((u) => ({ type: "AdminUsers" as const, id: u.id })),
              { type: "AdminUsers" as const, id: "LIST" },
            ]
          : [{ type: "AdminUsers" as const, id: "LIST" }],
    }),
    getUserById: build.query<User, string>({
      query: (id) => `/admin/users/${id}`,
      transformResponse: (response: unknown) =>
        normalizeUser(unwrapApiData<unknown>(response)),
      providesTags: (_result, _err, id) => [{ type: "AdminUsers" as const, id }],
    }),
  }),
});

export const { useListUsersQuery, useGetUserByIdQuery } = adminApi;
