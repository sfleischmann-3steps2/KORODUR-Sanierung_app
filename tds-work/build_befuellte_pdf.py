#!/usr/bin/env python3
"""
Baut produktmatrix-validierung-tds-befuellt.pdf — Vorbefüllung der
Produktmatrix Sanierung mit den TDS-validierten Werten (Stand Mai 2026).

Layout: A4 landscape, 12 Spalten, gleiche Logik wie produktmatrix-validierung.pdf
(Steffis Vorlage-PDF). Reportlab.
"""
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# DejaVu Sans rendert ■, —, ?, geometrische Zeichen sauber (Helvetica nicht).
pdfmetrics.registerFont(TTFont("DejaVu", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("DejaVu-Bold", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))
# Hinweis: DejaVuSans-Oblique nicht installiert — Italic-Style fällt auf Regular.
pdfmetrics.registerFontFamily("DejaVu", normal="DejaVu", bold="DejaVu-Bold", italic="DejaVu")

# ---------------- DATEN ---------------------------------------------------

# 16 Zeilen — 14 Produkte (CEMENT ALL Plus aufgenommen; CONCRETE PHARMACY,
# SYSTEM KOROCRETE, DUROP entfernt da nicht in App-Aufnahme) + 2 Platzhalter.
# Reihenfolge weitgehend wie Vorlage (entfernte Zeilen ausgelassen).
ROWS = [
    {
        "name": "NEODUR HE 60 rapid",
        "sub": "Hartstoff-Schnellestrich",
        "fl": "G", "zeit": "■",
        "eb": ["H", "H", "—", "H", "H", "—", "—", "M"],
        "anm": "TDS 03/2025: Verbundestrich ab 10 mm für Parkhäuser, Industriehallen, Flugzeughallen, Werkstätten, Hochregallager. Begehbar 3 h, nutzbar 24 h.",
        "highlight": False,
    },
    {
        "name": "NEODUR HE 65",
        "sub": "Hartstoffestrich",
        "fl": "G", "zeit": "—",
        "eb": ["H", "H", "—", "H", "H", "—", "—", "M"],
        "anm": "TDS 03/2025: Verbundestrich DIN 18560-7 für Parkhäuser, Industriehallen, Flugzeughallen, Werkstätten, Hochregallager. Keine Schnellaushärtung.",
        "highlight": False,
    },
    {
        "name": "Rapid Set MORTAR MIX",
        "sub": "Schnellreparaturmörtel 10–150 mm",
        "fl": "B", "zeit": "■",
        "eb": ["—", "—", "—", "—", "—", "H", "—", "—"],
        "anm": "TDS 04/2024: Betoninstandsetzung + Außenputze + Reparatur von Fahrbahnen. Belastbar 60 min. TDS nennt keine konkreten Branchen.",
        "highlight": False,
    },
    {
        "name": "Rapid Set MORTAR MIX DUR",
        "sub": "Variante mit Verschleißträger DIN 1100 A",
        "fl": "?", "zeit": "?",
        "eb": ["?", "?", "?", "?", "?", "?", "?", "?"],
        "anm": "Kein eigenes TDS — nur 1 Satz in MORTAR MIX TDS S.1: für Bodensanierungen > 15 mm auf Anfrage. Klärung Termin.",
        "highlight": True,
    },
    {
        "name": "Rapid Set CEMENT ALL",
        "sub": "Multi-Reparaturmörtel 0–100 mm",
        "fl": "P", "zeit": "■",
        "eb": ["—", "M", "M", "—", "—", "M", "—", "—"],
        "anm": "TDS 10/2022: Universal-Reparatur (Verguss, Verankerung, Spachteln). Belastbar 60 min. Ab 10 mm Bodendicke wird MORTAR MIX empfohlen.",
        "highlight": False,
    },
    {
        "name": "Rapid Set CEMENT ALL Plus",
        "sub": "kunststoffmodifiziert, Carbonatisierungs- & Tausalz-Schutz",
        "fl": "P", "zeit": "■",
        "eb": ["—", "M", "—", "—", "M", "H", "—", "M"],
        "anm": "TDS 05/2020: Wie CEMENT ALL + kunststoffmod. + XC4/XF4/XA3 + Fahrbahnreparaturen. Belastbar 60 min.",
        "highlight": False,
    },
    {
        "name": "Rapid Set CONCRETE MIX",
        "sub": "Schnellbeton 50–600 mm",
        "fl": "B", "zeit": "■",
        "eb": ["M", "H", "—", "—", "—", "H", "—", "M"],
        "anm": "TDS 04/2026: Industrieböden + Gehwege + Fahrbahnen + Maschinenfundamente. Belastbar 60 min.",
        "highlight": False,
    },
    {
        "name": "ASPHALT REPAIR MIX",
        "sub": "Asphalt-Reparaturmaterial 30–600 mm",
        "fl": "B", "zeit": "■",
        "eb": ["—", "M", "—", "—", "M", "H", "—", "—"],
        "anm": "TDS 09/2024: Schlaglöcher + Straßenschäden + Frostaufbrüche + Garageneinfahrten + Parkplätze + Gehwege. Verkehrsfreigabe 30 min.",
        "highlight": False,
    },
    {
        "name": "TRU Self-Leveling",
        "sub": "selbstverlaufender, geschliffener Sichtestrich",
        "fl": "G", "zeit": "■",
        "eb": ["—", "—", "M", "M", "—", "—", "H", "—"],
        "anm": "TDS 10/2022: Designboden 5–35 mm für Verkaufsräume, Restaurants, Foyers, Museen, Bürogebäude, Schulen, Flughäfen. Begehbar 2–3 h.",
        "highlight": False,
    },
    {
        "name": "KOROCRETE",
        "sub": "Schnellbeton (ternäres Bindemittel)",
        "fl": "G", "zeit": "■",
        "eb": ["M", "M", "—", "—", "—", "M", "—", "—"],
        "anm": "TDS 09/2021: Schnellbeton C35/45–C50/60 mit volumetrischer Mischtechnik. Verkehrsfreigabe 6 h. TDS nennt keine konkreten Branchen.",
        "highlight": False,
    },
    {
        "name": "KORODUR PC",
        "sub": "Kunstharzdispersion-Grundierung (Korrektur Untertitel!)",
        "fl": "G", "zeit": "—",
        "eb": ["—", "—", "—", "—", "—", "—", "—", "—"],
        "anm": "TDS 02/2026: Grundierung für NEODUR Level / LevelFlor (50–200 g/m²). KEIN Mörtel. Einsatzbereiche aus Zielboden ableiten.",
        "highlight": False,
    },
    {
        "name": "NEODUR PFM 1K Easyfix",
        "sub": "Pflasterfugenmörtel, nur Außen-Fußgängerbereich",
        "fl": "P", "zeit": "—",
        "eb": ["—", "—", "—", "—", "—", "M", "—", "—"],
        "anm": "TDS 06/2020: Verfugung Pflasterflächen (Terrassen, Gehwege), nur leichte Belastung, nur außen. Begehbar 24 h, Freigabe 6 Tage.",
        "highlight": False,
    },
    {
        "name": "[Produkt 16 — offen]",
        "sub": "Wissen aus PPT/TDS einarbeiten",
        "fl": "?", "zeit": "?",
        "eb": ["?", "?", "?", "?", "?", "?", "?", "?"],
        "anm": "Platzhalter — Produkt im Termin festlegen.",
        "highlight": True,
    },
    {
        "name": "[Produkt 17 — offen]",
        "sub": "Wissen aus PPT/TDS einarbeiten",
        "fl": "?", "zeit": "?",
        "eb": ["?", "?", "?", "?", "?", "?", "?", "?"],
        "anm": "Platzhalter — Produkt im Termin festlegen.",
        "highlight": True,
    },
]

EB_HEADER = [
    "Lager &\nLogistik",
    "Industrie &\nProduktion",
    "Lebens-\nmittel",
    "Flugzeug",
    "Parkdeck",
    "Infra &\nZufahrten",
    "Verkaufs-\nräume",
    "Schwer-\nindustrie",
]

# ---------------- STYLES --------------------------------------------------

DARK_HEAD = colors.HexColor("#1c2533")
WHITE = colors.white
YELLOW = colors.HexColor("#fff7c2")
GREY_LINE = colors.HexColor("#cccccc")
LIGHT_ALT = colors.HexColor("#f6f7fa")

styles = getSampleStyleSheet()

style_title = ParagraphStyle(
    "title", parent=styles["Heading1"], fontSize=14, leading=17,
    spaceAfter=2, fontName="DejaVu-Bold", textColor=colors.black,
)
style_meta = ParagraphStyle(
    "meta", parent=styles["BodyText"], fontSize=8, leading=10,
    spaceAfter=1, fontName="DejaVu",
)
style_legend = ParagraphStyle(
    "legend", parent=styles["BodyText"], fontSize=8, leading=10,
    spaceAfter=6, fontName="DejaVu",
)
style_anm = ParagraphStyle(
    "anm", parent=styles["BodyText"], fontSize=7, leading=8.5,
    fontName="DejaVu", alignment=TA_LEFT,
)
style_prod_main = ParagraphStyle(
    "prodmain", parent=styles["BodyText"], fontSize=8.5, leading=10,
    fontName="DejaVu-Bold", alignment=TA_LEFT,
)
style_prod_sub = ParagraphStyle(
    "prodsub", parent=styles["BodyText"], fontSize=7, leading=8,
    fontName="DejaVu", textColor=colors.HexColor("#555555"), alignment=TA_LEFT,
)
style_head_white = ParagraphStyle(
    "headw", parent=styles["BodyText"], fontSize=7.5, leading=9,
    fontName="DejaVu-Bold", textColor=WHITE, alignment=TA_CENTER,
)
style_head_left = ParagraphStyle(
    "headl", parent=styles["BodyText"], fontSize=7.5, leading=9,
    fontName="DejaVu-Bold", textColor=WHITE, alignment=TA_LEFT,
)
style_footer = ParagraphStyle(
    "footer", parent=styles["BodyText"], fontSize=7.5, leading=9.5,
    fontName="DejaVu", textColor=colors.HexColor("#555555"),
)

# ---------------- TABLE ---------------------------------------------------

def build_table():
    # Header row
    header = [
        Paragraph("Produkt", style_head_left),
        Paragraph("Fl.", style_head_white),
        Paragraph("Zeit", style_head_white),
    ] + [Paragraph(h, style_head_white) for h in EB_HEADER] + [
        Paragraph("Anmerkung / TDS-Beleg", style_head_left),
    ]

    data = [header]
    for r in ROWS:
        prod = [
            Paragraph(r["name"], style_prod_main),
            Paragraph(r["sub"], style_prod_sub),
        ]
        cells = [prod, r["fl"], r["zeit"]] + r["eb"] + [Paragraph(r["anm"], style_anm)]
        data.append(cells)

    # Column widths (in pt). Available auf A4 landscape mit 12 mm Rand = ~786 pt.
    col_w = [
        125,  # Produkt
        22,   # Fl
        24,   # Zeit
        45, 50, 42, 42, 42, 45, 46, 46,  # 8 Einsatzbereich-Spalten — etwas breiter
        # 125+22+24+(45+50+42+42+42+45+46+46) = 529. Anmerkung = 786-529 = 257
        257,  # Anmerkung
    ]

    t = Table(data, colWidths=col_w, repeatRows=1)

    # Style
    s = TableStyle([
        # Header row
        ("BACKGROUND", (0, 0), (-1, 0), DARK_HEAD),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("FONTNAME", (0, 0), (-1, 0), "DejaVu-Bold"),
        ("ALIGN", (1, 0), (-2, 0), "CENTER"),
        ("ALIGN", (0, 0), (0, 0), "LEFT"),
        ("ALIGN", (-1, 0), (-1, 0), "LEFT"),
        ("VALIGN", (0, 0), (-1, 0), "MIDDLE"),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 6),
        ("TOPPADDING", (0, 0), (-1, 0), 6),
        # Header-Zellen mit wenig L/R-Padding, damit Text Platz hat
        ("LEFTPADDING", (1, 0), (-2, 0), 1),
        ("RIGHTPADDING", (1, 0), (-2, 0), 1),
        # Body — base
        ("FONTNAME", (1, 1), (-2, -1), "DejaVu-Bold"),
        ("FONTSIZE", (1, 1), (-2, -1), 9),
        ("ALIGN", (1, 1), (-2, -1), "CENTER"),
        ("VALIGN", (0, 1), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 1), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 1), (-1, -1), 4),
        ("LEFTPADDING", (0, 1), (0, -1), 6),
        ("RIGHTPADDING", (-1, 1), (-1, -1), 6),
        ("LEFTPADDING", (-1, 1), (-1, -1), 6),
        # Grid
        ("LINEBELOW", (0, 0), (-1, 0), 0.6, DARK_HEAD),
        ("LINEBELOW", (0, 1), (-1, -1), 0.3, GREY_LINE),
        ("BOX", (0, 0), (-1, -1), 0.3, GREY_LINE),
        # vertical lines lighter
        ("LINEAFTER", (0, 1), (-2, -1), 0.2, GREY_LINE),
    ])

    # Row backgrounds: alternating + yellow for highlight rows
    for i, r in enumerate(ROWS, start=1):
        if r["highlight"]:
            s.add("BACKGROUND", (0, i), (-1, i), YELLOW)
        elif i % 2 == 0:
            s.add("BACKGROUND", (0, i), (-1, i), LIGHT_ALT)

    t.setStyle(s)
    return t


# ---------------- DOCUMENT ------------------------------------------------

def build_pdf(path):
    doc = SimpleDocTemplate(
        path,
        pagesize=landscape(A4),
        leftMargin=12 * mm,
        rightMargin=12 * mm,
        topMargin=10 * mm,
        bottomMargin=10 * mm,
        title="Produktmatrix Sanierung — TDS-Validierung",
        author="KORODUR · Sanierungs-App",
    )

    story = []

    story.append(Paragraph(
        "Produktmatrix Sanierung — TDS-Validierung",
        style_title,
    ))
    story.append(Paragraph(
        "Zweck: Vorbefüllung pro Produkt basierend auf den aktuellen Technischen Datenblättern (TDS) — "
        "(1) Fläche-Kategorie, (2) Zeit-Eigenschaft, (3) Eignung pro Einsatzbereich. "
        "Offene Punkte sind mit „?\" markiert.",
        style_meta,
    ))
    story.append(Paragraph(
        "Stand: Mai 2026 · Vorbereitet zur fachlichen Klärung mit Frank Sander &amp; Richard Vadder · "
        "Quelle: 17 TDS-PDFs von korodur.de (Stände 05/2020 bis 04/2026), pdfplumber-Volltext.",
        style_meta,
    ))
    story.append(Paragraph(
        "<b>Eignung:</b> H = Haupt-Einsatzbereich (im TDS namentlich) · M = ebenfalls möglich (Eigenschaft passt) · "
        "leer = nicht vorgesehen · ? = offen, bitte ausfüllen &nbsp;&nbsp;|&nbsp;&nbsp; "
        "<b>Fläche:</b> P = punktuell · G = großflächig · B = beides · ? = offen &nbsp;&nbsp;|&nbsp;&nbsp; "
        "<b>Zeit:</b> ■ = schnellaushärtend · — = Standard · ? = offen",
        style_legend,
    ))

    story.append(build_table())

    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Gelb hinterlegt: Zeilen mit offener Klassifikation — diese im Termin zuerst klären. "
        "TDS-Belege im Detail siehe <i>tds-work/validierung-log.md</i> und <i>tds-work/texts/</i>. "
        "Aus Vorlage entfernt (nicht in App-Aufnahme): CONCRETE PHARMACY, SYSTEM KOROCRETE, DUROP. "
        "Vorbefüllt aus TDS-Stand Mai 2026. Bitte prüfen und ggf. korrigieren. Zurück an Steffi Fleischmann.",
        style_footer,
    ))

    doc.build(story)
    print(f"OK: {path}")


if __name__ == "__main__":
    build_pdf("produktmatrix-validierung-tds-befuellt.pdf")
