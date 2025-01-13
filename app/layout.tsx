import { Providers } from "@/lib/providers";
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "APU Pathfinder",
  description:
    "Find your classroom through interactive map. Developed by Danish Nasarudin",
  appleWebApp: true,
  icons: {
    icon: "/icon.webp",
  },
  openGraph: {
    title: "APU Pathfinder",
    description:
      "Find your classroom through interactive map. Developed by Danish Nasarudin",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
