/**
 * Turn a passage into a maze, the way mClass does.
 *
 * The first sentence is left whole so the reader gets their bearings, and
 * from there every seventh word is replaced by three choices: the word that
 * was there and two that were not. The child reads the sentence and picks
 * the one that makes sense.
 *
 * DETERMINISTIC ON PURPOSE. The same passage gives the same blanks and the
 * same distractors every time, because a teacher who prints a sheet on
 * Sunday needs the answer key to still match it on Monday — and because two
 * children working the same passage have to be working the same task.
 *
 * WHY THE DISTRACTORS ARE A FIXED LIST. The alternative is drawing them from
 * the passage itself, which is worse: a word that was in the passage often
 * fits the blank too, and a maze item with two defensible answers teaches a
 * child that reading carefully does not pay. These are concrete, ordinary
 * words from outside the text, matched only on length so the three choices
 * look alike on the page. They are not part-of-speech matched; that needs a
 * tagger, and the cost of not having one is that some items are easier than
 * mClass's. Easier is the safe direction for practice.
 */

/**
 * The distractor pool.
 *
 * Ordinary and concrete, so they are readable at the grades this is used in,
 * and semantically far from the kinds of things informational passages say.
 */
const POOL = [
  "pencil", "orange", "jumped", "silver", "window", "melted", "rabbit",
  "bottle", "yellow", "sleepy", "hammer", "garden", "puddle", "kettle",
  "monkey", "basket", "ladder", "carpet", "button", "pillow", "wagon",
  "candle", "mitten", "saddle", "zipper", "turtle", "pepper", "muffin",
  "sock", "hat", "cup", "dog", "leaf", "rock", "bike", "cake", "nest",
  "frog", "lamp", "desk", "fork", "coat", "bell", "drum", "kite", "moon",
  "ran", "sat", "ate", "hid", "dug", "fell", "sang", "swam", "clap",
  "red", "big", "wet", "soft", "loud", "cold", "tall", "slow", "warm",
];

/**
 * The little words, kept in their own pool.
 *
 * Drawing "kettle" and "pillow" against an answer of "was" makes an item a
 * child can finish without reading the sentence, which is the one thing a
 * maze must not be. So a function word is offered against other function
 * words, and a content word against content words: the three choices are
 * always the same kind of word, and only the meaning separates them.
 */
const FUNCTION_POOL = [
  "the", "and", "but", "or", "of", "to", "in", "on", "at", "for", "with",
  "from", "was", "were", "is", "are", "be", "had", "has", "have", "will",
  "would", "could", "should", "they", "them", "their", "it", "he", "she",
  "we", "you", "this", "that", "these", "those", "when", "then", "than",
  "there", "what", "which", "who", "how", "why", "not", "so", "if", "as",
  "by", "up", "out", "over", "under", "after", "before", "into", "about",
  "very", "more", "most", "some", "many", "much", "each", "all", "both",
];
const FUNCTION_SET = new Set(FUNCTION_POOL);

/** Same seed, same stream. Mulberry32, small and sufficient. */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A stable number from a string, so a passage's id can be its seed. */
export function seedFrom(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** The word without its punctuation, for comparing and for length. */
const bare = (w) => w.replace(/[^A-Za-z'-]/g, "");

/**
 * Build the maze.
 *
 * Returns a flat list of tokens so a page can render it without knowing how
 * any of this works: {kind: "text", s} for ordinary words, and
 * {kind: "blank", n, choices, answer, before, after} for a gap. `before` and
 * `after` carry any punctuation that was attached to the original word, so
 * "pond." keeps its full stop outside the brackets.
 *
 * @param {string} text the passage, paragraphs joined by spaces or newlines
 * @param {{ every?: number, seed?: number, max?: number, lead?: number,
 *           avoid?: string[] }} [opts]
 */
export function mazeTokens(text, opts = {}) {
  const every = opts.every ?? 7;
  const max = opts.max ?? 40;
  const rand = rng(opts.seed ?? seedFrom(text));

  const words = String(text).split(/\s+/).filter(Boolean);

  // Leave the first sentence alone. If the passage has no full stop, leave
  // the first ten words.
  //
  // `lead` overrides both, and a three-sentence maze needs it: an excerpt
  // that short cannot spend its first sentence on orientation, and it does
  // not need to -- the child has the whole passage in front of them and read
  // it out loud a minute ago. It counts words, not sentences.
  let start;
  if (opts.lead !== undefined) {
    start = Math.min(Math.max(0, opts.lead), words.length);
  } else {
    start = words.findIndex((w) => /[.!?]$/.test(w));
    start = start === -1 ? Math.min(10, words.length) : start + 1;
  }

  const used = new Set(words.map((w) => bare(w).toLowerCase()));
  // Words from the wider text this excerpt was cut out of. A distractor the
  // child read thirty seconds ago in the passage makes the item about what
  // they remember rather than what makes sense, which is the one thing a
  // maze must not be -- and an excerpt cannot see them on its own.
  for (const w of opts.avoid || []) used.add(bare(String(w)).toLowerCase());
  const tokens = [];
  let blanks = 0;
  let since = 0;

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const core = bare(w);

    const eligible =
      i >= start &&
      blanks < max &&
      since >= every - 1 &&
      core.length >= 2 &&
      // A capital letter answers the question on its own, so a word that
      // starts a sentence or names something is never the blank.
      core[0] === core[0].toLowerCase() &&
      // Never blank the last word: there is nothing after it to read for
      // sense, which is the whole task.
      i < words.length - 1;

    if (!eligible) {
      tokens.push({ kind: "text", s: w });
      if (i >= start) since++;
      continue;
    }

    // Two distractors of the same kind of word, roughly the same length, and
    // not already in the passage.
    const sameKind = FUNCTION_SET.has(core.toLowerCase()) ? FUNCTION_POOL : POOL;
    const near = sameKind.filter(
      (p) => p !== core.toLowerCase() && !used.has(p) && Math.abs(p.length - core.length) <= 2,
    );
    const pick = near.length >= 2 ? near : sameKind.filter((p) => p !== core.toLowerCase() && !used.has(p));
    if (pick.length < 2) {
      tokens.push({ kind: "text", s: w });
      since++;
      continue;
    }

    const a = pick[Math.floor(rand() * pick.length)];
    let bDistract = a;
    for (let tries = 0; tries < 8 && bDistract === a; tries++) {
      bDistract = pick[Math.floor(rand() * pick.length)];
    }
    if (bDistract === a) {
      tokens.push({ kind: "text", s: w });
      since++;
      continue;
    }

    // The punctuation that travelled with the word stays outside the choices.
    const at = w.indexOf(core);
    const before = w.slice(0, at);
    const after = w.slice(at + core.length);

    const choices = [core, a, bDistract];
    // Shuffle, so the answer is not always first.
    for (let j = choices.length - 1; j > 0; j--) {
      const k = Math.floor(rand() * (j + 1));
      [choices[j], choices[k]] = [choices[k], choices[j]];
    }

    blanks++;
    since = 0;
    tokens.push({ kind: "blank", n: blanks, choices, answer: core, before, after });
  }

  return tokens;
}

/** Just the answers, in order, for the key. */
export function mazeAnswers(tokens) {
  return tokens.filter((t) => t.kind === "blank").map((t) => ({ n: t.n, answer: t.answer }));
}
