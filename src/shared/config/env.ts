/**
 * Browser-safe configuration. Only `NEXT_PUBLIC_*` vars are available on the client.
 */
const raw = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

export const publicEnv = {
  /** Origin of the Express API (e.g. http://localhost:5000) */
  apiBaseUrl: raw && raw.length > 0 ? raw.replace(/\/$/, "") : "http://localhost:5000",
} as const;
