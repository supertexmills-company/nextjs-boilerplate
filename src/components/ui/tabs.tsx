"use client";

import * as React from "react";
import { Tabs as RadixTabs } from "radix-ui";

import { cn } from "@/lib/utils";

const Tabs = RadixTabs.Root;

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof RadixTabs.List>) {
  return (
    <RadixTabs.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-10 items-center gap-1 rounded-full border border-border bg-muted/40 p-1",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof RadixTabs.Trigger>) {
  return (
    <RadixTabs.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium",
        "text-muted-foreground transition-colors duration-150 ease-[var(--ease)]",
        "hover:text-foreground",
        "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-[var(--e1)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--brass)_40%,transparent)]",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof RadixTabs.Content>) {
  return (
    <RadixTabs.Content
      data-slot="tabs-content"
      className={cn("mt-4 focus-visible:outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
