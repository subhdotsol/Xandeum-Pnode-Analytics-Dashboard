import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SolanaWalletProvider } from "@/contexts/wallet-provider";
import { DataPrefetchProvider } from "@/contexts/prefetch-context";
import { AiAssistant } from "@/components/ai-assistant";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Xandeum Explorer",
  description: "Real-time analytics and monitoring for the Xandeum pNode network",
  icons: {
    icon: '/xandeum-logo.png',
    shortcut: '/xandeum-logo.png',
    apple: '/xandeum-logo.png',
  },
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
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SolanaWalletProvider>
            <DataPrefetchProvider>
              {children}
              <AiAssistant />
            </DataPrefetchProvider>
          </SolanaWalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
