"use client";

import { useMemo } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/store";
import { Toaster } from "@/components/ui/toast";

export function StoreProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const store = useMemo(() => makeStore(), []);
  return (
    <Provider store={store}>
      {children}
      <Toaster />
    </Provider>
  );
}
