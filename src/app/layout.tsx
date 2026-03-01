import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/layout";
import "./globals.css";
import { QueryProvider } from "@/components/provider/query-provider";

const inter = Inter({
  variable: "--font-inter",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArenaBook - Every Match Start Here",
  description:
    "Find and book sports courts near you. Football, Badminton, Basketball courts available. Easy booking, instant confirmation.",
  keywords: [
    "sports court booking",
    "football court",
    "badminton court",
    "arena booking",
    "sports venue",
  ],
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} antialiased min-h-full flex flex-col`}>
        <SessionProvider>
          <QueryProvider>
            <Navbar />
            <main className="flex-1 flex w-full flex-col pt-16">{children}</main>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

