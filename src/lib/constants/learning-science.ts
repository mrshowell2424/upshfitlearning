/**
 * The principles every blueprint step is built on.
 *
 * Kept out of the page so the home page can count them rather than quote a
 * number at them. The stat strip used to claim "12+" while the library used
 * seven — the same overstatement as "150+ standards", and the same fix: read
 * the real figure from the thing being described.
 */
export interface Principle {
  tag: string;
  short: string;
  claim: string;
  what: string;
  classroom: string;
  mistake: string;
  color: string;
}

/**
 * Ordered by how heavily the library leans on each, so the page opens with the
 * ones a teacher will meet most often.
 */
export const PRINCIPLES: Principle[] = [
  {
    tag: "elaboration",
    short: "Asking why, not just what",
    claim: "Explaining how something works fixes it in memory far better than restating it.",
    what: "Elaboration means connecting new material to what a student already knows — asking why it is true, how it relates, what it resembles. The act of building those connections is what makes the material retrievable later, because each connection is another route back to it.",
    classroom:
      "Instead of \"what is a metaphor?\", ask \"why did the author choose a metaphor here rather than saying it plainly?\" The second question cannot be answered from memory alone.",
    mistake:
      "Treating discussion as elaboration. Talking about a topic is not the same as explaining how it works — the question has to demand a because.",
    color: "var(--color-coral)",
  },
  {
    tag: "dual-coding",
    short: "Words and pictures together",
    claim: "Two channels carry more than one, provided they say the same thing.",
    what: "Words and images are processed differently, so pairing them gives a student two routes to the same idea. A bar model beside a word problem, a timeline beside a paragraph, a ten-frame beside a number — the picture is not decoration, it is a second encoding.",
    classroom:
      "A fraction shown as a strip, a number line and a symbol at once. A student who loses one representation still has two.",
    mistake:
      "Decorative images. A picture that does not carry the idea adds load without adding a channel, and actively costs attention.",
    color: "var(--color-lavender)",
  },
  {
    tag: "retrieval",
    short: "Pulling it back out",
    claim: "Trying to remember strengthens memory more than reviewing does.",
    what: "Every time a student successfully pulls something from memory, the path back to it gets stronger. Rereading feels productive and does very little; struggling to recall — even briefly, even unsuccessfully — does a great deal.",
    classroom:
      "Start with three questions on last week's work before opening the new material. Answers closed, no warning, low stakes.",
    mistake:
      "Making it high stakes. Retrieval works because it is frequent and unthreatening; graded quizzes turn it into something students revise for rather than a way of learning.",
    color: "var(--color-teal)",
  },
  {
    tag: "spaced",
    short: "Coming back to it",
    claim: "The same practice spread over weeks beats the same practice massed in a day.",
    what: "Forgetting a little between encounters is what makes the next encounter useful. Practice packed into one lesson feels smoother and is forgotten faster; the same minutes spread across weeks produce durable learning, even though it feels harder at the time.",
    classroom:
      "Fluency drilled for four minutes every day beats forty minutes once. Revisit October's standard in November and again in February.",
    mistake:
      "Reading the difficulty as failure. Spaced practice feels worse and works better — the struggle on return is the mechanism, not a sign the first lesson failed.",
    color: "var(--color-blue)",
  },
  {
    tag: "interleaving",
    short: "Mixing problem types",
    claim: "Shuffled practice teaches students to choose a method, not just execute one.",
    what: "Blocked practice — twenty of the same problem — lets a student stop reading the question. Mixing types forces them to work out what kind of problem it is before solving it, which is the part that transfers to a test where nothing is labelled.",
    classroom:
      "After teaching area and perimeter separately, mix them and require the measure to be named before any calculation.",
    mistake:
      "Interleaving too early. Students need to be able to execute a method before being asked to choose between methods.",
    color: "var(--color-amber)",
  },
  {
    tag: "collaborative",
    short: "Learning out loud",
    claim: "Explaining to a peer forces gaps into the open.",
    what: "A student who can follow an explanation often cannot produce one. Made to explain, they discover the parts they had only recognised — and the listener hears it in language closer to their own than a teacher's.",
    classroom:
      "Turn and talk before writing, with a stem that requires building on what the partner said rather than starting fresh.",
    mistake:
      "Group work without individual accountability. If one student can carry the task, the others get the answer without doing the thinking.",
    color: "var(--color-pink)",
  },
  {
    tag: "metacognition",
    short: "Noticing your own thinking",
    claim: "Students who can judge what they know study the right things.",
    what: "Most students are poor at judging their own understanding, and fluency is the reason: material that feels familiar feels learned. Metacognition is the habit of checking that feeling against evidence — predicting a score, then seeing it.",
    classroom:
      "Before marking, ask students to predict how many they got right. The gap between prediction and result is the lesson.",
    mistake:
      "Asking students to reflect without giving them anything to check against. Reflection with no feedback just rehearses the original impression.",
    color: "#7C3AED",
  },
];
