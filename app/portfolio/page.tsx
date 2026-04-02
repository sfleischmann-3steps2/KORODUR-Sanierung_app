import Breadcrumb from "../../components/Breadcrumb";
import CategoryTile from "../../components/CategoryTile";
import TileGrid from "../../components/TileGrid";
import { kategorien } from "../../data/kategorien";

export default function PortfolioPage() {
  return (
    <>
      <section style={{ padding: "0 32px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <Breadcrumb items={[{ label: "Portfolio" }]} />
        </div>
      </section>

      <section style={{ padding: "40px 32px 100px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <h1
            className="uppercase mb-4"
            style={{
              fontSize: "clamp(30px, 5vw, 48px)",
              fontWeight: 900,
              lineHeight: 1.08,
            }}
          >
            Produktportfolio
          </h1>
          <p
            className="text-[#002d59] opacity-70 mb-12"
            style={{ fontSize: 18, lineHeight: 1.65, maxWidth: 700 }}
          >
            KORODUR bietet durchdachte Sanierungssysteme fuer drei zentrale
            Anwendungsbereiche. Jedes System ist auf maximale Belastbarkeit,
            minimale Ausfallzeiten und langfristige Wirtschaftlichkeit ausgelegt.
          </p>
          <TileGrid columns={3}>
            {kategorien.map((kat) => (
              <CategoryTile
                key={kat.id}
                title={kat.titel}
                description={kat.beschreibung}
                icon={kat.icon}
                href={`/portfolio/${kat.id}`}
              />
            ))}
          </TileGrid>
        </div>
      </section>
    </>
  );
}
