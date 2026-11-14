/**
 * The EB frame, as the AI coach prompt states it.
 *
 * Every starter here is word for word out of scripts/reading-ai-writing-coach.json,
 * because the child reading the frame on the page and the coach talking them
 * through it have to be using the same eight phrases. A frame that says
 * "I believe" while the coach asks for "I think" is two frames.
 *
 * scripts/check-writing.mjs fails the build if a starter here stops appearing
 * in the coach prompt, which is the only way the two can be kept in step
 * without one of them being generated from the other -- and the coach prompt
 * is prose, not data, so it cannot be.
 */

export interface FrameStep {
  n: number;
  /** Which paragraph it belongs to. */
  part: "Intro" | "Body" | "Ending";
  name: string;
  /** The sentence starter, verbatim from the coach prompt. */
  starter: string;
  /** What the step is for, in words a teacher would use. */
  does: string;
}

export const FRAME: FrameStep[] = [
  {
    n: 1,
    part: "Intro",
    name: "Tag",
    starter: "The story is ______.",
    does: "Name the text. A claim about a text nobody has named is not an argument yet.",
  },
  {
    n: 2,
    part: "Intro",
    name: "What It Is About",
    starter: "It is about ______.",
    does: "One sentence of summary. This is where you find out whether they understood it at all.",
  },
  {
    n: 3,
    part: "Intro",
    name: "My Claim",
    starter: "I think ______.",
    does: "Answer the question. More than one answer is defensible, which is the point of the prompt.",
  },
  {
    n: 4,
    part: "Body",
    name: "My Reason",
    starter: "One reason is ______.",
    does: "Why the claim is true. Still the child's own words, not the text's.",
  },
  {
    n: 5,
    part: "Body",
    name: "In the Story",
    starter: "In the story, ______",
    does: "Walk the reader up to the quote. One of the two steps children skip.",
  },
  {
    n: 6,
    part: "Body",
    name: "My Evidence",
    starter: "For example, ______.",
    does: "The quote itself, word for word from the passage. Check it against the text.",
  },
  {
    n: 7,
    part: "Body",
    name: "Why It Matters",
    starter: "This shows ______.",
    does: "What the quote proves. The other step children skip, and a quote with nothing after it is not an argument.",
  },
  {
    n: 8,
    part: "Ending",
    name: "Wrap It Up",
    starter: "That is why ______.",
    does: "The claim again in new words.",
  },
];

/**
 * What the coach moves the student on to once the frame is finished. The
 * prompt template leaves {WRITING} for the caller to fill, and on the OG pack
 * pages it is filled from that pack's own writing task. There is no pack
 * here, so it is the frame's own next step: the same argument, written as
 * prose rather than as eight labelled parts.
 */
export const WRITING_TASK =
  "Write the whole thing again as one piece, in your own words, without the " +
  "labels — so it reads like something you would hand to a friend rather than " +
  "a form you filled in. Keep every part: the text named, what it is about, " +
  "the claim, the reason, the lead-in, the quote word for word, what it " +
  "shows, and the closing line.";
