import { Providers } from "@/lib/providers";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import icon from "./icon.webp";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "/",
  },
  title: "APU Pathfinder",
  description:
    "Find your Asia Pacific University (APU) classroom through interactive map. Developed by Danish Nasarudin",
  appleWebApp: {
    capable: true,
    title: "APU Pathfinder",
    statusBarStyle: "black",
    startupImage: {
      url: icon.src,
    },
  },
  icons: {
    icon: new URL("/icon.webp", baseUrl),
    apple: new URL("/apple-icon.webp", baseUrl),
  },
  openGraph: {
    siteName: "APU Pathfinder",
    title: "APU Pathfinder",
    description:
      "Find your Asia Pacific University (APU) classroom through interactive map. Developed by Danish Nasarudin",
    images: [
      {
        url: icon.src,
        width: 500,
        height: 500,
        alt: "APU Pathfinder",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
