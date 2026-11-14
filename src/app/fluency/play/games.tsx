"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * The four fluency games.
 *
 * All of it is one client component file because every one of these is
 * interactive and they share the same shell, the same palette and the same
 * student/teacher switch. Nothing here is stored: no attempt, no setting and
 * no recording leaves the tab it was made in, which is the right default for
 * a page a child sits in front of.
 */

const BRAND = {
  ink: "#111111",
  mid: "#444444",
  line: "#E9E9E9",
  panel: "#F2F2F2",
  paper: "#F7F6F4",
  white: "#FFFFFF",
  coral: "#FF6A5B",
  coralDark: "#C0432F",
  lavenderDark: "#6B2FB5",
  tealDark: "#00756C",
  blueDark: "#2F6FD0",
};

const label: React.CSSProperties = {
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: BRAND.mid,
};

const serif = 'var(--font-serif), Georgia, "Times New Roman", serif';

export interface Line {
  text: string;
  words: number;
  article: string;
  id: string;
}
export interface Voice {
  key: string;
  name: string;
  how: string;
  teaches: string;
}
export interface Mark {
  mark: string;
  name: string;
  how: string;
}

/** The line a child reads, at the size a child reads it. */
function ReadingLine({ text, student }: { text: string; student: boolean }) {
  return (
    <p
      style={{
        fontFamily: serif,
        fontSize: student ? 38 : 26,
        lineHeight: 1.35,
        fontWeight: 600,
        margin: "0 0 4px",
        textWrap: "balance",
      }}
    >
      {text}
    </p>
  );
}

function Button({
  onClick,
  children,
  tone = "solid",
  big,
}: {
  onClick: () => void;
  children: React.ReactNode;
  tone?: "solid" | "quiet";
  big?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: big ? 17 : 14,
        fontWeight: 800,
        padding: big ? "14px 26px" : "9px 18px",
        minHeight: 44,
        borderRadius: 999,
        cursor: "pointer",
        border: `2px solid ${BRAND.ink}`,
        background: tone === "solid" ? BRAND.ink : BRAND.white,
        color: tone === "solid" ? BRAND.white : BRAND.ink,
      }}
    >
      {children}
    </button>
  );
}

/** Shown to the teacher and hidden from the child: why the task is the task. */
function Why({ children, student }: { children: React.ReactNode; student: boolean }) {
  if (student) return null;
  return (
    <p
      style={{
        fontSize: 13,
        lineHeight: 1.55,
        color: BRAND.mid,
        borderLeft: `3px solid ${BRAND.line}`,
        paddingLeft: 12,
        margin: "14px 0 0",
      }}
    >
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Say It Like                                                      */
/* ------------------------------------------------------------------ */

export function SayItLike({
  lines,
  voices,
  student,
}: {
  lines: Line[];
  voices: Voice[];
  student: boolean;
}) {
  // Both start fixed rather than random, so the server and the first client
  // render agree. Everything after that is the child pressing a button.
  const [lineAt, setLineAt] = useState(0);
  const [voiceAt, setVoiceAt] = useState(0);
  const [done, setDone] = useState<string[]>([]);

  const line = lines[lineAt % lines.length];
  const voice = voices[voiceAt % voices.length];

  const spin = () => {
    let next = voiceAt;
    while (voices.length > 1 && next % voices.length === voiceAt % voices.length) {
      next = Math.floor(Math.random() * voices.length);
    }
    setVoiceAt(next);
    setDone((d) => (d.includes(voice.key) ? d : [...d, voice.key]));
  };

  if (!line) return <Empty />;

  return (
    <div>
      <p style={{ ...label, margin: "0 0 8px" }}>Read this line</p>
      <ReadingLine text={line.text} student={student} />
      {!student && (
        <p style={{ fontSize: 12, color: BRAND.mid, margin: "0 0 20px" }}>
          {line.article} · {line.words} words
        </p>
      )}

      <div
        style={{
          border: `2px solid ${BRAND.lavenderDark}`,
          borderRadius: 16,
          padding: student ? "28px 24px" : "20px 22px",
          margin: "18px 0 0",
          background: BRAND.white,
          textAlign: "center",
        }}
      >
        <p style={{ ...label, margin: "0 0 6px", color: BRAND.lavenderDark }}>Say it like</p>
        <p
          style={{
            fontFamily: "Poppins, Inter, sans-serif",
            fontSize: student ? 42 : 30,
            fontWeight: 900,
            letterSpacing: "-0.5px",
            margin: "0 0 8px",
            lineHeight: 1.1,
          }}
        >
          {voice.name}
        </p>
        <p style={{ fontSize: student ? 19 : 16, lineHeight: 1.5, margin: "0 0 18px", color: BRAND.mid }}>
          {voice.how}
        </p>
        <Button onClick={spin} big={student}>
          Spin a new voice
        </Button>
      </div>

      <Why student={student}>{voice.teaches}</Why>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "18px 0 0", alignItems: "center" }}>
        <Button
          tone="quiet"
          onClick={() => {
            setLineAt((n) => (n + 1) % lines.length);
            setDone([]);
          }}
        >
          Different line
        </Button>
        <span style={{ fontSize: 13, color: BRAND.mid }}>
          {done.length === 0
            ? "Read it once as yourself first."
            : `${done.length} ${done.length === 1 ? "voice" : "voices"} done on this line.`}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Beat Your Score                                                  */
/* ------------------------------------------------------------------ */

export interface Passage {
  title: string;
  words: number;
  text: string;
}

export function BeatYourScore({
  passage,
  accuracyFloor,
  student,
}: {
  passage: Passage | null;
  accuracyFloor: number;
  student: boolean;
}) {
  const [left, setLeft] = useState(60);
  const [running, setRunning] = useState(false);
  const [read, setRead] = useState("");
  const [errors, setErrors] = useState("");
  const [runs, setRuns] = useState<{ wcpm: number; accuracy: number }[]>([]);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    tick.current = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (tick.current) clearInterval(tick.current);
    };
  }, [running]);

  if (!passage) return <Empty />;

  const wordsRead = Math.max(0, parseInt(read || "0", 10) || 0);
  const errorCount = Math.max(0, parseInt(errors || "0", 10) || 0);
  const wcpm = Math.max(0, wordsRead - errorCount);
  const accuracy = wordsRead > 0 ? Math.round((wcpm / wordsRead) * 1000) / 10 : 0;
  const tooHard = wordsRead > 0 && accuracy < accuracyFloor;

  const save = () => {
    if (wordsRead <= 0 || runs.length >= 3) return;
    setRuns((r) => [...r, { wcpm, accuracy }]);
    setRead("");
    setErrors("");
    setLeft(60);
  };

  const best = Math.max(60, ...runs.map((r) => r.wcpm));

  return (
    <div>
      <p style={{ ...label, margin: "0 0 8px" }}>
        {runs.length < 3 ? `Read ${runs.length + 1} of 3` : "All three done"}
      </p>
      <div
        style={{
          border: `1px solid ${BRAND.line}`,
          borderRadius: 14,
          padding: "16px 18px",
          background: BRAND.paper,
          margin: "0 0 18px",
          maxHeight: student ? "none" : 260,
          overflow: "auto",
        }}
      >
        <p style={{ fontFamily: serif, fontSize: student ? 24 : 18, lineHeight: 1.65, margin: 0 }}>
          {passage.text}
        </p>
      </div>
      {!student && (
        <p style={{ fontSize: 12, color: BRAND.mid, margin: "-10px 0 18px" }}>
          {passage.title} · {passage.words} words
        </p>
      )}

      <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
        <span
          style={{
            fontFamily: "Poppins, Inter, sans-serif",
            fontSize: 46,
            fontWeight: 900,
            minWidth: 86,
            color: left === 0 ? BRAND.coralDark : BRAND.ink,
          }}
        >
          {left}
        </span>
        <Button onClick={() => setRunning((r) => !r)} big={student}>
          {running ? "Stop" : left === 60 ? "Start the minute" : "Keep going"}
        </Button>
        <Button
          tone="quiet"
          onClick={() => {
            setRunning(false);
            setLeft(60);
          }}
        >
          Reset
        </Button>
      </div>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", margin: "20px 0 0" }}>
        <Field label="Words read" value={read} onChange={setRead} />
        <Field label="Errors" value={errors} onChange={setErrors} />
        <div style={{ alignSelf: "flex-end" }}>
          <Button onClick={save}>{runs.length >= 3 ? "Three saved" : "Save this read"}</Button>
        </div>
      </div>

      {tooHard && (
        <p style={{ fontSize: 14, lineHeight: 1.55, margin: "16px 0 0", color: BRAND.coralDark }}>
          <b>{accuracy}% accurate.</b> Under {accuracyFloor}% the passage is too hard to practise
          speed on. Drop to the easier version of this article before reading it again.
        </p>
      )}

      {runs.length > 0 && (
        <div style={{ margin: "26px 0 0" }}>
          <p style={{ ...label, margin: "0 0 12px" }}>Your three reads</p>
          <div style={{ display: "flex", gap: 18, alignItems: "flex-end", height: 160 }}>
            {runs.map((r, i) => (
              <div key={i} style={{ textAlign: "center", flex: "0 0 86px" }}>
                <div
                  style={{
                    height: Math.round((r.wcpm / best) * 118),
                    background: i === runs.length - 1 ? BRAND.tealDark : BRAND.panel,
                    border: `2px solid ${i === runs.length - 1 ? BRAND.tealDark : BRAND.line}`,
                    borderRadius: "10px 10px 0 0",
                  }}
                />
                <p style={{ fontSize: 20, fontWeight: 900, margin: "8px 0 0" }}>{r.wcpm}</p>
                <p style={{ fontSize: 11, color: BRAND.mid, margin: 0 }}>
                  read {i + 1} · {r.accuracy}%
                </p>
              </div>
            ))}
          </div>
          {runs.length >= 2 && (
            <p style={{ fontSize: 15, lineHeight: 1.55, margin: "16px 0 0" }}>
              {runs[runs.length - 1].wcpm > runs[0].wcpm ? (
                <>
                  Up <b>{runs[runs.length - 1].wcpm - runs[0].wcpm}</b> words from the first read.
                </>
              ) : (
                <>Same words, same minute. The next read is the one that moves.</>
              )}
            </p>
          )}
        </div>
      )}

      <Why student={student}>
        Rereading one passage three times is the best-evidenced thing anybody has found for
        fluency. The rate climbs on the second and third read because the decoding is already
        done, which is the point -- and it carries to passages the child has never seen. Read
        the accuracy before the rate: speed bought by skipping words is not fluency.
      </Why>
    </div>
  );
}

function Field({
  label: text,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ ...label, display: "block", margin: "0 0 6px" }}>{text}</span>
      <input
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 20,
          fontWeight: 700,
          width: 120,
          minHeight: 44,
          padding: "8px 12px",
          borderRadius: 10,
          border: `1.5px solid ${BRAND.line}`,
        }}
      />
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Hear It First                                                    */
/* ------------------------------------------------------------------ */

export function HearItFirst({
  lines,
  student,
}: {
  lines: Line[];
  student: boolean;
}) {
  // It was handed a single fixed line, which meant a class heard the same
  // eleven words modelled every time they opened it.
  const [at, setAt] = useState(0);
  const line = lines[at % Math.max(lines.length, 1)] ?? null;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [pick, setPick] = useState(0);
  const [rate, setRate] = useState(0.9);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    setSupported(true);

    // Chrome populates the list asynchronously and returns [] on the first
    // call, so the event matters as much as the call.
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
  }, []);

  if (!line) return <Empty />;

  const speak = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(line.text);
    if (voices[pick]) u.voice = voices[pick];
    u.rate = rate;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  const stop = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };

  return (
    <div>
      <p style={{ ...label, margin: "0 0 8px" }}>Listen, then read it the same way</p>
      <ReadingLine text={line.text} student={student} />
      {!student && line.article && (
        <p style={{ fontSize: 12, color: BRAND.mid, margin: "0 0 20px" }}>{line.article}</p>
      )}

      {supported === false ? (
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.6,
            margin: "18px 0 0",
            background: BRAND.panel,
            borderRadius: 12,
            padding: "14px 16px",
          }}
        >
          This browser will not read aloud. Everything else on this page still works — and a
          teacher reading the line twice is a better model than any of these voices.
        </p>
      ) : (
        <>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end", margin: "20px 0 0" }}>
            <Button onClick={speaking ? stop : speak} big={student}>
              {speaking ? "Stop" : "Read it to me"}
            </Button>

            {voices.length > 1 && (
              <label style={{ display: "block" }}>
                <span style={{ ...label, display: "block", margin: "0 0 6px" }}>Voice</span>
                <select
                  value={pick}
                  onChange={(e) => setPick(Number(e.target.value))}
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: 15,
                    minHeight: 44,
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: `1.5px solid ${BRAND.line}`,
                    maxWidth: 230,
                  }}
                >
                  {voices.map((v, i) => (
                    <option key={v.voiceURI} value={i}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label style={{ display: "block" }}>
              <span style={{ ...label, display: "block", margin: "0 0 6px" }}>
                Speed · {rate.toFixed(1)}×
              </span>
              <input
                type="range"
                min={0.5}
                max={1.3}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                style={{ width: 180, minHeight: 44 }}
              />
            </label>
          </div>

          {voices.length === 0 && supported && (
            <p style={{ fontSize: 13, color: BRAND.mid, margin: "12px 0 0" }}>
              No English voices found on this device yet. The button still works and will use
              whatever the browser picks.
            </p>
          )}
        </>
      )}

      <div style={{ margin: "18px 0 0" }}>
        <Button
          tone="quiet"
          onClick={() => {
            stop();
            setAt((n) => (n + 1) % Math.max(lines.length, 1));
          }}
        >
          Different line
        </Button>
      </div>

      <Why student={student}>
        Hearing it read well first is a model, not a crutch — the child is matching phrasing they
        have just heard rather than inventing it. Keep the speed slow at first: the point is where
        the phrases break, not how fast the sentence goes past. These voices come from the device,
        so the list is different on an iPad than on a Chromebook, and none of them is as good as
        you reading it.
      </Why>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Punctuation Power                                                */
/* ------------------------------------------------------------------ */

export function PunctuationPower({
  stems,
  marks,
  student,
}: {
  stems: Line[];
  marks: Mark[];
  student: boolean;
}) {
  const [at, setAt] = useState(0);
  const stem = stems[at % stems.length];

  const body = useMemo(() => stem?.text.replace(/[.!?]+$/, "") ?? "", [stem]);

  if (!stem) return <Empty />;

  return (
    <div>
      <p style={{ ...label, margin: "0 0 8px" }}>Same words, three ways</p>

      {/* Three endings, so three columns where they fit. auto-fit at 240px
          settled on two and stranded the third beside an empty cell. */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
          gap: 14,
        }}
      >
        {marks.map((m) => (
          <div
            key={m.mark}
            style={{
              border: `1px solid ${BRAND.line}`,
              borderTop: `3px solid ${BRAND.blueDark}`,
              borderRadius: "3px 3px 14px 14px",
              padding: "16px 18px",
            }}
          >
            <p style={{ ...label, margin: "0 0 8px", color: BRAND.blueDark }}>{m.name}</p>
            <p
              style={{
                fontFamily: serif,
                fontSize: student ? 26 : 21,
                fontWeight: 600,
                lineHeight: 1.35,
                margin: "0 0 10px",
              }}
            >
              {body}
              <b style={{ color: BRAND.coralDark }}>{m.mark}</b>
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.5, color: BRAND.mid, margin: 0 }}>{m.how}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "18px 0 0", alignItems: "center" }}>
        <Button tone="quiet" onClick={() => setAt((n) => (n + 1) % stems.length)}>
          Different sentence
        </Button>
        {!student && (
          <span style={{ fontSize: 12, color: BRAND.mid }}>{stem.article}</span>
        )}
      </div>

      <Why student={student}>
        The words do not change and the meaning does, which is the fastest way to make intonation
        audible to a child who has been reading everything on one note. Ask which one sounded most
        like a real person, and why — the answer is usually that the voice went somewhere.
      </Why>
    </div>
  );
}

function Empty() {
  return (
    <p style={{ fontSize: 15, color: BRAND.mid, margin: 0 }}>
      Nothing in this grade yet. Try another grade.
    </p>
  );
}
