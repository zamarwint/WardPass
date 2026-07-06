import type { Metadata } from "next";
import { geistSans, inter, jetbrainsMono } from "./fonts"
import "./globals.css";
import { ThemeProvider } from "./_components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "WardPass",
  description: "The smartest way to secure your life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${geistSans.variable} ${jetbrainsMono.variable} antialiased min-h-screen overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
