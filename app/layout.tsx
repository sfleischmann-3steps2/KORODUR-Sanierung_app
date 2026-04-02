import type { Metadata } from "next";
import "./globals.css";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

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
    <html lang="de" className="antialiased">
      <body className="min-h-screen flex flex-col" style={{ fontFamily: "'Gabarito', Arial, sans-serif" }}>
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
