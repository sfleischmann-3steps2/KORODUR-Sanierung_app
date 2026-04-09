"use client";

import TopNav from "./TopNav";
import Footer from "./Footer";
import type { Locale } from "../lib/i18n";
import type { Dictionary } from "../app/[lang]/dictionaries";

export default function AppShell({
  lang,
  dict,
  children,
}: {
  lang: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav lang={lang} dict={dict} />
      <main className="flex-1">
        {children}
        <Footer lang={lang} dict={dict} />
      </main>
    </div>
  );
}
