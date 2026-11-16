/**
 * Grade 1, the debate version of each case. See scripts/mysteries/g5.debate.mjs
 * for what these files are and what the gate holds them to.
 *
 * Thirty-six to sixty words, in sentences of eight. There is room for one
 * clue each and no room for anything else, so every sentence here is either
 * the problem or a reason to suspect somebody.
 *
 * At this level the debate is not really a debate. It is a child pointing at
 * a sentence and saying it out loud, and then hearing the child next to them
 * point at a different one. That is the whole lesson and it is enough.
 */
export const DEBATES = {
  1: {
    story:
      "A book had a bent page. The book was at the bottom of the bin. Six big books sat on top. A heavy stack can bend a page. Ava read it on the rug. She put it in her bag too. The bend has a sharp fold line.",
    q: "What bent the page? Point to the words.",
    who: ["", "", "📐 A sharp fold line"],
    why: [
      "six big books on top, and a stack can bend a page",
      "read it on the rug and put it in her bag",
      "a sharp fold line in the bend",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Six big books sat on top.”", "“A heavy stack can bend a page.”"], but: "“She put it in her bag too.”" },
      { who: 1, ev: ["“Ava read it on the rug.”", "“She put it in her bag too.”"], but: "“Six big books sat on top.”" },
      { who: 2, ev: ["“The bend has a sharp fold line.”"], but: "“A heavy stack can bend a page.”" },
    ],
    clears: [],
    note:
      "A stack makes a soft bend. A fold makes a sharp line. Let the children bend a page both ways on a scrap of paper and look at what they get.",
  },
  2: {
    story:
      "Leo opened his lunch box. His sandwich was flat. A big water bottle lay on top. The bottle is heavy and full. The box was under his backpack all morning. A wet ring sits under the bread.",
    q: "What flattened the sandwich? Show the words.",
    who: ["", "🎒 Under his backpack", ""],
    why: [
      "a heavy full bottle lying on top",
      "the box under his backpack all morning",
      "a wet ring under the bread",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A big water bottle lay on top.”", "“The bottle is heavy and full.”"], but: "“The box was under his backpack all morning.”" },
      { who: 1, ev: ["“The box was under his backpack all morning.”"], but: "“A big water bottle lay on top.”" },
      { who: 2, ev: ["“A wet ring sits under the bread.”"], but: "“The bottle is heavy and full.”" },
    ],
    clears: [],
    note:
      "Two heavy things were on that sandwich and one of them was leaking. Ask which one was there longer, and whether a wet ring tells you about weight at all.",
  },
  3: {
    story:
      "Ivy's pencil tip broke three times. She pressed very hard on the paper. The paper sat on a soft mat. A soft mat lets the tip sink. Her pencil box fell down the stairs. Two new pencils broke the same way.",
    q: "Why does the tip keep breaking? Point to the words.",
    who: ["", "📦 The box that fell", ""],
    why: [
      "a soft mat that lets the tip sink",
      "a pencil box that fell down the stairs",
      "two new pencils that broke the same way",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The paper sat on a soft mat.”", "“A soft mat lets the tip sink.”"], but: "“Her pencil box fell down the stairs.”" },
      { who: 1, ev: ["“Her pencil box fell down the stairs.”"], but: "“She pressed very hard on the paper.”" },
      { who: 2, ev: ["“Two new pencils broke the same way.”"], but: "“A soft mat lets the tip sink.”" },
    ],
    clears: [],
    note:
      "New pencils breaking the same way is the big clue. Ask whether that fits the mat, the fall, or both, and let somebody try a pencil on a hard desk.",
  },
  4: {
    story:
      "Sam cut an apple at nine. By noon it was brown. He wrapped the other half up tight. That half is still white. Air turns a cut apple brown. The brown half sat on a warm sill. Three hands picked slices off it.",
    q: "Why did one half turn brown? Show the words.",
    who: ["", "", "🌡️ The warm sill"],
    why: [
      "air on the cut side, which turns an apple brown",
      "three hands picking slices off it",
      "sitting on a warm sill",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Air turns a cut apple brown.”", "“He wrapped the other half up tight.”"], but: "“The brown half sat on a warm sill.”" },
      { who: 1, ev: ["“Three hands picked slices off it.”"], but: "“That half is still white.”" },
      { who: 2, ev: ["“The brown half sat on a warm sill.”"], but: "“Air turns a cut apple brown.”" },
    ],
    clears: [],
    note:
      "The wrapped half is the one to keep looking at. It had no air and no hands and no sun, and it is still white. Ask which of those three the wrapping kept away.",
  },
  5: {
    story:
      "Dev's bike seat wobbled side to side. The bolt under the seat was loose. A loose bolt lets a seat move. Dev dropped the bike on Friday. The seat post has a bend near the top. His dad turned the bolt tight.",
    q: "Why does the seat wobble? Point to the words.",
    who: ["", "💥 The drop on Friday", "📏 A bent seat post"],
    why: [
      "a loose bolt under the seat",
      "the bike dropped on Friday",
      "a bend in the seat post near the top",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The bolt under the seat was loose.”", "“A loose bolt lets a seat move.”"], but: "“The seat post has a bend near the top.”" },
      { who: 1, ev: ["“Dev dropped the bike on Friday.”"], but: "“A loose bolt lets a seat move.”" },
      { who: 2, ev: ["“The seat post has a bend near the top.”"], but: "“His dad turned the bolt tight.”" },
    ],
    clears: [],
    note:
      "The story stops before telling us whether the wobble went away. Ask the class what they want to know next, and listen for the child who wants to ride it.",
  },
  6: {
    story:
      "The class fish hid behind a rock. A new big fish came on Monday. Big fish chase little fish. The tank was moved to a bright shelf. A new bag of food was opened on Monday. The little fish came out at night.",
    q: "Why is the fish hiding? Show the words.",
    who: ["", "☀️ The bright new shelf", ""],
    why: [
      "a big new fish, and big fish chase little ones",
      "the tank moved to a bright shelf",
      "a new bag of food opened on Monday",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A new big fish came on Monday.”", "“Big fish chase little fish.”"], but: "“The tank was moved to a bright shelf.”" },
      { who: 1, ev: ["“The tank was moved to a bright shelf.”"], but: "“The little fish came out at night.”" },
      { who: 2, ev: ["“A new bag of food was opened on Monday.”"], but: "“Big fish chase little fish.”" },
    ],
    clears: [],
    note:
      "Coming out at night is the clue. Ask what is different about the tank at night, and whether the big fish goes home when the lights go off.",
  },
  7: {
    story:
      "A tap came from the window. It tapped only on windy days. A branch hangs near the glass. Wind pushes the branch. A bird sits on that sill each day. The blind cord swings and knocks the glass.",
    q: "What is tapping? Point to the words.",
    who: ["", "", "🪟 The blind cord"],
    why: [
      "a branch near the glass that the wind pushes",
      "a bird on that sill each day",
      "a blind cord that swings and knocks",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A branch hangs near the glass.”", "“Wind pushes the branch.”"], but: "“A bird sits on that sill each day.”" },
      { who: 1, ev: ["“A bird sits on that sill each day.”"], but: "“It tapped only on windy days.”" },
      { who: 2, ev: ["“The blind cord swings and knocks the glass.”"], but: "“A branch hangs near the glass.”" },
    ],
    clears: [],
    note:
      "Only on windy days is the sentence that sorts this out. A bird comes every day. Ask what makes a cord swing, and somebody will say the wind too.",
  },
  8: {
    story:
      "One red leaf sat in the hall. The door was open at recess. Wind blew in the open door. The maple is by that door. Kim came in with leaves on her coat. The leaf has a wet mark on it.",
    q: "How did the leaf get in? Show the words.",
    who: ["", "🧥 Leaves on Kim's coat", ""],
    why: [
      "an open door with wind, and the maple beside it",
      "leaves on Kim's coat when she came in",
      "a wet mark on the leaf",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Wind blew in the open door.”", "“The maple is by that door.”"], but: "“Kim came in with leaves on her coat.”" },
      { who: 1, ev: ["“Kim came in with leaves on her coat.”"], but: "“Wind blew in the open door.”" },
      { who: 2, ev: ["“The leaf has a wet mark on it.”"], but: "“The door was open at recess.”" },
    ],
    clears: [],
    note:
      "Both answers start at the same door, which is why this is hard and short. The wet mark is the odd one. Ask where a leaf gets wet, and whether the hall is wet anywhere.",
  },
  9: {
    story:
      "Seeds were on the floor by the pumpkin. The pumpkin has a hole in the side. The hole has small tooth marks. A mouse was seen in the hall. The lid was lifted off on Friday. A knife sat beside the pumpkin all week.",
    q: "Who made the hole? Point to the words.",
    why: [
      "small tooth marks, and a mouse in the hall",
      "a knife beside the pumpkin all week",
      "the lid lifted off on Friday",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The hole has small tooth marks.”", "“A mouse was seen in the hall.”"], but: "“A knife sat beside the pumpkin all week.”" },
      { who: 1, ev: ["“A knife sat beside the pumpkin all week.”"], but: "“The hole has small tooth marks.”" },
      { who: 2, ev: ["“The lid was lifted off on Friday.”"], but: "“The pumpkin has a hole in the side.”" },
    ],
    clears: [],
    note:
      "Teeth marks are teeth marks. A knife leaves a straight cut and lifting a lid leaves nothing at all in the side. Ask what each one would look like.",
  },
  10: {
    story:
      "Small muddy prints went to the door. They have four toes. A dog has four toes. A cat has four toes too. The class cat was out of her box on Friday. The prints are as wide as two fingers.",
    q: "Who left the prints? Show the words.",
    who: ["", "", "👣 How wide the prints are"],
    why: [
      "four toes, and a dog has four",
      "out of her box on Friday, and a cat has four too",
      "prints as wide as two fingers",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A dog has four toes.”"], but: "“A cat has four toes too.”" },
      { who: 1, ev: ["“The class cat was out of her box on Friday.”", "“A cat has four toes too.”"], but: "“Small muddy prints went to the door.”" },
      { who: 2, ev: ["“The prints are as wide as two fingers.”"], but: "“They have four toes.”" },
    ],
    clears: [],
    note:
      "Four toes used to mean a dog and now it means a dog or a cat. That is the lesson. Hold up two fingers and ask whose foot is that size.",
  },
  11: {
    story:
      "Mia got off at the wrong stop. She was reading her book. She did not watch the street. The driver names every stop out loud. His voice was quiet that day. The bus ran ten minutes early that morning.",
    q: "Why did Mia get off early? Point to the words.",
    who: ["", "⏰ A bus ten minutes early", "🔉 A quiet voice"],
    why: [
      "reading, and not watching the street",
      "a bus that ran ten minutes early",
      "a driver whose voice was quiet that day",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“She was reading her book.”", "“She did not watch the street.”"], but: "“His voice was quiet that day.”" },
      { who: 1, ev: ["“The bus ran ten minutes early that morning.”"], but: "“The driver names every stop out loud.”" },
      { who: 2, ev: ["“His voice was quiet that day.”"], but: "“The driver names every stop out loud.”" },
    ],
    clears: [],
    note:
      "Three things went wrong at once and any one of them would have been fine on its own. Ask what Mia could do next time, and what the driver could do.",
  },
  12: {
    story:
      "The class trophy fell on its side. The shelf is not level. It leans down to the left. The trophy fell to the left. The door bangs that wall each time. The trophy stands on a very small base.",
    q: "Why did the trophy fall? Show the words.",
    who: ["", "🚪 The banging door", "🏆 A very small base"],
    why: [
      "a shelf leaning left, and the trophy fell left",
      "a door that bangs that wall each time",
      "a very small base to stand on",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“It leans down to the left.”", "“The trophy fell to the left.”"], but: "“The door bangs that wall each time.”" },
      { who: 1, ev: ["“The door bangs that wall each time.”"], but: "“The trophy fell to the left.”" },
      { who: 2, ev: ["“The trophy stands on a very small base.”"], but: "“The shelf is not level.”" },
    ],
    clears: [],
    note:
      "It leans left and it fell left. Say both sentences one after the other and let the class hear them match. Then ask which way a bang would push it.",
  },
  13: {
    story:
      "The food was hot in the pan. On the plate it went cold fast. The plates came from a cold shelf. A cold plate takes the heat. The pan sat off the heat for ten minutes. The door to the yard stood open.",
    q: "Why did the food go cold? Point to the words.",
    who: ["", "", "🚪 The open yard door"],
    why: [
      "plates from a cold shelf, which take the heat",
      "ten minutes off the heat",
      "a door to the yard standing open",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The plates came from a cold shelf.”", "“A cold plate takes the heat.”"], but: "“The pan sat off the heat for ten minutes.”" },
      { who: 1, ev: ["“The pan sat off the heat for ten minutes.”"], but: "“The food was hot in the pan.”" },
      { who: 2, ev: ["“The door to the yard stood open.”"], but: "“A cold plate takes the heat.”" },
    ],
    clears: [],
    note:
      "The food was hot in the pan, so whatever cooled it happened after the pan. Point at that sentence and ask the class what comes next in the story.",
  },
  14: {
    story:
      "The cupcakes stuck to the pan. The class forgot the paper cups. Butter was not used either. Cake sticks to a bare pan. The pan is black and scratched inside. Two cups were filled right to the top.",
    q: "Why did they stick? Show the words.",
    why: [
      "no paper cups and no butter, on a bare pan",
      "a pan black and scratched inside",
      "two cups filled right to the top",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The class forgot the paper cups.”", "“Cake sticks to a bare pan.”"], but: "“The pan is black and scratched inside.”" },
      { who: 1, ev: ["“The pan is black and scratched inside.”"], but: "“Butter was not used either.”" },
      { who: 2, ev: ["“Two cups were filled right to the top.”"], but: "“The cupcakes stuck to the pan.”" },
    ],
    clears: [],
    note:
      "Two cups were overfilled and all of them stuck. Ask how many stuck and how many were too full. The numbers do not match, and a six-year-old can see that.",
  },
  15: {
    story:
      "Kim had two mittens at recess. She came in with one. The lost one has no clip. A clip holds a mitten on. Two children have red mittens like hers. Her coat went in the wash last night.",
    q: "Where is the mitten? Point to the words.",
    why: [
      "no clip, and a clip holds a mitten on",
      "two children with red mittens like hers",
      "a coat that went in the wash last night",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The lost one has no clip.”", "“A clip holds a mitten on.”"], but: "“Two children have red mittens like hers.”" },
      { who: 1, ev: ["“Two children have red mittens like hers.”"], but: "“Kim had two mittens at recess.”" },
      { who: 2, ev: ["“Her coat went in the wash last night.”"], but: "“She came in with one.”" },
    ],
    clears: [],
    note:
      "She had two at recess and one after, so it went missing outside. Say that slowly. It does not tell you where, and it does tell you when, which is already something.",
  },
  16: {
    story:
      "The gingerbread roof went soft. The house sat by the sink. Steam rises from the hot sink. Steam makes gingerbread soft. A cup was knocked over on that table. The roof piece was rolled thinner than the walls.",
    q: "Why did the roof go soft? Show the words.",
    who: ["", "", "📏 A thinner roof piece"],
    why: [
      "steam from the hot sink, which softens gingerbread",
      "a cup knocked over on that table",
      "a roof rolled thinner than the walls",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Steam rises from the hot sink.”", "“Steam makes gingerbread soft.”"], but: "“A cup was knocked over on that table.”" },
      { who: 1, ev: ["“A cup was knocked over on that table.”"], but: "“The house sat by the sink.”" },
      { who: 2, ev: ["“The roof piece was rolled thinner than the walls.”"], but: "“Steam makes gingerbread soft.”" },
    ],
    clears: [],
    note:
      "Steam goes up and water goes down, and the roof is the top of the house. Ask the class which one reaches a roof first.",
  },
  17: {
    story:
      "A string of lights went dark. The switch was turned off. A switch off means no power. The plug hangs half out of the wall. One bulb near the plug looks black. Mr. Cole flipped the switch on.",
    q: "Why are the lights dark? Point to the words.",
    why: [
      "a switch turned off, which means no power",
      "a plug hanging half out of the wall",
      "one bulb near the plug looking black",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The switch was turned off.”", "“A switch off means no power.”"], but: "“The plug hangs half out of the wall.”" },
      { who: 1, ev: ["“The plug hangs half out of the wall.”"], but: "“A switch off means no power.”" },
      { who: 2, ev: ["“One bulb near the plug looks black.”"], but: "“Mr. Cole flipped the switch on.”" },
    ],
    clears: [],
    note:
      "Three things are wrong with one string of lights. The story stops before saying whether the lights came on. Ask the class what they would try first and why.",
  },
  18: {
    story:
      "The class clock stopped at ten. The hands do not move. The battery was green and old. An old battery stops a clock. The clock fell off the wall last week. A bent hand catches on the glass.",
    q: "Why did the clock stop? Show the words.",
    who: ["", "⚙️ A bent hand", "🔨 The fall last week"],
    why: [
      "a green old battery, which stops a clock",
      "a bent hand that catches on the glass",
      "the clock falling off the wall last week",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The battery was green and old.”", "“An old battery stops a clock.”"], but: "“The clock fell off the wall last week.”" },
      { who: 1, ev: ["“A bent hand catches on the glass.”"], but: "“An old battery stops a clock.”" },
      { who: 2, ev: ["“The clock fell off the wall last week.”"], but: "“The hands do not move.”" },
    ],
    clears: [],
    note:
      "A fall could bend a hand, so two of these answers may be one answer. Ask whether the fall and the bent hand are the same story told twice.",
  },
  19: {
    story:
      "Max made a big snowball. He left it on the step. By lunch it was small. The step is in the sun. Sun melts snow fast. A ring of wet stone sits around it. Boot marks cross the step. A dog ran past at ten.",
    q: "Why did the snowball get small? Point to the words.",
    who: ["", "👢 The boot marks", "🐕 The dog at ten"],
    why: [
      "a sunny step, and sun melts snow fast",
      "boot marks crossing the step",
      "a dog that ran past at ten",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The step is in the sun.”", "“A ring of wet stone sits around it.”"], but: "“Boot marks cross the step.”" },
      { who: 1, ev: ["“Boot marks cross the step.”"], but: "“Sun melts snow fast.”" },
      { who: 2, ev: ["“A dog ran past at ten.”"], but: "“A ring of wet stone sits around it.”" },
    ],
    clears: [],
    note:
      "A wet ring is melted snow and it is still there. Ask where the snow went in each story. If a boot or a dog took it, where is it now?",
  },
  20: {
    story:
      "Seed lay under the bird feeder. The feeder has a big crack. Seed falls out of the crack. The lid was found open on Tuesday. Claw marks run down the pole. Birds push seed out while they eat.",
    q: "Why is seed on the ground? Show the words.",
    why: [
      "a big crack that seed falls out of",
      "claw marks down the pole, and a lid found open",
      "birds pushing seed out while they eat",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The feeder has a big crack.”", "“Seed falls out of the crack.”"], but: "“Claw marks run down the pole.”" },
      { who: 1, ev: ["“Claw marks run down the pole.”", "“The lid was found open on Tuesday.”"], but: "“Seed falls out of the crack.”" },
      { who: 2, ev: ["“Birds push seed out while they eat.”"], but: "“The lid was found open on Tuesday.”" },
    ],
    clears: [],
    note:
      "A crack spills seed in one spot. A squirrel spills it everywhere. Ask the class to look at where the seed is, not just that it is there.",
  },
  21: {
    story:
      "White spots floated on the cocoa. The milk came from a new jug. The jug sat out all night. Warm milk goes bad and makes spots. The spots smell sour. The mix came from the bottom of the tin. The cup had been used for paint water.",
    q: "What made the spots? Point to the words.",
    why: [
      "a jug left out all night, and warm milk makes spots",
      "mix from the bottom of the tin",
      "a cup that had held paint water",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The jug sat out all night.”", "“The spots smell sour.”"], but: "“The mix came from the bottom of the tin.”" },
      { who: 1, ev: ["“The mix came from the bottom of the tin.”"], but: "“Warm milk goes bad and makes spots.”" },
      { who: 2, ev: ["“The cup had been used for paint water.”"], but: "“The spots smell sour.”" },
    ],
    clears: [],
    note:
      "Sour is a smell and it belongs to milk. Let the children say what sour means. Lumps from the bottom of a tin do not smell of anything.",
  },
  22: {
    story:
      "Ana got a valentine with no name. The card has a heart sticker. Only Jon has heart stickers. Jon sits next to Ana. Mia borrowed Jon's stickers on Friday. Sam sent his cards from home this year.",
    q: "Who sent the card? Show the words.",
    why: [
      "the only one with heart stickers, sitting next to Ana",
      "borrowed Jon's stickers on Friday",
      "sent his cards from home this year",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Only Jon has heart stickers.”", "“Jon sits next to Ana.”"], but: "“Mia borrowed Jon's stickers on Friday.”" },
      { who: 1, ev: ["“Mia borrowed Jon's stickers on Friday.”"], but: "“Only Jon has heart stickers.”" },
      { who: 2, ev: ["“Sam sent his cards from home this year.”"], but: "“The card has a heart sticker.”" },
    ],
    clears: [],
    note:
      "Only Jon has heart stickers was the whole answer, and borrowing breaks it. Ask the class what only means once somebody has borrowed them.",
  },
  23: {
    story:
      "Rosa's volcano made no foam. She used baking powder by mistake. Baking soda makes the foam. Her vinegar bottle had no lid for a week. She poured in one small spoon of vinegar. The cup is wide and low.",
    q: "Why was there no foam? Point to the words.",
    who: ["", "🥄 One small spoon", "🥤 A wide low cup"],
    why: [
      "baking powder instead of soda, and soda makes the foam",
      "one small spoon of vinegar",
      "a cup that is wide and low",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“She used baking powder by mistake.”", "“Baking soda makes the foam.”"], but: "“She poured in one small spoon of vinegar.”" },
      { who: 1, ev: ["“She poured in one small spoon of vinegar.”"], but: "“Baking soda makes the foam.”" },
      { who: 2, ev: ["“The cup is wide and low.”"], but: "“Rosa's volcano made no foam.”" },
    ],
    clears: [],
    note:
      "No foam at all is the thing to hold on to. A small spoon makes a little foam. A wide cup makes low foam. Only the wrong powder makes none.",
  },
  24: {
    story:
      "The paper crown has a long rip. It hung on a hook all night. The hook has a sharp end. Paper rips on a sharp end. The rip is at the hook spot. Two children tried it on at home time. The crown is made of thin paper.",
    q: "What tore the crown? Show the words.",
    who: ["", "🙋 The two who tried it on", "📄 Thin paper"],
    why: [
      "a sharp hook, and the rip is at the hook spot",
      "two children who tried it on at home time",
      "a crown made of thin paper",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The hook has a sharp end.”", "“The rip is at the hook spot.”"], but: "“Two children tried it on at home time.”" },
      { who: 1, ev: ["“Two children tried it on at home time.”"], but: "“The rip is at the hook spot.”" },
      { who: 2, ev: ["“The crown is made of thin paper.”"], but: "“Paper rips on a sharp end.”" },
    ],
    clears: [],
    note:
      "The rip is at the hook spot is the sentence that does the work. Ask where a rip would be if somebody pulled it on, and have a child show you on their own head.",
  },
  25: {
    story:
      "One piano key will not go down. Mr. Lee looked inside. A coin sits under that key. A coin blocks a key. The key beside it is slow too. Something sticky was spilled on that end last week.",
    q: "Why will the key not go down? Point to the words.",
    who: ["", "🍯 Something sticky spilled", "🎹 The key beside it"],
    why: [
      "a coin sitting under that key",
      "something sticky spilled on that end last week",
      "the key beside it is slow too",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A coin sits under that key.”", "“A coin blocks a key.”"], but: "“The key beside it is slow too.”" },
      { who: 1, ev: ["“Something sticky was spilled on that end last week.”"], but: "“A coin sits under that key.”" },
      { who: 2, ev: ["“The key beside it is slow too.”"], but: "“A coin blocks a key.”" },
    ],
    clears: [],
    note:
      "One coin cannot sit under two keys. The key beside it is the clue that opens the case up. Ask how many keys are wrong and how many coins there are.",
  },
  26: {
    story:
      "Sam's kite would not fly. The flags hang straight down. A kite needs wind to fly. Lin's kite did not fly either. Sam's string is wound round the stick. The kite is bigger than last year's.",
    q: "Why would the kite not fly? Show the words.",
    who: ["", "🧵 String wound on the stick", "🪁 A bigger kite"],
    why: [
      "flags hanging straight down, and a kite needs wind",
      "string still wound round the stick",
      "a kite bigger than last year's",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The flags hang straight down.”", "“Lin's kite did not fly either.”"], but: "“Sam's string is wound round the stick.”" },
      { who: 1, ev: ["“Sam's string is wound round the stick.”"], but: "“Lin's kite did not fly either.”" },
      { who: 2, ev: ["“The kite is bigger than last year's.”"], but: "“A kite needs wind to fly.”" },
    ],
    clears: [],
    note:
      "Lin's kite did not fly either, and Lin's string is not Sam's string. Two kites failing at once points at the sky rather than at either kite.",
  },
  27: {
    story:
      "The shamrock leaves went limp. The pot soil is very dry. Plants need water to stand up. The class was away all week. The pot sits right on the hot pipe. The leaves are pale at the edges.",
    q: "Why did the leaves go limp? Point to the words.",
    who: ["", "🔥 The hot pipe", "🍃 Pale leaf edges"],
    why: [
      "very dry soil, and plants need water to stand up",
      "a pot sitting right on the hot pipe",
      "leaves that are pale at the edges",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The pot soil is very dry.”", "“The class was away all week.”"], but: "“The pot sits right on the hot pipe.”" },
      { who: 1, ev: ["“The pot sits right on the hot pipe.”"], but: "“Plants need water to stand up.”" },
      { who: 2, ev: ["“The leaves are pale at the edges.”"], but: "“The pot soil is very dry.”" },
    ],
    clears: [],
    note:
      "Dry soil and a hot pipe are close friends, and the class may well say so. Ask what dried the soil out, and the two answers join into one.",
  },
  28: {
    story:
      "Theo's left boot is wet inside. The right boot is dry inside. He stepped in a deep puddle. The left boot has a hole. Water gets in through a hole. His left sock was wet when he put it on. The left boot was by the open window all night.",
    q: "Why is one boot wet inside? Show the words.",
    who: ["", "🧦 A wet sock", "🪟 The open window"],
    why: [
      "a hole in that boot, and water gets in through a hole",
      "a left sock that was wet when he put it on",
      "the left boot by the open window all night",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The left boot has a hole.”", "“He stepped in a deep puddle.”"], but: "“His left sock was wet when he put it on.”" },
      { who: 1, ev: ["“His left sock was wet when he put it on.”"], but: "“Water gets in through a hole.”" },
      { who: 2, ev: ["“The left boot was by the open window all night.”"], but: "“The right boot is dry inside.”" },
    ],
    clears: [],
    note:
      "Everything in this story happened to the left foot. Say that out loud and count them on fingers. Three reasons and one wet boot.",
  },
  29: {
    story:
      "The carrot tops are gone. The carrots are still in the dirt. Small tracks go to the fence. A rabbit hole is by the fence. Rabbits eat green tops. The class picked tops for the art table on Friday. A bird was seen pulling at the leaves.",
    q: "Where did the tops go? Point to the words.",
    who: ["", "✂️ Picked for the art table", "🐦 A bird at the leaves"],
    why: [
      "small tracks to a rabbit hole, and rabbits eat tops",
      "tops picked for the art table on Friday",
      "a bird seen pulling at the leaves",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Small tracks go to the fence.”", "“A rabbit hole is by the fence.”"], but: "“The class picked tops for the art table on Friday.”" },
      { who: 1, ev: ["“The class picked tops for the art table on Friday.”"], but: "“Small tracks go to the fence.”" },
      { who: 2, ev: ["“A bird was seen pulling at the leaves.”"], but: "“Rabbits eat green tops.”" },
    ],
    clears: [],
    note:
      "The carrots are still in the dirt, so whatever took the tops left the roots. Ask which of the three would do that, and whether anybody checked the art table.",
  },
  30: {
    story:
      "A shell lay under the nest. The shell is in two neat halves. A chick pushes out in halves. A smashed egg is in bits. A new bird sits in the nest. A cat was under the tree on Monday. The nest leans to one side now.",
    q: "What happened to the egg? Show the words.",
    who: ["", "🐈 The cat on Monday", "🪹 A leaning nest"],
    why: [
      "two neat halves, and a chick pushes out in halves",
      "a cat under the tree on Monday",
      "a nest that leans to one side now",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The shell is in two neat halves.”", "“A new bird sits in the nest.”"], but: "“A cat was under the tree on Monday.”" },
      { who: 1, ev: ["“A cat was under the tree on Monday.”"], but: "“A chick pushes out in halves.”" },
      { who: 2, ev: ["“The nest leans to one side now.”"], but: "“A smashed egg is in bits.”" },
    ],
    clears: [],
    note:
      "Two neat halves and a new bird in the nest is a story that tells itself. Ask what the shell would look like if the cat had got it, and the word bits is already on the page.",
  },
  31: {
    story:
      "The paper bin fills up fast. The class cuts paper every day. Scraps go in the paper bin. The trash bin is almost empty. The paper bin is the smaller of the two. Nobody empties it until Friday.",
    q: "Why does the paper bin fill up? Point to the words.",
    who: ["", "📏 The smaller bin", "📅 Emptied only on Friday"],
    why: [
      "cutting paper every day, with scraps going in",
      "the smaller of the two bins",
      "nobody emptying it until Friday",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The class cuts paper every day.”", "“Scraps go in the paper bin.”"], but: "“The paper bin is the smaller of the two.”" },
      { who: 1, ev: ["“The paper bin is the smaller of the two.”"], but: "“The trash bin is almost empty.”" },
      { who: 2, ev: ["“Nobody empties it until Friday.”"], but: "“Scraps go in the paper bin.”" },
    ],
    clears: [],
    note:
      "One bin is full and one is empty, and they are different sizes and emptied at different times. Ask the class for the easiest thing to change, and let them argue about it.",
  },
  32: {
    story:
      "Half of the class photo is dark. A finger shape sits in the corner. Ben held the camera. A finger blocks the light. The room light was off on that side. Ben's thumb has a plaster on it today.",
    q: "Why is half the photo dark? Show the words.",
    who: ["", "💡 The room light", "🩹 The plaster on his thumb"],
    why: [
      "a finger shape in the corner, and a finger blocks light",
      "the room light off on that side",
      "a plaster on Ben's thumb today",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A finger shape sits in the corner.”", "“A finger blocks the light.”"], but: "“The room light was off on that side.”" },
      { who: 1, ev: ["“The room light was off on that side.”"], but: "“A finger shape sits in the corner.”" },
      { who: 2, ev: ["“Ben's thumb has a plaster on it today.”"], but: "“Ben held the camera.”" },
    ],
    clears: [],
    note:
      "A finger shape is a shape, and shapes are the best evidence a six-year-old can use. Ask what a dark room looks like in a photo, and whether it has edges.",
  },
  33: {
    story:
      "Two beans grew in one pot. One bean is tall and thin. It grew behind a big book. A plant stretches to find light. The short bean sits in the light. The tall one is closest to the warm wall. The tall seed went in three days first.",
    q: "Why is one bean tall and thin? Point to the words.",
    who: ["", "🧱 The warm wall", "📅 Three days a head start"],
    why: [
      "grown behind a big book, where a plant stretches for light",
      "closest to the warm wall",
      "a seed that went in three days first",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“It grew behind a big book.”", "“A plant stretches to find light.”"], but: "“The tall one is closest to the warm wall.”" },
      { who: 1, ev: ["“The tall one is closest to the warm wall.”"], but: "“The short bean sits in the light.”" },
      { who: 2, ev: ["“The tall seed went in three days first.”"], but: "“One bean is tall and thin.”" },
    ],
    clears: [],
    note:
      "Tall and thin is two words and they do different jobs. A head start makes a plant taller. Only stretching for light makes it thin as well.",
  },
  34: {
    story:
      "Nia's cone dripped all over her hand. Jo's cone did not drip. Nia sat in the sun. Jo sat under the tree. Sun melts ice cream fast. Nia held hers for ten minutes before eating. Jo's cone came out of the tub last.",
    q: "Why did one cone drip? Show the words.",
    who: ["", "🕐 Ten minutes of holding", "🥄 Scooped out last"],
    why: [
      "sitting in the sun, which melts ice cream fast",
      "held for ten minutes before eating",
      "a cone scooped out of the tub last",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Nia sat in the sun.”", "“Jo sat under the tree.”"], but: "“Nia held hers for ten minutes before eating.”" },
      { who: 1, ev: ["“Nia held hers for ten minutes before eating.”"], but: "“Sun melts ice cream fast.”" },
      { who: 2, ev: ["“Jo's cone came out of the tub last.”"], but: "“Jo's cone did not drip.”" },
    ],
    clears: [],
    note:
      "Nia was in the sun and she also waited. Ask what would have happened if Jo had waited ten minutes under the tree. That is the test, and the class can picture it.",
  },
  35: {
    story:
      "Kim's field day ribbon is short. The end is cut straight across. Scissors make a straight cut. A ribbon piece sits in the art box. Kim's ribbon was caught in the door at lunch. The ribbons came in two lengths this year.",
    q: "Why is the ribbon short? Point to the words.",
    who: ["", "🚪 The door at lunch", "📏 Two lengths this year"],
    why: [
      "a straight cut end, and scissors cut straight",
      "caught in the door at lunch",
      "ribbons that came in two lengths this year",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The end is cut straight across.”", "“A ribbon piece sits in the art box.”"], but: "“Kim's ribbon was caught in the door at lunch.”" },
      { who: 1, ev: ["“Kim's ribbon was caught in the door at lunch.”"], but: "“Scissors make a straight cut.”" },
      { who: 2, ev: ["“The ribbons came in two lengths this year.”"], but: "“The end is cut straight across.”" },
    ],
    clears: [],
    note:
      "If the ribbons came in two lengths, maybe nothing happened at all. That is a good answer and children rarely reach it. The straight end is the thing that argues back.",
  },
  36: {
    story:
      "A balloon popped by the window. The window sill is hot. Hot air makes a balloon grow. A grown balloon pops. The balloons in the shade are fine. The window balloons were blown up the biggest. A staple holds the string to the sill.",
    q: "Why did the balloon pop? Show the words.",
    who: ["", "💨 Blown up biggest", "📎 The staple on the sill"],
    why: [
      "a hot sill, and hot air makes a balloon grow",
      "the window balloons blown up the biggest",
      "a staple holding the string to the sill",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The window sill is hot.”", "“The balloons in the shade are fine.”"], but: "“The window balloons were blown up the biggest.”" },
      { who: 1, ev: ["“The window balloons were blown up the biggest.”"], but: "“The balloons in the shade are fine.”" },
      { who: 2, ev: ["“A staple holds the string to the sill.”"], but: "“Hot air makes a balloon grow.”" },
    ],
    clears: [],
    note:
      "The shade balloons are fine, and that one sentence is worth more than the rest. They are in the same room with the same staples. Ask what is different about them.",
  },
};
