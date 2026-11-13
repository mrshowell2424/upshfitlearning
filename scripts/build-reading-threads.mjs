/**
 * Knowledge threads: the background-knowledge view of articles we already own.
 *
 * The 350 articles were written grade by grade and filed by standard, which is
 * how a teacher finds a skill and exactly not how background knowledge works.
 * Knowledge is cumulative and domain-shaped: five articles about water over
 * three weeks build more than five unrelated ones, and a sixth grader meeting
 * "How a Glacier Moves" has "Winter Coats" and "How Rain Falls" behind them in
 * K and 1st -- if anyone says so.
 *
 * So this emits an assignment, not content. Each article id points at one
 * thread; the page joins that against the article store and counts for itself.
 * Nothing is copied, so a new grade of articles cannot leave a thread stale,
 * and no thread can claim an article that was deleted.
 *
 * Assignment is by keyword score over title and body, with the title weighted
 * ten and each body hit two, capped at four hits so one obsessive paragraph
 * cannot carry an article. Matching is on whole words: the first pass matched
 * substrings and read "ice" inside "noticed", which put a comprehension
 * routine in Water and ice with a score of thirty. Anything the scorer could
 * not place at six or better is placed by hand below, by reading it.
 */
import { readFileSync, writeFileSync } from "node:fs";

const AR = JSON.parse(readFileSync("scripts/reading-articles.json", "utf8")).articles;

const THREADS = [
  { key: "animals", name: "Animals and survival",
    what: "How animals eat, move, build, hide and get through a winter.",
    builds: "The thread a child already has the most of. It starts with a duck on a pond and ends with what a crow remembers, and almost every grade has a nest, a web or a burrow in it somewhere." },
  { key: "water", name: "Water and ice",
    what: "Rain, rivers, oceans, lakes, ice and what water does to everything it touches.",
    builds: "The widest thread we have and the one that pays off latest. A sixth grader reading how a glacier moves is standing on snow, rain and melting they met in kindergarten." },
  { key: "books", name: "Books and how they work",
    what: "Covers, titles, headings, captions, glossaries, sidebars and who made the book.",
    builds: "This is the literacy-knowledge strand in thread form. It runs from the front of a book in kindergarten to the sidebar and the story in sixth, and it is the only thread that is about reading itself." },
  { key: "building", name: "Building and moving things",
    what: "Bridges, roads, canals, tunnels, rails, ships and the cities they add up to.",
    builds: "Every article here answers how did that get there, which is the question a child asks about infrastructure before anyone teaches them the word." },
  { key: "plants", name: "Plants and growing",
    what: "Seeds, roots, leaves, trees, farms and where food comes from.",
    builds: "Seeds in the wind, how a seed drinks, how a seed crosses an ocean, what a leaf loses in autumn. The same object, four grades apart, asked a harder question each time." },
  { key: "maps", name: "Maps and the shape of the land",
    what: "Maps, mountains, deserts, islands, volcanoes and finding your way.",
    builds: "Place knowledge is what makes a text about somewhere else readable at all. A reader who has never held a map reads 674 miles as a number." },
  { key: "sky", name: "Weather and the sky",
    what: "Storms, wind, clouds, seasons, the sun and moon, and what is past them.",
    builds: "Weather is the science a child has the most firsthand evidence about and the least explanation for, which is the best possible place to put a nonfiction text." },
  { key: "town", name: "How a town works",
    what: "Mail, fire stations, libraries, schools, shops and the people who run them.",
    builds: "Starts as community helpers and grows into institutions. The school nurse in kindergarten and the room made for children in second grade are the same thread asking who decided this." },
  { key: "safety", name: "Staying safe and getting along",
    what: "Rules, drills, helmets, crossings, washing hands, sharing and waiting your turn.",
    builds: "The knowledge that makes a classroom work, written as text instead of said aloud. These are also the articles a child can check against their own morning." },
  { key: "body", name: "The human body",
    what: "Bones, blood, the stomach, the senses, and getting sick and better.",
    builds: "Thin for now, and a child's own body is the one topic where they always have prior knowledge. That makes this thread cheap to grow and worth growing." },
  { key: "machines", name: "Machines and inventions",
    what: "Clocks, engines, radios, electricity, tools and the accidents that became inventions.",
    builds: "Nothing before second grade, and every article in it is a how-does-that-work question a child has already asked out loud. Short thread, high ceiling." },
  { key: "civics", name: "Government and how we decide",
    what: "Voting, elections, laws, censuses, money and making a case in public.",
    builds: "Does not reach the younger grades, which is a gap worth naming. Deciding something together is a kindergarten topic if anyone writes it that way." },
  { key: "people", name: "People who changed things",
    what: "Workers, immigrants, organisers and the people a textbook leaves out.",
    builds: "The thinnest thread on the board, and it does not reach the younger grades at all. Everything in it is strong and there is almost none of it." },
];

/** Whole-word keyword lists. Order does not matter; the score decides. */
const KEYS = {
  water: ["water","waters","rain","rains","rained","river","rivers","ocean","oceans","sea","seas","lake","lakes","flood","floods","flooded","ice","iced","icy","glacier","glaciers","snow","stream","streams","tide","tides","wave","waves","frozen","freeze","melt","melts","melting","pond","ponds","creek","harbor","harbour","swamp","rapids","salt","salty","drought","reservoir","steam","puddle","puddles","damp","soaked","thirsty","drink","drinks"],
  sky: ["weather","storm","storms","wind","winds","windy","cloud","clouds","sun","sunlight","moon","star","stars","sky","lightning","thunder","hurricane","tornado","season","seasons","winter","summer","autumn","fog","temperature","degrees","forecast","eclipse","orbit","planet","planets","comet","sunrise","sunset","heat","hot","cold"],
  plants: ["seed","seeds","leaf","leaves","tree","trees","forest","forests","root","roots","flower","flowers","plant","plants","grass","bloom","blooms","farm","farms","farmer","crop","crops","wheat","field","fields","soil","bark","branch","branches","pollen","fruit","harvest","garden","sprout","stem","orchard","vine","moss","acorn","grow","grows","grew","growing"],
  animals: ["bird","birds","robin","nest","nests","duck","ducks","owl","owls","crow","crows","feather","feathers","hawk","penguin","egg","eggs","bee","bees","ant","ants","spider","spiders","butterfly","beetle","insect","insects","web","webs","moth","wasp","bear","bears","cat","cats","dog","dogs","whale","whales","frog","frogs","snail","snails","fish","wolf","wolves","horse","horses","pony","mouse","mice","deer","hunt","hunts","prey","predator","burrow","hibernate","migrate","swarm","hive","paw","paws","claw","claws","fur","wing","wings","beak","tail","herd","flock","shell","antler","venom","camouflage","bat","bats","bug","bugs"],
  body: ["stomach","bone","bones","heart","blood","eye","eyes","ear","ears","skin","brain","tooth","teeth","lung","lungs","muscle","muscles","nerve","nerves","breathe","breathing","digest","growl","growls","hunger","hungry","sleep","sleeps","sneeze","pulse","vein","sick","disease","medicine","germ","germs","fever","wound","healing","heal","doctor","doctors","nurse"],
  books: ["book","books","page","pages","title","heading","headings","caption","captions","glossary","index","chapter","author","illustrator","wrote","drew","cover","spine","bold","sidebar","timeline","label","labels","diagram","text","reader","read","reading","word list","table of contents","paragraph","sentence","picture","pictures","photograph","advertisement"],
  town: ["mail","carrier","post office","fire station","firefighter","police","library","librarian","school","teacher","teachers","principal","store","grocery","shop","market","bakery","baker","crossing guard","janitor","mayor","neighbor","neighbour","community","town hall","garbage","recycle","clinic","volunteer","delivery","customer","clerk","class","classroom","recess"],
  building: ["bridge","bridges","road","roads","tunnel","tunnels","canal","wall","walls","tower","house","houses","dam","rail","rails","track","tracks","train","trains","truck","trucks","ship","ships","boat","boats","port","cargo","freight","highway","subway","sewer","pipe","pipes","build","built","building","construct","brick","bricks","steel","concrete","crane","ferry","wagon","sled","route","city","cities","street","streets","bus"],
  machines: ["clock","clocks","engine","engines","radio","machine","machines","wheel","wheels","motor","pump","lamp","telegraph","invent","invented","inventor","invention","gear","gears","lever","battery","electric","electricity","wire","wires","switch","lens","camera","printing","press","telephone","glue","bulb","signal","valve","piston","patent","device","airplane","airplanes","plane","planes","tool","tools"],
  maps: ["map","maps","mapped","longitude","latitude","desert","deserts","mountain","mountains","island","islands","valley","north","south","east","west","compass","canyon","cliff","plain","plains","volcano","volcanoes","earthquake","rock","rocks","cave","caves","continent","coast","border","survey","expedition","navigate","chart","altitude","erosion","sand","dune","mile","miles","distance"],
  safety: ["helmet","helmets","seat belt","safe","safety","danger","dangerous","rule","rules","drill","fire drill","crosswalk","crossing","traffic light","sign","signs","wash","hands","careful","share","sharing","turn","turns","line up","lining up","wait","waiting","listen","polite","kind","apologize","buckle","stop sign","sidewalk","pool","lifeguard"],
  civics: ["vote","votes","voted","voting","election","ballot","mayor","council","census","declaration","constitution","law","laws","congress","president","citizen","citizens","petition","argument","debate","dollar","dollars","money","tax","taxes","government","court","judge","rights","amendment","committee","public","treaty","senate"],
  people: ["worker","workers","painter","painters","porter","porters","immigrant","immigrants","crew","strike","union","protest","march","marched","settler","settlers","pioneer","soldier","soldiers","refugee","factory","factories","wage","wages","labor","labour","hired","fired","rescue","rescued","courage","women","woman","girls","boys","slavery","enslaved","freedom"],
};

/**
 * The twenty-one the scorer could not place at six or better, read and placed
 * by hand. Each one is here because a human opened it, not because a rule
 * fired, so the comment says what the article actually turned out to be.
 */
const BY_HAND = {
  "The Line and the Door": "safety",            // making a line before the hall
  "Saying What You Noticed": "books",           // what to say after a page
  "What the Words Add": "books",
  "When to Ask Your Question": "books",
  "What Hatch Means": "animals",
  "The Bell and the Line": "safety",
  "Float and Sink": "water",                    // a cork floats, a rock sinks
  "Buttons You Can Tap": "books",               // text features on a screen
  "The Words in a Recipe": "books",
  "The Room Made for Children": "town",         // the first children's library room
  "Should Zoos Exist?": "animals",
  "Two Texts: Living on a Submarine": "water",
  "The Night the Lights Went Out": "machines",  // a blackout and a generator
  "Working the Night Shift at the Zoo": "animals",
  "Apollo 13": "machines",
  "Two Texts: Should Zoos Exist?": "animals",
  "The Sound of a Stadium": "machines",         // decibels, measured
  "Two Letters Home from the Trail": "people",  // two accounts of one wagon train
  "Naming the Park": "civics",                  // three cases for a park's name
  "The Mold on the Windowsill": "body",         // Fleming, 1928
  "How Elephants Talk Through the Ground": "animals",
};

const pats = Object.fromEntries(
  Object.entries(KEYS).map(([k, ws]) => [
    k,
    ws.map((w) => new RegExp("\\b" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "g")),
  ]),
);

const assign = {};
const unplaced = [];
for (const a of AR) {
  const title = a.title.toLowerCase();
  const bodyText = a.higher.paras.map((p) => p.text).join(" ").toLowerCase();
  let best = null;
  for (const t of THREADS) {
    let s = 0;
    for (const re of pats[t.key]) {
      re.lastIndex = 0;
      if (new RegExp(re.source, "").test(title)) s += 10;
      const hits = (bodyText.match(re) || []).length;
      s += Math.min(hits, 4) * 2;
    }
    if (!best || s > best.s) best = { key: t.key, s };
  }
  const hand = BY_HAND[a.title];
  if (hand) assign[a.id] = hand;
  else if (best.s >= 6) assign[a.id] = best.key;
  else unplaced.push(`G${a.grade} ${a.title} (best ${best.key}=${best.s})`);
}

if (unplaced.length) {
  console.error("Articles no rule placed and no hand entry covers:");
  for (const u of unplaced) console.error("  " + u);
  console.error(
    "\nAdd each to BY_HAND after reading it, or widen a keyword list. A thread\n" +
    "view that silently drops articles is worse than no thread view.",
  );
  process.exit(1);
}

const out = {
  _note:
    "Which knowledge thread each article belongs to. Generated by " +
    "scripts/build-reading-threads.mjs -- do not hand-edit this file; edit the " +
    "keyword lists or BY_HAND in the builder and run it again. Only the " +
    "assignment lives here: titles, grades and counts are read from " +
    "reading-articles.json at render time so a thread cannot go stale.",
  source:
    "Thread descriptions are ours. The reason for organising background " +
    "knowledge by domain rather than by skill is the well-replicated finding " +
    "that comprehension depends on prior knowledge of the topic -- the " +
    "baseball study (Recht & Leslie, 1988) is the usual shorthand for it.",
  threads: THREADS,
  assign,
};
writeFileSync("scripts/reading-threads.json", JSON.stringify(out, null, 2) + "\n");

const counts = {};
for (const [id, k] of Object.entries(assign)) counts[k] = (counts[k] || 0) + 1;
console.log(`wrote scripts/reading-threads.json`);
console.log(`  articles placed: ${Object.keys(assign).length} of ${AR.length}`);
console.log(`  by hand: ${Object.keys(BY_HAND).length}`);
for (const t of THREADS) {
  const gs = [...new Set(AR.filter((a) => assign[a.id] === t.key).map((a) => a.grade))].sort((x, y) => x - y);
  console.log(`  ${t.name.padEnd(32)} ${String(counts[t.key] || 0).padStart(3)}  grades ${gs.join(",")}`);
}
