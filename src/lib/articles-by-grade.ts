import ARTICLE_INDEX from "@/../scripts/reading-articles-index.json";

/**
 * The articles for one grade, rebuilt from two small pieces.
 *
 * WHY. scripts/reading-articles.json is 2.9 MB. Four pages used to read all
 * of it inside the request to show one article, and on Cloudflare Workers
 * that cost more CPU than a request is allowed: /fluency, /fluency/play, the
 * fluency print sheet and the resources browser each returned 500 about half
 * the time, while every page that did not touch it stayed up.
 *
 * So an article is now assembled from the slim index, which every page
 * already imports and which holds the titles, grades, standards, Lexiles and
 * word counts, plus one per-grade file holding the paragraphs, questions and
 * teacher note. A request parses its own grade — between 24 and 246 KB —
 * and never sees the other twelve.
 *
 * The returned shape matches what those pages were already using, so the
 * pages did not have to be rewritten around a new data model.
 */

type Para = { label: string; text: string };
type Question = { n: number; kind: string; q: string; a: string };

type GradeFile = Record<
  string,
  { hi: Para[]; lo: Para[]; qs: Question[]; note: string; std: string }
>;

export type Version = { lexile: number; words: number; paras: Para[] };
export type Article = {
  id: string;
  grade: number;
  n: number;
  title: string;
  standard: string;
  /** The several lines of standard, spiral and Lexile prose under the title. */
  standard_text: string;
  higher: Version;
  lower: Version;
  questions: Question[];
  note: string;
};

/**
 * The static prefix is what lets the bundler split this into one chunk per
 * grade. A template with a variable in the middle still resolves at build
 * time; a fully dynamic path would not, and would pull every grade in.
 */
const loadGradeFile = (grade: number): Promise<GradeFile> =>
  import(`@/../scripts/articles-text/ar-g${grade}.json`).then((m) => m.default as never);

/** Every article for one grade, in the shape the pages expect. */
export async function articlesForGrade(grade: number): Promise<Article[]> {
  const meta = ARTICLE_INDEX.articles.filter((a) => a.grade === grade);
  if (!meta.length) return [];

  let text: GradeFile;
  try {
    text = await loadGradeFile(grade);
  } catch {
    // A grade with no text file is a build fault, not a request fault. The
    // page should show its pickers rather than fall over.
    return [];
  }

  return meta
    .map((a) => {
      const t = text[a.id];
      if (!t) return null;
      return {
        id: a.id,
        grade: a.grade,
        n: a.n,
        title: a.title,
        standard: a.standard,
        standard_text: t.std,
        higher: { lexile: a.hi.lexile, words: a.hi.words, paras: t.hi },
        lower: { lexile: a.lo.lexile, words: a.lo.words, paras: t.lo },
        questions: t.qs,
        note: t.note,
      };
    })
    .filter((a): a is Article => a !== null)
    .sort((x, y) => x.n - y.n);
}
