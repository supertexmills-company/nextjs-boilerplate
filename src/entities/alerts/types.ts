export type AlertType = "replace-soon" | "retired" | "missing-item" | "low-inventory";

export type AlertSeverity = "info" | "warning" | "critical";

/** Alert document shape from API (lean JSON) */
export type AlertRecord = {
  _id?: string;
  id?: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  linenItem?: string | null;
  location?: string | null;
  signature: string;
  isResolved: boolean;
  resolvedAt?: string | null;
  resolvedBy?: string | null;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
};
