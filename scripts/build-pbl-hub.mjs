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
  </div>
  <div id="pbl-out" style="margin-top:20px"></div>
`;

const SCRIPT = `
<script>
(function () {
  var PBL = ${JSON.stringify(records)};
  var SUBJECTS = ${JSON.stringify(SUBJECTS)};

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

  function fillStandards(keep) {
    var list = visible();
    stdSel.innerHTML = "";
    if (!list.length) {
      opt(stdSel, "", "No standard matches that search");
      stdSel.disabled = true;
    } else {
      stdSel.disabled = false;
      list.forEach(function (r) {
        opt(stdSel, r.code, r.code + " · " + r.text.slice(0, 68) + (r.text.length > 68 ? "…" : ""));
      });
      stdSel.value = keep && list.some(function (r) { return r.code === keep; }) ? keep : list[0].code;
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

  function render() {
    var code = stdSel.value;
    var r = byCode[code];
    out.innerHTML = "";
    if (!r) return;

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

    try {
      var u = new URL(location.href);
      u.searchParams.set("std", r.code);
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

  var start = null;
  try { start = new URL(location.href).searchParams.get("std"); } catch (e) {}
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
