"""Mineste toate paginile de categorie arhivate ale naturapetfood.com (EN + TR,
cu paginare) si extrage maparea slug -> imagine oficiala.

Wayback limiteaza agresiv: ritm lent, backoff lung, progres salvat incremental.
  python scrape/mine_natura_categories.py list    -> scrape/_wb_catpages.json
  python scrape/mine_natura_categories.py mine    -> completeaza _natura_official.json
"""
import json
import os
import sys
import time
import urllib.parse
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from wayback_natura_images import get, parse_page  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8")

PAGES_FILE = "scrape/_wb_catpages.json"
MAP_FILE = "scrape/_natura_official.json"
DONE_FILE = "scrape/_wb_catdone.json"
H = {"User-Agent": "Mozilla/5.0"}
PAUSE = 35  # secunde intre pagini (Wayback limiteaza agresiv)


def cmd_list():
    urls = {}
    for page in range(0, 4):
        api = ("https://web.archive.org/cdx/search/cdx?url=naturapetfood.com%2Fproduct-category%2F"
               "&matchType=prefix&output=json&fl=timestamp,original&filter=statuscode:200"
               f"&collapse=urlkey&limit=600&page={page}")
        try:
            rows = json.loads(get(api, timeout=120, tries=3))
        except Exception as exc:
            print("pagina CDX", page, "esec:", str(exc)[:60])
            break
        rows = rows[1:]
        print("CDX pagina", page, "->", len(rows), "randuri")
        if not rows:
            break
        for timestamp, original in rows:
            if "?" in original or "/feed" in original:
                continue
            urls.setdefault(original, timestamp)
        time.sleep(3)
    json.dump(urls, open(PAGES_FILE, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("pagini de categorie arhivate:", len(urls))


def cmd_mine():
    pages = json.load(open(PAGES_FILE, encoding="utf-8"))
    mapping = json.load(open(MAP_FILE, encoding="utf-8")) if os.path.exists(MAP_FILE) else {}
    done = set(json.load(open(DONE_FILE, encoding="utf-8"))) if os.path.exists(DONE_FILE) else set()
    todo = [(u, t) for u, t in pages.items() if u not in done]
    print(f"de procesat: {len(todo)} pagini (deja: {len(done)})", flush=True)
    for index, (url, timestamp) in enumerate(todo, 1):
        try:
            html = get(f"https://web.archive.org/web/{timestamp}/{url}", timeout=90, tries=4).decode("utf-8", "replace")
        except Exception as exc:
            print(f"[{index}/{len(todo)}] ESEC {url[-60:]} :: {str(exc)[:50]}", flush=True)
            time.sleep(PAUSE * 2)
            continue
        found = parse_page(html)
        before = len(mapping)
        mapping.update(found)
        done.add(url)
        json.dump(mapping, open(MAP_FILE, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        json.dump(sorted(done), open(DONE_FILE, "w", encoding="utf-8"))
        print(f"[{index}/{len(todo)}] {url[-62:]} -> {len(found)} produse (+{len(mapping)-before} noi, total {len(mapping)})", flush=True)
        time.sleep(PAUSE)
    print("TOTAL slug-uri cu imagine oficiala:", len(mapping))


if __name__ == "__main__":
    command = sys.argv[1] if len(sys.argv) > 1 else "list"
    cmd_list() if command == "list" else cmd_mine()
