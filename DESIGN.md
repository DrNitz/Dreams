# DrDreams: design direction

Reading this as: a reference site for Indian students and their parents about studying medicine in the Philippines, in an editorial-clinical visual language, dial ENERGY 2 / RHYTHM 2 / MOTION 1. The pages are written by one named graduate, Dr. Nitz, and the visual language has to carry the authority his name alone cannot.

## Who reads this site

Two people, often on the same phone. A 17 or 18 year old who did not get the seat they wanted, and a parent who is about to move a large amount of money. The student wants the truth about the degree. The parent wants to know who is behind it and what it costs. Most arrivals come from a search: cost, duration, NMC rules, safety, documents. Every page has to answer the question they typed before it argues anything.

## Identity

The site reads like a well-kept set of notes from someone who has done the thing. Sober, warm, specific, first person where the experience is first hand. It should look like a reference document, not a startup and not a landing page.

One motif runs through every page: **the ledger**. Hairline-ruled fact lists, numbered steps, and a small ochre square before section labels. It echoes the checklist a family ticks through before they send a child abroad. It is repeated on purpose, and it is the one decorative element allowed.

## Dials

| Dial | Value | Why |
| --- | --- | --- |
| ENERGY | 2 | A family is making a decision worth lakhs. Calm authority reads as competence. Playful would undercut it. |
| RHYTHM | 2 | Sections change shape (asymmetric hero, ledger steps, table, dark source band) but keep one grid, because scanning matters more than surprise. |
| MOTION | 1 | Hover states and a short scroll reveal. No parallax, no floating cards. Motion on this site is a distraction from reading. |

## Colour

Three colours plus neutrals. Each one has a job.

| Token | Light | Job |
| --- | --- | --- |
| paper | `#faf7f1` | Page ground. Warm off-white because pure white with grey text is the sterile default, and this site is read for twenty minutes at a time. |
| ink | `#101d1a` | Body text and the dark band. Near-black with a green cast so it sits with the teal instead of fighting it. |
| teal | `#0c5b52` | Primary action and links. Medical, calm, and distinct from the green the old site used. |
| ochre | `#b06a24` | The single accent. Used only for the section square, focus rings, and warnings. It is the colour of a highlighter on a printed checklist, which is the motif. |

Dark mode inverts paper and ink and lightens teal for contrast. Both modes are first class. There is no gradient anywhere: a gradient here would only be decoration.

## Type

- **Newsreader** for headings. A serif with a slight editorial lean. Reason: consultancies, journals, and medical institutions read as trustworthy in serif, and it separates this site from the all-sans look of every MBBS agency site.
- **IBM Plex Sans** for body, tables, and controls. Reason: drawn for long-form interface text, holds up at 13px in dense fee tables, and reads institutional rather than fashionable.

Headings are set tight (`-0.02em`). Body is 17px/1.65 with a 68ch measure. Tables drop to 14px.

## Layout

- 1120px container, 68ch prose measure, 24px gutters, 4px baseline rhythm.
- Corners are 4px and 8px. Not pills, not 20px rounded cards. A sharp edge is a form.
- Shadows appear only on the sticky header once it is scrolled and on the mobile menu. Nothing floats that does not need to.
- The hero is asymmetric: claim on the left, a real fact panel on the right. Centred hero plus badge plus two buttons is the template this site is replacing.

## Motion

- 160ms ease on colour and border changes, 220ms on the mobile menu.
- One scroll reveal per section, 8px rise, `prefers-reduced-motion` respected.
- No entrance animation on the hero. The first thing a reader needs is the headline.

## Accessibility rules baked into the system

- Text contrast checked against the paper and surface tokens in both modes (see the report in the delivery note).
- `:focus-visible` renders a 2px ochre outline with 2px offset on every interactive element.
- All accordions are native `<details>`/`<summary>`, so keyboard and screen readers work without JavaScript.
- Tap targets are at least 44px tall on touch widths.

## What is deliberately absent

- The three.js particle background. It cost performance on mid-range Android and served nothing.
- Trust badges, student counts, and testimonials. There is no verified figure to put in them.
- An agency-style hero with a student photo and a "book free counselling" countdown.
- Em dashes. The house style uses full stops and commas.

## Markdown and AI layer

Every page has a Markdown twin at the same path (`index.md`, `colleges/dmsf.md` and so on) with YAML front matter: title, description, canonical source, updated date, author and licence (CC BY 4.0, attribution to drdreams.in). The twins are generated from the HTML `<main>` by `markdownify`, with the ledger lists turned into headings, the FAQ accordions flattened into `###` questions, navigation and forms removed, and internal links rewritten to absolute `.md` URLs.

`llms.txt` is the index answer engines read first: one line per page with the meta description, grouped into Guides, Colleges and About this site. `llms-full.txt` concatenates all twenty-one pages for bulk ingestion. The question page (`faq.html`) is the most important one for search: eighteen questions phrased the way students type them, each answered in a short paragraph first and linked to the page that goes deeper, with `FAQPage` structured data generated from the same answers. `robots.txt` allows the crawlers by name (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot and others) and points at both files.

Each HTML page carries `<link rel="alternate" type="text/markdown">` so the twin is discoverable from the canonical URL. When a page's copy changes, the HTML and the `.md` have to change together: regenerate the twin rather than editing it by hand.
