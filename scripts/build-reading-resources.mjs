/**
 * Build the Reading Resources page.
 *
 * The mysteries and the informational articles are reference texts a teacher
 * browses, not part of any one lesson, so they get their own page rather
 * than a step inside the lesson builder. You pick what you want instead of
 * being handed whatever the lesson happened to map to.
 *
 * The page is generated rather than hand-written so that re-running this
 * after the source files change rebuilds it. Everything it shows comes from
 * scripts/reading-mysteries.json and scripts/reading-articles.json, which
 * were lifted verbatim from mystery-library.html and the two reading packs.
 *
 * Colours are written rgb() on purpose. The seed script recolours every
 * #rrggbb it finds by hue, and it does not know these are already the
 * Upshift brand: given hex it turns the brand pink into coral and the brand
 * teal into blue.
 *
 *   bun run scripts/build-reading-resources.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from "node:fs";

const MY = JSON.parse(readFileSync("scripts/reading-mysteries.json", "utf8")).cases;
const AR = JSON.parse(readFileSync("scripts/reading-articles.json", "utf8")).articles;
const MYC = JSON.parse(readFileSync("scripts/reading-mystery-coach.json", "utf8")).lines.join("\n");
const MYD = JSON.parse(readFileSync("scripts/reading-mystery-debate-coach.json", "utf8")).lines.join("\n");
const ARC = JSON.parse(readFileSync("scripts/reading-article-coach.json", "utf8")).lines.join("\n");
const RT = JSON.parse(readFileSync("scripts/reading-read-think.json", "utf8"));

// Brand, from the Upshift Learning design system.
const C = {
  coral: "rgb(255,106,91)",
  pink: "rgb(255,125,174)",
  lavender: "rgb(184,125,255)",
  teal: "rgb(0,180,166)",
  ink: "rgb(17,17,17)",
  mid: "rgb(68,68,68)",
  line: "rgb(233,233,233)",
  panel: "rgb(242,242,242)",
  paper: "rgb(247,246,244)",
  white: "rgb(255,255,255)",
  plum: "rgb(179,51,110)",
  blue: "rgb(47,111,208)",
  // The dark end of each ramp. The brand hues fail contrast for text, so
  // anything carrying meaning -- a paragraph letter, a band label -- uses these.
  coralDark: "rgb(192,67,47)",
  lavenderDark: "rgb(107,47,181)",
  tealDark: "rgb(0,117,108)",
};

const CASES = MY.map((c) => ({
    id: c.id, g: c.grade, week: c.week, tag: c.tag, title: c.title, story: c.story,
    q: c.question, sus: c.suspects, ans: c.answer, proof: c.proof,
    clears: c.clears, explain: c.explain,
    // The debate version of the same case, where one is written: its own
    // story, question and suspect cards, which three of them are still in
    // play, the case for each, and the teacher note. Left null where it is
    // not written, which is how the toggle knows whether to appear.
    d: c.debate ? {
      story: c.debate.story, q: c.debate.question, sus: c.debate.suspects,
      open: c.debate.open, args: c.debate.arguments,
      clears: c.debate.clears, note: c.debate.note,
    } : null,
  }));

const ARTICLES = AR.map((a) => ({
    id: a.id, g: a.grade, n: a.n, title: a.title, std: a.standard,
    hi: { lx: a.higher.lexile, w: a.higher.words, p: a.higher.paras.map((x) => [x.label, x.text]) },
    lo: { lx: a.lower.lexile, w: a.lower.words, p: a.lower.paras.map((x) => [x.label, x.text]) },
    qs: a.questions.map((x) => [x.n, x.kind, x.q, x.a]),
    note: a.note,
  }));

/**
 * What the page is handed up front.
 *
 * The two big arrays are no longer in here. They used to be: the whole page
 * was one 4.3 MB script tag holding every mystery and every article, so a
 * teacher opening it to read one case downloaded all 918 of them. That is
 * most of a megabyte per grade of content nobody asked for, over whatever
 * the school wifi happens to be.
 *
 * What stays inline is everything the page needs before anybody picks
 * anything: the three AI prompt templates and the list of grades each store
 * covers, which is what fills the two grade dropdowns. The cases and the
 * articles themselves are written per grade into data/ beside this page and
 * fetched when a grade is chosen. The materials route serves them from the
 * same table as the page, and the pass is a cookie, so a same-origin fetch
 * carries it without anything extra.
 */
const data = {
  myTpl: MYC,
  myDbTpl: MYD,
  arTpl: ARC,
  // The grades each store actually holds. Read off the content rather than
  // written down, so a finished grade reaches the pickers on the next build
  // and nobody has to remember to widen a hard-coded list -- which is exactly
  // how grade 2 and grade 5 ended up seeded but unreachable on this page.
  myG: [...new Set(CASES.map((c) => c.g))].sort((x, y) => x - y),
  arG: [...new Set(ARTICLES.map((a) => a.g))].sort((x, y) => x - y),
};

const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Reading Resources</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}
/* Two faces. Poppins is the brand and runs the whole interface: headings,
   tabs, pills, selects, buttons, running text. The serif carries the lines
   a child actually reads, so a reading page is not set in the same face as
   its own navigation. */
:root{--read:"Source Serif 4",Georgia,"Times New Roman",serif}
body{margin:0;background:${C.paper};color:${C.ink};
  font-family:Poppins,system-ui,sans-serif;line-height:1.6}
.bar{height:4px;background:linear-gradient(135deg,${C.coral},${C.pink},${C.lavender},${C.teal})}
main{max-width:880px;margin:0 auto;padding:32px 5% 80px}
/* The measure. Running text was set across the full column, about 105
   characters a line; comfortable measure is 55-75, and past that the eye
   loses the line on the return sweep. */
.reading{max-width:66ch;font-size:18px;line-height:1.72;text-wrap:pretty;
  font-family:var(--read)}
.band{border-top:1px solid ${C.line};margin:22px 0 0;padding-top:20px}
.band.first{border-top:none;margin:16px 0 0;padding-top:0}
.band > .eyebrow{font-size:11px;margin:0 0 10px}
.kind{font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;
  color:${C.mid};background:${C.panel};border:1px solid ${C.line};border-radius:100px;
  padding:2px 8px;display:inline-block;margin:0 0 5px;white-space:nowrap}
h1{font-family:Poppins,sans-serif;font-size:40px;font-weight:900;
  letter-spacing:-1px;margin:0 0 4px;line-height:1.1}
.sub{color:${C.mid};margin:0 0 24px;font-size:17px;max-width:60ch}
.eyebrow{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
  color:${C.mid};margin:0 0 6px}
.tabs{display:flex;gap:8px;margin:0 0 18px;flex-wrap:wrap}
.tab{font-family:Poppins,sans-serif;font-size:14px;font-weight:700;border-radius:100px;
  padding:9px 20px;cursor:pointer;border:1.5px solid ${C.ink};background:${C.white};
  color:${C.ink}}
.tab[aria-selected="true"]{background:${C.ink};color:${C.white}}
.controls{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:0 0 16px}
select{font-family:Poppins,sans-serif;font-size:14px;padding:9px 12px;border-radius:12px;
  border:1.5px solid ${C.line};background:${C.white};color:${C.ink};max-width:100%}
.pill{font-family:Poppins,sans-serif;font-size:13px;font-weight:700;border-radius:100px;
  padding:7px 16px;cursor:pointer;border:1.5px solid ${C.ink};background:${C.white};color:${C.ink}}
.pill[aria-pressed="true"]{background:${C.ink};color:${C.white}}
.card{background:${C.white};border:1px solid ${C.line};border-radius:20px;padding:0;
  overflow:hidden;margin:0 0 18px}
/* One flat accent, not a second copy of the page's gradient bar forty pixels
   above it. The colour also says which tab you are on. */
.card .top{height:4px;background:${C.lavenderDark}}
#pane-ar .card .top{background:${C.tealDark}}
#pane-my .band > .eyebrow{color:${C.lavenderDark}}
#pane-ar .band > .eyebrow{color:${C.tealDark}}
.card .in{padding:22px 26px 26px}
.meta{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:baseline}
h2{font-family:Poppins,sans-serif;font-size:30px;font-weight:800;margin:4px 0 2px;
  letter-spacing:-.6px;line-height:1.15}
.story{font-size:18px;line-height:1.72;margin:0;max-width:66ch;text-wrap:pretty;
  font-family:var(--read)}
.para{display:flex;gap:14px;margin:0 0 16px}
/* Was blue, the one colour on the page that is not ours. */
.para b{color:${C.coralDark};flex:0 0 auto;width:1.1em}
.q{font-weight:700;margin:0 0 14px;font-size:18px;font-family:var(--read)}
ul{margin:0;padding-left:0;list-style:none}
li{margin:0 0 10px;font-family:var(--read)}
.answer{background:${C.panel};border-radius:12px;padding:12px 16px;margin:12px 0 0;
  font-size:15px;font-family:var(--read)}
.answer[hidden]{display:none}
.btns{display:flex;gap:8px;flex-wrap:wrap;margin:22px 0 0;padding:16px 0 0;
  border-top:1px solid ${C.line};align-items:center}
.pill.primary{background:${C.ink};color:${C.white};padding:9px 20px}
/* The answer key is the one control a teacher must not press while
   projecting, and it used to look like the three they press all day. It is
   set apart by colour and position now -- a solid rule, not a dashed one. */
.pill.teacher{border:1.5px solid ${C.mid};color:${C.mid};margin-left:auto}
.note{font-size:13px;color:${C.mid};margin:6px 0 0;max-width:66ch;font-family:var(--read)}
/* Read + Think: the same choice board for every article, so it lives in the
   page rather than being redrawn on each pick. Collapsed, because a class
   reading the text does not need eighteen extra tasks in the way. */
.rt{margin:0 0 18px}
.rt > summary{list-style:none;display:inline-block}
.rt-board{background:${C.white};border:1px solid ${C.line};border-radius:18px;
  padding:20px 22px;margin:12px 0 0}
.rt-row{display:grid;grid-template-columns:minmax(110px,150px) repeat(3,1fr);gap:10px;
  margin:0 0 10px}
.rt-level{border-radius:14px;padding:12px 14px;display:flex;flex-direction:column;
  justify-content:center}
.rt-level b{font-size:16px;line-height:1.2}
.rt-level span{font-size:13px;color:${C.mid}}
.rt-task{background:${C.paper};border:1px solid ${C.line};border-radius:14px;padding:12px 14px}
.rt-task b{display:block;font-size:15px;line-height:1.3;margin:0 0 3px}
.rt-task span{font-size:13px;color:${C.mid};line-height:1.45}
@media (max-width:720px){.rt-row{grid-template-columns:1fr}}
pre{white-space:pre-wrap;font-family:ui-monospace,Menlo,monospace;font-size:12px;
  line-height:1.5;background:${C.panel};border-radius:12px;padding:14px;max-height:360px;
  overflow:auto;margin:14px 0 0}
pre[hidden]{display:none}
.task{font-size:18px;line-height:1.72;max-width:66ch;text-wrap:pretty;
  font-family:var(--read)}
@media (max-width:640px){h1{font-size:30px}.card .in{padding:16px}}
</style></head>
<body>
<div class="bar"></div>
<main>
  <p class="eyebrow">Upshift Learning</p>
  <h1>Reading Resources</h1>
  <p class="sub">Extra texts for comprehension and writing. Pick any one, read it together,
    answer the questions from the text, then write the response. Copy the prompt to hand the
    whole text to a student-safe AI space.</p>

  <div class="tabs" role="tablist">
    <button class="tab" role="tab" id="t-my" aria-selected="true">🔍 Mysteries</button>
    <button class="tab" role="tab" id="t-ar" aria-selected="false">📰 Articles</button>
  </div>

  <section id="pane-my">
    <div class="controls">
      <label class="eyebrow" for="pick-my-g" style="margin:0">Grade</label>
      <select id="pick-my-g"></select>
      <label class="eyebrow" for="pick-my" style="margin:0">Case</label>
      <select id="pick-my"></select>
      <button class="pill" id="my-solve" aria-pressed="true">🔍 Solve it</button>
      <button class="pill" id="my-debate" aria-pressed="false">💬 Debate it</button>
    </div>
    <p class="note" id="my-mode" style="margin:-8px 0 16px"></p>
    <div id="out-my"></div>
  </section>

  <section id="pane-ar" hidden>
    <div class="controls">
      <label class="eyebrow" for="pick-ar-g" style="margin:0">Grade</label>
      <select id="pick-ar-g"></select>
      <label class="eyebrow" for="pick-ar-s" style="margin:0">Standard</label>
      <select id="pick-ar-s"></select>
      <label class="eyebrow" for="pick-ar" style="margin:0">Article</label>
      <select id="pick-ar"></select>
      <button class="pill" id="ver-lo" aria-pressed="false">Lower Lexile</button>
      <button class="pill" id="ver-hi" aria-pressed="true">Higher Lexile</button>
    </div>
    <div id="out-ar"></div>
    <details class="rt">
      <summary class="pill">\u{1F9E0} ${RT.title} \u2014 choice board</summary>
      <div class="rt-board">
        <h2 style="margin:0 0 2px">${RT.title}</h2>
        <p class="sub" style="margin:0 0 16px">${RT.blurb}</p>
        ${RT.rows.map((row) => `
        <div class="rt-row">
          <div class="rt-level" style="background:${row.tint}">
            <b style="color:${row.ink}">${row.level}</b>
            <span>${row.verb}</span>
          </div>
          ${row.tasks.map((t) => `<div class="rt-task"><b>${t.t}</b><span>${t.d}</span></div>`).join("")}
        </div>`).join("")}
      </div>
    </details>
  </section>

  <p class="note">These are not decodable texts. They are written to meaning and reading level
    rather than to the phonics sequence, so they use spellings a given lesson has not taught.
    Read them with the class.</p>
</main>

<script id="data" type="application/json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>
<script>
(function () {
  var D = JSON.parse(document.getElementById("data").textContent);
  /* The cases and the articles arrive per grade.
     D starts with neither array. A grade dropdown changing asks for that
     grade's file once, keeps it, and then every filter below works exactly
     as it did when the whole lot was inline -- they all narrow by the
     selected grade anyway, so an array holding only the grades that have
     been opened gives the same answers. */
  D.my = [];
  D.ar = [];
  var got = {};
  function need(kind, g, done) {
    var key = kind + ":" + g;
    if (got[key]) return done();
    fetch("./data/" + kind + "-g" + g + ".json", { credentials: "same-origin" })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (rows) {
        got[key] = 1;
        D[kind] = D[kind].concat(rows);
        done();
      })
      .catch(function () { done(); });
  }
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  };
  var copyBtn = function (id, label) {
    return '<button class="pill primary" data-copy="' + id + '">📋 ' + label + '</button>';
  };

  /* ---------- mysteries ---------- */
  var selMy = document.getElementById("pick-my");
  var selMyG = document.getElementById("pick-my-g");
  function gradeName(g) {
    return g === 0 ? "K" : g === 1 ? "1st" : g === 2 ? "2nd" : g === 3 ? "3rd" : g + "th";
  }
  selMyG.innerHTML = D.myG.map(function (g) {
    return '<option value="' + g + '">' + gradeName(g) + "</option>";
  }).join("");
  function myPool() {
    return D.my.filter(function (c) { return String(c.g) === selMyG.value; });
  }
  function fillMy() {
    selMy.innerHTML = myPool().map(function (c, i) {
      return '<option value="' + i + '">' + esc("Week " + c.week + " \\u00b7 " + c.title) + "</option>";
    }).join("");
  }
  /* Which version of the case is on screen. Solve is the default: a case
     with one culprit the text rules the others out of. Debate withholds the
     deciding line, leaves three suspects arguable, and marks the evidence
     rather than the name. */
  var myMode = "solve";
  var bSolve = document.getElementById("my-solve");
  var bDebate = document.getElementById("my-debate");
  var modeNote = document.getElementById("my-mode");
  function myPrompt(c) {
    return D.myTpl
      .replace(/\\{GRADES\\}/g, gradeName(c.g))
      .replace(/\\{TITLE\\}/g, c.title)
      .replace("{STORY}", c.story)
      .replace("{QUESTION}", c.q)
      .replace("{SUSPECTS}", c.sus.map(function (s) { return "- " + s.who + ": " + s.why; }).join("\\n"));
  }
  /* The debate version carries its own coach rather than the same one with a
     line added, because the two have to believe different things. The solve
     coach must not know the answer or it leaks it. This one must not think
     there is an answer, or it quietly steers the student towards whichever
     suspect it settled on. */
  function myDebatePrompt(c) {
    var d = c.d;
    if (!d) return myPrompt(c);
    return D.myDbTpl
      .replace(/\\{GRADES\\}/g, gradeName(c.g))
      .replace(/\\{TITLE\\}/g, c.title)
      .replace("{STORY}", d.story)
      .replace("{QUESTION}", d.q)
      .replace("{SUSPECTS}", d.sus.map(function (s) { return "- " + s.who + ": " + s.why; }).join("\\n"))
      .replace("{OPEN}", d.open.map(function (i) { return "- " + d.sus[i].who; }).join("\\n"));
  }
  /* The teacher panel. Solve gives an answer and the lines that clear the
     rest; debate gives the case for each suspect still in play, the line
     each one has to answer, and only the suspects the text really does rule
     out. */
  function myKey(c, d) {
    if (!d) {
      return "<b>Answer:</b> " + esc(c.ans) +
        "<br><b>Key proof:</b><ul>" + c.proof.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") +
        "</ul>" + (c.clears.length ? "<b>Clears:</b><ul>" + c.clears.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>" : "") +
        (c.explain ? "<i>" + esc(c.explain) + "</i>" : "");
    }
    return "<b>There is no answer to this one.</b><br>Any of the three marked in play can be " +
      "argued from the text. What is being marked is the evidence and the reasoning, not the name." +
      d.args.map(function (a) {
        return '<p style="margin:12px 0 2px"><b>' + esc(d.sus[a.who].who) + "</b></p><ul>" +
          a.evidence.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>" +
          (a.against ? '<p style="margin:0">\\u00d7 Has to answer: ' + esc(a.against) + "</p>" : "");
      }).join("") +
      (d.clears.length
        ? '<p style="margin:12px 0 2px"><b>Really is ruled out</b></p><ul>' +
          d.clears.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>"
        : "") +
      "<i>" + esc(d.note) + "</i>";
  }
  function drawMy() {
    var c = myPool()[Number(selMy.value) || 0];
    if (!c) { document.getElementById("out-my").innerHTML = ""; return; }
    /* The toggle only appears where a debate version is written, so a case
       still waiting for one does not show a control that does nothing. */
    var d = c.d && myMode === "debate" ? c.d : null;
    bSolve.hidden = !c.d;
    bDebate.hidden = !c.d;
    bSolve.setAttribute("aria-pressed", d ? "false" : "true");
    bDebate.setAttribute("aria-pressed", d ? "true" : "false");
    modeNote.textContent = !c.d ? "" : d
      ? "No answer key. Three suspects are arguable; the evidence is what counts."
      : "One culprit. The case rules the others out.";
    var story = d ? d.story : c.story;
    var q = d ? d.q : c.q;
    var sus = d ? d.sus : c.sus;
    var txt = d ? myDebatePrompt(c) : myPrompt(c);
    document.getElementById("out-my").innerHTML =
      '<div class="card"><div class="top"></div><div class="in">' +
      '<div class="meta"><p class="eyebrow" style="margin:0">Mystery \\u00b7 ' + gradeName(c.g) + ' \\u00b7 Week ' + c.week + '</p>' +
      '<p class="eyebrow" style="margin:0">' + esc(c.tag) + "</p></div>" +
      "<h2>" + esc(c.title) + "</h2>" +
      '<div class="band first"><p class="eyebrow">The case</p>' +
      '<p class="story">' + esc(story) + "</p></div>" +
      '<div class="band"><p class="eyebrow">The question</p>' +
      '<p class="q">' + esc(q) + "</p>" +
      '<p class="eyebrow" style="margin:0 0 8px">Who could it be?</p>' +
      '<ul class="reading">' +
      sus.map(function (s, i) {
        return "<li><b>" + esc(s.who) + "</b>" +
          (d && d.open.indexOf(i) >= 0 ? ' <span class="kind" style="margin:0 0 0 8px">in play</span>' : "") +
          " \\u2014 " + esc(s.why) + "</li>";
      }).join("") +
      "</ul></div>" +
      '<div class="band"><p class="eyebrow">Then write</p><p class="task">' +
      (d
        ? "Name the one you are charging. Quote at least two lines from the case, and after each " +
          "one say what it shows. Then name the strongest line against you and answer it."
        : "Who did it, and how do you know? Quote the words from the case that prove it, " +
          "and say what rules each of the others out.") +
      "</p></div>" +
      '<div class="btns">' + copyBtn("my", d ? "Copy debate prompt" : "Copy mystery prompt") +
      '<button class="pill" data-toggle="my-pre">Show prompt</button>' +
      '<button class="pill teacher" data-toggle="my-ans">\\u{1F511} ' +
      (d ? "Teacher notes" : "Answers (teacher)") + "</button></div>" +
      '<div class="answer" id="my-ans" hidden>' + myKey(c, d) + "</div>" +
      '<pre id="my-pre" hidden>' + esc(txt) + "</pre>" +
      "</div></div>";
    window.__my = txt;
  }
  selMy.addEventListener("change", drawMy);
  selMyG.addEventListener("change", function () { need("my", selMyG.value, function () { fillMy(); drawMy(); }); });
  bSolve.addEventListener("click", function () { myMode = "solve"; drawMy(); });
  bDebate.addEventListener("click", function () { myMode = "debate"; drawMy(); });
  fillMy();

  /* ---------- articles ---------- */
  var gSel = document.getElementById("pick-ar-g");
  var sSel = document.getElementById("pick-ar-s");
  var aSel = document.getElementById("pick-ar");
  var ver = "hi";
  /* gradeName, same as the mysteries picker above. This select was left on the
     raw number, so kindergarten read "Grade 0" on the one page where the
     kindergarten articles live. */
  gSel.innerHTML = D.arG.map(function (g) {
    return '<option value="' + g + '">' + gradeName(g) + "</option>";
  }).join("");
  function pool() {
    return D.ar.filter(function (a) {
      return String(a.g) === gSel.value && (sSel.value === "*" || a.std === sSel.value);
    });
  }
  function fillStd() {
    var seen = [];
    D.ar.forEach(function (a) {
      if (String(a.g) === gSel.value && seen.indexOf(a.std) < 0) seen.push(a.std);
    });
    seen.sort();
    sSel.innerHTML = '<option value="*">All standards</option>' +
      seen.map(function (s) { return '<option value="' + s + '">' + s + "</option>"; }).join("");
  }
  function fillArt() {
    var p = pool();
    aSel.innerHTML = p.map(function (a, i) {
      return '<option value="' + i + '">' + esc(a.n + ". " + a.title) + "</option>";
    }).join("");
  }
  function arPrompt(a) {
    var v = a[ver];
    return D.arTpl
      .replace(/\\{GRADES\\}/g, gradeName(a.g))
      .replace(/\\{TITLE\\}/g, a.title)
      .replace("{STANDARD}", a.std)
      .replace("{ARTICLE}", v.p.map(function (x) { return x[0] + ". " + x[1]; }).join("\\n\\n"))
      .replace("{QUESTIONS}", a.qs.map(function (q) { return q[0] + " (" + q[1] + ") " + q[2]; }).join("\\n"));
  }
  function drawAr() {
    var p = pool();
    var a = p[Number(aSel.value) || 0];
    if (!a) { document.getElementById("out-ar").innerHTML = ""; return; }
    var v = a[ver];
    document.getElementById("out-ar").innerHTML =
      '<div class="card"><div class="top"></div><div class="in">' +
      '<div class="meta"><p class="eyebrow" style="margin:0">' + esc(a.std) + " \\u00b7 Grade " + a.g + "</p>" +
      '<p class="eyebrow" style="margin:0">Lexile ' + v.lx + " \\u00b7 " + v.w + " words</p></div>" +
      "<h2>" + esc(a.title) + "</h2>" +
      '<div class="band first"><p class="eyebrow">The text</p><div class="reading">' +
      v.p.map(function (x) { return '<div class="para"><b>' + esc(x[0]) + "</b><div>" + esc(x[1]) + "</div></div>"; }).join("") +
      "</div></div>" +
      '<div class="band"><p class="eyebrow">Five questions</p><div class="reading">' +
      a.qs.map(function (q) {
        // The number is drawn, the kind is shown, and the newline inside a
        // vocabulary item is kept: all three were being dropped here.
        return '<div class="para"><b>' + q[0] + "</b><div>" +
          '<span class="kind">' + esc(q[1]) + "</span>" +
          '<div style="white-space:pre-line">' + esc(q[2]) + "</div></div></div>";
      }).join("") +
      "</div></div>" +
      '<div class="band"><p class="eyebrow">Then write</p><p class="task">' +
      "What is the most important idea in this article, and how do you know? " +
      "Name the paragraph letter for every piece of evidence.</p></div>" +
      '<div class="btns">' + copyBtn("ar", "Copy article prompt") +
      '<button class="pill" data-toggle="ar-pre">Show prompt</button>' +
      '<button class="pill teacher" data-toggle="ar-ans">\u{1F511} Answers (teacher)</button></div>' +
      '<div class="answer" id="ar-ans" hidden>' +
      a.qs.map(function (q) { return q[3] ? "<p><b>" + q[0] + ".</b> " + esc(q[3]) + "</p>" : ""; }).join("") +
      (a.note ? "<p><i>Teacher note: " + esc(a.note) + "</i></p>" : "") + "</div>" +
      '<pre id="ar-pre" hidden>' + esc(arPrompt(a)) + "</pre>" +
      "</div></div>";
    window.__ar = arPrompt(a);
  }
  gSel.addEventListener("change", function () { need("ar", gSel.value, function () { fillStd(); fillArt(); drawAr(); }); });
  sSel.addEventListener("change", function () { fillArt(); drawAr(); });
  aSel.addEventListener("change", drawAr);
  document.getElementById("ver-lo").addEventListener("click", function () {
    ver = "lo"; this.setAttribute("aria-pressed", "true");
    document.getElementById("ver-hi").setAttribute("aria-pressed", "false"); drawAr();
  });
  document.getElementById("ver-hi").addEventListener("click", function () {
    ver = "hi"; this.setAttribute("aria-pressed", "true");
    document.getElementById("ver-lo").setAttribute("aria-pressed", "false"); drawAr();
  });

  /* ---------- shared behaviour ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-toggle],[data-copy]") : null;
    if (!t) return;
    if (t.hasAttribute("data-toggle")) {
      var el = document.getElementById(t.getAttribute("data-toggle"));
      if (!el) return;
      var open = !el.hidden; el.hidden = open;
      t.textContent = (open ? "Show " : "Hide ") + t.textContent.replace(/^(Show|Hide) /, "");
      return;
    }
    var txt = t.getAttribute("data-copy") === "my" ? window.__my : window.__ar;
    var done = function () {
      var old = t.innerHTML; t.innerHTML = "\\u2713 Copied";
      setTimeout(function () { t.innerHTML = old; }, 1600);
    };
    try {
      var r = navigator.clipboard.writeText(txt);
      if (r && r.then) r.then(done, function () {}); else done();
    } catch (err) { /* clipboard blocked; the prompt is still on the page */ }
  });

  document.getElementById("t-my").addEventListener("click", function () { show("my"); });
  document.getElementById("t-ar").addEventListener("click", function () { show("ar"); });
  function show(which) {
    document.getElementById("pane-my").hidden = which !== "my";
    document.getElementById("pane-ar").hidden = which !== "ar";
    document.getElementById("t-my").setAttribute("aria-selected", String(which === "my"));
    document.getElementById("t-ar").setAttribute("aria-selected", String(which === "ar"));
  }

  need("my", selMyG.value, function () { fillMy(); drawMy(); });
  need("ar", gSel.value, function () { fillStd(); fillArt(); drawAr(); });
})();
</script>
</body></html>
`;

writeFileSync("content-reading-materials/science-of-reading/resources.html", html, "utf8");

/**
 * The cases and the articles, one file per grade, beside the page.
 *
 * The folder is emptied first so a grade removed from the source does not
 * leave a file behind for the seed to carry into the table, where it would
 * still be served to anyone asking for it by name.
 */
const DATA_DIR = "content-reading-materials/science-of-reading/data";
rmSync(DATA_DIR, { recursive: true, force: true });
mkdirSync(DATA_DIR, { recursive: true });

let shards = 0;
let shardBytes = 0;
for (const [kind, rows] of [["my", CASES], ["ar", ARTICLES]]) {
  const byGrade = new Map();
  for (const row of rows) {
    if (!byGrade.has(row.g)) byGrade.set(row.g, []);
    byGrade.get(row.g).push(row);
  }
  for (const [g, list] of [...byGrade.entries()].sort((a, b) => a[0] - b[0])) {
    const body = JSON.stringify(list);
    writeFileSync(DATA_DIR + "/" + kind + "-g" + g + ".json", body, "utf8");
    shards++;
    shardBytes += body.length;
  }
}
// A two-number file so the site can quote the counts without pulling the
// whole article set into the app bundle.
writeFileSync("scripts/reading-resources-counts.json",
  JSON.stringify({ mysteries: MY.length, articles: AR.length }, null, 1) + "\n", "utf8");
// The seed recolours every #rrggbb it finds, and a numeric HTML entity
// like &#128269; looks exactly like one to that regex: it turned the
// magnifying glass into &#00756C;. Literal characters only.
const ents = html.match(/&#[0-9A-Fa-f]{6};/g);
if (ents) {
  console.error("numeric entities the recolour pass will eat: " + [...new Set(ents)].join(" "));
  process.exit(1);
}
console.log("wrote content-reading-materials/science-of-reading/resources.html");
console.log("  mysteries: " + MY.length + "   articles: " + AR.length);
console.log("  page size: " + Math.round(html.length / 1024) + " KB");
console.log("  " + shards + " per-grade files, " + Math.round(shardBytes / 1024) + " KB in all, one grade fetched at a time");
