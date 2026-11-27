"use client";

import { useMemo, useRef, useState } from "react";
// The clue logic lives beside the data and the check that guards it, in
// scripts/lib/ladder-clue.mjs, so this page and that check cannot drift
// apart. Plain string work; it runs anywhere.
import { judgeRung, tidy } from "@/../scripts/lib/ladder-clue.mjs";

/**
 * Word ladders.
 *
 * One word becomes another by one stated change at a time. "set" becomes
 * "sat" becomes "sad" becomes "said". It looks like a puzzle and it is
 * the most direct phoneme-manipulation exercise there is: to climb a rung
 * a child has to hold the word in mind, take one sound out or put one in,
 * and say what is left. That is the skill the whole of early decoding
 * rests on, and it is the one a worksheet almost never asks for.
 *
 * What this adds to the printed version is what it can say when a rung
 * comes back wrong. A ladder is a manipulation exercise, so the question
 * worth asking is whether the child manipulated at all:
 *
 *   One sound changed, and it was the wrong sound. The method is there
 *   and the target is not -- point at the clue again.
 *
 *   A different word altogether. The method is what is missing; the
 *   child is writing rather than changing.
 *
 * Those are different lessons tomorrow, and "wrong" cannot tell them
 * apart. The rule lives in scripts/lib/ladder-clue.mjs and
 * check-word-ladders.mjs asserts it, including that the split actually
 * fires on real rungs rather than being decoration.
 *
 * Nothing is stored. No attempt and no name leaves the tab it was typed
 * in -- this is a page a child sits in front of.
 */

const BRAND = {
  ink: "#111111",
  mid: "#444444",
  line: "#E9E9E9",
  panel: "#F2F2F2",
  paper: "#F7F6F4",
  white: "#FFFFFF",
  coralDark: "#C83220",
  lavenderDark: "#7758C0",
  tealDark: "#377387",
  amberDark: "#8A5400",
};

const label: React.CSSProperties = {
  fontFamily: "Poppins, system-ui, sans-serif",
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: BRAND.mid,
};

const serif = 'var(--font-serif), Georgia, "Times New Roman", serif';

type Verdict = "right" | "same" | "near" | "far" | "empty";

/** What the child reads back. The wording is the whole point of the split. */
function say(v: Verdict, clue: string, prev: string): string {
  switch (v) {
    case "same":
      return "That is the same word. The clue asks you to change something.";
    case "near":
      return `You changed one sound — just not the one the clue asks for. Read it again: ${clue}`;
    case "far":
      return `That is more than one change away. Start from ${prev} and make only this change: ${clue}`;
    case "empty":
      return "Write the new word.";
    default:
      return "";
  }
}

export interface LadderData {
  start: string;
  words: string[];
  clues: string[];
}

export function Ladder({
  data,
  student,
}: {
  data: LadderData;
  student: boolean;
}) {
  const rungs = data.words.length - 1;

  const [at, setAt] = useState(0);
  const [typed, setTyped] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  // What the child actually wrote on each rung they have cleared, so the
  // finished ladder shows their own work rather than the answer key.
  const [done, setDone] = useState<string[]>([]);
  const [tries, setTries] = useState<number[]>(() => Array(rungs).fill(0));
  const [shown, setShown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const finished = at >= rungs;
  const prev = at === 0 ? data.start : data.words[at];
  const clue = data.clues[at] ?? "";

  const clean = useMemo(() => tidy(typed), [typed]);

  function check(e: React.FormEvent) {
    e.preventDefault();
    if (finished) return;
    const v = judgeRung(prev, data.words[at + 1], clue, typed) as Verdict;
    setVerdict(v);
    setTries((t) => {
      const n = [...t];
      n[at] = n[at] + 1;
      return n;
    });
    if (v === "right") {
      setDone((d) => [...d, data.words[at + 1]]);
      setAt(at + 1);
      setTyped("");
      setVerdict(null);
      setShown(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  function reveal() {
    setShown(true);
  }

  function next() {
    setDone((d) => [...d, data.words[at + 1]]);
    setAt(at + 1);
    setTyped("");
    setVerdict(null);
    setShown(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function restart() {
    setAt(0);
    setTyped("");
    setVerdict(null);
    setDone([]);
    setTries(Array(rungs).fill(0));
    setShown(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  const firstTime = tries.filter((n) => n === 1).length;

  return (
    <div>
      <p style={{ ...label, margin: "0 0 12px" }}>
        {finished ? `All ${rungs} rungs` : `Rung ${at + 1} of ${rungs}`}
        {!student && !finished && ` · the answer is ${data.words[at + 1]}`}
      </p>

      {/* The ladder so far. The start word is given; everything below it
          is what the child wrote. */}
      <ol style={{ listStyle: "none", margin: "0 0 18px", padding: 0 }}>
        <li style={{ display: "flex", alignItems: "baseline", gap: 12, margin: "0 0 6px" }}>
          <span style={{ ...label, width: 58, flexShrink: 0, color: BRAND.mid }}>Start</span>
          <span
            style={{
              fontFamily: serif,
              fontSize: 26,
              fontWeight: 700,
              color: BRAND.ink,
              letterSpacing: "0.02em",
            }}
          >
            {data.start}
          </span>
        </li>
        {done.map((w, i) => (
          <li
            key={i}
            style={{ display: "flex", alignItems: "baseline", gap: 12, margin: "0 0 6px" }}
          >
            <span style={{ ...label, width: 58, flexShrink: 0, color: BRAND.tealDark }}>
              {i + 1}
            </span>
            <span
              style={{
                fontFamily: serif,
                fontSize: 26,
                fontWeight: 700,
                color: BRAND.tealDark,
                letterSpacing: "0.02em",
              }}
            >
              {w}
            </span>
            <span style={{ fontSize: 12.5, color: BRAND.mid }}>{data.clues[i]}</span>
          </li>
        ))}
      </ol>

      {!finished && (
        <form onSubmit={check}>
          <div
            style={{
              background: BRAND.paper,
              border: `1px solid ${BRAND.line}`,
              borderLeft: `3px solid ${BRAND.coralDark}`,
              borderRadius: "3px 12px 12px 3px",
              padding: "14px 16px",
            }}
          >
            <p style={{ ...label, margin: "0 0 6px", color: BRAND.coralDark }}>
              The clue
            </p>
            <p
              style={{
                fontFamily: serif,
                fontSize: 19,
                lineHeight: 1.5,
                margin: "0 0 12px",
                color: BRAND.ink,
              }}
            >
              {clue}
            </p>

            <label htmlFor="rung" style={{ ...label, display: "block", margin: "0 0 6px" }}>
              Write the new word
            </label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <input
                id="rung"
                ref={inputRef}
                value={typed}
                onChange={(e) => {
                  setTyped(e.target.value);
                  setVerdict(null);
                }}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                style={{
                  fontFamily: serif,
                  fontSize: 24,
                  fontWeight: 700,
                  padding: "8px 12px",
                  minHeight: 46,
                  width: 220,
                  borderRadius: 10,
                  border: `1.5px solid ${verdict && verdict !== "right" ? BRAND.coralDark : BRAND.line}`,
                  background: BRAND.white,
                  color: BRAND.ink,
                }}
              />
              <button
                type="submit"
                disabled={!clean}
                style={{
                  fontFamily: "Poppins, system-ui, sans-serif",
                  fontSize: 13.5,
                  fontWeight: 800,
                  padding: "11px 20px",
                  minHeight: 46,
                  borderRadius: 999,
                  border: "none",
                  background: clean ? BRAND.coralDark : BRAND.line,
                  color: clean ? BRAND.white : BRAND.mid,
                  cursor: clean ? "pointer" : "default",
                }}
              >
                Check
              </button>
              <button
                type="button"
                onClick={reveal}
                style={{
                  fontFamily: "Poppins, system-ui, sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  padding: "11px 16px",
                  minHeight: 46,
                  borderRadius: 999,
                  border: `1.5px solid ${BRAND.line}`,
                  background: BRAND.white,
                  color: BRAND.ink,
                  cursor: "pointer",
                }}
              >
                Show me
              </button>
            </div>

            {/* One live region, so a screen reader hears the verdict rather
                than silently losing it. */}
            <div aria-live="polite" style={{ minHeight: 24 }}>
              {verdict && verdict !== "right" && !shown && (
                <p
                  style={{
                    fontSize: 14.5,
                    lineHeight: 1.6,
                    margin: "12px 0 0",
                    color: verdict === "near" ? BRAND.amberDark : BRAND.coralDark,
                    maxWidth: "58ch",
                  }}
                >
                  {say(verdict, clue, prev)}
                </p>
              )}
              {shown && (
                <p style={{ fontSize: 14.5, lineHeight: 1.6, margin: "12px 0 0", color: BRAND.mid }}>
                  It is{" "}
                  <b style={{ fontFamily: serif, fontSize: 19, color: BRAND.ink }}>
                    {data.words[at + 1]}
                  </b>
                  .{" "}
                  <button
                    type="button"
                    onClick={next}
                    style={{
                      font: "inherit",
                      fontWeight: 800,
                      color: BRAND.tealDark,
                      background: "none",
                      border: "none",
                      padding: "6px 2px",
                      minHeight: 30,
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Carry on
                  </button>
                </p>
              )}
            </div>
          </div>
        </form>
      )}

      {finished && (
        <div
          style={{
            border: `1px solid ${BRAND.line}`,
            borderLeft: `3px solid ${BRAND.tealDark}`,
            borderRadius: "3px 12px 12px 3px",
            padding: "14px 16px",
          }}
        >
          <p style={{ ...label, margin: "0 0 6px", color: BRAND.tealDark }}>
            Top of the ladder
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.65, margin: "0 0 12px", color: BRAND.mid, maxWidth: "58ch" }}>
            {data.start} became {data.words[data.words.length - 1]} in {rungs} changes.{" "}
            {firstTime === rungs
              ? "Every rung first time."
              : `${firstTime} of ${rungs} first time.`}
          </p>
          <button
            type="button"
            onClick={restart}
            style={{
              fontFamily: "Poppins, system-ui, sans-serif",
              fontSize: 13.5,
              fontWeight: 800,
              padding: "11px 20px",
              minHeight: 46,
              borderRadius: 999,
              border: "none",
              background: BRAND.ink,
              color: BRAND.white,
              cursor: "pointer",
            }}
          >
            Climb it again
          </button>
        </div>
      )}
    </div>
  );
}
