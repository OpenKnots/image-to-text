import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import clsx from "clsx";

export const metadata: Metadata = {
  title: "Image to Text",
  description: "Image to text, fast.",
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={clsx(
          geist.variable,
          geistMono.variable,
          "font-sans text-foreground antialiased min-h-dvh"
        )}
      >
        <main className="min-h-dvh flex items-center justify-center px-4 py-10 max-w-7xl mx-auto">
          {children}
        </main>

        <Toaster richColors theme="system" />
        <Analytics />
      </body>
    </html>
  );
}