import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  variable: "--font-ubuntu",
  weight: ["300", "400", "500", "700"],
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${ubuntu.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
