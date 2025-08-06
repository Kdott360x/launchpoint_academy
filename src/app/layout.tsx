// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Launchpoint",
  description: "Your journey starts here",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="bg-gray-100 dark:bg-gray-900 p-4">
          <nav className="max-w-3xl mx-auto flex space-x-6">
            <Link href="/">Home</Link>
            <Link href="/signup">Sign Up</Link>
            <Link href="/login">Log In</Link>
          </nav>
        </header>
        <main className="max-w-3xl mx-auto p-8">{children}</main>
      </body>
    </html>
  );
}
