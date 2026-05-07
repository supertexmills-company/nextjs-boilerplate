import { baseApi } from "@/store/api/baseApi";
import type { User } from "@/entities/user/types";
import { normalizeUser } from "@/entities/user/normalize";
import { unwrapApiData } from "@/shared/api/types";
import { setUser } from "@/features/auth/store/authSlice";

export type LoginRequest = { email: string; password: string };
export type SignupRequest = { name: string; email: string; password: string };

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<User, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      transformResponse: (response: unknown) =>
        normalizeUser(unwrapApiData<{ user: unknown }>(response).user),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          /* RTK surfaces error to hook */
        }
      },
      invalidatesTags: ["CurrentUser"],
    }),
    signup: build.mutation<User, SignupRequest>({
      query: (body) => ({
        url: "/auth/signup",
        method: "POST",
        body,
      }),
      transformResponse: (response: unknown) =>
        normalizeUser(unwrapApiData<{ user: unknown }>(response).user),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          /* noop */
        }
      },
      invalidatesTags: ["CurrentUser"],
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = authApi;
