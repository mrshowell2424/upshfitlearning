// @ts-nocheck
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
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import WRITING from "./reading-writing-passages.json" with { type: "json" };
import SPLITS from "./reading-skill-splits.json" with { type: "json" };
import PARTW from "./reading-part-words.json" with { type: "json" };
import SENT3 from "./reading-third-sentences.json" with { type: "json" };
import AICOACH from "./reading-ai-writing-coach.json" with { type: "json" };
import { db } from "@/lib/db";
import { reading_materials } from "@/lib/db/schema";
import { inArray, sql } from "drizzle-orm";

const ROOT = path.join(process.cwd(), "content-reading-materials");

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

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

      // Three sentences for the partner read, not two. On a single part the
      // sentences that carry that part come first, and the skill's others
      // make the count up — a part has at most three sentences to draw on, so
      // filtering alone would leave a child with one line to read.
      const sent = 'wbHeart: heart, wbSent: dict,';
      if (!out.includes(sent)) return html;
      out = out.replace(
        sent,
        "wbHeart: heart, wbSent: dict.concat(dictAll.filter((q) => " +
          "dict.indexOf(q) === -1)).slice(0, 3),"
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
      let out = html.replace(cut, "return n >= 4 && n <= 12; }).slice(0, 3);");

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
          "          return { n: i + 1, from, hasFrom: !!from, t: cut.slice(1).join(' ').trim() || lead,\n" +
          "            ans: isKey ? (parts[1] || '').trim() : '' }; });\n" +
          anchor
      );
      const tail = "          sbBox: { ...p.decBox, display: sbRows.length && show(isKey ? 'key' : 'wb') ? 'flex' : 'none' }, sbRows }; })";
      if (!out.includes(tail)) return html;
      out = out.replace(
        tail,
        "          encBox: { ...p.decBox, display: encOn ? 'flex' : 'none' },\n" +
          "          paItems, hasPa: paItems.length > 0, paDir: (paA && paA[1]) || '',\n" +
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
        LINE.replace("min-height:34px", "min-height:40px") + "</span>" +
        '<span style="flex:none;font-size:13px;font-weight:700;color:#57534e;padding:0 4px">' +
        "change</span>" +
        LINE.replace("min-height:34px", "min-height:40px") + "{{ x.ans }}</span></div>\n" +
        "        </sc-for>\n" +
        "      </div></sc-if>\n" +
        // Spelling: ten words
        '      <div style="display:flex;flex-direction:column;gap:8px;break-inside:avoid;page-break-inside:avoid">\n' +
        "        " + H("2", "Spelling (encoding). Say the word, tap each sound, then write it.") + "\n" +
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
        "        " + H("3", "Dictation. Write the whole sentence your teacher says. Two sentences.") + "\n" +
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
          "const SPLITS = " + JSON.stringify(SPLITS) + ";\n" +
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
        "        const PCH = [['wb', '\u{1F4DD} Workbook'], ['spl2', '\u270F\uFE0F Spelling \u00b7 2nd'], " +
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
      let out = html.replace(
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
      let out = html.replace(
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
          ".replace('{PASSAGE}', String(ebText || '').trim())" +
          ".replace('{QUESTION}', ebPrompt);\n" +
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
];

function adapt(rel: string, html: string): string {
  if (!html.includes("GENERATED from dc-runtime")) return html;
  let out = html;
  const missed: string[] = [];
  for (const rule of ADAPTATIONS) {
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
  console.log(`  \u2713 adapted ${rel} (${ADAPTATIONS.length} rules)`);
  return out;
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
  const raw = await readFile(full, "utf8");
  const content = ext === ".html" ? adapt(rel, raw) : raw;
  rows.push({
    path: rel,
    content,
    content_type: type,
    bytes: Buffer.byteLength(content, "utf8"),
  });
}

// Chunked because a single statement carrying every workbook exceeds what the
// driver will send in one go.
const CHUNK = 25;
let written = 0;
for (let i = 0; i < rows.length; i += CHUNK) {
  const batch = rows.slice(i, i + CHUNK);
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
