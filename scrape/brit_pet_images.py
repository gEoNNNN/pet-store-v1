"""Mapeaza imaginile produselor Brit de pe brit.pet (noul site oficial).

brit-petfood.com e offline; brit.pet gazduieste aceleasi produse pe Contentful.
Fiecare pagina de colectie contine JSON embedded cu {id, name, imageUrl, url, sku}.
SKU-ul = codul din numele fisierelor vechi (ex. 100172198-p-brit-care-....png).

Rezultat: scrape/brit_pet_map.json = sku/name -> imageUrl pentru matching local.
"""

import html
import io
import json
import os
import re
import sys
import time
import requests

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "scrape", "brit_pet_map.json")
BASE = "https://brit.pet"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

OBJ_RE = re.compile(
    r'\{"id":"(\d+)","name":"((?:[^"\\]|\\.)*?)","price":.*?'
    r'"imageUrl":"([^"]+?)","url":"([^"]+?)","sku":"(\d+)"',
    re.S,
)


def fetch(url):
    r = requests.get(url, headers=HEADERS, timeout=25)
    r.raise_for_status()
    return html.unescape(r.text)


def main():
    home = fetch(f"{BASE}/en")
    collections = sorted(set(re.findall(r'href="(/en/collections/[^"?]+)"', home)))
    print(f"{len(collections)} colectii")

    products = {}  # sku -> {name, imageUrl, url}
    for i, coll in enumerate(collections):
        page = 1
        while True:
            url = f"{BASE}{coll}" + (f"?page={page}" if page > 1 else "")
            try:
                text = fetch(url)
            except Exception as e:
                print(f"  {coll} p{page}: {e}")
                break
            found = OBJ_RE.findall(text)
            if not found:
                break
            new = 0
            for pid, name, image_url, prod_url, sku in found:
                if sku not in products:
                    products[sku] = {"name": name, "imageUrl": image_url, "url": prod_url}
                    new += 1
            page += 1
            if page > 8:
                break
            time.sleep(0.4)
        print(f"  [{i+1}/{len(collections)}] {coll}: total {len(products)} produse")
        time.sleep(0.4)

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=1)
    print(f"salvat {len(products)} SKU-uri -> {OUT}")


if __name__ == "__main__":
    main()
