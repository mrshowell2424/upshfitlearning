/**
 * Loads the Basic Reading workbooks into Postgres.
 *
 * Production runs on Cloudflare Workers, whose bundle has no filesystem, so
 * the pages cannot be read off disk there. They are served from the
 * reading_materials table instead, and this is what fills it.
 *
 * content-reading-materials/ remains the source of truth. Re-run this after a
 * canvas re-export and after copying the new pages in:
 *
 *   bun --env-file=.env.local run scripts/seed-reading-materials.ts
 *
 * Idempotent — rows upsert on path, and anything no longer on disk is removed
 * so a renamed page does not linger as a row nothing links to.
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import WRITING from "./reading-writing-passages.json" with { type: "json" };
import SPLITS from "./reading-skill-splits.json" with { type: "json" };
import { EXTRA_LESSONS } from "./lib/extra-lessons.mjs";
import CONTINUUM_DAILY from "./continuum-daily.json" with { type: "json" };
import DAILY_PRACTICE from "./reading-daily-practice.json" with { type: "json" };
import SYLLABLES from "./reading-syllable-splits.json" with { type: "json" };
import PARTW from "./reading-part-words.json" with { type: "json" };

/**
 * The parts this page may offer as their own focus: the ones with a word
 * bank behind them.
 *
 * reading-skill-splits.json says what a lesson teaches. It used to say
 * that for only the forty-one lessons that have banks, so the two lists
 * were the same and this script could read either. Thirteen more lessons
 * have splits recorded now -- short a, soft c and g, the doubling rule --
 * and none of them has a bank. Offering those as parts would put a "soft
 * c" option in the workbook whose word list is narrowed by a plain
 * substring test, which would hand a child cage as a soft-c word.
 *
 * So the offer is tied to the bank, which is what the comment below the
 * narrowing code already said it was.
 */
const OFFERED: Record<string, string[]> = Object.fromEntries(
  Object.entries(SPLITS as Record<string, string[]>)
    .map(([k, subs]) => [k, subs.filter((q) => (PARTW as Record<string, unknown>)[`${k}|${q}`])])
    .filter(([, subs]) => (subs as string[]).length),
);
import SENT3 from "./reading-third-sentences.json" with { type: "json" };
import AICOACH from "./reading-ai-writing-coach.json" with { type: "json" };
import MYSTERIES from "./reading-mysteries.json" with { type: "json" };
import MYSTERYCOACH from "./reading-mystery-coach.json" with { type: "json" };
import MYSTERYDEBATECOACH from "./reading-mystery-debate-coach.json" with { type: "json" };
import ARTICLES from "./reading-articles.json" with { type: "json" };
import EXTRAW from "./reading-extra-words.json" with { type: "json" };
import MSB from "./reading-multisyllabic.json" with { type: "json" };
import WTYPES from "./reading-writing-types.json" with { type: "json" };
import MATHP from "./math-practice.json" with { type: "json" };
import PREQ from "./reading-prerequisites.json" with { type: "json" };
import WSX from "./reading-what-says.json" with { type: "json" };
import LADD from "./reading-word-ladders.json" with { type: "json" };
import PASSAGES from "./reading-passages.json" with { type: "json" };
import { db } from "@/lib/db";
import { reading_materials } from "@/lib/db/schema";
import { inArray, sql } from "drizzle-orm";

const ROOT = path.join(process.cwd(), "content-reading-materials");

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
};

/**
 * Types whose files are bytes, not characters.
 *
 * The content column is text, so these go in base64-encoded and the materials
 * route decodes them on the way out. The Math Hub's printables are the reason:
 * its buttons link to sibling PDFs, and a PDF read as UTF-8 comes back
 * corrupt. Keep this in step with BINARY_TYPES in the route.
 */
const BINARY = new Set([".pdf"]);

/**
 * What the canvas exports is not quite what the site should serve.
 *
 * Each rule below is applied to the lesson builder on its way into the table,
 * so content-reading-materials/ stays exactly as the canvas wrote it and a
 * re-export cannot quietly undo any of this.
 *
 * Every rule is required. If one stops matching — because a re-export moved
 * the markup — the seed fails rather than shipping. That matters most for the
 * two it removes on privacy grounds: a silent no-match would put a folder of
 * unshared Drive links, and a list of children's first names, back in front
 * of every teacher on the site.
 */
type Adaptation = { name: string; apply: (html: string) => string };

/** Removes a whole element, counting nested tags, given where it starts. */
function cutElement(html: string, startAt: number, tag: string): string | null {
  const open = new RegExp(`<${tag}\\b`, "gi");
  const close = new RegExp(`</${tag}>`, "gi");
  let depth = 0;
  let i = startAt;
  while (i < html.length) {
    open.lastIndex = i;
    close.lastIndex = i;
    const o = open.exec(html);
    const c = close.exec(html);
    if (!c) return null;
    if (o && o.index < c.index) {
      depth++;
      i = o.index + o[0].length;
    } else {
      depth--;
      i = c.index + c[0].length;
      if (depth === 0) return html.slice(0, startAt) + html.slice(i);
    }
  }
  return null;
}

/** Cuts the element that holds `needle`, from its nearest enclosing `tag`. */
function cutAround(html: string, needle: string, tag: string): string | null {
  const at = html.indexOf(needle);
  if (at === -1) return null;
  const from = html.lastIndexOf(`<${tag}`, at);
  return from === -1 ? null : cutElement(html, from, tag);
}

const ADAPTATIONS: Adaptation[] = [
  {
    // dc-runtime's boot() re-fetches the page and re-parses it as the page's
    // own template, slicing from the first <x-dc> to the last </x-dc>. This
    // export inlines the runtime, so the first match lands inside the
    // runtime's source — in the string "has no <x-dc> block" — and half a
    // megabyte of runtime goes through the template compiler, which rewrites
    // ` rootName =` to ` sc-camel-root-name =` and paints it on screen.
    // Defining __resources skips that re-fetch. Invisible on file://, where
    // the browser blocks the fetch; certain on the site.
    name: "guard the inlined runtime against re-parsing itself",
    apply: (html) => {
      if (!html.includes("GENERATED from dc-runtime")) return html;
      if (/window\.__resources\s*=/.test(html)) return html;
      const head = html.indexOf("<head>");
      if (head === -1) return html;
      return (
        html.slice(0, head + 6) +
        "\n<script>/* skips dc-runtime's self-re-parse when served over HTTP */" +
        "window.__resources = window.__resources || {};</script>\n" +
        html.slice(head + 6)
      );
    },
  },
  {
    // Points at a sibling PLANS page that belongs to the canvas and was never
    // published, so on the site it is a link to a 404.
    name: "remove the Back to Plans button",
    apply: (html) => html.replace(/\s*<a\b[^>]*\bdata-back-plans\b[^>]*>[\s\S]*?<\/a>/gi, ""),
  },
  {
    // The reference folder behind the programme, shared with nobody. A
    // teacher who clicks it meets Google's request-access screen.
    name: "remove the Open Drive folder button",
    apply: (html) => cutAround(html, "Open Drive folder", "a") ?? html,
  },
  {
    // A grid of the same unshared Drive files — a wall of dead ends.
    name: "remove the ALL RESOURCES shelf",
    apply: (html) => {
      const label = ">ALL RESOURCES</div>";
      const at = html.indexOf(label);
      if (at === -1) return html;
      const start = html.lastIndexOf("<div", at);
      const grid = html.indexOf("<div", at + label.length);
      if (start === -1 || grid === -1) return html;
      const withoutGrid = cutElement(html, grid, "div");
      if (withoutGrid === null) return html;
      return cutElement(withoutGrid, start, "div") ?? html;
    },
  },
  {
    name: "remove the grade filter",
    apply: (html) => html.replace(/^[ \t]*OPT\('All grades',.*\r?\n/m, ""),
  },
  {
    // Real children's first names. They have no business on the site, and the
    // filter means nothing to a teacher who does not know them.
    name: "remove the student filter",
    apply: (html) => html.replace(/^[ \t]*OPT\('All students',.*\r?\n/m, ""),
  },
  {
    // "Decodable story: The Same Game (p. 43)" names a page in a decodable
    // reader the site does not ship, and the workbook prints a different story
    // under its own title. Both the header and lesson step 11 showed the book
    // reference, so a teacher was pointed at a page they cannot open while the
    // story they are about to hand out went unnamed.
    //
    // `story` is resolved the same way the decodable page resolves it, so the
    // two always agree. The titles of the two stories held inline are lifted
    // out of that table rather than retyped, so a re-export carries its own
    // renames; the rest come from sor-extra.js or the OG pack data at runtime.
    //
    // 49 of the 62 skills have a story in the printable. The other 13 — short
    // a, the short vowel review, digraphs, FLOSS, blends, VC/CV, glued sounds,
    // y as a vowel, -ck/-tch, ar/or and the three vowel-team pairs — have none
    // at all, and for them the book reference is the only pointer there is, so
    // they keep it.
    name: "name the story the workbook prints, not a page in a book",
    apply: (html) => {
      const at = html.indexOf("const D = {");
      if (at === -1) return html;
      const end = html.indexOf("\n        };", at);
      if (end === -1) return html;
      const titles = [...html.slice(at, end).matchAll(/\n          ([a-z0-9_]+): \['((?:[^'\\]|\\.)*)'/g)];
      if (!titles.length) return html;

      const decl =
        "const [id, label, level, story, rule, build, real0, nonsense, heart0, dict] = cur;";
      if (!html.includes(decl)) return html;
      const xt = "    const XT = (this.state && this.state.xt) || {};";
      if (!html.includes(xt)) return html;

      const map =
        "{ " + titles.map(([, k, t]) => k + ": '" + t + "'").join(", ") + " }";

      // Step 11 hands the reader each text as its own chip.
      const step11 = "[story], true)";
      if (!html.includes(step11)) return html;

      return html
        .replace(decl, decl.replace(", story,", ", story0,"))
        .replace(step11, "STORIES, true)")
        .replace(
          xt,
          xt +
            "\n    // The story this lesson's workbook actually prints. Resolved the\n" +
            "    // same way the decodable page resolves it, so the two agree. The\n" +
            "    // skills with no printable story keep the book reference, minus\n" +
            "    // its page number: a page in a book the site does not ship tells\n" +
            "    // a teacher nothing, and the title is what they search for.\n" +
            "    // A lesson that uses two texts keeps them apart, so step 11 can\n" +
            "    // give each one its own box rather than one long run-on.\n" +
            "    const DTITLE = " + map + ";\n" +
            "    const STORIES = String(DTITLE[id] || ((XT.DEC || {})[id] || [])[0]\n" +
            "      || (OGD[id] && OGD[id].p && OGD[id].p.dec ? OGD[id].p.dec.title : '')\n" +
            "      || story0).split(' \u00b7 ')\n" +
            "      .map((t) => t.replace(/\\s*\\(p\\.\\s*\\d+\\)/g, '').trim()).filter(Boolean);\n" +
            "    const story = STORIES.join(' \u00b7 ');"
        );
    },
  },
  {
    // Dictation lives on the Say It page now, with two full sentences and
    // ruled lines. Page 2 still carried the old four blanks and one sentence
    // under the same name, so a child met it twice.
    //
    // The two reading pages take a name of their own, the way the Say It page
    // and the writing page already do, and the sections renumber so nothing
    // skips.
    //
    // The passage paragraphs are indented and spaced. They were one block of
    // pre-line text, so the three sides of the argument ran together and a
    // child hunting for proof had nothing to anchor on.
    name: "name the reading pages and stop dictation happening twice",
    apply: (html) => {
      // The whole section, not just its heading: the needle's nearest opening
      // tag is the heading div, so cutting from there left the four blanks and
      // the ruled sentence behind with nothing above them.
      let out = cutAround(
        html,
        '<div style="display:flex;flex-direction:column;gap:6px;flex:1">\n' +
          '        <div style="font-size:15px;font-weight:800;color:#2F3E2E">' +
          "5. Dictation. Write the words and the sentence",
        "div"
      );
      if (out === null) return html;

      const steps: [string, string][] = [
        // The cut section carried flex:1, and the page spreads what is left
        // over with space-between. Without it the slack fell into the gap
        // under the header and pushed the heart words a third of the way
        // down the page. The partner read takes the flex instead, so the
        // heart words sit up under the rule and the page still fills.
        [
          '<div style="display:flex;flex-direction:column;gap:8px;break-inside:avoid;' +
            'page-break-inside:avoid">\n        <div style="font-size:15px;font-weight:800;' +
            'color:#2F3E2E">6. Read the sentences to a partner.',
          '<div style="display:flex;flex-direction:column;gap:8px;flex:1;break-inside:avoid;' +
            'page-break-inside:avoid">\n        <div style="font-size:15px;font-weight:800;' +
            'color:#2F3E2E">6. Read the sentences to a partner.',
        ],
        ["6. Read the sentences to a partner.", "5. Read the sentences to a partner."],
        ["7. Voice fun! Read the sentences 3 times.", "6. Voice fun! Read the sentences 3 times."],
        ["8. Writing. Read the passage.", "7. Writing. Read the passage."],
        // Both reading pages get the name.
        [
          '<div style="font-family:Outfit,sans-serif;font-size:12px;font-weight:700;letter-spacing:.18em;color:#618459">{{ p.kicker }}</div>\n          <div style="font-size:26px;font-weight:800;color:#2F3E2E;line-height:1.1">{{ sk.label }}</div>',
          '<div style="font-family:Outfit,sans-serif;font-size:12px;font-weight:700;letter-spacing:.18em;color:#618459">{{ p.kicker }} · READ IT</div>\n          <div style="font-size:26px;font-weight:800;color:#2F3E2E;line-height:1.1">📖 Read It — {{ sk.label }}</div>',
        ],
        [
          "{{ p.kicker }} · PAGE 2",
          "{{ p.kicker }} · READ IT · PAGE 2",
        ],
        // Paragraphs, not one run-on block.
        [
          '<sc-if value="{{ hasEbText }}" hint-placeholder-val="{{ true }}"><div style="border:2px solid #111;border-radius:10px;padding:10px 14px;font-size:15.5px;line-height:1.55;color:#111;text-wrap:pretty;white-space:pre-line">📖 {{ ebText }}</div></sc-if>',
          '<sc-if value="{{ hasEbText }}" hint-placeholder-val="{{ true }}">' +
            '<div style="border:2px solid #111;border-radius:10px;padding:12px 16px;font-size:15.5px;' +
            'line-height:1.6;color:#111;text-wrap:pretty;display:flex;flex-direction:column;gap:11px">' +
            '<sc-for list="{{ ebParas }}" as="q" hint-placeholder-count="3">' +
            '<div style="text-indent:1.6em">{{ q.t }}</div></sc-for></div></sc-if>',
        ],
        [
          "ebPrompt, ebText, hasEbText: !!ebText,",
          "ebPrompt, ebText, hasEbText: !!ebText,\n      ebParas: String(ebText || '').split('\\n')" +
            ".map((t) => t.trim()).filter(Boolean).map((t) => ({ t })),",
        ],
      ];
      for (const [from, to] of steps) {
        if (!out.includes(from)) return html;
        out = out.replace(from, to);
      }
      return out;
    },
  },
  {
    // Two write-it lines per word is copying twice over. One is enough: say
    // the word, then write it once from the page.
    //
    // Fluency gets three sentences rather than two. A partner read wants
    // enough to build a rhythm.
    name: "say the heart word, then write it once",
    apply: (html) => {
      const box =
        '<div style="border:1.5px solid #C0504D;border-radius:10px;padding:10px 14px;display:flex;flex-direction:column;gap:14px">\n' +
        '              <div style="font-size:26px;font-weight:800">♥ {{ h }}</div>\n' +
        '              <div style="border-bottom:1.5px solid #333;height:34px"></div>\n' +
        '              <div style="border-bottom:1.5px solid #333;height:34px"></div>\n' +
        "            </div>";
      if (!html.includes(box)) return html;
      const mapped =
        '<div style="border:1.5px solid #C0504D;border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;gap:12px">\n' +
        '              <div style="font-size:26px;font-weight:800">♥ {{ h }}</div>\n' +
        '              <div style="border-bottom:1.5px solid #333;height:36px"></div>\n' +
        "            </div>";
      let out = html.replace(box, mapped);

      const title = "4. Heart words. Read it, then write it 2 times.";
      if (!out.includes(title)) return html;
      out = out.replace(title, "4. Heart words. Say it. Write the word.");

      // Three sentences for the partner read, and not the dictation's.
      //
      // They were the same sentences: wbSent was dict, so a child read the
      // two lines to a partner and then wrote the same two from dictation.
      // They come from the passage instead — different text, the same
      // pattern, and the lines they are about to meet in the story they read
      // next. The old behaviour stays as the fallback for a skill whose
      // passage is too short to give three.
      const sent = 'wbHeart: heart, wbSent: dict,';
      if (!out.includes(sent)) return html;
      out = out.replace(
        sent,
        "wbHeart: heart, wbSent: (() => {\n" +
          "        const fits = (x) => { const n = x.trim().split(/\\s+/).length; " +
          "return n >= 4 && n <= 12; };\n" +
          "        const fromText = (String(ebText || '').replace(/\\n/g, ' ')" +
          ".match(/[^.!?]+[.!?]/g) || [])\n" +
          "          .map((x) => x.trim()).filter((x) => fits(x) && dict.indexOf(x) === -1);\n" +
          "        if (fromText.length >= 2) return fromText.slice(0, 3);\n" +
          "        return dict.concat(dictAll.filter((q) => dict.indexOf(q) === -1)).slice(0, 3);\n" +
          "      })(),"
      );
      const forEach = '<sc-for list="{{ wbSent }}" as="s" hint-placeholder-count="2">';
      if (!out.includes(forEach)) return html;
      return out.replace(forEach, '<sc-for list="{{ wbSent }}" as="s" hint-placeholder-count="3">');
    },
  },
  {
    // Three sentences for the partner read needs three sentences to exist.
    // Every skill shipped with exactly two, so slicing to three changed
    // nothing on the page.
    //
    // The 47 skills built from the OG packs take theirs from the decodable
    // story, which has plenty — the cut was simply set at two, and every one
    // of the 47 has a third that passes the same 4-to-12-word filter.
    //
    // The 15 hand-written skills have no story to draw on, so their third
    // sentence is written: the skill's own pattern, its heart words where one
    // fits, and nothing from a pattern the child has not met yet.
    name: "give the partner read a third sentence",
    apply: (html) => {
      const cut = "return n >= 4 && n <= 12; }).slice(0, 2);";
      if (!html.includes(cut)) return html;
      const out = html.replace(cut, "return n >= 4 && n <= 12; }).slice(0, 3);");

      const anchor = "    const byId = Object.fromEntries(SK.map((s) => [s[0], s]));";
      if (!out.includes(anchor)) return html;
      return out.replace(
        anchor,
        anchor +
          "\n    const SENT3 = " +
          JSON.stringify(SENT3) +
          ";\n    Object.keys(SENT3).forEach((k) => {\n" +
          "      const r = byId[k];\n" +
          "      if (r && Array.isArray(r[9]) && r[9].length < 3) r[9].push(SENT3[k]);\n" +
          "    });"
      );
    },
  },
  {
    // Three of the lesson's steps were spoken only. Step 1 changes a sound
    // and says the new word, step 3 says which letters spell a sound, and
    // spelling was four dictation blanks on page 2. A child left no record of
    // any of it, so nothing could be looked at afterwards.
    //
    // This adds one page that holds all of it in writing: the sound change
    // with the word before and after, the letters that spell each sound, ten
    // spelling words, and dictation as its own section rather than a corner
    // of page 2. Real or made-up goes from eight words to ten at the same
    // time, which is what every other list on the page has.
    name: "give the spoken steps a place to write",
    apply: (html) => {
      // 1. Real or made-up: eight to ten.
      const rm =
        "const rmWords = [real[0], nonsense[0], real[1], nonsense[1], real[2], " +
        "nonsense[2] || real[8], real[3], nonsense[3] || real[9]];";
      if (!html.includes(rm)) return html;
      let out = html.replace(
        rm,
        "const rmWords = (() => { const R = real.slice(0, 5); " +
          "const M = nonsense.slice(0, 5); const out = []; " +
          "for (let i = 0; i < 5; i++) { if (R[i]) out.push(R[i]); if (M[i]) out.push(M[i]); } " +
          "return out.concat(real.slice(5)).slice(0, 10); })();"
      );

      // 2. The page's data, built beside the decodable and fluency pages.
      const anchor =
        "        return { ...p, hasFl: p.hasDec, flBox: { ...p.decBox }, flTitle: p.dec.title, flParas, flTotal: String(run),";
      if (!out.includes(anchor)) return html;
      out = out.replace(
        anchor,
        "        const encOn = show(isKey ? 'key' : 'wb');\n" +
          "        const paItems = ((paA && paA[2]) || []).slice(0, 5).map((t, i) => {\n" +
          "          const parts = String(t).split(/\\s*\\(|\\)\\s*$/).filter(Boolean);\n" +
          "          const lead = parts[0].trim();\n" +
          "          // 'cap \u2192 change /\u0103/ to /\u0101/' gives the word they start from and\n" +
          "          // the change to make; the child writes the new word on the line.\n" +
          "          const cut = lead.split(/\\s*(?:\u2192|\u2014|->|:)\\s*/);\n" +
          "          const from = cut.length > 1 ? cut[0].trim() : '';\n" +
          "          const change = cut.slice(1).join(' ').trim() || lead;\n" +
          "          // The key prints the word the teacher says and the change to\n" +
          "          // make, because without them it shows an answer with nothing to\n" +
          "          // get there from. The student's copy keeps both blank: hearing\n" +
          "          // the word is the activity.\n" +
          "          return { n: i + 1, from, hasFrom: !!from, t: change,\n" +
          "            fromShown: isKey ? from : '', changeShown: isKey ? change : 'change',\n" +
          "            ans: isKey ? (parts[1] || '').trim() : '' }; });\n" +
          "        // What says: the sound the teacher makes, and the letters\n" +
          "        // that spell it. The lesson card runs it orally at step 3;\n" +
          "        // on paper it is the same drill with somewhere to write.\n" +
          "        const wsItems = (whatSays || []).slice(0, 6).map((t, i) => {\n" +
          "          const q = String(t).split('? (')[0].replace(/^What says\\s*/, '').trim();\n" +
          "          const a = (String(t).split('? (')[1] || '').replace(/\\)\\s*$/, '').trim();\n" +
          "          // The sound is said, not shown. Printing /f/ next to the line\n" +
          "          // turns a listening drill into a copying one, so the child's\n" +
          "          // page reads \"What says?\" and the key carries the sound.\n" +
          "          return { n: i + 1, q: isKey ? ' ' + q : '', ans: isKey ? a : '' }; });\n" +
          anchor
      );
      const tail = "          sbBox: { ...p.decBox, display: sbRows.length && show(isKey ? 'key' : 'wb') ? 'flex' : 'none' }, sbRows }; })";
      if (!out.includes(tail)) return html;
      out = out.replace(
        tail,
        "          encBox: { ...p.decBox, display: encOn ? 'flex' : 'none' },\n" +
          "          paItems, hasPa: paItems.length > 0, paDir: (paA && paA[1]) || '',\n" +
          "          wsItems, hasWs: wsItems.length > 0,\n" +
          "          spellWords: Array.from({ length: 10 }, (_, i) => " +
          "({ n: i + 1, ans: isKey ? (real[i] || '') : '' })),\n" +
          "          dictSents: Array.from({ length: 2 }, (_, i) => " +
          "({ n: i + 1, ans: isKey ? (dict[i] || '') : '' })),\n" +
          tail
      );

      // 3. The page itself, in front of the writing page.
      const mark = "{{ p.kicker }} · WRITING";
      const at = out.indexOf(mark);
      if (at === -1) return html;
      const open = out.lastIndexOf('<div data-wb="true"', at);
      if (open === -1) return html;

      const H = (n: string, t: string) =>
        '<div style="font-size:15px;font-weight:800;color:#2F3E2E">' + n + ". " + t + "</div>";
      const LINE = '<span style="flex:1;min-width:0;border-bottom:1.5px solid #333;' +
        'min-height:34px;font-size:17px;color:#B42318;display:flex;align-items:flex-end;' +
        'justify-content:center;overflow-wrap:anywhere;padding-bottom:2px">';
      const ROW = '<div style="display:flex;align-items:flex-end;gap:8px;font-size:17px;font-weight:700;min-width:0">';

      const page =
        '    <div data-wb="true" style="{{ p.encBox }}">\n' +
        '      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:12px;' +
        'border-bottom:3px solid #2F5E7A;padding-bottom:8px">\n' +
        '        <div><div style="font-family:Outfit,sans-serif;font-size:12px;font-weight:700;' +
        'letter-spacing:.16em;color:#2F5E7A">{{ p.kicker }} · SPELLING</div>' +
        '<div style="font-size:26px;font-weight:800;color:#2F3E2E;line-height:1.1">' +
        '✍️ Say it, then write it</div></div>\n' +
        '        <div style="font-size:14px;font-weight:600;white-space:nowrap">Name ____________</div>\n' +
        "      </div>\n" +
        // Phonological awareness, written down
        '      <sc-if value="{{ p.hasPa }}" hint-placeholder-val="{{ true }}">\n' +
        '      <div style="display:flex;flex-direction:column;gap:8px;break-inside:avoid;page-break-inside:avoid">\n' +
        "        " + H("1", "Change the sound. Write the word you hear, then the new word.") + "\n" +
        '        <div style="font-size:12.5px;font-weight:600;color:#57534e">Your teacher says the word and the change to make.</div>\n' +
        '        <sc-for list="{{ p.paItems }}" as="x" hint-placeholder-count="5">\n' +
        '          <div style="display:flex;align-items:flex-end;gap:10px;font-size:16px;font-weight:700">' +
        '<span style="flex:none;width:18px">{{ x.n }}.</span>' +
        LINE.replace("min-height:34px", "min-height:40px") + "{{ x.fromShown }}</span>" +
        '<span style="flex:none;font-size:12.5px;font-weight:700;color:#57534e;padding:0 4px;' +
        'white-space:nowrap">{{ x.changeShown }}</span>' +
        LINE.replace("min-height:34px", "min-height:40px") + "{{ x.ans }}</span></div>\n" +
        "        </sc-for>\n" +
        "      </div></sc-if>\n" +
        // What says: the sound, then the letters that spell it
        '      <sc-if value="{{ p.hasWs }}" hint-placeholder-val="{{ true }}">\n' +
        '      <div style="display:flex;flex-direction:column;gap:8px;break-inside:avoid;page-break-inside:avoid">\n' +
        "        " + H("2", "What says? Your teacher says the sound. Write the letters that spell it.") + "\n" +
        '        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 22px">\n' +
        '          <sc-for list="{{ p.wsItems }}" as="x" hint-placeholder-count="6">\n' +
        '            <div style="display:flex;align-items:flex-end;gap:10px;font-size:16px;font-weight:700">' +
        '<span style="flex:none;width:18px">{{ x.n }}.</span>' +
        '<span style="flex:none;font-size:18px;font-weight:800;white-space:nowrap">What says{{ x.q }}?</span>' +
        LINE + "{{ x.ans }}</span></div>\n" +
        "          </sc-for>\n" +
        "        </div>\n" +
        "      </div></sc-if>\n" +
        // Spelling: ten words
        '      <div style="display:flex;flex-direction:column;gap:8px;break-inside:avoid;page-break-inside:avoid">\n' +
        "        " + H("3", "Spelling (encoding). Say the word, tap each sound, then write it.") + "\n" +
        '        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 22px">\n' +
        '          <sc-for list="{{ p.spellWords }}" as="d" hint-placeholder-count="10">\n' +
        "            " + ROW + '<span style="flex:none;width:18px">{{ d.n }}.</span>' +
        LINE + "{{ d.ans }}</span></div>\n" +
        "          </sc-for>\n" +
        "        </div>\n" +
        "      </div>\n" +
        // Dictation: its own section
        '      <div style="display:flex;flex-direction:column;gap:8px;flex:1;break-inside:avoid;' +
        'page-break-inside:avoid;border:2px solid #2F5E7A;border-radius:12px;padding:12px 16px">\n' +
        "        " + H("4", "Dictation. Write the whole sentence your teacher says. Two sentences.") + "\n" +
        '        <sc-for list="{{ p.dictSents }}" as="d" hint-placeholder-count="2">\n' +
        '          <div style="display:flex;align-items:flex-start;gap:8px;font-size:17px;font-weight:700">' +
        '<span style="flex:none;padding-top:18px">{{ d.n }}.</span>' +
        '<div style="flex:1;min-width:0;min-height:92px;background-image:' +
        "repeating-linear-gradient(to bottom,transparent 0,transparent 44.5px,#333 44.5px,#333 46px);" +
        'background-size:100% 46px">' +
        '<div style="font-size:17px;line-height:46px;color:#B42318;overflow-wrap:anywhere">' +
        "{{ d.ans }}</div></div></div>\n" +
        "        </sc-for>\n" +
        "      </div>\n" +
        "    </div>\n";

      return out.slice(0, open) + page + out.slice(open);
    },
  },
  {
    // Many skills teach several things at once — "Vowel teams ai, ay",
    // "Prefixes mis-, sub-, post-" — and they are taught one at a time before
    // they are practised together. The dropdown only ever offered the pair.
    //
    // Each of those skills now lists its parts first and the whole last, so
    // ai, then ay, then "ai, ay \u00b7 all together". Picking a part keeps the
    // same lesson, rule, story and writing passage, and narrows the word
    // lists, made-up words and dictation to the words that show that part.
    //
    // The selection carries the part after a pipe — "ai-ay|ay" — so `id` is
    // still the parent everywhere, and the fifty-odd lookups keyed on it
    // (the decodable, the maze, the multisyllabic list, the OG pack) need to
    // know nothing about any of this.
    //
    // A sibling only overrides a part when it contains it: ck covers the c in
    // duck, so duck is not a c word, but biology is both a bio word and an
    // ology word. Parts whose skill holds no example are left out of
    // reading-skill-splits.json rather than offered and left empty.
    name: "teach each part of a multi-part skill on its own",
    apply: (html) => {
      const byId = "const byId = Object.fromEntries(SK.map((s) => [s[0], s]));";
      const cur = "const cur = byId[this.state && this.state.skill] || byId.vce;";
      if (!html.includes(byId) || !html.includes(cur)) return html;

      const decl =
        "const [id, label, level, story0, rule, build, real0, nonsense, heart0, dict] = cur;";
      if (!html.includes(decl)) return html;

      const opts = "skillOpts: SK.map((s) => ({ id: s[0], label: s[2] + ' \u00b7 ' + s[1] })),";
      if (!html.includes(opts)) return html;
      if (!html.includes("skillId: id,")) return html;

      return html
        .replace(
          cur,
          "const SPLITS = " + JSON.stringify(OFFERED) + ";\n" +
            "    // 'ai-ay|ay' picks the skill and, after the pipe, the one part of it.\n" +
            "    const SEL = String((this.state && this.state.skill) || '');\n" +
            "    const subPat = SEL.split('|')[1] || '';\n" +
            "    const cur = byId[SEL.split('|')[0]] || byId.vce;\n" +
            "    // A part may be written as alternatives — spec/spect — and _ stands\n" +
            "    // for the letter a silent e jumps over, as in a_e.\n" +
            "    const subAlts = (q) => String(q).split('/')" +
            ".map((a) => a.replace(/[^a-zA-Z_']/g, '')).filter(Boolean);\n" +
            "    const subHits = (q, w) => subAlts(q)" +
            ".some((a) => new RegExp(a.replace(/_/g, '[a-z]'), 'i').test(w));\n" +
            "    const subName = (s, q) => { const all = (SPLITS[s[0]] || []).join(', ');\n" +
            "      return all && s[1].includes(all) ? s[1].replace(all, q) : s[1] + ' \u00b7 ' + q; };"
        )
        .replace(
          decl,
          decl
            .replace(", label,", ", label0,")
            .replace(", real0,", ", realAll,")
            .replace(", nonsense,", ", nonsenseAll,")
            .replace(", dict]", ", dictAll]") +
            "\n    const subSibs = (SPLITS[id] || []).filter((x) => x !== subPat &&\n" +
            "      subAlts(subPat).some((a) => subAlts(x).some((b) => b.length > a.length && b.includes(a))));\n" +
            "    // A part is one focus, so its lists hold that pattern and nothing\n" +
            "    // else: an i_e lesson must not read a_e words. Ten of each come\n" +
            "    // from the bank; a part with no bank yet shows only its own words\n" +
            "    // from the skill list, short rather than off-pattern.\n" +
            "    const PARTW = " + JSON.stringify(PARTW) + ";\n" +
            "    const narrow = (list, kind) => { if (!subPat) return list;\n" +
            "      const bank = PARTW[id + '|' + subPat];\n" +
            "      if (bank && kind && bank[kind] && bank[kind].length) return bank[kind].slice();\n" +
            "      const hit = (list || []).filter((w) => subHits(subPat, w) &&\n" +
            "        !subSibs.some((L) => subHits(L, w)));\n" +
            "      return hit.length ? hit : list; };\n" +
            "    const real0 = narrow(realAll, 'real');\n" +
            "    const nonsense = narrow(nonsenseAll, 'fake');\n" +
            "    const dict = narrow(dictAll);\n" +
            "    const label = subPat ? subName(cur, subPat) : label0;"
        )
        .replace(
          opts,
          "skillOpts: SK.flatMap((s) => { const subs = SPLITS[s[0]] || [];\n" +
            "        return subs.map((q) => ({ id: s[0] + '|' + q, label: s[2] + ' \u00b7 ' + subName(s, q) }))\n" +
            "          .concat([{ id: s[0], label: s[2] + ' \u00b7 ' + s[1] +" +
            " (subs.length ? ' \u00b7 all together' : '') }]); }),"
        )
        .replace("skillId: id,", "skillId: subPat ? id + '|' + subPat : id,");
    },
  },
  {
    // The writing page asks a child to pick a side and prove it from the
    // passage. The prompts offered two options and the passages did not hold
    // the two up evenly: a closing paragraph named a drawback for each, and an
    // authority — a vet, a coach, a teacher — usually landed on one. Three of
    // the fifteen were not even two-sided ("Should kids read every day?"), so
    // there was one defensible answer and a child picking the other had
    // nothing to underline.
    //
    // Each prompt now names three options and each passage gives one
    // paragraph per option, with two to three sentences a child can quote. No
    // paragraph argues against another, so the work is choosing the strongest
    // proof rather than finding the answer the text prefers.
    //
    // The text lives in reading-writing-passages.json beside this script,
    // because it is content and does not belong inside a regex. It is content
    // the canvas should own; it sits here only because the canvas cannot be
    // edited from this repo.
    name: "give every writing prompt three options the passage supports",
    apply: (html) => {
      const table = (name: string, pick: (v: { prompt: string; passage: string }) => string) => {
        const at = html.indexOf("const " + name + " = {");
        if (at === -1) return null;
        const end = html.indexOf("\n    };", at);
        if (end === -1) return null;
        const body = Object.entries(WRITING as Record<string, { prompt: string; passage: string }>)
          .map(([k, v]) => "      " + JSON.stringify(k) + ": " + JSON.stringify(pick(v)) + ",")
          .join("\n");
        return { at, end: end + "\n    };".length, text: "const " + name + " = {\n" + body + "\n    };" };
      };

      const ebp = table("EBP", (v) => v.prompt);
      const ebt = table("EBT", (v) => v.passage);
      if (!ebp || !ebt || ebt.at < ebp.at) return html;

      let out =
        html.slice(0, ebp.at) + ebp.text + html.slice(ebp.end, ebt.at) + ebt.text + html.slice(ebt.end);

      // Two words that still said there were two sides.
      const hunt = "\u{1F50E} Proof hunt: pick your side, then underline 2 sentences in the passage that prove it.";
      if (!out.includes(hunt)) return html;
      out = out.replace(
        hunt,
        "\u{1F50E} Proof hunt: pick one, then underline 2 sentences in the passage that prove it."
      );

      // "For example" invites an opinion; naming the text asks for the quote.
      // The lesson card already made this swap on its own copy of the frames;
      // doing it at the source means the workbook says it too.
      const frame = "'\u{1F50E} My Proof: For example, ______.'";
      if (!out.includes(frame)) return html;
      return out.replace(frame, "'\u{1F50E} My Proof: The text says, \"______.\"'");
    },
  },
  {
    // Twelve voices sat in step 12 as twelve chips, which is a wall of
    // emoji in a card the width of a column, and nothing a teacher could
    // act on — the chips only listed what the die might land on.
    //
    // They become a dropdown the teacher picks from, and the pick is kept,
    // so the choice reads back during the lesson. The phrases and the word
    // sprint stay as chips, because those are what gets read.
    //
    // The list is lifted out of the step rather than retyped, and the step
    // is wrapped the way the export wrapped step 11 for its notebook link.
    name: "turn the fluency voices into a dropdown",
    apply: (html) => {
      const voices = html.match(
        /\n        (\['\u{1F92B} Whisper',[^\n]*\])\n          \.concat\(dict\.map/u
      );
      if (!voices) return html;
      const tail = ".concat(['Sprint: ' + real.slice(0, 6).join(' \u00b7 ')]), true),";
      if (!html.includes(tail)) return html;
      const card = '            <sc-if value="{{ s.hasLegend }}"';
      if (!html.includes(card)) return html;

      return html
        .replace("      mk(12, 'Fluency", "      Object.assign(mk(12, 'Fluency")
        .replace(voices[1], "[]")
        .replace(
          tail,
          tail.slice(0, -1) +
            ", {\n" +
            "        hasVoices: true,\n" +
            "        voice: (this.state && this.state.voice) || '',\n" +
            "        pickVoice: (e) => this.setState({ voice: e.target.value }),\n" +
            "        voiceOpts: [{ v: '', t: 'Pick a voice\u2026' }].concat(" +
            voices[1] + ".map((t) => ({ v: t, t }))),\n" +
            "      }),"
        )
        .replace(
          card,
          '            <sc-if value="{{ s.hasVoices }}" hint-placeholder-val="{{ false }}">' +
            '<select value="{{ s.voice }}" onChange="{{ s.pickVoice }}" ' +
            "style=\"font-family:'Poppins',sans-serif;font-size:13px;font-weight:600;" +
            'padding:6px 9px;border:1.5px solid #C9D3C4;border-radius:8px;background:#fff;' +
            'color:#1c1917;width:100%">' +
            '<sc-for list="{{ s.voiceOpts }}" as="v" hint-placeholder-count="13">' +
            '<option value="{{ v.v }}">{{ v.t }}</option></sc-for></select></sc-if>\n' +
            card
        );
    },
  },
  {
    // Lesson step 11 carried an "Open Level 1 notebook" link to one more
    // unshared Drive file — the same dead end as the Open Drive folder button
    // above, reached from inside the lesson instead of the toolbar. Dropping
    // the Object.assign leaves the step as every other step is built, with the
    // empty hrefLabel they all default to, so the renderer needs no change.
    name: "remove the Open Level notebook link from lesson step 11",
    apply: (html) =>
      html.replace(
        /Object\.assign\((mk\(11,[\s\S]*?STORIES, true\)),\s*\{ href: level === 'Level 2'[\s\S]*?' \}\),/,
        "$1,"
      ),
  },
  {
    // A second row of skill chips, holding the advanced skills whose names
    // mention syllables. Every one of them is already in the skill dropdown
    // and the search beside it, so the row is a third way to reach the same
    // twenty skills, sitting under a heading that reads like a filter and
    // filters nothing.
    name: "remove the MULTISYLLABIC skill row",
    apply: (html) => cutAround(html, ">MULTISYLLABIC</span>", "div") ?? html,
  },
  {
    // A dropdown hides its options; the lesson steps are the spine of the
    // lesson and are worth showing all at once, the way the multisyllabic
    // patterns already are. The chips drive the same `step` filter the select
    // drove, so the preview below narrows to the chosen step with no new
    // wiring — clicking the active chip clears it again.
    //
    // The options are lifted from the select rather than retyped, so a
    // re-export that changes the steps changes the chips with it.
    //
    // Several can be lit at once — a teacher planning Monday wants blending
    // and spelling together, not one and then the other. The chosen keys are
    // kept comma-joined in the same `step` field, so everything that only
    // asks whether a filter is set keeps working.
    name: "turn the lesson-step select into chips, several at a time",
    apply: (html) => {
      const line = /^[ \t]*OPT\('All lesson steps', 'step', (\[.*\])\),[ \t]*\r?\n/m;
      const found = html.match(line);
      if (!found) return html;

      // Heart words are lesson step 8 and belong in this row, between the
      // reading steps and the spelling ones, rather than in a red button of
      // their own above it. Inserted into the captured options so a re-export
      // that renames a step still carries it.
      const opts = found[1].replace("['spell',", "['heart', 'Heart words'], ['spell',");
      if (opts === found[1]) return html;

      const chips =
        "      stepChips: " + opts + ".map(([v, t]) => { " +
        "const on = String(FS.step || '').split(',').filter(Boolean); " +
        "return { label: t, " +
        "pick: () => setF('step', (on.includes(v) ? on.filter((x) => x !== v) : on.concat(v)).join(',')), " +
        "style: \"font-family:Poppins,sans-serif;font-size:12px;font-weight:700;" +
        "cursor:pointer;border-radius:999px;padding:4px 9px;white-space:nowrap;flex:0 0 auto;" +
        "border:1.5px solid #4B6049;\" + (on.includes(v) " +
        "? 'background:#4B6049;color:#fff' : 'background:#fff;color:#4B6049') }; }),\n";

      const anchor = "      toggleHeart: () => setF('heart', !FS.heart),";
      if (!html.includes(anchor)) return html;

      // One line, always. Seven steps at the old size needed 1043px and the
      // card is 1140px wide, so it fit on a desktop and broke in two on
      // anything narrower. Tightened they need about 965px, which holds down
      // to a 1050px window; below that the row scrolls sideways rather than
      // wrapping, because a lesson has an order and reading it as 5 + 2 loses
      // that. flex:0 0 auto on both the caption and the chips stops nowrap
      // from squeezing them instead.
      const row =
        '      <div style="display:flex;flex-wrap:nowrap;overflow-x:auto;gap:5px;' +
        'align-items:center;width:100%">\n' +
        '        <span style="font-family:Outfit,sans-serif;font-size:12px;font-weight:800;' +
        'letter-spacing:.1em;color:#4B6049;white-space:nowrap;flex:0 0 auto">LESSON STEP</span>\n' +
        '        <sc-for list="{{ stepChips }}" as="h" hint-placeholder-count="7">' +
        '<button type="button" onClick="{{ h.pick }}" style="{{ h.style }}">{{ h.label }}</button></sc-for>\n' +
        "      </div>\n";
      const rowAnchor = '      <sc-if value="{{ hasFiltered }}"';
      if (!html.includes(rowAnchor)) return html;

      return html
        .replace(line, "")
        .replace(
          /\s*<button\b[^>]*onClick="\{\{ toggleHeart \}\}"[^>]*>[^<]*<\/button>/,
          ""
        )
        .replace(anchor, chips + anchor)
        .replace(rowAnchor, row + rowAnchor);
    },
  },
  {
    // Printing belongs beside the thing being printed. All of these sat in a
    // row of twelve buttons at the top, far from the pages they produce, and
    // a dozen ways to print one lesson is eleven more decisions than the job
    // needs. Everything named here either moves to the workbook bar below or,
    // in the 5-lesson check's case, goes for good.
    name: "empty the print buttons out of the top row",
    apply: (html) =>
      html
        .replace(
          /\s*<button\b[^>]*onClick="\{\{ (?:printLesson|printWorkbook|printKey|printAll|printSpl2|printSpl3|printCheck|toggleGames|printGames|printGamesKey) \}\}"[^>]*>[^<]*<\/button>/g,
          ""
        )
        .replace(/\s*<a\b[^>]*href="Syllable%20Types%20Poster\.dc\.html"[^>]*>[^<]*<\/a>/g, ""),
  },
  {
    // Printing was one-piece-at-a-time: state.print held a single key and
    // every section asked `part === 'wb'`. A teacher printing a workbook, two
    // spelling lists and the games had to go to the printer four times.
    //
    // The key becomes a comma-joined set and every comparison becomes
    // membership, which is the same question asked of a list. Nothing else
    // changes: show('lesson') still answers the way it did.
    //
    // The chips above the Print button are lit by default, because the common
    // case is wanting the lot — a teacher switches one off, rather than
    // building the pile up from nothing.
    name: "let one print run cover several pieces",
    apply: (html) => {
      let out = html;
      const steps: [string, string][] = [
        [
          "const show = (k) => !part || part === 'all' || part === k;",
          "const PICKED = String(part).split(',').filter(Boolean);\n" +
            "    const POFF = (this.state && this.state.poff) || [];\n" +
            "    const has = (k) => part === 'all' || PICKED.includes(k);\n" +
            "    const show = (k) => !part || has(k);",
        ],
        [
          "const box = (k) => ({ display: part === k ? 'flex' : 'none'",
          "const box = (k) => ({ display: has(k) ? 'flex' : 'none'",
        ],
        [
          "if (part === 'games' || part === 'all' || (!part && open)) modes.push(false); " +
            "if (part === 'gkey' || part === 'all' || (!part && open)) modes.push(true);",
          "if (has('games') || (!part && open)) modes.push(false); " +
            "if (has('gkey') || (!part && open)) modes.push(true);",
        ],
        [
          "['g2', 'g3'].filter((g) => part === 'all' || part === 'spl' + g.slice(1))",
          "['g2', 'g3'].filter((g) => has('spl' + g.slice(1)))",
        ],
      ];
      for (const [from, to] of steps) {
        if (!out.includes(from)) return html;
        out = out.replace(from, to);
      }

      const anchor =
        "      printWorkbook: doPrint('wb'), printKey: doPrint('key'), printAll: doPrint('all'),";
      if (!out.includes(anchor)) return html;
      const chips =
        "      ...(() => {\n" +
        "        const PCH = [['wb', '\u{1F4DD} Workbook'], ['key', '\u2705 Answer key'], " +
        "['spl2', '\u270F\uFE0F Spelling \u00b7 2nd'], " +
        "['spl3', '\u{1F58A}\uFE0F Spelling \u00b7 3rd'], ['games', '\u{1F3B2} Word games']];\n" +
        "        const off = POFF;\n" +
        "        const picked = PCH.map(([k]) => k).filter((k) => !off.includes(k));\n" +
        "        return { printChips: PCH.map(([k, t]) => ({ label: t,\n" +
        "          pick: () => this.setState({ poff: off.includes(k) " +
        "? off.filter((x) => x !== k) : off.concat(k) }),\n" +
        "          style: 'font-family:Poppins,sans-serif;font-size:12px;font-weight:700;" +
        "cursor:pointer;border-radius:999px;padding:4px 9px;white-space:nowrap;flex:0 0 auto;" +
        "border:1.5px solid #4B6049;' + (off.includes(k) " +
        "? 'background:#fff;color:#4B6049' : 'background:#4B6049;color:#fff') })),\n" +
        "          printPicked: picked.length ? doPrint(picked.join(',')) : () => {} }; })(),\n";
      return out.replace(anchor, anchor + "\n" + chips);
    },
  },
  {
    // Where they land: the workbook bar, which already names the workbook.
    // Two rows — what to look at on screen, then what to send to the printer.
    //
    // The print row is the same shape as the lesson steps above it: every
    // piece lit, click to drop one, one button to print what is left. That
    // replaces six separate print buttons, and the old Print all, which the
    // chips say better by simply being on.
    //
    // The answer key is one of those chips and starts lit, so one run
    // prints the workbook and its key together — which is how a teacher
    // uses them. Clicking it off prints the children's copies alone.
    name: "put the print chooser on the workbook bar",
    apply: (html) => {
      const toggle =
        /<button type="button" onClick="\{\{ toggleWb \}\}"([^>]*)>\{\{ wbBtn \}\}<\/button>/;
      if (!toggle.test(html)) return html;
      const bare =
        "font-family:Outfit,sans-serif;font-size:14px;font-weight:700;border:1.5px solid #4B6049;" +
        "background:#fff;color:#4B6049;padding:8px 14px;border-radius:8px;cursor:pointer;" +
        "white-space:nowrap";
      return html.replace(
        toggle,
        '<div style="display:flex;flex-direction:column;gap:9px;width:100%">' +
          '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">' +
          '<button type="button" onClick="{{ toggleWb }}"$1>{{ wbBtn }}</button>' +
          '<button type="button" onClick="{{ toggleGames }}" style="' + bare + '">' +
          "{{ gamesBtn }}</button>" +
          "</div>" +
          '<div style="display:flex;flex-wrap:nowrap;overflow-x:auto;gap:5px;' +
          'align-items:center;width:100%">' +
          '<span style="font-family:Outfit,sans-serif;font-size:12px;font-weight:800;' +
          'letter-spacing:.1em;color:#4B6049;white-space:nowrap;flex:0 0 auto">PRINT</span>' +
          '<sc-for list="{{ printChips }}" as="pc" hint-placeholder-count="4">' +
          '<button type="button" onClick="{{ pc.pick }}" style="{{ pc.style }}">' +
          "{{ pc.label }}</button></sc-for>" +
          '<button type="button" onClick="{{ printPicked }}" style="' +
          "font-family:Outfit,sans-serif;font-size:14px;font-weight:700;border:0;" +
          "background:#4B6049;color:#fff;padding:8px 14px;border-radius:8px;cursor:pointer;" +
          'white-space:nowrap;flex:0 0 auto;margin-left:4px">\u{1F5A8} Print</button>' +
          "</div></div>"
      );
    },
  },
  {
    // The spelling tests were a <dc-import name="Spelling Test"> that the
    // export never shipped: the page fetches ./Spelling Test.dc.html, gets a
    // 404, and both buttons have always printed a blank sheet. The two sheets
    // are rebuilt here from the 2nd- and 3rd-grade PDFs.
    //
    // They differ, which is why one component could not have served both. 2nd
    // grade is one sheet with a spelling, language and handwriting score, a
    // marking legend, and ruled lines for the dictation sentence. 3rd grade is
    // two half-sheets on one page — cut down the middle — scored out of ten
    // and as a percentage, with no dictation and a self-check instead.
    //
    // They also now appear in the preview, not only at the printer: a sheet
    // shows whenever its chip is lit and the workbook is open, so a teacher
    // can see what they are about to print.
    name: "rebuild the 2nd and 3rd grade spelling tests",
    apply: (html) => {
      const old =
        "splTests: ['g2', 'g3'].filter((g) => has('spl' + g.slice(1))).map((g) => ({ on: true, g, words: real.slice(0, 10),";
      if (!html.includes(old)) return html;
      const head = html.indexOf("<head>");
      if (head === -1) return html;
      // The 2nd grade sheet prints landscape: ten writing slots and three
      // dictation lines need the width more than the height. A named page
      // carries the orientation, and the print fit leaves these alone rather
      // than squeezing them back to a portrait column.
      html =
        html.slice(0, head + 6) +
        "\n<style>@page land { size: letter landscape; margin: .45in }" +
        " .dc-land { page: land }</style>\n" +
        html.slice(head + 6);
      const fit1 = "document.querySelectorAll('[data-wb]')].filter((e) =>";
      const fit2 = "document.querySelectorAll('[data-wb]').forEach((e) => { e.style.zoom = ''";
      if (!html.includes(fit1) || !html.includes(fit2)) return html;
      html = html
        .replace(fit1, "document.querySelectorAll('[data-wb]:not([data-land])')].filter((e) =>")
        .replace(fit2, "document.querySelectorAll('[data-wb]:not([data-land])').forEach((e) => { e.style.zoom = ''");
      const out = html.replace(
        old,
        "splTests: ['g2', 'g3'].filter((g) => has('spl' + g.slice(1))\n" +
          "        || (!part && (this.state && this.state.wbOpen) && !POFF.includes('spl' + g.slice(1))))\n" +
          "        .map((g) => ({ on: true, g, isG2: g === 'g2', isG3: g === 'g3',\n" +
          "          grade: g === 'g2' ? '2nd' : '3rd', slots: real.slice(0, 10).map((w, i) => ({ n: i + 1 })),\n" +
          "          // The sheet reads 1-5 down the left and 6-10 down the right, so the\n" +
          "          // grid is fed in the order the eye takes them, not 1 2 / 3 4.\n" +
          "          slotsCol: [0, 5, 1, 6, 2, 7, 3, 8, 4, 9].map((i) => ({ n: i + 1 })),\n" +
          "          script: real.slice(0, 10).map((w, i) => ({ n: i + 1, w,\n" +
          "            say: w + ' · ' + (((dict || []).find((d) => new RegExp('\\\\b' + w + '\\\\b', 'i').test(d))\n" +
          "              || ('Use “' + w + '” in a sentence.')) + ' · ' + w) })),\n" +
          "          box: { display: 'flex', flexDirection: 'column', background: '#fff',\n" +
          "            border: '1.5px solid #C9D3C4', borderRadius: 14, padding: '26px 30px',\n" +
          "            breakBefore: 'page', pageBreakBefore: 'always', minHeight: '9.6in',\n" +
          "            boxSizing: 'border-box', maxWidth: '7.7in', width: '100%', alignSelf: 'center' },\n" +
          "          landBox: { display: 'flex', flexDirection: 'column', background: '#fff',\n" +
          "            border: '1.5px solid #C9D3C4', borderRadius: 14, padding: '24px 30px',\n" +
          "            breakBefore: 'page', pageBreakBefore: 'always', minHeight: '7.1in',\n" +
          "            boxSizing: 'border-box', maxWidth: '10in', width: '100%', alignSelf: 'center' },\n" +
          "          patUpper: String(label).toUpperCase(),\n" +
          "          words: real.slice(0, 10),"
      );

      const tag =
        /<dc-import name="Spelling Test"[^>]*><\/dc-import>/;
      if (!tag.test(out)) return html;

      // A primary writing slot: a dashed midline over a solid baseline.
      const SLOT =
        '<div style="flex:1;min-width:0;height:32px;border-bottom:1.5px solid #111;' +
        'display:flex;align-items:center"><div style="width:100%;border-top:1px dashed #9ca3af">' +
        "</div></div>";
      const NUM = (sz: string) =>
        '<span style="flex:none;width:28px;font-size:' + sz + ';font-weight:800;color:#111">{{ s.n }}.</span>';
      const ROW = '<div style="display:flex;align-items:flex-end;gap:8px">';
      const SCORE =
        '<span style="border:1.5px solid #111;border-radius:7px;padding:3px 9px;' +
        'font-size:13px;font-weight:700;white-space:nowrap">';

      // The teacher script, identical for both grades but for its kicker.
      const teacher =
        '      <div data-wb="true" style="{{ t.box }}">\n' +
        '        <div style="border-bottom:2.5px solid #111;padding-bottom:6px">\n' +
        '          <div style="font-family:Outfit,sans-serif;font-size:11px;font-weight:800;' +
        'letter-spacing:.22em;color:#111">{{ t.grade }} GRADE · {{ t.patUpper }}</div>\n' +
        '          <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:12px">' +
        '<div style="font-size:23px;font-weight:800;color:#111">Spelling Test · Teacher Script + Key</div>' +
        '<div style="font-size:13px;font-weight:700">Pattern: {{ t.pattern }}</div></div>\n' +
        "        </div>\n" +
        '        <div style="font-size:12.5px;font-weight:600;color:#44403c;margin:7px 0 4px">' +
        "Say the word, read the sentence, say the word again. 1 point per word. % = score × 10.</div>\n" +
        '        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px 26px">\n' +
        '          <sc-for list="{{ t.script }}" as="s" hint-placeholder-count="10">\n' +
        '            <div style="border-bottom:1px solid #d6d3d1;padding:9px 0;display:flex;' +
        'align-items:baseline;gap:10px">' +
        '<span style="flex:none;width:26px;font-size:12px;font-weight:800">{{ s.n }}.</span>' +
        '<span style="flex:none;min-width:86px;font-size:20px;font-weight:800">{{ s.w }}</span>' +
        '<span style="flex:1;min-width:0;font-size:11.5px;font-weight:600;color:#44403c;' +
        'overflow-wrap:anywhere">{{ s.say }}</span></div>\n' +
        "          </sc-for>\n" +
        "        </div>\n" +
        '        <sc-if value="{{ t.isG2 }}" hint-placeholder-val="{{ true }}">\n' +
        '          <div style="border:2px solid #111;border-radius:12px;padding:9px 14px;margin-top:10px;' +
        'font-size:12.5px;line-height:1.5"><b>Dictation sentence (say 2 times):</b> {{ t.sent }}<br>' +
        "Language: 1 capital · 1 end mark · 1 spacing between words = 3 points.</div>\n" +
        "        </sc-if>\n" +
        "      </div>\n";

      // 2nd grade: one sheet, three scores, a marking legend, dictation lines.
      const g2 =
        '      <sc-if value="{{ t.isG2 }}" hint-placeholder-val="{{ true }}">\n' +
        '      <div data-wb="true" data-land="true" class="dc-land" style="{{ t.landBox }}">\n' +
        '        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px">\n' +
        '          <div style="display:flex;align-items:flex-end;gap:14px;flex:1;font-size:21px">' +
        '<span style="white-space:nowrap">Name:</span>' +
        '<span style="flex:1;border-bottom:1.5px solid #111;height:27px"></span>' +
        '<span style="white-space:nowrap">Date:</span>' +
        '<span style="flex:.6;border-bottom:1.5px solid #111;height:27px"></span></div>\n' +
        '          <div style="border:1.5px solid #111;border-radius:7px;padding:6px 11px;font-size:12.5px;' +
        'line-height:1.75;white-space:nowrap">Spelling: _____ /10<br>Language: _____ /3<br>' +
        "Handwriting: _____ /1</div>\n" +
        "        </div>\n" +
        '        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:26px 46px;margin-top:20px;flex:1;align-content:space-between">\n' +
        '          <sc-for list="{{ t.slotsCol }}" as="s" hint-placeholder-count="10">\n' +
        "            " + ROW + NUM("22px") + SLOT.replace("height:32px", "height:52px") + "</div>\n" +
        "          </sc-for>\n" +
        "        </div>\n" +
        '        <div style="display:flex;gap:26px;align-items:flex-start;margin-top:18px">\n' +
        '          <div style="flex:none;width:33%;border:1.5px solid #111;border-radius:7px;padding:8px 11px;' +
        'font-size:10.5px;line-height:1.45"><b>Language grade</b> 3 points per sentence:<br>' +
        "Circle = missed point<br>1 capital letter<br>1 punctuation<br>1 spacing between words<br>" +
        "<b>SPELLING GRADE</b><br>Check mark = graded word spelled correctly<br>" +
        "UNDERLINE = graded word spelled incorrectly</div>\n" +
        '          <div style="flex:1;min-width:0;display:flex;align-items:flex-start;gap:8px">' +
        '<span style="flex:none;width:28px;font-size:20px;font-weight:800">1.</span>' +
        '<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:22px">' +
        SLOT.replace("flex:1;min-width:0;", "").replace("height:32px", "height:50px") +
        SLOT.replace("flex:1;min-width:0;", "").replace("height:32px", "height:50px") +
        SLOT.replace("flex:1;min-width:0;", "").replace("height:32px", "height:50px") +
        "</div></div>\n" +
        "        </div>\n" +
        "      </div></sc-if>\n";

      // 3rd grade: two half-sheets on one page, cut down the middle.
      const half =
        '<div style="flex:1;min-width:0;display:flex;flex-direction:column">' +
        '<div style="display:flex;align-items:flex-end;gap:8px;font-size:13px">' +
        "<span>Name:</span>" +
        '<span style="flex:1;border-bottom:1.2px solid #111;height:18px"></span>' +
        "<span>Date:</span>" +
        '<span style="flex:.55;border-bottom:1.2px solid #111;height:18px"></span></div>' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-end;gap:8px;margin-top:5px">' +
        '<div><div style="font-size:26px;font-weight:800;line-height:1.05">Spelling</div>' +
        '<div style="font-size:11.5px;font-weight:700">Pattern: {{ t.pattern }}</div></div>' +
        '<div style="display:flex;gap:7px">' + SCORE + "___ /10</span>" + SCORE + "___ %</span></div></div>" +
        '<div style="flex:1;display:flex;flex-direction:column;gap:20px;margin-top:18px;justify-content:space-between">' +
        '<sc-for list="{{ t.slots }}" as="s" hint-placeholder-count="10">' +
        ROW + NUM("16px").replace("width:28px", "width:24px") + SLOT.replace("height:32px", "height:54px") +
        "</div></sc-for></div>" +
        '<div style="display:flex;gap:16px;font-size:11.5px;font-weight:700;margin-top:9px">' +
        "<span>☐ I checked my spelling.</span><span>☐ I wrote neatly.</span></div></div>";

      const g3 =
        '      <sc-if value="{{ t.isG3 }}" hint-placeholder-val="{{ false }}">\n' +
        '      <div data-wb="true" style="{{ t.box }}">\n' +
        '        <div style="display:flex;gap:26px;align-items:stretch">' + half +
        '<div style="flex:none;width:0;border-left:1.5px dashed #9ca3af"></div>' + half + "</div>\n" +
        "      </div></sc-if>\n";

      return out.replace(tag, "\n" + g2 + g3 + teacher + "    ");
    },
  },
  {
    // The blurb told teachers to use two buttons that no longer exist. The
    // ones that replaced them sit directly beneath it, so it needs no
    // instruction at all.
    name: "drop the stale print instruction from the workbook blurb",
    apply: (html) => html.replace(" Use Print workbook or Print key to print.", ""),
  },
  {
    // The step filter read one key and mapped it to lesson numbers through a
    // chain of ternaries, which cannot answer "blending and spelling". A
    // lookup over the comma-joined keys can, and says the same thing far more
    // plainly. Heart words still win outright, as before.
    name: "let the preview follow several lesson steps",
    apply: (html) => {
      const line = /const stepsF = FS\.heart \? steps\.filter\(\(s\) => s\.n === 8\) : FS\.step \?[\s\S]*?: steps;/;
      if (!line.test(html)) return html;
      return html.replace(
        line,
        "const STEP_LINES = { pa: [1], drill: [2, 3], blend: [4], read: [5, 6, 7], " +
          "heart: [8], spell: [9, 10], dec: [11, 12], write: [13] };\n" +
          "    const wantLines = String(FS.step || '').split(',').filter(Boolean)" +
          ".flatMap((k) => STEP_LINES[k] || []);\n" +
          "    const stepsF = wantLines.length " +
          "? steps.filter((s) => wantLines.includes(s.n)) : steps;"
      );
    },
  },
  {
    name: "count the chosen steps in the filter note",
    apply: (html) =>
      html.replace(
        "FS.step ? 'Showing one lesson step' : ''",
        "FS.step ? (() => { const n = String(FS.step).split(',').filter(Boolean).length; " +
          "return 'Showing ' + n + ' lesson step' + (n === 1 ? '' : 's'); })() : ''"
      ),
  },
  {
    // Page two sets a 10in minimum, so the height left over after three
    // short sentences has to be given a job or it opens as a hole.
    //
    // The three lines sit close together under the heading, and everything
    // below the last one becomes a space to write or draw about what they
    // read. Keeping the reading tight buys the drawing most of the page,
    // which is the half a child spends longest on.
    name: "pack the partner read and open a space to write or draw",
    apply: (html) => {
      const from =
        '<sc-for list="{{ wbSent }}" as="s" hint-placeholder-count="3">\n' +
        '          <div style="font-size:21px;font-weight:600;line-height:1.5">' +
        "\u2610 {{ s }}</div>\n        </sc-for>";
      if (!html.includes(from)) return html;
      return html.replace(
        from,
        '<div style="display:flex;flex-direction:column;gap:18px">\n          ' +
          from +
          "\n        </div>\n" +
          '        <div style="flex:1;min-height:110px;border:1.5px dashed #9BAE97;' +
          "border-radius:10px;padding:8px 12px;margin-top:6px;display:flex;" +
          'flex-direction:column">\n' +
          '          <div style="font-size:12px;font-weight:700;color:#57534e">' +
          "\u270F\uFE0F Draw or write about one of the sentences.</div>\n" +
          "        </div>"
      );
    },
  },
  {
    // The three sentences are read aloud, one at a time, and the space
    // between them is what stops a child's eye sliding to the next line.
    // Page two is a fixed ten inches, so that space can only come out of the
    // two blocks either side of it: the heart words tighten, and voice fun
    // loses the padding it was carrying rather than any of its choices.
    //
    // A little of it goes back as a pad under the last sentence, which was
    // otherwise touching the voice fun heading.
    name: "buy the partner read more space between its lines",
    apply: (html) => {
      const edits: [string, string][] = [
        // Heart words: same word, same line, less air around them.
        [
          '<div style="border:1.5px solid #C0504D;border-radius:10px;padding:12px 14px;' +
            'display:flex;flex-direction:column;gap:12px">\n' +
            '              <div style="font-size:26px;font-weight:800">♥ {{ h }}</div>\n' +
            '              <div style="border-bottom:1.5px solid #333;height:36px"></div>',
          '<div style="border:1.5px solid #C0504D;border-radius:10px;padding:8px 12px;' +
            'display:flex;flex-direction:column;gap:7px">\n' +
            '              <div style="font-size:23px;font-weight:800">♥ {{ h }}</div>\n' +
            '              <div style="border-bottom:1.5px solid #333;height:30px"></div>',
        ],
        // Voice fun: eight chips and three boxes, tighter.
        [
          '<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px">\n' +
            '          <sc-for list="{{ voices }}"',
          '<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px">\n' +
            '          <sc-for list="{{ voices }}"',
        ],
        [
          '<div style="border:2px solid #111;border-radius:10px;padding:9px 6px;' +
            'text-align:center;font-size:18px;font-weight:700;color:#111">{{ v }}</div>',
          '<div style="border:2px solid #111;border-radius:10px;padding:5px 6px;' +
            'text-align:center;font-size:16px;font-weight:700;color:#111">{{ v }}</div>',
        ],
        [
          '<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;' +
            'font-size:16px;font-weight:700;color:#111">',
          '<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;' +
            'font-size:14.5px;font-weight:700;color:#111">',
        ],
        [
          '<div style="border:2px solid #111;border-radius:10px;padding:9px 10px">Read 1',
          '<div style="border:2px solid #111;border-radius:10px;padding:6px 10px">Read 1',
        ],
        [
          '<div style="border:2px solid #111;border-radius:10px;padding:9px 10px">Read 2',
          '<div style="border:2px solid #111;border-radius:10px;padding:6px 10px">Read 2',
        ],
        [
          '<div style="border:2px solid #111;border-radius:10px;padding:9px 10px">Read 3',
          '<div style="border:2px solid #111;border-radius:10px;padding:6px 10px">Read 3',
        ],

      ];
      let out = html;
      for (const [from, to] of edits) {
        if (!out.includes(from)) return html;
        out = out.replace(from, to);
      }
      return out;
    },
  },
  {
    // Build the Sentence held three rows and finished half way down the page.
    // It drew on the dictation sentences plus one line lifted from the second
    // paragraph of the decodable; the rest of the story sat there unused.
    // Five rows, drawn from the whole story, fill the sheet.
    //
    // The thirteen skills with no decodable fall back to the writing
    // passage, which every skill has, rather than printing a half page.
    //
    // Capped at ten words: past that the word cards wrap to a third line
    // and the row stops looking like a sentence to cut up. The fallback
    // gets twelve, because prose written to be read is longer than a
    // decodable line and the cap would otherwise leave the page short.
    name: "give Build the Sentence five sentences",
    apply: (html) => {
      const from =
        "const extra = ((p.dec.paras || [])[1] || '').match(/[^.!?]+[.!?]/); " +
        "const sents = dict.concat(extra ? [extra[0].trim()] : [])" +
        ".filter((x) => x.split(' ').length >= 4).slice(0, 3);";
      if (!html.includes(from)) return html;
      const out = html.replace(
        from,
        "const fromDec = ((p.dec.paras || []).join(' ').match(/[^.!?]+[.!?]/g) || [])" +
          ".map((x) => x.trim());\n" +
          "        const fromEb = (String(ebText || '').replace(/\\n/g, ' ')" +
          ".match(/[^.!?]+[.!?]/g) || []).map((x) => x.trim());\n" +
          "        const fit = (x, max) => { const n = x.split(' ').length; " +
          "return n >= 4 && n <= max; };\n" +
          "        const sents = [...new Set(dict.concat(fromDec).filter((x) => fit(x, 10))" +
          ".concat(fromEb.filter((x) => fit(x, 12))))].slice(0, 5);"
      );

      const forEach = '<sc-for list="{{ p.sbRows }}" as="r" hint-placeholder-count="3">';
      if (!out.includes(forEach)) return html;
      return out.replace(
        forEach,
        '<sc-for list="{{ p.sbRows }}" as="r" hint-placeholder-count="5">'
      );
    },
  },
  {
    // Lesson step 13 is the writing step, and it is the one step a teacher
    // cannot be in two places for: every child wants a reader for their
    // sentence at the same moment. This hands them a prompt to paste into a
    // student-safe AI space, built to the four-part shape in the SchoolAI
    // prompting guide — role, task, instructions, requirements.
    //
    // The prompt carries this skill's own passage and question, so the coach
    // is talking about the text in front of the child rather than writing in
    // general. Its whole job is to ask and respond: it is told, more than
    // once and in the requirements as well as the instructions, never to
    // produce a sentence the child could hand in.
    //
    // It is a copy button rather than a link. There is no account here, no
    // way to know which platform a school has bought, and nothing a child
    // types in that space should come back through this page.
    name: "give the writing step an AI coach prompt to paste",
    apply: (html) => {
      const tpl = AICOACH.lines.join("\n");

      // 1. Build the prompt beside the writing frames it describes.
      const frames = "    const ebFrames = ['\u{1F4E3} My Answer: I think ______.'";
      if (!html.includes(frames)) return html;
      let out = html.replace(
        frames,
        "    const AI_TPL = " + JSON.stringify(tpl) + ";\n" +
          "    const aiGrades = ((OGL.find((l) => 'Level ' + l.level === level) || {}).grades)" +
          " || '1st-3rd';\n" +
          "    const aiPrompt = AI_TPL.replace(/\\{GRADES\\}/g, aiGrades)" +
          ".replace(/\\{SKILL\\}/g, label)" +
          ".replace('{TITLE}', (PGX && PGX.title) ||" +
          " ((OGD[id] && OGD[id].p.dec && OGD[id].p.dec.title) || label))" +
          ".replace('{PASSAGE}', String(ebText || '').trim())" +
          ".replace('{QUESTION}', ebPrompt)" +
          ".replace('{WRITING}', (wrTask ? wrPick + ' \u2014 ' + wrTask" +
          " : 'Write a few sentences about what you read.'));\n" +
          frames
      );

      // 2. Hang it off step 13 with its copy and reveal controls.
      const step13 = "{ hasPassage: !!ebText, passage: ebText, question: ebPrompt }),";
      if (!out.includes(step13)) return html;
      out = out.replace(
        step13,
        "{ hasPassage: !!ebText, passage: ebText, question: ebPrompt,\n" +
          "          hasAi: !!ebText, aiPrompt,\n" +
          "          aiOpen: !!(this.state && this.state.aiOpen),\n" +
          "          aiBtn: (this.state && this.state.aiOpen) ? 'Hide prompt \u25B2'" +
          " : 'Show prompt \u25BC',\n" +
          "          toggleAi: () => this.setState({ aiOpen: !(this.state && this.state.aiOpen) }),\n" +
          "          copyAiLabel: (this.state && this.state.aiCopied) ? '\u2713 Copied'" +
          " : '\u{1F4CB} Copy prompt',\n" +
          "          copyAi: () => { const ok = () => this.setState({ aiCopied: true });\n" +
          "            const no = () => this.setState({ aiOpen: true });\n" +
          "            try { const r = navigator.clipboard.writeText(aiPrompt);\n" +
          "              if (r && r.then) r.then(ok, no); else ok(); } catch (e) { no(); } } }),"
      );

      // 3. The block itself, under the passage it coaches.
      const afterPassage =
        '                <div style="font-size:14px;font-weight:800;color:#2F3E2E">' +
        "\u2753 {{ s.question }}</div>\n              </div>\n            </sc-if>";
      if (!out.includes(afterPassage)) return html;
      const btn =
        "font-family:Outfit,sans-serif;font-size:12.5px;font-weight:700;" +
        "border:1.5px solid #2F7A8C;background:#fff;color:#2F7A8C;padding:6px 12px;" +
        "border-radius:8px;cursor:pointer;white-space:nowrap";
      return out.replace(
        afterPassage,
        afterPassage +
          '\n            <sc-if value="{{ s.hasAi }}" hint-placeholder-val="{{ false }}">\n' +
          '              <div data-noprint="true" style="border:1.5px solid #2F7A8C;' +
          "border-radius:10px;padding:10px 12px;background:#F3F8F9;display:flex;" +
          'flex-direction:column;gap:7px">\n' +
          '                <div style="font-family:Outfit,sans-serif;font-size:11px;' +
          'font-weight:700;letter-spacing:.14em;color:#2F7A8C">\u{1F916} AI WRITING COACH</div>\n' +
          '                <div style="font-size:12.5px;line-height:1.45;color:#44403c">' +
          "Paste into a student-safe AI space. It coaches the five parts and gives feedback " +
          "on what the child writes \u2014 it never writes the answer.</div>\n" +
          '                <div style="display:flex;gap:7px;flex-wrap:wrap">' +
          '<button type="button" onClick="{{ s.copyAi }}" style="' + btn + '">' +
          "{{ s.copyAiLabel }}</button>" +
          '<button type="button" onClick="{{ s.toggleAi }}" style="' + btn + '">' +
          "{{ s.aiBtn }}</button></div>\n" +
          '                <sc-if value="{{ s.aiOpen }}" hint-placeholder-val="{{ false }}">' +
          '<div style="white-space:pre-wrap;font-family:ui-monospace,Menlo,monospace;' +
          "font-size:11.5px;line-height:1.5;color:#1c1917;background:#fff;" +
          "border:1px solid #C9D3C4;border-radius:8px;padding:9px 10px;max-height:320px;" +
          'overflow:auto">{{ s.aiPrompt }}</div></sc-if>\n' +
          "              </div>\n            </sc-if>"
      );
    },
  },
  {
    // Ten words a day, Monday to Friday.
    //
    // The packet already asks a child to read ten words once and tick them
    // off. Reading the same ten every day is what builds the fluency, and it
    // gives them something the rest of the workbook does not: a number on
    // Monday and a bigger one on Friday, in their own hand.
    //
    // The ten are the skill's own words — the same list the "Read each word"
    // page uses — so the week's practice and the week's lesson are the same
    // words, and it goes in front of everything else because it is the five
    // minutes a lesson opens with.
    name: "open the workbook with ten words a day",
    apply: (html) => {
      const anchor =
        '<sc-for list="{{ wbPages }}" as="p" hint-placeholder-count="2">\n' +
        '    <div data-wb="true" style="{{ p.box1 }}">';
      if (!html.includes(anchor)) return html;
      const page =
        "<div data-wb=\"true\" style=\"{{ p.box1 }}\">\n" +
        "      <div style=\"display:flex;justify-content:space-between;align-items:flex-end;gap:12px;border-bottom:3px solid #4B6049;padding-bottom:8px\">\n" +
        "        <div>\n" +
        "          <div style=\"font-family:Outfit,sans-serif;font-size:12px;font-weight:700;letter-spacing:.18em;color:#618459\">TEN WORDS A DAY</div>\n" +
        "          <div style=\"font-size:26px;font-weight:800;color:#2F3E2E;line-height:1.1\">{{ sk.label }}</div>\n" +
        "        </div>\n" +
        "        <div style=\"font-size:14px;font-weight:600;white-space:nowrap\">Name ____________  Week ______</div>\n" +
        "      </div>\n" +
        "      <div style=\"font-size:14px;line-height:1.45;background:#FDF6E7;border:1.5px solid #E4D3A8;border-radius:8px;padding:7px 12px\">Read all ten words out loud every day. Tick each one you read right the first time. Count your ticks and write the score at the bottom.</div>\n" +
        "      <div style=\"display:flex;flex-direction:column;gap:5px\">\n" +
        "        <div style=\"display:flex;gap:6px;align-items:center;font-family:Outfit,sans-serif;font-size:12px;font-weight:700;letter-spacing:.1em;color:#618459\">\n" +
        "          <span style=\"flex:0 0 38%\"></span>\n" +
        "          <span style=\"flex:1;text-align:center\">MON</span>\n" +
        "          <span style=\"flex:1;text-align:center\">TUE</span>\n" +
        "          <span style=\"flex:1;text-align:center\">WED</span>\n" +
        "          <span style=\"flex:1;text-align:center\">THU</span>\n" +
        "          <span style=\"flex:1;text-align:center\">FRI</span>\n" +
        "        </div>\n" +
        "        <sc-for list=\"{{ wbReal }}\" as=\"w\" hint-placeholder-count=\"10\">\n" +
        "          <div style=\"display:flex;gap:6px;align-items:center\">\n" +
        "            <span style=\"flex:0 0 38%;font-size:17px;font-weight:600;color:#111;white-space:nowrap\">{{ w }}</span>\n" +
        "            <span style=\"display:flex;align-items:center;justify-content:center;border:2px solid #111;border-radius:4px;height:26px;flex:1\"></span>\n" +
        "            <span style=\"display:flex;align-items:center;justify-content:center;border:2px solid #111;border-radius:4px;height:26px;flex:1\"></span>\n" +
        "            <span style=\"display:flex;align-items:center;justify-content:center;border:2px solid #111;border-radius:4px;height:26px;flex:1\"></span>\n" +
        "            <span style=\"display:flex;align-items:center;justify-content:center;border:2px solid #111;border-radius:4px;height:26px;flex:1\"></span>\n" +
        "            <span style=\"display:flex;align-items:center;justify-content:center;border:2px solid #111;border-radius:4px;height:26px;flex:1\"></span>\n" +
        "          </div>\n" +
        "        </sc-for>\n" +
        "        <div style=\"display:flex;gap:6px;align-items:center;border-top:2px solid #111;padding-top:6px\">\n" +
        "          <span style=\"flex:0 0 38%;font-size:15px;font-weight:800;color:#2F3E2E\">Score out of 10</span>\n" +
        "          <span style=\"display:flex;align-items:center;justify-content:center;border:2px solid #111;border-radius:4px;height:26px;flex:1;height:32px\"></span>\n" +
        "          <span style=\"display:flex;align-items:center;justify-content:center;border:2px solid #111;border-radius:4px;height:26px;flex:1;height:32px\"></span>\n" +
        "          <span style=\"display:flex;align-items:center;justify-content:center;border:2px solid #111;border-radius:4px;height:26px;flex:1;height:32px\"></span>\n" +
        "          <span style=\"display:flex;align-items:center;justify-content:center;border:2px solid #111;border-radius:4px;height:26px;flex:1;height:32px\"></span>\n" +
        "          <span style=\"display:flex;align-items:center;justify-content:center;border:2px solid #111;border-radius:4px;height:26px;flex:1;height:32px\"></span>\n" +
        "        </div>\n" +
        "      </div>\n" +
        "      <div style=\"display:flex;flex-direction:column;gap:7px;border:2px dashed #111;border-radius:10px;padding:9px 12px;break-inside:avoid;page-break-inside:avoid\">\n" +
        "        <div style=\"font-size:15px;font-weight:800;color:#2F3E2E\">How did I grow this week?</div>\n" +
        "        <div style=\"font-size:15px\">Monday I read <span style=\"display:inline-block;width:48px;border-bottom:2px solid #111\"></span> of 10. Friday I read <span style=\"display:inline-block;width:48px;border-bottom:2px solid #111\"></span> of 10.</div>\n" +
        "        <div style=\"font-size:15px\">That is <span style=\"display:inline-block;width:48px;border-bottom:2px solid #111\"></span> more than on Monday.</div>\n" +
        "        <div style=\"font-size:14px;color:#57534E\">The word that got easiest: <span style=\"display:inline-block;width:150px;border-bottom:2px solid #111\"></span></div>\n" +
        "        <div style=\"font-size:14px;color:#57534E\">The word I still want to practise: <span style=\"display:inline-block;width:150px;border-bottom:2px solid #111\"></span></div>\n" +
        "      </div>\n" +
        "    </div>\n" +
        "    ";
      return html.replace(
        anchor,
        '<sc-for list="{{ wbPages }}" as="p" hint-placeholder-count="2">\n    ' +
          page +
          '<div data-wb="true" style="{{ p.box1 }}">'
      );
    },
  },
  {
    // One arrow revealed the student pages and the answer key together, which
    // is the wrong shape for the job: a teacher prints the workbook for the
    // class and opens the key on their own screen. Two bars, each with its
    // own arrow and its own print button, keep those apart.
    //
    // The page markup is shared rather than rewritten — the same block is
    // rendered twice over two filtered lists, so the key keeps looking
    // exactly like the workbook it answers.
    name: "give the answer key its own section",
    apply: (html) => {
      let out = html;

      // One list becomes two, filtered on the kicker the pages already carry.
      const pages = /wbPages: ([\s\S]*?), wbReal: real,/;
      if (!pages.test(out)) return html;
      out = out.replace(
        pages,
        (_m, expr) =>
          "...(() => { const wbp = " + expr + "; " +
          "const isK = (p) => String(p.kicker || '').startsWith('ANSWER'); " +
          "return { wbPages: wbp, wbPagesStudent: wbp.filter((p) => !isK(p)), " +
          "wbPagesKey: wbp.filter(isK) }; })(), wbReal: real,"
      );

      // The student wrap stops answering for the key, and the key gets its
      // own open state. Printing everything still opens both.
      const wrap =
        "wbWrap: { display: (this.state && this.state.wbOpen) || part === 'wb' || part === 'key' || part === 'all' ? 'flex' : 'none', flexDirection: 'column', gap: 22 },";
      if (!out.includes(wrap)) return html;
      out = out.replace(
        wrap,
        "wbWrap: { display: (this.state && this.state.wbOpen) || has('wb') ? 'flex' : 'none', flexDirection: 'column', gap: 22 },\n" +
          "      keyWrap: { display: (this.state && this.state.keyOpen) || has('key') ? 'flex' : 'none', flexDirection: 'column', gap: 22 },\n" +
          "      keyBtn: (this.state && this.state.keyOpen) ? 'Hide answer key ▲' : 'Show answer key ▼',\n" +
          "      toggleKey: () => this.setState({ keyOpen: !(this.state && this.state.keyOpen) }),"
      );

      // Bar one is the workbook alone now: it loses the key's print button,
      // and the sentence about the key, which bar two says for itself.
      out = out.replace("\u{1F4D8} Student workbook + answer key", "\u{1F4D8} Student workbook");
      out = out.replace(" The key adds a quick check for the group.", "");
      // The key's own two buttons. They are built here rather than lifted
      // off the workbook bar, which no longer has any: the student side is a
      // chip row now, and the key is not one of its chips on purpose.
      const keyBtnStyle =
        "font-family:Outfit,sans-serif;font-size:14px;font-weight:700;" +
        "border:1.5px solid #4B6049;background:#fff;color:#4B6049;padding:8px 14px;" +
        "border-radius:8px;cursor:pointer;white-space:nowrap";
      const keyPrintHtml =
        '<button type="button" onClick="{{ printKey }}" style="' + keyBtnStyle +
        '">\u{1F5A8} Print answer key</button>';

      // Bar two, and a second copy of the page block beneath it.
      const open = '<div style="{{ wbWrap }}">';
      const at = out.indexOf(open);
      if (at === -1) return html;
      const tags = /<div\b|<\/div>/gi;
      tags.lastIndex = at;
      let depth = 0;
      let end = -1;
      for (let m = tags.exec(out); m; m = tags.exec(out)) {
        if (m[0][1] === "/") {
          if (--depth === 0) { end = m.index + m[0].length; break; }
        } else depth++;
      }
      if (end === -1) return html;

      const block = out.slice(at, end);
      if (!block.includes('<sc-for list="{{ wbPages }}"')) return html;

      const studentBlock = block.replace('list="{{ wbPages }}"', 'list="{{ wbPagesStudent }}"');
      const keyBlock = block
        .replace('style="{{ wbWrap }}"', 'style="{{ keyWrap }}"')
        .replace('list="{{ wbPages }}"', 'list="{{ wbPagesKey }}"');

      const keyBar =
        '\n  <div data-noprint="true" style="display:flex;align-items:center;' +
        'justify-content:space-between;gap:12px;flex-wrap:wrap;background:#fff;' +
        'border:1.5px solid #C9D3C4;border-radius:12px;padding:12px 16px">\n' +
        '    <div style="display:flex;flex-direction:column;gap:2px">' +
        '<b style="font-size:16px;color:#2F3E2E">\u{1F511} Answer key</b>' +
        '<span style="font-size:13px;color:#57534e">The same pages with the answers filled in, ' +
        'and a quick check for the group.</span></div>\n' +
        '    <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">' +
        '<button type="button" onClick="{{ toggleKey }}" style="font-family:Outfit,sans-serif;' +
        'font-size:14px;font-weight:700;border:1.5px solid #4B6049;background:#EEF3EC;' +
        'color:#4B6049;padding:8px 14px;border-radius:8px;cursor:pointer;white-space:nowrap">' +
        "{{ keyBtn }}</button>" + keyPrintHtml +
        '<button type="button" onClick="{{ printGamesKey }}" style="' + keyBtnStyle +
        '">\u{1F5A8} Games key</button>' +
        "</div>\n  </div>\n";

      return out.slice(0, at) + studentBlock + keyBar + keyBlock + out.slice(end);
    },
  },
  {
    // Make the multisyllabic switch mean the whole lesson.
    //
    // It swapped one list — the words a child reads — and left the rest of
    // the lesson in single syllables: the three differentiated lists, and
    // the review, all read from real0, the list as it was before the switch.
    // A teacher who turned it on got a multisyllabic word list sitting above
    // single-syllable everything else.
    //
    // On now means on everywhere the words come from a list. Heart words are
    // left alone, because an irregular high-frequency word is the word it is,
    // and the dictation sentences are left alone because there is no
    // multisyllabic sentence bank to draw on — those would be written, not
    // switched.
    name: "let the multisyllabic switch reach the whole lesson",
    apply: (html) => {
      const diff =
        "diff: (() => { const easy = real0.slice().sort((a, b) => a.length - b.length).slice(0, 6); " +
        "const hard = (MULTI[id] || []).slice(0, 6);";
      if (!html.includes(diff)) return html;
      let out = html.replace(
        diff,
        "diff: (() => { const pool = real; const byLen = pool.slice().sort((a, b) => a.length - b.length);\n" +
          "        // With the switch on the three lists stay a gradient: the " +
          "shortest multisyllabic words, then the list, then the longest.\n" +
          "        const easy = byLen.slice(0, 6);\n" +
          "        const hard = isMulti ? byLen.slice(-6).reverse() : (MULTI[id] || []).slice(0, 6);"
      );

      // The file carries the apostrophe as a literal \u2019 escape inside
      // its own script, so the anchor needs the backslash, not the character.
      const onLevel = "'Today\\u2019s word list.', real0.slice(0, 8),";
      if (!out.includes(onLevel)) return html;
      out = out.replace(onLevel, "'Today\\u2019s word list.', pool.slice(0, 8),");

      const rev = "wbReview: review.flatMap((r) => r[6].slice(0, Math.ceil(10 / review.length))).slice(0, 10),";
      if (!out.includes(rev)) return html;
      out = out.replace(
        rev,
        "wbReview: review.flatMap((r) => (isMulti && (MULTI[r[0]] || []).length " +
          "? MULTI[r[0]] : r[6]).slice(0, Math.ceil(10 / review.length))).slice(0, 10),"
      );
      return out;
    },
  },
  {
    // A review switch of its own.
    //
    // The lesson's multisyllabic switch now carries the review with it, which
    // is right most of the time and wrong when a teacher wants the lesson in
    // longer words and the review in the words the class first met them in —
    // or the reverse, a single-syllable lesson with multisyllabic review to
    // stretch it. So review gets its own button, sitting with the review
    // dropdowns, and the lesson switch no longer reaches it.
    name: "give the review its own multisyllabic switch",
    apply: (html) => {
      const rev =
        "wbReview: review.flatMap((r) => (isMulti && (MULTI[r[0]] || []).length " +
        "? MULTI[r[0]] : r[6]).slice(0, Math.ceil(10 / review.length))).slice(0, 10),";
      if (!html.includes(rev)) return html;
      let out = html.replace(
        rev,
        "wbReview: review.flatMap((r) => (revMulti && (MULTI[r[0]] || []).length " +
          "? MULTI[r[0]] : r[6]).slice(0, Math.ceil(10 / review.length))).slice(0, 10),"
      );

      const flag = "const isMulti = !!(this.state && this.state.multi)";
      if (!out.includes(flag)) return html;
      out = out.replace(
        flag,
        flag + ";\n    const revMulti = !!(this.state && this.state.revmulti)"
      );

      // the button, next to the review dropdowns it governs
      const label =
        '<span style="font-family:Outfit,sans-serif;font-size:14px;font-weight:700;' +
        'color:#2F3E2E;white-space:nowrap">Review past concepts</span>';
      if (!out.includes(label)) return html;
      out = out.replace(
        label,
        label +
          '\n        <button type="button" onClick="{{ toggleRevMulti }}" ' +
          'style="{{ revMultiBtn }}">{{ revMultiLbl }}</button>'
      );
      const grid =
        'style="display:grid;grid-template-columns:auto repeat(3,minmax(0,1fr));align-items:center;' +
        'gap:8px;background:#F6F8F4;border:1.5px solid #C9D3C4;border-radius:10px;padding:8px 12px"';
      if (!out.includes(grid)) return html;
      out = out.replace(
        grid,
        'style="display:flex;flex-wrap:wrap;align-items:center;gap:8px;background:#F6F8F4;' +
          'border:1.5px solid #C9D3C4;border-radius:10px;padding:8px 12px"'
      );
      const picks = '<sc-for list="{{ reviewPicks }}" as="rp" hint-placeholder-count="3">';
      if (!out.includes(picks)) return html;
      out = out.replace(
        picks,
        picks.replace("<sc-for", '<sc-for style="flex:1 1 150px;min-width:0"')
      );

      // and the state it toggles
      const anchor = "toggleHeart: () => setF('heart', !FS.heart),";
      if (!out.includes(anchor)) return html;
      return out.replace(
        anchor,
        anchor +
          "\n      toggleRevMulti: () => this.setState({ revmulti: !revMulti }),\n" +
          "      revMultiLbl: revMulti ? '\u{1F9D7} Review: multisyllabic' " +
          ": '\u{1F9D7} Review: single syllable',\n" +
          "      revMultiBtn: 'font-family:Poppins,sans-serif;font-size:12.5px;font-weight:700;" +
          "cursor:pointer;border-radius:8px;padding:5px 10px;white-space:nowrap;" +
          "border:1.5px solid #618459;' + (revMulti " +
          "? 'background:#618459;color:#fff' : 'background:#fff;color:#618459'),"
      );
    },
  },
  {
    // More words, so a child does not meet the same ten everywhere.
    //
    // Each skill shipped with exactly ten real words, and every section that
    // shows words drew from those ten: the reading list, real-or-made-up,
    // the spelling test, the tracker, On level. There was nothing to rotate
    // to — the only fix was to write more, checked by
    // scripts/check-extra-words.mjs rather than by eye.
    //
    // The batch also carries two things that check turned up. Twenty-two of
    // the sixty made-up words were real English words, five common enough
    // that a child would know them — dry, stay, flow, plow, mink — each
    // printed "M" for made-up on the key; `fix` swaps those. And the
    // multisyllabic switch left the made-up words short while the real ones
    // grew, so `fake` carries multisyllabic non-words for when it is on.
    //
    // Everything hangs off the destructure rather than off isMulti, which is
    // declared further down: hooking the later line put the lists out of
    // scope and the page would not render at all.
    name: "widen the word and sentence banks",
    apply: (html) => {
      const decl =
        "const [id, label0, level, story0, rule, build, realAll, nonsenseAll, heart0, dictAll] = cur;";
      if (!html.includes(decl)) return html;
      const bank =
        "let [id, label0, level, story0, rule, build, realAll, nonsenseAll, heart0, dictAll] = cur;\n" +
        "    const EXTRAW = " + JSON.stringify(EXTRAW) + ";\n" +
        "    const exW = EXTRAW[id] || {};\n" +
        "    const multiOn = !!(this.state && this.state.multi);\n" +
        "    // A shipped word that is off its own skill's pattern is swapped\n" +
        "    // first: the open-syllable list printed hen and got.\n" +
        "    realAll = realAll.map((w) => (exW.realfix || {})[w] || w);\n" +
        "    // The ten a teacher already knows stay at the top of every list;\n" +
        "    // the new ones follow them.\n" +
        "    realAll = realAll.concat((exW.real || []).filter((w) => realAll.indexOf(w) === -1));\n" +
        "    nonsenseAll = multiOn && (exW.fake || []).length\n" +
        "      ? exW.fake.slice()\n" +
        "      : nonsenseAll.map((w) => (exW.fix || {})[w] || w);\n" +
        "    dictAll = dictAll.concat((exW.sent || []).filter((q) => dictAll.indexOf(q) === -1));";
      return html.replace(decl, bank);
    },
  },
  {
    // The Read It title on one line.
    //
    // The page header is one flex row: the title on the left, the name line
    // on the right, nowrap. "📖 Read It — Vowel suffixes · -y" wants 403px
    // and had 387px, so it wrapped to two lines and pushed the rule box and
    // everything under it down the page. It is not a near miss either: the
    // longest name on the list, Latin prefixes and suffixes · trans-, wants
    // 634px at this size.
    //
    // Two changes together, because neither is enough alone.
    //
    // The date comes off this page. Every other page in the packet carries
    // the name alone, and the packet opens on Ten Words A Day, which already
    // takes a name and a week — so this was the one page asking twice. That
    // is 83px back.
    //
    // Then the title takes the largest size that still fits the line it has.
    // The type measures 0.53em a character, checked against the shortest
    // name on the list and the longest. Of the 212 skills, 127 keep all
    // 26px and the four that shrink furthest sit at 18px, which is still
    // the biggest type on the page — the name line is 14px and the body 15px.
    //
    // Measured rather than guessed: every one of the 212 was rendered and
    // checked for a second line, for a row wider than the sheet, and for a
    // name line pushed past the margin.
    name: "keep the Read It title on one line",
    apply: (html) => {
      const anchor =
        "sk: { label, level, story, rule }, skillId: subPat ? id + '|' + subPat : id,";
      const title =
        '<div style="font-size:26px;font-weight:800;color:#2F3E2E;line-height:1.1">' +
        "\uD83D\uDCD6 Read It \u2014 {{ sk.label }}</div>";
      const dated = "Name ____________  Date ______";
      if (!html.includes(anchor) || !html.includes(title) || !html.includes(dated)) return html;
      // Both copies: the answer key is a clone of these pages, made earlier
      // in this list, so a plain replace would leave the key wrapping.
      let out = html.replace(
        anchor,
        anchor +
          "\n      rdH1: (() => {\n" +
          "        const t = '\\uD83D\\uDCD6 Read It \\u2014 ' + label;\n" +
          "        const px = Math.max(18, Math.min(26, Math.floor(470 / (0.53 * t.length))));\n" +
          "        return 'font-size:' + px + 'px;font-weight:800;color:#2F3E2E;" +
          "line-height:1.1;white-space:nowrap';\n" +
          "      })(),"
      );
      out = out
        .split(title)
        .join('<div style="{{ rdH1 }}">\uD83D\uDCD6 Read It \u2014 {{ sk.label }}</div>');
      return out.split(dated).join("Name ____________");
    },
  },
  {
    // The review pass picks what this lesson is built on.
    //
    // It used to take the two rows above this one in the list. The list is
    // in the OG scope and sequence, so that is never out of order, but it
    // is still only "whatever came before" — and that one pick drives three
    // things: the review words, the grapheme drill cards and the What says
    // questions. Y as a vowel reviewed -ck and -tch. What it is actually
    // built on is silent e and the open syllable.
    //
    // Three slots now, each with a different job, because two slots doing
    // the same job is one slot.
    //
    //   1. the prerequisite — declared per skill in reading-prerequisites.json
    //   2. the lesson taught immediately before this one
    //   3. the spiral, reaching back further the higher the level
    //
    // The spiral is the slot that scales. At Level 1 there is little behind
    // you, so it stays close. From Level 3 it reaches down a level or two,
    // to syllable division and vowel teams, because what breaks in a Level 4
    // word is almost never the Level 4 concept — it is a vowel team or a
    // split inside a long word.
    //
    // And a candidate whose own words mostly carry today's grapheme is
    // skipped. Review is there to contrast with the new pattern, not to
    // rehearse it by accident.
    //
    // A teacher's own picks in the three dropdowns still override all of it.
    name: "pick the review pass from what the lesson is built on",
    apply: (html) => {
      const anchor =
        "const review = picked.length ? picked : SK.slice(Math.max(0, skIdx - 2), skIdx);";
      if (!html.includes(anchor)) return html;
      const body = [
        "const PREQ = " + JSON.stringify(PREQ.prereq) + ";",
        "    const SPIRAL = " + JSON.stringify(PREQ.spiral) + ";",
        "    const taught = SK.slice(0, skIdx);",
        "    const myLv = parseInt(String(level).replace(/[^0-9]/g, ''), 10) || 1;",
        "    // Today's graphemes, so a review word cannot quietly rehearse",
        "    // the pattern this lesson is introducing.",
        "    const mine = (G[id] || []).filter((x) => x && x.length >= 2);",
        "    const contrasts = (r) => {",
        "      const ws = (r && r[6]) || [];",
        "      if (!ws.length || !mine.length) return true;",
        "      const n = ws.filter((w) => mine.some((g) => String(w).toLowerCase().indexOf(g) >= 0)).length;",
        "      return n * 2 <= ws.length;",
        "    };",
        "    const auto = [];",
        "    const take = (r) => {",
        "      if (r && r[0] !== id && auto.indexOf(r) < 0 && taught.indexOf(r) >= 0) auto.push(r);",
        "    };",
        "    // 1. what this lesson is built on",
        "    take(byId[PREQ[id]]);",
        "    // 2. the lesson taught just before it, preferring one that contrasts",
        "    const nearest = (want) => {",
        "      for (let i = skIdx - 1; i >= 0; i--) {",
        "        const r = SK[i];",
        "        if (auto.indexOf(r) < 0 && (!want || contrasts(r))) return r;",
        "      }",
        "      return null;",
        "    };",
        "    take(nearest(true) || nearest(false));",
        "    // 3. the spiral, from the pool for this level",
        "    const pool = (SPIRAL[String(myLv)] || []).map((k) => byId[k]).filter(Boolean);",
        "    for (let i = 0; i < pool.length && auto.length < 3; i++) {",
        "      if (taught.indexOf(pool[i]) >= 0 && contrasts(pool[i])) take(pool[i]);",
        "    }",
        "    // nothing in the pool is taught yet, so reach back by hand",
        "    for (let i = skIdx - 3; i >= 0 && auto.length < 3; i--) take(SK[i]);",
        "    const review = picked.length ? picked : auto;",
      ].join("\n");
      return html.replace(anchor, body);
    },
  },
  {
    // Ask about the sound this lesson actually teaches.
    //
    // The What says? drill on the spelling page is built from WS, and WS
    // shipped with entries for the fifteen hand-written skills only. The
    // other forty-seven fell back to whatever the review pass supplied, so
    // the question on the page was never about the day's pattern: Soft c
    // and soft g asked what says /a/, Greek digraphs asked what says /sh/.
    // A child could sit the whole lesson and never be asked the one
    // correspondence it exists to teach.
    //
    // Thirty of the forty-seven get their own sounds here. The other
    // seventeen are left out on purpose and keep the review sounds: a
    // lesson that teaches a rule or a meaning — the division rules, the
    // suffix-adding rules, contractions, the Latin roots, the prefixes —
    // has no new sound to drill, and inventing one would be worse than
    // the fallback.
    //
    // Merged rather than replaced, so the fifteen that already had sounds
    // keep exactly the ones they shipped with.
    name: "ask what says for the sound each lesson teaches",
    apply: (html) => {
      const anchor =
        "const picked = ((this.state && this.state.review) || ['', '', ''])";
      if (!html.includes(anchor)) return html;
      const merge =
        "const WSX = " + JSON.stringify(WSX.ws) + ";\n" +
        "    Object.keys(WSX).forEach((k) => { if (!WS[k]) WS[k] = WSX[k]; });\n" +
        "    " + anchor;
      return html.replace(anchor, merge);
    },
  },
  {
    // Six What says questions on every lesson, never five and never seven.
    //
    // They print in two columns, so an odd number leaves one question alone
    // on the last row and the block reads lopsided. The count was whatever
    // the lesson and its review pass happened to hold — anywhere from one
    // to seven.
    //
    // Filled in this order, which is also the order they are read:
    //
    //   the review lessons' sounds first, as a warm-up
    //   then back through the sequence for more already-taught sounds
    //   then the single consonants, which every lesson has earned
    //   and today's own sounds last, where they are never cut
    //
    // Today's sounds go in first and are appended last, so a lesson with
    // four of its own still shows all four: the padding gives way, not the
    // teaching point. The consonant list is the floor — the very first
    // lesson has no review behind it, and What says /m/? is a fair question
    // on day one.
    name: "give every lesson six What says questions",
    apply: (html) => {
      const anchor =
        "const whatSays = review.flatMap((r) => (WS[r[0]] || []).slice(0, 1))" +
        ".concat(WS[id] || []).map((s) => 'What says ' + s.split(' \u2192 ')[0] +" +
        " '? (' + s.split(' \u2192 ')[1] + ')');";
      if (!html.includes(anchor)) return html;
      const body = [
        "const WSPAD = ['/m/ \u2192 m', '/s/ \u2192 s', '/t/ \u2192 t', '/p/ \u2192 p',",
        "      '/b/ \u2192 b', '/f/ \u2192 f', '/n/ \u2192 n', '/d/ \u2192 d', '/g/ \u2192 g',",
        "      '/l/ \u2192 l', '/r/ \u2192 r', '/h/ \u2192 h'];",
        "    const wsOwn = (WS[id] || []).slice(0, 6);",
        "    const wsRest = [];",
        "    const wsAdd = (x) => {",
        "      if (x && wsOwn.indexOf(x) < 0 && wsRest.indexOf(x) < 0 &&",
        "        wsRest.length + wsOwn.length < 6) wsRest.push(x);",
        "    };",
        "    review.forEach((r) => (WS[r[0]] || []).slice(0, 1).forEach(wsAdd));",
        "    review.forEach((r) => (WS[r[0]] || []).forEach(wsAdd));",
        "    for (let i = skIdx - 1; i >= 0 && wsRest.length + wsOwn.length < 6; i--) {",
        "      (WS[SK[i][0]] || []).forEach(wsAdd);",
        "    }",
        "    WSPAD.forEach(wsAdd);",
        "    const whatSays = wsRest.concat(wsOwn).slice(0, 6)",
        "      .map((s) => 'What says ' + s.split(' \u2192 ')[0] + '? (' + s.split(' \u2192 ')[1] + ')');",
      ].join("\n");
      return html.replace(anchor, body);
    },
  },
  {
    // Six things to check, not three.
    //
    // Every "I did it right if…" box held three. Three is what a child
    // ticks without reading, and on the writing page it left the two
    // things they get wrong most — the proof not in quotation marks, the
    // reason that does not match the answer — unchecked.
    //
    // Each box gets three more, written for its own task, and all six are
    // things a child can check alone without asking what they mean.
    name: "give every I did it right box six things to check",
    apply: (html) => {
      const edits: [string, string][] = [
        [
          "<span>\u2610 All 5 parts</span><span>\u2610 2 pattern words</span>" +
            "<span>\u2610 Capitals + end marks</span>",
          "<span>\u2610 All 5 parts</span><span>\u2610 2 pattern words</span>" +
            "<span>\u2610 Capitals + end marks</span>" +
            "<span>\u2610 My proof is in quotation marks</span>" +
            "<span>\u2610 My reason matches my answer</span>" +
            "<span>\u2610 I read it back out loud</span>",
        ],
        [
          "<span>\u2610 Read 1</span><span>\u2610 Read 2</span>" +
            "<span>\u2610 I circled the {{ patWord }} words</span>",
          "<span>\u2610 Read 1</span><span>\u2610 Read 2</span>" +
            "<span>\u2610 I circled the {{ patWord }} words</span>" +
            "<span>\u2610 I stopped at every full stop</span>" +
            "<span>\u2610 I went back and fixed a word I missed</span>" +
            "<span>\u2610 I can say what happened</span>",
        ],
        [
          "<span>\u2610 It makes sense</span><span>\u2610 Capital first</span>" +
            "<span>\u2610 End mark last</span>",
          "<span>\u2610 It makes sense</span><span>\u2610 Capital first</span>" +
            "<span>\u2610 End mark last</span>" +
            "<span>\u2610 A space between every word</span>" +
            "<span>\u2610 Every word sits on the line</span>" +
            "<span>\u2610 I read it back</span>",
        ],
      ];
      let out = html;
      for (const [from, to] of edits) {
        if (!out.includes(from)) return html;
        out = out.split(from).join(to);
      }
      return out;
    },
  },
  {
    // Ten words on Ten Words A Day, and not the ten on the reading page.
    //
    // The tracker and the reading page both printed the whole word list.
    // That was ten words each until the banks were widened to twenty, and
    // then both pages printed all twenty — a tracker headed TEN WORDS A DAY
    // with twenty words on it, the same twenty the child had just read.
    //
    // The reading page keeps the first ten, which are the ones a teacher
    // already knows for that skill. The tracker takes ten the reading page
    // does not have, from the wider bank, so a week's practice is a
    // different set of words from the lesson's own.
    //
    // A part of a split skill narrows to ten, so there is no second ten in
    // the narrowed list; the tracker draws from the whole skill's bank
    // instead, and falls back to the multisyllabic list after that.
    name: "keep Ten Words A Day to ten words the reading page does not use",
    apply: (html) => {
      const anchor = "wbReal: real,";
      const ten = '"        <sc-for list=\\"{{ wbReal }}\\" as=\\"w\\" hint-placeholder-count=\\"10\\">';
      if (!html.includes(anchor)) return html;
      const marker = '<sc-for list="{{ wbReal }}" as="w" hint-placeholder-count="10">\n' +
        '          <div style="display:flex;gap:6px;align-items:center">';
      if (!html.includes(marker)) return html;
      let out = html.replace(
        anchor,
        "wbReal: real.slice(0, 10),\n" +
          "      wbTen: (() => {\n" +
          "        const page2 = real.slice(0, 10);\n" +
          "        // A part of a split skill must stay on its own part. The wider\n" +
          "        // bank belongs to the whole skill, so on the ow page it holds oa\n" +
          "        // words, and without this the tracker printed them.\n" +
          "        const fitsSub = (w) => !subPat || subHits(subPat, w);\n" +
          "        const pool = [].concat(realAll || [], MULTI[id] || []).filter(fitsSub);\n" +
          "        const out = [];\n" +
          "        pool.forEach((w) => {\n" +
          "          if (w && page2.indexOf(w) < 0 && out.indexOf(w) < 0 && out.length < 10) out.push(w);\n" +
          "        });\n" +
          "        // A part may have no second ten of its own. Repeating its ten is\n" +
          "        // better than borrowing the other half of the split.\n" +
          "        page2.forEach((w) => { if (out.indexOf(w) < 0 && out.length < 10) out.push(w); });\n" +
          "        return out;\n" +
          "      })(),"
      );
      // Both copies. The answer key is a clone of these pages made earlier
      // in this list, so replacing only the first left the key's tracker
      // printing the reading page's ten — which is the bug this rule exists
      // to fix, still on the page, one sheet further down.
      out = out.split(marker).join(marker.replace("{{ wbReal }}", "{{ wbTen }}"));
      return out;
    },
  },
  {
    // The review dropdowns show what was picked for you.
    //
    // The pass chooses three concepts from what the lesson is built on, but
    // the three dropdowns sat empty, so a teacher could not see the choice
    // and could not adjust one of them — only replace all three by hand.
    //
    // They are filled with the automatic picks now. Changing one keeps the
    // other two, because the handler starts from what is on screen rather
    // than from three blanks. Clearing one leaves it cleared: once a
    // teacher has touched the row it is theirs, and the automatic picks
    // stop overriding it.
    name: "show the automatic review picks in the dropdowns",
    apply: (html) => {
      const anchor =
        "      reviewPicks: [0, 1, 2].map((i) => ({ label: 'Review ' + (i + 1), " +
        "value: ((this.state && this.state.review) || ['', '', ''])[i] || '',";
      const handler =
        "        pick: (e) => { const r = ((this.state && this.state.review) || ['', '', '']).slice(); " +
        "r[i] = e.target.value; this.setState({ review: r }); } })),";
      if (!html.includes(anchor) || !html.includes(handler)) return html;
      return html
        .replace(
          anchor,
          "      ...(() => { const revSet = (this.state && this.state.review) || null;\n" +
            "        const revNow = [0, 1, 2].map((i) => revSet ? (revSet[i] || '')\n" +
            "          : ((auto[i] && auto[i][0]) || ''));\n" +
            "        return {\n" +
            "      reviewPicks: [0, 1, 2].map((i) => ({ label: 'Review ' + (i + 1), value: revNow[i],"
        )
        .replace(
          handler,
          "        pick: (e) => { const r = revNow.slice(); " +
            "r[i] = e.target.value; this.setState({ review: r }); } })) }; })(),"
        );
    },
  },
  {
    // No writing line on the answer key for Change the sound.
    //
    // The key prints the word, the change and the answer — and then printed
    // them sitting on a 40px ruled line each, which is a line for a child to
    // write on. Nobody writes on the key. It was two rules per row, five
    // rows, on a page that is read at a glance while a class works.
    //
    // The line is the student's. The key keeps the same two columns so the
    // rows still line up under each other, drops the rule, loses the 40px
    // of height per row, and left-aligns the words, because text centred on
    // a line that is no longer there floats.
    name: "drop the writing line from Change the sound on the key",
    apply: (html) => {
      const mark = "fromShown: isKey ? from : '', changeShown: isKey ? change : 'change',";
      if (!html.includes(mark)) return html;
      const student =
        "flex:1;min-width:0;font-size:17px;color:#B42318;display:flex;align-items:flex-end;overflow-wrap:anywhere;border-bottom:1.5px solid #333;min-height:40px;justify-content:center;padding-bottom:2px";
      const key = "flex:1;min-width:0;font-size:17px;color:#B42318;display:flex;align-items:flex-end;overflow-wrap:anywhere;min-height:0;justify-content:flex-start";
      let out = html.replace(
        mark,
        mark + "\n" + "            ln: isKey ? '" + key + "' : '" + student + "',"
      );
      // Both lines in the Change the sound row, and only those.
      const row =
        '<span style="flex:none;width:18px">{{ x.n }}.</span>' +
        '<span style="flex:1;min-width:0;font-size:17px;color:#B42318;display:flex;align-items:flex-end;overflow-wrap:anywhere;border-bottom:1.5px solid #333;min-height:40px;' +
        'justify-content:center;padding-bottom:2px">{{ x.fromShown }}</span>';
      const oldLine =
        '<span style="flex:1;min-width:0;border-bottom:1.5px solid #333;min-height:40px;' +
        'font-size:17px;color:#B42318;display:flex;align-items:flex-end;justify-content:center;' +
        'overflow-wrap:anywhere;padding-bottom:2px">';
      const a = oldLine + "{{ x.fromShown }}</span>";
      const b = oldLine + "{{ x.ans }}</span>";
      if (!out.includes(a) || !out.includes(b)) return html;
      out = out.split(a).join('<span style="{{ x.ln }}">{{ x.fromShown }}</span>');
      out = out.split(b).join('<span style="{{ x.ln }}">{{ x.ans }}</span>');
      return out;
    },
  },
  {
    // Spread the packet across the whole word bank.
    //
    // Widening each skill to twenty words did not stop a child meeting the
    // same ones over and over, because every section took real.slice(0, N)
    // — the first N. So cake, bike, home, cute and these turned up in the
    // reading list, real-or-made-up, the syllable split, the sprint, the
    // dictation and both spelling tests, five to seven times in one packet,
    // while the second ten were printed nowhere at all.
    //
    // Each section now takes its own window of the bank and wraps round the
    // end, so twenty words carry the packet instead of ten.
    //
    //   read each word   0-9     the ten a teacher knows for the skill
    //   ten words a day  10-19   computed to avoid the reading page
    //   real or made-up  10-14
    //   syllable split   4-11
    //   sprint           8-13
    //   dictation        16-18
    //   spelling, 2nd    0-9     you spell what you have just read
    //   spelling, 3rd    10-19   a different ten for the older sheet
    //
    // The maze is not in the list because it is written prose in the pack
    // data, with the choices inside the sentences. Its words are the
    // author's and cannot be reassigned by slicing.
    //
    // A part of a split skill narrows to ten, and the wrap means those
    // sections overlap again — unavoidable with ten words, and no worse
    // than it was for every skill before this.
    name: "spread the packet across the whole word bank",
    apply: (html) => {
      const decl = "const real = isMulti ? (MULTI[id] || real0) : real0;";
      if (!html.includes(decl)) return html;
      let out = html.replace(
        decl,
        decl +
          "\n    // One bank, many sections: each takes its own window of it so the\n" +
          "    // first ten do not carry the whole packet.\n" +
          "    const ring = (n, off) => { const L = real; if (!L.length) return [];\n" +
          "      const out = []; for (let i = 0; i < n; i++) out.push(L[(off + i) % L.length]);\n" +
          "      return out; };"
      );
      const edits: [string, string, boolean][] = [
        ["const rmWords = (() => { const R = real.slice(0, 5);",
         "const rmWords = (() => { const R = ring(5, 10);", false],
        ["syWords: real.slice(0, 8).map(", "syWords: ring(8, 4).map(", false],
        ["'Sprint: ' + real.slice(0, 6).join(' \u00b7 ')",
         "'Sprint: ' + ring(6, 8).join(' \u00b7 ')", false],
        // Dictation words, the dictation script and the lesson's spelling
        // step are one activity read three ways, so they stay in step.
        ["real.slice(0, 3).concat(nonsense.slice(0, 1))",
         "ring(3, 16).concat(nonsense.slice(0, 1))", true],
        ["slots: real.slice(0, 10).map((w, i) => ({ n: i + 1 }))",
         "slots: ring(10, g === 'g2' ? 0 : 10).map((w, i) => ({ n: i + 1 }))", false],
        ["script: real.slice(0, 10).map((w, i) => ({ n: i + 1, w,",
         "script: ring(10, g === 'g2' ? 0 : 10).map((w, i) => ({ n: i + 1, w,", false],
        ["words: real.slice(0, 10),", "words: ring(10, g === 'g2' ? 0 : 10),", false],
      ];
      for (const [from, to, all] of edits) {
        if (!out.includes(from)) return html;
        out = all ? out.split(from).join(to) : out.replace(from, to);
      }
      return out;
    },
  },
  {
    // What says: ask once, then just number the lines.
    //
    // The section heading already says What says?, and then every one of
    // the six rows said it again. On the student's page that is six
    // identical printed questions with nothing to tell them apart — the
    // sound is spoken, not printed, so the words carried no information
    // and only crowded the line a child writes on.
    //
    // The heading asks the question. The rows are a number and a line.
    //
    // The key keeps the sound on each row, which is what a teacher reads
    // from, so it prints 1. /m/ m rather than six rows of What says.
    name: "ask What says once, then number the lines",
    apply: (html) => {
      const from =
        '<span style="flex:none;font-size:18px;font-weight:800;white-space:nowrap">' +
        "What says{{ x.q }}?</span>";
      const to =
        '<span style="flex:none;font-size:18px;font-weight:800;white-space:nowrap">' +
        "{{ x.q }}</span>";
      if (!html.includes(from)) return html;
      return html.split(from).join(to);
    },
  },
  {
    // The ten words get harder as the child goes down them.
    //
    // The lists arrived in whatever order their bank happened to hold, so a
    // child could meet "between" on line one and "feet" on line nine. That
    // is backwards: the first word of the day is the one that should go
    // right, because the five minutes is meant to start with a win.
    //
    // Hardness is counted from the three things that make a word take
    // longer to sound out, in the order they matter: how many syllables it
    // has, how long it is, and how many consonants are stacked together.
    // Those dominate deliberately — a two-syllable word is harder than any
    // one-syllable word on the same list, whatever else is true of it.
    //
    // Ties keep the order the bank had, so the author's sequence survives
    // wherever the scaffold has no opinion.
    name: "order the ten words from easiest to hardest",
    apply: (html) => {
      const decl = "const real = isMulti ? (MULTI[id] || real0) : real0;";
      if (!html.includes(decl)) return html;
      let out = html.replace(
        decl,
        decl +
          "\n    // Easy first: the child works down the list, so the list climbs.\n" +
          "    const hardness = (w) => {\n" +
          "      const t = String(w).toLowerCase();\n" +
          "      // Silent e is not a syllable, so it comes off before counting.\n" +
          "      const syl = (t.replace(/e$/, '').match(/[aeiouy]+/g) || ['']).length;\n" +
          "      const stack = (t.match(/[^aeiouy']{2,}/g) || [])\n" +
          "        .reduce((n, c) => n + c.length - 1, 0);\n" +
          "      return syl * 100 + t.length * 6 + stack * 7;\n" +
          "    };\n" +
          "    const easyFirst = (L) => L.map((w, i) => [w, i])\n" +
          "      .sort((a, b) => hardness(a[0]) - hardness(b[0]) || a[1] - b[1])\n" +
          "      .map((x) => x[0]);"
      );
      const edits: [string, string][] = [
        ["wbReal: real.slice(0, 10),", "wbReal: easyFirst(real.slice(0, 10)),"],
        ["        return out;\n      })(),", "        return easyFirst(out);\n      })(),"],
      ];
      for (const [from, to] of edits) {
        if (!out.includes(from)) return html;
        out = out.replace(from, to);
      }
      return out;
    },
  },
  {
    // One lesson, one pool of words, and nothing drawn twice.
    //
    // Every list in a lesson reached into the same ten words, so a child
    // met sandbox on the reading page, again in real-or-made-up and again
    // in the maze, and the 2nd and 3rd grade spelling tests set the same
    // ten in a different order. Ten words cannot fill six activities. The
    // window the rule above opens — ring(n, off) — was the right idea
    // against the wrong list: a ring of ten wraps straight back onto
    // itself, so every window held the same words.
    //
    // scripts/reading-multisyllabic.json holds up to forty words per skill
    // and per part, mined from what this site already puts in front of
    // children and checked for pattern, syllables and being real. This
    // points the ring at that, and hands the lists that must not overlap a
    // slice nobody else has taken.
    //
    // The reading page keeps its ten, because that is the list a teacher
    // has already looked at. When a pattern genuinely has too few
    // two-syllable words in English — zz, -olt — the pool runs dry and a
    // word repeats, which is better than printing one off the pattern.
    name: "hand every activity its own words",
    apply: (html) => {
      const decl = "const real = isMulti ? (MULTI[id] || real0) : real0;";
      if (!html.includes(decl)) return html;
      const pool =
        "const MSB = " + JSON.stringify(MSB.words) + ";\n" +
        "    // A part has its own list, because the skill's list is the whole\n" +
        "    // split: on the ow page the skill list holds oa words.\n" +
        "    const msKey = subPat ? id + '|' + subPat : id;\n" +
        "    const msBank = MSB[msKey] || (subPat ? null : MSB[id]) || { real: [], fake: [] };\n" +
        "    // On a part only its own bank is safe. On a whole skill the ten a\n" +
        "    // teacher already knows come first and the bank follows them.\n" +
        "    const msAll = (subPat ? [] : (MULTI[id] || [])).concat(msBank.real)\n" +
        "      .filter((w, i, a) => w && a.indexOf(w) === i);\n" +
        "    const wordPool = (isMulti\n" +
        "      ? (msAll.length ? msAll : (MULTI[id] || real0))\n" +
        "      : real0.concat((realAll || []).filter((w) => !subPat || subHits(subPat, w)))\n" +
        "        .concat(msBank.one || []))\n" +
        "      .filter((w, i, a) => w && a.indexOf(w) === i);\n" +
        "    const fakePool = (isMulti && msBank.fake.length ? msBank.fake : [])\n" +
        "      .concat(nonsense).filter((w, i, a) => w && a.indexOf(w) === i);\n" +
        "    const real = (isMulti ? wordPool : real0).slice(0, 10);\n" +
        "    // The reading page's ten are spoken for before anything else asks.\n" +
        "    const takenWords = new Set(real.map((w) => String(w).toLowerCase()));\n" +
        "    const takenFakes = new Set();\n" +
        "    const drawFrom = (bank, taken, n) => {\n" +
        "      const out = [];\n" +
        "      for (let i = 0; i < bank.length && out.length < n; i++) {\n" +
        "        const k = String(bank[i]).toLowerCase();\n" +
        "        if (taken.has(k)) continue;\n" +
        "        taken.add(k); out.push(bank[i]);\n" +
        "      }\n" +
        "      // Dry. Repeat rather than print a word off the lesson's pattern.\n" +
        "      for (let i = 0; i < bank.length && out.length < n; i++) {\n" +
        "        if (out.indexOf(bank[i]) < 0) out.push(bank[i]);\n" +
        "      }\n" +
        "      return out;\n" +
        "    };\n" +
        "    const takeWords = (n) => drawFrom(wordPool, takenWords, n);\n" +
        "    const takeFakes = (n) => drawFrom(fakePool, takenFakes, n);\n" +
        "    // Every list is drawn here, in this order, before anything renders.\n" +
        "    //\n" +
        "    // Drawing them where they are used looks tidier and is wrong: the\n" +
        "    // whole lesson is recomputed on every render, and a print run\n" +
        "    // renders only the sheets it is printing. So the 3rd grade test\n" +
        "    // printed on its own was the first to ask, and got the 2nd grade\n" +
        "    // test's words. Reserving up front makes one sheet printed alone\n" +
        "    // identical to the same sheet printed in the packet.\n" +
        "    const RES = {\n" +
        "      ten: takeWords(10),\n" +
        "      rm: takeWords(5),\n" +
        "      rmFake: takeFakes(5),\n" +
        "      spellG2: takeWords(10),\n" +
        "      spellG3: takeWords(10),\n" +
        "      // The sheet and the key are two printings of one test. Drawing\n" +
        "      // this twice set the child clusper and marked the answer clem.\n" +
        "      dictFake: takeFakes(1),\n" +
        "    };\n" +
        "    const dictFake = RES.dictFake;\n" +
        "    const spellTen = (g) => (g === 'g2' ? RES.spellG2 : RES.spellG3);\n" +
        "    // Real means anywhere in the lesson's pool, not just the ten on the\n" +
        "    // reading page, or the key prints M beside a word the child has\n" +
        "    // just read correctly as a real one.\n" +
        "    const realSet = new Set(wordPool.map((w) => String(w).toLowerCase()));";
      const out = html.replace(decl, pool);

      // the ring, pointed at the whole bank instead of the first ten
      const ring = "const ring = (n, off) => { const L = real;";
      if (!out.includes(ring)) return html;
      return out.replace(ring, "const ring = (n, off) => { const L = wordPool.length ? wordPool : real;");
    },
  },
  {
    // The lists that repeated, each given its own.
    //
    // Ten Words A Day had a pool of its own already, but it was the skill's
    // ten with the reading page's ten taken out, so on a multisyllabic
    // lesson there was nothing left and it printed them again.
    // Real-or-made-up took the first five off the reading page outright.
    // And the 2nd and 3rd grade spelling tests read the same window of a
    // ten-word ring, so they set the same test twice.
    name: "stop the workbook repeating the reading page",
    apply: (html) => {
      const ten = "      wbTen: (() => {";
      const close = "      })(),";
      const at = html.indexOf(ten);
      if (at === -1) return html;
      const to = html.indexOf(close, at);
      if (to === -1) return html;
      let out = html.slice(0, at) + "      wbTen: easyFirst(RES.ten),\n" +
        html.slice(to + close.length + 1);

      const rmHead = "const rmWords = (() => { const R = ring(5, 10); const M = nonsense.slice(0, 5);";
      if (!out.includes(rmHead)) return html;
      out = out.replace(rmHead, "const rmWords = (() => { const R = RES.rm; const M = RES.rmFake;");
      const rmTail = "return out.concat(real.slice(5)).slice(0, 10); })();";
      if (!out.includes(rmTail)) return html;
      out = out.replace(rmTail, "return out.concat(takeWords(10 - out.length)).slice(0, 10); })();");

      const edits: [string, string][] = [
        ["slots: ring(10, g === 'g2' ? 0 : 10).map((w, i) => ({ n: i + 1 }))",
         "slots: spellTen(g).map((w, i) => ({ n: i + 1 }))"],
        ["script: ring(10, g === 'g2' ? 0 : 10).map((w, i) => ({ n: i + 1, w,",
         "script: spellTen(g).map((w, i) => ({ n: i + 1, w,"],
        ["words: ring(10, g === 'g2' ? 0 : 10),", "words: spellTen(g),"],
        ["const isReal = (w) => real.includes(w);",
         "const isReal = (w) => realSet.has(String(w).toLowerCase());"],
      ];
      for (const [from, to] of edits) {
        if (!out.includes(from)) return html;
        out = out.replace(from, to);
      }
      // The dictation's made-up word stayed single-syllable with the switch
      // on, so a three-syllable test ended on clid.
      const dictOld = "ring(3, 16).concat(nonsense.slice(0, 1))";
      if (!out.includes(dictOld)) return html;
      return out.split(dictOld).join("ring(3, 16).concat(dictFake)");
    },
  },
  {
    // The review switch, reaching the review words.
    //
    // The row has had its own 🧗 button for a while, and it governed one
    // thing: the ten-word review strip in the workbook, drawn from the old
    // ten-word map. Step 5 — the words the class actually reads aloud from
    // the past concepts — ignored it entirely, so turning it on changed a
    // printed sheet and nothing a child heard.
    //
    // Both now come from the same place: each picked concept's own list in
    // the word bank, single-syllable or multisyllabic according to the
    // button. The three concepts draw from one tally, so two of them cannot
    // offer the same word, and the tally already holds today's own words,
    // so the review cannot hand back a word from the lesson it is meant to
    // be revisiting.
    name: "let the review switch reach the review words",
    apply: (html) => {
      const step5 = "const reviewWords = review.flatMap((r) => r[6].slice(0, 3));";
      if (!html.includes(step5)) return html;
      const out = html.replace(
        step5,
        "// Each picked concept's own list, in the length the button asks for.\n" +
          "    const revBank = (r) => revMulti\n" +
          "      ? ((MSB[r[0]] && MSB[r[0]].real.length) ? MSB[r[0]].real : r[6])\n" +
          "      // Off, the concept's own ten come first: a teacher wrote those\n" +
          "      // for it. The mined list is only there to top them up when the\n" +
          "      // tally has already spent them.\n" +
          "      : r[6].concat((MSB[r[0]] && MSB[r[0]].one) || []);\n" +
          "    // Drawn against the lesson's own tally, so a review word is never\n" +
          "    // one of today's and never one another review slot has taken.\n" +
          "    const revTake = (r, n) => drawFrom(revBank(r), takenWords, n);\n" +
          "    const reviewWords = review.flatMap((r) => revTake(r, 3));\n" +
          "    const reviewTen = review.length\n" +
          "      ? review.flatMap((r) => revTake(r, Math.ceil(10 / review.length))).slice(0, 10)\n" +
          "      : [];"
      );

      const strip =
        "wbReview: review.flatMap((r) => (revMulti && (MULTI[r[0]] || []).length " +
        "? MULTI[r[0]] : r[6]).slice(0, Math.ceil(10 / review.length))).slice(0, 10),";
      if (!out.includes(strip)) return html;
      return out.replace(strip, "wbReview: reviewTen,");
    },
  },
  {
    // The word games, when the switch is on.
    //
    // Every chest drew from `W`, which is real0 — the lesson's
    // single-syllable ten — whatever the switch said. So a class working in
    // multisyllabic words got a games packet in one-syllable words, and the
    // chests repeated each other: the same ten were highlighted, then
    // unscrambled, then played as tic tac toe, then read for speed.
    //
    // The chests draw against a tally of their own rather than the
    // lesson's. A game is practice of the lesson, so a chest sharing a word
    // with the reading page is right; a chest sharing one with another
    // chest is the thing that was wrong.
    //
    // Chests 3, 4 and 14 are not touched. They work by finding the
    // lesson's words inside the lesson's own sentences, so they have to go
    // on using the words those sentences contain.
    name: "give the word games multisyllabic words, and one list each",
    apply: (html) => {
      const head =
        "const P = (OGD[id] || {}).p || {}; const W = real0.slice(0, 10); " +
        "const F = (cur[7] || []).slice(0, 6); const M = (MULTI[id] || []).slice(0, 8);";
      if (!html.includes(head)) return html;
      let out = html.replace(
        head,
        head +
          "\n        // Drawn once, here, because the packet is built twice — once\n" +
          "        // for the child and once as the key — and the two have to be\n" +
          "        // the same sheet.\n" +
          "        const gTaken = new Set(); const gTakenF = new Set();\n" +
          "        const gTake = (n) => (isMulti ? drawFrom(wordPool, gTaken, n) : []);\n" +
          "        const GB = { hl: gTake(8), unscr: gTake(4), multi: gTake(6),\n" +
          "          sent: gTake(6), rom: gTake(6), ttt: gTake(9), draw: gTake(4),\n" +
          "          rhyme: gTake(6), comic: gTake(6) };\n" +
          "        // Roll and read and Speed read are repeated-reading games: the\n" +
          "        // point is meeting a word again under time pressure, so they\n" +
          "        // re-read the chests above rather than asking for fifty-five\n" +
          "        // more words a pattern like cl does not have.\n" +
          "        GB.roll = GB.hl.concat(GB.ttt);\n" +
          "        GB.speed = GB.hl.concat(GB.unscr, GB.rom).slice(0, 10);\n" +
          "        const GF = isMulti ? drawFrom(fakePool, gTakenF, 6) : F;\n" +
          "        const HW = isMulti ? GB.hl : W;"
      );

      const edits: [string, string][] = [
        // 1 highlight: sort the bank's words by the two patterns, as before
        ["const a = W.filter(m(pats[0])), b = W.filter((w) => !a.includes(w) && m(pats[1])(w)); return a.length",
         "const a = HW.filter(m(pats[0])), b = HW.filter((w) => !a.includes(w) && m(pats[1])(w)); return a.length"],
        ["const a = W.filter(m(pats[0])), b = W.filter((w) => !a.includes(w) && m(pats[1])(w)); const it",
         "const a = HW.filter(m(pats[0])), b = HW.filter((w) => !a.includes(w) && m(pats[1])(w)); const it"],
        ["{ items: mix(W.slice(0, 6).concat(F), 'h'), cols: 6, score: '__ / ' + (6 + F.length) }",
         "{ items: mix((isMulti ? GB.hl.slice(0, 6) : W.slice(0, 6)).concat(GF), 'h'), cols: 6, " +
         "score: '__ / ' + (6 + GF.length) }"],
        // 5 unscramble
        ["{ items: W.slice(0, 4).map((w) => { let o = mix([...w], w).join(' ');",
         "{ items: (isMulti ? GB.unscr : W.slice(0, 4)).map((w) => { let o = mix([...w], w).join(' ');"],
        // 6 the multisyllabic chest itself, off the bank rather than the old ten
        ["else if (M.length) A('Multisyllabic words', 'Read each word. Draw a line between the syllables.', " +
         "{ items: M.slice(0, 6), cols: 3, score: '__ / ' + Math.min(6, M.length) });",
         "else if (isMulti ? GB.multi.length : M.length) A('Multisyllabic words', " +
         "'Read each word. Draw a line between the syllables.', " +
         "{ items: isMulti ? GB.multi : M.slice(0, 6), cols: 3, " +
         "score: '__ / ' + (isMulti ? GB.multi.length : Math.min(6, M.length)) });"],
        // 7 my sentences
        ["{ items: W.slice(0, 6), cols: 6, lines: ['', ''], w: 1.3 }",
         "{ items: isMulti ? GB.sent : W.slice(0, 6), cols: 6, lines: ['', ''], w: 1.3 }"],
        // 8 real or made-up
        ["if (F.length) A('Real or made-up?', 'Read each word. Circle R (real) or M (made-up).', " +
         "{ items: mix(W.slice(0, 6).concat(F), 'r').map((w) => [w + '   R / M', F.includes(w) ? 'M' : 'R']), " +
         "line: key, cols: 4 });",
         "if (GF.length) A('Real or made-up?', 'Read each word. Circle R (real) or M (made-up).', " +
         "{ items: mix((isMulti ? GB.rom : W.slice(0, 6)).concat(GF), 'r')" +
         ".map((w) => [w + '   R / M', GF.includes(w) ? 'M' : 'R']), line: key, cols: 4 });"],
        // 10 tic tac toe
        ["const T9 = (P.ttt && P.ttt[0]) || W.concat(M).slice(0, 9);",
         "const T9 = isMulti ? GB.ttt : ((P.ttt && P.ttt[0]) || W.concat(M).slice(0, 9));"],
        // 11 roll and read
        ["const R6 = P.roll ? P.roll.map((r) => r.split(' ')) : [0, 1, 2, 3, 4, 5]" +
         ".map((r) => W.concat(M, W).slice(r * 3, r * 3 + 4));",
         "const R6 = isMulti ? [0, 1, 2, 3, 4, 5].map((r) => GB.roll" +
         ".slice(r * 2, r * 2 + 3)) : (P.roll ? P.roll.map((r) => r.split(' ')) : " +
         "[0, 1, 2, 3, 4, 5].map((r) => W.concat(M, W).slice(r * 3, r * 3 + 4)));"],
        // 12 draw it
        ["{ items: (P.draw || W).slice(0, 4), cols: 4,",
         "{ items: isMulti ? GB.draw : (P.draw || W).slice(0, 4), cols: 4,"],
        // 13 rhyme time
        ["{ items: (P.rhyme || W).slice(0, 6), line: true, cols: 6 }",
         "{ items: isMulti ? GB.rhyme : (P.rhyme || W).slice(0, 6), line: true, cols: 6 }"],
        // 15 speed read
        ["const SP = (P.speed || W).slice(0, 10);",
         "const SP = isMulti ? GB.speed : (P.speed || W).slice(0, 10);"],
        // 16 comic strip
        ["(P.comic || W).slice(0, 6).join(' · ')",
         "(isMulti ? GB.comic : (P.comic || W).slice(0, 6)).join(' · ')"],
      ];
      for (const [from, to] of edits) {
        if (!out.includes(from)) return html;
        out = out.replace(from, to);
      }
      return out;
    },
  },
  {
    // The partner read, when the switch is on.
    //
    // The sentences a child reads to a partner were written for the
    // single-syllable lesson — "Jill will toss the ball well." — so a class
    // that had spent the whole lesson on two- and three-syllable words read
    // that out at the end of it.
    //
    // The bank carries sentences for this too, and they are mined rather
    // than generated: every one is a sentence a person wrote for this age
    // group, somewhere in this site's own passages, that happens to carry
    // at least two of the pattern's longer words. They are longer than the
    // hand-written ones as a consequence rather than as a target, which is
    // the right way round.
    //
    // A pattern with fewer than two such sentences keeps the ones it has.
    name: "give the partner read longer sentences when the switch is on",
    apply: (html) => {
      const anchor =
        "wbSent: (() => {\n" +
        "        const fits = (x) => { const n = x.trim().split(/\\s+/).length; " +
        "return n >= 4 && n <= 12; };";
      if (!html.includes(anchor)) return html;
      return html.replace(
        anchor,
        "wbSent: (() => {\n" +
          "        if (isMulti && msBank.sent && msBank.sent.length >= 2) " +
          "return msBank.sent.slice(0, 3);\n" +
          "        const fits = (x) => { const n = x.trim().split(/\\s+/).length; " +
          "return n >= 4 && n <= 12; };"
      );
    },
  },
  {
    // A word ladder for every lesson, on that lesson's own pattern.
    //
    // The packs carried 58 ladders between 62 lessons, so four of them were
    // shared: ai-ay, ee-ea and oa-ow all printed the same one, which runs
    // through ee, ea and oa words — two of those three lessons were asking
    // for spellings they had not taught yet. The fifteen hand-written
    // skills had no pack and so printed no ladder at all, and all 150 parts
    // of a split lesson printed their parent's: the ow page laddered
    // through oa.
    //
    // These are built rather than borrowed. Every rung is a real word that
    // is decodable with what the sequence has taught by that lesson, every
    // rung but a rationed few sits on the lesson's own pattern, and every
    // clue has exactly one answer in the whole legal word set — a clue that
    // two words satisfy is not a clue. scripts/check-word-ladders.mjs
    // proves all of that and fails the build if it stops being true.
    //
    // The clues are spelling changes rather than meaning riddles, which is
    // what a decoding lesson wants: the child's attention stays on the one
    // sound that moved.
    name: "give every lesson its own word ladder",
    apply: (html) => {
      const seat = "const subPat = SEL.split('|')[1] || '';";
      const call =
        "if (P.ladder) A('Word ladder', 'Start with \"' + P.ladder.start + " +
        "'\". Follow each clue. Change one part at a time.', { items: P.ladder.clues, " +
        "line: true, cols: 2, st: () => ({ fontSize: 12.5, fontWeight: 600, lineHeight: 1.3 }), w: 1.6 });";
      if (!html.includes(seat) || !html.includes(call)) return html;
      let out = html.replace(
        seat,
        seat + "\n    const LAD = " + JSON.stringify(LADD.ladders) + ";" +
          "\n    const LADMULTI = " + JSON.stringify(LADD.laddersMulti ?? {}) + ";"
      );
      // The answer key prints each rung beside its clue, so a teacher is not
      // solving the ladder at the front of the room.
      const next =
        // id, not SEL: on first load nothing has been selected, SEL is the
        // empty string, and the lesson the page opens on got no ladder at
        // all. id is the skill the page is actually showing.
        "const LX = LAD[SEL] || LAD[id] || (P.ladder ? " +
        "{ start: P.ladder.start, words: [], clues: P.ladder.clues } : null);\n          " +
        "if (LX) A('Word ladder', 'Start with \"' + LX.start + " +
        "'\". Follow each clue. Change one part at a time.', " +
        "{ items: LX.clues.map((c, i) => [c, (LX.words || [])[i + 1] || '']), " +
        "line: true, cols: 2, st: () => ({ fontSize: 12.5, fontWeight: 600, lineHeight: 1.3 }), w: 1.6 });";
      out = out.split(call).join(next);
      return out;
    },
  },
  {
    // Put the ladder in the workbook, where a teacher will find it.
    //
    // It had been living as chest 2 of fourteen inside a Word games panel
    // that is shut when the page loads, which is a fine place for a game
    // and a poor place for the one activity on the sheet that asks a child
    // to write a word for every sound they change. It is a workbook page
    // now, straight after Ten Words A Day, and it prints with the workbook.
    //
    // It stays in the games panel too. The same ladder in both places
    // costs nothing, and a teacher who already prints the games sheet
    // should not lose it.
    //
    // The rungs climb: the start word sits at the bottom and each new word
    // goes on the rung above, which is the way a ladder is read and the way
    // the activity is named. The answer key fills the rungs in.
    name: "put the word ladder in the workbook",
    apply: (html) => {
      const seat = "const cur = byId[SEL.split('|')[0]] || byId.vce;";
      const rowsAnchor = ", sbRows }; })";
      const dataAnchor = "wbReal: easyFirst(real.slice(0, 10)),";
      const trackerTail =
        'The word I still want to practise: <span style="display:inline-block;' +
        'width:150px;border-bottom:2px solid #111"></span></div>\n' +
        "      </div>\n    </div>\n    ";
      for (const a of [seat, rowsAnchor, dataAnchor, trackerTail])
        if (!html.includes(a)) return html;

      let out = html.replace(
        seat,
        seat + "\n    const LADX = LAD[SEL] || LAD[cur[0]] || null;"
      );
      // Each copy of the workbook builds its own rows, so the key fills the
      // rungs in and the student's page leaves them blank.
      out = out.replace(
        rowsAnchor,
        ", sbRows, ladBox: LADX ? p.box1 : { ...p.box1, display: 'none' }," +
          " ladRows: (LADX ? LADX.clues : []).map((c, i) =>" +
          " ({ n: i + 1, c, ans: isKey ? LADX.words[i + 1] : '' })) }; })"
      );
      out = out.replace(dataAnchor, dataAnchor + " ladStart: LADX ? LADX.start : '',");

      const page =
        '<div data-wb="true" style="{{ p.ladBox }}">\n' +
        '      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:12px;border-bottom:3px solid #4B6049;padding-bottom:8px">\n' +
        "        <div>\n" +
        '          <div style="font-family:Outfit,sans-serif;font-size:12px;font-weight:700;letter-spacing:.18em;color:#618459">WORD LADDER</div>\n' +
        '          <div style="font-size:26px;font-weight:800;color:#2F3E2E;line-height:1.1">{{ sk.label }}</div>\n' +
        "        </div>\n" +
        '        <div style="font-size:14px;font-weight:600;white-space:nowrap">Name ____________  Week ______</div>\n' +
        "      </div>\n" +
        '      <div style="font-size:14px;line-height:1.45;background:#FDF6E7;border:1.5px solid #E4D3A8;border-radius:8px;padding:7px 12px">Start at the bottom. Read the clue on each rung, change that one part, and write the new word on the line. Climb to the top.</div>\n' +
        // flex:1 and space-evenly, because the page box spreads its children:
        // without this the rungs bunch into a band and the page prints with
        // two inches of white above them. Spread, they also give a child
        // room to write.
        '      <div style="display:flex;flex-direction:column-reverse;gap:6px;flex:1;justify-content:space-evenly">\n' +
        '        <div style="display:flex;gap:10px;align-items:center;border:2px solid #111;border-radius:10px;padding:8px 12px;background:#F1F6EE">\n' +
        '          <span style="flex:0 0 36%;font-size:20px;font-weight:800;color:#111">{{ ladStart }}</span>\n' +
        '          <span style="flex:1;font-size:13px;font-weight:700;color:#4B6049">Start here. Read it out loud.</span>\n' +
        "        </div>\n" +
        '        <sc-for list="{{ p.ladRows }}" as="r" hint-placeholder-count="6">\n' +
        '          <div style="display:flex;gap:10px;align-items:center;border:2px solid #111;border-radius:10px;padding:11px 12px">\n' +
        '            <span style="flex:0 0 36%;display:flex;align-items:flex-end;gap:8px">\n' +
        '              <span style="font-family:Outfit,sans-serif;font-size:13px;font-weight:800;color:#618459">{{ r.n }}</span>\n' +
        '              <span style="flex:1;border-bottom:2px solid #111;min-height:24px;font-size:19px;font-weight:700;color:#111;line-height:1.2">{{ r.ans }}</span>\n' +
        "            </span>\n" +
        '            <span style="flex:1;font-size:13.5px;font-weight:600;line-height:1.35">{{ r.c }}</span>\n' +
        "          </div>\n" +
        "        </sc-for>\n" +
        "      </div>\n" +
        '      <div style="font-size:13px;font-weight:600;color:#57534E">Now read the whole ladder back, from the bottom rung to the top.</div>\n' +
        "    </div>\n    ";
      // Both copies: the answer key is a clone of these pages made earlier
      // in this list, so a plain replace would put the ladder on the
      // student's workbook only.
      out = out.split(trackerTail).join(trackerTail + page);
      return out;
    },
  },
  {
    // A different passage for every concept, at three reading levels.
    //
    // 212 lesson choices shared 59 passages between them. The three vowel
    // team lessons and all their parts — nine choices — read the same story
    // about a goat and a boat, and two of those three lessons had not
    // taught oa or ow yet. There was one reading level for all of it.
    //
    // Each concept written so far now has its own story at second, third
    // and fourth grade, and a teacher picks the level. A concept not
    // written yet keeps the passage it had, so the page never goes blank
    // while the rest are written.
    //
    // The level starts from the lesson's own band and steps up one when
    // the multisyllabic button is on or the lesson is a digraph lesson,
    // because both of those ask a child for more than the band does.
    name: "give every concept its own passage at three reading levels",
    apply: (html) => {
      const seat = "const cur = byId[SEL.split('|')[0]] || byId.vce;";
      const pick = "const d = D[id] || (XT.DEC || {})[id] ||";
      if (!html.includes(seat) || !html.includes(pick)) return html;

      let out = html.replace(
        seat,
        seat +
          "\n    const PGS = " + JSON.stringify(PASSAGES.passages) + ";\n" +
          "    const PG_ORDER = ['g2', 'g3', 'g4'];\n" +
          "    const PG_NAME = { g2: '2nd', g3: '3rd', g4: '4th' };\n" +
          "    // Where the lesson sits decides the level, until a teacher says otherwise.\n" +
          "    const pgBase = (this.state && this.state.pg) ||\n" +
          "      (String(cur[2]) === 'Level 1' ? 'g2' : String(cur[2]) === 'Level 2' ? 'g3' : 'g4');\n" +
          "    // Multisyllabic work and the digraph lessons both ask for more\n" +
          "    // than the band does, so the passage steps up one level.\n" +
          "    const PG_HARD = { dig: 1, 'ck-tch': 1, 'og5-01': 1 };\n" +
          "    const pgUp = !!(this.state && this.state.multi) || !!PG_HARD[cur[0]];\n" +
          "    const pgGrade = pgUp\n" +
          "      ? PG_ORDER[Math.min(2, PG_ORDER.indexOf(pgBase) + 1)] : pgBase;\n" +
          "    // A part of a split lesson takes its own passage where one has\n" +
          "    // been written, and its concept's where one has not.\n" +
          "    const PGX = ((PGS[SEL] || PGS[cur[0]]) || {})[pgGrade] || null;"
      );

      out = out.replace(
        pick,
        "const d = (PGX ? [PGX.title, PGX.paras, PGX.qs] : null) || D[id] || (XT.DEC || {})[id] ||"
      );

      // The writing step and its AI coach read the same passage the reading
      // level is showing, not the one the pack shipped with.
      const eb = "const ebText = EBT[id] ||";
      if (!out.includes(eb)) return html;
      out = out.replace(eb, "const ebText = (PGX ? PGX.paras.join('\\n') : null) || EBT[id] ||");
      const ebq = "const ebPrompt = EBP[id] ||";
      if (!out.includes(ebq)) return html;
      out = out.replace(
        ebq,
        "const ebPrompt = (PGX && PGX.qs && PGX.qs[2] ? PGX.qs[2][0] : null) || EBP[id] ||"
      );

      // The level control, beside the other toolbar buttons. The toolbar is
      // recoloured and reflowed by an earlier rule, so this anchors on a
      // binding that survives that rather than on the original markup.
      const btnAnchor = '<button type="button" onClick="{{ toggleGames }}"';
      if (!out.includes(btnAnchor)) return html;
      const control =
        '        <sc-if value="{{ pgHas }}" hint-placeholder-val="{{ true }}">\n' +
        '          <span style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border:1.5px solid #C9D3C4;border-radius:999px;background:#F7FAF6">\n' +
        '            <span style="font-family:Outfit,sans-serif;font-size:11px;font-weight:800;letter-spacing:.1em;color:#618459;white-space:nowrap">READING</span>\n' +
        '            <sc-for list="{{ pgOpts }}" as="o" hint-placeholder-count="3">\n' +
        '              <button type="button" onClick="{{ o.pick }}" style="{{ o.st }}">{{ o.label }}</button>\n' +
        "            </sc-for>\n" +
        '            <span style="font-size:11px;font-weight:700;color:#8A7A4E;white-space:nowrap">{{ pgNote }}</span>\n' +
        "          </span>\n" +
        "        </sc-if>\n";
      out = out.replace(btnAnchor, control + btnAnchor);

      // The data behind it.
      const dataAnchor = "wbReal: easyFirst(real.slice(0, 10)),";
      if (!out.includes(dataAnchor)) return html;
      out = out.replace(
        dataAnchor,
        dataAnchor +
          " pgHas: !!PGX,\n" +
          "      pgNote: pgUp ? ((this.state && this.state.multi) ? '\u2191 multisyllabic'" +
          " : '\u2191 digraphs') : '',\n" +
          "      pgOpts: PG_ORDER.map((g) => ({ g, label: PG_NAME[g],\n" +
          "        st: 'font-family:Outfit,sans-serif;font-size:12px;font-weight:800;" +
          "border:1.5px solid #4B6049;border-radius:7px;padding:3px 9px;cursor:pointer;" +
          "white-space:nowrap;' + (g === pgGrade ? 'background:#4B6049;color:#fff'" +
          " : 'background:#fff;color:#4B6049'),\n" +
          "        pick: () => this.setState({ pg: g }) })),"
      );
      return out;
    },
  },
  {
    // The writing step follows the EB frame.
    //
    // The page had a five-part frame of its own — My Answer, My Reason, My
    // Proof, Explain It, Wrap It Up. This is the EB Writing Workshop frame:
    // an intro paragraph, then a body paragraph, then a closing line. It
    // adds the two parts the old frame had no slot for — saying what the
    // text is before arguing about it, and walking the reader up to a quote
    // rather than dropping one in — and it keeps the old frame's ending,
    // which an earlier version of this rule dropped without being asked to.
    //
    // The parts are named in words a second grader already uses rather
    // than in the workshop's own terms. A child doing the thinking does not
    // need that vocabulary in order to do it, and the teacher hub carries
    // the workshop's wording for anybody who wants it.
    //
    // Eight lines rather than five. A second grader writes the intro, one
    // body paragraph and the ending; the older grades add a second reason.
    name: "write to the EB frame",
    apply: (html) => {
      const from =
        "const ebFrames = ['\u{1F4E3} My Answer: I think ______.', " +
        "'\u{1F9F1} My Reason: First, ______.', " +
        "'\u{1F50E} My Proof: The text says, \"______.\"', " +
        "'\u{1F517} Explain It: This shows ______.', " +
        "'\u{1F3A4} Wrap It Up: That is why ______.'];";
      if (!html.includes(from)) return html;
      const to =
        "const ebFrames = ['\u{1F3F7}\uFE0F Topic: The story is ______.', " +
        "'\u{1F4D6} What It Is About: It is about ______.', " +
        "'\u{1F4E3} My Claim: I think ______.', " +
        "'\u{1F9F1} My Reason: One reason is ______.', " +
        "'\u{1F50E} In the Story: In the story, ______', " +
        "'\u{1F4CB} My Evidence: For example, ______.', " +
        "'\u{1F517} Why It Matters: This shows ______.', " +
        "'\u{1F3A4} Wrap It Up: That is why ______.'];";
      return html.split(from).join(to);
    },
  },
  {
    // Let the teacher pick the kind of writing.
    //
    // Each passage carries one authored task, and it is a good one, but a
    // teacher working on opinion writing that week should not have to take
    // the narrative task because that is what the passage happens to ship
    // with. The toggle offers all three kinds these grades are taught.
    //
    // The authored task is used whenever its own kind is selected. The
    // other two are built from the passage itself — its title, and the
    // third comprehension question, which is always the one that asks what
    // the text shows rather than what it says, and therefore makes a real
    // opinion prompt. The frames climb with the grade, following what
    // second, third and fourth graders are each expected to manage.
    name: "let the teacher pick the kind of writing",
    apply: (html) => {
      const seat = "const PGX = ((PGS[SEL] || PGS[cur[0]]) || {})[pgGrade] || null;";
      if (!html.includes(seat)) return html;
      const build =
        "\n    const WR_TYPES = ['Opinion', 'Informative', 'Narrative'];\n" +
        "    const WR_SHORT = { Opinion: 'Opinion', Informative: 'Info', Narrative: 'Story' };\n" +
        "    const wrPick = (this.state && this.state.wr) ||\n" +
        "      ((PGX && PGX.write && PGX.write.type) || 'Narrative');\n" +
        "    const wrTask = (() => {\n" +
        "      if (!PGX) return '';\n" +
        "      if (PGX.write && PGX.write.type === wrPick) return PGX.write.task;\n" +
        "      const t = '\u201c' + PGX.title + '\u201d';\n" +
        "      const q = (PGX.qs && PGX.qs[2]) ? PGX.qs[2][0] : '';\n" +
        "      const F = {\n" +
        "        Opinion: {\n" +
        "          g2: q + ' Tell what you think, give two reasons, and write an ending.',\n" +
        "          g3: q + ' Give your opinion with reasons, and link them with because and also.',\n" +
        "          g4: q + ' Group your reasons, support them with facts and details from the text,"
        + " and end with a conclusion.' },\n" +
        "        Informative: {\n" +
        "          g2: 'Write three facts about ' + t + '. Start with a sentence that tells your topic"
        + " and finish with an ending.',\n" +
        "          g3: 'Explain what happens in ' + t + '. Group the related information together and"
        + " use words from the text.',\n" +
        "          g4: 'Write a report on ' + t + '. Organise it into sections, develop each one with"
        + " facts and examples, and connect your ideas.' },\n" +
        "        Narrative: {\n" +
        "          g2: 'Retell ' + t + ' in order. Use first, next and last, and end by telling how"
        + " somebody felt.',\n" +
        "          g3: 'Retell ' + t + ' from somebody else in the story. Use time-order words and"
        + " include something a person says.',\n" +
        "          g4: 'Retell ' + t + ' from somebody else in the story. Establish the situation,"
        + " give a clear sequence of events, and use dialogue and sensory details.' } };\n" +
        "      return (F[wrPick] || {})[pgGrade] || '';\n" +
        "    })();";
      let out = html.replace(seat, seat + build);

      // The toggle, beside the reading one.
      const anchor = '<sc-if value="{{ pgHas }}" hint-placeholder-val="{{ true }}">';
      if (!out.includes(anchor)) return html;
      const control =
        '<sc-if value="{{ pgHas }}" hint-placeholder-val="{{ true }}">' +
        '<span style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;' +
        'border:1.5px solid #C9D3C4;border-radius:999px;background:#F7FAF6">' +
        '<span style="font-family:Outfit,sans-serif;font-size:11px;font-weight:800;' +
        'letter-spacing:.1em;color:#618459;white-space:nowrap">WRITING</span>' +
        '<sc-for list="{{ wrOpts }}" as="w" hint-placeholder-count="3">' +
        '<button type="button" onClick="{{ w.pick }}" style="{{ w.st }}">{{ w.label }}</button>' +
        "</sc-for></span></sc-if>";
      out = out.replace(anchor, control + anchor);

      const dataAnchor = " pgHas: !!PGX,";
      if (!out.includes(dataAnchor)) return html;
      out = out.replace(
        dataAnchor,
        dataAnchor +
          "\n      wrTask, wrPick,\n" +
          "      wrOpts: WR_TYPES.map((w) => ({ w, label: WR_SHORT[w],\n" +
          "        st: 'font-family:Outfit,sans-serif;font-size:12px;font-weight:800;" +
          "border:1.5px solid #4B6049;border-radius:7px;padding:3px 9px;cursor:pointer;" +
          "white-space:nowrap;' + (w === wrPick ? 'background:#4B6049;color:#fff'" +
          " : 'background:#fff;color:#4B6049'),\n" +
          "        pick: () => this.setState({ wr: w }) })),"
      );

      // Show the chosen task on the writing step, under the question.
      const qLine =
        '<div style="font-size:14px;font-weight:800;color:#2F3E2E">' +
        "\u2753 {{ s.question }}</div>";
      if (!out.includes(qLine)) return html;
      const taskBlock =
        qLine +
        '\n                <sc-if value="{{ s.hasTask }}" hint-placeholder-val="{{ false }}">' +
        '<div style="border:1.5px dashed #4B6049;border-radius:10px;padding:9px 12px;' +
        'background:#F7FAF6;display:flex;flex-direction:column;gap:3px">' +
        '<div style="font-family:Outfit,sans-serif;font-size:11px;font-weight:800;' +
        'letter-spacing:.14em;color:#618459">\u270D\uFE0F {{ s.taskType }} WRITING</div>' +
        '<div style="font-size:14px;line-height:1.5;color:#111">{{ s.task }}</div>' +
        "</div></sc-if>";
      out = out.split(qLine).join(taskBlock);

      const step13 = "{ hasPassage: !!ebText, passage: ebText, question: ebPrompt,";
      if (!out.includes(step13)) return html;
      out = out.replace(
        step13,
        step13 + "\n          hasTask: !!wrTask, task: wrTask, taskType: (WR_SHORT[wrPick] || wrPick).toUpperCase(),"
      );
      return out;
    },
  },
  {
    // Two texts when multisyllabic is turned on.
    //
    // Comparing two texts and pulling evidence out of both is a harder job
    // than answering questions about one, and it is the job the
    // multisyllabic switch already signals: this class is ready for more.
    // So that switch now also pairs the passage with a second one and
    // rewrites the questions and the writing task to span both.
    //
    // The companion is chosen so that it is always decodable at this
    // lesson. Within a concept that splits it is the next part along,
    // written to the same point in the sequence. A concept that splits
    // pairs with its own first part. A concept that does not split pairs
    // with the lesson before it in the scope and sequence, which by
    // definition uses less of the code than this one does. The very first
    // lesson has nothing before it and so stays on a single text.
    //
    // The three questions are open on purpose. A comparison has no one
    // right answer, so the key tells the teacher what to look for instead
    // of printing an answer that is not the only one.
    name: "pair a second passage when multisyllabic is on",
    apply: (html) => {
      const seat = "const PGX = ((PGS[SEL] || PGS[cur[0]]) || {})[pgGrade] || null;";
      if (!html.includes(seat)) return html;
      const pair = [
        "",
        "    const SPL = " + JSON.stringify(SPLITS) + ";",
        "    const pgPair = (() => {",
        "      const cid = cur[0];",
        "      const sel = SEL || cid;",
        "      const part = sel.indexOf('|') > -1 ? sel.split('|')[1] : '';",
        "      const ps = SPL[cid] || [];",
        "      if (part) {",
        "        if (ps.length > 1) { const i = ps.indexOf(part);",
        "          return cid + '|' + ps[(i + 1) % ps.length]; }",
        "        return cid;",
        "      }",
        "      if (ps.length) return cid + '|' + ps[0];",
        "      const n = SK.findIndex((s) => s[0] === cid);",
        "      return n > 0 ? SK[n - 1][0] : '';",
        "    })();",
        "    const PGY = (!!(this.state && this.state.multi) && PGX && pgPair)",
        "      ? ((PGS[pgPair] || {})[pgGrade] || null) : null;",
        "    const PGTWO = (PGY && PGY.title !== PGX.title) ? {",
        "      title: PGX.title + '  +  ' + PGY.title,",
        "      paras: ['\u{1F4D8} TEXT 1 — ' + PGX.title].concat(PGX.paras,",
        "        ['\u{1F4D9} TEXT 2 — ' + PGY.title], PGY.paras),",
        "      qs: [",
        "        ['Name one thing that happens in both texts.',",
        "          'Answers vary. Look for one detail from Text 1 and one from Text 2.'],",
        "        ['What is the biggest difference between Text 1 and Text 2?',",
        "          'Answers vary. Look for a difference the child can point to in both.'],",
        "        ['Which text gives the better evidence, and why? Quote one line from each.',",
        "          'Answers vary. Look for an exact quote from Text 1 and one from Text 2.']",
        "      ] } : null;",
        "    const PGV = PGTWO || PGX;",
      ].join("\n");
      let out = html.replace(seat, seat + pair);

      const swaps: [string, string][] = [
        ["const d = (PGX ? [PGX.title, PGX.paras, PGX.qs] : null) ||",
          "const d = (PGV ? [PGV.title, PGV.paras, PGV.qs] : null) ||"],
        ["const ebText = (PGX ? PGX.paras.join('\\n') : null) ||",
          "const ebText = (PGV ? PGV.paras.join('\\n') : null) ||"],
        ["const ebPrompt = (PGX && PGX.qs && PGX.qs[2] ? PGX.qs[2][0] : null) ||",
          "const ebPrompt = (PGV && PGV.qs && PGV.qs[2] ? PGV.qs[2][0] : null) ||"],
        ["      const t = '“' + PGX.title + '”';",
          "      const t = '“' + PGV.title + '”';"],
        ["      const q = (PGX.qs && PGX.qs[2]) ? PGX.qs[2][0] : '';",
          "      const q = (PGV.qs && PGV.qs[2]) ? PGV.qs[2][0] : '';"],
      ];
      for (const [from, to] of swaps) {
        if (!out.includes(from)) return html;
        out = out.split(from).join(to);
      }

      // With two texts the authored single-text task no longer applies, and
      // the writing itself becomes the comparison.
      const guard = "      if (PGX.write && PGX.write.type === wrPick) return PGX.write.task;";
      if (!out.includes(guard)) return html;
      const CF = [
        "      if (PGTWO) {",
        "        const CF = {",
        "          Opinion: {",
        "            g2: 'Which text did you like more, Text 1 or Text 2? Tell what you think, give two reasons, and use one thing from each text.',",
        "            g3: 'Which text makes its point better? Give your opinion with reasons, quote one line from each text, and link your reasons with because and also.',",
        "            g4: 'Which of the two texts makes its point better? Group your reasons, support each one with a quote from a different text, and end with a conclusion.' },",
        "          Informative: {",
        "            g2: 'Write three ways the two texts are the same or different. Use one detail from each text and finish with an ending.',",
        "            g3: 'Explain how the two texts are alike and how they differ. Group the likenesses together, then the differences, and use words from both texts.',",
        "            g4: 'Write a report comparing the two texts. Organise it into sections, develop each one with evidence from both, and connect your ideas.' },",
        "          Narrative: {",
        "            g2: 'Tell what happens in Text 1, then what happens in Text 2. Use first, next and last, and end by saying which one you would rather be in.',",
        "            g3: 'Retell both texts as one story in which the two sets of people meet. Use time-order words and include something a person from each text says.',",
        "            g4: 'Write a scene in which somebody from Text 1 meets somebody from Text 2. Establish the situation, give a clear sequence, and use dialogue that shows what each text had already told you about them.' } };",
        "        return (CF[wrPick] || {})[pgGrade] || '';",
        "      }",
      ].join("\n");
      out = out.replace(guard, CF + "\n" + guard);

      // The reading step says which mode it is in.
      const note = "      pgNote: pgUp ? ((this.state && this.state.multi) ? '↑ multisyllabic'";
      if (!out.includes(note)) return html;
      out = out.replace(
        note,
        "      pgNote: PGTWO ? '↑ two texts to compare' : pgUp"
          + " ? ((this.state && this.state.multi) ? '↑ multisyllabic'"
      );
      return out;
    },
  },
  {
    // The writing toggle, repeated at the writing step.
    //
    // It already sits in the toolbar at the top of the page, which is fine
    // while you are setting the lesson up and useless once you have
    // scrolled down to the step it controls. A teacher who decides at the
    // writing step that today is opinion writing should not have to scroll
    // back up to say so, so the same three buttons sit beside the task.
    //
    // Both copies drive the same state, so pressing either moves both.
    name: "repeat the writing toggle at the writing step",
    apply: (html) => {
      // Build the option list once instead of twice.
      const tail = "      return (F[wrPick] || {})[pgGrade] || '';\n    })();";
      if (!html.includes(tail)) return html;
      const inline =
        "      wrOpts: WR_TYPES.map((w) => ({ w, label: WR_SHORT[w],\n" +
        "        st: 'font-family:Outfit,sans-serif;font-size:12px;font-weight:800;" +
        "border:1.5px solid #4B6049;border-radius:7px;padding:3px 9px;cursor:pointer;" +
        "white-space:nowrap;' + (w === wrPick ? 'background:#4B6049;color:#fff'" +
        " : 'background:#fff;color:#4B6049'),\n" +
        "        pick: () => this.setState({ wr: w }) })),";
      if (!html.includes(inline)) return html;
      let out = html.replace(
        tail,
        tail +
          "\n    const wrOptList = WR_TYPES.map((w) => ({ w, label: WR_SHORT[w],\n" +
          "      st: 'font-family:Outfit,sans-serif;font-size:12px;font-weight:800;" +
          "border:1.5px solid #4B6049;border-radius:7px;padding:3px 9px;cursor:pointer;" +
          "white-space:nowrap;' + (w === wrPick ? 'background:#4B6049;color:#fff'" +
          " : 'background:#fff;color:#4B6049'),\n" +
          "      pick: () => this.setState({ wr: w }) }));"
      );
      out = out.replace(inline, "      wrOpts: wrOptList,");

      const step13 = "          hasTask: !!wrTask, task: wrTask, taskType: (WR_SHORT[wrPick] || wrPick).toUpperCase(),";
      if (!out.includes(step13)) return html;
      out = out.replace(step13, step13 + "\n          taskOpts: wrOptList,");

      // The header row of the task box carries the buttons.
      const head =
        '<div style="font-family:Outfit,sans-serif;font-size:11px;font-weight:800;' +
        'letter-spacing:.14em;color:#618459">✍️ {{ s.taskType }} WRITING</div>';
      if (!out.includes(head)) return html;
      const row =
        '<div style="display:flex;align-items:center;justify-content:space-between;' +
        'gap:8px;flex-wrap:wrap">' +
        '<div style="font-family:Outfit,sans-serif;font-size:11px;font-weight:800;' +
        'letter-spacing:.14em;color:#618459">✍️ {{ s.taskType }} WRITING</div>' +
        '<span style="display:inline-flex;align-items:center;gap:6px">' +
        '<sc-for list="{{ s.taskOpts }}" as="w" hint-placeholder-count="3">' +
        '<button type="button" onClick="{{ w.pick }}" style="{{ w.st }}">{{ w.label }}</button>' +
        "</sc-for></span></div>";
      out = out.split(head).join(row);
      return out;
    },
  },
  {
    // Six kinds of writing, and every grade from K to 12.
    //
    // The step offered Opinion, Info and Story, and the task behind each
    // was written for three grades — 2nd, 3rd and 4th — because those are
    // the three reading levels the passages come in. Those are two
    // different things. A fifth grader reading a 3rd grade passage is
    // still a fifth grader when they write about it, and a kindergarten
    // class has no setting at all.
    //
    // So the writing grade is its own control now, K to 12, separate from
    // which passage is on the page. The types are the three that were here
    // plus Descriptive, Compare & Contrast and Procedural.
    //
    // The frame steps change by band rather than by grade, because a frame
    // is scaffolding and scaffolding changes when the demand does: a 2nd
    // grader needs "One reason is ______", a 7th grader needs somewhere to
    // put the opposing claim, an 11th grader needs the counterclaim
    // answered. Four bands, not thirteen near-identical sets.
    //
    // Picking Compare & Contrast pairs the second passage, the same one
    // the multisyllabic switch pairs. Comparing needs two texts whether or
    // not the words are long.
    name: "give the writing six types and every grade",
    apply: (html) => {
      const types =
        "const WR_TYPES = ['Opinion', 'Informative', 'Narrative'];\n" +
        "    const WR_SHORT = { Opinion: 'Opinion', Informative: 'Info', Narrative: 'Story' };";
      if (!html.includes(types)) return html;
      const block =
        "const WT = " + JSON.stringify(WTYPES) + ";\n" +
        "    const WR_TYPES = WT.types.map((t) => t.label);\n" +
        "    const wrType = (lbl) => WT.types.find((t) => t.label === lbl) || WT.types[0];\n" +
        "    // The passage's own reading level is the sensible first guess at\n" +
        "    // the writing grade, and only that: the teacher moves it.\n" +
        "    const wrGrade = (this.state && this.state.wrg) ||\n" +
        "      ({ g2: '2', g3: '3', g4: '4' })[pgGrade] || '3';\n" +
        "    const wrBand = Object.keys(WT.bands)\n" +
        "      .find((b) => WT.bands[b].indexOf(wrGrade) > -1) || 'g35';\n" +
        // What a type is called at the grade being written for. Opinion
        // becomes Argument at 6th because the standards do, and the
        // child-facing words — Story, Info, How-to — become the words a
        // student is expected to use about their own writing. The type is
        // the same; wrPick still holds its one canonical label.
        "    const WR_SHORT = Object.fromEntries(WT.types.map((t) =>\n" +
        "      [t.label, (t.chips && t.chips[wrBand]) || t.short]));";
      let out = html.replace(types, block);

      // the task, from the chosen type and grade
      // The hand-written task short-circuits the whole chooser, which was
      // right when there were three grades and they were the passage's. It
      // has to answer to the writing grade now.
      const short =
        "      if (PGX.write && PGX.write.type === wrPick) return PGX.write.task;";
      if (!out.includes(short)) return html;
      out = out.replace(
        short,
        "      if (PGX.write && PGX.write.type === wrPick &&\n" +
          "        wrGrade === ({ g2: '2', g3: '3', g4: '4' })[pgGrade]) return PGX.write.task;"
      );

      const task =
        "      return (F[wrPick] || {})[pgGrade] || '';\n" +
        "    })();";
      if (!out.includes(task)) return html;
      out = out.replace(
        task,
        "      const picked = wrType(wrPick);\n" +
          "      // The hand-written task wins where it is the same type at the\n" +
          "      // same grade; it was written for this passage and the general\n" +
          "      // one was not.\n" +
          "      const gen = (picked.tasks[wrGrade] || '')\n" +
          "        .split('{T}').join(t).split('{Q}').join(q);\n" +
          "      return gen || (F[wrPick] || {})[pgGrade] || '';\n" +
          "    })();\n" +
          "    // The frame follows the type, not the passage.\n" +
          "    const wrFrames = (wrType(wrPick).frame[wrBand] || []).slice();"
      );

      // the frame, on the lesson card and in the workbook
      const stepFrames =
        "ebFrames.map((t) => t.replace('For example, ______.', 'The text says, \"______.\"')), true)";
      if (!out.includes(stepFrames)) return html;
      // The lesson card is the teacher's glance at the frame, not the paper
      // a child writes on, so it shows where each part starts and leaves the
      // blank to the workbook. Six underscores set in Poppins come out as
      // six separate dashes, which is what the blanks looked like.
      out = out.replace(
        stepFrames,
        "wrFrames.map((t) => t.replace(/\\s*_{3,}\\s*\\.?/g, '\\u2026')), true)",
      );
      const propFrames =
        "ebFrames: ebFrames.map((t) => ({ t: t.replace('For example, ______.', " +
        "'The text says, \"______.\"') })),";
      if (!out.includes(propFrames)) return html;
      out = out.replace(propFrames, "ebFrames: wrFrames.map((t) => ({ t })),");

      // six buttons, not three, and a grade beside them
      const forTypes = '<sc-for list="{{ wrOpts }}" as="w" hint-placeholder-count="3">';
      if (!out.includes(forTypes)) return html;
      out = out.replace(
        forTypes,
        '<select value="{{ wrGrade }}" onChange="{{ wrGradePick }}" aria-label="Writing grade" ' +
          "style=\"font-family:'Poppins',sans-serif;font-size:11.5px;font-weight:700;padding:2px 4px;" +
          'border:1.5px solid #4B6049;border-radius:7px;background:#fff;color:#4B6049">' +
          '<sc-for list="{{ wrGradeOpts }}" as="g" hint-placeholder-count="13">' +
          '<option value="{{ g.id }}">{{ g.label }}</option></sc-for></select>' +
          '<sc-for list="{{ wrOpts }}" as="w" hint-placeholder-count="6">'
      );

      const data = "\n      wrTask, wrPick,";
      if (!out.includes(data)) return html;
      out = out.replace(
        data,
        data +
          "\n      wrGrade,\n" +
          "      wrGradeOpts: WT.grades.map((g) => ({ id: g,\n" +
          "        label: g === 'K' ? 'K' : g + (({ 1: 'st', 2: 'nd', 3: 'rd' })[g] || 'th') })),\n" +
          "      wrGradePick: (e) => this.setState({ wrg: e.target.value }),"
      );

      // comparing needs two texts, switch or no switch
      const gate = "const PGY = (!!(this.state && this.state.multi) && PGX && pgPair)";
      if (!out.includes(gate)) return html;
      return out.replace(
        gate,
        "const PGY = ((!!(this.state && this.state.multi) || " +
          // Read off state rather than wrPick: the pairing is declared
          // beside PGX, which is above where wrPick is worked out.
          "(this.state && this.state.wr) === 'Compare & Contrast') && PGX && pgPair)"
      );
    },
  },
  {
    // The mysteries, after Writing Made Easy.
    //
    // 468 of them, one a week for thirty-six weeks at every grade from K to
    // 12, each a claim-and-evidence task in disguise: say who did it, then
    // prove it from the text. That is the same job the writing step asks
    // for, which is why it belongs directly after it rather than anywhere
    // else in the lesson.
    //
    // Two versions. Solve has one culprit and the text rules the others
    // out. Debate withholds the deciding line: three suspects are each
    // arguable, and what is marked is the evidence and the reasoning rather
    // than the name. Both are written for every case.
    //
    // The case is picked by the writing grade and the lesson's place in the
    // sequence, so every lesson gets a different one and the same lesson
    // always gets the same one — a teacher who plans Monday on Sunday needs
    // Monday to still say the same thing. Both pickers are there to
    // override it.
    //
    // The data goes in its own JSON block rather than into the logic
    // source. It is 1.9 MB, the logic class is compiled with new Function
    // on every load, and JSON.parse on a script tag is the cheap way round
    // that.
    name: "bring the mysteries in after the writing step",
    apply: (html) => {
      const trim = (MYSTERIES as { cases: Record<string, unknown>[] }).cases.map((c) => ({
        g: c.grade, w: c.week, t: c.tag, n: c.title, s: c.story, q: c.question,
        u: (c.suspects as { who: string; why: string }[]).map((x) => ({ w: x.who, y: x.why })),
        a: c.answer, p: c.proof, c: c.clears, e: c.explain,
        d: c.debate ? (() => { const d = c.debate as Record<string, unknown>; return {
          s: d.story, q: d.question,
          u: (d.suspects as { who: string; why: string }[]).map((x) => ({ w: x.who, y: x.why })),
          o: d.open,
          g: (d.arguments as { who: number; evidence: string[]; against: string }[])
            .map((a) => ({ w: a.who, e: a.evidence, x: a.against })),
          c: d.clears, t: d.note }; })() : null,
      }));

      const end = "</body>";
      if (!html.includes(end)) return html;
      let out = html.replace(
        end,
        '<script id="sor-mysteries" type="application/json">' +
          JSON.stringify(trim).replace(/</g, "\\u003c") +
          "</script>\n" + end,
      );

      // the lesson's own case, worked out beside the writing props
      const seat = "\n      wrTask, wrPick,";
      if (!out.includes(seat)) return html;
      const logic =
        seat +
        "\n      ...(() => {\n" +
        "        const MYS = (() => { try {\n" +
        "          return JSON.parse(document.getElementById('sor-mysteries').textContent);\n" +
        "        } catch (e) { return []; } })();\n" +
        "        // Two coaches, because they have to believe different things.\n" +
        "        // The solve coach must not know who did it or it leaks it; the\n" +
        "        // debate coach must not think there is an answer at all, or it\n" +
        "        // steers the child to whichever suspect it settled on.\n" +
        "        const MYC = " + JSON.stringify(MYSTERYCOACH.lines.join("\n")) + ";\n" +
        "        const MYD = " + JSON.stringify(MYSTERYDEBATECOACH.lines.join("\n")) + ";\n" +
        "        const gNum = (g) => (g === 'K' ? 0 : Number(g));\n" +
        "        const myg = (this.state && this.state.myg) || wrGrade;\n" +
        "        const pool = MYS.filter((c) => c.g === gNum(myg));\n" +
        "        // The lesson's place in the sequence picks the week, so the\n" +
        "        // thirty-six cases spread across the thirty-six lessons\n" +
        "        // instead of every lesson opening on week one.\n" +
        "        const auto = String((Math.max(0, skIdx) % 36) + 1);\n" +
        "        const myw = (this.state && this.state.myw) || auto;\n" +
        "        const C = pool.find((c) => String(c.w) === String(myw)) || pool[0] || null;\n" +
        "        const dbOn = !!(this.state && this.state.mydb) && !!(C && C.d);\n" +
        "        const D = dbOn ? C.d : null;\n" +
        "        const sus = C ? (D ? D.u : C.u) : [];\n" +
        "        const pill = (on) => 'font-family:Poppins,system-ui,sans-serif;font-size:12px;" +
        "font-weight:800;border:1.5px solid #7A4E6B;border-radius:7px;padding:3px 10px;" +
        "cursor:pointer;white-space:nowrap;' + (on ? 'background:#7A4E6B;color:#fff'" +
        " : 'background:#fff;color:#7A4E6B');\n" +
        "        return {\n" +
        "          myHas: !!C,\n" +
        "          myKicker: C ? (myg === 'K' ? 'Kindergarten' : 'Grade ' + myg) + ' \\u00b7 Week ' + C.w : '',\n" +
        "          myTag: C ? C.t : '', myTitle: C ? C.n : '',\n" +
        "          myStory: C ? (D ? D.s : C.s) : '', myQ: C ? (D ? D.q : C.q) : '',\n" +
        "          mySus: sus.map((s, i) => ({ w: s.w, y: s.y,\n" +
        "            open: !!(D && D.o.indexOf(i) > -1) })),\n" +
        "          myTask: D\n" +
        "            ? 'Name the one you are charging. Quote at least two lines from the case, " +
        "and after each one say what it shows. Then name the strongest line against you and answer it.'\n" +
        "            : 'Say who did it. Quote the words from the case that prove it, and say what " +
        "rules each of the others out.',\n" +
        "          myDbOn: dbOn, mySolveOn: !dbOn, myHasDb: !!(C && C.d),\n" +
        "          myNote: dbOn\n" +
        "            ? 'No answer key. Three suspects are arguable; the evidence is what counts.'\n" +
        "            : 'One culprit. The case rules the others out.',\n" +
        "          mySolveSt: pill(!dbOn), myDebateSt: pill(dbOn),\n" +
        "          mySolvePick: () => this.setState({ mydb: false }),\n" +
        "          myDebatePick: () => this.setState({ mydb: true }),\n" +
        "          myGrade: myg,\n" +
        "          myGradeOpts: WT.grades.map((g) => ({ id: g,\n" +
        "            label: g === 'K' ? 'K' : g + (({ 1: 'st', 2: 'nd', 3: 'rd' })[g] || 'th') })),\n" +
        "          myGradePick: (e) => this.setState({ myg: e.target.value, myw: '' }),\n" +
        "          myWeek: String(myw),\n" +
        "          myWeekOpts: pool.map((c) => ({ id: String(c.w), label: 'Week ' + c.w + ' \\u00b7 ' + c.n })),\n" +
        "          myWeekPick: (e) => this.setState({ myw: e.target.value }),\n" +
        "          myKeyOpen: !!(this.state && this.state.mykey),\n" +
        "          toggleMyKey: () => this.setState({ mykey: !(this.state && this.state.mykey) }),\n" +
        "          myKeyBtn: (this.state && this.state.mykey ? 'Hide ' : 'Show ') +\n" +
        "            (dbOn ? '\\u{1F511} Teacher notes' : '\\u{1F511} Answer key'),\n" +
        "          myAnswer: C && !dbOn ? C.a : '', myExplain: C && !dbOn ? C.e : '',\n" +
        "          myProof: C && !dbOn ? C.p.map((t) => ({ t })) : [],\n" +
        "          myClears: C ? (dbOn ? D.c : C.c).map((t) => ({ t })) : [],\n" +
        "          myArgs: dbOn ? D.g.map((a) => ({ who: (D.u[a.w] || {}).w || '',\n" +
        "            ev: a.e.map((t) => ({ t })), against: a.x || '' })) : [],\n" +
        "          myDebateNote: dbOn ? D.t : '',\n" +
        "          myPrompt: C ? (dbOn ? MYD : MYC)\n" +
        "            .split('{GRADES}').join(myg === 'K' ? 'kindergarten'\n" +
        "              : myg + (({ 1: 'st', 2: 'nd', 3: 'rd' })[myg] || 'th'))\n" +
        "            .split('{TITLE}').join(C.n)\n" +
        "            .replace('{STORY}', dbOn ? D.s : C.s)\n" +
        "            .replace('{QUESTION}', dbOn ? D.q : C.q)\n" +
        "            .replace('{SUSPECTS}', sus.map((x) => '- ' + x.w + ': ' + x.y).join('\\n'))\n" +
        "            .replace('{OPEN}', dbOn ? D.o.map((i) => '- ' + D.u[i].w).join('\\n') : '')\n" +
        "            : '',\n" +
        "          myPromptOpen: !!(this.state && this.state.myprompt),\n" +
        "          toggleMyPrompt: () => this.setState({\n" +
        "            myprompt: !(this.state && this.state.myprompt) }),\n" +
        "          myPromptBtn: (this.state && this.state.myprompt ? 'Hide' : 'Show') + ' prompt',\n" +
        "          copyMyLabel: (this.state && this.state.mycopied)\n" +
        "            ? '\\u2713 Copied' : '\\u{1F4CB} Copy prompt',\n" +
        "          copyMyPrompt: () => {\n" +
        "            const text = (dbOn ? MYD : MYC)\n" +
        "              .split('{GRADES}').join(myg === 'K' ? 'kindergarten'\n" +
        "                : myg + (({ 1: 'st', 2: 'nd', 3: 'rd' })[myg] || 'th'))\n" +
        "              .split('{TITLE}').join(C ? C.n : '')\n" +
        "              .replace('{STORY}', C ? (dbOn ? D.s : C.s) : '')\n" +
        "              .replace('{QUESTION}', C ? (dbOn ? D.q : C.q) : '')\n" +
        "              .replace('{SUSPECTS}', sus.map((x) => '- ' + x.w + ': ' + x.y).join('\\n'))\n" +
        "              .replace('{OPEN}', dbOn ? D.o.map((i) => '- ' + D.u[i].w).join('\\n') : '');\n" +
        "            const ok = () => this.setState({ mycopied: true });\n" +
        "            const no = () => this.setState({ myprompt: true });\n" +
        "            try { const r = navigator.clipboard.writeText(text);\n" +
        "              if (r && r.then) r.then(ok, no); else ok(); } catch (e) { no(); } },\n" +
        "        };\n" +
        "      })(),";
      out = out.replace(seat, logic);

      // the block itself, between the last lesson step and the workbook bar
      const wbBar =
        '  <div data-noprint="true" style="display:flex;align-items:center;' +
        'justify-content:space-between;gap:12px;flex-wrap:wrap;background:#fff;' +
        'border:1.5px solid #C9D3C4;border-radius:12px;padding:12px 16px">';
      if (!out.includes(wbBar)) return html;
      const F = "font-family:Poppins,system-ui,sans-serif;";
      const block =
        '  <sc-if value="{{ myHas }}" hint-placeholder-val="{{ true }}">\n' +
        '  <div style="background:#fff;border:1.5px solid #C9D3C4;border-left:4px solid #7A4E6B;' +
        'border-radius:12px;padding:14px 16px;display:flex;flex-direction:column;gap:10px">\n' +
        '    <div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px">\n' +
        '      <span style="' + F + 'font-size:11px;font-weight:800;letter-spacing:.14em;' +
        'color:#7A4E6B;white-space:nowrap">\u{1F50D} MYSTERY</span>\n' +
        '      <span style="font-size:12.5px;color:#57534e">{{ myKicker }}</span>\n' +
        '      <select value="{{ myGrade }}" onChange="{{ myGradePick }}" aria-label="Mystery grade" ' +
        'style="' + F + "font-size:11.5px;font-weight:700;padding:2px 4px;border:1.5px solid #7A4E6B;" +
        'border-radius:7px;background:#fff;color:#7A4E6B">' +
        '<sc-for list="{{ myGradeOpts }}" as="g" hint-placeholder-count="13">' +
        '<option value="{{ g.id }}">{{ g.label }}</option></sc-for></select>\n' +
        '      <select value="{{ myWeek }}" onChange="{{ myWeekPick }}" aria-label="Mystery case" ' +
        'style="' + F + "font-size:11.5px;font-weight:700;padding:2px 4px;border:1.5px solid #7A4E6B;" +
        'border-radius:7px;background:#fff;color:#7A4E6B;max-width:240px">' +
        '<sc-for list="{{ myWeekOpts }}" as="w" hint-placeholder-count="36">' +
        '<option value="{{ w.id }}">{{ w.label }}</option></sc-for></select>\n' +
        '      <sc-if value="{{ myHasDb }}" hint-placeholder-val="{{ true }}">' +
        '<button type="button" onClick="{{ mySolvePick }}" style="{{ mySolveSt }}">\u{1F50D} Solve it</button>' +
        '<button type="button" onClick="{{ myDebatePick }}" style="{{ myDebateSt }}">\u{1F4AC} Debate it</button>' +
        "</sc-if>\n" +
        "    </div>\n" +
        '    <div style="font-size:12.5px;color:#57534e">{{ myNote }}</div>\n' +
        '    <div style="display:flex;flex-wrap:wrap;align-items:baseline;gap:8px">' +
        '<b style="font-size:19px;color:#2F3E2E">{{ myTitle }}</b>' +
        '<span style="font-size:12.5px;color:#57534e">{{ myTag }}</span></div>\n' +
        '    <div style="font-size:15.5px;line-height:1.6;color:#1c1917;text-wrap:pretty;' +
        'border-left:3px solid #E4D3A8;padding-left:12px">{{ myStory }}</div>\n' +
        '    <div style="font-size:15px;font-weight:800;color:#2F3E2E">❓ {{ myQ }}</div>\n' +
        '    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px">\n' +
        '      <sc-for list="{{ mySus }}" as="s" hint-placeholder-count="4">\n' +
        '        <div style="border:1.5px solid #C9D3C4;border-radius:10px;padding:8px 11px;font-size:13.5px">' +
        '<b>{{ s.w }}</b>' +
        '<sc-if value="{{ s.open }}" hint-placeholder-val="{{ false }}">' +
        '<span style="' + F + 'font-size:10px;font-weight:800;letter-spacing:.1em;color:#7A4E6B;' +
        'margin-left:6px">\u00a0IN PLAY</span></sc-if>' +
        '<span style="color:#44403c"> — {{ s.y }}</span></div>\n' +
        "      </sc-for>\n" +
        "    </div>\n" +
        '    <div style="font-size:14px;line-height:1.55;background:#FDF6E7;border:1.5px solid #E4D3A8;' +
        'border-radius:10px;padding:9px 12px"><b>Then write:</b> {{ myTask }}</div>\n' +
        '    <div style="display:flex;gap:7px;flex-wrap:wrap">' +
        '<button type="button" onClick="{{ copyMyPrompt }}" style="' + F +
        'font-size:12.5px;font-weight:700;border:1.5px solid #2F7A8C;background:#fff;color:#2F7A8C;' +
        'padding:6px 12px;border-radius:8px;cursor:pointer">{{ copyMyLabel }}</button>' +
        '<button type="button" onClick="{{ toggleMyPrompt }}" style="' + F +
        'font-size:12.5px;font-weight:700;border:1.5px solid #2F7A8C;background:#fff;color:#2F7A8C;' +
        'padding:6px 12px;border-radius:8px;cursor:pointer">{{ myPromptBtn }}</button></div>\n' +
        '    <sc-if value="{{ myPromptOpen }}" hint-placeholder-val="{{ false }}">' +
        '<div style="white-space:pre-wrap;font-family:ui-monospace,Menlo,monospace;font-size:11.5px;' +
        'line-height:1.5;color:#1c1917;background:#F6F8F4;border:1px solid #C9D3C4;border-radius:8px;' +
        'padding:9px 10px;max-height:320px;overflow:auto">{{ myPrompt }}</div></sc-if>\n' +
        '    <div><button type="button" onClick="{{ toggleMyKey }}" style="' + F +
        'font-size:12.5px;font-weight:700;border:1.5px solid #57534e;background:#fff;color:#57534e;' +
        'padding:5px 11px;border-radius:8px;cursor:pointer">{{ myKeyBtn }}</button></div>\n' +
        '    <sc-if value="{{ myKeyOpen }}" hint-placeholder-val="{{ false }}">\n' +
        '      <div style="background:#F6F8F4;border:1.5px solid #C9D3C4;border-radius:10px;' +
        'padding:10px 13px;font-size:13.5px;line-height:1.55;display:flex;flex-direction:column;gap:7px">\n' +
        '        <sc-if value="{{ myDbOn }}" hint-placeholder-val="{{ false }}">\n' +
        "          <div><b>There is no answer to this one.</b> Any of the three marked in play can be " +
        "argued from the text. What is marked is the evidence and the reasoning, not the name.</div>\n" +
        '          <sc-for list="{{ myArgs }}" as="a" hint-placeholder-count="3">\n' +
        "            <div><b>{{ a.who }}</b>" +
        '<sc-for list="{{ a.ev }}" as="e" hint-placeholder-count="2">' +
        '<div style="color:#44403c">• {{ e.t }}</div></sc-for>' +
        '<div style="color:#8F5E2F">× Has to answer: {{ a.against }}</div></div>\n' +
        "          </sc-for>\n" +
        "          <div><b>Really is ruled out</b>" +
        '<sc-for list="{{ myClears }}" as="c" hint-placeholder-count="1">' +
        '<div style="color:#44403c">× {{ c.t }}</div></sc-for></div>\n' +
        "          <div><i>{{ myDebateNote }}</i></div>\n" +
        "        </sc-if>\n" +
        '        <sc-if value="{{ mySolveOn }}" hint-placeholder-val="{{ true }}">\n' +
        "          <div><b>Answer:</b> {{ myAnswer }}</div>\n" +
        "          <div><b>Key proof:</b>" +
        '<sc-for list="{{ myProof }}" as="p" hint-placeholder-count="2">' +
        '<div style="color:#44403c">\u2022 {{ p.t }}</div></sc-for></div>\n' +
        "          <div><b>Clears:</b>" +
        '<sc-for list="{{ myClears }}" as="c" hint-placeholder-count="2">' +
        '<div style="color:#44403c">\u00d7 {{ c.t }}</div></sc-for></div>\n' +
        "          <div><i>{{ myExplain }}</i></div>\n" +
        "        </sc-if>\n" +
        "      </div>\n" +
        "    </sc-if>\n" +
        "  </div>\n" +
        "  </sc-if>\n\n";
      return out.replace(wbBar, block + wbBar);
    },
  },
  {
    // Three things a teacher noticed on the page.
    //
    // 1. The sentence starters wrote their blanks as six underscores. In
    //    Poppins those render as six separate dashes with gaps, so the
    //    line a child writes on is dotted. A blank is a rule to write on,
    //    not a character: it is a border now, and it stretches to fill the
    //    space instead of being however long six underscores happen to be.
    //
    // 2. Chest 1 wrapped long words onto a second line inside their box,
    //    which breaks the two-colour highlight — a child colours a box,
    //    not a line. The words stay on one line and the type steps down to
    //    fit, which is the trade a highlighting task wants.
    //
    // 3. The word ladder gave its clues in order and numbered none of
    //    them, so a child reading down the column had to infer that the
    //    order mattered.
    name: "solid lines, words that fit, and a numbered ladder",
    apply: (html) => {
      // 1. the blanks
      const frameProp = "ebFrames: wrFrames.map((t) => ({ t })),";
      if (!html.includes(frameProp)) return html;
      let out = html.replace(
        frameProp,
        "ebFrames: wrFrames.map((t) => ({ t, parts: String(t).split(/_{3,}/)\n" +
          "        .reduce((a, x, i) => { if (i) a.push({ line: true, text: '' });\n" +
          "          if (x) a.push({ line: false, text: x }); return a; }, []) })),",
      );

      const frameCell =
        '<div style="font-size:15px;font-weight:700;color:#111">{{ f.t }}</div>';
      if (!out.includes(frameCell)) return html;
      const ruled =
        '<div style="font-size:15px;font-weight:700;color:#111;display:flex;' +
        'flex-wrap:wrap;align-items:baseline;gap:3px">' +
        '<sc-for list="{{ f.parts }}" as="q" hint-placeholder-count="3">' +
        '<sc-if value="{{ q.line }}" hint-placeholder-val="{{ false }}">' +
        '<span style="flex:1 1 110px;min-width:70px;border-bottom:1.5px solid #111;' +
        'height:1.2em"></span></sc-if>' +
        '<sc-if value="{{ q.text }}" hint-placeholder-val="{{ true }}">' +
        "<span>{{ q.text }}</span></sc-if>" +
        "</sc-for></div>";
      out = out.split(frameCell).join(ruled);

      // 2. the chips, which stay on one line
      const chip =
        "const chip = (t, big) => ({ fontSize: big ? 20 : (t.length > 12 ? 14 : 17), " +
        "fontWeight: 700, border: '1.5px solid #000', borderRadius: 8, padding: '5px 9px', " +
        "textAlign: 'center', overflowWrap: 'anywhere', boxSizing: 'border-box' });";
      if (!out.includes(chip)) return html;
      out = out.replace(
        chip,
        "const chip = (t, big) => { const n = String(t).length;\n" +
          "          // One line, always. A box a child colours cannot wrap.\n" +
          "          const fs = big ? 20 : n > 15 ? 10.5 : n > 13 ? 12 : n > 11 ? 13.5\n" +
          "            : n > 9 ? 15 : 17;\n" +
          "          return { fontSize: fs, fontWeight: 700, border: '1.5px solid #000',\n" +
          "            borderRadius: 8, padding: '5px 7px', textAlign: 'center',\n" +
          "            whiteSpace: 'nowrap', overflow: 'hidden', boxSizing: 'border-box' }; };",
      );

      // 3. the ladder, numbered
      const ladder =
        "{ items: LX.clues.map((c, i) => [c, (LX.words || [])[i + 1] || '']),";
      if (!out.includes(ladder)) return html;
      return out.replace(
        ladder,
        "{ items: LX.clues.map((c, i) => [(i + 1) + '. ' + c, (LX.words || [])[i + 1] || '']),",
      );
    },
  },
  {
    // The reading level, as a grade rather than a text number.
    //
    // The row offered 2nd, 3rd and 4th, which are the three reading levels
    // every passage is written at. A teacher does not think in text levels,
    // they think in the class in front of them, and a 7th grade
    // intervention group had no setting on that row at all.
    //
    // So it asks for the grade, K to 12, and says which of the three texts
    // that lands on. Thirteen grades onto three passages is the honest
    // shape of it: there are three texts, and pretending there are thirteen
    // would mean a teacher picking 7th and getting the 4th grade text
    // without being told.
    name: "ask the reading row for a grade, K to 12",
    apply: (html) => {
      const grade =
        "const pgGrade = pgUp\n" +
        "      ? PG_ORDER[Math.min(2, PG_ORDER.indexOf(pgBase) + 1)] : pgBase;";
      if (!html.includes(grade)) return html;
      let out = html.replace(
        grade,
        "const pgRead = (this.state && this.state.pgg) || '';\n" +
          "    // Three texts, thirteen grades. Below 3rd reads the 2nd grade\n" +
          "    // text, 3rd reads its own, and 4th upwards read the 4th, which\n" +
          "    // is the hardest one written.\n" +
          "    const pgFromGrade = !pgRead ? ''\n" +
          "      : (pgRead === 'K' || pgRead === '1' || pgRead === '2') ? 'g2'\n" +
          "      : pgRead === '3' ? 'g3' : 'g4';\n" +
          "    const pgGrade = pgFromGrade || (pgUp\n" +
          "      ? PG_ORDER[Math.min(2, PG_ORDER.indexOf(pgBase) + 1)] : pgBase);",
      );

      const opts =
        "pgOpts: PG_ORDER.map((g) => ({ g, label: PG_NAME[g],";
      if (!out.includes(opts)) return html;
      out = out.replace(
        opts,
        "pgReadGrade: pgRead || ({ g2: '2', g3: '3', g4: '4' })[pgGrade] || '3',\n" +
          "      pgReadOpts: WT.grades.map((g) => ({ id: g,\n" +
          "        label: g === 'K' ? 'K' : g + (({ 1: 'st', 2: 'nd', 3: 'rd' })[g] || 'th') })),\n" +
          "      pgReadPick: (e) => this.setState({ pg: '', pgg: e.target.value }),\n" +
          "      pgLands: 'reads the ' + (PG_NAME[pgGrade] || '') + ' text',\n" +
          "      pgOpts: PG_ORDER.map((g) => ({ g, label: PG_NAME[g],",
      );

      const row =
        '            <sc-for list="{{ pgOpts }}" as="o" hint-placeholder-count="3">\n' +
        '              <button type="button" onClick="{{ o.pick }}" style="{{ o.st }}">{{ o.label }}</button>\n' +
        "            </sc-for>";
      if (!out.includes(row)) return html;
      return out.replace(
        row,
        '            <select value="{{ pgReadGrade }}" onChange="{{ pgReadPick }}" ' +
          'aria-label="Reading grade" style="font-family:\'Poppins\',sans-serif;font-size:11.5px;' +
          "font-weight:700;padding:2px 4px;border:1.5px solid #4B6049;border-radius:7px;" +
          'background:#fff;color:#4B6049">' +
          '<sc-for list="{{ pgReadOpts }}" as="g" hint-placeholder-count="13">' +
          '<option value="{{ g.id }}">{{ g.label }}</option></sc-for></select>\n' +
          '            <span style="font-size:11px;font-weight:700;color:#618459;' +
          'white-space:nowrap">{{ pgLands }}</span>',
      );
    },
  },
  {
    // The mystery, on paper.
    //
    // It is on the screen under Writing Made Easy, which is where a teacher
    // sets it up. The page a child works on is the printed workbook, so the
    // case has to be there too — the story to read, the suspects to weigh,
    // the question, and ruled lines to answer it on.
    //
    // It prints as its own sheet right after the writing page, because the
    // two are the same job: make a claim, then prove it from the text. In
    // debate the sheet asks for the line that works against them as well,
    // which is the part that makes it an argument rather than a guess.
    name: "print the mystery in the workbook",
    apply: (html) => {
      const close =
        "I read it back out loud</span></div>\n      </div>\n    </div>";
      if (!html.includes(close)) return html;
      const F = "font-family:Poppins,system-ui,sans-serif;";
      const page =
        close +
        '\n    <sc-if value="{{ myHas }}" hint-placeholder-val="{{ true }}">\n' +
        '    <div data-wb="true" style="{{ p.box1 }}">\n' +
        '      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:12px;' +
        'border-bottom:3px solid #000;padding-bottom:8px">\n' +
        '        <div><div style="' + F + "font-size:12px;font-weight:700;letter-spacing:.16em;" +
        'color:#000">{{ p.kicker }} · MYSTERY · {{ myKicker }}</div>' +
        '<div style="font-size:26px;font-weight:800;color:#000">\u{1F50D} {{ myTitle }}</div></div>\n' +
        '        <div style="font-size:14px;font-weight:600;white-space:nowrap">Name ______________</div>\n' +
        "      </div>\n" +
        '      <div style="display:flex;flex-direction:column;gap:8px">\n' +
        '        <div style="font-size:15px;font-weight:800;color:#111">8. The case. Read it twice. ' +
        "The second time, underline anything that could be proof.</div>\n" +
        '        <div style="border:2px solid #111;border-radius:10px;padding:12px 16px;' +
        'font-size:15.5px;line-height:1.7;color:#111;text-wrap:pretty">{{ myStory }}</div>\n' +
        '        <div style="border:2.5px solid #111;border-radius:10px;padding:8px 14px;' +
        'font-size:19px;font-weight:800;color:#111">❓ {{ myQ }}</div>\n' +
        '        <div style="display:flex;align-items:baseline;gap:9px;margin-top:2px">' +
        '<span style="' + F + 'font-size:11px;font-weight:800;letter-spacing:.12em;background:#111;color:#fff;border-radius:999px;padding:2px 9px;flex:none">STEP 1</span>' +
        '<span style="font-size:14.5px;font-weight:700;color:#111;line-height:1.4">Who did it? Circle one.</span>' +
        '</div>\n' +
        '        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px">\n' +
        '          <sc-for list="{{ mySus }}" as="s" hint-placeholder-count="4">\n' +
        '            <div style="border:2px solid #111;border-radius:999px;padding:7px 13px;' +
        'font-size:15px;font-weight:700;color:#111;display:flex;align-items:center;gap:8px">' +
        '<span style="width:15px;height:15px;border:2px solid #111;border-radius:50%;flex:none">' +
        "</span><b>{{ s.w }}</b></div>\n" +
        "          </sc-for>\n" +
        "        </div>\n" +
        '        <div style="display:flex;align-items:baseline;gap:9px;margin-top:2px">' +
        '<span style="' + F + 'font-size:11px;font-weight:800;letter-spacing:.12em;background:#111;color:#fff;border-radius:999px;padding:2px 9px;flex:none">STEP 2</span>' +
        '<span style="font-size:14.5px;font-weight:700;color:#111;line-height:1.4">What proves it? Find the words in the case, highlight them, then copy them here.</span>' +
        '</div>\n' +
        '        <div style="border:2px solid #111;border-radius:10px;padding:9px 13px;' +
        'display:flex;flex-direction:column;gap:11px">' +
        '<div style="display:flex;align-items:flex-end;gap:5px;font-size:17px;font-weight:700">' +
        '<span>\u201c</span><span style="flex:1;border-bottom:2px solid #111;min-height:23px">' +
        '</span><span>\u201d</span></div>' +
        '<div style="display:flex;align-items:flex-end;gap:5px;font-size:17px;font-weight:700">' +
        '<span>\u201c</span><span style="flex:1;border-bottom:2px solid #111;min-height:23px">' +
        '</span><span>\u201d</span></div></div>\n' +
        '        <div style="display:flex;align-items:baseline;gap:9px;margin-top:2px">' +
        '<span style="' + F + 'font-size:11px;font-weight:800;letter-spacing:.12em;background:#111;color:#fff;border-radius:999px;padding:2px 9px;flex:none">STEP 3</span>' +
        '<span style="font-size:14.5px;font-weight:700;color:#111;line-height:1.4">Why does that prove it? Say what the words show.</span>' +
        '</div>\n' +
        '        <div style="font-size:15.5px;line-height:2.5;color:#111">' +
        'I know <span style="display:inline-block;min-width:150px;border-bottom:2px solid #111">' +
        '</span> did it because the case says ' +
        '<span style="display:inline-block;min-width:200px;border-bottom:2px solid #111"></span>.' +
        '<br>That shows <span style="display:inline-block;min-width:320px;' +
        'border-bottom:2px solid #111"></span>' +
        '<br><span style="display:inline-block;width:100%;border-bottom:2px solid #111">' +
        '</span></div>\n' +
        '        <div style="font-size:13.5px;font-weight:700;color:#111;border:2px dashed #111;' +
        'border-radius:10px;padding:7px 12px">\u270D\uFE0F {{ myTask }}</div>\n' +
        '        <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:13.5px;font-weight:700;' +
        'border:2px solid #111;border-radius:10px;padding:8px 12px;color:#111">' +
        "<span>I did it right if\u2026</span><span>\u2610 I circled one</span>" +
        "<span>\u2610 I highlighted the words in the case</span>" +
        "<span>\u2610 I copied the quote</span>" +
        "<span>\u2610 I said what the quote shows</span></div>\n" +
        "      </div>\n" +
        "    </div>\n" +
        "    </sc-if>";
      return html.split(close).join(page);
    },
  },
  {
    // Three things a lesson can read, not one.
    //
    // The reading row chose a level and never a text: every lesson read the
    // concept passage written for it. Two other sets already exist and
    // neither was reachable from here — the decodable story the OG pack
    // ships, and 650 informational articles on science and social studies,
    // each written at two Lexile levels with its own questions.
    //
    // The row offers all three now. Picking Article matches one to the
    // reading grade already set and lists the other forty-nine at that
    // grade by title. The Lexile follows the same up-step that raises the
    // passage a level, so one control still decides how hard the reading
    // is.
    //
    // The articles go in their own JSON block for the same reason the
    // mysteries do: 2.3 MB does not belong in a class that is compiled
    // with new Function on every load.
    name: "let the reading be a decodable, a passage, or an article",
    apply: (html) => {
      const arts = (ARTICLES as { articles: Record<string, unknown>[] }).articles.map((a) => ({
        i: a.id, g: a.grade, t: a.title, s: a.standard,
        h: (a.higher as { paras: { text: string }[] }).paras.map((p) => p.text),
        l: (a.lower as { paras: { text: string }[] }).paras.map((p) => p.text),
        q: (a.questions as { q: string; a: string }[]).map((x) => [x.q, x.a]),
      }));
      const end = "</body>";
      if (!html.includes(end)) return html;
      let out = html.replace(
        end,
        '<script id="sor-articles" type="application/json">' +
          JSON.stringify(arts).replace(/</g, "\\u003c") +
          "</script>\n" + end,
      );

      const pgv = "const PGV = PGTWO || PGX;";
      if (!out.includes(pgv)) return html;
      out = out.replace(
        pgv,
        "const srcPick = (this.state && this.state.src) || 'pass';\n" +
          "    const ART = (() => { try {\n" +
          "      return JSON.parse(document.getElementById('sor-articles').textContent);\n" +
          "    } catch (e) { return []; } })();\n" +
          "    const artGrade = pgRead === 'K' ? 0 : Number(pgRead ||\n" +
          "      ({ g2: '2', g3: '3', g4: '4' })[pgGrade] || 3);\n" +
          "    const artPool = ART.filter((a) => a.g === artGrade);\n" +
          "    const artId = (this.state && this.state.art) ||\n" +
          "      ((artPool[0] && artPool[0].i) || '');\n" +
          "    const ARTX = artPool.find((a) => a.i === artId) || artPool[0] || null;\n" +
          "    // The same step that takes the passage up a level takes the\n" +
          "    // article to its higher Lexile, so how hard the reading is stays\n" +
          "    // one decision rather than two.\n" +
          "    const artParas = ARTX ? (pgUp ? ARTX.h : ARTX.l) : [];\n" +
          // cur[0], not id: the destructure that declares id runs below this.
          "    const DECX = (OGD[cur[0]] && OGD[cur[0]].p && OGD[cur[0]].p.dec) || null;\n" +
          "    const PGSRC =\n" +
          "      srcPick === 'art' && ARTX\n" +
          "        ? { title: ARTX.t, paras: artParas,\n" +
          "            qs: ARTX.q.map((x) => [x[0], x[1]]) }\n" +
          "      : srcPick === 'dec' && DECX\n" +
          "        ? { title: DECX.title, paras: DECX.paras,\n" +
          "            qs: (DECX.qs || []).map((q) => [String(q).replace(/^\\d+\\.\\s*/, ''), '']) }\n" +
          "      : null;\n" +
          "    const PGV = PGTWO || PGSRC || PGX;",
      );

      // The three pills and the article list, in the reading row.
      //
      // ORDERED LIKE THE WRITING ROW: grade first, then what to read. Both
      // rows ask the same two questions in the same toolbar, and they used to
      // ask them in opposite orders -- writing put its grade before its genre
      // pills, reading put its pills before its grade. A teacher reading down
      // the toolbar had to re-learn the second row. The pills now go after
      // the grade select rather than before it, which is why this anchors on
      // the note that follows the select instead of on the select itself.
      const note = '<span style="font-size:11px;font-weight:700;color:#618459;white-space:nowrap">{{ pgLands }}</span>';
      if (!out.includes(note)) return html;
      out = out.replace(
        note,
        '<sc-for list="{{ srcOpts }}" as="o" hint-placeholder-count="3">' +
          '<button type="button" onClick="{{ o.pick }}" style="{{ o.st }}">{{ o.label }}</button>' +
          "</sc-for>\n            " + note,
      );
      out = out.replace(
        note,
        '<sc-if value="{{ passOn }}" hint-placeholder-val="{{ true }}">' + note + "</sc-if>" +
          '<sc-if value="{{ artOn }}" hint-placeholder-val="{{ false }}">' +
          '<select value="{{ artId }}" onChange="{{ artPick }}" aria-label="Article" ' +
          "style=\"font-family:'Poppins',sans-serif;font-size:11.5px;font-weight:700;padding:2px 4px;" +
          'border:1.5px solid #4B6049;border-radius:7px;background:#fff;color:#4B6049;max-width:260px">' +
          '<sc-for list="{{ artOpts }}" as="a" hint-placeholder-count="50">' +
          '<option value="{{ a.id }}">{{ a.label }}</option></sc-for></select>' +
          '<span style="font-size:11px;font-weight:700;color:#618459;white-space:nowrap">' +
          "{{ artNote }}</span></sc-if>",
      );

      const data = "      pgReadGrade: pgRead ||";
      if (!out.includes(data)) return html;
      return out.replace(
        data,
        "      artOn: srcPick === 'art', passOn: srcPick === 'pass', artId,\n" +
        // The three-text note means nothing once the reading is an article: an
        // article is written for one grade at two Lexiles, not as three texts.
        // So the note follows the source, and sits after the picker it is
        // describing rather than before it.
        "      artNote: ARTX ? ((artGrade === 0 ? 'K' : 'grade ' + artGrade) +\n" +
        "        ' \\u00b7 ' + (pgUp ? 'higher' : 'lower') + ' Lexile') : '',\n" +
          "      artOpts: artPool.map((a) => ({ id: a.i, label: a.t })),\n" +
          "      artPick: (e) => this.setState({ art: e.target.value }),\n" +
          "      srcOpts: [['pass', 'Passage'], ['dec', 'Decodable'], ['art', 'Article']]\n" +
          "        .filter((o) => o[0] !== 'dec' || DECX)\n" +
          "        .map((o) => ({ label: o[1], pick: () => this.setState({ src: o[0] }),\n" +
          "          st: 'font-family:Poppins,system-ui,sans-serif;font-size:12px;font-weight:800;" +
          "border:1.5px solid #4B6049;border-radius:7px;padding:3px 9px;cursor:pointer;" +
          "white-space:nowrap;' + (o[0] === srcPick ? 'background:#4B6049;color:#fff'" +
          " : 'background:#fff;color:#4B6049') })),\n" +
          data,
      );
    },
  },
  {
    // Wear the Upshift Learning brand.
    //
    // The colours already arrive on brand: the recolour pass below maps
    // every hue in the export onto the brand families, matching luminance
    // so contrast survives. What did not match was the type and the shape.
    //
    // The brand book sets the whole site in Poppins, headings and running
    // text alike. This page was in Outfit, which is a different voice, so
    // Outfit becomes Poppins and the page's own Poppins stack loses the
    // second face it used to fall back to.
    //
    // Buttons are full pills at a 100px radius in the brand, and were 7px
    // and 8px here. That is one override rather than forty edits, because
    // the radius is written inline on every button.
    //
    // The 4px gradient bar is the brand's own card treatment, at 135
    // degrees from coral through pink and lavender to teal. One strip
    // across the top of the page signs it without touching the layout.
    //
    // Deliberately not done: the brand's card radius of 20px. The page
    // uses 10px on cards and on small chips alike, so a blanket swap would
    // round the chips into lozenges. That wants picking apart by hand.
    //
    // The bar's four colours are written rgb() rather than hex on purpose.
    // The recolour pass matches #rrggbb and remaps by hue, and it does not
    // know these are already the brand: given hex it turned the pink into
    // coral and the teal into blue. rgb() is invisible to it.
    name: "wear the Upshift Learning brand",
    apply: (html) => {
      const link =
        '<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800'
        + '&family=Outfit:wght@500;600;700&display=swap" rel="stylesheet">';
      if (!html.includes(link)) return html;
      const brandLink =
        '<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900'
        + '&display=swap" rel="stylesheet">'
        + '\n<style>button{border-radius:100px !important}'
        + '[data-wide="1"]{grid-column:1 / -1 !important;width:100% !important}'
        + 'div:has(> [data-wide="1"]){grid-column:1 / -1 !important}'
        + 'div:has(> div > [data-wide="1"]){grid-column:1 / -1 !important}</style>';
      let out = html.replace(link, brandLink);

      const outfit = "font-family:Outfit,sans-serif";
      if (!out.includes(outfit)) return html;
      out = out.split(outfit).join("font-family:Poppins,system-ui,sans-serif");

      const poppins = "font-family:Poppins,sans-serif";
      if (!out.includes(poppins)) return html;
      out = out.split(poppins).join("font-family:Poppins,system-ui,sans-serif");

      if (!out.includes("<body>")) return html;
      out = out.replace(
        "<body>",
        '<body>\n<div style="height:4px;background:linear-gradient(135deg,'
          + 'rgb(255,106,91),rgb(255,125,174),rgb(184,125,255),rgb(0,180,166))"></div>'
      );
      return out;
    },
  },
  {
    // Make the things a child taps look tappable.
    //
    // Every chip on this page was a slightly rounded rectangle: a word to
    // read, a sound to drill, a lesson step to filter by. They read as form
    // controls, which is what they were, and a seven-year-old reading "ship"
    // off a grey-edged box is being asked to do school rather than play.
    //
    // Three changes, all of them small. Chips become full pills, because a
    // pill reads as a thing you pick up. They get a little more room to
    // breathe and a soft tinted shadow instead of a flat edge. And they lift
    // a pixel when a pointer is over them, which costs nothing and makes the
    // page feel like it is listening.
    //
    // The hover has to come from a stylesheet: these styles are written
    // inline on every chip, and an inline style has nowhere to put :hover.
    name: "make the clickables cuter",
    apply: (html) => {
      const chip =
        "chip: { fontSize: small ? 14 : 17, fontWeight: 700, border: '1.5px solid '"
        + " + COL[n - 1], borderRadius: 8, padding: '3px 10px', background: '#fff' }";
      if (!html.includes(chip)) return html;
      const cuter =
        "chip: { fontSize: small ? 14 : 17, fontWeight: 700, border: '1.5px solid '"
        + " + COL[n - 1], borderRadius: 999, padding: '5px 14px', background: '#fff',"
        + " boxShadow: '0 1px 0 ' + COL[n - 1] + '33', transition: 'transform .12s ease,"
        + " box-shadow .12s ease' }";
      let out = html.replace(chip, cuter);

      // The word lists under Easier / On level / Harder are built separately.
      const list = "border-radius:8px;padding:3px 9px;cursor:pointer;white-space:nowrap;";
      out = out.split(list).join(
        "border-radius:999px;padding:5px 13px;cursor:pointer;white-space:nowrap;"
          + "transition:transform .12s ease,box-shadow .12s ease;");

      const style = "<style>button{border-radius:100px !important}";
      if (!out.includes(style)) return html;
      return out.replace(
        style,
        "<style>"
          // The Reading Resources page settles every button into one
          // charcoal pill: outline when it is off, solid when it is on.
          // The builder had a different colour for almost every control,
          // so the page read as a row of unrelated things rather than one
          // set of switches. Colour still carries meaning here, but on the
          // step headings and the word lists, where it means something.
          //
          // A button carries its own state inline, and white means off, so
          // that substring is the whole test.
          + "button{border:1.5px solid rgb(17,17,17) !important;"
          + "font-family:Poppins,system-ui,sans-serif !important;font-size:13px !important;"
          + "font-weight:700 !important;padding:8px 18px !important}"
          // The browser rewrites an inline #fff into rgb(255, 255, 255)
          // before any selector sees it, so that is what has to be
          // matched. The "background: " prefix matters: without it the
          // same string appears in a selected button's white text.
          + "button[style*=\"background: rgb(255, 255, 255)\"],"
          + "button[style*=\"background: rgb(250, 250, 250)\"]"
          + "{background:rgb(255,255,255) !important;color:rgb(17,17,17) !important}"
          + "button:not([style*=\"background: rgb(255, 255, 255)\"])"
          + ":not([style*=\"background: rgb(250, 250, 250)\"])"
          + "{background:rgb(17,17,17) !important;color:rgb(255,255,255) !important}"
          + "button{border-radius:100px !important;"
          + "transition:transform .12s ease,box-shadow .12s ease}"
          + "button:hover{transform:translateY(-1px);box-shadow:0 3px 8px rgba(17,17,17,.16)}"
          + "button:active{transform:translateY(0);box-shadow:none}"
          // Every chip on the page is a span with a border and padding;
          // every card is a div. That is the whole selector.
          + "span[style*=\"border\"][style*=\"padding\"]{border-radius:999px !important;"
          + "padding:4px 12px !important;white-space:nowrap;"
          + "box-shadow:0 1px 2px rgba(17,17,17,.10);"
          + "transition:transform .12s ease,box-shadow .12s ease}"
          + "span[style*=\"border\"][style*=\"padding\"]:hover{transform:translateY(-1px);"
          + "box-shadow:0 3px 8px rgba(17,17,17,.15)}"
      );
    },
  },
  {
    // Tell the two texts apart.
    //
    // With the multisyllabic switch on, the reading step holds two stories
    // and the only thing separating them was a line of plain text, because
    // the passage renders as one pre-line block and a block of text has
    // nowhere to put a heading. A child scrolling through it cannot see
    // where the first story stops.
    //
    // So the passage renders line by line instead of as one lump, and the
    // two markers get to be headings: bolder, smaller, spaced out, with a
    // rule above them. Everything else reads exactly as it did.
    name: "set the two texts apart",
    apply: (html) => {
      const anchor = "          hasTask: !!wrTask, task: wrTask, taskType: (WR_SHORT[wrPick] || wrPick).toUpperCase(),";
      if (!html.includes(anchor)) return html;
      const parts = [
        "",
        "          passageParts: String(ebText || '').split('\\n')",
        "            .map((t) => t.trim()).filter(Boolean).map((t, i) => {",
        "              const head = /^(\\u{1F4D8}|\\u{1F4D9})/u.test(t);",
        "              return { t, head, st: head",
        "                ? 'font-family:Poppins,system-ui,sans-serif;font-size:12px;font-weight:800;'",
        "                  + 'letter-spacing:.1em;color:#4B6049;margin:' + (i ? '24px' : '0')",
        "                  + ' 0 6px;padding-top:' + (i ? '24px' : '0')",
        "                  + ';border-top:' + (i ? '1.5px solid #C9D3C4' : '0')",
        "                : 'font-size:15px;line-height:1.6;color:#1F2E2A;text-wrap:pretty;'",
        "                  + 'margin:0 0 10px' };",
        "            }),",
      ].join("\n");
      let out = html.replace(anchor, anchor + parts);

      const div =
        '<div style="font-size:15px;line-height:1.6;color:#1F2E2A;text-wrap:pretty;'
        + 'white-space:pre-line">{{ s.passage }}</div>';
      if (!out.includes(div)) return html;
      const lines =
        '<div><sc-for list="{{ s.passageParts }}" as="p" hint-placeholder-count="6">'
        + '<div style="{{ p.st }}">{{ p.t }}</div></sc-for></div>';
      out = out.split(div).join(lines);
      return out;
    },
  },
  {
    // Make a short workbook page fill the sheet again.
    //
    // THE BUG. Every page box carries its own minimum height — 10in for the
    // main workbook pages, 9.6in for the differentiation and decodable ones —
    // and a `justify-content: space-between` that spreads its children down
    // that height. That is what makes a ten-word tracker print as a full
    // sheet with room to tick rather than a band of boxes across the top.
    //
    // The print fit measures each page before it prints, and to measure the
    // content rather than the box it first sets min-height to 0. For a page
    // that turned out to be short it then set min-height back to '' — and
    // because the box's own 10in is an inline style written by the framework,
    // clearing the property deleted the 10in with it. The framework does not
    // write it again until the component re-renders, which printing does not
    // cause. So every page that fitted on one sheet printed collapsed to the
    // height of its content: the tracker and the word ladder stopped two
    // thirds down the page, which is what a teacher saw in the preview.
    //
    // THE FIX. Remember the box's own min-height on the element before the
    // measurement blanks it, and put that value back rather than ''. Each
    // page keeps its own height — the 9.6in pages are not forced to 10in —
    // and a re-measure on a later print reads the remembered value, not the
    // zero left behind by the one before.
    name: "put a short page's min-height back after the print fit measures it",
    apply: (html) => {
      // Before the measurement: stash the value, then blank it.
      const blank = "e.style.minHeight = '0'; });";
      if (!html.includes(blank)) return html;
      let out = html.replace(
        blank,
        "if (e.dataset.mh === undefined) e.dataset.mh = e.style.minHeight;" +
          " e.style.minHeight = '0'; });",
      );

      // After it: restore the page's own value, not the empty string.
      const restore = "else e.style.minHeight = '';";
      if (!out.includes(restore)) return html;
      out = out.replace(restore, "else e.style.minHeight = e.dataset.mh || '';");

      // And when the print is over, the same value rather than nothing, so
      // the preview on screen does not stay collapsed after printing once.
      const unfit = "e.style.zoom = ''; e.style.width = ''; e.style.maxWidth = ''; e.style.minHeight = '';";
      if (!out.includes(unfit)) return html;
      return out.replace(
        unfit,
        "e.style.zoom = ''; e.style.width = ''; e.style.maxWidth = '';" +
          " e.style.minHeight = e.dataset.mh || '';",
      );
    },
  },
  {
    // Syllable division, in every lesson, with a key that names the rule.
    //
    // WHY IT IS IN EVERY LESSON. A child who can read a multisyllabic word
    // one sound at a time still stalls on a long one, because the work is not
    // the sounds -- it is seeing where the word comes apart. That is a
    // separate skill from every other page in the workbook, and it is the one
    // that decides whether a child can read a chapter book.
    //
    // WHAT THE KEY CARRIES. Not just the chop. A teacher marking this needs to
    // say WHY the line goes there -- one consonant in the middle and a long
    // first vowel, so it joins the second syllable -- and what kind of
    // syllable each piece turned out to be, because the six types are what the
    // child is being taught to notice. So each answer names the division, the
    // rule in words a child can hear, and the type of every syllable.
    //
    // WHERE THE ANSWERS COME FROM. scripts/reading-syllable-splits.json, which
    // is worked out against a pronouncing dictionary rather than guessed from
    // the spelling. The spelling cannot tell ti/ger from rob/in, and the
    // engine used to guess, sending every such word the same way. A division
    // the dictionary could not settle is marked on the key as unsure rather
    // than printed as fact.
    name: "add a syllable division page to every lesson",
    apply: (html) => {
      const end = "</body>";
      if (!html.includes(end)) return html;
      /*
       * The words of each lesson's own story that the dictionary can split.
       *
       * Both grade versions, lower-cased first letters only so a name does
       * not turn up as a word to chop, and only words the split dictionary
       * knows -- which is what makes them usable on this page at all. Eight
       * is what the page prints; a dozen are kept so the filter above has
       * something to work with after it drops the ones already used.
       */
      const chop: Record<string, string[]> = {};
      for (const [key, versions] of Object.entries(
        PASSAGES.passages as Record<string, Record<string, { paras: string[] }>>,
      )) {
        const seen = new Set<string>();
        // Easiest telling first. All three are vetted for this lesson, but
        // the page prints the first eight it can use, and a child on short a
        // should meet "paper" before the grade 4 version offers "usually".
        for (const g of ["g2", "g3", "g4"]) {
          const v = versions[g];
          if (!v || !v.paras) continue;
          for (const raw of v.paras.join(" ").split(/\s+/)) {
            if (!/^[a-z]/.test(raw)) continue;
            const w = raw.toLowerCase().replace(/[^a-z]/g, "");
            if (w.length > 3 && (SYLLABLES.words as Record<string, unknown>)[w]) seen.add(w);
          }
        }
        if (seen.size) chop[key] = [...seen].slice(0, 12);
      }

      let out = html.replace(
        end,
        '<script id="sor-syllables" type="application/json">' +
          JSON.stringify(SYLLABLES).replace(/</g, "\\u003c") +
          "</script>\n" +
          '<script id="sor-chop" type="application/json">' +
          JSON.stringify(chop).replace(/</g, "\\u003c") +
          "</script>\n" + end,
      );

      // The rows, per page, answers only on the key.
      //
      // This anchors on the word-ladder rule's output rather than on the
      // export's own ", sbRows }; })", because that rule rewrites the tail of
      // the wbPages map before this one runs and the original string is gone
      // by then. This rule is last in the list, so the ladder's version is
      // what is actually there.
      const rowAnchor =
        " ({ n: i + 1, c, ans: isKey ? LADX.words[i + 1] : '' })) }; })";
      if (!out.includes(rowAnchor)) return html;
      out = out.replace(
        rowAnchor,
        " ({ n: i + 1, c, ans: isKey ? LADX.words[i + 1] : '' })),\n" +
          "          sylBox: { ...p.box1, display: show(isKey ? 'key' : 'wb') ? 'flex' : 'none' },\n" +
          "          sylRows: SYLW.map((w, i) => { const got = SYL.words[w];\n" +
          "            const bits = got ? got.split('|') : null;\n" +
          "            return { n: i + 1, w,\n" +
          "              // The child gets the word spaced out, so there is room\n" +
          "              // between the letters to draw the dividing line.\n" +
          "              spaced: w.split('').join(' '),\n" +
          "              ans: isKey && bits ? bits[0].split('-').join(' / ') : '',\n" +
          "              why: isKey && bits ? (SYL.rules[bits[1]] || bits[1]) : '',\n" +
          "              types: isKey && bits ? bits[2].split(',').join(' + ') : '',\n" +
          "              unsure: !!(isKey && bits && bits[3] === '?') }; }) }; })",
      );

      // The words: the lesson's own multisyllabic list, or its longest words
      // where a skill has no multisyllabic list of its own.
      // Anchored on the adapted declaration, not the export's. A later rule
      // rewrites it to draw from wordPool, which is the multisyllabic pool
      // this page wants anyway.
      const preamble = "    const real = (isMulti ? wordPool : real0).slice(0, 10);";
      if (!out.includes(preamble)) return html;
      out = out.replace(
        preamble,
        preamble +
          "\n    const SYL = (() => { try {\n" +
          "      return JSON.parse(document.getElementById('sor-syllables').textContent);\n" +
          "    } catch (e) { return { words: {}, rules: {} }; } })();\n" +
          "    const CHOP = (() => { try {\n" +
          "      return JSON.parse(document.getElementById('sor-chop').textContent);\n" +
          "    } catch (e) { return {}; } })();\n" +
          "    // Prefer the skill's own multisyllabic words. A skill that has\n" +
          "    // none still gets a page, built from its longest words, because a\n" +
          "    // lesson without this page would be the one lesson where the\n" +
          "    // child is not asked to look at how a word comes apart.\n" +
          "    const SYLW = (() => {\n" +
          // MULTI[id] is the skill's own multisyllabic list -- cupcake,\n" +
          "      // reptile, invite for silent e -- and it is there whether or not\n" +
          "      // the multisyllabic toggle is on, which matters because a\n" +
          "      // single-syllable skill still needs long words to chop.\n" +
          "      const pick = (MULTI[id] || [])\n" +
          "        .map((w) => String(w).toLowerCase())\n" +
          "        .filter((w) => SYL.words[w]);\n" +
          "      const spare = real0.concat(real)\n" +
          "        .map((w) => String(w).toLowerCase())\n" +
          "        .filter((w) => SYL.words[w] && pick.indexOf(w) === -1)\n" +
          "        .sort((a, b) => b.length - a.length);\n" +
          // AND THE LESSON'S OWN STORY, when the first two leave nothing.
          //
          // Twelve of the 218 entries in the picker printed this sheet with
          // its heading, its instruction and no words at all: all five vowel
          // team lessons, short a, suffix -s, the possessive and the three
          // contractions. None of them has a multisyllabic list, and none of
          // their own words has more than one syllable, so both sources
          // above came back empty and the child got a page headed "Chop the
          // word" with nothing to chop.
          //
          // The passage is the obvious third source. These are words out of
          // the story the child reads this week -- paper, moment, usually --
          // already checked for that lesson by check-passages, and a word
          // comes apart the same way whatever the week's grapheme is.
          "      const story = (CHOP[id] || CHOP[String(id).split('|')[0]] || [])\n" +
          "        .filter((w) => SYL.words[w] && pick.indexOf(w) === -1 && spare.indexOf(w) === -1);\n" +
          "      return [...new Set(pick.concat(spare, story))].slice(0, 8);\n" +
          "    })();",
      );

      // The page itself, in BOTH copies of the workbook block.
      //
      // An earlier rule gives the answer key its own section by rendering the
      // same markup twice over two filtered lists, so every workbook page
      // exists twice in the template. A plain replace put this page in the
      // first copy only, and the key never got one.
      //
      // The insertion point is found by walking back from the ten-words
      // kicker to the page div that encloses it, rather than matched as a
      // string: this rule runs after the recolour, which rewrites the
      // colours and the font in that markup, so any anchor carrying them
      // would be matching the export's colours and not the page's.
      const kicker = ">TEN WORDS A DAY<";
      const divTag = '<div data-wb="true" style="{{ p.box1 }}">';
      if (!out.includes(kicker) || !out.includes(divTag)) return html;
      const page =
        '<div data-wb="true" style="{{ p.sylBox }}">\n' +
        '      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:12px;border-bottom:3px solid #4B6049;padding-bottom:8px">\n' +
        "        <div>\n" +
        '          <div style="font-family:Outfit,sans-serif;font-size:12px;font-weight:700;letter-spacing:.18em;color:#618459">{{ p.kicker }} \u00B7 SYLLABLE DIVISION</div>\n' +
        '          <div style="font-size:26px;font-weight:800;color:#2F3E2E;line-height:1.1">\u2702\uFE0F Chop the word</div>\n' +
        "        </div>\n" +
        '        <div style="font-size:14px;font-weight:600;white-space:nowrap">Name ____________  Date ______</div>\n' +
        "      </div>\n" +
        '      <div style="font-size:14px;line-height:1.45;background:#FDF6E7;border:1.5px solid #E4D3A8;border-radius:8px;padding:7px 12px">Draw a line where the word comes apart. Then write the syllables on the line and say how many there are.</div>\n' +
        '      <sc-for list="{{ p.sylRows }}" as="r" hint-placeholder-count="8">\n' +
        '        <div style="display:flex;flex-direction:column;gap:3px;border:1.5px solid #C9D3C4;border-radius:9px;padding:7px 11px;break-inside:avoid;page-break-inside:avoid">\n' +
        '          <div style="display:flex;align-items:center;gap:12px">\n' +
        '            <span style="font-size:13px;font-weight:800;color:#618459;flex:none;width:16px">{{ r.n }}</span>\n' +
        '            <span style="font-size:25px;font-weight:700;letter-spacing:.22em;color:#111;white-space:nowrap">{{ r.spaced }}</span>\n' +
        '            <span style="flex:1;border-bottom:2px solid #111;height:20px"></span>\n' +
        '            <span style="display:flex;align-items:center;justify-content:center;border:2px solid #111;border-radius:4px;width:34px;height:26px;flex:none"></span>\n' +
        "          </div>\n" +
        '          <sc-if value="{{ r.ans }}" hint-placeholder-val="{{ false }}">\n' +
        '            <div style="font-size:14px;color:#9B2C3C;font-weight:700;padding-left:28px">{{ r.ans }}<span style="font-weight:600;color:#57534E"> \u00B7 {{ r.types }}</span></div>\n' +
        '            <div style="font-size:12.5px;color:#57534E;padding-left:28px;line-height:1.4">{{ r.why }}</div>\n' +
        '            <sc-if value="{{ r.unsure }}" hint-placeholder-val="{{ false }}">\n' +
        '              <div style="font-size:12px;color:#9B2C3C;padding-left:28px">Not settled \u2014 accept either division from a child who can say why.</div>\n' +
        "            </sc-if>\n" +
        "          </sc-if>\n" +
        "        </div>\n" +
        "      </sc-for>\n" +
        '      <div style="font-size:13px;color:#57534E;line-height:1.45;border-top:1.5px solid #C9D3C4;padding-top:7px">The six syllable types: closed, open, silent e, vowel team, vowel-r, consonant-le.</div>\n' +
        "    </div>\n" +
        "    ";
      // Back to front, so an earlier insertion does not move a later index.
      const spots = [];
      for (let at = out.indexOf(kicker); at !== -1; at = out.indexOf(kicker, at + 1)) {
        const open = out.lastIndexOf(divTag, at);
        if (open !== -1) spots.push(open);
      }
      if (spots.length !== 2) return html;
      for (const at of spots.reverse()) {
        out = out.slice(0, at) + page + out.slice(at);
      }
      return out;
    },
  },
  {
    // Word games belong inside the workbook, not beside it.
    //
    // The bar had two disclosures side by side -- Show workbook and Word games
    // -- so a teacher opening the workbook got everything in the packet EXCEPT
    // the games, which needed a second click to find. The games are part of
    // the week's work, so they open with it and the second button goes.
    //
    // The student copies come with the workbook. The key does not: it stays
    // behind its own chip, because a teacher opening the workbook to see what
    // the children get should not be handed the answers in the same scroll.
    //
    // Anchored on the ADAPTED strings. An earlier rule rewrote the print modes
    // to read a comma-joined list of chips rather than one part name, so the
    // export's own "part === 'games'" is long gone by the time this runs. This
    // rule is last in the list, so the rewritten form is what is there.
    name: "open the word games with the workbook",
    apply: (html) => {
      const modes =
        "const modes = []; if (has('games') || (!part && open)) modes.push(false); " +
        "if (has('gkey') || (!part && open)) modes.push(true);";
      if (!html.includes(modes)) return html;
      const out = html.replace(
        modes,
        "const wbShown = !!(this.state && this.state.wbOpen); const modes = []; " +
          "if (has('games') || has('wb') || (!part && (open || wbShown))) modes.push(false); " +
          "if (has('gkey') || has('key') || (!part && open)) modes.push(true);",
      );

      // The second disclosure now does nothing the first does not.
      const btn =
        /<button type="button" onClick="\{\{ toggleGames \}\}"[^>]*>\{\{ gamesBtn \}\}<\/button>/;
      if (!btn.test(out)) return html;
      return out.replace(btn, "");
    },
  },
  {
    // The spiral review, in the preview and in the packet, on one page.
    //
    // Three faults, all from the same line. The extra pages are built with
    //
    //     const box = (k) => ({ display: has(k) ? 'flex' : 'none', ... })
    //
    // and the list is then filtered to the ones whose display is 'flex'. When
    // nothing is printing, has(k) is false for every k, so the array comes back
    // EMPTY: the spiral review was not hidden in the preview, it was never
    // built. The same line kept it out of the packet, because the packet
    // prints the chips and the spiral review was not one.
    //
    // So: the sheet is built whenever the workbook is open, and it joins the
    // print chips so a teacher can take it out of the run rather than having
    // to remember a separate button for it.
    //
    // ONLY THE SPIRAL REVIEW gets the workbook treatment. The progress check
    // shares this box function and pushes two pages, a student copy and a key,
    // so opening the workbook would put its answers on the screen beside the
    // children's copies. The check keeps its own chip.
    name: "build the spiral review with the workbook and print it in the packet",
    apply: (html) => {
      const box =
        "const box = (k) => ({ display: has(k) ? 'flex' : 'none',";
      if (!html.includes(box)) return html;
      let out = html.replace(
        box,
        "const wbShownX = !!(this.state && this.state.wbOpen);\n" +
          "        const box = (k) => ({ display: has(k) " +
          "|| (!part && k === 'spiral' && wbShownX) ? 'flex' : 'none',",
      );

      // ONE SHEET, NOT TWO. The spiral review's content is about 640px and the
      // box forced it to 10in, which is 960px against a 955px printable page --
      // five pixels over, before Chrome's own header and footer take their cut.
      // The total is anchored to the bottom with margin-top:auto, so those few
      // pixels pushed it alone onto a second sheet: a page of words, then a
      // page holding nothing but "Score: __ / 16".
      //
      // 9.2in leaves room for the browser's furniture and still fills the page.
      // The 10in belongs to several boxes in this file and only this one is
      // being changed, so it is found by walking forward from the box function
      // itself rather than replaced by name -- a plain replace hit the main
      // workbook page's box, which prints correctly and should not move.
      const fnAt = out.indexOf("const box = (k) => ({ display: has(k)");
      if (fnAt === -1) return html;
      const tallAt = out.indexOf("minHeight: '10in'", fnAt);
      const fnEnd = out.indexOf("});", fnAt);
      if (tallAt === -1 || fnEnd === -1 || tallAt > fnEnd) return html;
      out =
        out.slice(0, tallAt) + "minHeight: '9.2in'" +
        out.slice(tallAt + "minHeight: '10in'".length);

      // A chip of its own, lit like the rest, so it rides along with Print.
      const chips = "['games', '\u{1F3B2} Word games']];";
      if (!out.includes(chips)) return html;
      out = out.replace(
        chips,
        "['games', '\u{1F3B2} Word games'], ['spiral', '\u{1F300} Spiral review']];",
      );

      return out;
    },
  },
  {
    // The step card: badges under the title, and cards that stop stretching.
    //
    // TWO FAULTS, BOTH VISIBLE ON STEP 11. Its title is "11 \u00B7 Oral reading \u00B7
    // decodable" and it carries two measure badges, ORF and Maze. The header
    // was one row -- title on the left, badges and the minutes pushed right --
    // and in a 250px grid column the title pill does not shrink, so the badges
    // were squeezed to their narrowest and wrapped one per line. ORF above
    // Maze above "5 min", stacked down the right edge and colliding with the
    // pill beside them.
    //
    // They go under the title instead. A card is narrow by design, so a row
    // that only works when the title is short is the wrong row.
    //
    // The second fault is the empty half of the card. The grid sets equal row
    // heights, so every card in a row grows to match the tallest one and a
    // short card prints a field of white. align-items:start lets each card be
    // the height of what is in it.
    name: "fix the step card header and let the cards size to their content",
    apply: (html) => {
      const row =
        '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px">\n' +
        '              <span style="{{ s.pill }}">{{ s.n }} \u00B7 {{ s.t }}</span>';
      if (!html.includes(row)) return html;
      let out = html.replace(
        row,
        '<div style="display:flex;flex-direction:column;align-items:flex-start;gap:6px">\n' +
          '              <span style="{{ s.pill }}">{{ s.n }} \u00B7 {{ s.t }}</span>',
      );

      // The badges no longer need pushing to the right: they are on their own
      // line now, and reading them from the left matches the title above them.
      const badges =
        'display:flex;gap:5px;align-items:center;flex-wrap:wrap;justify-content:flex-end';
      if (!out.includes(badges)) return html;
      out = out.replace(badges, "display:flex;gap:6px;align-items:center;flex-wrap:wrap");

      const grid =
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px">';
      if (!out.includes(grid)) return html;
      out = out.replace(
        grid,
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));' +
          'align-items:start;gap:12px">',
      );

      return out;
    },
  },
  {
    // The mystery, scaffolded or not, on a switch.
    //
    // The steps are the right default -- a child who has never had to find
    // the words that prove a thing needs the shape of the task on the paper --
    // and they are the wrong sheet for a child who can already do it. Steps
    // become scaffolding to work around rather than through, and the writing
    // gets shorter rather than better.
    //
    // So Steps and Writing prompt sit on the bar beside the workbook. Step 1
    // is in both, because circling who did it is the question either way; what
    // the switch changes is whether the quote and the justification come with
    // their frames printed, or as the task and a page of lines.
    name: "let the mystery be scaffolded or a plain writing prompt",
    apply: (html) => {
      let out = html;

      // Both copies of the page, student and key.
      for (let guard = 0; guard < 4; guard++) {
        const at = out.indexOf('>STEP 2</span>');
        if (at === -1) break;
        const bandOpen = out.lastIndexOf('<div style="display:flex;align-items:baseline', at);
        // The scaffold ends where the justification frame ends, which is the
        // div holding the "That shows" lines.
        const frameAt = out.indexOf('I know <span', at);
        if (bandOpen === -1 || frameAt === -1) return html;
        const frameEnd = out.indexOf("</div>", out.indexOf("</span></div>", frameAt));
        const taskAt = out.indexOf("{{ myTask }}", frameEnd);
        if (frameEnd === -1 || taskAt === -1) return html;
        const taskOpen = out.lastIndexOf("<div ", taskAt);
        const taskEnd = out.indexOf("</div>", taskAt) + "</div>".length;

        const scaffold = out.slice(bandOpen, frameEnd + "</div>".length);
        const task = out.slice(taskOpen, taskEnd);
        const lines =
          '<div style="position:relative;min-height:300px;background-image:' +
          "repeating-linear-gradient(to bottom,transparent 0,transparent 34.5px,#333 34.5px,#333 36px);" +
          'background-size:100% 36px"></div>';

        const replaced =
          '<sc-if value="{{ myScaf }}" hint-placeholder-val="{{ true }}">' +
          scaffold.replace(">STEP 2</span>", ">STEP 2x</span>") +
          "</sc-if>" +
          '<sc-if value="{{ myPlain }}" hint-placeholder-val="{{ false }}">' +
          task + lines +
          "</sc-if>";

        out =
          out.slice(0, bandOpen) + replaced + out.slice(taskEnd);
      }
      // Put the marker back now that every copy has been wrapped.
      out = out.split(">STEP 2x</span>").join(">STEP 2</span>");

      // The state, and the two buttons beside the workbook's own.
      const seat = "      wbBtn: (this.state && this.state.wbOpen) ? 'Hide workbook \u25B2' : 'Show workbook \u25BC',";
      if (!out.includes(seat)) return html;
      out = out.replace(
        seat,
        seat + "\n" +
          "      // Scaffolded by default: the steps are what a child who cannot\n" +
          "      // yet do this needs, and the plain prompt is the step up.\n" +
          "      myScaf: !(this.state && this.state.myPlain),\n" +
          "      myPlain: !!(this.state && this.state.myPlain),\n" +
          "      myScafBtn: (this.state && this.state.myPlain)\n" +
          "        ? '\\u{1F50D} Mystery: writing prompt' : '\\u{1F50D} Mystery: steps',\n" +
          "      toggleScaf: () => this.setState({ myPlain: !(this.state && this.state.myPlain) }),",
      );

      const barAnchor = '<button type="button" onClick="{{ toggleWb }}"';
      if (!out.includes(barAnchor)) return html;
      const bare =
        "font-family:Poppins,system-ui,sans-serif;font-size:14px;font-weight:700;" +
        "border:1.5px solid #4B6049;background:#fff;color:#4B6049;padding:8px 14px;" +
        "border-radius:8px;cursor:pointer;white-space:nowrap";
      return out.replace(
        barAnchor,
        '<button type="button" onClick="{{ toggleScaf }}" style="' + bare + '">' +
          "{{ myScafBtn }}</button>" + barAnchor,
      );
    },
  },
  {
    // Build the Sentence: no capital on the front, no end mark on the back.
    //
    // The cards were cut straight out of the sentence, so the first word
    // arrived with its capital and the last with its full stop -- and the
    // instruction said so outright: "Hint: the capital letter goes first, and
    // the end mark goes last." A child can finish the puzzle by looking for
    // the big letter and the dot, in any language, without reading a word of
    // it. The ordering was the only work and even that was signposted.
    //
    // So the first card is lowercased and the end mark comes off the last one.
    // Reordering now needs the sense of the sentence, and writing it out needs
    // the capital and the end mark put back -- which is the part a teacher
    // actually marks. The answer key still carries the sentence whole.
    //
    // Only the sentence-final mark is removed. Commas stay: they are inside
    // the sentence rather than a cue to its edges, and taking them out would
    // change the sentence rather than hide its shape.
    name: "take the capital and the end mark off the sentence cards",
    apply: (html) => {
      const head =
        "const sbRows = sents.map((s, si) => { const ws = s.split(' '); " +
        "const ord = ws.map((w, i) => [w,";
      if (!html.includes(head)) return html;
      let out = html.replace(
        head,
        "const sbRows = sents.map((s, si) => { const ws = s.split(' '); " +
          "const face = ws.map((w, i) => { " +
          "let t = i === ws.length - 1 ? w.replace(/[.!?]+$/, '') : w; " +
          "if (i === 0) t = t.charAt(0).toLowerCase() + t.slice(1); " +
          "return t; }); " +
          "const ord = face.map((w, i) => [w,",
      );

      // The shuffle checks whether it happened to reproduce the original; it
      // has to compare against the cards, not the sentence they came from, or
      // it always thinks it shuffled.
      const same = "const sc = ord.join(' ') === s ?";
      if (!out.includes(same)) return html;
      out = out.replace(same, "const sc = ord.join(' ') === face.join(' ') ?");

      const hint =
        "Cut out the word cards. Put them in order to make a sentence. " +
        "Hint: the capital letter goes first, and the end mark goes last. " +
        "Read it, then write it.";
      if (!out.includes(hint)) return html;
      return out.replace(
        hint,
        "Cut out the word cards. Put them in order to make a sentence. " +
          "The cards have no capital letter and no end mark \u2014 you add those " +
          "when you write it. Read it, then write it.",
      );
    },
  },
  {
    // The Hub's own lessons, spliced into the builder's skill list.
    //
    // They live in scripts/lib/extra-lessons.mjs rather than in the export,
    // because the export is not ours to edit -- a re-export would wipe them,
    // which is the whole reason this script patches the page instead. And the
    // sequence is derived from the file on disk rather than from the patched
    // page, so that same file is read by scripts/lib/sequence.mjs too. One
    // source, two consumers, and a re-export cannot touch either.
    name: "splice the Hub's own lessons into the skill list",
    apply: (html) => {
      const at = html.indexOf("const SK = [");
      if (at === -1) return html;
      const close = html.indexOf("\n    ];", at);
      if (close === -1) return html;
      const rows = EXTRA_LESSONS.map((r) => JSON.stringify(r)).join(",\n      ");
      // The export's list already ends with a trailing comma, so adding one
      // more left a hole in the array -- [..., , ["long-a", ...]] -- and a hole
      // maps to undefined, which emptied the skill picker entirely. Only add
      // the separator when there is not one there already.
      const head = html.slice(0, close);
      const sep = /,\s*$/.test(head) ? "\n      " : ",\n      ";
      return head + sep + rows + html.slice(close);
    },
  },
  {
    // Number the progress check, so a child knows where it comes.
    //
    // The workbook pages say where they sit -- the mystery opens "8. The case"
    // -- and the progress check did not, so it arrived as a loose sheet with no
    // place in the order. It is the page after the mystery, so it is 9.
    //
    // Only this sheet is numbered. The rest of the packet already carries its
    // numbers and renumbering them would move pages a teacher has taught from.
    name: "number the progress check so a child knows the order",
    apply: (html) => {
      const title = "'\u2705 ' + (key ? 'Progress Check Key' : 'Show What You Know')";
      if (!html.includes(title)) return html;
      return html.replace(
        title,
        "'\u2705 9. ' + (key ? 'Progress Check Key' : 'Show What You Know')",
      );
    },
  },
  {
    // Solve it and Debate it, on the workbook bar.
    //
    // Both modes already existed and both already drove the printed sheet --
    // the story, the question, the suspects and the key all follow the switch.
    // The switch itself sat up in the teaching panel, next to the case on
    // screen, which is the wrong place for it: a teacher printing the packet
    // never passes it, so the sheet came out solve-it whatever the lesson was
    // meant to be.
    //
    // It goes beside Show workbook and the scaffold switch, so the three
    // decisions about the mystery sheet -- which mode, how much scaffolding,
    // and print it -- sit together. The pills stay where they are too; they
    // are useful while the case is on the board.
    //
    // Hidden when the case has no debate version. Some do not have one, and a
    // button that silently does nothing is worse than no button.
    name: "put solve it and debate it on the workbook bar",
    apply: (html) => {
      const anchor = '<button type="button" onClick="{{ toggleScaf }}"';
      if (!html.includes(anchor)) return html;
      const base =
        "font-family:Poppins,system-ui,sans-serif;font-size:14px;font-weight:700;" +
        "padding:8px 14px;border-radius:8px;cursor:pointer;white-space:nowrap;" +
        "border:1.5px solid #4B6049;";
      const pair =
        '<sc-if value="{{ myHasDb }}" hint-placeholder-val="{{ true }}">' +
        '<span style="display:inline-flex;gap:6px">' +
        '<button type="button" onClick="{{ mySolvePick }}" style="' + base +
        '{{ myBarSolve }}">\u{1F50D} Solve it</button>' +
        '<button type="button" onClick="{{ myDebatePick }}" style="' + base +
        '{{ myBarDebate }}">\u2696\uFE0F Debate it</button>' +
        "</span></sc-if>";
      const out = html.replace(anchor, pair + anchor);

      // Lit and unlit, the same way every other pair on this bar reads.
      const seat = "          myDbOn: dbOn, mySolveOn: !dbOn, myHasDb: !!(C && C.d),";
      if (!out.includes(seat)) return html;
      return out.replace(
        seat,
        seat + "\n" +
          "          myBarSolve: dbOn ? 'background:#fff;color:#4B6049'\n" +
          "            : 'background:#4B6049;color:#fff',\n" +
          "          myBarDebate: dbOn ? 'background:#4B6049;color:#fff'\n" +
          "            : 'background:#fff;color:#4B6049',",
      );
    },
  },
  {
    // The harder word ladder, when the multisyllabic toggle is on.
    //
    // The toggle already swaps the word lists everywhere else in the lesson,
    // and the ladder ignored it: a child working the multisyllabic list still
    // climbed cat to zap. So each concept has a second ladder now, in
    // laddersMulti, where every rung is a multisyllabic word and the move is a
    // swap of one PART rather than one letter -- which is the move a long word
    // actually asks for:
    //
    //     windmill -> windfall    "Change mill to fall."
    //     windfall -> rainfall    "Change wind to rain."
    //
    // A ladder only works if each clue has exactly one answer, and that is
    // invisible while writing one: every rung looks right on its own and the
    // fault lives in the relation between a clue and the two words it sits
    // between. scripts/check-word-ladders-multi.mjs reads each clue, applies
    // it, and fails if it produces no answer, more than one, or the wrong one.
    // It caught a real error on its first run -- inspect to suspect is in to
    // su, not in to sus, which gives susspect -- and nine words it wrongly
    // called unreal, because web2 is the 1934 list and has no hotspot,
    // backpack, keystroke or brainstorm.
    //
    // A concept with no harder ladder keeps its own. Falling back is right
    // here: the ladder is still on the concept's pattern, just not multisyllabic.
    name: "use the harder word ladder when multisyllabic is on",
    apply: (html) => {
      const seat = "const LADX = LAD[SEL] || LAD[cur[0]] || null;";
      if (!html.includes(seat)) return html;
      return html.replace(
        seat,
        "const LADM = LADMULTI[SEL] || LADMULTI[cur[0]] || null;\n" +
          // The state is read directly rather than through isMulti, because
          // isMulti is declared about 47,000 characters further down the same
          // function. Naming it here threw "Cannot access 'isMulti' before
          // initialization" on every render, which took renderVals() with it:
          // the skill picker came up empty and the whole lesson blank.
          //
          // It was missed because the swap was verified by lifting the
          // selection line out of the page and evaluating it on its own, where
          // there is no declaration order to get wrong. The empty picker was
          // showing in the headless runs and was put down to the page being
          // large and rendering progressively. It was this.
          "    const LADX = (!!(this.state && this.state.multi) && LADM)\n" +
          "      || LAD[SEL] || LAD[cur[0]] || null;",
      );
    },
  },
  {
    // Show workbook goes first on the bar.
    //
    // Three rules add a button to this row and each one put its own in front
    // of the workbook toggle, so the thing a teacher reaches for most ended up
    // last: Solve it, Debate it, Mystery: steps, then Show workbook. The
    // toggle is what opens everything else, so it reads first and the switches
    // that change what is inside follow it.
    //
    // Done by moving the button rather than by changing the rules that add the
    // others, because each of those anchors on the toggle to find the row.
    name: "put show workbook first on the bar",
    apply: (html) => {
      const btn = /<button type="button" onClick="\{\{ toggleWb \}\}"[^>]*>\{\{ wbBtn \}\}<\/button>/;
      const m = html.match(btn);
      if (!m) return html;
      const row = html.indexOf(m[0]);
      // The row these buttons share opens just before the first of them.
      const open = html.lastIndexOf('<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">', row);
      if (open === -1) return html;
      const after = open + '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">'.length;
      // Lift it out, then put it back at the front of the row.
      const without = html.slice(0, row) + html.slice(row + m[0].length);
      const shift = row < after ? 0 : 0;
      return without.slice(0, after + shift) + m[0] + without.slice(after + shift);
    },
  },
  {
    // Thirty continuum words a day, in every lesson's packet, with a tracker.
    //
    // WHY IT IS IN EVERY LESSON. The continuum review gives one skill a week of
    // its own, which is the right shape for teaching a skill and the wrong
    // shape for keeping fifteen. A child who learned short vowels in September
    // met them again only when that sheet came round. This is the other half:
    // a daily pass across ALL fifteen, so nothing waits months for its turn.
    //
    // THE THIRTY. Two letters from P1, then one real and one made-up word from
    // each of P2 to P15 -- 2 + 14 + 14. One of each kind per concept is the
    // point: a real word can be recognised rather than decoded and a made-up
    // word cannot, so a child who is guessing shows it in one column and not
    // the other. Nothing repeats across the week.
    //
    // TWO SHEETS, NOT SIX. A sheet a day would add six pages to every packet.
    // The week is two grids of five columns, and the tracker is the sheet
    // after them.
    //
    // THE TRACKER IS PER CONCEPT, not per day, because "how am I doing" is a
    // question about skills rather than about Tuesday. Each concept scores out
    // of 2 a day and out of 10 for the week, so a child can see which of the
    // fifteen is the one still costing them marks.
    name: "put the thirty-a-day continuum sheet in every packet",
    apply: (html) => {
      const end = "</body>";
      if (!html.includes(end)) return html;
      let out = html.replace(
        end,
        '<script id="sor-continuum-daily" type="application/json">' +
          JSON.stringify(CONTINUUM_DAILY).replace(/</g, "\\u003c") +
          "</script>\n" + end,
      );

      // The rows, built once per render beside the other workbook data.
      const seat = "      wbBtn: (this.state && this.state.wbOpen) ? 'Hide workbook \u25B2' : 'Show workbook \u25BC',";
      if (!out.includes(seat)) return html;
      out = out.replace(
        seat,
        seat + "\n" +
          "      ...(() => {\n" +
          "        const CD = (() => { try {\n" +
          "          return JSON.parse(document.getElementById('sor-continuum-daily').textContent);\n" +
          "        } catch (e) { return { days: [], track: [], perDay: 0 }; } })();\n" +
          "        const DN = ['MON', 'TUE', 'WED', 'THU', 'FRI'];\n" +
          // Bigger now that the thirty sit on two sheets. On one they were
          // 12.5px in a 22px row because that was all the page had left.
          "        const cell = 'font-size:19px;font-weight:650;color:#000;" +
          "padding:9px 5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';\n" +
          // EVERY LESSON DEALS ITS OWN WEEK. The first version shipped one\n" +
          "        // week and all 62 packets printed it, so a child working lesson 3\n" +
          "        // and lesson 4 met the same thirty words twice. The pools travel\n" +
          "        // with the page -- 560 words, about 10 KB -- and each lesson takes\n" +
          "        // five consecutive words per concept from an offset derived from\n" +
          "        // its own key. Five out of 25 real and 15 made-up means no repeat\n" +
          "        // inside a week, and two lessons start in different places.\n" +
          "        const cdSeed = (() => { const k = String(id || ''); let h = 2166136261;\n" +
          "          for (let i = 0; i < k.length; i++) { h ^= k.charCodeAt(i); h = Math.imul(h, 16777619); }\n" +
          "          return h >>> 0; })();\n" +
          "        const pick = (list, n) => (list && list.length\n" +
          "          ? list[(cdSeed + n) % list.length] : null);\n" +
          "        const P = (CD.pools && CD.pools.concepts) || {};\n" +
          "        const LETT = (CD.pools && CD.pools.letters) || [];\n" +
          "        const dealt = (CD.rowConcepts || []).map((cid, r) => {\n" +
          "          const kind = CD.days[0] && CD.days[0].items[r] && CD.days[0].items[r].kind;\n" +
          "          return { cid, kind, cells: CD.days.map((d, di) => {\n" +
          "            if (kind === 'letter') {\n" +
          "              const L = pick(LETT, di * 2 + (r % 2));\n" +
          "              return { w: L ? L[0] : '', st: cell };\n" +
          "            }\n" +
          "            const pool = P[cid] && (kind === 'real' ? P[cid].real : P[cid].fake);\n" +
          "            return { w: pick(pool, di) || '', st: cell };\n" +
          "          }) };\n" +
          "        });\n" +
          "        const rows = [];\n" +
          "        for (let r = 0; r < dealt.length; r++) {\n" +
          "          // The skill is printed on the row, because the tracker is\n" +
          "          // scored by skill and a child cannot otherwise tell which\n" +
          "          // pair of the thirty belongs to which of its fifteen rows.\n" +
          "          const D2 = dealt[r];\n" +
          // The concept name, not just its number. The sheet printed a bare
          // P12 against each pair, which says nothing to the child reading
          // the row or to the teacher marking it -- the name was only on the
          // score sheet, two pages away.
          "          const named = (CD.track || []).find((t) => t.id === D2.cid);\n" +
          "          rows.push({ n: r + 1, cid: D2.cid,\n" +
          "            name: named ? named.name : '',\n" +
          "            kindLabel: D2.kind === 'real' ? 'real'\n" +
          "              : D2.kind === 'made-up' ? 'nonsense' : 'letters',\n" +
          "            cells: D2.cells });\n" +
          "        }\n" +
          // THIRTY WORDS ON TWO SHEETS. Fifteen concepts, two rows each, in
          // 913px of a 955px page: the cells were 22px high and the name of
          // the concept had no room at all. Split at P9, which is a concept
          // boundary -- a skill's real row and its nonsense row are scored
          // together and must not land on different sheets.
          "        const at = rows.findIndex((r) => r.cid === 'P9');\n" +
          "        const cut = at === -1 ? Math.ceil(rows.length / 2) : at;\n" +
          "        return {\n" +
          "          cdHas: CD.days.length > 0,\n" +
          "          cdHead: DN.slice(0, CD.days.length).map((t) => ({ t })),\n" +
          "          cdRows: rows,\n" +
          "          cdRowsA: rows.slice(0, cut),\n" +
          "          cdRowsB: rows.slice(cut),\n" +
          "          cdFirst: (rows[0] || {}).cid + '–' + ((rows[cut - 1] || {}).cid || ''),\n" +
          "          cdSecond: (rows[cut] || {}).cid + '–' + ((rows[rows.length - 1] || {}).cid || ''),\n" +
          "          cdPerDay: String(CD.perDay),\n" +
          "          cdTrack: CD.track.map((c) => ({\n" +
          "            id: c.id, name: c.name, rule: c.rule || '',\n" +
          "            days: DN.slice(0, CD.days.length).map((t) => ({ t })) })),\n" +
          "        }; })(),",
      );

      // Both sheets, in the workbook loop beside the rest.
      const kicker = ">TEN WORDS A DAY<";
      const divTag = '<div data-wb="true" style="{{ p.box1 }}">';
      if (!out.includes(kicker) || !out.includes(divTag)) return html;

      /**
       * One sheet of the thirty. Fifteen skills at two rows each did not fit
       * on one page with anything legible in the margin, so they come in two
       * halves and each half carries its own day columns and its own tick
       * row.
       */
      const grid = (rows: string, half: string, label: string) =>
        '<sc-if value="{{ cdHas }}" hint-placeholder-val="{{ true }}">\n' +
        '    <div data-wb="true" style="{{ p.box1 }}">\n' +
        '      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:12px;' +
        'border-bottom:3px solid #000;padding-bottom:8px">\n' +
        "        <div>\n" +
        '          <div style="font-family:Poppins,system-ui,sans-serif;font-size:12px;font-weight:700;' +
        'letter-spacing:.18em;color:#000">{{ p.kicker }} \u00B7 CONTINUUM REVIEW \u00B7 ' + label + '</div>\n' +
        '          <div style="font-size:26px;font-weight:800;color:#000;line-height:1.1">' +
        "\u{1F504} {{ cdPerDay }} words a day<span style=\"font-size:15px;font-weight:600\">" +
        ' \u00B7 {{ ' + half + ' }}</span></div>\n' +
        "        </div>\n" +
        '        <div style="font-size:14px;font-weight:600;white-space:nowrap">Name ________ Week ______</div>\n' +
        "      </div>\n" +
        '      <div style="font-size:13.5px;line-height:1.45;border:1.5px solid #000;border-radius:8px;' +
        'padding:7px 11px;color:#000">Read one column a day, top to bottom, on this sheet and the ' +
        "other one. Some of these words are not real words \u2014 read them anyway. Tick the ones you " +
        "read right and write the score at the foot of the column. Each skill has two rows, marked " +
        "real and nonsense, and those two rows are the one row for that skill on the score sheet.</div>\n" +
        '      <div style="display:grid;grid-template-columns:172px repeat(5,minmax(0,1fr));gap:4px 8px;' +
        'align-items:center">\n' +
        '        <span></span>\n' +
        '        <sc-for list="{{ cdHead }}" as="h" hint-placeholder-count="5">' +
        '<span style="font-family:Poppins,system-ui,sans-serif;font-size:11px;font-weight:800;' +
        'letter-spacing:.1em;color:#000;text-align:center;border-bottom:2px solid #000">' +
        "{{ h.t }}</span></sc-for>\n" +
        '        <sc-for list="{{ ' + rows + ' }}" as="r" hint-placeholder-count="16">\n' +
        '          <span style="display:flex;flex-direction:column;align-items:flex-start;' +
        'line-height:1.15;min-width:0">' +
        '<b style="font-size:11.5px;font-weight:800;color:#000">{{ r.cid }} \u00B7 {{ r.kindLabel }}</b>' +
        '<span style="font-size:10px;font-weight:600;color:#444;line-height:1.15;' +
        'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:168px">{{ r.name }}</span>' +
        "</span>\n" +
        '          <sc-for list="{{ r.cells }}" as="c" hint-placeholder-count="5">' +
        '<span style="{{ c.st }}">{{ c.w }}</span></sc-for>\n' +
        "        </sc-for>\n" +
        '        <span style="font-size:10px;font-weight:800;color:#000">\u2713 this sheet</span>\n' +
        '        <sc-for list="{{ cdHead }}" as="h" hint-placeholder-count="5">' +
        '<span style="border:2px solid #000;border-radius:4px;height:30px;margin-top:5px"></span>' +
        "</sc-for>\n" +
        "      </div>\n" +
        "    </div>\n" +
        "    </sc-if>\n    ";

      const tracker =
        '<sc-if value="{{ cdHas }}" hint-placeholder-val="{{ true }}">\n' +
        '    <div data-wb="true" style="{{ p.box1 }}">\n' +
        '      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:12px;' +
        'border-bottom:3px solid #000;padding-bottom:8px">\n' +
        "        <div>\n" +
        '          <div style="font-family:Poppins,system-ui,sans-serif;font-size:12px;font-weight:700;' +
        'letter-spacing:.18em;color:#000">{{ p.kicker }} \u00B7 MY SCORES</div>\n' +
        '          <div style="font-size:26px;font-weight:800;color:#000;line-height:1.1">' +
        "\u{1F4C8} How am I doing?</div>\n" +
        "        </div>\n" +
        '        <div style="font-size:14px;font-weight:600;white-space:nowrap">Name ________ Week ______</div>\n' +
        "      </div>\n" +
        '      <div style="font-size:13.5px;line-height:1.45;border:1.5px solid #000;border-radius:8px;' +
        'padding:7px 11px;color:#000">Two words a day for each skill, so each one is out of 2 a day and ' +
        "out of 10 for the week. The rule for each skill is written beside it — read it again before you try that row. The row with the lowest total is the one to work " +
        "on next.</div>\n" +
        '      <div style="display:grid;grid-template-columns:minmax(0,1fr) repeat(5,30px) 42px;' +
        'gap:2px 5px;align-items:center">\n' +
        '        <span></span>\n' +
        '        <sc-for list="{{ cdHead }}" as="h" hint-placeholder-count="5">' +
        '<span style="font-family:Poppins,system-ui,sans-serif;font-size:10px;font-weight:800;' +
        'color:#000;text-align:center">{{ h.t }}</span></sc-for>\n' +
        '        <span style="font-family:Poppins,system-ui,sans-serif;font-size:10px;font-weight:800;' +
        'color:#000;text-align:center">/10</span>\n' +
        '        <sc-for list="{{ cdTrack }}" as="t" hint-placeholder-count="15">\n' +
        '          <span style="display:flex;flex-direction:column;gap:1px;min-width:0;padding:2px 0">' +
        '<b style="font-size:11.5px;font-weight:700;color:#000;line-height:1.2;' +
        'white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ t.id }} \u00B7 {{ t.name }}</b>' +
        '<span style="font-size:9.5px;font-weight:500;color:#333;line-height:1.25">' +
        "{{ t.rule }}</span></span>\n" +
        '          <sc-for list="{{ t.days }}" as="d" hint-placeholder-count="5">' +
        '<span style="border:1.5px solid #000;border-radius:4px;height:19px"></span></sc-for>\n' +
        '          <span style="border:2px solid #000;border-radius:4px;height:19px"></span>\n' +
        "        </sc-for>\n" +
        "      </div>\n" +
        '      <div style="font-size:13px;font-weight:700;color:#000;border:2px solid #000;' +
        'border-radius:8px;padding:7px 11px;margin-top:4px">The skill I want to work on next: ' +
        '<span style="display:inline-block;min-width:210px;border-bottom:2px solid #000"></span></div>\n' +
        "    </div>\n" +
        "    </sc-if>\n    ";

      // Back to front, so an earlier insertion does not move a later index.
      const spots = [];
      for (let at = out.indexOf(kicker); at !== -1; at = out.indexOf(kicker, at + 1)) {
        const open = out.lastIndexOf(divTag, at);
        if (open !== -1) spots.push(open);
      }
      if (spots.length !== 2) return html;
      for (const at of spots.reverse()) {
        out = out.slice(0, at)
          + grid("cdRowsA", "cdFirst", "SHEET 1 OF 2")
          + grid("cdRowsB", "cdSecond", "SHEET 2 OF 2")
          + tracker
          + out.slice(at);
      }
      return out;
    },
  },
  {
    // The thirty-a-day sheets ride with the spiral chip too, not just the
    // workbook.
    //
    // THE ASK WAS BOTH. "Every lesson, when I click Spiral Review, has this
    // included in that packet, and it's included in the workbook too." The
    // sheets were bound to p.box1, which is show(isKey ? 'key' : 'wb'), so
    // they came with the workbook and were absent from a spiral-only print.
    // Half the requirement, reported as all of it.
    //
    // They get their own box: whatever box1 decided, plus visible when the
    // spiral chip is in the run. Only the student copy, so a spiral print does
    // not come out with each sheet twice.
    name: "print the thirty-a-day sheets with the spiral chip as well",
    apply: (html) => {
      // THE CONTAINER, which the first version of this rule forgot.
      //
      // Setting cdBox on the sheets was not enough: they sit inside the
      // student wrap, whose display is `wbOpen || has('wb')`, and a spiral-only
      // run has neither. The sheets were display:flex inside a display:none
      // parent, so the rule reported success and the spiral print came out
      // without them for as long as it has existed. Found by reading the
      // computed display of the ancestor chain during a spiral run rather
      // than trusting that the sheet's own binding was the whole story.
      //
      // Opening the wrap for a spiral run exposes nothing else: every other
      // sheet inside it is bound to box1, which is show('wb') and therefore
      // none, and the wrap holds no chrome of its own.
      const wrap = "wbWrap: { display: (this.state && this.state.wbOpen) || has('wb') " +
        "? 'flex' : 'none', flexDirection: 'column', gap: 22 },";
      if (!html.includes(wrap)) return html;
      html = html.replace(
        wrap,
        "wbWrap: { display: (this.state && this.state.wbOpen) || has('wb') || has('spiral') " +
          "? 'flex' : 'none', flexDirection: 'column', gap: 22 },",
      );

      const tail = " ({ n: i + 1, c, ans: isKey ? LADX.words[i + 1] : '' })),";
      if (!html.includes(tail)) return html;
      let out = html.replace(
        tail,
        tail +
          "\n          cdBox: { ...p.box1, display: (show(isKey ? 'key' : 'wb')" +
          " || (!isKey && has('spiral'))) ? 'flex' : 'none' },",
      );

      // Both sheets, in both copies of the markup.
      const before = '<div data-wb="true" style="{{ p.box1 }}">\n      <div style="display:flex;' +
        'justify-content:space-between;align-items:flex-end;gap:12px;border-bottom:3px solid #000;' +
        'padding-bottom:8px">\n        <div>\n          <div style="font-family:Poppins,' +
        'system-ui,sans-serif;font-size:12px;font-weight:700;letter-spacing:.18em;color:#000">' +
        "{{ p.kicker }} \u00B7 CONTINUUM REVIEW</div>";
      if (!out.includes(before)) return html;
      out = out.split(before).join(before.replace("{{ p.box1 }}", "{{ p.cdBox }}"));

      const before2 = '<div data-wb="true" style="{{ p.box1 }}">\n      <div style="display:flex;' +
        'justify-content:space-between;align-items:flex-end;gap:12px;border-bottom:3px solid #000;' +
        'padding-bottom:8px">\n        <div>\n          <div style="font-family:Poppins,' +
        'system-ui,sans-serif;font-size:12px;font-weight:700;letter-spacing:.18em;color:#000">' +
        "{{ p.kicker }} \u00B7 MY SCORES</div>";
      if (!out.includes(before2)) return html;
      out = out.split(before2).join(before2.replace("{{ p.box1 }}", "{{ p.cdBox }}"));

      return out;
    },
  },
  {
    // The mClass daily review: five days of five minutes, on the five things
    // a child is actually scored on.
    //
    // WHY IT IS HERE AT ALL. The data chat hands back six numbers and a goal
    // and nothing to do about it. scripts/build-daily-practice.mjs has built
    // the week for every lesson since it was asked for, and /practice has
    // rendered it, but nothing linked to that page and no packet carried it.
    // A sheet nobody can reach is a sheet nobody uses.
    //
    // A DAY IS A PAGE. Monday to Friday, five sheets, and everything on a
    // sheet is that day's work: the passage, the day's six real words and
    // four made-up ones, three maze sentences and the word race. The first
    // version of this was one sheet holding the whole week, which meant a
    // child hunting for today's row and a teacher explaining where it was.
    // A sixth sheet carries the answers and says to take it out before
    // copying -- they were under the child's maze to begin with, about two
    // inches below the question.
    //
    // THE PASSAGE IS PRINTED ON ALL FIVE, and it is the same passage. The
    // packet already holds it once as the decodable sheet, so this is the
    // one duplication in the packet that is on purpose: repeated reading of
    // ONE text is what moves fluency and accuracy, the log on each page is
    // where Monday and Friday end up next to each other, and a day page that
    // says "go and find the other sheet" is not a day page. The word race is
    // the same list all week for the same reason. The words and the maze
    // change daily, because the same ten words five times measures memory.
    //
    // ITS OWN CHIP, not the spiral one. The single sheet rode with 🌀 Spiral
    // review because the ask was for "a spiral review for a quick practice
    // daily". Six sheets is not a quick spiral print, so these sit on
    // {{ p.box1 }} and come out only when ⏱ mClass daily is lit.
    name: "put the mClass daily review in every packet",
    apply: (html) => {
      const end = "</body>";
      if (!html.includes(end)) return html;

      // Every lesson in the sequence, not just the ones the builder offers
      // today, and keyed by lesson so one added later gets its week without a
      // second edit here. The maze arrives as three strings and the answer --
      // what is before the gap, the three choices, what is after -- because
      // the alternative is a token object per word, which was eight times the
      // bytes for a renderer that can hold a sentence in one string.
      type Day = {
        wrf: string[];
        nwf: string[];
        maze: { s: string; at: number; before: string; after: string; choices: string[]; answer: string }[];
      };
      type Week = {
        key: string;
        mazeFrom: "g2" | "g3";
        race: string[];
        msDays: { wrf: string[]; nwf: string[] }[] | null;
        passage: { title: string; paras: string[]; words: number };
        days: Day[];
      };
      const weeks: Record<string, {
        t: string;
        n: number;
        p: string[];
        r: string[];
        g: boolean;
        d: { w: string[]; s: string[]; m: string[][] }[];
        /** The same five days in multisyllabic words, or null if there are none. */
        ms: { w: string[]; s: string[] }[] | null;
      }> = {};
      for (const L of (DAILY_PRACTICE as unknown as { lessons: Week[] }).lessons) {
        weeks[L.key] = {
          t: L.passage.title,
          n: L.passage.words,
          p: L.passage.paras,
          r: L.race,
          g: L.mazeFrom === "g3",
          ms: L.msDays ? L.msDays.map((d) => ({ w: d.wrf, s: d.nwf })) : null,
          d: L.days.map((day) => ({
            w: day.wrf,
            s: day.nwf,
            m: day.maze.map((m) => {
              const words = m.s.split(/\s+/);
              return [
                (words.slice(0, m.at).join(" ") + " " + m.before).trim(),
                m.choices.join("  /  "),
                (m.after + " " + words.slice(m.at + 1).join(" ")).trim(),
                m.answer,
              ];
            }),
          })),
        };
      }

      let out = html.replace(
        end,
        '<script id="sor-mclass-daily" type="application/json">' +
          JSON.stringify(weeks).replace(/</g, "\\u003c") +
          "</script>\n" + end,
      );

      // The week, built once per render beside the other workbook data.
      const seat = "      wbBtn: (this.state && this.state.wbOpen) ? 'Hide workbook ▲' : 'Show workbook ▼',";
      if (!out.includes(seat)) return html;
      out = out.replace(
        seat,
        seat + "\n" +
          "      ...(() => {\n" +
          "        const MD = (() => { try {\n" +
          "          return JSON.parse(document.getElementById('sor-mclass-daily').textContent);\n" +
          "        } catch (e) { return {}; } })();\n" +
          // A sub-focus keeps its lesson's week. The picker offers 218 entries
          // for 68 lessons -- 'cvc-mix|i' is short vowel review narrowed to i --
          // and only the 68 have practice data, so a straight MD[id] left 150 of
          // them with no sheet at all. The page already resolves a focus to its
          // lesson this way everywhere else: byId[id.split('|')[0]].
          "        const W = MD[id] || MD[String(id).split('|')[0]] || null;\n" +
          "        if (!W) return { mcHas: false, mcDays: [], mcKey: [], mcRaceWords: [], mcLog: [] };\n" +
          "        const DN = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];\n" +
          "        const paras = (W.p || []).map((t) => ({ t }));\n" +
          "        const race = (W.r || []).map((w) => ({ w }));\n" +
          "        const days = W.d || [];\n" +
          // The page's own "Use multisyllabic words" switch. When it is on,
          // the other sheets in the packet swap to the harder bank, and the
          // word rows here swap with them -- a child working above single
          // syllables should not be handed cat and hop on the one page that
          // is meant to stretch them. Fourteen lessons have no multisyllabic
          // bank at all; those keep the rows they had, which is what the
          // switch does everywhere else on the page.
          "        const rows = (isMulti && W.ms && W.ms.length) ? W.ms : days;\n" +
          // The maze is cut from the lesson's grade 2 reading while the page
          // above prints its grade 3 one, so the sentences are deliberately
          // not the ones the child just read -- and for some lessons the two
          // are different stories rather than one told twice. A teacher
          // comparing the two should not have to work that out.
          "        const mazeHow = 'from the other reading in this lesson — circle the word that fits';\n" +
          "        return {\n" +
          "          mcHas: days.length > 0,\n" +
          "          mcDays: days.map((d, i) => ({\n" +
          "            t: DN[i] || ('DAY ' + (i + 1)),\n" +
          "            of: 'DAY ' + (i + 1) + ' OF ' + days.length,\n" +
          "            title: W.t,\n" +
          "            nWords: (W.n || 0) + ' words',\n" +
          "            paras: paras,\n" +
          "            real: ((rows[i] || d).w || []).map((w) => ({ w })),\n" +
          "            silly: ((rows[i] || d).s || []).map((w) => ({ w })),\n" +
          "            nReal: '/ ' + (((rows[i] || d).w) || []).length,\n" +
          "            nSilly: '/ ' + (((rows[i] || d).s) || []).length,\n" +
          "            realLbl: (isMulti && W.ms && W.ms.length) ? 'REAL \\u00b7 2+ SYLLABLES' : 'REAL',\n" +
          "            maze: (d.m || []).map((m, j) => ({ n: (j + 1) + '.', b: m[0], c: m[1], a: m[2] })),\n" +
          "            mazeHow: mazeHow,\n" +
          "          })),\n" +
          "          mcKey: days.map((d, i) => ({\n" +
          "            t: DN[i] || ('DAY ' + (i + 1)),\n" +
          // The answer in brackets. The key printed the sentence with the
          // answer word sitting in it unmarked, which is the sentence rather
          // than the answer and leaves a teacher working out which word was
          // the gap.
          "            items: (d.m || []).map((m, j) => ({\n" +
          "              t: (j + 1) + '. ' + m[0] + ' [' + m[3] + '] ' + m[2],\n" +
          "            })),\n" +
          "            words: 'Real: ' + (((rows[i] || d).w) || []).join(', ')\n" +
          "              + ' · Silly: ' + (((rows[i] || d).s) || []).join(', '),\n" +
          "          })),\n" +
          "          mcRaceWords: race,\n" +
          "          mcLog: ['MON', 'TUE', 'WED', 'THU', 'FRI'].map((t) => ({ t })),\n" +
          "        }; })(),",
      );

      const H = 'font-family:Poppins,system-ui,sans-serif;font-size:11px;font-weight:800;letter-spacing:.14em;color:#000';
      const NUM = 'font-size:11px;font-weight:800;color:#fff;background:#000;border-radius:999px;' +
        'width:17px;height:17px;display:inline-flex;align-items:center;justify-content:center;flex:none';
      const BOX = 'display:inline-block;width:46px;height:20px;border:2px solid #000;border-radius:4px;vertical-align:middle';

      // One sheet per day, then the answers.
      const sheet =
        '<sc-if value="{{ mcHas }}" hint-placeholder-val="{{ true }}">\n' +
        '    <sc-for list="{{ mcDays }}" as="d" hint-placeholder-count="5">\n' +
        '    <div data-wb="true" style="{{ p.box1 }}">\n' +
        '      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:12px;' +
        'border-bottom:3px solid #000;padding-bottom:7px">\n' +
        "        <div>\n" +
        '          <div style="' + H + '">{{ p.kicker }} · MCLASS DAILY · {{ d.of }}</div>\n' +
        '          <div style="font-size:27px;font-weight:800;color:#000;line-height:1.05">{{ d.t }}</div>\n' +
        "        </div>\n" +
        '        <div style="font-size:12.5px;font-weight:600;white-space:nowrap;text-align:right">' +
        "Name ______________<br>Date ____________</div>\n" +
        "      </div>\n" +

        // 1 — the passage, read out loud, and the numbers written down
        '      <div style="display:flex;align-items:baseline;gap:8px;border-bottom:2px solid #000;' +
        'padding-bottom:3px">\n' +
        '        <span style="' + NUM + '">1</span>\n' +
        '        <span style="font-size:14.5px;font-weight:800;color:#000">Read it out loud</span>\n' +
        '        <span style="' + H + ';font-size:10px">ORF + ACCURACY</span>\n' +
        '        <span style="flex:1"></span>\n' +
        '        <span style="font-size:11.5px;font-weight:600;color:#000">⏱ 1 minute</span>\n' +
        "      </div>\n" +
        '      <div style="font-size:13px;font-weight:700;color:#000">📖 {{ d.title }} · {{ d.nWords }}</div>\n' +
        '      <sc-for list="{{ d.paras }}" as="x" hint-placeholder-count="5">' +
        '<div style="font-size:16px;line-height:1.56;color:#000;margin-bottom:4px">{{ x.t }}</div>' +
        "</sc-for>\n" +
        '      <div style="display:flex;align-items:center;gap:9px;flex-wrap:wrap;border:2px solid #000;' +
        'border-radius:8px;padding:6px 10px;font-size:12px;font-weight:700;color:#000">\n' +
        '        <span>Words read <span style="' + BOX + '"></span></span>\n' +
        "        <span>−</span>\n" +
        '        <span>Wrong <span style="' + BOX + ';width:38px"></span></span>\n' +
        "        <span>=</span>\n" +
        '        <span>Right <span style="' + BOX + '"></span></span>\n' +
        '        <span style="flex:1"></span>\n' +
        '        <span style="font-size:13.5px">How it felt \u{1F642} \u{1F610} \u{1F641}</span>\n' +
        "      </div>\n" +

        // 2 — the day's words, real and made up
        '      <div style="display:flex;align-items:baseline;gap:8px;border-bottom:2px solid #000;' +
        'padding-bottom:3px">\n' +
        '        <span style="' + NUM + '">2</span>\n' +
        '        <span style="font-size:14.5px;font-weight:800;color:#000">Real words and silly words</span>\n' +
        '        <span style="' + H + ';font-size:10px">WRF + NWF</span>\n' +
        '        <span style="flex:1"></span>\n' +
        '        <span style="font-size:11.5px;font-weight:600;color:#000">read each one, tick it</span>\n' +
        "      </div>\n" +
        '      <div style="display:flex;align-items:center;gap:9px;flex-wrap:wrap">\n' +
        '        <span style="' + H + ';font-size:10px;flex:none;width:58px">{{ d.realLbl }}</span>\n' +
        '        <span style="display:flex;gap:9px;flex-wrap:wrap;flex:1;min-width:0">' +
        '<sc-for list="{{ d.real }}" as="r" hint-placeholder-count="6">' +
        '<span style="font-size:16.5px;font-weight:650;color:#000;white-space:nowrap">☐ {{ r.w }}</span>' +
        "</sc-for></span>\n" +
        '        <span style="font-size:12.5px;font-weight:700;color:#000">__ {{ d.nReal }}</span>\n' +
        "      </div>\n" +
        '      <div style="display:flex;align-items:center;gap:9px;flex-wrap:wrap;border-top:1px dashed #000;' +
        'padding-top:4px">\n' +
        '        <span style="' + H + ';font-size:10px;flex:none;width:58px">SILLY</span>\n' +
        '        <span style="display:flex;gap:9px;flex-wrap:wrap;flex:1;min-width:0">' +
        '<sc-for list="{{ d.silly }}" as="s" hint-placeholder-count="4">' +
        '<span style="font-size:16.5px;font-weight:650;color:#000;white-space:nowrap">☐ {{ s.w }}</span>' +
        "</sc-for></span>\n" +
        '        <span style="font-size:12.5px;font-weight:700;color:#000">__ {{ d.nSilly }}</span>\n' +
        "      </div>\n" +
        '      <div style="font-size:11px;line-height:1.4;color:#000">The silly words are not real. ' +
        "Sound by sound counts, and all at once counts too.</div>\n" +

        // 3 — three maze sentences
        '      <div style="display:flex;align-items:baseline;gap:8px;border-bottom:2px solid #000;' +
        'padding-bottom:3px">\n' +
        '        <span style="' + NUM + '">3</span>\n' +
        '        <span style="font-size:14.5px;font-weight:800;color:#000">Fill in the blank</span>\n' +
        '        <span style="' + H + ';font-size:10px">MAZE</span>\n' +
        '        <span style="flex:1"></span>\n' +
        '        <span style="font-size:11.5px;font-weight:600;color:#000">{{ d.mazeHow }}</span>\n' +
        "      </div>\n" +
        '      <sc-for list="{{ d.maze }}" as="m" hint-placeholder-count="3">\n' +
        '        <div style="font-size:16px;line-height:1.58;color:#000">{{ m.n }} {{ m.b }} ' +
        '<span style="border:1.5px solid #000;border-radius:7px;padding:1px 7px;font-weight:650">' +
        "{{ m.c }}</span> {{ m.a }}</div>\n" +
        "      </sc-for>\n" +

        '      <div style="font-size:12px;font-weight:600;color:#000;border-top:1px solid #000;' +
        'padding-top:6px">⏱ Then the word race — the sheet at the back of the week, one minute, ' +
        "every day.</div>\n" +
        "    </div>\n" +
        "    </sc-for>\n" +

        // the word race: one sheet for the week, because it is one list for the
        // week. Seventy-two words so the sheet outlasts the minute -- at a
        // word a second that is sixty, and a fluent reader passes sixty on a
        // list. On a day page it added 132px and every lesson overflowed.
        '    <div data-wb="true" style="{{ p.box1 }}">\n' +
        '      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:12px;' +
        'border-bottom:3px solid #000;padding-bottom:7px">\n' +
        "        <div>\n" +
        '          <div style="' + H + '">{{ p.kicker }} · WORD RACE · WRF</div>\n' +
        '          <div style="font-size:27px;font-weight:800;color:#000;line-height:1.05">' +
        "\u{1F3C1} Word race</div>\n" +
        "        </div>\n" +
        '        <div style="font-size:12.5px;font-weight:600;white-space:nowrap;text-align:right">' +
        "Name ______________<br>Week ____________</div>\n" +
        "      </div>\n" +
        '      <div style="font-size:13.5px;line-height:1.45;border:1.5px solid #000;border-radius:8px;' +
        'padding:7px 11px;color:#000"><b>How:</b> one minute, every day. Read across the rows. Mark ' +
        "where you stop and write the number in today's box. Read every word — no skipping. The " +
        "list is the same all week, so Friday should get further than Monday.</div>\n" +
        '      <div style="display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:7px 10px">' +
        '<sc-for list="{{ mcRaceWords }}" as="w" hint-placeholder-count="72">' +
        '<span style="font-size:17px;font-weight:650;color:#000;white-space:nowrap">{{ w.w }}</span>' +
        "</sc-for></div>\n" +
        '      <div style="display:grid;grid-template-columns:auto repeat(5,minmax(0,1fr));gap:8px;' +
        'align-items:center;border:2px solid #000;border-radius:10px;padding:10px 12px">\n' +
        '        <span style="' + H + ';font-size:10px">HOW FAR?</span>\n' +
        '        <sc-for list="{{ mcLog }}" as="d" hint-placeholder-count="5">\n' +
        '          <span style="text-align:center">' +
        '<span style="font-size:11px;font-weight:800;color:#000;display:block;margin-bottom:3px">' +
        '{{ d.t }}</span>' +
        '<span style="display:inline-block;width:62px;height:30px;border:2px solid #000;' +
        'border-radius:4px"></span></span>\n' +
        "        </sc-for>\n" +
        "      </div>\n" +
        '      <div style="font-size:13px;font-weight:700;color:#000">On Friday I read ' +
        '<span style="display:inline-block;min-width:50px;border-bottom:2px solid #000"></span> more ' +
        "words than on Monday.</div>\n" +
        '      <div style="flex:1"></div>\n' +
        "    </div>\n" +

        // and the answers.
        //
        // p.dsBox, not p.box1: that is `key && show('key')`, which is how the
        // dictation script and the other teacher sheets keep themselves out
        // of the child's copy. On box1 this printed inside the student
        // workbook, carrying a line that asked the teacher to take it out
        // again -- a sheet of answers in the packet the child is handed.
        '    <div data-wb="true" style="{{ p.dsBox }}">\n' +
        '      <div style="border-bottom:3px solid #000;padding-bottom:7px">\n' +
        '        <div style="' + H + '">{{ p.kicker }} · MCLASS DAILY · TEACHER COPY</div>\n' +
        '        <div style="font-size:26px;font-weight:800;color:#000;line-height:1.05">' +
        "Answers for the week</div>\n" +
        '        <div style="font-size:12.5px;color:#000;margin-top:3px">The maze answer is the word ' +
        "in brackets.</div>\n" +
        "      </div>\n" +
        '      <sc-for list="{{ mcKey }}" as="k" hint-placeholder-count="5">\n' +
        '        <div style="display:flex;gap:11px;align-items:flex-start;border-bottom:1px solid #000;' +
        'padding-bottom:6px">\n' +
        '          <span style="' + H + ';font-size:10px;flex:none;width:84px">{{ k.t }}</span>\n' +
        '          <div style="flex:1;min-width:0">' +
        '<sc-for list="{{ k.items }}" as="i" hint-placeholder-count="3">' +
        '<div style="font-size:13.5px;line-height:1.5;color:#000">{{ i.t }}</div></sc-for>' +
        '<div style="font-size:12px;color:#000;margin-top:2px">{{ k.words }}</div></div>\n' +
        "        </div>\n" +
        "      </sc-for>\n" +
        '      <div style="flex:1"></div>\n' +
        "    </div>\n" +
        "    </sc-if>\n    ";

      // The line under "Student workbook + answer key" still listed the five
      // pages the packet had when it was written. Say what is in it now.
      const summary = "writing, decodable + questions, fluency check'";
      if (out.includes(summary)) {
        out = out.replace(
          summary,
          "writing, decodable + questions, fluency check, sentence building, " +
            "word ladder, 30 a day + my scores, mClass daily review'",
        );
      }

      // Beside the continuum sheets, in both copies of the markup.
      const kicker = ">TEN WORDS A DAY<";
      const divTag = '<div data-wb="true" style="{{ p.box1 }}">';
      if (!out.includes(kicker) || !out.includes(divTag)) return html;
      const spots = [];
      for (let at = out.indexOf(kicker); at !== -1; at = out.indexOf(kicker, at + 1)) {
        const open = out.lastIndexOf(divTag, at);
        if (open !== -1) spots.push(open);
      }
      if (spots.length !== 2) return html;
      // Back to front, so an earlier insertion does not move a later index.
      for (const at of spots.reverse()) {
        out = out.slice(0, at) + sheet + out.slice(at);
      }
      return out;
    },
  },
  {
    // A print chip for every part of the workbook.
    //
    // There were six chips and twenty-two printable sheets, so most of the
    // packet was all-or-nothing: a teacher who wanted the words but not the
    // writing page printed the writing page. Each sheet now has its own chip,
    // lit to print and unlit to leave out.
    //
    // HOW, without rewriting twenty-two style bindings. Each sheet is labelled
    // with data-part at seed time, and the print fit -- which already runs on
    // beforeprint and already walks every [data-wb] -- hides the ones whose
    // chip is off and puts them back afterwards. Rewriting each box's display
    // would have meant touching fifteen separate bindings, several of which
    // other rules also anchor on.
    //
    // Workbook and Answer key stay what they were: which COPY to print. The
    // new chips are which SHEETS go in it.
    name: "give every workbook part its own print chip",
    apply: (html) => {
      // 1. Label each sheet with the part it belongs to.
      const MARKS = [
        ["\u00B7 SYLLABLE DIVISION", "syllable"],
        [">TEN WORDS A DAY<", "tenwords"],
        [">WORD LADDER<", "ladder"],
        ["\u00B7 READ IT", "read"],
        ["\u00B7 SPELLING", "spell"],
        ["\u00B7 WRITING", "write"],
        ["\u00B7 MYSTERY", "mystery"],
        ["\u00B7 DECODABLE", "decodable"],
        ["\u00B7 FLUENCY CHECK", "fluency"],
        ["\u00B7 SENTENCE BUILDING", "sentence"],
        ["\u00B7 CONTINUUM REVIEW", "continuum"],
        ["\u00B7 MY SCORES", "scores"],
        ["\u00B7 MCLASS DAILY", "mclass"],
        // The word race belongs to the mClass daily chip: it is that week's
        // fifth measure, on its own sheet because the list is too long to
        // ride on a day page. Without a data-part it answered to no chip at
        // all and printed on every run, and the print fit -- which walks
        // [data-part] -- never looked at it.
        ["\u00B7 WORD RACE", "mclass"],
      ];
      let out = html;
      for (const [mark, key] of MARKS) {
        const spots = [];
        for (let at = out.indexOf(mark); at !== -1; at = out.indexOf(mark, at + 1)) {
          const open = out.lastIndexOf('<div data-wb="true"', at);
          if (open !== -1) spots.push(open);
        }
        if (!spots.length) return html;
        // Back to front, and each sheet only once.
        for (const at of [...new Set(spots)].sort((a, b) => b - a)) {
          const tagEnd = at + '<div data-wb="true"'.length;
          if (out.slice(at, at + 300).includes("data-part=")) continue;
          out = out.slice(0, tagEnd) + ' data-part="' + key + '"' + out.slice(tagEnd);
        }
      }

      // 2. A chip each, lit by default like the rest.
      const chips = "['spiral', '\u{1F300} Spiral review']];";
      if (!out.includes(chips)) return html;
      out = out.replace(
        chips,
        "['spiral', '\u{1F300} Spiral review'],\n" +
          "          ['syllable', '\u2702\uFE0F Syllable division'], " +
          "['tenwords', '\u{1F4C5} Ten words a day'],\n" +
          "          ['ladder', '\u{1FA9C} Word ladder'], ['read', '\u{1F4D6} Read it'],\n" +
          "          ['spell', '\u270D\uFE0F Spelling'], ['write', '\u270F\uFE0F Writing'],\n" +
          "          ['mystery', '\u{1F50D} Mystery'], ['decodable', '\u{1F4D8} Decodable'],\n" +
          "          ['fluency', '\u23F1 Fluency check'], " +
          "['sentence', '\u{1F9E9} Sentence building'],\n" +
          "          ['continuum', '\u{1F504} 30 a day'], ['scores', '\u{1F4C8} My scores'],\n" +
          "          ['mclass', '⏱ mClass daily']];",
      );

      // 3. The off list, where the print fit can see it.
      const off = "        const off = POFF;";
      if (!out.includes(off)) return html;
      out = out.replace(off, "        const off = POFF;\n        this._partsOff = off;");

      // 4. The fit hides the parts that are off, and puts them back after.
      const blank = "if (e.dataset.mh === undefined) e.dataset.mh = e.style.minHeight;";
      if (!out.includes(blank)) return html;
      out = out.replace(
        "const pages = [...document.querySelectorAll('[data-wb]:not([data-land])')].filter((e) =>",
        "const offParts = this._partsOff || [];\n" +
          "      document.querySelectorAll('[data-part]').forEach((e) => {\n" +
          "        if (offParts.indexOf(e.dataset.part) === -1) return;\n" +
          "        if (e.dataset.wasShown === undefined) e.dataset.wasShown = e.style.display;\n" +
          "        e.style.display = 'none';\n" +
          "      });\n" +
          "      const pages = [...document.querySelectorAll('[data-wb]:not([data-land])')].filter((e) =>",
      );
      out = out.replace(
        "this.unfit = () => document.querySelectorAll('[data-wb]:not([data-land])').forEach((e) => {",
        "this.unfit = () => { document.querySelectorAll('[data-part]').forEach((e) => {\n" +
          "        if (e.dataset.wasShown === undefined) return;\n" +
          "        e.style.display = e.dataset.wasShown; delete e.dataset.wasShown;\n" +
          "      });\n" +
          "      document.querySelectorAll('[data-wb]:not([data-land])').forEach((e) => {",
      );
      // The arrow body now needs its closing brace.
      out = out.replace(
        "e.style.breakAfter = ''; e.style.pageBreakAfter = ''; });",
        "e.style.breakAfter = ''; e.style.pageBreakAfter = '';" +
          // Cleared too, or a sheet that split once stays splittable in the
          // preview after the print is over.
          " e.style.breakInside = ''; e.style.pageBreakInside = ''; }); };",
      );

      return out;
    },
  },
  {
    // A sheet shrinks a little or it splits. It never squashes.
    //
    // Three sheets did not fit one page and the fit scaled them to make them:
    // Read it to 0.88, Spelling to 0.79, Writing to 0.71. Writing is a passage,
    // its questions and the lines a child writes the answer on, and at 0.71
    // those lines are 25mm apart on paper -- too close to write between. The
    // scale was solving the printer's problem by taking the space the work
    // needs.
    //
    // So there is a floor. Down to 0.85 a sheet is scaled, which is small
    // enough to be invisible and large enough to still be written on. Below it
    // the sheet is left at full size and allowed to run onto a second page
    // instead, which is what a sheet holding more than a page of work should do.
    // The exercise blocks already carry break-inside: avoid, so a split falls
    // between exercises rather than through one.
    //
    // Read it needs 0.88 and stays one page. Spelling and Writing split.
    name: "let an over-full sheet split rather than shrink past readable",
    apply: (html) => {
      const old =
        "if (h > max) e.style.zoom = String(Math.max(0.6, max / h - 0.005)); " +
        "else e.style.minHeight = e.dataset.mh || '';";
      if (!html.includes(old)) return html;
      return html.replace(
        old,
        "if (h > max) {\n" +
          "          const z = max / h - 0.005;\n" +
          "          if (z >= 0.85) { e.style.zoom = String(z); }\n" +
          "          else {\n" +
          "            // More than a page of work: let it be two pages at full\n" +
          "            // size rather than one page nobody can write on.\n" +
          "            e.style.zoom = '';\n" +
          "            e.style.minHeight = '0';\n" +
          "            e.style.breakInside = 'auto';\n" +
          "            e.style.pageBreakInside = 'auto';\n" +
          "          }\n" +
          "        } else { e.style.minHeight = e.dataset.mh || ''; }",
      );
    },
  },
  {
    // Serve React and Babel ourselves instead of from unpkg.
    //
    // The builder fetched three files from unpkg at load: React, ReactDOM, and
    // @babel/standalone, which compiles the page's own JSX in the browser. Any
    // one of them failing leaves the page blank -- the same blank page a thrown
    // renderVals() gives, with nothing on screen to say which it was. A test
    // run hit exactly that when unpkg did not answer.
    //
    // A school network that blocks or throttles a CDN would do the same thing
    // in a classroom, and the teacher would have no way to tell that the Hub
    // was fine and the CDN was not.
    //
    // The two React files are vendored under science-of-reading/vendor and
    // seeded like every other material, so they come from the same origin as
    // the page and go down with it or not at all. 140 KB.
    //
    // React and ReactDOM only. Babel is not vendored: see the note below --
    // nothing here loads JSX, so it has never been fetched at all.
    name: "serve React and Babel from the Hub rather than unpkg",
    apply: (html) => {
      const SWAP = [
        ["https://unpkg.com/react@18.3.1/umd/react.production.min.js", "./vendor/react.production.min.js"],
        ["https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js", "./vendor/react-dom.production.min.js"],
        // Babel is deliberately NOT vendored, and its URL is left pointing at
        // the CDN. Every x-import across all 860 materials loads
        // ./deck-stage.js, which is plain JavaScript, so the runtime's jsx
        // branch never fires and ensureBabel() is never called: Babel has
        // never been fetched by any page here. Vendoring it put 3.1 MB in the
        // table to serve nothing.
        //
        // The URL stays on unpkg rather than on a local path that is not there,
        // so a page that one day does import JSX gets a working fetch instead
        // of a 404. Nothing today reaches it either way.
      ];
      let out = html;
      for (const [from, to] of SWAP) {
        if (!out.includes(from)) return html;
        out = out.split(from).join(to);
      }
      return out;
    },
  },
  {
    // Stop asking for a file that has never existed.
    //
    // componentDidMount opened with
    //
    //     import('./sor-extra.js').then(...).catch(() => {});
    //
    // and sor-extra.js is not in this repo and never has been. Every page load
    // fetched it, got a 404, and swallowed the error, which is why it survived
    // this long: the console showed a failed request and the page looked fine.
    //
    // It is safe to drop rather than to supply, because what it fed is
    // unreachable anyway. XT.DEC sits third in the decodable chain --
    //
    //     PGV || D[id] || XT.DEC[id] || OGD[id].p.dec
    //
    // -- and PGV, the concept's own passage, now exists for all 68 lessons, so
    // nothing ever falls through to it. XT.HEART_EXTRA only ever added heart
    // words on top of the lesson's own.
    //
    // The XT references stay as they are: they already read
    // (this.state.xt) || {}, so with nothing setting that state they are
    // guarded no-ops rather than errors, and unpicking five fallback chains to
    // delete a branch nothing reaches would risk more than it removes.
    name: "drop the import of a file that is not there",
    apply: (html) => {
      const dead =
        "import('./sor-extra.js').then((m) => this.setState({ xt: " +
        "{ DEC: m.DEC, HEART_EXTRA: m.HEART_EXTRA } })).catch(() => {});";
      if (!html.includes(dead)) return html;
      return html.split(dead).join("");
    },
  },
];

/**
 * The maths hub is a plain HTML export rather than a canvas one, so it has
 * no dc-runtime marker and takes its own short list of rules.
 */
const MATH_HUB = "math/math-hub.html";

const MATH_ADAPTATIONS: Adaptation[] = [
  {
    // The practice a standard actually has.
    //
    // The hub ships four computations and two word problems per standard
    // and every part of the page indexes straight into them: the warm-up
    // takes c[0], the drills c[1] and c[2], the review c[3], the exit
    // ticket c[0] again. So a teacher who runs a lesson twice hands out the
    // same sheet, and the group below grade and the group ahead get it too.
    //
    // scripts/math-practice.json holds twelve and six for the 130 standards
    // that are arithmetic, with every answer re-derived by its own checker,
    // and it says which standard to read for below-grade and above-grade
    // practice -- the one this standard stands on, and the next in its
    // strand.
    //
    // Nothing downstream changes. PRAC[code] becomes pracFor(code), which
    // returns the same shape from whichever standard and whichever set of
    // items the two new controls are asking for.
    name: "widen the practice, and give it a level and a new set",
    apply: (html) => {
      const decl = "var PRAC = ";
      if (!html.includes(decl)) return html;
      const end = html.indexOf(";\n", html.indexOf(decl));
      if (end === -1) return html;

      const inject =
        ";\n  var MATHP = " + JSON.stringify(MATHP) + ";\n" +
        "  // Which of the three levels, and which set of items within it.\n" +
        "  var mathLevel = 'on';\n" +
        "  var mathSet = 0;\n" +
        "  /**\n" +
        "   * The practice for a standard, in the shape the page already\n" +
        "   * expects: four computations and two word problems, with their\n" +
        "   * answers. Which four and which two is what the controls change.\n" +
        "   */\n" +
        "  // Reads the shipped table. Written as its own function because\n" +
        "  // the rewrite below turns every PRAC[code] into pracFor(code),\n" +
        "  // and it would have turned this one too -- a function whose\n" +
        "  // fallback is itself, which is a stack overflow on any standard\n" +
        "  // that has no generated items.\n" +
        "  function pracRaw(c) { return PRAC[c]; }\n" +
        "  function pracFor(code) {\n" +
        "    var lv = MATHP.levels[code];\n" +
        "    var from = lv ? (lv[mathLevel] || code) : code;\n" +
        "    var bank = MATHP.items[from];\n" +
        "    if (!bank) return pracRaw(code);\n" +
        "    // Four at a time out of twelve, two out of six, so a third run\n" +
        "    // of the same lesson is still a sheet nobody has seen.\n" +
        "    var cAt = (mathSet * 4) % bank.c.length;\n" +
        "    var wAt = (mathSet * 2) % bank.w.length;\n" +
        "    var ring = function (list, at, n) {\n" +
        "      var out = [];\n" +
        "      for (var i = 0; i < n; i++) out.push(list[(at + i) % list.length]);\n" +
        "      return out;\n" +
        "    };\n" +
        "    var c = ring(bank.c, cAt, 4), w = ring(bank.w, wAt, 2);\n" +
        "    return {\n" +
        "      c: c.map(function (x) { return x.q; }),\n" +
        "      ac: c.map(function (x) { return x.a; }),\n" +
        "      w: w.map(function (x) { return x.q; }),\n" +
        "      aw: w.map(function (x) { return x.a; })\n" +
        "    };\n" +
        "  }\n" +
        "  var MATH_SETS = 3";

      let out = html.slice(0, end) + inject + html.slice(end);

      // every read goes through the indirection; the table itself stays
      out = out.split("PRAC[code]").join("pracFor(code)");
      out = out.split("PRAC[rc]").join("pracFor(rc)");
      if (out.indexOf("var PRAC = ") === -1) return html;

      // the controls, beside the standard they act on
      const row =
        '      <input id="search" type="search" placeholder="Search standard, e.g. 3.OA" ' +
        'aria-label="Search standards">\n    </div>';
      if (!out.includes(row)) return html;
      out = out.replace(
        row,
        row.slice(0, row.length - "\n    </div>".length) +
          '\n      <label class="label" for="mathlevel">Level</label>' +
          '\n      <select id="mathlevel">' +
          '<option value="below">Below grade</option>' +
          '<option value="on" selected>On grade</option>' +
          '<option value="above">Above grade</option></select>' +
          '\n      <button type="button" id="mathset">New set</button>' +
          '\n      <span class="label" id="mathsetnote"></span>' +
          "\n    </div>",
      );

      // and the wiring, on the same update the standard already triggers
      const hook = '  stdSel.addEventListener("change", update);';
      if (!out.includes(hook)) return html;
      out = out.replace(
        hook,
        // The note names the standard the practice is coming from, so it
        // goes stale the moment a different standard is picked.
        '  stdSel.addEventListener("change", function () { update(); mathNote(); });' +
          "\n  var levelSel = document.getElementById('mathlevel');\n" +
          "  var setBtn = document.getElementById('mathset');\n" +
          "  var setNote = document.getElementById('mathsetnote');\n" +
          "  function mathNote() {\n" +
          "    if (!setNote) return;\n" +
          "    var code = stdSel.value;\n" +
          "    var lv = MATHP.levels[code];\n" +
          "    if (!lv) { setNote.textContent = 'one set written for this standard'; return; }\n" +
          "    var from = lv[mathLevel] || code;\n" +
          "    setNote.textContent = 'set ' + (mathSet + 1) + ' of ' + MATH_SETS +\n" +
          "      (from === code ? '' : ' \\u00b7 from ' + from);\n" +
          "  }\n" +
          "  if (levelSel) levelSel.addEventListener('change', function () {\n" +
          "    mathLevel = levelSel.value; mathSet = 0; update(); mathNote();\n" +
          "  });\n" +
          "  if (setBtn) setBtn.addEventListener('click', function () {\n" +
          "    mathSet = (mathSet + 1) % MATH_SETS; update(); mathNote();\n" +
          "  });",
      );

      // the printable follows the level, or the button hands out the
      // on-grade sheet to a teacher who has just asked for below grade
      const file = '    return "printables/practice_" + key + "_" + side + ".pdf";';
      if (!out.includes(file)) return html;
      out = out.replace(
        file,
        '    var lvl = mathLevel === "on" ? "" : "_" + mathLevel;\n' +
          '    return "printables/practice_" + key + lvl + "_" + side + ".pdf";',
      );

      // the note has to be right on first paint too
      const first = "  update();\n})();";
      if (!out.includes(first)) return html;
      return out.replace(first, "  update();\n  mathNote();\n})();");
    },
  },
  {
    // Teachers know this one as the Math Hub. Orton-Gillingham is the method
    // behind it, not its name, and the tab it hangs off already says Math.
    name: "call it the Math Hub",
    apply: (html) => {
      const edits: [string, string][] = [
        ["<title>OG Math Hub</title>", "<title>Math Hub</title>"],
        ["<h1>OG Math Hub</h1>", "<h1>Math Hub</h1>"],
      ];
      let out = html;
      for (const [from, to] of edits) {
        if (!out.includes(from)) return html;
        out = out.replace(from, to);
      }
      return out;
    },
  },
];

function run(rel: string, html: string, rules: Adaptation[]): string {
  let out = html;
  const missed: string[] = [];
  for (const rule of rules) {
    const next = rule.apply(out);
    if (next === out) missed.push(rule.name);
    out = next;
  }
  if (missed.length) {
    console.error(`\n\u274c ${rel}: these adaptations no longer match the export:`);
    missed.forEach((m) => console.error(`     \u2013 ${m}`));
    console.error("   Nothing was written. Fix the rule in this script, or the export.\n");
    process.exit(1);
  }
  console.log(`  \u2713 adapted ${rel} (${rules.length} rules)`);
  return out;
}

function adapt(rel: string, html: string): string {
  if (rel === MATH_HUB) return run(rel, html, MATH_ADAPTATIONS);
  if (!html.includes("GENERATED from dc-runtime")) return html;
  return run(rel, html, ADAPTATIONS);
}

/**
 * Puts the teaching materials on the Upshift palette.
 *
 * The canvas exports carry palettes of their own — a green for the reading
 * builder, a different green for the maths hub, a brass and cream across the
 * 404 workbooks — none of which appear anywhere else on the site. This maps
 * them onto the tokens in tailwind.config.ts on the way into the table, so
 * the exports stay as the canvas wrote them and a re-export cannot undo it.
 *
 * Hue picks the family; luminance picks the member of it.
 *
 * Mapping by what a colour was painting — type or surface — is the obvious
 * approach and it is wrong, because the thing that decides whether a colour
 * works is what sits next to it. A chip is a pale tint with its own hue as
 * the label; a badge is a dark fill with white on top. Decide those two
 * independently and you get salmon on peach, or white on mint, or in one
 * case the same colour twice and a line of invisible text.
 *
 * Matching luminance sidesteps all of it. The export already had working
 * contrast, so keeping each colour's lightness and changing only its hue
 * carries those relationships over intact: what was pale stays pale, what
 * was dark enough for white text stays dark enough for white text.
 */
type Ramp = string[];

/** Each family, light to dark. Luminance is computed, not written down. */
const FAMILIES: Record<string, Ramp> = {
  grey: ["FAFAFA", "F2F2F2", "E9E9E9", "8A8A8A", "6A6A6A", "333333", "111111"],
  warm: ["FFF0EC", "FF6A5B", "E24F41", "C0432F"],
  amber: ["FFF0EC", "FFB13F", "C0432F"],
  teal: ["E6F8F6", "00B4A6", "00756C"],
  blue: ["EAF2FF", "4C9AFF", "2F6FD0", "16213E"],
  lavender: ["F4E9FF", "B87DFF", "6B2FB5"],
  pink: ["FFF5F9", "FF7DAE", "B3336E"],
};

function channel(v: number): number {
  const x = v / 255;
  return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}
/** Relative luminance — the thing contrast is actually measured on. */
function luminance(hex: string): number {
  return (
    0.2126 * channel(parseInt(hex.slice(0, 2), 16)) +
    0.7152 * channel(parseInt(hex.slice(2, 4), 16)) +
    0.0722 * channel(parseInt(hex.slice(4, 6), 16))
  );
}
function saturation(hex: string): number {
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  if (max === min) return 0;
  const l = (max + min) / 2;
  return l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
}
function hue(hex: string): number {
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  if (!d) return 0;
  if (max === r) return (((g - b) / d + (g < b ? 6 : 0)) * 60) % 360;
  if (max === g) return ((b - r) / d + 2) * 60;
  return ((r - g) / d + 4) * 60;
}

/** The one real error red, which should stay a red and not become coral. */
const EXPLICIT: Record<string, string> = { B42318: "E24F41", B00020: "E24F41", "9B2C3C": "E24F41" };

const LUMS: Record<string, number[]> = {};
for (const [k, ramp] of Object.entries(FAMILIES)) LUMS[k] = ramp.map(luminance);

/**
 * Each hub keeps the accent of the card it is opened from: teal for reading,
 * lavender for maths, blue for projects.
 */
function accentFamily(rel: string): string {
  if (rel.startsWith("math/")) return "lavender";
  if (rel.startsWith("pbl/")) return "blue";
  return "teal";
}

function familyFor(hex: string, accent: string): string {
  const sat = saturation(hex);
  if (sat < 0.12) return "grey";
  // An off-white is a paper colour, not a tint. #F6F8F4 is technically a
  // green and reads as white; sent to the teal ramp it turned the reading
  // builder's page mint.
  if (sat < 0.4 && luminance(hex) > 0.88) return "grey";
  // Near-black is ink whatever it is tinted with. The packs' darkest green
  // is the body colour; sent to the teal ramp it came back three times
  // lighter and the gold button it sits on stopped being readable.
  if (luminance(hex) < 0.06) return "grey";
  const h = hue(hex);
  if (h < 40 || h >= 330) return "warm";
  // Gold sits at about 43 degrees. On the other side of the line it was a
  // coral, which is both wrong and darker than the gold it replaced.
  if (h < 70) return "amber";
  if (h < 175) return accent;
  if (h < 255) return "blue";
  if (h < 300) return "lavender";
  return "pink";
}

function brandFor(hex: string, accent: string): string {
  const up = hex.toUpperCase();
  if (EXPLICIT[up]) return EXPLICIT[up];
  // Near-white is paper, and the brand has one paper colour.
  //
  // Nearest-luminance sent the PBL hub's #F5F6EF panels to gray-100 rather
  // than gray-050 — six hundredths closer on paper, and enough to drop every
  // small label on them from 4.6:1 to 4.36:1. A page that was white should
  // come out the white this site uses.
  if (luminance(up) > 0.86) return "FAFAFA";
  const fam = familyFor(up, accent);
  const want = luminance(up);
  const ramp = FAMILIES[fam], lums = LUMS[fam];
  // Nearest luminance, but break a near-tie downwards.
  //
  // The exports' mid-tones are mostly type, and several were already short
  // of AA against white — the workbooks' brass is 3.1:1. Landing on the
  // lighter of two equally close brand tones made that worse. The nudge is
  // small enough not to disturb a pale background or a dark panel, and it
  // only applies in the range type actually lives in.
  const bias = want < 0.6 ? 0.05 : 0;
  const score = (i: number) => Math.abs(lums[i] - want) + (lums[i] > want ? bias : 0);
  let best = 0;
  for (let i = 1; i < ramp.length; i++) if (score(i) < score(best)) best = i;
  return ramp[best];
}

/** Design Thinking has a canvas palette of its own that nobody asked to change. */
function recolours(rel: string): boolean {
  return !rel.startsWith("design-thinking/");
}

function recolour(rel: string, source: string): string {
  const accent = accentFamily(rel);
  const cache: Record<string, string> = {};
  return source.replace(/#([0-9a-fA-F]{6})\b/g, (_whole: string, h: string) => {
    const up = h.toUpperCase();
    if (!(up in cache)) cache[up] = brandFor(up, accent);
    return "#" + cache[up];
  });
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (!entry.name.startsWith(".")) out.push(full);
  }
  return out;
}

const files = await walk(ROOT);
console.log(`📚 ${files.length} files under content-reading-materials/\n`);

const rows = [];
for (const full of files) {
  const rel = path.relative(ROOT, full).split(path.sep).join("/");
  const ext = path.extname(full).toLowerCase();
  const type = TYPES[ext];
  if (!type) {
    console.log(`  – skipped (not a text type): ${rel}`);
    continue;
  }
  if (BINARY.has(ext)) {
    const buf = await readFile(full);
    rows.push({
      path: rel,
      content: buf.toString("base64"),
      content_type: type,
      bytes: buf.byteLength,
    });
    continue;
  }
  const raw = await readFile(full, "utf8");
  // Adapt first, recolour second. The adaptation rules match markup that
  // contains these colours, so recolouring first would stop them matching.
  let content = ext === ".html" ? adapt(rel, raw) : raw;
  if (recolours(rel)) content = recolour(rel, content);
  rows.push({
    path: rel,
    content,
    content_type: type,
    bytes: Buffer.byteLength(content, "utf8"),
  });
}

// ADAPT_ONLY=<dir> stops here and writes the adapted pages to disk instead of
// the table.
//
// Every rule has already run by this point, so a rule that no longer matches
// has already exited above -- but "all 84 rules matched" only says each one
// changed something, not that what it produced is right. This is how the page
// gets read back before it is anyone's live page: adapt, dump, open the file
// in a browser, and only then seed. It needs no DATABASE_URL, because `db` is
// a lazy proxy and nothing has touched it yet.
if (process.env.ADAPT_ONLY) {
  const dir = process.env.ADAPT_ONLY;
  // The whole tree, not just the HTML, and at the paths the table serves them
  // from -- a page whose scripts and fonts are missing renders as a blank
  // white box, which looks exactly like a page whose markup is broken.
  for (const r of rows) {
    const to = path.join(dir, r.path);
    await mkdir(path.dirname(to), { recursive: true });
    if (BINARY.has(path.extname(r.path).toLowerCase())) {
      await writeFile(to, Buffer.from(r.content, "base64"));
    } else {
      await writeFile(to, r.content, "utf8");
    }
  }
  const html = rows.filter((r) => r.content_type.startsWith("text/html"));
  console.log(`\n✓ ${rows.length} files written to ${dir} (${html.length} HTML), nothing seeded`);
  process.exit(0);
}

// Chunked because a single statement carrying every workbook exceeds what the
// driver will send in one go. Counted by payload rather than by row: the
// base64 printables are two hundred times the size of a support.js, so a flat
// row count would send either tiny statements or ones too big to go at all.
const CHUNK = 25;
const CHUNK_BYTES = 4_000_000;
let written = 0;
for (let i = 0; i < rows.length; ) {
  let n = 0;
  let size = 0;
  while (i + n < rows.length && n < CHUNK && (n === 0 || size < CHUNK_BYTES)) {
    size += rows[i + n].content.length;
    n++;
  }
  const batch = rows.slice(i, i + n);
  i += n;
  await db
    .insert(reading_materials)
    .values(batch)
    .onConflictDoUpdate({
      target: reading_materials.path,
      set: {
        content: sql`excluded.content`,
        content_type: sql`excluded.content_type`,
        bytes: sql`excluded.bytes`,
        updated_at: new Date(),
      },
    });
  written += batch.length;
  process.stdout.write(`\r  ✓ ${written}/${rows.length}`);
}
console.log();

const keep = rows.map((r) => r.path);
const existing = await db.select({ path: reading_materials.path }).from(reading_materials);
const stale = existing.map((r) => r.path).filter((p) => !keep.includes(p));
if (stale.length) {
  await db.delete(reading_materials).where(inArray(reading_materials.path, stale));
  console.log(`  🧹 removed ${stale.length} rows no longer on disk`);
}

const total = rows.reduce((n, r) => n + r.bytes, 0);
console.log(`\n✅ ${written} materials in the table, ${(total / 1_048_576).toFixed(1)} MB`);
process.exit(0);
