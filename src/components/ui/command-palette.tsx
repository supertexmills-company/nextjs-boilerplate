"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Dialog as RadixDialog } from "radix-ui";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

/* CommandDialog wraps cmdk in a Radix Dialog for focus trap + portal + ESC */

type CommandDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder?: string;
  children: React.ReactNode;
  label?: string;
};

function CommandDialog({
  open,
  onOpenChange,
  placeholder = "Search Tantava...",
  children,
  label = "Command palette",
}: CommandDialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-[var(--ink)]/60 backdrop-blur-md",
            "data-[state=open]:animate-[dialog-overlay-in_180ms_var(--ease)]",
            "data-[state=closed]:animate-[dialog-overlay-out_160ms_var(--ease)]",
          )}
        />
        <RadixDialog.Content
          aria-label={label}
          className={cn(
            "fixed left-1/2 top-[18%] z-50 w-[calc(100%-2rem)] max-w-[640px] -translate-x-1/2",
            "overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-[var(--e4)]",
            "data-[state=open]:animate-[dialog-content-in_200ms_var(--ease)]",
            "data-[state=closed]:animate-[dialog-content-out_160ms_var(--ease)]",
          )}
        >
          <RadixDialog.Title className="sr-only">{label}</RadixDialog.Title>
          <RadixDialog.Description className="sr-only">
            Type to search across navigation, actions, and inventory.
          </RadixDialog.Description>
          <CommandPrimitive
            label={label}
            className="flex h-full w-full flex-col"
            loop
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
              <Search className="size-4 shrink-0 opacity-60" aria-hidden />
              <CommandPrimitive.Input
                placeholder={placeholder}
                className={cn(
                  "flex-1 bg-transparent text-[15px] text-foreground outline-none",
                  "placeholder:text-muted-foreground/70",
                )}
              />
              <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
                ESC
              </kbd>
            </div>
            <CommandPrimitive.List className="max-h-[400px] overflow-y-auto p-1.5">
              <CommandPrimitive.Empty className="px-3 py-8 text-center text-sm text-muted-foreground">
                No results.
              </CommandPrimitive.Empty>
              {children}
            </CommandPrimitive.List>
          </CommandPrimitive>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

function CommandGroup({
  heading,
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      heading={heading}
      className={cn(
        "[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5",
        "[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold",
        "[&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[var(--tracking-widest2)]",
        "[&_[cmdk-group-heading]]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm",
        "outline-none transition-colors duration-100",
        "data-[selected=true]:bg-[color-mix(in_srgb,var(--brass)_12%,transparent)] data-[selected=true]:text-foreground",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:opacity-70",
        className,
      )}
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      className={cn("my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "ml-auto text-[10px] font-medium uppercase tracking-widest text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  CommandDialog,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
};
