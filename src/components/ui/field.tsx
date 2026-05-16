"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type FieldProps = {
  label?: React.ReactNode;
  helper?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  htmlFor?: string;
  className?: string;
  labelClassName?: string;
  children: React.ReactNode;
};

/**
 * <Field label helper error required>{input}</Field>
 * Wraps a form control with consistent label, helper, and error treatment.
 * Use `htmlFor` to associate label with the control's id.
 */
function Field({
  label,
  helper,
  error,
  required,
  optional,
  htmlFor,
  className,
  labelClassName,
  children,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label ? (
        <label
          htmlFor={htmlFor}
          className={cn(
            "flex items-center gap-2 text-[13px] font-semibold tracking-[0.01em] text-[var(--text-soft)]",
            labelClassName,
          )}
        >
          <span>{label}</span>
          {required ? <span className="text-[var(--danger)]">*</span> : null}
          {optional ? (
            <span className="text-xs font-normal text-muted-foreground">(optional)</span>
          ) : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <p className="text-xs leading-relaxed text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : helper ? (
        <p className="text-xs leading-relaxed text-muted-foreground">{helper}</p>
      ) : null}
    </div>
  );
}

export { Field };
