/**
 * The executive function year: one skill at a time, two minutes a day.
 *
 * The behavior page diagnoses and stops. A teacher who works out on Tuesday
 * that a student's working memory is the problem has nowhere to go with that,
 * and "work on working memory" is not a thing anybody can do on Wednesday
 * morning. This is the other half: each of the eleven skills gets a block of
 * weeks, and each block gets five two-minute lessons, a thing the class can
 * say about itself, a tool that stays on the wall, and one line to send home.
 *
 * Two minutes is not a figure of speech. A lesson that needs ten will not
 * survive a week in a real classroom, and the skill is built by the routine
 * repeating, not by any one lesson being good.
 *
 * The eleven skills and their order come from the same frame as the behavior
 * page -- the Dawson and Guare vocabulary that most schools already use -- so
 * a teacher who clicks a skill tag on one page lands somewhere real on this
 * one. The lessons themselves are ours.
 */

export interface EFDay {
  day: string;
  text: string;
}

export interface EFBlock {
  /** Matches the EF key on the behavior page, so a tag can link straight here. */
  key: string;
  name: string;
  /** The weeks of a 36-week year this block covers. */
  weeks: string;
  icon: string;
  /** What the class can say about itself by the end. */
  ican: string;
  /** The one thing that goes on the wall and stays there. */
  tool: string;
  /** One line a family can act on, which is all a family will read. */
  home: string;
  /** Five two-minute lessons, Monday to Friday. */
  days: EFDay[];
}

export const EF_YEAR: EFBlock[] = [
  {
    key: "initiation",
    name: "Task initiation",
    weeks: "Weeks 1–4",
    icon: "🚦",
    ican: "I can start without being asked twice.",
    tool: "A start step written on the board before every task.",
    home: "Ask what the first step is, not whether they have started.",
    days: [
      { day: "Mon", text: "Name it. \"Starting is its own job, and it is the hardest part for a lot of people. We are going to practice just starting.\"" },
      { day: "Tue", text: "Model it badly, then well. Sit and stare at a page for ten seconds, then say the first step out loud and write one word. Ask what changed." },
      { day: "Wed", text: "First-step-only. Hand out a task and say: write only the heading, then stop and look up. Everybody stops. Point out that everybody started." },
      { day: "Thu", text: "Time to start. Say \"go\", count the seconds out loud until the last pencil moves, and write the number on the board. Do not comment on it." },
      { day: "Fri", text: "Beat the number. Same routine, and the class tries to beat Thursday's number. The class, not a child." },
    ],
  },
  {
    key: "working",
    name: "Working memory",
    weeks: "Weeks 5–8",
    icon: "🧠",
    ican: "I can hold a direction long enough to do it.",
    tool: "Steps stay visible until the task is finished. Nothing is given by voice alone.",
    home: "Give one instruction, then wait. Two at once is one too many on a tired day.",
    days: [
      { day: "Mon", text: "Show the limit. Read out seven unrelated words and ask the class to write them. Count how many came back. Nobody gets seven." },
      { day: "Tue", text: "Same seven, written on the board. Everybody gets seven. \"Your memory did not improve. The board did the holding.\"" },
      { day: "Wed", text: "Two-step, three-step. Give a two-step direction, then a three-step one. Ask which one fell apart and where." },
      { day: "Thu", text: "Write it down instead. Before a multi-step task, everybody writes the steps in their own words first. Then do the task." },
      { day: "Fri", text: "Catch me. Give a four-step direction out loud on purpose and wait for somebody to ask you to write it down. Thank them loudly." },
    ],
  },
  {
    key: "planning",
    name: "Planning & prioritizing",
    weeks: "Weeks 9–12",
    icon: "🗺️",
    ican: "I can decide what comes first.",
    tool: "Any task over three steps gets the steps listed before it is begun.",
    home: "Ask what they are doing first tonight, and why that one.",
    days: [
      { day: "Mon", text: "Out of order on purpose. Give the steps of something familiar in the wrong order and have the class fix it. Argue about one." },
      { day: "Tue", text: "What goes first. Three jobs on the board, all real. The class votes on the order and has to give a reason, not a preference." },
      { day: "Wed", text: "Break one open. Take one task and list the steps as a class. Count them. Most tasks have more steps than anybody expected." },
      { day: "Thu", text: "The longest step. Look at yesterday's list and mark which step will take the longest. Start with that one today." },
      { day: "Fri", text: "Plan, then do. Five minutes planning, then work. At the end ask whether the plan held, and where it did not." },
    ],
  },
  {
    key: "attention",
    name: "Sustained attention",
    weeks: "Weeks 13–16",
    icon: "🎯",
    ican: "I can keep going after it stops being interesting.",
    tool: "A visible timer, and work in blocks the class agreed to.",
    home: "Agree a length before they begin, not a finish line they cannot see.",
    days: [
      { day: "Mon", text: "Name the drop. \"Everybody can pay attention at the start. The skill is the middle, after it gets boring.\"" },
      { day: "Tue", text: "Find your number. Work silently until the first person wants to stop, and note the minutes. That is the class's honest starting number." },
      { day: "Wed", text: "Blocks, not marathons. Two short blocks with a stretch between beats one long one. Try both this week and ask which felt shorter." },
      { day: "Thu", text: "Park the thought. A sticky note on every desk. When a thought interrupts, write one word and keep working. Read a few at the end." },
      { day: "Fri", text: "Add one minute. Same block as Tuesday plus one minute. One. The point is that it is small enough to succeed at." },
    ],
  },
  {
    key: "emotional",
    name: "Emotional control",
    weeks: "Weeks 17–20",
    icon: "🌡️",
    ican: "I can notice I am getting upset before it is too late.",
    tool: "A signal every student can use, taught on a calm day.",
    home: "Ask what their early sign is. Hot face, tight hands, loud voice. Name it, do not fix it.",
    days: [
      { day: "Mon", text: "Early signs. Everybody writes one thing their body does before they lose it. Collect them without names and read some out." },
      { day: "Tue", text: "Teach the signal. Agree one signal that means \"I need a minute\". Practice it now, while nobody needs it." },
      { day: "Wed", text: "Rehearse the exit. Walk the route to the break spot and back, as a class, in silence. A route you have walked calm is one you can walk upset." },
      { day: "Thu", text: "Name it for yourself. Say out loud, about yourself, one small thing that annoyed you today and what you did. Keep it real and keep it small." },
      { day: "Fri", text: "Use it once. Everybody uses the signal once today for something minor, so the first real use is not the first use." },
    ],
  },
  {
    key: "inhibition",
    name: "Response inhibition",
    weeks: "Weeks 21–23",
    icon: "✋",
    ican: "I can wait before I answer.",
    tool: "Wait time. Nobody answers until the whole class has had five seconds.",
    home: "Count to five before you answer them, too. They will notice.",
    days: [
      { day: "Mon", text: "Five seconds. Ask a question and make everybody wait five seconds before a hand goes up. It will feel much longer than it is." },
      { day: "Tue", text: "Write first. Ask a question, everybody writes an answer, then hands go up. The blurters get to answer and so does everybody else." },
      { day: "Wed", text: "The second thought. \"Your first answer and your best answer are often not the same one.\" Ask for a second answer to yesterday's question." },
      { day: "Thu", text: "Catch yourself. Everybody tracks one time today they stopped themselves. Not a confession, just a count." },
      { day: "Fri", text: "Hardest case. Ask something the class will be desperate to answer, and hold the five seconds anyway. Then talk about how it felt." },
    ],
  },
  {
    key: "flexibility",
    name: "Flexibility",
    weeks: "Weeks 24–26",
    icon: "🔀",
    ican: "I can change plan when the plan stops working.",
    tool: "A named moment in each task where changing approach is allowed.",
    home: "When something goes wrong, ask what else they could try before you suggest anything.",
    days: [
      { day: "Mon", text: "Change something small. Move one routine on purpose and let the class notice. Talk about what that felt like for a second." },
      { day: "Tue", text: "Two ways. Solve one problem two different ways as a class. Neither is the right one." },
      { day: "Wed", text: "Stuck means switch. \"If you have tried the same thing three times, that is information. Try a different thing.\"" },
      { day: "Thu", text: "Plan B out loud. Before a task, everybody names what they will try if the first way does not work." },
      { day: "Fri", text: "Something is wrong. Give a task with a missing piece. The skill being practised is noticing and adapting, not finishing." },
    ],
  },
  {
    key: "organization",
    name: "Organization",
    weeks: "Weeks 27–29",
    icon: "🗂️",
    ican: "I can find what I need without looking for it.",
    tool: "One place for the thing that matters today, checked at a transition that already happens.",
    home: "Build one routine, not a system. Same pocket, same time, every day.",
    days: [
      { day: "Mon", text: "Count the places. How many places could a reading book be right now? Count them. The number is the problem." },
      { day: "Tue", text: "Fewer places. Pick one place for one thing. Not a system — one place for one thing." },
      { day: "Wed", text: "Attach the check. Tie the check to something that already happens, like lining up. A check that needs remembering will not happen." },
      { day: "Thu", text: "Finished work has a home. Agree where finished work goes the moment it is finished, and use it today." },
      { day: "Fri", text: "Two-minute reset. Two minutes, everybody, same time every Friday from now on. Set the timer and stop when it goes." },
    ],
  },
  {
    key: "time",
    name: "Time management",
    weeks: "Weeks 30–32",
    icon: "⏳",
    ican: "I can tell how long something will really take.",
    tool: "Guess the minutes before the task, write the real number after.",
    home: "Ask for a guess before, and the real answer after. Children are not bad at time, they are unpracticed.",
    days: [
      { day: "Mon", text: "Guess and check. Everybody guesses how long a task will take, then you time it. Compare. Nobody is close." },
      { day: "Tue", text: "A minute is this long. Sit in silence for exactly one minute. Most of the class will think it was longer." },
      { day: "Wed", text: "Guess again. Same routine as Monday on a new task. Guesses get better fast once they have been checked once." },
      { day: "Thu", text: "Halfway. Say when half the time is gone and ask whether they are half done. That gap is the lesson." },
      { day: "Fri", text: "Budget it. Twenty minutes, three jobs. The class divides the time before starting, then checks what actually happened." },
    ],
  },
  {
    key: "persistence",
    name: "Goal-directed persistence",
    weeks: "Weeks 33–34",
    icon: "🧗",
    ican: "I can keep going when the reward is not today.",
    tool: "A visible run of small wins toward one thing that takes weeks.",
    home: "Point at what is already done, not at what is left.",
    days: [
      { day: "Mon", text: "Pick something far. The class picks one goal that cannot be finished this week. It has to be real." },
      { day: "Tue", text: "Break it into weeks. How much a week gets it done? Put the number where everybody can see it." },
      { day: "Wed", text: "Mark the progress. Mark what is done so far. Mark it where it stays visible, not in a book." },
      { day: "Thu", text: "The dip. \"Everything gets boring in the middle. That is not a sign to stop, it is just the middle.\"" },
      { day: "Fri", text: "Look back. Look at the mark from Wednesday. Compare to the start, never to the finish." },
    ],
  },
  {
    key: "metacognition",
    name: "Metacognition",
    weeks: "Weeks 35–36",
    icon: "🪞",
    ican: "I can tell how my own thinking is going.",
    tool: "One question at the end of a task: what worked, what did not.",
    home: "Ask what they would do differently, not how it went.",
    days: [
      { day: "Mon", text: "What worked. After a task, everybody writes one thing that worked and one that did not. Two lines, no more." },
      { day: "Tue", text: "Notice the stuck. \"How do you know when you do not understand something?\" Harder than it sounds. Let it sit." },
      { day: "Wed", text: "Borrow a strategy. Read out two things that worked for other people yesterday. Everybody picks one to try." },
      { day: "Thu", text: "Check the guess. Before a task, everybody says how hard they think it will be. After, whether they were right." },
      { day: "Fri", text: "The year. Look back at the eleven skills. Everybody names the one that changed most for them, and the one still hardest." },
    ],
  },
];

/** The block that covers a given week of a 36-week year. */
export function blockForWeek(week: number): EFBlock | null {
  for (const b of EF_YEAR) {
    const m = b.weeks.match(/(\d+)\D+(\d+)/);
    if (!m) continue;
    if (week >= Number(m[1]) && week <= Number(m[2])) return b;
  }
  return null;
}
