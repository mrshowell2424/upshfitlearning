/**
 * The morpheme table: curated, not derived.
 *
 * Every other reading tool here is built by mining the articles, and the
 * first attempt at this one did the same -- scan for words beginning "mis",
 * ending "ment", and so on. The output was actively harmful. It offered
 * "mississippi", "missouri" and "mission" as mis- words, "moment", "cement"
 * and "segment" as -ment words, "reading", "really" and "recipe" as re-
 * words, and "unless" as a -less word. A child taught that mission is
 * mis + sion has been taught something false, and taught it by a tool whose
 * whole promise is that word parts are reliable.
 *
 * So the analysis is written down and checked by a person, and the corpus is
 * used for the one thing it is actually good for: proving the word turns up
 * in something the class has read. A word ships only if it is in this table
 * AND it appears in an article. build-morphology.mjs reports both halves --
 * curated words that never appear, and morphemes left too thin to ship -- so
 * nothing is quietly dropped.
 *
 * Two rules decided what went in:
 *
 *   The base has to be a word a child already knows, standing on its own.
 *   That is why "permeable" is not here (there is no "perme") and neither is
 *   "numerous", "famous" or "contagious" -- defensible to an etymologist,
 *   useless to a nine-year-old trying the strategy on the next word.
 *
 *   The meaning has to survive the split. "Predict" really is "say before"
 *   and earns its place under the root dict; "pressure" is not "pre" plus
 *   anything a child can use.
 *
 * An entry is [word, base, means, note?]. The meaning is written out for
 * every word rather than generated from the morpheme, because generating it
 * does not work: one gloss per morpheme produced "to behavior wrongly",
 * "night too much, or above" and "below the side", all of which compile, read
 * fluently and are wrong. A tool whose claim is that the split is true cannot
 * also be guessing at what the split means.
 *
 * The note is for the two things that break the strategy: a spelling change
 * at the join, and a word whose meaning has drifted away from its parts --
 * "nearly" is not "in a near way", "valuable" is not "can be valued". Saying
 * so is the honest move; leaving it out teaches a rule that fails next week.
 */

/** Spelling changes at the seam, named so the page can say them out loud. */
const DROP_E = "the base loses its e";
const Y_TO_I = "the y turns into an i";

/** A word whose meaning has wandered off from its own parts. */
const DRIFT = "the parts are real, but the meaning has drifted -- worth noticing, not solving";

export const MORPHEMES = [
  {
    key: "un",
    form: "un-",
    kind: "prefix",
    means: "not, or the opposite of",
    words: [
      ["unbroken", "broken", "not broken"],
      ["unsteady", "steady", "not steady"],
      ["uncomfortable", "comfortable", "not comfortable"],
      ["unconscious", "conscious", "not awake"],
      ["unhappy", "happy", "not happy"],
      ["unsafe", "safe", "not safe"],
      ["unable", "able", "not able to"],
      ["unknown", "known", "not known"],
      ["unusual", "usual", "not usual"],
      ["unlike", "like", "not like"],
      ["unfair", "fair", "not fair"],
      ["unchanged", "changed", "not changed"],
      ["unfinished", "finished", "not finished"],
      ["unloaded", "loaded", "taken off again", "here un- undoes the loading rather than meaning not"],
      ["unhooks", "hooks", "undoes the hooking", "here un- undoes something rather than meaning not"],
    ],
  },
  {
    key: "re",
    form: "re-",
    kind: "prefix",
    means: "again, or back",
    words: [
      ["rebuild", "build", "build it again"],
      ["replay", "play", "play it again"],
      ["rejoin", "join", "join it again"],
      ["reform", "form", "form it again"],
      ["repay", "pay", "pay it back", "here re- means back, not again"],
    ],
  },
  {
    key: "dis",
    form: "dis-",
    kind: "prefix",
    means: "not, or the opposite of",
    words: [
      ["disappear", "appear", "the opposite of appear"],
      ["disappeared", "appeared", "stopped being there"],
      ["disappearing", "appearing", "going out of sight"],
      ["disagree", "agree", "the opposite of agree"],
      ["dislike", "like", "the opposite of like"],
      ["dishonest", "honest", "not honest"],
    ],
  },
  {
    key: "mis",
    form: "mis-",
    kind: "prefix",
    means: "wrongly, or badly",
    words: [
      ["misread", "read", "read it wrongly"],
      ["mislead", "lead", "lead someone the wrong way"],
      ["mistake", "take", "something taken wrongly"],
      ["mistakes", "takes", "things taken wrongly"],
      ["misbehavior", "behavior", "behaving badly"],
    ],
  },
  {
    key: "over",
    form: "over-",
    kind: "prefix",
    means: "too much, or above",
    words: [
      ["overload", "load", "load it too much"],
      ["overloaded", "loaded", "loaded too much"],
      ["overheated", "heated", "heated too much"],
      ["overflowed", "flowed", "flowed over the top"],
      ["overhead", "head", "above your head"],
      ["overlap", "lap", "lie partly on top of each other"],
      ["overlaps", "laps", "lies partly on top"],
      ["overcast", "cast", "covered over with cloud"],
      ["overnight", "night", "through the night", "here over- means through, not too much"],
    ],
  },
  {
    key: "under",
    form: "under-",
    kind: "prefix",
    means: "below, or not enough",
    words: [
      ["underground", "ground", "below the ground"],
      ["underwater", "water", "below the water"],
      ["underside", "side", "the side underneath"],
      ["undercount", "count", "count too few", "here it is the not-enough sense, not the below sense"],
      ["underneath", "neath", "below something", "neath is an old word for below -- this one is worth saying out loud, not solving"],
    ],
  },
  {
    key: "inter",
    form: "inter-",
    kind: "prefix",
    means: "between",
    words: [
      ["interstate", "state", "running between states"],
      ["interstates", "states", "roads running between states"],
      ["interaction", "action", "action between people or things"],
      ["international", "national", "between nations"],
      ["interrupting", "rupting", "breaking in between", "rupt is a root meaning break"],
    ],
  },
  {
    key: "trans",
    form: "trans-",
    kind: "prefix",
    means: "across",
    words: [
      ["transfers", "fers", "carries it across", "fer is a root meaning carry"],
      ["transportation", "portation", "carrying things across", "port is a root meaning carry"],
      ["translate", "late", "carry a meaning across into another language", "late here is from a root meaning carried"],
      ["translated", "lated", "carried a meaning into another language"],
      ["transmission", "mission", "sending across", "miss is a root meaning send"],
    ],
  },
  {
    key: "anti",
    form: "anti-",
    kind: "prefix",
    means: "against",
    words: [
      ["antibodies", "bodies", "what the body makes to fight an invader"],
      ["antibiotics", "biotics", "medicines that work against germs"],
      ["antibiotic", "biotic", "a medicine that works against living germs", "bio is a root meaning life"],
      ["antiseptic", "septic", "something that works against infection", "septic means infected"],
    ],
  },

  {
    key: "ful",
    form: "-ful",
    kind: "suffix",
    means: "full of",
    words: [
      ["useful", "use", "full of use"],
      ["powerful", "power", "full of power"],
      ["peaceful", "peace", "full of peace"],
      ["careful", "care", "full of care"],
      ["harmful", "harm", "full of harm"],
      ["beautiful", "beauty", "full of beauty", Y_TO_I],
      ["plentiful", "plenty", "full of plenty", Y_TO_I],
    ],
  },
  {
    key: "less",
    form: "-less",
    kind: "suffix",
    means: "without",
    words: [
      ["useless", "use", "without any use"],
      ["harmless", "harm", "without harm"],
      ["wingless", "wing", "without wings"],
      ["pointless", "point", "without a point"],
      ["jobless", "job", "without a job"],
    ],
  },
  {
    key: "ness",
    form: "-ness",
    kind: "suffix",
    means: "the state of being",
    words: [
      ["thickness", "thick", "how thick it is"],
      ["brightness", "bright", "how bright it is"],
      ["dryness", "dry", "how dry it is"],
      ["weakness", "weak", "being weak"],
      ["soreness", "sore", "being sore"],
      ["fairness", "fair", "being fair"],
      ["willingness", "willing", "being willing"],
      ["illness", "ill", "being ill"],
      ["wakefulness", "wakeful", "being wakeful", "two suffixes stacked: wake + ful + ness"],
    ],
  },
  {
    key: "ment",
    form: "-ment",
    kind: "suffix",
    means: "the result of, or the act of",
    words: [
      ["payment", "pay", "what is paid"],
      ["movement", "move", "the act of moving"],
      ["statement", "state", "something stated"],
      ["treatment", "treat", "the way something is treated"],
      ["shipment", "ship", "goods that are shipped"],
      ["agreement", "agree", "what people agree on"],
      ["assignment", "assign", "what is assigned"],
      ["settlement", "settle", "a place people settled"],
      ["government", "govern", "the people who govern"],
      ["development", "develop", "the act of developing"],
      ["equipment", "equip", "what you are equipped with"],
      ["amendment", "amend", "a change that amends something"],
      ["argument", "argue", "the act of arguing", DROP_E],
    ],
  },
  {
    key: "er",
    form: "-er",
    kind: "suffix",
    means: "a person or thing that does it",
    words: [
      ["reader", "read", "someone who reads"],
      ["readers", "read", "people who read"],
      ["teacher", "teach", "someone who teaches"],
      ["teachers", "teach", "people who teach"],
      ["farmer", "farm", "someone who farms"],
      ["farmers", "farm", "people who farm"],
      ["worker", "work", "someone who works"],
      ["workers", "work", "people who work"],
      ["climber", "climb", "someone who climbs"],
      ["writer", "write", "someone who writes", DROP_E],
      ["writers", "write", "people who write", DROP_E],
    ],
  },
  {
    key: "ly",
    form: "-ly",
    kind: "suffix",
    means: "in that way",
    words: [
      ["quickly", "quick", "in a quick way"],
      ["slowly", "slow", "in a slow way"],
      ["quietly", "quiet", "in a quiet way"],
      ["safely", "safe", "in a safe way"],
      ["carefully", "careful", "in a careful way", "two suffixes stacked: care + ful + ly"],
      ["gently", "gentle", "in a gentle way", DROP_E],
      ["easily", "easy", "in an easy way", Y_TO_I],
      ["finally", "final", "at last"],
      ["nearly", "near", "almost", DRIFT],
      ["really", "real", "truly", DRIFT],
    ],
  },
  {
    key: "able",
    form: "-able",
    kind: "suffix",
    means: "can be done",
    words: [
      ["treatable", "treat", "can be treated"],
      ["washable", "wash", "can be washed"],
      ["teachable", "teach", "can be taught"],
      ["traceable", "trace", "can be traced", "the e stays, to keep the c soft"],
      ["valuable", "value", "worth a lot", DRIFT],
      ["fashionable", "fashion", "in fashion", DRIFT],
    ],
  },
  {
    key: "tion",
    form: "-tion",
    kind: "suffix",
    means: "the act of, or the result of",
    words: [
      ["direction", "direct", "the way something is directed"],
      ["protection", "protect", "the act of protecting"],
      ["collection", "collect", "a group of things collected"],
      ["connection", "connect", "the place two things connect"],
      ["eruption", "erupt", "the act of erupting"],
      ["exception", "except", "something left out"],
      ["invitation", "invite", "the thing that invites you", DROP_E],
      ["decoration", "decorate", "something used to decorate", DROP_E],
      ["evaporation", "evaporate", "the act of evaporating", DROP_E],
    ],
  },

  {
    key: "dict",
    form: "dict",
    kind: "root",
    means: "say",
    words: [
      ["predict", "pre + dict", "to say it before it happens", "pre means before"],
      ["predicted", "pre + dict + ed", "said it before it happened"],
      ["prediction", "pre + dict + ion", "the thing that was said beforehand"],
      ["contradict", "contra + dict", "to say the opposite", "contra means against"],
      ["dictionary", "dict + ionary", "the book of what words say"],
    ],
  },
  {
    key: "graph",
    form: "graph",
    kind: "root",
    means: "write, or draw",
    words: [
      ["photograph", "photo + graph", "a picture drawn with light", "photo means light"],
      ["paragraph", "para + graph", "a piece of writing marked off from the rest"],
      ["telegraph", "tele + graph", "writing sent far", "tele means far"],
      ["graphic", "graph + ic", "to do with drawing or writing"],
      ["geography", "geo + graph + y", "writing down the earth", "geo means earth"],
      ["biography", "bio + graph + y", "the writing of a life", "bio means life"],
      ["graph", "graph", "a drawing that shows numbers", "the root standing on its own, with nothing added to it"],
    ],
  },
];
