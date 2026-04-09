import type { Metadata } from "next";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.microtop.title,
    description: dict.microtop.subtitle,
  };
}

export default function MicrotopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
