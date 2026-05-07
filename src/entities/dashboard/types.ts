/** Mongo `$group` shape for status counts */
export type StatusBreakdownRow = { _id: string; count: number };

/** From `aggregateLocationBreakdown` projection */
export type LocationBreakdownRow = {
  locationId?: string;
  locationName?: string;
  locationCode?: string;
  count: number;
};

/** Mirrors `getDashboardSummary` payload from the backend */
export type DashboardSummary = {
  totalItems: number;
  missingItems: number;
  activeAlerts: number;
  scansInWindow: number;
  windowHours: number;
  statusBreakdown: StatusBreakdownRow[];
  topLocations: LocationBreakdownRow[];
};
