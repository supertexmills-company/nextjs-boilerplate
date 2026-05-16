"use client";

import * as React from "react";
import { Tooltip as RadixTooltip } from "radix-ui";

import { cn } from "@/lib/utils";

const TooltipProvider = RadixTooltip.Provider;
const Tooltip = RadixTooltip.Root;
const TooltipTrigger = RadixTooltip.Trigger;

function TooltipContent({
  className,
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof RadixTooltip.Content>) {
  return (
    <RadixTooltip.Portal>
      <RadixTooltip.Content
        sideOffset={sideOffset}
        data-slot="tooltip-content"
        className={cn(
          "z-50 max-w-[260px] rounded-md border border-border bg-popover px-2.5 py-1.5",
          "text-xs leading-snug text-popover-foreground shadow-[var(--e2)]",
          "data-[state=delayed-open]:animate-[dialog-content-in_140ms_var(--ease)]",
          className,
        )}
        {...props}
      />
    </RadixTooltip.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
