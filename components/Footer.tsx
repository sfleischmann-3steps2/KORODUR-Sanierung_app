import Link from "next/link";
import type { Locale } from "../lib/i18n";
import type { Dictionary } from "../app/[lang]/dictionaries";

const CONTACT_URLS: Record<string, string> = {
  de: "https://www.korodur.de/kontakt/deutschland/",
  en: "https://www.korodur.de/kontakt/international/",
  fr: "https://www.korodur.de/kontakt/international/",
};

export default function Footer({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const contactUrl = CONTACT_URLS[lang] || CONTACT_URLS.en;

  return (
    <footer className="bg-[#001a35] text-white mt-auto">
      <div
        className="mx-auto py-10"
        style={{ maxWidth: 1320, padding: "40px 32px" }}
      >
        {/* Contact CTA */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-10"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(0,158,227,0.15)" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#009ee3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div>
              <div className="text-white text-[16px]" style={{ fontWeight: 800 }}>
                {dict.footer.contact_cta}
              </div>
              <div className="text-white opacity-50 text-[14px]">
                {dict.footer.contact_desc}
              </div>
            </div>
          </div>
          <a
            href={contactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white no-underline rounded-[8px] bg-[#009ee3] hover:bg-[#0090d0] transition-colors duration-200 shrink-0"
            style={{ padding: "12px 24px", fontWeight: 800, fontSize: 14 }}
          >
            {dict.footer.contact_cta}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
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
            <Link href={`/${lang}/referenzen`} className="text-white opacity-70 hover:opacity-100 no-underline transition-opacity">
              {dict.nav.referenzen}
            </Link>
            <a
              href={contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white opacity-70 hover:opacity-100 no-underline transition-opacity"
            >
              {dict.footer.contact_cta}
            </a>
          </div>
          <div className="text-[13px] opacity-40 text-center md:text-right">
            &copy; {new Date().getFullYear()} KORODUR. {dict.footer.copyright}
          </div>
        </div>
      </div>
    </footer>
  );
}
