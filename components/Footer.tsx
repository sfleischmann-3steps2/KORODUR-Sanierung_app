import Link from "next/link";

export default function Footer() {
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
            Sanieren mit System. Seit 1936.
          </span>
        </div>
        <div className="flex items-center gap-6 text-[14px]">
          <Link href="/portfolio" className="text-white opacity-70 hover:opacity-100 no-underline transition-opacity">
            Portfolio
          </Link>
          <Link href="/" className="text-white opacity-70 hover:opacity-100 no-underline transition-opacity">
            Startseite
          </Link>
        </div>
        <div className="text-[13px] opacity-40 text-center md:text-right">
          &copy; {new Date().getFullYear()} KORODUR. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}
