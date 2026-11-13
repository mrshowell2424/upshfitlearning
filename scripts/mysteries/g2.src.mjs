/**
 * Grade 2 mysteries: thirty-six cases, one a week, on the same thirty-six
 * themes as every other grade. Week 9 is the pumpkin case in every room in
 * the building; only the reading level and the case itself change.
 *
 * Held to the band in scripts/reading-mystery-plan.json: 50-76 words, mean
 * sentence no longer than 10 words, three suspects, and at least two proof
 * quotes that are really in the story.
 *
 * At this level the evidence has to be findable by a reader who is still
 * decoding, so every case turns on one physical fact a seven-year-old can
 * point at -- a hole, a sunny sill, a plug halfway out -- and the two other
 * suspects are each ruled out by a sentence of their own.
 *
 *   bun run scripts/mysteries/g2.src.mjs && bun run scripts/merge-mysteries.mjs
 *   bun run scripts/check-mysteries.mjs
 */
import { gradeMysteries } from "./build.mjs";

const CASES = [
  {
    t: "The Case of the Wet Book",
    tag: "📚 library",
    story: "A library book came back with wet pages. Mrs. Kim looked for clues. The book was in Sam's blue bag. Sam's water bottle was in the same bag. The lid was not screwed on all the way. Ava had the book last week. She gave it back dry. The wet spot starts where the bottle sat.",
    q: "What made the book wet?",
    s: [
      { who: "💧 Sam's water bottle", why: "in the same bag, with the lid not screwed on" },
      { who: "🙋 Ava", why: "she gave it back dry" },
      { who: "🌧️ Rain", why: "the wet spot starts where the bottle sat" },
    ],
    who: 0,
    answer: "Sam's water bottle leaked on the book.",
    proof: [
      "“Sam's water bottle was in the same bag.”",
      "“The lid was not screwed on all the way.”",
    ],
    clears: [
      "Ava: “She gave it back dry.”",
      "Rain: “The wet spot starts where the bottle sat.”",
    ],
    explain: "The wet spot starts where the bottle sat. Because the lid was not screwed on all the way, the water leaked onto the book.",
  },
  {
    t: "The Case of the Empty Snack Bag",
    tag: "🥪 lunchbox",
    story: "Mia packed apple slices in a snack bag. At lunch the bag was empty. The bag had a small hole in one corner. A line of apple slices lay in her backpack. Her friend Jo ate her own lunch. Mia had not opened the bag yet. The slices were still cold. Nobody else touched her bag.",
    q: "Where did the apple slices go?",
    s: [
      { who: "🕳️ A hole in the bag", why: "a line of slices lay in her backpack" },
      { who: "🙋 Jo ate them", why: "Jo ate her own lunch" },
      { who: "🍎 Mia ate them", why: "Mia had not opened the bag yet" },
    ],
    who: 0,
    answer: "The slices fell out through the hole.",
    proof: [
      "“The bag had a small hole in one corner.”",
      "“A line of apple slices lay in her backpack.”",
    ],
    clears: [
      "Jo: “Her friend Jo ate her own lunch.”",
      "Mia: “Mia had not opened the bag yet.”",
    ],
    explain: "A line of slices lay in her backpack. Because the bag had a hole in one corner, the slices fell out one at a time.",
  },
  {
    t: "The Case of the Short Pencil",
    tag: "✏️ pencil",
    story: "Ben's new pencil was long on Monday. On Friday it was very short. Ben did not lose it. Nobody else used it. The sharpener was full of his shavings. Ben likes to make the tip sharp. He sharpened it after every page. The pencil is still his pencil. It just got smaller.",
    q: "Why is the pencil so short?",
    s: [
      { who: "✏️ Sharpening it too much", why: "the sharpener was full of his shavings" },
      { who: "🎒 He lost it", why: "Ben did not lose it" },
      { who: "🙋 Somebody took it", why: "nobody else used it" },
    ],
    who: 0,
    answer: "Ben sharpened the pencil down.",
    proof: [
      "“The sharpener was full of his shavings.”",
      "“He sharpened it after every page.”",
    ],
    clears: [
      "Losing it: “Ben did not lose it.”",
      "Somebody taking it: “Nobody else used it.”",
    ],
    explain: "The pencil is still his pencil. Because he sharpened it after every page, the shavings filled the sharpener and the pencil got shorter.",
  },
  {
    t: "The Case of the Soft Apples",
    tag: "🍎 apple",
    story: "Room 5 picked apples on Monday. By Friday six were soft and brown. The six soft ones sat in a sunny spot. The rest sat in the cool hall. Nobody dropped the apples. All the apples came from one tree. The soft ones smell sweet. Warm air makes an apple go soft fast.",
    q: "Why did six apples go soft?",
    s: [
      { who: "☀️ The sunny spot", why: "the six soft ones sat in a sunny spot" },
      { who: "🍎 A bad tree", why: "all the apples came from one tree" },
      { who: "🖐 They were dropped", why: "nobody dropped the apples" },
    ],
    who: 0,
    answer: "The warm sunny spot made the apples soft.",
    proof: [
      "“The six soft ones sat in a sunny spot.”",
      "“Warm air makes an apple go soft fast.”",
    ],
    clears: [
      "A bad tree: “All the apples came from one tree.”",
      "Dropping: “Nobody dropped the apples.”",
    ],
    explain: "The apples in the cool hall are still firm. Because the six soft ones sat in a sunny spot, the warm air made them go soft.",
  },
  {
    t: "The Case of the Squeaky Bike",
    tag: "🚲 bike",
    story: "Lin's bike squeaked on every ride. The squeak came from the back wheel. Her dad looked at the chain. The chain was dry and dusty. The tires were full of air. The brakes were tight and clean. Nothing was bent or broken. He put oil on the chain. The squeak stopped.",
    q: "What made the bike squeak?",
    s: [
      { who: "⛓️ The dry chain", why: "the chain was dry and dusty" },
      { who: "🛞 The tires", why: "the tires were full of air" },
      { who: "🛑 The brakes", why: "the brakes were tight and clean" },
    ],
    who: 0,
    answer: "The dry chain made the squeak.",
    proof: [
      "“The chain was dry and dusty.”",
      "“He put oil on the chain.”",
    ],
    clears: [
      "The tires: “The tires were full of air.”",
      "The brakes: “The brakes were tight and clean.”",
    ],
    explain: "The squeak stopped after the oil went on. Because the chain was dry and dusty, it squeaked on every ride.",
  },
  {
    t: "The Case of the Green Water",
    tag: "🐠 fishtank",
    story: "The fish tank water turned green. The class checked the filter twice. The filter was clean and running. Both tanks got the same food. The tank sits in front of a sunny window. Green plants grow fast in sunlight. A second tank sits in the dark hall. That water is still clear.",
    q: "Why did the water turn green?",
    s: [
      { who: "☀️ Sun on the window", why: "the tank in the dark hall is still clear" },
      { who: "🔌 The filter", why: "the filter was clean and running" },
      { who: "🍚 Too much food", why: "both tanks got the same food" },
    ],
    who: 0,
    answer: "Sunlight made tiny green plants grow.",
    proof: [
      "“The tank sits in front of a sunny window.”",
      "“Green plants grow fast in sunlight.”",
    ],
    clears: [
      "The filter: “The filter was clean and running.”",
      "Food: “Both tanks got the same food.”",
    ],
    explain: "The tank in the dark hall is still clear. Because this tank sits in a sunny window, green plants grew fast in the light.",
  },
  {
    t: "The Case of the Buzzing Light",
    tag: "🔊 noise",
    story: "A buzz came from the ceiling in Room 2. It buzzed only in the morning. The class turns the lights on at eight. One long light bulb flickers when it buzzes. The clock on the wall is quiet. No bees were in the room. Mr. Lee changed that bulb. The buzzing went away.",
    q: "What was buzzing?",
    s: [
      { who: "💡 A bad light bulb", why: "one long bulb flickers when it buzzes" },
      { who: "⏰ The clock", why: "the clock on the wall is quiet" },
      { who: "🐝 A bee", why: "no bees were in the room" },
    ],
    who: 0,
    answer: "A bad light bulb made the buzz.",
    proof: [
      "“One long light bulb flickers when it buzzes.”",
      "“Mr. Lee changed that bulb.”",
    ],
    clears: [
      "The clock: “The clock on the wall is quiet.”",
      "A bee: “No bees were in the room.”",
    ],
    explain: "The buzzing went away after the bulb was changed. Because the bulb flickers when it buzzes, that bulb was making the sound.",
  },
  {
    t: "The Case of the Moving Leaves",
    tag: "🍂 leaves",
    story: "Room 3 raked leaves into one big pile. The pile was neat on Monday. The next day the leaves were spread out. No footprints were in the pile. The gate was shut all night. A strong wind blew all night long. The leaves lie in a long line. The line points away from the wind.",
    q: "What spread the leaves out?",
    s: [
      { who: "🌬️ The wind", why: "the leaves lie in a long line" },
      { who: "👣 Somebody walked in them", why: "no footprints were in the pile" },
      { who: "🐕 A dog", why: "the gate was shut all night" },
    ],
    who: 0,
    answer: "The wind blew the leaves into a line.",
    proof: [
      "“A strong wind blew all night long.”",
      "“The leaves lie in a long line.”",
    ],
    clears: [
      "Somebody walking: “No footprints were in the pile.”",
      "A dog: “The gate was shut all night.”",
    ],
    explain: "The line points away from the wind. Because a strong wind blew all night, it spread the pile into a long line.",
  },
  {
    t: "The Case of the Leaking Pumpkin",
    tag: "🎃 pumpkin",
    story: "The class pumpkin sat by the door. On Monday a puddle was under it. The bottom of the pumpkin was soft. Nobody cut the pumpkin open. No animal came in the room. The pumpkin is ten days old. A soft spot lets the juice out. The puddle is right under the soft spot.",
    q: "Where did the puddle come from?",
    s: [
      { who: "🎃 A soft spot on the pumpkin", why: "the puddle is right under the soft spot" },
      { who: "🔪 Somebody cut it", why: "nobody cut the pumpkin open" },
      { who: "🐀 An animal", why: "no animal came in the room" },
    ],
    who: 0,
    answer: "The soft spot let juice out of the pumpkin.",
    proof: [
      "“The bottom of the pumpkin was soft.”",
      "“A soft spot lets the juice out.”",
    ],
    clears: [
      "Cutting: “Nobody cut the pumpkin open.”",
      "An animal: “No animal came in the room.”",
    ],
    explain: "The puddle is right under the soft spot. Because the bottom went soft, the juice leaked out of the pumpkin.",
  },
  {
    t: "The Case of the White Footprints",
    tag: "👣 footprints",
    story: "White footprints went down the hall. They came from the art room. The art class used white paint today. The prints are small like a child's shoe. Mr. Ruiz wears big boots. The paint tray sat on the floor. One student stepped in the tray. The prints lead to the sink.",
    q: "Who made the white footprints?",
    s: [
      { who: "🎨 A student in the art class", why: "the prints are small and the tray sat on the floor" },
      { who: "🧹 Mr. Ruiz", why: "Mr. Ruiz wears big boots" },
      { who: "🐕 A dog", why: "the prints look like a child's shoe" },
    ],
    who: 0,
    answer: "A student stepped in the paint tray.",
    proof: [
      "“The paint tray sat on the floor.”",
      "“One student stepped in the tray.”",
    ],
    clears: [
      "Mr. Ruiz: “Mr. Ruiz wears big boots.”",
      "A dog: “The prints are small like a child's shoe.”",
    ],
    explain: "The prints lead to the sink. Because the paint tray sat on the floor, one student stepped in it and walked away.",
  },
  {
    t: "The Case of the Left Coat",
    tag: "🚌 bus",
    story: "Theo could not find his red coat. He wore it on the bus. He took it off because the bus was warm. The driver found a red coat on seat 4. Theo always sits in seat 4. His mom looked all over the house. He checked his cubby too. The coat was not there.",
    q: "Where was the coat?",
    s: [
      { who: "🚌 On the bus in seat 4", why: "the driver found a red coat on seat 4" },
      { who: "🏠 At home", why: "his mom looked all over the house" },
      { who: "🏫 At school", why: "he took it off on the bus" },
    ],
    who: 0,
    answer: "The coat was on the bus in seat 4.",
    proof: [
      "“The driver found a red coat on seat 4.”",
      "“Theo always sits in seat 4.”",
    ],
    clears: [
      "At home: “His mom looked all over the house.”",
      "At school: “He took it off because the bus was warm.”",
    ],
    explain: "Theo always sits in seat 4. Because he took his coat off on the warm bus, it stayed on his seat.",
  },
  {
    t: "The Case of the Dusty Trophy",
    tag: "🏆 trophy",
    story: "The reading trophy looked shiny in the fall. Now it looks gray. The case has no door on the back. The shelf is next to an open window. Gray dust sits on the window sill. No one has touched the trophy. Mrs. Diaz wiped it with a cloth. It was shiny again.",
    q: "Why did the trophy look gray?",
    s: [
      { who: "🌫️ Dust from the window", why: "gray dust sits on the window sill" },
      { who: "🖐 Handling", why: "no one has touched the trophy" },
      { who: "🏅 Cheap paint", why: "a wipe made it shiny again" },
    ],
    who: 0,
    answer: "Dust from the open window made it gray.",
    proof: [
      "“The shelf is next to an open window.”",
      "“Gray dust sits on the window sill.”",
    ],
    clears: [
      "Handling: “No one has touched the trophy.”",
      "Paint: “It was shiny again.”",
    ],
    explain: "A wipe made the trophy shiny again. Because the case has no back and sits by an open window, gray dust settled on it.",
  },
  {
    t: "The Case of the Cold Rolls",
    tag: "🦃 turkey",
    story: "The class made rolls for the fall feast. The rolls came out cold in the middle. The oven was on at the right heat. The rolls baked for the right time. Ten rolls were stacked in one pan. Rolls in the middle of a stack stay cold. The rolls on the edge were warm.",
    q: "Why were the rolls cold inside?",
    s: [
      { who: "🥐 Stacked too close", why: "rolls in the middle of a stack stay cold" },
      { who: "🔥 The oven heat", why: "the oven was on at the right heat" },
      { who: "⏲️ Not enough time", why: "the rolls baked for the right time" },
    ],
    who: 0,
    answer: "The rolls were stacked too close together.",
    proof: [
      "“Ten rolls were stacked in one pan.”",
      "“Rolls in the middle of a stack stay cold.”",
    ],
    clears: [
      "The oven: “The oven was on at the right heat.”",
      "Time: “The rolls baked for the right time.”",
    ],
    explain: "The rolls on the edge were warm. Because ten rolls were stacked in one pan, the heat could not reach the middle ones.",
  },
  {
    t: "The Case of the Sunken Cupcakes",
    tag: "🧁 cupcake",
    story: "Room 1 baked cupcakes for a party. Each cupcake looked fine at first. Each one sank in the middle. The class opened the oven to look. They opened it three times. Cool air makes a cake fall. The batter was mixed just right. The oven was the right heat. The edges rose fine.",
    q: "Why did the cupcakes sink?",
    s: [
      { who: "🚪 Opening the oven", why: "they opened it three times" },
      { who: "🥣 The batter", why: "the batter was mixed just right" },
      { who: "🌡️ The oven heat", why: "the oven was the right heat" },
    ],
    who: 0,
    answer: "Cool air from the open oven made them fall.",
    proof: [
      "“They opened it three times.”",
      "“Cool air makes a cake fall.”",
    ],
    clears: [
      "The batter: “The batter was mixed just right.”",
      "The oven: “The oven was the right heat.”",
    ],
    explain: "The edges rose fine. Because the class opened the oven three times, cool air got in and the middles sank.",
  },
  {
    t: "The Case of the One Wet Glove",
    tag: "🧤 mitten",
    story: "Ana has two gloves. One glove is wet and one is dry. She made a snowball with her right hand. Her right glove is the wet one. She kept her left hand in her pocket. Both gloves hung by the heater all night. Snow melts into a glove that touches it.",
    q: "Why is one glove wet?",
    s: [
      { who: "❄️ The snowball", why: "she made it with her right hand" },
      { who: "🔥 The heater", why: "both gloves hung by the heater" },
      { who: "☔ Rain", why: "she kept her left hand in her pocket" },
    ],
    who: 0,
    answer: "The snowball made her right glove wet.",
    proof: [
      "“She made a snowball with her right hand.”",
      "“Her right glove is the wet one.”",
    ],
    clears: [
      "The heater: “Both gloves hung by the heater all night.”",
      "Her other hand: “She kept her left hand in her pocket.”",
    ],
    explain: "Both gloves hung by the same heater. Because she made a snowball with her right hand, snow melted into only that glove.",
  },
  {
    t: "The Case of the Sliding Candy",
    tag: "🎄 ginger",
    story: "Room 6 stuck candy on a gingerbread house. By morning the candy slid down. The class used soft frosting for glue. Soft frosting never gets hard. The candy on the roof fell first. No one bumped the house. The walls of the house still stand. Another class used hard icing. Their candy stayed on.",
    q: "Why did the candy slide off?",
    s: [
      { who: "🍯 Soft frosting", why: "soft frosting never gets hard" },
      { who: "🖐 Somebody bumped it", why: "no one bumped the house" },
      { who: "🍬 Heavy candy", why: "the other class's candy stayed on" },
    ],
    who: 0,
    answer: "The soft frosting never got hard.",
    proof: [
      "“The class used soft frosting for glue.”",
      "“Soft frosting never gets hard.”",
    ],
    clears: [
      "Bumping: “No one bumped the house.”",
      "Heavy candy: “Their candy stayed on.”",
    ],
    explain: "Another class used hard icing and their candy stayed on. Because this class used soft frosting, the candy slid down.",
  },
  {
    t: "The Case of the Dark Window",
    tag: "💡 lights",
    story: "Six lights hang in the school window. Three of them went dark. The dark three are all on one end. One plug joins that end to the wall. The plug was pulled halfway out. The bright three use a different plug. Mr. Cole pushed the plug in. All six lit up.",
    q: "Why were three lights dark?",
    s: [
      { who: "🔌 A loose plug", why: "the plug was pulled halfway out" },
      { who: "💡 Burned out bulbs", why: "all six lit up when the plug went in" },
      { who: "⚡ A power cut", why: "the bright three use a different plug" },
    ],
    who: 0,
    answer: "A loose plug left that end with no power.",
    proof: [
      "“One plug joins that end to the wall.”",
      "“The plug was pulled halfway out.”",
    ],
    clears: [
      "Bulbs: “All six lit up.”",
      "A power cut: “The bright three use a different plug.”",
    ],
    explain: "All six lit up when the plug went back in. Because the plug for that end was halfway out, those three lights had no power.",
  },
  {
    t: "The Case of the Loud Clock",
    tag: "⏰ clock",
    story: "The class clock used to be quiet. Now it ticks very loudly. The clock still shows the right time. Nothing is cracked or bent. The class moved the clock to a bare wall. A bare wall sends sound back into the room. The old wall had a soft bulletin board on it.",
    q: "Why does the clock sound loud now?",
    s: [
      { who: "🧱 The bare wall", why: "a bare wall sends sound back into the room" },
      { who: "🔋 A broken clock", why: "the clock still shows the right time" },
      { who: "🔨 Damage", why: "nothing is cracked or bent" },
    ],
    who: 0,
    answer: "The bare wall sends the tick back into the room.",
    proof: [
      "“The class moved the clock to a bare wall.”",
      "“A bare wall sends sound back into the room.”",
    ],
    clears: [
      "A broken clock: “The clock still shows the right time.”",
      "Damage: “Nothing is cracked or bent.”",
    ],
    explain: "The old wall had a soft bulletin board on it. Because the clock now hangs on a bare wall, the tick bounces back into the room.",
  },
  {
    t: "The Case of the Short Snowman",
    tag: "⛄ snow",
    story: "Room 4 built a snowman on Monday. By Friday it was half as tall. No one knocked it over. The yard was locked all week. Every day was warm and sunny. Water sat in a ring around the snowman. Snow turns to water when the air is warm. The snowman is still standing.",
    q: "Why did the snowman get short?",
    s: [
      { who: "☀️ Warm sunny days", why: "water sat in a ring around it" },
      { who: "🖐 Somebody knocked it over", why: "no one knocked it over" },
      { who: "🐕 An animal", why: "the yard was locked all week" },
    ],
    who: 0,
    answer: "The warm sun melted the snow into water.",
    proof: [
      "“Every day was warm and sunny.”",
      "“Snow turns to water when the air is warm.”",
    ],
    clears: [
      "Knocking: “No one knocked it over.”",
      "An animal: “The yard was locked all week.”",
    ],
    explain: "The snowman is still standing and there is water around it. Because every day was warm and sunny, the snow turned to water and the snowman got shorter.",
  },
  {
    t: "The Case of the Tipped Feeder",
    tag: "🐦 feeder",
    story: "The bird feeder hangs by the window. On Tuesday it hung sideways. One of the two strings was snapped. The snapped end looks chewed, not cut. Squirrel tracks go up the tree. No wind blew that night. The seed spilled under the feeder. Birds are light and small. Birds cannot chew a string.",
    q: "What made the feeder tip?",
    s: [
      { who: "🐿️ A squirrel", why: "the end looks chewed and tracks go up the tree" },
      { who: "🌬️ The wind", why: "no wind blew that night" },
      { who: "🐦 The birds", why: "birds cannot chew a string" },
    ],
    who: 0,
    answer: "A squirrel chewed through one string.",
    proof: [
      "“The snapped end looks chewed, not cut.”",
      "“Squirrel tracks go up the tree.”",
    ],
    clears: [
      "The wind: “No wind blew that night.”",
      "The birds: “Birds cannot chew a string.”",
    ],
    explain: "The end looks chewed and tracks go up the tree. Because a squirrel chewed one of the two strings, the feeder hung sideways.",
  },
  {
    t: "The Case of the Cool Cocoa",
    tag: "☕ cocoa",
    story: "The cocoa was hot in the pot. In the cups it was only warm. The cups came out of a cold cupboard. Nobody added cold milk. The pot stayed on the warm stove. A cold cup takes heat from the drink. The class warmed the cups with hot water. The next cocoa stayed hot.",
    q: "Why was the cocoa only warm?",
    s: [
      { who: "🥤 The cold cups", why: "a cold cup takes heat from the drink" },
      { who: "🥛 Cold milk", why: "nobody added cold milk" },
      { who: "🍲 The pot", why: "the pot stayed on the warm stove" },
    ],
    who: 0,
    answer: "The cold cups took the heat from the cocoa.",
    proof: [
      "“The cups came out of a cold cupboard.”",
      "“A cold cup takes heat from the drink.”",
    ],
    clears: [
      "Cold milk: “Nobody added cold milk.”",
      "The pot: “The pot stayed on the warm stove.”",
    ],
    explain: "The next cocoa stayed hot after the cups were warmed. Because the cups came from a cold cupboard, they took the heat from the drink.",
  },
  {
    t: "The Case of the Stuck Valentines",
    tag: "💌 valentine",
    story: "Room 7 made valentines with red paint. The next day two were stuck together. The two stuck ones were at the bottom of the pile. The ones on top are dry. Wet paint sticks when paper lies on it. The class stacked them right away. The paint was still wet then. Nobody spilled any glue.",
    q: "Why did two valentines stick together?",
    s: [
      { who: "🎨 Wet paint in the stack", why: "wet paint sticks when paper lies on it" },
      { who: "🧴 Glue", why: "nobody spilled any glue" },
      { who: "💧 Water", why: "the ones on top are dry" },
    ],
    who: 0,
    answer: "Wet paint stuck the bottom two together.",
    proof: [
      "“The class stacked them right away.”",
      "“Wet paint sticks when paper lies on it.”",
    ],
    clears: [
      "Glue: “Nobody spilled any glue.”",
      "Water: “The ones on top are dry.”",
    ],
    explain: "The two stuck ones were at the bottom of the pile. Because the class stacked them right away, the wet paint stuck the bottom ones together.",
  },
  {
    t: "The Case of the Slow Volcano",
    tag: "🌋 volcano",
    story: "Sara's model volcano bubbled very slowly at school. It bubbled fast at home. At home she used warm vinegar. At school she used cold vinegar. Cold vinegar bubbles slower than warm. The baking soda came from the same box. The model has no cracks in it. She poured the same amount.",
    q: "Why did the volcano bubble slowly at school?",
    s: [
      { who: "🧊 The cold vinegar", why: "cold vinegar bubbles slower than warm" },
      { who: "🥄 The baking soda", why: "it came from the same box" },
      { who: "🗻 The model", why: "the model has no cracks in it" },
    ],
    who: 0,
    answer: "The cold vinegar bubbled more slowly.",
    proof: [
      "“At school she used cold vinegar.”",
      "“Cold vinegar bubbles slower than warm.”",
    ],
    clears: [
      "The baking soda: “The baking soda came from the same box.”",
      "The model: “The model has no cracks in it.”",
    ],
    explain: "It bubbled fast at home with warm vinegar. Because she used cold vinegar at school, the bubbling was slow.",
  },
  {
    t: "The Case of the Loose Crown",
    tag: "👑 crown",
    story: "Kai's paper crown fit at the first play. At the show it slid down. The crown is the same size. Nobody bent it or cut it. Kai got a haircut on Friday. Short hair takes up less room. The crown now needs a clip. His hair is much shorter than before.",
    q: "Why did the crown slide down?",
    s: [
      { who: "✂️ The haircut", why: "short hair takes up less room" },
      { who: "👑 The crown changed", why: "the crown is the same size" },
      { who: "🖐 Somebody bent it", why: "nobody bent it or cut it" },
    ],
    who: 0,
    answer: "The haircut left less hair to hold the crown.",
    proof: [
      "“Kai got a haircut on Friday.”",
      "“Short hair takes up less room.”",
    ],
    clears: [
      "The crown: “The crown is the same size.”",
      "Bending: “Nobody bent it or cut it.”",
    ],
    explain: "The crown is the same size as before. Because Kai got a haircut, there was less hair to hold the crown up.",
  },
  {
    t: "The Case of the Quiet Key",
    tag: "🎹 piano",
    story: "One key on the class piano made no sound. The other keys all work. Mr. Okafor looked inside the piano. A pencil had fallen onto the strings. The pencil sat under that one hammer. A hammer cannot hit a string through a pencil. He took the pencil out. The key worked again.",
    q: "Why did one key make no sound?",
    s: [
      { who: "✏️ A pencil on the strings", why: "the pencil sat under that one hammer" },
      { who: "🎹 A broken key", why: "the key worked again once the pencil came out" },
      { who: "🎵 All the keys", why: "the other keys all work" },
    ],
    who: 0,
    answer: "A pencil blocked the hammer from the string.",
    proof: [
      "“A pencil had fallen onto the strings.”",
      "“The pencil sat under that one hammer.”",
    ],
    clears: [
      "A broken key: “The key worked again.”",
      "The other keys: “The other keys all work.”",
    ],
    explain: "The key worked again once the pencil came out. Because the pencil sat under that hammer, the hammer could not reach the string.",
  },
  {
    t: "The Case of the Low Kite",
    tag: "🪁 kite",
    story: "Omar's kite would not go up high. It flew high last Saturday. Today he flew it near the school wall. The wall blocks the wind on that side. Out in the open field the wind is strong. His string is not tangled. He used the same kite both days. The kite has no rips in it.",
    q: "Why would the kite not go high?",
    s: [
      { who: "🧱 The school wall", why: "the wall blocks the wind on that side" },
      { who: "🧵 A tangled string", why: "his string is not tangled" },
      { who: "🕳️ A rip in the kite", why: "the kite has no rips in it" },
    ],
    who: 0,
    answer: "The wall blocked the wind near the school.",
    proof: [
      "“Today he flew it near the school wall.”",
      "“The wall blocks the wind on that side.”",
    ],
    clears: [
      "A tangled string: “His string is not tangled.”",
      "A rip: “The kite has no rips in it.”",
    ],
    explain: "Out in the open field the wind is strong. Because he flew the kite near the wall, the wall blocked the wind.",
  },
  {
    t: "The Case of the Thin Shamrocks",
    tag: "☘️ shamrock",
    story: "Room 9 grew shamrocks in two pots. The plants in one pot are thin and pale. That pot sits far from the window. The other pot sits right on the sill. Plants need light to grow strong. Both pots got the same water. Both pots have the same soil. The thin ones lean toward the window.",
    q: "Why are one pot's shamrocks thin?",
    s: [
      { who: "🪟 Not enough light", why: "that pot sits far from the window" },
      { who: "💧 Water", why: "both pots got the same water" },
      { who: "🪴 The soil", why: "both pots have the same soil" },
    ],
    who: 0,
    answer: "The pot far from the window got too little light.",
    proof: [
      "“That pot sits far from the window.”",
      "“Plants need light to grow strong.”",
    ],
    clears: [
      "Water: “Both pots got the same water.”",
      "The soil: “Both pots have the same soil.”",
    ],
    explain: "The thin ones lean toward the window. Because that pot sits far from the window, those plants did not get enough light.",
  },
  {
    t: "The Case of the Wet Floor",
    tag: "🌧️ puddle",
    story: "A wet spot shows up by the door each cold morning. The roof above it does not leak. The sink is far down the hall. Cold glass makes water drops on the inside. The door has a big glass window. The drops run down to the floor. On warm days the floor is dry.",
    q: "Where does the wet spot come from?",
    s: [
      { who: "🚪 Drops on the glass door", why: "the drops run down to the floor" },
      { who: "🏠 A roof leak", why: "the roof above it does not leak" },
      { who: "🚰 The sink", why: "the sink is far down the hall" },
    ],
    who: 0,
    answer: "Water drops form on the cold glass door.",
    proof: [
      "“Cold glass makes water drops on the inside.”",
      "“The drops run down to the floor.”",
    ],
    clears: [
      "A roof leak: “The roof above it does not leak.”",
      "The sink: “The sink is far down the hall.”",
    ],
    explain: "On warm days the floor is dry. Because cold glass makes water drops, the door's window drips onto the floor on cold mornings.",
  },
  {
    t: "The Case of the Nibbled Lettuce",
    tag: "🌻 garden",
    story: "The garden lettuce has holes in the leaves. The holes are small and round. Slime trails shine on the dirt near the plants. Slugs leave slime when they move. Slugs come out at night. No bird tracks are in the garden. The fence keeps rabbits out. The holes start at the bottom leaves.",
    q: "What is eating the lettuce?",
    s: [
      { who: "🐌 Slugs", why: "slime trails shine on the dirt" },
      { who: "🐦 A bird", why: "no bird tracks are in the garden" },
      { who: "🐰 A rabbit", why: "the fence keeps rabbits out" },
    ],
    who: 0,
    answer: "Slugs are eating the lettuce leaves.",
    proof: [
      "“Slime trails shine on the dirt near the plants.”",
      "“Slugs leave slime when they move.”",
    ],
    clears: [
      "A bird: “No bird tracks are in the garden.”",
      "A rabbit: “The fence keeps rabbits out.”",
    ],
    explain: "The holes start at the bottom leaves and slime trails shine on the dirt. Because slugs leave slime when they move, slugs are eating the lettuce.",
  },
  {
    t: "The Case of the Quiet Nest",
    tag: "🪺 eggs",
    story: "Four eggs sat in a nest on the school sign. For two weeks a bird sat on them. This week the nest is empty and clean. No broken shells are on the ground. Tiny tracks lead away in the dust. Baby birds leave the nest when they can fly. The class saw four small birds in the tree.",
    q: "What happened to the eggs?",
    s: [
      { who: "🐣 They hatched", why: "four small birds are in the tree" },
      { who: "🐈 A cat took them", why: "no broken shells are on the ground" },
      { who: "🥚 They never hatched", why: "the class saw four small birds" },
    ],
    who: 0,
    answer: "The eggs hatched and the baby birds flew.",
    proof: [
      "“Baby birds leave the nest when they can fly.”",
      "“The class saw four small birds in the tree.”",
    ],
    clears: [
      "A cat: “No broken shells are on the ground.”",
      "Never hatching: “The class saw four small birds in the tree.”",
    ],
    explain: "The class saw four small birds in the tree. Because baby birds leave the nest when they can fly, the four eggs hatched.",
  },
  {
    t: "The Case of the Litter Corner",
    tag: "🌎 earth",
    story: "The school yard is clean but one fence corner is not. Paper collects there every week. The trash can is not broken. No class eats in that corner. The wind blows toward that fence. Paper stops when it hits a fence. Ms. Diaz cleaned it on Monday. It was full again on Friday.",
    q: "Why does paper collect in one corner?",
    s: [
      { who: "🌬️ The wind and the fence", why: "paper stops when it hits a fence" },
      { who: "🗑️ A broken trash can", why: "the trash can is not broken" },
      { who: "🍪 Students eat there", why: "no class eats in that corner" },
    ],
    who: 0,
    answer: "The wind blows paper to that fence.",
    proof: [
      "“The wind blows toward that fence.”",
      "“Paper stops when it hits a fence.”",
    ],
    clears: [
      "A broken can: “The trash can is not broken.”",
      "Eating there: “No class eats in that corner.”",
    ],
    explain: "It was full again on Friday with nobody eating there. Because the wind blows toward that fence, paper travels across the yard and stops at the corner.",
  },
  {
    t: "The Case of the Blurry Photos",
    tag: "📷 camera",
    story: "The class took photos on the field trip. Many came out blurry. The blurry ones were all taken on the bus. The bus was going fast. The clear ones were taken while standing still. A moving bus shakes the camera. The camera lens was clean. Nobody dropped the camera. The battery was full all day.",
    q: "Why were many photos blurry?",
    s: [
      { who: "🚌 Taken on the moving bus", why: "a moving bus shakes the camera" },
      { who: "🧼 A dirty lens", why: "the camera lens was clean" },
      { who: "🔋 The battery", why: "the battery was full all day" },
    ],
    who: 0,
    answer: "The moving bus shook the camera.",
    proof: [
      "“The blurry ones were all taken on the bus.”",
      "“A moving bus shakes the camera.”",
    ],
    clears: [
      "A dirty lens: “The camera lens was clean.”",
      "The battery: “The battery was full all day.”",
    ],
    explain: "The clear ones were taken while standing still. Because a moving bus shakes the camera, the photos taken on the bus came out blurry.",
  },
  {
    t: "The Case of the Yellow Leaves",
    tag: "🌱 plant",
    story: "Two bean plants sit on the class shelf. One has green leaves and one has yellow. The yellow one sits in a pot with no holes. Water fills the bottom of that pot. Roots rot when they sit in water. The green one's pot has three holes. Both plants get the same light.",
    q: "Why are one plant's leaves yellow?",
    s: [
      { who: "🕳️ A pot with no holes", why: "water fills the bottom of that pot" },
      { who: "☀️ Light", why: "both plants get the same light" },
      { who: "🌱 A bad seed", why: "the green one's pot has three holes" },
    ],
    who: 0,
    answer: "Water sat in the pot and the roots rotted.",
    proof: [
      "“Water fills the bottom of that pot.”",
      "“Roots rot when they sit in water.”",
    ],
    clears: [
      "Light: “Both plants get the same light.”",
      "The other pot: “The green one's pot has three holes.”",
    ],
    explain: "The green one's pot has three holes. Because the yellow one's pot has no holes, water sat at the bottom and the roots rotted.",
  },
  {
    t: "The Case of the Soft Ice Cream",
    tag: "🍦 icecream",
    story: "The class made ice cream in a bag. Six bags turned hard and two stayed soft. The two soft bags had less ice in them. Ice must touch the bag to make it cold. All eight bags got the same shaking. All eight used the same milk. The soft two sat in warm hands.",
    q: "Why did two bags stay soft?",
    s: [
      { who: "🧊 Not enough ice", why: "the two soft bags had less ice in them" },
      { who: "💪 Not enough shaking", why: "all eight bags got the same shaking" },
      { who: "🥛 The milk", why: "all eight used the same milk" },
    ],
    who: 0,
    answer: "The two soft bags did not have enough ice.",
    proof: [
      "“The two soft bags had less ice in them.”",
      "“Ice must touch the bag to make it cold.”",
    ],
    clears: [
      "Shaking: “All eight bags got the same shaking.”",
      "The milk: “All eight used the same milk.”",
    ],
    explain: "All eight bags got the same shaking and the same milk. Because the two soft bags had less ice, the milk never got cold enough.",
  },
  {
    t: "The Case of the Torn Ribbon",
    tag: "🎗️ ribbon",
    story: "Field day ribbons came in a box. Three had torn tops. The three torn ones hung on the same nail. The nail has a sharp edge. The other ribbons hung on a smooth hook. Nobody pulled on the ribbons. A sharp edge tears cloth. The tears are all in the same spot.",
    q: "What tore the three ribbons?",
    s: [
      { who: "📌 The sharp nail", why: "the three torn ones hung on the same nail" },
      { who: "🖐 Somebody pulled them", why: "nobody pulled on the ribbons" },
      { who: "🪝 The hook", why: "the other ribbons hung on a smooth hook" },
    ],
    who: 0,
    answer: "The sharp nail tore the three ribbons.",
    proof: [
      "“The three torn ones hung on the same nail.”",
      "“The nail has a sharp edge.”",
    ],
    clears: [
      "Pulling: “Nobody pulled on the ribbons.”",
      "The hook: “The other ribbons hung on a smooth hook.”",
    ],
    explain: "The tears are all in the same spot. Because the three torn ribbons hung on a nail with a sharp edge, the edge tore the cloth.",
  },
  {
    t: "The Case of the Shrinking Balloons",
    tag: "🎈 balloons",
    story: "The class blew up balloons on Friday. On Monday they were small and soft. None of them popped. No pins were in the room. Air leaks slowly out of a balloon. The knots are still tied tight. The balloons blown up Monday are still big. Three days passed over the weekend.",
    q: "Why did the balloons get small?",
    s: [
      { who: "💨 Air leaking out", why: "air leaks slowly out of a balloon" },
      { who: "📌 A pin", why: "no pins were in the room" },
      { who: "🪢 Loose knots", why: "the knots are still tied tight" },
    ],
    who: 0,
    answer: "Air leaked slowly out of the balloons.",
    proof: [
      "“Air leaks slowly out of a balloon.”",
      "“Three days passed over the weekend.”",
    ],
    clears: [
      "A pin: “No pins were in the room.”",
      "Loose knots: “The knots are still tied tight.”",
    ],
    explain: "The balloons blown up Monday are still big. Because air leaks slowly out of a balloon, three days made the Friday ones small.",
  },
];

gradeMysteries(2, CASES);
console.log(`grade 2: ${CASES.length} cases written`);
