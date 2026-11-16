/**
 * Grade 9, the debate version of each case. See scripts/mysteries/g5.debate.mjs
 * for what these files are and what the gate holds them to.
 *
 * The ordinary grade 9 case asks what else would be true if a suspect were
 * the cause, and then looks. Every suspect predicts something, and the case
 * carries the observation that kills all but one of those predictions.
 *
 * These keep the method and remove the answers. Three suspects still predict
 * three different things, and the case now contains an observation for each
 * of them rather than against. A student has to decide which prediction the
 * evidence supports most, which is the same work with nothing to land on.
 */
export const DEBATES = {
  1: {
    story:
      "Forty books on the bottom shelf of the north wall have swollen covers and wavy pages. The damage is worst at the wall end of the shelf and fades along it. The plaster behind that shelf is blistered from the skirting board upward. A hot water pipe runs inside the north wall at floor level. Water escaping at floor level wets what sits lowest and nearest, which is exactly the pattern on the shelf. A roof leak was repaired above that corner in March and the patch has lifted. Water from a roof runs down inside a cavity and comes out wherever the cavity ends. The cavity in the north wall ends at the skirting board. A bottle of water was knocked over on that shelf in February and nobody wiped it. Paper that has once been soaked stays wavy even after it dries. Room humidity reads forty-four percent, which is this building's normal. No mop has been near that aisle since the damage was first reported.",
    q: "What is wetting the books? Pick one cause and prove it from the text.",
    why: [
      "a hot water pipe at floor level, with the plaster blistered upward",
      "a March roof patch lifted, over a cavity ending at the skirting",
      "humidity at forty-four percent, normal for the building",
      "a bottle knocked over in February and never wiped",
      "a crew that has not mopped the aisle since it was reported",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“A hot water pipe runs inside the north wall at floor level.”", "“The plaster behind that shelf is blistered from the skirting board upward.”"], but: "“A roof leak was repaired above that corner in March and the patch has lifted.”" },
      { who: 1, ev: ["“A roof leak was repaired above that corner in March and the patch has lifted.”", "“Water from a roof runs down inside a cavity and comes out wherever the cavity ends.”"], but: "“Water escaping at floor level wets what sits lowest and nearest, which is exactly the pattern on the shelf.”" },
      { who: 3, ev: ["“A bottle of water was knocked over on that shelf in February and nobody wiped it.”", "“Paper that has once been soaked stays wavy even after it dries.”"], but: "“The damage is worst at the wall end of the shelf and fades along it.”" },
    ],
    clears: [
      "Room humidity: “Room humidity reads forty-four percent, which is this building's normal.”",
      "The cleaning crew: “No mop has been near that aisle since the damage was first reported.”",
    ],
    note:
      "The roof answer used to die on the dry top shelf and now it has a route down the cavity to the same skirting board. Both pipe and roof predict damage lowest and nearest the wall, which is what the shelf shows. The bottle is the one that should have left a patch and left a gradient instead.",
  },
  2: {
    story:
      "Mira's sandwich is slimy on Fridays and fine the other four days of the week. The lunchbox is washed in hot water on Thursday night after school. It is dried with a cloth and the lid is clipped shut while the seams are still wet. A sealed box with water trapped in its seams grows a film overnight. Thursday is the only night the box is both washed and closed. The deli meat is sliced fresh on Thursday evening for Friday only. Sliced meat loses its surface the moment it is cut and goes slimy soonest. Thursday's slicing is done on the same board the butcher uses for raw chicken. The hot water wash is done at seventy degrees in the dishwasher's top rack. Plastic warped by that heat no longer seals, and a box that will not seal sweats. Two of the box's clips no longer meet their catches. The bread comes from one loaf bought on Sunday and used all week. The mayonnaise jar is opened on Monday and used every day from the same spoon.",
    q: "Why is the Friday sandwich slimy? Choose one cause and quote the story.",
    why: [
      "clipped shut on Thursday night with the seams still wet",
      "one loaf, bought Sunday and used all week",
      "sliced Thursday on the board used for raw chicken",
      "one jar, opened Monday, from the same spoon each day",
      "a seventy-degree wash, and two clips that no longer meet",
    ],
    open: [0, 2, 4],
    for: [
      { who: 0, ev: ["“It is dried with a cloth and the lid is clipped shut while the seams are still wet.”", "“A sealed box with water trapped in its seams grows a film overnight.”"], but: "“Thursday's slicing is done on the same board the butcher uses for raw chicken.”" },
      { who: 2, ev: ["“The deli meat is sliced fresh on Thursday evening for Friday only.”", "“Thursday's slicing is done on the same board the butcher uses for raw chicken.”"], but: "“Thursday is the only night the box is both washed and closed.”" },
      { who: 4, ev: ["“The hot water wash is done at seventy degrees in the dishwasher's top rack.”", "“Plastic warped by that heat no longer seals, and a box that will not seal sweats.”"], but: "“A sealed box with water trapped in its seams grows a film overnight.”" },
    ],
    clears: [
      "The bread: “The bread comes from one loaf bought on Sunday and used all week.”",
      "The mayonnaise: “The mayonnaise jar is opened on Monday and used every day from the same spoon.”",
    ],
    note:
      "Everything in this case happens on Thursday, which is why the day cannot choose. Two clips that no longer meet is the detail that makes the fourth answer awkward: a box that will not shut cannot also be a box sealed with water inside it. Those two answers contradict each other and the class should say so.",
  },
  3: {
    story:
      "Pencils from the new box snap their points within a word or two of sharpening. Pencils from the old box sharpen in the same sharpener and write all period. A pencil's lead is one thin rod running the full length of the barrel. One sharp knock cracks that rod in several places and never marks the wood. Each crack becomes a break as soon as the sharpener exposes it. The new box arrived in a carton the delivery driver dropped on the step. The sharpener's blade was last changed two years ago and leaves a ragged cone. A ragged cone leaves the lead unsupported and it snaps at the shoulder. The old box's pencils are stubs and take only a turn or two to sharpen. The new box is marked HB on the barrel but B on the carton it came in. A B lead is softer and breaks under a pressure an HB would take. Within a day every student on the new box said the same thing. The wood on both boxes is the same cedar and splits cleanly for both.",
    q: "Why do the new pencils break? Make the case for one cause.",
    why: [
      "a carton the delivery driver dropped on the step",
      "a blade unchanged in two years, leaving a ragged cone",
      "HB on the barrel and B on the carton it came in",
      "the same report from every student within a day",
      "the same cedar on both boxes, splitting cleanly",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“One sharp knock cracks that rod in several places and never marks the wood.”", "“The new box arrived in a carton the delivery driver dropped on the step.”"], but: "“The sharpener's blade was last changed two years ago and leaves a ragged cone.”" },
      { who: 1, ev: ["“The sharpener's blade was last changed two years ago and leaves a ragged cone.”", "“The old box's pencils are stubs and take only a turn or two to sharpen.”"], but: "“Pencils from the old box sharpen in the same sharpener and write all period.”" },
      { who: 2, ev: ["“The new box is marked HB on the barrel but B on the carton it came in.”", "“A B lead is softer and breaks under a pressure an HB would take.”"], but: "“Each crack becomes a break as soon as the sharpener exposes it.”" },
    ],
    clears: [
      "Pressing too hard: “Within a day every student on the new box said the same thing.”",
      "The wood: “The wood on both boxes is the same cedar and splits cleanly for both.”",
    ],
    note:
      "The old box used to clear the sharpener and now it does not, because stubs take a turn or two where a long pencil takes many. That one sentence rebuilds a dead suspect. Ask what each answer predicts about a brand new pencil from the old box, which nobody has tried.",
  },
  4: {
    story:
      "Five apples in the kitchen bowl went soft and brown within four days of being picked. Six apples from the same tree, left in a dish on the counter, are still firm. The bowl also held two bananas that were spotted brown when the apples went in. Ripening fruit gives off ethylene gas, which ripens other fruit near it. Gas pools in a deep bowl and disperses from a shallow dish. Two pears that shared the bowl have gone soft as well, and the pears in the dish are hard. The five in the bowl were carried home loose in a backpack that was set down hard. Bruising starts under the skin and shows as softening before it shows as a mark. The wooden bowl has never been washed and smells faintly of old fruit. Mould spores living in unsealed wood spread to whatever is set in it. Both groups came off one branch on one morning. A poor batch would have softened in the dish as readily as in the bowl.",
    q: "Why did the bowl apples go soft? Pick one cause and back it up.",
    why: [
      "two spotted bananas sharing a deep bowl",
      "a batch that would have softened in the dish too",
      "carried home loose in a backpack set down hard",
      "an unwashed wooden bowl smelling of old fruit",
      "one morning and one branch for both groups",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“The bowl also held two bananas that were spotted brown when the apples went in.”", "“Gas pools in a deep bowl and disperses from a shallow dish.”"], but: "“The five in the bowl were carried home loose in a backpack that was set down hard.”" },
      { who: 2, ev: ["“The five in the bowl were carried home loose in a backpack that was set down hard.”", "“Bruising starts under the skin and shows as softening before it shows as a mark.”"], but: "“Two pears that shared the bowl have gone soft as well, and the pears in the dish are hard.”" },
      { who: 3, ev: ["“The wooden bowl has never been washed and smells faintly of old fruit.”", "“Mould spores living in unsealed wood spread to whatever is set in it.”"], but: "“Ripening fruit gives off ethylene gas, which ripens other fruit near it.”" },
    ],
    clears: [
      "A bad batch: “A poor batch would have softened in the dish as readily as in the bowl.”",
      "The tree: “Both groups came off one branch on one morning.”",
    ],
    note:
      "The pears are the strongest evidence and they belong to the gas answer: nothing about a backpack or a bowl's smell explains fruit that was never carried and never touched the wood. Ask whether the pears travelled in the backpack, because the case does not say.",
  },
  5: {
    story:
      "The rear wheel pulls out of true within a week of every truing, and the front wheel never does. The same two spokes are loose at every truing, and both are on the chain side. A rear wheel is dished, so its chain-side spokes pull at a steeper angle. Spokes at a steeper angle carry more tension and lose it first if they were set low. Tension was measured after the last truing and those two read well under the others. The rider carries a loaded pannier on the rear rack and nothing on the front. A loaded rear wheel takes a far harder pounding over the same pothole. The rim has a hairline crack at one spoke hole, visible under a lamp. A crack at a spoke hole lets that spoke pull through a little at a time. The crack is at one of the two spokes that keeps going loose. Rocked by hand, the hub shows no play and the bearings run smooth. Both wheels run the same roads and the same rider.",
    q: "Why will the rear wheel not stay true? Choose one cause and prove it.",
    why: [
      "two chain-side spokes reading well under the others",
      "a loaded pannier on the rear rack and nothing on the front",
      "a hairline crack at one of those two spoke holes",
      "bearings spinning smoothly with no play at all",
      "the same roads and the same rider for both wheels",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The same two spokes are loose at every truing, and both are on the chain side.”", "“Tension was measured after the last truing and those two read well under the others.”"], but: "“The rim has a hairline crack at one spoke hole, visible under a lamp.”" },
      { who: 1, ev: ["“The rider carries a loaded pannier on the rear rack and nothing on the front.”", "“A loaded rear wheel takes a far harder pounding over the same pothole.”"], but: "“The same two spokes are loose at every truing, and both are on the chain side.”" },
      { who: 2, ev: ["“The rim has a hairline crack at one spoke hole, visible under a lamp.”", "“The crack is at one of the two spokes that keeps going loose.”"], but: "“Spokes at a steeper angle carry more tension and lose it first if they were set low.”" },
    ],
    clears: [
      "The hub bearings: “Rocked by hand, the hub shows no play and the bearings run smooth.”",
      "The rider: “Both wheels run the same roads and the same rider.”",
    ],
    note:
      "The crack is at one of the two spokes, which means it can explain one and not both. That arithmetic is the sharpest thing in the case. The pannier answer has to explain why the same two spokes go every time rather than a different one each week.",
  },
  6: {
    story:
      "Green film coats the left pane of the tank and leaves the other three clear. The left pane faces a west window about a metre away. Algae need light, and more light on one surface grows more algae there. The green stops in a sharp horizontal line two thirds of the way up the pane. A shelf above the window casts a shadow across the tank at exactly that height. The film is thickest at the end of weeks with clear afternoons. The tank's lamp was moved in October and now sits off centre toward the left. A lamp set off centre throws more light on the pane nearest it. The filter outlet was turned in September and now points along the left pane. Water moving fast past a surface carries nutrients to it and keeps it supplied. Scraping the pane clean leaves it green again within nine or ten days. A phosphate test on the tap water came back at almost nothing. Feeding has been one pinch a day since September and has not changed.",
    q: "Why is one pane green? Make the case for one cause.",
    why: [
      "a west window a metre off, with a shadow line two thirds up",
      "one pinch a day since September, unchanged",
      "tap water testing at almost no phosphate",
      "a lamp moved in October, now off centre to the left",
      "an outlet turned in September, pointing along the left pane",
    ],
    open: [0, 3, 4],
    for: [
      { who: 0, ev: ["“The green stops in a sharp horizontal line two thirds of the way up the pane.”", "“A shelf above the window casts a shadow across the tank at exactly that height.”"], but: "“The tank's lamp was moved in October and now sits off centre toward the left.”" },
      { who: 3, ev: ["“The tank's lamp was moved in October and now sits off centre toward the left.”", "“A lamp set off centre throws more light on the pane nearest it.”"], but: "“The film is thickest at the end of weeks with clear afternoons.”" },
      { who: 4, ev: ["“The filter outlet was turned in September and now points along the left pane.”", "“Water moving fast past a surface carries nutrients to it and keeps it supplied.”"], but: "“Algae need light, and more light on one surface grows more algae there.”" },
    ],
    clears: [
      "Overfeeding: “Feeding has been one pinch a day since September and has not changed.”",
      "Phosphate in the tap water: “A phosphate test on the tap water came back at almost nothing.”",
    ],
    note:
      "The shadow line is the best evidence in the case, because a lamp inside the tank cannot draw a line that matches a shelf outside the window. Two answers explain which pane and only one explains the height. Ask what the lamp answer predicts about the top third.",
  },
  7: {
    story:
      "A hard buzz comes from the display cabinet whenever the projector runs, and stops the moment it is switched off. The buzz only happens at the projector's high fan speed and never at the low one. Every object has a frequency at which it vibrates easily, and a push at that rate sets it going. The glass shelf inside the cabinet rests loose in its brackets at both ends. Laying a folded cloth under one end of that shelf silences the buzz completely. Removing the cloth brings the buzz back on the next high-speed run. Two screws in the cabinet's back panel were found finger loose on Tuesday. A loose panel buzzes at whatever frequency is driving it, which here is the fan. The projector was remounted in October and its bracket now touches the cabinet. Vibration travels through a shared bracket better than it travels through air. All week the radiator stayed off and the buzz came anyway. Monday's tightening of the door latch changed nothing at all.",
    q: "What is buzzing in the cabinet? Pick one cause and quote the story.",
    why: [
      "a glass shelf loose in its brackets, silenced by a folded cloth",
      "two back-panel screws found finger loose on Tuesday",
      "a bracket remounted in October, now touching the cabinet",
      "a radiator off all week while the buzz carried on",
      "a latch tightened on Monday to no effect",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The glass shelf inside the cabinet rests loose in its brackets at both ends.”", "“Laying a folded cloth under one end of that shelf silences the buzz completely.”"], but: "“Two screws in the cabinet's back panel were found finger loose on Tuesday.”" },
      { who: 1, ev: ["“Two screws in the cabinet's back panel were found finger loose on Tuesday.”", "“A loose panel buzzes at whatever frequency is driving it, which here is the fan.”"], but: "“Removing the cloth brings the buzz back on the next high-speed run.”" },
      { who: 2, ev: ["“The projector was remounted in October and its bracket now touches the cabinet.”", "“Vibration travels through a shared bracket better than it travels through air.”"], but: "“The buzz only happens at the projector's high fan speed and never at the low one.”" },
    ],
    clears: [
      "The radiator: “All week the radiator stayed off and the buzz came anyway.”",
      "The door latch: “Monday's tightening of the door latch changed nothing at all.”",
    ],
    note:
      "The cloth is a proper experiment run in both directions: in, silence, out, buzz. That is the strongest evidence any of these cases offers. The other two answers have to explain why a cloth under a shelf stops a buzz coming from a back panel or a bracket.",
  },
  8: {
    story:
      "The young leaves at the tips of the lime tree are curled, and the path beneath it is sticky. Aphids feed on new growth and excrete a sugary liquid called honeydew. Honeydew falls on whatever is below, which is why the path is tacky. A steady column of ants runs up the trunk and out along the tip branches. Ants farm aphids for that honeydew and carry them to fresh shoots. Twice a week the tree is watered, and a spade down the soil is damp. The water goes on at the trunk and the feeding roots are out at the canopy edge. A tree watered at the trunk can be dry where it actually drinks. A black mould grows on honeydew and three tip branches carry a sooty film. Some leaf diseases begin by curling a leaf before any spot appears. Only this year's shoots are curled; no older leaf is touched. Salt browns a leaf at its margin, and no margin here is browned.",
    q: "Why are the tip leaves curled? Choose one cause and back it up.",
    why: [
      "a column of ants on the tips, and honeydew on the path",
      "watering at the trunk where the feeding roots are at the edge",
      "a sooty film on three tip branches, and curling before spots",
      "margins that are not browned anywhere",
      "curling confined to this year's shoots alone",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A steady column of ants runs up the trunk and out along the tip branches.”", "“Honeydew falls on whatever is below, which is why the path is tacky.”"], but: "“The water goes on at the trunk and the feeding roots are out at the canopy edge.”" },
      { who: 1, ev: ["“The water goes on at the trunk and the feeding roots are out at the canopy edge.”", "“A tree watered at the trunk can be dry where it actually drinks.”"], but: "“A steady column of ants runs up the trunk and out along the tip branches.”" },
      { who: 2, ev: ["“A black mould grows on honeydew and three tip branches carry a sooty film.”", "“Some leaf diseases begin by curling a leaf before any spot appears.”"], but: "“Aphids feed on new growth and excrete a sugary liquid called honeydew.”" },
    ],
    clears: [
      "Salt: “Salt browns a leaf at its margin, and no margin here is browned.”",
      "Old age in the leaves: “Only this year's shoots are curled; no older leaf is touched.”",
    ],
    note:
      "The sooty film is evidence of honeydew, not of a disease, and a student who spots that has caught the case trying to mislead them. Watering twice a week no longer clears drought, because where the water lands has turned out to matter more than how often.",
  },
  9: {
    story:
      "One of the two carved pumpkins collapsed in five days and the other is firm after two weeks. The collapsed one was hollowed quickly and left with pulp and seeds clinging inside. The firm one was scraped down to clean wall with a metal spoon. Wet pulp holds moisture against the cut wall and feeds the moulds that soften it. The collapse began on the inner wall and worked outward to the skin. A hairline split runs down the back of the collapsed one, hidden against the wall. A crack in the shell lets water and spores in and does not show from the front. The collapsed one was carried home in a bag and set down hard on the step. A bruise from dropping spreads under the skin and softens the flesh beneath it. The candles in both are battery lights with no flame in either. Side by side on one step, both met the same weather.",
    q: "Why did one pumpkin collapse? Pick one cause and prove it.",
    why: [
      "pulp and seeds left clinging to the inner wall",
      "a hairline split down the back, hidden against the wall",
      "carried home in a bag and set down hard on the step",
      "battery lights with no flame in either pumpkin",
      "side by side on one step, in the same weather",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The collapsed one was hollowed quickly and left with pulp and seeds clinging inside.”", "“Wet pulp holds moisture against the cut wall and feeds the moulds that soften it.”"], but: "“A hairline split runs down the back of the collapsed one, hidden against the wall.”" },
      { who: 1, ev: ["“A hairline split runs down the back of the collapsed one, hidden against the wall.”", "“A crack in the shell lets water and spores in and does not show from the front.”"], but: "“The collapse began on the inner wall and worked outward to the skin.”" },
      { who: 2, ev: ["“The collapsed one was carried home in a bag and set down hard on the step.”", "“A bruise from dropping spreads under the skin and softens the flesh beneath it.”"], but: "“The firm one was scraped down to clean wall with a metal spoon.”" },
    ],
    clears: [
      "The candle: “The candles in both are battery lights with no flame in either.”",
      "The weather: “Side by side on one step, both met the same weather.”",
    ],
    note:
      "Inner wall outward is the direction that decides this. A crack and a bruise both work from the outside in, and the pulp works from the inside out. Ask the class what they would expect to find if they cut both pumpkins open.",
  },
  10: {
    story:
      "A line of prints crosses the frosted lawn from the hedge to the bins and back. Each print shows four toes and a small triangular pad behind them. Claw marks show clearly in front of every toe in the trail. A fox places each hind foot into the print its front foot just left. That habit is what produces a near single line of prints. This trail runs almost in a single line, one print nearly in front of the last. The stride measures thirty centimetres, which is short for a dog of this foot size. A small dog trotting slowly also sets its feet close to one line. These prints are forty millimetres across, which fits a terrier as well as a fox. A cat chasing something runs with its claws out and leaves marks like these. Two cats live in the terrace and both were out that night. A boot leaves one continuous sole mark and no separate toes. No bin lid has been shifted and nothing has been dragged over the grass.",
    q: "What made the prints? Make the case for one animal.",
    why: [
      "a near single line, which is how a fox sets its hind feet",
      "a thirty-centimetre stride, which a small dog can trot",
      "claws out in a chase, and two cats out that night",
      "a boot leaving one continuous sole and no toes",
      "bin lids unshifted and nothing dragged over the grass",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A fox places each hind foot into the print its front foot just left.”", "“This trail runs almost in a single line, one print nearly in front of the last.”"], but: "“A small dog trotting slowly also sets its feet close to one line.”" },
      { who: 1, ev: ["“A small dog trotting slowly also sets its feet close to one line.”", "“These prints are forty millimetres across, which fits a terrier as well as a fox.”"], but: "“A fox places each hind foot into the print its front foot just left.”" },
      { who: 2, ev: ["“A cat chasing something runs with its claws out and leaves marks like these.”", "“Two cats live in the terrace and both were out that night.”"], but: "“The stride measures thirty centimetres, which is short for a dog of this foot size.”" },
    ],
    clears: [
      "A person: “A boot leaves one continuous sole mark and no separate toes.”",
      "Something at the bins: “No bin lid has been shifted and nothing has been dragged over the grass.”",
    ],
    note:
      "Claws used to rule the cat out and a chasing cat puts them back in. The single line used to mean fox and a slow trot puts a dog back in. Two pieces of evidence, both weakened by one extra sentence each, which is exactly how real tracking goes.",
  },
  11: {
    story:
      "Route 9 runs five minutes late on wet mornings and on time on dry ones. On the driver's sheet the whole delay turns up between stops six and eight. Stop seven has no shelter, and the nearest cover is a shop porch across the road. On wet mornings the students wait in that porch and start crossing when the bus appears. Waiting for a group to cross a road takes far longer than letting them step aboard. On dry mornings those same students stand at the pole and board immediately. The stretch between stops six and eight runs past the station, where queues form in rain. Routes 4 and 11 join the main road after the station and miss that stretch. Ridership is logged daily and rises by nine or ten students when it rains. Nine extra students at two stops take well over a minute to board. The lift runs on Tuesdays alone, and lateness falls on every weekday. The driver has held route 9 since September and runs it the same way every day.",
    q: "Why is route 9 late in the rain? Choose one cause and quote the story.",
    why: [
      "a porch across the road, with a group crossing when the bus appears",
      "a station stretch where queues form in rain, missed by the other routes",
      "a lift that runs on Tuesdays alone",
      "nine or ten extra riders, taking over a minute at two stops",
      "one driver since September, running it the same way daily",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“Stop seven has no shelter, and the nearest cover is a shop porch across the road.”", "“On dry mornings those same students stand at the pole and board immediately.”"], but: "“The stretch between stops six and eight runs past the station, where queues form in rain.”" },
      { who: 1, ev: ["“The stretch between stops six and eight runs past the station, where queues form in rain.”", "“Routes 4 and 11 join the main road after the station and miss that stretch.”"], but: "“On wet mornings the students wait in that porch and start crossing when the bus appears.”" },
      { who: 3, ev: ["“Ridership is logged daily and rises by nine or ten students when it rains.”", "“Nine extra students at two stops take well over a minute to board.”"], but: "“Waiting for a group to cross a road takes far longer than letting them step aboard.”" },
    ],
    clears: [
      "The wheelchair lift: “The lift runs on Tuesdays alone, and lateness falls on every weekday.”",
      "A slow driver: “The driver has held route 9 since September and runs it the same way every day.”",
    ],
    note:
      "Routes 4 and 11 used to clear the traffic and now they do not, because the case says they miss the station stretch. All three answers live between stops six and eight. Ask what each one is worth in minutes, because five is the number to fill.",
  },
  12: {
    story:
      "The marble base of the county trophy has split, and the eleven trophies beside it are sound. Every crack starts at the centre bolt hole and runs outward from there. A bolt tightened too far pushes outward on the stone around the hole. Stone takes enormous pressure from above and very little pushing out from inside. The column was refitted in August with a new bolt and a spanner rather than by hand. The case sits against the radiator wall and its south end reads nine degrees warmer. Marble expands unevenly when one end of a slab is warmer than the other. Three clean cracks is what an uneven expansion gives before any crazing appears. This base came from the end of a block and carries a grey vein across its centre. A vein in marble is a plane of weakness and a slab splits along it first. The vein runs through the bolt hole. No chip, scuff or dust mark shows on the base or on the shelf. Not one of the eleven sound trophies has ever had its column off.",
    q: "Why did the base crack? Pick one cause and back it up.",
    why: [
      "a column refitted in August with a spanner rather than by hand",
      "no chip, scuff or dust mark on the base or the shelf",
      "a south end nine degrees warmer against the radiator wall",
      "a grey vein running straight through the bolt hole",
      "eleven sound trophies that have never had a column off",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“The column was refitted in August with a new bolt and a spanner rather than by hand.”", "“A bolt tightened too far pushes outward on the stone around the hole.”"], but: "“This base came from the end of a block and carries a grey vein across its centre.”" },
      { who: 2, ev: ["“The case sits against the radiator wall and its south end reads nine degrees warmer.”", "“Three clean cracks is what an uneven expansion gives before any crazing appears.”"], but: "“Every crack starts at the centre bolt hole and runs outward from there.”" },
      { who: 3, ev: ["“This base came from the end of a block and carries a grey vein across its centre.”", "“The vein runs through the bolt hole.”"], but: "“A bolt tightened too far pushes outward on the stone around the hole.”" },
    ],
    clears: [
      "A fall: “No chip, scuff or dust mark shows on the base or on the shelf.”",
      "The other trophies: “Not one of the eleven sound trophies has ever had its column off.”",
    ],
    note:
      "The bolt hole and the vein are in the same place, so the cracks starting there fits two answers equally. The eleven sound trophies share the warm case and have never been unbolted, which is a comparison the class should use carefully: it cuts against the heat and not against the bolt.",
  },
  13: {
    story:
      "The turkey came out of the oven cooked through and the colour of raw pastry. Browning needs a dry surface and heat reaching it directly, and neither was available. The bird was covered with foil at the start and the foil was never taken off. Foil holds steam against the skin for the whole of the roast. A surface held wet cannot brown however long it stays in the oven. The oven dial was set to 325 where the recipe asks for 375. Browning begins in earnest only above about 300 degrees at the surface. A thermometer on the rack showed the oven never passed 310 all afternoon. The oil was rubbed on at nine and the bird went in at two. Oil left standing on cold skin runs off and pools in the tin. The tin held a quarter inch of oil when the bird came out. The thigh read 176 degrees, so the bird was in long enough. The same oven browned a chicken to a deep gold last Sunday.",
    q: "Why is the skin pale? Make the case for one cause.",
    why: [
      "foil on from the start and never taken off",
      "a dial at 325 and a rack never passing 310",
      "oil rubbed on at nine, pooled in the tin by two",
      "a thigh at 176, so it was in long enough",
      "the same oven browning a chicken gold last Sunday",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The bird was covered with foil at the start and the foil was never taken off.”", "“Foil holds steam against the skin for the whole of the roast.”"], but: "“The oven dial was set to 325 where the recipe asks for 375.”" },
      { who: 1, ev: ["“The oven dial was set to 325 where the recipe asks for 375.”", "“A thermometer on the rack showed the oven never passed 310 all afternoon.”"], but: "“A surface held wet cannot brown however long it stays in the oven.”" },
      { who: 2, ev: ["“The oil was rubbed on at nine and the bird went in at two.”", "“The tin held a quarter inch of oil when the bird came out.”"], but: "“Browning needs a dry surface and heat reaching it directly, and neither was available.”" },
    ],
    clears: [
      "Too short a roast: “The thigh read 176 degrees, so the bird was in long enough.”",
      "The bird itself: “The same oven browned a chicken to a deep gold last Sunday.”",
    ],
    note:
      "310 is above the 300 the case names as the browning threshold, which is the arithmetic that weakens the oven answer without killing it. Foil and pooled oil both take the surface away. Ask whether the class can tell, from the skin alone, which of those two happened.",
  },
  14: {
    story:
      "Cupcakes at the back left of every tray come out dark and the ones at the front right stay pale. In every bake the dark ones turn up in the same corner of the oven. An oven with a hot corner browns whatever happens to be sitting in it. The element behind that corner was replaced last term and sits closer to the shelf. The oven thermometer reads nine degrees higher when moved to that corner. The dark tray is always loaded with its long side to the back left. A dark tray takes up more heat and passes it on to whatever sits nearest the element. The light tray in that same corner browns less than the dark one does. The jug is filled from the top of the bowl and poured straight down the row. Batter from the top of a bowl carries the lightest, airiest mix. An airier cup browns sooner because its crust sets while it is still thin. Rotating the tray halfway through the bake produces an evenly coloured batch. Every bake has run eighteen minutes on the same timer all term.",
    q: "Why does one corner brown? Choose one cause and prove it.",
    why: [
      "a replaced element nine degrees hotter in that corner",
      "a dark tray browning more than the light one in the same spot",
      "batter poured from the top of the bowl, the airiest mix",
      "rotation producing an evenly coloured batch",
      "eighteen minutes on one timer all term",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The element behind that corner was replaced last term and sits closer to the shelf.”", "“The oven thermometer reads nine degrees higher when moved to that corner.”"], but: "“The light tray in that same corner browns less than the dark one does.”" },
      { who: 1, ev: ["“The dark tray is always loaded with its long side to the back left.”", "“The light tray in that same corner browns less than the dark one does.”"], but: "“In every bake the dark ones turn up in the same corner of the oven.”" },
      { who: 2, ev: ["“The jug is filled from the top of the bowl and poured straight down the row.”", "“An airier cup browns sooner because its crust sets while it is still thin.”"], but: "“The oven thermometer reads nine degrees higher when moved to that corner.”" },
    ],
    clears: [
      "The tray itself: “Rotating the tray halfway through the bake produces an evenly coloured batch.”",
      "The bake time: “Every bake has run eighteen minutes on the same timer all term.”",
    ],
    note:
      "The light tray used to clear the tray colour and now it does not: it browns less, which means the tray is doing something. The thermometer gives the corner nine degrees and nobody has measured what the tray adds. Ask how they would find out with one more bake.",
  },
  15: {
    story:
      "Two pairs of wool mittens went into the wash the same size and one pair came out child-sized. Wool felts when heat and movement act together, because the scales on each fibre lock. Once those scales interlock they cannot be pulled apart and the shrinking is permanent. The shrunken pair went into the tumble dryer on a high heat setting. A dryer supplies heat and constant tumbling at the same time. The shrunken pair went through the wash in a mesh bag with four tennis balls. A hot wash with something knocking about in it felts wool as surely as a dryer does. The two pairs came from different dye lots, which the labels on the cuffs record. Wool dyed in a hot bath has already been part felted before it is knitted. The shrunken pair is the darker of the two and took the longer dye bath. The pair that did not change was laid flat on a rack overnight. Between the wash and the measuring neither pair was stretched, pinned or worn.",
    q: "Why did one pair shrink? Pick one cause and quote the story.",
    why: [
      "a tumble dryer on high, supplying heat and tumbling together",
      "a mesh bag with four tennis balls in a hot wash",
      "the darker pair, from the longer dye bath",
      "neither pair stretched, pinned or worn afterwards",
      "the unchanged pair laid flat on a rack overnight",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The shrunken pair went into the tumble dryer on a high heat setting.”", "“A dryer supplies heat and constant tumbling at the same time.”"], but: "“The shrunken pair went through the wash in a mesh bag with four tennis balls.”" },
      { who: 1, ev: ["“The shrunken pair went through the wash in a mesh bag with four tennis balls.”", "“A hot wash with something knocking about in it felts wool as surely as a dryer does.”"], but: "“A dryer supplies heat and constant tumbling at the same time.”" },
      { who: 2, ev: ["“The two pairs came from different dye lots, which the labels on the cuffs record.”", "“The shrunken pair is the darker of the two and took the longer dye bath.”"], but: "“Once those scales interlock they cannot be pulled apart and the shrinking is permanent.”" },
    ],
    clears: [
      "Stretching while damp: “Between the wash and the measuring neither pair was stretched, pinned or worn.”",
      "The drying rack: “The pair that did not change was laid flat on a rack overnight.”",
    ],
    note:
      "The same pair met the tennis balls and the dryer, so the case has stacked two answers on one pair of mittens. The dye lot is the third and it predicts something the others do not: that pair was already part felted before anybody washed it.",
  },
  16: {
    story:
      "Half the gingerbread figures baked into flat blobs and half held their shape perfectly. Butter in dough must be firm when it meets the oven or it melts before the flour sets. Dough that melts first spreads outward, and dough that sets first holds its edge. The first sheet was cut and baked straight away from dough at room temperature. The second sheet was cut and then chilled for thirty minutes before it went in. The spread figures are all from the first sheet without a single exception. The flour was weighed once for the whole bowl and the scale had not been zeroed. A bowl short on flour spreads worst where the dough is warmest and softest. Soda was measured with a spoon heaped rather than levelled, as the card asks. Too much soda makes a dough rise fast and fall outward before it sets. The spread figures taste faintly of soap at the edges and the others do not. Every figure went into one oven, on one shelf, at one setting. The oven door stayed shut through both bakes.",
    q: "Why did half the figures spread? Make the case for one cause.",
    why: [
      "a first sheet baked straight away, at room temperature",
      "a bowl weighed once on a scale nobody zeroed",
      "soda heaped rather than levelled, with a soapy edge",
      "one oven, one shelf, one setting for every figure",
      "an oven door that stayed shut through both bakes",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The first sheet was cut and baked straight away from dough at room temperature.”", "“The spread figures are all from the first sheet without a single exception.”"], but: "“The flour was weighed once for the whole bowl and the scale had not been zeroed.”" },
      { who: 1, ev: ["“The flour was weighed once for the whole bowl and the scale had not been zeroed.”", "“A bowl short on flour spreads worst where the dough is warmest and softest.”"], but: "“The second sheet was cut and then chilled for thirty minutes before it went in.”" },
      { who: 2, ev: ["“Soda was measured with a spoon heaped rather than levelled, as the card asks.”", "“The spread figures taste faintly of soap at the edges and the others do not.”"], but: "“Dough that melts first spreads outward, and dough that sets first holds its edge.”" },
    ],
    clears: [
      "The oven: “Every figure went into one oven, on one shelf, at one setting.”",
      "The oven door: “The oven door stayed shut through both bakes.”",
    ],
    note:
      "One bowl used to clear the flour and the soda, because a fault in the bowl would spread everything. The sentence about short flour spreading worst where the dough is warmest brings it back, and that is the cleverest line in the case. The soapy taste is the one piece of evidence that belongs to only one answer.",
  },
  17: {
    story:
      "The whole light string flickers together several times a second, all hundred bulbs at once. These are LED bulbs, which switch on and off far faster than old filament bulbs. The string is plugged into a wall switch fitted with a dimmer last spring. A dimmer chops the current on and off to lower the brightness of a filament lamp. A filament glows through those gaps and an LED follows them exactly. Plugged into an undimmed hall socket, the string stops flickering altogether. The outlet's faceplate is warm and the screw holding its live wire turns by hand. A loose connection makes and breaks a circuit many times a second under vibration. The hall socket the string was tested in is on a different circuit entirely. The extension lead was run under a rug and shows a flattened section near the door. A flattened lead can part a conductor without breaking the outer sleeve. All hundred dim and brighten in step, which a single loose bulb cannot do. The string worked without flicker through three frosts in November.",
    q: "Why does the string flicker? Pick one cause and prove it.",
    why: [
      "a dimmer fitted last spring, and LEDs that follow its chopping",
      "all hundred dimming in step, which one loose bulb cannot do",
      "a warm faceplate and a live screw that turns by hand",
      "no flicker through three frosts in November",
      "a lead flattened under a rug near the door",
    ],
    open: [0, 2, 4],
    for: [
      { who: 0, ev: ["“The string is plugged into a wall switch fitted with a dimmer last spring.”", "“A dimmer chops the current on and off to lower the brightness of a filament lamp.”"], but: "“The outlet's faceplate is warm and the screw holding its live wire turns by hand.”" },
      { who: 2, ev: ["“The outlet's faceplate is warm and the screw holding its live wire turns by hand.”", "“The hall socket the string was tested in is on a different circuit entirely.”"], but: "“Plugged into an undimmed hall socket, the string stops flickering altogether.”" },
      { who: 4, ev: ["“The extension lead was run under a rug and shows a flattened section near the door.”", "“A flattened lead can part a conductor without breaking the outer sleeve.”"], but: "“A filament glows through those gaps and an LED follows them exactly.”" },
    ],
    clears: [
      "A loose bulb: “All hundred dim and brighten in step, which a single loose bulb cannot do.”",
      "Cold: “The string worked without flicker through three frosts in November.”",
    ],
    note:
      "The hall test looked decisive until the case said the hall is on a different circuit, which means the test changed two things at once. That is the whole trap. A proper test would be the same socket with the dimmer bypassed, and somebody should say so.",
  },
  18: {
    story:
      "The hall pendulum clock gains four minutes a day, every day, by the same amount. A pendulum's speed is set by its length and by nothing else that matters here. Shortening a pendulum makes each swing quicker and makes the clock gain. The bob rests on a nut that is turned to raise or lower it along the rod. A bob carried by the rod swings loose and seats higher when the clock is set down. The clock was carried to the hall from the office in late September. The hall has run six degrees colder than the office since the move. Cold shortens a steel rod, and a shorter rod swings faster. The escapement pallets were refaced by a repairer in August. A pallet refaced too deep lets the escape wheel through a fraction early each beat. Four minutes a day is about three parts in a thousand, which is a very small change. Sunday's full winding made no difference: four minutes went that day too. The hall is used all day and nothing in it touches the clock case.",
    q: "Why does the clock gain? Choose one cause and back it up.",
    why: [
      "a bob that seats higher when a clock is set down",
      "a hall six degrees colder, shortening a steel rod",
      "a full winding on Sunday with four minutes gained anyway",
      "pallets refaced in August, perhaps a fraction too deep",
      "a hall in daily use with nothing touching the case",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“A bob carried by the rod swings loose and seats higher when the clock is set down.”", "“The clock was carried to the hall from the office in late September.”"], but: "“The hall has run six degrees colder than the office since the move.”" },
      { who: 1, ev: ["“The hall has run six degrees colder than the office since the move.”", "“Cold shortens a steel rod, and a shorter rod swings faster.”"], but: "“A bob carried by the rod swings loose and seats higher when the clock is set down.”" },
      { who: 3, ev: ["“The escapement pallets were refaced by a repairer in August.”", "“A pallet refaced too deep lets the escape wheel through a fraction early each beat.”"], but: "“A pendulum's speed is set by its length and by nothing else that matters here.”" },
    ],
    clears: [
      "Winding: “Sunday's full winding made no difference: four minutes went that day too.”",
      "The hall itself: “The hall is used all day and nothing in it touches the clock case.”",
    ],
    note:
      "Three parts in a thousand is small enough for any of these to manage, which is why the size does not decide it. Dates do. The pallets were refaced in August and the gaining started in October, which is a gap somebody should ask about.",
  },
  19: {
    story:
      "Number 14 lost its snow in a day while every other roof in the terrace stayed white for a week. Snow on a roof melts from below when heat escapes through the ceiling beneath it. The loft of number 14 was cleared in August and the insulation taken up for rewiring. It has not been put back, and the other seven lofts are insulated as before. A thermal camera shows the whole roof of 14 running six degrees warmer than its neighbours. Number 14 is the end house and its south slope is the only one not shaded by a neighbour. An unshaded south slope takes two more hours of sun than the rest of the terrace. Number 14's chimney was relined in September and now carries the boiler flue. A flue running up a chimney warms the whole stack and the tiles around it. The flue runs the full height of the gable, not just the ridge. Fourteen's north slope is bare too, where every other north slope holds its snow. The night before the snow, rain ran off all eight roofs alike.",
    q: "Why did one roof clear? Make the case for one cause.",
    why: [
      "insulation taken up in August and never put back",
      "an end house with the only unshaded south slope",
      "a chimney relined in September, now carrying the boiler flue",
      "a bare north slope where every other north slope holds snow",
      "rain running off all eight roofs alike the night before",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The loft of number 14 was cleared in August and the insulation taken up for rewiring.”", "“A thermal camera shows the whole roof of 14 running six degrees warmer than its neighbours.”"], but: "“Number 14 is the end house and its south slope is the only one not shaded by a neighbour.”" },
      { who: 1, ev: ["“Number 14 is the end house and its south slope is the only one not shaded by a neighbour.”", "“An unshaded south slope takes two more hours of sun than the rest of the terrace.”"], but: "“Snow on a roof melts from below when heat escapes through the ceiling beneath it.”" },
      { who: 2, ev: ["“Number 14's chimney was relined in September and now carries the boiler flue.”", "“The flue runs the full height of the gable, not just the ridge.”"], but: "“A thermal camera shows the whole roof of 14 running six degrees warmer than its neighbours.”" },
    ],
    clears: [
      "The angle of the roof: “Fourteen's north slope is bare too, where every other north slope holds its snow.”",
      "Rain before the snow: “The night before the snow, rain ran off all eight roofs alike.”",
    ],
    note:
      "The bare north slope is the strongest fact here and it cuts straight through the sun answer: no sun reaches a north slope in a week like that. The camera says the whole roof is warm, which fits the loft and not a flue up one gable.",
  },
  20: {
    story:
      "The feeder is full at dusk and empty at dawn, four nights running. The metal pole carries a greasy smear running from the ground to the tray. Small dark droppings sit along the top edge of the tray each morning. The plastic around two ports has been gnawed into a wider opening. Rats climb smooth poles easily, feed after dark, and gnaw to make an opening bigger. On the third night a trail camera caught movement at ten past one. Squirrels in this garden have been seen on the pole at first light, before six. First light in December is well after the feeder is already empty. The lid clips were found undone on two of the four mornings. A hand can take a lid off and put it back; a squirrel leaves it on the grass. The neighbour has complained twice about the cost of the seed. Birds here do not feed in the dark and have left the garden by sunset. Spilled seed would be lying underneath, and the ground is bare and clean.",
    q: "What is emptying the feeder? Pick one and prove it from the text.",
    why: [
      "a greasy smear up the pole, droppings, and gnawed ports",
      "birds gone by sunset and not feeding in the dark",
      "squirrels on the pole at first light, after six",
      "bare clean ground beneath the feeder",
      "lid clips undone twice, and a neighbour who has complained",
    ],
    open: [0, 2, 4],
    for: [
      { who: 0, ev: ["“The metal pole carries a greasy smear running from the ground to the tray.”", "“On the third night a trail camera caught movement at ten past one.”"], but: "“The lid clips were found undone on two of the four mornings.”" },
      { who: 2, ev: ["“Squirrels in this garden have been seen on the pole at first light, before six.”", "“The feeder is full at dusk and empty at dawn, four nights running.”"], but: "“First light in December is well after the feeder is already empty.”" },
      { who: 4, ev: ["“The lid clips were found undone on two of the four mornings.”", "“A hand can take a lid off and put it back; a squirrel leaves it on the grass.”"], but: "“Rats climb smooth poles easily, feed after dark, and gnaw to make an opening bigger.”" },
    ],
    clears: [
      "Birds: “Birds here do not feed in the dark and have left the garden by sunset.”",
      "Seed spilling out: “Spilled seed would be lying underneath, and the ground is bare and clean.”",
    ],
    note:
      "The camera recorded movement at ten past one and nobody says what it recorded, which is the hole in the strongest answer. The undone clips are the detail that will not fit an animal, and a student who weighs two mornings against four has done the arithmetic the case wants.",
  },
  21: {
    story:
      "The cocoa in the flask is barely warm by noon, three hours after it was poured in boiling. The flask holds a litre and only a third of a litre of cocoa was poured in. The rest of the space is air, and the liquid loses heat into it until both are the same temperature. A small amount of liquid warming a large volume of air cools a long way doing it. Filled to the brim the next day, the same flask was still hot at noon. The flask was not rinsed with hot water before the cocoa went in. Cold steel takes heat from the drink in order to warm itself. The stopper is the plastic one from the old flask and sits a little proud of the rim. A stopper that does not seat lets warm air out and cold air in all morning. The outer skin of the flask reads two degrees above the room after three hours. A working vacuum should leave the outside at room temperature exactly. The cocoa was made to the same recipe on both days.",
    q: "Why did the cocoa go cold? Pick one cause and prove it.",
    why: [
      "a litre flask holding a third of a litre, the rest air",
      "an outer skin reading two degrees above the room",
      "a stopper from the old flask, sitting proud of the rim",
      "a cold steel flask never rinsed with hot water",
      "a recipe unchanged between the two days",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The flask holds a litre and only a third of a litre of cocoa was poured in.”", "“Filled to the brim the next day, the same flask was still hot at noon.”"], but: "“The stopper is the plastic one from the old flask and sits a little proud of the rim.”" },
      { who: 1, ev: ["“The outer skin of the flask reads two degrees above the room after three hours.”", "“A working vacuum should leave the outside at room temperature exactly.”"], but: "“Filled to the brim the next day, the same flask was still hot at noon.”" },
      { who: 2, ev: ["“The stopper is the plastic one from the old flask and sits a little proud of the rim.”", "“A stopper that does not seat lets warm air out and cold air in all morning.”"], but: "“A small amount of liquid warming a large volume of air cools a long way doing it.”" },
    ],
    clears: [
      "Not preheating the flask: “Cold steel takes heat from the drink in order to warm itself.”",
      "The cocoa: “The cocoa was made to the same recipe on both days.”",
    ],
    note:
      "The brim-full day is the experiment and it is a good one, because only the amount changed. Two degrees above the room is a small leak and the class should ask whether it is enough. The stopper would have been proud on the second day too, which is the objection that matters.",
  },
  22: {
    story:
      "Eleven of the twenty-six valentines came out of the pile with the writing smeared sideways. Gel ink soaks into an absorbent surface and sits on top of a sealed one. Ink that sits on the surface stays wet far longer and wipes with the lightest touch. The eleven smeared cards are all the glossy ones from the shop packet. The fifteen clean ones are matte card cut from the classroom stock. Rubbing a finger across a fresh line on each kind shows the difference in seconds. The eleven glossy ones were finished first and went to the bottom of the pile. Fifteen cards of weight pressing down will smear what is still wet beneath them. The glossy cards were written with the black pen and the matte with the blue. Two pens from one packet can still carry inks that dry at different rates. Every one of the twenty-six was written at one table inside twenty minutes. Heating had run since morning and the room was dry.",
    q: "Why did eleven cards smear? Choose one cause and quote the story.",
    who: ["", "🖊️ The black pen", "", "", ""],
    why: [
      "glossy shop card, where gel ink sits on the surface",
      "the black pen on the glossy ones and the blue on the matte",
      "finished first and left at the bottom of the pile",
      "a dry room with the heating on since morning",
      "all twenty-six written at one table in twenty minutes",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The eleven smeared cards are all the glossy ones from the shop packet.”", "“Ink that sits on the surface stays wet far longer and wipes with the lightest touch.”"], but: "“The eleven glossy ones were finished first and went to the bottom of the pile.”" },
      { who: 1, ev: ["“The glossy cards were written with the black pen and the matte with the blue.”", "“Two pens from one packet can still carry inks that dry at different rates.”"], but: "“Rubbing a finger across a fresh line on each kind shows the difference in seconds.”" },
      { who: 2, ev: ["“The eleven glossy ones were finished first and went to the bottom of the pile.”", "“Fifteen cards of weight pressing down will smear what is still wet beneath them.”"], but: "“The eleven smeared cards are all the glossy ones from the shop packet.”" },
    ],
    clears: [
      "Damp air: “Heating had run since morning and the room was dry.”",
      "Not enough drying time: “Every one of the twenty-six was written at one table inside twenty minutes.”",
    ],
    note:
      "The same eleven cards are the glossy ones, the black-pen ones and the bottom-of-the-pile ones. Three differences stacked on one group, which is the hardest shape a case can take. The finger test is the only measurement and it tests the card, not the pen.",
  },
  23: {
    story:
      "The outdoor volcano gushed and flattened in two seconds while the indoor one held a standing foam. Carbon dioxide on its own escapes as bubbles that burst the moment they form. A little dish soap gives each bubble a skin that holds it together in a foam. The indoor mixture had a squeeze of dish soap added to the vinegar. The outdoor batch was mixed in a hurry and the soap was left out. Round the outdoor cone lies the wet ring a strong eruption always leaves. The outdoor air was four degrees above freezing and the indoor room was warm. A cold foam drains and collapses faster than a warm one of the same mix. The outdoor cone's vent is the wide one, cut to fit a different bottle. A wide vent lets foam out faster than it can build into a standing head. Both used the same measured soda and the same bottle of vinegar. A ribbon tied to the stake barely stirred, so still was the air.",
    q: "Why would the outdoor foam not stand? Make the case for one cause.",
    who: ["", "", "", "", "🥶 The cold outside"],
    why: [
      "soap left out of the outdoor batch in the hurry",
      "the same measured soda and the same bottle of vinegar",
      "a wide vent cut to fit a different bottle",
      "a ribbon on the stake that barely moved",
      "four degrees above freezing outside against a warm room",
    ],
    open: [0, 2, 4],
    for: [
      { who: 0, ev: ["“The indoor mixture had a squeeze of dish soap added to the vinegar.”", "“The outdoor batch was mixed in a hurry and the soap was left out.”"], but: "“The outdoor cone's vent is the wide one, cut to fit a different bottle.”" },
      { who: 2, ev: ["“The outdoor cone's vent is the wide one, cut to fit a different bottle.”", "“A wide vent lets foam out faster than it can build into a standing head.”"], but: "“A little dish soap gives each bubble a skin that holds it together in a foam.”" },
      { who: 4, ev: ["“The outdoor air was four degrees above freezing and the indoor room was warm.”", "“A cold foam drains and collapses faster than a warm one of the same mix.”"], but: "“The outdoor batch was mixed in a hurry and the soap was left out.”" },
    ],
    clears: [
      "A weak reaction: “Both used the same measured soda and the same bottle of vinegar.”",
      "Wind: “A ribbon tied to the stake barely stirred, so still was the air.”",
    ],
    note:
      "Gushed and flattened in two seconds is the phrase to work from. No soap means no foam at all; a wide vent means foam that leaves too fast; cold means foam that drains. Each predicts a slightly different two seconds, and the class can describe all three.",
  },
  24: {
    story:
      "Gold came off nine crowns onto nine pairs of hands, and the other seventeen are clean. Poster paint binds with a starch that stays soluble and lifts with warm skin. Acrylic paint sets into a plastic film that holds together once it is dry. The nine that rubbed were painted from the gold poster paint pot. The seventeen that did not were painted with the gold acrylic. The nine were painted last, when the brushes had already been rinsed twice. Paint thinned by a wet brush lays down a weaker film whatever kind it is. The nine were worn by the students who danced, and the other seventeen sat. An hour of dancing warms a hand and works a surface far harder than sitting does. Every crown had the same two days of drying before anybody wore it. Neither pot had dried out, and both were opened that same morning.",
    q: "Why did nine crowns rub off? Pick one cause and back it up.",
    who: ["", "💦 Brushes rinsed twice", "💃 The nine who danced", "", ""],
    why: [
      "poster paint, which stays soluble and lifts with warm skin",
      "painted last, with brushes already rinsed twice",
      "worn by the dancers while the other seventeen sat",
      "two pots opened the same morning, neither dried out",
      "the same two days of drying for all twenty-six",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The nine that rubbed were painted from the gold poster paint pot.”", "“Poster paint binds with a starch that stays soluble and lifts with warm skin.”"], but: "“The nine were painted last, when the brushes had already been rinsed twice.”" },
      { who: 1, ev: ["“The nine were painted last, when the brushes had already been rinsed twice.”", "“Paint thinned by a wet brush lays down a weaker film whatever kind it is.”"], but: "“The seventeen that did not were painted with the gold acrylic.”" },
      { who: 2, ev: ["“The nine were worn by the students who danced, and the other seventeen sat.”", "“An hour of dancing warms a hand and works a surface far harder than sitting does.”"], but: "“Acrylic paint sets into a plastic film that holds together once it is dry.”" },
    ],
    clears: [
      "An old pot of paint: “Neither pot had dried out, and both were opened that same morning.”",
      "Drying time: “Every crown had the same two days of drying before anybody wore it.”",
    ],
    note:
      "The same nine were poster painted, painted last with wet brushes, and worn by the dancers. Three differences and one group again. Ask what one crown would settle it: an acrylic crown worn by a dancer, which nobody arranged.",
  },
  25: {
    story:
      "One note on the hall piano buzzes, and the eighty-seven others sound clean. Play the note an octave below and the buzz comes faintly too. Something lying loose on the soundboard rattles when a note at its own pitch sets the board moving. A nearby note will shake it a little and the octave will shake it less. A two pence coin was found lying flat on the soundboard under the lid. The hinge screw on the music desk above that note turns a quarter turn by hand. A loose screw in a lid or a desk buzzes to whatever note shakes the case. One of that note's three strings is a replacement and sits a hair proud of the bridge. A string riding high on a bridge buzzes against the pin beside it. It sounds as loud as its neighbours, with the buzz sitting on top of the tone. Against a fork the note has held its pitch exactly for three weeks.",
    q: "What is buzzing? Choose one cause and prove it from the text.",
    who: ["", "🔩 The music desk hinge screw", "🎻 A replacement string riding high", "", ""],
    why: [
      "a two pence coin lying flat on the soundboard",
      "a hinge screw above that note turning by hand",
      "a replacement string sitting a hair proud of the bridge",
      "a note stopping dead the moment the key comes up",
      "a note as loud as its neighbours, with the buzz on top",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A two pence coin was found lying flat on the soundboard under the lid.”", "“Something lying loose on the soundboard rattles when a note at its own pitch sets the board moving.”"], but: "“The hinge screw on the music desk above that note turns a quarter turn by hand.”" },
      { who: 1, ev: ["“The hinge screw on the music desk above that note turns a quarter turn by hand.”", "“A loose screw in a lid or a desk buzzes to whatever note shakes the case.”"], but: "“Play the note an octave below and the buzz comes faintly too.”" },
      { who: 2, ev: ["“One of that note's three strings is a replacement and sits a hair proud of the bridge.”", "“A string riding high on a bridge buzzes against the pin beside it.”"], but: "“A nearby note will shake it a little and the octave will shake it less.”" },
    ],
    clears: [
      "A broken string: “It sounds as loud as its neighbours, with the buzz sitting on top of the tone.”",
      "A slipping tuning pin: “Against a fork the note has held its pitch exactly for three weeks.”",
    ],
    note:
      "The octave is the test and it is the best thing in the case. A loose object on the board answers to pitch, so the octave shakes it a little. A string riding high belongs to one note only and should go silent an octave down. Ask what the octave predicts for each answer before anybody chooses.",
  },
  26: {
    story:
      "The kite climbs for twenty feet, stops, slides backward and dives into the grass. The bridle knot sets the angle the kite meets the wind at. A knot too far back tips the nose up until the wind stops flowing over the sail. A sail the wind has stopped flowing over stops lifting and falls backward. The knot had been slid two centimetres back when the kite was packed away last autumn. Through the whole flight the line hangs slack, and the meter shows nine miles an hour. Nine miles an hour is below the eleven this kite's instructions ask for. A kite short of wind climbs a little way on the run and then settles back. The spine was stored bent against a wall and now carries a permanent bow. A bowed spine holds the sail at a different angle from the one it was cut for. Two metres more tail made no difference to the climb or the dive. A new line, free of kinks, runs easily off the reel.",
    q: "Why does the kite stall? Make the case for one cause.",
    who: ["", "", "🌬️ Not enough wind", "🦴 A bowed spine", ""],
    why: [
      "a knot slid two centimetres back last autumn",
      "two metres of extra tail that changed nothing",
      "nine miles an hour against the eleven the instructions ask",
      "a spine stored against a wall and now permanently bowed",
      "a line new, unkinked and running freely off the reel",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“The knot had been slid two centimetres back when the kite was packed away last autumn.”", "“A knot too far back tips the nose up until the wind stops flowing over the sail.”"], but: "“Nine miles an hour is below the eleven this kite's instructions ask for.”" },
      { who: 2, ev: ["“Through the whole flight the line hangs slack, and the meter shows nine miles an hour.”", "“A kite short of wind climbs a little way on the run and then settles back.”"], but: "“The knot had been slid two centimetres back when the kite was packed away last autumn.”" },
      { who: 3, ev: ["“The spine was stored bent against a wall and now carries a permanent bow.”", "“A bowed spine holds the sail at a different angle from the one it was cut for.”"], but: "“A sail the wind has stopped flowing over stops lifting and falls backward.”" },
    ],
    clears: [
      "Too little tail: “Two metres more tail made no difference to the climb or the dive.”",
      "The line: “A new line, free of kinks, runs easily off the reel.”",
    ],
    note:
      "Three answers and all three are about the angle the sail meets the wind at. That is worth naming, because it means one test serves all of them: fly it in eleven miles an hour with the knot on its mark and see. Stops, slides back and dives is the signature of a stall, and short wind gives a softer settle.",
  },
  27: {
    story:
      "The shamrock's lower leaves have yellowed one by one while the top growth stays green. Roots take in air from the gaps between soil particles as well as water. Waterlogged soil fills those gaps, the roots cannot work, and the oldest leaves yellow first. The pot is a decorative one with no drainage hole in the bottom. Water poured in has nowhere to leave and sits around the roots until it evaporates. September was the repotting and October was when the yellowing began. The compost it went into is the last of a bag opened two summers ago. Old compost has lost most of the nitrogen a plant pulls out of it first. A plant short of nitrogen moves what it has to the new growth and drops the old leaves. The new pot is twice the width of the old and the roots have not reached the sides. Soil with no roots in it stays wet and sours whatever the drainage is like. Three days after watering the soil is wet to a knuckle's depth. Up at the top the new growth is compact and strongly green.",
    q: "Why are the lower leaves yellow? Pick one cause and quote the story.",
    who: ["", "", "", "🧪 Old compost, short of nitrogen", "🪴 A pot twice too wide"],
    why: [
      "a decorative pot with no drainage hole at all",
      "soil still wet to the knuckle three days on",
      "new growth compact and a strong green",
      "the last of a bag opened two summers ago",
      "a pot twice the width, with roots nowhere near the sides",
    ],
    open: [0, 3, 4],
    for: [
      { who: 0, ev: ["“The pot is a decorative one with no drainage hole in the bottom.”", "“Water poured in has nowhere to leave and sits around the roots until it evaporates.”"], but: "“The compost it went into is the last of a bag opened two summers ago.”" },
      { who: 3, ev: ["“The compost it went into is the last of a bag opened two summers ago.”", "“A plant short of nitrogen moves what it has to the new growth and drops the old leaves.”"], but: "“Waterlogged soil fills those gaps, the roots cannot work, and the oldest leaves yellow first.”" },
      { who: 4, ev: ["“The new pot is twice the width of the old and the roots have not reached the sides.”", "“Soil with no roots in it stays wet and sours whatever the drainage is like.”"], but: "“September was the repotting and October was when the yellowing began.”" },
    ],
    clears: [
      "Too little water: “Three days after watering the soil is wet to a knuckle's depth.”",
      "Too little light: “Up at the top the new growth is compact and strongly green.”",
    ],
    note:
      "All three answers arrived in the same September repotting, so the date cannot choose between them. Both the nitrogen answer and the waterlogging answer predict the oldest leaves going first, which is what happened. Ask what a drainage hole alone would fix.",
  },
  28: {
    story:
      "Water stands against the back wall of the shed after every rain, and the front stays dry. Water runs downhill and stops where the fall stops. A spirit level laid across the floor shows the back wall sitting nineteen millimetres low. The door sill at the front sits highest, so water entering anywhere runs back. Rain blows under the door in a south-westerly, and the shed faces south-west. The felt on the back slope was patched in March and the patch has lifted at one edge. A lifted patch lets water run down inside the back wall rather than off the roof. The ground behind the shed rises and the soil there stays wet for days. Water in the soil climbs into a timber plate that sits directly on it. Under the roof joint the floor is dry and those boards carry no stain. Outside that wall the ground is no wetter than outside any other.",
    q: "Why does water stand at the back? Choose one cause and back it up.",
    who: ["", "🏠 The lifted felt patch", "🌧️ Wet ground behind the shed", "", ""],
    why: [
      "a floor nineteen millimetres low at the back wall",
      "a March felt patch lifted at one edge",
      "rising ground behind, with soil wet for days",
      "ground outside that wall no wetter than the others",
      "rain blowing under the door in a south-westerly",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A spirit level laid across the floor shows the back wall sitting nineteen millimetres low.”", "“The door sill at the front sits highest, so water entering anywhere runs back.”"], but: "“The felt on the back slope was patched in March and the patch has lifted at one edge.”" },
      { who: 1, ev: ["“The felt on the back slope was patched in March and the patch has lifted at one edge.”", "“A lifted patch lets water run down inside the back wall rather than off the roof.”"], but: "“Water runs downhill and stops where the fall stops.”" },
      { who: 2, ev: ["“The ground behind the shed rises and the soil there stays wet for days.”", "“Water in the soil climbs into a timber plate that sits directly on it.”"], but: "“The door sill at the front sits highest, so water entering anywhere runs back.”" },
    ],
    clears: [
      "A leaking roof: “Under the roof joint the floor is dry and those boards carry no stain.”",
      "A blocked gutter: “Outside that wall the ground is no wetter than outside any other.”",
    ],
    note:
      "The low back wall explains where the water ends up and says nothing about where it comes from. That distinction runs the whole case. Rain under the door and a lifted patch are both sources; the slope only decides the destination, and all three could be true at once.",
  },
  29: {
    story:
      "Row three of the seed bed is bare and rows one, two, four and five are thick with seedlings. Row three is the one nearest the fence on the south side of the bed. A seed needs its own water, and roots already in the soil take water first. The fence carries a mature privet hedge whose roots run out under the bed. Digging a trench along row three turned up privet roots every few centimetres. A soil moisture meter reads row three at less than half the others two hours after watering. The fence throws shade across row three until after one o'clock each day. Seed in cold shaded ground germinates days later and sometimes not at all. The bed was topped up in March and the barrow tipped its last load over row three. That load came from the bottom of the heap, where the rubble was. A seed sown into rubble has nothing to root into. All five rows were sown from one packet on one afternoon by one person. Row three's surface lies smooth, without a scratch anywhere on it.",
    q: "Why is row three bare? Make the case for one cause.",
    who: ["", "", "", "", "🧱 The rubble load from the heap"],
    why: [
      "privet roots every few centimetres, and half the moisture",
      "one packet, one afternoon, one person for all five rows",
      "a smooth surface with no scratching anywhere",
      "shade from the fence until after one o'clock",
      "the barrow's last load, from the rubble at the bottom of the heap",
    ],
    open: [0, 3, 4],
    for: [
      { who: 0, ev: ["“Digging a trench along row three turned up privet roots every few centimetres.”", "“A soil moisture meter reads row three at less than half the others two hours after watering.”"], but: "“The bed was topped up in March and the barrow tipped its last load over row three.”" },
      { who: 3, ev: ["“The fence throws shade across row three until after one o'clock each day.”", "“Seed in cold shaded ground germinates days later and sometimes not at all.”"], but: "“A soil moisture meter reads row three at less than half the others two hours after watering.”" },
      { who: 4, ev: ["“That load came from the bottom of the heap, where the rubble was.”", "“A seed sown into rubble has nothing to root into.”"], but: "“The fence carries a mature privet hedge whose roots run out under the bed.”" },
    ],
    clears: [
      "A dead packet of seed: “All five rows were sown from one packet on one afternoon by one person.”",
      "Birds: “Row three's surface lies smooth, without a scratch anywhere on it.”",
    ],
    note:
      "The moisture meter is the only measurement and it belongs to the roots answer, which gives it an edge the other two do not have. Everything wrong with row three comes from being next to the fence, except the rubble, and that one arrived in a barrow.",
  },
  30: {
    story:
      "Six boiled eggs peeled cleanly and six tore their whites away in ragged lumps. The shell of an egg is held to the white by a membrane that loosens as an egg ages. A fresh egg grips that membrane tightly and tears when it is pulled away. The six that peeled cleanly came from a carton dated three weeks ago. The six that tore came from a carton collected from the farm on Saturday. The six that tore went into the pan straight from the refrigerator door. A cold egg into boiling water cooks its outer white fast and bonds it to the membrane. The six that peeled had stood on the counter for an hour first. The farm eggs are a brown-shelled breed and the shop eggs are white. A thicker brown shell holds its membrane differently from a thin white one. One pan took all twelve for the same eleven minutes. Afterwards all twelve went into one bowl of iced water for ten minutes.",
    q: "Why did six eggs tear? Pick one cause and prove it.",
    who: ["", "❄️ Straight from the refrigerator door", "", "", "🥚 A brown-shelled breed"],
    why: [
      "collected Saturday, where three weeks loosens a membrane",
      "into the pan straight from the refrigerator door",
      "one pan, eleven minutes, for all twelve",
      "the same iced water for the same ten minutes",
      "a brown-shelled breed against a thin white shell",
    ],
    open: [0, 1, 4],
    for: [
      { who: 0, ev: ["“The six that tore came from a carton collected from the farm on Saturday.”", "“A fresh egg grips that membrane tightly and tears when it is pulled away.”"], but: "“The six that tore went into the pan straight from the refrigerator door.”" },
      { who: 1, ev: ["“The six that tore went into the pan straight from the refrigerator door.”", "“A cold egg into boiling water cooks its outer white fast and bonds it to the membrane.”"], but: "“The six that peeled cleanly came from a carton dated three weeks ago.”" },
      { who: 4, ev: ["“The farm eggs are a brown-shelled breed and the shop eggs are white.”", "“A thicker brown shell holds its membrane differently from a thin white one.”"], but: "“The six that peeled had stood on the counter for an hour first.”" },
    ],
    clears: [
      "The boiling time: “One pan took all twelve for the same eleven minutes.”",
      "The cooling: “Afterwards all twelve went into one bowl of iced water for ten minutes.”",
    ],
    note:
      "The six that tore are the fresh ones, the cold ones and the brown ones, so every difference lands on one carton. The shell colour answer is the weakest and the class should say why: colour is a breed, and nothing in the case connects a breed to a membrane except one sentence that says it differs without saying how.",
  },
  31: {
    story:
      "The metre stick casts a shadow forty centimetres shorter at school than the same stick casts at home. Both readings were taken at noon on the same day with the same stick. The school stick stood on the sloping tarmac of the car park. A slope tilts the ground the shadow falls on and changes the length it measures. The home stick stood on a patio checked level with the same spirit level. Measured again on level ground at school, the shadow matched the home reading within a centimetre. The school reading was taken at clock noon and the home one at local noon. Clock noon and local noon sit thirty minutes apart at this time of year. The school stick was propped against a bollard and leans about four degrees toward the sun. A stick leaning toward the sun casts a shorter shadow than an upright one. Eleven kilometres lie between the sites, which moves the sun's angle hardly at all. One tape measured both shadows, each time from the base of the stick.",
    q: "Why is one shadow shorter? Pick one cause and prove it.",
    who: ["", "🕐 Clock noon against local noon", "", "", ""],
    why: [
      "sloping tarmac tilting the ground the shadow falls on",
      "clock noon at school and local noon at home",
      "a stick propped on a bollard, leaning toward the sun",
      "eleven kilometres, which moves the sun's angle almost nothing",
      "one tape, measured from the base of the stick both times",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The school stick stood on the sloping tarmac of the car park.”", "“Measured again on level ground at school, the shadow matched the home reading within a centimetre.”"], but: "“The school reading was taken at clock noon and the home one at local noon.”" },
      { who: 1, ev: ["“The school reading was taken at clock noon and the home one at local noon.”", "“Clock noon and local noon sit thirty minutes apart at this time of year.”"], but: "“Measured again on level ground at school, the shadow matched the home reading within a centimetre.”" },
      { who: 2, ev: ["“The school stick was propped against a bollard and leans about four degrees toward the sun.”", "“A stick leaning toward the sun casts a shorter shadow than an upright one.”"], but: "“A slope tilts the ground the shadow falls on and changes the length it measures.”" },
    ],
    clears: [
      "The distance between the sites: “Eleven kilometres lie between the sites, which moves the sun's angle hardly at all.”",
      "The tape measure: “One tape measured both shadows, each time from the base of the stick.”",
    ],
    note:
      "The level-ground retest is the strongest evidence and it has a hole: nobody says whether it was taken at clock noon or local noon. If the time was wrong both times, a matching second reading proves the slope and nothing else. Ask what was held constant.",
  },
  32: {
    story:
      "Every photograph taken in the gym has a green cast and the same camera is fine outdoors. White balance tells a camera which light it is working under so it can correct for it. The camera was left on its daylight setting for both the field and the gym. Older fluorescent tubes give out a spiky light with far more green in it than daylight. The gym is lit by twenty-eight fluorescent tubes and has no windows. Switched to the fluorescent white balance, a gym shot came out neutral. The same tubes were fitted when the gym was built in 1998. A tube that old has drifted far from the colour it left the factory with. The gym's walls and ceiling were painted pale green over the summer. Light bouncing off a coloured wall carries that colour onto everything in the room. That same afternoon three hundred field shots came out perfectly neutral. After a clean of the lens, the next gym shot was as green as the one before.",
    q: "Why do the gym photographs look green? Make the case for one cause.",
    why: [
      "a daylight setting used under twenty-eight fluorescent tubes",
      "three hundred field shots, perfectly neutral",
      "a cleaned lens and the next shot as green as the last",
      "walls and ceiling painted pale green over the summer",
      "tubes fitted in 1998, long drifted from their factory colour",
    ],
    open: [0, 3, 4],
    for: [
      { who: 0, ev: ["“The camera was left on its daylight setting for both the field and the gym.”", "“Switched to the fluorescent white balance, a gym shot came out neutral.”"], but: "“The gym's walls and ceiling were painted pale green over the summer.”" },
      { who: 3, ev: ["“The gym's walls and ceiling were painted pale green over the summer.”", "“Light bouncing off a coloured wall carries that colour onto everything in the room.”"], but: "“The camera was left on its daylight setting for both the field and the gym.”" },
      { who: 4, ev: ["“The same tubes were fitted when the gym was built in 1998.”", "“A tube that old has drifted far from the colour it left the factory with.”"], but: "“Switched to the fluorescent white balance, a gym shot came out neutral.”" },
    ],
    clears: [
      "A faulty sensor: “That same afternoon three hundred field shots came out perfectly neutral.”",
      "A dirty lens: “After a clean of the lens, the next gym shot was as green as the one before.”",
    ],
    note:
      "The fluorescent setting fixed it, which is the strongest single fact and the one every answer must survive. A green wall would still tint a photo on any setting. Ask whether the photographs were green before the summer, because the case never says.",
  },
  33: {
    story:
      "The bean seedling leans toward the window, and turning the pot does not keep it straight. Two days after any turn the stem has bent back toward the glass. A plant bends toward light because the cells on the shaded side grow longer than the lit ones. That growth happens at the tip, which is why a turned plant bends back within days. A small foil cap over the tip stopped the bending for a whole week. Uncovering the tip started it again within three days. The windowsill is cold and the room side of the pot sits over a radiator. Roots grow away from heat, and a stem follows the side its roots are feeding. The pot is turned by lifting it and setting it down with a knock. A knock settles loose compost and tips a stem a few degrees each time. The window is the only light source in the room during the day. The stem is firm and keeps whatever angle it has grown into.",
    q: "Why does the seedling lean back? Choose one cause and quote the story.",
    who: ["", "", "🔥 The radiator under the room side", "🤲 The knock when it is turned", ""],
    why: [
      "light at the tip, where the bending growth happens",
      "a firm stem that holds whatever angle it grows to",
      "a cold sill and a radiator under the room side",
      "a pot lifted and set down with a knock each time",
      "a foil cap that stopped the bending for a week",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“A small foil cap over the tip stopped the bending for a whole week.”", "“Uncovering the tip started it again within three days.”"], but: "“The windowsill is cold and the room side of the pot sits over a radiator.”" },
      { who: 2, ev: ["“The windowsill is cold and the room side of the pot sits over a radiator.”", "“Roots grow away from heat, and a stem follows the side its roots are feeding.”"], but: "“Two days after any turn the stem has bent back toward the glass.”" },
      { who: 3, ev: ["“The pot is turned by lifting it and setting it down with a knock.”", "“A knock settles loose compost and tips a stem a few degrees each time.”"], but: "“That growth happens at the tip, which is why a turned plant bends back within days.”" },
    ],
    clears: [
      "A weak stem: “The stem is firm and keeps whatever angle it has grown into.”",
      "The foil cap: “The window is the only light source in the room during the day.”",
    ],
    note:
      "The foil cap is a two-way test and it is still the best evidence here: cap on, no bending; cap off, bending again. The radiator answer has to explain why covering a tip stops anything. The knock answer has to explain a week of stillness under a cap.",
  },
  34: {
    story:
      "The tub in the door of the freezer is gritty with ice crystals and the tub at the back is smooth. Ice cream grows crystals when it part-thaws and refreezes, because small crystals melt and regrow as big ones. Opening the freezer door swings the door shelf out into room-temperature air. The door is opened perhaps twenty times a day in this house. A thermometer taped to the door shelf recorded minus six at four in the afternoon. Moving the gritty tub to the back shelf stopped any further crystals forming. The door tub was opened and served from eleven times and the back tub twice. Every opening lets warm air at the surface and puts a spoon through it. All week the freezer's own log has read a steady minus eighteen. That sensor sits at the back of the compartment beside the smooth tub. A log that only watches one shelf says nothing about the other. Brand, flavour and batch code are identical on the two lids. A poor recipe would have made both tubs gritty, not one.",
    q: "Why is one tub gritty? Pick one cause and back it up.",
    who: ["", "", "🥄 Eleven servings against two", "", ""],
    why: [
      "a door shelf swinging out into the room twenty times a day",
      "a sensor at the back, beside the smooth tub",
      "eleven servings from the door tub against two from the back",
      "a log reading minus eighteen steadily all week",
      "one brand, one flavour, one batch code on both lids",
    ],
    open: [0, 2, 4],
    for: [
      { who: 0, ev: ["“A thermometer taped to the door shelf recorded minus six at four in the afternoon.”", "“Moving the gritty tub to the back shelf stopped any further crystals forming.”"], but: "“The door tub was opened and served from eleven times and the back tub twice.”" },
      { who: 2, ev: ["“The door tub was opened and served from eleven times and the back tub twice.”", "“Every opening lets warm air at the surface and puts a spoon through it.”"], but: "“A thermometer taped to the door shelf recorded minus six at four in the afternoon.”" },
      { who: 4, ev: ["“That sensor sits at the back of the compartment beside the smooth tub.”", "“A log that only watches one shelf says nothing about the other.”"], but: "“Moving the gritty tub to the back shelf stopped any further crystals forming.”" },
    ],
    clears: [
      "A poor recipe: “A poor recipe would have made both tubs gritty, not one.”",
      "A bad batch: “Brand, flavour and batch code are identical on the two lids.”",
    ],
    note:
      "Moving the tub stopped the crystals, which is a real test and it changed two things at once: the shelf and the serving. Eleven against two is the number the class should hold up beside minus six. The sensor answer is not a cause at all, and saying so is itself an answer.",
  },
  35: {
    story:
      "Half the medal ribbons have frayed into loose threads at both cut ends and half have not. Scissors leave a clean cut that begins to unravel as soon as the ribbon is handled. A heated blade melts the cut edge of a synthetic ribbon and seals the threads together. The frayed half were cut with the craft scissors from the supply drawer. The sound half were cut with the hot knife borrowed from the technology room. Running a finger along a sealed end finds a hard glassy ridge that the cut ends do not have. The frayed half came off the end of the roll, where the weave runs looser. A loose weave frays from any cut, sealed or not, once it is handled. The frayed half were pinned to the board and the sound half were hung from a rail. A pin through a ribbon starts a run that works outward to the edges. Every ribbon came off the same roll on the same afternoon. An hour at most separates the cutting of the two halves.",
    q: "Why did half the ribbons fray? Make the case for one cause.",
    who: ["", "🧵 A looser weave at the roll's end", "📌 Being pinned to the board", "", ""],
    why: [
      "cut with craft scissors where the others met a hot knife",
      "off the end of the roll, where the weave runs looser",
      "pinned to the board while the sound half hung from a rail",
      "one roll, one afternoon, for every ribbon",
      "two halves cut within an hour of each other",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The frayed half were cut with the craft scissors from the supply drawer.”", "“Running a finger along a sealed end finds a hard glassy ridge that the cut ends do not have.”"], but: "“The frayed half came off the end of the roll, where the weave runs looser.”" },
      { who: 1, ev: ["“The frayed half came off the end of the roll, where the weave runs looser.”", "“A loose weave frays from any cut, sealed or not, once it is handled.”"], but: "“A heated blade melts the cut edge of a synthetic ribbon and seals the threads together.”" },
      { who: 2, ev: ["“The frayed half were pinned to the board and the sound half were hung from a rail.”", "“A pin through a ribbon starts a run that works outward to the edges.”"], but: "“Scissors leave a clean cut that begins to unravel as soon as the ribbon is handled.”" },
    ],
    clears: [
      "A weak weave: “Every ribbon came off the same roll on the same afternoon.”",
      "Age: “An hour at most separates the cutting of the two halves.”",
    ],
    note:
      "Both cut ends frayed, and a pin goes through the middle of a ribbon rather than its ends. That one observation does more work than anything else in the case. The glassy ridge is a measurement anybody can take with a fingertip.",
  },
  36: {
    story:
      "Twelve balloons were tied along the railing and only the one at the south end burst. Latex weakens where sunlight falls on it, and weakened latex gives way under pressure. The south end of the railing is the only part in direct sun after eleven o'clock. The air inside a balloon in sunlight also warms and pushes outward harder. A thermometer held against the south end balloon read nine degrees above the others. The burst happened at twenty past two, in the hottest part of the afternoon. The south end balloon was the first one inflated, before the pump gauge was fitted. An ungauged balloon can take half as much air again without anybody noticing. The railing's south end carries a weld with a rough burr on its upper face. A burr need only touch a stretched balloon once to open it. All twelve came from one bag and were inflated by the same pump to the same mark. All day the other eleven sit in the building's shade.",
    q: "Why did one balloon burst? Choose one cause and prove it.",
    who: ["", "", "", "📌 A burr on the weld", ""],
    why: [
      "the only part of the railing in sun after eleven",
      "one bag and one pump to the same mark for all twelve",
      "inflated first, before the pump gauge was fitted",
      "a weld with a rough burr on its upper face",
      "nine degrees above the others, at twenty past two",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“The south end of the railing is the only part in direct sun after eleven o'clock.”", "“Latex weakens where sunlight falls on it, and weakened latex gives way under pressure.”"], but: "“The south end balloon was the first one inflated, before the pump gauge was fitted.”" },
      { who: 2, ev: ["“The south end balloon was the first one inflated, before the pump gauge was fitted.”", "“An ungauged balloon can take half as much air again without anybody noticing.”"], but: "“A thermometer held against the south end balloon read nine degrees above the others.”" },
      { who: 3, ev: ["“The railing's south end carries a weld with a rough burr on its upper face.”", "“A burr need only touch a stretched balloon once to open it.”"], but: "“The burst happened at twenty past two, in the hottest part of the afternoon.”" },
    ],
    clears: [
      "A weak balloon: “All twelve came from one bag and were inflated by the same pump to the same mark.”",
      "Warm air inside: “All day the other eleven sit in the building's shade.”",
    ],
    note:
      "Three things are true of the south end and nothing else: the sun, the first inflation and the burr. The time of day is the evidence that separates them, because a burr does not wait until twenty past two. Ask what each answer predicts about when.",
  },
};
