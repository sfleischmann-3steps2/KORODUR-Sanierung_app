interface SubcategoryTileProps {
  title: string;
  description: string;
  count: number;
  refSingular?: string;
  refPlural?: string;
}

export default function SubcategoryTile({
  title,
  description,
  count,
  refSingular = "Referenz",
  refPlural = "Referenzen",
}: SubcategoryTileProps) {
  return (
    <div
      className="bg-white p-6 flex flex-col gap-3"
      style={{
        borderRadius: 14,
        boxShadow: "0 8px 40px rgba(0,45,89,0.10)",
        borderLeft: "4px solid #009ee3",
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-[#002d59] text-[20px] m-0" style={{ fontWeight: 900 }}>
          {title}
        </h3>
        <span
          className="text-[#009ee3] text-[13px] px-3 py-1 rounded-full"
          style={{ backgroundColor: "rgba(0,158,227,0.08)", fontWeight: 700 }}
        >
          {count} {count === 1 ? refSingular : refPlural}
        </span>
      </div>
      <p className="text-[#002d59] text-[15px] leading-[1.65] m-0 opacity-70">
        {description}
      </p>
    </div>
  );
}
