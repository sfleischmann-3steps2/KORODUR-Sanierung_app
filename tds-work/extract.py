#!/usr/bin/env python3
"""Extract full text from TDS PDFs."""
import json, os, sys
import pdfplumber

with open("products.json") as f:
    products = json.load(f)

os.makedirs("texts", exist_ok=True)

for p in products:
    pdf_path = f"pdfs/{p['filename']}"
    txt_path = f"texts/{p['filename'].replace('.pdf', '.txt')}"
    if not os.path.exists(pdf_path):
        print(f"SKIP {p['name']} (no PDF)")
        continue
    if os.path.exists(txt_path) and os.path.getsize(txt_path) > 100:
        print(f"OK   {p['name']} (cached)")
        continue
    pages_text = []
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for i, page in enumerate(pdf.pages, 1):
                t = page.extract_text() or ""
                pages_text.append(f"--- PAGE {i} ---\n{t}")
    except Exception as e:
        print(f"FAIL {p['name']}: {e}")
        continue
    text = "\n\n".join(pages_text)
    with open(txt_path, "w") as f:
        f.write(text)
    print(f"OK   {p['name']}  ({len(text):>6} chars, {len(pages_text)} pages)")
