/**
 * Grade 6 mysteries: thirty-six cases, one a week, on the same thirty-six
 * themes as every other grade. Week 9 is the pumpkin case in every room in
 * the building; only the reading level and the case itself change.
 *
 * Held to the band in scripts/reading-mystery-plan.json: 106-152 words, mean
 * sentence no longer than 15 words, four suspects, and at least two proof
 * quotes that are really in the story.
 *
 * The step up from grade 5 is the kind of thinking the solution asks for. A
 * grade 5 case gives a fact and a rule and asks the student to put them
 * together. A grade 6 case gives a measurement as well, so the answer has to
 * survive a number: eleven missing atlases and eleven on the old shelf, a
 * tyre that loses the same two pounds every cold morning, a thermometer that
 * reads the same in both halves of the room. The wrong answers are not silly
 * here. Each one is a reasonable guess that some sentence in the story rules
 * out, which is why every case carries three clearings rather than one.
 *
 *   bun run scripts/mysteries/g6.src.mjs && bun run scripts/merge-mysteries.mjs
 *   bun run scripts/check-mysteries.mjs
 */
import { gradeMysteries } from "./build.mjs";

const CASES = [
  {
    t: "The Case of the Misfiled Atlas",
    tag: "📚 library",
    story:
      "The reference desk logged eleven atlases missing in March. All eleven had been on the shelf in January. None of them were checked out that winter. The library changed its labels in February and moved atlases out of 912. A volunteer refiled returns on two Saturdays in March. Taped to her cart was the January shelf guide. That guide still listed every atlas at 912. In March the 912 shelf held eleven atlases the catalog placed elsewhere. The missing list and the 912 shelf matched eleven for eleven. Every spine still carried its new geography label underneath. Nothing had left the building and no record was altered. The desk had counted the shelf, not the catalog.",
    q: "Where did the eleven atlases go?",
    s: [
      { who: "🗂️ The old January shelf guide", why: "still listed every atlas at 912" },
      { who: "📕 Winter checkouts", why: "none of them were checked out that winter" },
      { who: "🚪 Somebody taking them", why: "nothing had left the building" },
      { who: "💻 A catalog error", why: "no record was altered" },
    ],
    who: 0,
    answer: "A volunteer refiled the atlases at 912 using the old guide.",
    proof: [
      "“Taped to her cart was the January shelf guide.”",
      "“That guide still listed every atlas at 912.”",
    ],
    clears: [
      "Checkouts: “None of them were checked out that winter.”",
      "Somebody taking them: “Nothing had left the building and no record was altered.”",
      "A catalog error: “no record was altered.”",
    ],
    explain:
      "The count is what settles it. Because the eleven the catalog called missing are the same eleven sitting on 912, nothing was lost at all — the volunteer was working from a guide the library had already replaced.",
  },
  {
    t: "The Case of the Sweating Thermos",
    tag: "🥪 lunchbox",
    story:
      "Dion's sandwich came out of his lunchbox soaked every day for a week. The bread was wet only on the side facing his thermos. His lunchbox had no holes and the lid sealed shut. The thermos held ice water and never leaked a drop. He opened it at the sink each morning and the outside came up dry. By lunch the outside of the thermos ran with water. Air holds water vapor, and cold surfaces pull that vapor back into drops. The classroom was warm and humid all week from the radiator. The thermos sat against the sandwich bag inside the closed box. Nothing else in the lunchbox came out wet all week.",
    q: "What soaked the bread?",
    s: [
      { who: "💧 Water condensing on the cold thermos", why: "by lunch the outside of the thermos ran with water" },
      { who: "🕳️ A hole in the lunchbox", why: "his lunchbox had no holes and the lid sealed shut" },
      { who: "🥤 A leaking thermos", why: "the thermos held ice water and never leaked a drop" },
      { who: "🚰 Water from the sink", why: "the outside came up dry" },
    ],
    who: 0,
    answer: "Vapor condensed on the cold thermos and wet the bread.",
    proof: [
      "“Air holds water vapor, and cold surfaces pull that vapor back into drops.”",
      "“The thermos sat against the sandwich bag inside the closed box.”",
    ],
    clears: [
      "A hole in the lunchbox: “His lunchbox had no holes and the lid sealed shut.”",
      "A leaking thermos: “The thermos held ice water and never leaked a drop.”",
      "Water from the sink: “the outside came up dry.”",
    ],
    explain:
      "No water got in and none got out. Because warm humid air meets a thermos full of ice water, the water on the bread came out of the air itself, on the one side touching the cold.",
  },
  {
    t: "The Case of the Shorter Pencils",
    tag: "✏️ pencil",
    story:
      "Room 14 measured its pencils every Friday as a data lesson. In October the class lost an average of nine millimeters of pencil a week. In November that number jumped to twenty-six. The pencils were the same brand from the same box. Attendance held steady and nobody reported a pencil missing. The old sharpener broke on the first of November. The new one has a deeper cone and a wider blade. Ms. Reyes counted turns and found both sharpeners took about four. A single turn in the new sharpener removes nearly three times the wood. Nobody was sharpening more often than they had in October. The November jump began the week the new sharpener arrived.",
    q: "Why did the pencils get shorter so much faster?",
    s: [
      { who: "🔪 The new sharpener's deeper cone", why: "a single turn removes nearly three times the wood" },
      { who: "🙋 Sharpening more often", why: "nobody was sharpening more often than in October" },
      { who: "📦 A different brand of pencil", why: "the same brand from the same box" },
      { who: "🎒 Pencils going missing", why: "nobody reported a pencil missing" },
    ],
    who: 0,
    answer: "The new sharpener takes far more wood off each turn.",
    proof: [
      "“The new one has a deeper cone and a wider blade.”",
      "“A single turn in the new sharpener removes nearly three times the wood.”",
    ],
    clears: [
      "Sharpening more often: “Nobody was sharpening more often than they had in October.”",
      "A different brand: “The pencils were the same brand from the same box.”",
      "Pencils going missing: “nobody reported a pencil missing.”",
    ],
    explain:
      "Same pencils, same number of turns. Because the new sharpener's cone is deeper, each of those four turns eats about three times the wood, which is the jump from nine millimeters to twenty-six.",
  },
  {
    t: "The Case of the Apple That Stayed White",
    tag: "🍎 apple",
    story:
      "Six apple halves sat on a tray for the science fair. Five turned brown within an hour and one stayed white all afternoon. Every half came off the same apple and was cut with the same knife. All six sat side by side in the same light and air. A cut apple browns because an enzyme in the flesh reacts with oxygen. Acid slows that enzyme down and can stop it almost completely. Priya squeezed lemon over one half before she set the tray out. The lemon wedge was still on her desk at the end of the day. Nothing was covering the white half and no half was refrigerated.",
    q: "Why did one apple half stay white?",
    s: [
      { who: "🍋 Lemon juice slowing the enzyme", why: "acid slows that enzyme down" },
      { who: "🌡️ Being kept cold", why: "no half was refrigerated" },
      { who: "🍏 A different apple", why: "every half came off the same apple" },
      { who: "🧻 Something covering it", why: "nothing was covering the white half" },
    ],
    who: 0,
    answer: "Lemon juice kept the enzyme in that apple half from browning.",
    proof: [
      "“Acid slows that enzyme down and can stop it almost completely.”",
      "“Priya squeezed lemon over one half before she set the tray out.”",
    ],
    clears: [
      "Being kept cold: “no half was refrigerated.”",
      "A different apple: “Every half came off the same apple and was cut with the same knife.”",
      "Something covering it: “Nothing was covering the white half and no half was refrigerated.”",
    ],
    explain:
      "Five of six browned under identical conditions. Because the only difference was acid on one half, and acid is what stops the browning enzyme, the lemon is the whole answer.",
  },
  {
    t: "The Case of the Morning Flat Tire",
    tag: "🚲 bike",
    story:
      "Marco's front tire read low every cold morning and fine every afternoon. He pumped it to forty pounds on Monday and it read thirty-two at dawn. By three o'clock the same tire read thirty-nine. He dunked the tube in a bucket twice and no bubbles came up. The valve held when he pressed soapy water around it. Gas takes up less room when it gets colder and presses out less hard. The shed was thirty-eight degrees at dawn and seventy-one in the afternoon. His rear tire, pumped the same morning, swung by the same amount. A tire losing air does not come back up on its own.",
    q: "Why was the tire low only in the mornings?",
    s: [
      { who: "🌡️ Cold air taking up less room", why: "gas presses out less hard when colder" },
      { who: "🕳️ A slow leak in the tube", why: "no bubbles came up in the bucket" },
      { who: "🔧 A bad valve", why: "the valve held when he pressed soapy water around it" },
      { who: "⚖️ Too much weight on the front", why: "his rear tire swung by the same amount" },
    ],
    who: 0,
    answer: "Cold air in the tire pressed out less hard at dawn.",
    proof: [
      "“Gas takes up less room when it gets colder and presses out less hard.”",
      "“The shed was thirty-eight degrees at dawn and seventy-one in the afternoon.”",
    ],
    clears: [
      "A slow leak: “He dunked the tube in a bucket twice and no bubbles came up.”",
      "A bad valve: “The valve held when he pressed soapy water around it.”",
      "Too much weight: “His rear tire, pumped the same morning, swung by the same amount.”",
    ],
    explain:
      "The number goes down and then comes back, which no leak does. Because the shed swings more than thirty degrees between dawn and afternoon, the air inside is simply pressing out less hard when it is cold.",
  },
  {
    t: "The Case of the Cloudy Fishtank",
    tag: "🐠 fishtank",
    story:
      "The classroom tank ran clear for two years and went cloudy in four days. Nobody added a fish and nobody changed the food. The water tested high for ammonia for the first time ever. A healthy tank carries bacteria in the filter that eat ammonia as fast as it appears. Those bacteria live in the filter sponge, not in the water. Ms. Oyelaran replaced the whole filter cartridge on Sunday, sponge and all. The new cartridge came sealed and sterile out of the box. The cloudiness began on Wednesday and the ammonia climbed all week. The heater, the light and the pump were all working normally.",
    q: "Why did the tank go cloudy?",
    s: [
      { who: "🧽 The new sterile filter cartridge", why: "the bacteria live in the filter sponge" },
      { who: "🐟 A new fish", why: "nobody added a fish" },
      { who: "🍚 Overfeeding", why: "nobody changed the food" },
      { who: "🔌 Broken equipment", why: "the heater, light and pump were all working normally" },
    ],
    who: 0,
    answer: "Replacing the filter sponge threw out the bacteria that eat ammonia.",
    proof: [
      "“Those bacteria live in the filter sponge, not in the water.”",
      "“Ms. Oyelaran replaced the whole filter cartridge on Sunday, sponge and all.”",
    ],
    clears: [
      "A new fish: “Nobody added a fish and nobody changed the food.”",
      "Overfeeding: “nobody changed the food.”",
      "Broken equipment: “The heater, the light and the pump were all working normally.”",
    ],
    explain:
      "Cleaning the filter is what broke the tank. Because the ammonia-eating bacteria lived in the sponge that went in the bin, nothing was left to eat the ammonia, and it climbed for the first time in two years.",
  },
  {
    t: "The Case of the Hum in Room 9",
    tag: "🔊 noise",
    story:
      "A low hum filled Room 9 every afternoon and nobody could find it. The hum never came before one o'clock and always stopped by three. Custodians checked the pipes, the vents and the lights and found nothing. The sound meter read the same with the lights off as with them on. Room 9 shares a wall with the gym, where a ceiling fan runs on a timer. That fan starts at one and shuts off at three every school day. A room will ring back at a sound when the sound matches the room's own pitch. The gym fan turns at a rate that matches Room 9 almost exactly. Nothing in Room 9 itself was switched on at one.",
    q: "What was making the hum?",
    s: [
      { who: "🌀 The gym fan on its timer", why: "that fan starts at one and shuts off at three" },
      { who: "💡 The overhead lights", why: "the meter read the same with the lights off" },
      { who: "🚿 The pipes", why: "custodians checked the pipes and found nothing" },
      { who: "🖥️ Something in Room 9", why: "nothing in Room 9 itself was switched on at one" },
    ],
    who: 0,
    answer: "The gym fan rang the room back at its own pitch.",
    proof: [
      "“A room will ring back at a sound when the sound matches the room's own pitch.”",
      "“The gym fan turns at a rate that matches Room 9 almost exactly.”",
    ],
    clears: [
      "The lights: “The sound meter read the same with the lights off as with them on.”",
      "The pipes: “Custodians checked the pipes, the vents and the lights and found nothing.”",
      "Something in Room 9: “Nothing in Room 9 itself was switched on at one.”",
    ],
    explain:
      "The hum keeps the fan's hours exactly. Because the fan's rate matches the pitch Room 9 rings at, a sound made next door gets amplified by the room itself, which is why nothing inside it had to be running.",
  },
  {
    t: "The Case of the Early Bare Tree",
    tag: "🍂 leaves",
    story:
      "Four maples line the school drive and one stood bare three weeks early. All four were planted the same spring and are the same height. A tree drops its leaves when it stops sending water and food to them. Drought and heat both start that shutdown sooner than cold does. The bare tree stands at the end of the row beside the asphalt lot. A thermometer in its bed read nine degrees warmer than the beds of the other three. The lot drains away from that bed instead of into it. The groundskeeper watered all four on the same schedule all summer. No insect damage or disease was found on any of the four.",
    q: "Why did one maple go bare early?",
    s: [
      { who: "🅿️ Heat and dryness beside the lot", why: "nine degrees warmer and the lot drains away from that bed" },
      { who: "🐛 Insects or disease", why: "no insect damage or disease was found" },
      { who: "🚿 Less watering", why: "the groundskeeper watered all four on the same schedule" },
      { who: "🌳 An older tree", why: "all four were planted the same spring" },
    ],
    who: 0,
    answer: "Heat and dry soil beside the asphalt shut that tree down early.",
    proof: [
      "“Drought and heat both start that shutdown sooner than cold does.”",
      "“A thermometer in its bed read nine degrees warmer than the beds of the other three.”",
    ],
    clears: [
      "Insects or disease: “No insect damage or disease was found on any of the four.”",
      "Less watering: “The groundskeeper watered all four on the same schedule all summer.”",
      "An older tree: “All four were planted the same spring and are the same height.”",
    ],
    explain:
      "Four identical trees, one different spot. Because the bed by the asphalt runs nine degrees hotter and sheds its water instead of holding it, that tree hit the heat-and-drought trigger weeks before the others.",
  },
  {
    t: "The Case of the Collapsed Pumpkin",
    tag: "🎃 pumpkin",
    story:
      "The front-step pumpkin stood firm on Friday and sat flat on Monday. No animal tracks, teeth marks or holes were found anywhere on it. The skin was unbroken and the stem was still attached. Saturday night dropped to twenty-six degrees and Sunday climbed back to fifty. Water swells as it freezes and pushes outward on whatever holds it. A pumpkin is mostly water held inside stiff cell walls. When those walls burst, the flesh goes soft and the shape gives way. The pumpkin felt heavy and wet rather than dried out and light. It had sat on that step through three warmer weeks without changing at all.",
    q: "What flattened the pumpkin?",
    s: [
      { who: "❄️ Water freezing inside the cells", why: "water swells as it freezes and pushes outward" },
      { who: "🐿️ An animal", why: "no animal tracks, teeth marks or holes were found" },
      { who: "🕳️ A hole letting it rot", why: "the skin was unbroken and the stem was still attached" },
      { who: "☀️ Drying out", why: "it felt heavy and wet rather than dried out" },
    ],
    who: 0,
    answer: "Water froze inside the pumpkin and burst its cell walls.",
    proof: [
      "“Saturday night dropped to twenty-six degrees and Sunday climbed back to fifty.”",
      "“When those walls burst, the flesh goes soft and the shape gives way.”",
    ],
    clears: [
      "An animal: “No animal tracks, teeth marks or holes were found anywhere on it.”",
      "A hole letting it rot: “The skin was unbroken and the stem was still attached.”",
      "Drying out: “The pumpkin felt heavy and wet rather than dried out and light.”",
    ],
    explain:
      "Three warm weeks changed nothing and one freezing night changed everything. Because the water inside swelled as it froze, it broke the cell walls from within, which is why the skin is whole and the pumpkin still flat.",
  },
  {
    t: "The Case of the One-Sided Footprints",
    tag: "👣 footprints",
    story:
      "Frost covered the field on Tuesday and footprints showed on only half of it. The prints ran in a clear line along the fence and stopped at the open grass. Whoever walked it did not turn around at that line. The fence throws shade over the north half until nearly noon. The open half takes direct sun from eight o'clock onward. Frost melts wherever the sun reaches it and holds wherever it does not. Both halves were frosted when the custodian opened up at seven. The groundskeeper walked the whole field at seven-fifteen on his usual round. By the time the class came out at ten, half the frost was gone.",
    q: "Why did the footprints stop halfway?",
    s: [
      { who: "☀️ Sun melting the frost on the open half", why: "frost melts wherever the sun reaches it" },
      { who: "🚶 Somebody turning around", why: "whoever walked it did not turn around at that line" },
      { who: "🧊 Only half the field frosting", why: "both halves were frosted at seven" },
      { who: "🏃 A second person", why: "the groundskeeper walked the whole field" },
    ],
    who: 0,
    answer: "The sun melted the frost that held the prints on the open half.",
    proof: [
      "“Frost melts wherever the sun reaches it and holds wherever it does not.”",
      "“By the time the class came out at ten, half the frost was gone.”",
    ],
    clears: [
      "Somebody turning around: “Whoever walked it did not turn around at that line.”",
      "Only half frosting: “Both halves were frosted when the custodian opened up at seven.”",
      "A second person: “The groundskeeper walked the whole field at seven-fifteen on his usual round.”",
    ],
    explain:
      "The prints did not stop; the frost did. Because the fence shades the north half until noon and the open half takes sun from eight, only the shaded prints were still there at ten.",
  },
  {
    t: "The Case of the Bus That Was Late Twice",
    tag: "🚌 bus",
    story:
      "Bus 12 ran on time all month except on Tuesdays and Thursdays. On those two days it reached school between nine and twelve minutes late. The same driver drove the same route at the same hour every day. The bus left the depot on time on all five mornings. Traffic counts on the route showed no difference between the days. A freight line crosses the route at the halfway point. The rail yard schedules a loaded outbound train for Tuesday and Thursday mornings. A loaded freight at that crossing holds traffic for about ten minutes. The driver logged a stopped train at the crossing on both late days.",
    q: "Why was Bus 12 late only on Tuesdays and Thursdays?",
    s: [
      { who: "🚂 The Tuesday and Thursday freight train", why: "a loaded freight holds traffic for about ten minutes" },
      { who: "🕐 Leaving the depot late", why: "the bus left the depot on time on all five mornings" },
      { who: "🚗 Heavier traffic", why: "traffic counts showed no difference between the days" },
      { who: "🧑‍✈️ A different driver", why: "the same driver drove the same route at the same hour" },
    ],
    who: 0,
    answer: "A loaded freight train blocked the crossing on both days.",
    proof: [
      "“The rail yard schedules a loaded outbound train for Tuesday and Thursday mornings.”",
      "“The driver logged a stopped train at the crossing on both late days.”",
    ],
    clears: [
      "Leaving late: “The bus left the depot on time on all five mornings.”",
      "Heavier traffic: “Traffic counts on the route showed no difference between the days.”",
      "A different driver: “The same driver drove the same route at the same hour every day.”",
    ],
    explain:
      "Nine to twelve minutes late, and a crossing that holds traffic about ten. Because the yard runs that loaded train on exactly those two mornings, the delay matches both the days and the length.",
  },
  {
    t: "The Case of the Dull Trophy",
    tag: "🏆 trophy",
    story:
      "The 1998 trophy went dull and grey in the case over one winter break. The four trophies beside it stayed bright the whole time. Nobody opened the case and the lock was never broken. Silver turns dark when sulfur in the air reacts with its surface. Rubber bands and some foam release small amounts of sulfur as they age. The dull trophy sits on a foam pad that the others do not have. The custodian added that pad in December to stop a wobble. All five trophies were polished on the same day in November. The case holds the same air and light for every shelf.",
    q: "Why did one trophy go dull?",
    s: [
      { who: "🧽 Sulfur from the new foam pad", why: "some foam releases small amounts of sulfur as it ages" },
      { who: "🧼 Missing a polish", why: "all five trophies were polished on the same day in November" },
      { who: "🔓 Somebody handling it", why: "nobody opened the case and the lock was never broken" },
      { who: "☀️ Light in the case", why: "the case holds the same air and light for every shelf" },
    ],
    who: 0,
    answer: "Sulfur from the foam pad darkened the silver on that trophy.",
    proof: [
      "“Silver turns dark when sulfur in the air reacts with its surface.”",
      "“The dull trophy sits on a foam pad that the others do not have.”",
    ],
    clears: [
      "Missing a polish: “All five trophies were polished on the same day in November.”",
      "Somebody handling it: “Nobody opened the case and the lock was never broken.”",
      "Light in the case: “The case holds the same air and light for every shelf.”",
    ],
    explain:
      "Five trophies, one new object. Because the pad went in during December and aging foam gives off the sulfur that darkens silver, the only trophy touching foam is the only one that went grey.",
  },
  {
    t: "The Case of the Cold Half Turkey",
    tag: "🦃 turkey",
    story:
      "The cafeteria turkey came out done on the left and underdone on the right. One thermometer read one hundred seventy-five degrees and the other one hundred forty-two. The bird was one piece and went in at one temperature. It roasted the full four hours the recipe called for. The oven was set to three hundred twenty-five and held it all morning. Ovens move heat with air, and anything blocking that air leaves a cold pocket. A full sheet of foil-covered rolls sat on the rack beside the right side. Those rolls went in at the same time as the turkey. A thermometer placed in the empty left half of the oven read correctly.",
    q: "Why was half the turkey underdone?",
    s: [
      { who: "🥖 The tray of rolls blocking the air", why: "anything blocking that air leaves a cold pocket" },
      { who: "⏲️ Not enough time", why: "it roasted the full four hours the recipe called for" },
      { who: "🌡️ A cold oven", why: "the oven held three hundred twenty-five all morning" },
      { who: "🍗 Two different birds", why: "the bird was one piece and went in at one temperature" },
    ],
    who: 0,
    answer: "The tray of rolls blocked the hot air on the turkey's right side.",
    proof: [
      "“Ovens move heat with air, and anything blocking that air leaves a cold pocket.”",
      "“A full sheet of foil-covered rolls sat on the rack beside the right side.”",
    ],
    clears: [
      "Not enough time: “It roasted the full four hours the recipe called for.”",
      "A cold oven: “The oven was set to three hundred twenty-five and held it all morning.”",
      "Two different birds: “The bird was one piece and went in at one temperature.”",
    ],
    explain:
      "One bird, one oven, two readings thirty degrees apart. Because an oven cooks by moving air and the rolls sat in the way on one side only, the blocked half never got the heat the other half did.",
  },
  {
    t: "The Case of the Cupcakes That Waited",
    tag: "🧁 cupcake",
    story:
      "Two dozen cupcakes came out of the same oven and one dozen stayed flat. Both trays used the same bowl of batter mixed at the same time. Both went in at three hundred fifty and came out after nineteen minutes. Cupcakes rise on gas bubbles that baking soda makes when it meets acid. Those bubbles start forming the moment the wet and dry are stirred together. The first tray went in at once and the second waited forty minutes on the counter. Nobody opened the oven door while either tray was baking. The flat tray was the one that waited. Both trays were filled from the top of the same bowl.",
    q: "Why was one dozen flat?",
    s: [
      { who: "⏳ The forty-minute wait on the counter", why: "the bubbles start the moment wet and dry are stirred" },
      { who: "🚪 The oven door opening", why: "nobody opened the oven door while either tray was baking" },
      { who: "🥣 A different batter", why: "both trays used the same bowl of batter" },
      { who: "🌡️ A cooler oven", why: "both went in at three hundred fifty" },
    ],
    who: 0,
    answer: "The batter that waited forty minutes had lost its bubbles.",
    proof: [
      "“Those bubbles start forming the moment the wet and dry are stirred together.”",
      "“The first tray went in at once and the second waited forty minutes on the counter.”",
    ],
    clears: [
      "The oven door: “Nobody opened the oven door while either tray was baking.”",
      "A different batter: “Both trays used the same bowl of batter mixed at the same time.”",
      "A cooler oven: “Both went in at three hundred fifty and came out after nineteen minutes.”",
    ],
    explain:
      "Same batter, same oven, same time in it. Because the gas starts the instant the batter is stirred, the tray that sat for forty minutes had already let most of its bubbles go before it ever got hot.",
  },
  {
    t: "The Case of the Wet Mittens Inside",
    tag: "🧤 mitten",
    story:
      "Ivy's mittens came in soaked on the inside and dry on the outside. The outer shell is coated and water beaded on it all recess. No snow got past the cuffs, which she had tucked under her sleeves. The puddles on the blacktop were shallow and she never put her hands in. Working hands give off water as vapor, and a coated shell will not let vapor out. Vapor turns back into water when it reaches the cold inside of the shell. Ivy dug in the snowbank for the whole twenty minutes. Her classmates in uncoated knit mittens came in damp all the way through. The mittens weighed more coming in than they did going out.",
    q: "Why were the mittens wet inside?",
    s: [
      { who: "💦 Her own hands giving off vapor", why: "a coated shell will not let vapor out" },
      { who: "❄️ Snow getting in the cuffs", why: "no snow got past the cuffs" },
      { who: "🌧️ Puddles on the blacktop", why: "she never put her hands in" },
      { who: "🧶 A hole in the shell", why: "water beaded on the outside all recess" },
    ],
    who: 0,
    answer: "Vapor from her hands condensed inside the coated mitten shell.",
    proof: [
      "“Working hands give off water as vapor, and a coated shell will not let vapor out.”",
      "“Vapor turns back into water when it reaches the cold inside of the shell.”",
    ],
    clears: [
      "Snow in the cuffs: “No snow got past the cuffs, which she had tucked under her sleeves.”",
      "Puddles: “The puddles on the blacktop were shallow and she never put her hands in.”",
      "A hole in the shell: “The outer shell is coated and water beaded on it all recess.”",
    ],
    explain:
      "The water came from the inside out. Because a coated shell keeps vapor in as well as rain out, twenty minutes of digging put enough water in the air inside the mitten to soak it from within.",
  },
  {
    t: "The Case of the Cracked Gingerbread",
    tag: "🎄 ginger",
    story:
      "Six gingerbread walls came off one baking sheet and two cracked in half. The dough was rolled from one batch and cut with the same cutter. All six baked eleven minutes and came out looking identical. A sheet of baked dough shrinks a little as it cools and gives up water. Dough cooling unevenly shrinks unevenly, and the stress splits it at the thinnest line. Four walls cooled on a rack in the open kitchen for an hour. The two that cracked were moved straight to the cold windowsill. A thermometer on that sill read thirty-one degrees that afternoon. Nobody touched, stacked or dropped any of the six walls.",
    q: "Why did two walls crack?",
    s: [
      { who: "🪟 Cooling fast on the cold sill", why: "dough cooling unevenly shrinks unevenly" },
      { who: "🤲 Somebody handling them", why: "nobody touched, stacked or dropped any of the six" },
      { who: "🥣 A different batch of dough", why: "the dough was rolled from one batch" },
      { who: "⏲️ Baking too long", why: "all six baked eleven minutes" },
    ],
    who: 0,
    answer: "The two walls moved to the cold sill cooled unevenly and split.",
    proof: [
      "“Dough cooling unevenly shrinks unevenly, and the stress splits it at the thinnest line.”",
      "“The two that cracked were moved straight to the cold windowsill.”",
    ],
    clears: [
      "Somebody handling them: “Nobody touched, stacked or dropped any of the six walls.”",
      "A different batch: “The dough was rolled from one batch and cut with the same cutter.”",
      "Baking too long: “All six baked eleven minutes and came out looking identical.”",
    ],
    explain:
      "Six identical walls, two different cooling spots. Because a thirty-one degree sill pulls heat out of one face far faster than the other, the shrinking went uneven and the dough split where it was thinnest.",
  },
  {
    t: "The Case of the Half-Dark String",
    tag: "💡 lights",
    story:
      "Half the hallway light string went dark and the other half stayed lit. The dark half runs from the twenty-sixth bulb to the fiftieth. Each half of this string is wired so the current passes through every bulb in turn. When one bulb in such a line fails, the whole line it belongs to goes out. The lit half is wired as its own separate line. Mr. Cole tested the outlet and it carried full power. He checked the plug and the cord and found no break or fray. The twenty-sixth bulb rattled when he shook it and its filament was broken. Every other bulb in the dark half tested fine in a working socket.",
    q: "Why did half the string go dark?",
    s: [
      { who: "💡 The broken twenty-sixth bulb", why: "when one bulb in such a line fails, the whole line goes out" },
      { who: "🔌 The outlet", why: "he tested the outlet and it carried full power" },
      { who: "🪢 A break in the cord", why: "he found no break or fray" },
      { who: "🧯 All the bulbs burning out", why: "every other bulb in the dark half tested fine" },
    ],
    who: 0,
    answer: "One broken bulb opened the line that half the string runs on.",
    proof: [
      "“When one bulb in such a line fails, the whole line it belongs to goes out.”",
      "“The twenty-sixth bulb rattled when he shook it and its filament was broken.”",
    ],
    clears: [
      "The outlet: “Mr. Cole tested the outlet and it carried full power.”",
      "A break in the cord: “He checked the plug and the cord and found no break or fray.”",
      "All the bulbs: “Every other bulb in the dark half tested fine in a working socket.”",
    ],
    explain:
      "Twenty-five bulbs went out and twenty-four of them still work. Because that half is one line with the current running through every bulb in turn, the single broken filament at number twenty-six is enough to darken all of them.",
  },
  {
    t: "The Case of the Clock That Lost Four Minutes",
    tag: "⏰ clock",
    story:
      "The hallway clock lost about four minutes a day all through January. It had kept time to the second for the six years before that. The battery tested at full voltage and the hands moved freely. Nothing was rubbing the hands and the glass had not been struck. This clock keeps time with a thin metal wheel that turns at a fixed rate. Metal expands when it warms and that makes the wheel turn more slowly. The clock hangs directly above a radiator that was replaced in December. A thermometer taped beside the clock read ninety-four degrees in January. The identical clock at the far end of the hall kept perfect time.",
    q: "Why was the clock losing time?",
    s: [
      { who: "🔥 Heat from the new radiator", why: "metal expands when it warms and turns more slowly" },
      { who: "🔋 A weak battery", why: "the battery tested at full voltage" },
      { who: "🫳 Something rubbing the hands", why: "nothing was rubbing the hands" },
      { who: "🏭 A faulty clock", why: "it had kept time to the second for six years" },
    ],
    who: 0,
    answer: "Heat from the radiator expanded the wheel and slowed the clock.",
    proof: [
      "“Metal expands when it warms and that makes the wheel turn more slowly.”",
      "“A thermometer taped beside the clock read ninety-four degrees in January.”",
    ],
    clears: [
      "A weak battery: “The battery tested at full voltage and the hands moved freely.”",
      "Something rubbing: “Nothing was rubbing the hands and the glass had not been struck.”",
      "A faulty clock: “It had kept time to the second for the six years before that.”",
    ],
    explain:
      "Six perfect years, then four minutes a day the month a radiator went in underneath it. Because the wheel that sets the rate runs slower as it warms, ninety-four degrees is enough to cost four minutes every day.",
  },
  {
    t: "The Case of the Snow That Melted in Stripes",
    tag: "⛄ snow",
    story:
      "Snow on the playground melted in stripes and left white bands between them. The bare stripes sit directly over the black rubber safety mat. The white bands sit over the light grey concrete beside it. Air temperature was thirty-four degrees across the whole playground. Dark surfaces take in more sunlight and give that heat back as warmth. Light surfaces throw much of the same sunlight away again. A surface thermometer read fifty-one on the rubber and thirty-six on the concrete. The snow fell evenly, and a ruler showed the same depth everywhere at dawn. No salt, sand or shovel had been anywhere near the playground all winter.",
    q: "Why did the snow melt in stripes?",
    s: [
      { who: "⬛ The dark rubber mat taking in sunlight", why: "the rubber read fifty-one and the concrete thirty-six" },
      { who: "🧂 Salt on the stripes", why: "no salt, sand or shovel had been near the playground" },
      { who: "🌨️ Uneven snowfall", why: "a ruler showed the same depth everywhere at dawn" },
      { who: "🌡️ Warmer air in places", why: "air temperature was thirty-four degrees across the whole playground" },
    ],
    who: 0,
    answer: "The dark rubber mat took in sunlight and melted the snow above it.",
    proof: [
      "“Dark surfaces take in more sunlight and give that heat back as warmth.”",
      "“A surface thermometer read fifty-one on the rubber and thirty-six on the concrete.”",
    ],
    clears: [
      "Salt: “No salt, sand or shovel had been anywhere near the playground all winter.”",
      "Uneven snowfall: “The snow fell evenly, and a ruler showed the same depth everywhere at dawn.”",
      "Warmer air: “Air temperature was thirty-four degrees across the whole playground.”",
    ],
    explain:
      "The air was the same everywhere and the ground was not. Because the black mat sat at fifty-one degrees while the concrete sat at thirty-six, the snow melted exactly where the dark surface was and nowhere else.",
  },
  {
    t: "The Case of the Feeder Nobody Visited",
    tag: "🐦 feeder",
    story:
      "The window feeder emptied in two days all autumn and sat full for a week in November. The seed was the same mix from the same sack. The feeder hung in the same spot at the same height. No seed was spoiled and the ports were clear of ice. Small birds will leave a feeder that has no cover within a short flight. They need somewhere to dart to when a hawk passes overhead. The lilac hedge eight feet from the feeder was cut back hard on the first of November. The nearest cover now stands forty feet away across open lawn. Birds were still seen in the yard all week.",
    q: "Why did the birds stop using the feeder?",
    s: [
      { who: "✂️ The hedge being cut back", why: "small birds leave a feeder with no cover within a short flight" },
      { who: "🌾 Spoiled or blocked seed", why: "no seed was spoiled and the ports were clear of ice" },
      { who: "📦 A different seed mix", why: "the seed was the same mix from the same sack" },
      { who: "🕊️ The birds leaving the yard", why: "birds were still seen in the yard all week" },
    ],
    who: 0,
    answer: "Cutting the lilac hedge left the feeder with no cover nearby.",
    proof: [
      "“They need somewhere to dart to when a hawk passes overhead.”",
      "“The lilac hedge eight feet from the feeder was cut back hard on the first of November.”",
    ],
    clears: [
      "Spoiled seed: “No seed was spoiled and the ports were clear of ice.”",
      "A different mix: “The seed was the same mix from the same sack.”",
      "The birds leaving: “Birds were still seen in the yard all week.”",
    ],
    explain:
      "Same seed, same feeder, same birds in the yard. Because safe cover went from eight feet to forty on the first of November, the feeder became a place small birds will not risk sitting at.",
  },
  {
    t: "The Case of the Lumpy Cocoa",
    tag: "☕ cocoa",
    story:
      "Two pitchers of cocoa were mixed side by side and one came out full of lumps. Both used four scoops of the same powder and the same milk. Both were stirred for the same ninety seconds with the same whisk. Dry powder clumps when a lot of liquid hits it all at once, because the outside of each clump turns to paste and seals the dry middle in. Adding a little liquid first makes a smooth paste that then thins out safely. Ms. Baptiste poured half a cup into the first pitcher and stirred before adding the rest. The whole quart went into the second pitcher at once. Neither pitcher was heated and neither sat before serving.",
    q: "Why was one pitcher lumpy?",
    s: [
      { who: "🫗 Pouring the whole quart in at once", why: "the outside of each clump turns to paste and seals the dry middle in" },
      { who: "🥄 Not enough stirring", why: "both were stirred the same ninety seconds" },
      { who: "📦 Old powder", why: "both used four scoops of the same powder" },
      { who: "🔥 Heating it", why: "neither pitcher was heated" },
    ],
    who: 0,
    answer: "The whole quart hit the dry powder at once and sealed the lumps in.",
    proof: [
      "“Adding a little liquid first makes a smooth paste that then thins out safely.”",
      "“The whole quart went into the second pitcher at once.”",
    ],
    clears: [
      "Not enough stirring: “Both were stirred for the same ninety seconds with the same whisk.”",
      "Old powder: “Both used four scoops of the same powder and the same milk.”",
      "Heating it: “Neither pitcher was heated and neither sat before serving.”",
    ],
    explain:
      "Same powder, same milk, same ninety seconds of whisking. Because the first pitcher got a little liquid and a stir before the rest, its powder never had the chance to seal itself into lumps the way the second one's did.",
  },
  {
    t: "The Case of the Valentines in the Wrong Bags",
    tag: "💌 valentine",
    story:
      "Every valentine in Room 7 landed in the wrong bag on Friday afternoon. Each one was off by exactly the same distance down the row. Nobody opened a card and nothing was missing or torn. The bags hang in a fixed order along the back wall. That order is alphabetical by last name and has not changed all year. The class list taped to the table is alphabetical by first name instead. The helper worked straight down the printed list and straight along the wall. The two orders put a different child in the same position almost everywhere. The helper had never delivered the valentines before that day.",
    q: "Why did every card land in the wrong bag?",
    s: [
      { who: "📋 Two lists in different orders", why: "the wall is by last name and the list is by first name" },
      { who: "👀 Somebody opening the cards", why: "nobody opened a card" },
      { who: "🪝 The bags being moved", why: "that order has not changed all year" },
      { who: "✉️ Missing cards", why: "nothing was missing or torn" },
    ],
    who: 0,
    answer: "The helper matched a first-name list against last-name bags.",
    proof: [
      "“That order is alphabetical by last name and has not changed all year.”",
      "“The class list taped to the table is alphabetical by first name instead.”",
    ],
    clears: [
      "Somebody opening them: “Nobody opened a card and nothing was missing or torn.”",
      "The bags being moved: “The bags hang in a fixed order along the back wall.”",
      "Missing cards: “nothing was missing or torn.”",
    ],
    explain:
      "Nothing was lost and nothing was opened, and every card is off by the same amount. Because the list and the wall are sorted two different ways, working carefully down both at once puts every single card in somebody else's bag.",
  },
  {
    t: "The Case of the Volcano That Would Not Erupt",
    tag: "🌋 volcano",
    story:
      "Four model volcanoes erupted at the fair and the fifth only fizzed. All five used two spoons of baking soda and half a cup of vinegar. The soda and the vinegar came from the same two containers. Baking soda and vinegar make gas, and the gas is what pushes the foam up. Baking soda left open to damp air slowly reacts and loses its power. The fifth team's soda had sat open on a humid porch since September. Its surface was crusted and clumped rather than loose and powdery. The fifth cone was built to the same height and the same opening. The vinegar in the fifth cup still smelled as sharp as the rest.",
    q: "Why did the fifth volcano only fizz?",
    s: [
      { who: "🥄 Baking soda spoiled by damp air", why: "its surface was crusted and clumped" },
      { who: "🍶 Weak vinegar", why: "the vinegar still smelled as sharp as the rest" },
      { who: "🏔️ A badly built cone", why: "built to the same height and the same opening" },
      { who: "⚖️ Wrong amounts", why: "all five used two spoons and half a cup" },
    ],
    who: 0,
    answer: "The fifth team's baking soda had already reacted in damp air.",
    proof: [
      "“Baking soda left open to damp air slowly reacts and loses its power.”",
      "“The fifth team's soda had sat open on a humid porch since September.”",
    ],
    clears: [
      "Weak vinegar: “The vinegar in the fifth cup still smelled as sharp as the rest.”",
      "A badly built cone: “The fifth cone was built to the same height and the same opening.”",
      "Wrong amounts: “All five used two spoons of baking soda and half a cup of vinegar.”",
    ],
    explain:
      "Same recipe, same cone, same vinegar. Because soda left open in damp air spends its power before it ever reaches the cup, two spoons of crusted soda cannot make the gas that four spoons of fresh soda made.",
  },
  {
    t: "The Case of the Crown That Would Not Close",
    tag: "👑 crown",
    story:
      "Twenty paper crowns were cut to one pattern and six would not close. The six that failed were all cut by the same two students. Every crown came off the same roll of card at the same width. Nobody trimmed, tore or re-cut any crown after it was measured. A head is measured around, and that measurement is the length the strip must reach. The pattern sheet lists the head width across instead of the distance around. A circle's distance around is a little more than three times its width. The six short crowns each measure close to a third of what they need. The other fourteen students measured around with a tape as instructed.",
    q: "Why would six crowns not close?",
    s: [
      { who: "📏 Measuring across instead of around", why: "the distance around is a little more than three times the width" },
      { who: "✂️ Trimming them too short", why: "nobody trimmed, tore or re-cut any crown" },
      { who: "📜 A narrower roll of card", why: "every crown came off the same roll at the same width" },
      { who: "🧵 A different pattern", why: "twenty crowns were cut to one pattern" },
    ],
    who: 0,
    answer: "Six students measured the head across rather than around.",
    proof: [
      "“The pattern sheet lists the head width across instead of the distance around.”",
      "“The six short crowns each measure close to a third of what they need.”",
    ],
    clears: [
      "Trimming them short: “Nobody trimmed, tore or re-cut any crown after it was measured.”",
      "A narrower roll: “Every crown came off the same roll of card at the same width.”",
      "A different pattern: “Twenty paper crowns were cut to one pattern and six would not close.”",
    ],
    explain:
      "A third is the number that gives it away. Because the distance around a circle is a bit over three times the distance across, a crown measured across comes out at almost exactly a third of the length it needed.",
  },
  {
    t: "The Case of the Piano That Went Sour",
    tag: "🎹 piano",
    story:
      "The music room piano was tuned in October and sounded wrong by February. No other instrument in the building had shifted at all. Nobody had moved the piano and no string had broken. A piano string is stretched across a wooden frame that holds its tension. Wood takes in water from damp air and gives it up in dry air, swelling and shrinking as it does. A frame that shrinks lets every string go slightly slack at once. The music room humidity ran at fifty-five percent in October and nineteen in February. The other instruments live in cases that hold their own air. The tuner found every string flat by about the same amount.",
    q: "Why did the piano go out of tune?",
    s: [
      { who: "💨 Dry winter air shrinking the frame", why: "a frame that shrinks lets every string go slack at once" },
      { who: "🚚 The piano being moved", why: "nobody had moved the piano" },
      { who: "🎻 A problem in the whole building", why: "no other instrument had shifted at all" },
      { who: "🪢 A broken string", why: "no string had broken" },
    ],
    who: 0,
    answer: "Dry February air shrank the wooden frame and loosened every string.",
    proof: [
      "“A frame that shrinks lets every string go slightly slack at once.”",
      "“The music room humidity ran at fifty-five percent in October and nineteen in February.”",
    ],
    clears: [
      "The piano being moved: “Nobody had moved the piano and no string had broken.”",
      "The whole building: “No other instrument in the building had shifted at all.”",
      "A broken string: “no string had broken.”",
    ],
    explain:
      "Every string went flat by the same amount, which no single broken string can do. Because the humidity fell from fifty-five percent to nineteen, the frame holding all of them shrank and let the whole set go slack together.",
  },
  {
    t: "The Case of the Kite That Would Not Climb",
    tag: "🪁 kite",
    story:
      "Two identical kites flew on the same afternoon and only one would climb. Both were built from the same kit with the same tail and string. The flag on the roof stood straight out all afternoon. A kite climbs on air that moves steadily in one direction. A building sends the wind over its roof and leaves a churning pocket behind it. That pocket pushes up, down and sideways by turns instead of steadily. The kite that failed was flown on the lawn right behind the gym. The one that climbed was flown in the open field beyond the gym. A ribbon held up on the lawn flapped in every direction at once.",
    q: "Why would one kite not climb?",
    s: [
      { who: "🏢 Churning air behind the gym", why: "a ribbon on the lawn flapped in every direction at once" },
      { who: "🌬️ No wind that day", why: "the flag on the roof stood straight out all afternoon" },
      { who: "🪢 A badly built kite", why: "both were built from the same kit" },
      { who: "🎀 The tail", why: "the same tail and string on both" },
    ],
    who: 0,
    answer: "The gym churned the wind on the lawn so the kite had no steady air.",
    proof: [
      "“A building sends the wind over its roof and leaves a churning pocket behind it.”",
      "“That pocket pushes up, down and sideways by turns instead of steadily.”",
    ],
    clears: [
      "No wind: “The flag on the roof stood straight out all afternoon.”",
      "A badly built kite: “Both were built from the same kit with the same tail and string.”",
      "The tail: “Both were built from the same kit with the same tail and string.”",
    ],
    explain:
      "There was plenty of wind and two identical kites. Because the gym leaves a churning pocket behind it, the kite on the lawn was pushed four ways at once while the one in the open field had steady air to climb on.",
  },
  {
    t: "The Case of the Shamrock That Closed at Four",
    tag: "☘️ shamrock",
    story:
      "The shamrock plant on the sill folded its leaves shut every afternoon at four. It opened again each morning without anyone touching it. The soil stayed evenly damp and the plant never wilted. No insect, mold or damage was found on any leaf. Some plants fold their leaves on a daily rhythm set by light. The folding happens on schedule whether or not the plant is short of water. A storage shed built in January now blocks the sill from three o'clock on. Before January the sill held direct light until nearly seven. A second shamrock in the sunnier window folds at close to seven instead.",
    q: "Why does the shamrock close at four?",
    s: [
      { who: "🌇 Losing its light at three", why: "some plants fold their leaves on a rhythm set by light" },
      { who: "🏜️ Dry soil", why: "the soil stayed evenly damp and the plant never wilted" },
      { who: "🐛 Pests or disease", why: "no insect, mold or damage was found on any leaf" },
      { who: "🤲 Somebody touching it", why: "it opened again each morning without anyone touching it" },
    ],
    who: 0,
    answer: "The new shed cuts the light that sets the plant's folding rhythm.",
    proof: [
      "“Some plants fold their leaves on a daily rhythm set by light.”",
      "“A storage shed built in January now blocks the sill from three o'clock on.”",
    ],
    clears: [
      "Dry soil: “The soil stayed evenly damp and the plant never wilted.”",
      "Pests or disease: “No insect, mold or damage was found on any leaf.”",
      "Somebody touching it: “It opened again each morning without anyone touching it.”",
    ],
    explain:
      "The second shamrock is the control. Because the sunnier window still holds light until seven and folds at seven, the plant on the shaded sill is reading the shed, not thirst or damage.",
  },
  {
    t: "The Case of the Puddle That Stayed",
    tag: "🌧️ puddle",
    story:
      "One puddle on the field lasted nine days and every other puddle dried in two. All of them filled during the same Saturday rain. The long puddle sits in a shallow dip only two inches deep. Water leaves the ground by soaking down or drying off the top. Soil made of fine packed clay lets water through many times more slowly than sandy soil. A core sample from the dip came up as grey packed clay. Samples from the other spots came up brown and sandy. Sun and wind reached every part of the field equally all nine days. The dip is not fed by any pipe, downspout or stream.",
    q: "Why did one puddle last nine days?",
    s: [
      { who: "🧱 Packed clay under that dip", why: "a core sample from the dip came up as grey packed clay" },
      { who: "🕳️ A deeper hole", why: "the dip is only two inches deep" },
      { who: "🚰 Water feeding in", why: "the dip is not fed by any pipe, downspout or stream" },
      { who: "🌥️ Less sun on that spot", why: "sun and wind reached every part of the field equally" },
    ],
    who: 0,
    answer: "Clay soil under the dip let the water soak down very slowly.",
    proof: [
      "“Soil made of fine packed clay lets water through many times more slowly than sandy soil.”",
      "“A core sample from the dip came up as grey packed clay.”",
    ],
    clears: [
      "A deeper hole: “The long puddle sits in a shallow dip only two inches deep.”",
      "Water feeding in: “The dip is not fed by any pipe, downspout or stream.”",
      "Less sun: “Sun and wind reached every part of the field equally all nine days.”",
    ],
    explain:
      "It is the shallowest puddle and it lasted longest, so depth is not the answer. Because the soil under it is packed clay while the rest of the field is sandy, the water had almost no way down.",
  },
  {
    t: "The Case of the Seeds That Never Came Up",
    tag: "🌻 garden",
    story:
      "Two rows of sunflower seeds went in on the same morning and one row sprouted. Both rows came from the same packet, dated this year. Both were watered by the same hose on the same schedule. A seed carries only enough stored food to push a shoot a short way up. A seed buried too deep runs out of food before the shoot reaches light. The sprouting row was planted half an inch down as the packet says. The second row was planted four inches down with a trowel. Dug up three weeks later, the deep seeds had sprouted and then died underground. The soil in both rows was the same loose mix at the same warmth.",
    q: "Why did one row never come up?",
    s: [
      { who: "⬇️ Seeds planted four inches deep", why: "a seed buried too deep runs out of food before reaching light" },
      { who: "📦 Dead seed", why: "the deep seeds had sprouted and then died underground" },
      { who: "💧 Too little water", why: "both were watered by the same hose on the same schedule" },
      { who: "🧊 Cold soil", why: "the soil in both rows was the same loose mix at the same warmth" },
    ],
    who: 0,
    answer: "The deep row sprouted underground and ran out of food before surfacing.",
    proof: [
      "“A seed buried too deep runs out of food before the shoot reaches light.”",
      "“The second row was planted four inches down with a trowel.”",
    ],
    clears: [
      "Dead seed: “Dug up three weeks later, the deep seeds had sprouted and then died underground.”",
      "Too little water: “Both were watered by the same hose on the same schedule.”",
      "Cold soil: “The soil in both rows was the same loose mix at the same warmth.”",
    ],
    explain:
      "The seeds were alive — they germinated. Because four inches is further than a sunflower's stored food can push a shoot, the row sprouted and then starved before it ever reached the surface.",
  },
  {
    t: "The Case of the Egg That Floated",
    tag: "🪺 eggs",
    story:
      "Six eggs went into a bowl of water and one floated while five sank. All six came from the same farm and the same carton. None of them was cracked, warm or smelling of anything. An egg has a small air pocket at its blunt end just inside the shell. The shell is slightly porous, so water leaves the egg slowly and air takes its place. The longer an egg is kept, the larger that air pocket grows. An egg floats once its air pocket is large enough to lift it. Marcus found a second date stamp on the floating egg reading five weeks earlier. The five sinking eggs all carried this week's stamp.",
    q: "Why did one egg float?",
    s: [
      { who: "🫧 A grown air pocket in an older egg", why: "an egg floats once its air pocket is large enough" },
      { who: "🥚 A cracked shell", why: "none of them was cracked" },
      { who: "🏚️ A different farm", why: "all six came from the same farm and the same carton" },
      { who: "🌡️ Being warm", why: "none of them was warm" },
    ],
    who: 0,
    answer: "The floating egg was five weeks older and its air pocket had grown.",
    proof: [
      "“The longer an egg is kept, the larger that air pocket grows.”",
      "“Marcus found a second date stamp on the floating egg reading five weeks earlier.”",
    ],
    clears: [
      "A cracked shell: “None of them was cracked, warm or smelling of anything.”",
      "A different farm: “All six came from the same farm and the same carton.”",
      "Being warm: “None of them was cracked, warm or smelling of anything.”",
    ],
    explain:
      "One carton, one farm, five weeks of difference. Because water leaves an egg slowly and air replaces it, the oldest egg carries the biggest air pocket, and that is what lifted it off the bottom.",
  },
  {
    t: "The Case of the Shadow That Moved House",
    tag: "🌎 earth",
    story:
      "A class marked the flagpole's noon shadow in September and remeasured in December. The September mark sat eleven feet from the base and the December mark nineteen. Nobody moved the flagpole and the ground was checked for settling. Both measurements were taken at local noon from the same chalk cross. The sun rides lower in the sky in winter than it does in autumn. A lower sun throws a longer shadow from the same object. A sun-angle table gave fifty-two degrees in September and thirty-one in December. The pole's height was measured both times at twenty-nine feet. The weather was clear and still on both measuring days.",
    q: "Why was the December shadow so much longer?",
    s: [
      { who: "📐 A lower winter sun", why: "a lower sun throws a longer shadow from the same object" },
      { who: "🚩 The flagpole moving", why: "nobody moved the flagpole and the ground was checked" },
      { who: "📏 A measuring mistake", why: "both were taken at local noon from the same chalk cross" },
      { who: "📈 The pole getting taller", why: "the pole's height was measured both times at twenty-nine feet" },
    ],
    who: 0,
    answer: "The December sun sat twenty-one degrees lower and stretched the shadow.",
    proof: [
      "“The sun rides lower in the sky in winter than it does in autumn.”",
      "“A sun-angle table gave fifty-two degrees in September and thirty-one in December.”",
    ],
    clears: [
      "The flagpole moving: “Nobody moved the flagpole and the ground was checked for settling.”",
      "A measuring mistake: “Both measurements were taken at local noon from the same chalk cross.”",
      "The pole getting taller: “The pole's height was measured both times at twenty-nine feet.”",
    ],
    explain:
      "Same pole, same spot, same hour. Because the sun sat fifty-two degrees up in September and only thirty-one in December, the identical twenty-nine-foot pole threw a shadow eight feet longer.",
  },
  {
    t: "The Case of the Blurred Runner",
    tag: "📷 camera",
    story:
      "Every photo from the track meet came out sharp except the ones of the runners. The fences, the clouds and the seated crowd were all crisp in the same frames. The lens was clean and the camera sat locked on a tripod. A camera makes a picture by holding its shutter open for a slice of time. Anything that moves while the shutter is open smears across the picture. The settings log shows a shutter held open for a full quarter second. A sprinter covers about seven feet in a quarter of a second. The photographer used the same settings for every shot that day. The focus ring was taped in place before the meet began.",
    q: "Why were only the runners blurred?",
    s: [
      { who: "⏱️ A shutter held open a quarter second", why: "a sprinter covers about seven feet in that time" },
      { who: "🤲 A shaky camera", why: "the camera sat locked on a tripod" },
      { who: "🔎 Bad focus", why: "the focus ring was taped in place before the meet" },
      { who: "🧼 A dirty lens", why: "the lens was clean" },
    ],
    who: 0,
    answer: "The shutter stayed open long enough for the runners to move across it.",
    proof: [
      "“Anything that moves while the shutter is open smears across the picture.”",
      "“The settings log shows a shutter held open for a full quarter second.”",
    ],
    clears: [
      "A shaky camera: “The lens was clean and the camera sat locked on a tripod.”",
      "Bad focus: “The focus ring was taped in place before the meet began.”",
      "A dirty lens: “The lens was clean and the camera sat locked on a tripod.”",
    ],
    explain:
      "Everything still is sharp and everything moving is not, in the very same frames. Because the shutter stayed open a quarter second and a sprinter crosses seven feet in that time, only the runners smeared.",
  },
  {
    t: "The Case of the Leaning Bean Plant",
    tag: "🌱 plant",
    story:
      "A bean plant on the counter leaned hard toward the window by Friday. It had stood straight on Monday and nobody had tipped the pot. The stem was firm and green with no sign of rot or breakage. The soil was level and the pot sat flat on the counter. A plant grows the cells on its shaded side longer than those on its lit side. Growing longer on one side only is what bends a stem toward light. The window is the room's only light source and sits to the plant's left. A second bean under a lamp directly overhead stood perfectly straight all week. Both plants had the same soil, water and pot.",
    q: "Why did the bean plant lean?",
    s: [
      { who: "🪟 Light coming from one side", why: "growing longer on one side only bends a stem toward light" },
      { who: "🪴 A tipped pot", why: "the soil was level and the pot sat flat on the counter" },
      { who: "🦠 Rot in the stem", why: "the stem was firm and green with no sign of rot" },
      { who: "💧 Uneven watering", why: "both plants had the same soil, water and pot" },
    ],
    who: 0,
    answer: "One-sided light made the shaded side of the stem grow longer.",
    proof: [
      "“A plant grows the cells on its shaded side longer than those on its lit side.”",
      "“The window is the room's only light source and sits to the plant's left.”",
    ],
    clears: [
      "A tipped pot: “The soil was level and the pot sat flat on the counter.”",
      "Rot in the stem: “The stem was firm and green with no sign of rot or breakage.”",
      "Uneven watering: “Both plants had the same soil, water and pot.”",
    ],
    explain:
      "The bean under the overhead lamp is the control and it stood straight. Because light reaching a stem from one side makes the shaded cells grow longer than the lit ones, the stem bends — it is growth, not damage or a tilt.",
  },
  {
    t: "The Case of the Ice Cream in the Metal Bowl",
    tag: "🍦 icecream",
    story:
      "Two scoops came out of the freezer together and the metal bowl's scoop melted first. The plastic bowl's scoop still held its shape twenty minutes later. Both scoops were the same size from the same tub. Both bowls sat side by side on the same table in the same room. Heat moves into ice cream from whatever is touching it. Metal carries heat many times faster than plastic does. The room and both bowls had been sitting at seventy-one degrees all morning. Neither bowl was in sunlight and neither had been warmed or rinsed. A thermometer read seventy-one inside both bowls before the scoops went in.",
    q: "Why did the metal bowl's ice cream melt first?",
    s: [
      { who: "🥄 Metal carrying heat faster", why: "metal carries heat many times faster than plastic" },
      { who: "☀️ Sunlight on one bowl", why: "neither bowl was in sunlight" },
      { who: "🔥 A warm bowl", why: "both bowls had been sitting at seventy-one degrees all morning" },
      { who: "🍨 A bigger scoop", why: "both scoops were the same size from the same tub" },
    ],
    who: 0,
    answer: "The metal bowl moved room heat into the ice cream far faster.",
    proof: [
      "“Heat moves into ice cream from whatever is touching it.”",
      "“Metal carries heat many times faster than plastic does.”",
    ],
    clears: [
      "Sunlight: “Neither bowl was in sunlight and neither had been warmed or rinsed.”",
      "A warm bowl: “A thermometer read seventy-one inside both bowls before the scoops went in.”",
      "A bigger scoop: “Both scoops were the same size from the same tub.”",
    ],
    explain:
      "Both bowls started at the same seventy-one degrees, so it is not that one was warmer. Because metal passes that heat along many times faster than plastic, the same room melts one scoop long before the other.",
  },
  {
    t: "The Case of the Ribbon That Lost Its Red",
    tag: "🎗️ ribbon",
    story:
      "A long red ribbon on the fence faded to pale pink along one stretch only. The faded stretch runs the length of the south-facing side. The rest of the ribbon, on the north side, is still deep red. It is one continuous ribbon tied at both ends and never cut. Sunlight breaks down the dyes in fabric and lightens the color over time. The south side of this fence takes direct sun from morning until evening. The north side sits in the building's shadow for most of the day. No rain, cleaner or bleach reached one side more than the other. The ribbon was one color when it was tied up in April.",
    q: "Why did only part of the ribbon fade?",
    s: [
      { who: "☀️ Sun on the south-facing side", why: "the south side takes direct sun from morning until evening" },
      { who: "🧴 Bleach or cleaner", why: "no cleaner or bleach reached one side more than the other" },
      { who: "🎀 Two different ribbons", why: "it is one continuous ribbon tied at both ends and never cut" },
      { who: "🌧️ Rain", why: "no rain reached one side more than the other" },
    ],
    who: 0,
    answer: "Sunlight broke down the red dye on the south-facing stretch.",
    proof: [
      "“Sunlight breaks down the dyes in fabric and lightens the color over time.”",
      "“The south side of this fence takes direct sun from morning until evening.”",
    ],
    clears: [
      "Bleach or cleaner: “No rain, cleaner or bleach reached one side more than the other.”",
      "Two ribbons: “It is one continuous ribbon tied at both ends and never cut.”",
      "Rain: “No rain, cleaner or bleach reached one side more than the other.”",
    ],
    explain:
      "One ribbon, never cut, two colors. Because the faded stretch is exactly the stretch that takes sun all day and the deep red stretch sits in shadow, the sun is the only thing that differs along its length.",
  },
  {
    t: "The Case of the Balloons That Sank Overnight",
    tag: "🎈 balloons",
    story:
      "Thirty foil balloons touched the gym ceiling on Friday and rested on the floor on Monday. None of them had popped and every knot still held. Foil holds helium far better than latex and these were all foil. A gas shrinks when it cools and takes up less room than it did warm. A balloon floats only while it pushes aside more air than it weighs. A balloon that shrinks pushes aside less air and stops floating. The gym heat is switched off from Friday evening until Monday morning. A logger in the gym recorded sixty-eight degrees Friday and forty-one on Sunday. Every balloon measured smaller around on Monday than it had on Friday.",
    q: "Why did the balloons sink?",
    s: [
      { who: "🌡️ The cold gym shrinking the gas", why: "a balloon that shrinks pushes aside less air and stops floating" },
      { who: "💨 Helium leaking out", why: "foil holds helium far better than latex and these were all foil" },
      { who: "📌 A leak or a pop", why: "none of them had popped and every knot still held" },
      { who: "⚖️ Heavier ribbons", why: "every balloon measured smaller around on Monday" },
    ],
    who: 0,
    answer: "The cold weekend gym shrank the helium until the balloons sank.",
    proof: [
      "“A logger in the gym recorded sixty-eight degrees Friday and forty-one on Sunday.”",
      "“Every balloon measured smaller around on Monday than it had on Friday.”",
    ],
    clears: [
      "Helium leaking: “Foil holds helium far better than latex and these were all foil.”",
      "A leak or a pop: “None of them had popped and every knot still held.”",
      "Heavier ribbons: “Every balloon measured smaller around on Monday than it had on Friday.”",
    ],
    explain:
      "The measurement is the proof: they are smaller, not emptier. Because the heat went off and the gym fell to forty-one degrees, the helium shrank, each balloon pushed aside less air, and thirty of them stopped floating at once.",
  },
];

gradeMysteries(6, CASES);
console.log(`grade 6: ${CASES.length} cases written`);
