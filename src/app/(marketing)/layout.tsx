import type { ReactNode } from "react";

/**
 * `(marketing)` route group — URL stays at `/`. Hosts the public Tantava marketing shell.
 * Background is the porcelain neutral so sections (which provide their own bg) can layer over it.
 */
export default function MarketingLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--porcelain)] font-sans text-foreground">
      {children}
    </div>
  );
}
