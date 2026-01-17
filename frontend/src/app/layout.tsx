import type { Metadata } from "next";
import { Manrope, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Astra Spiritual - Authentic Spiritual Products",
  description:
    "India's most trusted destination for lab-certified gemstones, authentic Rudraksha, and sacred spiritual items.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={cn(
          "light",
          manrope.variable,
          playfair.variable,
          inter.variable
        )}
      >
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="font-sans antialiased bg-background-light dark:bg-background-dark text-[#161513] dark:text-white">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
