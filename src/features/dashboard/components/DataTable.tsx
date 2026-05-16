import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/features/dashboard/components/Skeleton";
import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  id: string;
  header: ReactNode;
  className?: string;
  cell: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T, index: number) => string;
  density?: "comfortable" | "compact";
  emptyMessage?: string;
  isLoading?: boolean;
  error?: ReactNode;
  onRowClick?: (row: T) => void;
};

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  density = "comfortable",
  emptyMessage = "No data yet.",
  isLoading,
  error,
  onRowClick,
}: DataTableProps<T>) {
  const cellPad = density === "compact" ? "px-4 py-3" : "px-6 py-4";

  if (error) {
    return (
      <Card className="overflow-hidden p-6">
        <div className="text-sm text-[var(--danger)]" role="alert">
          {error}
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="overflow-hidden p-0">
        <div className="space-y-3 p-6">
          <Skeleton className="h-9 w-1/3" />
          <div className="space-y-1.5">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-md" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (rows.length === 0) {
    return (
      <Card className="overflow-hidden px-6 py-10 text-center text-sm text-[var(--text-soft)]">
        {emptyMessage}
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-[24px] p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-[var(--surface-2)] text-left">
              {columns.map((col) => (
                <th
                  key={col.id}
                  scope="col"
                  className={cn(
                    "sticky top-0 z-[1] whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]",
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={getRowId(row, rowIndex)}
                className={cn(
                  "data-row border-b border-border/60 last:border-0",
                  rowIndex % 2 === 1 && "bg-[color-mix(in_srgb,var(--surface-2)_60%,var(--surface))]",
                  onRowClick && "cursor-pointer",
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => (
                  <td
                    key={col.id}
                    className={cn(cellPad, "align-middle text-foreground", col.className)}
                  >
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
