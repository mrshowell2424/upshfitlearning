// @ts-nocheck
/**
 * Batch 15: grade 4 reading — literature, informational and foundational.
 *
 * From the "Unpacking standards 4th" deck. Grade 4 is where the deck starts
 * asking students to judge rather than locate: whether the evidence is strong
 * enough, what a firsthand account cannot see, what a film version loses. The
 * misconceptions follow — assertion accepted as evidence, firsthand assumed
 * accurate, differences between book and film listed without effect.
 *
 * American spellings throughout.
 *
 *   bun run scripts/seed-standards-batch-15.ts
 */
import { seedStandardsBatch } from "./lib/seed-standards-batch";

const standardsData = [
  {
    code: "RL.4.4",
    name: "Words that point at a myth",
    plain_reading:
      "Determine the meaning of words and phrases as they are used in a text, including those that allude to significant characters found in mythology.",
    learning_target: "I can notice a reference to a story I might not know and find out what it means.",
    skills: ["Allusion", "Figurative Meaning", "Context"],
    science_tags: ["elaboration", "interleaving"],
    match_keys: ["allusion", "mythology", "figurative meaning", "context", "fourth grade vocabulary"],
  },
  {
    code: "RL.4.5",
    name: "Poems, plays and prose are built differently",
    plain_reading:
      "Explain major differences between poems, drama, and prose, and refer to the structural elements of each when writing or speaking about a text.",
    learning_target: "I can use the right structural words for each form.",
    skills: ["Genre Structure", "Structural Elements", "Genre Vocabulary"],
    science_tags: ["dual-coding", "retrieval"],
    match_keys: ["poems drama prose", "verse rhythm meter", "cast of characters", "stage directions", "structural elements"],
  },
  {
    code: "RL.4.6",
    name: "What the narrator can and cannot know",
    plain_reading:
      "Compare and contrast the point of view from which different stories are narrated, including the difference between first- and third-person narrations.",
    learning_target: "I can explain what the choice of narrator does to what I get to know.",
    skills: ["First and Third Person", "Narrative Effect", "Comparing Point of View"],
    science_tags: ["elaboration", "metacognition"],
    match_keys: ["first person third person", "point of view", "narration", "perspective", "compare and contrast"],
  },
  {
    code: "RL.4.7",
    name: "The book against the film",
    plain_reading:
      "Make connections between the text of a story or drama and a visual or oral presentation of the text.",
    learning_target: "I can say what a film version gained and what it lost, and why it matters.",
    skills: ["Text and Presentation", "Comparing Versions", "Analyzing Choices"],
    science_tags: ["dual-coding", "elaboration"],
    match_keys: ["visual or oral presentation", "connections between text and film", "version", "reflect descriptions"],
  },
  {
    code: "RL.4.9",
    name: "The same theme in two traditions",
    plain_reading:
      "Compare and contrast the treatment of similar themes and topics and patterns of events in stories, myths, and traditional literature from different cultures.",
    learning_target: "I can compare the underlying pattern rather than the surface details.",
    skills: ["Theme Across Cultures", "Patterns of Events", "Traditional Literature"],
    science_tags: ["dual-coding", "interleaving"],
    match_keys: ["similar themes and topics", "patterns of events", "myths traditional literature", "different cultures", "motif"],
  },
  {
    code: "RL.4.10",
    name: "Finishing is not understanding",
    plain_reading:
      "By the end of the year, read and comprehend literature in the grades 4-5 text complexity band proficiently, with scaffolding as needed at the high end.",
    learning_target: "I can check I understood rather than just reaching the last page.",
    skills: ["Comprehension", "Stamina", "Self-Checking"],
    science_tags: ["metacognition", "spaced"],
    match_keys: ["grades 4-5 complexity band", "proficiently", "scaffolding", "stamina", "retelling check"],
  },
  {
    code: "RI.4.1",
    name: "The sentence, not the paragraph",
    plain_reading:
      "Refer to details and examples in a text when explaining what the text says explicitly and when drawing inferences from the text.",
    learning_target: "I can point to the exact sentence that supports my point.",
    skills: ["Citing Evidence", "Inference", "Precision"],
    science_tags: ["metacognition", "elaboration"],
    match_keys: ["refer to details and examples", "explicitly", "inferences", "cite evidence", "fourth grade"],
  },
  {
    code: "RI.4.4",
    name: "Current, solution, contract",
    plain_reading:
      "Determine the meaning of general academic and domain-specific words or phrases in a text relevant to a grade 4 topic or subject area.",
    learning_target: "I can spot when a word I know is being used technically.",
    skills: ["Domain Vocabulary", "Academic Language", "Reference Materials"],
    science_tags: ["elaboration", "interleaving"],
    match_keys: ["general academic and domain-specific", "technical term", "context and text features", "reference materials"],
  },
  {
    code: "RI.4.6",
    name: "Firsthand is not automatically right",
    plain_reading:
      "Compare and contrast a firsthand and secondhand account of the same event or topic; describe the differences in focus and information provided.",
    learning_target: "I can say what each kind of account is good at and what it misses.",
    skills: ["Firsthand and Secondhand", "Focus", "Source Limits"],
    science_tags: ["elaboration", "metacognition"],
    match_keys: ["firsthand secondhand account", "differences in focus", "information provided", "perspective", "same event"],
  },
  {
    code: "RI.4.7",
    name: "What the graph does for the argument",
    plain_reading:
      "Interpret information presented visually, orally, or quantitatively and explain how the information contributes to an understanding of the text.",
    learning_target: "I can say what a chart means for the point the author is making.",
    skills: ["Interpreting Data", "Charts and Timelines", "Contribution to Meaning"],
    science_tags: ["dual-coding", "elaboration"],
    match_keys: ["visually orally quantitatively", "chart graph timeline diagram", "contributes to understanding", "interpret"],
  },
  {
    code: "RI.4.8",
    name: "Saying it is not proving it",
    plain_reading:
      "Explain how an author uses reasons and evidence to support particular points in a text.",
    learning_target: "I can tell the difference between a claim and the evidence for it.",
    skills: ["Claim and Evidence", "Evaluating Support", "Author's Reasoning"],
    science_tags: ["elaboration", "metacognition"],
    match_keys: ["reasons and evidence", "support particular points", "claim", "evaluate evidence", "assertion"],
  },
  {
    code: "RI.4.9",
    name: "Weave the sources, do not stack them",
    plain_reading:
      "Integrate information from two texts on the same topic in order to write or speak about the subject knowledgeably.",
    learning_target: "I can write one account from two sources rather than two summaries.",
    skills: ["Integration", "Synthesis", "Handling Conflict"],
    science_tags: ["dual-coding", "interleaving"],
    match_keys: ["integrate information from two texts", "knowledgeably", "synthesize", "sources conflict", "same topic"],
  },
  {
    code: "RI.4.10",
    name: "Chunk it rather than skim it",
    plain_reading:
      "By the end of year, read and comprehend informational texts in the grades 4-5 text complexity band proficiently, with scaffolding as needed at the high end.",
    learning_target: "I can break a dense text into sections and summarize as I go.",
    skills: ["Nonfiction Comprehension", "Chunking", "Sustained Attention"],
    science_tags: ["metacognition", "spaced"],
    match_keys: ["informational text", "grades 4-5 band", "dense paragraphs", "chunking", "summarize each section"],
  },
  {
    code: "RF.4.3.A",
    name: "Decode it and know what it means",
    plain_reading:
      "Use combined knowledge of all letter-sound correspondences, syllabication patterns, and morphology to read accurately unfamiliar multisyllabic words.",
    learning_target: "I can read a long word and then say what it means.",
    skills: ["Syllabication", "Morphology", "Meaning from Parts"],
    science_tags: ["elaboration", "interleaving"],
    match_keys: ["letter-sound correspondences", "syllabication patterns", "morphology", "multisyllabic words", "in and out of context"],
  },
  {
    code: "RF.4.4.A",
    name: "Purpose changes the reading",
    plain_reading: "Read grade-level text with purpose and understanding.",
    learning_target: "I can read the same page differently depending on why.",
    skills: ["Purpose", "Adjusting Approach", "Monitoring"],
    science_tags: ["metacognition", "interleaving"],
    match_keys: ["purpose and understanding", "adjust reading approach", "monitor comprehension", "fluency"],
  },
  {
    code: "RF.4.4.B",
    name: "Phrases, not words one at a time",
    plain_reading:
      "Read grade-level prose and poetry orally with accuracy, appropriate rate, and expression on successive readings.",
    learning_target: "I can group words into phrases so long sentences hold together.",
    skills: ["Phrasing", "Prosody", "Successive Readings"],
    science_tags: ["spaced", "collaborative"],
    match_keys: ["prose and poetry orally", "accuracy rate expression", "phrasing", "word-by-word reading", "prosody"],
  },
  {
    code: "RF.4.4.C",
    name: "Did the whole passage make sense",
    plain_reading:
      "Use context to confirm or self-correct word recognition and understanding, rereading as necessary.",
    learning_target: "I can check the paragraph made sense, not just the words in it.",
    skills: ["Self-Correction", "Passage-Level Monitoring", "Rereading"],
    science_tags: ["metacognition", "collaborative"],
    match_keys: ["use context to confirm", "self-correct", "reread as necessary", "monitor comprehension", "passage level"],
  },
];
