import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
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
};

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  density = "comfortable",
  emptyMessage = "No data yet.",
  isLoading,
  error,
}: DataTableProps<T>) {
  const cellPad = density === "compact" ? "px-4 py-2.5" : "px-4 py-3.5";

  if (error) {
    return (
      <Card className="overflow-hidden p-6">
        <div className="text-sm text-destructive" role="alert">
          {error}
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <div className="animate-pulse space-y-3 p-4">
          <div className="h-4 w-1/3 rounded bg-muted" />
          <div className="h-10 rounded bg-muted/80" />
          <div className="h-10 rounded bg-muted/80" />
          <div className="h-10 rounded bg-muted/80" />
        </div>
      </Card>
    );
  }

  if (rows.length === 0) {
    return (
      <Card className="overflow-hidden p-8 text-center text-sm text-muted-foreground">{emptyMessage}</Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/35 text-left">
              {columns.map((col) => (
                <th
                  key={col.id}
                  scope="col"
                  className={cn(
                    "sticky top-0 z-[1] whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground backdrop-blur-sm",
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
              <tr key={getRowId(row, rowIndex)} className="data-row border-b border-border/80 last:border-0">
                {columns.map((col) => (
                  <td key={col.id} className={cn(cellPad, "align-middle text-foreground", col.className)}>
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
