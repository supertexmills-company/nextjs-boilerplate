import type { DashboardSummary } from "@/entities/dashboard/types";

/**
 * Seeded dashboard data for /sample/dashboard.
 *
 * Used by the public sample route to show the product without requiring auth.
 * Values are illustrative but realistic for a mid-size hotel chain operation.
 *
 * TODO(content): tune these numbers if you'd prefer the public sample to
 * reflect a different segment (e.g. single luxury property vs portfolio).
 */
export const sampleDashboardSummary: DashboardSummary = {
  totalItems: 12_480,
  missingItems: 38,
  activeAlerts: 4,
  scansInWindow: 2_341,
  windowHours: 24,
  statusBreakdown: [
    { _id: "active", count: 11_902 },
    { _id: "replace-soon", count: 412 },
    { _id: "missing", count: 38 },
    { _id: "retired", count: 128 },
  ],
  topLocations: [
    { locationId: "loc-1", locationCode: "HK-01", locationName: "Housekeeping · Main tower", count: 3_120 },
    { locationId: "loc-2", locationCode: "LD-01", locationName: "Laundry · Central", count: 2_786 },
    { locationId: "loc-3", locationCode: "FL-08", locationName: "Floor 8 storage", count: 1_902 },
    { locationId: "loc-4", locationCode: "SP-01", locationName: "Spa &amp; pool", count: 1_245 },
    { locationId: "loc-5", locationCode: "FB-02", locationName: "F&amp;B linen room", count: 987 },
  ],
};
