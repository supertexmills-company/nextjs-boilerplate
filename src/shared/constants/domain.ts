/** Mirrors backend enums for forms and filters */

export const LINEN_STATUS_VALUES = ["active", "replace-soon", "retired", "missing"] as const;

export const ALERT_TYPE_VALUES = ["replace-soon", "retired", "missing-item", "low-inventory"] as const;

export const ALERT_SEVERITY_VALUES = ["info", "warning", "critical"] as const;

export const SCAN_EVENT_TYPE_VALUES = [
  "laundry",
  "check-in",
  "check-out",
  "floor-scan",
  "storage-scan",
  "manual-update",
] as const;

export const LOCATION_CATEGORY_VALUES = ["laundry", "floor", "storage", "dispatch", "other"] as const;
