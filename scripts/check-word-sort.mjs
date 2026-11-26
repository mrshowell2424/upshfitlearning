/**
 * Checks every word sort before a child sorts one.
 *
 * The questions the file cannot answer about itself:
 *
 *   1. Is every word in a column actually an example of that column? A sort
 *      whose answer key is wrong teaches the pattern backwards, and it is the
 *      one sheet where the child's whole job is deciding which column a word
 *      belongs in.
 *   2. Is every odd one out genuinely in none of the columns? If one of them
 *      fits somewhere, the sheet has two right answers and marks one wrong.
 *   3. Does a word appear twice? The same word in two columns is the same
 *      fault wearing a different hat.
 *   4. Is the word bank exactly the words of the sort, mixed? The bank is
 *      what the child reads; a word in the bank that belongs nowhere, or a
 *      column word missing from it, is an unanswerable sheet.
 *   5. Can the sort be finished by elimination? Without odd ones out every
 *      word goes somewhere, so the last column fills itself.
 *
 *   bun run scripts/check-word-sort.mjs
 */
import { readFileSync } from "node:fs";
import { unsafeRealWord } from "./lib/not-nonsense.mjs";

const D = JSON.parse(readFileSync("scripts/reading-word-sort.json", "utf8"));
const SEQ = JSON.parse(readFileSync("scripts/reading-sequence.json", "utf8")).sequence;

const problems = [];
const fold = (w) => String(w).toLowerCase();

/** The same test the builder and the lesson picker use. */
function inColumn(part, word) {
  return String(part)
    .split("/")
    .map((a) => a.replace(/[^a-zA-Z_']/g, ""))
    .filter(Boolean)
    .some((a) => new RegExp(a.replace(/_/g, "[a-z]"), "i").test(word));
}

/*
 * A column whose heading is a lesson name rather than a spelling pattern
 * cannot be tested this way -- "Possessive 's" and "not this pattern" are
 * prose, not graphemes. The builder says which is which, because guessing it
 * from the text does not work: "Consonants" is letters all the way through
 * and is not a grapheme, and this checker read six good words as misfiled
 * before the builder started labelling them.
 */
const isPattern = (c) => c.kind === "pattern";

let columns = 0;
let words = 0;
for (const L of D.lessons) {
  const say = (m) => problems.push(`${L.key}: ${m}`);
  if (!L.columns || L.columns.length < 2) say("fewer than two columns, which is not a sort");

  const seen = new Map();
  for (const c of L.columns) {
    columns += 1;
    if (!c.words.length) say(`column "${c.label}" has no words`);
    for (const w of c.words) {
      words += 1;
      if (unsafeRealWord(fold(w))) say(`"${w}" cannot be printed for a child`);
      if (seen.has(fold(w))) say(`"${w}" is in both "${seen.get(fold(w))}" and "${c.label}"`);
      seen.set(fold(w), c.label);
      if (isPattern(c) && !inColumn(c.label, w)) {
        say(`"${w}" is filed under "${c.label}" and is not an example of it`);
      }
    }
  }

  for (const w of L.odd) {
    if (seen.has(fold(w))) say(`odd one out "${w}" is also in column "${seen.get(fold(w))}"`);
    seen.set(fold(w), "odd");
    for (const c of L.columns) {
      if (isPattern(c) && inColumn(c.label, w)) {
        say(`odd one out "${w}" belongs in "${c.label}"`);
      }
    }
  }

  // The bank is the sheet. It has to be the sort and nothing else.
  const bank = [...L.bank].map(fold).sort();
  const all = [...L.columns.flatMap((c) => c.words), ...L.odd].map(fold).sort();
  if (bank.join("|") !== all.join("|")) {
    say(`the word bank is not the sort's own words (${L.bank.length} printed, ${all.length} to place)`);
  }
  // A sort whose columns are patterns needs odd ones out, or the last column
  // fills itself by elimination. A sort that already has a "not this pattern"
  // column does not: that column is the odd pile, and a second one beside it
  // would give every odd word two right answers.
  const allPattern = L.columns.every((c) => c.kind === "pattern");
  if (allPattern && !L.odd.length) {
    say("no odd ones out, so the last column can be filled by elimination");
  }
  if (!allPattern && L.odd.length) {
    say("has odd ones out as well as a 'not this pattern' column, which is the same pile twice");
  }
}

const covered = new Set(D.lessons.map((l) => l.key));
const absent = SEQ.filter((l) => !covered.has(l.key));

console.log(`${D.lessons.length} word sorts of ${SEQ.length} lessons.`);
console.log(`${columns} columns, ${words} words to place, ${D.lessons.reduce((s, l) => s + l.odd.length, 0)} odd ones out.`);
if (absent.length) {
  console.log(`\n${absent.length} lessons have no sort: ${absent.map((l) => l.name).join(", ")}`);
  console.log("  (a sort needs something to sort against, which the first lesson of all does not have)");
}
console.log(`problems: ${problems.length}`);
problems.slice(0, 30).forEach((x) => console.log("  " + x));
if (problems.length) {
  console.error("\n✗ fix these before the sheet ships.");
  process.exit(1);
}
console.log("✅ every word is an example of its own column, and no odd one out belongs in any");
