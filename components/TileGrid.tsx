interface TileGridProps {
  children: React.ReactNode;
  columns?: 2 | 3;
}

export default function TileGrid({ children, columns = 3 }: TileGridProps) {
  const colClass =
    columns === 2
      ? "grid grid-cols-1 md:grid-cols-2 gap-6"
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  return <div className={colClass}>{children}</div>;
}
