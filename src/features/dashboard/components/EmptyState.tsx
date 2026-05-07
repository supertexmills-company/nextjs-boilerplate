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
    <Card className={cn("border-dashed border-border/80 bg-muted/20", className)}>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-14 text-center">
        <div className="rounded-full border border-border/60 bg-muted/40 p-3 text-muted-foreground">
          <Icon className="size-7" aria-hidden />
        </div>
        <div className="space-y-1">
          <p className="font-display text-lg font-light text-foreground">{title}</p>
          {description ? <p className="max-w-sm text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
