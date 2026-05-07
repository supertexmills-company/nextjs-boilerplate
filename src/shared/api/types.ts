/** Matches backend JSON envelope for successful responses */
export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export function unwrapApiData<T>(response: unknown): T {
  if (!response || typeof response !== "object") {
    throw new Error("Invalid API response");
  }
  const r = response as ApiEnvelope<T>;
  if (!("success" in r) || r.success !== true) {
    const msg =
      typeof (r as { message?: unknown }).message === "string"
        ? (r as { message: string }).message
        : "Request failed";
    throw new Error(msg);
  }
  return r.data;
}
