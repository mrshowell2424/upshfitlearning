/**
 * Lessons the Hub adds to the reading sequence, beyond the canvas export's own.
 *
 * WHY THIS FILE EXISTS. The teaching order is derived from a `const SK = [`
 * literal inside lesson-builder.html, and the export is not ours to edit: a
 * re-export would wipe anything written into it, which is the whole reason the
 * seed script patches the page instead. But the sequence is derived from the
 * FILE ON DISK, not from the patched page, so a lesson added only by a seed
 * rule would appear in the builder and be invisible to the scope and sequence,
 * the spiral review, the daily practice and every checker.
 *
 * So the lessons live here, and both sides read them: the seed rule splices
 * them into the served page, and scripts/lib/sequence.mjs appends them to the
 * derived order. One source, two consumers, and a re-export cannot touch it.
 *
 * A row matches the export's own shape:
 *   [0] key   [1] name   [2] band   [3] story   [4] rule
 *   [5] teach examples   [6] real words   [7] made-up words
 *   [8] heart words      [9] sentences
 */

/**
 * The vowel teams, grouped by SOUND rather than by spelling.
 *
 * The sequence already teaches them in spelling pairs -- ai-ay, ee-ea, oa-ow --
 * which is how they are written. It did not teach them by the sound they make,
 * and that is the question a child actually faces: I can hear long a, so which
 * of the five ways do I write it?
 *
 * These SIT ALONGSIDE the pairs rather than replacing them, so a child meets ai
 * and ay first as a pair and later as two of the five ways to spell long a.
 *
 * LEVEL 3, NOT LEVEL 2, which is where they were first put by matching the
 * pairs. The pairs teach the two commonest spellings of a sound and sit at
 * 2-05; everything else these lessons cover -- ea, ey, eigh, ie, ei, igh, ue,
 * eu, ew -- the sequence does not reach until "Vowel teams 2" at level 3 and
 * "Vowel teams 3" at level 4. Putting the full set at level 2 asked a child to
 * choose between five spellings before three of them had been taught. They sit
 * at 3-04a through 3-04f, straight after Vowel teams 2.
 *
 * Every made-up word here was checked against web2, the clipped-word list and
 * the unsafe-string list before it went in. blay and plew came back real and
 * were replaced with snay and frew.
 */
export const EXTRA_LESSONS = [
  ["long-a", "Long a: ai, ay, ea, ey, eigh", "Level 3",
   "Rain Date (p. 64) · May I Play? (p. 65)",
   "Five ways to write long a. ai and ay carry most of it; ea, ey and eigh do the rest in a handful of words.",
   ["rain → may", "break → they", "eight → weigh"],
   ["rain", "play", "break", "they", "eight", "mail", "stay", "great", "weigh", "obey"],
   ["zail", "snay", "vaim", "dreigh"],
   ["said", "again", "says"],
   ["They wait in the rain.", "Eight pails of grain stay dry."]],

  ["long-e", "Long e: ea, ee, ey, ie, ei", "Level 3",
   "The Green Field (p. 70) · Keep the Key (p. 71)",
   "Five ways to write long e. ee and ea carry most of it; ey, ie and ei do the rest.",
   ["seat → seed", "key → valley", "chief → ceiling"],
   ["seat", "feed", "key", "chief", "field", "green", "dream", "money", "piece", "seize"],
   ["meep", "feap", "treep", "sween"],
   ["been", "these", "people"],
   ["The green field is by the sea.", "Keep the key in a safe place."]],

  ["long-i", "Long i: igh, ie, y", "Level 3",
   "Night Light (p. 76) · My Pie (p. 77)",
   "Three ways to write long i. igh sits in the middle; ie and y sit at the end.",
   ["sight → night", "pie → tie", "my → try"],
   ["night", "light", "high", "pie", "tie", "my", "try", "sky", "right", "cry"],
   ["zigh", "drigh", "plie", "smigh"],
   ["eye", "buy", "height"],
   ["I try to fly my kite at night.", "The pie is high on the shelf."]],

  ["long-o", "Long o: oa, oe, ow", "Level 3",
   "The Goat Boat (p. 82) · Snow Road (p. 83)",
   "Three ways to write long o. oa sits in the middle; oe and ow sit at the end.",
   ["boat → coat", "toe → foe", "snow → grow"],
   ["boat", "coat", "road", "toe", "snow", "grow", "slow", "soap", "goat", "know"],
   ["goam", "noab", "stoap", "zoab"],
   ["once", "gone", "door"],
   ["The goat sat in the snow.", "I know the road by the coast."]],

  ["long-u", "Long u: ue, ew, eu", "Level 4",
   "Blue Glue (p. 88) · The New Crew (p. 89)",
   "Three ways to write long u. ue and ew sit at the end; eu turns up in a few words.",
   ["blue → clue", "stew → few", "feud → neutral"],
   ["blue", "true", "clue", "stew", "few", "new", "grew", "chew", "due", "dew"],
   ["jue", "zew", "frew", "frue"],
   ["shoe", "sure", "through"],
   ["The new crew grew a few plants.", "I knew the blue glue was due."]],

  ["teams-all", "All vowel teams together", "Level 3",
   "The Team by the Sea (p. 94)",
   "Every team at once. Find the team first, then say its sound — that order is the whole skill.",
   ["rain · seat · boat", "night · few · snow", "key · pie · blue"],
   ["rain", "seat", "boat", "night", "snow", "blue", "key", "pie", "few", "green"],
   ["zail", "meep", "goam", "zigh"],
   ["said", "been", "once"],
   ["The team sees a boat in the rain.", "At night we grow new seeds."]],
];

/** Where each one sits in the teaching order. */
export const EXTRA_SCOPE = {
  "long-a": "3-04a",
  "long-e": "3-04b",
  "long-i": "3-04c",
  "long-o": "3-04d",
  // LEVEL 4, not 3, unlike its four siblings. The sequence does not teach ue,
  // ew or ui until "Vowel teams 3" at level 4, so a lesson covering every way
  // to write long u cannot sit before it -- the passage checker caught this by
  // refusing words the programme had not reached. It sits at 4-06a, straight
  // after Vowel teams 3.
  "long-u": "4-06a",
  "teams-all": "3-04f",
};
