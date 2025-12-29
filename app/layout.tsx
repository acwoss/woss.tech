import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope, Noto_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "woss.tech - IT Consulting Services",
  description:
    "Expert IT consulting in Cloud Architecture, Cyber Security, and AI. We build the resilient digital infrastructure your future needs.",
  keywords: [
    "IT consulting",
    "cloud architecture",
    "cybersecurity",
    "data analytics",
    "AI consulting",
    "enterprise software",
    "SaaS platforms",
  ],
  openGraph: {
    title: "woss.tech - IT Consulting Services",
    description:
      "Transforming businesses through intelligent technology solutions. We build the infrastructure your future needs.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} ${notoSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
