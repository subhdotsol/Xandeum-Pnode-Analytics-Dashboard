import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Xandeum pNode Analytics - Real-time Network Monitoring",
  description:
    "Monitor and visualize the health, distribution, and performance of pNodes in the Xandeum distributed storage network.",
  keywords: [
    "Xandeum",
    "pNode",
    "blockchain",
    "analytics",
    "distributed storage",
    "network monitoring",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
