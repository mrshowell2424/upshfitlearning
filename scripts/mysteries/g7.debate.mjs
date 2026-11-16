/**
 * Grade 7, the debate version of each case. See scripts/mysteries/g5.debate.mjs
 * for what these files are and what the gate holds them to.
 *
 * The ordinary grade 7 case works by timing: every suspect is a real, live
 * explanation and the clock rules all but one of them out. That is a strong
 * way to teach elimination and it is also a net, because once a student has
 * the timeline the answer falls out without an argument.
 *
 * So the debate versions move the clock. Nothing here is contradicted; the
 * times are simply loosened until three suspects all fit inside the window.
 * What is left is the harder half of the work: which of three things that
 * could have happened best explains the thing that did.
 */
export const DEBATES = {
  1: {
    story:
      "Twenty books from Ms. Ortiz's class showed overdue on March 17. The library changed its loan period from fourteen days to twenty-one on March 1. Her class checked the books out on March 2. The catalog listed all twenty as due March 16, which is fourteen days. A power cut on March 10 shut the system down for most of a day. Staff rebuilt the catalog from a backup copy made on February 26. The twenty-one-day rule was entered on March 1, after that backup was taken. Eleven other classes borrowed books on March 2 and none of them showed overdue. The system wrote nine hundred records in the hour it came back up. Two librarians were editing due dates by hand that afternoon and kept no log. Every slip the printer produced that day reads March 23.",
    q: "Why did twenty books show overdue? Pick one cause and prove it from the text.",
    who: ["", "⚡ The rebuild after the power cut", "", ""],
    why: [
      "a backup from February 26, taken before the new rule went in",
      "nine hundred records written in the hour it came back up",
      "two librarians editing by hand that afternoon with no log",
      "every slip the printer produced reads March 23",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Staff rebuilt the catalog from a backup copy made on February 26.”", "“The twenty-one-day rule was entered on March 1, after that backup was taken.”"], but: "“Eleven other classes borrowed books on March 2 and none of them showed overdue.”" },
      { who: 1, ev: ["“A power cut on March 10 shut the system down for most of a day.”", "“The system wrote nine hundred records in the hour it came back up.”"], but: "“The catalog listed all twenty as due March 16, which is fourteen days.”" },
      { who: 2, ev: ["“Two librarians were editing due dates by hand that afternoon and kept no log.”", "“Eleven other classes borrowed books on March 2 and none of them showed overdue.”"], but: "“Staff rebuilt the catalog from a backup copy made on February 26.”" },
    ],
    clears: ["The class keeping them late: “Every slip the printer produced that day reads March 23.”"],
    note:
      "Eleven other classes borrowed on the same day and came out fine, and that one sentence does most of the work. A bad backup would have hit all of them. Something that touched one class and not eleven others is either a hand or a hurry, and the case gives both.",
  },
  2: {
    story:
      "Milk cartons were cold at first lunch and warm at third. The cooler door was propped open from 10:40 to 11:05 for a delivery. A thermometer inside read 38 degrees at 10:30 and 51 at 11:10. Cartons for third lunch were stacked on the open counter at 11:00. Third lunch begins at 12:35, and those cartons had sat out since. That counter sits beside the ovens on the warm side of the kitchen. The cooler motor cut out twice on Monday and the engineer has not been. Third lunch cartons came from the back of the cooler, furthest from the fan. First lunch cartons came straight from the cooler at 11:15. Each delivery carton was probed at the door and came in at 36 degrees.",
    q: "Why was the third lunch milk warm? Argue for one cause.",
    why: [
      "stacked on a warm counter at 11:00 for a 12:35 lunch",
      "a door propped open, with the inside at 51 by 11:10",
      "every delivery carton probed at the door at 36 degrees",
      "a motor that cut out twice on Monday, and cartons from the back",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“Cartons for third lunch were stacked on the open counter at 11:00.”", "“That counter sits beside the ovens on the warm side of the kitchen.”"], but: "“First lunch cartons came straight from the cooler at 11:15.”" },
      { who: 1, ev: ["“The cooler door was propped open from 10:40 to 11:05 for a delivery.”", "“A thermometer inside read 38 degrees at 10:30 and 51 at 11:10.”"], but: "“Third lunch begins at 12:35, and those cartons had sat out since.”" },
      { who: 3, ev: ["“The cooler motor cut out twice on Monday and the engineer has not been.”", "“Third lunch cartons came from the back of the cooler, furthest from the fan.”"], but: "“First lunch cartons came straight from the cooler at 11:15.”" },
    ],
    clears: ["The delivery truck: “Each delivery carton was probed at the door and came in at 36 degrees.”"],
    note:
      "First lunch is the control and the class should find it: same cooler, same morning, cold milk. That beats the propped door and the motor, because both of those were already happening at 11:15. Ninety-five minutes on a counter beside an oven is the only thing that happened to the third lunch cartons alone.",
  },
  3: {
    story:
      "Mr. Reyes empties the sharpener bin at three o'clock every afternoon. On Tuesday morning at nine the bin was full to the rim. His first period class had not arrived yet when he found it. The bin was empty when he locked up Monday at three. Chess club met in the room from 3:15 to 4:30 on Monday afternoon. They had worked through a packet of score sheets in pencil. The custodian has a key and cleaned Room 12 at six on Monday evening. He had been told to tidy the art trolley, which holds forty blunt pencils. Monday's last class left at 2:50, but three students stayed until half past three. Tuesday's bin held shavings from at least two dozen sharpened pencils. The sharpener turned smoothly on Tuesday and nothing was stuck inside it.",
    q: "Who filled the shavings bin? Choose one and quote the story.",
    why: [
      "in the room until 4:30, working a packet in pencil",
      "a key, a six o'clock clean, and forty blunt pencils to tidy",
      "three who stayed until half past three to finish",
      "a sharpener that turned smoothly with nothing stuck",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Chess club met in the room from 3:15 to 4:30 on Monday afternoon.”", "“They had worked through a packet of score sheets in pencil.”"], but: "“The custodian has a key and cleaned Room 12 at six on Monday evening.”" },
      { who: 1, ev: ["“The custodian has a key and cleaned Room 12 at six on Monday evening.”", "“He had been told to tidy the art trolley, which holds forty blunt pencils.”"], but: "“Chess club met in the room from 3:15 to 4:30 on Monday afternoon.”" },
      { who: 2, ev: ["“Monday's last class left at 2:50, but three students stayed until half past three.”", "“Tuesday's bin held shavings from at least two dozen sharpened pencils.”"], but: "“The bin was empty when he locked up Monday at three.”" },
    ],
    clears: ["A jammed sharpener: “The sharpener turned smoothly on Tuesday and nothing was stuck inside it.”"],
    note:
      "Two dozen pencils is the number to reason from. Three students finishing a test do not sharpen two dozen. A chess club with a packet of score sheets might. Forty blunt pencils on a trolley certainly would, and that is the answer nobody expects.",
  },
  4: {
    story:
      "Two trays of apple slices went out for the tasting at nine o'clock. Tray A came out brown at the edges and tray B stayed pale and clean. Tray A was cut at 8:00 and the juice went on at 8:20. Tray B was cut at 8:30 and brushed within a minute. Cut apple begins browning the moment the flesh meets air. Lemon juice slows the browning that follows but cannot lift what is done. Tray A was cut from the bottom of the bag, where four apples were a different sort. Tray A took one spoon of juice and tray B took two. Both sat on the same counter in the same room all morning. Neither tray went anywhere near the refrigerator at any point.",
    q: "Why did one tray brown? Make the case for one cause.",
    why: [
      "cut at 8:00 with the juice not on until 8:20",
      "cut from the bottom of the bag, where four were a different sort",
      "one spoon of juice against tray B's two",
      "neither tray near the refrigerator at any point",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Tray A was cut at 8:00 and the juice went on at 8:20.”", "“Cut apple begins browning the moment the flesh meets air.”"], but: "“Tray A took one spoon of juice and tray B took two.”" },
      { who: 1, ev: ["“Tray A was cut from the bottom of the bag, where four apples were a different sort.”", "“Tray A came out brown at the edges and tray B stayed pale and clean.”"], but: "“Tray A was cut at 8:00 and the juice went on at 8:20.”" },
      { who: 2, ev: ["“Tray A took one spoon of juice and tray B took two.”", "“Lemon juice slows the browning that follows but cannot lift what is done.”"], but: "“Tray B was cut at 8:30 and brushed within a minute.”" },
    ],
    clears: ["The refrigerator: “Neither tray went anywhere near the refrigerator at any point.”"],
    note:
      "Three things were different about tray A and the case will not say which mattered. The sentence about lemon juice is the one that does real work: it slows what comes next and cannot undo what is done. Twenty minutes of browning is already done before any juice arrives.",
  },
  5: {
    story:
      "Nadia's rear brake went soft at the bottom of the long hill on Pine Road. At the top of that same hill it had gripped perfectly well. Next morning it gripped perfectly well again from the first squeeze. Pine Road falls gently for almost a mile without a level stretch. On Pine she held the brake lightly the whole way down. Rubbing a brake builds heat, and heat builds the longer the rubbing lasts. Her rear pads were last measured in September and are down to the wear line. The short hill on Vine is steeper, and she has ridden it only twice this year. Pine is the longest descent she rides and the only one over half a mile. Her rims were dry and clean on both hills all week.",
    q: "Why did the brake fade? Pick one cause and prove it.",
    why: [
      "a mile of light braking, where heat builds the longer it lasts",
      "pads last measured in September and down to the wear line",
      "rims dry and clean on both hills all week",
      "a steeper hill on Vine, ridden only twice this year",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“Pine Road falls gently for almost a mile without a level stretch.”", "“On Pine she held the brake lightly the whole way down.”"], but: "“Her rear pads were last measured in September and are down to the wear line.”" },
      { who: 1, ev: ["“Her rear pads were last measured in September and are down to the wear line.”", "“At the top of that same hill it had gripped perfectly well.”"], but: "“Next morning it gripped perfectly well again from the first squeeze.”" },
      { who: 3, ev: ["“The short hill on Vine is steeper, and she has ridden it only twice this year.”", "“Pine is the longest descent she rides and the only one over half a mile.”"], but: "“Rubbing a brake builds heat, and heat builds the longer the rubbing lasts.”" },
    ],
    clears: ["Wet rims: “Her rims were dry and clean on both hills all week.”"],
    note:
      "It worked at the top, failed at the bottom, and worked again next morning. Worn pads do not recover overnight. That recovery is the strongest fact in the case and it points at something that builds and then goes away, which is what heat does.",
  },
  6: {
    story:
      "The class tank turned milky on a Thursday and stayed that way for a week. The gravel had been scrubbed clean in hot water on the Monday before. Invisible bacteria live in tank gravel and break down fish waste there. Hot water kills those bacteria, and a new colony takes about a week to build. Waste builds up with nothing to break it down, and the water clouds. The cloud began three days after the gravel was scrubbed. A second feeder was added to the rota in October and both fed on Wednesday. The filter pads were replaced on the Monday as well, straight from the packet. New pads carry no bacteria either, and the old ones went in the bin. Two new fish were added a full two weeks before the cloud appeared.",
    q: "Why did the tank cloud? Choose one cause and back it up.",
    who: ["", "", "", "🧽 The new filter pads"],
    why: [
      "gravel scrubbed in hot water, which kills the bacteria",
      "two new fish added a fortnight before the cloud",
      "a second feeder on the rota, and both fed on Wednesday",
      "pads replaced the same Monday, straight from the packet",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“The gravel had been scrubbed clean in hot water on the Monday before.”", "“Hot water kills those bacteria, and a new colony takes about a week to build.”"], but: "“The filter pads were replaced on the Monday as well, straight from the packet.”" },
      { who: 2, ev: ["“A second feeder was added to the rota in October and both fed on Wednesday.”", "“Waste builds up with nothing to break it down, and the water clouds.”"], but: "“The cloud began three days after the gravel was scrubbed.”" },
      { who: 3, ev: ["“The filter pads were replaced on the Monday as well, straight from the packet.”", "“New pads carry no bacteria either, and the old ones went in the bin.”"], but: "“The gravel had been scrubbed clean in hot water on the Monday before.”" },
    ],
    clears: ["The two new fish: “Two new fish were added a full two weeks before the cloud appeared.”"],
    note:
      "Two bacteria homes were destroyed on the same Monday, so the first and last answers are really one answer told twice. The honest version says so. The double feeding is the interesting rival, because a tank with no bacteria left cannot handle a double feed either.",
  },
  7: {
    story:
      "A low hum filled Room 12 every morning and was gone by afternoon. The heating blower runs on a timer from 6:00 in the morning until noon. The hum was loudest at the ceiling vent and faint everywhere else. On Tuesday the blower was shut off at nine and the hum stopped then. The projector is switched on at 8:05 and is put to sleep at lunch. A sleeping projector keeps its cooling fan running for ten minutes and then stops. The fountain chiller runs hardest in the morning when the tank has been drawn down. Mr. Dale stood under each one in turn. The room was otherwise silent. The fluorescent lights run from 7:30 right through until the building shuts at six.",
    q: "What is humming in Room 12? Pick one and prove it from the text.",
    why: [
      "a timer from six until noon, and silence when it was shut off",
      "switched on at 8:05 and put to sleep at lunch",
      "lights on from 7:30 until the building closes at six",
      "a chiller that runs hardest in the morning",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The heating blower runs on a timer from 6:00 in the morning until noon.”", "“On Tuesday the blower was shut off at nine and the hum stopped then.”"], but: "“The projector is switched on at 8:05 and is put to sleep at lunch.”" },
      { who: 1, ev: ["“The projector is switched on at 8:05 and is put to sleep at lunch.”", "“A sleeping projector keeps its cooling fan running for ten minutes and then stops.”"], but: "“The hum was loudest at the ceiling vent and faint everywhere else.”" },
      { who: 3, ev: ["“The fountain chiller runs hardest in the morning when the tank has been drawn down.”", "“Mr. Dale stood under each one in turn.”"], but: "“On Tuesday the blower was shut off at nine and the hum stopped then.”" },
    ],
    clears: ["The fluorescent lights: “The fluorescent lights run from 7:30 right through until the building shuts at six.”"],
    note:
      "Tuesday is as close to an experiment as this case gets: one thing was switched off and the hum went with it. The ceiling vent is the other half. Both point the same way, and the class should notice that two separate kinds of evidence agreeing is worth more than either alone.",
  },
  8: {
    story:
      "The maple by the lot dropped every leaf on its east side in September. Its west side held green leaves into the middle of October. A crew trenched a cable line along the east side of the tree in July. Roots cut in July cannot carry water to the branches above them. A tree sheds leaves it cannot supply, and the shedding shows up weeks later. The trench ran within three feet of the trunk on the east side only. Salt was spread on that lot through February and the ground slopes east to west. Soil on the east side tested at three times the salt of the west. The hose reaches the west side and the east side is watered by bucket. The lamp on the east side has burned since before the tree was planted.",
    q: "Why did one side bare first? Make the case for one cause.",
    why: [
      "a trench within three feet of the trunk, east side only",
      "salt through February, with east soil at three times the west",
      "a lamp burning since before the tree was planted",
      "a hose that reaches west, with east watered by bucket",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“A crew trenched a cable line along the east side of the tree in July.”", "“The trench ran within three feet of the trunk on the east side only.”"], but: "“Soil on the east side tested at three times the salt of the west.”" },
      { who: 1, ev: ["“Salt was spread on that lot through February and the ground slopes east to west.”", "“Soil on the east side tested at three times the salt of the west.”"], but: "“A tree sheds leaves it cannot supply, and the shedding shows up weeks later.”" },
      { who: 3, ev: ["“The hose reaches the west side and the east side is watered by bucket.”", "“Its west side held green leaves into the middle of October.”"], but: "“Roots cut in July cannot carry water to the branches above them.”" },
    ],
    clears: ["The street lamp: “The lamp on the east side has burned since before the tree was planted.”"],
    note:
      "Three things are wrong with the east side and all of them stop water reaching leaves. The soil test is the only measurement, which gives salt an edge the others do not have. The trench has the better timing, because February salt and a September drop are seven months apart.",
  },
  9: {
    story:
      "The front-step pumpkin was carved on Monday and caved in on Friday. It stood firm through Tuesday, Wednesday and most of Thursday. A flat slice had been cut off its base on Monday so it would sit level. That cut face rested all week on concrete still damp from Sunday's rain. Cut squash takes on water and softens from the cut inward over days. The collapse began at the base and spread upward from there. Wednesday's rain fell for two hours and the step has no overhang at all. Thursday reached sixty-one degrees, which is twelve above the week's average. Warm damp air speeds up every soft rot there is. The candle inside is a battery tea light with no flame in it.",
    q: "Why did the pumpkin collapse? Choose one cause and quote the story.",
    why: [
      "a cut base resting on concrete damp since Sunday",
      "two hours of rain on a step with no overhang",
      "a battery tea light with no flame in it",
      "sixty-one degrees, twelve above the week's average",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“That cut face rested all week on concrete still damp from Sunday's rain.”", "“The collapse began at the base and spread upward from there.”"], but: "“Wednesday's rain fell for two hours and the step has no overhang at all.”" },
      { who: 1, ev: ["“Wednesday's rain fell for two hours and the step has no overhang at all.”", "“Cut squash takes on water and softens from the cut inward over days.”"], but: "“It stood firm through Tuesday, Wednesday and most of Thursday.”" },
      { who: 3, ev: ["“Thursday reached sixty-one degrees, which is twelve above the week's average.”", "“Warm damp air speeds up every soft rot there is.”"], but: "“The collapse began at the base and spread upward from there.”" },
    ],
    clears: ["The candle: “The candle inside is a battery tea light with no flame in it.”"],
    note:
      "It began at the base and went up, and that direction is the best evidence here. Rain falls on the top and warmth is everywhere. Only the wet concrete acts on the base first, and a student who argues from the direction of the damage has used the one fact the others cannot touch.",
  },
  10: {
    story:
      "Muddy prints led from the side door to the gym and stopped there. No prints at all led back out of the gym toward any door. Coach Benn found the prints at 7:35 and photographed them at once. The lot outside was soft from rain that had stopped at 6:40. Wet mud prints; mud that has dried on a sole prints nothing. Whoever walked in at seven was in the gym for half an hour. The north door's bolt was found drawn back at eight o'clock. A crew had come in through it on Friday and nobody checked it since. The custodian mopped the corridor between the gym and the north door at 7:20. Sealed wood takes a wet print, and this gym floor shows one plainly.",
    q: "Why are there no prints leading out? Pick one cause and prove it.",
    why: [
      "wet mud prints, and dried mud prints nothing",
      "a north bolt found drawn back at eight",
      "a corridor mopped at 7:20",
      "sealed wood that shows a wet print clearly",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Wet mud prints; mud that has dried on a sole prints nothing.”", "“Whoever walked in at seven was in the gym for half an hour.”"], but: "“The north door's bolt was found drawn back at eight o'clock.”" },
      { who: 1, ev: ["“The north door's bolt was found drawn back at eight o'clock.”", "“A crew had come in through it on Friday and nobody checked it since.”"], but: "“Muddy prints led from the side door to the gym and stopped there.”" },
      { who: 2, ev: ["“The custodian mopped the corridor between the gym and the north door at 7:20.”", "“No prints at all led back out of the gym toward any door.”"], but: "“Coach Benn found the prints at 7:35 and photographed them at once.”" },
    ],
    clears: ["A floor that will not take a print: “Sealed wood takes a wet print, and this gym floor shows one plainly.”"],
    note:
      "Half an hour in a gym is long enough for mud to dry on a sole, and that is the quiet answer. The mopping is the one to check against the clock: 7:20 is before 7:35, so a mop cannot erase prints that were photographed afterwards.",
  },
  11: {
    story:
      "Bus 14 reaches school on time Monday, Wednesday and Friday. It runs late on Tuesday and Thursday. The freight crossing on Mill Street closes its gates from 7:38 to 7:44 each weekday. On Monday, Wednesday and Friday the bus runs the stops in numbered order. On Tuesday and Thursday it runs them in reverse to balance the ride times. Running forward, it clears Mill Street at 7:31, before the gates come down. Running in reverse, it reaches Mill Street at 7:40 with the gates already down. The late arrivals run between five and seven minutes behind. The depot sheet shows a 7:17 departure on Tuesday and Thursday and 7:10 otherwise. The reverse route passes the high school gate, where traffic queues from 7:35. One driver has run this route since September and has missed no day.",
    q: "Why is the bus late on two days? Choose one cause and quote the story.",
    why: [
      "gates already down when the reverse run reaches Mill Street",
      "the same driver since September without a day off",
      "a high school gate where traffic queues from 7:35",
      "a 7:17 departure on Tuesday and Thursday",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“Running in reverse, it reaches Mill Street at 7:40 with the gates already down.”", "“The freight crossing on Mill Street closes its gates from 7:38 to 7:44 each weekday.”"], but: "“The depot sheet shows a 7:17 departure on Tuesday and Thursday and 7:10 otherwise.”" },
      { who: 2, ev: ["“The reverse route passes the high school gate, where traffic queues from 7:35.”", "“On Tuesday and Thursday it runs them in reverse to balance the ride times.”"], but: "“Running forward, it clears Mill Street at 7:31, before the gates come down.”" },
      { who: 3, ev: ["“The depot sheet shows a 7:17 departure on Tuesday and Thursday and 7:10 otherwise.”", "“The late arrivals run between five and seven minutes behind.”"], but: "“Running in reverse, it reaches Mill Street at 7:40 with the gates already down.”" },
    ],
    clears: ["The driver: “One driver has run this route since September and has missed no day.”"],
    note:
      "Everything here happens on the same two days, so the days cannot choose. The arithmetic can. The gates hold traffic for six minutes, the late start costs seven, and the arrival is five to seven minutes behind. Ask whether two causes together would make the bus later than it actually is.",
  },
  12: {
    story:
      "The silver relay trophy was polished bright in May and locked in the display case. By late September its surface had gone grey and faintly yellow all over. In August the case floor was relined with a dark wool felt. Wool gives off a trace of sulfur, and sulfur turns silver grey over weeks. The dulling was first noticed about five weeks after the relining. The polish tin was replaced in April with a cheaper brand from the same shop. A polish left on a surface can dull it slowly instead of protecting it. The hall humidity gauge was moved in June and has not been read since. Damp air carries sulfur to a surface far faster than dry air does. Cotton gloves went on both times anybody lifted the trophy.",
    q: "Why did the trophy dull? Make the case for one cause.",
    why: [
      "a dark wool felt lining fitted in August",
      "cotton gloves both times it was moved",
      "a cheaper polish brand since April",
      "a humidity gauge moved in June and unread since",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“In August the case floor was relined with a dark wool felt.”", "“The dulling was first noticed about five weeks after the relining.”"], but: "“The polish tin was replaced in April with a cheaper brand from the same shop.”" },
      { who: 2, ev: ["“The polish tin was replaced in April with a cheaper brand from the same shop.”", "“A polish left on a surface can dull it slowly instead of protecting it.”"], but: "“Wool gives off a trace of sulfur, and sulfur turns silver grey over weeks.”" },
      { who: 3, ev: ["“The hall humidity gauge was moved in June and has not been read since.”", "“Damp air carries sulfur to a surface far faster than dry air does.”"], but: "“In August the case floor was relined with a dark wool felt.”" },
    ],
    clears: ["Fingerprints: “Cotton gloves went on both times anybody lifted the trophy.”"],
    note:
      "Damp is not a cause here so much as a helper: it carries sulfur faster and makes no sulfur of its own. A student who says that has read the sentence properly. The polish went on in May and the dulling started in September, which is four months of nothing happening.",
  },
  13: {
    story:
      "The turkey went into the oven at eleven. The chart called for a four-hour roast. At three o'clock the thermometer read 150 instead of the 165 it needed. An oven thermometer sat on the rack beside the bird the whole time. It showed the oven climbing from cold and reaching 325 only at 11:35. A roast times from the moment the oven holds its temperature, not from loading. The bird had thirty-five fewer minutes of real roasting than anyone counted. The meat thermometer was dropped on Saturday and nobody has tested it since. The door was opened eleven times, not twice, and twice stood open for basting. An oven loses forty degrees in ten seconds with the door wide. Three days in the refrigerator had thawed the bird right through.",
    q: "Why was the turkey not done? Pick one cause and back it up.",
    why: [
      "an oven that only reached 325 at 11:35",
      "a meat thermometer dropped on Saturday and never tested",
      "a door opened eleven times, twice standing open",
      "fully thawed in the refrigerator over three days",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“It showed the oven climbing from cold and reaching 325 only at 11:35.”", "“A roast times from the moment the oven holds its temperature, not from loading.”"], but: "“The meat thermometer was dropped on Saturday and nobody has tested it since.”" },
      { who: 1, ev: ["“The meat thermometer was dropped on Saturday and nobody has tested it since.”", "“At three o'clock the thermometer read 150 instead of the 165 it needed.”"], but: "“An oven thermometer sat on the rack beside the bird the whole time.”" },
      { who: 2, ev: ["“The door was opened eleven times, not twice, and twice stood open for basting.”", "“An oven loses forty degrees in ten seconds with the door wide.”"], but: "“The bird had thirty-five fewer minutes of real roasting than anyone counted.”" },
    ],
    clears: ["A partly frozen bird: “Three days in the refrigerator had thawed the bird right through.”"],
    note:
      "The dropped thermometer is the answer that would change the question, because if it reads low the bird may be done. That is worth separating from the rest: two of these say the bird is underdone and one says the reading is wrong.",
  },
  14: {
    story:
      "Every cupcake on the left tray sank into a crater in the middle. The right tray, baked after it, came out domed and even. A cake sets its structure about two-thirds of the way through its bake. Cool air reaching a cake before it sets will drop the risen middle. The bake is eighteen minutes, and the oven door was opened at minute eight. It was opened to slide the right tray in beside the left one. The left tray was filled from the top of the bowl, where the powder had settled. Powder that settles makes the first scoops stronger than the last. The left cups were filled to the brim and the right to two thirds. A spoonful of the powder fizzed hard in vinegar that morning.",
    q: "Why did the left tray sink? Choose one cause and prove it.",
    why: [
      "a door opened at minute eight of an eighteen-minute bake",
      "filled from the top of the bowl, where the powder had settled",
      "powder that fizzed hard in vinegar",
      "left cups filled to the brim against the right at two thirds",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The bake is eighteen minutes, and the oven door was opened at minute eight.”", "“Cool air reaching a cake before it sets will drop the risen middle.”"], but: "“The left cups were filled to the brim and the right to two thirds.”" },
      { who: 1, ev: ["“The left tray was filled from the top of the bowl, where the powder had settled.”", "“Powder that settles makes the first scoops stronger than the last.”"], but: "“The bake is eighteen minutes, and the oven door was opened at minute eight.”" },
      { who: 3, ev: ["“The left cups were filled to the brim and the right to two thirds.”", "“The right tray, baked after it, came out domed and even.”"], but: "“Cool air reaching a cake before it sets will drop the risen middle.”" },
    ],
    clears: ["Old baking powder: “A spoonful of the powder fizzed hard in vinegar that morning.”"],
    note:
      "Minute eight of eighteen is just before the two-thirds mark, which the case states as the setting point. That is a calculation the class can do. The settled powder answer is the subtle one: one bowl does not mean one mixture if nobody stirred it again.",
  },
  15: {
    story:
      "Eleven pairs of mittens came back from recess soaked on the inside. The outsides of all eleven pairs were dry to the touch. The hand dryer in the washroom has been broken since the Friday before. The class washed hands at 11:40 and went straight outside without drying them. Damp skin inside a sealed mitten has nowhere to send its water. The three students who skipped the sink came back with dry mittens. Two children were seen rolling a snowball at the far end of the yard. Elastic cuffs stretch after a season and five pairs no longer grip a sleeve. Recess ran for fifteen minutes and the yard thermometer read minus two. Hands work hard in cold and a working hand gives off water as vapour. The shells are sealed and were held under a running tap in November.",
    q: "Why were the mittens wet inside? Argue for one cause.",
    why: [
      "washed at 11:40 and straight outside without drying",
      "stretched cuffs that no longer grip a sleeve",
      "a sealed shell tested under a tap in November",
      "hard-working hands at minus two, giving off vapour",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The class washed hands at 11:40 and went straight outside without drying them.”", "“The three students who skipped the sink came back with dry mittens.”"], but: "“Elastic cuffs stretch after a season and five pairs no longer grip a sleeve.”" },
      { who: 1, ev: ["“Elastic cuffs stretch after a season and five pairs no longer grip a sleeve.”", "“Two children were seen rolling a snowball at the far end of the yard.”"], but: "“The outsides of all eleven pairs were dry to the touch.”" },
      { who: 3, ev: ["“Recess ran for fifteen minutes and the yard thermometer read minus two.”", "“Hands work hard in cold and a working hand gives off water as vapour.”"], but: "“The three students who skipped the sink came back with dry mittens.”" },
    ],
    clears: ["A leaking shell: “The shells are sealed and were held under a running tap in November.”"],
    note:
      "Three dry pairs belong to the three who skipped the sink, and that is as close to an experiment as a playground gets. Five stretched cuffs against eleven wet pairs is the arithmetic that works against the snow answer, and the class should do it.",
  },
  16: {
    story:
      "Four of the six gingerbread walls cracked across the middle by evening. The two that held were the ones iced last, at half past eleven. All six walls came out of the oven together at ten o'clock. The first four were iced and joined at ten past ten, straight from the rack. Warm baked dough keeps shrinking a little as it cools to room temperature. Set icing cannot shrink with it, so the dough splits where the icing holds. The last two sat untouched for ninety minutes and were cool to the touch. The first four came off the thin end of the rolled sheet. A quarter inch at one end can be an eighth at the other. The icing was mixed in two batches and the first was stiffer than the second. No wall was dropped and nobody leaned on the finished house.",
    q: "Why did four walls crack? Pick one cause and quote the story.",
    why: [
      "iced at ten past ten, straight from the rack",
      "off the thin end of the rolled sheet",
      "a first icing batch stiffer than the second",
      "nobody dropping a wall or leaning on the house",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The first four were iced and joined at ten past ten, straight from the rack.”", "“Warm baked dough keeps shrinking a little as it cools to room temperature.”"], but: "“The first four came off the thin end of the rolled sheet.”" },
      { who: 1, ev: ["“The first four came off the thin end of the rolled sheet.”", "“A quarter inch at one end can be an eighth at the other.”"], but: "“The two that held were the ones iced last, at half past eleven.”" },
      { who: 2, ev: ["“The icing was mixed in two batches and the first was stiffer than the second.”", "“Set icing cannot shrink with it, so the dough splits where the icing holds.”"], but: "“The last two sat untouched for ninety minutes and were cool to the touch.”" },
    ],
    clears: ["A knock or a drop: “No wall was dropped and nobody leaned on the finished house.”"],
    note:
      "The same four walls were warm, thin and under the stiffer icing, so every difference lands on the same four. That is the hardest shape a case can take. The sentence about shrinking is the rule in the story, and two of the three answers use it.",
  },
  17: {
    story:
      "Half the light string went dark on Tuesday and the other half stayed lit. The dark half runs from the sixteenth bulb to the end of the string. On Tuesday morning a bulb was borrowed from the string for a craft project. It came out of the sixteenth socket and was never put back. In this older string the bulbs sit in series, in one unbroken circuit. Removing any bulb breaks that circuit and darkens every bulb after it. An extension cord was added on Monday and its joint sits by socket sixteen. A loose joint in a cord breaks a circuit exactly as a missing bulb does. Three bulbs past the sixteenth were found standing proud of their sockets. Fifteen bulbs still burning show the outlet and the plug fuse are sound.",
    q: "Why did half the string go dark? Make the case for one cause.",
    why: [
      "a bulb out of socket sixteen and never put back",
      "a lit half, proving the outlet and fuse are fine",
      "a cord joint sitting by socket sixteen",
      "three bulbs past the sixteenth standing proud",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“It came out of the sixteenth socket and was never put back.”", "“Removing any bulb breaks that circuit and darkens every bulb after it.”"], but: "“An extension cord was added on Monday and its joint sits by socket sixteen.”" },
      { who: 2, ev: ["“An extension cord was added on Monday and its joint sits by socket sixteen.”", "“A loose joint in a cord breaks a circuit exactly as a missing bulb does.”"], but: "“It came out of the sixteenth socket and was never put back.”" },
      { who: 3, ev: ["“Three bulbs past the sixteenth were found standing proud of their sockets.”", "“In this older string the bulbs sit in series, in one unbroken circuit.”"], but: "“The dark half runs from the sixteenth bulb to the end of the string.”" },
    ],
    clears: ["A blown fuse: “Fifteen bulbs still burning show the outlet and the plug fuse are sound.”"],
    note:
      "Everything in this case is at socket sixteen, so the place is settled and the cause is not. The loose bulbs are the weakest, because a loose bulb past the break would darken the string from itself onward and the darkness starts at sixteen.",
  },
  18: {
    story:
      "All sixteen hall clocks read 2:14. The office clock read 3:00. They have read exactly forty-six minutes slow every day since Tuesday. Tuesday's power cut began at 9:12 and the supply came back at 9:58. These clocks have lost forty-six minutes and have not lost a second since. The gap has stayed at forty-six minutes through four school days. A second cut on Thursday ran from 1:05 to 1:09 and the gap did not change. The hall clocks were serviced in October and three were found running slow. The caretaker has a winding key and walked the halls on Tuesday afternoon. The office clock runs on a battery and has kept perfect time throughout. Every hall clock runs off the building supply with no battery inside.",
    q: "Why are the clocks forty-six minutes slow? Choose one cause and prove it.",
    why: [
      "a cut from 9:12 to 9:58, which is forty-six minutes",
      "three found running slow at the October service",
      "clocks on the building supply with no batteries at all",
      "a caretaker with a winding key, in the halls on Tuesday",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“Tuesday's power cut began at 9:12 and the supply came back at 9:58.”", "“The gap has stayed at forty-six minutes through four school days.”"], but: "“The hall clocks were serviced in October and three were found running slow.”" },
      { who: 1, ev: ["“The hall clocks were serviced in October and three were found running slow.”", "“A second cut on Thursday ran from 1:05 to 1:09 and the gap did not change.”"], but: "“These clocks have lost forty-six minutes and have not lost a second since.”" },
      { who: 3, ev: ["“The caretaker has a winding key and walked the halls on Tuesday afternoon.”", "“They have read exactly forty-six minutes slow every day since Tuesday.”"], but: "“Tuesday's power cut began at 9:12 and the supply came back at 9:58.”" },
    ],
    clears: ["Dead batteries: “Every hall clock runs off the building supply with no battery inside.”"],
    note:
      "Thursday's second cut is the sentence that should trouble everybody. If a power cut takes a clock's time away, four more minutes should have gone on Thursday and none did. A student who notices that has found a real hole in the obvious answer.",
  },
  19: {
    story:
      "Two snow piles were plowed from the same storm. Both went up on the same Friday. The lot pile was gone by Sunday and the field pile lasted until Thursday. The lot pile was pushed onto asphalt that had baked in sun since Wednesday. Dark asphalt holds the day's heat and keeps giving it back for hours. The snow that landed on warm asphalt started melting from underneath at once. Ground that has been covered by snow all week is already at freezing. The lot pile measured four feet and the field pile six when they were plowed. A pile twice the volume takes far longer than twice as long to melt. The gym wall shades the field pile from noon until three every day. No salt went on either pile and the barrel has stayed shut since January.",
    q: "Why did one pile last longer? Pick one cause and back it up.",
    why: [
      "asphalt that had baked in sun since Wednesday",
      "four feet against the field pile's six",
      "a salt barrel unopened since January",
      "a gym wall shading the field pile from noon",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The lot pile was pushed onto asphalt that had baked in sun since Wednesday.”", "“The snow that landed on warm asphalt started melting from underneath at once.”"], but: "“The lot pile measured four feet and the field pile six when they were plowed.”" },
      { who: 1, ev: ["“The lot pile measured four feet and the field pile six when they were plowed.”", "“A pile twice the volume takes far longer than twice as long to melt.”"], but: "“Dark asphalt holds the day's heat and keeps giving it back for hours.”" },
      { who: 3, ev: ["“The gym wall shades the field pile from noon until three every day.”", "“Ground that has been covered by snow all week is already at freezing.”"], but: "“The lot pile was gone by Sunday and the field pile lasted until Thursday.”" },
    ],
    clears: ["Salt: “No salt went on either pile and the barrel has stayed shut since January.”"],
    note:
      "Four feet and six feet is not half again, it is more than three times the volume, and the case says so in the next sentence. That arithmetic is the strongest single argument here. Two days against five is a bigger gap than any one of these comfortably explains alone.",
  },
  20: {
    story:
      "The feeder went quiet on a Saturday. It had taken steady visitors all winter. On Friday the class moved the feeder from the hedge to an open post. The post stands eleven feet from the nearest branch or shrub. Small birds feed where cover is within a short hop of the perch. A bird on an open post can be seen from every direction at once. The visits stopped the morning after the move. A second window film went up on Thursday, on the glass facing the post. Film that mirrors the sky makes a window look like open air to a bird. A hawk has been seen on the fence three mornings running since Wednesday. That sack was opened the same week and the seed is dry and sweet.",
    q: "Why did the birds stop coming? Make the case for one cause.",
    why: [
      "moved to a post eleven feet from any cover",
      "seed opened that week, dry and sweet-smelling",
      "a second film on Thursday, on the glass facing the post",
      "a hawk on the fence three mornings running",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“On Friday the class moved the feeder from the hedge to an open post.”", "“The post stands eleven feet from the nearest branch or shrub.”"], but: "“A second window film went up on Thursday, on the glass facing the post.”" },
      { who: 2, ev: ["“A second window film went up on Thursday, on the glass facing the post.”", "“Film that mirrors the sky makes a window look like open air to a bird.”"], but: "“The visits stopped the morning after the move.”" },
      { who: 3, ev: ["“A hawk has been seen on the fence three mornings running since Wednesday.”", "“A bird on an open post can be seen from every direction at once.”"], but: "“On Friday the class moved the feeder from the hedge to an open post.”" },
    ],
    clears: ["Stale seed: “That sack was opened the same week and the seed is dry and sweet.”"],
    note:
      "The hawk and the open post are not rivals, they are the same danger seen twice: a bird refuses an exposed perch because of what might be watching. The strongest answers say so. The film arrived a day earlier and the birds still came on Friday.",
  },
  21: {
    story:
      "The first pot of cocoa came out lumpy and the second came out smooth. For the first pot the powder was poured straight into the hot milk. For the second the powder was stirred into a splash of cold milk first. Cocoa powder meeting hot liquid seals on the outside of each clump instantly. That seal traps dry powder inside, and stirring cannot reach what is sealed. The lumps in the first pot were dry powder when they were cut open. The first pot was stirred with a fork and the second with a whisk. A fork pushes lumps around where a whisk breaks them open. The first pot of milk reached 185 degrees and the second only 160. Hotter milk seals a clump harder and faster than warm milk does. One tin served both pots, opened in November and still perfectly dry.",
    q: "Why was the first pot lumpy? Choose one cause and quote the story.",
    why: [
      "poured straight into hot milk, which seals each clump",
      "one tin, opened in November and still dry",
      "a fork for the first pot and a whisk for the second",
      "185 degrees against the second pot's 160",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“For the first pot the powder was poured straight into the hot milk.”", "“That seal traps dry powder inside, and stirring cannot reach what is sealed.”"], but: "“The first pot was stirred with a fork and the second with a whisk.”" },
      { who: 2, ev: ["“The first pot was stirred with a fork and the second with a whisk.”", "“A fork pushes lumps around where a whisk breaks them open.”"], but: "“The lumps in the first pot were dry powder when they were cut open.”" },
      { who: 3, ev: ["“The first pot of milk reached 185 degrees and the second only 160.”", "“Hotter milk seals a clump harder and faster than warm milk does.”"], but: "“For the second the powder was stirred into a splash of cold milk first.”" },
    ],
    clears: ["Old cocoa powder: “One tin served both pots, opened in November and still perfectly dry.”"],
    note:
      "Dry powder inside the lumps is the observation that settles most of this. A fork that fails to break a lump leaves a wet lump; a sealed clump stays dry in the middle. Ask the class what they would expect to find inside under each answer.",
  },
  22: {
    story:
      "Almost every student got the card meant for whoever sits beside them. Nobody got a card at random, and nobody got two cards from one person. On Wednesday the cards were sorted into bags arranged in seating order. On Thursday morning a helper lined the bags up in alphabetical order. Cards sorted by position go wrong the moment the positions change. The mix-up runs the same direction for the whole class, not here and there. The first bag in both orders is the only one that is correct. Four bags lost their labels on Wednesday and were relabelled from memory. Two students share the first name Jordan and sit at opposite ends of the row. Nobody could get in: the room stayed locked from Wednesday afternoon to Thursday.",
    q: "Why did the cards land one bag over? Pick one cause and prove it.",
    why: [
      "bags relined alphabetically after the cards went in by seat",
      "a room locked from Wednesday afternoon until Thursday",
      "two Jordans sitting at opposite ends of the row",
      "four labels lost on Wednesday and replaced from memory",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“On Thursday morning a helper lined the bags up in alphabetical order.”", "“Cards sorted by position go wrong the moment the positions change.”"], but: "“Four bags lost their labels on Wednesday and were relabelled from memory.”" },
      { who: 2, ev: ["“Two students share the first name Jordan and sit at opposite ends of the row.”", "“Nobody got a card at random, and nobody got two cards from one person.”"], but: "“The mix-up runs the same direction for the whole class, not here and there.”" },
      { who: 3, ev: ["“Four bags lost their labels on Wednesday and were relabelled from memory.”", "“The first bag in both orders is the only one that is correct.”"], but: "“Cards sorted by position go wrong the moment the positions change.”" },
    ],
    clears: ["A student mixing them: “Nobody could get in: the room stayed locked from Wednesday afternoon to Thursday.”"],
    note:
      "One bag over, in the same direction, for the whole class. That is a shift, and a shift needs something that moved everything at once. Two Jordans spoil two cards and four lost labels spoil four. The class should count what each answer covers against a whole class.",
  },
  23: {
    story:
      "Monday's volcano gave a weak gurgle where Friday's model had erupted properly. Friday's soda went into the cone and the vinegar followed within a minute. Monday's soda had been loaded into its cone on Friday afternoon. That cone's papier-mache was still damp when the soda went in. Baking soda reacts slowly with damp acidic paste and gives up its gas quietly. Over a weekend a damp cone can use up most of the soda inside it. The soda scraped out on Monday no longer fizzed in a test cup. The vinegar bottle used on Monday had stood open on the shelf since Friday. Monday's cone has a neck half the width of Friday's, which was built wider. Each cone took two level spoons of soda, from the one spoon.",
    q: "Why did Monday's volcano barely fizz? Choose one cause and quote the story.",
    why: [
      "soda sitting in a damp cone from Friday to Monday",
      "a bottle standing open on the shelf since Friday",
      "two level spoons each, from the same spoon",
      "a neck half the width of Friday's cone",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“Monday's soda had been loaded into its cone on Friday afternoon.”", "“The soda scraped out on Monday no longer fizzed in a test cup.”"], but: "“The vinegar bottle used on Monday had stood open on the shelf since Friday.”" },
      { who: 1, ev: ["“The vinegar bottle used on Monday had stood open on the shelf since Friday.”", "“Baking soda reacts slowly with damp acidic paste and gives up its gas quietly.”"], but: "“The soda scraped out on Monday no longer fizzed in a test cup.”" },
      { who: 3, ev: ["“Monday's cone has a neck half the width of Friday's, which was built wider.”", "“Monday's volcano gave a weak gurgle where Friday's model had erupted properly.”"], but: "“Over a weekend a damp cone can use up most of the soda inside it.”" },
    ],
    clears: ["Too little soda: “Each cone took two level spoons of soda, from the one spoon.”"],
    note:
      "The scraped-out soda failing in a test cup is a measurement somebody actually took, and it beats the other two on evidence alone. A narrow neck slows foam without weakening the reaction, and the class should separate how much gas is made from how fast it gets out.",
  },
  24: {
    story:
      "Dev's paper crown closed easily at ten o'clock and would not meet at half past eleven. The strip was brushed all over with wet paste before the gems went on. Paper takes up water, swells a little, and gives that length back as it dries. At ten the paste was wet and the strip was still damp through. By half past eleven the crown was dry, stiff and about an inch short. The other crowns, glued at the ends only, all still close. Nine gems were added along the strip between ten and eleven. Each gem sits on a tab that folds back and takes up a quarter inch. The radiator under the table ran all morning on the high setting. Dev's head is twenty-one inches and has measured that since September.",
    q: "Why will the crown not close? Make the case for one cause.",
    who: ["", "💎 The nine gem tabs", "🔥 The radiator under the table", ""],
    why: [
      "wet paste swelling the paper, which gives the length back as it dries",
      "nine gems on folded tabs, a quarter inch each",
      "a radiator running all morning on high",
      "a head of twenty-one inches, unchanged since September",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Paper takes up water, swells a little, and gives that length back as it dries.”", "“The other crowns, glued at the ends only, all still close.”"], but: "“Nine gems were added along the strip between ten and eleven.”" },
      { who: 1, ev: ["“Nine gems were added along the strip between ten and eleven.”", "“Each gem sits on a tab that folds back and takes up a quarter inch.”"], but: "“At ten the paste was wet and the strip was still damp through.”" },
      { who: 2, ev: ["“The radiator under the table ran all morning on the high setting.”", "“By half past eleven the crown was dry, stiff and about an inch short.”"], but: "“The other crowns, glued at the ends only, all still close.”" },
    ],
    clears: ["A growing head: “Dev's head is twenty-one inches and has measured that since September.”"],
    note:
      "An inch short and nine quarter-inch tabs is two and a quarter inches of folding, which is more than the crown actually lost. That arithmetic is worth doing out loud, because an answer that overshoots is as suspect as one that falls short.",
  },
  25: {
    story:
      "The hall piano was tuned on Monday and sounded wrong by Friday morning. The hall is heated and the radiators were switched on for the season on Tuesday. Dry heat pulls moisture out of wood over several days, not all at once. A soundboard that loses moisture shrinks, and shrinking wood slackens every string. The hall's humidity gauge fell from forty-two percent Tuesday to twenty-four by Friday. The chapel's gauge has not moved from forty-one percent all week. The hall piano was rolled eight feet on Wednesday to clear space for chairs. The hall is used for assembly and three classes practised on it this week. Every string in the hall piano went flat by about the same amount. That tuner did the chapel piano the same afternoon and it holds yet.",
    q: "Why did the piano go flat? Pick one cause and back it up.",
    why: [
      "humidity from forty-two to twenty-four in four days",
      "a tuner whose chapel piano still holds",
      "three classes practising on it this week",
      "rolled eight feet on Wednesday to clear space",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“The hall's humidity gauge fell from forty-two percent Tuesday to twenty-four by Friday.”", "“A soundboard that loses moisture shrinks, and shrinking wood slackens every string.”"], but: "“The hall piano was rolled eight feet on Wednesday to clear space for chairs.”" },
      { who: 2, ev: ["“The hall is used for assembly and three classes practised on it this week.”", "“The hall is heated and the radiators were switched on for the season on Tuesday.”"], but: "“Every string in the hall piano went flat by about the same amount.”" },
      { who: 3, ev: ["“The hall piano was rolled eight feet on Wednesday to clear space for chairs.”", "“Dry heat pulls moisture out of wood over several days, not all at once.”"], but: "“The chapel's gauge has not moved from forty-one percent all week.”" },
    ],
    clears: ["The tuner's work: “That tuner did the chapel piano the same afternoon and it holds yet.”"],
    note:
      "Every string flat by about the same amount is the sentence to hold everybody to. Playing wears some notes harder than others and a move jolts one section. Only something acting on the whole frame moves every string together, and the gauge gives a number for it.",
  },
  26: {
    story:
      "The kite would not climb at noon and flew well at four, three days running. A line of tall pines runs along the whole west edge of the field. The morning wind comes from the west and the pines break it before the field. By mid-afternoon the wind swings around to the south every day. The south side of the field is open ground with nothing standing on it. A rooftop reading is taken above the trees and misses what they do below. The windsock on the field hangs limp at noon and stands out at four. The rooftop station logged six miles an hour at noon and eleven at four. The tail was lengthened after the first noon attempt and left long all week. Every spar was checked for cracks that first afternoon and all are sound.",
    q: "Why would the kite only fly at four? Choose one cause and prove it.",
    why: [
      "pines along the west edge, breaking the morning wind",
      "six miles an hour at noon against eleven at four",
      "a tail lengthened after the first attempt and left long",
      "spars checked for cracks on the first afternoon",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The morning wind comes from the west and the pines break it before the field.”", "“The windsock on the field hangs limp at noon and stands out at four.”"], but: "“The rooftop station logged six miles an hour at noon and eleven at four.”" },
      { who: 1, ev: ["“The rooftop station logged six miles an hour at noon and eleven at four.”", "“By mid-afternoon the wind swings around to the south every day.”"], but: "“A rooftop reading is taken above the trees and misses what they do below.”" },
      { who: 2, ev: ["“The tail was lengthened after the first noon attempt and left long all week.”", "“The south side of the field is open ground with nothing standing on it.”"], but: "“The windsock on the field hangs limp at noon and stands out at four.”" },
    ],
    clears: ["A cracked spar: “Every spar was checked for cracks that first afternoon and all are sound.”"],
    note:
      "Two measurements disagree and that is the case. The rooftop says the wind nearly doubled; the windsock on the field says it went from nothing to something. The sentence about what a rooftop reading misses tells you which one to trust and why.",
  },
  27: {
    story:
      "The shamrock folded its leaves at ten past four every day for a week. It folded at ten past four on the cloudy Tuesday as well as the bright Monday. On Wednesday it sat in a dark supply closet from noon onward. In the closet, with no light at all reaching it, it folded at ten past four. Some plants fold on a daily rhythm their own cells keep without any cue. Nothing in the week shifted that folding by more than two minutes. The heating timer in that room switches off at four o'clock each afternoon. The cleaner's trolley passes that shelf at ten past four every day. A shamrock will fold within a minute if a leaf is brushed. It was watered at eight each morning, on the schedule it has always had.",
    q: "Why does it fold at ten past four? Make the case for one cause.",
    who: ["", "🧹 The cleaner's trolley", "", "⏲️ The heating timer at four"],
    why: [
      "a rhythm its own cells keep, holding through dark and cloud",
      "a trolley passing that shelf at ten past four every day",
      "watering every morning at eight, unchanged",
      "a heating timer that switches off at four",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“In the closet, with no light at all reaching it, it folded at ten past four.”", "“Some plants fold on a daily rhythm their own cells keep without any cue.”"], but: "“The cleaner's trolley passes that shelf at ten past four every day.”" },
      { who: 1, ev: ["“The cleaner's trolley passes that shelf at ten past four every day.”", "“A shamrock will fold within a minute if a leaf is brushed.”"], but: "“On Wednesday it sat in a dark supply closet from noon onward.”" },
      { who: 3, ev: ["“The heating timer in that room switches off at four o'clock each afternoon.”", "“Nothing in the week shifted that folding by more than two minutes.”"], but: "“It was watered at eight each morning, on the schedule it has always had.”" },
    ],
    clears: ["Lack of water: “It was watered at eight each morning, on the schedule it has always had.”"],
    note:
      "Wednesday in the closet is the strongest evidence and it has a hole in it: nobody says whether the trolley passes the closet. Ask for that one missing fact. A clock-time match is weaker than it feels, because three different things happen at four.",
  },
  28: {
    story:
      "One puddle in the lot is still there three days after every rain. The rest of the lot dries within a few hours of the last drop. A crew dug up that spot in June to reach a water line underneath. Soil that has been dug and refilled settles over the months that follow. A level laid across the spot shows it sitting an inch below the lot. Water runs downhill and collects wherever the surface drops below its surroundings. The puddle's outline matches the edges of the June patch almost exactly. The water line under that patch was rejointed in June and never pressure tested. The storm drain twenty feet away was last flushed in May, before the dig. Leaves and grit from the dig were swept toward that drain for a week. That spot lies in open sun from morning until late afternoon.",
    q: "Why does one puddle last three days? Pick one cause and prove it.",
    who: ["", "", "🚰 The rejointed water line", ""],
    why: [
      "a patch settled an inch below the lot, matching the outline",
      "a drain last flushed in May, with grit swept into it since",
      "a water line rejointed in June and never pressure tested",
      "open sun on that spot from morning until late afternoon",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A level laid across the spot shows it sitting an inch below the lot.”", "“The puddle's outline matches the edges of the June patch almost exactly.”"], but: "“The water line under that patch was rejointed in June and never pressure tested.”" },
      { who: 1, ev: ["“The storm drain twenty feet away was last flushed in May, before the dig.”", "“Leaves and grit from the dig were swept toward that drain for a week. That spot lies in open sun from morning until late afternoon.”"], but: "“The rest of the lot dries within a few hours of the last drop.”" },
      { who: 2, ev: ["“The water line under that patch was rejointed in June and never pressure tested.”", "“Soil that has been dug and refilled settles over the months that follow.”"], but: "“One puddle in the lot is still there three days after every rain.”" },
    ],
    clears: ["Shade: “That spot lies in open sun from morning until late afternoon.”"],
    note:
      "Only after rain is the phrase that works against the leaking pipe, because a leak does not wait for weather. The drain answer has to explain why one spot and not the twenty feet between. The outline matching the patch is the single best piece of evidence on the page.",
  },
  29: {
    story:
      "Not one seed came up in the raised bed, six weeks after planting. On March 28 the bed was treated against weeds before the season began. That product coats the soil and stops any seed from sprouting for six weeks. The class planted its seeds on April 2, five days after the treatment. Weeds have not come up in that bed either, anywhere along its length. The bed beside it, left untreated, is thick with both seedlings and weeds. The raised bed was topped up in March with soil from the builder's pile. The net over the bed has a tear at one corner the width of a hand. Seed from the same packet was laid on a damp towel indoors as a test. Those were up in four days, so the seed itself is fine.",
    q: "Why did nothing come up? Choose one cause and quote the story.",
    who: ["", "", "🕳️ The tear in the net", "🪨 Soil from the builder's pile"],
    why: [
      "a weed treatment five days before planting that stops any seed",
      "seed that sprouted in four days on a damp towel",
      "a tear in the net the width of a hand",
      "a bed topped up in March with soil from the builder's pile",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“That product coats the soil and stops any seed from sprouting for six weeks.”", "“The class planted its seeds on April 2, five days after the treatment.”"], but: "“The raised bed was topped up in March with soil from the builder's pile.”" },
      { who: 2, ev: ["“The net over the bed has a tear at one corner the width of a hand.”", "“The bed beside it, left untreated, is thick with both seedlings and weeds.”"], but: "“Weeds have not come up in that bed either, anywhere along its length.”" },
      { who: 3, ev: ["“The raised bed was topped up in March with soil from the builder's pile.”", "“Not one seed came up in the raised bed, six weeks after planting.”"], but: "“That product coats the soil and stops any seed from sprouting for six weeks.”" },
    ],
    clears: ["Bad seed: “Those were up in four days, so the seed itself is fine.”"],
    note:
      "No weeds either is the fact that decides this, and a tear the width of a hand cannot explain a bed with nothing in it. Something in that soil stops everything. The argument is whether it arrived in a bottle in March or in a barrow.",
  },
  30: {
    story:
      "One egg floated upright in the bowl while the other five lay flat on the bottom. A shell is slightly porous, and an egg loses water through it over weeks. As water leaves, the air pocket at the blunt end grows larger and lighter. Five of the eggs came from a carton dated the twelfth of this month. The floating egg came from a carton at the back dated five weeks earlier. The older egg's air pocket measured almost twice the width of the others. The floating egg had sat on the warm shelf above the radiator since Friday. Warmth drives water out through a shell faster than cold does. The floating egg is the smallest of the six by a clear margin. Each shell went under a lamp and no crack showed on any of them.",
    q: "Why did one egg float? Make the case for one cause.",
    who: ["", "", "🔥 Five days on the warm shelf", "📏 Being the smallest egg"],
    why: [
      "a carton five weeks older, with an air pocket twice the width",
      "every shell checked under a lamp with no crack found",
      "five days on the warm shelf above the radiator",
      "the smallest of the six by a clear margin",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“The floating egg came from a carton at the back dated five weeks earlier.”", "“The older egg's air pocket measured almost twice the width of the others.”"], but: "“The floating egg had sat on the warm shelf above the radiator since Friday.”" },
      { who: 2, ev: ["“The floating egg had sat on the warm shelf above the radiator since Friday.”", "“Warmth drives water out through a shell faster than cold does.”"], but: "“As water leaves, the air pocket at the blunt end grows larger and lighter.”" },
      { who: 3, ev: ["“The floating egg is the smallest of the six by a clear margin.”", "“One egg floated upright in the bowl while the other five lay flat on the bottom.”"], but: "“The older egg's air pocket measured almost twice the width of the others.”" },
    ],
    clears: ["A cracked shell: “Each shell went under a lamp and no crack showed on any of them.”"],
    note:
      "Age and warmth do the same thing by the same route, so the first two answers are one mechanism at two speeds. Five weeks against five days is the comparison to make. Smallness is the odd one: a smaller egg is not a lighter one for its size.",
  },
  31: {
    story:
      "The class marks the pole's shadow at ten o'clock on the first of each month. The October mark and the November mark sit nearly a hand apart. The clocks were set back one hour on the last Sunday in October. The October mark was made before that change and the November mark after. Ten o'clock in November falls an hour earlier in the sun's own day. Two weeks of autumn moves the midday sun by only a small amount. The October mark was made on the fourth, not the first, after a wet weekend. The November chalk was drawn to the tip and the October chalk to the base. A hand's width at the pole is about three feet out at the shadow's end. Set in concrete, the pole was checked for lean ahead of both markings.",
    q: "Why did the shadow jump? Pick one cause and back it up.",
    who: ["", "", "", "📐 Where the chalk was drawn"],
    why: [
      "clocks set back, so ten o'clock falls an hour earlier in the sun's day",
      "a small seasonal shift over two weeks",
      "a pole in concrete, checked for lean each time",
      "chalk to the tip in November and to the base in October",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The clocks were set back one hour on the last Sunday in October.”", "“Ten o'clock in November falls an hour earlier in the sun's own day.”"], but: "“The October mark was made on the fourth, not the first, after a wet weekend.”" },
      { who: 1, ev: ["“The October mark was made on the fourth, not the first, after a wet weekend.”", "“Two weeks of autumn moves the midday sun by only a small amount.”"], but: "“Ten o'clock in November falls an hour earlier in the sun's own day.”" },
      { who: 3, ev: ["“The November chalk was drawn to the tip and the October chalk to the base.”", "“A hand's width at the pole is about three feet out at the shadow's end.”"], but: "“The clocks were set back one hour on the last Sunday in October.”" },
    ],
    clears: ["The pole leaning: “Set in concrete, the pole was checked for lean ahead of both markings.”"],
    note:
      "Measuring to the tip one month and the base the next is not a measurement at all, and finding that sentence is the point of the case. The clock change is real and large. Ask the class which of the two would still be there if both marks had been drawn the same way.",
  },
  32: {
    story:
      "Three runners came out sharp in the finish photograph and the fourth came out smeared. When the shutter opened all four stood the same distance from the lens. The shutter stayed open for one sixtieth of a second on every frame. A subject moving across the frame crosses many pixels in that time. A subject moving straight toward the lens barely shifts across the frame at all. Three of the runners were driving directly at the camera down the straight. The fourth had already crossed the line and was turning left off the track. Her smear runs sideways across the picture, not toward or away from it. The camera was braced on a fence post that a spectator knocked at the finish. She wore the only white vest, and white smears further into a dark background.",
    q: "Why is one runner blurred? Choose one cause and prove it from the text.",
    who: ["", "", "", "👕 Her white vest"],
    why: [
      "turning left off the track, with a sideways smear",
      "a fence post a spectator knocked at the finish",
      "all four the same distance from the lens",
      "the only white vest, smearing further into a dark background",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The fourth had already crossed the line and was turning left off the track.”", "“Her smear runs sideways across the picture, not toward or away from it.”"], but: "“The camera was braced on a fence post that a spectator knocked at the finish.”" },
      { who: 1, ev: ["“The camera was braced on a fence post that a spectator knocked at the finish.”", "“The shutter stayed open for one sixtieth of a second on every frame.”"], but: "“Three of the runners were driving directly at the camera down the straight.”" },
      { who: 3, ev: ["“She wore the only white vest, and white smears further into a dark background.”", "“A subject moving across the frame crosses many pixels in that time.”"], but: "“A subject moving straight toward the lens barely shifts across the frame at all.”" },
    ],
    clears: ["Bad focus: “When the shutter opened all four stood the same distance from the lens.”"],
    note:
      "A knocked camera smears everything, including the three sharp runners, and a student who says so has beaten that answer with one sentence. The white vest is a trap worth springing: it makes a smear easier to see without making the smear.",
  },
  33: {
    story:
      "The bean plant leans away from the window and toward the back of the room. A plant bends toward whatever light reaches it for the most hours. The grow lamp at the back of the room is on a timer each day. That timer runs the lamp from two in the afternoon until midnight. Ten hours of lamp against six hours of morning sun is not a close contest. The lean points directly at the lamp and not at any corner of the room. The shelf the pot stands on slopes about a finger's width toward the back. The window blind has been down since the first week of term. The roots have plenty of room and fresh soil went in three weeks ago.",
    q: "Why does the bean lean to the back? Make the case for one cause.",
    who: ["", "🪟 The blind that stays down", "📐 The sloping shelf", ""],
    why: [
      "ten hours of lamp against six of sun, with the lean on the lamp",
      "a blind down since the first week of term",
      "a shelf sloping a finger's width toward the back",
      "roots with room and soil changed three weeks ago",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“That timer runs the lamp from two in the afternoon until midnight.”", "“The lean points directly at the lamp and not at any corner of the room.”"], but: "“The window blind has been down since the first week of term.”" },
      { who: 1, ev: ["“The window blind has been down since the first week of term.”", "“A plant bends toward whatever light reaches it for the most hours.”"], but: "“Ten hours of lamp against six hours of morning sun is not a close contest.”" },
      { who: 2, ev: ["“The shelf the pot stands on slopes about a finger's width toward the back.”", "“The bean plant leans away from the window and toward the back of the room.”"], but: "“The lean points directly at the lamp and not at any corner of the room.”" },
    ],
    clears: ["A damaged stem: “The roots have plenty of room and fresh soil went in three weeks ago.”"],
    note:
      "The blind changes the arithmetic: six hours of sun behind a blind is not six hours of sun. Whether that makes the lamp a stronger answer or a weaker one is a fair argument. Pointing directly at the lamp is the detail a sloping shelf cannot match.",
  },
  34: {
    story:
      "Ice cream in the metal bowl was soup in ten minutes and the ceramic bowl held firm. Metal carries heat quickly, which is the answer everybody offered first. A second metal bowl was taken straight from the cupboard and tested next. The cupboard bowl's scoop lasted as long as the ceramic one, to within a minute. The first metal bowl had been in the dish rack by the sunny window since noon. It measured ninety-one degrees when the ice cream went into it. The cupboard bowl and the ceramic bowl both measured sixty-eight degrees. A warm bowl has heat of its own to give before the room's heat matters. The first metal bowl is wide and shallow where the others are deep. The two bowls stood side by side on one table in one room.",
    q: "Why did one scoop melt first? Pick one cause and quote the story.",
    who: ["", "", "🥣 A wide shallow bowl", ""],
    why: [
      "an hour in the sunny dish rack, at ninety-one degrees",
      "a cupboard metal bowl that lasted as long as the ceramic",
      "wide and shallow where the others are deep",
      "both bowls side by side in the same room",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The first metal bowl had been in the dish rack by the sunny window since noon.”", "“It measured ninety-one degrees when the ice cream went into it.”"], but: "“The first metal bowl is wide and shallow where the others are deep.”" },
      { who: 1, ev: ["“Metal carries heat quickly, which is the answer everybody offered first.”", "“The cupboard bowl and the ceramic bowl both measured sixty-eight degrees.”"], but: "“The cupboard bowl's scoop lasted as long as the ceramic one, to within a minute.”" },
      { who: 2, ev: ["“The first metal bowl is wide and shallow where the others are deep.”", "“A warm bowl has heat of its own to give before the room's heat matters.”"], but: "“It measured ninety-one degrees when the ice cream went into it.”" },
    ],
    clears: ["A warm room: “The two bowls stood side by side on one table in one room.”"],
    note:
      "The cupboard bowl is a real experiment and the class should say what it tests. Same metal, same room, cold start, and it behaved like the ceramic. That beats the metal answer outright and leaves warmth and shape, which the case does not separate.",
  },
  35: {
    story:
      "Half the ribbons on the display board are pale pink and half are deep red. The pale ones were pinned up in September and have hung there since. The deep red ones were pinned up in February, five months later. The board hangs where afternoon sun falls across it for several hours. Sunlight breaks down dye slowly, and the fading adds up over months. Lift the pin on any pale ribbon and the covered spot is still deep red. The pale ones were cut from the end of the roll, where the colour ran thin. The heating vent below the board was rebuilt in October and now blows hot. Not one ribbon has been washed or cleaned at any time.",
    q: "Why are half the ribbons pale? Choose one cause and back it up.",
    who: ["", "", "", "🔥 The rebuilt heating vent"],
    why: [
      "five extra months of afternoon sun on the board",
      "cut from the end of the roll, where the colour ran thin",
      "never washed or cleaned in any way",
      "a vent rebuilt in October that now blows hot",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The pale ones were pinned up in September and have hung there since.”", "“Lift the pin on any pale ribbon and the covered spot is still deep red.”"], but: "“The pale ones were cut from the end of the roll, where the colour ran thin.”" },
      { who: 1, ev: ["“The pale ones were cut from the end of the roll, where the colour ran thin.”", "“Half the ribbons on the display board are pale pink and half are deep red.”"], but: "“Lift the pin on any pale ribbon and the covered spot is still deep red.”" },
      { who: 3, ev: ["“The heating vent below the board was rebuilt in October and now blows hot.”", "“The deep red ones were pinned up in February, five months later.”"], but: "“Sunlight breaks down dye slowly, and the fading adds up over months.”" },
    ],
    clears: ["Washing: “Not one ribbon has been washed or cleaned at any time.”"],
    note:
      "The spot under the pin is the strongest evidence in the case and it kills the dye answer by itself: the ribbon was deep red where nothing could reach it. Make the class say what the pin was protecting the ribbon from, and the answer narrows to light or heat.",
  },
  36: {
    story:
      "Every latex balloon was on the floor by morning and every foil balloon was still up. Latex is full of tiny gaps, and helium atoms are small enough to slip through. A latex balloon loses most of its lift within about eighteen hours. Foil balloons have a sealed plastic layer that helium cannot pass through. Eighteen hours had passed between filling and the morning they were found down. The latex balloons were filled first, while the tank was at full pressure. A balloon filled at full pressure is stretched thinner than one filled later. The latex balloons carried paper weights and the foil ones carried ribbon only. The room fell to fifty-one degrees overnight once the heating went off. One tank filled every balloon between two and three yesterday.",
    q: "Why did the latex balloons sink? Make the case for one cause.",
    who: ["", "", "⚖️ The paper weights", ""],
    why: [
      "helium slipping through latex, over about eighteen hours",
      "a room that fell to fifty-one degrees overnight",
      "paper weights on the latex and ribbon on the foil",
      "one tank, filling everything between two and three",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Latex is full of tiny gaps, and helium atoms are small enough to slip through.”", "“Eighteen hours had passed between filling and the morning they were found down.”"], but: "“The latex balloons carried paper weights and the foil ones carried ribbon only.”" },
      { who: 1, ev: ["“The room fell to fifty-one degrees overnight once the heating went off.”", "“The latex balloons were filled first, while the tank was at full pressure.”"], but: "“Foil balloons have a sealed plastic layer that helium cannot pass through.”" },
      { who: 2, ev: ["“The latex balloons carried paper weights and the foil ones carried ribbon only.”", "“A balloon filled at full pressure is stretched thinner than one filled later.”"], but: "“A latex balloon loses most of its lift within about eighteen hours.”" },
    ],
    clears: ["A bad helium tank: “One tank filled every balloon between two and three yesterday.”"],
    note:
      "The cold hit both kinds and only one kind came down, which the class should use at once. The paper weights are the better rival, because they were only ever on the latex. Ask what would settle it, and somebody will say put a weight on a foil balloon tonight.",
  },
};
