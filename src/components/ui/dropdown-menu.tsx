"use client";

import * as React from "react";
import { DropdownMenu as RadixDropdown } from "radix-ui";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const DropdownMenu = RadixDropdown.Root;
const DropdownMenuTrigger = RadixDropdown.Trigger;
const DropdownMenuGroup = RadixDropdown.Group;
const DropdownMenuPortal = RadixDropdown.Portal;
const DropdownMenuSub = RadixDropdown.Sub;
const DropdownMenuRadioGroup = RadixDropdown.RadioGroup;

function DropdownMenuContent({
  className,
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof RadixDropdown.Content>) {
  return (
    <RadixDropdown.Portal>
      <RadixDropdown.Content
        sideOffset={sideOffset}
        data-slot="dropdown-content"
        className={cn(
          "z-50 min-w-[12rem] overflow-hidden rounded-xl border border-border bg-popover p-1 text-popover-foreground",
          "shadow-[var(--e3)]",
          "data-[state=open]:animate-[dialog-content-in_140ms_var(--ease)]",
          className,
        )}
        {...props}
      />
    </RadixDropdown.Portal>
  );
}

function DropdownMenuItem({
  className,
  inset,
  destructive,
  ...props
}: React.ComponentProps<typeof RadixDropdown.Item> & {
  inset?: boolean;
  destructive?: boolean;
}) {
  return (
    <RadixDropdown.Item
      data-slot="dropdown-item"
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2.5 py-2 text-sm",
        "outline-none transition-colors duration-100",
        "data-[highlighted]:bg-[color-mix(in_srgb,var(--brass)_12%,transparent)] data-[highlighted]:text-foreground",
        destructive && "text-[var(--danger)] data-[highlighted]:bg-[color-mix(in_srgb,var(--danger)_12%,transparent)]",
        inset && "pl-8",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:opacity-70",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof RadixDropdown.Label> & { inset?: boolean }) {
  return (
    <RadixDropdown.Label
      data-slot="dropdown-label"
      className={cn(
        "px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[var(--tracking-widest2)] text-muted-foreground",
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof RadixDropdown.Separator>) {
  return (
    <RadixDropdown.Separator
      data-slot="dropdown-separator"
      className={cn("my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof RadixDropdown.CheckboxItem>) {
  return (
    <RadixDropdown.CheckboxItem
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none",
        "data-[highlighted]:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <RadixDropdown.ItemIndicator>
          <Check className="size-3.5" />
        </RadixDropdown.ItemIndicator>
      </span>
      {children}
    </RadixDropdown.CheckboxItem>
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RadixDropdown.RadioItem>) {
  return (
    <RadixDropdown.RadioItem
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none",
        "data-[highlighted]:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <RadixDropdown.ItemIndicator>
          <Circle className="size-2 fill-current" />
        </RadixDropdown.ItemIndicator>
      </span>
      {children}
    </RadixDropdown.RadioItem>
  );
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
      {...props}
    />
  );
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof RadixDropdown.SubTrigger> & { inset?: boolean }) {
  return (
    <RadixDropdown.SubTrigger
      className={cn(
        "flex cursor-pointer select-none items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none",
        "data-[highlighted]:bg-muted data-[state=open]:bg-muted",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto size-4 opacity-60" />
    </RadixDropdown.SubTrigger>
  );
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof RadixDropdown.SubContent>) {
  return (
    <RadixDropdown.SubContent
      className={cn(
        "z-50 min-w-[10rem] overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-[var(--e3)]",
        className,
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
};
