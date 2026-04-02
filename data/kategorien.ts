import { KategorieInfo } from "./types";

export const kategorien: KategorieInfo[] = [
  {
    id: "industrieboden",
    titel: "Industrieboden",
    beschreibung:
      "Sanierung und Erneuerung von Produktionshallen, Lagerflächen und Werkstätten – auch unter laufendem Betrieb.",
    icon: "factory",
    unterkategorien: [
      {
        id: "schwerlast",
        titel: "Schwerste Belastung",
        beschreibung:
          "Extreme Belastungen durch Schwerlastverkehr, Kettenfahrzeuge und industrielle Nutzung.",
      },
      {
        id: "duennschicht",
        titel: "Dünnschicht",
        beschreibung:
          "Präzise Bodensanierung mit selbstverlaufenden Dünnestrich-Systemen (4–10 mm).",
      },
      {
        id: "schnelle-reparaturen",
        titel: "Schnelle Reparaturen",
        beschreibung:
          "Punktuelle Instandsetzung mit Schnellzementen und -mörteln – in Stunden statt Tagen.",
      },
    ],
  },
  {
    id: "industriebau",
    titel: "Industriebau",
    beschreibung:
      "Reprofilierung und Instandsetzung tragender Bauteile, Maschinenfundamente und Betonflächen – präzise, dauerhaft, normgerecht.",
    icon: "building",
    unterkategorien: [
      {
        id: "schnelle-reparaturen",
        titel: "Schnelle Reparaturen",
        beschreibung:
          "Fugen, Treppen, Überladebrücken und Absenksteine – schnell und dauerhaft repariert.",
      },
    ],
  },
  {
    id: "infrastruktur",
    titel: "Infrastruktur",
    beschreibung:
      "Sanierung von Verkehrs- und Logistikflächen, Häfen, Tunneln und Wasserbauwerken – belastbar, frostbeständig, schnell wieder nutzbar.",
    icon: "road",
    unterkategorien: [
      {
        id: "verkehr",
        titel: "Verkehr",
        beschreibung:
          "Brücken, Parkhäuser, Häfen und Verkehrsflächen – Sanierung unter Verkehr, mit Tragfähigkeit und Witterungsschutz.",
      },
      {
        id: "wasser",
        titel: "Wasser",
        beschreibung:
          "Trinkwasserbehälter und -türme – mineralische Sanierung nach DVGW-Standards.",
      },
    ],
  },
];
