"use client";

import { useEffect, useState } from "react";
import AppLogo from "@/marketing/components/ui/AppLogo";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Solutions", href: "#programs" },
    { label: "How it works", href: "#journey" },
    { label: "Customers", href: "#stories" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
        scrolled ? "nav-scrolled py-3" : "py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <a href="#" className="group flex items-center gap-3">
          <AppLogo
            size={32}
            src="/brand/linetrack-logo.svg"
            iconName="SignalIcon"
            text="LineTrack  "
            className="text-amber"
          />
        </a>

        <div className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="nav-link text-[13px] font-medium tracking-wide text-altimeter/80 transition-colors hover:text-altimeter"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="/login"
            className="rounded-full border border-altimeter/35 px-5 py-2.5 text-[13px] font-medium text-altimeter transition-colors hover:border-altimeter/60 hover:bg-altimeter/10"
          >
            Log in
          </a>
          <a
            href="#booking"
            className="btn-amber rounded-full px-6 py-2.5 text-[13px]"
          >
            Book a demo
          </a>
        </div>

        <button
          type="button"
          className="text-altimeter p-2 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 space-y-1.5">
            <span
              className={`block h-px bg-current transition-all duration-300 ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px bg-current transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-px bg-current transition-all duration-300 ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>
      {menuOpen && (
        <div className="absolute top-full left-0 w-full border-t border-haze/10 bg-navy-deep/98 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1 px-6 py-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="py-2 font-medium text-altimeter/80 transition-colors hover:text-amber"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-3 border-t border-haze/10 pt-4">
              <a
                href="/login"
                className="rounded-full border border-altimeter/35 py-3 text-center text-[13px] font-medium text-altimeter transition-colors hover:bg-altimeter/10"
                onClick={() => setMenuOpen(false)}
              >
                Log in
              </a>
              <a
                href="#booking"
                className="btn-amber rounded-full py-3 text-center text-[13px]"
                onClick={() => setMenuOpen(false)}
              >
                Book a demo
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
