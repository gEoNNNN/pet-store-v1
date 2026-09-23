import argparse
import json
import random
import re
import sys
import threading
import time
import xml.etree.ElementTree as ET

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import unquote, urlparse, urlunparse

import requests
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

BASE_URL = "https://carnilove.com"
CATALOG_URL = f"{BASE_URL}/en"
SITEMAP_URL = f"{BASE_URL}/en/sitemap_products.xml"
USER_AGENT = "CarniloveProductCatalogScraper/1.0 (+local catalog export)"
_thread_local = threading.local()


def clean(value):
    return re.sub(r"\s+", " ", value or "").strip()


def unique(values):
    return list(dict.fromkeys(value for value in values if value))


def original_url(url):
    parsed = urlparse(url)
    return urlunparse((parsed.scheme, parsed.netloc, parsed.path, "", "", ""))


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
        session.headers.update({"User-Agent": USER_AGENT, "Accept-Language": "en-GB,en;q=0.9"})
        session.mount("https://", HTTPAdapter(max_retries=retry))
        _thread_local.session = session
    return _thread_local.session


def fetch_response(url, timeout, delay=0):
    if delay:
        time.sleep(delay + random.uniform(0, delay / 2))
    response = get_session().get(url, timeout=timeout)
    response.raise_for_status()
    return response


def discover_product_urls(timeout):
    response = fetch_response(SITEMAP_URL, timeout)
    root = ET.fromstring(response.content)
    urls = unique(
        node.text.strip()
        for node in root.findall(".//{*}loc")
        if node.text and "/en/products/" in node.text
    )
    print(f"Sitemap: {len(urls)} products found", flush=True)
    return urls


def parse_tables(container):
    tables = []
    for table in container.select("table"):
        rows = []
        for row in table.select("tr"):
            cells = [clean(cell.get_text(" ", strip=True)) for cell in row.select("th, td")]
            if any(cells):
                rows.append(cells)
        if rows:
            tables.append(rows)
    return tables


def parse_subsections(container):
    subsections = {}
    for heading in container.find_all(["strong", "b"]):
        label = clean(heading.get_text(" ", strip=True)).rstrip(":")
        if not label:
            continue
        block = heading.parent
        text = clean(block.get_text(" ", strip=True))
        heading_text = clean(heading.get_text(" ", strip=True))
        if text.startswith(heading_text):
            text = clean(text[len(heading_text):].lstrip(":-"))
        if text and text != label:
            subsections[label] = text
    return subsections


def parse_sections(product_area):
    sections = {}
    for card in product_area.select(".product-info-card"):
        title_element = card.select_one(".product-info-card__trigger")
        content = card.select_one(".product-info-card__tray-content")
        if not title_element or not content:
            continue
        title = clean(title_element.get_text(" ", strip=True))
        paragraphs = unique(clean(item.get_text(" ", strip=True)) for item in content.select("p, li"))
        sections[title] = {
            "text": clean(content.get_text(" ", strip=True)),
            "paragraphs": paragraphs,
            "tables": parse_tables(content),
            "subsections": parse_subsections(content),
        }
    return sections


def find_section(sections, *names):
    for title, section in sections.items():
        normalized_title = title.lower()
        if any(name in normalized_title for name in names):
            return section
    return None


def parse_gallery(product_area, soup):
    images = []
    seen = set()
    og_image = soup.select_one('meta[property="og:image"]')
    main_url = original_url(og_image.get("content")) if og_image and og_image.get("content") else None
    for image in product_area.select(".imageGallery__main img[src], .imageGallery__main img[srcset]"):
        source = image.get("src")
        if not source and image.get("srcset"):
            source = image["srcset"].split(",")[-1].strip().split(" ")[0]
        if not source:
            continue
        url = original_url(source)
        if url in seen:
            continue
        seen.add(url)
        images.append({"url": url, "alt": clean(image.get("alt")), "role": "main" if url == main_url else "gallery"})
    if main_url and main_url not in seen:
        images.insert(0, {"url": main_url, "alt": "", "role": "main"})
    if images and not any(image["role"] == "main" for image in images):
        images[0]["role"] = "main"
        main_url = images[0]["url"]
    return main_url, images


def parse_fresh_ingredients(soup):
    ingredients = []
    carousel = soup.select_one(".ingredient-carousel")
    if not carousel:
        return ingredients
    for slide in carousel.select(".glide__slide"):
        title = slide.find(["h3", "h4"])
        image = slide.select_one("img[src]")
        full_text = clean(slide.get_text(" ", strip=True))
        name = clean(title.get_text(" ", strip=True)) if title else None
        description = full_text
        if name and description.startswith(name):
            description = clean(description[len(name):])
        ingredients.append({
            "name": name,
            "description": description,
            "image": original_url(image.get("src")) if image and image.get("src") else None,
        })
    return ingredients


def parse_feature_list(product_area):
    container = product_area.select_one(".product-details-section__usp-list")
    if not container:
        return []
    items = container.find_all(["li", "article"], recursive=True)
    if not items:
        items = [child for child in container.find_all(recursive=False) if clean(child.get_text(" ", strip=True))]
    return unique(clean(item.get_text(" ", strip=True)) for item in items) or [clean(container.get_text(" ", strip=True))]


def extract_energy(*texts):
    patterns = [
        r"metaboli[sz]able energy\s*:?\s*([^.;]+(?:\.[0-9]+)?(?:\s*kcal/kg)?(?:\s*\([^)]*\))?)",
        r"(\d[\d ,.]*\s*kcal/kg(?:\s*\([^)]*\))?)",
    ]
    for pattern in patterns:
        for text in texts:
            match = re.search(pattern, text or "", re.IGNORECASE)
            if match:
                return clean(match.group(1))
    return None


def extract_package_sizes(*texts):
    pattern = r"\b(?:\d+\s*[x×]\s*)?\d+(?:[.,]\d+)?\s*(?:kg|g|ml)\b"
    return unique(match.group(0) for text in texts for match in re.finditer(pattern, text or "", re.IGNORECASE))


def parse_product(url, timeout, delay):
    response = fetch_response(url, timeout, delay)
    soup = BeautifulSoup(response.content, "html.parser")
    product_area = soup.select_one(".product-details-section")
    title_element = product_area.find("h1") if product_area else None
    if not product_area or not title_element:
        raise ValueError("Product detail container or title was not found")
    name = clean(title_element.get_text(" ", strip=True))
    summary_element = product_area.select_one(".product-summary__summary-body-copy")
    description_meta = soup.select_one('meta[name="description"]')
    description = clean(summary_element.get_text(" ", strip=True)) if summary_element else ""
    seo_description = clean(description_meta.get("content")) if description_meta else None
    labels = unique(clean(item.get_text(" ", strip=True)) for item in product_area.select(".product-summary__labels > *"))
    if not labels:
        labels = unique([clean(item.get_text(" ", strip=True)) for item in product_area.select(".product-summary__labels")])
    features = parse_feature_list(product_area)
    ingredient_tags = unique(clean(image.get("alt")) for image in product_area.select(".product-summary__ingredient-icons img[alt]"))
    sections = parse_sections(product_area)
    details_section = find_section(sections, "product detail", "bundle detail")
    ingredients_section = find_section(sections, "ingredient")
    feeding_section = find_section(sections, "feeding")
    nutrition_section = find_section(sections, "nutrition")
    main_image, images = parse_gallery(product_area, soup)
    fresh_ingredients = parse_fresh_ingredients(soup)
    breadcrumbs = unique(clean(item.get_text(" ", strip=True)) for item in soup.select("nav.breadcrumb a, nav.breadcrumb li"))
    breadcrumb_text = " ".join(breadcrumbs).lower()
    category = "cats" if "cat" in breadcrumb_text else "dogs" if "dog" in breadcrumb_text else None
    if not category:
        category_text = f"{name} {description} {details_section['text'] if details_section else ''}".lower()
        if re.search(r"\b(cat|cats|kitten|kittens|feline)\b", category_text):
            category = "cats"
        elif re.search(r"\b(dog|dogs|puppy|puppies|canine|small breeds)\b", category_text):
            category = "dogs"
    product_type = breadcrumbs[-1] if len(breadcrumbs) > 1 else None
    parsed_url = urlparse(url)
    slug = parsed_url.path.rstrip("/").split("/")[-1]
    image_filename = unquote(urlparse(main_image).path.split("/")[-1]) if main_image else ""
    product_id = Path(image_filename).stem or slug
    feeding_text = feeding_section["text"] if feeding_section else None
    nutrition_text = nutrition_section["text"] if nutrition_section else None
    nutritional_additives = None
    analytical_constituents = None
    if nutrition_section:
        nutritional_additives = next(
            (value for label, value in nutrition_section["subsections"].items() if "nutritional additive" in label.lower()),
            None,
        )
        nutrition_paragraphs = nutrition_section["paragraphs"]
        analytical_constituents = nutrition_paragraphs[0] if nutrition_paragraphs else nutrition_text
        if not nutritional_additives:
            for index, paragraph in enumerate(nutrition_paragraphs[:-1]):
                if "nutritional additive" in paragraph.lower():
                    nutritional_additives = nutrition_paragraphs[index + 1]
                    break
    videos = unique(
        original_url(element.get("src"))
        for element in product_area.select("video[src], video source[src], iframe[src]")
        if element.get("src")
    )
    raw_text_parts = [clean(product_area.get_text(" ", strip=True))]
    carousel = soup.select_one(".ingredient-carousel")
    if carousel:
        raw_text_parts.append(clean(carousel.get_text(" ", strip=True)))
    raw_text = "\n\n".join(unique(raw_text_parts))
    return {
        "id": product_id,
        "name": name,
        "url": url,
        "slug": slug,
        "category": category,
        "product_type": product_type,
        "breadcrumbs": breadcrumbs,
        "labels": labels,
        "description": description or seo_description,
        "features": features,
        "ingredient_tags": ingredient_tags,
        "package_sizes": extract_package_sizes(name, description),
        "image": main_image,
        "images": images,
        "videos": videos,
        "product_details": details_section["text"] if details_section else None,
        "ingredients": ingredients_section["text"] if ingredients_section else None,
        "feeding_guide": feeding_text,
        "nutrition": nutrition_text,
        "analytical_constituents": analytical_constituents,
        "nutritional_additives": nutritional_additives,
        "metabolizable_energy": extract_energy(feeding_text, nutrition_text),
        "fresh_ingredients": fresh_ingredients,
        "sections": sections,
        "raw_text": raw_text,
        "seo": {
            "title": clean(soup.title.get_text(" ", strip=True)) if soup.title else None,
            "description": seo_description,
            "canonical_url": clean(soup.select_one('link[rel="canonical"]').get("href")) if soup.select_one('link[rel="canonical"]') else None,
        },
    }


def scrape(output, workers, timeout, delay, limit=None):
    urls = discover_product_urls(timeout)
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
        "brand": "Carnilove",
        "source": CATALOG_URL,
        "sitemap": SITEMAP_URL,
        "scraped_at": datetime.now(timezone.utc).isoformat(),
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
    parser = argparse.ArgumentParser(description="Export all public Carnilove product details to JSON")
    parser.add_argument("--output", type=Path, default=Path(__file__).with_name("carnilove_products.json"))
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--timeout", type=float, default=30)
    parser.add_argument("--delay", type=float, default=0.25)
    parser.add_argument("--limit", type=int)
    args = parser.parse_args()
    if args.workers < 1 or args.timeout <= 0 or args.delay < 0 or (args.limit is not None and args.limit < 1):
        parser.error("workers, timeout and limit must be positive; delay cannot be negative")
    scrape(args.output.resolve(), args.workers, args.timeout, args.delay, args.limit)


if __name__ == "__main__":
    main()
