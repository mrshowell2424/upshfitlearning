"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The one-minute read: a timer, two numbers, and the arithmetic.
 *
 * A teacher doing this on paper is holding a stopwatch, a pencil and a child's
 * attention at the same time, and then doing a subtraction and a division
 * while the child waits. The timer and the arithmetic are the parts a machine
 * should hold, so this does those and nothing else: it never stores a read and
 * it never sends one anywhere.
 *
 * Accuracy is checked before rate on purpose. Under about 95 percent the
 * passage is too hard to practice fluency on however fast it was read, and a
 * teacher looking at a good WCPM will not notice that on their own.
 */
export function Scorer({
  totalWords,
  grade,
  accuracyFloor,
  norms,
}: {
  totalWords: number;
  grade: number;
  accuracyFloor: number;
  norms: { fall: number | null; winter: number | null; spring: number | null } | null;
}) {
  const [left, setLeft] = useState(60);
  const [running, setRunning] = useState(false);
  const [read, setRead] = useState("");
  const [errors, setErrors] = useState("");
  const [prosody, setProsody] = useState<number | null>(null);
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

  const wordsRead = Math.max(0, Math.min(Number(read) || 0, totalWords));
  const errorCount = Math.max(0, Math.min(Number(errors) || 0, wordsRead));
  const scored = read.trim() !== "";
  const wcpm = wordsRead - errorCount;
  const accuracy = wordsRead > 0 ? Math.round((wcpm / wordsRead) * 1000) / 10 : 0;
  const tooHard = scored && wordsRead > 0 && accuracy < accuracyFloor;

  const mono = { fontVariantNumeric: "tabular-nums" as const };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          flexWrap: "wrap",
          padding: "16px 18px",
          borderRadius: 16,
          background: left === 0 ? "#FFF0EC" : "#F7F6F4",
          border: "1px solid #E9E9E9",
        }}
      >
        <div
          style={{
            fontFamily: "Poppins, Inter, sans-serif",
            fontSize: 44,
            fontWeight: 900,
            letterSpacing: "-2px",
            lineHeight: 1,
            minWidth: 110,
            color: left === 0 ? "#C0432F" : "#111111",
            ...mono,
          }}
        >
          {`0:${String(left).padStart(2, "0")}`}
        </div>
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          disabled={left === 0}
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 14,
            fontWeight: 700,
            borderRadius: 100,
            padding: "10px 22px",
            cursor: left === 0 ? "not-allowed" : "pointer",
            border: "1.5px solid #111111",
            background: running ? "#FFFFFF" : "#111111",
            color: running ? "#111111" : "#FFFFFF",
            opacity: left === 0 ? 0.4 : 1,
          }}
        >
          {running ? "Pause" : left === 60 ? "Start the minute" : "Keep going"}
        </button>
        <button
          type="button"
          onClick={() => {
            setRunning(false);
            setLeft(60);
          }}
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 13,
            fontWeight: 700,
            borderRadius: 100,
            padding: "9px 18px",
            cursor: "pointer",
            border: "1.5px solid #111111",
            background: "#FFFFFF",
            color: "#111111",
          }}
        >
          Reset
        </button>
        {left === 0 && (
          <span style={{ fontSize: 14, fontWeight: 700, color: "#C0432F" }}>
            Time. Mark the last word read.
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", margin: "18px 0 0" }}>
        <label style={{ display: "block" }}>
          <span
            style={{
              display: "block",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#444444",
              marginBottom: 6,
            }}
          >
            Words read
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={totalWords}
            value={read}
            onChange={(e) => setRead(e.target.value)}
            placeholder="0"
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 20,
              fontWeight: 700,
              padding: "10px 14px",
              borderRadius: 12,
              border: "1.5px solid #E9E9E9",
              width: 130,
              ...mono,
            }}
          />
          <span style={{ display: "block", fontSize: 12, color: "#444444", marginTop: 4 }}>
            {`of ${totalWords} in the passage`}
          </span>
        </label>
        <label style={{ display: "block" }}>
          <span
            style={{
              display: "block",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#444444",
              marginBottom: 6,
            }}
          >
            Errors
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={errors}
            onChange={(e) => setErrors(e.target.value)}
            placeholder="0"
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 20,
              fontWeight: 700,
              padding: "10px 14px",
              borderRadius: 12,
              border: "1.5px solid #E9E9E9",
              width: 130,
              ...mono,
            }}
          />
          <span style={{ display: "block", fontSize: 12, color: "#444444", marginTop: 4 }}>
            misread, skipped, or stalled
          </span>
        </label>
      </div>

      {scored && (
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            margin: "20px 0 0",
          }}
        >
          <Stat label="WCPM" value={String(wcpm)} hint="words correct per minute" big />
          <Stat
            label="Accuracy"
            value={`${accuracy}%`}
            hint={tooHard ? `below ${accuracyFloor}%` : `at or above ${accuracyFloor}%`}
            tone={tooHard ? "warn" : "ok"}
          />
          {norms && norms.spring !== null && (
            <Stat
              label={`Grade ${grade} median`}
              value={`${norms.fall ?? "—"} · ${norms.winter ?? "—"} · ${norms.spring}`}
              hint="fall · winter · spring"
            />
          )}
        </div>
      )}

      {tooHard && (
        <p
          style={{
            margin: "14px 0 0",
            padding: "12px 16px",
            borderRadius: 14,
            background: "#FFF0EC",
            border: "1px solid #E9E9E9",
            fontSize: 15,
            lineHeight: 1.6,
          }}
        >
          <b style={{ color: "#C0432F" }}>Read the accuracy first. </b>
          Under {accuracyFloor} percent the passage is too hard to practice fluency on, whatever
          the rate came out as. Switch to the lower Lexile version of this article and read it
          again before working on speed.
        </p>
      )}

      <div style={{ margin: "22px 0 0" }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#444444",
            margin: "0 0 8px",
          }}
        >
          How it sounded
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[4, 3, 2, 1].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setProsody(prosody === n ? null : n)}
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 100,
                padding: "8px 16px",
                cursor: "pointer",
                border: "1.5px solid #111111",
                background: prosody === n ? "#111111" : "#FFFFFF",
                color: prosody === n ? "#FFFFFF" : "#111111",
              }}
            >
              {n}
            </button>
          ))}
          {prosody !== null && (
            <span style={{ alignSelf: "center", fontSize: 14, color: "#444444" }}>
              Noted. A rate can look fine while this stays at 1.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  big,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  big?: boolean;
  tone?: "ok" | "warn";
}) {
  const color = tone === "warn" ? "#C0432F" : tone === "ok" ? "#00756C" : "#111111";
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: `1px solid #E9E9E9`,
        borderTop: `4px solid ${color}`,
        borderRadius: 16,
        padding: "14px 18px",
        minWidth: 150,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#444444",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "Poppins, Inter, sans-serif",
          fontSize: big ? 40 : 28,
          fontWeight: 900,
          letterSpacing: "-1px",
          lineHeight: 1.1,
          color,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 12, color: "#444444" }}>{hint}</div>
    </div>
  );
}
