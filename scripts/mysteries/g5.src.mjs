/**
 * Grade 5 mysteries: thirty-six cases, one a week, on the same thirty-six
 * themes as every other grade. Week 9 is the pumpkin case in every room in
 * the building; only the reading level and the case itself change.
 *
 * Held to the band in scripts/reading-mystery-plan.json: 92-132 words, mean
 * sentence no longer than 14 words, three or four suspects, and at least two
 * proof quotes that are really in the story.
 *
 * At this level the solution takes two steps rather than one. The text gives
 * a fact and a rule -- the sill tilts, and an eraser rolls; the gym swings
 * thirty degrees, and two glued materials expand differently -- and the
 * student has to put them together. The alternatives are ruled out on the
 * evidence rather than by being obviously silly.
 *
 *   bun run scripts/mysteries/g5.src.mjs && bun run scripts/merge-mysteries.mjs
 *   bun run scripts/check-mysteries.mjs
 */
import { gradeMysteries } from "./build.mjs";

const CASES = [
  {
    t: "The Case of the Rearranged Shelf",
    tag: "📚 library",
    story: "Every book in the 500s was out of order on Monday morning. The call numbers ran backward from 599 to 500. Mrs. Kim checked the sign-out log and found no checkouts after Thursday. The custodian had waxed that aisle Friday night and said he moved nothing. A sixth-grade class had used the library Friday afternoon for a research lesson. Taped inside the back of the cart was a worksheet titled Practice Shelving: Reverse Order. One student had written her name at the top and answered all twelve questions correctly. The books were not lost. They had been shelved exactly as the worksheet told her to.",
    q: "Why were the books in backward order?",
    s: [
      { who: "📋 A shelving practice worksheet", why: "titled Reverse Order, with all twelve questions answered" },
      { who: "🧹 The custodian", why: "waxed the aisle and said he moved nothing" },
      { who: "📕 Books checked out", why: "no checkouts after Thursday" },
      { who: "🙋 A student hiding a book", why: "the books were not lost" },
    ],
    who: 0,
    answer: "A student shelved the books in reverse as the worksheet said.",
    proof: [
      "“Taped inside the back of the cart was a worksheet titled Practice Shelving: Reverse Order.”",
      "“They had been shelved exactly as the worksheet told her to.”",
    ],
    clears: [
      "The custodian: “said he moved nothing.”",
      "Checkouts: “found no checkouts after Thursday.”",
    ],
    explain: "Nothing was missing and nothing was damaged. Because the worksheet asked for reverse order and the student answered all twelve questions correctly, she shelved the whole range backward on purpose.",
  },
  {
    t: "The Case of the Warm Milk",
    tag: "🥪 lunchbox",
    story: "Four students in Room 12 had warm milk at lunch and the rest were cold. All twenty cartons came out of the same cooler at 11:40. The four warm ones belonged to students who sit at the window table. Those four had put their cartons on the table at 11:45. The other sixteen also came out at 11:45 but stayed inside closed lunchboxes. The window table gets direct sun from 11:30 until one o'clock. A thermometer left on that table for ten minutes read eighty-one degrees. The cooler was working. The milk had been cold when it came out.",
    q: "Why was only some of the milk warm?",
    s: [
      { who: "☀️ The sunny window table", why: "a thermometer there read eighty-one degrees" },
      { who: "🧊 The cooler", why: "the cooler was working" },
      { who: "🥛 Bad milk", why: "the milk had been cold when it came out" },
      { who: "⏰ Time out of the cooler", why: "all of it came out at 11:45" },
    ],
    who: 0,
    answer: "The sun on the window table warmed those four cartons.",
    proof: [
      "“The window table gets direct sun from 11:30 until one o'clock.”",
      "“A thermometer left on that table for ten minutes read eighty-one degrees.”",
    ],
    clears: [
      "The cooler: “The cooler was working.”",
      "Time out of the cooler: “The other sixteen also came out at 11:45 but stayed inside closed lunchboxes.”",
    ],
    explain: "All twenty cartons left the cooler together. Because only four sat on a table in direct sun while the rest stayed in closed lunchboxes, the sun warmed those four and nothing else.",
  },
  {
    t: "The Case of the Vanishing Erasers",
    tag: "✏️ pencil",
    story: "Mr. Dunn bought a box of thirty pink erasers in September. By November eleven were gone. No student had taken one home, and the class had searched desks twice. Mr. Dunn found eight of them in the heating vent under the window. The vent sits directly below the pencil cup on the sill. An eraser is light and rolls, and the sill tilts half an inch toward the window. He put a strip of tape along the sill edge. Over the next six weeks nothing else fell. The missing three are probably further down the duct.",
    q: "Where did the erasers go?",
    s: [
      { who: "🕳️ The heating vent below the sill", why: "eight were found in the vent" },
      { who: "🎒 Students took them home", why: "no student had taken one home" },
      { who: "🗄️ Lost in desks", why: "the class had searched desks twice" },
    ],
    who: 0,
    answer: "The erasers rolled off the tilted sill into the vent.",
    proof: [
      "“Mr. Dunn found eight of them in the heating vent under the window.”",
      "“An eraser is light and rolls, and the sill tilts half an inch toward the window.”",
    ],
    clears: [
      "Taking them home: “No student had taken one home”",
      "Desks: “the class had searched desks twice.”",
    ],
    explain: "Nothing else fell after tape went along the sill edge. Because the sill tilts toward the window and an eraser rolls, the erasers rolled off into the vent below.",
  },
  {
    t: "The Case of the Bruised Apples",
    tag: "🍎 apple",
    story: "The fifth grade picked four bushels and found a third of them bruised two days later. The bruises are all on one side and about the size of a thumb. Nobody dropped a crate. The truck ride was eight minutes on a paved road. The students had been told to pick with a twist, not a pull. Fourteen of them pulled instead, and a pulled apple comes away with the stem still attached. A loose stem in a crate presses into whatever it touches. The bruised apples were all in the two crates those fourteen filled. The unbruised crates have no stems loose inside them.",
    q: "What bruised the apples?",
    s: [
      { who: "🍎 Loose stems from pulled apples", why: "the bruised apples were in the crates those fourteen filled" },
      { who: "🚚 The truck ride", why: "eight minutes on a paved road" },
      { who: "📦 A dropped crate", why: "nobody dropped a crate" },
    ],
    who: 0,
    answer: "Loose stems in the crates pressed bruises into the apples.",
    proof: [
      "“A loose stem in a crate presses into whatever it touches.”",
      "“The bruised apples were all in the two crates those fourteen filled.”",
    ],
    clears: [
      "The truck: “The truck ride was eight minutes on a paved road.”",
      "A dropped crate: “Nobody dropped a crate.”",
    ],
    explain: "The unbruised crates have no stems loose inside them. Because fourteen students pulled instead of twisting, the stems came away with the fruit and pressed into the apples around them.",
  },
  {
    t: "The Case of the Pulling Brake",
    tag: "🚲 bike",
    story: "Dev's bike pulled left every time he squeezed the brake. Both tires held the same pressure, and the frame sat straight against a wall. His father watched the wheels while Dev braked slowly in the driveway. The front brake pad on the left touched the rim a half second before the right one. One brake cable runs through a housing that had split near the handlebar. A split housing lets the cable stretch, which delays one side. His father replaced the housing and both pads met the rim together. The pull stopped on the first ride.",
    q: "Why did the bike pull to one side?",
    s: [
      { who: "🔧 A split brake cable housing", why: "the left pad touched a half second early" },
      { who: "🛞 Tire pressure", why: "both tires held the same pressure" },
      { who: "🚲 A bent frame", why: "the frame sat straight against a wall" },
    ],
    who: 0,
    answer: "A split housing delayed the right brake pad.",
    proof: [
      "“One brake cable runs through a housing that had split near the handlebar.”",
      "“A split housing lets the cable stretch, which delays one side.”",
    ],
    clears: [
      "Tire pressure: “Both tires held the same pressure”",
      "A bent frame: “the frame sat straight against a wall.”",
    ],
    explain: "The pull stopped once the housing was replaced and both pads met the rim together. Because the split housing let the cable stretch, the left pad gripped half a second before the right.",
  },
  {
    t: "The Case of the Gasping Fish",
    tag: "🐠 fishtank",
    story: "The class goldfish hung near the surface and gulped at the air for two days. The water was clear and the filter ran all night. A test strip showed no ammonia and the right pH. The tank sits beside a radiator that came on when the weather turned. A thermometer in the water read eighty-two degrees, eight above the usual reading. Warm water holds less dissolved oxygen than cool water does. A fish at the surface is trying to reach the layer with the most oxygen. The class moved the tank four feet from the radiator. Within a day the fish swam low again.",
    q: "Why was the fish gulping at the surface?",
    s: [
      { who: "🔥 Warm water from the radiator", why: "the water read eighty-two degrees" },
      { who: "🔌 The filter", why: "the filter ran all night" },
      { who: "🧪 Bad water chemistry", why: "no ammonia and the right pH" },
    ],
    who: 0,
    answer: "The warm water held too little oxygen.",
    proof: [
      "“A thermometer in the water read eighty-two degrees, eight above the usual reading.”",
      "“Warm water holds less dissolved oxygen than cool water does.”",
    ],
    clears: [
      "The filter: “the filter ran all night.”",
      "Water chemistry: “A test strip showed no ammonia and the right pH.”",
    ],
    explain: "The fish swam low again within a day of moving the tank. Because the radiator warmed the water to eighty-two degrees, the water held less oxygen and the fish went to the surface for it.",
  },
  {
    t: "The Case of the Rattling Vent",
    tag: "🔊 noise",
    story: "A rattle came from the ceiling vent in Room 8 three or four times an hour. It stopped completely on Saturday and started again Monday. Mr. Blake found no loose screws. The duct is strapped tight. The rattle happens about ten seconds after the heat kicks on. A thin metal damper inside the duct swings when air first moves through it. The damper's pin had worn a groove and no longer held it steady. On Saturday the building heat was off, so the damper never moved. He shimmed the pin with a washer and the rattle stopped.",
    q: "What was rattling in the vent?",
    s: [
      { who: "🌀 A worn damper pin", why: "the damper swings when air first moves through" },
      { who: "🔩 Loose screws", why: "no loose screws were found" },
      { who: "📏 The duct straps", why: "the duct is strapped tight" },
    ],
    who: 0,
    answer: "A worn pin let the damper swing and rattle.",
    proof: [
      "“A thin metal damper inside the duct swings when air first moves through it.”",
      "“The damper's pin had worn a groove and no longer held it steady.”",
    ],
    clears: [
      "Loose screws: “Mr. Blake found no loose screws.”",
      "The straps: “The duct is strapped tight.”",
    ],
    explain: "On Saturday the heat was off and the rattle stopped. Because the worn pin no longer held the damper steady, the damper swung every time the heat came on.",
  },
  {
    t: "The Case of the One Bare Branch",
    tag: "🍂 leaves",
    story: "One maple at the school entrance dropped the leaves from a single branch in September. The rest of the tree stayed green. The branch is on the north side, away from the parking lot and the road salt. No insect holes appear in the fallen leaves. A groundskeeper found a deep cut in the bark where that branch meets the trunk. The cut came from a string trimmer used around the base in August. Water travels to a branch through a thin layer just under the bark. A cut that circles part of that layer starves whatever is above it. The rest of the tree is fed by uncut bark.",
    q: "Why did one branch lose its leaves?",
    s: [
      { who: "🪚 A cut in the bark", why: "a deep cut where that branch meets the trunk" },
      { who: "🧂 Road salt", why: "the branch is away from the road salt" },
      { who: "🐛 Insects", why: "no insect holes appear in the fallen leaves" },
    ],
    who: 0,
    answer: "A cut in the bark starved that one branch.",
    proof: [
      "“A groundskeeper found a deep cut in the bark where that branch meets the trunk.”",
      "“A cut that circles part of that layer starves whatever is above it.”",
    ],
    clears: [
      "Road salt: “The branch is on the north side, away from the parking lot and the road salt.”",
      "Insects: “No insect holes appear in the fallen leaves.”",
    ],
    explain: "The rest of the tree is fed by uncut bark and stayed green. Because the trimmer cut through the thin layer that carries water to that branch, only that branch lost its leaves.",
  },
  {
    t: "The Case of the Pumpkin That Fell In",
    tag: "🎃 pumpkin",
    story: "The entrance pumpkin held its shape for three weeks and caved in overnight on the twenty-second day. No animal tracks or tooth marks appear anywhere on it. The custodian did not move it. The lid was never cut. The temperature dropped to twenty-six degrees that night, the first freeze of the fall. A pumpkin is about ninety percent water, and water expands when it freezes. Expanding ice pushes the cell walls apart, and they do not go back when the ice melts. The pumpkin in the lobby, in the same light, is still firm. The collapse happened the morning after the freeze.",
    q: "Why did the pumpkin cave in?",
    s: [
      { who: "❄️ The overnight freeze", why: "the temperature dropped to twenty-six degrees" },
      { who: "🐀 An animal", why: "no tracks or tooth marks appear on it" },
      { who: "🧹 The custodian", why: "the custodian did not move it" },
    ],
    who: 0,
    answer: "Freezing water pushed the pumpkin's cell walls apart.",
    proof: [
      "“The temperature dropped to twenty-six degrees that night, the first freeze of the fall.”",
      "“Expanding ice pushes the cell walls apart, and they do not go back when the ice melts.”",
    ],
    clears: [
      "An animal: “No animal tracks or tooth marks appear anywhere on it.”",
      "The custodian: “The custodian did not move it.”",
    ],
    explain: "The lobby pumpkin in the same light is still firm. Because the night dropped to twenty-six degrees and a pumpkin is mostly water, the ice pushed the cell walls apart and the shell gave way as it thawed.",
  },
  {
    t: "The Case of the Single Set of Prints",
    tag: "👣 footprints",
    story: "Wet prints crossed the cafeteria floor on Wednesday in one direction only. Nothing led back. The prints start at the loading door and stop at the dish room. It had rained all morning and the delivery truck arrived at ten. The driver wore boots with a block tread, and the prints show a block tread. The dish room has a floor drain and a hose used at ten fifteen. Prints made on the way back would have been washed away by that hose. The kitchen staff wear non-slip shoes with a circular pattern. No circular prints appear anywhere on the floor.",
    q: "Who left the wet prints?",
    s: [
      { who: "🚚 The delivery driver", why: "the prints show a block tread like his boots" },
      { who: "👩‍🍳 The kitchen staff", why: "no circular prints appear anywhere" },
      { who: "🚪 Somebody still inside", why: "the return prints would have been hosed away" },
    ],
    who: 0,
    answer: "The delivery driver left the prints in his block-tread boots.",
    proof: [
      "“The driver wore boots with a block tread, and the prints show a block tread.”",
      "“The prints start at the loading door and stop at the dish room.”",
    ],
    clears: [
      "The kitchen staff: “No circular prints appear anywhere on the floor.”",
      "Somebody still inside: “Prints made on the way back would have been washed away by that hose.”",
    ],
    explain: "The prints show a block tread and run one way only. Because the driver came in at ten in block-tread boots and the dish room floor was hosed at ten fifteen, his return prints were washed away.",
  },
  {
    t: "The Case of the Half-Empty Bus",
    tag: "🚌 bus",
    story: "Bus 7 arrived at school with eleven students on Tuesday instead of the usual twenty-six. Nobody was absent, and the attendance office counted all twenty-six in class by nine. The driver ran the normal route and made every stop. A city crew had closed Pine Street at six that morning for a water main. Fifteen of the students live on Pine Street or on the two streets behind it. The detour sign at the Pine Street corner pointed walkers toward the school's east gate. Walking from Pine Street to the east gate takes nine minutes. All twenty-six were at school. Only eleven were on the bus.",
    q: "Where were the other fifteen students?",
    s: [
      { who: "🚧 The Pine Street closure", why: "fifteen live there and the sign sent walkers to the east gate" },
      { who: "🤒 Absences", why: "nobody was absent" },
      { who: "🚌 A missed stop", why: "the driver made every stop" },
    ],
    who: 0,
    answer: "Fifteen students walked because Pine Street was closed.",
    proof: [
      "“A city crew had closed Pine Street at six that morning for a water main.”",
      "“The detour sign at the Pine Street corner pointed walkers toward the school's east gate.”",
    ],
    clears: [
      "Absences: “Nobody was absent”",
      "A missed stop: “The driver ran the normal route and made every stop.”",
    ],
    explain: "All twenty-six were in class by nine. Because Pine Street was closed and the detour sign pointed walkers to the east gate, the fifteen who live there walked instead of riding.",
  },
  {
    t: "The Case of the Cracked Trophy",
    tag: "🏆 trophy",
    story: "The science fair trophy developed a crack across its base between June and September. The case stayed locked and nobody signed it out. The crack runs in a straight line, not the star shape a blow would leave. The case sits against the south wall of the gym, which has no air conditioning in summer. A logger left in the case recorded swings from sixty-one degrees to ninety-four. The base is a marble slab glued to a plastic plate underneath. Marble and plastic expand by different amounts when they are heated. Two materials glued together that expand differently will pull apart at the joint. The crack follows the glue line exactly.",
    q: "What cracked the trophy base?",
    s: [
      { who: "🌡️ Heat swings in the gym", why: "the crack follows the glue line exactly" },
      { who: "🔨 A blow", why: "the crack is straight, not the star shape a blow leaves" },
      { who: "🖐 Handling", why: "the case stayed locked and nobody signed it out" },
    ],
    who: 0,
    answer: "Heat made the marble and plastic pull apart at the glue line.",
    proof: [
      "“A logger left in the case recorded swings from sixty-one degrees to ninety-four.”",
      "“Two materials glued together that expand differently will pull apart at the joint.”",
    ],
    clears: [
      "A blow: “The crack runs in a straight line, not the star shape a blow would leave.”",
      "Handling: “The case stayed locked and nobody signed it out.”",
    ],
    explain: "The crack follows the glue line exactly. Because the gym swung between sixty-one and ninety-four degrees, the marble and the plastic expanded by different amounts and separated at the joint.",
  },
  {
    t: "The Case of the Underdone Turkey",
    tag: "🦃 turkey",
    story: "The fifth grade's holiday turkey came out browned on the outside and raw near the bone. The oven thermometer read 350 all afternoon. The bird roasted for the full four and a half hours the chart called for. It had come out of the freezer at nine that morning. A frozen turkey needs about twenty-four hours in a refrigerator for every five pounds. This one weighed sixteen pounds and had thawed for five hours on the counter. Heat moves through a roasting bird from the outside in. Ice at the center absorbs heat without the temperature rising. The outside finished while the middle was still thawing.",
    q: "Why was the turkey raw near the bone?",
    s: [
      { who: "🧊 Still frozen at the center", why: "sixteen pounds thawed for only five hours" },
      { who: "🔥 The oven heat", why: "the thermometer read 350 all afternoon" },
      { who: "⏲️ Not enough time", why: "it roasted the full time the chart called for" },
    ],
    who: 0,
    answer: "The turkey was still frozen in the middle.",
    proof: [
      "“A frozen turkey needs about twenty-four hours in a refrigerator for every five pounds.”",
      "“This one weighed sixteen pounds and had thawed for five hours on the counter.”",
    ],
    clears: [
      "The oven: “The oven thermometer read 350 all afternoon.”",
      "Time: “The bird roasted for the full four and a half hours the chart called for.”",
    ],
    explain: "The outside browned properly, so the oven and the time were fine. Because a sixteen-pound bird needs far more than five hours to thaw, ice at the center absorbed the heat and the middle stayed raw.",
  },
  {
    t: "The Case of the Tough Cupcakes",
    tag: "🧁 cupcake",
    story: "Room 11 baked two trays of cupcakes from one bowl of batter. The first tray is light and the second is dense and chewy. Both trays went into the same oven at the same temperature. Both came out after eighteen minutes. The class kept stirring the bowl while the first tray baked. Stirring wheat batter builds gluten, and gluten makes a cake chewy. The second tray sat in the bowl being stirred for eighteen extra minutes. The recipe says to stop mixing as soon as the flour disappears. Nobody added anything to the second half.",
    q: "Why was the second tray chewy?",
    s: [
      { who: "🥄 Extra stirring", why: "the second half was stirred for eighteen extra minutes" },
      { who: "🔥 The oven", why: "both trays went in at the same temperature" },
      { who: "⏲️ Baking time", why: "both came out after eighteen minutes" },
      { who: "🧂 A wrong ingredient", why: "nobody added anything to the second half" },
    ],
    who: 0,
    answer: "Extra stirring built gluten and made them chewy.",
    proof: [
      "“Stirring wheat batter builds gluten, and gluten makes a cake chewy.”",
      "“The second tray sat in the bowl being stirred for eighteen extra minutes.”",
    ],
    clears: [
      "The oven: “Both trays went into the same oven at the same temperature.”",
      "Baking time: “Both came out after eighteen minutes.”",
    ],
    explain: "One bowl of batter made both trays, so the ingredients were identical. Because the second half was stirred for eighteen extra minutes, the stirring built gluten and the cupcakes came out chewy.",
  },
  {
    t: "The Case of the Stiff Gloves",
    tag: "🧤 mitten",
    story: "Noor's wool gloves came back from the wash stiff enough to stand up by themselves. The label says cold water and lay flat to dry. Her brother washed them in hot water and put them through the dryer. Wool fibers are covered in tiny scales that open in heat and lock together. Once locked, the scales do not release, and the wool stays matted and stiff. The gloves also came out two sizes smaller than before. A pair of her cotton gloves washed in the same load came out fine. Cotton has no scales. The wool gloves cannot be restored.",
    q: "Why did the gloves come out stiff?",
    s: [
      { who: "🔥 Hot water and the dryer", why: "heat opens the scales so they lock together" },
      { who: "🧼 The soap", why: "cotton gloves in the same load came out fine" },
      { who: "🧤 Cheap wool", why: "the label says cold water and lay flat" },
    ],
    who: 0,
    answer: "Heat locked the wool scales together.",
    proof: [
      "“Her brother washed them in hot water and put them through the dryer.”",
      "“Wool fibers are covered in tiny scales that open in heat and lock together.”",
    ],
    clears: [
      "The soap: “A pair of her cotton gloves washed in the same load came out fine.”",
      "Cheap wool: “The label says cold water and lay flat to dry.”",
    ],
    explain: "The cotton gloves in the same load came out fine because cotton has no scales. Because the wool went through hot water and a dryer, the scales opened, locked together, and the gloves matted and shrank.",
  },
  {
    t: "The Case of the Leaning House",
    tag: "🎄 ginger",
    story: "Room 6's gingerbread house stood square on Monday and leaned badly by Thursday. The icing on every seam is still hard. No candy has fallen off. The back wall is a single slab of gingerbread eleven inches long. The room's humidity rose from thirty percent to sixty-eight after a warm week. Gingerbread absorbs water from damp air and softens as it does. A soft slab sags under its own weight even when the joints hold. The front wall, which is two shorter pieces, is still straight. The lean is all in the long back wall.",
    q: "Why did the house lean?",
    s: [
      { who: "💧 Damp air softening the gingerbread", why: "the lean is all in the long back wall" },
      { who: "🍥 Failed icing", why: "the icing on every seam is still hard" },
      { who: "🍬 Heavy candy", why: "no candy has fallen off" },
    ],
    who: 0,
    answer: "Damp air softened the long back wall and it sagged.",
    proof: [
      "“Gingerbread absorbs water from damp air and softens as it does.”",
      "“A soft slab sags under its own weight even when the joints hold.”",
    ],
    clears: [
      "The icing: “The icing on every seam is still hard.”",
      "The candy: “No candy has fallen off.”",
    ],
    explain: "The front wall, made of two shorter pieces, is still straight. Because humidity rose to sixty-eight percent and gingerbread absorbs water, the eleven-inch back wall softened and sagged under its own weight.",
  },
  {
    t: "The Case of the Dimming Lights",
    tag: "💡 lights",
    story: "The hallway light strand burned brightly in December and looked dim by January. Every bulb still lights. None of them flicker. The strand now runs through a second extension cord added after the holidays. The total length from the outlet is one hundred and ten feet. Voltage drops the further electricity travels along a thin cord. A meter at the far end read ninety-six volts instead of one hundred and twenty. The bulbs nearest the outlet are noticeably brighter than the ones at the end. Plugging the strand into a closer outlet restored the brightness.",
    q: "Why did the lights go dim?",
    s: [
      { who: "🔌 Voltage drop over the long cord", why: "the far end read ninety-six volts" },
      { who: "💡 Burned out bulbs", why: "every bulb still lights" },
      { who: "⚡ A loose connection", why: "none of them flicker" },
    ],
    who: 0,
    answer: "The long cord dropped the voltage reaching the strand.",
    proof: [
      "“Voltage drops the further electricity travels along a thin cord.”",
      "“A meter at the far end read ninety-six volts instead of one hundred and twenty.”",
    ],
    clears: [
      "Burned out bulbs: “Every bulb still lights.”",
      "A loose connection: “None of them flicker.”",
    ],
    explain: "Plugging the strand into a closer outlet restored the brightness. Because a second extension cord made the run one hundred and ten feet, the voltage dropped to ninety-six by the far end.",
  },
  {
    t: "The Case of the Fast Clock",
    tag: "⏰ clock",
    story: "The gym clock gained four minutes a week all through October. The battery tested full. The hands move freely. Nothing rubs the face. This clock is not an ordinary battery clock. It syncs each night to a radio signal from a national time station. The gym's new scoreboard was installed in September on the wall directly below it. Electronic equipment can emit radio noise that blocks a weak time signal. A clock that cannot hear the signal falls back on its own timing, which drifts. Moved to the opposite wall, the clock has kept perfect time since.",
    q: "Why was the clock gaining time?",
    s: [
      { who: "📻 Radio noise from the scoreboard", why: "the scoreboard went in below it in September" },
      { who: "🔋 The battery", why: "the battery tested full" },
      { who: "⚙️ Sticking hands", why: "the hands move freely and nothing rubs" },
    ],
    who: 0,
    answer: "The scoreboard blocked the clock's nightly time signal.",
    proof: [
      "“The gym's new scoreboard was installed in September on the wall directly below it.”",
      "“Electronic equipment can emit radio noise that blocks a weak time signal.”",
    ],
    clears: [
      "The battery: “The battery tested full.”",
      "Sticking hands: “The hands move freely.”",
    ],
    explain: "Moved to the opposite wall, the clock has kept perfect time since. Because the new scoreboard sat directly below it and emitted radio noise, the clock could not hear its nightly signal and drifted on its own timing.",
  },
  {
    t: "The Case of the Gray Snow",
    tag: "⛄ snow",
    story: "The snow along the school's front walk turned gray within two days. The snow on the playing field stayed white. Nobody salted the front walk. No vehicles drive on it. The front walk runs twelve feet from the bus lane, where fourteen buses idle each morning. Diesel engines put fine soot into the air, and soot settles downwind. The prevailing wind here blows from the bus lane toward the walk. Snow on the field, two hundred feet upwind, is still white. A paper towel wiped across the gray snow came away black.",
    q: "Why did only the front walk's snow turn gray?",
    s: [
      { who: "🚌 Soot from the idling buses", why: "the towel came away black and the walk is downwind" },
      { who: "🧂 Salt", why: "nobody salted the front walk" },
      { who: "🚗 Vehicles on the walk", why: "no vehicles drive on it" },
    ],
    who: 0,
    answer: "Soot from the idling buses settled on the snow.",
    proof: [
      "“Diesel engines put fine soot into the air, and soot settles downwind.”",
      "“The prevailing wind here blows from the bus lane toward the walk.”",
    ],
    clears: [
      "Salt: “Nobody salted the front walk.”",
      "Vehicles: “No vehicles drive on it.”",
    ],
    explain: "A paper towel wiped across the gray snow came away black, and the field two hundred feet upwind is still white. Because fourteen buses idle twelve feet upwind, their soot settled on the walk.",
  },
  {
    t: "The Case of the Untouched Feeder",
    tag: "🐦 feeder",
    story: "The school bird feeder went from busy to empty of birds in one week, though the seed level has not dropped. No cat has been seen in the yard. The feeder hangs in the same spot it has hung for two years. A window-washing crew hung reflective film on the glass behind it on Monday. Birds avoid a feeder when they cannot see a clear escape route. Reflections can look like open sky. Three birds struck the glass that week. The groundskeeper moved the feeder nine feet to the open side of the yard. Birds returned to it within two days.",
    q: "Why did the birds stop coming?",
    s: [
      { who: "🪟 The reflective film", why: "three birds struck the glass that week" },
      { who: "🐈 A cat", why: "no cat has been seen in the yard" },
      { who: "📍 A new location", why: "the feeder hangs in the same spot" },
    ],
    who: 0,
    answer: "The reflective film made the birds avoid the feeder.",
    proof: [
      "“A window-washing crew hung reflective film on the glass behind it on Monday.”",
      "“Three birds struck the glass that week.”",
    ],
    clears: [
      "A cat: “No cat has been seen in the yard.”",
      "A new location: “The feeder hangs in the same spot it has hung for two years.”",
    ],
    explain: "Birds returned within two days of moving the feeder nine feet. Because the new reflective film made the glass look like open sky, birds struck it and then avoided the feeder entirely.",
  },
  {
    t: "The Case of the Separating Cocoa",
    tag: "☕ cocoa",
    story: "Half the cups at the winter party had a thick layer of powder at the bottom and half did not. Every cup was poured from the same pot. The pot was stirred well at the start. The cups with powder were all poured in the last five minutes. The pot sat on a cold counter for twenty minutes before the final pours. Cocoa powder is denser than milk and sinks whenever the liquid stops moving. Warm liquid keeps moving longer than cool liquid does. The powder layer was the same thickness in every affected cup.",
    q: "Why did half the cups have powder at the bottom?",
    s: [
      { who: "🥄 Powder settling in the cooling pot", why: "the cups with powder were poured last" },
      { who: "📦 Bad mix", why: "every cup was poured from the same pot" },
      { who: "🥤 The cups", why: "the powder layer was the same in every affected cup" },
    ],
    who: 0,
    answer: "The powder sank in the pot as it cooled.",
    proof: [
      "“Cocoa powder is denser than milk and sinks whenever the liquid stops moving.”",
      "“The pot sat on a cold counter for twenty minutes before the final pours.”",
    ],
    clears: [
      "Bad mix: “Every cup was poured from the same pot.”",
      "The cups: “The powder layer was the same thickness in every affected cup.”",
    ],
    explain: "The cups with powder were all poured in the last five minutes. Because the pot cooled on a cold counter and the liquid stopped moving, the denser powder sank and the last cups got it.",
  },
  {
    t: "The Case of the Smudged Valentines",
    tag: "💌 valentine",
    story: "Twenty valentines came out of the class printer with smudged ink along the right edge. The printer's test page printed clean. The toner is three-quarters full. The smudge appears only on card stock, not on plain paper. Card stock is thicker and travels a tighter curve through the paper path. A roller at the exit had a flat spot worn into it, which drags on a thick sheet. Plain paper is thin enough to pass the flat spot without touching. Replacing the roller cleared the smudge on card stock immediately. The smudge was always in the same place on the page.",
    q: "What smudged the valentines?",
    s: [
      { who: "⚙️ A worn exit roller", why: "the smudge appears only on thick card stock" },
      { who: "🖨️ Low toner", why: "the toner is three-quarters full" },
      { who: "📄 A bad batch of paper", why: "the smudge was always in the same place" },
    ],
    who: 0,
    answer: "A worn roller dragged on the thick card stock.",
    proof: [
      "“A roller at the exit had a flat spot worn into it, which drags on a thick sheet.”",
      "“The smudge appears only on card stock, not on plain paper.”",
    ],
    clears: [
      "Low toner: “The toner is three-quarters full.”",
      "A bad batch: “The smudge was always in the same place on the page.”",
    ],
    explain: "Replacing the roller cleared the smudge immediately. Because card stock travels a tighter curve and the exit roller had a flat spot, the roller dragged on thick sheets and not on thin ones.",
  },
  {
    t: "The Case of the Overflowing Volcano",
    tag: "🌋 volcano",
    story: "Theo's model volcano erupted so hard at the fair that it emptied in four seconds. It soaked the table. At home the same model had bubbled for half a minute. He used the same amounts of baking soda and vinegar both times. At home he had added the vinegar through a narrow funnel over twenty seconds. At the fair he poured it straight in from the cup. A reaction that gets all its ingredients at once releases all its gas at once. The crater opening is the same size it always was. Nothing about the recipe changed between the two runs.",
    q: "Why did the volcano empty in four seconds?",
    s: [
      { who: "🥤 Pouring it all at once", why: "all the ingredients met at the same moment" },
      { who: "🧪 Different amounts", why: "he used the same amounts both times" },
      { who: "🗻 The crater size", why: "the crater opening is the same size" },
    ],
    who: 0,
    answer: "Pouring the vinegar all at once released the gas at once.",
    proof: [
      "“At home he had added the vinegar through a narrow funnel over twenty seconds.”",
      "“A reaction that gets all its ingredients at once releases all its gas at once.”",
    ],
    clears: [
      "Amounts: “He used the same amounts of baking soda and vinegar both times.”",
      "The crater: “The crater opening is the same size it always was.”",
    ],
    explain: "Nothing about the recipe changed between the two runs. Because he poured the vinegar straight in instead of through a funnel over twenty seconds, the whole reaction happened at once.",
  },
  {
    t: "The Case of the Green Crown",
    tag: "👑 crown",
    story: "The play's brass crown left a green mark on Lena's forehead after the Saturday show. It left no mark after Friday's. The crown was not cleaned or painted between the shows. Brass contains copper, and copper reacts with acid to form a green compound. Sweat is mildly acidic, and the Saturday show ran under full stage lights with the heating on. Friday's dress rehearsal ran in a cool room with the work lights only. Lena wore the same crown both nights. Two other actors in brass circlets had green marks on Saturday as well. Nobody had a mark on Friday.",
    q: "What made the green mark?",
    s: [
      { who: "💦 Sweat under the hot stage lights", why: "two other actors in brass had marks on Saturday" },
      { who: "🎨 Paint on the crown", why: "the crown was not cleaned or painted between shows" },
      { who: "👑 A different crown", why: "Lena wore the same crown both nights" },
    ],
    who: 0,
    answer: "Sweat reacted with the copper in the brass.",
    proof: [
      "“Brass contains copper, and copper reacts with acid to form a green compound.”",
      "“Sweat is mildly acidic, and the Saturday show ran under full stage lights with the heating on.”",
    ],
    clears: [
      "Paint: “The crown was not cleaned or painted between the shows.”",
      "A different crown: “Lena wore the same crown both nights.”",
    ],
    explain: "Two other actors in brass circlets had green marks on Saturday and nobody did on Friday. Because the Saturday show was hot and sweat is mildly acidic, the sweat reacted with the copper in the brass.",
  },
  {
    t: "The Case of the Sour Piano",
    tag: "🎹 piano",
    story: "The class piano sounded fine in June and noticeably out of tune in September. The tuner found that the strings in the middle two octaves had all gone flat by about the same amount. Nobody played it over the summer. The lid stayed closed and locked. A piano's strings pull on a wooden frame with about eighteen tons of total tension. Wood swells when the air is damp and shrinks when it dries. The school's humidity ran at seventy percent all summer with the ventilation off. As the soundboard swelled, the strings stretched and their pitch dropped. The tuner pointed at the whole instrument, not any one string.",
    q: "Why did the piano go out of tune?",
    s: [
      { who: "💧 Summer humidity", why: "the strings all went flat by about the same amount" },
      { who: "🎹 Heavy playing", why: "nobody played it over the summer" },
      { who: "🪢 A broken string", why: "the tuner pointed at the whole instrument" },
    ],
    who: 0,
    answer: "Summer humidity swelled the soundboard and flattened the strings.",
    proof: [
      "“The school's humidity ran at seventy percent all summer with the ventilation off.”",
      "“As the soundboard swelled, the strings stretched and their pitch dropped.”",
    ],
    clears: [
      "Playing: “Nobody played it over the summer.”",
      "A broken string: “The tuner pointed at the whole instrument, not any one string.”",
    ],
    explain: "All the strings in two octaves went flat by about the same amount. Because summer humidity ran at seventy percent, the wooden soundboard swelled, the strings stretched over it, and their pitch dropped together.",
  },
  {
    t: "The Case of the Spinning Kite",
    tag: "🪁 kite",
    story: "Priya's box kite spun in tight circles instead of climbing. The sail has no tears. The frame is square. Her bridle, the short line that joins the kite to the flying line, is tied at two points. One of those knots had slipped about two inches toward the nose. A bridle sets the angle the kite meets the wind, and the two sides must match. When one side is shorter, the kite presents an uneven face and turns. She moved the knot back to its mark and the kite climbed straight. Her brother's identical kite flew normally in the same wind.",
    q: "Why did the kite spin instead of climbing?",
    s: [
      { who: "🪢 A slipped bridle knot", why: "one knot had slipped two inches toward the nose" },
      { who: "🕳️ A torn sail", why: "the sail has no tears" },
      { who: "🌬️ The wind", why: "an identical kite flew normally in the same wind" },
    ],
    who: 0,
    answer: "A slipped bridle knot gave the kite an uneven face.",
    proof: [
      "“One of those knots had slipped about two inches toward the nose.”",
      "“When one side is shorter, the kite presents an uneven face and turns.”",
    ],
    clears: [
      "A torn sail: “The sail has no tears.”",
      "The wind: “Her brother's identical kite flew normally in the same wind.”",
    ],
    explain: "The kite climbed straight once the knot went back to its mark. Because one bridle knot had slipped two inches, the two sides no longer matched and the kite met the wind unevenly.",
  },
  {
    t: "The Case of the Four-Leaf Patch",
    tag: "☘️ shamrock",
    story: "One corner of the school's clover patch produces four-leaf clovers. The rate is nearly thirty times the usual one. A fourth leaf is a rare variation, normally appearing in about one plant in five thousand. Clover spreads by runners, so a patch can be one plant repeated many times. The lucky corner traces back to a single original plant with the variation. Mowing has never reached that corner, which sits inside a fence angle. Plants elsewhere in the lawn are mowed and reseeded from a bag each spring. A genetics class tested leaves from the corner and from three meters away. The corner samples matched each other and not the others.",
    q: "Why does one corner produce so many four-leaf clovers?",
    s: [
      { who: "🧬 One original plant spreading by runners", why: "the corner samples matched each other" },
      { who: "🌱 Reseeding", why: "plants elsewhere are reseeded from a bag" },
      { who: "✂️ Mowing", why: "mowing has never reached that corner" },
    ],
    who: 0,
    answer: "The corner is one plant with the variation, spread by runners.",
    proof: [
      "“Clover spreads by runners, so a patch can be one plant repeated many times.”",
      "“The corner samples matched each other and not the others.”",
    ],
    clears: [
      "Reseeding: “Plants elsewhere in the lawn are mowed and reseeded from a bag each spring.”",
      "Mowing: “Mowing has never reached that corner, which sits inside a fence angle.”",
    ],
    explain: "The corner samples matched each other and not the ones three meters away. Because clover spreads by runners, the whole lucky corner is one original plant with the four-leaf variation, repeated over and over.",
  },
  {
    t: "The Case of the Basement Puddle",
    tag: "🌧️ puddle",
    story: "A puddle forms on the band room floor every summer and never in winter. The room is below ground on three sides. The roof was replaced two years ago and does not leak. The pipes overhead were pressure-tested in May and held. The puddle sits directly under a cold water pipe that runs along the ceiling. Summer air in the room reaches seventy-eight degrees with sixty-five percent humidity. The pipe's surface stays at fifty-four degrees year round. Water vapor condenses on any surface colder than the dew point of the surrounding air. Wrapping the pipe in foam insulation ended the puddle.",
    q: "Where does the summer puddle come from?",
    s: [
      { who: "💧 Condensation on the cold pipe", why: "the pipe stays at fifty-four degrees year round" },
      { who: "🏠 A roof leak", why: "the roof was replaced and does not leak" },
      { who: "🚰 A leaking pipe", why: "the pipes were pressure-tested in May and held" },
    ],
    who: 0,
    answer: "Water condensed on the cold pipe and dripped.",
    proof: [
      "“The puddle sits directly under a cold water pipe that runs along the ceiling.”",
      "“Water vapor condenses on any surface colder than the dew point of the surrounding air.”",
    ],
    clears: [
      "A roof leak: “The roof was replaced two years ago and does not leak.”",
      "A leaking pipe: “The pipes overhead were pressure-tested in May and held.”",
    ],
    explain: "Wrapping the pipe in foam insulation ended the puddle. Because the pipe stays at fifty-four degrees while summer air in the room is seventy-eight and humid, water vapor condensed on it and dripped.",
  },
  {
    t: "The Case of the Bare Row",
    tag: "🌻 garden",
    story: "The school garden's six rows were planted the same day with seed from one packet. Five rows came up thick. The sixth is nearly empty. The empty row is the one nearest the brick wall. The rows all got the same water from one hose. A soil test showed the sixth row at pH 8.4 while the others read 6.6. Beans will not germinate well in soil much above pH 7.5. Old mortar between bricks releases lime, and lime raises soil pH. The wall was repointed with new mortar in April, a month before planting. The few plants that did come up in row six are small and yellow.",
    q: "Why did one row fail to come up?",
    s: [
      { who: "🧱 Lime from the new mortar", why: "row six reads pH 8.4 against 6.6 elsewhere" },
      { who: "🌱 Bad seed", why: "all six rows used seed from one packet" },
      { who: "💧 Water", why: "the rows all got the same water from one hose" },
    ],
    who: 0,
    answer: "Lime from the new mortar raised that row's pH too high.",
    proof: [
      "“A soil test showed the sixth row at pH 8.4 while the others read 6.6.”",
      "“Old mortar between bricks releases lime, and lime raises soil pH.”",
    ],
    clears: [
      "Bad seed: “planted the same day with seed from one packet.”",
      "Water: “The rows all got the same water from one hose.”",
    ],
    explain: "Row six is the one nearest the brick wall, repointed a month before planting. Because new mortar releases lime and lime raises pH, that row read 8.4 and beans will not germinate well above 7.5.",
  },
  {
    t: "The Case of the Cold Eggs",
    tag: "🪺 eggs",
    story: "The class incubator held twelve eggs and nine hatched on day twenty-one. The three that did not were all in the back left corner of the tray. The incubator's thermometer sat in the front right corner and read ninety-nine degrees all month. A second thermometer placed in the back left corner read ninety-four. The heating element is mounted on the front wall of the box. Chick embryos need a steady ninety-nine to one hundred degrees to develop. Five degrees below that stops development without obviously spoiling the egg. The tray was never turned. Eggs never moved between positions. All twelve eggs came from the same farm on the same day.",
    q: "Why did three eggs fail to hatch?",
    s: [
      { who: "🌡️ A cold corner of the incubator", why: "the back left corner read ninety-four" },
      { who: "🥚 Bad eggs", why: "all twelve came from the same farm on the same day" },
      { who: "⏲️ Not enough days", why: "nine hatched on day twenty-one" },
    ],
    who: 0,
    answer: "The back left corner was five degrees too cold.",
    proof: [
      "“A second thermometer placed in the back left corner read ninety-four.”",
      "“Five degrees below that stops development without obviously spoiling the egg.”",
    ],
    clears: [
      "Bad eggs: “All twelve eggs came from the same farm on the same day.”",
      "Not enough days: “nine hatched on day twenty-one.”",
    ],
    explain: "Nine eggs hatched on schedule and the three that did not were all in one corner. Because the heating element is on the front wall and the back left corner read ninety-four, those three never got warm enough to develop.",
  },
  {
    t: "The Case of the Vanishing Recycling",
    tag: "🌎 earth",
    story: "The school's recycling weight dropped by half in October while the trash weight rose by the same amount. The number of bins did not change. The custodial staff did not change. In September the district replaced every bin lid with a new design. The new opening is a four-inch round hole. A flattened cereal box and a milk jug will not fit through a four-inch hole. Students who cannot fit an item into the recycling bin put it in the trash. The cafeteria's recycling, which uses the old open-top bins, did not drop at all. Nobody told the students the lids had changed.",
    q: "Why did the recycling weight drop by half?",
    s: [
      { who: "🕳️ The new four-inch lids", why: "the cafeteria's open-top bins did not drop" },
      { who: "🗑️ Fewer bins", why: "the number of bins did not change" },
      { who: "🧹 The custodial staff", why: "the custodial staff did not change" },
    ],
    who: 0,
    answer: "The new lids were too small for recyclable items.",
    proof: [
      "“A flattened cereal box and a milk jug will not fit through a four-inch hole.”",
      "“Students who cannot fit an item into the recycling bin put it in the trash.”",
    ],
    clears: [
      "Fewer bins: “The number of bins did not change.”",
      "The staff: “The custodial staff did not change.”",
    ],
    explain: "The cafeteria's old open-top bins did not drop at all. Because the new lids have only a four-inch round hole, boxes and jugs would not fit and students put them in the trash instead.",
  },
  {
    t: "The Case of the Dark Half",
    tag: "📷 camera",
    story: "Every photograph from the field trip has a dark band across the bottom third. The lens is clean and the battery was full. The band appears on indoor and outdoor shots alike. A camera's shutter is two curtains that cross the sensor in sequence. One opens and one closes behind it. At fast shutter speeds they travel as a moving slit rather than opening fully. If the second curtain sticks, part of the frame receives less light than the rest. A repair shop found the second curtain dragging on a bent guide rail. Shots taken at slow speeds that day came out evenly lit.",
    q: "What made the dark band?",
    s: [
      { who: "⚙️ A sticking shutter curtain", why: "the second curtain drags on a bent guide rail" },
      { who: "🧼 A dirty lens", why: "the lens is clean" },
      { who: "☀️ The lighting", why: "the band appears indoors and outdoors alike" },
    ],
    who: 0,
    answer: "A sticking shutter curtain blocked part of each frame.",
    proof: [
      "“If the second curtain sticks, part of the frame receives less light than the rest.”",
      "“A repair shop found the second curtain dragging on a bent guide rail.”",
    ],
    clears: [
      "A dirty lens: “The lens is clean”",
      "The lighting: “The band appears on indoor and outdoor shots alike.”",
    ],
    explain: "Shots taken at slow speeds came out evenly lit. Because the second curtain dragged on a bent rail, it lagged at fast speeds and left part of every frame underexposed.",
  },
  {
    t: "The Case of the One-Sided Plant",
    tag: "🌱 plant",
    story: "A classroom spider plant has full growth on its left side and almost none on its right. Both sides get the same water from the same can. The pot has never been turned. The right side faces a window with a heating vent directly beneath it. Hot dry air from the vent blows up across that side for six hours a day. Spider plants lose water through their leaves faster than their roots can replace it. Dry moving air makes that worse. The leaf tips on the right side are brown and crisp. The left side's tips are green. Turning the pot halfway produced new growth on the bare side within a month.",
    q: "Why is one side of the plant bare?",
    s: [
      { who: "🔥 Hot dry air from the vent", why: "the right-side leaf tips are brown and crisp" },
      { who: "💧 Water", why: "both sides get the same water from the same can" },
      { who: "🪴 A one-sided pot", why: "turning the pot produced new growth" },
    ],
    who: 0,
    answer: "Hot dry air from the vent dried the right side.",
    proof: [
      "“The right side faces a window with a heating vent directly beneath it.”",
      "“Hot dry air from the vent blows up across that side for six hours a day.”",
    ],
    clears: [
      "Water: “Both sides get the same water from the same can.”",
      "The pot: “Turning the pot halfway produced new growth on the bare side within a month.”",
    ],
    explain: "The right side's leaf tips are brown and crisp while the left side's are green. Because hot dry air blows across that side six hours a day, the leaves lost water faster than the roots could replace it.",
  },
  {
    t: "The Case of the Icy Ice Cream",
    tag: "🍦 icecream",
    story: "The fifth grade's homemade ice cream came out full of hard ice crystals instead of smooth. The recipe and the ingredients matched last year's exactly. The mixture froze in the school freezer, which was set to minus ten degrees. Last year the class used an ice-and-salt bag, which holds about fourteen degrees. Slow freezing lets water molecules join into large crystals. Fast freezing at a very low temperature should have made small crystals instead. But the freezer cycles its compressor on and off. The mix partly thawed and refroze nine times overnight. Each thaw and refreeze builds bigger crystals than the one before.",
    q: "Why was the ice cream full of crystals?",
    s: [
      { who: "🔁 Thawing and refreezing", why: "the mix refroze nine times overnight" },
      { who: "📖 The recipe", why: "the recipe and ingredients matched last year's" },
      { who: "🧊 Freezing too fast", why: "fast freezing should have made small crystals" },
    ],
    who: 0,
    answer: "The mix thawed and refroze nine times, building big crystals.",
    proof: [
      "“The mix partly thawed and refroze nine times overnight.”",
      "“Each thaw and refreeze builds bigger crystals than the one before.”",
    ],
    clears: [
      "The recipe: “The recipe and the ingredients matched last year's exactly.”",
      "Freezing too fast: “Fast freezing at a very low temperature should have made small crystals instead.”",
    ],
    explain: "The recipe was unchanged and a very cold freezer should have made small crystals. Because the compressor cycled on and off, the mix thawed and refroze nine times, and each cycle built bigger crystals.",
  },
  {
    t: "The Case of the Faded Ribbons",
    tag: "🎗️ ribbon",
    story: "Half the field day ribbons came out of storage faded nearly white. The other half kept their color. All of them were printed in the same batch three years ago. They were stored in one cabinet in two boxes. The faded ones were in the box on the top shelf, next to a south-facing window with no blind. The others sat in a box on the bottom shelf in shadow. Sunlight breaks down the dye molecules in colored cloth over time. The faded ribbons are palest on the side that faced the window. The cabinet door has a glass panel in its upper half.",
    q: "Why did half the ribbons fade?",
    s: [
      { who: "☀️ Sunlight through the glass panel", why: "the faded ones are palest on the window side" },
      { who: "🖨️ A bad print batch", why: "all were printed in the same batch" },
      { who: "💧 Damp in the cabinet", why: "the others sat in the same cabinet in shadow" },
    ],
    who: 0,
    answer: "Sunlight faded the ribbons on the top shelf.",
    proof: [
      "“The faded ones were in the box on the top shelf, next to a south-facing window with no blind.”",
      "“Sunlight breaks down the dye molecules in colored cloth over time.”",
    ],
    clears: [
      "A bad batch: “All of them were printed in the same batch three years ago.”",
      "Damp: “The others sat in a box on the bottom shelf in shadow.”",
    ],
    explain: "The faded ribbons are palest on the side that faced the window, and the cabinet door has a glass panel in its upper half. Because the top shelf sat in sunlight, the dye broke down on those ribbons only.",
  },
  {
    t: "The Case of the Sinking Balloons",
    tag: "🎈 balloons",
    story: "The helium balloons were floating at four o'clock. By nine the next morning they rested on the floor. None of them popped and every knot held. The latex balloons sagged while the foil ones beside them still floated. Helium atoms are small enough to pass between the molecules of a latex wall. Foil balloons have a metal layer with no gaps that size. A balloon that loses helium also loses lift and sinks before it visibly shrinks. The room temperature stayed the same all night. The party store had filled every balloon from the same tank.",
    q: "Why did only some balloons sink?",
    s: [
      { who: "💨 Helium escaping through the latex", why: "the foil ones beside them still floated" },
      { who: "📌 A leak or a pop", why: "none of them popped and every knot held" },
      { who: "🌡️ The temperature", why: "the room temperature stayed the same all night" },
    ],
    who: 0,
    answer: "Helium passed out through the latex walls.",
    proof: [
      "“Helium atoms are small enough to pass between the molecules of a latex wall.”",
      "“Foil balloons have a metal layer with no gaps that size.”",
    ],
    clears: [
      "A leak or a pop: “None of them popped and every knot held.”",
      "The temperature: “The room temperature stayed the same all night.”",
    ],
    explain: "The foil balloons filled from the same tank still floated. Because helium atoms are small enough to pass through latex but not through foil, only the latex balloons lost their lift.",
  },
];

gradeMysteries(5, CASES);
console.log(`grade 5: ${CASES.length} cases written`);
