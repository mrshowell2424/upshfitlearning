// @ts-nocheck
/**
 * Batch 19: grade 5 writing, speaking and language.
 *
 * Completes grade 5 ELA, and with it the whole ELA strand for grades 2 to 5.
 *
 * As with batch 18 there is no grade 5 deck, so these misconceptions are
 * authored rather than observed. The ones that recur most in grade 5 writing
 * are about the difference between doing a thing and doing it deliberately:
 * transitions dropped in because a list said to, sources summarized rather
 * than integrated, verb tense drifting mid-paragraph without anyone noticing.
 *
 * American spellings throughout.
 *
 *   bun run scripts/seed-standards-batch-19.ts
 */
import { seedStandardsBatch } from "./lib/seed-standards-batch";

const standardsData = [
  {
    code: "W.5.2",
    name: "Explain a topic with precise language",
    plain_reading:
      "Write informative/explanatory texts to examine a topic and convey ideas and information clearly, using precise language and domain-specific vocabulary.",
    learning_target: "I can use the exact subject word rather than a vague one.",
    skills: ["Informative Writing", "Precise Language", "Grouping Information"],
    science_tags: ["elaboration", "dual-coding"],
    match_keys: ["informative explanatory", "precise language", "domain-specific vocabulary", "formatting", "concluding section"],
  },
  {
    code: "W.5.4",
    name: "Writing that fits the job",
    plain_reading:
      "Produce clear and coherent writing in which the development and organization are appropriate to task, purpose, and audience.",
    learning_target: "I can shape a piece around who is reading it and why.",
    skills: ["Task and Purpose", "Audience", "Coherence"],
    science_tags: ["metacognition", "elaboration"],
    match_keys: ["clear and coherent", "development and organization", "task purpose audience", "appropriate"],
  },
  {
    code: "W.5.5",
    name: "Try it a different way",
    plain_reading:
      "With guidance and support from peers and adults, develop and strengthen writing by planning, revising, editing, rewriting, or trying a new approach.",
    learning_target: "I can rewrite a section instead of patching it.",
    skills: ["Revising", "Rewriting", "Trying a New Approach"],
    science_tags: ["metacognition", "collaborative"],
    match_keys: ["plan revise edit rewrite", "try a new approach", "peer and adult feedback", "strengthen writing"],
  },
  {
    code: "W.5.6",
    name: "Two pages in one sitting",
    plain_reading:
      "Use technology, including the Internet, to produce and publish writing as well as to interact and collaborate with others; demonstrate sufficient command of keyboarding skills to type a minimum of two pages in a single sitting.",
    learning_target: "I can type long enough that the keyboard stops limiting what I write.",
    skills: ["Keyboarding", "Digital Publishing", "Online Collaboration"],
    science_tags: ["spaced", "collaborative"],
    match_keys: ["technology including the Internet", "produce and publish", "interact and collaborate", "two pages in a single sitting"],
  },
  {
    code: "W.5.7",
    name: "Several sources, several aspects",
    plain_reading:
      "Conduct short research projects that use several sources to build knowledge through investigation of different aspects of a topic.",
    learning_target: "I can plan a project that covers more than one side of a topic.",
    skills: ["Research Projects", "Several Sources", "Aspects of a Topic"],
    science_tags: ["metacognition", "interleaving"],
    match_keys: ["short research projects", "several sources", "different aspects of a topic", "build knowledge"],
  },
  {
    code: "W.5.8",
    name: "Summarize or paraphrase, and say where it came from",
    plain_reading:
      "Recall relevant information from experiences or gather relevant information from print and digital sources; summarize or paraphrase information in notes and finished work, and provide a list of sources.",
    learning_target: "I can tell when to summarize and when to paraphrase, and credit both.",
    skills: ["Summarizing", "Paraphrasing", "Citing Sources"],
    science_tags: ["retrieval", "metacognition"],
    match_keys: ["summarize or paraphrase", "notes and finished work", "list of sources", "print and digital", "relevant"],
  },
  {
    code: "W.5.9",
    name: "Evidence for analysis and reflection",
    plain_reading:
      "Draw evidence from literary or informational texts to support analysis, reflection, and research.",
    learning_target: "I can choose evidence that carries the point I am making.",
    skills: ["Drawing Evidence", "Analysis", "Reflection"],
    science_tags: ["elaboration", "interleaving"],
    match_keys: ["draw evidence from texts", "support analysis reflection research", "literary informational", "quotation"],
  },
  {
    code: "W.5.10",
    name: "Long and short, planned differently",
    plain_reading:
      "Write routinely over extended time frames and shorter time frames for a range of discipline-specific tasks, purposes, and audiences.",
    learning_target: "I can budget my planning to the time I actually have.",
    skills: ["Writing Routinely", "Time Frames", "Discipline-Specific Tasks"],
    science_tags: ["metacognition", "spaced"],
    match_keys: ["extended and shorter time frames", "write routinely", "discipline-specific", "on-demand"],
  },
  {
    code: "SL.5.2",
    name: "Summarize what you listened to",
    plain_reading:
      "Summarize a written text read aloud or information presented in diverse media and formats, including visually, quantitatively, and orally.",
    learning_target: "I can summarize something I heard without retelling all of it.",
    skills: ["Listening Comprehension", "Summarizing", "Diverse Media"],
    science_tags: ["retrieval", "dual-coding"],
    match_keys: ["summarize a text read aloud", "diverse media and formats", "visually quantitatively orally"],
  },
  {
    code: "SL.5.3",
    name: "Which reason supports which claim",
    plain_reading:
      "Summarize the points a speaker makes and explain how each claim is supported by reasons and evidence.",
    learning_target: "I can match a speaker's evidence to the claim it is actually for.",
    skills: ["Summarizing a Speaker", "Claims and Support", "Critical Listening"],
    science_tags: ["metacognition", "collaborative"],
    match_keys: ["summarize the points a speaker makes", "each claim supported", "reasons and evidence", "listening"],
  },
  {
    code: "SL.5.5",
    name: "Media that develops the idea",
    plain_reading:
      "Include multimedia components and visual displays in presentations when appropriate to enhance the development of main ideas or themes.",
    learning_target: "I can add something that develops my point rather than decorating it.",
    skills: ["Multimedia", "Visual Displays", "Enhancing Main Ideas"],
    science_tags: ["dual-coding", "metacognition"],
    match_keys: ["multimedia components", "visual displays", "enhance the development", "main ideas or themes"],
  },
  {
    code: "SL.5.6",
    name: "Adapt speech to the room",
    plain_reading:
      "Adapt speech to a variety of contexts and tasks, using formal English when appropriate to task and situation.",
    learning_target: "I can shift how I speak depending on where I am.",
    skills: ["Adapting Speech", "Formal English", "Context"],
    science_tags: ["elaboration", "collaborative"],
    match_keys: ["adapt speech", "variety of contexts and tasks", "formal English", "situation"],
  },
  {
    code: "L.5.1",
    name: "Keep the tense steady",
    plain_reading:
      "Demonstrate command of the conventions of standard English grammar and usage, including verb tenses and correcting inappropriate shifts in verb tense.",
    learning_target: "I can notice when my writing slipped from past to present.",
    skills: ["Verb Tense", "Tense Consistency", "Conjunctions and Prepositions"],
    science_tags: ["metacognition", "spaced"],
    match_keys: ["verb tenses", "perfect verb tenses", "inappropriate shifts in verb tense", "conjunctions prepositions interjections"],
  },
  {
    code: "L.5.2",
    name: "Commas that do a job",
    plain_reading:
      "Demonstrate command of the conventions of standard English capitalization, punctuation, and spelling, including commas to set off introductory elements, yes and no, tag questions, and direct address.",
    learning_target: "I can say what each comma in my sentence is doing.",
    skills: ["Commas", "Titles", "Spelling"],
    science_tags: ["dual-coding", "spaced"],
    match_keys: ["commas in a series", "introductory elements", "direct address", "tag question", "titles of works"],
  },
  {
    code: "L.5.3",
    name: "Expand, combine, reduce",
    plain_reading:
      "Use knowledge of language and its conventions when writing, speaking, reading, or listening, expanding, combining, and reducing sentences for meaning, reader interest, and style.",
    learning_target: "I can join two short sentences or cut one long one, on purpose.",
    skills: ["Sentence Combining", "Reducing", "Style"],
    science_tags: ["elaboration", "dual-coding"],
    match_keys: ["expand combine reduce sentences", "meaning reader interest style", "varieties of English", "dialect"],
  },
  {
    code: "L.5.6",
    name: "Words that signal the logic",
    plain_reading:
      "Acquire and use accurately grade-appropriate general academic and domain-specific words and phrases, including those that signal contrast, addition, and other logical relationships.",
    learning_target: "I can use however and therefore to show how my ideas connect.",
    skills: ["Academic Vocabulary", "Logical Signals", "Domain-Specific Words"],
    science_tags: ["retrieval", "spaced"],
    match_keys: ["general academic and domain-specific", "signal contrast addition", "logical relationships", "however therefore"],
  },
];
