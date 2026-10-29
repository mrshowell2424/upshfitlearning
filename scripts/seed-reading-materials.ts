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
        "        const off = (this.state && this.state.poff) || [];\n" +
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
