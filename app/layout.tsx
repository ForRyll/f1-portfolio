import type { Metadata, Viewport } from "next";
import { inter, barlowCondensed } from "@/lib/fonts";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Navbar from "@/components/Navbar";
import BackToTop from "@/components/BackToTop";
import LightsOut from "@/components/LightsOut";
import PitRadio from "@/components/PitRadio";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const TITLE = "ZRIL — Creative Developer Portfolio";
const DESCRIPTION =
  "Portfolio Nazril Irfani (Zril), mahasiswa Informatika dan front-end developer. Website, aplikasi, dan pengalaman digital dengan animasi yang hidup.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | ZRIL",
  },
  description: DESCRIPTION,
  keywords: [
    "Nazril Irfani",
    "Zril",
    "portfolio",
    "front-end developer",
    "web developer",
    "Purwokerto",
    "Next.js",
    "Laravel",
  ],
  authors: [{ name: "Nazril Irfani" }],
  creator: "Nazril Irfani",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "ZRIL",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Nazril Irfani",
  alternateName: "Zril",
  jobTitle: "Front-End Developer",
  url: SITE_URL,
  sameAs: [
    "https://www.instagram.com/azrllrfn/",
    "https://github.com/ForRyll",
    "https://x.com/azrllrfn",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${barlowCondensed.variable}`}
    >
      <body>
        <a
          href="#about"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:bg-[#FF8000] focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:uppercase focus:tracking-[0.2em] focus:text-black"
        >
          Lewati ke konten utama
        </a>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <SmoothScroll>
          <Cursor />
          <Navbar />
          {children}
          <LightsOut />
          <BackToTop />
          <PitRadio />
        </SmoothScroll>
      </body>
    </html>
  );
}