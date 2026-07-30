# Claude Code — build instructions

Paste this whole file as your first message to Claude Code, in an empty directory, with this bundle placed inside it.

---

## The task

Build **Upshift Learning Hub**, a production web app for a teacher-resource business. `README.md` in this folder is the complete design spec. `design/Upshift Resource Hub.dc.html` is a clickable HTML prototype of every screen.

**The prototype is a design reference, not code to port.** It runs on a bespoke streaming-template runtime (`support.js`) with `<sc-for>` / `<sc-if>` / `{{ }}` syntax and inline styles only. Ignore all of that. Read it for exact layout, spacing, color, copy, and behavior — then rebuild it properly.

Open the prototype in a browser and click through all nine views before writing any code.

---

## Stack

- Next.js 15, App Router, TypeScript, strict mode
- Tailwind CSS v4, tokens from `README.md` mapped into `@theme`
- Supabase: Postgres + Auth + Storage, RLS on
- Drizzle ORM, migrations checked in
- `@anthropic-ai/sdk`, server-side only
- Stripe Checkout + webhooks
- Vitest + Playwright

Do not add a UI component library. The design is specific; build the ~12 components it needs.

---

## Phases — do these in order and stop for review after each

### Phase 1 — Foundation

1. `create-next-app` with TypeScript, Tailwind v4, ESLint. App Router.
2. Map every token from `README.md` § Design tokens into `@theme` in `globals.css`. Semantic names (`--color-coral`, `--color-navy`, `--color-hairline`), not `gray-1`.
3. Poppins via `next/font/google`, weights 300–800, as the only family. Set it on `<body>`.
4. Copy `assets/` into `public/brand/`.
5. Add the two keyframes (`upRise`, `upPulse`). No other animations.
6. Build the app shell: sticky 72px header with logo lockup, 7-item nav with the 3px coral active bar, tier pill, avatar. Footer. Verify against the prototype side by side.

**Checkpoint: header and footer pixel-match the prototype.**

### Phase 2 — Data

1. Write the Drizzle schema for every table in `README.md` § Data model.
2. Write `scripts/seed-resources.ts`. Read `data/Howell Resources - Resources.csv` with a proper CSV parser (fields contain quoted newlines — a `split(',')` will corrupt it). Apply the parse rules in the README verbatim: extract the 11-char YouTube ID, skip rows without title or ID, dedupe on `lower(title)+youtube_id`, clean summaries, parse `M/D/YY` dates. **You must land exactly 2,688 rows** — `design/resources.js` is the reference output; diff against it.
3. Port the skill and grade-band inference regex lists from `design/resources.js` into the seed script. Write both values with an `is_inferred: true` flag.
4. Seed `data/Howell Resources - Substack.csv` into `articles` (53 rows).
5. Hand-author the 4 standards, 4 unpacks, and 4 blueprints (RL.2.1, RI.4.2, L.5.4, RL.6.3). **Copy the content verbatim out of the prototype's logic — every step, minute count, misconception, fix, and prior/future standard is deliberate pedagogy written by the client. Do not paraphrase or regenerate it.**
6. Seed the 6 courses.

**Checkpoint: `select count(*) from resources` returns 2688. Print the 5 newest titles and confirm they match the prototype's home page.**

### Phase 3 — Library and detail

1. `/resources` — server-rendered, filters and sort in the query string, cursor pagination at 30/page. Never ship the full table to the client.
2. Build the filter sidebar from live `group by` counts. All 37 purposes and 38 skills, count-ordered. Nothing hardcoded.
3. Build `ResourceCard`. Thumbnails from `i.ytimg.com/vi/{id}/mqdefault.jpg` — allow that host in `next.config`. Format badge, date badge, title, purpose label, grade + skill chips bottom-aligned.
4. `/resources/[id]` — the two-column detail layout. The video is a thumbnail that swaps to a `youtube-nocookie.com/embed?autoplay=1` iframe **in place**; it must never navigate away.
5. Sticky right rail: action card, "At a glance", "Pairs well with" (3 same-skill resources).

**Checkpoint: filter to Purpose = EduProtocols, sort A–Z, reload the page, and confirm the state survives in the URL.**

### Phase 4 — Auth, paywall, planner

1. Supabase Auth, email + Google. Protect `/planner`.
2. `subscriptions` table driven by Stripe webhooks. Three price points: $0, $10/mo, $7/teacher/mo.
3. **Enforce the paywall server-side.** Locked resources return metadata but not `link_url`. The blur-and-pill treatment is a visual echo of a server decision, never the mechanism. Free tier: 550 free resources, 5 opens/month, 3 matches/month, 2 courses — track usage in a `usage_events` table and reset monthly.
4. Wire "Save to planner" everywhere it appears → `saved_resources`. Optimistic UI, immediate persist.
5. Build `/planner`: count header, saved-resource grid, per-card remove, empty state.

**Checkpoint: a free account cannot obtain a locked resource's `link_url` from any endpoint. Prove it.**

### Phase 5 — The standard matcher

This is the product. Give it the most care.

1. `/match` with the centered search. Resolve input against `standards.match_keys`, then fall back to skill-language matching (header reads "Best guess" in that case).
2. `/match/[code]` with the four tabs as real routes or `?tab=`, so a blueprint is linkable.
3. **Lesson blueprint** — rebuild the one-pager exactly per README § 4a. Navy header, four-up context row, 5-stage route with the exact stage colors, 8 step cards, four-up support row, EF chips, big-idea footer. This is a print artifact as much as a screen: add a print stylesheet so a teacher can hit Cmd-P and get a clean one-pager.
4. **Unpack the standard** — per § 4b. The misconception rows (pink "you'll see" / teal "try this") are the signature element; get them right.
5. **Resources to remix** — wide rows with the numbered teaching moves and the "Use it for {code} like this" heading.
6. Loading state is always the four staggered pulse dots with the real copy: "Reading the standard, then searching 2,688 resources…"

**Checkpoint: `/match/RL.2.1` renders all four tabs, and the blueprint prints cleanly to one page.**

### Phase 6 — AI material generation

1. `POST /api/generate` — server only. Never expose the Anthropic key.
2. Build the prompt exactly as specified in README § 4d: standard code and name, learning target, grade inferred from the standard, lesson frame, resource being remixed, the teacher's free-text note, the chosen format's shape description, and the JSON-only response schema.
3. Validate the response with Zod against `{ title, items: [{ label, lines: string[] }] }`. Strip code fences, slice between first `{` and last `}`.
4. **Keep the prose fallback.** When JSON parsing fails, render the raw text in a styled "Draft" panel with a "Rebuild as slides" button. The model does occasionally return prose and the teacher must never see a blank pane.
5. Build all four output renderers — they are genuinely different layouts, not one template with different colors:
   - **Slides**: 2-column 16/9 previews, first slide navy with the coral chevron
   - **Anchor chart**: one poster block
   - **Task cards**: 3-column dashed-border cards with empty checkboxes
   - **Notebook page**: single 660px sheet with accent-underlined sections
6. Persist every generation to `generated_materials`.
7. Editing, per the client's explicit request: click any text to edit in place, a simpler/harder control, and regenerate-one-item without redoing the set.
8. Rate-limit by tier.

**Checkpoint: generate all four formats for RL.2.1 and confirm each looks like the thing it claims to be.**

### Phase 7 — Videos, Lounge, Plans, admin

1. `/videos` — tabbed course grid with progress tracks. Real cover uploads to Supabase Storage.
2. `/lounge` — featured hero + category-filtered article cards, `target="_blank"` to Substack. Cover image is a per-article field the client can set.
3. `/plans` — the three cards and FAQ grid, wired to Stripe Checkout.
4. **Admin**, and this matters more than it sounds: a table view of all 2,688 resources where the client can correct the inferred `skill` and `grade_band`, set `is_free`, and edit summaries. Surface `is_inferred` clearly. Plus an authoring form for standards, unpacks, and blueprints.

### Phase 8 — Quality

1. Fix everything in README § Accessibility. Real buttons, focus-visible rings, checkbox semantics, `role="tablist"`, accessible names on icon buttons.
2. Responsive down to ~768px: library sidebar becomes a filter sheet, grids collapse, detail and match stack.
3. Playwright: search → match → open blueprint → save to planner → generate a material → hit the paywall.
4. Lighthouse ≥ 90 across the board. Lazy-load thumbnails, `next/image` where it helps.

---

## Rules

- **Never invent design values.** Every color, size, and radius is in `README.md`. If something is missing, read it out of the prototype rather than guessing.
- **Copy is final.** Headlines, button labels, empty states, the "AI = thinking partner, not an answer machine." line — use them verbatim. The client wrote them.
- Poppins only. Coral is the only primary action color. Two keyframes, no more.
- No gradient backgrounds beyond the supplied `Background.png`. No emoji in the UI.
- Card hover is `border-color: #111111` and nothing else.
- Server-render by default; reach for `"use client"` only for genuinely interactive leaves.
- Commit per phase with a clear message. Stop and report at each checkpoint.

## Ask before you build

1. Which resources are actually free? (`is_free` is currently `index % 5`.)
2. Should the 38 inferred skills be trusted as-is for launch, or hidden until reviewed?
3. Is real Google Slides export in scope for v1, or does clipboard-and-paste ship first?
4. Any existing Stripe account, domain, or Google Workspace to connect?
