/**
 * Grade 10, the debate version of each case. See scripts/mysteries/g5.debate.mjs
 * for what these files are and what the gate holds them to.
 *
 * The ordinary grade 10 case puts three odd things on the table at once and
 * asks which single cause sits upstream of all three. Every wrong suspect
 * accounts for one of them, usually the loudest.
 *
 * These keep that shape and take the "only one" away. Three suspects now
 * reach all three oddities by three different routes, and the text supports
 * each route. The class has to argue about which route the evidence carries
 * furthest, which is the same reasoning with nothing underneath it to land on.
 */
export const DEBATES = {
  1: {
    story:
      "Three odd things turned up in the library in the same week. Books from the outside drop chute arrive with curled, wavy pages. The carpet under the chute has a dark square the size of a doormat. And the brass flap, which squeaked for nine years, has gone silent. The flap's return spring snapped on Sunday night, and the flap now hangs open. A flap resting open never swings, and an open chute lets rain fall straight onto the books. Rain has fallen on six of the last seven days, the wettest week since March. Water running down the inside of the chute swells the flap's hinge and holds it still. Readers queue at the chute in wet coats and set streaming bags down on that square. The bag pile has stood there since Monday and the square has never had a chance to dry. Wet wool against brass leaves a film, and a filmed hinge slides without a sound. The humidifier was taken out of the reading room in September and returned to the store. No drink has been allowed past the entrance desk since the new rule in October.",
    q: "What is behind all three problems? Pick one cause and prove it from the text.",
    why: [
      "a spring that snapped on Sunday, leaving the flap hanging open",
      "six wet days out of seven, with water running down inside the chute",
      "wet coats and streaming bags set down on that square since Monday",
      "a humidifier that left the reading room in September",
      "drinks stopped at the entrance desk since October",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The flap's return spring snapped on Sunday night, and the flap now hangs open.”", "“A flap resting open never swings, and an open chute lets rain fall straight onto the books.”"], but: "“Wet wool against brass leaves a film, and a filmed hinge slides without a sound.”" },
      { who: 1, ev: ["“Rain has fallen on six of the last seven days, the wettest week since March.”", "“Water running down the inside of the chute swells the flap's hinge and holds it still.”"], but: "“The flap's return spring snapped on Sunday night, and the flap now hangs open.”" },
      { who: 2, ev: ["“Readers queue at the chute in wet coats and set streaming bags down on that square.”", "“The bag pile has stood there since Monday and the square has never had a chance to dry.”"], but: "“Books from the outside drop chute arrive with curled, wavy pages.”" },
    ],
    clears: [
      "The humidifier: “The humidifier was taken out of the reading room in September and returned to the store.”",
      "A drinks spill: “No drink has been allowed past the entrance desk since the new rule in October.”",
    ],
    note:
      "The solve version gave the spring the only route to a silent flap. Here rain swells the hinge and wet wool films it, so three causes reach the silence. Watch for the student who notices that the bag pile explains the carpet best and the pages worst, and has to decide whether that costs it the case.",
  },
  2: {
    story:
      "Dev's yogurt is warm by lunchtime every day this term. Two things go with it that nobody has put beside it. His ice pack is still frozen rock hard at noon, and the outside of the bag is cold to the touch. Since September the pack has been clipped into the outside mesh pocket, behind a zipped insulated wall. Nothing cold has been inside the box with the food since term began. The bag's inner lining has split along the seam nearest that pocket. Cold escaping through a split reaches the shell and chills the fabric instead of the box. Fabric held near freezing all morning takes very little back from the pack beside it. The bag hangs on the rack with its food side against the radiator and its mesh side to the corridor. The radiator runs from seven until nine every morning of term. Corridor air by that door measures four degrees, colder than the staff room fridge. The freezer was serviced in August and holds minus twenty every night. The pack is the large size, cut to fill the whole width of the box.",
    q: "Why is the yogurt warm? Choose one cause and quote the story.",
    why: [
      "clipped outside a zipped insulated wall since September",
      "a freezer serviced in August, holding minus twenty",
      "an inner lining split along the seam nearest the pocket",
      "the food side against a radiator that runs seven until nine",
      "a pack cut to fill the whole width of the box",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“Since September the pack has been clipped into the outside mesh pocket, behind a zipped insulated wall.”", "“Nothing cold has been inside the box with the food since term began.”"], but: "“The radiator runs from seven until nine every morning of term.”" },
      { who: 2, ev: ["“The bag's inner lining has split along the seam nearest that pocket.”", "“Cold escaping through a split reaches the shell and chills the fabric instead of the box.”"], but: "“Fabric held near freezing all morning takes very little back from the pack beside it.”" },
      { who: 3, ev: ["“The bag hangs on the rack with its food side against the radiator and its mesh side to the corridor.”", "“Corridor air by that door measures four degrees, colder than the staff room fridge.”"], but: "“Nothing cold has been inside the box with the food since term began.”" },
    ],
    clears: [
      "A failed freezer: “The freezer was serviced in August and holds minus twenty every night.”",
      "A pack too small: “The pack is the large size, cut to fill the whole width of the box.”",
    ],
    note:
      "All three live answers put the cold on one side of a wall and the food on the other; they disagree about which wall. The radiator argument is the strongest on the facts and the weakest on timing, because the radiator stops at nine and the yogurt is warm at noon. That gap is worth the whole lesson.",
  },
  3: {
    story:
      "Lia cannot keep a point on a pencil for a single paragraph. Three facts sit beside the snapping and each has been shrugged off alone. The wooden barrels of her pencils have hairline splits running along the grain. The breaks happen three centimetres inside the wood, not at the paper. And a pencil from Omar's tray has written all week without breaking. Lia's pencil case is clipped to the outside of her rucksack and hits the stair rail every morning. A dropped case cracks the lead end to end inside wood that still looks whole. Lia's box came from the market stall and Omar's came from the school shop. Pencils glued badly at the factory split along the grain as the glue dries out. Lia presses hard enough to emboss the next three pages of her book. A lead squeezed by a grip that heavy breaks at its weakest point, wherever that happens to be. The sharpener was replaced with a new one on Monday and the snapping has not changed.",
    q: "Why do Lia's pencils break and Omar's does not? Pick a cause and prove it.",
    why: [
      "a case clipped outside the rucksack that hits the stair rail daily",
      "a market stall box, where Omar's came from the school shop",
      "a sharpener replaced on Monday",
      "a grip heavy enough to emboss three pages ahead",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“Lia's pencil case is clipped to the outside of her rucksack and hits the stair rail every morning.”", "“A dropped case cracks the lead end to end inside wood that still looks whole.”"], but: "“The wooden barrels of her pencils have hairline splits running along the grain.”" },
      { who: 1, ev: ["“Lia's box came from the market stall and Omar's came from the school shop.”", "“Pencils glued badly at the factory split along the grain as the glue dries out.”"], but: "“The breaks happen three centimetres inside the wood, not at the paper.”" },
      { who: 3, ev: ["“Lia presses hard enough to emboss the next three pages of her book.”", "“A lead squeezed by a grip that heavy breaks at its weakest point, wherever that happens to be.”"], but: "“A dropped case cracks the lead end to end inside wood that still looks whole.”" },
    ],
    clears: [
      "The sharpener: “The sharpener was replaced with a new one on Monday and the snapping has not changed.”",
    ],
    note:
      "In the solve version Omar's pencil came out of Lia's box, which killed the batch answer outright. Two shops put it back on the table, and the split barrels now have a factory explanation as good as the stair rail one. Pressing hard is the weakest of the three and the one most students pick first.",
  },
  4: {
    story:
      "Apples from the Tuesday crate bruise within a day of reaching the classrooms. Two more things are true of that crate and of no other. Its cardboard base is damp enough to tear when lifted, and the fruit tastes mealy even where it is not bruised. The Tuesday crate is the one left on the loading dock overnight, because the store room is locked on Mondays. Dock temperatures drop below freezing and climb again by morning, and freezing bursts the cells inside fruit. Burst cells go soft, taste dry, and let their water out into the box. The Tuesday crate is also loaded last, from the back of the cold store, where stock waits longest. Apples held for weeks lose their crispness and bruise under their own weight. A crate that has stood in a cold store carries condensation on its base when it comes out. The roof seam above bay four has dripped since the storm, and the Tuesday crate stands in bay four. Rain fell all Monday night. Every crate is carried by the same two people on the same trolley. All five crates hold the same variety from the same orchard.",
    q: "What is wrong with the Tuesday crate? Choose one cause and quote the text.",
    why: [
      "a night on a dock that freezes and thaws before morning",
      "carried by the same two people on the same trolley",
      "loaded last from the back of the cold store, where stock waits longest",
      "a roof seam over bay four, dripping since the storm",
      "the same variety from the same orchard as the other four",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“The Tuesday crate is the one left on the loading dock overnight, because the store room is locked on Mondays.”", "“Dock temperatures drop below freezing and climb again by morning, and freezing bursts the cells inside fruit.”"], but: "“Rain fell all Monday night.”" },
      { who: 2, ev: ["“The Tuesday crate is also loaded last, from the back of the cold store, where stock waits longest.”", "“Apples held for weeks lose their crispness and bruise under their own weight.”"], but: "“Burst cells go soft, taste dry, and let their water out into the box.”" },
      { who: 3, ev: ["“The roof seam above bay four has dripped since the storm, and the Tuesday crate stands in bay four.”", "“A crate that has stood in a cold store carries condensation on its base when it comes out.”"], but: "“The fruit tastes mealy even where it is not bruised.”" },
    ],
    clears: [
      "Rough handling: “Every crate is carried by the same two people on the same trolley.”",
      "The variety: “All five crates hold the same variety from the same orchard.”",
    ],
    note:
      "The damp base is the sentence to argue over. Freezing makes it from the inside, the cold store makes it by condensation, the roof seam makes it from above, and the text lets all three stand. Mealiness is where the roof answer runs out, and a good argument says so out loud before someone else does.",
  },
  5: {
    story:
      "Noor's back tyre goes soft every three or four days, and she has mended it six times. Two details come up every time and nobody has used them. Four of the six holes are on the inner face of the tube, and two are on the tread side. The cloth rim tape under the tube has slid about a centimetre off true. Where the tape has slipped, one spoke end stands proud of the rim with nothing over it. Every turn of the wheel presses the tube against that bare end from the inside. Three thorn tips are still embedded in the tread, worn flush and invisible until the tyre is flexed. A thorn held in the rubber pricks the tube again each time the wheel rolls over it. The valve sits in a rim hole whose edge was never filed smooth. Twice the escaping air has been traced to the valve base rather than to any patch. The pump was replaced in September and reads a true sixty on its gauge.",
    q: "What keeps puncturing the tube? Pick one and prove it from the story.",
    why: [
      "a bare spoke end where the rim tape slipped a centimetre",
      "three thorn tips worn flush into the tread",
      "a valve sitting in a rim hole that was never filed smooth",
      "a pump replaced in September, reading true",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Where the tape has slipped, one spoke end stands proud of the rim with nothing over it.”", "“Every turn of the wheel presses the tube against that bare end from the inside.”"], but: "“Four of the six holes are on the inner face of the tube, and two are on the tread side.”" },
      { who: 1, ev: ["“Three thorn tips are still embedded in the tread, worn flush and invisible until the tyre is flexed.”", "“A thorn held in the rubber pricks the tube again each time the wheel rolls over it.”"], but: "“The cloth rim tape under the tube has slid about a centimetre off true.”" },
      { who: 2, ev: ["“The valve sits in a rim hole whose edge was never filed smooth.”", "“Twice the escaping air has been traced to the valve base rather than to any patch.”"], but: "“She has mended it six times.”" },
    ],
    clears: [
      "The pump: “The pump was replaced in September and reads a true sixty on its gauge.”",
    ],
    note:
      "Two holes on the tread side is the whole change from the solve version, and it buys the thorns a case. Four and two is also an argument for two causes at once, which no suspect card offers. A class that gets there has out-reasoned the question, and should be told so.",
  },
  6: {
    story:
      "Three complaints about the class tank have been written in the log, by different people on different pages. The glass grows a green film within three days of being scraped clean. The fish crowd the surface and gulp every afternoon, though they swim low all morning. The thermometer reads nineteen degrees at nine o'clock and twenty-three at four. The tank was moved in September to the sill under the south window. From half past one the sun falls on that glass and stays there until the room is locked. The lunchtime club feeds the tank again at half past three, on top of the morning feed. Food left to rot takes oxygen out of the water and feeds whatever is growing on the glass. The filter's flow has dropped by half since the sponge was last rinsed in July. Water that is barely turned over lets a warm layer settle at the top and holds waste below it. Six fish were rehomed in October and four remain in a tank built for twelve. The heater has not been in the tank since the summer, and the shelf it sits on is dusty.",
    q: "What is behind all three log entries? Choose one cause and quote the text.",
    why: [
      "a sill under the south window, in sun from half past one",
      "a second feed at half past three, on top of the morning one",
      "a filter whose flow has halved since July",
      "four fish left in a tank built for twelve",
      "a heater out of the water since the summer",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The tank was moved in September to the sill under the south window.”", "“From half past one the sun falls on that glass and stays there until the room is locked.”"], but: "“The filter's flow has dropped by half since the sponge was last rinsed in July.”" },
      { who: 1, ev: ["“The lunchtime club feeds the tank again at half past three, on top of the morning feed.”", "“Food left to rot takes oxygen out of the water and feeds whatever is growing on the glass.”"], but: "“The thermometer reads nineteen degrees at nine o'clock and twenty-three at four.”" },
      { who: 2, ev: ["“The filter's flow has dropped by half since the sponge was last rinsed in July.”", "“Water that is barely turned over lets a warm layer settle at the top and holds waste below it.”"], but: "“The fish crowd the surface and gulp every afternoon, though they swim low all morning.”" },
    ],
    clears: [
      "Too many fish: “Six fish were rehomed in October and four remain in a tank built for twelve.”",
      "The heater: “The heater has not been in the tank since the summer, and the shelf it sits on is dusty.”",
    ],
    note:
      "Four degrees by four o'clock is the fact that only the sun reaches cleanly, and the filter answer gets near it with a warm layer that will not mix. The feeding answer cannot touch temperature at all, and it still explains two of the three entries better than either rival. Ask whether two-of-three with a tight fit beats three-of-three with a loose one.",
  },
  7: {
    story:
      "Room 12 is unusable whenever the wind gets up, and the caretaker has had three separate reports. There is a hard rattle somewhere near the back wall. A draught crosses the floor strongly enough to lift loose paper off the bottom shelf. And a thin whistle comes and goes at the same times as the rattle. The top window at the back has a catch that no longer engages, logged in August and never fixed. Wind pushes an unlatched window open a few millimetres and lets it fall back, over and over. The extractor cowl on the roof has lost a blade, so the wind spins it whenever it blows. A fan turning backwards pushes cold air down its duct and out at the grille by the skirting. The ceiling tile above the back wall has lifted at one corner, where the void over the cloakroom opens. Air driven through that void comes down behind the cloakroom door and runs along the floor. A lifted corner slaps its frame every time the pressure changes. The radiator was drained and capped in September and has been stone cold since.",
    q: "What is making all three noises and the draught? Pick one and prove it.",
    why: [
      "a window catch logged in August and never fixed",
      "a radiator drained and capped in September",
      "a roof cowl with a blade missing, spun by any wind",
      "a ceiling tile lifted at the corner over the cloakroom void",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“The top window at the back has a catch that no longer engages, logged in August and never fixed.”", "“Wind pushes an unlatched window open a few millimetres and lets it fall back, over and over.”"], but: "“A draught crosses the floor strongly enough to lift loose paper off the bottom shelf.”" },
      { who: 2, ev: ["“The extractor cowl on the roof has lost a blade, so the wind spins it whenever it blows.”", "“A fan turning backwards pushes cold air down its duct and out at the grille by the skirting.”"], but: "“A lifted corner slaps its frame every time the pressure changes.”" },
      { who: 3, ev: ["“The ceiling tile above the back wall has lifted at one corner, where the void over the cloakroom opens.”", "“Air driven through that void comes down behind the cloakroom door and runs along the floor.”"], but: "“There is a hard rattle somewhere near the back wall.”" },
    ],
    clears: [
      "The radiator: “The radiator was drained and capped in September and has been stone cold since.”",
    ],
    note:
      "The draught at floor level used to rule the ceiling tile out on its own. A route down behind the cloakroom door gives it the floor, and the grille by the skirting gives the fan the floor too. The whistle is the fact nobody has claimed, and the first group to claim it usually wins the room.",
  },
  8: {
    story:
      "The drain by the gate floods after every shower, and two other things near it were reported separately. The path beside the drain is black and slippery for about two metres. And the gutter above that stretch drips steadily even when it has not rained for three days. The gutter above the gate has filled with leaves until it holds water like a trough. Standing water finds the joints and drips for days after the rain stops. A camera run this term found a root mass in the drain, two metres down from the cover. Water held in a blocked system backs up the rainwater pipe and weeps from the joint above. The downpipe behind the ivy is split along its back seam, which faces the wall. Water escaping at the back of a pipe runs down behind it and out at the shoe onto the path. The ivy has kept that whole stretch of wall out of the light and out of the rain. No tree within thirty metres of the gate has dropped a leaf since the hedge was cut back in August. The new gate hangs on the far post and nothing on it reaches over the drain.",
    q: "What is causing the flooding, the slime and the dripping? Prove your choice.",
    why: [
      "a gutter filled with leaves until it holds water like a trough",
      "a root mass found two metres down from the drain cover",
      "no tree within thirty metres since the August hedge cut",
      "a downpipe split along the seam facing the wall",
      "a new gate hung on the far post",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The gutter above the gate has filled with leaves until it holds water like a trough.”", "“Standing water finds the joints and drips for days after the rain stops.”"], but: "“A camera run this term found a root mass in the drain, two metres down from the cover.”" },
      { who: 1, ev: ["“A camera run this term found a root mass in the drain, two metres down from the cover.”", "“Water held in a blocked system backs up the rainwater pipe and weeps from the joint above.”"], but: "“The gutter above the gate has filled with leaves until it holds water like a trough.”" },
      { who: 3, ev: ["“The downpipe behind the ivy is split along its back seam, which faces the wall.”", "“Water escaping at the back of a pipe runs down behind it and out at the shoe onto the path.”"], but: "“The gutter above that stretch drips steadily even when it has not rained for three days.”" },
    ],
    clears: [
      "Leaves on the path: “No tree within thirty metres of the gate has dropped a leaf since the hedge was cut back in August.”",
      "The new gate: “The new gate hangs on the far post and nothing on it reaches over the drain.”",
    ],
    note:
      "A clean wall ruled the downpipe out in the solve version, and the ivy takes that away without inventing anything. The blockage answer is the interesting one: it explains the drip by running the water backwards, which is true of real drainage and reads like a trick until someone checks it.",
  },
  9: {
    story:
      "Three pumpkins were carved on the same morning from the same box. The one on the office desk collapsed in two days. The porch pumpkin is still standing after a fortnight, and a third is firm on day ten. Two more things are true only of the collapsed one. Its cut edges carry a fuzzy white bloom, and the inside of its lid has a dark ring. The collapsed pumpkin is the only one lit with a real candle, and the other two were given battery lights. A flame in a lidded pumpkin cooks the flesh and traps the steam it drives out. The collapsed pumpkin stood on the desk directly above the office radiator, which runs all day. The third pumpkin sits on the office window ledge, in the draught from the vent. Warm wet flesh in a closed space grows mould within a day. The collapsed pumpkin came from the bottom of the box, under the weight of eleven others. Fruit bruised before it is carved blackens in a ring where the lid is cut. Its wall measures three centimetres, the thickest of the three.",
    q: "Why did only one pumpkin collapse? Choose a cause and quote the story.",
    why: [
      "the only one lit with a real candle",
      "the only one standing above a radiator that runs all day",
      "the one from the bottom of the box, under eleven others",
      "a wall of three centimetres, the thickest of the three",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The collapsed pumpkin is the only one lit with a real candle, and the other two were given battery lights.”", "“A flame in a lidded pumpkin cooks the flesh and traps the steam it drives out.”"], but: "“The third pumpkin sits on the office window ledge, in the draught from the vent.”" },
      { who: 1, ev: ["“The collapsed pumpkin stood on the desk directly above the office radiator, which runs all day.”", "“The third pumpkin sits on the office window ledge, in the draught from the vent.”"], but: "“A flame in a lidded pumpkin cooks the flesh and traps the steam it drives out.”" },
      { who: 2, ev: ["“The collapsed pumpkin came from the bottom of the box, under the weight of eleven others.”", "“Fruit bruised before it is carved blackens in a ring where the lid is cut.”"], but: "“Its cut edges carry a fuzzy white bloom”" },
    ],
    clears: [
      "Thin walls: “Its wall measures three centimetres, the thickest of the three.”",
    ],
    note:
      "The third pumpkin used to share the desk, which is what killed the warm-office answer. Moving it to the ledge gives the radiator a real case and takes away the clean comparison. The dark ring is now explained twice over, by a flame above it and by a bruise beneath it, and the class has to say which explanation the word bruised will carry.",
  },
  10: {
    story:
      "Grey footprints appear inside the school every morning, and three things about them have never been joined up. They turn up at the east doors and at no door on the west side. They are chalky and pale rather than brown, and they come on dry days as readily as wet. And the dark doormats at the east doors have gone pale right across. A limestone path was laid along the east side at half term. Crushed limestone is white, it powders underfoot, and it travels dry. The cleaners' new floor product is a chalk-based powder mixed with water in a bucket. It has been trialled on the east corridors only, and it has bleached dark fabric in two other schools. The builders moved to the east door at half term, when the scaffold closed the west one. They are cutting plasterboard on the roof all day, and plasterboard dust is white and fine. No rain has fallen since Sunday and the ground everywhere is hard. The sandpit was emptied in September and the pit itself boarded over.",
    q: "Where is the grey dust coming from? Pick one source and prove it from the text.",
    why: [
      "a limestone path laid along the east side at half term",
      "no rain since Sunday and hard ground everywhere",
      "a chalk-based floor powder trialled on the east corridors only",
      "builders at the east door since the scaffold closed the west one",
      "a sandpit emptied in September and boarded over",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“A limestone path was laid along the east side at half term.”", "“Crushed limestone is white, it powders underfoot, and it travels dry.”"], but: "“And the dark doormats at the east doors have gone pale right across.”" },
      { who: 2, ev: ["“The cleaners' new floor product is a chalk-based powder mixed with water in a bucket.”", "“It has been trialled on the east corridors only, and it has bleached dark fabric in two other schools.”"], but: "“They turn up at the east doors and at no door on the west side.”" },
      { who: 3, ev: ["“The builders moved to the east door at half term, when the scaffold closed the west one.”", "“They are cutting plasterboard on the roof all day, and plasterboard dust is white and fine.”"], but: "“Crushed limestone is white, it powders underfoot, and it travels dry.”" },
    ],
    clears: [
      "Mud: “No rain has fallen since Sunday and the ground everywhere is hard.”",
      "The sandpit: “The sandpit was emptied in September and the pit itself boarded over.”",
    ],
    note:
      "Three white powders now arrive at the same door in the same week, and all three were put there by the same half term. The bleached mats are the tiebreaker: dust sits on a mat, and only the cleaners' product is mopped into one. A class that reaches for the mats has found the fact nobody else is using.",
  },
  11: {
    story:
      "The 8:05 bus reaches school about seven minutes late, but only on Tuesdays, Thursdays and Fridays. Two further facts sit in the driver's log and have never been read beside the first. On those days the bus is standing room only by stop four. And the whole of the lost time builds up between stop four and stop eight. The 41 service does not run on Tuesdays, Thursdays or Fridays, and its riders join the 8:05 instead. Every passenger on a full bus takes longer to board, and the busy stops are four through eight. The roadworks on Mill Lane sit between stop five and stop seven, under a one-way light. The contractor works that site on Tuesdays, Thursdays and Fridays and leaves the light on green otherwise. The bridge lights switch to their crossing pattern on the three mornings the patrol is staffed. That pattern holds traffic for ninety seconds a cycle, and the bridge stands between stops six and seven. The same driver works all five mornings, and his log shows the same stops in the same order. Rain has fallen on seven mornings this month, spread across all five days, and three of them ran on time.",
    q: "Why is the bus late on only three days? Choose one cause and quote the log.",
    why: [
      "the 41 cancelled on exactly those three days",
      "a one-way light worked by the contractor on exactly those three days",
      "a driver whose log shows the same stops in the same order all week",
      "a crossing pattern running on the three mornings the patrol is staffed",
      "rain on seven mornings, spread across all five days",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The 41 service does not run on Tuesdays, Thursdays or Fridays, and its riders join the 8:05 instead.”", "“Every passenger on a full bus takes longer to board, and the busy stops are four through eight.”"], but: "“The contractor works that site on Tuesdays, Thursdays and Fridays and leaves the light on green otherwise.”" },
      { who: 1, ev: ["“The roadworks on Mill Lane sit between stop five and stop seven, under a one-way light.”", "“The contractor works that site on Tuesdays, Thursdays and Fridays and leaves the light on green otherwise.”"], but: "“On those days the bus is standing room only by stop four.”" },
      { who: 3, ev: ["“The bridge lights switch to their crossing pattern on the three mornings the patrol is staffed.”", "“That pattern holds traffic for ninety seconds a cycle, and the bridge stands between stops six and seven.”"], but: "“Every passenger on a full bus takes longer to board, and the busy stops are four through eight.”" },
    ],
    clears: [
      "The driver: “The same driver works all five mornings, and his log shows the same stops in the same order.”",
      "The weather: “Rain has fallen on seven mornings this month, spread across all five days, and three of them ran on time.”",
    ],
    note:
      "Three different things now happen on Tuesday, Thursday and Friday and nothing else does. That is the trap: a pattern that matches is not a cause, and here three causes match equally well. The crowding is the only one that also explains why the bus is full by stop four, and that is the argument to listen for.",
  },
  12: {
    story:
      "The county cup in the cabinet has gone almost black, and two other details have been noticed separately. Only the side facing the back of the cabinet is black, and the front is still bright. And the engraved brass plate screwed to the backing board behind it has dulled to brown. The cabinet was refitted in September with a new backing board of untreated oak. Fresh oak gives off faint acidic and sulphurous vapours for months as it seasons. The cup was polished in September and pushed back against that board before the wadding was wiped off. Polish left in contact with metal keeps working, and it darkens whatever face it is pressed against. The cabinet backs onto an outside north wall where the plaster reads damp on a meter. The two bright cups stand on a glass shelf directly above the heater vent. Air at the back of the cabinet is still, cold and wet, and brass browns in exactly that air. Nothing has been taken out of the locked cabinet since the final in May.",
    q: "What is blackening the cup? Pick one cause and prove it from the story.",
    why: [
      "an untreated oak board fitted behind it in September",
      "a cabinet locked since the final in May",
      "polish wadding left between the cup and the board",
      "a damp north wall behind, with the bright cups over a heater vent",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“The cabinet was refitted in September with a new backing board of untreated oak.”", "“Fresh oak gives off faint acidic and sulphurous vapours for months as it seasons.”"], but: "“The two bright cups stand on a glass shelf directly above the heater vent.”" },
      { who: 2, ev: ["“The cup was polished in September and pushed back against that board before the wadding was wiped off.”", "“Polish left in contact with metal keeps working, and it darkens whatever face it is pressed against.”"], but: "“The engraved brass plate screwed to the backing board behind it has dulled to brown.”" },
      { who: 3, ev: ["“The cabinet backs onto an outside north wall where the plaster reads damp on a meter.”", "“Air at the back of the cabinet is still, cold and wet, and brass browns in exactly that air.”"], but: "“Fresh oak gives off faint acidic and sulphurous vapours for months as it seasons.”" },
    ],
    clears: [
      "Handling: “Nothing has been taken out of the locked cabinet since the final in May.”",
    ],
    note:
      "The bright cups used to rule damp out. Putting them over a heater vent explains why they are bright without saying the cabinet is dry, which is the move the whole debate turns on. The brass plate is the hard fact for the polish answer, because nobody polished a screwed-down plate.",
  },
  13: {
    story:
      "The turkey came out of the oven wrong in three ways at once. The breast was dry and stringy. The thigh, cut to the bone, was still pink and cool. And the skin was pale and slack after four hours, with no browning anywhere. It also took ninety minutes longer than the recipe allowed. The turkey was moved from the freezer to the fridge on the morning of the day before. A bird that size needs three days in a fridge to thaw to the bone. The oven thermostat was found sixty degrees low when the engineer tested it in January. The potatoes that came out crisp were on the top shelf, directly under the grill element. The bird was basted every twenty minutes from a jug of cold stock, and the tin was refilled each time. A tin of liquid steams all through roasting, and a steamy oven browns nothing. Stock poured over a breast washes the fat off it and leaves the meat stringy. The bird weighs six kilograms, and the recipe gives its times per kilogram. The door stayed shut from the start until the last twenty minutes.",
    q: "What went wrong with the turkey? Choose one cause and quote the text.",
    why: [
      "out of the freezer only the morning before, needing three days",
      "a thermostat the engineer found sixty degrees low",
      "six kilograms, with a recipe written per kilogram",
      "a door shut until the last twenty minutes",
      "basted every twenty minutes from a jug of cold stock",
    ],
    open: [0, 1, 4],
    for: [
      { who: 0, ev: ["“The turkey was moved from the freezer to the fridge on the morning of the day before.”", "“A bird that size needs three days in a fridge to thaw to the bone.”"], but: "“The oven thermostat was found sixty degrees low when the engineer tested it in January.”" },
      { who: 1, ev: ["“The oven thermostat was found sixty degrees low when the engineer tested it in January.”", "“The potatoes that came out crisp were on the top shelf, directly under the grill element.”"], but: "“The breast was dry and stringy.”" },
      { who: 4, ev: ["“The bird was basted every twenty minutes from a jug of cold stock, and the tin was refilled each time.”", "“A tin of liquid steams all through roasting, and a steamy oven browns nothing.”"], but: "“The thigh, cut to the bone, was still pink and cool.”" },
    ],
    clears: [
      "A bird too large: “The bird weighs six kilograms, and the recipe gives its times per kilogram.”",
      "The oven door: “The door stayed shut from the start until the last twenty minutes.”",
    ],
    note:
      "The potatoes used to prove the oven was fine. Moving them under the grill element explains their crispness without clearing the thermostat, and the basting answer now reaches dryness, paleness and the extra ninety minutes on its own. Only the frozen centre explains a cold thigh beside a dry breast, and that is the case to make.",
  },
  14: {
    story:
      "Every cupcake in the batch of twenty-four failed, and the failure had three parts. They climbed over the rims of their cases in the first ten minutes. They then sank into craters before the timer went. And they carry a bitter, soapy aftertaste that nobody can place. The baker doubled the recipe and measured the raising agent with a tablespoon instead of a teaspoon. That is three times the baking powder the doubled recipe asks for, and the surplus tastes of soap. The tray was turned at nine minutes, with the door held open while the second tray went in. A cake pushed up by gas and not yet set falls the moment the heat drops. The flour tub was refilled last week from a sack of self-raising rather than plain. Self-raising flour carries its own raising agent, which this recipe then adds to. Batter lifted twice over climbs fast, runs out of structure and drops into a crater. The eggs were bought on Saturday and all twelve sank flat in a bowl of water. The oven was heated for thirty minutes and its own probe read a true one hundred and eighty.",
    q: "What ruined the cupcakes? Pick one cause and prove it from the text.",
    why: [
      "a tablespoon used where the recipe asked for a teaspoon",
      "the door held open at nine minutes while the second tray went in",
      "twelve eggs bought Saturday, every one sinking flat in water",
      "a flour tub refilled from a sack of self-raising",
      "an oven preheated thirty minutes, probe reading true",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The baker doubled the recipe and measured the raising agent with a tablespoon instead of a teaspoon.”", "“That is three times the baking powder the doubled recipe asks for, and the surplus tastes of soap.”"], but: "“Self-raising flour carries its own raising agent, which this recipe then adds to.”" },
      { who: 1, ev: ["“The tray was turned at nine minutes, with the door held open while the second tray went in.”", "“A cake pushed up by gas and not yet set falls the moment the heat drops.”"], but: "“And they carry a bitter, soapy aftertaste that nobody can place.”" },
      { who: 3, ev: ["“The flour tub was refilled last week from a sack of self-raising rather than plain.”", "“Self-raising flour carries its own raising agent, which this recipe then adds to.”"], but: "“That is three times the baking powder the doubled recipe asks for, and the surplus tastes of soap.”" },
    ],
    clears: [
      "Old eggs: “The eggs were bought on Saturday and all twelve sank flat in a bowl of water.”",
      "A cold oven: “The oven was heated for thirty minutes and its own probe read a true one hundred and eighty.”",
    ],
    note:
      "The flour and the tablespoon are the same fault twice, and a good group will say so and then argue about which one did more. The door at nine minutes explains the crater beautifully and the soapy taste not at all, which is how a student learns that the best explanation of one symptom can still be the wrong answer.",
  },
  15: {
    story:
      "Six pairs of mittens came out of the lost property wash stiff, thick and two sizes smaller. Two other facts about that load have been mentioned and set aside. Only the wool pairs shrank, and the four acrylic pairs came through unharmed. And the eleven wool pairs hung on the drying rack are the size they always were. The shrunken six went into the tumble dryer on the hot cycle. Wool fibres are covered in tiny scales that hook together when heat and tumbling act at once. The same six were washed at ninety degrees, while the acrylic pairs were run cool the day before. Wool felts in hot water on its own, which is why the label asks for thirty. The detergent tub was changed in November to a biological powder. The enzymes in a biological powder attack the protein in wool and leave the fibre dense and short. Acrylic is a plastic thread with no protein and no scales for anything to catch on. The laundry radiator has not worked since the October boiler fault, and the room runs cold. The box was unpacked pair by pair onto a clean table, with nothing stacked on it.",
    q: "What shrank the mittens? Choose one cause and quote the story.",
    why: [
      "a hot tumble cycle, which the other wool pairs missed",
      "a ninety degree wash, where the acrylic went through cool",
      "a tub changed in November to a biological powder",
      "a radiator dead since the October boiler fault",
      "a box unpacked pair by pair onto a clean table",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The shrunken six went into the tumble dryer on the hot cycle.”", "“Wool fibres are covered in tiny scales that hook together when heat and tumbling act at once.”"], but: "“The same six were washed at ninety degrees, while the acrylic pairs were run cool the day before.”" },
      { who: 1, ev: ["“The same six were washed at ninety degrees, while the acrylic pairs were run cool the day before.”", "“Wool felts in hot water on its own, which is why the label asks for thirty.”"], but: "“And the eleven wool pairs hung on the drying rack are the size they always were.”" },
      { who: 2, ev: ["“The detergent tub was changed in November to a biological powder.”", "“The enzymes in a biological powder attack the protein in wool and leave the fibre dense and short.”"], but: "“And the eleven wool pairs hung on the drying rack are the size they always were.”" },
    ],
    clears: [
      "The radiator: “The laundry radiator has not worked since the October boiler fault, and the room runs cold.”",
      "Rough handling: “The box was unpacked pair by pair onto a clean table, with nothing stacked on it.”",
    ],
    note:
      "Everything here separates wool from acrylic, so that fact no longer picks a winner. The eleven rack-dried pairs do: they went through the same water and the same powder and came out fine. Whether that settles it depends on whether a reader notices the story never quite says they were in the same load.",
  },
  16: {
    story:
      "The first tray of gingerbread men came out as nine joined blobs with no arms. Two other things about that tray have been reported as separate complaints. The tray came out slick with butter that had run out of the dough. And the second tray, cut from the very same bowl an hour later, held its shape perfectly. The oven had been on for an hour and the kitchen stood at twenty-six degrees. The first tray was cut and baked straight away, and the second sat in the fridge for forty minutes. The bowl was mixed in a hurry and the butter was never fully beaten into the flour. Loose butter rises to the top of a bowl, and the first tray was cut from the top. The oven was set to two hundred and twenty for the first tray and turned down to one eighty for the second. Butter melts and runs long before a hot oven can set the flour around it. The baking soda was opened on Monday and fizzes hard in vinegar. Both trays were lined with the same roll of baking paper.",
    q: "Why did only the first tray spread? Pick one cause and prove it.",
    why: [
      "cut and baked straight away in a kitchen at twenty-six degrees",
      "butter never fully beaten in, and the first tray cut from the top",
      "soda opened on Monday, fizzing hard in vinegar",
      "both trays lined from the same roll of paper",
      "set to two hundred and twenty for the first tray only",
    ],
    open: [0, 1, 4],
    for: [
      { who: 0, ev: ["“The oven had been on for an hour and the kitchen stood at twenty-six degrees.”", "“The first tray was cut and baked straight away, and the second sat in the fridge for forty minutes.”"], but: "“The oven was set to two hundred and twenty for the first tray and turned down to one eighty for the second.”" },
      { who: 1, ev: ["“The bowl was mixed in a hurry and the butter was never fully beaten into the flour.”", "“Loose butter rises to the top of a bowl, and the first tray was cut from the top.”"], but: "“The first tray was cut and baked straight away, and the second sat in the fridge for forty minutes.”" },
      { who: 4, ev: ["“The oven was set to two hundred and twenty for the first tray and turned down to one eighty for the second.”", "“Butter melts and runs long before a hot oven can set the flour around it.”"], but: "“The tray came out slick with butter that had run out of the dough.”" },
    ],
    clears: [
      "Tired baking soda: “The baking soda was opened on Monday and fizzes hard in vinegar.”",
      "An unlined tray: “Both trays were lined with the same roll of baking paper.”",
    ],
    note:
      "Three things changed between the first tray and the second, and only one of them can be the reason. That is the whole exercise: the same bowl is no longer a clean control once the dough was chilled, the top was skimmed off and the oven was turned down. Ask which change a student would undo first to test it.",
  },
  17: {
    story:
      "The display lights in the front window go dead whenever it rains and work again once the weather clears. Two more facts have been reported by different people on different days. The whole circuit trips at the fuse box at the same moment the lights go out. And the brass holder of the bulb closest to the window frame is crusted green. The window frame above that holder has a crack in its seal that lets rain run inside. Water bridging the two contacts in a holder carries current where it should not go. The socket feeding the string is mounted on the outside face of the reveal, below that crack. Its faceplate is loose on one screw and the plug sits half out of it. The timer switch was replaced in October and fitted inside the same window box. Rainwater collects in the bottom of that box to a depth of a centimetre. A fault to earth anywhere on the circuit is the one thing that trips a modern fuse box. Every bulb on the string lights normally the moment the circuit is reset. The corridor lights, the tills and the heating all run on through every one of these failures.",
    q: "Why do the lights die in the rain? Choose one and quote the story.",
    why: [
      "a cracked seal letting rain run down to that holder",
      "every bulb lighting normally the moment the circuit resets",
      "a faceplate loose on one screw, below the crack",
      "a timer fitted inside a box that collects a centimetre of water",
      "corridors, tills and heating all running on through each failure",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“The window frame above that holder has a crack in its seal that lets rain run inside.”", "“Water bridging the two contacts in a holder carries current where it should not go.”"], but: "“Rainwater collects in the bottom of that box to a depth of a centimetre.”" },
      { who: 2, ev: ["“The socket feeding the string is mounted on the outside face of the reveal, below that crack.”", "“Its faceplate is loose on one screw and the plug sits half out of it.”"], but: "“The brass holder of the bulb closest to the window frame is crusted green.”" },
      { who: 3, ev: ["“The timer switch was replaced in October and fitted inside the same window box.”", "“Rainwater collects in the bottom of that box to a depth of a centimetre.”"], but: "“The brass holder of the bulb closest to the window frame is crusted green.”" },
    ],
    clears: [
      "A blown bulb: “Every bulb on the string lights normally the moment the circuit is reset.”",
      "A shortage of power: “The corridor lights, the tills and the heating all run on through every one of these failures.”",
    ],
    note:
      "Three places on one circuit now get wet, and any of them trips a fuse box the same way. The green brass is the only fact that points at one of them, because corrosion takes weeks and says where water has been sitting. A student who argues from the green rather than from the trip has found the slower, better evidence.",
  },
  18: {
    story:
      "The pendulum clock in the entrance hall loses about four minutes a day, and the loss is not steady. Two other observations sit in the caretaker's book without comment. The clock keeps near perfect time through the cold months and slips badly in warm weather. And the left side of its wooden case, the side nearest the wall, is warm by the afternoon. The old radiator in the hall was replaced in April with a much larger one, standing against the wall behind the clock. A pendulum is timed by its length, and brass expands when it is heated. A rod hanging its weight lower swings more slowly, and a slow swing loses minutes. The mainspring was found with a set in it at the service two years ago. A tired spring only shows itself when friction elsewhere is low, which is in warm weather when the oil has thinned. The pivots were last cleaned eleven years ago and the oil there has gone to a grey paste. Paste of that kind stiffens in the cold and smears in the heat, and a smeared pivot drags. The case was levelled with a spirit level in June and the beat sounds even. The chime train was disconnected in 2019 and the hammers lifted off.",
    q: "Why does the clock lose time? Pick one cause and prove it from the book.",
    why: [
      "a much larger radiator fitted in April against the wall behind it",
      "a mainspring found with a set in it two years ago",
      "pivots uncleaned for eleven years, the oil gone to paste",
      "a case levelled in June, with an even beat",
      "a chime train disconnected in 2019",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The old radiator in the hall was replaced in April with a much larger one, standing against the wall behind the clock.”", "“A pendulum is timed by its length, and brass expands when it is heated.”"], but: "“Paste of that kind stiffens in the cold and smears in the heat, and a smeared pivot drags.”" },
      { who: 1, ev: ["“The mainspring was found with a set in it at the service two years ago.”", "“A tired spring only shows itself when friction elsewhere is low, which is in warm weather when the oil has thinned.”"], but: "“The clock keeps near perfect time through the cold months and slips badly in warm weather.”" },
      { who: 2, ev: ["“The pivots were last cleaned eleven years ago and the oil there has gone to a grey paste.”", "“Paste of that kind stiffens in the cold and smears in the heat, and a smeared pivot drags.”"], but: "“A rod hanging its weight lower swings more slowly, and a slow swing loses minutes.”" },
    ],
    clears: [
      "Hanging off level: “The case was levelled with a spirit level in June and the beat sounds even.”",
      "A weak chime spring: “The chime train was disconnected in 2019 and the hammers lifted off.”",
    ],
    note:
      "Dust and a tired spring used to fail because they do not know what month it is. Giving the oil a temperature and the spring a friction threshold makes both of them seasonal, which is the hardest thing to argue against. The warm side of the case is the fact that still belongs to the radiator alone.",
  },
  19: {
    story:
      "Two bare stripes have melted through the snow on the school roof while the rest of it lies thick. Two other facts belong with them and have been treated as separate problems. Long icicles hang from the gutter directly below those two stripes and nowhere else. And rooms fourteen and fifteen, which sit under them, are the two coldest rooms in the building. The loft insulation was lifted between two pairs of rafters in October and never put back. Warm room air now reaches the roof slates directly in those two gaps. The boiler flue was rerouted in the same month and now runs flat through the loft before leaving at the far end. An uninsulated flue gives off heat along every metre it crosses, and it crosses those two bays. Two hot water branches leave the main run in the loft and cross to rooms fourteen and fifteen. Both branches lost their lagging when the insulation was lifted, and both lie directly under a stripe. Heat escaping into a loft melts the snow above it and leaves the rest alone. The water then runs to the cold gutter beyond the warm patch and freezes there. The roof faces north and has had no direct sun since the snow fell. The snow fell evenly and lay to the same depth everywhere on the first night.",
    q: "What is melting the two stripes? Pick one cause and prove it from the text.",
    why: [
      "insulation lifted between two pairs of rafters and never replaced",
      "a north roof with no direct sun since the snow fell",
      "a flue rerouted flat through the loft, across those two bays",
      "two unlagged hot water branches running to rooms fourteen and fifteen",
      "snow that lay to the same depth everywhere on the first night",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“The loft insulation was lifted between two pairs of rafters in October and never put back.”", "“Warm room air now reaches the roof slates directly in those two gaps.”"], but: "“An uninsulated flue gives off heat along every metre it crosses, and it crosses those two bays.”" },
      { who: 2, ev: ["“The boiler flue was rerouted in the same month and now runs flat through the loft before leaving at the far end.”", "“An uninsulated flue gives off heat along every metre it crosses, and it crosses those two bays.”"], but: "“And rooms fourteen and fifteen, which sit under them, are the two coldest rooms in the building.”" },
      { who: 3, ev: ["“Two hot water branches leave the main run in the loft and cross to rooms fourteen and fifteen.”", "“Both branches lost their lagging when the insulation was lifted, and both lie directly under a stripe.”"], but: "“Warm room air now reaches the roof slates directly in those two gaps.”" },
    ],
    clears: [
      "The sun: “The roof faces north and has had no direct sun since the snow fell.”",
      "Uneven snowfall: “The snow fell evenly and lay to the same depth everywhere on the first night.”",
    ],
    note:
      "Three heat sources now sit in the same two bays, because one October job disturbed all three. The cold rooms are the fact that separates them: a flue loses heat the rooms never had, while the gaps and the pipes lose heat that belonged to those rooms. Whether that is enough to choose between the gaps and the pipes is the real argument.",
  },
  20: {
    story:
      "The bird feeder by the field empties every night, and two further details have been noticed without being joined. There are no sunflower husks on the ground beneath it, though the grass below the old feeder was always carpeted with them. And the greased pole has four sets of long scratch lines running up it. The grease on the pole was put there in November and has been scratched through since. Something with claws has been climbing a pole it was meant to slide down, and lifting a lid that birds cannot work. The caretaker switched in November to a hulled sunflower mix with the husks already taken off. A bird eating hulled seed has nothing to drop, so a busy feeder leaves a clean floor. The feeder hangs on the exposed field corner, where the wind funnels between the hall and the fence. Its lid has been found turned a quarter round on four of the last five mornings. A lid turned off its catch lets seed pour out of the top on its own. The chain it hangs by swings against the pole in any wind and drags its links down the grease. The ground beneath is bare earth with no whole seed anywhere on it. The caretaker fills it on Monday mornings and has not been near it since.",
    q: "What is emptying the feeder? Choose one and quote the story.",
    why: [
      "claws through the grease and a lid that birds cannot work",
      "a hulled mix, switched in November, that leaves nothing to drop",
      "bare earth beneath with no whole seed anywhere on it",
      "a Monday fill and nobody near it since",
      "an exposed corner and a lid found turned four mornings in five",
    ],
    open: [0, 1, 4],
    for: [
      { who: 0, ev: ["“The grease on the pole was put there in November and has been scratched through since.”", "“Something with claws has been climbing a pole it was meant to slide down, and lifting a lid that birds cannot work.”"], but: "“The chain it hangs by swings against the pole in any wind and drags its links down the grease.”" },
      { who: 1, ev: ["“The caretaker switched in November to a hulled sunflower mix with the husks already taken off.”", "“A bird eating hulled seed has nothing to drop, so a busy feeder leaves a clean floor.”"], but: "“The bird feeder by the field empties every night”" },
      { who: 4, ev: ["“The feeder hangs on the exposed field corner, where the wind funnels between the hall and the fence.”", "“Its lid has been found turned a quarter round on four of the last five mornings.”"], but: "“The ground beneath is bare earth with no whole seed anywhere on it.”" },
    ],
    clears: [
      "A spill: “The ground beneath is bare earth with no whole seed anywhere on it.”",
      "The caretaker: “The caretaker fills it on Monday mornings and has not been near it since.”",
    ],
    note:
      "The missing husks used to prove it was not birds. A hulled mix explains them away in one sentence, and November gives the chain a reason to scratch grease. Note that the wind answer and the bird answer both leave seed somewhere, and the ground is bare: that is the sentence to make a class account for.",
  },
  21: {
    story:
      "The cocoa from the machine in the staff room is barely warm, and two other complaints are pinned to the wall beside it. It tastes thin and pale, as if it had been made with half the powder. And the drip tray underneath, which used to be emptied on Fridays, now fills by Wednesday. The water valve was replaced in January with one from a different model. It passes almost twice the water per cup that the old one did. A cup sized for the old dose overflows into the tray every time. The heating element was descaled in January and refitted with a thermostat from the spares drawer. An element running below its setting leaves half the powder undissolved at the bottom of the cup. The powder chute has furred with damp since January and no longer clears in one go. A jammed chute holds the dosing arm down, and the arm holds the water valve open while it tries again. Heat added at a fixed rate is spread thinner the more water a cup is given. The powder tub was opened on Monday and its date runs to next August. The cups come sealed in sleeves of fifty and are never handled before use.",
    q: "Why is the cocoa thin and cool? Pick one cause and prove it from the text.",
    why: [
      "a January valve passing almost twice the water per cup",
      "a tub opened on Monday, dated to next August",
      "an element refitted with a thermostat from the spares drawer",
      "cups sealed in sleeves of fifty, never handled before use",
      "a furred chute that jams the dosing arm down",
    ],
    open: [0, 2, 4],
    for: [
      { who: 0, ev: ["“The water valve was replaced in January with one from a different model.”", "“It passes almost twice the water per cup that the old one did.”"], but: "“An element running below its setting leaves half the powder undissolved at the bottom of the cup.”" },
      { who: 2, ev: ["“The heating element was descaled in January and refitted with a thermostat from the spares drawer.”", "“An element running below its setting leaves half the powder undissolved at the bottom of the cup.”"], but: "“And the drip tray underneath, which used to be emptied on Fridays, now fills by Wednesday.”" },
      { who: 4, ev: ["“The powder chute has furred with damp since January and no longer clears in one go.”", "“A jammed chute holds the dosing arm down, and the arm holds the water valve open while it tries again.”"], but: "“It passes almost twice the water per cup that the old one did.”" },
    ],
    clears: [
      "Old powder: “The powder tub was opened on Monday and its date runs to next August.”",
      "Dirty cups: “The cups come sealed in sleeves of fifty and are never handled before use.”",
    ],
    note:
      "Everything in this machine was worked on in January, which is how real faults arrive and why one symptom rarely picks one cause. The chute answer is the one worth chasing: it reaches all three complaints by making the valve misbehave, so it is both a rival to the valve and an explanation of it.",
  },
  22: {
    story:
      "Every card that spent a night in the class postbox came out marked, and three things were wrong with them at once. The ink had feathered and smudged on the envelopes. The envelopes themselves had gone wavy along the bottom edge. And the inside of the box's metal base is freckled with new rust. The box stands on the cold windowsill with the window left on its latch all night. Warm room air meeting cold metal leaves water on every inside surface it touches. The nineteen boxed cards were all written at the back table with the new roller pens. The hand-delivered cards were written at the front table with the old ballpoints. Roller ink is water-based and spreads into any fibre that is even slightly damp. A bottle of squash went over on the shelf above the box on Thursday evening. It ran down the wall and in through the posting slot, which is the only opening the box has. Liquid entering a sealed metal box pools in the base and reaches every card standing in it. Both flaps and seals are firm, and no glue line on any of the nineteen has lifted. Each card was carried in by its writer and dropped straight through the slot.",
    q: "What marked the cards? Choose one cause and quote the story.",
    why: [
      "a cold metal box on a sill with the window latched open all night",
      "roller pens at the back table, ballpoints at the front",
      "flaps and seals firm, with no glue line lifted",
      "a squash bottle over on the shelf above, on Thursday evening",
      "each card carried in by its writer and dropped straight through",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The box stands on the cold windowsill with the window left on its latch all night.”", "“Warm room air meeting cold metal leaves water on every inside surface it touches.”"], but: "“A bottle of squash went over on the shelf above the box on Thursday evening.”" },
      { who: 1, ev: ["“The nineteen boxed cards were all written at the back table with the new roller pens.”", "“Roller ink is water-based and spreads into any fibre that is even slightly damp.”"], but: "“And the inside of the box's metal base is freckled with new rust.”" },
      { who: 3, ev: ["“A bottle of squash went over on the shelf above the box on Thursday evening.”", "“It ran down the wall and in through the posting slot, which is the only opening the box has.”"], but: "“Every card that spent a night in the class postbox came out marked”" },
    ],
    clears: [
      "Cheap glue: “Both flaps and seals are firm, and no glue line on any of the nineteen has lifted.”",
      "Handling: “Each card was carried in by its writer and dropped straight through the slot.”",
    ],
    note:
      "The pens answer is the trap worth setting, because it is true and insufficient at the same time. Water-based ink explains the feathering perfectly and explains the rust not at all, so a group that chooses it has to argue that two causes are at work. That is a legitimate answer, and it should be marked as one.",
  },
  23: {
    story:
      "The model volcano at the science fair gave a slow dribble instead of an eruption, and two more things were odd about it. The foam that did come out was pink rather than the deep red of every rehearsal. And a third of the liquid was still sitting in the bottle when the crowd moved on. The vinegar bottle was found three centimetres fuller than it was left after the rehearsal. Somebody topped it up from the tap to make it look untouched. Diluted vinegar carries less acid, so it makes less gas and thins the red colouring mixed into it. The tub carried to the hall was a second one, taken from the back of the cupboard and caked solid. The rehearsal an hour earlier was run from the open tub left on the bench. Caked bicarbonate dissolves slowly, so much of it never meets the acid at all. The scoop was levelled off twice over, and half of it was later found stuck inside the paper funnel. A reaction that runs out of one ingredient before the other leaves the other sitting in the bottle. The same bottle and the same neck were used at the rehearsal and at the fair. The hall thermometer and the classroom thermometer both read nineteen degrees all afternoon.",
    q: "Why did the volcano barely erupt? Pick one cause and prove it.",
    why: [
      "a vinegar bottle three centimetres fuller than it was left",
      "a second tub from the back of the cupboard, caked solid",
      "the same bottle and the same neck as the rehearsal",
      "two thermometers both reading nineteen degrees all afternoon",
      "half a scoop found stuck inside the paper funnel",
    ],
    open: [0, 1, 4],
    for: [
      { who: 0, ev: ["“The vinegar bottle was found three centimetres fuller than it was left after the rehearsal.”", "“Somebody topped it up from the tap to make it look untouched.”"], but: "“The scoop was levelled off twice over, and half of it was later found stuck inside the paper funnel.”" },
      { who: 1, ev: ["“The tub carried to the hall was a second one, taken from the back of the cupboard and caked solid.”", "“Caked bicarbonate dissolves slowly, so much of it never meets the acid at all.”"], but: "“The foam that did come out was pink rather than the deep red of every rehearsal.”" },
      { who: 4, ev: ["“The scoop was levelled off twice over, and half of it was later found stuck inside the paper funnel.”", "“A reaction that runs out of one ingredient before the other leaves the other sitting in the bottle.”"], but: "“Diluted vinegar carries less acid, so it makes less gas and thins the red colouring mixed into it.”" },
    ],
    clears: [
      "A narrow neck: “The same bottle and the same neck were used at the rehearsal and at the fair.”",
      "A cold room: “The hall thermometer and the classroom thermometer both read nineteen degrees all afternoon.”",
    ],
    note:
      "The pink foam is the only fact that separates these three, because a short measure of bicarbonate cannot dilute a colour and a caked tub cannot either. Watch for the group that says the leftover liquid proves too little bicarbonate, and ask them what the colour costs that answer.",
  },
  24: {
    story:
      "Half the paper crowns made in Tuesday's lesson had curled backwards into tubes within the hour. Two other facts were mentioned and set aside at the time. Every curled crown is one of the glued ones, and the stapled crowns are still flat. And each curled crown has turned slightly see-through in a band along the glued seam. The glue is the water-based stick from the art cupboard, spread along one face only. Paper swells where water soaks in and shrinks again as that water leaves. A sheet that shrinks on one side and not the other has nowhere to go but round. The glued crowns were laid along the windowsill over the radiator to dry. The stapled ones went straight into the drying tray on the far side of the room. Heat drives water out of one face far faster than it leaves the other. The twelve glued crowns were the painted ones, brushed on their inside face only. The stapled twelve were left bare because the paint ran out at the halfway point. Every crown was cut from the same sheet of three hundred gram card. Not one of the twenty-four has a crease, a fold line or a torn corner.",
    q: "Why did half the crowns curl? Choose one cause and quote the text.",
    why: [
      "a water-based stick spread along one face only",
      "the glued twelve laid over the radiator, the stapled twelve across the room",
      "all twenty-four cut from the same sheet of three hundred gram card",
      "paint brushed on the inside face of the glued twelve alone",
      "not one crease, fold line or torn corner on any of them",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The glue is the water-based stick from the art cupboard, spread along one face only.”", "“Paper swells where water soaks in and shrinks again as that water leaves.”"], but: "“The twelve glued crowns were the painted ones, brushed on their inside face only.”" },
      { who: 1, ev: ["“The glued crowns were laid along the windowsill over the radiator to dry.”", "“The stapled ones went straight into the drying tray on the far side of the room.”"], but: "“And each curled crown has turned slightly see-through in a band along the glued seam.”" },
      { who: 3, ev: ["“The twelve glued crowns were the painted ones, brushed on their inside face only.”", "“The stapled twelve were left bare because the paint ran out at the halfway point.”"], but: "“A sheet that shrinks on one side and not the other has nowhere to go but round.”" },
    ],
    clears: [
      "Thin card: “Every crown was cut from the same sheet of three hundred gram card.”",
      "Rough handling: “Not one of the twenty-four has a crease, a fold line or a torn corner.”",
    ],
    note:
      "Glued, painted and warmed are now the same twelve crowns, which is exactly the confound a real experiment runs into. Nothing in the text separates them, and the honest answer says so and names the test: glue twelve more, paint none of them, dry them in the tray.",
  },
  25: {
    story:
      "The hall piano is noticeably flat three weeks after every tuning, and two other facts have never been put beside that one. The drop is worst in the treble and barely noticeable in the bass. And two hairline cracks have opened along the grain of the soundboard since September. The hall is heated all day and the humidity gauge on the wall has read between twenty and twenty-six percent all winter. Wood gives up its moisture to dry air and shrinks as it goes, and dry wood splits along its grain. A shrinking soundboard flattens, which lets the strings above it slacken. The piano was moved here in July from the old hall, which was unheated and read sixty percent. An instrument that spent forty years at one humidity has been losing water ever since. The pinblock was found dry and shrunken when the tuner opened it in September. Every treble pin now turns under a finger, and a pin that turns lets its string slip. Treble strings are the shortest and the quickest to show any change at all. The tuner has worked on this piano for eleven years and his other pianos hold a year. The lid has been locked since September and only two staff have the key.",
    q: "Why will the piano not hold its tuning? Pick one cause and prove it.",
    why: [
      "a heated hall reading twenty to twenty-six percent all winter",
      "eleven years on this piano, and other pianos that hold a year",
      "a locked lid since September, with two keys in the building",
      "a July move from an unheated hall that read sixty percent",
      "a dry, shrunken pinblock with every treble pin turning",
    ],
    open: [0, 3, 4],
    for: [
      { who: 0, ev: ["“The hall is heated all day and the humidity gauge on the wall has read between twenty and twenty-six percent all winter.”", "“Wood gives up its moisture to dry air and shrinks as it goes, and dry wood splits along its grain.”"], but: "“An instrument that spent forty years at one humidity has been losing water ever since.”" },
      { who: 3, ev: ["“The piano was moved here in July from the old hall, which was unheated and read sixty percent.”", "“An instrument that spent forty years at one humidity has been losing water ever since.”"], but: "“A shrinking soundboard flattens, which lets the strings above it slacken.”" },
      { who: 4, ev: ["“The pinblock was found dry and shrunken when the tuner opened it in September.”", "“Every treble pin now turns under a finger, and a pin that turns lets its string slip.”"], but: "“And two hairline cracks have opened along the grain of the soundboard since September.”" },
    ],
    clears: [
      "The tuner: “The tuner has worked on this piano for eleven years and his other pianos hold a year.”",
      "Hard playing: “The lid has been locked since September and only two staff have the key.”",
    ],
    note:
      "The dry hall, the move and the pinblock are one physical story told from three places, and a class that notices that has understood the case better than one that picks a winner. Push them to say which is the cause and which are its effects, and whether the question even has a single right level.",
  },
  26: {
    story:
      "The kite climbs, hangs for a second and then swings hard to the left and hits the ground. It has done this eleven times in a row. Two other things are true and were taken for coincidence. The paper over the left half is a shade darker than the paper over the right. And the kite flew straight for two hours on Saturday, before it was left out on the grass overnight. Dew soaked the lower half of the kite as it lay on the grass. Damp paper and a damp wooden spar both hold water, and water has weight. The bridle knot slipped when the kite was dragged in off the grass on Sunday morning. Its left leg now measures two centimetres shorter than its right, which tips the whole frame that way. The tail lost half its length on Saturday evening and nobody replaced it. What is left of it is knotted to the left corner of the kite rather than to the centre. A tail pulling from one corner drags that corner down every time the kite loses speed. The breeze has held steady from the west at nine miles an hour all week. Both sides of the covering are intact, with no tear, hole or split seam anywhere.",
    q: "Why does the kite dive left? Choose one cause and quote the story.",
    why: [
      "a left half left lying on wet grass and still darker than the right",
      "a bridle knot that slipped, leaving the left leg two centimetres short",
      "a steady westerly at nine miles an hour all week",
      "half a tail, knotted to the left corner instead of the centre",
      "a covering intact on both sides, with no tear or split seam",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“Dew soaked the lower half of the kite as it lay on the grass.”", "“Damp paper and a damp wooden spar both hold water, and water has weight.”"], but: "“Its left leg now measures two centimetres shorter than its right, which tips the whole frame that way.”" },
      { who: 1, ev: ["“The bridle knot slipped when the kite was dragged in off the grass on Sunday morning.”", "“Its left leg now measures two centimetres shorter than its right, which tips the whole frame that way.”"], but: "“The paper over the left half is a shade darker than the paper over the right.”" },
      { who: 3, ev: ["“The tail lost half its length on Saturday evening and nobody replaced it.”", "“What is left of it is knotted to the left corner of the kite rather than to the centre.”"], but: "“And the kite flew straight for two hours on Saturday, before it was left out on the grass overnight.”" },
    ],
    clears: [
      "Gusty wind: “The breeze has held steady from the west at nine miles an hour all week.”",
      "A torn covering: “Both sides of the covering are intact, with no tear, hole or split seam anywhere.”",
    ],
    note:
      "Three faults all pull the same corner down, and all three date from the same weekend. The tail is the one with a timing problem, since it was already short on Saturday evening and the kite flew straight for two hours. Whether that clears it depends on when those two hours actually were, and the text does not say.",
  },
  27: {
    story:
      "The shamrock seedlings on the back shelf are in trouble in three ways at once. Every stem leans hard toward the door. The leaves have faded from deep green to a yellowish pale. And the compost is still soaking four days after watering, when it used to dry out in two. The sycamore outside the window came into full leaf in the third week of April. The shelf has had deep shade since, and the only bright thing in the room is the open door. A plant in poor light grows toward the brightest thing it can find and thins its colour. The Monday cup was swapped in April for the new can, which pours three times as much. Roots standing in water rot, and a rotted root cannot hold its stem upright. A stem with no strength left falls toward the only gap along the shelf, which is the door end. The back shelf stands against the outside wall, and the thermometer on it reads eleven degrees. Warm air from the corridor comes in through that same open door all morning. A cold plant works slowly, drinks almost nothing, and leaves its pot wet for days. The compost came from the same bag as the window trays, which are thriving. Every pot has been tipped out and checked, and no grub, worm or egg was found.",
    q: "What is wrong with the seedlings? Pick one cause and prove it from the text.",
    why: [
      "a sycamore in full leaf since April, putting the shelf in deep shade",
      "a Monday cup swapped in April for a can pouring three times as much",
      "the same bag of compost as the window trays, which are thriving",
      "eleven degrees on an outside wall, with warm air at the door",
      "every pot tipped out, with no grub, worm or egg found",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The sycamore outside the window came into full leaf in the third week of April.”", "“The shelf has had deep shade since, and the only bright thing in the room is the open door.”"], but: "“Warm air from the corridor comes in through that same open door all morning.”" },
      { who: 1, ev: ["“The Monday cup was swapped in April for the new can, which pours three times as much.”", "“Roots standing in water rot, and a rotted root cannot hold its stem upright.”"], but: "“The leaves have faded from deep green to a yellowish pale.”" },
      { who: 3, ev: ["“The back shelf stands against the outside wall, and the thermometer on it reads eleven degrees.”", "“Warm air from the corridor comes in through that same open door all morning.”"], but: "“A plant in poor light grows toward the brightest thing it can find and thins its colour.”" },
    ],
    clears: [
      "Poor compost: “The compost came from the same bag as the window trays, which are thriving.”",
      "A pest in the soil: “Every pot has been tipped out and checked, and no grub, worm or egg was found.”",
    ],
    note:
      "The open door is both the bright thing and the warm thing, so the lean points at two suspects at once and cannot tell them apart. The faded colour is what light explains and cold does not, and the wet compost is what cold explains at least as well. Ask which symptom a class is willing to call the most diagnostic, and why.",
  },
  28: {
    story:
      "A puddle the size of a table sits in the middle of the new playground, and it has not rained for nine days. Two further details have been noted in the site book and left there. A faint white ring has dried onto the tarmac around its edge. And the water in it is slightly warm to the hand, even first thing in the morning. A heating pipe runs under that corner of the playground from the boiler house. Water escaping from it arrives warm and keeps arriving whatever the weather does. The downpipe was rerouted in September into a soakaway that was never finished. It ends six metres away, under the new tarmac, and it drains the boiler house roof. That roof runs warm for an hour after every firing, and the water off it comes down warm. The tarmac over this corner has sunk four centimetres since the summer, which is the deepest hollow in the yard. The trench dug for the pipe was backfilled loose, and loose ground settles and lets groundwater rise. Mains and ground water both carry dissolved minerals, and a puddle that evaporates at its edges leaves a pale ring. The rain gauge by the fence has recorded nothing at all since the eleventh. No bottle has been allowed on the playground since the new rule in September.",
    q: "Where is the puddle coming from? Pick one source and prove it from the text.",
    why: [
      "a heating pipe running under that corner from the boiler house",
      "a rain gauge recording nothing at all since the eleventh",
      "a downpipe rerouted into an unfinished soakaway six metres away",
      "tarmac sunk four centimetres over a loosely backfilled trench",
      "no bottles on the playground since the September rule",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“A heating pipe runs under that corner of the playground from the boiler house.”", "“Water escaping from it arrives warm and keeps arriving whatever the weather does.”"], but: "“The tarmac over this corner has sunk four centimetres since the summer, which is the deepest hollow in the yard.”" },
      { who: 2, ev: ["“The downpipe was rerouted in September into a soakaway that was never finished.”", "“It ends six metres away, under the new tarmac, and it drains the boiler house roof.”"], but: "“The rain gauge by the fence has recorded nothing at all since the eleventh.”" },
      { who: 3, ev: ["“The tarmac over this corner has sunk four centimetres since the summer, which is the deepest hollow in the yard.”", "“The trench dug for the pipe was backfilled loose, and loose ground settles and lets groundwater rise.”"], but: "“And the water in it is slightly warm to the hand, even first thing in the morning.”" },
    ],
    clears: [
      "Rain: “The rain gauge by the fence has recorded nothing at all since the eleventh.”",
      "Spilled bottles: “No bottle has been allowed on the playground since the new rule in September.”",
    ],
    note:
      "Warmth used to belong to the heating pipe alone. A downpipe off a warm roof takes that away, and a hollow over the pipe trench gets warmth from below for free. The nine days without rain is the fact that hurts the downpipe answer, and a class should be asked to say so rather than let it slide.",
  },
  29: {
    story:
      "A strip about a metre wide runs across the school garden and nothing will grow on it. Two more things are true of that strip and of no other part of the plot. The soil in it is pale grey and sets into a crust after every watering. And even the weeds stop at its edge, though they are thick on both sides of it. The builders washed out the cement mixer on that line every evening last summer. Cement washings are strongly alkaline, and a test strip pushed into the soil there reads nine. Most garden plants take up nothing at that reading, however good the soil looks. The leaking joint in the sprinkler line sits over this strip and floods it every evening. Ground that never drains goes grey and airless, and roots drown in it. Tap water left to evaporate on a surface leaves its own pale crust behind. A trial pit found a band of hard hoggin thirty centimetres down, on the line of the old path. Roots that reach that band stop, and a metre-wide path is a metre-wide strip. The strip lies in full sun from ten in the morning until the wall shades the far bed. Not one leaf on the plot, inside the strip or outside it, has been chewed this year.",
    q: "Why will nothing grow on the strip? Choose one cause and quote the text.",
    why: [
      "a mixer washed out on that line every evening last summer",
      "full sun from ten until the wall shades the far bed",
      "no chewed leaf anywhere on the plot this year",
      "a sprinkler joint leaking over the strip every evening",
      "a band of hard hoggin thirty centimetres down, a metre wide",
    ],
    open: [0, 3, 4],
    for: [
      { who: 0, ev: ["“The builders washed out the cement mixer on that line every evening last summer.”", "“Cement washings are strongly alkaline, and a test strip pushed into the soil there reads nine.”"], but: "“A trial pit found a band of hard hoggin thirty centimetres down, on the line of the old path.”" },
      { who: 3, ev: ["“The leaking joint in the sprinkler line sits over this strip and floods it every evening.”", "“Ground that never drains goes grey and airless, and roots drown in it.”"], but: "“Most garden plants take up nothing at that reading, however good the soil looks.”" },
      { who: 4, ev: ["“A trial pit found a band of hard hoggin thirty centimetres down, on the line of the old path.”", "“Roots that reach that band stop, and a metre-wide path is a metre-wide strip.”"], but: "“The soil in it is pale grey and sets into a crust after every watering.”" },
    ],
    clears: [
      "Shade: “The strip lies in full sun from ten in the morning until the wall shades the far bed.”",
      "Slugs: “Not one leaf on the plot, inside the strip or outside it, has been chewed this year.”",
    ],
    note:
      "Three different things are a metre wide and in the same line, because the builders worked along the old path and the sprinkler was laid in the same trench. Grey soil and a crust now have three explanations, and the pH reading of nine is the only measurement in the case. Ask what the other two answers would need measured to match it.",
  },
  30: {
    story:
      "The school hens are laying eggs so thin that half of them crack in the collecting box. Two other changes have been written in the keepers' diary as separate worries. The birds have started breaking and eating their own eggs in the nest. And they spend part of every morning pecking at the old lime mortar between the bricks of the coop wall. The feed was changed in April to a cheaper brand without added shell grit. The grit hopper has stood empty since, because the old feed made it unnecessary. A hen with too little calcium lays a thin shell and goes looking for calcium anywhere she can find it. The coop lost half its roofing felt in the March gales and has not been patched. A hen spending her food on keeping warm has little left over for building a shell. Cold birds eat constantly and will try anything that tastes of mineral. The vet's droppings sample came back in May with a heavy worm burden in all four birds. Worms take calcium out of the gut before a hen can use any of it. All four hens are eighteen months old, which is the first year of a hen's best laying. No bird has joined or left this flock since the four of them arrived together last spring.",
    q: "Why are the shells so thin? Pick one cause and prove it from the diary.",
    why: [
      "a cheaper feed since April and a grit hopper standing empty",
      "eighteen months old, in the first year of best laying",
      "half the roofing felt gone since the March gales",
      "the same four birds since last spring, none joining or leaving",
      "a May sample showing a heavy worm burden in all four",
    ],
    open: [0, 2, 4],
    for: [
      { who: 0, ev: ["“The feed was changed in April to a cheaper brand without added shell grit.”", "“The grit hopper has stood empty since, because the old feed made it unnecessary.”"], but: "“Worms take calcium out of the gut before a hen can use any of it.”" },
      { who: 2, ev: ["“The coop lost half its roofing felt in the March gales and has not been patched.”", "“A hen spending her food on keeping warm has little left over for building a shell.”"], but: "“And they spend part of every morning pecking at the old lime mortar between the bricks of the coop wall.”" },
      { who: 4, ev: ["“The vet's droppings sample came back in May with a heavy worm burden in all four birds.”", "“Worms take calcium out of the gut before a hen can use any of it.”"], but: "“The feed was changed in April to a cheaper brand without added shell grit.”" },
    ],
    clears: [
      "The hens' age: “All four hens are eighteen months old, which is the first year of a hen's best laying.”",
      "A new bird: “No bird has joined or left this flock since the four of them arrived together last spring.”",
    ],
    note:
      "All three open answers end at the same place, which is a hen short of calcium, and they disagree about where the calcium went. That is a better argument than a wrong one, and the mortar pecking supports every one of them equally. The March roof is the only one that comes before April, and dates are what this case is really about.",
  },
  31: {
    story:
      "The paper recycling has been refused by the collectors three weeks running, and two other facts have gone in the log unconnected. The bin now takes two people to wheel out when one managed it all last year. And there is standing water four centimetres deep in the bottom of it. The bin lid has been propped open with a brick since the handle broke in February. Rain has gone straight in every week since, and a wheeled bin has no drain. Wet paper weighs several times what dry paper weighs, which is the whole difference in the wheeling. Monday's audit went one bag deep and stopped there. Nothing below that bag has been looked at since February, and a kitchen sack was seen going in during March. One sack of food waste in a load is enough for a mill to refuse the lot at the gate. Room six moved its paint-washing trays beside the bin in February. The soaked paper towels from those trays have gone in with the class paper every day since. A load that arrives wet and rotting is turned away whatever else is in it. The crew, the lorry and the contract are all the same ones as last year. The bin is the large size and has never once been filled to its lid.",
    q: "Why is the recycling being refused? Choose one cause and quote the log.",
    why: [
      "a lid propped open with a brick since February",
      "an audit that went one bag deep and stopped",
      "the same crew, lorry and contract as last year",
      "a bin of the large size, never once filled to its lid",
      "paint-washing trays moved beside the bin in February",
    ],
    open: [0, 1, 4],
    for: [
      { who: 0, ev: ["“The bin lid has been propped open with a brick since the handle broke in February.”", "“Rain has gone straight in every week since, and a wheeled bin has no drain.”"], but: "“The soaked paper towels from those trays have gone in with the class paper every day since.”" },
      { who: 1, ev: ["“Monday's audit went one bag deep and stopped there.”", "“Nothing below that bag has been looked at since February, and a kitchen sack was seen going in during March.”"], but: "“And there is standing water four centimetres deep in the bottom of it.”" },
      { who: 4, ev: ["“Room six moved its paint-washing trays beside the bin in February.”", "“The soaked paper towels from those trays have gone in with the class paper every day since.”"], but: "“Rain has gone straight in every week since, and a wheeled bin has no drain.”" },
    ],
    clears: [
      "A new collector: “The crew, the lorry and the contract are all the same ones as last year.”",
      "A bin too small: “The bin is the large size and has never once been filled to its lid.”",
    ],
    note:
      "An audit one bag deep is the sentence this case is built on. It is exactly how a real inspection goes wrong, and it turns a clean result into no result at all. Students who spot that the audit proves nothing about the bottom of the bin have learned more than the ones who pick the right answer.",
  },
  32: {
    story:
      "Every photograph taken on the school camera since the trip has a soft grey haze across the upper left corner. Two other facts were mentioned at the time and forgotten. The haze is almost invisible indoors and very strong whenever the camera points anywhere near the sun. And the camera bag smells of coconut, because a bottle of sun cream burst in it on the coach. A thin film of grease sits across one corner of the front element, where the burst bottle lay against it. Grease does not block light, it scatters it, which is why the mark is soft and grey. The same corner of that element carries a web of fine scratches from being wiped with a dry sleeve. A thousand small scratches scatter light exactly as a film does, and show only against a bright sky. The camera was dropped on the coach steps the same afternoon the bottle burst. Its lens barrel no longer seats square, and there is a gap at the upper left of the mount. Light entering a mount from outside washes the frame nearest that gap and needs a bright sun to do it. The sensor was cleaned and checked by the shop in the week after the trip. The strap has been clipped to the right-hand lug alone since the left clip was lost.",
    q: "What is hazing the corner? Pick one cause and prove it from the text.",
    why: [
      "a film of grease where the burst bottle lay against the lens",
      "a web of fine scratches in the same corner of the element",
      "a sensor cleaned and checked by the shop after the trip",
      "a strap clipped to the right-hand lug alone",
      "a barrel that no longer seats square, gapping at the upper left",
    ],
    open: [0, 1, 4],
    for: [
      { who: 0, ev: ["“A thin film of grease sits across one corner of the front element, where the burst bottle lay against it.”", "“Grease does not block light, it scatters it, which is why the mark is soft and grey.”"], but: "“The same corner of that element carries a web of fine scratches from being wiped with a dry sleeve.”" },
      { who: 1, ev: ["“The same corner of that element carries a web of fine scratches from being wiped with a dry sleeve.”", "“A thousand small scratches scatter light exactly as a film does, and show only against a bright sky.”"], but: "“And the camera bag smells of coconut, because a bottle of sun cream burst in it on the coach.”" },
      { who: 4, ev: ["“The camera was dropped on the coach steps the same afternoon the bottle burst.”", "“Its lens barrel no longer seats square, and there is a gap at the upper left of the mount.”"], but: "“Grease does not block light, it scatters it, which is why the mark is soft and grey.”" },
    ],
    clears: [
      "Dust on the sensor: “The sensor was cleaned and checked by the shop in the week after the trip.”",
      "The strap: “The strap has been clipped to the right-hand lug alone since the left clip was lost.”",
    ],
    note:
      "Wiping a greasy lens with a dry sleeve is what makes the scratches, so the two best answers are the same accident one step apart. The dropped barrel is the outsider and the hardest to rule out, because a light leak also brightens only against the sun. Ask what single test would separate all three, and listen for someone saying clean the lens.",
  },
  33: {
    story:
      "The six spider plants on the classroom bookcase have dry brown tips on every leaf. Two other things are true of those six and not of the four on the windowsill. A hard white crust has formed across the top of their compost. And their saucers have never been emptied, while the windowsill saucers are tipped out each Friday. A pot standing in its own drainage takes that water back up, salts and all. Salt gathers at the far end of a leaf, which is the tip, and burns it there. The bookcase stands directly over the new hot air vent, which blows all day in term time. The windowsill pots sit beside a window left ajar in every weather. Air dried by a vent pulls water out of a leaf faster than a root can replace it, and the tip goes first. The six bookcase pots are topped up from the watering can that lives on the shelf. The four sill pots are filled from a jug run fresh at the tap each time. Water standing a fortnight in a metal can picks up far more dissolved salt than fresh water carries. All ten pots are heavy, damp and draining when they are lifted. The bookcase faces the back wall and no direct sun reaches it at any hour.",
    q: "Why are the tips brown? Choose one cause and quote the story.",
    why: [
      "saucers never emptied, so each pot drinks its drainage back",
      "a hot air vent blowing under the bookcase all day",
      "ten pots all heavy, damp and draining when lifted",
      "a bookcase facing the back wall, out of any direct sun",
      "six pots topped up from a can that stands a fortnight",
    ],
    open: [0, 1, 4],
    for: [
      { who: 0, ev: ["“A pot standing in its own drainage takes that water back up, salts and all.”", "“Salt gathers at the far end of a leaf, which is the tip, and burns it there.”"], but: "“Air dried by a vent pulls water out of a leaf faster than a root can replace it, and the tip goes first.”" },
      { who: 1, ev: ["“The bookcase stands directly over the new hot air vent, which blows all day in term time.”", "“The windowsill pots sit beside a window left ajar in every weather.”"], but: "“A hard white crust has formed across the top of their compost.”" },
      { who: 4, ev: ["“The six bookcase pots are topped up from the watering can that lives on the shelf.”", "“Water standing a fortnight in a metal can picks up far more dissolved salt than fresh water carries.”"], but: "“And their saucers have never been emptied, while the windowsill saucers are tipped out each Friday.”" },
    ],
    clears: [
      "Too little water: “All ten pots are heavy, damp and draining when they are lifted.”",
      "Too much sun: “The bookcase faces the back wall and no direct sun reaches it at any hour.”",
    ],
    note:
      "Every open answer splits the six from the four, which is what made the saucers look decisive in the first place. Two of them put salt in the pot and one takes water out of the leaf, and both routes brown a tip. The crust is salt, and only the salt answers predict it, so the vent has to explain it or give way.",
  },
  34: {
    story:
      "Ice cream from the chest freezer in the kitchen is gritty with ice crystals however new the tub is. Two other facts have been mentioned to the caretaker and never followed up. There is a hard sheet of frost two centimetres thick across the underside of the lid. And the freezer's compressor now runs almost continuously instead of switching on and off. The rubber seal along the front edge has a notch cut out of it the width of a thumb. Warm damp air leaks in through that notch all day, and the cold leaks out the same way. The thermometer that reads minus nineteen hangs in the lid, in the warmest air in the box. The dial on the back was turned in September to its lowest number, which is its warmest setting. The freezer is stacked to the rim with flat trays laid straight across the cold air vent. Air that cannot circulate leaves the top of a freezer far warmer than the bottom. Water from warm air freezes on the first cold surface it meets, which is the lid. And ice cream that part thaws and refreezes grows the big crystals you can feel on the tongue. The tub opened on Friday was bought that same morning and had never been opened. The first spoonful out of every tub, from any brand, comes out smooth.",
    q: "Why is the ice cream gritty? Pick one cause and prove it from the text.",
    why: [
      "a thumb-wide notch cut out of the front seal",
      "a tub bought the same morning it was opened",
      "a smooth first spoonful, as every tub gives",
      "a dial turned in September to its warmest number",
      "flat trays stacked to the rim across the cold air vent",
    ],
    open: [0, 3, 4],
    for: [
      { who: 0, ev: ["“The rubber seal along the front edge has a notch cut out of it the width of a thumb.”", "“Warm damp air leaks in through that notch all day, and the cold leaks out the same way.”"], but: "“The dial on the back was turned in September to its lowest number, which is its warmest setting.”" },
      { who: 3, ev: ["“The thermometer that reads minus nineteen hangs in the lid, in the warmest air in the box.”", "“The dial on the back was turned in September to its lowest number, which is its warmest setting.”"], but: "“And the freezer's compressor now runs almost continuously instead of switching on and off.”" },
      { who: 4, ev: ["“The freezer is stacked to the rim with flat trays laid straight across the cold air vent.”", "“Air that cannot circulate leaves the top of a freezer far warmer than the bottom.”"], but: "“Warm damp air leaks in through that notch all day, and the cold leaks out the same way.”" },
    ],
    clears: [
      "An old tub: “The tub opened on Friday was bought that same morning and had never been opened.”",
      "A poor brand: “The first spoonful out of every tub, from any brand, comes out smooth.”",
    ],
    note:
      "Minus nineteen used to settle the setting. Hanging that thermometer in the lid turns a measurement into a question about where it was taken, which is the most useful habit this whole year of cases can leave behind. The continuous compressor is the fact the warm-dial answer cannot carry, and somebody should say so.",
  },
  35: {
    story:
      "Half the charity ribbons on the entrance noticeboard have faded from deep red to a washed-out pink. Two other facts about the board belong with that one. The faded ribbons are all on the left half, and the line between faded and unfaded is straight and sharp. And the backing paper under the left half has yellowed while the right half is still white. The high window over the door throws a hard-edged block of sunlight onto the left half every afternoon. Sunlight breaks down dye, which is fading, and it yellows paper, which is ageing. The left half was pinned from the first box of ribbons and the right half from a second box opened in January. The board was filled left to right, so the boxes meet in a straight line down the middle. Dye mixed in a bad batch goes pale on its own and takes the paper's brightener with it. The radiator runs the full width of the left half and stops at the door frame. Nothing warms the right half, which hangs over the doorway in the draught. Heat alone fades a dye slowly and yellows paper steadily, and it stops where the radiator stops. The entrance hall is dry, with no window above the board and no rain ever. Every ribbon was pinned once in October and not one has been touched since.",
    q: "Why did half the ribbons fade? Choose one cause and quote the text.",
    why: [
      "a hard-edged block of sunlight on the left half every afternoon",
      "a first box on the left, a second box opened in January on the right",
      "a hall with no window above the board and no rain ever",
      "a radiator the full width of the left half, stopping at the door frame",
      "ribbons pinned once in October and not touched since",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The high window over the door throws a hard-edged block of sunlight onto the left half every afternoon.”", "“Sunlight breaks down dye, which is fading, and it yellows paper, which is ageing.”"], but: "“The board was filled left to right, so the boxes meet in a straight line down the middle.”" },
      { who: 1, ev: ["“The left half was pinned from the first box of ribbons and the right half from a second box opened in January.”", "“The board was filled left to right, so the boxes meet in a straight line down the middle.”"], but: "“And the backing paper under the left half has yellowed while the right half is still white.”" },
      { who: 3, ev: ["“The radiator runs the full width of the left half and stops at the door frame.”", "“Nothing warms the right half, which hangs over the doorway in the draught.”"], but: "“the line between faded and unfaded is straight and sharp”" },
    ],
    clears: [
      "Rain: “The entrance hall is dry, with no window above the board and no rain ever.”",
      "Handling: “Every ribbon was pinned once in October and not one has been touched since.”",
    ],
    note:
      "A straight, sharp line is the signature of light, and the second box of ribbons now draws exactly the same line for a different reason. That is the whole trap: the boxes met in the middle because the board was filled left to right, not because anything physical happened there. The yellowed paper is what the dye answer has to buy, and the sentence it buys it with is a stretch.",
  },
  36: {
    story:
      "Forty balloons tied for the leavers' assembly were lying on the floor when the caretaker opened the hall at seven. Two other facts from that morning were noticed and nobody made anything of them. The dog bowl by the kitchen door had a skin of ice on it. And by half past eleven most of the balloons were floating again. The hall heating was off overnight and the room fell close to freezing. Gas shrinks as it cools, so each balloon held a smaller volume of helium by morning. A smaller balloon pushes aside less air, and it is the pushed-aside air that lifts it. Latex lets helium through its wall steadily, and these were filled on Wednesday for a Friday assembly. The site assistant signed the log at twenty past ten for topping up a cylinder in the hall. The ribbons were changed on Thursday evening for the wired satin kind from the craft room. Wired satin takes up damp from a cold night and can double its own weight by dawn. A ribbon drying through a warm morning gives that weight back as fast as it took it. The regulator's gauge logged every one of the forty at full pressure on Wednesday. Every one of the forty is still tight and smooth, with no wrinkle or soft patch anywhere.",
    q: "Why did the balloons come back up? Pick one cause and prove it.",
    why: [
      "a hall left close to freezing overnight, with ice on the dog bowl",
      "two days in latex, and a cylinder signed for at twenty past ten",
      "every one of the forty logged at full pressure on Wednesday",
      "wired satin ribbons fitted on Thursday evening",
      "forty balloons still tight and smooth, with no soft patch",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The hall heating was off overnight and the room fell close to freezing.”", "“Gas shrinks as it cools, so each balloon held a smaller volume of helium by morning.”"], but: "“The site assistant signed the log at twenty past ten for topping up a cylinder in the hall.”" },
      { who: 1, ev: ["“Latex lets helium through its wall steadily, and these were filled on Wednesday for a Friday assembly.”", "“The site assistant signed the log at twenty past ten for topping up a cylinder in the hall.”"], but: "“The dog bowl by the kitchen door had a skin of ice on it.”" },
      { who: 3, ev: ["“The ribbons were changed on Thursday evening for the wired satin kind from the craft room.”", "“Wired satin takes up damp from a cold night and can double its own weight by dawn.”"], but: "“A smaller balloon pushes aside less air, and it is the pushed-aside air that lifts it.”" },
    ],
    clears: [
      "Underfilled balloons: “The regulator's gauge logged every one of the forty at full pressure on Wednesday.”",
      "A puncture: “Every one of the forty is still tight and smooth, with no wrinkle or soft patch anywhere.”",
    ],
    note:
      "Everything that takes gas out of a balloon is permanent, which is why the solve version closes. Here a signed log puts a person in the hall at twenty past ten, and damp ribbon gives a second reversible route. The last case of grade 10 should end with the class arguing about whether a signature counts as evidence of what was done.",
  },
};
