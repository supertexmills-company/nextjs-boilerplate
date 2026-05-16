"use client";

import * as React from "react";
import { Select as RadixSelect } from "radix-ui";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

const Select = RadixSelect.Root;
const SelectGroup = RadixSelect.Group;
const SelectValue = RadixSelect.Value;

function SelectTrigger({
  className,
  size = "md",
  children,
  ...props
}: React.ComponentProps<typeof RadixSelect.Trigger> & {
  size?: "sm" | "md";
}) {
  return (
    <RadixSelect.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-[16px] border border-input bg-[var(--surface)]",
        "text-[15px] text-foreground transition-[border-color,box-shadow,background-color] duration-[var(--duration-base)] ease-[var(--ease)]",
        size === "sm" ? "h-10 px-3 text-sm" : "h-12 px-4",
        "hover:border-[color-mix(in_srgb,var(--border)_55%,var(--accent)_45%)]",
        "focus-visible:border-[color-mix(in_srgb,var(--accent)_70%,var(--input))]",
        "focus-visible:ring-[3px] focus-visible:ring-[color-mix(in_srgb,var(--accent)_22%,transparent)]",
        "focus-visible:outline-none",
        "data-[placeholder]:text-muted-foreground/70",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:opacity-60",
        className,
      )}
      {...props}
    >
      {children}
      <RadixSelect.Icon asChild>
        <ChevronDown className="size-4" />
      </RadixSelect.Icon>
    </RadixSelect.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof RadixSelect.Content>) {
  return (
    <RadixSelect.Portal>
      <RadixSelect.Content
        data-slot="select-content"
        position={position}
        className={cn(
          "relative z-50 max-h-[--radix-select-content-available-height] min-w-[--radix-select-trigger-width]",
          "overflow-hidden rounded-[18px] border border-border bg-popover text-popover-foreground shadow-[var(--e2)]",
          "data-[state=open]:animate-[dialog-content-in_180ms_var(--ease)]",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
          className,
        )}
        {...props}
      >
        <RadixSelect.ScrollUpButton className="flex h-7 items-center justify-center bg-popover">
          <ChevronUp className="size-4 opacity-60" />
        </RadixSelect.ScrollUpButton>
        <RadixSelect.Viewport className="p-1">{children}</RadixSelect.Viewport>
        <RadixSelect.ScrollDownButton className="flex h-7 items-center justify-center bg-popover">
          <ChevronDown className="size-4 opacity-60" />
        </RadixSelect.ScrollDownButton>
      </RadixSelect.Content>
    </RadixSelect.Portal>
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RadixSelect.Item>) {
  return (
    <RadixSelect.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-[14px] py-3 pl-8 pr-3 text-sm",
        "outline-none transition-colors duration-100",
        "data-[highlighted]:bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] data-[highlighted]:text-foreground",
        "data-[state=checked]:text-[var(--accent)]",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <RadixSelect.ItemIndicator>
          <Check className="size-3.5" />
        </RadixSelect.ItemIndicator>
      </span>
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    </RadixSelect.Item>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof RadixSelect.Label>) {
  return (
    <RadixSelect.Label
      data-slot="select-label"
      className={cn("px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", className)}
      {...props}
    />
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof RadixSelect.Separator>) {
  return (
    <RadixSelect.Separator
      data-slot="select-separator"
      className={cn("my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
};
