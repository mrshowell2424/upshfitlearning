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
];

grade(0, STD, ARTICLES);
console.log(`grade K: ${ARTICLES.length} articles written`);
