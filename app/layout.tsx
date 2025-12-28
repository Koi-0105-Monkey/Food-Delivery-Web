import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import { CartProvider } from "@/components/CartContext";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FoodDelivery - Delicious Food Delivered to Your Doorstep",
  description: "Order your favorite food online and get it delivered fast. Fresh, delicious, and always satisfying.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Navbar />
        <CartProvider>{children}</CartProvider>
        <Footer />
      </body>
    </html>
  );
}
