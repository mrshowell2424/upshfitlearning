// @ts-nocheck
import { db } from "@/lib/db";
import { standards, standard_unpacks, lesson_blueprints } from "@/lib/db/schema";

const standardsData = [
  {
    code: "RL.2.1",
    name: "Ask and answer questions about key details",
    plain_reading:
      "Ask and answer such questions as who, what, where, when, why, and how to demonstrate understanding of key details in a text.",
    learning_target: "I can ask and answer questions about who, what, where, when, why, and how in stories.",
    skills: ["Textual Evidence", "Comprehension", "Close Reading"],
    match_keys: ["questions", "key details", "who what where when why how", "demonstrate understanding"],
  },
  {
    code: "RI.4.2",
    name: "Determine main idea and supporting details",
    plain_reading:
      "Determine the main idea of a text and explain how it is supported by key details; summarize the text.",
    learning_target: "I can find the main idea of an informational text and explain how details support it.",
    skills: ["Main Idea", "Supporting Details", "Summarizing"],
    match_keys: ["main idea", "supporting details", "informational text", "summarize"],
  },
  {
    code: "L.5.4",
    name: "Determine word meanings and use context clues",
    plain_reading:
      "Determine or clarify the meaning of unknown and multiple-meaning words and phrases based on grade 5 reading and content, choosing flexibly from a range of strategies.",
    learning_target: "I can use context clues and strategies to figure out what unfamiliar words mean.",
    skills: ["Vocabulary", "Context Clues", "Word Relationships"],
    match_keys: ["vocabulary", "context clues", "unknown words", "meaning"],
  },
  {
    code: "RL.6.3",
    name: "Describe how characters change and respond",
    plain_reading:
      "Describe how a particular story's or drama's plot unfolds in a series of episodes and describe the characters as the plot moves forward.",
    learning_target: "I can explain how characters change throughout a story.",
    skills: ["Character Analysis", "Plot Development", "Inference"],
    match_keys: ["character", "plot", "changes", "episodes", "respond"],
  },
];

const unpacksData = [
  {
    standard_code: "RL.2.1",
    verbs: [
      { word: "Ask", gloss: "pose or formulate a question" },
      { word: "Answer", gloss: "provide a response to a question" },
      { word: "Demonstrate", gloss: "show evidence of understanding" },
    ],
    concepts: ["Key details", "Text comprehension", "Questioning strategies"],
    vocabulary: [
      { term: "key detail", definition: "an important piece of information in the story" },
      { term: "question", definition: "something you ask when you want to know more" },
      { term: "evidence", definition: "the part of the text that proves your answer" },
      { term: "retell", definition: "say what happened in your own words" },
    ],
    prior_skills: ["Identify characters", "Identify settings", "Retell stories"],
    prior_standards: [{ code: "RL.K.1", text: "Ask and answer questions about key details" }],
    future_standards: [
      { code: "RL.3.1", text: "Ask and answer questions to show understanding of a text" },
    ],
    challenges: [
      { problem: "Students ask trivial questions", fix: "Model asking about important details" },
      { problem: "Students struggle with 'why' questions", fix: "Provide sentence stems" },
    ],
    mastery_statement: "Student can ask and answer who, what, where, when, why, and how questions about key details.",
    ladder: [
      { name: "I can identify characters in a story", descriptor: "Names the main character" },
      { name: "I can ask simple questions about a story", descriptor: "Uses who, what, where" },
      {
        name: "I can ask who, what, where, when, why, and how questions",
        descriptor: "Uses all six question words",
      },
      { name: "I can answer using text details", descriptor: "Points to text evidence" },
    ],
  },
  {
    standard_code: "RI.4.2",
    verbs: [
      { word: "Determine", gloss: "figure out or establish with certainty" },
      { word: "Explain", gloss: "make clear by describing in detail" },
      { word: "Summarize", gloss: "give a brief statement of the main points" },
    ],
    concepts: ["Main idea", "Supporting details", "Text structure", "Summarization"],
    vocabulary: [
      { term: "main idea", definition: "what the whole text is mostly about" },
      { term: "topic", definition: "the one thing the text is about, in a word" },
      { term: "supporting detail", definition: "a fact that backs up the main idea" },
      { term: "summarize", definition: "say the important parts in fewer words" },
      { term: "relevant", definition: "actually related to the point" },
    ],
    prior_skills: ["Identify topics", "Identify facts", "Answer literal questions"],
    prior_standards: [{ code: "RI.3.2", text: "Determine the main idea and retell key details" }],
    future_standards: [
      { code: "RI.5.2", text: "Determine two or more main ideas and explain with details" },
    ],
    challenges: [
      { problem: "Confusing main idea with topic", fix: "Main idea = what the author says ABOUT the topic" },
      { problem: "Including too many details in summary", fix: "Only include the most important ones" },
    ],
    mastery_statement: "Student can identify the main idea and explain how details support it.",
    ladder: [
      { name: "I can name the topic", descriptor: "States what the text is about" },
      { name: "I can tell important facts", descriptor: "Shares key details" },
      { name: "I can find the main idea", descriptor: "States what the author is saying" },
      { name: "I can explain how details support the main idea", descriptor: "Shows the connection" },
    ],
  },
  {
    standard_code: "L.5.4",
    verbs: [
      { word: "Determine", gloss: "figure out or establish with certainty" },
      { word: "Clarify", gloss: "make clear and easy to understand" },
      { word: "Choose flexibly", gloss: "select strategically from various options" },
    ],
    concepts: ["Context clues", "Word relationships", "Vocabulary strategies", "Multiple meanings"],
    vocabulary: [
      { term: "context", definition: "the words and sentences around a word" },
      { term: "clue", definition: "a hint that helps you work out the meaning" },
      { term: "synonym", definition: "a word that means almost the same thing" },
      { term: "antonym", definition: "a word that means the opposite" },
      { term: "multiple meaning", definition: "a word with more than one meaning" },
    ],
    prior_skills: ["Use picture clues", "Use sentence context", "Know basic word parts"],
    prior_standards: [
      { code: "L.4.4", text: "Determine word meanings using context, word parts, and reference materials" },
    ],
    future_standards: [
      { code: "L.6.4", text: "Determine or clarify the meaning of unknown words or phrases" },
    ],
    challenges: [
      { problem: "Students guess based on first word", fix: "Teach systematic strategy" },
      { problem: "Not using context efficiently", fix: "Model thinking aloud with examples" },
    ],
    mastery_statement: "Student uses multiple strategies to determine word meanings independently.",
    ladder: [
      { name: "I can use context clues", descriptor: "Looks at surrounding words" },
      { name: "I can identify word parts", descriptor: "Finds roots, prefixes, suffixes" },
      { name: "I can use a strategy to figure out a word", descriptor: "Chooses and applies a strategy" },
      {
        name: "I can explain the meaning using evidence",
        descriptor: "States the meaning and why that strategy worked",
      },
    ],
  },
  {
    standard_code: "RL.6.3",
    verbs: [
      { word: "Describe", gloss: "give details about" },
      { word: "Unfolds", gloss: "develops or progresses" },
    ],
    concepts: ["Character development", "Plot structure", "Episodes/scenes", "Change over time"],
    vocabulary: [
      { term: "character", definition: "a person or animal in the story" },
      { term: "plot", definition: "the events that happen, in order" },
      { term: "episode", definition: "one chunk of the story where something happens" },
      { term: "motivation", definition: "the reason a character does what they do" },
      { term: "change", definition: "how a character is different by the end" },
    ],
    prior_skills: ["Identify character traits", "Sequence events", "Understand cause and effect"],
    prior_standards: [
      { code: "RL.5.3", text: "Compare characters and describe changes in their feelings or actions" },
    ],
    future_standards: [{ code: "RL.7.3", text: "Analyze how characters develop and interact" }],
    challenges: [
      { problem: "Static character descriptions", fix: "Focus on how they CHANGE, not just who they are" },
      { problem: "Missing cause-effect with character change", fix: "Connect plot events to character changes" },
    ],
    mastery_statement: "Student describes how characters change in response to plot events.",
    ladder: [
      { name: "I can identify a character's trait", descriptor: "Names a characteristic" },
      { name: "I can explain what a character wants", descriptor: "States their goal or motivation" },
      { name: "I can see how a character changes", descriptor: "Compares beginning and end" },
      {
        name: "I can explain why a character changed",
        descriptor: "Connects plot event to character change",
      },
    ],
  },
];

const blueprintsData = [
  {
    standard_code: "RL.2.1",
    title: "Reading for Understanding: Asking and Answering Questions",
    badge: "Grade 2",
    route_name: "Explicit Instruction",
    route_line: "Explicit modeling → Guided practice → Independent application",
    success_criteria: [
      "Asks at least 3 questions using who, what, where, when, why, or how",
      "Answers questions using details from the text",
      "Questions focus on key details, not minor details",
    ],
    steps: [
      {
        name: "Activate Prior Knowledge",
        minutes: 5,
        body: "Ask students about books they like and why. Discuss why asking questions helps us understand stories. Show enthusiasm for their ideas.",
        science_tag: "retrieval",
      },
      {
        name: "Teach Question Words",
        minutes: 10,
        body: "Display the six question words (who, what, where, when, why, how) on a poster. Give examples of questions for each. Have students say them aloud together.",
        science_tag: "dual-coding",
      },
      {
        name: "Model Question Asking",
        minutes: 10,
        body: "Read aloud from a grade 2 text (2-3 minutes). Stop and think aloud about questions you have. Ask one question for each question word. Show students that good questions help us understand.",
        science_tag: "elaboration",
      },
      {
        name: "Guided Practice with Support",
        minutes: 10,
        body: "Read the next section aloud. Pause frequently. Ask students to turn and talk about a question they have. Offer sentence stems: 'Who...?' 'What...?'",
        science_tag: "interleaving",
      },
      {
        name: "Partner Practice",
        minutes: 10,
        body: "Pair students with a partner. Provide a short text or read aloud again. Partners ask each other questions about the story. Circulate to listen and provide feedback.",
        science_tag: "collaborative",
      },
      {
        name: "Independent Reading with Questions",
        minutes: 10,
        body: "Students read a new text independently or follow along as you read. They write or draw their questions on a graphic organizer (who, what, where, when, why, how).",
        science_tag: "retrieval",
      },
      {
        name: "Share and Celebrate",
        minutes: 5,
        body: "Invite 3-4 students to share a question they asked. Ask the class: 'Is that a good question? Why?' Celebrate questions about key details.",
        science_tag: "elaboration",
      },
      {
        name: "Apply to a New Story",
        minutes: 5,
        body: "Tell students they'll practice this with a new story tomorrow. Today, show them how asking questions helps us be great readers. Remind them of the six question words.",
        science_tag: "spaced",
      },
    ],
    ef_supports: [
      "Visual anchor chart with question words",
      "Sentence stems for questions",
      "Chunked text (short sections)",
      "Turn-and-talk before writing",
    ],
    tech: "Slides or printed text",
    tech_purpose: "Display examples and model thinking",
    ai_prompts: [
      "Generate 5 who/what/where/when/why/how questions about a short text",
      "Create a graphic organizer template for question words",
    ],
    assessment: [
      "Listen to students' questions during turn-and-talk",
      "Review their written questions on the graphic organizer",
      "Ask: Do the questions focus on key details?",
    ],
    why_it_works: [
      "Explicit modeling shows students what questions sound like",
      "Sentence stems lower the barrier to entry",
      "Turn-and-talk gives low-stakes practice",
      "Graphic organizer provides structure",
    ],
  },
  {
    standard_code: "RI.4.2",
    title: "Finding Main Ideas: What's the Big Picture?",
    badge: "Grade 4",
    route_name: "Gradual Release",
    route_line: "I do → We do → You do",
    success_criteria: [
      "Identifies the main idea in a paragraph or short text",
      "Lists at least 2 supporting details",
      "Explains how details support the main idea",
      "Summarizes the text in 2-3 sentences",
    ],
    steps: [
      {
        name: "Activate Prior Knowledge",
        minutes: 5,
        body: "Ask: 'What's the most important idea in this picture?' Show students that everything in a picture supports the main thing. Today, we'll find main ideas in texts.",
        science_tag: "retrieval",
      },
      {
        name: "Teach the Difference: Topic vs. Main Idea",
        minutes: 10,
        body: "Topic = what it's about. Main idea = what the author says ABOUT the topic. Show three examples with a think-aloud. Use a T-chart: Topic | Main Idea.",
        science_tag: "dual-coding",
      },
      {
        name: "Model Finding Main Idea in a Paragraph",
        minutes: 10,
        body: "Read a short paragraph aloud. Think aloud: 'First, what's the topic? Now, what's the author saying about it? The main idea is...' Circle it. Underline supporting details.",
        science_tag: "elaboration",
      },
      {
        name: "Guided Practice: Read and Identify Together",
        minutes: 10,
        body: "Read a new paragraph together. Ask: 'What's the topic?' Then 'What's the author saying?' Have students try stating the main idea. Offer: 'The author is saying...'",
        science_tag: "collaborative",
      },
      {
        name: "Find Supporting Details",
        minutes: 10,
        body: "Now that you've found the main idea, ask: 'What details help us understand this idea?' Underline 2-3. Ask: 'How does this detail support the main idea?'",
        science_tag: "elaboration",
      },
      {
        name: "Partner Practice: Topic, Main Idea, Details",
        minutes: 10,
        body: "Pair students. Give each pair a short text. They complete a template: Topic | Main Idea | Detail 1 | Detail 2. Circulate and listen.",
        science_tag: "collaborative",
      },
      {
        name: "Write a Summary",
        minutes: 5,
        body: "Explain: 'A summary tells the main idea and most important details.' Model writing a 2-3 sentence summary. Let them try independently.",
        science_tag: "elaboration",
      },
      {
        name: "Reflect on the Skill",
        minutes: 5,
        body: "Ask: 'Why is finding the main idea important?' 'When do YOU need to find a main idea?' Celebrate their thinking. Remind them: every paragraph has a main idea.",
        science_tag: "metacognition",
      },
    ],
    ef_supports: [
      "Graphic organizer (Topic | Main Idea | Details)",
      "Highlighters for different parts",
      "Sentence frame: 'The author is saying...'",
      "Short, manageable texts",
    ],
    tech: "Slides with annotated examples",
    tech_purpose: "Model the thinking process with color coding",
    ai_prompts: [
      "Generate 5 grade 4 informational paragraphs with clear main ideas",
      "Create main idea graphic organizer templates",
    ],
    assessment: [
      "Check their graphic organizers for accuracy",
      "Listen to how they explain the connection between detail and main idea",
      "Read their summaries for completeness",
    ],
    why_it_works: [
      "Topic vs. main idea distinction is explicit",
      "Color coding helps visual learners",
      "Multiple opportunities to practice (guided → partner → independent)",
      "Summary ties it all together",
    ],
  },
  {
    standard_code: "L.5.4",
    title: "Word Wizards: Figuring Out Unfamiliar Words",
    badge: "Grade 5",
    route_name: "Strategy Toolkit",
    route_line: "Context clues → Word parts → Reference tools → Apply",
    success_criteria: [
      "Uses context clues to predict a word's meaning",
      "Breaks words into root, prefix, suffix",
      "Uses a strategy to figure out unknown words independently",
      "Explains the meaning and which strategy helped",
    ],
    steps: [
      {
        name: "Celebrate What They Already Know",
        minutes: 5,
        body: "Tell students they already figure out words every day. Show a word in a sentence. Ask: 'Do you know this word? How would you figure it out?' Validate all strategies.",
        science_tag: "elaboration",
      },
      {
        name: "Teach Strategy 1: Context Clues",
        minutes: 8,
        body: "Show a sentence with an unknown word. Ask: 'What clues around the word help you?' Model circling nearby words. Think aloud: 'Those clues tell me...' Repeat with 2 more examples.",
        science_tag: "dual-coding",
      },
      {
        name: "Teach Strategy 2: Word Parts",
        minutes: 8,
        body: "Write a word with a familiar prefix, root, and suffix. Break it apart: 're-read-ing.' Think aloud: 'I know 're' means again, and 'read' and 'ing.' So it means...'",
        science_tag: "elaboration",
      },
      {
        name: "Teach Strategy 3: Reference Tools",
        minutes: 5,
        body: "Show a glossary, dictionary, or digital tool. Model using it. Say: 'When clues and word parts don't work, we check a reference tool.' Celebrate this as expert-level work.",
        science_tag: "dual-coding",
      },
      {
        name: "Practice All Three Strategies",
        minutes: 10,
        body: "Give students 3 sentences, each with an unknown word. They choose which strategy to use. Encourage trying a different strategy for each. Share strategies aloud.",
        science_tag: "interleaving",
      },
      {
        name: "Partner Strategy Hunt",
        minutes: 10,
        body: "Pairs read a short text (with 4-5 unknown words). They underline unknown words and try a strategy. Ask: 'Which strategy did you use? Did it work?' Celebrate flexibility.",
        science_tag: "collaborative",
      },
      {
        name: "Independent Application",
        minutes: 5,
        body: "Students read a new text and write down unknown words. They apply a strategy independently. Remind them: 'You are word detectives!'",
        science_tag: "retrieval",
      },
      {
        name: "Reflect on Growth",
        minutes: 4,
        body: "Ask: 'Which strategy helped you most today?' 'Will you use these strategies in other texts?' Celebrate their independence. Show them a poster with the three strategies.",
        science_tag: "metacognition",
      },
    ],
    ef_supports: [
      "Word strategy poster with examples",
      "Graphic organizer: Word | Context Clues | Word Parts | Meaning",
      "Sentence frames: 'I think this word means... because...'",
      "Visual anchor charts for each strategy",
    ],
    tech: "Slides with color-coded examples, digital dictionary link",
    tech_purpose: "Model each strategy and show real examples",
    ai_prompts: [
      "Generate 10 grade 5 sentences with bold unknown words and context clues",
      "Create a word parts reference guide (common prefixes, roots, suffixes)",
    ],
    assessment: [
      "Listen to students explain which strategy they chose and why",
      "Check their written explanations for reasoning",
      "Observe how flexibly they switch strategies",
    ],
    why_it_works: [
      "Three strategies give students choice and flexibility",
      "Teaching strategies builds independence",
      "Think-alouds show HOW experts figure out words",
      "Practice with real texts makes it relevant",
    ],
  },
  {
    standard_code: "RL.6.3",
    title: "Character Change: Following the Journey",
    badge: "Grade 6",
    route_name: "Close Reading & Inference",
    route_line: "Notice changes → Find causes → Analyze development → Draw conclusions",
    success_criteria: [
      "Describes a character's trait at the beginning of the story",
      "Identifies plot events that affect the character",
      "Describes how the character changes by the end",
      "Explains the connection between plot events and character change",
    ],
    steps: [
      {
        name: "Hook: Character Transformations",
        minutes: 5,
        body: "Ask: 'Have YOU changed because something happened to you?' Tell a brief personal story. Say: 'Characters change just like we do. Let's find out how.'",
        science_tag: "elaboration",
      },
      {
        name: "Teach: Character Traits (Beginning)",
        minutes: 8,
        body: "Read the opening of a story. Ask: 'What is this character like?' Describe their feelings, actions, thoughts. Create a list. Say: 'This is who they are at the START.'",
        science_tag: "elaboration",
      },
      {
        name: "Teach: Plot Events & Their Impact",
        minutes: 8,
        body: "Read a key event. Ask: 'How does this event affect the character? What do they do? What do they feel?' Show how plot pushes characters to change.",
        science_tag: "elaboration",
      },
      {
        name: "Teach: Character Traits (End)",
        minutes: 8,
        body: "Read the ending. Ask: 'What is the character like now?' Compare to the beginning. Ask: 'How are they different?' Circle the differences.",
        science_tag: "elaboration",
      },
      {
        name: "Make the Connection: Why Did They Change?",
        minutes: 8,
        body: "Create a chart: Beginning Trait | Plot Event | Ending Trait. Ask: 'Did the event CAUSE the change? Why?' Show cause-effect explicitly.",
        science_tag: "elaboration",
      },
      {
        name: "Guided Practice: Analyze a Character",
        minutes: 10,
        body: "Read a different story together (or excerpt). Students complete the chart. Discuss: 'What changed? What caused it?' Validate all observations.",
        science_tag: "collaborative",
      },
      {
        name: "Partner Analysis: Trace Character Development",
        minutes: 10,
        body: "Pairs read a short story or text excerpt. They fill out the chart independently. Share findings. Ask: 'Did the event cause the change, or was it something else?'",
        science_tag: "collaborative",
      },
      {
        name: "Reflect: Character Growth as a Theme",
        minutes: 3,
        body: "Ask: 'Why do authors show character change?' 'What does it teach us?' Celebrate how understanding character change makes us better readers.",
        science_tag: "metacognition",
      },
    ],
    ef_supports: [
      "Character change graphic organizer (3-column: Beginning | Event | End)",
      "Sentence frames: 'At the beginning, [character] was... When [event] happened... By the end, [character] was...'",
      "Highlighted text showing key changes",
      "Visual timeline of character development",
    ],
    tech: "Slides with character comparison, timeline template",
    tech_purpose: "Show visual progression of character development",
    ai_prompts: [
      "Generate 5 short stories with clear character arcs for grades 6-7",
      "Create character analysis graphic organizers",
    ],
    assessment: [
      "Check their graphic organizers for accuracy and completeness",
      "Listen to how they explain the cause-effect relationship",
      "Ask them to predict: 'What if [different event] happened?'",
    ],
    why_it_works: [
      "Explicit comparison (before/after) makes change visible",
      "Cause-effect connection shows it's not random",
      "Graphic organizer provides structure for thinking",
      "Real texts make it engaging and relevant",
    ],
  },
];

async function seedStandards() {
  console.log("📚 Seeding standards...");
  for (const standard of standardsData) {
    try {
      await db.insert(standards).values(standard);
      console.log(`  ✓ ${standard.code}`);
    } catch (e) {
      console.log(`  ✗ ${standard.code}: ${(e as any).message?.substring(0, 100)}`);
    }
  }
}

async function seedUnpacks() {
  console.log("📖 Seeding standard unpacks...");
  for (const unpack of unpacksData) {
    try {
      await db.insert(standard_unpacks).values(unpack);
      console.log(`  ✓ ${unpack.standard_code}`);
    } catch (e) {
      console.log(`  ✗ ${unpack.standard_code}: ${(e as any).message?.substring(0, 100)}`);
    }
  }
}

async function seedBlueprints() {
  console.log("🎨 Seeding lesson blueprints...");
  for (const blueprint of blueprintsData) {
    try {
      await db.insert(lesson_blueprints).values(blueprint);
      console.log(`  ✓ ${blueprint.standard_code}`);
    } catch (e) {
      console.log(`  ✗ ${blueprint.standard_code}: ${(e as any).message?.substring(0, 100)}`);
    }
  }
}

async function main() {
  try {
    console.log("🚀 Seeding standards and blueprints...\n");
    await seedStandards();
    console.log();
    await seedUnpacks();
    console.log();
    await seedBlueprints();
    console.log("\n✨ Seed complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

main();
