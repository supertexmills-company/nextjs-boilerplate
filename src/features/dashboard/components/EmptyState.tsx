import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
};

export function EmptyState({ icon: Icon, title, description, children, className }: EmptyStateProps) {
  return (
    <Card className={cn("border-dashed bg-[color-mix(in_srgb,var(--muted)_60%,transparent)]", className)}>
      <CardContent className="flex flex-col items-center justify-center gap-4 py-14 text-center">
        <div className="relative flex size-14 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
          <div
            className="absolute inset-0 -m-1 rounded-full border border-[color-mix(in_srgb,var(--brass)_18%,transparent)]"
            aria-hidden
          />
          <Icon className="size-6" aria-hidden />
        </div>
        <div className="space-y-1">
          <p className="font-display text-xl font-medium leading-tight tracking-[var(--tracking-heading)] text-foreground">
            {title}
          </p>
          {description ? (
            <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
