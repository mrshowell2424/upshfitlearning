/**
 * Turns the PBL export's standards list into a builder.
 *
 * The export ships all 87 Grade 2 standards as <details> blocks and a picker
 * that scrolls to one. That is a long page to read, not a tool to plan with:
 * the Maths and Science of Reading hubs let a teacher narrow by subject,
 * search, and look at one standard at a time, and this now does the same.
 *
 * It also makes the matches worth something. Each standard names three, every
 * one of which is another standard in this hub, so they become buttons: pick
 * a project, see what pairs with it, and step across into that one.
 *
 * Reads pbl-hub.html at the repo root — the file as exported — and writes
 * content-reading-materials/pbl/pbl-hub.html, which the seed carries into
 * Postgres. Re-run after a fresh export, then re-run the seed.
 *
 *   bun run scripts/build-pbl-hub.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "pbl-hub.html");
const OUT = path.join(ROOT, "content-reading-materials/pbl/pbl-hub.html");

const src = readFileSync(SRC, "utf8");

const unesc = (t) =>
  String(t)
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&middot;/g, "·").replace(/&hellip;/g, "…")
    .replace(/&mdash;/g, "—").replace(/&ndash;/g, "–");
const strip = (t) => unesc(String(t).replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

/** Which optgroup each standard sits under, which is its subject. */
const subjectOf = {};
for (const g of src.matchAll(/<optgroup label="([^"]+)">([\s\S]*?)<\/optgroup>/g)) {
  for (const o of g[2].matchAll(/<option value="(std-[^"]+)"/g)) subjectOf[o[1]] = g[1];
}

/** The paragraph that follows a labelled one — "Driving question", etc. */
function after(body, label) {
  const m = new RegExp(`>${label}</p>\\s*<p[^>]*>([\\s\\S]*?)</p>`).exec(body);
  return m ? strip(m[1]) : "";
}

const records = [];
for (const m of src.matchAll(/<details[^>]*id="(std-[^"]+)"[\s\S]*?<\/details>/g)) {
  const id = m[1];
  const block = m[0];
  const body = block.slice(block.indexOf("</summary>"));
  const matches = [];
  const at = body.indexOf("Cross-curricular matches");
  if (at !== -1) {
    const re = /<span[^>]*border-radius:999px[^>]*>([\s\S]*?)<\/span>\s*<p[^>]*>([\s\S]*?)<\/p>/g;
    for (const mm of body.slice(at).matchAll(re)) {
      const head = strip(mm[1]).split("·").map((x) => x.trim());
      matches.push({ code: head[0], text: strip(mm[2]) });
    }
  }
  records.push({
    code: strip((/<span[^>]*border-radius:999px[^>]*>([\s\S]*?)<\/span>/.exec(block) || [])[1] || ""),
    subject: subjectOf[id] || "",
    text: strip((/<span style="font-weight:600;color:#243322">([\s\S]*?)<\/span>/.exec(block) || [])[1] || ""),
    dq: after(body, "Driving question"),
    project: after(body, "PBL project"),
    product: after(body, "Student product"),
    // The subject is looked up from the target rather than copied from the
    // chip, so one standard can never disagree with itself about what
    // subject another standard is in.
    matches: matches.map((x) => x.code),
  });
}

// Every rule here is required. A fresh export that moves the markup should
// stop the build rather than quietly ship a hub with no projects in it.
const problems = [];
if (records.length < 80) problems.push(`only ${records.length} standards parsed`);
for (const r of records) {
  if (!r.code || !r.subject || !r.text || !r.dq || !r.project || !r.product)
    problems.push(`incomplete: ${r.code || "(no code)"}`);
  if (r.matches.length !== 3) problems.push(`${r.code}: ${r.matches.length} matches, expected 3`);
}
const known = new Set(records.map((r) => r.code));
for (const r of records)
  for (const c of r.matches)
    if (!known.has(c)) problems.push(`${r.code}: match ${c} is not a standard in this hub`);
if (problems.length) {
  console.error("✗ the export does not look the way this script expects:");
  problems.slice(0, 10).forEach((p) => console.error("   " + p));
  console.error("\nNothing was written. Fix this script, or the export.");
  process.exit(1);
}

const SUBJECTS = [...new Set(records.map((r) => r.subject))];

/**
 * The project cycle, lifted from the section above it so the roadmap and the
 * page never drift apart. If the export renames a stage, this fails rather
 * than printing a roadmap that no longer matches the cycle it belongs to.
 */
const CYCLE = [];
{
  const at = src.indexOf("The project cycle");
  const until = src.indexOf("Project library", at);
  const re = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/g;
  const slice = src.slice(at, until);
  for (const m of slice.matchAll(re)) CYCLE.push({ name: strip(m[1]), blurb: strip(m[2]) });
}
if (CYCLE.length !== 5) {
  console.error(`✗ expected 5 stages in the project cycle, found ${CYCLE.length}.`);
  console.error("Nothing was written. Fix this script, or the export.");
  process.exit(1);
}

/** The builder that replaces the list, styled in the export's own palette. */
const BUILDER = `
  <div style="background:#E9F0E0;border-radius:16px;padding:20px;display:grid;gap:14px">
    <p style="margin:0;font-size:14px;font-weight:700;color:#2F4A2A">Jump to a subject &middot; ${records.length} standards</p>
    <div style="display:flex;flex-wrap:wrap;gap:10px">
${SUBJECTS.map((s) => `      <button type="button" data-pbl-subject="${s}" style="font:inherit;cursor:pointer;padding:8px 16px;border-radius:999px;border:1px solid #4E7A3A;background:#fff;color:#2F4A2A;font-weight:700;font-size:14px">${s}</button>`).join("\n")}
    </div>
  </div>
  <div id="pbl-bar" style="background:#fff;border:1px solid #D5DCCB;border-radius:14px;padding:16px 18px;display:grid;gap:14px;margin-top:18px">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px">
      <div style="display:grid;gap:6px">
        <label for="pbl-subject" style="font-size:13px;font-weight:700;color:#2F4A2A">Subject</label>
        <select id="pbl-subject" style="font-family:inherit;font-size:16px;padding:11px 13px;border-radius:12px;border:1px solid #4E7A3A;background:#fff;color:#243322;width:100%;box-sizing:border-box"></select>
      </div>
      <div style="display:grid;gap:6px">
        <label for="pbl-standard" style="font-size:13px;font-weight:700;color:#2F4A2A">Standard</label>
        <select id="pbl-standard" style="font-family:inherit;font-size:16px;padding:11px 13px;border-radius:12px;border:1px solid #4E7A3A;background:#fff;color:#243322;width:100%;box-sizing:border-box"></select>
      </div>
      <div style="display:grid;gap:6px">
        <label for="pbl-search" style="font-size:13px;font-weight:700;color:#2F4A2A">Search</label>
        <input id="pbl-search" type="search" placeholder="e.g. measurement, maps, 2.NBT" style="font-family:inherit;font-size:16px;padding:11px 13px;border-radius:12px;border:1px solid #D5DCCB;background:#fff;color:#243322;width:100%;box-sizing:border-box">
      </div>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:12px 18px;align-items:center">
      <label style="display:flex;gap:8px;align-items:center;font-size:14px;font-weight:600;color:#3E4D38;cursor:pointer">
        <input type="checkbox" id="pbl-cross"> Only show partners from another subject
      </label>
      <span id="pbl-count" style="font-size:13px;color:#5A6A52"></span>
    </div>
    <div id="pbl-views" style="display:none;flex-wrap:wrap;gap:8px;align-items:center;border-top:1px solid #E6EADF;padding-top:14px">
      <button type="button" data-pbl-view="project">The project</button>
      <button type="button" data-pbl-view="roadmap">Project roadmap</button>
      <button type="button" data-pbl-view="workbook">Student workbook</button>
      <button type="button" id="pbl-print" style="margin-left:auto">Print this</button>
    </div>
  </div>
  <div id="pbl-out" style="margin-top:20px"></div>
  <style>
    @media print {
      @page { size: letter portrait; margin: 0.4in; }
      body * { visibility: hidden; }
      #pbl-out, #pbl-out * { visibility: visible; }
      #pbl-out { position: absolute; left: 0; top: 0; width: 100%; margin: 0; }
      /* One sheet, one page. The sheet is the break, so nothing has to guess. */
      .pbl-sheet { border: 0 !important; border-radius: 0 !important; margin: 0 !important;
        padding: 0 0 6px !important; max-width: 7.7in !important; min-height: 0 !important;
        break-after: page; page-break-after: always; break-inside: avoid; page-break-inside: avoid; }
      .pbl-sheet:last-child { break-after: auto; page-break-after: auto; }
    }
  </style>
`;

const SCRIPT = `
<script>
(function () {
  var PBL = ${JSON.stringify(records)};
  var SUBJECTS = ${JSON.stringify(SUBJECTS)};
  var CYCLE = ${JSON.stringify(CYCLE)};
  var view = "project";

  // "English Language Arts" on a standard and "ELA" on a chip are the same
  // subject; comparing the raw strings called every pairing cross-curricular.
  var SHORT = { "English Language Arts": "ELA" };
  function shortSubject(s) { return SHORT[s] || s; }

  var TINT = {
    "ELA": "#E3EEF7",
    "Math": "#E9F0E0",
    "Science": "#FDF6E3",
    "Social Studies": "#F7E9F0"
  };
  function tint(s) { return TINT[shortSubject(s)] || "#EEF1EA"; }

  var byCode = {};
  PBL.forEach(function (r) { byCode[r.code] = r; });

  // Who names me, as well as who I name. The export only records one
  // direction, and a pairing is a pairing whichever end wrote it down.
  var inbound = {};
  PBL.forEach(function (r) {
    r.matches.forEach(function (c) {
      (inbound[c] = inbound[c] || []).push(r.code);
    });
  });
  function partnersOf(code) {
    var r = byCode[code];
    if (!r) return [];
    var seen = {}, out = [];
    r.matches.concat(inbound[code] || []).forEach(function (c) {
      if (c === code || seen[c] || !byCode[c]) return;
      seen[c] = 1;
      out.push({ code: c, named: r.matches.indexOf(c) !== -1 });
    });
    return out;
  }

  var subjectSel = document.getElementById("pbl-subject");
  var stdSel = document.getElementById("pbl-standard");
  var search = document.getElementById("pbl-search");
  var crossOnly = document.getElementById("pbl-cross");
  var count = document.getElementById("pbl-count");
  var out = document.getElementById("pbl-out");
  if (!subjectSel) return;

  var opt = function (sel, value, label) {
    var o = document.createElement("option");
    o.value = value; o.textContent = label; sel.appendChild(o); return o;
  };
  opt(subjectSel, "", "All subjects");
  SUBJECTS.forEach(function (s) { opt(subjectSel, s, s); });

  function visible() {
    var sub = subjectSel.value;
    var q = search.value.trim().toLowerCase();
    return PBL.filter(function (r) {
      if (sub && r.subject !== sub) return false;
      if (!q) return true;
      return (r.code + " " + r.text + " " + r.project + " " + r.dq + " " + r.product)
        .toLowerCase().indexOf(q) !== -1;
    });
  }

  /**
   * Fills the standard list, and opens nothing on its own.
   *
   * The page used to arrive with the first standard already open, which made
   * it look like the answer to a question nobody had asked. A teacher picks
   * a subject, or searches, or chooses a standard; until then the panel says
   * what to do and shows nothing else.
   */
  function fillStandards(keep) {
    var list = visible();
    stdSel.innerHTML = "";
    if (!list.length) {
      opt(stdSel, "", "No standard matches that search");
      stdSel.disabled = true;
    } else {
      stdSel.disabled = false;
      opt(stdSel, "", list.length === 1 ? "Choose the standard…" : "Choose a standard…");
      list.forEach(function (r) {
        opt(stdSel, r.code, r.code + " · " + r.text.slice(0, 68) + (r.text.length > 68 ? "…" : ""));
      });
      stdSel.value = keep && list.some(function (r) { return r.code === keep; }) ? keep : "";
    }
    count.textContent = list.length + " of " + PBL.length + " standards";
    render();
  }

  function card(bg, pad) {
    var d = document.createElement("div");
    d.style.cssText = "background:" + bg + ";border-radius:12px;padding:" + (pad || "14px 16px");
    return d;
  }
  function label(text, color) {
    var p = document.createElement("p");
    p.style.cssText = "margin:0;font-size:13px;font-weight:700;color:" + (color || "#4E7A3A");
    p.textContent = text; return p;
  }
  function body(text, css) {
    var p = document.createElement("p");
    p.style.cssText = "margin:4px 0 0;color:#243322;" + (css || "");
    p.textContent = text; return p;
  }
  function chip(text, bg) {
    var s = document.createElement("span");
    s.style.cssText = "display:inline-block;font-size:12px;font-weight:700;padding:3px 11px;" +
      "border-radius:999px;background:" + bg + ";color:#243322";
    s.textContent = text; return s;
  }

  // ---- printable sheets -----------------------------------------------
  //
  // A letter page drawn the way it prints, the same shape the maths and
  // reading workbooks use: white sheet, rule under the heading, name and
  // date, page number at the foot.
  function sheet(title, meta, n, of) {
    var s = document.createElement("section");
    s.className = "pbl-sheet";
    s.style.cssText = "background:#fff;border:1px solid #D5DCCB;border-radius:14px;" +
      "padding:22px 26px 14px;width:100%;max-width:7.7in;min-height:9.9in;margin:0 auto 18px;" +
      "box-sizing:border-box;display:flex;flex-direction:column;gap:12px";
    var top = document.createElement("div");
    top.style.cssText = "display:flex;align-items:baseline;justify-content:space-between;gap:12px;" +
      "border-bottom:2px solid #243322;padding-bottom:7px";
    var h = document.createElement("div");
    h.style.cssText = "font-size:19px;font-weight:800;color:#243322";
    h.textContent = title;
    var m = document.createElement("div");
    m.style.cssText = "font-size:12px;font-weight:700;color:#5A6A52;white-space:nowrap";
    m.textContent = meta;
    top.appendChild(h); top.appendChild(m); s.appendChild(top);
    var bodyEl = document.createElement("div");
    bodyEl.style.cssText = "display:flex;flex-direction:column;gap:12px;flex:1";
    s.appendChild(bodyEl);
    var f = document.createElement("div");
    f.style.cssText = "margin-top:auto;padding-top:8px;font-size:11px;color:#5A6A52;text-align:right";
    f.textContent = "Page " + n + " of " + of;
    s.appendChild(f);
    s._body = bodyEl;
    return s;
  }
  function nameDate() {
    var d = document.createElement("div");
    d.style.cssText = "display:flex;gap:18px;align-items:baseline;font-size:14px;color:#243322";
    ["Name", "Date"].forEach(function (w) {
      var f = document.createElement("span");
      f.style.cssText = "display:flex;gap:6px;align-items:baseline;flex:" + (w === "Date" ? "0 0 32%" : "1 1 auto");
      var l = document.createElement("span"); l.textContent = w + ":";
      var rule = document.createElement("span");
      rule.style.cssText = "flex:1;border-bottom:1px solid #243322;height:14px";
      f.appendChild(l); f.appendChild(rule); d.appendChild(f);
    });
    return d;
  }
  function writeBox(prompt, min) {
    var b = document.createElement("div");
    b.style.cssText = "border:1px solid #243322;border-radius:10px;padding:9px 11px;" +
      "min-height:" + (min || 120) + "px;font-size:12px;color:#5A6A52;flex:0 0 auto";
    b.textContent = prompt || "";
    return b;
  }
  function heading(t) {
    var h = document.createElement("p");
    h.style.cssText = "margin:4px 0 0;font-size:15px;font-weight:800;color:#243322";
    h.textContent = t; return h;
  }
  function note(t, css) {
    var p2 = document.createElement("p");
    p2.style.cssText = "margin:0;font-size:13px;color:#3E4D38;" + (css || "");
    p2.textContent = t; return p2;
  }

  /** The data's phrases have no full stop, so joining them ran two together. */
  function sentence(t) {
    t = String(t || "").trim();
    return /[.!?]$/.test(t) ? t : t + ".";
  }

  /** What each stage says for this project, built from its own fields. */
  function stageLines(r, i) {
    var same = partnersOf(r.code)
      .filter(function (p) { return byCode[p.code].project === r.project; })
      .map(function (p) { return p.code; });
    return [
      "Open with the driving question: " + sentence(r.dq) + " Show something real that raises it — a photo, an object, a visitor — and record what students already think.",
      "Teach what " + r.code + " needs: " + sentence(r.text) +
        (same.length ? " Running this project also covers " + same.join(", ") + ", so plan those in here too." : ""),
      "Students draft, test and revise the product: " + sentence(r.product) + " Build in one round of critique before they finish.",
      "Present to a real audience. Decide who before you start, so students know who they are making it for.",
      "Look back at the driving question: " + sentence(r.dq) + " What changed in their thinking, and what would they do differently?"
    ][i];
  }

  /**
   * Pages measured as they fill, rather than split where it looked about
   * right. Three stages to a sheet overflowed every one of the 87 projects,
   * because a long standard pushes the third stage over the edge and a short
   * one does not. A stage is kept whole: its heading never ends a page with
   * its box overleaf.
   */
  function Flow(title, meta) {
    var PAGE = 9.9 * 96;
    var made = [], cur, bodyEl;
    function open(cont) {
      cur = sheet(cont ? title + " (continued)" : title, meta, 0, 0);
      cur.style.minHeight = "0";
      bodyEl = cur._body;
      made.push(cur);
      out.appendChild(cur);
    }
    open(false);
    return {
      group: function (nodes) {
        nodes.forEach(function (n) { bodyEl.appendChild(n); });
        if (cur.scrollHeight > PAGE && bodyEl.children.length > nodes.length) {
          nodes.forEach(function (n) { bodyEl.removeChild(n); });
          open(true);
          nodes.forEach(function (n) { bodyEl.appendChild(n); });
        }
      },
      done: function () {
        made.forEach(function (s, i) {
          s.style.minHeight = "";
          s.lastChild.textContent = "Page " + (i + 1) + " of " + made.length;
        });
      }
    };
  }

  function renderRoadmap(r) {
    var flow = Flow("Project roadmap", r.code + " · " + shortSubject(r.subject));
    var dq = document.createElement("div");
    dq.style.cssText = "background:#FDF6E3;border-left:6px solid #E0B040;border-radius:10px;padding:12px 14px";
    dq.appendChild(note("Driving question", "font-weight:700;color:#7A5A10;font-size:12px"));
    dq.appendChild(note(r.dq, "font-size:16px;font-weight:600;margin-top:3px"));
    flow.group([heading(r.project), note(r.text), dq,
      note("Student product: " + sentence(r.product), "font-weight:600")]);

    CYCLE.forEach(function (st, i) {
      flow.group([
        heading((i + 1) + ". " + st.name),
        note(st.blurb, "color:#5A6A52;font-size:12px"),
        note(stageLines(r, i)),
        writeBox("Your plan, dates and who is responsible.", 86)
      ]);
    });

    var checks = [heading("Before you launch")];
    ["Who is the real audience, and when will they see it?",
     "What will you teach just in time, rather than up front?",
     "Where does critique and revision fit?",
     "How will each student show what they learned?"].forEach(function (q) {
      var row = document.createElement("div");
      row.style.cssText = "display:flex;gap:9px;align-items:flex-start";
      var box = document.createElement("span");
      box.style.cssText = "flex:0 0 auto;width:15px;height:15px;border:2px solid #243322;border-radius:3px;margin-top:3px";
      row.appendChild(box); row.appendChild(note(q));
      checks.push(row);
    });
    flow.group(checks);
    flow.done();
  }

  function renderWorkbook(r) {
    var pages = [
      ["Our driving question", [
        ["What we are figuring out", "Write the driving question in your own words.", 170],
        ["What I already think", "Write or draw what you think the answer might be.", 200]
      ]],
      ["What I need to learn", [
        ["Questions I still have", "Write the questions you need answered before you can build.", 170],
        ["What I found out", "Notes, facts and where you found them.", 200]
      ]],
      ["Make it", [
        ["My plan", "What are you making, and what will it need?", 170],
        ["What I changed after feedback", "Who gave you feedback, and what did you change?", 180]
      ]],
      ["Share it", [
        ["Who is my audience", "Who will see this, and what do they need to understand?", 150],
        ["What I will say", "Your first two sentences.", 190]
      ]],
      ["Look back", [
        ["What I learned", "Answer the driving question in your own words.", 180],
        ["What I would do differently", "If you ran this project again, what would change?", 170]
      ]]
    ];
    pages.forEach(function (pg, i) {
      var s = sheet(pg[0], r.project, i + 1, pages.length);
      if (i === 0) {
        s._body.appendChild(nameDate());
        var dq = document.createElement("div");
        dq.style.cssText = "background:#FDF6E3;border-left:6px solid #E0B040;border-radius:10px;padding:12px 14px";
        dq.appendChild(note("Driving question", "font-weight:700;color:#7A5A10;font-size:12px"));
        dq.appendChild(note(r.dq, "font-size:17px;font-weight:600;margin-top:3px"));
        s._body.appendChild(dq);
        s._body.appendChild(note("What you will make: " + r.product, "font-weight:600"));
      }
      pg[1].forEach(function (part, j) {
        s._body.appendChild(heading(part[0]));
        var box = writeBox(part[1] || "", part[2] || 150);
        // The last box takes whatever the page has left, so a sheet ends
        // full rather than with three inches of nothing under it.
        if (j === pg[1].length - 1) box.style.flex = "1 1 auto";
        s._body.appendChild(box);
      });
      if (i === pages.length - 1) {
        s._body.appendChild(note("Standard: " + r.code + " · " + r.text, "font-size:11px;color:#5A6A52;margin-top:6px"));
      }
      out.appendChild(s);
    });
  }

  function render() {
    var code = stdSel.value;
    var r = byCode[code];
    out.innerHTML = "";
    document.getElementById("pbl-views").style.display = r ? "flex" : "none";
    if (!r) {
      var hint = document.createElement("div");
      hint.style.cssText = "background:#fff;border:1px dashed #C7D2BC;border-radius:14px;padding:26px;text-align:center";
      hint.appendChild(note(
        visible().length < PBL.length
          ? "Choose one of the " + visible().length + " standards above to build its project."
          : "Pick a subject, search, or choose a standard to build its project.",
        "font-size:15px;color:#5A6A52"));
      out.appendChild(hint);
      return;
    }
    if (view === "roadmap") { renderRoadmap(r); stamp(r); return; }
    if (view === "workbook") { renderWorkbook(r); stamp(r); return; }

    var wrap = document.createElement("div");
    wrap.style.cssText = "background:#fff;border:1px solid #D5DCCB;border-radius:14px;padding:20px";

    var head = document.createElement("div");
    head.style.cssText = "display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap";
    head.appendChild(chip(r.code, "#E9F0E0"));
    head.appendChild(chip(shortSubject(r.subject), tint(r.subject)));
    wrap.appendChild(head);
    wrap.appendChild(body(r.text, "font-weight:600;margin-top:10px"));

    var dq = card("#FDF6E3");
    dq.style.borderLeft = "6px solid #E0B040";
    dq.style.margin = "16px 0 0";
    dq.appendChild(label("Driving question", "#7A5A10"));
    dq.appendChild(body(r.dq, "font-size:17px;font-weight:600"));
    wrap.appendChild(dq);

    var grid = document.createElement("div");
    grid.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin-top:14px";
    var pc = card("#F5F6EF");
    pc.appendChild(label("PBL project"));
    pc.appendChild(body(r.project, "font-size:18px;font-weight:800;margin:4px 0 12px"));
    pc.appendChild(label("Student product"));
    pc.appendChild(body(r.product));
    grid.appendChild(pc);

    // Partners split two ways, because they mean two different things.
    //
    // Most of this hub's 87 standards share one of only 19 projects, so a
    // partner is usually another standard the same project already covers —
    // worth knowing, but not a second project to plan. The ones running a
    // different project are the actual pairings. Listing both under one
    // heading made four identical project titles look like a bug.
    var all = partnersOf(r.code);
    var mine = shortSubject(r.subject);
    var isCross = function (p) { return shortSubject(byCode[p.code].subject) !== mine; };
    var sameProject = all.filter(function (p) { return byCode[p.code].project === r.project; });
    var otherProject = all.filter(function (p) { return byCode[p.code].project !== r.project; });

    function partnerButton(p) {
      var t = byCode[p.code];
      var b = document.createElement("button");
      b.type = "button";
      b.style.cssText = "text-align:left;font:inherit;cursor:pointer;background:#fff;" +
        "border:1px solid #D5DCCB;border-radius:12px;padding:12px 14px;display:grid;gap:7px;width:100%";
      var row = document.createElement("div");
      row.style.cssText = "display:flex;gap:8px;align-items:center;flex-wrap:wrap";
      row.appendChild(chip(t.code + " · " + shortSubject(t.subject), tint(t.subject)));
      if (isCross(p)) row.appendChild(chip("Cross-curricular", "#E0B040"));
      b.appendChild(row);
      if (t.project !== r.project) {
        var pr = document.createElement("p");
        pr.style.cssText = "margin:0;font-size:15px;font-weight:700;color:#243322";
        pr.textContent = t.project;
        b.appendChild(pr);
      }
      var tx = document.createElement("p");
      tx.style.cssText = "margin:0;font-size:13px;color:#3E4D38";
      tx.textContent = t.text;
      b.appendChild(tx);
      b.addEventListener("click", function () { go(t.code); });
      return b;
    }

    function partnerBlock(heading, note, items) {
      var c = card("#F5F6EF");
      c.appendChild(label(heading));
      var sub = document.createElement("p");
      sub.style.cssText = "margin:3px 0 10px;font-size:12px;color:#5A6A52";
      sub.textContent = note;
      c.appendChild(sub);
      var list = document.createElement("div");
      list.style.cssText = "display:grid;gap:10px";
      items.forEach(function (p) { list.appendChild(partnerButton(p)); });
      c.appendChild(list);
      return c;
    }

    var shownOther = crossOnly.checked ? otherProject.filter(isCross) : otherProject;
    var crossCount = otherProject.filter(isCross).length;

    var right = document.createElement("div");
    right.style.cssText = "display:grid;gap:14px;align-content:start";
    if (shownOther.length) {
      right.appendChild(partnerBlock(
        "Pairs well with",
        crossCount
          ? crossCount + " of these " + otherProject.length + " are in another subject. Pick one to open it."
          : "Another project you could run alongside this one. Pick one to open it.",
        shownOther));
    } else {
      var none = card("#F5F6EF");
      none.appendChild(label("Pairs well with"));
      var p2 = document.createElement("p");
      p2.style.cssText = "margin:4px 0 0;font-size:14px;color:#5A6A52";
      p2.textContent = crossOnly.checked
        ? "No partner outside " + mine + " for this standard yet. Untick the box to see the rest."
        : "No other project pairs with this one yet.";
      none.appendChild(p2);
      right.appendChild(none);
    }
    if (sameProject.length && !crossOnly.checked) {
      right.appendChild(partnerBlock(
        "This project also covers",
        "Running " + r.project + " hits these as well, so they do not need planning twice.",
        sameProject));
    }
    grid.appendChild(right);
    wrap.appendChild(grid);
    out.appendChild(wrap);

    stamp(r);
  }

  /** Keep the standard and the view in the URL, so a page can be sent on. */
  function stamp(r) {
    try {
      var u = new URL(location.href);
      u.searchParams.set("std", r.code);
      if (view === "project") u.searchParams.delete("view"); else u.searchParams.set("view", view);
      history.replaceState(null, "", u);
    } catch (e) {}
  }

  /** Open a standard, clearing whatever filter would have hidden it. */
  function go(code) {
    var r = byCode[code];
    if (!r) return;
    if (subjectSel.value && subjectSel.value !== r.subject) subjectSel.value = "";
    if (search.value) search.value = "";
    fillStandards(code);
    document.getElementById("pbl-bar").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // The export's subject chips linked to #ela, #math and so on — sections
  // that no longer exist now the list is a builder. They set the filter.
  Array.prototype.forEach.call(document.querySelectorAll("[data-pbl-subject]"), function (b) {
    b.addEventListener("click", function () {
      var want = this.getAttribute("data-pbl-subject");
      subjectSel.value = subjectSel.value === want ? "" : want;
      search.value = "";
      fillStandards(null);
      document.getElementById("pbl-bar").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  subjectSel.addEventListener("change", function () { fillStandards(stdSel.value); });
  search.addEventListener("input", function () { fillStandards(stdSel.value); });
  stdSel.addEventListener("change", render);
  crossOnly.addEventListener("change", render);

  // The project, its roadmap and the student workbook are three views of one
  // standard, so they are tabs rather than three places to navigate to.
  var tabs = Array.prototype.slice.call(document.querySelectorAll("[data-pbl-view]"));
  function paintTabs() {
    tabs.forEach(function (t) {
      var on = t.getAttribute("data-pbl-view") === view;
      t.setAttribute("aria-pressed", on ? "true" : "false");
      t.style.background = on ? "#243322" : "#fff";
      t.style.color = on ? "#fff" : "#243322";
      t.style.borderColor = on ? "#243322" : "#D5DCCB";
    });
    // Only the printables are worth a print button.
    document.getElementById("pbl-print").style.display = view === "project" ? "none" : "";
  }
  tabs.forEach(function (t) {
    t.style.cssText = "font:inherit;font-weight:700;font-size:14px;cursor:pointer;" +
      "padding:8px 16px;border-radius:999px;border:1px solid #D5DCCB;background:#fff;color:#243322";
    t.addEventListener("click", function () {
      view = this.getAttribute("data-pbl-view");
      paintTabs();
      render();
    });
  });
  document.getElementById("pbl-print").addEventListener("click", function () { window.print(); });
  paintTabs();

  var start = null, startView = null;
  try {
    var u0 = new URL(location.href);
    start = u0.searchParams.get("std");
    startView = u0.searchParams.get("view");
  } catch (e) {}
  if (startView === "roadmap" || startView === "workbook") view = startView;
  paintTabs();
  fillStandards(start && byCode[start] ? start : null);
})();
<\/script>
`;

// Replace everything from the old picker to the end of the standards list.
// From the chip panel, not from the picker: the panel's wrapper div closes
// after the picker, so cutting at the picker left it open and swallowing the
// rest of the section.
const jumpAt = src.indexOf("Jump to a subject");
const pickStart = jumpAt === -1 ? -1 : src.lastIndexOf('<div style="background:#E9F0E0', jumpAt);
const lastDetails = src.lastIndexOf("</details>");
if (pickStart === -1 || lastDetails === -1) {
  console.error("✗ could not find the subject panel or the standards list in the export.");
  process.exit(1);
}
const listEnd = src.indexOf("</section>", lastDetails) + "</section>".length;

let built = src.slice(0, pickStart) + BUILDER + src.slice(listEnd).replace("</body>", SCRIPT + "</body>");

// "Have a project to share?" invites teachers to add a starter project, and
// its button goes to #library, where there is nothing to add one with. The
// section is removed rather than left promising something the page cannot do.
const shareAt = built.indexOf("Have a project to share");
if (shareAt !== -1) {
  const from = built.lastIndexOf("<section", shareAt);
  const to = built.indexOf("</section>", shareAt) + "</section>".length;
  built = built.slice(0, from) + built.slice(to);
} else {
  console.error("✗ the 'Have a project to share' panel is not where this script expects it.");
  console.error("Nothing was written. Fix this script, or the export.");
  process.exit(1);
}

writeFileSync(OUT, built);
const kb = (n) => (n / 1024).toFixed(0) + "KB";
console.log(`✅ ${records.length} standards, ${records.reduce((n, r) => n + r.matches.length, 0)} matches`);
console.log(`   ${path.relative(ROOT, SRC)} ${kb(src.length)}  →  ${path.relative(ROOT, OUT)} ${kb(built.length)}`);
