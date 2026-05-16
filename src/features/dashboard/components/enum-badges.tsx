import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type LinenIntent = "neutral" | "brand" | "success" | "warning" | "danger" | "info";

export function LinenStatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase() ?? "";
  const intent: LinenIntent =
    s === "missing" || s === "retired"
      ? "danger"
      : s === "replace-soon"
        ? "warning"
        : s === "active"
          ? "success"
          : "neutral";
  return (
    <Badge variant="outline" intent={intent} dot className="capitalize">
      {status.replace(/-/g, " ")}
    </Badge>
  );
}

export function AlertSeverityBadge({ severity }: { severity: string }) {
  const sev = severity?.toLowerCase() ?? "";
  const intent: LinenIntent =
    sev === "critical"
      ? "danger"
      : sev === "warning"
        ? "warning"
        : sev === "info"
          ? "info"
          : "neutral";
  return (
    <Badge variant="outline" intent={intent} dot className="capitalize">
      {severity}
    </Badge>
  );
}

export function AlertTypeBadge({ type }: { type: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("font-mono text-[10px] uppercase tracking-wide text-muted-foreground")}
    >
      {type.replace(/-/g, " ")}
    </Badge>
  );
}

export function LocationCategoryBadge({ category }: { category: string }) {
  return (
    <Badge variant="secondary" dot className="capitalize">
      {category.replace(/-/g, " ")}
    </Badge>
  );
}
