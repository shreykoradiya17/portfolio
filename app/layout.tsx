import type { Metadata, Viewport } from "next";
import { Archivo, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SpecProvider } from "@/lib/spec";
import { TransitionProvider } from "@/lib/transition";
import { IntroProvider } from "@/lib/intro";
import SmoothScroll from "@/components/chrome/SmoothScroll";
import Cursor from "@/components/chrome/Cursor";
import Nav from "@/components/chrome/Nav";
import SpecHud from "@/components/chrome/SpecHud";
import Registration from "@/components/chrome/Registration";
import { site } from "@/data/site";

/** Variable grotesk. The width axis is the point — display type gets
 *  compressed to 88 without a second licensed font. */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

/** The drawn voice: every label, number and annotation. */
const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

/** Reserved for roughly four words on the entire site. */
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description:
    "Shrey Patel designs interfaces and builds them. UI/UX and frontend engineering — React, Next.js, TypeScript, design systems and creative development. Ahmedabad, India.",
  keywords: [
    "UI/UX designer", "frontend developer", "React", "Next.js", "TypeScript",
    "design systems", "GSAP", "Three.js", "creative developer", "Ahmedabad",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: "Interface design and frontend engineering. The handoff happens in my head.",
    type: "website",
    locale: "en_IN",
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: "Interface design and frontend engineering.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F1EC" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0C" },
  ],
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-spec="off"
      className={`${archivo.variable} ${geistMono.variable} ${instrument.variable}`}
    >
      <body>
        <SpecProvider>
         <IntroProvider>
          <TransitionProvider>
            <a href="#main" className="skip t-meta">Skip to content</a>
            <SmoothScroll />
            <Cursor />
            <Registration />
            <Nav />
            {children}
            <SpecHud />
            <div className="grain" aria-hidden="true" />
          </TransitionProvider>
         </IntroProvider>
        </SpecProvider>
      </body>
    </html>
  );
}
