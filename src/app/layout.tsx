import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { testConnection } from "../lib/db";
import "./globals.css";

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

//test database connection
testConnection();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
