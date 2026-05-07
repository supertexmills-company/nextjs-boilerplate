import { configureStore } from "@reduxjs/toolkit";
import "@/store/registerApis";
import { baseApi } from "@/store/api/baseApi";
import { authReducer, authSlice } from "@/features/auth/store/authSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      [authSlice.name]: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
