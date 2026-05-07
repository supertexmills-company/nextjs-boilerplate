/**
 * Import feature API modules so `injectEndpoints` runs before `configureStore`.
 * Keep this file as the single registration point when adding domains.
 */
import "@/features/auth/api/authApi";
import "@/features/users/api/usersApi";
import "@/features/dashboard/api/dashboardApi";
import "@/features/admin/api/adminApi";
import "@/features/alerts/api/alertsApi";
import "@/features/inventory/api/inventoryApi";
import "@/features/locations/api/locationsApi";
import "@/features/scans/api/scansApi";
import "@/features/settings/api/settingsApi";
