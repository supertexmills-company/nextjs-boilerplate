import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces, Geist_Mono } from "next/font/google";
import { StoreProvider } from "@/app/providers";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "LineTrack   — Enterprise linen, garment, and uniform tracking",
  description:
    "Washable   tags, fixed portals, handheld scanners, and a real-time dashboard for hotels, hospitals, commercial laundries, and textile rental operators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${fraunces.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/* suppressHydrationWarning: browser extensions (e.g. Grammarly) inject attributes on <body>. */}
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        {/* suppressHydrationWarning: browser extensions (e.g. Grammarly) inject attributes on <body>. */}
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
