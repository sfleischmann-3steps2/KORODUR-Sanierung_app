import type { Metadata } from "next";
import { Gabarito } from "next/font/google";
import "./globals.css";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  variable: "--font-gabarito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sanieren mit KORODUR",
  description:
    "KORODUR bietet professionelle Sanierungslösungen für Industrieboden, Industriebau und Infrastruktur. Schnelle Reparaturen, dauerhafte Ergebnisse.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${gabarito.variable} antialiased`}>
      <body className="min-h-screen flex flex-col" style={{ fontFamily: "'Gabarito', Arial, sans-serif" }}>
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
