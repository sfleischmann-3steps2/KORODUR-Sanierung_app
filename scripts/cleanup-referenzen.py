"""
Säubert data/referenzen.ts:
  - Entfernt Zeilen für: kategorie, unterkategorie, anwendungsbereich (singular),
    massnahme, belastungen, zustand, sonderbedingungen
  - Renamet anwendungsbereiche: → einsatzbereiche:

Idempotent: kann mehrfach laufen.
"""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PATH = ROOT / "data/referenzen.ts"

content = PATH.read_text()
original = content

# Mehrzeilen-Felder (Array über mehrere Zeilen) erst kollabieren ist tricky;
# zum Glück sind belastungen/zustand/sonderbedingungen einzeilig im File.
# Wir entfernen ganze Zeilen, die mit einem dieser Keys beginnen.
REMOVE_KEYS = ["kategorie", "unterkategorie", "anwendungsbereich",
               "massnahme", "belastungen", "zustand", "sonderbedingungen"]

lines = content.split("\n")
new_lines = []
for line in lines:
    stripped = line.lstrip()
    if any(stripped.startswith(f"{k}:") for k in REMOVE_KEYS):
        continue
    new_lines.append(line)

content = "\n".join(new_lines)

# Rename anwendungsbereiche → einsatzbereiche (Property-Key in Daten)
content = re.sub(r"\banwendungsbereiche:\s*", "einsatzbereiche: ", content)

PATH.write_text(content)
print(f"Cleaned. Lines before: {len(original.splitlines())}, after: {len(content.splitlines())}")
