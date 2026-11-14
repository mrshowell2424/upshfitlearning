/**
 * Behavior Strategies: what a teacher is actually seeing, and what sits under it.
 *
 * Every behavior resource we were handed is organized by strategy — here is the
 * Good Behavior Game, here is a break card, here is what tier it belongs to.
 * That order only works if you already know what you are looking at. A teacher
 * standing in front of a child who has gone silent does not need a tier. They
 * need to know what that silence is, and what to do in the next ninety seconds.
 *
 * So this is inverted. The teacher clicks what they can see from across the
 * room, and each signal answers four questions in the order a person asks them:
 *
 *   1. look   - is this the thing I am seeing? Concrete and observable only.
 *   2. inside - what is going on in there, and why does it feel that way?
 *   3. now    - what helps in the next few minutes.
 *   4. build  - what makes next month easier.
 *
 * Two fields exist because of how often the opposite happens. `worse` names the
 * adult reflex that escalates this particular signal, and it is usually the
 * reasonable-sounding one. `ef` names the executive function skills under load,
 * because "won't" and "can't" look identical from the doorway and the EF frame
 * is the one that tells them apart.
 *
 * On the research: `research` is only present where there is something real to
 * cite, and every entry carries `limits` as well as `supports`. A teacher being
 * handed a neuroscience claim deserves to know what it does not establish. The
 * shutdown entry has the most because shutdown is the signal most often read as
 * defiance, and the evidence that it is not is the useful part.
 *
 * Nothing here is copied from the strategy cards or from any published
 * program. The strategy names in `strategies` are the common professional
 * names for these moves, and the wording of each is ours.
 */

/** The eleven executive function skills, in the vocabulary schools already use. */
export const EF = {
  inhibition: "Response inhibition",
  working: "Working memory",
  emotional: "Emotional control",
  flexibility: "Flexibility",
  attention: "Sustained attention",
  initiation: "Task initiation",
  planning: "Planning & prioritizing",
  organization: "Organization",
  time: "Time management",
  persistence: "Goal-directed persistence",
  metacognition: "Metacognition",
} as const;

export type EFKey = keyof typeof EF;

/** What each skill is, in one sentence a teacher can use with a parent. */
export const EF_MEANING: Record<EFKey, string> = {
  inhibition: "Stopping a first response long enough to pick a better one.",
  working: "Holding information in mind while doing something with it.",
  emotional: "Managing feelings well enough to keep working through them.",
  flexibility: "Changing plan when the situation changes.",
  attention: "Staying with a task past the point where it stops being interesting.",
  initiation: "Starting without a push, and starting on time.",
  planning: "Deciding the steps and the order before beginning.",
  organization: "Keeping track of materials, work and information.",
  time: "Knowing how long things take and how much time is left.",
  persistence: "Staying with a goal when the reward is not immediate.",
  metacognition: "Watching your own thinking and noticing how it is going.",
};

export interface Research {
  /** The finding, stated plainly. */
  claim: string;
  source: string;
  /** What a teacher may fairly conclude from it. */
  supports: string;
  /** What it does not establish, which is the half usually dropped. */
  limits: string;
}

export interface Signal {
  id: string;
  /** What a teacher would call it, not what a manual would. */
  name: string;
  /** The one-line version, for the button. */
  short: string;
  /** Observable only: what it looks like from across the room. */
  look: string[];
  /** The internal read, written to the student rather than about them. */
  inside: string[];
  ef: EFKey[];
  /** The next few minutes. */
  now: string[];
  /**
   * The words. Short enough to say across a room, and written to be said to
   * the student rather than about them -- they name the thing without
   * blaming anyone for it, and every one of them leaves the work standing.
   * Nothing here says calm down, you're fine, or I know you can do it.
   */
  say: string[];
  /**
   * The sentences that make it worse, and why.
   *
   * Every one of these is kind, or at least well meant, and every one of
   * them is in common use -- which is the point. A teacher reaching for
   * words in a hard moment reaches for whatever is nearest, and the nearest
   * words are usually these. Naming the substitute next to the thing it
   * substitutes for is what makes the swap learnable; a list of better
   * sentences on its own does not displace anything.
   *
   * Not one of these is a thing only a bad teacher says.
   */
  avoid: { words: string; why: string }[];
  /** The reasonable-sounding reflex that makes this one worse. */
  worse: string[];
  /** The longer arc, once the moment has passed. */
  build: string[];
  /** Named moves that fit this signal. */
  strategies: string[];
  research?: Research[];
}

export const SIGNALS: Signal[] = [
  {
    id: "shutdown",
    name: "Shuts down",
    short: "Goes quiet, head down, stops responding",
    look: [
      "Head down on the desk, or turned away from the room.",
      "Stops answering — not refusing out loud, just not answering.",
      "Body goes still and loose rather than tense. Shoulders drop.",
      "Eye contact gone. Often stops tracking the room entirely.",
      "Work stops mid-problem, sometimes mid-word.",
      "Repeating an instruction gets no visible change at all.",
    ],
    inside: [
      "The part of the brain that holds instructions and plans steps has gone offline first. This is why a student who knew the strategy yesterday cannot reach it now.",
      "They are not deciding not to answer. Speech is one of the first things to go, and asking again adds load to the system that has already stopped coping.",
      "Shutdown usually arrives after something smaller was missed — a request they could not start, a correction, a transition. It is the end of a sequence, not the start of one.",
      "Most students in shutdown can hear you. Many report afterwards that they remember what was said and could not make words come out.",
      "There is often shame stacked on top by the second minute, because they know the room has noticed.",
    ],
    ef: ["working", "emotional", "initiation", "flexibility"],
    now: [
      "Drop the demand to zero. Not reduced — zero. Nothing to answer, nothing to decide.",
      "Get beside them rather than in front, and lower your own height. Standing over a shut-down student adds to it.",
      "Say less and say it slower. One short sentence, then wait a full ten seconds before anything else.",
      "Offer presence without a question: \"I'm going to sit here a minute. You don't have to say anything.\"",
      "Give a motor task with no right answer — hand them something to carry, hold or sort. Movement comes back before speech does.",
      "When speech returns, take the first word as the whole answer. Do not ask them to explain what just happened.",
      "Let the re-entry be partial. One problem, not the page.",
    ],
    say: [
      "“You don’t have to talk. I’m going to sit here a minute.”",
      "“Nothing is due in the next five minutes.”",
      "“Thumbs up if you want me to stay, thumbs down if you want space.”",
      "“You can start with one word and we’ll go from there.”",
      "“I’m not going to ask what’s wrong. Tell me when you want to.”",
    ],
    avoid: [
      {
        words: "“What’s wrong?”",
        why: "A question needs the working memory and the speech that have just gone offline. It is the hardest thing in the room to answer.",
      },
      {
        words: "“I’m going to count to three.”",
        why: "A deadline, handed to a student who could not meet the first one. Three arrives and now there is a second problem.",
      },
      {
        words: "“You’re fine.”",
        why: "It tells them their own body is lying, and it ends the conversation before they can say otherwise.",
      },
    ],
    worse: [
      "Repeating the direction louder or more firmly. The system that would process it is the part that has stopped.",
      "Sliding the work back in front of them, or re-reading the question. It is a new demand wearing the clothes of help.",
      "Giving a countdown or an ultimatum. It adds a demand to a student who could not meet the first one.",
      "Reading the stillness as disrespect. It looks like refusal and it is the opposite end of the same cascade.",
      "Sending them out mid-shutdown. Walking and being looked at are both demands.",
    ],
    build: [
      "Find the sequence. Shutdown has a lead-up, and it is usually the same two or three minutes every time. Log what came immediately before, for a week, before changing anything.",
      "Teach a signal they can use before speech goes — a card, a hand on the desk, a word. Practice it on a calm day, several times.",
      "Give real control somewhere in the day. Not a choice between two things you picked: a decision where their answer actually changes what happens.",
      "Shrink the starting demand on hard tasks so the lead-up never gets going.",
      "Debrief later and briefly, when they are regulated, and ask what helped rather than what happened.",
    ],
    strategies: [
      "Structured break with a taught return",
      "Reduced-demand re-entry",
      "Non-verbal signal system",
      "Antecedent logging",
      "Restorative problem solving — after, never during",
    ],
    research: [
      {
        claim:
          "Acute stress impairs the prefrontal cortex while strengthening habit and threat circuits, so the capacity to hold instructions, plan steps and choose a response drops sharply under stress.",
        source:
          "Arnsten, A. F. T. (2009). Stress signalling pathways that impair prefrontal cortex structure and function. Nature Reviews Neuroscience, 10(6), 410–422.",
        supports:
          "A student in distress genuinely cannot reach a strategy they can use when calm. Lowering demand is not lowering standards; it is making a response possible at all.",
        limits:
          "It does not tell you which students will shut down, or that any particular child's silence is stress. It describes a mechanism, not a diagnosis.",
      },
      {
        claim:
          "Passivity under prolonged adversity is the unlearned default. What experience teaches is the expectation of control, carried by the prefrontal cortex inhibiting the brainstem circuits that produce shutting down.",
        source:
          "Maier, S. F., & Seligman, M. E. P. (2016). Learned helplessness at fifty: Insights from neuroscience. Psychological Review, 123(4), 349–367.",
        supports:
          "Giving a student real, detectable control is the active ingredient. Helplessness is not a habit to be broken but a default to be replaced by evidence that their actions matter.",
        limits:
          "This revises the original 1967 interpretation, so older trainings often state the opposite. It does not license calling any student \"learned helpless\" — that was the reading the authors themselves withdrew.",
      },
      {
        claim:
          "Defensive responses run in a sequence — alert stillness, flight, fight, then a later stage marked by falling heart rate, dropping muscle tone and loss of speech.",
        source:
          "Schauer, M., & Elbert, T. (2010). Dissociation following traumatic stress: Etiology and treatment. Zeitschrift für Psychologie, 218(2), 109–127.",
        supports:
          "A student who has gone limp and silent is further along the sequence than one who is tense and still, and needs the demand taken off rather than repeated.",
        limits:
          "The sequence was described in the context of traumatic stress. Classroom shutdown is usually milder and most of it is not trauma. Use the pattern to decide what to do next, not to infer a history.",
      },
      {
        claim:
          "The popular polyvagal account of shutdown is a model, and its specific physiological claims about vagal pathways in humans are contested in the comparative physiology literature.",
        source:
          "See critiques by Grossman and colleagues of polyvagal theory's physiological premises; the clinical framework remains widely taught in schools.",
        supports:
          "Use the observable pattern — stillness, silence, dropping tone — and the practical response. Those hold regardless of which mechanism story turns out to be right.",
        limits:
          "Do not teach the mechanism to staff or families as settled fact, and do not build an explanation of a specific child on it.",
      },
    ],
  },
  {
    id: "refusal",
    name: "Flat refusal",
    short: "“I'm not doing it”",
    look: [
      "Says no directly, out loud, often before the task is fully explained.",
      "Pushes the paper away, closes the laptop, folds arms.",
      "Stays verbal and alert — this is not shutdown, and the difference matters.",
      "Sometimes escalates if pressed, sometimes goes quiet and becomes shutdown.",
    ],
    inside: [
      "Refusing is usually faster and less exposing than trying and failing in front of thirty people. A no is something they control.",
      "Many students refuse the task they are least sure they can start, not the one they dislike most. Watch which tasks draw it.",
      "If refusal has previously ended the demand, it has been taught. That is not manipulation; it is a strategy that worked.",
      "A public no is also a face-saving move. Backing down in front of an audience costs something, which is why private beats public.",
    ],
    ef: ["initiation", "emotional", "flexibility", "persistence"],
    now: [
      "Stop negotiating in front of the room. Move the conversation to a quiet exchange, or to later.",
      "Name the next step so small it is almost nothing: the first line, the heading, one problem.",
      "Give a real choice about how rather than whether — order, tool, place, who with.",
      "Let them save face. \"Start wherever you like, I'll come back in two minutes\" ends the standoff without a winner.",
      "Walk away after the ask. An adult waiting for compliance is an audience.",
    ],
    say: [
      "“Okay. You don’t have to do it right now.”",
      "“Which part are you not doing — all of it, or the writing?”",
      "“You can do the first line and stop. That’s a real option.”",
      "“I believe you that it feels impossible right now.”",
      "“I’m not going to argue about it. The work will still be here.”",
    ],
    avoid: [
      {
        words: "“You have to.”",
        why: "It turns the task into a contest, and the contest is one they win by doing nothing at all.",
      },
      {
        words: "“Then you lose your break.”",
        why: "The price was already worked out before they refused. Naming it only confirms the deal was worth it.",
      },
      {
        words: "“Everyone else has started.”",
        why: "Shame, in front of the audience that made climbing down hard in the first place.",
      },
    ],
    worse: [
      "Repeating the demand with an added consequence. It turns a task into a contest, and the contest is one they can win by not working.",
      "Arguing the point. Every exchange is time not spent starting, and the student knows it.",
      "Making it public. Once peers are watching, complying costs more than refusing.",
    ],
    build: [
      "Record which tasks draw refusal. If they cluster — writing, reading aloud, anything open-ended — the problem is the task demand, not the attitude.",
      "Pre-teach the hard task before the lesson, so the first encounter is not in front of the class.",
      "Build a start routine they use on everything, so beginning stops being a decision.",
      "Make asking for help cheaper than refusing. If help is slow or embarrassing, refusal stays the better deal.",
    ],
    strategies: [
      "Behavior momentum — easy requests first",
      "First-then framing",
      "Choice within the task",
      "Private redirect",
      "Pre-teaching",
    ],
    research: [
      {
        claim:
          "Delivering two to four quick requests a student reliably completes, immediately before a harder one, raises the chance they follow through on the harder request.",
        source:
          "High-probability request sequences; see Mace et al. (1988), Journal of Applied Behavior Analysis, and the behavioral momentum literature following Nevin.",
        supports:
          "Warming up with things the student can already do is a real effect, not a trick. Keep the pace quick and move to the real task before the momentum is spent.",
        limits:
          "It works on follow-through, not on the reason the task is hard. If the refusal is about a skill gap, momentum gets them started and nothing more.",
      },
    ],
  },
  {
    id: "blank",
    name: "Can't get started",
    short: "Blank page, long after everyone else began",
    look: [
      "Page still empty five minutes in. Pencil in hand.",
      "Looks busy — arranging materials, re-reading the directions, sharpening.",
      "Asks what to do again, right after it was explained.",
      "Starts and erases. Starts and erases.",
      "Often does fine once someone writes the first line with them.",
    ],
    inside: [
      "Nothing is wrong with the work. Beginning is its own skill, and it is the one missing.",
      "An open task holds too much at once: what to say, how to start, how to spell it, how long it has to be. Working memory fills before any writing happens.",
      "Re-reading the directions is a way of looking like you have started. It buys time and costs nothing socially.",
      "For some students the blank page is fear of the first wrong move, and erasing is the evidence.",
    ],
    ef: ["initiation", "planning", "working", "organization"],
    now: [
      "Write the first words with them. Not a hint — the actual first line, in their handwriting or yours.",
      "Cover everything but the first step. A page folded in half is a smaller task than a page.",
      "Convert the open task into a closed first move: \"Write the title.\" \"Number one to five down the margin.\"",
      "Ask them to say it before writing it, and write what they say. Speech is usually ahead of the page.",
      "Set a two-minute timer and leave. Watched starting is harder than unwatched starting.",
    ],
    say: [
      "“What’s the very first thing you have to do? Just the first.”",
      "“You don’t have to know the answer to write the heading.”",
      "“I’ll do the first one with you and you do the second.”",
      "“Write the worst first line you can think of. We’ll fix it after.”",
      "“Tell me what you’re stuck on so I stop guessing.”",
    ],
    avoid: [
      {
        words: "“Just begin.”",
        why: "If they could, they would. It adds pressure and no information about what to actually do.",
      },
      {
        words: "“You’ve got twenty minutes left.”",
        why: "Time is the thing already stopping them. More of it pointed at them does not start anything.",
      },
      {
        words: "“It’s easy, just do the first one.”",
        why: "If it turns out not to be easy, they are now also stupid. That is a worse place to start from.",
      },
    ],
    worse: [
      "Standing beside the desk and waiting. The pressure goes up, the first step is still missing, and now it is being watched.",
      "Repeating the directions a third time. The directions were understood; the start was not.",
      "Taking the delay as laziness and moving on. Ten minutes later they are no further and now behind as well.",
    ],
    build: [
      "Teach one start routine and use it everywhere, until beginning is automatic rather than decided.",
      "Give models of finished work and of a first line, not just instructions.",
      "Break open tasks into visible steps on paper, so planning is not held in the head.",
      "Count time-to-start for a week. It is the number that moves first when this is working.",
    ],
    strategies: [
      "Guided first step",
      "Task chunking with a visible step list",
      "Sentence starters and worked examples",
      "Behavior momentum — academic warm-up",
      "Time-to-start tracking",
    ],
    research: [
      {
        claim:
          "Working memory is narrow, and instructional material that forces a learner to hold many elements at once consumes the capacity needed to actually do the task.",
        source:
          "Cognitive load theory; Sweller, J. (1988) and the subsequent literature, including the worked-example effect.",
        supports:
          "Making the steps visible on paper and supplying a worked first line is not doing the work for them. It frees the capacity the work itself needs.",
        limits:
          "Load is not the only reason a page stays blank — avoidance and anxiety produce the same picture. Supports that reduce load will not fix those on their own.",
      },
    ],
  },
  {
    id: "rushing",
    name: "Rushes through",
    short: "Finished first, and most of it is wrong",
    look: [
      "Hand up, done, well before anyone else.",
      "Answers in the wrong places, directions half-read, steps skipped.",
      "Gets it right out loud when asked, having got it wrong on paper.",
      "Will not go back and check, or checks in four seconds.",
    ],
    inside: [
      "Being finished is the goal, because finished is the thing that gets noticed. Accuracy was never the target.",
      "Some students rush to get out of a task that is uncomfortable to sit inside. Speed is avoidance that looks like effort.",
      "Checking requires holding what you meant against what you wrote, which is a harder skill than the task itself.",
      "If the reward for finishing is more work, rushing is rational and checking is punished.",
    ],
    ef: ["inhibition", "metacognition", "attention", "planning"],
    now: [
      "Do not accept it yet and do not correct it either. Hand it back with one instruction: \"Check number three.\"",
      "Ask them to read one answer aloud. The error usually surfaces in their own voice.",
      "Make the target explicit before the next task: \"Three right matters more than five done.\"",
      "Give the checking step a visible home — a box to tick, a highlighter, a partner read.",
    ],
    say: [
      "“You finished fast. Now show me how you know.”",
      "“I’m not looking for done. I’m looking for one you can explain.”",
      "“Pick the one you’re least sure about and we’ll look together.”",
      "“Fast is fine. Let’s make sure it’s also right.”",
      "“Put a dot next to any you guessed. I won’t mark those.”",
    ],
    avoid: [
      {
        words: "“Slow down.”",
        why: "It names a speed, not a step. There is nothing in it to actually do differently on the next question.",
      },
      {
        words: "“Go back and check it.”",
        why: "They will re-read it at the same speed, see what they expected to see, and find nothing.",
      },
      {
        words: "“You’re better than this.”",
        why: "They hear that they are a disappointment, and the next one comes back faster, not slower.",
      },
    ],
    worse: [
      "Giving more work to the student who finished first. It teaches that speed is punished, and the next one will be rushed too.",
      "Marking it wrong and handing it back without a step. The feedback arrives after the moment when it could be used.",
      "Praising the speed, even in passing.",
    ],
    build: [
      "Change what earns the attention. Accurate and unfinished should get more than finished and wrong, visibly and repeatedly.",
      "Teach a checking routine with specific steps, because \"check your work\" is not a procedure.",
      "Let them self-score against a key sometimes. Noticing their own error is the skill.",
      "Watch for whether rushing is specific to one subject. If it is, read it as avoidance.",
    ],
    strategies: [
      "Explicit accuracy targets",
      "Taught self-checking routine",
      "Self-scoring against a key",
      "Reinforcing accuracy over completion",
    ],
  },
  {
    id: "blowup",
    name: "Blows up over something small",
    short: "A broken pencil ends the lesson",
    look: [
      "Reaction out of all proportion to what set it off.",
      "Loud, fast, often out of the seat. Sometimes materials go flying.",
      "Set off by a small frustration — a mistake, a correction, a change of plan.",
      "Afterwards, genuine remorse, and often no clear account of what happened.",
    ],
    inside: [
      "The pencil was not the cause. It was the last item on a load that was already full, and most of the load was earlier in the day.",
      "Once it is going, the part of the brain that would stop it is the part least available. Asking them to calm down is asking for the missing function.",
      "The remorse afterwards is real. It is also evidence that this was not planned.",
      "Many students escalate faster when an adult moves closer. Proximity reads as threat when the system is already up.",
    ],
    ef: ["emotional", "inhibition", "flexibility", "working"],
    now: [
      "Lower your voice and slow it down. Matching their volume raises the ceiling.",
      "Give space, not an audience. Move the class if moving the student is harder.",
      "Say almost nothing. Two or three words, repeated calmly, is more than enough.",
      "Do not ask questions, make requests or offer reasoning until it is coming down. None of it will land.",
      "Wait longer than feels right before re-engaging. Coming back too early restarts it.",
    ],
    say: [
      "“That was the last straw, not the whole thing.”",
      "“You can be furious about the pencil. We’ll fix the pencil.”",
      "“I’m not angry with you. Take the time you need.”",
      "“Come back when your body feels different. I’ll hold your spot.”",
      "“Something was already hard before the pencil broke.”",
    ],
    avoid: [
      {
        words: "“It’s just a pencil.”",
        why: "True, and it tells them mid-reaction that their reaction is ridiculous. Nobody has ever calmed down on hearing it.",
      },
      {
        words: "“Calm down.”",
        why: "It asks for the one thing that is not available right now, and it says the problem is the noise rather than whatever came before it.",
      },
      {
        words: "“Look at me when I’m talking to you.”",
        why: "Eye contact raises arousal. It is the wrong demand at the exact worst second.",
      },
    ],
    worse: [
      "Reasoning mid-escalation. The argument is sound and the student cannot process it.",
      "Adding consequences while it is happening. It extends the event and attaches it to an adult.",
      "Standing close, standing over, or blocking the exit.",
      "Requiring an apology before they are regulated. It produces a false one and teaches nothing.",
    ],
    build: [
      "Map the load, not the trigger. Look at the hour before, and at the pattern across the week — the same period, the same subject, the same time of day.",
      "Teach and rehearse an exit they can take before it starts, on calm days, until it is automatic.",
      "Do the repair conversation later, when they can think, and keep it on what to do next time.",
      "Reduce the number of small frustrations in the hardest hour rather than coaching through all of them.",
    ],
    strategies: [
      "Structured break, requested early",
      "Low-demand de-escalation script",
      "Restorative problem solving — once calm",
      "Antecedent mapping across the day",
    ],
    research: [
      {
        claim:
          "The same stress mechanism that impairs planning also shifts behavior toward fast, habitual responses, which is why escalation is quick and the account of it afterwards is thin.",
        source:
          "Arnsten, A. F. T. (2009). Stress signalling pathways that impair prefrontal cortex structure and function. Nature Reviews Neuroscience, 10(6), 410–422.",
        supports:
          "Timing matters more than content. The same sentence that fails during escalation often works twenty minutes later.",
        limits:
          "It explains why reasoning fails in the moment. It does not mean consequences have no place — only that they belong after, and attached to repair.",
      },
    ],
  },
  {
    id: "clowning",
    name: "Gets silly when work gets hard",
    short: "Jokes, noises, performance — right at the difficult part",
    look: [
      "The comedy starts when the task does, and stops when it is put away.",
      "Plays to the room, not to the adult.",
      "Often a strong student socially, and the timing is precise.",
      "Escalates if ignored, then settles immediately if the task is removed.",
    ],
    inside: [
      "Being the funny one is a better identity than being the one who cannot do it. The joke is a trade.",
      "The timing tells you where the skill gap is. Note what was on the desk when it started.",
      "It usually works: the task stops, the room laughs, and the adult deals with behavior instead of reading level.",
      "Students who do this are often acutely aware of their own gap and protecting it in the only currency they have.",
    ],
    ef: ["inhibition", "initiation", "attention", "persistence"],
    now: [
      "Do not perform back, and do not punish publicly. Both pay the audience.",
      "Deal with the task, not the joke: get beside them and start the first step quietly.",
      "Name it privately and without heat: \"This one's hard. Let's do the first bit together.\"",
      "Give a real job that uses the same energy — hand things out, read a part, run the timer.",
    ],
    say: [
      "“You’re funny. You’re also stuck. Both can be true.”",
      "“Save it for the end and I’ll laugh then.”",
      "“I think this part is hard. Am I right?”",
      "“I’d rather you tell me it’s hard than make me laugh.”",
      "“You don’t have to be the joke to be all right in here.”",
    ],
    avoid: [
      {
        words: "“That’s not funny.”",
        why: "It makes the joke the subject. The joke was never the subject; the part of the page they cannot do was.",
      },
      {
        words: "“Do you want to go and see the head?”",
        why: "It raises the stakes, so the performance now has to continue or they lose face.",
      },
      {
        words: "“Stop showing off.”",
        why: "It names a motive they would never claim, in front of the people they were performing for.",
      },
    ],
    worse: [
      "Laughing, then correcting. The mixed signal keeps the pattern alive.",
      "A public telling-off. It is a bigger stage than the joke had.",
      "Removing the student and the task together, which delivers exactly what the joke was for.",
    ],
    build: [
      "Find the skill behind it. Clowning that is reliable to one subject is a reading or writing problem wearing a costume.",
      "Give the student a visible, legitimate role in the room so the identity does not depend on the joke.",
      "Scaffold the hard task before the lesson, so the first encounter is private.",
      "Reinforce attempting over succeeding, specifically and out loud.",
    ],
    strategies: [
      "Private redirect",
      "Pre-teaching the hard task",
      "Assigned classroom role",
      "Reinforcing attempts",
      "Behavior momentum",
    ],
  },
  {
    id: "arguing",
    name: "Argues every direction",
    short: "Negotiates, debates, asks why about everything",
    look: [
      "Every instruction gets a question, an objection or a counter-offer.",
      "Sharp, articulate, and often technically right about something.",
      "Pulls the adult into the debate, reliably.",
      "Does the work eventually, having argued about it first.",
    ],
    inside: [
      "Arguing delays the start, and delay is the point. The debate is usually easier than the task.",
      "For some students this is a control need rather than avoidance — being told exactly what to do with no say in it is the part that is hard.",
      "If arguing has ever changed the demand, it has been reinforced, and it will be tried again at the same price.",
      "The articulate ones get more practice at it, which is why it looks like a personality rather than a strategy.",
    ],
    ef: ["flexibility", "inhibition", "initiation", "emotional"],
    now: [
      "Answer once, briefly, then stop. The second answer is the one that starts the debate.",
      "Use a closing line and repeat it unchanged: \"I've told you where to start. I'll check in two minutes.\"",
      "Give genuine choice before the instruction rather than after — which first, which tool, which seat.",
      "Walk away. A standing adult is a negotiating partner.",
    ],
    say: [
      "“That’s a fair question. I’ll answer it once you start.”",
      "“You can disagree with me and still do it.”",
      "“Write your objection down and we’ll take it at the end.”",
      "“You’re right that it isn’t fair. It’s still the work.”",
      "“I’m not debating this one. I’ll debate the next one.”",
    ],
    avoid: [
      {
        words: "“Because I said so.”",
        why: "It confirms that the only reason is power, which is the thing the argument was testing.",
      },
      {
        words: "“I’m not arguing with you.”",
        why: "Said in the middle of arguing, it is not true, and they can hear that it is not true.",
      },
      {
        words: "“Why do you always have to question everything?”",
        why: "Always turns one moment into a character, and a character is much harder to put down.",
      },
    ],
    worse: [
      "Explaining again in more detail. It rewards the argument with exactly what it asked for.",
      "Winning the point. Being right is not the goal; starting is.",
      "Raising the stakes, which converts a negotiation into a refusal.",
    ],
    build: [
      "Build real say into the day somewhere, so control does not have to be taken by argument.",
      "Agree a private signal that means \"not now, come back to me after,\" and honour it afterwards.",
      "Track whether arguing clusters around particular work, which would make it avoidance rather than control.",
      "Teach and rehearse how to disagree in a way that works, and then let it work.",
    ],
    strategies: [
      "Broken-record redirect",
      "Choice offered before the direction",
      "Deferred-discussion signal",
      "Taught self-advocacy",
    ],
  },
  {
    id: "roaming",
    name: "Out of the seat",
    short: "Wandering, bathroom, nurse, sharpening — anywhere but here",
    look: [
      "Up and moving within minutes of independent work starting.",
      "Plausible reasons every time: water, bathroom, tissue, pencil.",
      "Frequency rises with task difficulty and falls on easy days.",
      "Often lands near the same person or the same place.",
    ],
    inside: [
      "Leaving is the most socially invisible way to not be doing the work. Nobody gets in trouble for the bathroom.",
      "For some students the movement is regulation and not avoidance at all. They work better having moved, not worse.",
      "Those two look identical from the doorway, and the difference is what happens on return: regulation comes back and works, avoidance comes back and leaves again.",
      "Sitting still for a long stretch is a real physical demand, and it is larger for some bodies than others.",
    ],
    ef: ["attention", "inhibition", "initiation", "persistence"],
    now: [
      "Let the trip happen and make it short and specific: \"Water and straight back.\"",
      "Give the movement a job — deliver this, collect those — so it is sanctioned rather than stolen.",
      "Shorten the work interval instead of lengthening the sitting. Two eight-minute blocks beat one of sixteen.",
      "Put the first step in front of them before they go, so there is something concrete to come back to.",
    ],
    say: [
      "“You can take a lap. Come back to the same page.”",
      "“Where are you going, and when are you back?”",
      "“Tell me you need a minute instead of leaving.”",
      "“You don’t owe me a reason. Just come back.”",
      "“Walk to the door and back, then sit down.”",
    ],
    avoid: [
      {
        words: "“Sit down.”",
        why: "It says where the body should be. It does not say what to do when it will not stay there.",
      },
      {
        words: "“That’s the third time.”",
        why: "A tally. Having paid for three, the fourth is worth having too.",
      },
      {
        words: "“Do you need the nurse or not?”",
        why: "It makes them commit to a story, and then they have to keep defending the story.",
      },
    ],
    worse: [
      "Refusing the bathroom. It turns a small avoidance into a dignity fight you cannot win.",
      "Tracking and counting out loud in front of the class.",
      "Making the return a confrontation, which makes leaving again more likely.",
    ],
    build: [
      "Work out which one this is by the return test — does the student work after moving, or leave again? Log it for a week.",
      "If it is regulation, schedule the movement before it is needed rather than waiting to be asked.",
      "If it is avoidance, the task is too hard or too open. Fix the task.",
      "Build in legitimate movement for the whole room, so one student's need is not a visible exception.",
    ],
    strategies: [
      "Scheduled movement break",
      "Errand or classroom job",
      "Shorter work intervals",
      "Return-test logging",
    ],
  },
  {
    id: "materials",
    name: "Can never find anything",
    short: "No pencil, no paper, work finished and lost",
    look: [
      "Backpack, desk and folder are one undifferentiated layer.",
      "Homework was done and cannot be produced.",
      "Loses the handout between receiving it and the end of the period.",
      "Spends the first minutes of every task looking for something.",
    ],
    inside: [
      "Organisation is a skill with steps, and nobody has taught the steps. Being told to be organized is not instruction.",
      "A system someone else built will not survive contact with the student. It has to be one they can run without thinking.",
      "Losing finished work is the most demoralising version of this, because the effort was real and the credit is gone.",
      "Students carrying this usually know they are the one who loses things, and it has become an identity.",
    ],
    ef: ["organization", "working", "planning", "time"],
    now: [
      "Hand them a pencil and start the work. The lesson about preparedness can wait; the lesson in front of them cannot.",
      "Give one place for the thing that matters today, and point at it.",
      "Take a photo of finished work, or collect it immediately, so it cannot be lost between here and home.",
    ],
    say: [
      "“Here’s a pencil. We’re not making it a thing.”",
      "“You’re not in trouble for losing it.”",
      "“Two minutes looking, then we move on without it.”",
      "“Where was it last? Start there.”",
      "“Take this one and put it in the same place every day.”",
    ],
    avoid: [
      {
        words: "“Where did you leave it?”",
        why: "If they knew that, it would not be lost. The question can only be answered by the one person who cannot answer it.",
      },
      {
        words: "“This is the third time this week.”",
        why: "Accurate, and there is nothing in it they can do. It buys a feeling and no pencil.",
      },
      {
        words: "“You’ll have to manage without it.”",
        why: "Now the missing pencil is the lesson, and whatever you were teaching is not.",
      },
    ],
    worse: [
      "Making them go without so they learn. They do not learn; they miss the lesson and the gap widens.",
      "Rebuilding the whole system in one conversation. It will be gone by Friday.",
      "Public commentary on the state of the desk.",
    ],
    build: [
      "Build one routine, not a system — same folder, same pocket, same time of day, checked with them for two weeks before it is theirs.",
      "Reduce the number of places something can be. Fewer folders beats better folders.",
      "Make the check part of a transition that already happens, so it needs no remembering.",
      "Fade the adult check slowly and visibly, and name it when they run it alone.",
    ],
    strategies: [
      "One-place routine",
      "Transition-anchored checks",
      "Immediate collection of finished work",
      "Faded adult support",
    ],
  },
  {
    id: "transitions",
    name: "Stuck at transitions",
    short: "Fine in the lesson, falls apart between them",
    look: [
      "Still working, or still packing, well after everyone has moved.",
      "Protests the end of an activity more than the start of the next one.",
      "The trouble clusters at the same two or three points in the day.",
      "Lines up last, arrives last, and is behind before the lesson starts.",
    ],
    inside: [
      "Stopping is a separate skill from starting, and both are hard for the same reason: the switch has to be made, held and acted on.",
      "An activity that is going well is expensive to leave. The protest is about the loss, not the next thing.",
      "A transition with no visible end point has to be tracked in the head, which is where it fails.",
      "Arriving late to the next thing means walking into a room already underway, which is its own demand.",
    ],
    ef: ["flexibility", "initiation", "time", "working"],
    now: [
      "Warn at two minutes and again at thirty seconds, and be specific about what will be happening.",
      "Name the first action of the next thing, not the next thing: \"Pencil down, folder closed, then line up.\"",
      "Give a holding place for unfinished work so stopping is not losing.",
      "Let them be the one who runs the transition — timer, door, lights. Being in charge of it removes the switch.",
    ],
    say: [
      "“Two minutes until we switch. Nothing changes yet.”",
      "“Next is math. Same seat, different book.”",
      "“Finish the sentence you’re on, then stop.”",
      "“You can be the one who tells everyone when it’s time.”",
      "“I’ll tell you before it happens, from now on.”",
    ],
    avoid: [
      {
        words: "“We’re moving on, come on.”",
        why: "The moving on is the problem. Hurrying it is simply more of the thing that is hard.",
      },
      {
        words: "“You were fine a minute ago.”",
        why: "True, and it lands as an accusation that they have chosen this.",
      },
      {
        words: "“Everyone’s waiting for you.”",
        why: "It puts an audience on the ninety seconds of the day they are least able to do.",
      },
    ],
    worse: [
      "Transitioning with no warning and then treating the lag as defiance.",
      "Taking the unfinished work away as the signal to stop.",
      "Adding a consequence for being last, which does nothing about why.",
    ],
    build: [
      "Fix the two or three worst transitions rather than all of them. Find them from the pattern, not from memory.",
      "Make the routine the same every time, so it stops needing to be decided.",
      "Teach a visible place for unfinished work and keep it reliable.",
      "Use a visual timer so remaining time is seen rather than held in mind.",
    ],
    strategies: [
      "Two-minute and thirty-second warnings",
      "First-action naming",
      "Visual timer",
      "Transition role",
      "Unfinished-work parking place",
    ],
  },
  {
    id: "onemistake",
    name: "Quits after one mistake",
    short: "One wrong answer and the whole thing is over",
    look: [
      "Crumples or scribbles out the page at the first error.",
      "“I'm bad at this” arrives fast and absolutely.",
      "Refuses to continue a task that was going fine two minutes ago.",
      "Will not try a second time even with help offered.",
    ],
    inside: [
      "The mistake is not being read as information. It is being read as a verdict that has now been confirmed in public.",
      "Students carrying a long history of struggle often have strong evidence for the verdict. Telling them it is false without changing the evidence does not work.",
      "Quitting protects against a second confirmation. It is a cost that makes sense from inside.",
      "The speed of it means there is no gap in which to think. That gap is what has to be built.",
    ],
    ef: ["persistence", "emotional", "flexibility", "metacognition"],
    now: [
      "Treat the error as ordinary, out loud and without warmth or drama: \"Yes, that line. Fix that bit.\"",
      "Point at the part that was right first, specifically, and then at the part to change.",
      "Make the next attempt small enough to be safe — one line, not the page again.",
      "Do not remove the task. Removing it agrees with the verdict.",
    ],
    say: [
      "“One wrong answer doesn’t make it a bad one.”",
      "“That’s the first thing you’ve found out. Keep going.”",
      "“Cross it out. Don’t close it.”",
      "“If you got them all right it would be too easy for you.”",
      "“You’re allowed to be wrong in here. That’s what it’s for.”",
    ],
    avoid: [
      {
        words: "“It’s only one question.”",
        why: "The size of the mistake was never what this was about.",
      },
      {
        words: "“Don’t be silly, you’re good at this.”",
        why: "It contradicts the evidence in front of them, which is a wrong answer in their own handwriting.",
      },
      {
        words: "“Just try again.”",
        why: "It asks for the same risk with nothing about the risk changed.",
      },
    ],
    worse: [
      "Over-praising the effort after the collapse. It confirms that something notable just went wrong.",
      "“You're so smart, you can do this.” It raises the cost of the next mistake.",
      "Letting the quit stand. The pattern gets shorter each time it works.",
    ],
    build: [
      "Change the evidence, not the self-talk. Arrange work where they succeed after an error, repeatedly, and name that sequence when it happens.",
      "Make errors visible and routine in the room, including yours.",
      "Give feedback on the specific move rather than on the person.",
      "Keep work in the band where mistakes are frequent and recoverable.",
    ],
    strategies: [
      "Error-normalising language",
      "Specific process feedback",
      "Recoverable-difficulty task design",
      "Success-after-error sequences",
    ],
    research: [
      {
        claim:
          "What is learned from adversity is the expectation of control, and it is built by experience of acting and having it matter — not by being told that effort pays.",
        source:
          "Maier, S. F., & Seligman, M. E. P. (2016). Learned helplessness at fifty: Insights from neuroscience. Psychological Review, 123(4), 349–367.",
        supports:
          "Arranging real instances of recovering from an error does more than any amount of encouragement. The sequence is the intervention.",
        limits:
          "It does not say encouragement is harmful or that mindset language is useless, only that it is not the active part. Classroom mindset effects in particular are small and inconsistent in large replications.",
      },
    ],
  },
  {
    id: "reassurance",
    name: "Needs constant reassurance",
    short: "“Is this right?” after every line",
    look: [
      "Hand up, or at your elbow, every few minutes.",
      "Will not move to the next item until the last one is confirmed.",
      "Apologises often, and for things that need no apology.",
      "Work is usually correct, and they do not believe it is.",
    ],
    inside: [
      "The checking is not about the answer. It is about whether they are still all right, and the answer is just the thing to ask about.",
      "Being wrong feels expensive, so they would rather spend the time checking than risk a whole page of it.",
      "Every confirmation works briefly and raises the need slightly. The relief is real and does not last.",
      "This student often takes up less of a teacher's worry than they should, because the work looks fine.",
    ],
    ef: ["metacognition", "emotional", "persistence", "initiation"],
    now: [
      "Answer the question, then hand the next one back: \"That's right. Do the next two, then I'll look.\"",
      "Set a batch size before they begin — check after three, not after each.",
      "Give them a way to check that is not you: a key, a partner, a model answer.",
      "Reflect the judgement back: \"What do you think?\" and accept their answer when it is right.",
    ],
    say: [
      "“Do three more, then ask me.”",
      "“What do you think? I’ll tell you if you’re wrong.”",
      "“You already know that one’s right. Tell me why.”",
      "“I’m not checking every line, because you don’t need me to.”",
      "“Ask me when you’re stuck, not when you’re unsure.”",
    ],
    avoid: [
      {
        words: "“Yes, that’s right.”",
        why: "Kind, and it buys the next question. Five seconds of relief, and the loop is now a little stronger.",
      },
      {
        words: "“You don’t need me, you know this.”",
        why: "They do not feel that, so what arrives is being sent away at the moment they asked for help.",
      },
      {
        words: "“Stop asking me.”",
        why: "It removes the question and puts nothing in its place, so the next one is asked more anxiously or not at all.",
      },
    ],
    worse: [
      "Confirming every item. It is kind and it feeds the loop.",
      "Refusing to answer at all, which raises the anxiety the checking was managing.",
      "Reassuring in general terms — \"you're fine\" — when what is wanted is a specific check they can learn to run themselves.",
    ],
    build: [
      "Grow the batch slowly: every item, then every three, then end of page. Make the growth visible to them.",
      "Teach a self-check they can run, so the need has somewhere to go that is not an adult.",
      "Let them be right out loud. Ask the judgement question and then agree with it.",
      "Watch for whether this is anxiety rather than skill. Persistent apologizing is worth a conversation with the family and the counselor.",
    ],
    strategies: [
      "Batched checking",
      "Self-check routine",
      "Answer key or model access",
      "Reflecting the judgement back",
      "Faded adult confirmation",
    ],
  },
];

/** Signals that put the same executive function skill under load. */
export const bySkill = (key: EFKey) => SIGNALS.filter((s) => s.ef.includes(key));

/** Every strategy named across the signals, with what it is called for. */
export function strategyIndex() {
  const index = new Map<string, string[]>();
  for (const s of SIGNALS) {
    for (const name of s.strategies) {
      index.set(name, [...(index.get(name) || []), s.name]);
    }
  }
  return [...index.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
}
