import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function LinenStatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase() ?? "";
  const tone =
    s === "missing" || s === "retired"
      ? "critical"
      : s === "replace-soon"
        ? "warning"
        : s === "active"
          ? "success"
          : "default";
  return (
    <Badge variant="outline" dot tone={tone === "default" ? "default" : tone} className="capitalize">
      {status.replace(/-/g, " ")}
    </Badge>
  );
}

export function AlertSeverityBadge({ severity }: { severity: string }) {
  const sev = severity?.toLowerCase() ?? "";
  const tone = sev === "critical" ? "critical" : sev === "warning" ? "warning" : sev === "info" ? "info" : "default";
  return (
    <Badge variant="outline" dot tone={tone === "default" ? "default" : tone} className="capitalize">
      {severity}
    </Badge>
  );
}

export function AlertTypeBadge({ type }: { type: string }) {
  return (
    <Badge variant="outline" className={cn("font-mono text-[10px] uppercase tracking-wide")}>
      {type.replace(/-/g, " ")}
    </Badge>
  );
}

export function LocationCategoryBadge({ category }: { category: string }) {
  return (
    <Badge variant="secondary" dot tone="user" className="capitalize">
      {category.replace(/-/g, " ")}
    </Badge>
  );
}
