import argparse
import json
import random
import re
import sys
import threading
import time

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import parse_qs, urljoin, urlparse

import requests
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

BASE_URL = "https://brit-petfood.com"
CATALOG_URL = f"{BASE_URL}/ro/products"
USER_AGENT = "BritProductCatalogScraper/1.0 (+local catalog export)"
_thread_local = threading.local()

CAT_MAP = {
    "dogs": "Câini",
    "cats": "Pisici",
    "rodents": "Rozătoare",
    "caini": "Câini",
    "pisici": "Pisici",
    "rozatoare": "Rozătoare",
}


def clean(value):
    return re.sub(r"\s+", " ", value or "").strip()


def unique(values):
    return list(dict.fromkeys(value for value in values if value))


def get_session():
    if not hasattr(_thread_local, "session"):
        retry = Retry(
            total=5,
            connect=5,
            read=5,
            backoff_factor=0.8,
            status_forcelist=(429, 500, 502, 503, 504),
            allowed_methods=("GET",),
            respect_retry_after_header=True,
        )
        session = requests.Session()
        session.headers.update({"User-Agent": USER_AGENT, "Accept-Language": "en"})
        session.mount("https://", HTTPAdapter(max_retries=retry))
        _thread_local.session = session
    return _thread_local.session


def fetch(url, timeout, delay=0):
    if delay:
        time.sleep(delay + random.uniform(0, delay / 2))
    response = get_session().get(url, timeout=timeout)
    response.raise_for_status()
    return BeautifulSoup(response.content, "html.parser")


def discover_product_urls(timeout):
    first_page = fetch(CATALOG_URL, timeout)
    page_numbers = []
    for link in first_page.select('.productList a[href*="page="]'):
        query = parse_qs(urlparse(link.get("href", "")).query)
        if query.get("page") and query["page"][0].isdigit():
            page_numbers.append(int(query["page"][0]))
    page_count = max(page_numbers, default=1)
    urls = []
    for page in range(1, page_count + 1):
        soup = first_page if page == 1 else fetch(f"{CATALOG_URL}?page={page}", timeout)
        for card in soup.select(".productList .box-product"):
            link = card.find("a", href=True)
            if link:
                urls.append(urljoin(BASE_URL, link["href"]))
        print(f"Catalog page {page}/{page_count}: {len(unique(urls))} products found", flush=True)
    return unique(urls), page_count


def image_role(image):
    if image.has_attr("itemprop") and image.get("itemprop") == "image":
        return "main"
    if image.find_parent(class_="benefits"):
        return "benefit"
    if image.find_parent(class_="img-main"):
        return "product"
    return "content"


def parse_images(container):
    images = []
    seen = set()
    for image in container.select("img[src]"):
        source = clean(image.get("src"))
        if not source:
            continue
        url = urljoin(BASE_URL, source)
        if url in seen:
            continue
        seen.add(url)
        images.append({"url": url, "alt": clean(image.get("alt")), "role": image_role(image)})
    return images


def parse_tables(block):
    tables = []
    for table in block.select("table"):
        rows = []
        for row in table.select("tr"):
            cells = [clean(cell.get_text(" ", strip=True)) for cell in row.select("th, td")]
            if any(cells):
                rows.append(cells)
        if rows:
            tables.append(rows)
    return tables


def parse_sections(column):
    headings = [
        heading
        for heading in column.find_all(["strong", "b"])
        if clean(heading.get_text(" ", strip=True)).endswith(":")
    ]
    sections = {}
    heading_blocks = {id(heading.parent) for heading in headings}
    for heading in headings:
        label_text = clean(heading.get_text(" ", strip=True))
        label = label_text.rstrip(":")
        block = heading.parent
        text = clean(block.get_text(" ", strip=True))
        if text.startswith(label_text):
            text = clean(text[len(label_text):].lstrip(":"))
        texts = [text] if text else []
        tables = parse_tables(block)
        sibling = block.find_next_sibling()
        while sibling and id(sibling) not in heading_blocks:
            sibling_text = clean(sibling.get_text(" ", strip=True))
            if sibling_text:
                texts.append(sibling_text)
            tables.extend(parse_tables(sibling))
            sibling = sibling.find_next_sibling()
        sections[label] = {"text": "\n\n".join(unique(texts)), "tables": tables}
    return sections


def section_value(sections, names):
    for label, value in sections.items():
        normalized_label = clean(label).lower()
        if any(name in normalized_label for name in names):
            return value["text"] or None
    return None


def parse_product(url, timeout, delay):
    soup = fetch(url, timeout, delay)
    detail = soup.select_one(".box-detail.product-wrap") or soup.select_one(".box-detail")
    title = soup.select_one("h1.title") or soup.find("h1")
    if not detail or not title:
        raise ValueError("Product detail container or title was not found")
    content_column = detail.select_one(".col-sm-8") or detail
    overview_container = content_column.select_one(".hidden-xs") or content_column.select_one(".visible-xs-block")
    overview = unique(
        clean(paragraph.get_text(" ", strip=True))
        for paragraph in (overview_container.select("p") if overview_container else [])
    )
    if overview_container and not overview:
        overview = unique([clean(overview_container.get_text(" ", strip=True))])
    benefit_texts = []
    for benefit in detail.select(".benefits"):
        items = benefit.select(".benefits__item") or benefit.select("p, li")
        benefit_texts.extend(clean(item.get_text(" ", strip=True)) for item in items)
    benefit_texts = unique(benefit_texts)
    variants = unique(clean(item.get_text(" ", strip=True)) for item in detail.select(".package-wrap li"))
    sections = parse_sections(content_column)
    images = parse_images(detail)
    main_image = next((image["url"] for image in images if image["role"] == "main"), None)
    videos = unique(
        urljoin(BASE_URL, element.get(attribute))
        for element in detail.select("video[src], video source[src], iframe[src], .videos a[href]")
        for attribute in ("src", "href")
        if element.get(attribute)
    )
    breadcrumbs = unique(clean(item.get_text(" ", strip=True)) for item in soup.select("#menu-breadcrumb a, #menu-breadcrumb strong"))
    parsed_path = [part for part in urlparse(url).path.split("/") if part]
    category = None
    for part in parsed_path:
        if part in CAT_MAP:
            category = CAT_MAP[part]
            break
    if not category:
        for link in soup.select(".crossroad-products a[href]"):
            link_parts = [part for part in urlparse(link.get("href", "")).path.split("/") if part]
            for part in link_parts:
                if part in CAT_MAP:
                    category = CAT_MAP[part]
                    break
            if category:
                break
    product_slug = parsed_path[-1]
    product_id_match = re.match(r"(\d+)(?:-|$)", product_slug)
    description_meta = soup.select_one('meta[name="description"]')
    keywords_meta = soup.select_one('meta[name="keywords"]')
    seo_description = clean(description_meta.get("content")) if description_meta else None
    labels = unique(clean(label.get_text(" ", strip=True)) for label in detail.select(".product-labels *"))
    all_information = unique(overview + benefit_texts + [value["text"] for value in sections.values()])
    return {
        "id": product_id_match.group(1) if product_id_match else None,
        "name": clean(title.get_text(" ", strip=True)),
        "url": url,
        "slug": product_slug,
        "category": category,
        "breadcrumbs": breadcrumbs,
        "labels": labels,
        "description": "\n\n".join(overview) or seo_description,
        "overview": overview,
        "benefits": benefit_texts,
        "variants": variants,
        "image": main_image,
        "images": images,
        "videos": videos,
        "composition": section_value(sections, ("compoziție", "compozitie", "composition")),
        "analytical_ingredients": section_value(sections, ("compuși analitici", "compusi analitici", "ingrediente analitice", "analytical")),
        "nutritional_composition": section_value(sections, ("compoziție nutrițională", "compozitie nutritionala", "nutritional")),
        "feeding_guide": section_value(sections, ("ghid de hrănire", "ghid de hranire", "hrănire", "hranire", "feeding")),
        "metabolizable_energy": section_value(sections, ("energie metabolizabilă", "energie metabolizabila", "metabolizable", "metabolisable")),
        "sections": sections,
        "all_information": all_information,
        "raw_text": clean(detail.get_text(" ", strip=True)),
        "seo": {
            "title": clean(soup.title.get_text(" ", strip=True)) if soup.title else None,
            "description": seo_description,
            "keywords": clean(keywords_meta.get("content")) if keywords_meta else None,
        },
    }


def scrape(output, workers, timeout, delay, limit=None):
    urls, page_count = discover_product_urls(timeout)
    if limit:
        urls = urls[:limit]
    products = [None] * len(urls)
    errors = []
    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = {
            executor.submit(parse_product, url, timeout, delay): (index, url)
            for index, url in enumerate(urls)
        }
        completed = 0
        for future in as_completed(futures):
            index, url = futures[future]
            completed += 1
            try:
                products[index] = future.result()
                print(f"[{completed}/{len(urls)}] OK {products[index]['name']}", flush=True)
            except Exception as error:
                errors.append({"url": url, "error": str(error)})
                print(f"[{completed}/{len(urls)}] ERROR {url}: {error}", flush=True)
    products = [product for product in products if product]
    result = {
        "source": CATALOG_URL,
        "scraped_at": datetime.now(timezone.utc).isoformat(),
        "catalog_pages": page_count,
        "product_count": len(products),
        "failed_count": len(errors),
        "errors": errors,
        "products": products,
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Saved {len(products)} products to {output}", flush=True)
    if errors:
        raise RuntimeError(f"{len(errors)} products could not be scraped; details are in the output JSON")


def main():
    parser = argparse.ArgumentParser(description="Export all public Brit product details to JSON")
    parser.add_argument("--output", type=Path, default=Path(__file__).with_name("products.json"))
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--timeout", type=float, default=30)
    parser.add_argument("--delay", type=float, default=0.2)
    parser.add_argument("--limit", type=int)
    args = parser.parse_args()
    if args.workers < 1 or args.timeout <= 0 or args.delay < 0 or (args.limit is not None and args.limit < 1):
        parser.error("workers, timeout and limit must be positive; delay cannot be negative")
    scrape(args.output.resolve(), args.workers, args.timeout, args.delay, args.limit)


if __name__ == "__main__":
    main()
