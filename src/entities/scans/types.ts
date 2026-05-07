import type { LinenItem } from "@/entities/inventory/types";
import type { LocationRecord } from "@/entities/locations/types";

export type ScanEventType =
  | "laundry"
  | "check-in"
  | "check-out"
  | "floor-scan"
  | "storage-scan"
  | "manual-update";

export type ScanUserPreview =
  | {
      _id?: string;
      id?: string;
      name?: string;
      email?: string;
      role?: string;
    }
  | null
  | undefined;

export type ScanEventRecord = {
  _id?: string;
  id?: string;
  linenItem: string | Partial<LinenItem> | LinenItem;
  itemCode: string;
  rfidTagId: string;
  eventType: ScanEventType;
  location?: string | Partial<LocationRecord> | LocationRecord | null;
  scannedAt?: string;
  scannedBy?: string | ScanUserPreview | null;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
};

export type ProcessScanRequest = {
  eventType: ScanEventType;
  rfidTagId?: string;
  itemCode?: string;
  location?: string | null;
  scannedAt?: string;
  metadata?: Record<string, unknown>;
};
