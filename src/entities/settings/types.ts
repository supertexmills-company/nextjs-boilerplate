/** System settings document (Mongo Map serializes as object in JSON). */
export type SystemSettings = {
  _id?: string;
  id?: string;
  key?: string;
  maxWashCycles: number;
  replaceSoonThresholdPercent: number;
  missingAfterHours: number;
  defaultLowInventoryThreshold: number;
  lowInventoryThresholdByType?: Record<string, number>;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
