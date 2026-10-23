import type { Metadata } from "next";
import { Poppins, Inter, Geist } from "next/font/google";
import "./globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryNav from "@/components/layout/CategoryNav";
import { cn } from "@/lib/utils";
import { ShopProvider } from "@/components/ShopContext"; // Імпортуємо наш контекст із components

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "300VetСвіт",
  description: "Все необхідне для ваших домашніх улюбленців",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={cn("font-sans", geist.variable)}>
      <body className={`${poppins.variable} ${inter.variable}`}>
        <ShopProvider>
          <Header />
          <CategoryNav />

          <main>{children}</main>

          <Footer />
        </ShopProvider>
      </body>
    </html>
  );
}
