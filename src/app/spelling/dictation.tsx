"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
// The judgement lives beside the data that feeds it, in
// scripts/lib/spelling-span.mjs, so this page and the check that guards
// it cannot drift apart. It is plain string work and runs anywhere.
import { judgeSpelling } from "@/../scripts/lib/spelling-span.mjs";

/**
 * Dictation.
 *
 * The site has a reading task on everything and a writing one on almost
 * nothing, and the two are not the same skill. A child who reads "rain"
 * recognises it; a child who spells it has to choose between ai, ay and
 * a_e with nothing on the page to choose from. Only spelling forces that.
 *
 * What makes this more than a quiz is that it can say WHERE a spelling
 * went wrong. Every word carries the span of the lesson inside it, so
 * "rane" for "rain" is a child who has not got ai yet, and "paind" for
 * "paint" is a child who has got ai and is hearing the last sound wrong.
 * Those are two different lessons tomorrow, and a tool that only says
 * "wrong" cannot tell them apart.
 *
 * "trian" for "train" is the case worth naming, because it reads like the
 * second kind and is the first: the letters are both there and the order
 * is wrong, and the order is what the lesson is.
 *
 * Nothing here is stored. No attempt, no score and no name leaves the tab
 * it was typed in -- this is a page a child sits in front of, and a record
 * of a seven-year-old's spelling errors is not ours to keep.
 */

const BRAND = {
  ink: "#111111",
  mid: "#444444",
  line: "#E9E9E9",
  panel: "#F2F2F2",
  paper: "#F7F6F4",
  white: "#FFFFFF",
  coralDark: "#C0432F",
  lavenderDark: "#6B2FB5",
  tealDark: "#00756C",
  blueDark: "#2F6FD0",
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

export interface SpellWord {
  word: string;
  /** [start, end) of the lesson inside the spelling. */
  span: [number, number];
}
export interface SpellPart {
  part: string;
  words: SpellWord[];
}
export interface Sentence {
  text: string;
  words: number;
  carries: string[];
  source: string;
}

/** The word with its lesson letters marked. */
function Marked({
  word,
  span,
  size = 30,
  color = BRAND.coralDark,
}: {
  word: string;
  span: [number, number];
  size?: number;
  color?: string;
}) {
  const [a, b] = span;
  return (
    <span style={{ fontFamily: serif, fontSize: size, fontWeight: 700, letterSpacing: "0.01em" }}>
      {word.slice(0, a)}
      <span
        style={{
          color,
          borderBottom: `3px solid ${color}`,
          paddingBottom: 1,
        }}
      >
        {word.slice(a, b)}
      </span>
      {word.slice(b)}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Saying it
 * ------------------------------------------------------------------ */

/**
 * The browser's own voice, so a child can work without an adult beside
 * them. The teacher's voice is still the better one -- a synthesiser
 * clips the end of a word and does not slow down for a child who asks --
 * so the word is always on screen for whoever is running it, and this is
 * the fallback rather than the plan.
 */
/** Nothing to subscribe to: whether the browser has a voice never changes. */
const NEVER = () => () => {};

function useVoice() {
  // Read rather than stored. Putting a feature detect in state means
  // setting it synchronously from an effect, which costs a second render
  // of the whole page on every mount to learn something that was knowable
  // the moment there was a window. null is the server's answer.
  const supported = useSyncExternalStore(
    NEVER,
    () => "speechSynthesis" in window,
    () => null,
  );

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [pick, setPick] = useState(0);

  useEffect(() => {
    if (!supported) return;
    // Chrome returns [] on the first call and fills the list later, so the
    // event matters as much as the call.
    const load = () => {
      const all = window.speechSynthesis.getVoices();
      setVoices(all.filter((v) => v.lang.toLowerCase().startsWith("en")));
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", load);
      window.speechSynthesis.cancel();
    };
  }, [supported]);

  const say = (text: string, rate = 0.85) => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voices[pick]) u.voice = voices[pick];
    u.rate = rate;
    window.speechSynthesis.speak(u);
  };

  return { supported, voices, pick, setPick, say };
}

function SayButton({
  onClick,
  children,
  big,
}: {
  onClick: () => void;
  children: React.ReactNode;
  big?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontFamily: "Poppins, system-ui, sans-serif",
        fontSize: big ? 16 : 13.5,
        fontWeight: 800,
        padding: big ? "14px 24px" : "9px 16px",
        minHeight: big ? 52 : 40,
        borderRadius: 999,
        border: `2px solid ${BRAND.ink}`,
        background: BRAND.ink,
        color: BRAND.white,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 9,
      }}
    >
      <span aria-hidden="true">🔊</span>
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ *
 * The round
 * ------------------------------------------------------------------ */

type Verdict = { kind: "right" | "lesson" | "elsewhere" };

export function Dictation({
  patternName,
  parts,
  sentence,
  student,
}: {
  patternName: string;
  parts: SpellPart[];
  sentence: Sentence;
  student: boolean;
}) {
  const voice = useVoice();

  // One flat run through the pattern's words, in the order the banks give
  // them, so a teacher working down the list on paper and a child working
  // down the screen are on the same word.
  const words = useMemo(() => parts.flatMap((p) => p.words.map((w) => ({ ...w, part: p.part }))), [parts]);

  const [at, setAt] = useState(0);
  const [typed, setTyped] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [tally, setTally] = useState({ right: 0, lesson: 0, elsewhere: 0 });
  const [onSentence, setOnSentence] = useState(false);
  const box = useRef<HTMLInputElement>(null);

  const w = words[at];

  const check = () => {
    if (!w || verdict || !typed.trim()) return;
    const v: Verdict = { kind: judgeSpelling(w.word, w.part, typed) };
    setVerdict(v);
    setTally((t) => ({
      right: t.right + (v.kind === "right" ? 1 : 0),
      lesson: t.lesson + (v.kind === "lesson" ? 1 : 0),
      elsewhere: t.elsewhere + (v.kind === "elsewhere" ? 1 : 0),
    }));
  };

  const next = () => {
    setVerdict(null);
    setTyped("");
    if (at + 1 >= words.length) setOnSentence(true);
    else setAt(at + 1);
    requestAnimationFrame(() => box.current?.focus());
  };

  if (onSentence) {
    return (
      <SentenceRound
        sentence={sentence}
        student={student}
        say={voice.say}
        supported={voice.supported}
        tally={tally}
        again={() => {
          setOnSentence(false);
          setAt(0);
          setTally({ right: 0, lesson: 0, elsewhere: 0 });
        }}
      />
    );
  }

  if (!w) return null;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        {/* The sub-pattern is named for the teacher and not for the
            child: "word 1 of 20 · ai" tells them which spelling of the
            sound to use before they have written anything, which is the
            one thing dictation is supposed to find out. It appears in the
            feedback, once they have committed. */}
        <p style={{ ...label, margin: "0 0 10px" }}>
          Word {at + 1} of {words.length}
          {!student && ` · ${w.part}`}
        </p>
        {!student && (
          <p style={{ ...label, margin: "0 0 10px", color: BRAND.tealDark }}>
            {tally.right} right · {tally.lesson} on the pattern · {tally.elsewhere} elsewhere
          </p>
        )}
      </div>

      {/* The word. The teacher reads it out; the child must not see it
          until they have committed to a spelling, which is the whole
          point of dictation. */}
      <div
        style={{
          background: BRAND.paper,
          borderRadius: 16,
          padding: "22px 24px",
          textAlign: "center",
          minHeight: 104,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        {student && !verdict ? (
          <>
            <p style={{ ...label, margin: 0 }}>Listen. Say it. Then write it.</p>
            {voice.supported === false ? (
              <p style={{ fontSize: 15, color: BRAND.mid, margin: 0, maxWidth: "44ch", lineHeight: 1.5 }}>
                This browser has no voice, so your teacher will read the word to you.
              </p>
            ) : (
              <SayButton big onClick={() => voice.say(w.word)}>
                Say the word
              </SayButton>
            )}
          </>
        ) : (
          <>
            <Marked word={w.word} span={w.span as [number, number]} />
            {voice.supported !== false && (
              <SayButton onClick={() => voice.say(w.word)}>Say it</SayButton>
            )}
          </>
        )}
      </div>

      {/* What they wrote. */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (verdict) next();
          else check();
        }}
        style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "18px 0 0", alignItems: "center" }}
      >
        <label htmlFor="spell" style={{ ...label, margin: 0 }}>
          Write it
        </label>
        <input
          id="spell"
          ref={box}
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          disabled={Boolean(verdict)}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          style={{
            flex: "1 1 220px",
            minWidth: 0,
            fontFamily: serif,
            fontSize: 24,
            fontWeight: 600,
            padding: "10px 14px",
            border: `3px solid ${BRAND.line}`,
            borderRadius: 12,
            background: BRAND.white,
            color: BRAND.ink,
          }}
        />
        <button
          type="submit"
          disabled={!verdict && !typed.trim()}
          style={{
            fontFamily: "Poppins, system-ui, sans-serif",
            fontSize: 14,
            fontWeight: 800,
            padding: "12px 22px",
            minHeight: 48,
            borderRadius: 999,
            border: `2px solid ${BRAND.ink}`,
            background: !verdict && !typed.trim() ? BRAND.panel : BRAND.ink,
            color: !verdict && !typed.trim() ? BRAND.mid : BRAND.white,
            cursor: !verdict && !typed.trim() ? "not-allowed" : "pointer",
          }}
        >
          {verdict ? (at + 1 >= words.length ? "Now the sentence →" : "Next word →") : "Check it"}
        </button>
      </form>

      {/* What it says about the spelling, which is the part that matters. */}
      {verdict && (
        <Feedback verdict={verdict} w={w} typed={typed} patternName={patternName} />
      )}

      {!student && !verdict && (
        <p style={{ fontSize: 13, lineHeight: 1.6, color: BRAND.mid, margin: "16px 0 0", maxWidth: "62ch" }}>
          Say the word, use it in a sentence, say it again. The child repeats it, says the sounds,
          then writes. Spelling it out loud before writing it is not the same task and lets a child
          get it right by ear.
        </p>
      )}
    </div>
  );
}

function Feedback({
  verdict,
  w,
  typed,
  patternName,
}: {
  verdict: Verdict;
  w: SpellWord & { part: string };
  typed: string;
  patternName: string;
}) {
  const tone =
    verdict.kind === "right" ? BRAND.tealDark : verdict.kind === "lesson" ? BRAND.coralDark : BRAND.blueDark;

  return (
    <div
      role="status"
      style={{
        border: `1px solid ${BRAND.line}`,
        borderLeft: `5px solid ${tone}`,
        borderRadius: "4px 14px 14px 4px",
        padding: "14px 18px",
        margin: "16px 0 0",
      }}
    >
      {verdict.kind === "right" ? (
        <>
          <p style={{ ...label, margin: "0 0 6px", color: tone }}>That is it</p>
          <p style={{ fontSize: 15, lineHeight: 1.55, color: BRAND.mid, margin: 0 }}>
            <Marked word={w.word} span={w.span} size={18} color={tone} /> — the{" "}
            <b>{w.part}</b> is doing the work.
          </p>
        </>
      ) : (
        <>
          <p style={{ ...label, margin: "0 0 8px", color: tone }}>
            {verdict.kind === "lesson" ? `The ${w.part} is the part to look at` : `The ${w.part} is right`}
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.6, margin: "0 0 8px" }}>
            <span style={{ fontFamily: serif, fontSize: 22, color: BRAND.mid, textDecoration: "line-through" }}>
              {typed.trim()}
            </span>{" "}
            <span aria-hidden="true" style={{ color: BRAND.mid }}>→</span>{" "}
            <Marked word={w.word} span={w.span} size={22} color={tone} />
          </p>
          <p style={{ fontSize: 13.5, lineHeight: 1.6, color: BRAND.mid, margin: 0, maxWidth: "62ch" }}>
            {verdict.kind === "lesson" ? (
              <>
                The letters that went wrong are the ones this lesson teaches. Say the word again and
                stop on that sound: which spelling of it does <b>{patternName}</b> use?
              </>
            ) : (
              <>
                The <b>{w.part}</b> is spelled correctly — what slipped is somewhere else in the
                word. This one is not a gap in {patternName}; it is worth knowing which part it was.
              </>
            )}
          </p>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * The sentence
 * ------------------------------------------------------------------ */

/** Everything a sentence adds to a word: the capital, the spaces, the stop. */
function SentenceRound({
  sentence,
  student,
  say,
  supported,
  tally,
  again,
}: {
  sentence: Sentence;
  student: boolean;
  say: (t: string, rate?: number) => void;
  supported: boolean | null;
  tally: { right: number; lesson: number; elsewhere: number };
  again: () => void;
}) {
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);

  const target = sentence.text.trim();
  const attempt = typed.trim();

  // Three things a sentence tests that a word does not, reported apart
  // from each other because they are three different lessons.
  const capital = /^[A-Z]/.test(attempt);
  const stop = /[.!?]$/.test(attempt);
  const words = (() => {
    const strip = (s: string) => s.replace(/[^a-z']/gi, "").toLowerCase();
    const a = target.split(/\s+/);
    const b = attempt.split(/\s+/);
    const wrong: string[] = [];
    for (let i = 0; i < a.length; i++) {
      if (strip(b[i] ?? "") !== strip(a[i])) wrong.push(a[i].replace(/[.,!?;:"“”]/g, ""));
    }
    return wrong;
  })();

  return (
    <div>
      <p style={{ ...label, margin: "0 0 10px" }}>The sentence</p>

      <div
        style={{
          background: BRAND.paper,
          borderRadius: 16,
          padding: "22px 24px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        {student && !done ? (
          <>
            <p style={{ ...label, margin: 0 }}>Listen to the whole sentence, then write it</p>
            {supported === false ? (
              <p style={{ fontSize: 15, color: BRAND.mid, margin: 0, maxWidth: "46ch", lineHeight: 1.5 }}>
                This browser has no voice, so your teacher will read the sentence to you.
              </p>
            ) : (
              <SayButton big onClick={() => say(target, 0.8)}>
                Say the sentence
              </SayButton>
            )}
          </>
        ) : (
          <>
            <p style={{ fontFamily: serif, fontSize: 22, lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
              {target}
            </p>
            {supported !== false && <SayButton onClick={() => say(target, 0.8)}>Say it</SayButton>}
          </>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (attempt) setDone(true);
        }}
        style={{ margin: "18px 0 0" }}
      >
        <label htmlFor="sent" style={{ ...label, display: "block", margin: "0 0 8px" }}>
          Write the whole sentence
        </label>
        <textarea
          id="sent"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          disabled={done}
          rows={2}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          style={{
            width: "100%",
            fontFamily: serif,
            fontSize: 19,
            lineHeight: 1.6,
            padding: "12px 14px",
            border: `3px solid ${BRAND.line}`,
            borderRadius: 12,
            background: BRAND.white,
            color: BRAND.ink,
            resize: "vertical",
          }}
        />
        {!done && (
          <button
            type="submit"
            disabled={!attempt}
            style={{
              fontFamily: "Poppins, system-ui, sans-serif",
              fontSize: 14,
              fontWeight: 800,
              padding: "12px 22px",
              minHeight: 48,
              borderRadius: 999,
              border: `2px solid ${BRAND.ink}`,
              background: attempt ? BRAND.ink : BRAND.panel,
              color: attempt ? BRAND.white : BRAND.mid,
              cursor: attempt ? "pointer" : "not-allowed",
              marginTop: 12,
            }}
          >
            Check the sentence
          </button>
        )}
      </form>

      {done && (
        <div role="status" style={{ margin: "18px 0 0" }}>
          <p style={{ ...label, margin: "0 0 10px" }}>Check it yourself, three things at a time</p>
          {[
            ["Capital letter at the start", capital],
            ["Full stop, question mark or exclamation at the end", stop],
            [
              words.length === 0
                ? "Every word spelled right"
                : `These went wrong: ${words.join(", ")}`,
              words.length === 0,
            ],
          ].map(([text, ok], i) => (
            <p
              key={i}
              style={{
                fontSize: 15,
                lineHeight: 1.6,
                margin: "0 0 7px",
                color: ok ? BRAND.tealDark : BRAND.coralDark,
                fontWeight: 600,
              }}
            >
              <span aria-hidden="true">{ok ? "✓" : "✗"}</span>{" "}
              <span style={{ color: BRAND.ink, fontWeight: 500 }}>{text as string}</span>
            </p>
          ))}

          <div
            style={{
              background: BRAND.panel,
              borderRadius: 14,
              padding: "14px 18px",
              margin: "16px 0 0",
            }}
          >
            <p style={{ ...label, margin: "0 0 6px" }}>The whole round</p>
            <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0, color: BRAND.ink }}>
              {tally.right} spelled right. {tally.lesson} went wrong on the pattern itself —{" "}
              {tally.lesson === 0
                ? "none, so the lesson has landed."
                : "those are the ones to reteach."}{" "}
              {tally.elsewhere > 0 && (
                <>
                  {tally.elsewhere} went wrong somewhere else in the word, which is a different
                  problem and usually an earlier one.
                </>
              )}
            </p>
          </div>

          {!student && (
            <p style={{ fontSize: 12.5, color: BRAND.mid, margin: "12px 0 0", lineHeight: 1.55 }}>
              Sentence from {sentence.source}. Nothing on this page was saved.
            </p>
          )}

          <button
            type="button"
            onClick={again}
            style={{
              fontFamily: "Poppins, system-ui, sans-serif",
              fontSize: 13.5,
              fontWeight: 800,
              padding: "11px 20px",
              minHeight: 44,
              borderRadius: 999,
              border: `2px solid ${BRAND.ink}`,
              background: BRAND.white,
              color: BRAND.ink,
              cursor: "pointer",
              marginTop: 16,
            }}
          >
            Start again
          </button>
        </div>
      )}
    </div>
  );
}
