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
  appleWebApp: {
    capable: true,
    title: "APU Pathfinder",
    statusBarStyle: "black",
    startupImage: {
      url: icon.src,
    },
  },
  icons: {
    icon: "/icon.webp",
    apple: "/apple-icon.webp",
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
      <link
        rel="apple-touch-icon"
        href="/apple-icon?<generated>"
        type="image/<generated>"
        sizes="<generated>"
      />
      <meta name="theme-color" content="#000000"></meta>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
