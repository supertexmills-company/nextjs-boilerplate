import type { ReactNode } from "react";

/**
 * Route group `(marketing)` — URL stays `/`; isolates public marketing shell from future app routes.
 * Visual shell (background, grain) lives here so `page` stays a thin composition root.
 */
export default function MarketingLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-altimeter font-sans text-navy">
      <div className="grain" aria-hidden />
      {children}
    </div>
  );
}
