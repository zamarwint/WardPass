import type { Metadata } from "next";
import { dmSerifDisplay, geistSans, geistMono } from "./fonts"
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "WardPass",
  description: "The smartest way to secure your life.",
  icons: [
    {
      rel: "icon",
      url: "/wp-logo-light.svg",
      media: "(prefers-color-scheme: light)"
    },
    {
      rel: "icon",
      url: "/wp-logo-dark.svg",
      media: "(prefers-color-scheme: dark)"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)} data-scroll-behavior="smooth">
      <body className={`${geistSans.className} ${geistMono.variable} ${dmSerifDisplay.variable} antialiased min-h-screen overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster className="font-sans" />
        </ThemeProvider>
      </body>
    </html>
  )
}
