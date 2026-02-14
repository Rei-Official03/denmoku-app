// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import CosmicBackground from "./public/components/CosmicBackground";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SongList",
  description: "デンモク風ソング検索",
  themeColor: "#14204A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={[
          inter.className,
          "min-h-screen text-[#F7FAFF] antialiased bg-[#14204A] relative overflow-x-hidden",
        ].join(" ")}
      >
        {/* Cosmic Lounge 背景 */}
        <CosmicBackground />

        {/* Page content */}
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}