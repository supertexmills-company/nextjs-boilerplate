import { publicEnv } from "@/shared/config/env";
import { unwrapApiData, type ApiEnvelope } from "@/shared/api/types";

export type ApiClientOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

/**
 * Thin fetch wrapper for non-RTK code paths (Server Actions, one-off calls).
 * Uses the same base URL and cookie policy as RTK Query.
 */
export async function apiClient<T>(
  path: string,
  { body, headers, ...init }: ApiClientOptions = {},
): Promise<T> {
  const url = `${publicEnv.apiBaseUrl}/api${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...Object.fromEntries(new Headers(headers).entries()),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const json = (await res.json()) as ApiEnvelope<T> | { success?: boolean; message?: string };

  if (!res.ok) {
    const msg =
      json && typeof json === "object" && "message" in json && typeof json.message === "string"
        ? json.message
        : res.statusText;
    throw new Error(msg);
  }

  return unwrapApiData<T>(json);
}
