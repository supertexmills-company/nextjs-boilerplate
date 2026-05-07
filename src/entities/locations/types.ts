export type LocationCategory = "laundry" | "floor" | "storage" | "dispatch" | "other";

export type LocationRecord = {
  _id?: string;
  id?: string;
  name: string;
  code: string;
  category: LocationCategory;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};
