/** Polish translations for product data */
export const produktePL: Record<string, {
  kurzbeschreibung?: string;
  besonderheiten?: string[];
  technischeDaten?: { label: string; wert: string }[];
}> = {
  "neodur-he-60-rapid": {
    kurzbeschreibung: "Szybkotwardniejący jastrych z posypką utwardzającą – pełna nośność po 24 h",
    besonderheiten: ["Wysoka odporność na ścieranie", "Odporny chemicznie", "Szybkotwardniejący", "Niski skurcz"],
    technischeDaten: [
      { label: "Wytrzymałość na ściskanie", wert: "≥ 60 N/mm²" },
      { label: "Wytrzymałość na zginanie", wert: "≥ 8 N/mm²" },
      { label: "Odporność na ścieranie", wert: "A6 (≤ 6 cm³/50 cm²)" },
      { label: "Ruch pieszy po", wert: "ok. 4–6 h" },
      { label: "Pełna nośność po", wert: "ok. 24 h" },
    ],
  },
  "neodur-he-65-plus": {
    kurzbeschreibung: "Wysokowydajny jastrych z posypką utwardzającą do stosowania wewnątrz i na zewnątrz – bez mostka sczepnego",
    besonderheiten: ["Bez mostka sczepnego", "Odporny na mróz i sole odladzające", "Zgodny z WHG", "Modyfikowany polimerami i zbrojony włóknami"],
    technischeDaten: [
      { label: "Wytrzymałość na ściskanie", wert: "≥ 70 N/mm²" },
      { label: "Wytrzymałość na zginanie", wert: "≥ 9 N/mm²" },
      { label: "Odporność na ścieranie", wert: "A6 (≤ 6 cm³/50 cm²)" },
      { label: "Odporność na mróz i sole", wert: "Tak" },
      { label: "Mostek sczepny wymagany", wert: "Nie" },
    ],
  },
  "neodur-level": {
    kurzbeschreibung: "Samorozlewny jastrych cienkościenny z posypką utwardzającą do precyzyjnej renowacji posadzek",
    besonderheiten: ["Samorozlewny – doskonała płaskość", "Szybkie użytkowanie", "Zintegrowana warstwa ścieralna", "Aplikacja maszynowa"],
    technischeDaten: [
      { label: "Wytrzymałość na ściskanie", wert: "≥ 40 N/mm²" },
      { label: "Wytrzymałość na zginanie", wert: "≥ 8 N/mm²" },
      { label: "Odporność na ścieranie", wert: "AR0,5 (≤ 0,5 cm³/50 cm²)" },
      { label: "Samorozlewny", wert: "Tak" },
      { label: "Płaskość", wert: "EN 18202, Wiersz 3" },
    ],
  },
  "korodur-hb-5-rapid": {
    kurzbeschreibung: "Szybkotwardniejący mostek sczepny do mocnego połączenia z podłożem",
    besonderheiten: ["Szybkotwardniejący", "Wysoka przyczepność", "Aplikacja mokre na mokre"],
    technischeDaten: [
      { label: "Wytrzymałość na odrywanie", wert: "≥ 1,5 N/mm²" },
      { label: "Czas zachowania właściwości roboczych", wert: "ok. 15 min" },
      { label: "Pokrywalny po", wert: "mokre na mokre" },
    ],
  },
  "korodur-pc": {
    kurzbeschreibung: "Gruntowanie do systemów jastrychów cienkościennych",
    besonderheiten: ["Specjalnie do systemów jastrychów cienkościennych", "Modyfikowany polimerami"],
    technischeDaten: [
      { label: "Wytrzymałość na odrywanie", wert: "≥ 1,0 N/mm²" },
      { label: "Zastosowanie", wert: "Do NEODUR Level" },
    ],
  },
  "rapid-set-cement-all": {
    kurzbeschreibung: "Uniwersalny szybki cement do napraw punktowych",
    besonderheiten: ["Ultraszybki czas wiązania", "Wysoka wytrzymałość wczesna", "Do stosowania wewnątrz i na zewnątrz", "Kompensacja skurczu"],
    technischeDaten: [
      { label: "Wytrzymałość na ściskanie (1 h)", wert: "≥ 21 N/mm²" },
      { label: "Wytrzymałość na ściskanie (24 h)", wert: "≥ 42 N/mm²" },
      { label: "Ruch pieszy po", wert: "ok. 15 min" },
      { label: "Pełna nośność po", wert: "ok. 1 h" },
    ],
  },
  "rapid-set-mortar-mix": {
    kurzbeschreibung: "Szybka zaprawa do dylatacji, reprofilacji i montażu profili",
    besonderheiten: ["Bez skurczu", "Bez mostka sczepnego", "Regulowana konsystencja od pastowej do sztywnej", "Tylko mieszanie z wodą"],
    technischeDaten: [
      { label: "Wytrzymałość na ściskanie (1 h)", wert: "≥ 21 N/mm²" },
      { label: "Wytrzymałość na ściskanie (24 h)", wert: "≥ 42 N/mm²" },
      { label: "Konsystencja", wert: "pastowa do plastycznej" },
      { label: "Nośność po", wert: "ok. 1–2 h" },
    ],
  },
  "rapid-set-concrete-mix": {
    kurzbeschreibung: "Szybki beton do napraw konstrukcyjnych i reprofilacji krawędzi",
    besonderheiten: ["Kruszywo grube do napraw konstrukcyjnych", "Wysoka wytrzymałość końcowa", "Mrozoodporny"],
    technischeDaten: [
      { label: "Wytrzymałość na ściskanie (1 h)", wert: "≥ 21 N/mm²" },
      { label: "Wytrzymałość na ściskanie (28 d)", wert: "≥ 55 N/mm²" },
      { label: "Nośność po", wert: "ok. 1–2 h" },
    ],
  },
  "korocrete": {
    kurzbeschreibung: "Szybki beton do dużych powierzchni – mieszany wolumetrycznie na budowie",
    besonderheiten: ["Mieszanie wolumetryczne na budowie", "Bez resztek betonu / minimalne odpady", "Zastosowanie na dużych powierzchniach", "Wytrzymały na duże obciążenia"],
    technischeDaten: [
      { label: "Wytrzymałość na ściskanie (24 h)", wert: "≥ 35 N/mm²" },
      { label: "Wytrzymałość na ściskanie (28 d)", wert: "≥ 55 N/mm²" },
      { label: "Ruch po", wert: "ok. 4–6 h" },
      { label: "Mieszanie", wert: "wolumetryczne na budowie" },
    ],
  },
  "rapid-set-mortar-mix-dur": {
    kurzbeschreibung: "Szybka zaprawa ze zintegrowanym kruszywem twardym do napraw dylatacji",
    besonderheiten: ["Zintegrowane kruszywo twarde", "Do dylatacji pod dużym obciążeniem", "Bez skurczu", "Regulowana konsystencja pastowa"],
    technischeDaten: [
      { label: "Wytrzymałość na ściskanie (1 h)", wert: "≥ 21 N/mm²" },
      { label: "Wytrzymałość na ściskanie (24 h)", wert: "≥ 42 N/mm²" },
      { label: "Konsystencja", wert: "pastowa do plastycznej" },
      { label: "Nośność po", wert: "ok. 2 h" },
    ],
  },
  "asphalt-repair-mix": {
    kurzbeschreibung: "Szybka mieszanka naprawcza do nawierzchni asfaltowych – bez mostka sczepnego",
    besonderheiten: ["Do nawierzchni asfaltowych", "Bez mostka sczepnego", "Łatwa aplikacja", "Wysoka nośność"],
    technischeDaten: [
      { label: "Grubość warstwy", wert: "30–80 mm" },
      { label: "Nośność po", wert: "ok. 2 h" },
      { label: "Mostek sczepny", wert: "Nie wymagany" },
    ],
  },
  "korodur-fscem-screed": {
    kurzbeschreibung: "Jastrych wyrównawczy do zmiennych wysokości zabudowy",
    besonderheiten: ["Możliwe duże grubości warstw", "Jako warstwa wyrównawcza", "Szybkotwardniejący"],
    technischeDaten: [
      { label: "Grubość warstwy", wert: "45–115 mm" },
      { label: "Zastosowanie", wert: "Warstwa wyrównawcza" },
    ],
  },
  "neodur-he-65": {
    kurzbeschreibung: "Jastrych z posypką utwardzającą do stosowania wewnątrz i na zewnątrz z technologią silosową",
    besonderheiten: ["Odporny na warunki atmosferyczne", "System silosowy", "Ekonomiczny na dużych powierzchniach", "Mocne połączenie"],
    technischeDaten: [
      { label: "Wytrzymałość na ściskanie", wert: "≥ 65 N/mm²" },
      { label: "Odporność na ścieranie", wert: "A6 (≤ 6 cm³/50 cm²)" },
      { label: "Zastosowanie", wert: "System silosowy / technologia pompowa" },
    ],
  },
  "microtop-tw": {
    kurzbeschreibung: "Mineralny system powłokowy do wody pitnej zgodny z DVGW",
    besonderheiten: ["Czysto mineralny – bez dodatków polimerowych", "Certyfikat DVGW", "Wzbogacony mikrokrzemionką", "Bezspoinowa powierzchnia", "Kolorystyka do wyboru"],
    technischeDaten: [
      { label: "Wytrzymałość na ściskanie", wert: "≥ 40 N/mm²" },
      { label: "Wytrzymałość na odrywanie", wert: "≥ 1,5 N/mm²" },
      { label: "Dopuszczenie do wody pitnej", wert: "Badanie DVGW" },
      { label: "Aplikacja", wert: "Metoda natrysku mokrego" },
    ],
  },
  "tru-self-leveling": {
    kurzbeschreibung: "Samorozlewny jastrych designerski do estetycznych rozwiązań posadzkowych",
    besonderheiten: ["Designerski wygląd betonu", "Bezspoinowa powierzchnia", "Bez mostka sczepnego", "Higieniczny i łatwy w utrzymaniu"],
    technischeDaten: [
      { label: "Wygląd", wert: "Betonopodobna powierzchnia jastrychowa" },
      { label: "Zastosowanie", wert: "Samorozlewny" },
      { label: "Mostek sczepny", wert: "Nie wymagany" },
    ],
  },
  "korocure": {
    kurzbeschreibung: "Środek pielęgnacyjny do kontrolowanej pielęgnacji powierzchni jastrychowych",
    besonderheiten: ["Kontrolowana pielęgnacja", "Do powierzchni zewnętrznych", "Redukcja pęknięć skurczowych"],
    technischeDaten: [
      { label: "Efekt", wert: "Zatrzymanie wilgoci / pielęgnacja" },
      { label: "Zastosowanie", wert: "Natrysk lub aplikacja wałkiem" },
    ],
  },
  "koromineral-cure": {
    kurzbeschreibung: "Ochrona powierzchni poprzez obróbkę silikatową",
    besonderheiten: ["Zwiększa twardość powierzchni", "Redukuje pylenie", "Poprawia odporność chemiczną"],
    technischeDaten: [
      { label: "Efekt", wert: "Obróbka silikatowa / impregnacja" },
      { label: "Zastosowanie", wert: "Na świeży jastrych" },
    ],
  },
  "korotex": {
    kurzbeschreibung: "Środek pielęgnacyjny do kontrolowanego twardnienia",
    besonderheiten: ["Kontrolowana pielęgnacja", "Redukcja pęknięć skurczowych", "Aplikacja natryskowa"],
    technischeDaten: [
      { label: "Efekt", wert: "Zatrzymanie wilgoci / pielęgnacja" },
      { label: "Zastosowanie", wert: "Aplikacja natryskowa" },
    ],
  },
};
