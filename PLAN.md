# DrDreams: plan to finish the site and make it findable

**Status:** approved 25 November 2026
**Decisions:** build on the existing 27 pages, no new pages, start with the Phase 1 copy pass.
**Date:** 25 November 2026
**Author of the site:** Dr. Nitz (Nitish)
**Liveliest part first:** the hard work is already done. This plan is mostly closing gaps and tightening, not a rebuild.

---

## 1. What is already here

The repo holds a working 27-page reference site, built on 22 to 24 November 2026. It is closer to finished than the request assumes.

**Content:** 21 top-level pages plus 6 college pages.

- Guides: home, MBBS in the Philippines, FAQ (18 questions), fees and cost, without NEET, admission process, documents required, NMC rules, FMGE and NExT, validity in India, after MBBS, city comparison, country comparison, student life, study resources, glossary.
- Colleges: GCM Gullas, Southwestern, Perpetual Help, DMSF, Brokenshire, Jose Maria College.
- Site pages: about, contact, privacy, disclaimer.

**Metadata and discovery already in place:**

- Unique `<title>` and meta description on all 27 pages, all within sensible lengths.
- `rel="canonical"` on all 27 pages.
- Open Graph and Twitter card tags with a real `og-image.jpg` (1200x630).
- JSON-LD on every page: `Person`, `Organization`, `CollegeOrUniversity`, `Article`, `FAQPage`, `HowTo`, `BreadcrumbList`, `DefinedTermSet`, `ContactPage`. 16 pages carry `dateModified`.
- `robots.txt` names the AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, others) and points at the sitemap and `llms.txt`.
- `sitemap.xml` lists all 27 URLs.
- `llms.txt` plus `llms-full.txt` (a concatenated corpus for bulk ingestion).
- A Markdown twin (`.md`) for every page, with YAML front matter and `<link rel="alternate" type="text/markdown">` on the HTML.

**Craft:** `DESIGN.md` sets a real direction (the ledger motif, paper/ink/teal/ochre, Newsreader plus IBM Plex Sans, dials ENERGY 2 / RHYTHM 2 / MOTION 1). `assets/site.css` and `assets/site.js` implement it. Theme toggle, mobile nav, table scroll hints, one scroll reveal, a WhatsApp enquiry form, and a gallery lightbox all work. Reduced motion is respected. Focus styles exist.

**Copy health:** a scan of all `.md` files finds no em dashes and almost no AI vocabulary. One hit: a travel metaphor in `colleges/dmsf.md`.

**First-person authority:** the site is written by a named 2025 Southwestern graduate who cleared FMGE first attempt. That is the single strongest asset here and the plan protects it.

## 2. What "complete" should mean

A complete informational site answers every question a reader arrives with, and does it before it argues anything. The current site already does that for the core path (recognition, money, life, paperwork, exams). Four kinds of gap remain:

1. **Answer gaps.** Questions a reader types that no page answers head-on: how much NEET is enough, what an education loan needs, scholarships, safety as its own topic, the full NMC college list beyond the six reviewed, and Philippines versus India.
2. **Trust gaps.** Some pages carry a "last reviewed" date and a source; some do not. Sources are cited inline but there is no consistent "where this comes from" block a reader or an answer engine can lift.
3. **SEO gaps.** Schema is strong but uneven (no `sameAs`, no sitewide `WebSite`, no `speakable`, visible breadcrumbs on 18 of 27 pages, no 404 page, no feed, images not in the image sitemap, third-party Google Fonts block render).
4. **Craft gaps.** Inline `style=` attributes sit on top of a proper design system: 56 in `mci-rules.html`, 24 in `admission-process.html`, 20 in `contact.html`, 14 each in `documents-required.html` and the college pages. `DESIGN.md` says "all twenty-one pages" and "27 pages" in two places.

## 3. Workstreams

### A. Copy pass (antislop + human-writing), all 27 pages

The voice is already good, so this is a tightening pass, not a rewrite.

- Run `human-writing/scripts/slop_check.py` on every `.md` and fix flags.
- Kill the remaining tells: that metaphor in `dmsf.md`, any rule-of-three stacks, negative parallelism, hedging, mic-drop endings.
- Keep the house rules: full stops and commas, no em dashes, first person where the experience is first hand.
- Make the direct answer the first sentence under every heading. This serves readers and answer engines at once.
- Verify every number still has a source, per R-17.

### B. Content gaps to fill

**Tier 1 (needed for a genuinely complete site):**

- Eligibility and NEET score: how much NEET you need, qualifying marks, age, the PCB percentage rule, and what that means for the 2027 intake.
- Safety: its own page, written for parents as much as students, covering cities, transport, health, emergencies, and scams to avoid.
- Education loans and scholarships: what Indian banks ask for, collateral, the moratorium, and any real scholarship routes.
- NMC-listed Philippine colleges: the directory, not just the six reviewed, with how to verify each on the NMC and WDOMS lists.
- MBBS in the Philippines versus MBBS in India: honest on cost, seats, competition, language, and licensing.

**Tier 2 (adds depth, optional):**

- Hostel and accommodation.
- 2027 intake timeline and deadlines.
- A page for parents, written to one reader on one phone.
- Updates and corrections log (also a freshness signal).
- Two useful downloads: a document checklist and a budget worksheet.

Each new page ships as an HTML page plus its `.md` twin, added to `sitemap.xml` and `llms.txt`.

### C. SEO

- Sitewide `Organization` plus `WebSite` schema: one entity, `logo`, and `sameAs` for any real profiles.
- `Article` schema completed on every guide: `datePublished`, `dateModified`, `author` (Person), `publisher` (Organization).
- Add `speakable` to the FAQ answers.
- Add `Course` schema to the pillar guide and the six college pages.
- Visible breadcrumbs on the remaining 9 pages so they match the `BreadcrumbList` already emitted.
- Internal linking: give each hub (guide, FAQ, colleges, costs) a "related pages" module and add contextual links between spokes.
- Images: add gallery images to the image sitemap, compress, and convert to WebP with JPEG fallback.
- Performance: self-host the two fonts to remove the third-party render-blocking request, preload the font files, and mark any future hero image `fetchpriority="high"`.
- Add `404.html`, an RSS feed for updates, and set `<html lang="en-IN">`.
- Keep `sitemap.xml` `lastmod` tied to each page's real review date.

### D. GEO (generative engine optimisation)

The `llms.txt` layer is already ahead of most sites. The remaining work:

- A consistent "Where this comes from" block on every page: primary sources as plain links (the NMC PDF, WDOMS, the college's own site), so an answer engine can cite them.
- A short "In short" summary at the top of each page, three or four lines.
- Question-shaped headings, mirrored to the FAQ where they overlap.
- A visible "Last reviewed <Month Year>" on the last 3 pages, and in every front matter block.
- Regenerate `llms.txt` and `llms-full.txt` on every content change, with each entry carrying its review date.
- Keep the Markdown twins exact. `DESIGN.md` already says: change the HTML and the `.md` together, never hand-edit one.

### E. Craft, accessibility, performance (antislop gates)

- Move inline `style=` attributes into `site.css`. This is the largest craft debt and it is mechanical.
- Run the contrast check on both themes for every token pair, and fix any pair under 4.5:1 (3:1 for large text).
- Verify both themes, all breakpoints, and keyboard-only use. Confirm `:focus-visible` on every control and Escape closes the lightbox and menu.
- Give the enquiry form a loading state to sit with the existing empty, error, and success states.
- Audit CTAs and headings against R-15 and R-06; swap anything generic for the specific action.
- Run the delivery gate before shipping: click every link and control, record the result element by element.

### F. Build consistency

- Decide how the Markdown twins are produced. `DESIGN.md` describes a `markdownify` step that is not in the repo. Either add that small generator script (so HTML and `.md` cannot drift) or keep the twins manual with a checklist.
- Fix the page count in `DESIGN.md` (21 versus 27).
- Keep `sitemap.xml`, `llms.txt`, and `llms-full.txt` in step with the pages.

## 4. Order of work

- **Phase 0, decisions and baseline.** Confirm scope and depth (see section 5). Run the slop checker, a contrast pass, a link check, and a schema validation, and record the baseline.
- **Phase 1, copy pass.** Tighten all 27 pages. Deliverable: the edited HTML and `.md`, plus a short list of what changed.
- **Phase 2, content.** Write the Tier 1 pages (and Tier 2 if approved), each with its twin and its sources.
- **Phase 3, SEO.** Schema, breadcrumbs, internal links, images, fonts, 404, feed.
- **Phase 4, GEO.** Source blocks, summaries, review dates, regenerated `llms` files.
- **Phase 5, QA and ship.** Accessibility and theme checks, the delivery gate, commit.

Each phase ends with the same acceptance test: every claim sourced or labelled, no em dashes, both themes and all breakpoints hold, keyboard works, and the slop checker is clean.

## 5. Phase log

**Phase 1, copy pass. Done 25 November 2026.**

- Baseline: slop checker across all 29 markdown files. Real tells found: 5 negative-parallelism hits (`after-mbbs` x2, `faq`, `without-neet` x2), 1 kill-list word (`journey`, `dmsf.md`), 2 filler words (`quietly`, `fees-and-cost.md` and `jmc.md`), and two over-long sentences on the FAQ page.
- Fixed each in the HTML and mirrored the change into the `.md` twin, so the pair stays in step. 12 files, 20 lines.
- Left on purpose: repeated domain terms and URLs, the rule-of-three lists on comparison pages, and the verbatim NMC quotes in `mci-rules.md`. The checker flags these as repeats, long, and habit, all of which are deliberate here.
- After: zero negative parallelism, zero kill-list words, zero filler. No em dashes in any site copy. The only em dash left is in `colleges/Fee_Structure_..._2026.md`, a source document, not a page.

**Phase 3, SEO and GEO. Done 25 November 2026.**

- One Organization entity now exists across the site: `@id` set to `https://drdreams.in/#organization`, with a real 512x512 logo made from the existing brand mark (`assets/logo.png`), a founder, and a description. It is on all 27 pages.
- `WebSite` with `@id` on the homepage, the six college pages, and the two legal pages. `WebPage` with `dateModified` on the six college pages and the legal pages.
- `Article` publisher now carries `@id` and `logo`, which Google requires for Article rich results.
- `Course` schema on the six college pages: real provider name, url, and address, `timeRequired` P5Y6M, credential Doctor of Medicine.
- `speakable` on all 15 `FAQPage` blocks.
- `lang="en-IN"` on all 27 pages.
- Gallery images added to the image sitemap (home, about, student-life).
- `404.html` created, noindex, with real links and the site header and footer.
- `feed.xml` created with 27 items and linked from the homepage head.
- `llms-full.txt` updated to match the Phase 1 copy edits, so the corpus and the pages agree.
- Verified: 97 JSON-LD blocks all parse, 0 broken internal links, sitemap and feed cover all 27 pages, zero duplicate titles, descriptions, or canonicals.

Still open, and why:

- **Font self-hosting.** No network in this environment, so the two font files cannot be fetched. The Google Fonts URL already carries `display=swap`; self-hosting stays on the list for a machine with network.
- **WebP images.** `cwebp` exists, but serving WebP needs `<picture>` markup around 10 images and a small `display: contents` CSS rule. Deferred as a performance task, not an SEO gap.
- **Related-pages module.** Contextual links already run through every page. A dedicated module is a nice-to-have.
- **A real publisher logo.** `assets/logo.png` is a raster of the existing favicon mark, not a designed logo. If a proper logo exists, swap the file and the schema picks it up.

**Phase E, craft and accessibility. Done 25 November 2026.**

- Contrast checked with the antislop-human checker on both themes and every token pair in use. All pass AA: body text 16.19:1 light, 15.84:1 dark; the tightest pair, ochre on paper in light mode, is 4.55:1, just over the 4.5 line. The dark buttons look like white-on-light-teal at first glance, but dark mode correctly flips the label to `#07110f`, which measures 9.66:1.
- Keyboard and focus already in the system and confirmed by code inspection: `cursor: pointer` on every interactive element, `cursor: not-allowed` on disabled, `:focus-visible` renders a 2px ochre outline, no `outline: none` without a replacement, native `<details>`/`<summary>` accordions, Escape handlers on the menu and lightbox, and a skip link.
- Enquiry form: added a busy state. On submit the button is disabled with `aria-busy` and the status line reads "Opening WhatsApp", then returns to the success message. The empty, error, and success states were already there.
- Not run in a browser: this environment has no browser, so the above is code inspection, not a recorded click-through (R-35).
- Left open on purpose: the inline `style=` attributes. There are 41 distinct patterns across 194 pattern-file pairs, and they all duplicate declarations that belong in `site.css`. The change is mechanical and carries no user or SEO effect, so it is queued as its own pass rather than folded in here.

## 6. Phase 7, Embassy of India Manila update (drafted 25 November 2026)

New sources arrived. Two are official, one is the owner's own paperwork.

**Sources**

1. Advisory on Medical Education in the Philippines, Embassy of India, Manila, dated 17 June 2026. `https://www.eoimanila.gov.in/advisory-on-medical-education-in-the-philippines`
2. Education in the Philippines (Advisories for Indian Medical Students), Embassy of India, Manila. `https://www.eoimanila.gov.in/edphilli`
3. A 12-item visa document checklist the owner gathered from the visa office in Chennai. It is the working 9(F) student visa list, not an EOI publication. Attribute it to the visa office, and tell the reader to confirm it with the college or consulate.
4. News reports of mid-November 2026 (Times of India, PTI, Medical Dialogues) on the Philippine Professional Regulation Commission opening the PLE to Indian graduates.

**What is new, and not yet on the site**

From the advisory:

- CHED's letter of 8 May 2025 states that the MD from CHED-recognised institutions complies with the FMGL Regulations: a 54-month programme excluding the pre-medical BS, the mandatory subjects in Schedule-I of the NMC notification of 18 November 2021, English as the medium of instruction, a 12-month internship in the same institution or its attached hospital, and a Certificate of Registrability to practise in the Philippines.
- House of Representatives Resolution No. 73, adopted 11 March 2026, endorses that position.
- The Physician Licensure Examination (PLE) is required for a Philippine licence, and the reciprocity rule that used to block Indian graduates has been cleared. In mid-November 2026 the Philippine Professional Regulation Commission told the Indian Embassy that Indian graduates of recognised Philippine medical schools can sit the PLE and obtain registration to practise in the Philippines. Announced by Ambassador Harsh Kumar Jain. The sequence: CHED's letter of 8 May 2025, House Resolution No. 73 of 11 March 2026, the Embassy advisory of 17 June 2026, the Embassy's letter to the Philippine Department of Foreign Affairs of 8 October 2026, then the PRC decision in November.
- The PLE does not replace FMGE or NExT. To practise in India, an Indian graduate still sits the Indian exam and does the Indian internship. The news reports say this plainly, and the site must not blur it.
- CHED's position is that graduates heading to the USA, UK, Canada, Australia or Switzerland do not need the PLE.
- Students returning to India must satisfy themselves that every NMC condition is met.

From edphilli:

- MD admission needs a bachelor's degree and the NMAT. A 10+2 Indian student must first complete a bachelor's degree, and any pre-medical BS or BA must itself be CHED-accredited and match the MD eligibility and duration.
- Fees go directly to the college, against an official receipt.
- Degree documents are apostilled by the Philippine Department of Foreign Affairs.

From the Chennai visa checklist: PCC only through the Passport Seva Portal, a 6-month bank statement with a Rs 3,00,000 closing balance signed and sealed by the branch manager, the notarised financial affidavit rules, NABH-accredited hospitals only for the medical test, the three photograph types, and a 20 to 25 day processing window after submission.

**Claims already on the site that must change**

This is the important part. Two pages currently say the Philippine route is closed, and the November decision contradicts them:

- `faq.md` question 13, "Can I work in the Philippines after graduating?", answers "Rarely... India does not, in practice, so the route is closed for most Indian graduates." That is now wrong. It sits in the visible page and in the FAQPage JSON-LD in `faq.html`, so both change.
- `after-mbbs-in-philippines.md`, the answer to "Can I practise in the Philippines instead?", says only to check with the PRC. It should carry the new position.

**Page by page**

- `documents-required.html` (and `.md`). Replace the generic embassy table with the 12-item list as a ledger, labelled as the visa office checklist, with the 20 to 25 day window and the accuracy warning. Keep the two-list framing (college file, visa file).
- `faq.html` and `faq.md`. Rewrite question 13 to the new position, in both the visible answer and the JSON-LD. Add "What documents does the visa file need?" linking to the checklist page.
- `after-mbbs-in-philippines.html` and `.md`. Rewrite the "practise in the Philippines" answer.
- `is-mbbs-in-philippines-valid-in-india.html` and `.md`. Add the PLE development, and hold the line that FMGE or NExT is still required for India.
- `mci-rules.html` and `.md`. Add the CHED letter, House Resolution No. 73, and the PLE timeline as the newest layer above the March 2026 notice.
- `admission-process.html` and `.md`. Fold the 20 to 25 day window into the timeline. Add the bachelor's degree plus NMAT rule.
- `without-neet.html` and `.md`. Add the CHED rule that the pre-medical degree must itself be accredited.
- `index.html`. One line pointing at the embassy and visa update, since it is current.

**Copy rules for this update**

- Attribute every embassy claim to the Embassy of India, Manila, with the link and the date. Nothing else gets stated as fact.
- House style holds: no em dashes, full stops and commas, plain words, first person only for what the author lived.
- The numbers stay theirs: Rs 3,00,000, 6 months, 54 months, 20 to 25 days. Do not round or dramatise.
- The visa list is a ledger, and the page already has the ledger component. Use it.

**SEO and GEO**

- These two `.gov.in` sources are the strongest citations the site will carry. Add a visible "Sources" line on each changed page and add `citation` to the Article schema.
- Update `dateModified` and the front-matter `updated` date on changed pages to the real edit date.
- Update `llms.txt` descriptions and regenerate `llms-full.txt`.
- Update `sitemap.xml` `lastmod` for the changed pages.
- The FAQPage additions carry the new questions into the structured data.

**Decisions, settled 25 November 2026**

1. Cite the original authorities: the Embassy of India, Manila, and the Philippine Professional Regulation Commission. The news reports are the record, not the citation.
2. Fix the existing pages, and add one dedicated PLE page.
3. Start with the wrong answers on the FAQ and after-MBBS pages.
4. Bump `updated` and `dateModified` to 25 November 2026 on every page we touch.

**Progress, 25 November 2026**

- Fixed the two wrong answers. `faq` question 13 and the after-MBBS answer now say Indian graduates can sit the PLE and register to practise in the Philippines, attribute it to the Embassy of India, Manila and the Philippine PRC, and keep the FMGE boundary. Updated in the HTML, the `.md` twin, the FAQPage JSON-LD, and `llms-full.txt`.
- Added `ple-philippines.html` and `ple-philippines.md`: the November change, the timeline from CHED's letter to the PRC decision, what the PLE does not do, what to check yourself, two questions, and the sources. Article, BreadcrumbList and FAQPage schema, with speakable.
- Wired the new page into `sitemap.xml`, `llms.txt` and `llms-full.txt`, and linked it from the FAQ and after-MBBS answers.
- Verified: 100 JSON-LD blocks valid, 0 broken links, no em dashes, slop checker clean on the new page.
- `documents-required`: the generic embassy table is gone. The 12-item visa office checklist is now a numbered ledger (passport copies, PCC tracker and PCC via Passport Seva Portal only, NEET scorecard and admit card, six month signed bank statement with Rs 3,00,000 closing balance, notarised affidavit on Rs 100 bond paper, three photograph sets, NABH-only medical tests, Aadhaar, class 10 and 12 marksheets, CoWIN certificate), with the 20 to 25 day window and the accuracy warning. A bank balance question joined the FAQ and its JSON-LD.
- `admission-process`: the 20 to 25 day window is in the timeline and step four, and a note says the MD needs a bachelor's degree and NMAT, with a CHED-accredited pre-medical degree for class 12 entrants.
- `mci-rules`: the timeline now runs to CHED's letter of 8 May 2025, House Resolution No. 73 of 11 March 2026, the Embassy advisory of 17 June 2026 and the PRC decision of November 2026.
- `is-mbbs-in-philippines-valid-in-india`: new section on the Philippine licence, with the FMGE boundary intact.
- `without-neet`: a callout on the CHED accreditation of the pre-medical degree.
- `index.html` and `index.md`: one callout on the November change, linking the PLE page.
- `llms-full.txt` regenerated (28 pages), `llms.txt` description for the PLE page, `sitemap.xml` lastmod bumped on every touched page.
- Verified again after the edits: 100 JSON-LD blocks valid, 0 broken internal links across 29 HTML files, no em dashes on touched pages, slop scores at or below 11 with the remainder deliberate proper noun repeats.
