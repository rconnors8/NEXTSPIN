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
  title: "NextSpin 360 Photo Booth Renting",
  description: "Experience the magic of 360-degree photo booth rentals. Perfect for weddings, corporate events, parties, and special occasions. Create unforgettable memories with NextSpin.",
  icons: {
    icon: [
      {
        url: "/images/logo.png",
        type: "image/png",
        sizes: "32x32"
      },
      {
        url: "/images/logo.png",
        type: "image/png",
        sizes: "16x16"
      }
    ],
    apple: [
      {
        url: "/images/logo.png",
        type: "image/png",
        sizes: "180x180"
      }
    ],
    shortcut: [{ url: "/images/logo.png" }],
    other: [
      {
        rel: "icon",
        url: "/images/logo.png",
      },
    ],
  },
  manifest: "/manifest.json",
  viewport: {
    width: 'device-width',
    initialScale: 1
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/images/logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/logo.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} bg-black bg-dotted-grid`}>{children}</body>
    </html>
  );
}
