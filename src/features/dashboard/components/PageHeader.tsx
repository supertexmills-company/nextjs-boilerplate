import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageHeaderProps = {
  kicker?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({ kicker, title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-3">
        {kicker ? <p className="kicker">{kicker}</p> : null}
        <h1 className="font-display text-[40px] font-medium leading-[0.98] tracking-[var(--tracking-display)] text-foreground md:text-[56px]">
          {title}
        </h1>
        {subtitle ? (
          <p className="max-w-2xl text-base leading-relaxed text-[var(--text-soft)]">{subtitle}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>
      ) : null}
    </div>
  );
}
