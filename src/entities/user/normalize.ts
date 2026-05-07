import type { User, UserRole } from "@/entities/user/types";

/** Normalizes Mongoose-style `id` / `_id` into a stable `User` for the client. */
export function normalizeUser(raw: unknown): User {
  const r = raw as Record<string, unknown>;
  const id = String(r.id ?? r._id ?? "");
  const role = r.role === "admin" ? "admin" : "user";
  return {
    id,
    name: String(r.name ?? ""),
    email: String(r.email ?? ""),
    role: role as UserRole,
  };
}
