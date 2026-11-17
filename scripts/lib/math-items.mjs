/**
 * The parts a maths item is made of.
 *
 * Shared by the builder and the checker, but only the plumbing: a seeded
 * random number source, rational arithmetic, and the evaluator that turns
 * an item's check expression back into a number. The checker uses this to
 * re-derive every answer from scratch, which is the only way to know a
 * generated answer is right — reading the prompt would just be trusting
 * the same code twice.
 */

/** Deterministic random. The same build must produce the same sheet. */
export function rng(seed) {
  let a = 0;
  for (const ch of String(seed)) a = (a * 31 + ch.charCodeAt(0)) >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** An integer in [lo, hi]. */
export const int = (r, lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
/** One of the choices. */
export const pick = (r, xs) => xs[Math.floor(r() * xs.length)];

const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

/** A rational, kept exact so a third never becomes 0.333. */
export function rat(n, d = 1) {
  if (d === 0) throw new Error("a denominator of zero is not a number");
  const s = d < 0 ? -1 : 1;
  const g = gcd(n, d) || 1;
  return { n: (s * n) / g, d: (s * d) / g };
}
export const ratAdd = (a, b) => rat(a.n * b.d + b.n * a.d, a.d * b.d);
export const ratSub = (a, b) => rat(a.n * b.d - b.n * a.d, a.d * b.d);
export const ratMul = (a, b) => rat(a.n * b.n, a.d * b.d);
export const ratDiv = (a, b) => rat(a.n * b.d, a.d * b.n);
export const ratStr = (a) => (a.d === 1 ? String(a.n) : `${a.n}/${a.d}`);

/**
 * Works out a check expression.
 *
 * Deliberately not eval. These strings are written by the builder and read
 * by the checker, and a checker that runs arbitrary code from a data file
 * is not checking anything. Numbers, fractions, + - * / and brackets, and
 * nothing else gets past the tokeniser.
 */
export function evalCheck(src) {
  const tokens = String(src).match(/\d+\/\d+|\d+\.\d+|\d+|[()+\-*/^]/g);
  if (!tokens || tokens.join("") !== String(src).replace(/\s+/g, "")) {
    throw new Error(`cannot read the check expression: ${src}`);
  }
  let at = 0;
  const peek = () => tokens[at];
  const eat = (t) => { if (tokens[at] !== t) throw new Error(`expected ${t}`); at++; };

  function atom() {
    if (peek() === "(") { eat("("); const v = expr(); eat(")"); return v; }
    if (peek() === "-") { eat("-"); const v = atom(); return rat(-v.n, v.d); }
    const t = tokens[at++];
    if (/^\d+\/\d+$/.test(t)) { const [n, d] = t.split("/").map(Number); return rat(n, d); }
    if (/^\d+\.\d+$/.test(t)) {
      const places = t.split(".")[1].length;
      return rat(Math.round(Number(t) * 10 ** places), 10 ** places);
    }
    return rat(Number(t));
  }
  function power() {
    let v = atom();
    while (peek() === "^") { eat("^"); const e = atom(); v = rat(v.n ** e.n, v.d ** e.n); }
    return v;
  }
  function term() {
    let v = power();
    while (peek() === "*" || peek() === "/") {
      const op = tokens[at++];
      const rhs = power();
      v = op === "*" ? ratMul(v, rhs) : ratDiv(v, rhs);
    }
    return v;
  }
  function expr() {
    let v = term();
    while (peek() === "+" || peek() === "-") {
      const op = tokens[at++];
      const rhs = term();
      v = op === "+" ? ratAdd(v, rhs) : ratSub(v, rhs);
    }
    return v;
  }
  const out = expr();
  if (at !== tokens.length) throw new Error(`trailing junk in: ${src}`);
  return out;
}

/** Two answers agree if they are the same number, however they are written. */
export function sameAnswer(a, b) {
  const num = (x) => {
    const s = String(x).trim().replace(/[$,%]/g, "");
    if (/^-?\d+\/\d+$/.test(s)) { const [n, d] = s.split("/").map(Number); return rat(n, d); }
    if (/^-?\d+(\.\d+)?$/.test(s)) {
      const places = s.includes(".") ? s.split(".")[1].length : 0;
      return rat(Math.round(Number(s) * 10 ** places), 10 ** places);
    }
    return null;
  };
  const x = num(a);
  const y = num(b);
  if (!x || !y) return String(a).trim() === String(b).trim();
  return x.n === y.n && x.d === y.d;
}
