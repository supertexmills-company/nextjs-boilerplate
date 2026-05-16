"use client";

import { useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type AuthPasswordFieldProps = Omit<ComponentProps<typeof Input>, "type">;

export function AuthPasswordField({ id, className, ...props }: AuthPasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        className={cn("pr-11", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className={cn(
          "absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md",
          "text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--brass)_40%,transparent)]",
        )}
      >
        {visible ? (
          <EyeOff className="size-[1.125rem] stroke-[1.6]" aria-hidden />
        ) : (
          <Eye className="size-[1.125rem] stroke-[1.6]" aria-hidden />
        )}
      </button>
    </div>
  );
}
