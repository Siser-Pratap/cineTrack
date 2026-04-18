import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CineTrack - Your Personal Movie Tracker",
  description: "Track movies you want to watch and movies you've seen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col antialiased`}>
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
