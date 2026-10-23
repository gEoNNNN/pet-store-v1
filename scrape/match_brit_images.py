"""Potriveste imaginile Brit de pe brit.pet cu produsele din scrape/products.json.

- Extrage codul de produs din numele fisierului vechi (ex. 100172198-....png)
- Il cauta in brit_pet_map.json (SKU) si inlocuieste image-ul mort cu URL Contentful
- Fallback: potrivire dupa nume normalizat
- Imaginile de galerie/pictograme care raman pe domeniul mort sunt eliminate
"""

import io
import json
import os
import re
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRODUCTS = os.path.join(ROOT, "scrape", "products.json")
MAP = os.path.join(ROOT, "scrape", "brit_pet_map.json")


def norm_name(s):
    s = re.sub(r"[^a-z0-9]+", " ", s.lower()).strip()
    return re.sub(r"\s+", " ", s).strip()


def tokens(s):
    return set(norm_name(s).split()) - {"p", "x", "pack"}


def best_name_match(name, candidates):
    """Cel mai bun match dupa suprapunerea tokenilor (Jaccard)."""
    mine = tokens(name)
    best, best_score = None, 0.0
    for p in candidates:
        theirs = tokens(p["name"])
        if not theirs:
            continue
        inter = len(mine & theirs)
        score = inter / len(mine | theirs)
        if score > best_score:
            best, best_score = p, score
    return best if best_score >= 0.6 else None


def main():
    data = json.load(open(PRODUCTS, encoding="utf-8"))
    pet_map = json.load(open(MAP, encoding="utf-8"))

    by_name = {}
    for sku, p in pet_map.items():
        by_name.setdefault(norm_name(p["name"]), p)
    all_pet = list(pet_map.values())

    matched_sku = matched_name = dead = 0
    for p in data["products"]:
        img = str(p.get("image") or "")
        if "brit-petfood.com" not in img:
            continue  # deja local sau deja potrivit

        codes = re.findall(r"(\d{7,9})", img)
        hit = next((pet_map[c] for c in codes if c in pet_map), None)
        if hit:
            p["image"] = hit["imageUrl"]
            matched_sku += 1
            continue

        name_hit = by_name.get(norm_name(p.get("name", ""))) or best_name_match(
            p.get("name", ""), all_pet
        )
        if name_hit:
            p["image"] = name_hit["imageUrl"]
            matched_name += 1
            continue
        dead += 1

    # galeria moarta (brit-petfood.com e offline) — pastram doar imaginile locale
    for p in data["products"]:
        p["images"] = [
            i for i in (p.get("images") or [])
            if isinstance(i, dict) and str(i.get("url", "")).startswith("/")
        ]

    json.dump(data, open(PRODUCTS, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"match SKU: {matched_sku} | match nume: {matched_name} | fara match: {dead}")


if __name__ == "__main__":
    main()
