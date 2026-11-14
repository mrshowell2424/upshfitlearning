import { SignInGate } from "@/components/shared/SignInGate";
import MORPH from "@/../scripts/reading-morphology.json";

/**
 * The printable Word Parts sheet.
 *
 * The screen version gives the child the answer -- the split and the meaning
 * are both on the card, which is right when a teacher is working through it
 * with a group and useless as practice, because there is nothing left to do.
 * On paper it is the other way round: the part and its meaning are given,
 * the splitting and the meaning of each word are the work, and the sentence
 * is underneath so the child can check themselves against the text rather
 * than against the teacher.
 *
 * The last section is the one that matters. Recognising a part in a word
 * somebody handed you is easy; producing a new word with it is the thing
 * that shows it transferred.
 *
 * No Header or Footer: this route is the sheet.
 */

const MORPHEMES = MORPH.morphemes;

const INK = "#111111";
const SOFT = "#555555";
const RULE = "#9AA0A6";

type Search = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const gradeName = (g: number) =>
  g === 0 ? "K" : g === 1 ? "1st" : g === 2 ? "2nd" : g === 3 ? "3rd" : `${g}th`;

function NameLine() {
  return (
    <div style={{ display: "flex", gap: 22, fontSize: 12, color: SOFT, margin: "4px 0 14px" }}>
      <div style={{ flex: 2, borderBottom: `1px solid ${RULE}`, paddingBottom: 2 }}>Name</div>
      <div style={{ flex: 1, borderBottom: `1px solid ${RULE}`, paddingBottom: 2 }}>Date</div>
    </div>
  );
}

/** An empty box the child writes into. */
function Blank({ w = 150, h = 34 }: { w?: number | string; h?: number }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: typeof w === "number" ? w : w,
        height: h,
        borderBottom: `1.5px solid ${RULE}`,
        verticalAlign: "bottom",
      }}
    />
  );
}

export const metadata = {
  title: "Word Parts sheet",
  description:
    "The printable Word Parts worksheet: the part and its meaning are given, the splitting and the meanings are the work, and the article sentence is there to check against.",
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;

  const asked = one(sp.m);
  const morpheme = MORPHEMES.find((m) => m.key === asked) ?? MORPHEMES[0];

  const askedGrade = Number(one(sp.g));
  const grades = [...new Set(morpheme.words.map((w) => w.grade))];
  const grade = grades.includes(askedGrade) ? askedGrade : null;
  const words = (grade === null ? morpheme.words : morpheme.words.filter((w) => w.grade === grade))
    // Six fits a sheet with room to write. More than that and the boxes get
    // too small to put a pencil in, which defeats the object.
    .slice(0, 6);

  const bare = morpheme.form.replace(/-/g, "");

  const sheet: React.CSSProperties = {
    maxWidth: 760,
    margin: "0 auto",
    padding: "22px 26px 40px",
    background: "#FFFFFF",
    color: INK,
    fontFamily: "Inter, system-ui, sans-serif",
  };

  return (
    <SignInGate
      title="Word Parts"
      blurb="The printable worksheet: the part is given, the splitting is the work. Free — an account is all it takes."
    >
      <style>{`
        @page { margin: 14mm; }
        @media print {
          .noprint { display: none !important; }
          body { background: #fff !important; }
          a { text-decoration: none; color: inherit; }
        }
      `}</style>

      <div className="noprint" style={{ ...sheet, paddingBottom: 0 }}>
        <p style={{ fontSize: 13, color: SOFT, margin: 0 }}>
          This is the printable sheet. Press <b>Cmd/Ctrl + P</b>.{" "}
          <a href={`/morphology?m=${morpheme.key}`} style={{ color: "#2F6FD0" }}>
            Back to Word Parts
          </a>
        </p>
      </div>

      <div style={sheet}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: SOFT }}>
          {`WORD PARTS · ${morpheme.kind.toUpperCase()}`}
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-serif), Georgia, "Times New Roman", serif',
            fontSize: 34,
            fontWeight: 700,
            margin: "2px 0 2px",
          }}
        >
          {morpheme.form}
        </h1>
        <p style={{ fontSize: 16, margin: "0 0 2px" }}>
          means <b>{morpheme.means}</b>
        </p>
        <NameLine />

        <div
          style={{
            border: `1.5px solid ${INK}`,
            borderRadius: 8,
            padding: "9px 12px",
            fontSize: 12,
            lineHeight: 1.5,
            margin: "0 0 16px",
          }}
        >
          <b>For each word: </b>cover <b>{morpheme.form}</b> and write what is left. Read it. Is
          that a word you know? Then write what the whole word means. The sentence underneath is
          where you met it — use it to check.
        </div>

        {words.map((w) => (
          <div
            key={w.word}
            style={{
              borderTop: `1px solid ${RULE}`,
              padding: "12px 0 10px",
              breakInside: "avoid",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
              <span
                style={{
                  fontFamily: 'var(--font-serif), Georgia, serif',
                  fontSize: 22,
                  fontWeight: 700,
                  minWidth: 150,
                }}
              >
                {w.word}
              </span>
              <span style={{ fontSize: 12, color: SOFT }}>
                {morpheme.kind === "prefix" ? (
                  <>
                    {bare} + <Blank w={130} />
                  </>
                ) : morpheme.kind === "suffix" ? (
                  <>
                    <Blank w={130} /> + {bare}
                  </>
                ) : (
                  <Blank w={220} />
                )}
              </span>
            </div>

            <div style={{ fontSize: 13, margin: "8px 0 0" }}>
              so it means <Blank w="62%" />
            </div>

            <p
              style={{
                fontFamily: 'var(--font-serif), Georgia, serif',
                fontSize: 13.5,
                lineHeight: 1.5,
                color: SOFT,
                margin: "9px 0 0",
                paddingLeft: 11,
                borderLeft: `3px solid ${RULE}`,
              }}
            >
              {w.sentence}
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11 }}>
                {" "}
                — {w.article.title}, {w.gradeName}
              </span>
            </p>
          </div>
        ))}

        {/* The part that shows whether it transferred. */}
        <div style={{ borderTop: `2px solid ${INK}`, margin: "18px 0 0", paddingTop: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", margin: "0 0 2px" }}>
            NOW BUILD YOUR OWN
          </p>
          <p style={{ fontSize: 12.5, color: SOFT, margin: "0 0 12px", lineHeight: 1.5 }}>
            Two words of your own that use <b>{morpheme.form}</b>. Then one that looks like it uses{" "}
            {morpheme.form} but does not — and say how you know.
          </p>
          {[1, 2].map((n) => (
            <div key={n} style={{ fontSize: 13, margin: "0 0 14px" }}>
              {n}. <Blank w={180} /> means <Blank w="45%" />
            </div>
          ))}
          <div style={{ fontSize: 13 }}>
            3. <Blank w={180} /> is not really {morpheme.form}, because <Blank w="38%" />
          </div>
        </div>

        <p style={{ fontSize: 10.5, color: SOFT, margin: "18px 0 0" }}>
          Every word and every sentence on this sheet is from an article in the Upshift library
          {grade !== null ? `, ${gradeName(grade)}` : ""}.
        </p>
      </div>
    </SignInGate>
  );
}
