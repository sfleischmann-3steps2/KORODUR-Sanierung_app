/** English translations for product data */
export const produkteEN: Record<string, {
  kurzbeschreibung?: string;
  besonderheiten?: string[];
  technischeDaten?: { label: string; wert: string }[];
}> = {
  "neodur-he-60-rapid": {
    kurzbeschreibung: "Rapid-setting hard aggregate screed – fully load-bearing after 24 h",
    besonderheiten: ["High abrasion resistance", "Chemical resistant", "Rapid setting", "Low shrinkage"],
    technischeDaten: [
      { label: "Compressive strength", wert: "≥ 60 N/mm²" },
      { label: "Flexural strength", wert: "≥ 8 N/mm²" },
      { label: "Abrasion resistance", wert: "A6 (≤ 6 cm³/50 cm²)" },
      { label: "Walkable after", wert: "approx. 4–6 h" },
      { label: "Fully load-bearing after", wert: "approx. 24 h" },
    ],
  },
  "neodur-he-65-plus": {
    kurzbeschreibung: "High-performance hard aggregate screed for indoor and outdoor use – no bonding agent required",
    besonderheiten: ["No bonding agent required", "Freeze-thaw salt resistant", "WHG-compliant", "Polymer-modified & fibre-reinforced"],
    technischeDaten: [
      { label: "Compressive strength", wert: "≥ 70 N/mm²" },
      { label: "Flexural strength", wert: "≥ 9 N/mm²" },
      { label: "Abrasion resistance", wert: "A6 (≤ 6 cm³/50 cm²)" },
      { label: "Freeze-thaw salt resistant", wert: "Yes" },
      { label: "Bonding agent required", wert: "No" },
    ],
  },
  "neodur-level": {
    kurzbeschreibung: "Self-levelling hard aggregate thin-layer screed for precision floor renovation",
    besonderheiten: ["Self-levelling – excellent flatness", "Rapid usability", "Integrated wear layer", "Machine-applicable"],
    technischeDaten: [
      { label: "Compressive strength", wert: "≥ 40 N/mm²" },
      { label: "Flexural strength", wert: "≥ 8 N/mm²" },
      { label: "Abrasion resistance", wert: "AR0.5 (≤ 0.5 cm³/50 cm²)" },
      { label: "Self-levelling", wert: "Yes" },
      { label: "Flatness", wert: "DIN 18202, Row 3" },
    ],
  },
  "korodur-hb-5-rapid": {
    kurzbeschreibung: "Rapid-setting bonding agent for strong bond to substrate",
    besonderheiten: ["Rapid setting", "High pull-off resistance", "Wet-on-wet application"],
    technischeDaten: [
      { label: "Pull-off resistance", wert: "≥ 1.5 N/mm²" },
      { label: "Working time", wert: "approx. 15 min" },
      { label: "Overcoatable after", wert: "wet-on-wet" },
    ],
  },
  "korodur-pc": {
    kurzbeschreibung: "Primer for thin-layer screed systems",
    besonderheiten: ["Specifically for thin-layer screed systems", "Polymer-modified"],
    technischeDaten: [
      { label: "Pull-off resistance", wert: "≥ 1.0 N/mm²" },
      { label: "Application", wert: "For NEODUR Level" },
    ],
  },
  "rapid-set-cement-all": {
    kurzbeschreibung: "Universal rapid cement for spot repairs",
    besonderheiten: ["Ultra-short setting time", "High early strength", "Indoor and outdoor use", "Shrinkage-compensated"],
    technischeDaten: [
      { label: "Compressive strength (1 h)", wert: "≥ 21 N/mm²" },
      { label: "Compressive strength (24 h)", wert: "≥ 42 N/mm²" },
      { label: "Walkable after", wert: "approx. 15 min" },
      { label: "Fully load-bearing after", wert: "approx. 1 h" },
    ],
  },
  "rapid-set-mortar-mix": {
    kurzbeschreibung: "Rapid mortar for joints, reprofiling and profile installation",
    besonderheiten: ["Shrinkage-neutral", "No bonding agent required", "Adjustable paste to stiff consistency", "Mix with water only"],
    technischeDaten: [
      { label: "Compressive strength (1 h)", wert: "≥ 21 N/mm²" },
      { label: "Compressive strength (24 h)", wert: "≥ 42 N/mm²" },
      { label: "Consistency", wert: "paste to plastic" },
      { label: "Load-bearing after", wert: "approx. 1–2 h" },
    ],
  },
  "rapid-set-concrete-mix": {
    kurzbeschreibung: "Rapid concrete for structural repairs and edge reprofiling",
    besonderheiten: ["Coarse aggregate for structural repairs", "High final strength", "Frost-resistant"],
    technischeDaten: [
      { label: "Compressive strength (1 h)", wert: "≥ 21 N/mm²" },
      { label: "Compressive strength (28 d)", wert: "≥ 55 N/mm²" },
      { label: "Load-bearing after", wert: "approx. 1–2 h" },
    ],
  },
  "korocrete": {
    kurzbeschreibung: "Rapid concrete for large areas – volumetrically mixed on site",
    besonderheiten: ["Volumetric mixing on site", "No residual concrete / minimal waste", "Large-area application", "Heavy-duty"],
    technischeDaten: [
      { label: "Compressive strength (24 h)", wert: "≥ 35 N/mm²" },
      { label: "Compressive strength (28 d)", wert: "≥ 55 N/mm²" },
      { label: "Trafficable after", wert: "approx. 4–6 h" },
      { label: "Mixing", wert: "volumetric on site" },
    ],
  },
  "rapid-set-mortar-mix-dur": {
    kurzbeschreibung: "Rapid mortar with integrated wear aggregate for joint repairs",
    besonderheiten: ["Integrated wear aggregate", "Suitable for heavy-load joints", "Shrinkage-neutral", "Adjustable paste consistency"],
    technischeDaten: [
      { label: "Compressive strength (1 h)", wert: "≥ 21 N/mm²" },
      { label: "Compressive strength (24 h)", wert: "≥ 42 N/mm²" },
      { label: "Consistency", wert: "paste to plastic" },
      { label: "Load-bearing after", wert: "approx. 2 h" },
    ],
  },
  "asphalt-repair-mix": {
    kurzbeschreibung: "Rapid repair mix for asphalt surfaces – no bonding agent required",
    besonderheiten: ["Suitable for asphalt surfaces", "No bonding agent required", "Easy application", "High load-bearing capacity"],
    technischeDaten: [
      { label: "Layer thickness", wert: "30–80 mm" },
      { label: "Load-bearing after", wert: "approx. 2 h" },
      { label: "Bonding agent", wert: "Not required" },
    ],
  },
  "korodur-fscem-screed": {
    kurzbeschreibung: "Levelling screed for varying installation heights",
    besonderheiten: ["Large layer thicknesses possible", "Suitable as levelling layer", "Rapid setting"],
    technischeDaten: [
      { label: "Layer thickness", wert: "45–115 mm" },
      { label: "Application", wert: "Levelling layer" },
    ],
  },
  "neodur-he-65": {
    kurzbeschreibung: "Hard aggregate screed for indoor and outdoor use with silo technology",
    besonderheiten: ["Weather-resistant", "Silo system applicable", "Economical on large areas", "Strong bond"],
    technischeDaten: [
      { label: "Compressive strength", wert: "≥ 65 N/mm²" },
      { label: "Abrasion resistance", wert: "A6 (≤ 6 cm³/50 cm²)" },
      { label: "Application", wert: "Silo system / pump technology" },
    ],
  },
  "tru-self-leveling": {
    kurzbeschreibung: "Self-levelling design screed for aesthetically oriented floor solutions",
    besonderheiten: ["Design-oriented concrete look", "Seamless surface", "No bonding agent required", "Hygienic & easy to clean"],
    technischeDaten: [
      { label: "Appearance", wert: "Concrete-like exposed screed surface" },
      { label: "Application", wert: "Self-levelling" },
      { label: "Bonding agent", wert: "Not required" },
    ],
  },
  "korocure": {
    kurzbeschreibung: "Curing compound for controlled aftercare of screed surfaces",
    besonderheiten: ["Controlled curing", "Suitable for outdoor surfaces", "Reduces shrinkage cracks"],
    technischeDaten: [
      { label: "Effect", wert: "Moisture retention / curing" },
      { label: "Application", wert: "Spray or roller application" },
    ],
  },
  "koromineral-cure": {
    kurzbeschreibung: "Surface protection through silicate treatment",
    besonderheiten: ["Increases surface hardness", "Reduces dust formation", "Improves chemical resistance"],
    technischeDaten: [
      { label: "Effect", wert: "Silicate treatment / impregnation" },
      { label: "Application", wert: "On fresh screed" },
    ],
  },
  "korotex": {
    kurzbeschreibung: "Curing agent for controlled hardening",
    besonderheiten: ["Controlled curing", "Reduces shrinkage cracks", "Sprayable application"],
    technischeDaten: [
      { label: "Effect", wert: "Moisture retention / curing" },
      { label: "Application", wert: "Spray application" },
    ],
  },
};
