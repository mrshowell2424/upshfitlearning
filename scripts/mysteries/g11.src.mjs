/**
 * Grade 11 mysteries: thirty-six cases, one a week, on the same thirty-six
 * themes as every other grade. Week 9 is the pumpkin case in every room in
 * the building; only the reading level and the case itself change.
 *
 * Held to the band in scripts/reading-mystery-plan.json: 176-252 words, mean
 * sentence no longer than 20 words, five suspects, and at least three proof
 * quotes that are really in the story.
 *
 * The step up from grade 10 changes what it means to clear somebody. In
 * every grade before this one a cleared suspect is a suspect who did not do
 * it. Here all five are real. The draught really does cool the room. The
 * wasps really did take some of the apples. The question is no longer
 * whether a cause is operating, because they all are, but whether any of
 * them is large enough to produce the number in front of you.
 *
 * So the case carries quantities, and the reasoning is arithmetic. A gap
 * under a door loses about a degree, and the room is eight degrees down. A
 * hedge shades two trees out of eleven, so at worst it can cost a fifth of
 * the crop, and three quarters of the crop is gone. Thirty more children in
 * a hall add under a decibel, because sound does not add the way people
 * think it does. Each of those is true, small, and not the answer.
 *
 * This is the move behind every argument about a cause in the real world:
 * the contributing factor and the sufficient cause are not the same thing,
 * and the way to tell them apart is to make each one say how big it is.
 *
 *   bun run scripts/mysteries/g11.src.mjs && bun run scripts/merge-mysteries.mjs
 *   bun run scripts/check-mysteries.mjs
 */
import { gradeMysteries } from "./build.mjs";
import { DEBATES } from "./g11.debate.mjs";

const CASES = [
  {
    t: "The Case of the Fourteen Hundred Missing Books",
    tag: "📚 library",
    story:
      "The stocktake says the library holds fourteen hundred fewer books than the catalogue claims, and four explanations are already in circulation. All four describe something that genuinely happened. The loans system lists sixty books out past their due date, which is sixty books and not fourteen hundred. A shelf survey found forty-one books filed in the wrong room, and a book in the wrong room is still in the building. The theft log records about fifteen losses a year for the last three years, which comes to forty-five. One shelf was counted twice during the stocktake, which flatters the count by thirty and makes the gap look smaller, not larger. Those four together account for a hundred and forty-six books at the very most. During the refit in August a contractor cleared the two bays of withdrawn stock into a skip. Nobody marked those books as withdrawn in the catalogue, because marking them was the librarian's job and she was on leave. The two bays held between six and seven hundred books on each of their eleven shelves. That is the only event in the year that is the right size to explain the gap.",
    q: "Where did fourteen hundred books go?",
    s: [
      { who: "🗑️ The skip during the refit", why: "a contractor cleared two bays of withdrawn stock into a skip and nobody marked them as withdrawn" },
      { who: "📅 Overdue loans", why: "the loans system lists sixty books out past their due date, which is sixty books and not fourteen hundred" },
      { who: "🔀 Misshelved books", why: "a shelf survey found forty-one books filed in the wrong room, and a book in the wrong room is still in the building" },
      { who: "🕵️ Theft", why: "the theft log records about fifteen losses a year for the last three years, which comes to forty-five" },
      { who: "🔢 The double-counted shelf", why: "one shelf was counted twice, which flatters the count by thirty and makes the gap look smaller, not larger" },
    ],
    who: 0,
    answer: "The withdrawn stock went into a skip and was never taken off the catalogue.",
    proof: [
      "“Those four together account for a hundred and forty-six books at the very most.”",
      "“The two bays held between six and seven hundred books on each of their eleven shelves.”",
      "“That is the only event in the year that is the right size to explain the gap.”",
    ],
    clears: [
      "Overdue loans: “sixty books and not fourteen hundred.”",
      "Misshelving: “a book in the wrong room is still in the building.”",
      "Theft: “about fifteen losses a year for the last three years, which comes to forty-five.”",
      "The double count: “makes the gap look smaller, not larger.”",
    ],
    explain:
      "Nobody in this case is lying. Books are overdue, books are misshelved, books are stolen, and the count has a flaw in it. Add every one of them at its worst and you are still twelve hundred short. Only the skip is the right order of magnitude, and the reason it was never suspected is that it was paperwork rather than a loss.",
  },
  {
    t: "The Case of the Bread Order That Doubled",
    tag: "🥪 lunchbox",
    story:
      "The kitchen's bread order has gone from ninety loaves a week to a hundred and fifty, and the business manager wants to know who is eating it. Four answers have been offered and all four are true as far as they go. Twelve pupils joined in September, and twelve pupils eat about four loaves a week between them. The new sandwich option sells forty rounds a day, which the kitchen measured at twenty-seven loaves a week. The waste bin was weighed every day for a fortnight and threw away the equivalent of three loaves. The price per loaf fell in August, which changes the bill and not the number of loaves. Those three real increases come to thirty-four loaves, and the order has risen by sixty. The supplier changed its standard loaf in August from eight hundred grams to four hundred. Ninety of the old loaves was seventy-two kilograms of bread, and a hundred and fifty of the new ones is sixty. The kitchen is baking into more loaves and less bread than it was last year.",
    q: "Why has the bread order risen by sixty loaves?",
    s: [
      { who: "📏 The smaller standard loaf", why: "the supplier changed its standard loaf in August from eight hundred grams to four hundred" },
      { who: "🧒 Twelve new pupils", why: "twelve pupils joined in September, and twelve pupils eat about four loaves a week between them" },
      { who: "🥪 The new sandwich option", why: "the new sandwich option sells forty rounds a day, which the kitchen measured at twenty-seven loaves a week" },
      { who: "🗑️ Waste", why: "the waste bin was weighed every day for a fortnight and threw away the equivalent of three loaves" },
      { who: "💷 The price change", why: "the price per loaf fell in August, which changes the bill and not the number of loaves" },
    ],
    who: 0,
    answer: "The supplier halved the loaf, so the same bread needs twice the loaves.",
    proof: [
      "“Those three real increases come to thirty-four loaves, and the order has risen by sixty.”",
      "“Ninety of the old loaves was seventy-two kilograms of bread, and a hundred and fifty of the new ones is sixty.”",
      "“The kitchen is baking into more loaves and less bread than it was last year.”",
    ],
    clears: [
      "New pupils: “twelve pupils eat about four loaves a week between them.”",
      "The sandwich option: “twenty-seven loaves a week.”",
      "Waste: “threw away the equivalent of three loaves.”",
      "The price: “changes the bill and not the number of loaves.”",
    ],
    explain:
      "Three of the suspects really are adding loaves, and together they add thirty-four of the sixty. The last thirty come from the unit, not from anybody's appetite. Weigh the order instead of counting it and the mystery reverses: the school is eating twelve kilograms less bread than it was a year ago.",
  },
  {
    t: "The Case of the Pencils That Vanished Three Times Faster",
    tag: "✏️ pencil",
    story:
      "The stock cupboard issued nine hundred pencils last year and three thousand this year, for a school that has barely changed size. Four reasons have been put forward, and none of them is invented. Forty more pupils joined, which is seven percent of six hundred, or about sixty-three pencils at last year's rate. Breakages were counted for a fortnight and ran at four a day, which is roughly a hundred and fifty over a year. Pupils do take pencils home, and a sample of thirty bags on one afternoon turned up eleven. The cupboard now issues by the box of twelve rather than singly, which changes how pencils leave the shelf but not how fast they are used up. Those four together cannot reach three hundred. The electric sharpener was installed in September beside the cupboard. A hand sharpener takes about a millimetre off a pencil and the electric one takes four before it stops. A pencil that used to last nine weeks now lasts three. Three times the consumption on nine hundred is twenty-seven hundred, and twenty-seven hundred is the gap.",
    q: "Why did pencil use triple?",
    s: [
      { who: "🔌 The electric sharpener", why: "a hand sharpener takes about a millimetre off a pencil and the electric one takes four before it stops" },
      { who: "🧒 Forty more pupils", why: "forty more pupils is seven percent of six hundred, or about sixty-three pencils at last year's rate" },
      { who: "💥 Breakages", why: "breakages were counted for a fortnight and ran at four a day, which is roughly a hundred and fifty over a year" },
      { who: "🎒 Pencils taken home", why: "a sample of thirty bags on one afternoon turned up eleven" },
      { who: "📦 Issuing by the box", why: "issuing by the box changes how pencils leave the shelf but not how fast they are used up" },
    ],
    who: 0,
    answer: "The electric sharpener eats four times as much pencil per sharpening.",
    proof: [
      "“Those four together cannot reach three hundred.”",
      "“A pencil that used to last nine weeks now lasts three.”",
      "“Three times the consumption on nine hundred is twenty-seven hundred, and twenty-seven hundred is the gap.”",
    ],
    clears: [
      "More pupils: “about sixty-three pencils at last year's rate.”",
      "Breakages: “roughly a hundred and fifty over a year.”",
      "Taken home: “a sample of thirty bags on one afternoon turned up eleven.”",
      "Issuing by the box: “changes how pencils leave the shelf but not how fast they are used up.”",
    ],
    explain:
      "Growth, breakage and pilfering are all real and all small, and the box system moves pencils without consuming them. The sharpener is the only suspect that multiplies rather than adds, and multiplying is what a threefold rise needs. Four millimetres a sharpening is nothing to watch and everything to the total.",
  },
  {
    t: "The Case of the Orchard That Lost Three Quarters",
    tag: "🍎 apple",
    story:
      "The school orchard picked four hundred kilograms last autumn and ninety this one, and four causes have been proposed by four different people. Each of them is genuinely at work in that orchard. The neighbour's new hedge shades two of the eleven trees, so at the very worst it can cost two elevenths of the crop. Wasp damage was counted on a sample of two hundred apples and came to five percent. The trees have not been pruned for three years, which the county guide says costs about fifteen percent of a yield. Apples crop heavily one year and lightly the next, which can halve a harvest on its own. Put every one of those at its maximum and you still have well over a hundred and fifty kilograms. The weather station logged minus three degrees on the night of the twenty-second of April. The trees were in full flower that night, and a frost at full flower kills the flowers outright. No flower means no fruit at all from that tree, not a reduced crop. The two trees against the south wall flower a week later than the rest, and they carried most of the ninety kilograms.",
    q: "What took three quarters of the crop?",
    s: [
      { who: "❄️ The April frost", why: "the weather station logged minus three degrees on the night of the twenty-second of April, when the trees were in full flower" },
      { who: "🌳 The neighbour's hedge", why: "the hedge shades two of the eleven trees, so at the very worst it can cost two elevenths of the crop" },
      { who: "🐝 Wasps", why: "wasp damage was counted on a sample of two hundred apples and came to five percent" },
      { who: "✂️ No pruning", why: "the county guide says three years without pruning costs about fifteen percent of a yield" },
      { who: "🔄 Biennial cropping", why: "apples crop heavily one year and lightly the next, which can halve a harvest on its own" },
    ],
    who: 0,
    answer: "A frost on the night of the twenty-second killed the blossom.",
    proof: [
      "“Put every one of those at its maximum and you still have well over a hundred and fifty kilograms.”",
      "“No flower means no fruit at all from that tree, not a reduced crop.”",
      "“The two trees against the south wall flower a week later than the rest, and they carried most of the ninety kilograms.”",
    ],
    clears: [
      "The hedge: “at the very worst it can cost two elevenths of the crop.”",
      "Wasps: “came to five percent.”",
      "No pruning: “costs about fifteen percent of a yield.”",
      "Biennial cropping: “which can halve a harvest on its own.”",
    ],
    explain:
      "Four real reductions, stacked at their worst, still leave more than a hundred and fifty kilograms on the trees. Only the frost works by subtraction to zero rather than by percentage, and the two late-flowering trees prove it: they missed the cold night and they carried the harvest.",
  },
  {
    t: "The Case of the Ride That Took Thirteen Minutes Longer",
    tag: "🚲 bike",
    story:
      "Noor's five-kilometre ride to school has gone from eighteen minutes to thirty-one, and she has four theories, all of them founded on something real. The new traffic lights at the bridge were timed over a week and cost her an average of forty seconds. Her rear tyre is soft, and the cycling club's own figures put a soft tyre at about a minute over five kilometres. The roadworks detour was measured on the map at six hundred extra metres, which is two minutes at her speed. There has been a headwind most mornings this month, worth perhaps a minute on an exposed road. Those four add up to four and a half minutes against a loss of thirteen. The rear brake was adjusted in March and the pad has sat against the rim ever since. A wheel lifted off the ground and spun by hand stops in two seconds, where a free wheel spins for forty. A brake that never lets go is working against her for every metre of the ride, uphill, downhill and flat. Nothing else in the list is still costing her anything once she is past it.",
    q: "What is taking the extra time?",
    s: [
      { who: "🛑 The rubbing brake pad", why: "the rear brake was adjusted in March and the pad has sat against the rim ever since" },
      { who: "🚦 The new traffic lights", why: "the new traffic lights at the bridge were timed over a week and cost her an average of forty seconds" },
      { who: "🛞 The soft tyre", why: "the cycling club's own figures put a soft tyre at about a minute over five kilometres" },
      { who: "🚧 The roadworks detour", why: "the detour was measured on the map at six hundred extra metres, which is two minutes at her speed" },
      { who: "💨 The headwind", why: "there has been a headwind most mornings this month, worth perhaps a minute on an exposed road" },
    ],
    who: 0,
    answer: "A brake pad has been dragging on the rim since March.",
    proof: [
      "“Those four add up to four and a half minutes against a loss of thirteen.”",
      "“A wheel lifted off the ground and spun by hand stops in two seconds, where a free wheel spins for forty.”",
      "“A brake that never lets go is working against her for every metre of the ride, uphill, downhill and flat.”",
    ],
    clears: [
      "The lights: “cost her an average of forty seconds.”",
      "The tyre: “about a minute over five kilometres.”",
      "The detour: “which is two minutes at her speed.”",
      "The wind: “worth perhaps a minute on an exposed road.”",
    ],
    explain:
      "Four honest delays, four and a half minutes between them. The brake is different in kind as well as in size, because the others take their toll at one place or in one condition and the brake takes its toll continuously. The spin test turns that into a number anybody can check in ten seconds.",
  },
  {
    t: "The Case of the Nine Missing Litres",
    tag: "🐠 fishtank",
    story:
      "The ninety-litre class tank drops nine litres a week, and the log carries four suggestions from four different weeks. Every one of them loses some water. An open bowl of the same surface area was left beside the tank as a test and evaporated one point two litres in seven days. The filter outlet does splash, but the shelf and the floor under it were dry every morning for a fortnight. Gravel and ornaments were topped up in September and hold water, though a one-off absorption cannot repeat itself every week. The fish were blamed in October, and eleven small fish displace water rather than consuming it. Together those come to under two litres, and seven are unaccounted for. The hose from the external filter weeps where it joins the canister inside the cabinet. The towel under that joint weighs one point one kilograms dry and two point four when it is changed each morning. That is one point three litres a day, which is nine litres a week. The cabinet was not opened at all between September and the week the towel was found.",
    q: "Where are the nine litres going?",
    s: [
      { who: "💧 The weeping filter hose", why: "the hose from the external filter weeps where it joins the canister inside the cabinet" },
      { who: "☁️ Evaporation", why: "an open bowl of the same surface area evaporated one point two litres in seven days" },
      { who: "🌊 Splashing", why: "the filter outlet does splash, but the shelf and the floor under it were dry every morning for a fortnight" },
      { who: "🪨 The gravel", why: "a one-off absorption cannot repeat itself every week" },
      { who: "🐟 The fish", why: "eleven small fish displace water rather than consuming it" },
    ],
    who: 0,
    answer: "A weeping hose joint inside the cabinet loses over a litre a day.",
    proof: [
      "“Together those come to under two litres, and seven are unaccounted for.”",
      "“The towel under that joint weighs one point one kilograms dry and two point four when it is changed each morning.”",
      "“That is one point three litres a day, which is nine litres a week.”",
    ],
    clears: [
      "Evaporation: “evaporated one point two litres in seven days.”",
      "Splashing: “the shelf and the floor under it were dry every morning for a fortnight.”",
      "The gravel: “a one-off absorption cannot repeat itself every week.”",
      "The fish: “displace water rather than consuming it.”",
    ],
    explain:
      "Evaporation is real and it is one and a bit litres. Everything else on the list is either zero or cannot happen twice. The towel is the whole case: weigh it wet, weigh it dry, and the difference is a measurement of the leak rather than an opinion about it.",
  },
  {
    t: "The Case of the Hall That Got Twelve Decibels Louder",
    tag: "🔊 noise",
    story:
      "Assembly measured sixty-six decibels last year and seventy-eight this year, and four changes have been offered to explain it. All four happened. Thirty more children come to assembly, and sound adds on a scale where doubling a crowd buys you three decibels, so thirty more on three hundred is under half of one. The new public address system was measured at seventy decibels a metre from the speaker, which is what the old one gave. The ceiling fan was tested alone in an empty hall and read fifty-one, which is below the level of the room before anybody speaks. The chairs were replaced with plastic ones that squeak, and a squeak is brief and sharp rather than a rise in the whole level. The refit took out the full-length curtains and the carpet at the back and put down a hard floor. Reverberation time in the empty hall has gone from nought point nine seconds to two point six. In a room that holds its sound for nearly three seconds, every voice is still arriving while the next one starts. Nothing in the hall is making more noise than it did; the hall has stopped absorbing it.",
    q: "Why is assembly twelve decibels louder?",
    s: [
      { who: "🎭 The curtains and carpet taken out", why: "the refit took out the full-length curtains and the carpet at the back and put down a hard floor" },
      { who: "🧒 Thirty more children", why: "doubling a crowd buys you three decibels, so thirty more on three hundred is under half of one" },
      { who: "📢 The new public address system", why: "the new system was measured at seventy decibels a metre from the speaker, which is what the old one gave" },
      { who: "🌀 The ceiling fan", why: "the fan was tested alone in an empty hall and read fifty-one, which is below the level of the room before anybody speaks" },
      { who: "🪑 The new chairs", why: "a squeak is brief and sharp rather than a rise in the whole level" },
    ],
    who: 0,
    answer: "The refit stripped out everything in the hall that absorbed sound.",
    proof: [
      "“Reverberation time in the empty hall has gone from nought point nine seconds to two point six.”",
      "“In a room that holds its sound for nearly three seconds, every voice is still arriving while the next one starts.”",
      "“Nothing in the hall is making more noise than it did; the hall has stopped absorbing it.”",
    ],
    clears: [
      "More children: “thirty more on three hundred is under half of one.”",
      "The PA: “which is what the old one gave.”",
      "The fan: “read fifty-one, which is below the level of the room before anybody speaks.”",
      "The chairs: “a squeak is brief and sharp rather than a rise in the whole level.”",
    ],
    explain:
      "The crowd is the instinctive answer and the arithmetic kills it: decibels add logarithmically, so you would need six hundred extra children for three. The only change big enough is the one that altered what happens to sound after it is made, and the reverberation figure measures exactly that.",
  },
  {
    t: "The Case of the Drain That Everyone Blamed on Leaves",
    tag: "🍂 leaves",
    story:
      "The yard floods to a depth of ten centimetres in any heavy rain, and leaves have been blamed for three autumns. The gully was rodded and cleared the morning before the last storm and the yard flooded anyway. The gutter guards were fitted in September and the gutters were found clear afterwards. The sycamores do drop about twenty-five kilograms of litter each, which is a genuine nuisance and a slow one. The drain itself is a hundred millimetre pipe, and the manufacturer rates it at two thousand litres an hour. Thirty millimetres of rain fell in that hour onto the original roof, which measures three hundred square metres. Three hundred square metres taking thirty millimetres is nine thousand litres in one hour. The new sports hall roof was finished in July and plumbed into the same downpipe. It adds a hundred and eighty square metres, which is another five thousand four hundred litres in the same hour. A pipe rated for two thousand litres is being asked to take fourteen thousand. Clearing leaves out of a pipe does not make the pipe any wider.",
    q: "Why does the yard flood?",
    s: [
      { who: "🏗️ The new roof on the same downpipe", why: "the new sports hall roof adds a hundred and eighty square metres, which is another five thousand four hundred litres in the same hour" },
      { who: "🍁 Leaves in the gully", why: "the gully was rodded and cleared the morning before the last storm and the yard flooded anyway" },
      { who: "🌳 The sycamores", why: "the sycamores do drop about twenty-five kilograms of litter each, which is a genuine nuisance and a slow one" },
      { who: "🛡️ The gutter guards", why: "the gutter guards were fitted in September and the gutters were found clear afterwards" },
      { who: "🌧️ The storm", why: "thirty millimetres of rain fell in that hour onto the original roof, which measures three hundred square metres" },
    ],
    who: 0,
    answer: "A second roof was plumbed into a downpipe already at its limit.",
    proof: [
      "“The drain itself is a hundred millimetre pipe, and the manufacturer rates it at two thousand litres an hour.”",
      "“A pipe rated for two thousand litres is being asked to take fourteen thousand.”",
      "“Clearing leaves out of a pipe does not make the pipe any wider.”",
    ],
    clears: [
      "Leaves in the gully: “the gully was rodded and cleared the morning before the last storm and the yard flooded anyway.”",
      "The sycamores: “a genuine nuisance and a slow one.”",
      "The gutter guards: “the gutters were found clear afterwards.”",
      "The storm: “thirty millimetres of rain fell in that hour onto the original roof, which measures three hundred square metres.”",
    ],
    explain:
      "Three autumns of blaming leaves, and the clearing test settles it in one morning: cleared pipe, same flood. The storm is real and the old roof alone already overran the pipe by four and a half times. The extra roof is what turned an occasional overflow into every heavy rain, and no amount of sweeping addresses it.",
  },
  {
    t: "The Case of the Pumpkin That Stopped Growing",
    tag: "🎃 pumpkin",
    story:
      "The competition pumpkin reached sixty kilograms when the seed packet promises two hundred, and four growers have offered four reasons. None of them is nonsense. It was given ninety litres of water a day against a recommended eighty, and too much water swells a fruit rather than starving it. A soil test in June came back normal for nitrogen, phosphorus and potassium. It was pollinated on the eleventh of June, which is four days later than ideal and costs perhaps a week of growing. The patch gets six hours of direct sun where the guide asks for eight, which is a real shortfall of a quarter. Taken together those might take fifty kilograms off a record, and a hundred and forty are missing. The main vine was cut through by a mower on the twenty-ninth of July, forty days in. A pumpkin is fed by its leaves and everything they make travels to the fruit along that one vine. Before the cut it was drawing on about four hundred leaves and afterwards on the six beyond the break. The fruit measured eleven kilograms a day in July and under one kilogram a day in August.",
    q: "Why did the pumpkin stop at sixty kilograms?",
    s: [
      { who: "🚜 The severed main vine", why: "the main vine was cut through by a mower on the twenty-ninth of July, forty days in" },
      { who: "🚿 Too much water", why: "it was given ninety litres a day against a recommended eighty, and too much water swells a fruit rather than starving it" },
      { who: "🧪 The soil", why: "a soil test in June came back normal for nitrogen, phosphorus and potassium" },
      { who: "🐝 Late pollination", why: "it was pollinated four days later than ideal, which costs perhaps a week of growing" },
      { who: "☀️ Too little sun", why: "the patch gets six hours of direct sun where the guide asks for eight, which is a real shortfall of a quarter" },
    ],
    who: 0,
    answer: "A mower cut the vine and left the fruit with six leaves instead of four hundred.",
    proof: [
      "“Taken together those might take fifty kilograms off a record, and a hundred and forty are missing.”",
      "“Before the cut it was drawing on about four hundred leaves and afterwards on the six beyond the break.”",
      "“The fruit measured eleven kilograms a day in July and under one kilogram a day in August.”",
    ],
    clears: [
      "Too much water: “swells a fruit rather than starving it.”",
      "The soil: “came back normal for nitrogen, phosphorus and potassium.”",
      "Late pollination: “costs perhaps a week of growing.”",
      "Too little sun: “a real shortfall of a quarter.”",
    ],
    explain:
      "Water, soil, timing and sun are the four things a grower controls, and three of them were slightly wrong in ways worth fifty kilograms. The mower is worth a hundred and forty because it did not reduce the supply, it cut it off. The daily weights show the exact day the factory closed.",
  },
  {
    t: "The Case of the Four Kilograms of Mud",
    tag: "👣 footprints",
    story:
      "The cleaners weigh what they sweep off the main corridor and it runs at four kilograms of dried mud a day. Four sources have been named and every one of them does bring mud in. The football pitch is the obvious culprit, except that boots are changed in the boot room and the mat there was weighed at four hundred grams a day. Six builders sign in through the side door, and six pairs of boots on a scraper mat cannot carry four kilograms between them. The gravel path from the gate is dry and loose, and what comes off it is dust rather than mud. The reception children's garden is wet, but reception has its own door at the far end and its own corridor. Those four together were measured over a week at under seven hundred grams a day. In October a shortcut appeared across the field, and the grass along it is worn to bare soil for forty metres. A count on three mornings found a hundred and eighty children using it. Twenty grams on a shoe is a smear nobody would notice, and a hundred and eighty of them is three point six kilograms.",
    q: "Where is four kilograms of mud a day coming from?",
    s: [
      { who: "🥾 The worn shortcut across the field", why: "a shortcut appeared across the field, and the grass along it is worn to bare soil for forty metres" },
      { who: "⚽ The football pitch", why: "boots are changed in the boot room and the mat there was weighed at four hundred grams a day" },
      { who: "👷 The builders", why: "six pairs of boots on a scraper mat cannot carry four kilograms between them" },
      { who: "🪨 The gravel path", why: "the gravel path from the gate is dry and loose, and what comes off it is dust rather than mud" },
      { who: "🌱 The reception garden", why: "reception has its own door at the far end and its own corridor" },
    ],
    who: 0,
    answer: "A hundred and eighty children are crossing bare soil on the shortcut.",
    proof: [
      "“Those four together were measured over a week at under seven hundred grams a day.”",
      "“A count on three mornings found a hundred and eighty children using it.”",
      "“Twenty grams on a shoe is a smear nobody would notice, and a hundred and eighty of them is three point six kilograms.”",
    ],
    clears: [
      "The pitch: “the mat there was weighed at four hundred grams a day.”",
      "The builders: “six pairs of boots on a scraper mat cannot carry four kilograms between them.”",
      "The gravel: “what comes off it is dust rather than mud.”",
      "Reception: “reception has its own door at the far end and its own corridor.”",
    ],
    explain:
      "Everybody looks for the muddiest feet, and the muddiest feet are a handful of pairs. The answer is the cleanest feet multiplied by a hundred and eighty. A source too small to see on any single shoe is the largest source in the building, which is what a count is for.",
  },
  {
    t: "The Case of the Fuel Bill That Rose a Third",
    tag: "🚌 bus",
    story:
      "The minibus burned two thousand six hundred litres last spring and three thousand four hundred this spring, and four reasons have been put forward by the office. Each describes something that really changed. Fuel went up nine percent a litre in October, which raises the bill and leaves the litres exactly where they were. The route was altered in November and the new one is one point two kilometres longer on twenty-six, which is five percent. The driver's log shows an average of twelve minutes idling at the depot each day, worth about three percent of the fuel. The tyres were found twenty percent under pressure in February, which the manufacturer puts at three percent on consumption. Added together those changes account for eleven percent, and the rise is thirty-one. The second minibus failed its test in September and has been off the road since. This bus has covered the other route as well on Tuesdays, Thursdays and Fridays. The odometer reads nine thousand four hundred kilometres last spring and twelve thousand two hundred this spring. Thirty percent more distance in a vehicle that has not otherwise changed burns thirty percent more fuel.",
    q: "Why has the fuel use risen by a third?",
    s: [
      { who: "🛣️ Covering the second route", why: "the second minibus failed its test in September, and this bus has covered the other route on Tuesdays, Thursdays and Fridays" },
      { who: "💷 The price of fuel", why: "fuel went up nine percent a litre in October, which raises the bill and leaves the litres exactly where they were" },
      { who: "🗺️ The longer route", why: "the new route is one point two kilometres longer on twenty-six, which is five percent" },
      { who: "🕰️ Idling at the depot", why: "an average of twelve minutes idling each day is worth about three percent of the fuel" },
      { who: "🛞 Soft tyres", why: "the tyres were twenty percent under pressure, which the manufacturer puts at three percent on consumption" },
    ],
    who: 0,
    answer: "The bus is covering two routes because the other minibus is off the road.",
    proof: [
      "“Added together those changes account for eleven percent, and the rise is thirty-one.”",
      "“The odometer reads nine thousand four hundred kilometres last spring and twelve thousand two hundred this spring.”",
      "“Thirty percent more distance in a vehicle that has not otherwise changed burns thirty percent more fuel.”",
    ],
    clears: [
      "The price: “raises the bill and leaves the litres exactly where they were.”",
      "The route: “one point two kilometres longer on twenty-six, which is five percent.”",
      "Idling: “worth about three percent of the fuel.”",
      "The tyres: “three percent on consumption.”",
    ],
    explain:
      "The price of fuel is the loudest change of the year and it cannot move a count of litres at all. The other three are real and come to eleven percent between them. The odometer settles it without any argument about efficiency: the bus went thirty percent further.",
  },
  {
    t: "The Case of the Sports Fund That Was Eighteen Hundred Short",
    tag: "🏆 trophy",
    story:
      "The sports fund should hold two thousand four hundred pounds and the statement shows five hundred and sixty. Four explanations are on the table and each one is a genuine outgoing. The engraving on the county trophy cost a hundred and ten pounds, and the invoice is in the folder. Unpaid subscriptions come to ninety-five pounds, which is money that never arrived rather than money that left. Bank charges run at three pounds a month, which is thirty-six pounds across the year. The cash tin float was raised from twenty pounds to fifty in September, moving thirty pounds rather than spending it. Those four come to two hundred and seventy-one pounds at the very most, and the hole is eighteen hundred and forty. The kit order was placed by the office in June and placed again by the coach in July. Both orders were paid, and the supplier's statement shows two payments of nine hundred and twenty pounds eleven days apart. One delivery was signed for and the second was never chased, because nobody knew to expect it. Eighteen hundred and forty pounds is exactly two times nine hundred and twenty.",
    q: "Where did the money go?",
    s: [
      { who: "🧾 The kit order paid twice", why: "the supplier's statement shows two payments of nine hundred and twenty pounds eleven days apart" },
      { who: "🏅 The trophy engraving", why: "the engraving on the county trophy cost a hundred and ten pounds, and the invoice is in the folder" },
      { who: "💰 Unpaid subscriptions", why: "unpaid subscriptions come to ninety-five pounds, which is money that never arrived rather than money that left" },
      { who: "🏦 Bank charges", why: "bank charges run at three pounds a month, which is thirty-six pounds across the year" },
      { who: "🪙 The cash float", why: "the float was raised from twenty pounds to fifty, moving thirty pounds rather than spending it" },
    ],
    who: 0,
    answer: "The kit order was placed and paid for twice.",
    proof: [
      "“Those four come to two hundred and seventy-one pounds at the very most, and the hole is eighteen hundred and forty.”",
      "“The kit order was placed by the office in June and placed again by the coach in July.”",
      "“Eighteen hundred and forty pounds is exactly two times nine hundred and twenty.”",
    ],
    clears: [
      "The engraving: “cost a hundred and ten pounds, and the invoice is in the folder.”",
      "Subscriptions: “money that never arrived rather than money that left.”",
      "Bank charges: “thirty-six pounds across the year.”",
      "The float: “moving thirty pounds rather than spending it.”",
    ],
    explain:
      "Two of these are spending, one is income that failed to arrive, and one is money that only changed pockets. Telling those apart matters, and even so they come to two hundred and seventy-one pounds. The missing figure is not approximately the kit order. It is exactly twice it, and a number that exact is a duplicate.",
  },
  {
    t: "The Case of the Turkey That Took Seven Hours",
    tag: "🦃 turkey",
    story:
      "The turkey needed seven hours when the recipe allowed four and a half, and four reasons have been offered around the table. Every one of them does slow a roast. The bird came in half a kilogram over the weight planned for, and the recipe gives forty minutes a kilogram, so that is twenty minutes. The oven door was opened six times, and each opening costs about five minutes of recovery, which is half an hour. The bird was covered in foil for the first three hours, which the recipe expects and allows for. It went in straight from the fridge rather than standing out, and that is worth perhaps fifteen minutes on a bird this size. Those four come to an hour and five minutes against a delay of two and a half hours. A probe thermometer left in the oven read a hundred and twenty degrees all afternoon. The dial had been turned to the setting marked with a snowflake, which is the slow defrost programme. Cooking at a hundred and twenty instead of a hundred and eighty is not a delay of minutes but a different rate altogether. Nothing else on the list changes the temperature the meat is sitting in.",
    q: "Why did the turkey take seven hours?",
    s: [
      { who: "🌡️ The oven on the defrost setting", why: "a probe thermometer left in the oven read a hundred and twenty degrees all afternoon" },
      { who: "⚖️ The heavier bird", why: "half a kilogram over at forty minutes a kilogram is twenty minutes" },
      { who: "🚪 The oven door", why: "the door was opened six times, and each opening costs about five minutes of recovery" },
      { who: "🧻 The foil", why: "the bird was covered in foil for the first three hours, which the recipe expects and allows for" },
      { who: "🧊 Straight from the fridge", why: "going in straight from the fridge is worth perhaps fifteen minutes on a bird this size" },
    ],
    who: 0,
    answer: "The oven was running at a hundred and twenty degrees all afternoon.",
    proof: [
      "“Those four come to an hour and five minutes against a delay of two and a half hours.”",
      "“The dial had been turned to the setting marked with a snowflake, which is the slow defrost programme.”",
      "“Cooking at a hundred and twenty instead of a hundred and eighty is not a delay of minutes but a different rate altogether.”",
    ],
    clears: [
      "The heavier bird: “the recipe gives forty minutes a kilogram, so that is twenty minutes.”",
      "The door: “each opening costs about five minutes of recovery, which is half an hour.”",
      "The foil: “which the recipe expects and allows for.”",
      "The fridge: “worth perhaps fifteen minutes on a bird this size.”",
    ],
    explain:
      "Four honest delays, an hour and five minutes between them, and every one of them adds a fixed lump of time. The oven setting is not a lump, it is a rate, and a rate applies to every minute of the cook. That is why a sixty-degree error outweighs everything else put together.",
  },
  {
    t: "The Case of the Bake Sale That Made Sixty-Two Pounds",
    tag: "🧁 cupcake",
    story:
      "The bake sale took two hundred and forty pounds at the table and handed sixty-two pounds to the fund. Four losses have been offered to explain the difference and all four happened. Eleven cupcakes were dropped or crushed before the sale opened, which at a pound and twenty is thirteen pounds of stock that was never sold. Fourteen were given free to helpers, worth sixteen pounds eighty. The last thirty were cut to sixty pence at half past three, which gave away eighteen pounds against the full price. The float of twenty pounds was counted into the takings by mistake and taken out again, so it changes nothing. Those real losses come to forty-eight pounds, and a hundred and seventy-eight pounds are missing. The ingredients were bought at the corner shop on the morning of the sale. Butter, eggs and ground almonds for two hundred cakes cost a hundred and sixty-one pounds there. The same list at the supermarket two streets away comes to forty-three pounds. Nobody in the planning meeting ever subtracted the ingredients from the takings at all.",
    q: "Why did a two hundred pound sale raise sixty-two?",
    s: [
      { who: "🛒 The corner shop ingredients", why: "butter, eggs and ground almonds for two hundred cakes cost a hundred and sixty-one pounds at the corner shop" },
      { who: "💥 Crushed cupcakes", why: "eleven cupcakes were crushed before the sale opened, which at a pound and twenty is thirteen pounds" },
      { who: "🎁 Free cakes for helpers", why: "fourteen were given free to helpers, worth sixteen pounds eighty" },
      { who: "🏷️ The late price cut", why: "the last thirty were cut to sixty pence, which gave away eighteen pounds against the full price" },
      { who: "🪙 The float", why: "the float of twenty pounds was counted into the takings by mistake and taken out again, so it changes nothing" },
    ],
    who: 0,
    answer: "The ingredients cost a hundred and sixty-one pounds at the corner shop.",
    proof: [
      "“Those real losses come to forty-eight pounds, and a hundred and seventy-eight pounds are missing.”",
      "“The same list at the supermarket two streets away comes to forty-three pounds.”",
      "“Nobody in the planning meeting ever subtracted the ingredients from the takings at all.”",
    ],
    clears: [
      "Crushed cakes: “which at a pound and twenty is thirteen pounds of stock that was never sold.”",
      "Free cakes: “worth sixteen pounds eighty.”",
      "The price cut: “which gave away eighteen pounds against the full price.”",
      "The float: “so it changes nothing.”",
    ],
    explain:
      "Three small losses and one that is not a loss at all. The meeting spent its time on the forty-eight pounds it could see at the table, because that is where the cakes were. The hundred and sixty-one pounds left the fund at eight in the morning, before a single cake was baked.",
  },
  {
    t: "The Case of the Mittens That Only Failed in the Wind",
    tag: "🧤 mitten",
    story:
      "The knitted mittens keep hands warm on the playground and the bought ones do not, and four differences have been suggested. All four are real differences between the two pairs. The knitted ones measure four millimetres thick and the bought ones three, which the textile table puts at about one degree of difference. The knitted ones are wool and the bought ones acrylic, worth roughly another degree when dry. The knitted cuff is six centimetres longer, which keeps the wrist covered and is worth about half a degree. The bought pair is black and the knitted pair cream, and colour does nothing at all on a cloudy day. Measured indoors in still air, hands in the two pairs finished within one degree of each other. Held in front of a fan at twenty kilometres an hour, the bought pair dropped eleven degrees and the knitted pair dropped two. The bought knit has visible holes between the stitches that air passes straight through. The knitted pair was made on small needles at a tension that leaves no gaps. Still air trapped in a fabric is what keeps a hand warm, and wind takes that air away.",
    q: "Why do the bought mittens fail?",
    s: [
      { who: "🌬️ The loose knit the wind blows through", why: "the bought knit has visible holes between the stitches that air passes straight through" },
      { who: "📏 Thickness", why: "four millimetres against three is about one degree of difference in the textile table" },
      { who: "🐑 Wool against acrylic", why: "wool against acrylic is worth roughly another degree when dry" },
      { who: "🧵 The longer cuff", why: "the knitted cuff is six centimetres longer, which is worth about half a degree" },
      { who: "🎨 The colour", why: "the bought pair is black and the knitted pair cream, and colour does nothing at all on a cloudy day" },
    ],
    who: 0,
    answer: "Wind goes straight through the gaps in the bought knit.",
    proof: [
      "“Measured indoors in still air, hands in the two pairs finished within one degree of each other.”",
      "“Held in front of a fan at twenty kilometres an hour, the bought pair dropped eleven degrees and the knitted pair dropped two.”",
      "“Still air trapped in a fabric is what keeps a hand warm, and wind takes that air away.”",
    ],
    clears: [
      "Thickness: “which the textile table puts at about one degree of difference.”",
      "The fibre: “worth roughly another degree when dry.”",
      "The cuff: “which keeps the wrist covered and is worth about half a degree.”",
      "The colour: “colour does nothing at all on a cloudy day.”",
    ],
    explain:
      "Indoors the two pairs are the same, which means none of the four differences amounts to much on its own. Put them in wind and one of them becomes nine degrees. A property that is worth nothing in one condition and everything in another is still the answer, and the playground is the condition that counts.",
  },
  {
    t: "The Case of the House That Would Not Stand Up",
    tag: "🎄 ginger",
    story:
      "The gingerbread house fell in on itself twice, and four reasons were offered by four bakers. All four are genuine weaknesses in that build. The kitchen was humid from the oven, and damp softens royal icing by about a tenth of its strength. The sweets stuck to the walls weigh forty-six grams altogether, against roof panels of a hundred and eighty grams each. The baking board flexes if you lift it from one corner, and it was carried flat on a tray both times. The panels came out two millimetres thinner than the pattern asks for, which weakens the gingerbread itself and not the joints. Those four between them change the load by well under a tenth. A royal icing joint cured for twelve hours holds about nine hundred grams before it gives way. The same joint after forty minutes holds about sixty grams. Each wall is carrying two hundred and forty grams of roof once the panels are on. The house was assembled forty minutes after the icing was piped, because the class ends at three.",
    q: "Why did the house collapse?",
    s: [
      { who: "⏱️ Icing given forty minutes to cure", why: "the house was assembled forty minutes after the icing was piped, because the class ends at three" },
      { who: "💨 The humid kitchen", why: "damp softens royal icing by about a tenth of its strength" },
      { who: "🍬 The sweets on the walls", why: "the sweets weigh forty-six grams altogether, against roof panels of a hundred and eighty grams each" },
      { who: "🪵 The flexing board", why: "the baking board flexes if you lift it from one corner, and it was carried flat on a tray both times" },
      { who: "📐 The thin panels", why: "the panels came out two millimetres thinner than the pattern asks, which weakens the gingerbread and not the joints" },
    ],
    who: 0,
    answer: "The icing had forty minutes to set when it needed twelve hours.",
    proof: [
      "“A royal icing joint cured for twelve hours holds about nine hundred grams before it gives way.”",
      "“The same joint after forty minutes holds about sixty grams.”",
      "“Each wall is carrying two hundred and forty grams of roof once the panels are on.”",
    ],
    clears: [
      "The humidity: “damp softens royal icing by about a tenth of its strength.”",
      "The sweets: “weigh forty-six grams altogether, against roof panels of a hundred and eighty grams each.”",
      "The board: “it was carried flat on a tray both times.”",
      "The thin panels: “which weakens the gingerbread itself and not the joints.”",
    ],
    explain:
      "Three of the suspects adjust the load by a few percent and one weakens the wrong part. The cure time is not a few percent. Sixty grams of strength under two hundred and forty grams of roof is a house that was going to fall whatever else was true of it.",
  },
  {
    t: "The Case of the Lights That Never Went Off",
    tag: "💡 lights",
    story:
      "The hall's lighting cost forty pounds a month last year and three hundred and ten this year. Four changes have been blamed and each of them really did happen in that hall. The thirty-six new panels draw eighteen watts each, where the old fittings drew fifty-eight, so the new ones use less. The string of festive lights draws a hundred and twenty watts for six hours a day, which is about six pounds a month. The unit price of electricity rose nine percent in October, which is three pounds sixty on last year's bill. The hall is booked for twelve more hours a month than it was, which at the panels' draw is under three pounds. Those changes cannot account for more than a tenth of the rise. The movement sensor fitted in September was wired to the wrong terminal and holds the lights on permanently. Thirty-six panels at eighteen watts is six hundred and forty-eight watts, and the hall was lit for ninety hours a month before. It is now lit for all seven hundred and twenty hours in a month, including every night and every weekend. Eight times the hours on the same fittings is eight times the bill.",
    q: "Why did the lighting bill rise eightfold?",
    s: [
      { who: "🕹️ The miswired movement sensor", why: "the movement sensor fitted in September was wired to the wrong terminal and holds the lights on permanently" },
      { who: "🔆 The new panels", why: "the new panels draw eighteen watts each, where the old fittings drew fifty-eight, so the new ones use less" },
      { who: "🎄 The festive lights", why: "a hundred and twenty watts for six hours a day is about six pounds a month" },
      { who: "📈 The unit price", why: "the unit price rose nine percent in October, which is three pounds sixty on last year's bill" },
      { who: "📅 Extra bookings", why: "twelve more hours a month at the panels' draw is under three pounds" },
    ],
    who: 0,
    answer: "A miswired sensor has kept the hall lit twenty-four hours a day.",
    proof: [
      "“Those changes cannot account for more than a tenth of the rise.”",
      "“The hall was lit for ninety hours a month before.”",
      "“It is now lit for all seven hundred and twenty hours in a month, including every night and every weekend.”",
    ],
    clears: [
      "The panels: “so the new ones use less.”",
      "The festive lights: “about six pounds a month.”",
      "The unit price: “which is three pounds sixty on last year's bill.”",
      "Extra bookings: “under three pounds.”",
    ],
    explain:
      "The new panels are the first thing anyone blames and they cut the draw by two thirds. Nothing on the list changes the wattage enough to matter. What changed is the hours, from ninety to seven hundred and twenty, and a bill is watts multiplied by hours whichever of the two you move.",
  },
  {
    t: "The Case of the Bell That Drifted Ninety Seconds",
    tag: "⏰ clock",
    story:
      "The end-of-day bell rings ninety seconds late by Friday and on time again on Monday, and four causes have been suggested. All four are real sources of error in that system. The bell timer's own quartz is specified to drift two seconds a month, which is less than half a second across a week. The relay that fires the bell was measured with a stopwatch and lags four tenths of a second. There was one power cut in October, and a power cut stops the clock rather than slowing it, and it would show as a jump on one day. The timer is reset by hand each half term, which corrects the error rather than creating it. Those four cannot produce more than a second or two across five days. The caretaker synchronises the bell timer to the office clock every morning. The office clock is itself set each morning against the deputy head's watch. That watch was checked against the speaking clock and gains eighteen seconds a day. Eighteen seconds carried forward five mornings in a row is ninety seconds by Friday, and Monday starts again from zero.",
    q: "Why does the bell drift by ninety seconds?",
    s: [
      { who: "⌚ The watch the office clock is set by", why: "the watch was checked against the speaking clock and gains eighteen seconds a day" },
      { who: "🔋 The timer's quartz", why: "the timer's quartz is specified to drift two seconds a month, which is less than half a second across a week" },
      { who: "🔌 The relay", why: "the relay was measured with a stopwatch and lags four tenths of a second" },
      { who: "⚡ The October power cut", why: "a power cut stops the clock rather than slowing it, and it would show as a jump on one day" },
      { who: "🛠️ The half term reset", why: "the timer is reset by hand each half term, which corrects the error rather than creating it" },
    ],
    who: 0,
    answer: "The watch the whole chain is set from gains eighteen seconds a day.",
    proof: [
      "“Those four cannot produce more than a second or two across five days.”",
      "“The caretaker synchronises the bell timer to the office clock every morning.”",
      "“Eighteen seconds carried forward five mornings in a row is ninety seconds by Friday, and Monday starts again from zero.”",
    ],
    clears: [
      "The quartz: “less than half a second across a week.”",
      "The relay: “lags four tenths of a second.”",
      "The power cut: “it would show as a jump on one day.”",
      "The reset: “which corrects the error rather than creating it.”",
    ],
    explain:
      "Every component in the bell system is accurate to within a second or two a week, and the system is ninety seconds out. The error is not in any component. It is in the daily habit of copying a time from a watch nobody ever checked, and copying it again the next morning on top of yesterday's copy.",
  },
  {
    t: "The Case of the Eight Degrees Lost Overnight",
    tag: "⛄ snow",
    story:
      "The school was nineteen degrees at six on Thursday evening and eleven degrees at six on Friday morning. Four causes have been offered for the drop and every one of them does lose heat from that building. The fire door at the end of the science block was propped open, and a gap that size is worth about a degree over a night. The single-glazed windows along the north side were measured by the surveyor at roughly one and a half degrees across a cold night. The loft hatch above the stairs was left open, which the same survey put at half a degree. The thermostat is set back to twelve overnight, which is where the heating stops helping rather than a thing that takes heat away. Those four together come to about three degrees against a fall of eight. The boiler fault log shows a lockout at ten past eleven and no firing at all until the caretaker reset it at half past six. A building with the heating off does not lose heat faster, it simply stops being given any. The surveyor's own figure for this building unheated on a night below zero is seven to nine degrees.",
    q: "Why did the school lose eight degrees?",
    s: [
      { who: "🔥 The boiler lockout", why: "the fault log shows a lockout at ten past eleven and no firing at all until half past six" },
      { who: "🚪 The propped fire door", why: "a gap that size is worth about a degree over a night" },
      { who: "🪟 The single glazing", why: "the surveyor measured the north windows at roughly one and a half degrees across a cold night" },
      { who: "🪜 The open loft hatch", why: "the same survey put the open hatch at half a degree" },
      { who: "🎛️ The overnight setback", why: "the setback is where the heating stops helping rather than a thing that takes heat away" },
    ],
    who: 0,
    answer: "The boiler locked out at eleven and did not fire again until morning.",
    proof: [
      "“Those four together come to about three degrees against a fall of eight.”",
      "“A building with the heating off does not lose heat faster, it simply stops being given any.”",
      "“The surveyor's own figure for this building unheated on a night below zero is seven to nine degrees.”",
    ],
    clears: [
      "The fire door: “a gap that size is worth about a degree over a night.”",
      "The windows: “roughly one and a half degrees across a cold night.”",
      "The loft hatch: “which the same survey put at half a degree.”",
      "The setback: “which is where the heating stops helping rather than a thing that takes heat away.”",
    ],
    explain:
      "Three real draughts and one thing that is not a draught at all. Added at their worst they are three degrees. The building is designed to lose seven to nine with nothing coming in, which is a figure that was already written down, and the fault log says nothing came in from ten past eleven.",
  },
  {
    t: "The Case of the Two Kilograms of Seed a Day",
    tag: "🐦 feeder",
    story:
      "The feeders on the field are emptying two kilograms of seed a day, and four eaters have been blamed by the four people who watch them. All four are genuinely eating from them. The sparrows are the birds everyone sees, and a count at nine in the morning found about twenty on the feeders at once. A sparrow eats around five grams of seed in a day, so twenty sparrows is a hundred grams. Two squirrels have been photographed on the poles, and a grey squirrel takes perhaps eighty grams a day each. The catch tray underneath was emptied and weighed for a week and held sixty grams of spilled seed a day. The finches come in ones and twos and eat about the same as a sparrow. Those four together are under four hundred grams of the two thousand. The pigeons arrive at half past three, after the watchers have gone home, and the caretaker counted forty on and under the feeders. A woodpigeon eats about forty grams of grain a day, and forty of them is sixteen hundred grams. The birds that are seen all day are the ones that eat least.",
    q: "What is eating two kilograms a day?",
    s: [
      { who: "🕊️ The pigeons after half past three", why: "the caretaker counted forty on and under the feeders, and a woodpigeon eats about forty grams of grain a day" },
      { who: "🐤 The sparrows", why: "a count found about twenty at once, and a sparrow eats around five grams in a day" },
      { who: "🐿️ The squirrels", why: "two squirrels have been photographed, and a grey squirrel takes perhaps eighty grams a day each" },
      { who: "🫗 Spillage", why: "the catch tray was emptied and weighed for a week and held sixty grams of spilled seed a day" },
      { who: "🐦‍⬛ The finches", why: "the finches come in ones and twos and eat about the same as a sparrow" },
    ],
    who: 0,
    answer: "Forty pigeons arrive after the watchers have gone home.",
    proof: [
      "“Those four together are under four hundred grams of the two thousand.”",
      "“A woodpigeon eats about forty grams of grain a day, and forty of them is sixteen hundred grams.”",
      "“The birds that are seen all day are the ones that eat least.”",
    ],
    clears: [
      "The sparrows: “twenty sparrows is a hundred grams.”",
      "The squirrels: “a grey squirrel takes perhaps eighty grams a day each.”",
      "Spillage: “held sixty grams of spilled seed a day.”",
      "The finches: “eat about the same as a sparrow.”",
    ],
    explain:
      "Two numbers decide this and only one of them is about appetite. A pigeon eats eight times what a sparrow eats, and there are twice as many of them, which is sixteen times the total from a bird nobody counted. The watching was done at nine in the morning, and the eating is done at half past three.",
  },
  {
    t: "The Case of the Urn That Took Forty Minutes",
    tag: "☕ cocoa",
    story:
      "The staff room urn used to boil in twelve minutes and now takes forty, and four explanations have been offered. Each one slows a boil. It is filled to eighteen litres now rather than seventeen, which is six percent more water and about forty seconds. The staff room has been two degrees colder since the radiator valve stuck, which costs under a minute from a cold start. The lid is often left off, and a test with the lid on and off put the difference at six minutes. There is about a millimetre of limescale on the elements, which the manual says adds roughly five percent to a boiling time. Those four together account for eight minutes of the twenty-eight that have been added. The urn has three heating elements and an engineer measured the resistance across all three in February. Two of them are open circuit and have been since the power surge in January. One element doing the work of three takes three times as long to deliver the same heat. Twelve minutes multiplied by three is thirty-six, and the other faults account for the rest.",
    q: "Why does the urn take forty minutes?",
    s: [
      { who: "⚡ Two dead heating elements", why: "an engineer measured the resistance and two of the three elements are open circuit" },
      { who: "💧 The extra litre", why: "eighteen litres rather than seventeen is six percent more water and about forty seconds" },
      { who: "🥶 The colder room", why: "two degrees colder costs under a minute from a cold start" },
      { who: "🫙 The missing lid", why: "a test with the lid on and off put the difference at six minutes" },
      { who: "🧱 Limescale", why: "about a millimetre of limescale adds roughly five percent to a boiling time" },
    ],
    who: 0,
    answer: "Two of the three elements are dead, so one is doing all the work.",
    proof: [
      "“Those four together account for eight minutes of the twenty-eight that have been added.”",
      "“One element doing the work of three takes three times as long to deliver the same heat.”",
      "“Twelve minutes multiplied by three is thirty-six, and the other faults account for the rest.”",
    ],
    clears: [
      "The extra litre: “six percent more water and about forty seconds.”",
      "The cold room: “costs under a minute from a cold start.”",
      "The lid: “put the difference at six minutes.”",
      "Limescale: “adds roughly five percent to a boiling time.”",
    ],
    explain:
      "Three of these add minutes and one adds a percentage, and the lid is the biggest of them at six. The elements do not add anything. They multiply, and losing two thirds of the power triples the time whatever else is going on. The resistance test is the only measurement here that looks inside the urn.",
  },
  {
    t: "The Case of the Hundred Cards That Never Arrived",
    tag: "💌 valentine",
    story:
      "Three hundred and ten cards went into the school post and a hundred and ninety came out, and four losses have been accounted for. Each is a real card that genuinely failed to arrive. Fourteen were addressed to names that match nobody on the roll and came back to the office. Nine had no name on them at all and are in a box behind the desk. Six were handed straight to the person rather than posted, which means they arrived without passing through the system. Four were found torn in the sorting tray and could not be read. Those four groups come to thirty-three cards, and a hundred and twenty are missing. A second post box was put in the junior corridor on the Monday and nobody was told to empty it. It was opened on the following Friday and a hundred and three cards were taken out of it. Nobody ever counted a card into the system twice, so every card posted is somewhere. A hundred and three plus thirty-three is a hundred and thirty-six, and the rest turned up loose in the sorting tray.",
    q: "Where did the missing cards go?",
    s: [
      { who: "📮 The second post box", why: "a second post box was put in the junior corridor and nobody was told to empty it" },
      { who: "❓ Wrong names", why: "fourteen were addressed to names that match nobody on the roll and came back to the office" },
      { who: "🏷️ Cards with no name", why: "nine had no name on them at all and are in a box behind the desk" },
      { who: "🤝 Hand delivered", why: "six were handed straight to the person, which means they arrived without passing through the system" },
      { who: "💥 Torn cards", why: "four were found torn in the sorting tray and could not be read" },
    ],
    who: 0,
    answer: "A hundred and three cards sat in a second box nobody emptied.",
    proof: [
      "“Those four groups come to thirty-three cards, and a hundred and twenty are missing.”",
      "“It was opened on the following Friday and a hundred and three cards were taken out of it.”",
      "“Nobody ever counted a card into the system twice, so every card posted is somewhere.”",
    ],
    clears: [
      "Wrong names: “came back to the office.”",
      "No name: “are in a box behind the desk.”",
      "Hand delivered: “which means they arrived without passing through the system.”",
      "Torn cards: “could not be read.”",
    ],
    explain:
      "Four failures were investigated carefully and they are thirty-three cards between them. The hundred and three were never lost at all, which is why no failure describes them. They were posted into a box that was not part of the system, and a box nobody empties is not a loss but a queue.",
  },
  {
    t: "The Case of the Eruption That Reached Thirty Centimetres",
    tag: "🌋 volcano",
    story:
      "The model volcano threw its foam thirty centimetres and the club record is two metres, and four differences have been proposed. All four are real differences from the record attempt. The bottle neck is thirty-five millimetres across where the record used twenty, and a wider neck does let the foam out more slowly. Forty grams of bicarbonate was used against the record's sixty, which is a third less gas. The vinegar is five percent acid and the record used eight, which is another real shortfall. The room was four degrees cooler, which slows a reaction a little without changing how much gas it makes. Those four might halve a height between them, and this one is down by six sevenths. The record attempt adds ten millilitres of washing-up liquid and this one used none. Gas on its own rises through the liquid and bursts at the surface, so most of it never lifts anything. Soap traps that gas as foam, and foam is what climbs the neck and keeps climbing. The same mixture with soap added was run afterwards and reached one metre seventy.",
    q: "Why did the eruption only reach thirty centimetres?",
    s: [
      { who: "🫧 No washing-up liquid", why: "the record attempt adds ten millilitres of washing-up liquid and this one used none" },
      { who: "🍾 The wider neck", why: "the bottle neck is thirty-five millimetres across where the record used twenty" },
      { who: "🥄 Less bicarbonate", why: "forty grams against the record's sixty, which is a third less gas" },
      { who: "🧪 Weaker vinegar", why: "the vinegar is five percent acid and the record used eight, which is another real shortfall" },
      { who: "🥶 The cooler room", why: "four degrees cooler slows a reaction a little without changing how much gas it makes" },
    ],
    who: 0,
    answer: "There was no soap, so the gas escaped instead of becoming foam.",
    proof: [
      "“Those four might halve a height between them, and this one is down by six sevenths.”",
      "“Gas on its own rises through the liquid and bursts at the surface, so most of it never lifts anything.”",
      "“The same mixture with soap added was run afterwards and reached one metre seventy.”",
    ],
    clears: [
      "The neck: “a wider neck does let the foam out more slowly.”",
      "Less bicarbonate: “which is a third less gas.”",
      "Weaker vinegar: “which is another real shortfall.”",
      "The cool room: “slows a reaction a little without changing how much gas it makes.”",
    ],
    explain:
      "Three suspects reduce the gas and one slows it down, and together they are worth about half the height. The soap does not make gas at all. It changes what happens to the gas that is made, and the rerun settles it: same weak vinegar, same forty grams, ten millilitres of soap, one metre seventy.",
  },
  {
    t: "The Case of the Jewels That Fell Off the Crown",
    tag: "👑 crown",
    story:
      "Thirty-eight of the forty stones on the play's crown were on the floor by the end of the first rehearsal, and four reasons have been offered. All four are true of that crown. The stones weigh one point four grams each, which is a real load on a vertical surface. The card base flexes when the crown is put on, and flexing does work at a glued joint. A coat of varnish was sprayed over the finished crown, and solvent in a varnish can soften some glues. The hall was warm under the lights, and warmth softens glue a little. The glue itself is rated at two kilograms per square centimetre, which is more than a thousand times the weight of a stone. The crown was sprayed with glitter spray before the stones went on. A pull test on a stone glued to bare card needed six hundred grams to shift it. The same glue on the glittered surface let go at four grams. The glue is holding perfectly well to a layer of loose glitter that is holding on to nothing.",
    q: "Why did the stones fall off?",
    s: [
      { who: "✨ The glitter spray under the glue", why: "the crown was sprayed with glitter spray before the stones went on, and the glue is holding to a layer of loose glitter" },
      { who: "⚖️ The weight of the stones", why: "the stones weigh one point four grams each, which is a real load on a vertical surface" },
      { who: "📄 The flexing base", why: "the card base flexes when the crown is put on, and flexing does work at a glued joint" },
      { who: "🧴 The varnish", why: "solvent in a varnish can soften some glues" },
      { who: "🌡️ The warm hall", why: "the hall was warm under the lights, and warmth softens glue a little" },
    ],
    who: 0,
    answer: "The glue was stuck to loose glitter instead of to the card.",
    proof: [
      "“The glue itself is rated at two kilograms per square centimetre, which is more than a thousand times the weight of a stone.”",
      "“A pull test on a stone glued to bare card needed six hundred grams to shift it.”",
      "“The same glue on the glittered surface let go at four grams.”",
    ],
    clears: [
      "The stones: “weigh one point four grams each, which is a real load on a vertical surface.”",
      "The flexing base: “flexing does work at a glued joint.”",
      "The varnish: “solvent in a varnish can soften some glues.”",
      "The warm hall: “warmth softens glue a little.”",
    ],
    explain:
      "Weight, flexing, solvent and warmth all eat into a glued joint, and the joint was rated a thousand times stronger than it needed to be, so none of them should have mattered. The pull test is the whole case: six hundred grams on card, four grams on glitter. The glue never failed. It was never stuck to the crown.",
  },
  {
    t: "The Case of the Stage That Sagged Eleven Millimetres",
    tag: "🎹 piano",
    story:
      "The stage floor dips eleven millimetres under the piano and the builder's limit is three. Four loads have been blamed and every one of them is really up there. The piano weighs four hundred and eighty kilograms on four castors, which is a heavy point load and the obvious suspect. The choir of forty stands on the same stage, and forty people at sixty kilograms is two thousand four hundred kilograms. The staging blocks at the back add another hundred and ten. The lighting bar is hung from the ceiling and carries none of its weight on the floor at all. The stage was built for a distributed load four times what it now carries, and it did not sag last year under the same choir. A cable run was cut through the main joist in two thousand and nineteen, taking its depth from two hundred and twenty millimetres to ninety. The stiffness of a joist goes with the cube of its depth, not with the depth itself. Ninety cubed against two hundred and twenty cubed leaves about seven percent of the original stiffness. A beam with a fourteenth of its stiffness bends fourteen times as far under exactly the load it always carried.",
    q: "Why does the stage sag?",
    s: [
      { who: "🪚 The joist cut for the cable run", why: "a cable run was cut through the main joist, taking its depth from two hundred and twenty millimetres to ninety" },
      { who: "🎹 The piano", why: "the piano weighs four hundred and eighty kilograms on four castors, which is a heavy point load" },
      { who: "🎶 The choir", why: "forty people at sixty kilograms is two thousand four hundred kilograms" },
      { who: "🧱 The staging blocks", why: "the staging blocks at the back add another hundred and ten" },
      { who: "💡 The lighting bar", why: "the lighting bar is hung from the ceiling and carries none of its weight on the floor at all" },
    ],
    who: 0,
    answer: "A joist cut for cables has about seven percent of its stiffness left.",
    proof: [
      "“The stage was built for a distributed load four times what it now carries, and it did not sag last year under the same choir.”",
      "“The stiffness of a joist goes with the cube of its depth, not with the depth itself.”",
      "“A beam with a fourteenth of its stiffness bends fourteen times as far under exactly the load it always carried.”",
    ],
    clears: [
      "The piano: “a heavy point load and the obvious suspect.”",
      "The choir: “forty people at sixty kilograms is two thousand four hundred kilograms.”",
      "The blocks: “add another hundred and ten.”",
      "The lighting bar: “carries none of its weight on the floor at all.”",
    ],
    explain:
      "Everyone argues about the load and the load has not changed, which the stage proved last year by carrying it. What changed is the beam. Cutting six tenths of the depth out of a joist does not take six tenths of its strength, it takes ninety-three percent, because stiffness answers to the cube.",
  },
  {
    t: "The Case of the String That Weighed More Than the Kite",
    tag: "🪁 kite",
    story:
      "The kite flew well on the first day and will not leave the ground now, and four additions have been blamed. Every one of them is extra weight that was not there on the first day. The longer tail adds fourteen grams to a kite that weighs ninety. The paper took up damp overnight and a careful weighing put that at six grams. The plastic winder was clipped to the bridle to stop it rolling away, which is twenty grams. Extra tape along the spars adds four grams. Those four come to forty-four grams, which is a real handicap and not an impossible one. The string was changed after the first day from the thin nylon to the builder's line from the shed. Sixty metres of that line weighs two point one grams a metre. The thin nylon it replaced weighs a third of a gram a metre, or twenty grams over the same sixty. A hundred and twenty-six grams of line is more than the kite itself weighs. A kite does not only lift itself, it lifts every metre of string between it and the hand.",
    q: "Why will the kite not fly?",
    s: [
      { who: "🧵 The heavy builder's line", why: "sixty metres of builder's line weighs two point one grams a metre" },
      { who: "🎀 The longer tail", why: "the longer tail adds fourteen grams to a kite that weighs ninety" },
      { who: "💧 The damp paper", why: "a careful weighing put the damp at six grams" },
      { who: "🧿 The winder", why: "the plastic winder was clipped to the bridle to stop it rolling away, which is twenty grams" },
      { who: "🩹 The extra tape", why: "extra tape along the spars adds four grams" },
    ],
    who: 0,
    answer: "The new line weighs more than the kite it is attached to.",
    proof: [
      "“Those four come to forty-four grams, which is a real handicap and not an impossible one.”",
      "“A hundred and twenty-six grams of line is more than the kite itself weighs.”",
      "“A kite does not only lift itself, it lifts every metre of string between it and the hand.”",
    ],
    clears: [
      "The tail: “adds fourteen grams to a kite that weighs ninety.”",
      "The damp: “put that at six grams.”",
      "The winder: “which is twenty grams.”",
      "The tape: “adds four grams.”",
    ],
    explain:
      "Four people weighed four things on the kite and nobody weighed the string, because the string is not on the kite. It is on the kite the moment the kite leaves the ground. Sixty metres of line at two grams a metre is the heaviest single component in the whole arrangement.",
  },
  {
    t: "The Case of the Seeds That Did Not Come Up",
    tag: "☘️ shamrock",
    story:
      "Eleven seedlings came up from a tray of two hundred seeds and four reasons have been given, all of them genuine faults in the sowing. The packet is dated last March, and the seed house puts the fall in germination at about ten percent a year. The compost was the cheap bag left over from last summer, which the trial tray showed is worth perhaps another ten percent. The windowsill held at fourteen degrees where the packet asks for eighteen, which slows germination and does not stop it. The tray was watered once a week rather than kept damp, which the same trial put at fifteen percent. Those four at their worst would still leave well over a hundred seedlings. The seed was pressed in with a thumb to a depth of about two centimetres. The packet asks for five millimetres and says in bold that the seed needs light to germinate. A seed buried four times too deep in the dark never starts at all, whatever the compost or the temperature. A second tray from the same packet, sown at five millimetres into the same cheap compost, gave a hundred and sixty-eight.",
    q: "Why did only eleven seeds come up?",
    s: [
      { who: "📏 Sowing four times too deep", why: "the seed was pressed in to about two centimetres where the packet asks for five millimetres" },
      { who: "📅 Old seed", why: "the seed house puts the fall in germination at about ten percent a year" },
      { who: "🪴 Cheap compost", why: "the trial tray showed the cheap compost is worth perhaps another ten percent" },
      { who: "🌡️ The cool windowsill", why: "fourteen degrees where the packet asks for eighteen slows germination and does not stop it" },
      { who: "🚿 Weekly watering", why: "watering once a week rather than keeping the tray damp was worth fifteen percent in the trial" },
    ],
    who: 0,
    answer: "The seed was buried two centimetres deep when it needs light.",
    proof: [
      "“Those four at their worst would still leave well over a hundred seedlings.”",
      "“A seed buried four times too deep in the dark never starts at all, whatever the compost or the temperature.”",
      "“A second tray from the same packet, sown at five millimetres into the same cheap compost, gave a hundred and sixty-eight.”",
    ],
    clears: [
      "Old seed: “about ten percent a year.”",
      "The compost: “worth perhaps another ten percent.”",
      "The windowsill: “slows germination and does not stop it.”",
      "The watering: “which the same trial put at fifteen percent.”",
    ],
    explain:
      "Four faults that each take ten or fifteen percent off a tray, and the tray lost ninety-five. Percentages multiply down slowly and this failure is nearly total, which points at something that works as an on and off switch rather than a discount. The second tray is that switch thrown the other way.",
  },
  {
    t: "The Case of the Water Bill That Tripled",
    tag: "🌧️ puddle",
    story:
      "The meter read sixty cubic metres a quarter last year and a hundred and eighty-nine this quarter. Four causes have been put forward and each of them does use water. Forty more pupils joined, which at the published figure of four litres a head a day is about six cubic metres a quarter. The kitchen's new dishwasher is rated by its maker at four cubic metres a quarter. The hosepipe for the garden was metered separately through a trial fortnight and came to three. The new hand dryers replaced paper towels, and a hand dryer uses no water at all. Those four add nine cubic metres to a rise of a hundred and twenty-nine. The cistern in the disabled toilet has been overflowing quietly into the pan since the handle was changed in January. The flow was caught in a jug and timed at nine hundred millilitres a minute. Nine hundred millilitres a minute is one and three tenths of a cubic metre a day, or a hundred and sixteen across a quarter. A trickle nobody can hear is using nearly twice what the whole school used last year.",
    q: "Where is the water going?",
    s: [
      { who: "🚽 The overflowing cistern", why: "the flow was caught in a jug and timed at nine hundred millilitres a minute" },
      { who: "🧒 Forty more pupils", why: "four litres a head a day is about six cubic metres a quarter" },
      { who: "🍽️ The new dishwasher", why: "the dishwasher is rated by its maker at four cubic metres a quarter" },
      { who: "🌿 The garden hose", why: "the hosepipe was metered separately through a trial fortnight and came to three" },
      { who: "💨 The hand dryers", why: "the new hand dryers replaced paper towels, and a hand dryer uses no water at all" },
    ],
    who: 0,
    answer: "A cistern has been trickling into the pan since January.",
    proof: [
      "“Those four add nine cubic metres to a rise of a hundred and twenty-nine.”",
      "“Nine hundred millilitres a minute is one and three tenths of a cubic metre a day, or a hundred and sixteen across a quarter.”",
      "“A trickle nobody can hear is using nearly twice what the whole school used last year.”",
    ],
    clears: [
      "More pupils: “about six cubic metres a quarter.”",
      "The dishwasher: “rated by its maker at four cubic metres a quarter.”",
      "The hose: “came to three.”",
      "The dryers: “a hand dryer uses no water at all.”",
    ],
    explain:
      "Every suspect here is an event that happens and then stops, and the one that matters never stops. Nine hundred millilitres sounds like nothing because it is measured in a jug. Multiply it by the minutes in a quarter and it is twice the school's entire annual usage, which is what continuous means.",
  },
  {
    t: "The Case of the Sunflowers That Stopped at Waist Height",
    tag: "🌻 garden",
    story:
      "The sunflowers reached one metre twenty where the packet promises three metres, and four causes have been named. Each is a genuine shortfall in that bed. The bed gets four hours of direct sun against the eight the packet asks for, which the trial bed suggests costs about a third of the height. The compost was not fed after June, worth perhaps fifteen centimetres on the trial plants. Watering was weekly rather than daily in the hot fortnight, which showed as twenty centimetres in the trial. Slug damage was counted on every stem and found on nine of the hundred and four plants. Those four together could not take more than half the height, and five sixths is missing. The seed was sown along the row at ten centimetres apart where the packet asks for forty-five. A hundred and four plants are growing in a bed laid out for twelve. Each one has about a twentieth of the root space and the leaf room the spacing assumes. Three plants left at the end of the row, forty-five centimetres clear of their neighbours, are two metres eighty.",
    q: "Why are the sunflowers so short?",
    s: [
      { who: "📏 Sowing ten centimetres apart", why: "the seed was sown along the row at ten centimetres apart where the packet asks for forty-five" },
      { who: "☀️ Four hours of sun", why: "four hours against eight costs about a third of the height in the trial bed" },
      { who: "🪴 No feeding after June", why: "not feeding after June was worth perhaps fifteen centimetres on the trial plants" },
      { who: "🚿 Weekly watering", why: "weekly rather than daily watering in the hot fortnight showed as twenty centimetres in the trial" },
      { who: "🐌 Slugs", why: "slug damage was counted on every stem and found on nine of the hundred and four plants" },
    ],
    who: 0,
    answer: "A hundred and four plants are crowded into a bed meant for twelve.",
    proof: [
      "“Those four together could not take more than half the height, and five sixths is missing.”",
      "“Each one has about a twentieth of the root space and the leaf room the spacing assumes.”",
      "“Three plants left at the end of the row, forty-five centimetres clear of their neighbours, are two metres eighty.”",
    ],
    clears: [
      "The sun: “costs about a third of the height.”",
      "Feeding: “worth perhaps fifteen centimetres on the trial plants.”",
      "Watering: “which showed as twenty centimetres in the trial.”",
      "Slugs: “found on nine of the hundred and four plants.”",
    ],
    explain:
      "Sun, food, water and slugs take their toll in centimetres and percentages, and together they are worth about half. Spacing is worth a factor of twenty because every plant is taking what the others need. The three at the end of the row got the same sun and the same neglect and stand at two metres eighty.",
  },
  {
    t: "The Case of the Eggs That Stopped in October",
    tag: "🪺 eggs",
    story:
      "The six hens laid twenty-eight eggs a week in July and nine a week in late October, and four causes have been suggested. All four are at work in that run. Two of the hens are moulting, and a moulting hen stops laying for a few weeks, which accounts for perhaps eight eggs. The nights have turned cold, and the poultry guide puts a modest drop on cold without calling it a main cause. A fox got into the garden in September and frightened the birds, which costs a few days of laying rather than a season. The feed was changed in August to a brand with the same protein figure printed on the sack. Those four together might explain ten or eleven of the nineteen eggs that have gone. Daylight in the run has fallen from sixteen hours in July to nine hours now. The guide is blunt about it: laying falls away sharply below twelve hours and stops near nine. Light reaching the eye is what tells a hen the season, and nothing about the sack of feed changes that. The neighbour's flock under a lamp on a timer is still laying at July's rate.",
    q: "Why have the eggs stopped?",
    s: [
      { who: "🌇 The shortening day", why: "daylight in the run has fallen from sixteen hours in July to nine hours now" },
      { who: "🪶 The moult", why: "a moulting hen stops laying for a few weeks, which accounts for perhaps eight eggs" },
      { who: "🥶 The cold nights", why: "the poultry guide puts a modest drop on cold without calling it a main cause" },
      { who: "🦊 The fox", why: "a fox frightened the birds, which costs a few days of laying rather than a season" },
      { who: "🌾 The feed change", why: "the feed was changed to a brand with the same protein figure printed on the sack" },
    ],
    who: 0,
    answer: "Day length has fallen from sixteen hours to nine.",
    proof: [
      "“Those four together might explain ten or eleven of the nineteen eggs that have gone.”",
      "“The guide is blunt about it: laying falls away sharply below twelve hours and stops near nine.”",
      "“The neighbour's flock under a lamp on a timer is still laying at July's rate.”",
    ],
    clears: [
      "The moult: “which accounts for perhaps eight eggs.”",
      "The cold: “a modest drop on cold without calling it a main cause.”",
      "The fox: “costs a few days of laying rather than a season.”",
      "The feed: “the same protein figure printed on the sack.”",
    ],
    explain:
      "The moult is real and it is worth eight eggs, which is why it is believed. Everything else is worth two or three. The one change nobody made and nobody can see is the length of the day, and the neighbour's flock is the experiment: same weather, same month, a lamp, and July's rate.",
  },
  {
    t: "The Case of the Bins That Went From Six to Fourteen",
    tag: "🌎 earth",
    story:
      "General waste has gone from six bins a week to fourteen and four causes are being argued over. Every one of them really is putting rubbish in those bins. Forty more pupils is a seven percent rise on a roll of six hundred, which is under half a bin. The refit produced rubble, and rubble went into a hired skip and never touched the bins at all. The paper recycling has been refused three weeks running, and a refused load is tipped into general waste, which is a real transfer of about one and a half bins a week. Grounds waste from the hedge cutting filled two bins, once, in September. Those four account for two bins at the very most. The canteen changed in September from washable trays to single-use boxes, cups and cutlery. Twelve hundred meals a day now leave four disposable items each behind them. Forty-eight hundred items a day is twenty-four thousand a week, and the bin measurements put that at six bins. Nothing else on the list produces rubbish every single day the school is open.",
    q: "Why has the waste more than doubled?",
    s: [
      { who: "🥡 The single-use canteen packaging", why: "twelve hundred meals a day now leave four disposable items each behind them" },
      { who: "🧒 Forty more pupils", why: "a seven percent rise on a roll of six hundred is under half a bin" },
      { who: "🧱 The refit rubble", why: "rubble went into a hired skip and never touched the bins at all" },
      { who: "📄 The refused recycling", why: "a refused load is tipped into general waste, which is a real transfer of about one and a half bins a week" },
      { who: "🌳 Hedge cuttings", why: "grounds waste from the hedge cutting filled two bins, once, in September" },
    ],
    who: 0,
    answer: "The canteen switched to disposables and now throws away forty-eight hundred items a day.",
    proof: [
      "“Those four account for two bins at the very most.”",
      "“Forty-eight hundred items a day is twenty-four thousand a week, and the bin measurements put that at six bins.”",
      "“Nothing else on the list produces rubbish every single day the school is open.”",
    ],
    clears: [
      "More pupils: “under half a bin.”",
      "The rubble: “went into a hired skip and never touched the bins at all.”",
      "The recycling: “a real transfer of about one and a half bins a week.”",
      "Hedge cuttings: “filled two bins, once, in September.”",
    ],
    explain:
      "Two of these are one-off events and one is a transfer rather than an increase. The refused recycling is a genuine weekly cost and it is a bin and a half. The canteen change is six bins a week because it multiplies a small object by twelve hundred people and then by five days.",
  },
  {
    t: "The Case of the Battery That Lasted Forty Shots",
    tag: "📷 camera",
    story:
      "The camera is rated at four hundred shots a charge and managed forty on the trip, and four drains have been blamed. All four really do take power. It was minus two degrees all day, and the maker puts cold below five degrees at about thirty percent of capacity. The screen was left on maximum brightness, which the same table puts at fifteen percent. The battery is three years old, and a pack of that age holds roughly eighty percent of what it did. The flash fired on twelve of the forty shots, which the table rates at a few percent across a day. Those four together would take four hundred shots down to about two hundred, not to forty. The wireless was switched on in September and has been hunting for a network ever since. The manual says a camera searching for a network with nothing to join drains a full pack in ninety minutes. It does that whether the camera is taking photographs or sitting in a bag. The trip lasted six hours, and the shots were simply what happened to be taken while the pack emptied.",
    q: "Why did the battery only last forty shots?",
    s: [
      { who: "📡 The wireless hunting for a network", why: "the manual says a camera searching for a network with nothing to join drains a full pack in ninety minutes" },
      { who: "🥶 The cold", why: "the maker puts cold below five degrees at about thirty percent of capacity" },
      { who: "🔆 The bright screen", why: "the screen on maximum brightness is fifteen percent in the same table" },
      { who: "🔋 The old battery", why: "a pack of that age holds roughly eighty percent of what it did" },
      { who: "⚡ The flash", why: "the flash fired on twelve of the forty shots, which the table rates at a few percent across a day" },
    ],
    who: 0,
    answer: "The wireless has been searching for a network all day, every day.",
    proof: [
      "“Those four together would take four hundred shots down to about two hundred, not to forty.”",
      "“It does that whether the camera is taking photographs or sitting in a bag.”",
      "“The trip lasted six hours, and the shots were simply what happened to be taken while the pack emptied.”",
    ],
    clears: [
      "The cold: “about thirty percent of capacity.”",
      "The screen: “which the same table puts at fifteen percent.”",
      "The old battery: “holds roughly eighty percent of what it did.”",
      "The flash: “which the table rates at a few percent across a day.”",
    ],
    explain:
      "Four drains that are all tied to taking photographs, and between them they halve the count. The radio is not tied to taking photographs at all, which is why counting shots never found it. The camera was emptying its battery in the bag between every picture.",
  },
  {
    t: "The Case of the Beans That Died in the Experiment",
    tag: "🌱 plant",
    story:
      "All twenty-four bean plants in the growth experiment died in eleven days and four causes have been written up. Each is a real departure from the method. The bench ran at twenty-six degrees where the method asks for twenty-two, which the control group shows costs growth and does not kill. The pots are seven centimetres where the method specifies nine, which crowds a root system at four weeks and not at eleven days. They were watered on alternate days rather than daily, and the control tray on the same watering is alive. The lamp sat fifty centimetres above the plants rather than thirty, which weakens a seedling over weeks. Those four together describe a slow decline and not a total loss inside a fortnight. The liquid feed was made up at five millilitres into five hundred millilitres of water. The label says five millilitres into five litres, so the solution is ten times the strength intended. A feed at ten times strength pulls water back out of the roots instead of giving anything to them. The control tray, fed from a bottle mixed by the technician, is forty centimetres tall.",
    q: "What killed the beans?",
    s: [
      { who: "🧪 Feed at ten times strength", why: "the feed was made up at five millilitres into five hundred millilitres where the label says five litres" },
      { who: "🌡️ The warm bench", why: "twenty-six degrees where the method asks for twenty-two costs growth and does not kill" },
      { who: "🪴 The small pots", why: "seven centimetre pots crowd a root system at four weeks and not at eleven days" },
      { who: "🚿 Alternate day watering", why: "the control tray on the same watering is alive" },
      { who: "💡 The lamp too high", why: "the lamp at fifty centimetres rather than thirty weakens a seedling over weeks" },
    ],
    who: 0,
    answer: "The feed was mixed ten times too strong.",
    proof: [
      "“Those four together describe a slow decline and not a total loss inside a fortnight.”",
      "“A feed at ten times strength pulls water back out of the roots instead of giving anything to them.”",
      "“The control tray, fed from a bottle mixed by the technician, is forty centimetres tall.”",
    ],
    clears: [
      "The bench: “costs growth and does not kill.”",
      "The pots: “which crowds a root system at four weeks and not at eleven days.”",
      "The watering: “the control tray on the same watering is alive.”",
      "The lamp: “weakens a seedling over weeks.”",
    ],
    explain:
      "Four errors that each cost a plant some growth over weeks, against twenty-four deaths in eleven days. The timescales do not match, which is the first clue. The feed is the only error measured in multiples rather than in degrees or centimetres, and at ten times strength it works the wrong way round entirely.",
  },
  {
    t: "The Case of the Ice Cream That Served Fourteen",
    tag: "🍦 icecream",
    story:
      "Two kilograms of ice cream was bought to give forty servings and it ran out after fourteen. Four losses have been offered and all four happened on the day. The drip tray under the tub was weighed at the end and held sixty grams. Six free tastings were given to the helpers, which at the planned fifty grams is three hundred grams. A little was lost to the tub walls and the scoop, which a careful scrape put at forty grams. The tub was too hard at first and the server dug out chunks, which changes the shape of a serving and not its weight. Those four come to four hundred grams of the two thousand. The recipe sheet assumes a number twenty scoop, which holds forty-five millilitres. The scoop in the kitchen drawer is a number eight, which holds a hundred and twenty. Every serving went out at nearly three times the size the plan was written for. Two thousand grams divided by three times fifty is thirteen servings, and the fourteenth was the scrapings.",
    q: "Why did it only serve fourteen?",
    s: [
      { who: "🥄 The number eight scoop", why: "the recipe sheet assumes a number twenty scoop at forty-five millilitres and the drawer holds a number eight at a hundred and twenty" },
      { who: "💧 The drip tray", why: "the drip tray under the tub was weighed at the end and held sixty grams" },
      { who: "🎁 Free tastings", why: "six free tastings at the planned fifty grams is three hundred grams" },
      { who: "🫙 Waste on the tub walls", why: "a careful scrape put the loss on the walls and the scoop at forty grams" },
      { who: "🧊 The hard tub", why: "digging out chunks changes the shape of a serving and not its weight" },
    ],
    who: 0,
    answer: "The scoop in the drawer holds nearly three times what the plan assumed.",
    proof: [
      "“Those four come to four hundred grams of the two thousand.”",
      "“Every serving went out at nearly three times the size the plan was written for.”",
      "“Two thousand grams divided by three times fifty is thirteen servings, and the fourteenth was the scrapings.”",
    ],
    clears: [
      "The drip tray: “held sixty grams.”",
      "Tastings: “which at the planned fifty grams is three hundred grams.”",
      "The tub walls: “which a careful scrape put at forty grams.”",
      "The hard tub: “changes the shape of a serving and not its weight.”",
    ],
    explain:
      "Four hundred grams were genuinely lost and they would have cost eight servings, not twenty-six. The rest was served, correctly and cheerfully, to the first fourteen people in the queue. Nobody lost any ice cream. The unit the plan was written in and the unit in the drawer were different.",
  },
  {
    t: "The Case of the Appeal That Raised Four Hundred",
    tag: "🎗️ ribbon",
    story:
      "A thousand ribbons went out with a suggested donation of a pound fifty and the appeal raised four hundred and ten pounds. Four reasons have been given for the shortfall against fifteen hundred. All four are true. A hundred and eighty ribbons came back unsold, which at the suggested figure is two hundred and seventy pounds. The ribbons themselves cost a hundred and twenty pounds, which comes off the total and was never in it. Forty were given free to the helpers and the governors, worth sixty pounds. Nine pounds in foreign coins went into the tin and could not be banked. Those four come to about four hundred and sixty pounds of the eleven hundred that are missing. A count of a hundred consecutive donations gave an average of forty-two pence. Eight hundred and twenty ribbons at forty-two pence is three hundred and forty-four pounds. A suggested donation is a suggestion, and the arithmetic treated it as a price. Nobody did anything wrong, and the plan was built on a number that was never going to be collected.",
    q: "Why did the appeal raise four hundred pounds?",
    s: [
      { who: "🪙 The real average donation", why: "a count of a hundred consecutive donations gave an average of forty-two pence against a suggested pound fifty" },
      { who: "📦 Unsold ribbons", why: "a hundred and eighty came back unsold, which at the suggested figure is two hundred and seventy pounds" },
      { who: "🧾 The cost of the ribbons", why: "the ribbons cost a hundred and twenty pounds, which comes off the total and was never in it" },
      { who: "🎁 Free ribbons", why: "forty were given free to the helpers and the governors, worth sixty pounds" },
      { who: "💱 Foreign coins", why: "nine pounds in foreign coins went into the tin and could not be banked" },
    ],
    who: 0,
    answer: "People gave an average of forty-two pence, not a pound fifty.",
    proof: [
      "“Those four come to about four hundred and sixty pounds of the eleven hundred that are missing.”",
      "“Eight hundred and twenty ribbons at forty-two pence is three hundred and forty-four pounds.”",
      "“A suggested donation is a suggestion, and the arithmetic treated it as a price.”",
    ],
    clears: [
      "Unsold ribbons: “which at the suggested figure is two hundred and seventy pounds.”",
      "The cost: “which comes off the total and was never in it.”",
      "Free ribbons: “worth sixty pounds.”",
      "Foreign coins: “could not be banked.”",
    ],
    explain:
      "Three of these are real losses and one was never income at all. They come to four hundred and sixty pounds of an eleven hundred pound gap. The rest of the gap was in the forecast rather than in the tin, because a pound fifty was what the school hoped for and forty-two pence is what people gave.",
  },
  {
    t: "The Case of the Cylinder That Filled Ninety Balloons",
    tag: "🎈 balloons",
    story:
      "The helium cylinder is labelled for four hundred and fifty balloons and it filled ninety. Four causes have been suggested and each wastes some gas. The nozzle hisses when the balloon is pulled off, and a timed test put that at about two percent of the cylinder. The hall was cold, and a cold gas takes up less room, which affects the reading on the gauge rather than the number of balloons. The cylinder was second hand and the gauge started at ninety-five percent rather than full. Three balloons burst during filling. Those four together waste under a tenth of the gas. The label's figure assumes a balloon blown to twenty-three centimetres across, which is the size printed on the packet. The ones filled on the day measured thirty-eight centimetres, because a bigger balloon looked better. Volume goes with the cube of the width, and thirty-eight divided by twenty-three, cubed, is about four and a half. Four hundred and fifty divided by four and a half is a hundred, and the wasted gas accounts for the last ten.",
    q: "Why did the cylinder only fill ninety?",
    s: [
      { who: "📐 Balloons blown to thirty-eight centimetres", why: "the label assumes twenty-three centimetres and the ones filled measured thirty-eight" },
      { who: "💨 The hissing nozzle", why: "a timed test put the nozzle leak at about two percent of the cylinder" },
      { who: "🥶 The cold hall", why: "a cold gas takes up less room, which affects the reading on the gauge rather than the number of balloons" },
      { who: "🏷️ The part-used cylinder", why: "the cylinder was second hand and the gauge started at ninety-five percent rather than full" },
      { who: "💥 Burst balloons", why: "three balloons burst during filling" },
    ],
    who: 0,
    answer: "Every balloon was blown to four and a half times the volume assumed.",
    proof: [
      "“Those four together waste under a tenth of the gas.”",
      "“Volume goes with the cube of the width, and thirty-eight divided by twenty-three, cubed, is about four and a half.”",
      "“Four hundred and fifty divided by four and a half is a hundred, and the wasted gas accounts for the last ten.”",
    ],
    clears: [
      "The nozzle: “about two percent of the cylinder.”",
      "The cold: “affects the reading on the gauge rather than the number of balloons.”",
      "The part-used cylinder: “the gauge started at ninety-five percent rather than full.”",
      "Burst balloons: “three balloons burst during filling.”",
    ],
    explain:
      "Fifteen centimetres looks like a small overfill, which is exactly why nobody suspected it. Width is not volume. Going from twenty-three to thirty-eight centimetres is four and a half times the gas in every single balloon, and that one decision is worth more than every leak and burst put together.",
  },
];

gradeMysteries(
  11,
  CASES.map((c, i) => (DEBATES[i + 1] ? { ...c, d: DEBATES[i + 1] } : c)),
);
