import AppLogo from "@/marketing/components/ui/AppLogo";

const solutions = [
  { label: "Hotels & resorts", href: "#programs" },
  { label: "Hospitals & healthcare", href: "#programs" },
  { label: "Commercial laundries", href: "#programs" },
  { label: "Uniform & textile rental", href: "#programs" },
];

const company = [
  { label: "How it works", href: "#journey" },
  { label: "Customer stories", href: "#stories" },
  { label: "Book a demo", href: "#booking" },

];

const support = [
  { label: "Contact sales", href: "#booking" },
  { label: "Deployment overview", href: "#email-capture" },
  { label: "Hardware &  ", href: "#programs" },
  { label: "Privacy policy", href: "#" },
];

function FooterLinkList({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold tracking-wide text-navy">
        {title}
      </h2>
      <ul className="space-y-3">
        {links.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className="text-sm font-medium text-brand-muted transition-colors hover:text-navy"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-navy/10 bg-altimeter">
      <div className="mx-auto max-w-7xl px-6 pt-14 pb-6 md:pt-16 md:pb-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-1 lg:max-w-sm">
            <a href="#" className="mb-5 inline-flex items-center gap-2">
              <AppLogo
                size={28}
                src="/brand/linetrack-logo.svg"
                iconName="SignalIcon"
                text="LineTrack  "
              />
            </a>
            <p className="text-sm font-normal leading-relaxed text-brand-muted">
               -based linen, garment, and uniform tracking for hotels,
              hospitals, commercial laundries, and rental operators — with portals,
              handhelds, and a live operations dashboard.
            </p>
          </div>

          <FooterLinkList title="Solutions" links={solutions} />
          <FooterLinkList title="Company" links={company} />
          <FooterLinkList title="Support" links={support} />
        </div>

        <div className="mt-12 border-t border-navy/10 pt-8 md:mt-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-brand-muted">
              © {new Date().getFullYear()} LineTrack  . All rights reserved.
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              <a
                href="#"
                className="text-sm font-medium text-brand-muted transition-colors hover:text-navy"
              >
                Privacy policy
              </a>
              <a
                href="#"
                className="text-sm font-medium text-brand-muted transition-colors hover:text-navy"
              >
                Terms of service
              </a>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] font-medium tracking-widest2 text-brand-muted/50 uppercase sm:text-left">
            tags · Fixed portals · Handheld scanners · Real-time dashboard
        </p>
      </div>
    </footer>
  );
}
