/**
 * Kindergarten informational articles: 50 of them, five for each of RI.K.1 to
 * RI.K.10, alternating science and social studies.
 *
 * Held to the bands in scripts/reading-article-plan.json: three or four
 * paragraphs, a higher version at LL 120-230 and a lower one at LL 0-110 with
 * the same lettered paragraphs, five questions of the five named kinds.
 *
 * A paragraph here is one sentence, so the article is four sentences long and
 * every one has to earn its place. Several RI.K standards are about the book
 * as an object -- front cover, title page, who the author is and who the
 * illustrator is -- and those articles take the book itself as the subject,
 * since a five-year-old cannot name a part they have never been shown.
 *
 * Every standard begins "with prompting and support", which is not decoration:
 * these are read aloud with an adult. The teacher notes say what to stop and
 * ask rather than assuming the child reads it alone.
 *
 *   bun run scripts/articles/g0.src.mjs && bun run scripts/merge-articles.mjs
 *   bun run scripts/check-articles.mjs
 */
import { grade } from "./build.mjs";

const STD = {
  1: {
    text: "With prompting and support, ask and answer questions about key details in a text.",
    spiral: "RI.K.2 main topic · RI.K.4 unknown words · RI.K.7 illustrations · RI.K.10 group reading",
  },
  2: {
    text: "With prompting and support, identify the main topic and retell key details of a text.",
    spiral: "RI.K.1 key details · RI.K.3 connections · RI.K.7 illustrations · RI.K.10 group reading",
  },
  3: {
    text: "With prompting and support, describe the connection between two individuals, events, ideas, or pieces of information in a text.",
    spiral: "RI.K.1 key details · RI.K.2 main topic · RI.K.8 reasons · RI.K.10 group reading",
  },
  4: {
    text: "With prompting and support, ask and answer questions about unknown words in a text.",
    spiral: "RI.K.1 key details · RI.K.2 main topic · RI.K.5 parts of a book · RI.K.10 group reading",
  },
  5: {
    text: "Identify the front cover, back cover, and title page of a book.",
    spiral: "RI.K.4 unknown words · RI.K.6 author and illustrator · RI.K.7 illustrations · RI.K.10 group reading",
  },
  6: {
    text: "Name the author and illustrator of a text and define the role of each in presenting the ideas or information in a text.",
    spiral: "RI.K.5 parts of a book · RI.K.7 illustrations · RI.K.9 comparing texts · RI.K.10 group reading",
  },
  7: {
    text: "With prompting and support, describe the relationship between illustrations and the text in which they appear.",
    spiral: "RI.K.1 key details · RI.K.2 main topic · RI.K.6 author and illustrator · RI.K.10 group reading",
  },
  8: {
    text: "With prompting and support, identify the reasons an author gives to support points in a text.",
    spiral: "RI.K.1 key details · RI.K.3 connections · RI.K.9 comparing texts · RI.K.10 group reading",
  },
  9: {
    text: "With prompting and support, identify basic similarities in and differences between two texts on the same topic.",
    spiral: "RI.K.2 main topic · RI.K.6 author and illustrator · RI.K.8 reasons · RI.K.10 group reading",
  },
  10: {
    text: "Actively engage in group reading activities with purpose and understanding.",
    spiral: "RI.K.1 key details · RI.K.2 main topic · RI.K.4 unknown words · RI.K.8 reasons",
  },
};

const ARTICLES = [
  // ---------------------------------------------------------------- RI.K.1
  {
    t: "A Duck on the Pond",
    std: 1, hi: 180, lo: 80,
    H: [
      "A duck has soft feathers under its wings.",
      "Oil on the top feathers keeps the water out.",
      "The soft ones under them stay dry.",
      "So the duck stays warm all day long.",
    ],
    L: [
      "A duck has soft feathers under its wings.",
      "Oil on top keeps the water out.",
      "The soft ones stay dry.",
      "The duck stays warm.",
    ],
    q: [
      { k: "main idea/detail", q: "What keeps the water out?", a: "Oil on the top feathers keeps the water out." },
      { k: "paragraph focus", q: "Paragraph C (i.e. the soft feathers) and paragraph D (i.e. staying warm)." },
      { k: "summarize", q: "Tell what this is about.", a: "A duck has soft feathers under its wings. Oil on the top feathers keeps the water out, so the soft ones stay dry and the duck stays warm." },
      { k: "vocabulary", q: "feathers: what covers a bird.\noil: a slippery stuff that water runs off." },
      { k: "connection", q: "Describe the connection between the oil and the duck staying warm.", a: "Oil on the top feathers keeps the water out, so the soft ones under them stay dry and the duck stays warm." },
    ],
    note: "Read it twice. The second time, stop after each paragraph and ask what that one sentence told you.",
  },
  {
    t: "The Crossing Light",
    std: 1, hi: 160, lo: 70,
    H: [
      "A white walking man means you may cross.",
      "A red hand means you must wait.",
      "The numbers count down the seconds left.",
      "Look both ways even when the man is white.",
    ],
    L: [
      "A white man means you may cross.",
      "A red hand means wait.",
      "Numbers count down the seconds.",
      "Always look both ways too.",
    ],
    q: [
      { k: "main idea/detail", q: "What does the red hand mean?", a: "A red hand means you must wait." },
      { k: "paragraph focus", q: "Paragraph C (i.e. the numbers) and paragraph D (i.e. looking both ways)." },
      { k: "summarize", q: "Tell what the crossing light shows.", a: "A white walking man means you may cross and a red hand means you must wait. The numbers count down the seconds left, and you look both ways even when the man is white." },
      { k: "vocabulary", q: "cross: to walk from one side to the other.\ncount down: to go backward, like five, four, three." },
      { k: "connection", q: "Describe the connection between the white man and looking both ways.", a: "You look both ways even when the man is white, because the light tells cars to stop but cannot make them." },
    ],
    note: "Paragraph D is the one that matters most and it comes last. Say it again at the end.",
  },
  {
    t: "Where a Bear Sleeps",
    std: 1, hi: 170, lo: 75,
    H: [
      "A bear finds a cave or a hole in winter.",
      "It sleeps there for many months.",
      "It does not eat the whole time.",
      "In spring it comes out thin and hungry.",
    ],
    L: [
      "A bear finds a cave in winter.",
      "It sleeps for many months.",
      "It does not eat.",
      "In spring it comes out hungry.",
    ],
    q: [
      { k: "main idea/detail", q: "Where does the bear sleep?", a: "A bear finds a cave or a hole in winter." },
      { k: "paragraph focus", q: "Paragraph C (i.e. not eating) and paragraph D (i.e. spring)." },
      { k: "summarize", q: "Tell what a bear does in winter.", a: "A bear finds a cave or a hole, sleeps there for many months without eating, and comes out thin and hungry in spring." },
      { k: "vocabulary", q: "cave: a hole in rock big enough to go into.\nspring: the season that comes after winter." },
      { k: "connection", q: "Describe the connection between not eating and being hungry.", a: "It does not eat the whole time, so in spring it comes out thin and hungry." },
    ],
    note: "Four paragraphs, four steps, in order. Count them on your fingers with the child.",
  },
  {
    t: "The School Nurse",
    std: 1, hi: 190, lo: 90,
    H: [
      "The nurse has a small room by the office.",
      "She keeps bandages, ice packs and a cot.",
      "She writes down every child who comes in.",
      "She calls home if a child needs to go.",
    ],
    L: [
      "The nurse has a room by the office.",
      "She keeps bandages and ice packs.",
      "She writes down who comes in.",
      "She calls home if you need to go.",
    ],
    q: [
      { k: "main idea/detail", q: "What does the nurse keep?", a: "She keeps bandages, ice packs and a cot." },
      { k: "paragraph focus", q: "Paragraph C (i.e. writing it down) and paragraph D (i.e. calling home)." },
      { k: "summarize", q: "Tell what the school nurse does.", a: "The nurse has a small room by the office with bandages, ice packs and a cot. She writes down every child who comes in, and she calls home if a child needs to go." },
      { k: "vocabulary", q: "bandage: a cover that goes on a cut.\ncot: a small bed you can lie down on." },
      { k: "connection", q: "Describe the connection between writing it down and calling home.", a: "She writes down every child who comes in, so she knows who to call home about." },
    ],
    note: "Children know this room. Ask what they have seen in it before you read a word.",
  },
  {
    t: "How a Snail Moves",
    std: 1, hi: 175, lo: 85,
    H: [
      "A snail has one wide foot under its shell.",
      "It makes slime to slide along.",
      "The slime lets it cross a sharp edge.",
      "You can see the shiny trail it left.",
    ],
    L: [
      "A snail has one foot under its shell.",
      "It makes slime to slide on.",
      "The slime keeps it safe.",
      "You can see its shiny trail.",
    ],
    q: [
      { k: "main idea/detail", q: "What does the snail make?", a: "It makes slime to slide along." },
      { k: "paragraph focus", q: "Paragraph C (i.e. the sharp edge) and paragraph D (i.e. the trail)." },
      { k: "summarize", q: "Tell how a snail moves.", a: "A snail has one wide foot under its shell. It makes slime to slide along, the slime lets it cross a sharp edge, and you can see the shiny trail it left." },
      { k: "vocabulary", q: "slime: wet slippery stuff.\ntrail: the mark something leaves behind." },
      { k: "connection", q: "Describe the connection between the slime and the trail.", a: "It makes slime to slide along, and you can see the shiny trail it left." },
    ],
    note: "Paragraph C is the surprise: the slime is protection, not just slipperiness.",
  },
  // ---------------------------------------------------------------- RI.K.2
  {
    t: "Winter Coats",
    std: 2, hi: 195, lo: 95,
    H: [
      "A dog grows thicker fur when it gets cold.",
      "The thick fur holds warm air near the skin.",
      "In spring the dog sheds it again.",
      "A coat of fur comes and goes with the year.",
    ],
    L: [
      "A dog grows thicker fur when it is cold.",
      "The fur holds warm air near the skin.",
      "In spring the dog sheds it.",
      "The fur comes and goes.",
    ],
    q: [
      { k: "main idea/detail", q: "What does the thick fur hold?", a: "The thick fur holds warm air near the skin." },
      { k: "paragraph focus", q: "Paragraph A (i.e. growing fur) and paragraph C (i.e. shedding it)." },
      { k: "summarize", q: "Tell what this is about.", a: "A dog grows thicker fur when it gets cold, and the thick fur holds warm air near the skin. In spring the dog sheds it, so a coat of fur comes and goes with the year." },
      { k: "vocabulary", q: "fur: the hair that covers an animal.\nsheds: drops off." },
      { k: "connection", q: "Describe the connection between the cold and the thick fur.", a: "A dog grows thicker fur when it gets cold, and sheds it again in spring." },
    ],
    note: "The topic is the whole year, not just winter. Paragraph D is what says so.",
  },
  {
    t: "The Grocery Cart",
    std: 2, hi: 165, lo: 75,
    H: [
      "A cart has four wheels and a deep basket.",
      "The two front wheels can turn any way.",
      "That is how you steer around a corner.",
      "The back wheels only roll straight.",
    ],
    L: [
      "A cart has four wheels and a basket.",
      "The front wheels turn any way.",
      "That is how you steer.",
      "The back wheels roll straight.",
    ],
    q: [
      { k: "main idea/detail", q: "Which wheels can turn any way?", a: "The two front wheels can turn any way." },
      { k: "paragraph focus", q: "Paragraph C (i.e. steering) and paragraph D (i.e. the back wheels)." },
      { k: "summarize", q: "Tell what this is about.", a: "A cart has four wheels and a deep basket. The two front wheels can turn any way, which is how you steer around a corner, and the back wheels only roll straight." },
      { k: "vocabulary", q: "steer: to make something go the way you want.\nbasket: the part that holds what you put in." },
      { k: "connection", q: "Describe the connection between the front wheels and steering.", a: "The two front wheels can turn any way, and that is how you steer around a corner." },
    ],
    note: "Have the child push a cart and watch the wheels. The text will make sense in one trip.",
  },
  {
    t: "Seeds in the Wind",
    std: 2, hi: 200, lo: 100,
    H: [
      "A dandelion seed has a tiny white parachute.",
      "The wind lifts it high off the stem.",
      "It can land far from the plant it came from.",
      "That is how one plant fills a whole yard.",
    ],
    L: [
      "A dandelion seed has a white top.",
      "The wind lifts it off the stem.",
      "It can land far away.",
      "That is how a yard fills up.",
    ],
    q: [
      { k: "main idea/detail", q: "What lifts the seed?", a: "The wind lifts it high off the stem." },
      { k: "paragraph focus", q: "Paragraph A (i.e. the parachute) and paragraph D (i.e. filling a yard)." },
      { k: "summarize", q: "Tell what this is about.", a: "A dandelion seed has a tiny white parachute. The wind lifts it high off the stem and it can land far from the plant it came from, which is how one plant fills a whole yard." },
      { k: "vocabulary", q: "parachute: a soft top that catches the air.\nstem: the part that holds a plant up." },
      { k: "connection", q: "Describe the connection between the parachute and landing far away.", a: "The seed has a tiny white parachute, so the wind lifts it high and it can land far from the plant it came from." },
    ],
    note: "Blow a real dandelion if you can. Paragraph D is the part they will remember.",
  },
  {
    t: "The Library Shelf",
    std: 2, hi: 155, lo: 65,
    H: [
      "Picture books sit on the low shelves.",
      "The low shelves are where children can reach.",
      "Thick books sit up high for big readers.",
      "Every shelf has a letter on the end.",
    ],
    L: [
      "Picture books sit on the low shelves.",
      "Children can reach the low shelves.",
      "Thick books sit up high.",
      "Each shelf has a letter.",
    ],
    q: [
      { k: "main idea/detail", q: "Where do picture books sit?", a: "Picture books sit on the low shelves." },
      { k: "paragraph focus", q: "Paragraph B (i.e. reaching) and paragraph D (i.e. the letters)." },
      { k: "summarize", q: "Tell what this is about.", a: "Picture books sit on the low shelves where children can reach, thick books sit up high for big readers, and every shelf has a letter on the end." },
      { k: "vocabulary", q: "shelf: a flat board that holds books.\nreach: to be able to touch." },
      { k: "connection", q: "Describe the connection between the low shelves and children.", a: "Picture books sit on the low shelves, because the low shelves are where children can reach." },
    ],
    note: "Ask the child to find the letter on the end of their own shelf at school.",
  },
  {
    t: "Why Ice Floats",
    std: 2, hi: 210, lo: 105,
    H: [
      "Water gets bigger when it turns to ice.",
      "A bigger piece of the same water is lighter.",
      "So ice floats on top instead of sinking.",
      "That is why a pond freezes from the top.",
    ],
    L: [
      "Water gets bigger when it freezes.",
      "Bigger means lighter here.",
      "So ice floats on top.",
      "A pond freezes from the top down.",
    ],
    q: [
      { k: "main idea/detail", q: "What happens to water when it freezes?", a: "Water gets bigger when it turns to ice." },
      { k: "paragraph focus", q: "Paragraph C (i.e. floating) and paragraph D (i.e. the pond)." },
      { k: "summarize", q: "Tell what this is about.", a: "Water gets bigger when it turns to ice, and a bigger piece of the same water is lighter. So ice floats on top instead of sinking, which is why a pond freezes from the top." },
      { k: "vocabulary", q: "floats: stays up on top of the water.\nfreezes: turns into ice." },
      { k: "connection", q: "Describe the connection between ice being lighter and a pond freezing on top.", a: "A bigger piece of the same water is lighter, so ice floats on top and a pond freezes from the top down." },
    ],
    note: "This one is hard and worth it. Put an ice cube in a glass and watch where it sits.",
  },
  // ---------------------------------------------------------------- RI.K.3
  {
    t: "Rain and the Worm",
    std: 3, hi: 185, lo: 85,
    H: [
      "Worms live in little tunnels in the dirt.",
      "When it rains hard, the tunnels fill with water.",
      "The worms come up so they can breathe.",
      "That is why you see them on the path.",
    ],
    L: [
      "Worms live in tunnels in the dirt.",
      "Rain fills the tunnels with water.",
      "The worms come up to breathe.",
      "You see them on the path.",
    ],
    q: [
      { k: "main idea/detail", q: "Where do worms live?", a: "Worms live in little tunnels in the dirt." },
      { k: "paragraph focus", q: "Paragraph B (i.e. the rain) and paragraph C (i.e. coming up)." },
      { k: "summarize", q: "Tell what this is about.", a: "Worms live in tunnels in the dirt. When it rains hard the tunnels fill with water, so the worms come up to breathe, and that is why you see them on the path." },
      { k: "vocabulary", q: "tunnel: a hole that goes along under the ground.\nbreathe: to take in air." },
      { k: "connection", q: "Describe the connection between the rain and the worms on the path.", a: "When it rains hard the tunnels fill with water, so the worms come up so they can breathe and you see them on the path." },
    ],
    note: "Go out after rain and look. The child will have the answer before you read a word.",
  },
  {
    t: "The Sun and the Shadow",
    std: 3, hi: 195, lo: 95,
    H: [
      "A shadow is made when you block the sun.",
      "In the morning your shadow is very long.",
      "At noon the sun is high and it is short.",
      "The shadow moves all day as the sun moves.",
    ],
    L: [
      "A shadow comes when you block the sun.",
      "In the morning it is long.",
      "At noon it is short.",
      "It moves as the sun moves.",
    ],
    q: [
      { k: "main idea/detail", q: "When is your shadow long?", a: "In the morning your shadow is very long." },
      { k: "paragraph focus", q: "Paragraph C (i.e. noon) and paragraph D (i.e. moving all day)." },
      { k: "summarize", q: "Tell what this is about.", a: "A shadow is made when you block the sun. In the morning your shadow is very long, at noon the sun is high and it is short, and the shadow moves all day as the sun moves." },
      { k: "vocabulary", q: "shadow: the dark shape you make in the sun.\nblock: to get in the way of." },
      { k: "connection", q: "Describe the connection between the sun and the shadow's size.", a: "At noon the sun is high and the shadow is short, so the shadow moves and changes all day as the sun moves." },
    ],
    note: "Chalk around a shadow in the morning and look again at lunch. The text is the explanation.",
  },
  {
    t: "The Line and the Door",
    std: 3, hi: 165, lo: 70,
    H: [
      "Our class makes a line before we go out.",
      "The line keeps everybody together in the hall.",
      "The leader stops at the door and waits.",
      "Then the teacher can count us all.",
    ],
    L: [
      "Our class makes a line to go out.",
      "The line keeps us together.",
      "The leader waits at the door.",
      "The teacher counts us.",
    ],
    q: [
      { k: "main idea/detail", q: "What does the line do?", a: "The line keeps everybody together in the hall." },
      { k: "paragraph focus", q: "Paragraph C (i.e. the leader waiting) and paragraph D (i.e. counting)." },
      { k: "summarize", q: "Tell what this is about.", a: "Our class makes a line before we go out. The line keeps everybody together in the hall, the leader stops at the door and waits, and then the teacher can count us all." },
      { k: "vocabulary", q: "leader: the person at the front.\ncount: to say how many." },
      { k: "connection", q: "Describe the connection between the leader waiting and the teacher counting.", a: "The leader stops at the door and waits, so the teacher can count us all." },
    ],
    note: "This is their own routine. Ask what goes wrong when the leader does not wait.",
  },
  {
    t: "The Bird and the Berry",
    std: 3, hi: 175, lo: 80,
    H: [
      "A bird eats a red berry off a bush.",
      "The seed inside goes right through the bird.",
      "It lands far away in a new spot.",
      "A new bush can grow from that seed.",
    ],
    L: [
      "A bird eats a red berry.",
      "The seed goes through the bird.",
      "It lands far away.",
      "A new bush can grow there.",
    ],
    q: [
      { k: "main idea/detail", q: "What does the bird eat?", a: "A bird eats a red berry off a bush." },
      { k: "paragraph focus", q: "Paragraph B (i.e. the seed) and paragraph D (i.e. the new bush)." },
      { k: "summarize", q: "Tell what this is about.", a: "A bird eats a red berry off a bush. The seed inside goes right through the bird and lands far away in a new spot, and a new bush can grow from that seed." },
      { k: "vocabulary", q: "berry: a small soft fruit.\nseed: the part a new plant grows from." },
      { k: "connection", q: "Describe the connection between the bird and the new bush.", a: "The seed goes right through the bird and lands far away, so a new bush can grow from that seed." },
    ],
    note: "The bird is doing the plant a favor without meaning to. Say that part out loud.",
  },
  {
    t: "The Bell and the Bus",
    std: 3, hi: 155, lo: 65,
    H: [
      "The last bell rings at three o'clock.",
      "The buses are already waiting in a row.",
      "Each bus has a number on the front.",
      "You find your own number and get on.",
    ],
    L: [
      "The last bell rings at three.",
      "The buses wait in a row.",
      "Each bus has a number.",
      "You find your number and get on.",
    ],
    q: [
      { k: "main idea/detail", q: "What is on the front of each bus?", a: "Each bus has a number on the front." },
      { k: "paragraph focus", q: "Paragraph B (i.e. the buses waiting) and paragraph D (i.e. finding your number)." },
      { k: "summarize", q: "Tell what this is about.", a: "The last bell rings at three o'clock, the buses are already waiting in a row, each bus has a number on the front, and you find your own number and get on." },
      { k: "vocabulary", q: "row: a line side by side.\nnumber: a figure like 7 or 12." },
      { k: "connection", q: "Describe the connection between the number and getting on the right bus.", a: "Each bus has a number on the front, so you find your own number and get on." },
    ],
    note: "Ask the child their bus number before you read. Then read, and see if they smile.",
  },
  // ---------------------------------------------------------------- RI.K.4
  {
    t: "What Shed Means",
    std: 4, hi: 190, lo: 90,
    H: [
      "The book says a snake will shed its skin.",
      "Shed means to let something drop off.",
      "The old skin comes off in one long piece.",
      "A new skin was waiting underneath.",
    ],
    L: [
      "The book says a snake will shed its skin.",
      "Shed means to let it drop off.",
      "The old skin comes off whole.",
      "A new skin is under it.",
    ],
    q: [
      { k: "main idea/detail", q: "What does shed mean?", a: "Shed means to let something drop off." },
      { k: "paragraph focus", q: "Paragraph C (i.e. the old skin) and paragraph D (i.e. the new one)." },
      { k: "summarize", q: "Tell what shed means.", a: "The book says a snake will shed its skin. Shed means to let something drop off, the old skin comes off in one long piece, and a new skin was waiting underneath." },
      { k: "vocabulary", q: "shed: to let something drop off.\nunderneath: under something else." },
      { k: "connection", q: "Describe the connection between the old skin and the new one.", a: "The old skin comes off in one long piece, and a new skin was waiting underneath." },
    ],
    note: "Paragraph B is the answer and the others are the proof. Ask which sentence gives the meaning.",
  },
  {
    t: "What Recess Means",
    std: 4, hi: 160, lo: 70,
    H: [
      "The note says recess is after lunch.",
      "Recess means time outside to play.",
      "You can run, climb or sit with a friend.",
      "A bell ends recess and then you line up.",
    ],
    L: [
      "The note says recess is after lunch.",
      "Recess means time outside to play.",
      "You can run or climb.",
      "A bell ends recess.",
    ],
    q: [
      { k: "main idea/detail", q: "What does recess mean?", a: "Recess means time outside to play." },
      { k: "paragraph focus", q: "Paragraph C (i.e. what you can do) and paragraph D (i.e. the bell)." },
      { k: "summarize", q: "Tell what recess means.", a: "The note says recess is after lunch. Recess means time outside to play, you can run, climb or sit with a friend, and a bell ends recess and then you line up." },
      { k: "vocabulary", q: "recess: time outside to play.\nends: stops." },
      { k: "connection", q: "Describe the connection between the bell and lining up.", a: "A bell ends recess and then you line up." },
    ],
    note: "They live this word every day and may never have been told what it means.",
  },
  {
    t: "What Hatch Means",
    std: 4, hi: 180, lo: 85,
    H: [
      "The book says the chick will hatch today.",
      "Hatch means to come out of an egg.",
      "The chick pecks the shell from inside.",
      "It takes many hours and nobody helps it.",
    ],
    L: [
      "The book says the chick will hatch.",
      "Hatch means to come out of an egg.",
      "The chick pecks the shell.",
      "Nobody helps it.",
    ],
    q: [
      { k: "main idea/detail", q: "What does hatch mean?", a: "Hatch means to come out of an egg." },
      { k: "paragraph focus", q: "Paragraph C (i.e. pecking) and paragraph D (i.e. no help)." },
      { k: "summarize", q: "Tell what hatch means.", a: "The book says the chick will hatch today. Hatch means to come out of an egg, the chick pecks the shell from inside, and it takes many hours and nobody helps it." },
      { k: "vocabulary", q: "hatch: to come out of an egg.\npecks: hits with a beak." },
      { k: "connection", q: "Describe the connection between pecking and hatching.", a: "The chick pecks the shell from inside, which is how it comes out of the egg." },
    ],
    note: "Paragraph D is the hard part to hear. Children want to help, and the text says not to.",
  },
  {
    t: "What Line Up Means",
    std: 4, hi: 170, lo: 75,
    H: [
      "The teacher says to line up at the door.",
      "Line up means to stand one behind another.",
      "You leave a little space in front of you.",
      "Then the line can walk without bumping.",
    ],
    L: [
      "The teacher says to line up at the door.",
      "Line up means to stand one behind another.",
      "Leave a little space in front.",
      "Then nobody bumps.",
    ],
    q: [
      { k: "main idea/detail", q: "What does line up mean?", a: "Line up means to stand one behind another." },
      { k: "paragraph focus", q: "Paragraph C (i.e. the space) and paragraph D (i.e. not bumping)." },
      { k: "summarize", q: "Tell what line up means.", a: "The teacher says to line up at the door. Line up means to stand one behind another, you leave a little space in front of you, and then the line can walk without bumping." },
      { k: "vocabulary", q: "line up: to stand one behind another.\nspace: the gap between two things." },
      { k: "connection", q: "Describe the connection between the space and not bumping.", a: "You leave a little space in front of you, so then the line can walk without bumping." },
    ],
    note: "Practice paragraph C with arms out. The space becomes obvious in one try.",
  },
  {
    t: "What Bloom Means",
    std: 4, hi: 200, lo: 100,
    H: [
      "The sign says the tulips will bloom in April.",
      "Bloom means to open into a flower.",
      "Before that the bud is closed and green.",
      "After it blooms the petals show their color.",
    ],
    L: [
      "The sign says the tulips will bloom.",
      "Bloom means to open into a flower.",
      "First the bud is closed and green.",
      "Then the petals show their color.",
    ],
    q: [
      { k: "main idea/detail", q: "What does bloom mean?", a: "Bloom means to open into a flower." },
      { k: "paragraph focus", q: "Paragraph C (i.e. the closed bud) and paragraph D (i.e. the petals)." },
      { k: "summarize", q: "Tell what bloom means.", a: "The sign says the tulips will bloom in April. Bloom means to open into a flower, before that the bud is closed and green, and after it blooms the petals show their color." },
      { k: "vocabulary", q: "bloom: to open into a flower.\nbud: a closed flower before it opens." },
      { k: "connection", q: "Describe the connection between the bud and the petals.", a: "Before it blooms the bud is closed and green, and after it blooms the petals show their color." },
    ],
    note: "Before and after is the shape here. Ask which paragraph is before and which is after.",
  },
  // ---------------------------------------------------------------- RI.K.5
  {
    t: "The Front of a Book",
    std: 5, hi: 175, lo: 80,
    H: [
      "The front cover is the first thing you see.",
      "It has the name of the book on it.",
      "It usually has a big picture too.",
      "The front cover tells you what is inside.",
    ],
    L: [
      "The front cover is what you see first.",
      "It has the name of the book.",
      "It has a big picture.",
      "It tells you what is inside.",
    ],
    q: [
      { k: "main idea/detail", q: "What is on the front cover?", a: "It has the name of the book on it." },
      { k: "paragraph focus", q: "Paragraph C (i.e. the picture) and paragraph D (i.e. what is inside)." },
      { k: "summarize", q: "Tell what the front cover does.", a: "The front cover is the first thing you see. It has the name of the book and usually a big picture, and it tells you what is inside." },
      { k: "vocabulary", q: "cover: the outside of a book.\nname: what a thing is called." },
      { k: "connection", q: "Describe the connection between the picture and what is inside.", a: "The front cover usually has a big picture, and the front cover tells you what is inside." },
    ],
    note: "Hold a real book. Point at the front cover before you say anything about it.",
  },
  {
    t: "The Back of a Book",
    std: 5, hi: 205, lo: 105,
    H: [
      "Turn the book over to find the back cover.",
      "The back often tells you a little about the story.",
      "It can have stars or words from readers.",
      "The price is usually printed down in a corner.",
    ],
    L: [
      "Turn the book over to find the back.",
      "The back tells a little about the story.",
      "It can have words from readers.",
      "The price is in a corner.",
    ],
    q: [
      { k: "main idea/detail", q: "What does the back cover tell you?", a: "The back often tells you a little about the story." },
      { k: "paragraph focus", q: "Paragraph C (i.e. words from readers) and paragraph D (i.e. the price)." },
      { k: "summarize", q: "Tell what the back cover has on it.", a: "Turn the book over to find the back cover. It often tells you a little about the story, it can have stars or words from readers, and the price is usually printed in a corner." },
      { k: "vocabulary", q: "back cover: the outside at the end of a book.\nprice: how much something costs." },
      { k: "connection", q: "Describe the connection between the front cover and the back cover.", a: "The front cover is the first thing you see, and you turn the book over to find the back cover." },
    ],
    note: "Front and back as a pair. Have the child flip a book over and name each one.",
  },
  {
    t: "The Title Page",
    std: 5, hi: 215, lo: 110,
    H: [
      "Open the cover and turn one or two pages.",
      "The title page says the name of the book again.",
      "It also says who wrote it and who drew it.",
      "The front cover is outside and this page is inside.",
    ],
    L: [
      "Open the cover and turn a page.",
      "The title page says the name again.",
      "It says who wrote it and who drew it.",
      "The cover is outside and this is inside.",
    ],
    q: [
      { k: "main idea/detail", q: "What does the title page say?", a: "The title page says the name of the book again." },
      { k: "paragraph focus", q: "Paragraph C (i.e. who wrote and drew it) and paragraph D (i.e. inside and outside)." },
      { k: "summarize", q: "Tell what the title page is.", a: "Open the cover and turn one or two pages to find the title page. It says the name of the book again and who wrote it and who drew it. The front cover is outside and the title page is inside." },
      { k: "vocabulary", q: "title: the name of a book.\ntitle page: the page inside that gives the name again." },
      { k: "connection", q: "Describe the connection between the front cover and the title page.", a: "The front cover is outside and this page is inside, and both of them say the name of the book." },
    ],
    note: "The repeat confuses children. Say plainly that the name appears twice on purpose.",
  },
  {
    t: "Which Way Is Up",
    std: 5, hi: 185, lo: 90,
    H: [
      "A book has a top and a bottom.",
      "The words go the right way up when you hold it right.",
      "The spine stays on your left as you read.",
      "Turn pages from the right to the left.",
    ],
    L: [
      "A book has a top and a bottom.",
      "Hold it so the words are the right way up.",
      "The spine stays on your left.",
      "Turn pages right to left.",
    ],
    q: [
      { k: "main idea/detail", q: "Where does the spine stay?", a: "The spine stays on your left as you read." },
      { k: "paragraph focus", q: "Paragraph B (i.e. the words the right way up) and paragraph D (i.e. turning pages)." },
      { k: "summarize", q: "Tell how to hold a book.", a: "A book has a top and a bottom. You hold it so the words go the right way up, the spine stays on your left as you read, and you turn pages from the right to the left." },
      { k: "vocabulary", q: "spine: the folded edge where a book is held together.\nturn: to move a page over." },
      { k: "connection", q: "Describe the connection between the spine and turning pages.", a: "The spine stays on your left as you read, so you turn pages from the right to the left." },
    ],
    note: "Do it with them rather than telling them. Hand over a book upside down and wait.",
  },
  {
    t: "The Spine of a Book",
    std: 5, hi: 170, lo: 75,
    H: [
      "The spine is the folded edge of a book.",
      "It holds all the pages together.",
      "The name is printed down the spine.",
      "That is how you find a book on a shelf.",
    ],
    L: [
      "The spine is the folded edge.",
      "It holds the pages together.",
      "The name is printed on it.",
      "That is how you find it on a shelf.",
    ],
    q: [
      { k: "main idea/detail", q: "What does the spine hold?", a: "It holds all the pages together." },
      { k: "paragraph focus", q: "Paragraph C (i.e. the printed name) and paragraph D (i.e. finding it on a shelf)." },
      { k: "summarize", q: "Tell what the spine of a book is.", a: "The spine is the folded edge of a book. It holds all the pages together, the name is printed down the spine, and that is how you find a book on a shelf." },
      { k: "vocabulary", q: "spine: the folded edge that holds a book together.\nshelf: a flat board that holds books." },
      { k: "connection", q: "Describe the connection between the name on the spine and finding a book.", a: "The name is printed down the spine, and that is how you find a book on a shelf." },
    ],
    note: "Stand a book on a shelf and ask what you can still see. Only the spine.",
  },
  // ---------------------------------------------------------------- RI.K.6
  {
    t: "Who Wrote It",
    std: 6, hi: 185, lo: 85,
    H: [
      "The author is the person who wrote the words.",
      "The author decides what the book will tell you.",
      "You can find the name on the front cover.",
      "The same author may write many books.",
    ],
    L: [
      "The author wrote the words.",
      "The author decides what the book says.",
      "The name is on the front cover.",
      "One author can write many books.",
    ],
    q: [
      { k: "main idea/detail", q: "What does the author do?", a: "The author is the person who wrote the words." },
      { k: "paragraph focus", q: "Paragraph B (i.e. deciding what the book tells you) and paragraph D (i.e. many books)." },
      { k: "summarize", q: "Tell what an author does.", a: "The author is the person who wrote the words and decides what the book will tell you. You can find the name on the front cover, and the same author may write many books." },
      { k: "vocabulary", q: "author: the person who wrote the words.\ndecides: picks what will happen." },
      { k: "connection", q: "Describe the connection between the author and what the book tells you.", a: "The author is the person who wrote the words, and the author decides what the book will tell you." },
    ],
    note: "Say author, not writer, every time. The word itself is the point of this standard.",
  },
  {
    t: "Who Drew It",
    std: 6, hi: 190, lo: 90,
    H: [
      "The illustrator is the person who made the pictures.",
      "The illustrator decides what everything looks like.",
      "Their name is on the cover under the author's.",
      "A book can have pictures and no story.",
    ],
    L: [
      "The illustrator made the pictures.",
      "The illustrator decides how things look.",
      "Their name is under the author's.",
      "A book can be all pictures.",
    ],
    q: [
      { k: "main idea/detail", q: "What does the illustrator do?", a: "The illustrator is the person who made the pictures." },
      { k: "paragraph focus", q: "Paragraph B (i.e. deciding how things look) and paragraph C (i.e. where the name sits)." },
      { k: "summarize", q: "Tell what an illustrator does.", a: "The illustrator is the person who made the pictures and decides what everything looks like. Their name is on the cover under the author's name." },
      { k: "vocabulary", q: "illustrator: the person who made the pictures.\nlooks like: how a thing appears." },
      { k: "connection", q: "Describe the connection between the illustrator and the pictures.", a: "The illustrator is the person who made the pictures, and decides what everything looks like." },
    ],
    note: "Pair this with Who Wrote It. The two words are easier side by side than alone.",
  },
  {
    t: "Two Names on One Book",
    std: 6, hi: 175, lo: 80,
    H: [
      "Many books have two different names on the front cover.",
      "One of them wrote all the words.",
      "The other one drew all the pictures.",
      "They worked on the same book together.",
    ],
    L: [
      "Many books have two names on the cover.",
      "One wrote the words.",
      "The other drew the pictures.",
      "They worked on the same book.",
    ],
    q: [
      { k: "main idea/detail", q: "How many names are on the cover?", a: "Many books have two different names on the front cover." },
      { k: "paragraph focus", q: "Paragraph B (i.e. the words) and paragraph C (i.e. the pictures)." },
      { k: "summarize", q: "Tell why a book has two names.", a: "Many books have two different names on the front cover. One of them wrote all the words and the other one drew all the pictures, and they worked on the same book together." },
      { k: "vocabulary", q: "cover: the outside of a book.\ntogether: with each other." },
      { k: "connection", q: "Describe the connection between the two names.", a: "One of them wrote all the words and the other drew all the pictures, and they worked on the same book together." },
    ],
    note: "Hold up a book with two names and ask the child to guess which one did which.",
  },
  {
    t: "When One Person Does Both",
    std: 6, hi: 200, lo: 100,
    H: [
      "Some books have only one name on them.",
      "That person wrote the words and drew the pictures.",
      "They are the author and the illustrator.",
      "That one person did both of the jobs.",
    ],
    L: [
      "Some books have only one name.",
      "That person wrote the words and drew the pictures.",
      "They are the author and the illustrator.",
      "One person did both jobs.",
    ],
    q: [
      { k: "main idea/detail", q: "What did that one person do?", a: "That person wrote the words and drew the pictures." },
      { k: "paragraph focus", q: "Paragraph C (i.e. being both) and paragraph D (i.e. both jobs)." },
      { k: "summarize", q: "Tell what it means when a book has one name.", a: "Some books have only one name on them. That person wrote the words and drew the pictures, so they are the author and the illustrator, and one person did both of the jobs." },
      { k: "vocabulary", q: "both: the two of them.\njob: work that somebody does." },
      { k: "connection", q: "Describe the connection between the one name and the two jobs.", a: "Some books have only one name because that person wrote the words and drew the pictures, so one person did both of the jobs." },
    ],
    note: "This is the hard case and it comes fourth on purpose. Do the two-name books first.",
  },
  {
    t: "Where to Find the Names",
    std: 6, hi: 165, lo: 70,
    H: [
      "Look at the front cover for the names.",
      "Look at the title page inside for them too.",
      "The author's name is usually on top.",
      "The illustrator's name is usually under it.",
    ],
    L: [
      "Look at the front cover for the names.",
      "Look at the title page too.",
      "The author is usually on top.",
      "The illustrator is under.",
    ],
    q: [
      { k: "main idea/detail", q: "Where can you find the names?", a: "Look at the front cover for the names, and look at the title page inside for them too." },
      { k: "paragraph focus", q: "Paragraph C (i.e. the author on top) and paragraph D (i.e. the illustrator under)." },
      { k: "summarize", q: "Tell where the names are.", a: "Look at the front cover for the names and at the title page inside for them too. The author's name is usually on top and the illustrator's name is usually under it." },
      { k: "vocabulary", q: "title page: the page inside that gives the name of the book.\nunder: below something else." },
      { k: "connection", q: "Describe the connection between the front cover and the title page.", a: "Look at the front cover for the names, and look at the title page inside for them too." },
    ],
    note: "Two places, the same two names. Check both on a real book.",
  },
  // ---------------------------------------------------------------- RI.K.7
  {
    t: "The Picture Helps the Words",
    std: 7, hi: 170, lo: 75,
    H: [
      "The words say that the dog is wet.",
      "The picture shows water dripping off its ears.",
      "Now you know just how wet it is.",
      "The picture and the words work together.",
    ],
    L: [
      "The words say the dog is wet.",
      "The picture shows water dripping off.",
      "Now you know how wet it is.",
      "They work together.",
    ],
    q: [
      { k: "main idea/detail", q: "What do the words say?", a: "The words say that the dog is wet." },
      { k: "paragraph focus", q: "Paragraph B (i.e. the dripping water) and paragraph D (i.e. working together)." },
      { k: "summarize", q: "Tell how the picture helps the words.", a: "The words say the dog is wet and the picture shows water dripping off its ears, so now you know just how wet it is. The picture and the words work together." },
      { k: "vocabulary", q: "dripping: falling in drops.\ntogether: with each other." },
      { k: "connection", q: "Describe the connection between the words and the picture.", a: "The words say the dog is wet and the picture shows water dripping off its ears, so they work together." },
    ],
    note: "Read the words with the picture covered, then uncover it. Ask what changed.",
  },
  {
    t: "Count What You See",
    std: 7, hi: 180, lo: 85,
    H: [
      "The words say there are some eggs in a nest.",
      "The picture lets you count them one by one.",
      "There are four eggs in that nest.",
      "The picture gave you the number.",
    ],
    L: [
      "The words say there are some eggs.",
      "The picture lets you count them.",
      "There are four eggs.",
      "The picture gave the number.",
    ],
    q: [
      { k: "main idea/detail", q: "How many eggs are there?", a: "There are four eggs in that nest." },
      { k: "paragraph focus", q: "Paragraph B (i.e. counting) and paragraph D (i.e. the number)." },
      { k: "summarize", q: "Tell how the picture helped.", a: "The words say there are some eggs in a nest. The picture lets you count them one by one, there are four eggs, and the picture gave you the number." },
      { k: "vocabulary", q: "count: to say how many.\nnest: the home a bird builds for eggs." },
      { k: "connection", q: "Describe the connection between the word some and the number four.", a: "The words say there are some eggs, and the picture lets you count them and find four." },
    ],
    note: "Some is a vague word and children accept it. The picture is what makes it exact.",
  },
  {
    t: "The Picture Shows the Size",
    std: 7, hi: 195, lo: 95,
    H: [
      "The words say that a blue whale is big.",
      "The picture puts a bus beside the whale.",
      "The whale is longer than three buses.",
      "Now the word big means something real.",
    ],
    L: [
      "The words say a blue whale is big.",
      "The picture puts a bus beside it.",
      "The whale is longer than three buses.",
      "Now big means something.",
    ],
    q: [
      { k: "main idea/detail", q: "What is beside the whale in the picture?", a: "The picture puts a bus beside the whale." },
      { k: "paragraph focus", q: "Paragraph C (i.e. three buses) and paragraph D (i.e. what big means)." },
      { k: "summarize", q: "Tell how the picture shows size.", a: "The words say a blue whale is big. The picture puts a bus beside the whale, the whale is longer than three buses, and now the word big means something real." },
      { k: "vocabulary", q: "size: how big or small a thing is.\nbeside: next to." },
      { k: "connection", q: "Describe the connection between the bus and the word big.", a: "The picture puts a bus beside the whale so you can see it is longer than three buses, and now the word big means something real." },
    ],
    note: "Big is a word children use for everything. The bus is what gives it an amount.",
  },
  {
    t: "What the Words Add",
    std: 7, hi: 205, lo: 105,
    H: [
      "The picture shows a frog on a leaf.",
      "You cannot tell if the frog is poisonous.",
      "The words say do not touch this one.",
      "Only the words could tell you that.",
    ],
    L: [
      "The picture shows a frog on a leaf.",
      "You cannot tell if it is poisonous.",
      "The words say do not touch it.",
      "Only the words tell you that.",
    ],
    q: [
      { k: "main idea/detail", q: "What do the words say?", a: "The words say do not touch this one." },
      { k: "paragraph focus", q: "Paragraph B (i.e. what you cannot tell) and paragraph D (i.e. only the words)." },
      { k: "summarize", q: "Tell what the words add to the picture.", a: "The picture shows a frog on a leaf, but you cannot tell if the frog is poisonous. The words say do not touch this one, and only the words could tell you that." },
      { k: "vocabulary", q: "poisonous: able to make you sick if you touch or eat it.\ntouch: to put a hand on." },
      { k: "connection", q: "Describe the connection between the picture and the warning.", a: "The picture shows a frog on a leaf but cannot tell you if it is poisonous, so only the words could tell you not to touch it." },
    ],
    note: "Danger is a thing a picture cannot carry. That is worth saying plainly.",
  },
  {
    t: "A Picture on Every Page",
    std: 7, hi: 160, lo: 65,
    H: [
      "This book has a picture on every page.",
      "Each picture shows what that page says.",
      "If you get lost, look at the picture.",
      "The picture will remind you where you are.",
    ],
    L: [
      "This book has a picture on every page.",
      "Each picture shows what the page says.",
      "If you get lost, look at it.",
      "It reminds you where you are.",
    ],
    q: [
      { k: "main idea/detail", q: "What does each picture show?", a: "Each picture shows what that page says." },
      { k: "paragraph focus", q: "Paragraph C (i.e. getting lost) and paragraph D (i.e. being reminded)." },
      { k: "summarize", q: "Tell what the pictures do in this book.", a: "This book has a picture on every page and each one shows what that page says. If you get lost, look at the picture, and it will remind you where you are." },
      { k: "vocabulary", q: "remind: to help you remember.\nlost: not sure where you are." },
      { k: "connection", q: "Describe the connection between getting lost and the picture.", a: "If you get lost, look at the picture, and the picture will remind you where you are." },
    ],
    note: "This is a strategy, not a fact. Tell the child to try it the next time they get stuck.",
  },
];

grade(0, STD, ARTICLES);
console.log(`grade K: ${ARTICLES.length} articles written`);
