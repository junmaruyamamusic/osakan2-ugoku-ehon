import type { Metadata } from "next";
import { Geist, Geist_Mono, M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rounded = M_PLUS_Rounded_1c({
  variable: "--font-rounded",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "わくわくえほんパラダイス - みんなで作る動く絵本",
  description:
    "かわいいアニメーション付きのオリジナル絵本を簡単に作れるWebアプリです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rounded.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
