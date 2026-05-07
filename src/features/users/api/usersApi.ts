import { baseApi } from "@/store/api/baseApi";
import type { User } from "@/entities/user/types";
import { normalizeUser } from "@/entities/user/normalize";
import { unwrapApiData } from "@/shared/api/types";
import { setUser } from "@/features/auth/store/authSlice";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<User, void>({
      query: () => "/users/me",
      transformResponse: (response: unknown) =>
        normalizeUser(unwrapApiData<unknown>(response)),
      providesTags: ["CurrentUser"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          dispatch(setUser(null));
        }
      },
    }),
  }),
});

export const { useGetMeQuery, useLazyGetMeQuery } = usersApi;
