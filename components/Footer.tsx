import Link from "next/link";
import type { Locale } from "../lib/i18n";
import type { Dictionary } from "../app/[lang]/dictionaries";

export default function Footer({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  return (
    <footer className="bg-[#001a35] text-white mt-auto">
      <div
        className="mx-auto flex flex-col md:flex-row items-center justify-between gap-6 py-10"
        style={{ maxWidth: 1320, padding: "40px 32px" }}
      >
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-[20px] tracking-tight" style={{ fontWeight: 900 }}>
            KORODUR
          </span>
          <span className="text-[13px] opacity-50">
            {dict.footer.tagline}
          </span>
        </div>
        <div className="flex items-center gap-6 text-[14px]">
          <Link href={`/${lang}/portfolio`} className="text-white opacity-70 hover:opacity-100 no-underline transition-opacity">
            {dict.nav.portfolio}
          </Link>
          <Link href={`/${lang}`} className="text-white opacity-70 hover:opacity-100 no-underline transition-opacity">
            {dict.nav.home}
          </Link>
        </div>
        <div className="text-[13px] opacity-40 text-center md:text-right">
          &copy; {new Date().getFullYear()} KORODUR. {dict.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
