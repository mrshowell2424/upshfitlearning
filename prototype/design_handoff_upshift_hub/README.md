# Handoff: Upshift Learning Hub

## Overview

A teacher resource hub. Teachers arrive with a standard they have to teach ("RL.2.1", or just "text evidence with 2nd graders") and leave with a lesson they can run tomorrow: a pedagogically-structured lesson blueprint, a set of matching resources from a 2,688-item library, and AI-generated student-facing materials in the Upshift brand.

Nine views, one signed-in teacher, freemium paywall.

## About the design files

**`design/Upshift Resource Hub.dc.html` is a design reference, not production code.**

It is a single-file HTML prototype built on a bespoke streaming-template runtime (`support.js`). Do **not** port that runtime, do not try to reuse `<sc-for>` / `<sc-if>` / `{{ hole }}` syntax, and do not copy the inline-style-only convention — those are artifacts of the prototyping environment.

Your job: **rebuild these screens in a real stack.** Read the prototype to extract exact layout, spacing, color, copy, and behavior, then implement it properly with components, a real router, a real database, and real auth.

Open the prototype in a browser to click through it before you write anything.

## Fidelity

**High-fidelity.** Colors, type, spacing, copy, and interaction states are final and intentional. Match them. Every hex value in this document is literal and appears in the prototype.

Two areas are explicitly unfinished and called out in "Known gaps" at the bottom.

---

## Recommended stack

No codebase exists yet, so choose for them. Recommended:

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS v4** with the tokens below mapped into `@theme`
- **Postgres** via **Supabase** (auth, row-level security, storage) or Neon + Auth.js
- **Drizzle** or **Prisma** for the schema
- **Anthropic SDK** (`@anthropic-ai/sdk`) server-side only, called from a Route Handler
- **Stripe** for subscriptions
- **Google Slides API + Drive API** for real material export

Do not put the Anthropic key in the client. Do not call Anthropic from a client component.

---

## Design tokens

### Color

| Token | Hex | Use |
|---|---|---|
| `coral` | `#FF6A5B` | Primary action, active nav bar, hero CTA |
| `coral-press` | `#E24F41` | Coral hover/active |
| `pink` | `#FF7DAE` | Accent, free-tier dot, "Retrieve" stage |
| `lavender` | `#B87DFF` | Accent, avatar, "Reflect" stage |
| `teal` | `#00B4A6` | Success, checkmarks, progress fill, pro-tier dot |
| `charcoal` | `#111111` | Body text, dark cards, primary buttons |
| `navy` | `#16213E` | Blueprint header, title slides |
| `amber` | `#FFB13F` | "Learn" stage |
| `blue` | `#4C9AFF` | "Apply" stage |
| `link-blue` | `#2F6FD0` | Prior-knowledge / technology labels |
| `gray-050` | `#FAFAFA` | Section fills |
| `gray-100` | `#F2F2F2` | Surfaces, inactive buttons |
| `border` | `#E9E9E9` | Card borders |
| `border-strong` | `#E4E4E4` | Inputs, chips |
| `hairline` | `#ECECEC` | Dividers, grid gaps |
| `text-body` | `#333333` | Body copy in cards |
| `text-muted` | `#6A6A6A` | Secondary text |
| `text-faint` | `#8A8A8A` | Uppercase micro-labels |

Tinted chip pairs (background / foreground):

| Purpose | BG | FG |
|---|---|---|
| Grade band | `#F4E9FF` | `#6B2FB5` |
| Skill | `#E6F8F6` | `#00756C` |
| Fit strength | `#FFF0EC` | `#C0432F` |
| EF supports | `#F0FBF4` | `#1F6B45` (border `#CDEBDA`) |
| Misconception "you'll see" | `#FFF5F9` | `#B3336E` |
| Misconception "try this" | `#F2FCFA` | `#00756C` |
| Prior standard | `#EAF2FF` | `#2F6FD0` |

Card thumbnail tints, cycled by index: `#FFE3DD`, `#FFE7F1`, `#F1E5FF`, `#DDF5F2`, `#F3F3F3`, `#FFEFE4`.

### Type

**Poppins** only, weights 300–800, via Google Fonts. Nothing else.

| Role | Size | Weight | Tracking | Line height |
|---|---|---|---|---|
| Page H1 | 34px | 700 | -.03em | 1.08 |
| Hero H1 | 54px | 700 | -.03em | 1.04 |
| Section H2 | 26px | 700 | -.02em | — |
| Card title | 15.5px | 600 | -.015em | 1.28 |
| Body | 14–15px | 400 | — | 1.5–1.65 |
| Micro-label (uppercase) | 10.5–11px | 700 | .1–.16em | — |
| Chip | 10.5–12.5px | 600 | — | — |
| Nav item | 11.5px | 600 | .1em | uppercase |

`text-wrap: pretty` on every paragraph and multi-line label.

### Spacing / shape

- Page gutter: `32px`. Content max width: `1400px` (library, home, videos, planner, lounge), `1200px` (detail), `1180px` (pricing), `1120px` (match).
- Section rhythm: `54px` between home sections, `40px 32px 90px` on inner pages.
- Grid gaps: `20px` (cards), `14–18px` (blueprint panels), `1px` on `#ECECEC` for hairline-divided grids.
- Radii: `20px` hero/plan cards, `16–18px` panels, `14px` resource cards, `10–12px` buttons and inputs, `999px` pills, `5px` chips.
- Card hover: `border-color: #111111`. No shadow shift, no scale.
- Shadows are rare: `0 12px 34px rgba(17,17,17,.09)` on the hero search, `0 10px 30px rgba(17,17,17,.07)` on the matcher search.
- Sticky header height `72px`, `rgba(255,255,255,.95)` + `backdrop-filter: blur(10px)`, bottom border `#ECECEC`. Sticky sidebars/asides use `top: 96px`.

### Animation

Only two keyframes exist. Keep it that way.

```css
@keyframes upRise  { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:none } }
@keyframes upPulse { 0%,100% { opacity:.3 } 50% { opacity:1 } }
```

`upRise .35s ease both` on match results appearing. `upPulse 1.1s infinite` on four staggered loading dots (`0s / .15s / .3s / .45s`, colors coral → pink → lavender → teal).

---

## Data model

### `resources` — 2,688 rows, seeded from `data/Howell Resources - Resources.csv`

The CSV is the source of truth. `design/resources.js` is the already-parsed output — read the parse rules there, then reimplement them as a real seed script.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `title` | text | CSV col 3 |
| `purpose` | text | CSV col 4 — 37 distinct values, e.g. "Classroom Management", "EduProtocols" |
| `youtube_id` | text | 11 chars, extracted from CSV col 6 URL |
| `link_url` | text | Google Slides/Doc/Sheet URL, CSV col 6 |
| `summary` | text | CSV col 7, cleaned: strip URLs, hashtags, emoji; truncate at first sentence boundary between 30–150 chars |
| `skill` | text | **Inferred** — see below |
| `grade_band` | text | **Inferred** — `K-5`, `K-8`, `2-6`, `3-8`, `5-8` |
| `format` | text | Derived from `link_url`: `Slides` / `Doc` / `Sheet` / `Guide` / `Link` / `Video` |
| `published_at` | date | CSV col 2, `M/D/YY` |
| `is_free` | bool | Prototype uses `index % 5 === 0`. **Replace with a real editorial flag.** |

Parse rules to carry over verbatim (they are in `resources.js` and in the prototype's seed script):
- Skip rows with no title or no extractable YouTube ID. Dedupe on `lower(title) + youtube_id`. 2,760 titled rows → 2,688 kept.
- `skill` is inferred by an ordered regex list against `title + summary`, falling back to a purpose→skill map. 38 distinct skills result. **Flag these as inferred in the admin UI so Stephanie can correct them** — they were guessed, not authored.
- `grade_band` likewise inferred from grade words in title/purpose/summary, default `3-8`.
- Thumbnails come free: `https://i.ytimg.com/vi/{youtube_id}/mqdefault.jpg` (cards) and `/maxresdefault.jpg` (detail hero). No image hosting needed for resources.

### `standards`

| Column | Notes |
|---|---|
| `code` | `RL.2.1` |
| `name` | Full standard text |
| `plain_reading` | 2–3 sentence teacher-facing explanation of what the standard actually demands |
| `learning_target` | "I can…" statement |
| `science_tags` | text[] — e.g. `{Retrieval Practice, Dual Coding, Elaboration, Immediate Feedback}` |
| `skills` | text[] — used to select matching resources |
| `match_keys` | text[] — alias strings for fuzzy matching ("text evidence", "asking and answering") |

### `standard_unpacks` — one per standard

`verbs` (word + gloss pairs), `concepts` text[], `vocabulary` (student-facing words needed for mastery), `prior_skills` text[], `prior_standards` (code + text), `future_standards` (code + text), `challenges` (problem + fix pairs), `mastery_statement`, `ladder` (4 rungs: name + descriptor).

### `lesson_blueprints` — one per standard

`title`, `badge`, `route_name`, `route_line`, `success_criteria` text[], `steps` (name, minutes, body, science_tag — 8 steps), `ef_supports` text[], `tech`, `tech_purpose`, `ai_prompts` text[], `assessment` text[], `why_it_works` text[].

Four are authored in the prototype: **RL.2.1, RI.4.2, L.5.4, RL.6.3**. Everything else falls back to a skill-language match with no blueprint. Build an authoring UI for these — they are hand-written pedagogy, not generated.

### `courses`, `articles`, `saved_resources`, `generated_materials`, `subscriptions`

- `courses`: title, track, lesson_count, duration, blurb, cover_image, is_free. 6 seeded, 93 claimed in copy.
- `articles`: 53 Substack posts (`data/Howell Resources - Substack.csv`) — title, slug, category, date, is_featured, cover_image. Categories: `Classroom moves` (`#C0432F`/`#FFF0EC`), `Teacher brain` (`#6B2FB5`/`#F4E9FF`), plus AI and coaching. Links out to `https://mrshowell24.substack.com/p/{slug}`.
- `saved_resources`: user_id + resource_id + saved_at. This is the planner.
- `generated_materials`: user_id, standard_code, format_key, title, items jsonb, created_at. Persist every generation.

---

## Screens

### 1. Header (all views)

Sticky, 72px, three zones in a flex row with `gap: 36px`:

1. **Logo** — `assets/chevron-coral-512.png` at 30×30, then a stacked lockup: "UPSHIFT" (15px/800/.14em) over "LEARNING HUB" (8.5px/500/.28em, `#8A8A8A`, `margin-top: 3px`). Clicking goes home.
2. **Nav** — 7 items, `flex: 1`, each a 72px-tall button with `padding: 0 15px`, hover `#FAFAFA`, and a 3px `#FF6A5B` bar pinned to the bottom (`left/right: 11px`, `border-radius: 3px 3px 0 0`) when active. Active label `#111111`, inactive `#6A6A6A`. Order: Home, Resources, Standard match, My planner, Videos, Teacher's Lounge, Plans.
3. **Right** — a tier pill (1px `#E4E4E4` border, 999px, 7px dot: `#FF7DAE` free / `#00B4A6` pro, label "FREE PLAN"/"ALL-ACCESS") and a 36px lavender avatar circle with initials.

The tier pill is a **prototype-only demo toggle**. In production it reflects real subscription state and is not clickable — link it to billing instead.

### 2. Home

- **Hero** — `assets/Background.png` cover, overlaid `rgba(255,255,255,.45)`, `74px 32px 66px`. Max-width 800px column: charcoal eyebrow pill "SCIENCE OF LEARNING FIRST", 54px H1 ("Tell us what you're teaching. / We'll hand you the lesson."), 18px sub, then the search bar.
- **Search bar** — white, 1px `#E4E4E4`, 14px radius, `padding: 10px 10px 10px 18px`, flex row: coral `✳` glyph, borderless 16px input, coral "Match my standard" button (`14px 24px`, 10px radius). Enter submits. Placeholder: `RL.2.1 — or "text evidence with 2nd graders"`.
- **Example chips** — "Try:" then 4 pills that fill the input and immediately submit.
- **Stat strip** — 4 cells in a `1px`-gap grid on `#ECECEC`, 14px radius. 30px/700 numbers in coral, lavender, teal, pink. Real values: `2,688` resources, `93` video courses, `K–8`, `12` learning-science principles.
- **"Start here"** — 3 cards, each with an 8px color cap (coral / lavender / teal), uppercase kicker, 21px title, body, "→" CTA. Routes to matcher, library, courses.
- **"Fresh this week"** — 4 resource cards (newest by date).
- **Upgrade band** — 20px-radius split card. Left `#111111`: pink eyebrow, 31px headline with live free-quota count, body, coral CTA, "From $10/month". Right `#FAFAFA`: 4 teal-check perks. Copy swaps entirely when the user is on All-Access.

### 3. Resources (library)

- H1 "Resource library" + sub.
- Search row: full-width input (`⌕` glyph, 15px, 11px radius) + "Clear filters" button.
- **272px sticky sidebar** at `top: 96px`, sections divided by `1px #F2F2F2`: Access (Free / All-Access), Grade levels, Purpose (all 37, count-ordered), Skill (all 38). Each option is a row: 17px checkbox (5px radius, `#FF6A5B` filled with white `✓` when on, else white with `#D8D8D8` border), 13.5px label, right-aligned count in `#9A9A9A`. All filter lists and counts are generated from the data — do not hardcode.
- **Results** — count line ("30 of 2,688 matching · 2,688 in the library"), sort pills (Newest / Oldest first / A–Z — active pill charcoal fill), then a 3-column grid, 20px gap.
- **Resource card** — 16/9 YouTube thumbnail; format badge top-left (`rgba(255,255,255,.94)`, 9px/700/.1em uppercase); date badge top-right (`rgba(17,17,17,.78)`, white, 9.5px); body `15px 16px 17px` with 15.5px/600 title, uppercase purpose micro-label, and grade + skill chips pushed to the bottom with `margin-top: auto`.
- **Locked card** — full-cover `rgba(255,255,255,.55)` + `backdrop-filter: blur(6px)` with a charcoal 999px "ALL-ACCESS" pill centered.
- **Pagination** — 30 at a time, centered "Show 30 more" outline button. Reset to 30 whenever a filter or query changes. In production use cursor pagination or infinite scroll; do not ship 2,688 rows to the client.
- **Empty state** — dashed `#DDDDDD` box, 16px radius, 60px padding, headline + sub + coral "Try standard matching" button.

### 4. Standard match — the core screen

Centered 1120px column. Teal eyebrow "STANDARD MATCHER", 38px H1 "What are you teaching?", sub, an 820px search bar, example chips.

On submit: show the four pulsing dots + "Reading the standard, then searching 2,688 resources…" for ~900ms, then reveal results with `upRise`.

**Standard header panel** — 18px-radius card. Top band `#FAFAFA`: charcoal code chip + 15px standard name, then the plain-language reading. Below, two hairline-divided cells: "LEARNING TARGET" (lavender label) and "LEARNING SCIENCE AT WORK" (teal label, teal pill tags).

Then four tab pills: **Lesson blueprint · Unpack the standard · Resources to remix · Make it for my learners.**

#### 4a. Lesson blueprint

Recreates Stephanie's existing one-pager exactly.

- **Header** `#16213E`, white: 24px uppercase lesson title over "Science of Learning First" in `#7FE3DA`; right side a teal badge with the lesson's rallying line ("Good readers find evidence!").
- **Four-up context row**: Standard (`#6B2FB5` label), Learning target (`#C0432F`), Success criteria (`#00756C`, teal `☑` rows), Learning science (`#2F6FD0`, `·` list).
- **Instructional route** — 220px label column ("Inquiry + Discussion Route" + one-line rationale) beside 5 evenly-spaced stages, each a 42px circle + name + descriptor: RETRIEVE `#FF7DAE`, LEARN `#FFB13F`, PRACTICE `#00B4A6`, APPLY `#4C9AFF`, REFLECT `#B87DFF`.
- **8 step cards** in a 4-column grid: numbered lavender circle, uppercase step name, minutes in `#8A8A8A`, body, and a parenthetical science tag in `#6B2FB5` pinned to the bottom.
- **Four-up support row**: Technology (`#2F6FD0`), AI extension (`#00756C`, closing with "AI = thinking partner, not an answer machine." in `#C0432F`), Assessment (`#C0432F`, coral `☑`), Why this lesson works (`#B3336E`).
- **Executive function supports** — full-width panel of pale-green `☑` chips.
- **Footer** — `#FAFAFA` band: "**The big idea:** we don't just teach the standard. We design the learning so students can actually learn." beside a three-step chain: navy "STANDARD" → teal "LEARNING SCIENCE" → purple "MEANINGFUL LEARNING".
- Below the card: "Pull resources to remix" (charcoal) and "Make a student version with AI" (outline).
- **No blueprint yet** → dashed empty state naming the four that exist, with a button to the resources tab.

#### 4b. Unpack the standard

- Verbs the standard demands (word + what it actually means).
- Concepts, and **vocabulary students need to master it** (added at Stephanie's request — student-facing words, not teacher jargon).
- **Common misconceptions & challenges** — the signature block. Each row is a 2-column hairline grid: left `#FFF5F9` "YOU'LL SEE" with a pink `✕`, right `#F2FCFA` "TRY THIS" with a teal `✓`. 4 rows per standard.
- **Prior knowledge** (`#2F6FD0`) — 2 prior standards as code chips + text, then a "They also need to be able to" list. **Future learning** (`#6B2FB5`) — 2 forward standards, closing with "If students leave this year shaky here, that's what shows up two grades later."
- **Mastery statement** and a **4-rung skill ladder** with percentage fills.

Modeled on the Groveport Madison unpacked-standards format in `uploads/6th MATH4.pdf` (Stephanie's reference).

#### 4c. Resources to remix

Vertical list of wide rows, `210px` thumbnail column + content. Each row: 19px title, uppercase purpose, grade chip, coral "STRONG/GOOD FIT" chip, then "**Use it for RL.2.1 like this**" over 3 numbered charcoal-square teaching moves, then "Open resource" (charcoal) + "Save to planner" (outline, toggles to "Saved ✓").

#### 4d. Make it for my learners

340px control panel + output pane.

Control panel: "What should it make?" over **4 stacked format cards**, each a 12px-radius button with a 5px accent bar, 13.5px label, 12px description. Selected = charcoal fill, white label, accent bar lit.

| Format | Accent | Output layout | Count |
|---|---|---|---|
| Slides for the board | `#FF6A5B` | 2-col 16/9 slide previews; first slide navy | 4–6 |
| Anchor chart | `#00B4A6` | single poster block | 4 sections |
| Cut-apart task cards | `#B87DFF` | 3-col dashed-border cards with checkbox lines | 6 |
| Student notebook page | `#FF7DAE` | single 660px sheet, accent-underlined sections | 4 |

Grade and class-needs inputs were removed — infer from the standard. A free-text note field stays.

Then a coral "Make my {unit}s" button.

Output pane (min-height 420px): loading dots → rendered material. Header row shows the title, "{n} slides · your brand, ready to copy into Slides", "Try again" (outline) and "Send to Google Slides" (charcoal). The prototype's Send button copies structured text to the clipboard and opens `slides.new`. **In production, use the Google Slides API to create a real deck in the teacher's Drive from a branded template.**

**AI contract.** The prototype calls a completion helper with a prompt that pins: standard code + name, learning target, grade, lesson frame, resource being remixed, class needs, the chosen format's shape description, and a JSON-only response schema:

```json
{ "title": "short title", "items": [ { "label": "short label", "lines": ["short line", "short line"] } ] }
```

Rules given to the model: exact item count per format, max 14 words per line, grade-appropriate vocabulary, no emoji, no markdown, write to the student (except the family note, which addresses caregivers). Parsing strips code fences and slices between the first `{` and last `}`; unparseable output falls back to a styled "Draft" panel with a "Rebuild as slides" button. **Keep that fallback** — the model does occasionally return prose.

Move this server-side: `POST /api/generate` → validate the shape with Zod → persist to `generated_materials` → return. Stream if you can. Rate-limit by tier.

### 5. Resource detail

Two columns, `1.5fr / 1fr`, 40px gap.

Left: back link, meta chip row, 40px/700 title (`-.035em`), 17px summary, then a **16/9 inline YouTube player** — thumbnail with a 66px coral play button and a bottom gradient caption; clicking swaps in a `youtube-nocookie.com/embed?autoplay=1` iframe in place. Then "Teaching moves" (numbered `#F2F2F2` squares) and "Why this works" (prose + teal science pills).

Right (sticky, `top: 96px`): thumbnail card with either coral "Open Google Slides" / outline "Watch on YouTube" links, or — when locked — a charcoal upgrade block; then "Save to planner". Below: "At a glance" key/value rows (Purpose, Grades, Skill, Format, Added, Prep time, Access) and "Pairs well with" — 3 same-skill resources as 62×40 thumbnail rows.

### 6. My planner

Everything the teacher saved. Header with a live count, grid of saved resource cards, per-card remove, and an empty state pointing at the library. This is the payoff for every "Save to planner" button in the app — persist to `saved_resources`, not local state.

### 7. Videos

H1 + sub, underline tab row (Teacher courses / Student videos / Saved — 2.5px coral bar on active), then a 3-column grid of course cards: 16/9 cover (drop-in image slot in the prototype — replace with a real upload field), duration badge bottom-right, 17px title, "{n} lessons · {track}" micro-label, blurb, and a 5px `#F2F2F2` progress track with a teal fill plus "{x} of {n} lessons done".

### 8. Teacher's Lounge

53 Substack posts. Featured hero card up top, then category-filtered cards using the real post images in `covers/sub/`. Each card: cover image, category dot + label in that category's color pair, title, date. Links out to Substack in a new tab.

**Note:** the cover images are named by Substack UUID with no slug, so post↔image pairing was assigned in order and is approximate. In production, store `cover_image_url` per article and let Stephanie set it.

### 9. Plans

Centered 640px intro (40px H1 "Pick the plan that fits your year"), then 3 plan cards, 22px gap, `align-items: start`.

| Plan | Price | Card | Button |
|---|---|---|---|
| Free | **$0** forever | white, `#E9E9E9` border | `#F2F2F2` / charcoal |
| All-Access | **$10** / month | `#111111` fill, white text, "MOST PICKED" coral pill | coral |
| School | **$7** / teacher / mo | white | charcoal / white |

Each: 11.5px uppercase name, 46px/700 price (`-.04em`) + per-unit, 14px "who it's for" line (`min-height: 44px`), full-width CTA, hairline divider, teal-check feature list. Below, a 2-column FAQ grid (4 items) in an 18px-radius panel.

Free tier limits stated in copy: 550 free resources, 5 resource opens/month, 3 standard matches/month, 2 sample courses. **Enforce these server-side.**

---

## Interactions & behavior

- **Routing** — the prototype is a single `view` string. Use real routes: `/`, `/resources`, `/resources/[id]`, `/match`, `/match/[code]`, `/planner`, `/videos`, `/lounge`, `/plans`. Filters and sort belong in the query string so a filtered library is linkable.
- **Match submit** — Enter in the input or the button. Resolve the query against `standards.match_keys` first, then fall back to skill-language matching against resource titles/skills, in which case the header shows "Best guess" with a nudge to add a standard code.
- **Paywall** — every locked thumbnail gets the blur + pill treatment; the detail page swaps its action block for the upgrade card. Gate on the server; never rely on a client flag.
- **Save toggles** optimistically, persists immediately.
- **Video** plays inline; never navigate the teacher off to YouTube.
- **Loading** is always the four-dot pulse, never a spinner.
- **Responsive** — the prototype is desktop-only (fixed multi-column grids). Teachers plan on laptops, but you must at least collapse the library sidebar into a filter sheet, drop grids to 1–2 columns, and stack the detail and match layouts below ~1024px.

---

## Accessibility (not handled in the prototype — do it properly)

- Many interactive cards are `<div onClick>`. Make them real `<button>`/`<a>` elements with focus rings.
- Add visible `:focus-visible` styles — the prototype only styles hover.
- Checkbox filter rows need real `<input type="checkbox">` semantics and labels.
- The tab pills need `role="tablist"` / `aria-selected`.
- Verify contrast on `#8A8A8A` micro-labels at 10.5px; darken to `#6A6A6A` if it fails.
- Icon-only buttons (play, remove) need accessible names.

---

## Known gaps to resolve with Stephanie

1. **`skill` and `grade_band` on all 2,688 resources are inferred by regex, not authored.** Build an admin edit UI and treat them as drafts.
2. **`is_free` is `index % 5`.** She needs to choose the real free set (copy claims 550).
3. **Only 4 standards have blueprints and unpacks.** These are hand-authored pedagogy — build the authoring tool, don't generate them.
4. **"Send to Google Slides" is a clipboard copy.** Real Slides API export is the single highest-value thing to build next.
5. **Course covers are drop-in placeholders**, and 3 of 53 Lounge posts fall back to a branded cover.
6. Video durations, course progress, and the "3 of 5 free opens" counter are display-only in the prototype.

## Files in this bundle

```
design/
  Upshift Resource Hub.dc.html   the prototype (open in a browser)
  resources.js                   2,688 parsed resources — seed data
  support.js, image-slot.js      prototype runtime — do NOT port
data/
  Howell Resources - Resources.csv   source of truth, 2,760 rows
  Howell Resources - Substack.csv    53 posts
assets/
  chevron-{coral,charcoal}-{512,1024}.png   logo mark
  Background.png                            hero gradient
  palette_strip.png                         brand palette reference
CLAUDE_CODE_PROMPT.md            paste-ready build instructions
```
