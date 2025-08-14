import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Present Perfect - AI-Powered Gift Recommendations",
    template: "%s | Present Perfect",
  },
  description:
    "Discover the perfect gift with AI-powered personalized recommendations. Take our smart quiz and get thoughtful gift ideas tailored to any personality, occasion, and budget.",
  keywords: [
    "gift recommendations",
    "AI gift finder",
    "personalized gifts",
    "gift ideas",
    "birthday gifts",
    "Christmas gifts",
    "anniversary gifts",
    "gift quiz",
    "thoughtful gifts",
    "present ideas",
    "gift suggestions",
    "AI-powered gifts",
  ],
  authors: [{ name: "Present Perfect Team" }],
  creator: "Present Perfect",
  publisher: "Present Perfect",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://present-perfect.vercel.app"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Present Perfect - AI-Powered Gift Recommendations",
    description:
      "Discover the perfect gift with AI-powered personalized recommendations. Take our smart quiz and get thoughtful gift ideas tailored to any personality, occasion, and budget.",
    siteName: "Present Perfect",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Present Perfect - AI Gift Recommendations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Present Perfect - AI-Powered Gift Recommendations",
    description:
      "Discover the perfect gift with AI-powered personalized recommendations. Take our smart quiz and get thoughtful gift ideas.",
    images: ["/og-image.png"],
    creator: "@presentperfect",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5",
      },
    ],
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": "#da532c",
    "theme-color": "#ffffff",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Present Perfect",
    description:
      "AI-powered gift recommendation platform that helps you find the perfect gift for any occasion",
    url:
      process.env.NEXT_PUBLIC_SITE_URL || "https://present-perfect.vercel.app",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Organization",
      name: "Present Perfect Team",
    },
    featureList: [
      "AI-powered gift recommendations",
      "Personalized quiz system",
      "Multiple recipient profiles",
      "Gift card message generator",
      "Occasion-based themes",
      "Save and share gift ideas",
    ],
  };

  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="gGFsp8234F1jnCLd0Ydol_knsKihcxDPY306RIHEGlQ"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Present Perfect" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Present Perfect" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        google-site-verification: google83470e9317b97a7c.html
        <Toaster />
      </body>
    </html>
  );
}
