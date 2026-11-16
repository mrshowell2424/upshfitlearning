/**
 * Grade 10 mysteries: thirty-six cases, one a week, on the same thirty-six
 * themes as every other grade. Week 9 is the pumpkin case in every room in
 * the building; only the reading level and the case itself change.
 *
 * Held to the band in scripts/reading-mystery-plan.json: 162-232 words, mean
 * sentence no longer than 19 words, four or five suspects, and at least
 * three proof quotes that are really in the story.
 *
 * The step up from grade 9 is what counts as enough. A grade 7 case rules
 * suspects out by timing. A grade 8 case turns on a record that does not
 * describe what it claims to. A grade 9 case asks what else would be true if
 * a suspect were the cause, and then looks.
 *
 * A grade 10 case puts three odd things on the table at once, and they look
 * unrelated. Every wrong suspect can account for one of them, usually the
 * loudest one. Only the culprit sits upstream of all three. The move is to
 * stop asking "could this have caused it" -- several could -- and start
 * asking "which one cause leaves nothing over."
 *
 * A chute flap that hangs open stops squeaking, lets rain onto the books and
 * keeps the carpet beneath it damp. Rain explains the books and nothing
 * else. Afternoon sun on a tank grows algae, warms the water and drives the
 * oxygen out of it, so the fish gasp at four o'clock. Overfeeding explains
 * the algae alone. That is the reasoning a diagnosis runs on, and a history
 * argument, and every experiment with more than one reading in it.
 *
 *   bun run scripts/mysteries/g10.src.mjs && bun run scripts/merge-mysteries.mjs
 *   bun run scripts/check-mysteries.mjs
 */
import { gradeMysteries } from "./build.mjs";

const CASES = [
  {
    t: "The Case of the Chute That Stopped Squeaking",
    tag: "📚 library",
    story:
      "Three odd things turned up in the library in the same week. Books returned through the outside drop chute arrive with curled, wavy pages. The carpet under the chute has a dark square the size of a doormat. And the brass chute flap, which squeaked for nine years, has gone completely silent. Rain blowing in through the chute would curl the pages, but rain cannot silence a flap. The wet bags readers carry in would mark the whole entrance, not one square under the chute. The reading room humidifier runs on the far side of the building behind two closed doors. A drinks spill soaks the carpet once and dries within a day, and this square has stayed dark since Monday. The flap's return spring snapped on Sunday night, and the flap now hangs open. A flap that rests open never swings, so it cannot squeak. An open chute lets night air and rain straight down onto the books below. It also lets that wet air settle on one square of carpet and keep it damp. The caretaker has not touched the carpet or the chute since the complaints began.",
    q: "What is behind all three problems?",
    s: [
      { who: "🚪 The snapped flap spring", why: "the flap's return spring snapped on Sunday night, and the flap now hangs open" },
      { who: "🌧️ Rain through the chute", why: "rain blowing in through the chute would curl the pages, but rain cannot silence a flap" },
      { who: "🎒 Wet bags", why: "the wet bags readers carry in would mark the whole entrance, not one square under the chute" },
      { who: "💨 The humidifier", why: "the reading room humidifier runs on the far side of the building behind two closed doors" },
      { who: "🥤 A drinks spill", why: "a drinks spill soaks the carpet once and dries within a day" },
    ],
    who: 0,
    answer: "A snapped spring has left the chute flap hanging open.",
    proof: [
      "“The flap's return spring snapped on Sunday night, and the flap now hangs open.”",
      "“A flap that rests open never swings, so it cannot squeak.”",
      "“An open chute lets night air and rain straight down onto the books below.”",
    ],
    clears: [
      "Rain: “rain cannot silence a flap.”",
      "Wet bags: “would mark the whole entrance, not one square under the chute.”",
      "The humidifier: “runs on the far side of the building behind two closed doors.”",
      "A spill: “soaks the carpet once and dries within a day, and this square has stayed dark since Monday.”",
    ],
    explain:
      "Rain can curl pages. A spill can darken carpet. Neither can quiet a hinge. Only one thing in the case sits upstream of all three: a flap stuck open stops swinging, lets the weather in, and holds damp air over the square beneath it. When a single cause accounts for three symptoms that look unrelated, that is the cause.",
  },
  {
    t: "The Case of the Ice Pack That Never Melted",
    tag: "🥪 lunchbox",
    story:
      "Dev's yogurt is warm by lunchtime every day this term. Two other things go with it, and nobody has put them together. His ice pack is still frozen rock hard at noon. The outside of his bag is cold to the touch when he lifts it off the rack. A freezer that failed overnight would send out a soft ice pack, and his comes out solid. Worn insulation would let the cold leak out, so the pack would be melting faster, not slower. The radiator by the bag rack would warm the bag from the outside, and the outside is the cold part. A pack too small for the box would still sweat and soften by noon. Since Dev got the new bag in September, he has clipped the ice pack into the outside mesh pocket. There is a zipped insulated wall between that pocket and the food. The pack has been chilling the outer shell and the air around it all morning. Nothing cold has been inside the box with the yogurt since term began. An ice pack with no warm food beside it has almost nothing to melt it.",
    q: "Why is the yogurt warm?",
    s: [
      { who: "🧊 The pack in the outside pocket", why: "he has clipped the ice pack into the outside mesh pocket, with an insulated wall between it and the food" },
      { who: "❄️ A failed freezer", why: "a freezer that failed overnight would send out a soft ice pack, and his comes out solid" },
      { who: "🧵 Worn insulation", why: "worn insulation would let the cold leak out, so the pack would be melting faster, not slower" },
      { who: "🔥 The radiator by the rack", why: "the radiator would warm the bag from the outside, and the outside is the cold part" },
      { who: "📏 A pack too small", why: "a pack too small for the box would still sweat and soften by noon" },
    ],
    who: 0,
    answer: "The ice pack is clipped outside the insulated wall, not inside with the food.",
    proof: [
      "“There is a zipped insulated wall between that pocket and the food.”",
      "“Nothing cold has been inside the box with the yogurt since term began.”",
      "“An ice pack with no warm food beside it has almost nothing to melt it.”",
    ],
    clears: [
      "A failed freezer: “a freezer that failed overnight would send out a soft ice pack, and his comes out solid.”",
      "Worn insulation: “the pack would be melting faster, not slower.”",
      "The radiator: “would warm the bag from the outside, and the outside is the cold part.”",
      "A small pack: “a pack too small for the box would still sweat and soften by noon.”",
    ],
    explain:
      "Warm yogurt alone has four plausible causes. Add the pack that will not melt and the shell that is cold, and only one survives. The cold is on the wrong side of the insulation, which is why the food never gets it and the pack never spends it. Three facts, one place they all come from.",
  },
  {
    t: "The Case of the Pencils That Snapped Every Time",
    tag: "✏️ pencil",
    story:
      "Lia cannot keep a point on a pencil for a single paragraph. Three facts sit beside the snapping, and each has been shrugged off on its own. The wooden barrels of her pencils have hairline splits running along the grain. A pencil from the same box, kept in Omar's tray, has written all week without breaking. Cheap pencils would fail for Omar too, and his came out of Lia's box. A blunt sharpener blade tears the wood at the tip and leaves the lead below it whole. Pressing too hard snaps a point at the paper, not three centimetres inside the wood. Lia carries her pencil case clipped to the outside of her rucksack, and it hits the stair rail every morning. A dropped case cracks the lead along its whole length inside the unbroken wood. It also splits the barrel along the grain, which is where wood gives way first. A lead cracked end to end has a break waiting wherever the sharpener happens to stop. Omar's pencil has never been in that case.",
    q: "Why do Lia's pencils break and Omar's does not?",
    s: [
      { who: "🎒 The case banging the stair rail", why: "she carries her pencil case clipped to the outside of her rucksack, and it hits the stair rail every morning" },
      { who: "💸 Cheap pencils", why: "cheap pencils would fail for Omar too, and his came out of Lia's box" },
      { who: "🔪 A blunt sharpener", why: "a blunt sharpener blade tears the wood at the tip and leaves the lead below it whole" },
      { who: "✊ Pressing too hard", why: "pressing too hard snaps a point at the paper, not three centimetres inside the wood" },
    ],
    who: 0,
    answer: "The pencil case is knocked against the stair rail every morning.",
    proof: [
      "“A dropped case cracks the lead along its whole length inside the unbroken wood.”",
      "“It also splits the barrel along the grain, which is where wood gives way first.”",
      "“A lead cracked end to end has a break waiting wherever the sharpener happens to stop.”",
    ],
    clears: [
      "Cheap pencils: “cheap pencils would fail for Omar too, and his came out of Lia's box.”",
      "The sharpener: “a blunt sharpener blade tears the wood at the tip and leaves the lead below it whole.”",
      "Pressing hard: “pressing too hard snaps a point at the paper, not three centimetres inside the wood.”",
    ],
    explain:
      "The snapping has three companions: split barrels, a twin pencil that works, and breaks deep inside the wood. A bad batch cannot explain Omar's. A bad blade cannot explain the splits. Only the daily knock reaches all of it, because it damages the lead and the wood at once, everywhere along their length.",
  },
  {
    t: "The Case of the Tuesday Apples",
    tag: "🍎 apple",
    story:
      "Apples from the Tuesday crate bruise within a day of reaching the classrooms. Two more things are true of that crate and of no other. Its cardboard base is damp enough to tear when lifted. And the fruit inside tastes mealy and dry even where it is not bruised. Rough handling bruises apples, but it does not make them mealy and it leaves the box dry. Old stock goes mealy, yet every crate on the delivery comes off the same pallet on the same morning. A roof leak would wet the crate below it as well, and the crate below is bone dry. The variety is identical in all five crates, and four of them are fine. The Tuesday crate is the one left on the loading dock overnight because the store room is locked on Mondays. Temperatures on the dock drop below freezing and climb again by morning. Freezing bursts the cells inside the fruit, which is what makes an apple both soft and mealy. Thawing releases that water, and the crate stands in it until the apples are handed out.",
    q: "What is wrong with the Tuesday crate?",
    s: [
      { who: "🧊 A night on the loading dock", why: "the Tuesday crate is left on the dock overnight, where temperatures drop below freezing and climb again by morning" },
      { who: "📦 Rough handling", why: "rough handling bruises apples, but it does not make them mealy and it leaves the box dry" },
      { who: "📅 Old stock", why: "every crate on the delivery comes off the same pallet on the same morning" },
      { who: "🏠 A roof leak", why: "a roof leak would wet the crate below it as well, and the crate below is bone dry" },
      { who: "🍏 The variety", why: "the variety is identical in all five crates, and four of them are fine" },
    ],
    who: 0,
    answer: "The crate freezes and thaws overnight on the loading dock.",
    proof: [
      "“Temperatures on the dock drop below freezing and climb again by morning.”",
      "“Freezing bursts the cells inside the fruit, which is what makes an apple both soft and mealy.”",
      "“Thawing releases that water, and the crate stands in it until the apples are handed out.”",
    ],
    clears: [
      "Handling: “it does not make them mealy and it leaves the box dry.”",
      "Old stock: “every crate on the delivery comes off the same pallet on the same morning.”",
      "A leak: “the crate below is bone dry.”",
      "The variety: “the variety is identical in all five crates, and four of them are fine.”",
    ],
    explain:
      "Bruised, mealy and damp look like three faults. Freezing and thawing is one event that produces all three, because burst cells go soft, taste dry, and let their water out. Every other suspect accounts for exactly one column of the table and leaves the other two unexplained.",
  },
  {
    t: "The Case of the Punctures on the Inside",
    tag: "🚲 bike",
    story:
      "Noor's back tyre goes soft every three or four days, and she has mended it six times. Two details have come up every time and nobody has used them. All six holes are on the inner face of the tube, the side against the wheel. And the cloth rim tape under the tube has slid about a centimetre off true. Thorns and glass pierce a tyre from the outside, and they leave a mark in the tread above the hole. The tread has no cuts anywhere on it. A leaking valve lets air out steadily but leaves no hole to patch, and she has patched six. A worn pump seal would fail to put air in, and the tyre is hard when she sets off. The rim tape exists to cover the spoke ends that poke through the rim bed. Where it has slipped, one spoke end stands proud of the rim with nothing over it. Every time the wheel turns, the tube presses against that end from the inside. That is the only thing touching the tube on the face where all six holes are.",
    q: "What keeps puncturing the tube?",
    s: [
      { who: "🔩 A spoke end through the slipped tape", why: "where the tape has slipped, one spoke end stands proud of the rim with nothing over it" },
      { who: "🌵 Thorns and glass", why: "thorns and glass pierce a tyre from the outside, and the tread has no cuts anywhere on it" },
      { who: "🎈 A leaking valve", why: "a leaking valve leaves no hole to patch, and she has patched six" },
      { who: "💨 A worn pump seal", why: "a worn pump seal would fail to put air in, and the tyre is hard when she sets off" },
    ],
    who: 0,
    answer: "A bare spoke end is pressing through where the rim tape slipped.",
    proof: [
      "“Where it has slipped, one spoke end stands proud of the rim with nothing over it.”",
      "“Every time the wheel turns, the tube presses against that end from the inside.”",
      "“That is the only thing touching the tube on the face where all six holes are.”",
    ],
    clears: [
      "Thorns: “the tread has no cuts anywhere on it.”",
      "The valve: “a leaking valve lets air out steadily but leaves no hole to patch, and she has patched six.”",
      "The pump: “the tyre is hard when she sets off.”",
    ],
    explain:
      "A slow puncture on its own has four ordinary causes. Add which face the holes are on and where the rim tape sits, and three of the four are gone. The holes are on the inside, so the thing making them is on the inside, and only one thing in the case is.",
  },
  {
    t: "The Case of the Four O'Clock Fish",
    tag: "🐠 fishtank",
    story:
      "Three complaints about the class tank have been written in the log, on different pages, by different people. The glass grows a green film within three days of being scraped clean. The fish crowd the surface and gulp every afternoon, though they swim low all morning. The thermometer reads nineteen degrees at nine o'clock and twenty-three at four. Overfeeding feeds algae, but it does not warm four degrees of water by teatime. A tired filter would let waste build up slowly and would not keep office hours. Too many fish would crowd the surface in the morning as well as the afternoon. The heater has been unplugged since October, and the plug sits on the shelf beside the tank. The tank was moved in September to the sill under the south window. From half past one the sun falls directly on that glass and stays there until the room is locked. Light is what algae grow on, and sunlight through glass is far stronger than the room lamps. Warm water also holds less dissolved oxygen than cold water does.",
    q: "What is behind all three log entries?",
    s: [
      { who: "☀️ The afternoon sun on the sill", why: "from half past one the sun falls directly on that glass and stays there until the room is locked" },
      { who: "🍤 Overfeeding", why: "overfeeding feeds algae, but it does not warm four degrees of water by teatime" },
      { who: "🧽 A tired filter", why: "a tired filter would let waste build up slowly and would not keep office hours" },
      { who: "🐟 Too many fish", why: "too many fish would crowd the surface in the morning as well as the afternoon" },
      { who: "🔌 The heater", why: "the heater has been unplugged since October, and the plug sits on the shelf beside the tank" },
    ],
    who: 0,
    answer: "Afternoon sun through the south window is heating and lighting the tank.",
    proof: [
      "“From half past one the sun falls directly on that glass and stays there until the room is locked.”",
      "“Light is what algae grow on, and sunlight through glass is far stronger than the room lamps.”",
      "“Warm water also holds less dissolved oxygen than cold water does.”",
    ],
    clears: [
      "Overfeeding: “it does not warm four degrees of water by teatime.”",
      "The filter: “a tired filter would let waste build up slowly and would not keep office hours.”",
      "Too many fish: “too many fish would crowd the surface in the morning as well as the afternoon.”",
      "The heater: “the heater has been unplugged since October, and the plug sits on the shelf beside the tank.”",
    ],
    explain:
      "Algae, gasping and a rising thermometer were logged as three problems. Sunlight is one cause with three outputs: it feeds the algae, it warms the water, and warm water carries less oxygen, so the fish come up for air exactly when the sun has been on the glass longest.",
  },
  {
    t: "The Case of the Rattle on Windy Days",
    tag: "🔊 noise",
    story:
      "Room 12 is unusable whenever the wind gets up, and the caretaker has had three separate reports. There is a hard rattle somewhere near the back wall. A draught crosses the floor strongly enough to lift loose paper off the bottom shelf. And a thin whistle comes and goes at the same times as the rattle. The radiator knocks when it heats, which is first thing on cold mornings, not whenever it is windy. The extractor fan runs on a timer at four o'clock and makes the same sound in still weather. A loose ceiling tile would rattle above head height, and the draught is along the floor. The top window at the back has a catch that no longer engages, which was logged in August and never fixed. An unlatched window is held shut only by its own weight and the frame. Wind pushes it open a few millimetres and lets it fall back, over and over. The gap it opens is narrow, and air forced through a narrow gap whistles. It is also the only opening in the room that the wind can work on.",
    q: "What is making all three noises and the draught?",
    s: [
      { who: "🪟 The window catch that will not engage", why: "the top window at the back has a catch that no longer engages, logged in August and never fixed" },
      { who: "🔥 The radiator", why: "the radiator knocks when it heats, which is first thing on cold mornings, not whenever it is windy" },
      { who: "🌀 The extractor fan", why: "the extractor fan runs on a timer at four o'clock and makes the same sound in still weather" },
      { who: "🧱 A loose ceiling tile", why: "a loose ceiling tile would rattle above head height, and the draught is along the floor" },
    ],
    who: 0,
    answer: "The back window is unlatched and the wind is working it.",
    proof: [
      "“Wind pushes it open a few millimetres and lets it fall back, over and over.”",
      "“The gap it opens is narrow, and air forced through a narrow gap whistles.”",
      "“It is also the only opening in the room that the wind can work on.”",
    ],
    clears: [
      "The radiator: “not whenever it is windy.”",
      "The fan: “makes the same sound in still weather.”",
      "The ceiling tile: “would rattle above head height, and the draught is along the floor.”",
    ],
    explain:
      "A rattle has several candidates. A rattle plus a floor-level draught plus a whistle, all arriving together with the wind, has one. The unlatched window bangs, lets cold air in and squeezes it through a slot, so three reports are three sides of a single fault.",
  },
  {
    t: "The Case of the Drain by the Gate",
    tag: "🍂 leaves",
    story:
      "The drain by the gate floods after every shower, and two other things near it have been reported separately. The path beside the drain is black and slippery for about two metres. And the gutter above that stretch drips steadily even when it has not rained for three days. Blocked drains flood, but a blockage underground does not make a gutter drip in dry weather. Fallen leaves on the path get slippery, yet the caretaker swept and cleared that path on Monday and the slime was back by Wednesday. A cracked downpipe would run down the wall and stain it, and the wall is clean and dry. The gate itself has been replaced this term and sits clear of the drain cover. The gutter above the gate has filled with leaves until it holds water like a trough. Standing water finds the joints and drips for days after the rain stops. When the trough overflows it pours down the same two metres of path, keeping it wet and feeding the slime. The overflow also carries leaf litter straight into the drain below.",
    q: "What is causing the flooding, the slime and the dripping?",
    s: [
      { who: "🏚️ The gutter packed with leaves", why: "the gutter above the gate has filled with leaves until it holds water like a trough" },
      { who: "🕳️ A blockage underground", why: "a blockage underground does not make a gutter drip in dry weather" },
      { who: "🍁 Leaves on the path", why: "the caretaker swept and cleared that path on Monday and the slime was back by Wednesday" },
      { who: "🧱 A cracked downpipe", why: "a cracked downpipe would run down the wall and stain it, and the wall is clean and dry" },
      { who: "🚪 The new gate", why: "the gate itself has been replaced this term and sits clear of the drain cover" },
    ],
    who: 0,
    answer: "The gutter above the gate is packed with leaves and overflowing.",
    proof: [
      "“The gutter above the gate has filled with leaves until it holds water like a trough.”",
      "“Standing water finds the joints and drips for days after the rain stops.”",
      "“The overflow also carries leaf litter straight into the drain below.”",
    ],
    clears: [
      "A blockage: “a blockage underground does not make a gutter drip in dry weather.”",
      "Leaves on the path: “the caretaker swept and cleared that path on Monday and the slime was back by Wednesday.”",
      "The downpipe: “the wall is clean and dry.”",
      "The gate: “sits clear of the drain cover.”",
    ],
    explain:
      "Three jobs were raised: a drain, a path and a gutter. They are one job. A gutter full of leaves holds water, so it drips in dry weather, overflows onto the path, and washes the leaves it is full of into the drain. Clear the gutter and all three reports close.",
  },
  {
    t: "The Case of the Pumpkin That Lasted Two Weeks",
    tag: "🎃 pumpkin",
    story:
      "Three pumpkins were carved on the same morning from the same box. The one on the office desk collapsed in two days. The porch pumpkin is still standing after a fortnight. A third, also on the office desk, is firm on day ten. Two more things are true only of the collapsed one. Its cut edges carry a fuzzy white bloom, and the inside of its lid has a scorched black ring. A warm room would have taken the third pumpkin too, and the third shares the desk. A bad pumpkin from the box would not produce a scorched ring, which is heat from inside. Thin walls would let it dry out and shrink, and this one went soft and wet instead. The collapsed pumpkin is the only one lit with a real candle. The other two were given battery lights on the same morning. A flame inside a lidded pumpkin scorches the lid directly above it. It also cooks the flesh and drives moisture out of it, and the lid traps that moisture inside. Warm wet flesh in a closed space grows mould within a day.",
    q: "Why did only one pumpkin collapse?",
    s: [
      { who: "🕯️ The real candle inside it", why: "the collapsed pumpkin is the only one lit with a real candle, and the other two were given battery lights" },
      { who: "🏢 The warm office", why: "a warm room would have taken the third pumpkin too, and the third shares the desk" },
      { who: "🧺 A bad pumpkin from the box", why: "a bad pumpkin would not produce a scorched ring, which is heat from inside" },
      { who: "📏 Thin walls", why: "thin walls would let it dry out and shrink, and this one went soft and wet instead" },
    ],
    who: 0,
    answer: "A burning candle cooked the pumpkin from the inside.",
    proof: [
      "“A flame inside a lidded pumpkin scorches the lid directly above it.”",
      "“It also cooks the flesh and drives moisture out of it, and the lid traps that moisture inside.”",
      "“Warm wet flesh in a closed space grows mould within a day.”",
    ],
    clears: [
      "The warm office: “the third shares the desk.”",
      "A bad pumpkin: “a bad pumpkin from the box would not produce a scorched ring, which is heat from inside.”",
      "Thin walls: “this one went soft and wet instead.”",
    ],
    explain:
      "The warm office and the real candle arrived together, so either could be blamed for the collapse. The third pumpkin separates them: same desk, same warmth, no flame, still firm. And only the flame explains the scorched lid and the mould as well, because it supplies both the heat and the trapped steam.",
  },
  {
    t: "The Case of the Chalky Footprints",
    tag: "👣 footprints",
    story:
      "Grey footprints appear inside the school every morning, and three things about them have been noted and never joined up. They turn up at the east doors and at no door on the west side. They are chalky and pale rather than brown, and they appear on dry days as readily as wet ones. And the dark doormats at the east doors have gone pale across their whole surface. Mud would print brown, and it would need rain, and there has been none since Sunday. The cleaners' new floor product is used on every corridor in the building, including the west side, which is clean. The builders working on the roof come in through the west door and sign in at the west desk. The sandpit sand is yellow, and it is the far side of the field from both doors. A limestone path was laid along the east side at half term. Crushed limestone is white, it powders underfoot, and it does not need to be wet to travel. Shoes carry the dust in, the mats take the first of it, and the floor takes the rest.",
    q: "Where is the grey dust coming from?",
    s: [
      { who: "🪨 The new limestone path", why: "a limestone path was laid along the east side at half term, and crushed limestone is white and powders underfoot" },
      { who: "🟫 Mud", why: "mud would print brown, and it would need rain, and there has been none since Sunday" },
      { who: "🧴 The cleaners' new product", why: "the cleaners' new floor product is used on every corridor in the building, including the west side, which is clean" },
      { who: "👷 The builders", why: "the builders working on the roof come in through the west door and sign in at the west desk" },
      { who: "🏖️ The sandpit", why: "the sandpit sand is yellow, and it is the far side of the field from both doors" },
    ],
    who: 0,
    answer: "Dust from the new limestone path is walking in on shoes.",
    proof: [
      "“A limestone path was laid along the east side at half term.”",
      "“Crushed limestone is white, it powders underfoot, and it does not need to be wet to travel.”",
      "“Shoes carry the dust in, the mats take the first of it, and the floor takes the rest.”",
    ],
    clears: [
      "Mud: “mud would print brown, and it would need rain, and there has been none since Sunday.”",
      "The floor product: “used on every corridor in the building, including the west side, which is clean.”",
      "The builders: “come in through the west door and sign in at the west desk.”",
      "The sandpit: “the sandpit sand is yellow, and it is the far side of the field from both doors.”",
    ],
    explain:
      "One door, one colour, one set of ruined mats. Mud explains none of the three, because it is the wrong colour and needs rain. The path explains all three at once: it is on the east side only, it is white, and it gives up powder in dry weather, which is exactly what a pale mat is full of.",
  },
  {
    t: "The Case of the Bus That Ran Late Three Days a Week",
    tag: "🚌 bus",
    story:
      "The 8:05 bus reaches school about seven minutes late, but only on Tuesdays, Thursdays and Fridays. Two further facts sit in the driver's log and have never been read beside the first. On those days the bus is already standing room only by stop four. And the whole of the lost time builds up between stop four and stop eight, never before stop four. Roadworks on the main road would slow the bus on all five mornings and on the stretch where they are. The same driver works all five mornings and drives the same route in the same order. The traffic lights at the bridge run on a fixed cycle that does not know what day it is. Wet weather has coincided with Mondays twice this month, and Monday has never been late. The 41 service does not run on Tuesdays, Thursdays or Fridays. Its riders join the 8:05 instead, which is why it fills early on those days. Every passenger on a full bus takes longer to board, and the busy stops are four through eight.",
    q: "Why is the bus late on only three days?",
    s: [
      { who: "🚫 The 41 not running", why: "the 41 service does not run on Tuesdays, Thursdays or Fridays, and its riders join the 8:05 instead" },
      { who: "🚧 Roadworks", why: "roadworks on the main road would slow the bus on all five mornings and on the stretch where they are" },
      { who: "👨‍✈️ The driver", why: "the same driver works all five mornings and drives the same route in the same order" },
      { who: "🚦 The bridge lights", why: "the traffic lights at the bridge run on a fixed cycle that does not know what day it is" },
      { who: "🌧️ The weather", why: "wet weather has coincided with Mondays twice this month, and Monday has never been late" },
    ],
    who: 0,
    answer: "The 41 is cancelled on those days and its riders fill the 8:05.",
    proof: [
      "“The 41 service does not run on Tuesdays, Thursdays or Fridays.”",
      "“Its riders join the 8:05 instead, which is why it fills early on those days.”",
      "“Every passenger on a full bus takes longer to board, and the busy stops are four through eight.”",
    ],
    clears: [
      "Roadworks: “would slow the bus on all five mornings and on the stretch where they are.”",
      "The driver: “the same driver works all five mornings and drives the same route in the same order.”",
      "The lights: “run on a fixed cycle that does not know what day it is.”",
      "The weather: “Monday has never been late.”",
    ],
    explain:
      "Lateness on its own points at traffic. Lateness on three named days, a bus already full at stop four, and every lost minute spent in the second half of the route point somewhere else. Only the missing 41 explains the pattern of days and the crowding and the place where the time goes, because the crowding is what spends it.",
  },
  {
    t: "The Case of the Trophy That Blackened on One Side",
    tag: "🏆 trophy",
    story:
      "The county cup in the cabinet has gone almost black, and two other details have been noticed without being connected. Only the side facing the back of the cabinet is black, and the front is still bright. And the engraved brass plate screwed to the backing board behind it has dulled to brown over the same weeks. Handling marks silver where fingers grip it, which is the handles and the front, and those are clean. Polish left on the surface would dull it evenly all the way round. Damp in the cabinet would tarnish the two other cups on the glass shelf, and both are bright. The cabinet was refitted in September with a new backing board of untreated oak. Fresh oak gives off faint acidic and sulphurous vapours for months as it seasons. Silver and brass both blacken when sulphur reaches them, and neither needs to be touched. Whatever faces that board gets the vapour first and strongest. The two bright cups stand on the glass shelf a metre away from it.",
    q: "What is blackening the cup?",
    s: [
      { who: "🪵 The new oak backing board", why: "the cabinet was refitted in September with a new backing board of untreated oak" },
      { who: "🖐️ Handling", why: "handling marks silver where fingers grip it, which is the handles and the front, and those are clean" },
      { who: "🧴 Polish residue", why: "polish left on the surface would dull it evenly all the way round" },
      { who: "💧 Damp in the cabinet", why: "damp would tarnish the two other cups on the glass shelf, and both are bright" },
    ],
    who: 0,
    answer: "Vapour from the untreated oak board is tarnishing the silver.",
    proof: [
      "“Fresh oak gives off faint acidic and sulphurous vapours for months as it seasons.”",
      "“Silver and brass both blacken when sulphur reaches them, and neither needs to be touched.”",
      "“Whatever faces that board gets the vapour first and strongest.”",
    ],
    clears: [
      "Handling: “which is the handles and the front, and those are clean.”",
      "Polish: “polish left on the surface would dull it evenly all the way round.”",
      "Damp: “damp in the cabinet would tarnish the two other cups on the glass shelf, and both are bright.”",
    ],
    explain:
      "One blackened face, one dulled brass plate and two bright cups a metre away. Hands and polish and damp each account for tarnish, but none of them account for a direction. The board does. It is new, it is behind the black side, and the only other dull object in the cabinet is the one screwed to it.",
  },
  {
    t: "The Case of the Turkey That Would Not Brown",
    tag: "🦃 turkey",
    story:
      "The turkey came out of the oven wrong in three ways at once. The breast was dry and stringy. The thigh, cut to the bone, was still pink and cool. And the skin was pale and slack after four hours, with no browning anywhere. It also took ninety minutes longer than the recipe allowed. An oven running cold would have left the potatoes on the shelf below underdone, and they came out on time and crisp. A bird too large for the recipe is covered by the recipe, which gives minutes per kilogram. Opening the door often drops the heat briefly, and the door was opened twice. Too much basting liquid would pool in the tin, and the tin was almost dry at the end. The turkey was moved from the freezer to the fridge on the morning of the day before. A bird that size needs three days in a fridge to thaw to the bone. Ice at the centre holds the thigh near zero while the outside cooks and dries. It also melts slowly into steam all through roasting, and a steamy oven cannot brown anything.",
    q: "What went wrong with the turkey?",
    s: [
      { who: "❄️ A part-frozen centre", why: "the turkey was moved from the freezer to the fridge on the morning of the day before, and a bird that size needs three days" },
      { who: "🌡️ An oven running cold", why: "an oven running cold would have left the potatoes on the shelf below underdone, and they came out on time and crisp" },
      { who: "⚖️ A bird too large", why: "a bird too large for the recipe is covered by the recipe, which gives minutes per kilogram" },
      { who: "🚪 The oven door", why: "opening the door often drops the heat briefly, and the door was opened twice" },
      { who: "🥄 Too much basting", why: "too much basting liquid would pool in the tin, and the tin was almost dry at the end" },
    ],
    who: 0,
    answer: "The turkey went into the oven still frozen at the centre.",
    proof: [
      "“A bird that size needs three days in a fridge to thaw to the bone.”",
      "“Ice at the centre holds the thigh near zero while the outside cooks and dries.”",
      "“It also melts slowly into steam all through roasting, and a steamy oven cannot brown anything.”",
    ],
    clears: [
      "A cold oven: “the potatoes on the shelf below” “came out on time and crisp.”",
      "A large bird: “is covered by the recipe, which gives minutes per kilogram.”",
      "The door: “the door was opened twice.”",
      "Basting: “the tin was almost dry at the end.”",
    ],
    explain:
      "Dry breast, raw thigh and pale skin look like three separate failures of cooking. Ice at the centre produces all three. It holds the deep meat cold, it makes the outside wait and overcook, and the water it gives up fills the oven with steam, which is the one thing that stops a skin browning.",
  },
  {
    t: "The Case of the Cupcakes That Rose Too Far",
    tag: "🧁 cupcake",
    story:
      "Every cupcake in the batch of twenty-four failed, and the failure had three parts. They climbed over the rims of their cases in the first ten minutes. They then sank into craters before the timer went. And they carry a bitter, soapy aftertaste that nobody can place. Opening the oven early makes a cake sink, but it cannot make one rise too high first, and the door stayed shut. Old eggs give a flat, heavy cake that never rises at all. The wrong flour changes the crumb and the colour, and the crumb and colour here are normal. A cold oven would slow everything down, and these were over the rims within ten minutes. The baker doubled the recipe and measured the raising agent with a tablespoon instead of a teaspoon. That is three times the baking powder the doubled recipe asks for. Too much raising agent makes gas faster than the batter can set around it. The structure stretches, runs out of strength and falls, which is what a crater is. Baking powder left over after the rise tastes bitter and faintly of soap.",
    q: "What ruined the cupcakes?",
    s: [
      { who: "🥄 Three times the baking powder", why: "the baker measured the raising agent with a tablespoon instead of a teaspoon, which is three times what the recipe asks" },
      { who: "🚪 Opening the oven early", why: "opening the oven early cannot make a cake rise too high first, and the door stayed shut" },
      { who: "🥚 Old eggs", why: "old eggs give a flat, heavy cake that never rises at all" },
      { who: "🌾 The wrong flour", why: "the wrong flour changes the crumb and the colour, and the crumb and colour here are normal" },
      { who: "🌡️ A cold oven", why: "a cold oven would slow everything down, and these were over the rims within ten minutes" },
    ],
    who: 0,
    answer: "The batch had three times the baking powder it needed.",
    proof: [
      "“Too much raising agent makes gas faster than the batter can set around it.”",
      "“The structure stretches, runs out of strength and falls, which is what a crater is.”",
      "“Baking powder left over after the rise tastes bitter and faintly of soap.”",
    ],
    clears: [
      "The oven door: “the door stayed shut.”",
      "Old eggs: “old eggs give a flat, heavy cake that never rises at all.”",
      "The flour: “the crumb and colour here are normal.”",
      "A cold oven: “these were over the rims within ten minutes.”",
    ],
    explain:
      "A sunken cake has many causes. A cake that first rises too fast, then sinks, and then tastes of soap has one. All three are the same excess seen at three moments: gas arriving too quickly, a structure that cannot hold it, and the unreacted powder left behind on the tongue.",
  },
  {
    t: "The Case of the Mittens That Came Back Small",
    tag: "🧤 mitten",
    story:
      "Six pairs of mittens came out of the lost property wash stiff, thick and two sizes smaller. Two other facts about that load have been mentioned and set aside. Only the wool pairs shrank, and the four acrylic pairs went through the same machine unharmed. And the eleven wool pairs that were hung on the drying rack instead are the size they always were. A hot wash alone would have taken the acrylic pairs too, since acrylic distorts in heat. The detergent was the same tub used on every load this term without complaint. The radiator in the laundry room has been off since the boiler fault in October. Rough handling in a lost property box crushes mittens, and crushing does not thicken wool. The shrunken six went into the tumble dryer on the hot cycle. Wool fibres are covered in tiny scales that hook together when heat and tumbling act at once. Once they hook, they do not let go, and the fabric becomes dense and short. Acrylic has no scales, and wool left to dry still has nothing tumbling it.",
    q: "What shrank the mittens?",
    s: [
      { who: "🌀 The tumble dryer", why: "the shrunken six went into the tumble dryer on the hot cycle, and wool fibres hook together when heat and tumbling act at once" },
      { who: "🌡️ A hot wash", why: "a hot wash alone would have taken the acrylic pairs too, since acrylic distorts in heat" },
      { who: "🧴 The detergent", why: "the detergent was the same tub used on every load this term without complaint" },
      { who: "🔥 The radiator", why: "the radiator in the laundry room has been off since the boiler fault in October" },
      { who: "📦 Rough handling", why: "rough handling in a lost property box crushes mittens, and crushing does not thicken wool" },
    ],
    who: 0,
    answer: "The wool mittens were tumble dried on the hot cycle.",
    proof: [
      "“The shrunken six went into the tumble dryer on the hot cycle.”",
      "“Wool fibres are covered in tiny scales that hook together when heat and tumbling act at once.”",
      "“Acrylic has no scales, and wool left to dry still has nothing tumbling it.”",
    ],
    clears: [
      "A hot wash: “would have taken the acrylic pairs too, since acrylic distorts in heat.”",
      "The detergent: “the same tub used on every load this term without complaint.”",
      "The radiator: “has been off since the boiler fault in October.”",
      "Handling: “crushing does not thicken wool.”",
    ],
    explain:
      "The case hands you two controls without calling them controls. Acrylic through the same machine is fine, and wool that skipped the machine is fine. Only one suspect needs both the wool and the tumbling to do its work, and only it explains why the fabric got thicker rather than merely smaller.",
  },
  {
    t: "The Case of the Gingerbread With No Arms",
    tag: "🎄 ginger",
    story:
      "The first tray of gingerbread men came out as nine joined blobs with no arms. Two other things about that tray have been reported as separate complaints. The tray came out slick with butter that had run out of the dough. And the second tray, cut from the very same bowl an hour later, held its shape perfectly. Too much butter in the recipe would have ruined the second tray as well, and the bowl was never added to. Tired baking soda makes a flat, dense biscuit, and these spread outward rather than failing to rise. An unlined tray makes biscuits stick, and these lifted off cleanly once cool. An oven set too hot browns the edges hard, and these came out pale. The oven had been on for an hour and the kitchen stood at twenty-six degrees. The first tray was cut and baked straight away from dough that had gone soft and greasy. The second sat in the fridge for forty minutes before it was rolled. Butter that is already half melted cannot hold a shape while the oven melts the rest.",
    q: "Why did only the first tray spread?",
    s: [
      { who: "🌡️ Warm dough in a hot kitchen", why: "the oven had been on for an hour and the kitchen stood at twenty-six degrees, and the first tray was baked straight away" },
      { who: "🧈 Too much butter", why: "too much butter in the recipe would have ruined the second tray as well, and the bowl was never added to" },
      { who: "🫖 Tired baking soda", why: "tired baking soda makes a flat, dense biscuit, and these spread outward rather than failing to rise" },
      { who: "🍳 An unlined tray", why: "an unlined tray makes biscuits stick, and these lifted off cleanly once cool" },
      { who: "🔥 An oven set too hot", why: "an oven set too hot browns the edges hard, and these came out pale" },
    ],
    who: 0,
    answer: "The first tray was baked from dough already warm and soft.",
    proof: [
      "“The oven had been on for an hour and the kitchen stood at twenty-six degrees.”",
      "“The second sat in the fridge for forty minutes before it was rolled.”",
      "“Butter that is already half melted cannot hold a shape while the oven melts the rest.”",
    ],
    clears: [
      "Too much butter: “the bowl was never added to.”",
      "Baking soda: “these spread outward rather than failing to rise.”",
      "The tray: “these lifted off cleanly once cool.”",
      "A hot oven: “these came out pale.”",
    ],
    explain:
      "Same bowl, same oven, same baker, two different results. That rules out everything in the recipe at a stroke, because a recipe fault would have to show in both trays. What differs is forty minutes in the fridge, and warm butter explains the spreading, the greasy tray and the arms that vanished.",
  },
  {
    t: "The Case of the Lights That Failed in the Rain",
    tag: "💡 lights",
    story:
      "The display lights in the front window go dead whenever it rains and work again once the weather clears. Two more facts have been reported by different people on different days. The whole circuit trips at the fuse box at the same moment the lights go out. And the brass holder of the bulb closest to the window frame is crusted green. A blown bulb takes out its own lamp and sometimes the string, but it does not trip a circuit. A loose plug at the socket would cut the lights in dry weather as often as wet. The timer switch has been replaced twice and the fault followed the lights, not the timer. A shortage of power in the building would darken the corridor lights as well, and they stay on. The window frame above that holder has a crack in its seal that lets rain run inside. Water bridging the two contacts in a holder carries current where it should not go. That is a fault to earth, which is the one thing that makes a modern fuse box trip. Standing water on brass also corrodes it green, slowly and only where the water sits.",
    q: "Why do the lights die in the rain?",
    s: [
      { who: "💧 Rain reaching the bulb holder", why: "the window frame above that holder has a crack in its seal that lets rain run inside" },
      { who: "💡 A blown bulb", why: "a blown bulb takes out its own lamp and sometimes the string, but it does not trip a circuit" },
      { who: "🔌 A loose plug", why: "a loose plug at the socket would cut the lights in dry weather as often as wet" },
      { who: "⏲️ The timer switch", why: "the timer switch has been replaced twice and the fault followed the lights, not the timer" },
      { who: "⚡ A shortage of power", why: "a shortage of power in the building would darken the corridor lights as well, and they stay on" },
    ],
    who: 0,
    answer: "Rain through a cracked seal is reaching one bulb holder.",
    proof: [
      "“Water bridging the two contacts in a holder carries current where it should not go.”",
      "“That is a fault to earth, which is the one thing that makes a modern fuse box trip.”",
      "“Standing water on brass also corrodes it green, slowly and only where the water sits.”",
    ],
    clears: [
      "A blown bulb: “it does not trip a circuit.”",
      "A loose plug: “would cut the lights in dry weather as often as wet.”",
      "The timer: “the fault followed the lights, not the timer.”",
      "A power shortage: “they stay on.”",
    ],
    explain:
      "Three facts, each dismissed alone: dead in the rain, a tripping fuse box, a green holder. Water in one holder is the single cause that produces all three, and the green crust is the record of where it has been sitting every wet week since the seal cracked.",
  },
  {
    t: "The Case of the Clock That Lost Time When It Was Warm",
    tag: "⏰ clock",
    story:
      "The pendulum clock in the entrance hall loses about four minutes a day, and the loss is not steady. Two other observations sit in the caretaker's book without comment. The clock keeps near perfect time through the cold months and slips badly in warm weather. And the left side of its wooden case, the side nearest the wall, is noticeably warm by the afternoon. A worn mainspring weakens as it unwinds, which would lose time late in the day every day of the year. Dust in the gears adds friction that does not care what month it is. A clock hanging off level stops or runs wild, and this one has run steadily for thirty years. A weak chime spring affects the striking, not the going train. The old radiator in the hall was replaced in April with a much larger one. The new radiator stands directly against the wall behind the clock. A pendulum's swing is timed by its length, and a longer pendulum swings more slowly. Brass expands when it is heated, so a warm brass rod hangs its weight lower than a cold one.",
    q: "Why does the clock lose time?",
    s: [
      { who: "🔥 Heat from the new radiator", why: "the new radiator stands directly against the wall behind the clock, and brass expands when it is heated" },
      { who: "🌀 A worn mainspring", why: "a worn mainspring would lose time late in the day every day of the year" },
      { who: "🪶 Dust in the gears", why: "dust in the gears adds friction that does not care what month it is" },
      { who: "📐 Hanging off level", why: "a clock hanging off level stops or runs wild, and this one has run steadily for thirty years" },
      { who: "🔔 A weak chime spring", why: "a weak chime spring affects the striking, not the going train" },
    ],
    who: 0,
    answer: "Heat from the new radiator is lengthening the brass pendulum.",
    proof: [
      "“A pendulum's swing is timed by its length, and a longer pendulum swings more slowly.”",
      "“Brass expands when it is heated, so a warm brass rod hangs its weight lower than a cold one.”",
      "“The new radiator stands directly against the wall behind the clock.”",
    ],
    clears: [
      "The mainspring: “would lose time late in the day every day of the year.”",
      "Dust: “adds friction that does not care what month it is.”",
      "Off level: “this one has run steadily for thirty years.”",
      "The chime spring: “affects the striking, not the going train.”",
    ],
    explain:
      "Losing time has four mechanical explanations and all of them are year round. The clock only loses in warm weather, its case is warm on one side, and a bigger radiator went in behind it in April. Heat is upstream of all three, and the physics is ordinary: warm brass is longer, a longer pendulum is slower.",
  },
  {
    t: "The Case of the Stripes in the Roof Snow",
    tag: "⛄ snow",
    story:
      "Two bare stripes have melted through the snow on the school roof while the rest of it lies thick. Two other facts belong with them and have been treated as separate problems. Long icicles hang from the gutter directly below those two stripes and nowhere else. And rooms fourteen and fifteen, which sit under them, are the two coldest rooms in the building. Sun would clear the whole south slope rather than two stripes a metre wide. The boiler flue comes out through the far end of the roof, thirty metres from either stripe. A hot water pipe in the roof space would run the length of the building and melt a line along it. The snow fell evenly and settled to the same depth everywhere on the first night. The loft insulation was lifted between two pairs of rafters in October and never put back. Warm room air now reaches the roof slates directly in those two gaps. Heat that escapes through a roof melts the snow sitting on it and leaves the rest alone. The water runs down to the cold gutter beyond the warm patch and freezes there.",
    q: "What made the two stripes?",
    s: [
      { who: "🧱 The gaps in the loft insulation", why: "the loft insulation was lifted between two pairs of rafters in October and never put back" },
      { who: "☀️ The sun", why: "sun would clear the whole south slope rather than two stripes a metre wide" },
      { who: "🌬️ The boiler flue", why: "the boiler flue comes out through the far end of the roof, thirty metres from either stripe" },
      { who: "🚰 A hot water pipe", why: "a hot water pipe in the roof space would run the length of the building and melt a line along it" },
      { who: "❄️ Uneven snowfall", why: "the snow fell evenly and settled to the same depth everywhere on the first night" },
    ],
    who: 0,
    answer: "Heat is escaping through two gaps in the loft insulation.",
    proof: [
      "“Warm room air now reaches the roof slates directly in those two gaps.”",
      "“Heat that escapes through a roof melts the snow sitting on it and leaves the rest alone.”",
      "“The water runs down to the cold gutter beyond the warm patch and freezes there.”",
    ],
    clears: [
      "The sun: “would clear the whole south slope rather than two stripes a metre wide.”",
      "The flue: “comes out through the far end of the roof, thirty metres from either stripe.”",
      "A hot pipe: “would run the length of the building and melt a line along it.”",
      "Uneven snowfall: “the snow fell evenly and settled to the same depth everywhere on the first night.”",
    ],
    explain:
      "Melted stripes, icicles underneath them, and two freezing classrooms are the same heat counted three times. It leaves the rooms, which is why they are cold. It melts the snow above, which is why the stripes are bare. It refreezes at the gutter, which is why the icicles hang exactly there.",
  },
  {
    t: "The Case of the Feeder With No Husks",
    tag: "🐦 feeder",
    story:
      "The bird feeder by the field empties every night, and two further details have been noticed without being joined. There are no sunflower husks on the ground beneath it, though the grass below the old feeder was always carpeted with them. And the greased pole has four sets of long scratch lines running up it. Birds crack a seed, swallow the kernel and drop the husk, so a busy feeder always litters. A spill would scatter whole seed on the grass, and the grass underneath is bare. The caretaker fills the feeder on Monday mornings only and has not changed that. Wind strong enough to empty a feeder would also take the light plastic lid, which is still in place, though it has been turned a quarter round. An animal that eats seed whole leaves no husks anywhere. The grease on the pole was put there in November and has been scratched through since. Something with claws has been climbing a pole it was meant to slide down. Something with paws has been lifting a lid that birds cannot work.",
    q: "What is emptying the feeder?",
    s: [
      { who: "🐿️ A climbing animal", why: "something with claws has been climbing a pole it was meant to slide down, and lifting a lid that birds cannot work" },
      { who: "🐤 Birds", why: "birds crack a seed, swallow the kernel and drop the husk, so a busy feeder always litters" },
      { who: "🪣 A spill", why: "a spill would scatter whole seed on the grass, and the grass underneath is bare" },
      { who: "👨‍🌾 The caretaker", why: "the caretaker fills the feeder on Monday mornings only and has not changed that" },
      { who: "🌬️ The wind", why: "wind strong enough to empty a feeder would also take the light plastic lid, which is still in place" },
    ],
    who: 0,
    answer: "An animal with claws is climbing the pole and opening the lid.",
    proof: [
      "“An animal that eats seed whole leaves no husks anywhere.”",
      "“The grease on the pole was put there in November and has been scratched through since.”",
      "“Something with paws has been lifting a lid that birds cannot work.”",
    ],
    clears: [
      "Birds: “so a busy feeder always litters.”",
      "A spill: “the grass underneath is bare.”",
      "The caretaker: “fills the feeder on Monday mornings only and has not changed that.”",
      "The wind: “which is still in place, though it has been turned a quarter round.”",
    ],
    explain:
      "An empty feeder on its own says nothing. An empty feeder with no husks says the eater swallows the shell. Scratches through fresh grease say it climbs, and a lid turned a quarter round says it has paws. Three details, and only one kind of visitor fits all of them.",
  },
  {
    t: "The Case of the Watery Cocoa",
    tag: "☕ cocoa",
    story:
      "The cocoa from the machine in the staff room is barely warm, and two other complaints have been pinned to the wall beside it. It tastes thin and pale, as if it had been made with half the powder. And the drip tray underneath, which used to be emptied on Fridays, now fills by Wednesday. Old powder tastes flat but it does not make a drink cooler. A failing heater would give a cold drink at full strength, not a weak one. Dirty cups would change nothing about the volume that comes out. A blocked powder chute would thicken what remains in the cup, not thin it. The water valve was replaced in January with one from a different model. It passes almost twice the water per cup that the old one did. The same scoop of powder now has to colour and flavour twice as much liquid. The heater warms what passes through it at a fixed rate, so twice the water comes out cooler. And a cup sized for the old dose overflows into the tray every time.",
    q: "What is wrong with the machine?",
    s: [
      { who: "🚰 The replacement water valve", why: "the water valve was replaced in January with one that passes almost twice the water per cup" },
      { who: "🍫 Old powder", why: "old powder tastes flat but it does not make a drink cooler" },
      { who: "🌡️ A failing heater", why: "a failing heater would give a cold drink at full strength, not a weak one" },
      { who: "☕ Dirty cups", why: "dirty cups would change nothing about the volume that comes out" },
      { who: "🕳️ A blocked powder chute", why: "a blocked powder chute would thicken what remains in the cup, not thin it" },
    ],
    who: 0,
    answer: "The new valve is sending almost twice the water into every cup.",
    proof: [
      "“The same scoop of powder now has to colour and flavour twice as much liquid.”",
      "“The heater warms what passes through it at a fixed rate, so twice the water comes out cooler.”",
      "“And a cup sized for the old dose overflows into the tray every time.”",
    ],
    clears: [
      "Old powder: “it does not make a drink cooler.”",
      "The heater: “would give a cold drink at full strength, not a weak one.”",
      "Dirty cups: “would change nothing about the volume that comes out.”",
      "The chute: “would thicken what remains in the cup, not thin it.”",
    ],
    explain:
      "Weak, cool and overflowing were posted as three complaints by three people. They are one number changed. Doubling the water dilutes the powder, outruns the heater and fills a cup that was never sized for it, so the tray fills two days early as well.",
  },
  {
    t: "The Case of the Cards in the Postbox",
    tag: "💌 valentine",
    story:
      "Every card that spent a night in the class postbox came out marked, and three things were wrong with them at once. The ink had feathered and smudged on the envelopes. The envelopes themselves had gone wavy along the bottom edge. And the inside of the box's metal base is freckled with new rust. Cards handed over by hand on the same morning, written with the same pens, are crisp and clean. Cheap glue on a flap softens at the seal, and these flaps are firm and the marks are everywhere. A spilled drink would soak some cards and miss others, and all nineteen are marked alike. Handling smudges wet ink in streaks, and this ink has spread in soft haloes. The box stands on the cold windowsill with the window left on its latch all night. Warm room air meeting cold metal leaves water on every inside surface it touches. Damp paper swells where it takes up water, which is why an edge goes wavy. Ink spreads into damp fibre on its own, with nothing rubbing it, and bare steel rusts the same night.",
    q: "What spoiled the cards?",
    s: [
      { who: "🌫️ Condensation inside the box", why: "warm room air meeting cold metal leaves water on every inside surface it touches" },
      { who: "✏️ The pens", why: "cards handed over by hand on the same morning, written with the same pens, are crisp and clean" },
      { who: "🧴 Cheap glue", why: "cheap glue on a flap softens at the seal, and these flaps are firm and the marks are everywhere" },
      { who: "🥤 A spilled drink", why: "a spilled drink would soak some cards and miss others, and all nineteen are marked alike" },
      { who: "🖐️ Handling", why: "handling smudges wet ink in streaks, and this ink has spread in soft haloes" },
    ],
    who: 0,
    answer: "Condensation formed inside the cold metal box overnight.",
    proof: [
      "“The box stands on the cold windowsill with the window left on its latch all night.”",
      "“Damp paper swells where it takes up water, which is why an edge goes wavy.”",
      "“Ink spreads into damp fibre on its own, with nothing rubbing it, and bare steel rusts the same night.”",
    ],
    clears: [
      "The pens: “written with the same pens, are crisp and clean.”",
      "The glue: “these flaps are firm and the marks are everywhere.”",
      "A drink: “all nineteen are marked alike.”",
      "Handling: “this ink has spread in soft haloes.”",
    ],
    explain:
      "Smudged ink alone would send you after the pens. Smudged ink with wavy edges and fresh rust sends you after water, and the only water in the case is the water the air puts there. A card in a hand all morning is the control, and it came out clean.",
  },
  {
    t: "The Case of the Volcano That Barely Erupted",
    tag: "🌋 volcano",
    story:
      "The model volcano at the science fair gave a slow dribble instead of an eruption, and two more things were odd about it. The foam that did come out was pink rather than the deep red of every rehearsal. And a third of the liquid was still sitting in the bottle when the crowd moved on. Old bicarbonate fizzes weakly, but the same tub ran the rehearsal an hour earlier at full force. A narrow neck slows the foam without weakening the fizz, and the bottle was never changed. A cold room slows a reaction a little, and the hall was the same temperature as the classroom. Too little bicarbonate would leave vinegar behind, and the scoop was measured twice. The vinegar bottle was found three centimetres fuller than it was left after the rehearsal. Somebody topped it up from the tap to make it look untouched. Diluted vinegar carries less acid, so it makes less gas and makes it more slowly. The same dilution thins the red colouring already mixed into it. And a reaction that runs out of acid before it runs out of liquid leaves liquid behind.",
    q: "Why did the volcano fail?",
    s: [
      { who: "💧 Vinegar topped up with water", why: "the vinegar bottle was found three centimetres fuller than it was left after the rehearsal" },
      { who: "🧂 Old bicarbonate", why: "the same tub ran the rehearsal an hour earlier at full force" },
      { who: "🍾 A narrow neck", why: "a narrow neck slows the foam without weakening the fizz, and the bottle was never changed" },
      { who: "🧊 A cold room", why: "a cold room slows a reaction a little, and the hall was the same temperature as the classroom" },
      { who: "🥄 Too little bicarbonate", why: "too little bicarbonate would leave vinegar behind, and the scoop was measured twice" },
    ],
    who: 0,
    answer: "The vinegar had been watered down before the show.",
    proof: [
      "“Somebody topped it up from the tap to make it look untouched.”",
      "“Diluted vinegar carries less acid, so it makes less gas and makes it more slowly.”",
      "“The same dilution thins the red colouring already mixed into it.”",
    ],
    clears: [
      "Old bicarbonate: “the same tub ran the rehearsal an hour earlier at full force.”",
      "The neck: “the bottle was never changed.”",
      "The room: “the hall was the same temperature as the classroom.”",
      "The scoop: “the scoop was measured twice.”",
    ],
    explain:
      "A weak eruption has four innocent explanations and none of them turns red into pink. Water does. It is also the only one that explains why liquid was left in the bottle, because a watered acid runs out of strength long before it runs out of volume.",
  },
  {
    t: "The Case of the Crowns That Curled",
    tag: "👑 crown",
    story:
      "Half the paper crowns made in Tuesday's lesson had curled backwards into tubes within the hour. Two other facts were mentioned and set aside at the time. Every curled crown is one of the glued ones, and the stapled crowns are still flat. And each curled crown has turned slightly see-through in a band along the glued seam. The radiator heats the whole room, and both kinds of crown sat on the same two tables. Thin card would curl whichever way it was held, and the curl here is always toward the glued face. The paint was used on all twenty-four crowns, and twelve of them are perfect. Rough handling creases card, and there is not a crease on any of them. The glue is the water-based stick from the art cupboard, spread along one face only. Paper swells where water soaks in and shrinks again as that water leaves. One face of the card has been wetted and the other has not. A sheet that shrinks on one side and not the other has nowhere to go but round.",
    q: "Why did half the crowns curl?",
    s: [
      { who: "🧴 The water-based glue", why: "the glue is the water-based stick from the art cupboard, spread along one face only" },
      { who: "🔥 The radiator", why: "the radiator heats the whole room, and both kinds of crown sat on the same two tables" },
      { who: "📄 Thin card", why: "thin card would curl whichever way it was held, and the curl here is always toward the glued face" },
      { who: "🎨 The paint", why: "the paint was used on all twenty-four crowns, and twelve of them are perfect" },
      { who: "🖐️ Rough handling", why: "rough handling creases card, and there is not a crease on any of them" },
    ],
    who: 0,
    answer: "Wet glue on one face shrank that side of the card as it dried.",
    proof: [
      "“Paper swells where water soaks in and shrinks again as that water leaves.”",
      "“One face of the card has been wetted and the other has not.”",
      "“A sheet that shrinks on one side and not the other has nowhere to go but round.”",
    ],
    clears: [
      "The radiator: “both kinds of crown sat on the same two tables.”",
      "Thin card: “the curl here is always toward the glued face.”",
      "The paint: “twelve of them are perfect.”",
      "Handling: “there is not a crease on any of them.”",
    ],
    explain:
      "The stapled twelve are a control nobody set up on purpose. Same card, same paint, same radiator, no curl. What is left is the water in the glue, and it also explains the direction of the curl and the translucent band, because both are records of where the paper got wet.",
  },
  {
    t: "The Case of the Piano That Would Not Stay in Tune",
    tag: "🎹 piano",
    story:
      "The hall piano is noticeably flat three weeks after every tuning, and two other facts have never been put beside that one. The drop is worst in the treble and barely noticeable in the bass. And two hairline cracks have opened along the grain of the soundboard since September. The tuner has worked on it for eleven years and his other pianos hold their pitch for a year. Hard playing knocks individual strings out, which gives sour notes rather than a whole register sinking together. The move from the old hall happened in July, and the piano was flat again in October, January and March. A loose tuning pin lets one string slip, and every treble string has gone the same way. The hall is heated all day and the humidity gauge on the wall has read between twenty and twenty-six percent all winter. Wood gives up its moisture to dry air and shrinks as it goes. A shrinking soundboard flattens, which lets the strings above it slacken. Dry wood also splits along its grain, and the treble strings are the shortest and the quickest to show a change.",
    q: "Why does the piano go flat?",
    s: [
      { who: "🌡️ The dry heated hall", why: "the humidity gauge on the wall has read between twenty and twenty-six percent all winter" },
      { who: "🔧 The tuner", why: "the tuner has worked on it for eleven years and his other pianos hold their pitch for a year" },
      { who: "👊 Hard playing", why: "hard playing knocks individual strings out, which gives sour notes rather than a whole register sinking together" },
      { who: "🚚 The move from the old hall", why: "the move happened in July, and the piano was flat again in October, January and March" },
      { who: "📌 A loose tuning pin", why: "a loose tuning pin lets one string slip, and every treble string has gone the same way" },
    ],
    who: 0,
    answer: "Dry air in the heated hall is shrinking the soundboard.",
    proof: [
      "“Wood gives up its moisture to dry air and shrinks as it goes.”",
      "“A shrinking soundboard flattens, which lets the strings above it slacken.”",
      "“Dry wood also splits along its grain, and the treble strings are the shortest and the quickest to show a change.”",
    ],
    clears: [
      "The tuner: “his other pianos hold their pitch for a year.”",
      "Hard playing: “which gives sour notes rather than a whole register sinking together.”",
      "The move: “the piano was flat again in October, January and March.”",
      "A loose pin: “every treble string has gone the same way.”",
    ],
    explain:
      "Going flat, going flat unevenly, and splitting along the grain are three faces of one thing leaving the instrument: water. Blame the tuner and you still owe an explanation for the cracks. Dry air owes nothing, because shrinking wood both slackens strings and splits.",
  },
  {
    t: "The Case of the Kite That Dived Left",
    tag: "🪁 kite",
    story:
      "The kite climbs, hangs for a second and then swings hard to the left and hits the ground. It has done this eleven times in a row. Two other things are true and were taken for coincidence. The paper over the left half is a shade darker than the paper over the right. And the kite flew straight for two hours on Saturday, before it was left out on the grass overnight. A badly tied bridle pulls a kite over, but the bridle has not been retied since Saturday. Gusty wind throws a kite in whatever direction it happens to come from, and this kite goes left in a steady breeze. A tail that is too short makes a kite swing from side to side rather than always one way. A torn covering spills air through the hole, and the paper is whole on both sides. Dew soaked the lower half of the kite as it lay on the grass. Damp paper and a damp wooden spar both hold water, and water has weight. The left side is now heavier than the right, and a heavier side drops. Darker paper is wetter paper, and it is wetter because that is the side that lay down.",
    q: "Why does the kite always dive left?",
    s: [
      { who: "💧 The damp left side", why: "dew soaked the lower half of the kite as it lay on the grass, and water has weight" },
      { who: "🪢 The bridle", why: "a badly tied bridle pulls a kite over, but the bridle has not been retied since Saturday" },
      { who: "🌬️ Gusty wind", why: "gusty wind throws a kite in whatever direction it happens to come from, and this kite goes left in a steady breeze" },
      { who: "🎀 A short tail", why: "a tail that is too short makes a kite swing from side to side rather than always one way" },
      { who: "🕳️ A torn covering", why: "a torn covering spills air through the hole, and the paper is whole on both sides" },
    ],
    who: 0,
    answer: "The left half soaked up dew overnight and is now heavier.",
    proof: [
      "“Dew soaked the lower half of the kite as it lay on the grass.”",
      "“The left side is now heavier than the right, and a heavier side drops.”",
      "“Darker paper is wetter paper, and it is wetter because that is the side that lay down.”",
    ],
    clears: [
      "The bridle: “the bridle has not been retied since Saturday.”",
      "The wind: “this kite goes left in a steady breeze.”",
      "The tail: “makes a kite swing from side to side rather than always one way.”",
      "A tear: “the paper is whole on both sides.”",
    ],
    explain:
      "Always the same direction rules out the wind and the tail, because neither has a favourite side. Nothing was altered on the kite, which rules out the bridle. What changed was a night on wet grass, and that single change left its own evidence in the colour of the paper.",
  },
  {
    t: "The Case of the Pots That Stayed Wet",
    tag: "☘️ shamrock",
    story:
      "The shamrock seedlings on the back shelf are in trouble in three ways at once. Every stem leans hard toward the door. The leaves have faded from deep green to a yellowish pale. And the compost is still soaking four days after watering, when it used to dry out in two. Overwatering makes soil wet, but it does not make a plant lean, and the pots get the same cup each Monday. Poor compost gives weak growth from the start, and these were strong for five weeks. Cold would slow them without bending them toward one side of the room. A pest in the soil chews roots and wilts a plant, and nothing here is wilting. The sycamore outside the window came into full leaf in the third week of April. The shelf has had deep shade since, and the only bright thing in the room is the open door. A plant in poor light grows toward the brightest thing it can find and thins its colour. A plant in poor light also works slowly, drinks little, and leaves its pot wet.",
    q: "What is wrong with the seedlings?",
    s: [
      { who: "🌿 Too little light", why: "the sycamore outside the window came into full leaf in the third week of April, and the shelf has had deep shade since" },
      { who: "🚿 Overwatering", why: "overwatering makes soil wet, but it does not make a plant lean, and the pots get the same cup each Monday" },
      { who: "🪴 Poor compost", why: "poor compost gives weak growth from the start, and these were strong for five weeks" },
      { who: "🧊 Cold", why: "cold would slow them without bending them toward one side of the room" },
      { who: "🐛 A pest in the soil", why: "a pest in the soil chews roots and wilts a plant, and nothing here is wilting" },
    ],
    who: 0,
    answer: "The tree outside has put the shelf into deep shade.",
    proof: [
      "“The shelf has had deep shade since, and the only bright thing in the room is the open door.”",
      "“A plant in poor light grows toward the brightest thing it can find and thins its colour.”",
      "“A plant in poor light also works slowly, drinks little, and leaves its pot wet.”",
    ],
    clears: [
      "Overwatering: “it does not make a plant lean, and the pots get the same cup each Monday.”",
      "The compost: “these were strong for five weeks.”",
      "Cold: “would slow them without bending them toward one side of the room.”",
      "A pest: “nothing here is wilting.”",
    ],
    explain:
      "Wet soil looks like a watering mistake until you notice that nothing about the watering changed and the stems are pointing at the door. Shade explains the leaning, the pale colour and the wet pot together, because a plant that cannot work does not drink.",
  },
  {
    t: "The Case of the Puddle in Dry Weather",
    tag: "🌧️ puddle",
    story:
      "A puddle the size of a table sits in the middle of the new playground, and it has not rained for nine days. Two further details have been noted in the site book and left there. A faint white ring has dried onto the tarmac around its edge. And the water in it is slightly warm to the hand, even first thing in the morning. Rain is the obvious source, and the gauge by the fence has recorded nothing since the eleventh. The downpipe from the roof empties twenty metres away and the ground between is dust. A dip in the tarmac would hold rainwater and then dry out like every other dip in the yard. Children emptying bottles would make a cold puddle that is gone within an hour. A heating pipe runs under that corner of the playground from the boiler house. Water escaping from it arrives warm and keeps arriving whatever the weather does. Mains water carries dissolved minerals, and a puddle that evaporates at its edges leaves them behind as a pale ring. The puddle has been the same size every morning for nine days.",
    q: "Where is the water coming from?",
    s: [
      { who: "🚰 A leaking heating pipe", why: "a heating pipe runs under that corner of the playground, and water escaping from it arrives warm" },
      { who: "🌧️ Rain", why: "the gauge by the fence has recorded nothing since the eleventh" },
      { who: "🪣 The downpipe", why: "the downpipe from the roof empties twenty metres away and the ground between is dust" },
      { who: "🕳️ A dip in the tarmac", why: "a dip in the tarmac would hold rainwater and then dry out like every other dip in the yard" },
      { who: "🧋 Spilled bottles", why: "children emptying bottles would make a cold puddle that is gone within an hour" },
    ],
    who: 0,
    answer: "A heating pipe under the playground is leaking.",
    proof: [
      "“Water escaping from it arrives warm and keeps arriving whatever the weather does.”",
      "“Mains water carries dissolved minerals, and a puddle that evaporates at its edges leaves them behind as a pale ring.”",
      "“The puddle has been the same size every morning for nine days.”",
    ],
    clears: [
      "Rain: “the gauge by the fence has recorded nothing since the eleventh.”",
      "The downpipe: “empties twenty metres away and the ground between is dust.”",
      "A dip: “would hold rainwater and then dry out like every other dip in the yard.”",
      "Bottles: “would make a cold puddle that is gone within an hour.”",
    ],
    explain:
      "A puddle that will not dry, a mineral ring and warm water are three answers to three different questions: where the water comes from, how long it has been arriving, and how hot it was when it did. Only a buried heating pipe answers all three with one sentence.",
  },
  {
    t: "The Case of the Strip Where Nothing Grew",
    tag: "🌻 garden",
    story:
      "A strip about a metre wide runs across the school garden and nothing will grow on it. Two more things are true of that strip and of no other part of the plot. The soil in it is pale grey and sets into a crust after every watering. And even the weeds stop at its edge, though they are thick on both sides of it. Shade would stunt the beans without stopping dandelions, which grow happily in shade. Slugs eat leaves and leave stems and roots, and there are no chewed leaves anywhere on the strip. Uneven watering would show as wilting plants rather than bare ground. A buried path would be hard and shallow, and a fork goes into this strip easily enough. The builders washed out the cement mixer on that line every evening last summer. Cement washings are strongly alkaline, and the test strip pushed into the strip reads nine. Most garden plants take up nothing at that reading, however good the soil looks. Fine cement particles also fill the gaps between soil grains and set when they dry.",
    q: "Why is the strip bare?",
    s: [
      { who: "🪣 Cement washings from the mixer", why: "the builders washed out the cement mixer on that line every evening last summer" },
      { who: "🌳 Shade", why: "shade would stunt the beans without stopping dandelions, which grow happily in shade" },
      { who: "🐌 Slugs", why: "slugs eat leaves and leave stems and roots, and there are no chewed leaves anywhere on the strip" },
      { who: "🚿 Uneven watering", why: "uneven watering would show as wilting plants rather than bare ground" },
      { who: "🛤️ A buried path", why: "a buried path would be hard and shallow, and a fork goes into this strip easily enough" },
    ],
    who: 0,
    answer: "Cement washings have made the strip too alkaline for anything.",
    proof: [
      "“Cement washings are strongly alkaline, and the test strip pushed into the strip reads nine.”",
      "“Most garden plants take up nothing at that reading, however good the soil looks.”",
      "“Fine cement particles also fill the gaps between soil grains and set when they dry.”",
    ],
    clears: [
      "Shade: “would stunt the beans without stopping dandelions, which grow happily in shade.”",
      "Slugs: “there are no chewed leaves anywhere on the strip.”",
      "Watering: “would show as wilting plants rather than bare ground.”",
      "A path: “a fork goes into this strip easily enough.”",
    ],
    explain:
      "A bare strip, grey crusting soil, and weeds that stop dead at a line. Shade and slugs and watering each leave something growing. The mixer explains the chemistry, the colour and the crust at once, and it explains the shape, because a man rinsing a drum walks the same line every evening.",
  },
  {
    t: "The Case of the Hens That Pecked the Wall",
    tag: "🪺 eggs",
    story:
      "The school hens are laying eggs so thin that half of them crack in the collecting box. Two other changes have been written in the keepers' diary as separate worries. The birds have started breaking and eating their own eggs in the nest. And they spend part of every morning pecking at the old lime mortar between the bricks of the coop wall. Age thins a shell gradually over years, and these four hens are eighteen months old and were fine in March. Cold slows laying rather than thinning what is laid. A new bird in the flock causes fighting, and no bird has been added since last spring. Disease would show in the hens themselves, and the vet found four healthy birds. The feed was changed in April to a cheaper brand without added shell grit. The grit hopper has stood empty since, because the old feed made it unnecessary. A hen with too little calcium cannot build a thick shell, so she lays a thin one. She will also go looking for calcium wherever she can find it, and lime mortar is calcium.",
    q: "What is behind all three changes?",
    s: [
      { who: "🌾 The feed change", why: "the feed was changed in April to a cheaper brand without added shell grit, and the grit hopper has stood empty since" },
      { who: "🕰️ The hens' age", why: "age thins a shell gradually over years, and these four hens are eighteen months old and were fine in March" },
      { who: "🧊 The cold", why: "cold slows laying rather than thinning what is laid" },
      { who: "🐔 A new bird", why: "a new bird in the flock causes fighting, and no bird has been added since last spring" },
      { who: "🩺 Disease", why: "disease would show in the hens themselves, and the vet found four healthy birds" },
    ],
    who: 0,
    answer: "The new feed has no calcium in it and the grit hopper is empty.",
    proof: [
      "“The grit hopper has stood empty since, because the old feed made it unnecessary.”",
      "“A hen with too little calcium cannot build a thick shell, so she lays a thin one.”",
      "“She will also go looking for calcium wherever she can find it, and lime mortar is calcium.”",
    ],
    clears: [
      "Age: “these four hens are eighteen months old and were fine in March.”",
      "Cold: “cold slows laying rather than thinning what is laid.”",
      "A new bird: “no bird has been added since last spring.”",
      "Disease: “the vet found four healthy birds.”",
    ],
    explain:
      "Thin shells, egg eating and a pecked wall were three entries on three pages. They are one hunger. A hen short of calcium makes a poor shell and then goes after calcium anywhere she can reach it, which is her own broken egg and the lime in the mortar.",
  },
  {
    t: "The Case of the Rejected Recycling",
    tag: "🌎 earth",
    story:
      "The paper recycling has been refused by the collectors three weeks running, and two other facts have gone in the log unconnected. The bin now takes two people to wheel out when one managed it all last year. And there is standing water four centimetres deep in the bottom of it. Wrong items in the bin get a load rejected, and the audit on Monday found nothing in it but paper and card. A new collector with new rules would have said so, and the crew and the contract are unchanged. A bin too small would overflow rather than fail inspection. The paper itself comes from the same three classrooms it always came from. The bin lid has been propped open with a brick since the handle broke in February. Rain has gone straight in every week since, and a wheeled bin has no drain. Wet paper weighs several times what dry paper weighs, which is the whole difference in the wheeling. And a mill cannot take pulp that has already been soaked and begun to rot, so the load is refused at the gate.",
    q: "Why does the recycling keep getting refused?",
    s: [
      { who: "🧱 The lid propped open", why: "the bin lid has been propped open with a brick since the handle broke in February, and rain has gone straight in" },
      { who: "🗑️ Wrong items", why: "the audit on Monday found nothing in it but paper and card" },
      { who: "🚛 A new collector", why: "a new collector with new rules would have said so, and the crew and the contract are unchanged" },
      { who: "📏 A bin too small", why: "a bin too small would overflow rather than fail inspection" },
      { who: "🏫 The classrooms", why: "the paper itself comes from the same three classrooms it always came from" },
    ],
    who: 0,
    answer: "The propped lid has let rain soak the paper since February.",
    proof: [
      "“Rain has gone straight in every week since, and a wheeled bin has no drain.”",
      "“Wet paper weighs several times what dry paper weighs, which is the whole difference in the wheeling.”",
      "“And a mill cannot take pulp that has already been soaked and begun to rot, so the load is refused at the gate.”",
    ],
    clears: [
      "Wrong items: “the audit on Monday found nothing in it but paper and card.”",
      "The collector: “the crew and the contract are unchanged.”",
      "A small bin: “would overflow rather than fail inspection.”",
      "The classrooms: “the paper itself comes from the same three classrooms it always came from.”",
    ],
    explain:
      "A refused load points at what went into the bin. Nothing wrong went in. What went in was rain, through a lid held open since February, and that one brick accounts for the weight, the water in the bottom and the refusal, because soaked paper is no longer paper to a mill.",
  },
  {
    t: "The Case of the Haze in the Corner",
    tag: "📷 camera",
    story:
      "Every photograph taken on the school camera since the trip has a soft grey haze across the upper left corner. Two other facts were mentioned at the time and forgotten. The haze is almost invisible indoors and very strong whenever the camera points anywhere near the sun. And the camera bag smells of coconut, because a bottle of sun cream burst in it on the coach. A scratched lens shows as a hard bright line that looks the same in any light. Dust on the sensor makes small dark specks in fixed places, not a soft wash of grey. The strap in front of the lens appears as a sharp dark shape, and nothing here has an edge. A fault in the camera would mark every picture equally whatever the light was doing. A thin film of grease sits across one corner of the front element. Grease does not block light, it scatters it, which is why the mark is soft and grey. Scattering needs strong light to show, so a bright sky makes it obvious and a classroom hides it. The film is in the corner the burst bottle lay against.",
    q: "What is making the haze?",
    s: [
      { who: "🧴 Sun cream on the lens", why: "a thin film of grease sits across one corner of the front element, in the corner the burst bottle lay against" },
      { who: "🪞 A scratched lens", why: "a scratched lens shows as a hard bright line that looks the same in any light" },
      { who: "✨ Dust on the sensor", why: "dust on the sensor makes small dark specks in fixed places, not a soft wash of grey" },
      { who: "🧵 The strap", why: "the strap in front of the lens appears as a sharp dark shape, and nothing here has an edge" },
      { who: "⚙️ A fault in the camera", why: "a fault in the camera would mark every picture equally whatever the light was doing" },
    ],
    who: 0,
    answer: "A film of spilled sun cream is smeared on one corner of the lens.",
    proof: [
      "“Grease does not block light, it scatters it, which is why the mark is soft and grey.”",
      "“Scattering needs strong light to show, so a bright sky makes it obvious and a classroom hides it.”",
      "“The film is in the corner the burst bottle lay against.”",
    ],
    clears: [
      "A scratch: “shows as a hard bright line that looks the same in any light.”",
      "Sensor dust: “makes small dark specks in fixed places, not a soft wash of grey.”",
      "The strap: “appears as a sharp dark shape, and nothing here has an edge.”",
      "A camera fault: “would mark every picture equally whatever the light was doing.”",
    ],
    explain:
      "The mark has three properties: it is soft, it is in one corner, and it only shows against the light. Grease supplies all three, because it scatters rather than blocks, it sits where it was spilled, and scattering is invisible until there is plenty of light to scatter.",
  },
  {
    t: "The Case of the Brown Leaf Tips",
    tag: "🌱 plant",
    story:
      "The six spider plants on the classroom bookcase have dry brown tips on every leaf. Two other things are true of those six and not of the four on the windowsill. A hard white crust has formed across the top of their compost. And their saucers have never been emptied, while the windowsill saucers are tipped out each Friday. All ten plants get the same water from the same can on the same day. Dry air would brown the windowsill plants too, and they sit closer to the radiator than the bookcase does. Too little water leaves a plant limp and its compost light, and these pots are heavy and damp. Too much sun scorches whole patches of leaf rather than the last centimetre of each tip. Tap water carries dissolved salts, and the water leaves but the salts do not. A pot standing in its own drainage takes that water back up, salts and all. Salt gathers at the far end of a leaf, which is the tip, and burns it. The crust on the compost is the same salt, left where the surface dried.",
    q: "Why do only six plants have brown tips?",
    s: [
      { who: "🧂 Salt from the undrained saucers", why: "their saucers have never been emptied, and a pot standing in its own drainage takes that water back up, salts and all" },
      { who: "💨 Dry air", why: "dry air would brown the windowsill plants too, and they sit closer to the radiator than the bookcase does" },
      { who: "🚱 Too little water", why: "too little water leaves a plant limp and its compost light, and these pots are heavy and damp" },
      { who: "☀️ Too much sun", why: "too much sun scorches whole patches of leaf rather than the last centimetre of each tip" },
      { who: "🚿 The watering can", why: "all ten plants get the same water from the same can on the same day" },
    ],
    who: 0,
    answer: "The six pots keep drinking their own salty drainage back.",
    proof: [
      "“Tap water carries dissolved salts, and the water leaves but the salts do not.”",
      "“Salt gathers at the far end of a leaf, which is the tip, and burns it.”",
      "“The crust on the compost is the same salt, left where the surface dried.”",
    ],
    clears: [
      "Dry air: “they sit closer to the radiator than the bookcase does.”",
      "Too little water: “these pots are heavy and damp.”",
      "Too much sun: “scorches whole patches of leaf rather than the last centimetre of each tip.”",
      "The can: “all ten plants get the same water from the same can on the same day.”",
    ],
    explain:
      "Four plants on the windowsill get the same water and are fine, so the water is not the difference. The difference is what happens after it drains. Salt left in a saucer goes back up the pot, builds a crust on top and burns the tip of every leaf, which is three symptoms from one habit.",
  },
  {
    t: "The Case of the Gritty Ice Cream",
    tag: "🍦 icecream",
    story:
      "Ice cream from the chest freezer in the kitchen is gritty with ice crystals however new the tub is. Two other facts have been mentioned to the caretaker and never followed up. There is a hard sheet of frost two centimetres thick across the underside of the lid. And the freezer's compressor now runs almost continuously instead of switching on and off. An old tub would explain a gritty one, and the tub opened on Friday was bought that morning. A poor brand would be gritty from the first spoonful, and the first spoonful of this one was smooth. A freezer set too warm would show on the thermometer, and it reads minus nineteen degrees. Overfilling slows the cold air, and the freezer is half empty. The rubber seal along the front edge has a notch cut out of it the width of a thumb. Warm damp air leaks in through that notch all day and the cold leaks out, which is why the motor never stops. Water from that air freezes on the first cold surface it meets, which is the lid. And ice cream that part thaws and refreezes grows the big crystals you can feel on the tongue.",
    q: "What is ruining the ice cream?",
    s: [
      { who: "🚪 The notched door seal", why: "the rubber seal along the front edge has a notch cut out of it the width of a thumb" },
      { who: "📅 An old tub", why: "an old tub would explain a gritty one, and the tub opened on Friday was bought that morning" },
      { who: "🏷️ A poor brand", why: "a poor brand would be gritty from the first spoonful, and the first spoonful of this one was smooth" },
      { who: "🌡️ A warm setting", why: "a freezer set too warm would show on the thermometer, and it reads minus nineteen degrees" },
      { who: "📦 Overfilling", why: "overfilling slows the cold air, and the freezer is half empty" },
    ],
    who: 0,
    answer: "A notch in the door seal is letting warm damp air in.",
    proof: [
      "“Warm damp air leaks in through that notch all day and the cold leaks out, which is why the motor never stops.”",
      "“Water from that air freezes on the first cold surface it meets, which is the lid.”",
      "“And ice cream that part thaws and refreezes grows the big crystals you can feel on the tongue.”",
    ],
    clears: [
      "An old tub: “the tub opened on Friday was bought that morning.”",
      "A poor brand: “the first spoonful of this one was smooth.”",
      "A warm setting: “it reads minus nineteen degrees.”",
      "Overfilling: “the freezer is half empty.”",
    ],
    explain:
      "The thermometer says the freezer is cold enough, so the temperature looks innocent. It is the only reading taken, and it is taken in one place at one moment. A notch in the seal explains the frost, the motor that never rests, and the crystals, because all three are what leaking air does.",
  },
  {
    t: "The Case of the Ribbons That Turned Pink",
    tag: "🎗️ ribbon",
    story:
      "Half the charity ribbons on the entrance noticeboard have faded from deep red to a washed-out pink. Two other facts about the board belong with that one. The faded ribbons are all on the left half, and the line between faded and unfaded is straight and sharp. And the backing paper under the left half has yellowed while the right half is still white. A bad batch of dye would fade ribbons wherever they happened to be pinned. Rain cannot reach a board in a dry entrance hall with no window above it. The radiator below the board heats the bottom row hardest, and the bottom row on the right is as red as the day it was pinned. Handling wears a ribbon at its edges rather than taking the colour out of the middle. A ribbon from the same box, kept in the office drawer since October, is still deep red. The high window over the door throws a hard-edged block of sunlight onto the left half of the board every afternoon. Sunlight breaks down dye, which is fading, and it yellows paper, which is ageing. Both happen only where the light lands, and light lands in straight-edged shapes.",
    q: "Why did half the ribbons fade?",
    s: [
      { who: "☀️ Sunlight from the high window", why: "the high window over the door throws a hard-edged block of sunlight onto the left half of the board every afternoon" },
      { who: "🧪 A bad batch of dye", why: "a bad batch of dye would fade ribbons wherever they happened to be pinned" },
      { who: "🌧️ Rain", why: "rain cannot reach a board in a dry entrance hall with no window above it" },
      { who: "🔥 The radiator", why: "the bottom row on the right is as red as the day it was pinned" },
      { who: "🖐️ Handling", why: "handling wears a ribbon at its edges rather than taking the colour out of the middle" },
    ],
    who: 0,
    answer: "Afternoon sun falls on the left half of the board.",
    proof: [
      "“Sunlight breaks down dye, which is fading, and it yellows paper, which is ageing.”",
      "“Both happen only where the light lands, and light lands in straight-edged shapes.”",
      "“A ribbon from the same box, kept in the office drawer since October, is still deep red.”",
    ],
    clears: [
      "The dye: “would fade ribbons wherever they happened to be pinned.”",
      "Rain: “rain cannot reach a board in a dry entrance hall with no window above it.”",
      "The radiator: “the bottom row on the right is as red as the day it was pinned.”",
      "Handling: “wears a ribbon at its edges rather than taking the colour out of the middle.”",
    ],
    explain:
      "A straight line across a noticeboard is not something dye or damp or hands can draw. Light can. It explains the shape, the faded ribbons and the yellowed paper in one go, and the ribbon shut in a drawer since October proves the box was never the problem.",
  },
  {
    t: "The Case of the Balloons That Came Back Up",
    tag: "🎈 balloons",
    story:
      "Forty balloons tied for the leavers' assembly were lying on the floor when the caretaker opened the hall at seven. Two other facts from that morning were noticed and nobody made anything of them. The dog bowl by the kitchen door had a skin of ice on it. And by half past eleven most of the balloons were floating again, without anyone touching them. A leak lets gas out and there is no way back in, so a leaking balloon stays down. Underfilled balloons would never have flown, and these flew all through Thursday afternoon. Ribbons too heavy for the lift would have dragged them down on Thursday as well. A punctured balloon goes soft and wrinkled, and all forty are tight and smooth. The hall heating was off overnight and the room fell close to freezing. Gas shrinks as it cools, so each balloon held a smaller volume of helium by morning. A smaller balloon pushes aside less air, and it is the pushed-aside air that lifts it. Warming the hall through the morning let the gas expand again and the lift came back with it.",
    q: "Why did the balloons sink and then rise?",
    s: [
      { who: "🧊 The cold hall", why: "the hall heating was off overnight and the room fell close to freezing, and gas shrinks as it cools" },
      { who: "💨 A leak", why: "a leak lets gas out and there is no way back in, so a leaking balloon stays down" },
      { who: "🫧 Underfilled balloons", why: "underfilled balloons would never have flown, and these flew all through Thursday afternoon" },
      { who: "🎀 Heavy ribbons", why: "ribbons too heavy for the lift would have dragged them down on Thursday as well" },
      { who: "📌 A puncture", why: "a punctured balloon goes soft and wrinkled, and all forty are tight and smooth" },
    ],
    who: 0,
    answer: "The cold shrank the helium overnight and the warmth gave it back.",
    proof: [
      "“Gas shrinks as it cools, so each balloon held a smaller volume of helium by morning.”",
      "“A smaller balloon pushes aside less air, and it is the pushed-aside air that lifts it.”",
      "“Warming the hall through the morning let the gas expand again and the lift came back with it.”",
    ],
    clears: [
      "A leak: “there is no way back in, so a leaking balloon stays down.”",
      "Underfilled: “these flew all through Thursday afternoon.”",
      "Heavy ribbons: “would have dragged them down on Thursday as well.”",
      "A puncture: “all forty are tight and smooth.”",
    ],
    explain:
      "Everything that takes gas out of a balloon is permanent, so the balloons coming back up on their own rules all of it out at once. Only a change that can reverse fits, and the ice on the dog bowl says what the change was. One cold night explains the fall, the ice and the recovery.",
  },
];

gradeMysteries(10, CASES);
