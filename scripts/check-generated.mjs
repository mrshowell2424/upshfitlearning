/**
 * Does every generated file still match the thing that generates it?
 *
 * Fifteen files in this repo are written by a script and committed. A
 * generated file that is committed can go stale in one quiet way: change
 * the builder, forget to run it, and the repo keeps serving the old
 * output while the source of truth says something else. Nothing looks
 * wrong. The diff is clean. The site is a version behind.
 *
 * That had happened. Commit 29699ca, "Set the reading in a serif, and
 * make every rule solid", edited scripts/build-pbl-hub.mjs and did not
 * rebuild content-reading-materials/pbl/pbl-hub.html, so the file the
 * PBL hub actually loads still drew one of those rules dashed. One line,
 * invisible, and it would have stayed that way.
 *
 * HOW IT CHECKS. It takes a copy of every output in memory, runs the
 * builders in dependency order -- spelling before sequence, because the
 * sequence reads the dictation bank -- compares, and then puts every
 * file back exactly as it found it, whether it passed or failed. A
 * builder that is slow or needs a browser is not run here; those are
 * listed at the bottom with the flag that includes them.
 *
 *   bun scripts/check-generated.mjs
 *   GENERATED_SLOW=1 bun scripts/check-generated.mjs   # + the math PDFs
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";

/*
 * In dependency order. reading-spelling.json has to be rebuilt before
 * reading-sequence.json, because build-sequence prefers a lesson's
 * dictation bank over its pack list -- running them the other way round
 * would compare a fresh sequence against a stale bank and call it fine.
 */
const BUILDERS = [
  ["scripts/build-spelling.mjs", ["scripts/reading-spelling.json"]],
  ["scripts/build-sequence.mjs", ["scripts/reading-sequence.json"]],
  ["scripts/build-sentence-lab.mjs", ["scripts/reading-sentence-lab.json"]],
  ["scripts/build-fluency-play.mjs", ["scripts/reading-fluency-play.json"]],
  ["scripts/build-reading-threads.mjs", ["scripts/reading-threads.json"]],
  ["scripts/build-morphology.mjs", ["scripts/reading-morphology.json"]],
  ["scripts/build-multisyllabic.mjs", ["scripts/reading-multisyllabic.json"]],
  [
    "scripts/build-reading-resources.mjs",
    ["scripts/reading-resources-counts.json", "content-reading-materials/science-of-reading/resources.html"],
  ],
  ["scripts/build-pbl-hub.mjs", ["content-reading-materials/pbl/pbl-hub.html"]],
  // Every grade that has a source file, found rather than listed, so a new
  // grade is covered on the day it is written instead of the day someone
  // remembers to add it here.
  ...readdirSync("scripts/articles")
    .filter((f) => /^g\d+\.src\.mjs$/.test(f))
    .sort()
    .map((f) => [`scripts/articles/${f}`, [`scripts/articles/${f.replace(".src.mjs", ".json")}`]]),
];

/*
 * Needs a browser and takes about a minute, so it is off unless asked
 * for. It is reproducible: Chromium stamps the moment of printing into
 * every PDF, and build-math-printables.mjs rewrites those two dates to a
 * constant afterwards, so a rebuild that changes nothing produces files
 * that are byte-for-byte what was there.
 */
const SLOW = [
  [
    "scripts/build-math-printables.mjs",
    ["content-reading-materials/math/printables/g3_student.pdf", "content-reading-materials/math/printables/practice_k_key.pdf"],
  ],
];

const jobs = process.env.GENERATED_SLOW ? [...BUILDERS, ...SLOW] : BUILDERS;
const problems = [];

/** Everything we are about to overwrite, so it can go back. */
const before = new Map();
for (const [builder, outputs] of jobs) {
  if (!existsSync(builder)) problems.push(`${builder} is gone, and files in this repo are its output`);
  for (const f of outputs) {
    if (!existsSync(f)) problems.push(`${f} does not exist, and ${builder} is supposed to write it`);
    else before.set(f, readFileSync(f));
  }
}

let ran = 0;
try {
  for (const [builder, outputs] of jobs) {
    if (!existsSync(builder)) continue;
    try {
      execFileSync("bun", [builder], { stdio: "pipe" });
      ran++;
    } catch (e) {
      problems.push(`${builder} failed to run: ${String(e.stderr ?? e).slice(0, 300)}`);
      continue;
    }
    for (const f of outputs) {
      if (!before.has(f)) continue;
      const fresh = readFileSync(f);
      if (!fresh.equals(before.get(f)))
        problems.push(
          `${f} is not what ${builder} produces — the builder has moved on and the file has not. ` +
            `Run it and commit the result.`,
        );
    }
  }
} finally {
  // Always, pass or fail. A check does not get to leave the tree changed.
  for (const [f, body] of before) {
    try {
      if (!readFileSync(f).equals(body)) writeFileSync(f, body);
    } catch {
      writeFileSync(f, body);
    }
  }
}

console.log(`${ran} builders re-run, ${before.size} generated files compared with what they produce now.`);
if (!process.env.GENERATED_SLOW)
  console.log(`(the math printables are skipped here — GENERATED_SLOW=1 includes them)`);
console.log(`\nproblems: ${problems.length}`);
problems.slice(0, 40).forEach((x) => console.log("  " + x));
if (problems.length) {
  console.error("\n✗ rebuild these before they ship.");
  process.exit(1);
}
console.log("✅ every generated file is what its builder produces today");
