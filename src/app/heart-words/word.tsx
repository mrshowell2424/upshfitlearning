import type { CSSProperties } from "react";

/**
 * One heart word, with hearts over the letters that have to be learned.
 *
 * The letters a child can decode are left completely alone -- same face,
 * same weight, no box, no colour. Only the part that decoding will not
 * give them carries a heart. That contrast is the entire teaching point:
 * "said" is s-ai-d, you know the s and the d, it is the ai that is odd.
 * Underlining or colouring the whole word would say the opposite, which
 * is that the word is a shape to memorise.
 *
 * The heart is drawn rather than typed. The emoji renders at a different
 * size, weight and colour on every platform, sits on a different
 * baseline, and on some of them arrives in full colour whatever the text
 * around it is doing.
 */

function Heart({ size = 13 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 22"
      width={size}
      height={(size * 22) / 24}
      aria-hidden="true"
      focusable="false"
      style={{ display: "block", margin: "0 auto 1px" }}
    >
      <path
        d="M12 21C12 21 1.5 14.2 1.5 7.4 1.5 3.9 4.2 1.5 7.3 1.5c2 0 3.7 1 4.7 2.6C13 2.5 14.7 1.5 16.7 1.5c3.1 0 5.8 2.4 5.8 5.9C22.5 14.2 12 21 12 21z"
        fill="currentColor"
      />
    </svg>
  );
}

export interface HeartWord {
  word: string;
  level: number;
  hearts: [number, number][];
  letters: string[];
  why: string;
}

export function MarkedWord({
  entry,
  size = 34,
  colour = "#733A32",
  ink = "#111111",
}: {
  entry: HeartWord;
  size?: number;
  colour?: string;
  ink?: string;
}) {
  /*
   * One heart per span, and the span is the unit.
   *
   * The heart belongs to a grapheme, so "ai" in said gets one heart over
   * both letters rather than two. But two adjacent spans stay two: in
   * "was" the a says /u/ and the s says /z/, which are two separate
   * facts about two separate letters, and one heart stretched over "as"
   * would say they are one thing. Walking the spans rather than the
   * letters is what keeps those apart -- merging by "is this letter
   * marked" cannot, because both answers are yes.
   */
  const runs: { text: string; marked: boolean }[] = [];
  let cursor = 0;
  for (const [a, b] of entry.hearts) {
    if (a > cursor) runs.push({ text: entry.word.slice(cursor, a), marked: false });
    runs.push({ text: entry.word.slice(a, b), marked: true });
    cursor = b;
  }
  if (cursor < entry.word.length) runs.push({ text: entry.word.slice(cursor), marked: false });

  const letter: CSSProperties = {
    fontFamily: 'var(--font-serif), Georgia, "Times New Roman", serif',
    fontSize: size,
    fontWeight: 700,
    lineHeight: 1.05,
    letterSpacing: "0.01em",
  };

  return (
    <span
      style={{ display: "inline-flex", alignItems: "flex-end" }}
      // Read as the plain word; the hearts are a visual cue for a sighted
      // child and would otherwise be spelled out letter by letter.
      role="img"
      aria-label={entry.word}
    >
      {runs.map((run, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}
        >
          <span style={{ color: run.marked ? colour : "transparent", height: (size * 0.42) }}>
            {run.marked ? <Heart size={size * 0.38} /> : null}
          </span>
          <span style={{ ...letter, color: run.marked ? colour : ink }}>{run.text}</span>
        </span>
      ))}
    </span>
  );
}
