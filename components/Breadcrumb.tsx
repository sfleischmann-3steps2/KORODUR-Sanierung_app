import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex flex-wrap items-center gap-1 list-none m-0 p-0 text-[14px]">
        <li>
          <Link href="/" className="text-[#009ee3] no-underline hover:underline">
            Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            <span className="text-[#002d59] opacity-40 mx-1">/</span>
            {item.href ? (
              <Link href={item.href} className="text-[#009ee3] no-underline hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="text-[#002d59] font-bold">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
