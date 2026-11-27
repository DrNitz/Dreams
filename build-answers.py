#!/usr/bin/env python3
"""Build assets/answers.json from the site's own FAQ schema and quick summaries.

Run from anywhere: python3 build-answers.py
No network access and no third-party packages. Every answer in the output comes
from text already published on this site.
"""

from pathlib import Path
import html
import json
import re

BASE = Path(__file__).resolve().parent
OUT = BASE / "assets" / "answers.json"


def clean(value):
    value = re.sub(r"<[^>]+>", " ", value)
    return re.sub(r"\s+", " ", html.unescape(value)).strip()


def page_url(path):
    rel = path.relative_to(BASE)
    slug = rel.parent.as_posix()
    if slug == ".":
        return "https://drdreams.in/"
    return "https://drdreams.in/" + slug + "/"


def main():
    entries = []
    seen = set()

    for path in sorted(BASE.glob("**/index.html")):
        if ".git" in path.parts:
            continue
        text = path.read_text(encoding="utf-8")
        url = page_url(path)

        article = {}
        faq = None
        for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', text, re.S):
            try:
                data = json.loads(block)
            except (ValueError, TypeError):
                continue
            if data.get("@type") == "Article":
                article = data
            if data.get("@type") == "FAQPage":
                faq = data

        h1 = re.search(r"<h1[^>]*>(.*?)</h1>", text, re.S | re.I)
        source = article.get("headline")
        if not source and h1:
            source = h1.group(1)
        source = clean(source or url)
        keywords = source

        if faq:
            for item in faq.get("mainEntity", []):
                question = clean(item.get("name", ""))
                answer = clean(item.get("acceptedAnswer", {}).get("text", ""))
                if not question or not answer:
                    continue
                key = (question.lower(), answer.lower())
                if key in seen:
                    continue
                seen.add(key)
                entries.append({
                    "q": question,
                    "a": answer,
                    "k": keywords,
                    "u": url,
                    "s": source,
                })

        summary = re.search(
            r'<span class="callout-title">Quick summary</span>\s*<p>(.*?)</p>',
            text,
            re.S | re.I,
        )
        if summary:
            answer = clean(summary.group(1))
            question = "What should I know about " + source + "?"
            key = (question.lower(), answer.lower())
            if key not in seen:
                seen.add(key)
                entries.append({
                    "q": question,
                    "a": answer,
                    "k": keywords,
                    "u": url,
                    "s": source,
                })

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(entries, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {len(entries)} answers to {OUT.relative_to(BASE)}")


if __name__ == "__main__":
    main()
