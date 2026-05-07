import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/** RTK Query v2+: use local guard when `isFetchBaseQueryError` isn't re-exported in your TS path. */
export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === "object" && error !== null && "status" in error;
}
