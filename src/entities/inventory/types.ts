export type LinenStatus = "active" | "replace-soon" | "retired" | "missing";

export type RecommendedAction =
  | "none"
  | "monitor"
  | "replace"
  | "retire"
  | "investigate-missing";

export type LinenItem = {
  _id?: string;
  id?: string;
  itemCode: string;
  rfidTagId: string;
  type: string;
  washCount: number;
  status: LinenStatus;
  location?: string | null;
  lastScannedAt?: string | null;
  isMissing: boolean;
  recommendedAction?: RecommendedAction;
  createdAt?: string;
  updatedAt?: string;
};
