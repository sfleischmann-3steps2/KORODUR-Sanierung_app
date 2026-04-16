/** French translations for product data */
export const produkteFR: Record<string, {
  kurzbeschreibung?: string;
  besonderheiten?: string[];
  technischeDaten?: { label: string; wert: string }[];
}> = {
  "neodur-he-60-rapid": {
    kurzbeschreibung: "Chape rapide à granulats durs – charge complète après 24 h",
    besonderheiten: ["Haute résistance à l'abrasion", "Résistant aux produits chimiques", "Prise rapide", "Faible retrait"],
    technischeDaten: [
      { label: "Résistance à la compression", wert: "≥ 60 N/mm²" },
      { label: "Résistance à la flexion", wert: "≥ 8 N/mm²" },
      { label: "Résistance à l'abrasion", wert: "A6 (≤ 6 cm³/50 cm²)" },
      { label: "Praticable après", wert: "env. 4–6 h" },
      { label: "Charge complète après", wert: "env. 24 h" },
    ],
  },
  "neodur-he-65-plus": {
    kurzbeschreibung: "Chape haute performance à granulats durs pour intérieur et extérieur – sans pont d'adhérence",
    besonderheiten: ["Sans pont d'adhérence", "Résistant au gel et aux sels de déverglaçage", "Conforme WHG", "Modifié polymère & renforcé de fibres"],
    technischeDaten: [
      { label: "Résistance à la compression", wert: "≥ 70 N/mm²" },
      { label: "Résistance à la flexion", wert: "≥ 9 N/mm²" },
      { label: "Résistance à l'abrasion", wert: "A6 (≤ 6 cm³/50 cm²)" },
      { label: "Résistant gel/sel", wert: "Oui" },
      { label: "Pont d'adhérence requis", wert: "Non" },
    ],
  },
  "neodur-level": {
    kurzbeschreibung: "Chape mince autoplaçante à granulats durs pour rénovation de sol de précision",
    besonderheiten: ["Autoplaçant – excellente planéité", "Utilisation rapide", "Couche d'usure intégrée", "Application mécanisée"],
    technischeDaten: [
      { label: "Résistance à la compression", wert: "≥ 40 N/mm²" },
      { label: "Résistance à la flexion", wert: "≥ 8 N/mm²" },
      { label: "Résistance à l'abrasion", wert: "AR0,5 (≤ 0,5 cm³/50 cm²)" },
      { label: "Autoplaçant", wert: "Oui" },
      { label: "Planéité", wert: "DIN 18202, Ligne 3" },
    ],
  },
  "korodur-hb-5-rapid": {
    kurzbeschreibung: "Pont d'adhérence à prise rapide pour liaison solide au support",
    besonderheiten: ["Prise rapide", "Haute résistance à l'arrachement", "Application frais sur frais"],
    technischeDaten: [
      { label: "Résistance à l'arrachement", wert: "≥ 1,5 N/mm²" },
      { label: "Temps de travail", wert: "env. 15 min" },
      { label: "Recouvrable après", wert: "frais sur frais" },
    ],
  },
  "korodur-pc": {
    kurzbeschreibung: "Primaire pour systèmes de chape mince",
    besonderheiten: ["Spécifique pour systèmes de chape mince", "Modifié polymère"],
    technischeDaten: [
      { label: "Résistance à l'arrachement", wert: "≥ 1,0 N/mm²" },
      { label: "Application", wert: "Pour NEODUR Level" },
    ],
  },
  "rapid-set-cement-all": {
    kurzbeschreibung: "Ciment rapide universel pour réparations ponctuelles",
    besonderheiten: ["Temps de prise ultra-court", "Haute résistance initiale", "Usage intérieur et extérieur", "Compensé en retrait"],
    technischeDaten: [
      { label: "Résistance à la compression (1 h)", wert: "≥ 21 N/mm²" },
      { label: "Résistance à la compression (24 h)", wert: "≥ 42 N/mm²" },
      { label: "Praticable après", wert: "env. 15 min" },
      { label: "Charge complète après", wert: "env. 1 h" },
    ],
  },
  "rapid-set-mortar-mix": {
    kurzbeschreibung: "Mortier rapide pour joints, reprofilage et pose de profilés",
    besonderheiten: ["Neutre en retrait", "Sans pont d'adhérence", "Consistance pâteuse à rigide ajustable", "Mélanger avec de l'eau uniquement"],
    technischeDaten: [
      { label: "Résistance à la compression (1 h)", wert: "≥ 21 N/mm²" },
      { label: "Résistance à la compression (24 h)", wert: "≥ 42 N/mm²" },
      { label: "Consistance", wert: "pâteuse à plastique" },
      { label: "Charge après", wert: "env. 1–2 h" },
    ],
  },
  "rapid-set-concrete-mix": {
    kurzbeschreibung: "Béton rapide pour réparations structurelles et reprofilage d'arêtes",
    besonderheiten: ["Granulats grossiers pour réparations structurelles", "Haute résistance finale", "Résistant au gel"],
    technischeDaten: [
      { label: "Résistance à la compression (1 h)", wert: "≥ 21 N/mm²" },
      { label: "Résistance à la compression (28 j)", wert: "≥ 55 N/mm²" },
      { label: "Charge après", wert: "env. 1–2 h" },
    ],
  },
  "korocrete": {
    kurzbeschreibung: "Béton rapide pour grandes surfaces – mélange volumétrique sur site",
    besonderheiten: ["Mélange volumétrique sur site", "Pas de béton résiduel / pertes minimales", "Application grande surface", "Haute résistance"],
    technischeDaten: [
      { label: "Résistance à la compression (24 h)", wert: "≥ 35 N/mm²" },
      { label: "Résistance à la compression (28 j)", wert: "≥ 55 N/mm²" },
      { label: "Circulable après", wert: "env. 4–6 h" },
      { label: "Mélange", wert: "volumétrique sur site" },
    ],
  },
  "rapid-set-mortar-mix-dur": {
    kurzbeschreibung: "Mortier rapide avec granulat d'usure intégré pour réparation de joints",
    besonderheiten: ["Granulat d'usure intégré", "Adapté aux joints charges lourdes", "Neutre en retrait", "Consistance pâteuse ajustable"],
    technischeDaten: [
      { label: "Résistance à la compression (1 h)", wert: "≥ 21 N/mm²" },
      { label: "Résistance à la compression (24 h)", wert: "≥ 42 N/mm²" },
      { label: "Consistance", wert: "pâteuse à plastique" },
      { label: "Charge après", wert: "env. 2 h" },
    ],
  },
  "asphalt-repair-mix": {
    kurzbeschreibung: "Mélange de réparation rapide pour surfaces en asphalte – sans pont d'adhérence",
    besonderheiten: ["Adapté aux surfaces en asphalte", "Sans pont d'adhérence", "Application facile", "Haute capacité portante"],
    technischeDaten: [
      { label: "Épaisseur de couche", wert: "30–80 mm" },
      { label: "Charge après", wert: "env. 2 h" },
      { label: "Pont d'adhérence", wert: "Non requis" },
    ],
  },
  "korodur-fscem-screed": {
    kurzbeschreibung: "Chape d'égalisation pour différentes hauteurs d'installation",
    besonderheiten: ["Grandes épaisseurs possibles", "Utilisable comme couche d'égalisation", "Prise rapide"],
    technischeDaten: [
      { label: "Épaisseur de couche", wert: "45–115 mm" },
      { label: "Application", wert: "Couche d'égalisation" },
    ],
  },
  "neodur-he-65": {
    kurzbeschreibung: "Chape à granulats durs pour intérieur et extérieur avec technologie silo",
    besonderheiten: ["Résistant aux intempéries", "Application par système silo", "Économique sur grandes surfaces", "Liaison solide"],
    technischeDaten: [
      { label: "Résistance à la compression", wert: "≥ 65 N/mm²" },
      { label: "Résistance à l'abrasion", wert: "A6 (≤ 6 cm³/50 cm²)" },
      { label: "Application", wert: "Système silo / pompage" },
    ],
  },
  "microtop-tw": {
    kurzbeschreibung: "Système de revêtement minéral pour eau potable selon DVGW",
    besonderheiten: ["Purement minéral – sans additifs polymères", "Certifié DVGW", "Enrichi en microsilice", "Surface sans joints", "Personnalisable en couleur"],
    technischeDaten: [
      { label: "Résistance à la compression", wert: "≥ 40 N/mm²" },
      { label: "Résistance à l'arrachement", wert: "≥ 1,5 N/mm²" },
      { label: "Agrément eau potable", wert: "Testé DVGW" },
      { label: "Application", wert: "Projection humide" },
    ],
  },
  "tru-self-leveling": {
    kurzbeschreibung: "Chape autoplaçante design pour solutions de sol esthétiques",
    besonderheiten: ["Aspect béton design", "Surface sans joints", "Sans pont d'adhérence", "Hygiénique & facile d'entretien"],
    technischeDaten: [
      { label: "Aspect", wert: "Surface de chape apparente type béton" },
      { label: "Application", wert: "Autoplaçant" },
      { label: "Pont d'adhérence", wert: "Non requis" },
    ],
  },
  "korocure": {
    kurzbeschreibung: "Produit de cure pour le traitement contrôlé des surfaces de chape",
    besonderheiten: ["Cure contrôlée", "Adapté aux surfaces extérieures", "Réduit les fissures de retrait"],
    technischeDaten: [
      { label: "Effet", wert: "Rétention d'humidité / cure" },
      { label: "Application", wert: "Pulvérisation ou rouleau" },
    ],
  },
  "koromineral-cure": {
    kurzbeschreibung: "Protection de surface par traitement au silicate",
    besonderheiten: ["Augmente la dureté de surface", "Réduit la formation de poussière", "Améliore la résistance chimique"],
    technischeDaten: [
      { label: "Effet", wert: "Traitement au silicate / imprégnation" },
      { label: "Application", wert: "Sur chape fraîche" },
    ],
  },
  "korotex": {
    kurzbeschreibung: "Agent de cure pour durcissement contrôlé",
    besonderheiten: ["Cure contrôlée", "Réduit les fissures de retrait", "Application par pulvérisation"],
    technischeDaten: [
      { label: "Effet", wert: "Rétention d'humidité / cure" },
      { label: "Application", wert: "Pulvérisation" },
    ],
  },
};
