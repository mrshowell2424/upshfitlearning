/**
 * One generator per kind of maths, not one per standard.
 *
 * 130 of the hub's 305 standards are arithmetic whose items can be written
 * by rule, and writing 130 generators for them would be writing the same
 * dozen twelve times over. These are the dozen, parameterised; MAP in
 * build-math-practice.mjs says which standard uses which with what numbers.
 *
 * Every item carries `chk`, an expression in numbers and operators only.
 * The checker evaluates that and compares it with the answer, so an answer
 * is never trusted because the code that wrote the question also wrote it.
 */
import { int, pick, rat, ratAdd, ratMul, ratStr, ratSub } from "./math-items.mjs";

const NAMES = ["Maya", "Jay", "Ava", "Leo", "Zoe", "Sam", "Nia", "Eli", "Ruth", "Omar", "Ivy", "Theo"];
const THINGS = ["stickers", "marbles", "books", "apples", "shells", "pencils", "cards", "beads"];

/** n as a fraction word, for prompts a child reads aloud. */
const frac = (n, d) => `${n}/${d}`;

export const GEN = {
  /** Counting on, and counting by tens. K.CC. */
  count: {
    c: (r, p) => {
      const by = pick(r, p.by || [1]);
      const start = by * int(r, 1, Math.floor((p.max || 100) / by) - 4);
      const seq = [start, start + by, start + 2 * by];
      return { q: `Count by ${by === 1 ? "ones" : by + "s"}: ${seq.join(", ")}, ___`, a: String(start + 3 * by), chk: `${start}+${3 * by}` };
    },
    w: (r, p) => {
      const n = int(r, 5, (p.max || 100) - 2);
      const who = pick(r, NAMES);
      return { q: `${who} counted ${n} ${pick(r, THINGS)}. Then ${who} counted one more. How many now?`, a: String(n + 1), chk: `${n}+1` };
    },
  },

  /** Which is more. K.CC.6-7, 1.NBT.3, 2.NBT.4, 4.NBT.2. */
  compare: {
    c: (r, p) => {
      const a = int(r, p.min || 1, p.max);
      let b = int(r, p.min || 1, p.max);
      if (b === a) b = a + 1 > p.max ? a - 1 : a + 1;
      return { q: `Write <, > or =:  ${a} ___ ${b}`, a: a > b ? ">" : a < b ? "<" : "=", chk: null, cmp: [a, b] };
    },
    w: (r, p) => {
      const a = int(r, p.min || 1, p.max);
      const b = int(r, p.min || 1, p.max - 1);
      const [x, y] = [pick(r, NAMES), pick(r, NAMES)];
      const thing = pick(r, THINGS);
      return { q: `${x} has ${a} ${thing}. ${y} has ${b} ${thing}. Who has more?`, a: a > b ? x : a < b ? y : "the same", chk: null, cmp: [a, b] };
    },
  },

  /** Adding and subtracting whole numbers, at whatever size. */
  addSub: {
    c: (r, p) => {
      const op = p.op || pick(r, ["+", "-"]);
      let a = int(r, p.min || 1, p.max);
      let b = int(r, p.min || 1, p.max);
      if (op === "-" && b > a) [a, b] = [b, a];
      if (op === "+" && a + b > (p.sumMax || Infinity)) b = (p.sumMax || p.max) - a;
      const v = op === "+" ? a + b : a - b;
      return { q: `${a} ${op} ${b} = ___`, a: String(v), chk: `${a}${op}${b}` };
    },
    w: (r, p) => {
      const op = p.op || pick(r, ["+", "-"]);
      // The ceiling the computations respect applies here too: a lesson
      // "within 20" was handing out 13 + 9 in its word problems.
      const cap = p.sumMax || p.max;
      let a = int(r, Math.max(2, p.min || 2), op === "+" ? Math.max(2, cap - 1) : p.max);
      let b = int(r, 1, Math.max(1, op === "+" ? cap - a : Math.floor(p.max / 2)));
      if (op === "-" && b > a) [a, b] = [b, a];
      const who = pick(r, NAMES);
      const thing = pick(r, THINGS);
      const q = op === "+"
        ? `${who} had ${a} ${thing} and found ${b} more. How many ${thing} now?`
        : `${who} had ${a} ${thing} and gave away ${b}. How many ${thing} are left?`;
      return { q, a: String(op === "+" ? a + b : a - b), chk: `${a}${op}${b}` };
    },
  },

  /** Place value: what a digit is worth. */
  place: {
    c: (r, p) => {
      const digits = p.digits || 3;
      const n = int(r, 10 ** (digits - 1), 10 ** digits - 1);
      const at = int(r, 0, digits - 1);
      const digit = Number(String(n)[at]);
      const value = digit * 10 ** (digits - 1 - at);
      const names = ["ones", "tens", "hundreds", "thousands", "ten thousands", "hundred thousands"];
      return { q: `In ${n}, what is the ${names[digits - 1 - at]} digit worth?`, a: String(value), chk: `${digit}*${10 ** (digits - 1 - at)}` };
    },
    w: (r, p) => {
      const digits = p.digits || 3;
      const n = int(r, 10 ** (digits - 1), 10 ** digits - 1);
      return { q: `Write ${n} in expanded form, then add the parts back together. What do you get?`, a: String(n), chk: String(n) };
    },
  },

  /** Rounding. 3.NBT.1, 4.NBT.3, 5.NBT.4. */
  round: {
    c: (r, p) => {
      const place = p.place || 10;
      const n = int(r, place * 2, place * 90);
      const v = Math.round(n / place) * place;
      return { q: `Round ${n} to the nearest ${place === 10 ? "ten" : place === 100 ? "hundred" : place}.`, a: String(v), chk: String(v) };
    },
    w: (r, p) => {
      const place = p.place || 10;
      const n = int(r, place * 2, place * 90);
      const v = Math.round(n / place) * place;
      return { q: `${pick(r, NAMES)} counted ${n} ${pick(r, THINGS)}. About how many is that, to the nearest ${place === 10 ? "ten" : "hundred"}?`, a: String(v), chk: String(v) };
    },
  },

  /** Times tables and sharing. 3.OA, 4.OA. */
  multDiv: {
    c: (r, p) => {
      const a = int(r, p.min || 2, p.max || 10);
      const b = int(r, p.min || 2, p.max || 10);
      if ((p.op || "*") === "/") return { q: `${a * b} ÷ ${a} = ___`, a: String(b), chk: `${a * b}/${a}` };
      return { q: `${a} × ${b} = ___`, a: String(a * b), chk: `${a}*${b}` };
    },
    w: (r, p) => {
      const a = int(r, p.min || 2, p.max || 10);
      const b = int(r, p.min || 2, p.max || 10);
      const who = pick(r, NAMES);
      const thing = pick(r, THINGS);
      if ((p.op || "*") === "/") {
        return { q: `${who} shared ${a * b} ${thing} equally among ${a} friends. How many did each get?`, a: String(b), chk: `${a * b}/${a}` };
      }
      return { q: `${who} packed ${a} boxes with ${b} ${thing} in each. How many ${thing} altogether?`, a: String(a * b), chk: `${a}*${b}` };
    },
  },

  /** Multi-digit multiplication and division. 4.NBT.5-6, 5.NBT.5-6. */
  bigMultDiv: {
    c: (r, p) => {
      const a = int(r, 10 ** (p.aDigits - 1), 10 ** p.aDigits - 1);
      const b = int(r, 10 ** ((p.bDigits || 1) - 1) || 2, 10 ** (p.bDigits || 1) - 1);
      if (p.op === "/") return { q: `${a * b} ÷ ${b} = ___`, a: String(a), chk: `${a * b}/${b}` };
      return { q: `${a} × ${b} = ___`, a: String(a * b), chk: `${a}*${b}` };
    },
    w: (r, p) => {
      const a = int(r, 10 ** (p.aDigits - 1), 10 ** p.aDigits - 1);
      const b = int(r, 2, 9);
      if (p.op === "/") return { q: `${a * b} ${pick(r, THINGS)} are shared equally into ${b} groups. How many in each group?`, a: String(a), chk: `${a * b}/${b}` };
      return { q: `A box holds ${a} ${pick(r, THINGS)}. How many are in ${b} boxes?`, a: String(a * b), chk: `${a}*${b}` };
    },
  },

  /** Fractions. 3.NF, 4.NF, 5.NF. */
  fraction: {
    c: (r, p) => {
      const d = pick(r, p.denoms || [2, 3, 4, 6, 8]);
      const a = rat(int(r, 1, d - 1), d);
      if (p.kind === "addLike") {
        const b = rat(int(r, 1, d - 1), d);
        const v = ratAdd(a, b);
        return { q: `${frac(a.n, a.d)} + ${frac(b.n, b.d)} = ___`, a: ratStr(v), chk: `${a.n}/${a.d}+${b.n}/${b.d}` };
      }
      if (p.kind === "addUnlike") {
        const d2 = pick(r, (p.denoms || [2, 3, 4, 6, 8]).filter((x) => x !== d)) || d + 1;
        const b = rat(int(r, 1, d2 - 1), d2);
        const v = ratAdd(a, b);
        return { q: `${frac(a.n, a.d)} + ${frac(b.n, b.d)} = ___`, a: ratStr(v), chk: `${a.n}/${a.d}+${b.n}/${b.d}` };
      }
      if (p.kind === "mulWhole") {
        const w = int(r, 2, 6);
        const v = ratMul(a, rat(w));
        return { q: `${w} × ${frac(a.n, a.d)} = ___`, a: ratStr(v), chk: `${w}*${a.n}/${a.d}` };
      }
      if (p.kind === "mul") {
        const b = rat(int(r, 1, d - 1), pick(r, p.denoms || [2, 3, 4]));
        const v = ratMul(a, b);
        return { q: `${frac(a.n, a.d)} × ${frac(b.n, b.d)} = ___`, a: ratStr(v), chk: `${a.n}/${a.d}*${b.n}/${b.d}` };
      }
      if (p.kind === "sub") {
        const b = rat(int(r, 1, Math.max(1, a.n * (d / a.d) - 1) || 1), d);
        const v = ratSub(a, b);
        return { q: `${frac(a.n, a.d)} − ${frac(b.n, b.d)} = ___`, a: ratStr(v), chk: `${a.n}/${a.d}-${b.n}/${b.d}` };
      }
      // naming a fraction of a whole
      const n = int(r, 1, d - 1);
      return { q: `A shape is cut into ${d} equal parts. ${n} ${n === 1 ? "part is" : "parts are"} shaded. What fraction is shaded?`, a: ratStr(rat(n, d)), chk: `${n}/${d}` };
    },
    w: (r, p) => {
      const d = pick(r, p.denoms || [2, 3, 4, 6, 8]);
      const n = int(r, 1, d - 1);
      const whole = d * int(r, 2, 6);
      const v = (whole / d) * n;
      // One person. Two picks of NAMES put a different child in the
      // question and in the answer: "Ivy had 9 stickers and used 1/3 of
      // them. How many did Ruth use?"
      const who = pick(r, NAMES);
      return { q: `${who} had ${whole} ${pick(r, THINGS)} and used ${frac(n, d)} of them. How many did ${who} use?`, a: String(v), chk: `${whole}*${n}/${d}` };
    },
  },

  /** Decimals. 5.NBT.7, 6.NS.3. */
  decimal: {
    c: (r, p) => {
      const places = p.places || 2;
      const f = 10 ** places;
      const a = int(r, 1, 99) / f * (p.whole ? 100 : 1);
      const b = int(r, 1, 99) / f * (p.whole ? 100 : 1);
      const op = p.op || pick(r, ["+", "-"]);
      const [x, y] = op === "-" && b > a ? [b, a] : [a, b];
      const v = op === "+" ? x + y : x - y;
      const fx = (z) => z.toFixed(places);
      return { q: `${fx(x)} ${op} ${fx(y)} = ___`, a: fx(v), chk: `${fx(x)}${op}${fx(y)}` };
    },
    w: (r) => {
      const price = (int(r, 150, 950) / 100).toFixed(2);
      const n = int(r, 2, 6);
      const v = (price * n).toFixed(2);
      return { q: `One ${pick(r, ["notebook", "pen", "ruler", "folder"])} costs $${price}. How much do ${n} cost?`, a: v, chk: `${price}*${n}` };
    },
  },

  /** Positive and negative. 6.NS, 7.NS. */
  integer: {
    c: (r, p) => {
      const a = int(r, -(p.max || 20), p.max || 20);
      const b = int(r, -(p.max || 20), p.max || 20);
      if (p.op === "*") return { q: `(${a}) × (${b}) = ___`, a: String(a * b), chk: `(${a < 0 ? "-" + -a : a})*(${b < 0 ? "-" + -b : b})` };
      const v = a + b;
      return { q: `(${a}) + (${b}) = ___`, a: String(v), chk: `(${a < 0 ? "-" + -a : a})+(${b < 0 ? "-" + -b : b})` };
    },
    w: (r) => {
      const t = int(r, -15, -2);
      const rise = int(r, 3, 25);
      return { q: `The temperature was ${t}°C and rose ${rise} degrees. What is it now?`, a: String(t + rise), chk: `(-${-t})+${rise}` };
    },
  },

  /** Ratio, rate and percent. 6.RP, 7.RP. */
  ratio: {
    c: (r, p) => {
      if (p.kind === "percent") {
        const pct = pick(r, [10, 20, 25, 50, 75]);
        const whole = pick(r, [20, 40, 60, 80, 100, 120, 200]);
        return { q: `What is ${pct}% of ${whole}?`, a: String((whole * pct) / 100), chk: `${whole}*${pct}/100` };
      }
      if (p.kind === "unitRate") {
        const n = pick(r, [2, 3, 4, 5, 6]);
        const per = int(r, 2, 12);
        return { q: `${n * per} ${pick(r, THINGS)} cost the same for ${n} boxes. How many per box?`, a: String(per), chk: `${n * per}/${n}` };
      }
      const a = int(r, 2, 9);
      const b = int(r, 2, 9);
      const k = int(r, 2, 6);
      return { q: `${a} : ${b} = ${a * k} : ___`, a: String(b * k), chk: `${b}*${k}` };
    },
    w: (r) => {
      const pct = pick(r, [10, 20, 25, 50]);
      const price = pick(r, [20, 40, 60, 80]);
      return { q: `A $${price} ${pick(r, ["jacket", "bag", "game", "book"])} is ${pct}% off. How many dollars do you save?`, a: String((price * pct) / 100), chk: `${price}*${pct}/100` };
    },
  },

  /** Expressions and equations. 5.OA, 6.EE, 7.EE, 8.EE. */
  algebra: {
    c: (r, p) => {
      if (p.kind === "evaluate") {
        const a = int(r, 2, 9);
        const b = int(r, 2, 9);
        const c = int(r, 2, 9);
        return { q: `Work out ${a} × (${b} + ${c})`, a: String(a * (b + c)), chk: `${a}*(${b}+${c})` };
      }
      if (p.kind === "twoStep") {
        const m = int(r, 2, 9);
        const x = int(r, 2, 12);
        const b = int(r, 1, 20);
        return { q: `Solve: ${m}x + ${b} = ${m * x + b}`, a: `x = ${x}`, chk: `(${m * x + b}-${b})/${m}`, expect: String(x) };
      }
      if (p.kind === "exponent") {
        const base = int(r, 2, 6);
        const e = int(r, 2, 4);
        return { q: `${base}^${e} = ___`, a: String(base ** e), chk: `${base}^${e}` };
      }
      const x = int(r, 2, 15);
      const b = int(r, 2, 20);
      return { q: `Solve: x + ${b} = ${x + b}`, a: `x = ${x}`, chk: `${x + b}-${b}`, expect: String(x) };
    },
    w: (r, p) => {
      // The story follows the kind. An exponents standard was being given
      // a linear-equation word problem, because this generator had one
      // story whatever the questions above it were asking.
      if (p.kind === "exponent") {
        const base = int(r, 2, 5);
        const e = int(r, 2, 4);
        return { q: `One cell splits into ${base} every hour. After ${e} hours, how many cells are there?`, a: String(base ** e), chk: `${base}^${e}` };
      }
      if (p.kind === "evaluate") {
        const a = int(r, 2, 9);
        const b = int(r, 2, 9);
        const c = int(r, 2, 9);
        return { q: `${pick(r, NAMES)} buys ${a} packs. Each pack holds ${b} red and ${c} blue ${pick(r, THINGS)}. How many altogether?`, a: String(a * (b + c)), chk: `${a}*(${b}+${c})` };
      }
      if (p.kind === "oneStep") {
        const start = int(r, 5, 40);
        const add = int(r, 3, 30);
        return { q: `${pick(r, NAMES)} had some ${pick(r, THINGS)}, got ${add} more, and now has ${start + add}. How many at the start?`, a: String(start), chk: `${start + add}-${add}` };
      }
      const m = int(r, 2, 8);
      const x = int(r, 3, 12);
      const b = int(r, 5, 30);
      return { q: `A club charges $${b} to join and $${m} a week. After how many weeks has a member paid $${m * x + b}?`, a: String(x), chk: `(${m * x + b}-${b})/${m}` };
    },
  },
};
