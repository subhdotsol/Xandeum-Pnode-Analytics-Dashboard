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
