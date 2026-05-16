"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaginationBarProps = {
  page: number;
  pages: number;
  total: number;
  limit: number;
  onPageChange: (next: number) => void;
  className?: string;
};

export function PaginationBar({ page, pages, total, limit, onPageChange, className }: PaginationBarProps) {
  if (pages <= 1 && total <= limit) return null;

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", className)}>
      <p className="text-xs tabular-nums text-[var(--text-soft)]">
        Showing <span className="text-foreground font-medium">{from}–{to}</span> of {total.toLocaleString()}
      </p>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={page <= 1}
          onClick={() => onPageChange(1)}
          aria-label="First page"
        >
          <ChevronsLeft className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="min-w-[5rem] text-center text-sm tabular-nums text-muted-foreground">
          <span className="text-foreground font-medium">{page}</span>
          <span className="text-muted-foreground/60"> / {pages}</span>
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={page >= pages}
          onClick={() => onPageChange(pages)}
          aria-label="Last page"
        >
          <ChevronsRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
