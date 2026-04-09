import type { Metadata } from "next";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.sanierung.title,
    description: dict.sanierung.subtitle,
  };
}

export default function KonfiguratorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
