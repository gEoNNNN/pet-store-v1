# -*- coding: utf-8 -*-
"""Atribuie etichete de specie (Câini / Pisici / Rozătoare / Păsări) tuturor
produselor, pe baza numelui + descrierii. Câmpul `category` ramane neschimbat;
etichetele de specie fac produsele filtrabile dupa specie."""
import io
import json
import os
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
SCRAPE = os.path.dirname(__file__)

SPECIES = ["Câini", "Pisici", "Rozătoare", "Păsări"]
RULES = [
    (["pisic", "pisoi", "kitten", " cat ", "feline", "pentru pisici", "kedi"], "Pisici"),
    (["câin", "cain", "cățe", "catei", "dog", "puppy", "kopek", "köpek"], "Câini"),
    (["iepur", "rozăto", "rozato", "hamster", "rabbit", "guinea", "şinşil", "chinchilla",
      "veverit", "porcusor"], "Rozătoare"),
    (["păsări", "pasari", "poultry", "gaina", "găini", "pui de gaina", "bird"], "Păsări"),
]


def species_for(text):
    t = " " + text.lower() + " "
    found = set()
    for keys, spec in RULES:
        if any(k in t for k in keys):
            found.add(spec)
    return found


def main():
    stats = {}
    for fname in ["ekoprom_products.json", "natura_products.json",
                  "products.json", "carnilove_products.json"]:
        path = os.path.join(SCRAPE, fname)
        data = json.load(open(path, encoding="utf-8"))
        changed = 0
        for p in data["products"]:
            labels = p.setdefault("labels", [])
            text = f"{p.get('name','')} {p.get('name_en','')} {p.get('slug','')} {p.get('description','')} {p.get('product_type','')}"
            found = species_for(text)
            # categoria curenta e si ea o specie -> o pastram
            if p.get("category") in SPECIES:
                found.add(p["category"])
            before = set(labels)
            for spec in sorted(found):
                if spec not in labels:
                    labels.append(spec)
            if set(labels) != before:
                changed += 1
        json.dump(data, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
        stats[fname] = (changed, len(data["products"]))
    for f, (c, t) in stats.items():
        print(f"{f}: {c} produse retagetizate din {t}")

    # produse ramase fara nici o specie -> raport
    for fname in ["ekoprom_products.json", "natura_products.json"]:
        data = json.load(open(os.path.join(SCRAPE, fname), encoding="utf-8"))
        missing = [p["slug"] for p in data["products"]
                   if not any(s in p.get("labels", []) for s in SPECIES)]
        print(fname, "fara specie:", len(missing), missing[:15])


if __name__ == "__main__":
    main()
