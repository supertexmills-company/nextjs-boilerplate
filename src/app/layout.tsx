import type { Metadata, Viewport } from "next";
import { Manrope, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import { StoreProvider } from "@/app/providers";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  display: "optional",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F6F1E8",
};

export const metadata: Metadata = {
  title: "Tantava — Real-time linen, garment, and uniform tracking",
  description:
    "Tantava is the operations platform for premium hospitality textiles. Washable RFID tags, fixed portals, handheld scanners, and a real-time dashboard for hotels, hospitals, commercial laundries, and uniform rental operators.",
  applicationName: "Tantava",
  authors: [{ name: "Tantava" }],
  keywords: [
    "linen tracking",
    "RFID linen",
    "hospitality operations",
    "uniform rental",
    "commercial laundry software",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${cormorant.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/* suppressHydrationWarning: browser extensions (e.g. Grammarly) inject attributes on <body>. */}
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
