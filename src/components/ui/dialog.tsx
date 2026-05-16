"use client";

import * as React from "react";
import { Dialog as RadixDialog } from "radix-ui";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Dialog = RadixDialog.Root;
const DialogTrigger = RadixDialog.Trigger;
const DialogPortal = RadixDialog.Portal;
const DialogClose = RadixDialog.Close;

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof RadixDialog.Overlay>) {
  return (
    <RadixDialog.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-[rgba(30,26,23,0.36)] backdrop-blur-sm",
        "data-[state=open]:animate-[dialog-overlay-in_200ms_var(--ease)]",
        "data-[state=closed]:animate-[dialog-overlay-out_180ms_var(--ease)]",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showClose = true,
  size = "md",
  ...props
}: React.ComponentProps<typeof RadixDialog.Content> & {
  showClose?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizeClass = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  }[size];

  return (
    <DialogPortal>
      <DialogOverlay />
      <RadixDialog.Content
        data-slot="dialog-content"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2",
          sizeClass,
          "max-h-[calc(100vh-2rem)] overflow-y-auto",
          "rounded-[24px] border border-border bg-card text-card-foreground shadow-[var(--e3)]",
          "data-[state=open]:animate-[dialog-content-in_220ms_var(--ease)]",
          "data-[state=closed]:animate-[dialog-content-out_180ms_var(--ease)]",
          className,
        )}
        {...props}
      >
        {children}
        {showClose ? (
          <RadixDialog.Close
            className={cn(
              "absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-[14px]",
              "text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent)_40%,transparent)]",
            )}
            aria-label="Close"
          >
            <X className="size-4" />
          </RadixDialog.Close>
        ) : null}
      </RadixDialog.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1.5 px-6 pt-6 pb-2 pr-12", className)}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof RadixDialog.Title>) {
  return (
    <RadixDialog.Title
      data-slot="dialog-title"
      className={cn(
        "font-display text-xl font-medium leading-tight tracking-[var(--tracking-heading)] text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof RadixDialog.Description>) {
  return (
    <RadixDialog.Description
      data-slot="dialog-description"
      className={cn("text-sm leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="dialog-body" className={cn("px-6 py-4", className)} {...props} />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 px-6 pt-2 pb-6",
        "sm:flex-row sm:items-center sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
};
