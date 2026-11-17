/**
 * Practice for every maths standard the hub can generate honestly.
 *
 * The hub ships six items per standard — four computations and two word
 * problems — and the printables draw from the same six, so a teacher who
 * runs a lesson twice has nothing new to hand out and the group below
 * grade and the group ahead get the same sheet. It is the problem the
 * reading side had with ten words, one layer down: there is nothing to
 * rotate to.
 *
 * Two things make this tractable without inventing mathematics.
 *
 * The items are generated, and every one carries a check expression in
 * numbers and operators alone. scripts/check-math-practice.mjs evaluates
 * that with its own parser and compares it with the stored answer, so no
 * answer is trusted because the code that wrote the question also wrote
 * it.
 *
 * The levels are free. Below grade is the standard this one stands on and
 * above grade is the next in its strand, both read out of
 * math-prerequisites.json — so one sheet serves three groups without a
 * line of extra content, and the levels are the teaching sequence rather
 * than somebody's guess at "easier".
 *
 * 130 of the 305 standards are arithmetic that can be generated this way.
 * The rest — geometry proof, statistics, trigonometry — keep the hub's own
 * six items, and this file says which, rather than fabricating an item
 * that looks right and is not.
 *
 *   bun run scripts/build-math-practice.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { GEN } from "./lib/math-generators.mjs";
import { rng } from "./lib/math-items.mjs";

const PRE = JSON.parse(readFileSync("scripts/math-prerequisites.json", "utf8"));
const html = readFileSync("content-reading-materials/math/math-hub.html", "utf8");
const head = "var DATA = ";
const DATA = JSON.parse(html.slice(html.indexOf(head) + head.length, html.indexOf(";\n", html.indexOf(head))));

/** How many of each a standard gets. Enough that no activity repeats. */
const WANT_C = 12;
const WANT_W = 6;

/**
 * Which generator each standard uses, and with what numbers.
 *
 * Written by domain, because a domain is a kind of mathematics and the
 * numbers are what change through the grades. A code listed on its own
 * overrides its domain.
 */
const BY_DOMAIN = {
  "K.CC": ["count", { max: 100, by: [1, 10] }],
  "K.OA": ["addSub", { max: 5, sumMax: 10 }],
  "K.NBT": ["addSub", { min: 10, max: 19, op: "+" }],
  "1.OA": ["addSub", { max: 20, sumMax: 20 }],
  "1.NBT": ["place", { digits: 2 }],
  "2.OA": ["addSub", { max: 20, sumMax: 20 }],
  "2.NBT": ["place", { digits: 3 }],
  "3.OA": ["multDiv", { min: 2, max: 10 }],
  "3.NBT": ["addSub", { min: 100, max: 999 }],
  "3.NF": ["fraction", { denoms: [2, 3, 4, 6, 8] }],
  "4.OA": ["multDiv", { min: 2, max: 12 }],
  "4.NBT": ["bigMultDiv", { aDigits: 3, bDigits: 1 }],
  "4.NF": ["fraction", { kind: "addLike", denoms: [2, 3, 4, 5, 6, 8, 10, 12] }],
  "5.OA": ["algebra", { kind: "evaluate" }],
  "5.NBT": ["decimal", { places: 2 }],
  "5.NF": ["fraction", { kind: "mul", denoms: [2, 3, 4, 5, 6, 8] }],
  "6.RP": ["ratio", {}],
  "6.NS": ["integer", { max: 20 }],
  "6.EE": ["algebra", { kind: "oneStep" }],
  "7.RP": ["ratio", { kind: "percent" }],
  "7.NS": ["integer", { max: 30, op: "*" }],
  "7.EE": ["algebra", { kind: "twoStep" }],
  "8.NS": ["decimal", { places: 3 }],
  "8.EE": ["algebra", { kind: "exponent" }],
};

/** Standards whose own shape differs from the rest of their domain. */
const BY_CODE = {
  "K.CC.6": ["compare", { max: 10 }],
  "K.CC.7": ["compare", { max: 10 }],
  "1.NBT.3": ["compare", { max: 99 }],
  "2.NBT.4": ["compare", { max: 999 }],
  "2.NBT.5": ["addSub", { min: 10, max: 99 }],
  "2.NBT.7": ["addSub", { min: 100, max: 999 }],
  "3.NBT.1": ["round", { place: 10 }],
  "3.NBT.3": ["multDiv", { min: 2, max: 9 }],
  "4.NBT.2": ["compare", { min: 1000, max: 999999 }],
  "4.NBT.3": ["round", { place: 100 }],
  "4.NBT.6": ["bigMultDiv", { aDigits: 2, bDigits: 1, op: "/" }],
  "4.NF.2": ["fraction", { kind: "compare", denoms: [2, 3, 4, 6, 8] }],
  "4.NF.4": ["fraction", { kind: "mulWhole", denoms: [2, 3, 4, 5, 6, 8] }],
  "5.NBT.4": ["round", { place: 100 }],
  "5.NBT.5": ["bigMultDiv", { aDigits: 3, bDigits: 2 }],
  "5.NBT.6": ["bigMultDiv", { aDigits: 3, bDigits: 1, op: "/" }],
  "5.NF.1": ["fraction", { kind: "addUnlike", denoms: [2, 3, 4, 6, 8] }],
  "5.NF.2": ["fraction", { kind: "sub", denoms: [2, 4, 6, 8] }],
  "5.NF.4": ["fraction", { kind: "mul", denoms: [2, 3, 4, 5] }],
  "6.NS.3": ["decimal", { places: 2 }],
  "6.EE.7": ["algebra", { kind: "oneStep" }],
  "7.RP.3": ["ratio", { kind: "percent" }],
  "8.EE.7": ["algebra", { kind: "twoStep" }],
};

const plan = (code) => BY_CODE[code] || BY_DOMAIN[code.replace(/\.\d+$/, "")] || null;

/** Items for one standard, distinct and in a fixed order. */
function itemsFor(code) {
  const p = plan(code);
  if (!p) return null;
  const [name, params] = p;
  const gen = GEN[name];
  if (!gen) throw new Error(`${code} asks for a generator called ${name}, which does not exist`);
  const r = rng(code);
  const out = { c: [], w: [] };
  for (const [key, want] of [["c", WANT_C], ["w", WANT_W]]) {
    const seen = new Set();
    for (let tries = 0; tries < want * 60 && out[key].length < want; tries++) {
      const item = gen[key](r, params);
      if (!item || seen.has(item.q)) continue;
      seen.add(item.q);
      out[key].push(item);
    }
  }
  return out.c.length && out.w.length ? out : null;
}

const items = {};
const generated = [];
const kept = [];
for (const [, code] of DATA) {
  const got = itemsFor(code);
  if (got) { items[code] = got; generated.push(code); } else kept.push(code);
}

/**
 * Which standard each level reads from.
 *
 * Below grade is what this standard stands on; above is the next in the
 * same strand. Where that neighbour has no generated items the level falls
 * back to this standard's own, which is honest: a sheet that says it is
 * easier and is not would be worse than one level of practice.
 */
const nextInStrand = {};
for (const [code, pre] of Object.entries(PRE.prereq)) {
  if (!nextInStrand[pre]) nextInStrand[pre] = code;
}
const levels = {};
for (const code of generated) {
  const below = PRE.prereq[code];
  const above = nextInStrand[code];
  levels[code] = {
    below: below && items[below] ? below : code,
    on: code,
    above: above && items[above] ? above : code,
  };
}

writeFileSync(
  "scripts/math-practice.json",
  JSON.stringify({
    _note:
      "Generated practice for the maths standards whose items can be written by rule, with the answer computed rather than typed. Each item carries a check expression the checker evaluates independently. Levels point at other standards: below grade is what this one stands on, above is the next in its strand, both from math-prerequisites.json. Generated by scripts/build-math-practice.mjs; do not hand-edit.",
    perStandard: { computation: WANT_C, wordProblems: WANT_W },
    generated: generated.length,
    kept: kept.length,
    levels,
    items,
    keptStandards: kept,
  }, null, 1) + "\n",
);

const threeLevels = Object.values(levels).filter((l) => l.below !== l.on && l.above !== l.on).length;
console.log(`${generated.length} standards generated, ${WANT_C} computations and ${WANT_W} word problems each — ${generated.length * (WANT_C + WANT_W)} items.`);
console.log(`${threeLevels} of them have a different standard at all three levels.`);
console.log(`${kept.length} standards keep the hub's own six: ${kept.slice(0, 8).join(", ")}${kept.length > 8 ? ", …" : ""}`);
