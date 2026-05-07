"use client";

import { useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
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
        className={cn("h-11 bg-background/80 pr-11", className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:bg-muted/50 hover:text-amber"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
      >
        {visible ? <EyeOff className="size-[1.125rem] stroke-[1.75]" aria-hidden /> : <Eye className="size-[1.125rem] stroke-[1.75]" aria-hidden />}
      </Button>
    </div>
  );
}
