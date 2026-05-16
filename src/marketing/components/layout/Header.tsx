"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import AppLogo from "@/marketing/components/ui/AppLogo";

const NAV_LINKS = [
  { label: "Use Cases", href: "#programs" },
  { label: "How It Works", href: "#journey" },
  { label: "Business Impact", href: "#stories" },
  { label: "Pricing", href: "#booking" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const navLinkClass = scrolled
    ? "text-[var(--text-soft)] hover:text-[var(--text)]"
    : "text-[color-mix(in_srgb,var(--surface)_92%,transparent)] hover:text-[var(--surface)]";
  const authLinkClass = scrolled
    ? "border-border text-[var(--text-soft)] hover:border-[var(--accent-soft)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
    : "border-[color-mix(in_srgb,var(--surface)_34%,transparent)] bg-[color-mix(in_srgb,var(--ink)_24%,transparent)] text-[var(--surface)] hover:border-[color-mix(in_srgb,var(--surface)_64%,transparent)] hover:bg-[color-mix(in_srgb,var(--ink)_34%,transparent)]";

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      const max = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      setProgress(Math.min(1, Math.max(0, y / max)));
      raf = 0;
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "nav-scrolled py-3" : "py-5"
      }`}
      aria-label="Primary"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          aria-label="Tantava — home"
          className="outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-[var(--brass-glow)]"
        >
          <span className="inline-flex flex-col leading-none">
            <AppLogo size={36} text="Tantava" tone={scrolled ? "dark" : "light"} />
            <span
              className={`ml-[46px] mt-0.5 text-[10px] font-medium tracking-[0.08em] uppercase ${
                scrolled ? "text-[var(--text-soft)]" : "text-[color-mix(in_srgb,var(--surface)_84%,transparent)]"
              }`}
            >
              Intelligence
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={`nav-link text-[13px] font-medium tracking-[0.015em] transition-colors ${navLinkClass}`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2.5 md:flex">
          <Link
            href="/login"
            className={`rounded-[16px] border px-5 py-2.5 text-[13px] font-medium transition-colors ${authLinkClass}`}
          >
            Log in
          </Link>
          <a href="#booking" className="btn-amber rounded-[16px] px-5 py-2.5 text-[13px]">
            Request demo
          </a>
        </div>

        <button
          type="button"
          className={`p-2 md:hidden ${scrolled ? "text-[var(--text)]" : "text-[var(--surface)]"}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <div className="w-5 space-y-1.5">
            <span
              className={`block h-px bg-current transition-all duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
            />
            <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span
              className={`block h-px bg-current transition-all duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </div>
        </button>
      </div>

      {/* Scroll progress hairline */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-[1.5px] origin-left bg-[var(--brass)] opacity-80"
        style={{ transform: `scaleX(${progress})`, width: "100%" }}
      />

      {/* Mobile full-screen overlay menu */}
      <div
        id="mobile-nav"
        className={`fixed inset-x-0 top-[calc(100%)] z-40 origin-top overflow-hidden md:hidden ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <div
          className={`mx-3 mt-2 origin-top transform rounded-2xl border border-border bg-[var(--bg)]/98 backdrop-blur-xl shadow-[var(--e2)] transition-all duration-300 ${
            menuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
        >
          <ul className="flex flex-col gap-1 px-4 py-4">
            {NAV_LINKS.map((link, idx) => (
              <li
                key={link.label}
                style={{ transitionDelay: menuOpen ? `${idx * 60}ms` : "0ms" }}
                className={`transition-all duration-300 ${menuOpen ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0"}`}
              >
                <a
                  href={link.href}
                  className="block rounded-xl px-3 py-3 font-medium text-[var(--text-soft)] hover:bg-[var(--surface)] hover:text-[var(--accent)]"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="border-t border-border p-3">
            <div className="flex flex-col gap-2.5">
              <Link
                href="/login"
                className="rounded-[16px] border border-border py-3 text-center text-[13px] font-medium text-[var(--text-soft)]"
                onClick={() => setMenuOpen(false)}
              >
                Log in
              </Link>
              <a
                href="#booking"
                className="btn-amber rounded-[16px] py-3 text-center text-[13px]"
                onClick={() => setMenuOpen(false)}
              >
                Request demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
