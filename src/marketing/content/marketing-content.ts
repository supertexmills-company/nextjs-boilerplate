/**
 * Single source of truth for marketing page content.
 *
 * All copy and data referenced by the marketing route group (`/`) is exported
 * from this file. Editors can iterate copy without touching JSX.
 *
 * TODO(content): every `TODO(content)` comment in this file marks data the user
 * (you) needs to swap in before the marketing site is "real". The site ships
 * safely with the placeholder values — they read as obvious placeholders
 * (e.g. "Hotel Brand A") rather than fake quotes, so visitors can't be misled.
 */

export type CustomerLogo = {
  /** Customer display name (also used as alt text). */
  name: string;
  /** Path under /public — prefer grayscale SVGs for a clean strip. */
  src: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  title: string;
  company: string;
  /** Path under /public/marketing/testimonials. Falls back to initials avatar in component. */
  headshot?: string;
};

export type OutcomeStat = {
  /** Headline number, e.g. "72%", "$1.2M", "12.4M". */
  value: string;
  /** What the number measures. */
  label: string;
  /** Where the number came from — a named property / chain / segment. */
  attribution: string;
};

export type Program = {
  id: string;
  title: string;
  subtitle: string;
  feeling: string;
  /** Path under /public/marketing/programs. MUST be unique per program. */
  image: string;
  imageAlt: string;
  tag: string;
};

export type PricingTier = {
  name: string;
  /** One-line audience descriptor — appears as a kicker. */
  fit: string;
  /** Indicative price line, e.g. "From $499 / property / month" or "Custom". */
  price: string;
  /** Short positioning sentence. */
  description: string;
  /** 4–6 included items with check marks. */
  features: string[];
  /** Visually highlight this tier (brass border + tinted background). */
  highlight?: boolean;
  /** CTA label override (default "Request a demo"). */
  ctaLabel?: string;
};

// =============================================================================
// Customer logos (under hero)
// =============================================================================

export const customerLogos: CustomerLogo[] = [
  // TODO(content): replace these with 5–6 real customer logos.
  // Drop grayscale SVGs into /public/marketing/logos/ and update paths.
  { name: "Hotel Brand A", src: "/marketing/logos/brand-a.svg" },
  { name: "Hotel Brand B", src: "/marketing/logos/brand-b.svg" },
  { name: "Hotel Brand C", src: "/marketing/logos/brand-c.svg" },
  { name: "Hotel Brand D", src: "/marketing/logos/brand-d.svg" },
  { name: "Hotel Brand E", src: "/marketing/logos/brand-e.svg" },
];

// =============================================================================
// Testimonials (named, attributed quotes)
// =============================================================================

export const testimonials: Testimonial[] = [
  // TODO(content): replace each entry with a REAL quote from a named buyer.
  // Headshots: drop JPGs into /public/marketing/testimonials/ at ~256x256.
  {
    quote:
      "REPLACE_WITH_REAL_QUOTE — one or two sentences about a measurable outcome, in the buyer's own voice.",
    name: "Full Name",
    title: "Director of Operations",
    company: "Hotel Group Name",
    headshot: "/marketing/testimonials/person-1.jpg",
  },
  {
    quote:
      "REPLACE_WITH_REAL_QUOTE — emphasize what changed after rollout, ideally with a number.",
    name: "Full Name",
    title: "VP Housekeeping",
    company: "Resort Brand Name",
    headshot: "/marketing/testimonials/person-2.jpg",
  },
  {
    quote:
      "REPLACE_WITH_REAL_QUOTE — leadership perspective on visibility and control.",
    name: "Full Name",
    title: "Chief Operating Officer",
    company: "Hospitality Group Name",
    headshot: "/marketing/testimonials/person-3.jpg",
  },
];

// =============================================================================
// Outcome stats (attributed, replaces weasel-word "Up to 70%" stats)
// =============================================================================

export const outcomeStats: OutcomeStat[] = [
  // TODO(content): replace each value/attribution with REAL, attributable numbers
  // from current customers. These appear in the hero trust-line AND in CredibilityBar.
  {
    value: "ENTER_REAL_NUMBER",
    label: "Linen loss reduction",
    attribution: "Hotel chain, 14 properties",
  },
  {
    value: "ENTER_REAL_NUMBER",
    label: "Replacement spend cut",
    attribution: "Resort group, year-1",
  },
  {
    value: "ENTER_REAL_NUMBER",
    label: "Inventory confidence",
    attribution: "Across active deployments",
  },
];

// =============================================================================
// Programs (5 distinct use cases — each MUST have its own image)
// =============================================================================

export const programs: Program[] = [
  {
    id: "luxury-hotels",
    title: "Luxury hotels",
    subtitle: "Premium property operations",
    feeling:
      "Maintain full linen and uniform visibility across departments while improving service consistency for high-expectation guests.",
    // TODO(content): confirm filename — should be a luxury-hotel-specific photo.
    image: "/marketing/programs/luxury-hotels.jpg",
    imageAlt: "Luxury hotel linen prepared for daily operations",
    tag: "Premium segment",
  },
  {
    id: "resorts",
    title: "Resorts",
    subtitle: "Multi-area coordination",
    feeling:
      "Coordinate textile movement across rooms, spas, pools, and F&B outlets with one operational view.",
    // TODO(content): confirm filename — must be a resort photo, NOT the previous hospital image.
    image: "/marketing/programs/resorts.jpg",
    imageAlt: "Resort operations team preparing textiles across guest services",
    tag: "Multi-zone control",
  },
  {
    id: "hotel-chains",
    title: "Hotel chains",
    subtitle: "Portfolio-wide governance",
    feeling:
      "Standardize operational oversight and performance benchmarks across properties while giving each site clear accountability.",
    // TODO(content): confirm filename — should be a multi-property/chain photo.
    image: "/marketing/programs/hotel-chains.jpg",
    imageAlt: "Regional hospitality team reviewing multi-property operations",
    tag: "Portfolio insight",
  },
  {
    id: "hospitality-groups",
    title: "Hospitality groups",
    subtitle: "Operational intelligence layer",
    feeling:
      "Give finance and operations leaders one source of truth for inventory health, usage trends, and loss patterns.",
    // TODO(content): confirm filename — should be a leadership/data review photo.
    image: "/marketing/programs/hospitality-groups.jpg",
    imageAlt: "Hospitality group leadership reviewing operational intelligence metrics",
    tag: "Executive visibility",
  },
  {
    id: "laundry-partners",
    title: "Laundry operations providers",
    subtitle: "Service reliability and control",
    feeling:
      "Improve delivery reliability, reduce avoidable rework, and maintain transparent inventory accountability for hotel clients.",
    // TODO(content): confirm filename — should be a laundry-specific photo distinct from hotel-chains.
    image: "/marketing/programs/laundry-partners.jpg",
    imageAlt: "Laundry operations partner managing hospitality textile workflows",
    tag: "Service efficiency",
  },
];

// =============================================================================
// Pricing tiers
// =============================================================================

export const pricingTiers: PricingTier[] = [
  // TODO(content): replace each `price` with your actual indicative number.
  // Keep "From $… / property / month" framing for Starter + Professional, and
  // "Custom" for Enterprise. Feature lists are editable — keep 4–6 items.
  {
    name: "Starter",
    fit: "Single property",
    price: "From $REAL_PRICE / property / month",
    description:
      "For single-property teams building foundational operational visibility.",
    features: [
      "Up to 5,000 tracked items",
      "RFID handheld + 1 fixed portal",
      "Email + in-app alerts",
      "Single-property dashboard",
      "Standard support",
    ],
  },
  {
    name: "Professional",
    fit: "Growing hotels",
    price: "From $REAL_PRICE / property / month",
    description:
      "For multi-property groups standardizing control and improving operational efficiency.",
    features: [
      "Unlimited tracked items",
      "Multi-property roll-up dashboard",
      "Advanced loss-pattern analytics",
      "Role-based access + audit log",
      "Enterprise SSO (SAML, Okta)",
      "Priority support",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    fit: "Hotel chains",
    price: "Custom",
    description:
      "For large portfolios requiring governance, performance consistency, and executive oversight.",
    features: [
      "Everything in Professional",
      "Dedicated customer success",
      "Custom integrations + SLAs",
      "Region-specific data residency",
      "Quarterly executive reviews",
    ],
    ctaLabel: "Talk to sales",
  },
];

// =============================================================================
// Hero supporting copy
// =============================================================================

export const heroTrustLine = {
  /**
   * Composed at render time from outcomeStats[0]. Centralized here so it stays
   * in sync with the CredibilityBar attributions.
   */
  prefix: "Trusted by operations leaders",
};
