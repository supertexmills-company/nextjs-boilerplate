import * as React from "react";

import { cn } from "@/lib/utils";

function Card({
  className,
  accent,
  ...props
}: React.ComponentProps<"div"> & { accent?: boolean }) {
  return (
    <div
      data-slot="card"
      className={cn(
        "luxury-card text-card-foreground",
        "rounded-[24px] border border-border bg-card shadow-[var(--e1)]",
        accent && "luxury-card--accent border-[color-mix(in_srgb,var(--accent)_24%,var(--border))]",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-2 px-6 pt-6 pb-0", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-display text-[32px] font-medium leading-[1] tracking-[var(--tracking-heading)] text-card-foreground",
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm leading-relaxed text-[var(--text-soft)]", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-content" className={cn("px-6 py-6", className)} {...props} />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-2 px-6 pt-2 pb-6", className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
