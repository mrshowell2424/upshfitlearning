/**
 * Depth of Knowledge (Webb's) derived from a standard's verbs.
 *
 * A standard's DOK is set by the most demanding thinking it asks for, so we take
 * the highest level among its verbs rather than an average. This is a reading of
 * the verbs, not an official designation — if a standard ever carries an
 * authored DOK, prefer that over this.
 */
export type DokLevel = 1 | 2 | 3 | 4

const DOK_BY_VERB: Record<string, DokLevel> = {
  // 1 — recall and reproduce
  ask: 1,
  answer: 1,
  identify: 1,
  list: 1,
  name: 1,
  define: 1,
  label: 1,
  recall: 1,
  state: 1,
  recognize: 1,
  match: 1,

  // 2 — apply a skill or concept
  describe: 2,
  determine: 2,
  summarize: 2,
  explain: 2,
  clarify: 2,
  compare: 2,
  classify: 2,
  organize: 2,
  interpret: 2,
  estimate: 2,
  infer: 2,
  predict: 2,
  demonstrate: 2,
  unfolds: 2,

  // 3 — strategic thinking and reasoning
  analyze: 3,
  cite: 3,
  justify: 3,
  critique: 3,
  assess: 3,
  revise: 3,
  formulate: 3,
  hypothesize: 3,
  investigate: 3,
  differentiate: 3,
  'draw conclusions': 3,
  'choose flexibly': 3,

  // 4 — extended thinking across sources or time
  design: 4,
  synthesize: 4,
  create: 4,
  prove: 4,
  connect: 4,
  conduct: 4,
}

export const DOK_DESCRIPTIONS: Record<DokLevel, { name: string; blurb: string }> = {
  1: { name: 'Recall', blurb: 'Recall a fact, term or procedure.' },
  2: { name: 'Skill / Concept', blurb: 'Use information, and decide how to approach a problem.' },
  3: { name: 'Strategic Thinking', blurb: 'Reason, plan and justify with evidence.' },
  4: { name: 'Extended Thinking', blurb: 'Investigate and connect ideas across sources or time.' },
}

interface UnpackVerb {
  word?: string
}

/** The highest DOK among a standard's verbs, or undefined if none are known. */
export function dokFromVerbs(verbs?: UnpackVerb[] | null): DokLevel | undefined {
  if (!verbs?.length) return undefined

  let highest: DokLevel | undefined
  for (const verb of verbs) {
    const level = DOK_BY_VERB[verb?.word?.trim().toLowerCase() ?? '']
    if (level && (!highest || level > highest)) highest = level
  }
  return highest
}

/**
 * Kid-friendly definitions for the vocabulary the unpacks use, written to be
 * read aloud to students. A term with no entry simply renders without one.
 */
const KID_DEFINITIONS: Record<string, string> = {
  antonym: 'A word that means the opposite of another word, like hot and cold.',
  'central message': 'The big lesson or idea the author wants you to walk away with.',
  change: 'When someone or something becomes different than they were before.',
  character: 'A person, animal or creature in a story.',
  clues: 'Little hints in the text that help you figure something out.',
  context: 'The words and sentences around a word that help you know what it means.',
  episodes: 'The separate events that happen as a story goes along.',
  evidence: 'The exact words from the text that prove your answer is right.',
  'key details': 'The most important pieces of information in what you read.',
  'main idea': 'What the whole text is mostly about.',
  motivation: 'The reason a character does what they do.',
  'multiple meaning': 'A word that can mean more than one thing, like bat or bark.',
  plot: 'What happens in a story, from beginning to end.',
  questions: 'Things you ask to help you understand or find out more.',
  scene: 'One part of a story that happens in one place and time.',
  summary: 'A short retelling of only the most important parts.',
  'supporting details': 'The facts and examples that back up the main idea.',
  synonym: 'A word that means almost the same as another word, like big and large.',
  topic: 'The one thing a text is about, said in a word or two.',
  understanding: 'Really getting what something means, not just reading the words.',
  'word relationships': 'How words connect to each other — like opposites, or word families.',
}

export function kidDefinition(term?: string): string | undefined {
  if (!term) return undefined
  return KID_DEFINITIONS[term.trim().toLowerCase()]
}
