import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import IntroLoader from "@/components/IntroLoader"; // 👈 1. เพิ่มการนำเข้า IntroLoader ตรงนี้

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ชุมชนปลาแดดเดียว - ของดีประจำชุมชน",
  description: "สินค้าปลาแดดเดียวสูตรลับเฉพาะชุมชน ส่งตรงถึงหน้าบ้านคุณ สะอาด ปลอดภัย",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-50">
        <IntroLoader /> {/* 👈 2. แทรก IntroLoader ไว้เป็นสิ่งแรกสุดใน body */}
        {children}
      </body>
    </html>
  );
}
