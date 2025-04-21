import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
  style: ['normal'],
})

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "NextSpin - 360° Photo Booth Rentals",
  description: "Create unforgettable memories with NextSpin 360° Photo Booth. Perfect for weddings, corporate events, and parties.",
  icons: {
    icon: [
      {
        url: "/images/logo.svg",
        type: "image/svg+xml",
        sizes: "32x32"
      },
      {
        url: "/images/logo.svg",
        type: "image/svg+xml",
        sizes: "16x16"
      }
    ],
    apple: [
      {
        url: "/images/logo.svg",
        type: "image/svg+xml",
        sizes: "180x180"
      }
    ],
    shortcut: [{ url: "/images/logo.svg" }],
    other: [
      {
        rel: "icon",
        url: "/images/logo.svg",
      },
    ],
  },
  manifest: "/manifest.json",
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" type="image/svg+xml" sizes="32x32" href="/images/logo.svg" />
        <link rel="icon" type="image/svg+xml" sizes="16x16" href="/images/logo.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/logo.svg" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} bg-black bg-dotted-grid`}>{children}</body>
    </html>
  );
}
