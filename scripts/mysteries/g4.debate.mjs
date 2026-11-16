/**
 * Grade 4, the debate version of each case. See scripts/mysteries/g5.debate.mjs
 * for what these files are and what the gate holds them to.
 *
 * The short version: the ordinary case has one answer and rules the rest out.
 * This one tells the same story with the deciding line withheld and the
 * clearings replaced by evidence that cuts both ways, so three suspects can
 * each be argued for and none of them can be argued for without the text.
 *
 * Grade 4 is where this gets easier to write and harder to answer. The band
 * is seventy-eight to a hundred and twelve words, which is room enough to
 * give every suspect something real, and the solutions were already a fact
 * plus a rule rather than one obvious clue. Taking the rule out leaves three
 * facts and nothing to join them, which is exactly the argument.
 */
export const DEBATES = {
  1: {
    story:
      "Mr. Ruiz keeps the library's new books on a cart by the window. On Friday the whole top row was gone. The books turned up shelved neatly in the fiction aisle, in alphabetical order. Dev, the new helper, had been told to shelve returns. Mrs. Ames waxed that aisle Friday and lifted the books down to do it. She put them back where she thought they went. Ms. Patel's class came back from the gym at ten past one. Three of them were sent to the library to pick a book. Nobody signed anything out.",
    q: "What happened to the new books? Say who you think moved them and prove it.",
    why: [
      "told to shelve returns, and the books turned up shelved",
      "lifted every book down to wax, then put them back",
      "back from the gym at ten past one, with three sent to the library",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Dev, the new helper, had been told to shelve returns.”", "“The books turned up shelved neatly in the fiction aisle, in alphabetical order.”"], but: "“Mrs. Ames waxed that aisle Friday and lifted the books down to do it.”" },
      { who: 1, ev: ["“Mrs. Ames waxed that aisle Friday and lifted the books down to do it.”", "“She put them back where she thought they went.”"], but: "“The books turned up shelved neatly in the fiction aisle, in alphabetical order.”" },
      { who: 2, ev: ["“Ms. Patel's class came back from the gym at ten past one.”", "“Three of them were sent to the library to pick a book.”"], but: "“Nobody signed anything out.”" },
    ],
    clears: [],
    note:
      "Alphabetical order is the detail to hold the class to. It takes somebody who knows the system and is trying to be helpful, which fits Dev best and Mrs. Ames second. A student who picks the class has to explain why three children browsing would reshelve a whole row in order.",
  },
  2: {
    story:
      "Nina packed hot tomato soup in a thermos on Tuesday. At lunch the soup was cold. She filled hers from the pot before her mother turned the burner on. Her brother Theo had the same soup and his was still steaming. The two thermoses are the same model and the same colour. Nina's lid has a crack along the rim that she noticed last month. A cracked lid lets the heat straight out. Theo got to the counter first and both bags were open. Nobody wrote a name on either thermos.",
    q: "Why was Nina's soup cold? Pick one reason and back it from the story.",
    why: [
      "filled from the pot before the burner went on",
      "a cracked lid that lets the heat straight out",
      "first to the counter, with both bags open and no names",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“She filled hers from the pot before her mother turned the burner on.”", "“At lunch the soup was cold.”"], but: "“Nina's lid has a crack along the rim that she noticed last month.”" },
      { who: 1, ev: ["“Nina's lid has a crack along the rim that she noticed last month.”", "“A cracked lid lets the heat straight out.”"], but: "“Her brother Theo had the same soup and his was still steaming.”" },
      { who: 2, ev: ["“Theo got to the counter first and both bags were open.”", "“The two thermoses are the same model and the same colour.”"], but: "“She filled hers from the pot before her mother turned the burner on.”" },
    ],
    clears: [],
    note:
      "Two of these say the soup was never hot and one says it got cold on the way. Ask which one a thermometer at breakfast would have settled. The swap is the weakest and the most fun, and a student who argues it has to explain why Theo's soup was still steaming at lunch if he took the cracked one.",
  },
  3: {
    story:
      "Every Monday Mr. Dunn counted thirty sharpened pencils into the cup. By Friday there were thirty stubs. The sharpener's drawer was packed tight with shavings. Jonah sharpened his pencil eleven times on Wednesday, because he liked the sound. Four pencils were found in coat pockets at the end of the week. The cup sits at the edge of a shelf above the heating vent. Two stubs were swept up from under the vent on Thursday. Mr. Dunn never counts what comes back in.",
    q: "Where did the pencils go? Choose one answer and quote the story.",
    why: [
      "a drawer packed tight, and eleven sharpenings in a day",
      "four found in coat pockets at the end of the week",
      "a cup on a shelf edge, and two stubs under the vent",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The sharpener's drawer was packed tight with shavings.”", "“Jonah sharpened his pencil eleven times on Wednesday, because he liked the sound.”"], but: "“Four pencils were found in coat pockets at the end of the week.”" },
      { who: 1, ev: ["“Four pencils were found in coat pockets at the end of the week.”", "“Mr. Dunn never counts what comes back in.”"], but: "“By Friday there were thirty stubs.”" },
      { who: 2, ev: ["“The cup sits at the edge of a shelf above the heating vent.”", "“Two stubs were swept up from under the vent on Thursday.”"], but: "“The sharpener's drawer was packed tight with shavings.”" },
    ],
    clears: [],
    note:
      "There were thirty on Monday and thirty stubs on Friday, so nothing left the room and everything got shorter. That sentence is worth reading twice with the class. It makes the sharpener the strongest answer and it does not kill the others, because four in pockets and two under a vent are real pencils the count never missed.",
  },
  4: {
    story:
      "The fourth grade picked apples all morning and filled six crates. Back at school, crate four weighed much less than the others. Its lid said forty apples and it held twenty-two. A line of apples lay in the grass along the path from the bus. The bottom slat of crate four hangs loose on one nail. The guide wrote the counts from memory at the end of the morning. Two students were seen eating apples on the bus. Nobody checked a crate before it was loaded.",
    q: "Why was crate four so light? Make the case for one answer.",
    why: [
      "a bottom slat hanging on one nail, and apples along the path",
      "two seen eating on the bus, and no crate checked before loading",
      "counts written from memory at the end of the morning",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The bottom slat of crate four hangs loose on one nail.”", "“A line of apples lay in the grass along the path from the bus.”"], but: "“The guide wrote the counts from memory at the end of the morning.”" },
      { who: 1, ev: ["“Two students were seen eating apples on the bus.”", "“Nobody checked a crate before it was loaded.”"], but: "“A line of apples lay in the grass along the path from the bus.”" },
      { who: 2, ev: ["“The guide wrote the counts from memory at the end of the morning.”", "“Its lid said forty apples and it held twenty-two.”"], but: "“The bottom slat of crate four hangs loose on one nail.”" },
    ],
    clears: [],
    note:
      "Eighteen apples are missing and two students eating on a bus do not account for eighteen. Get the class to do that subtraction out loud. The guide's count is the quiet answer: if the lid was wrong from the start, nothing went missing at all, and the apples in the grass came from somewhere else.",
  },
  5: {
    story:
      "Omar's bike wobbled badly on the ride to school. The front wheel has a flat spot and two loose spokes. On Saturday he rode down the park stairs with his cousin, who filmed it. The video shows the front wheel landing first on every step. The front tire reads twelve pounds, where the side wall asks for forty. A soft tire lets the rim take the hit instead of the rubber. The front brake pad rubs the rim on one side only. Nothing else on the bike has changed.",
    q: "What bent Omar's front wheel? Argue for one cause.",
    why: [
      "the park stairs, with the front wheel landing first every time",
      "twelve pounds in a tire that asks for forty",
      "a front pad rubbing the rim on one side",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“On Saturday he rode down the park stairs with his cousin, who filmed it.”", "“The video shows the front wheel landing first on every step.”"], but: "“The front tire reads twelve pounds, where the side wall asks for forty.”" },
      { who: 1, ev: ["“The front tire reads twelve pounds, where the side wall asks for forty.”", "“A soft tire lets the rim take the hit instead of the rubber.”"], but: "“The front wheel has a flat spot and two loose spokes.”" },
      { who: 2, ev: ["“The front brake pad rubs the rim on one side only.”", "“Nothing else on the bike has changed.”"], but: "“The video shows the front wheel landing first on every step.”" },
    ],
    clears: [],
    note:
      "The tire and the stairs are not really rivals, and the better answers say so: a soft tire is why the stairs bent the wheel instead of bouncing off it. The brake is the odd one out, because a rubbing pad slows a wheel rather than bending one, and a student who spots that has used a rule the story never states.",
  },
  6: {
    story:
      "The class counted eight guppies on Friday and seven on Monday. No guppy floated at the top. The big angelfish was added two weeks earlier and has not been fed since Thursday. The care card says angelfish eat anything that fits in their mouths. The tank lid was pushed back two inches to fit the new heater cord. The floor behind the tank was swept by the cleaners on Saturday night. The filter was making a dry rattle on Friday afternoon. A guppy can be pulled into an intake that has lost its sponge.",
    q: "What happened to the eighth guppy? Pick one answer and prove it.",
    why: [
      "unfed since Thursday, and it eats whatever fits",
      "a lid pushed back two inches, and a floor swept on Saturday",
      "a dry rattle on Friday, and an intake that can pull a guppy in",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The big angelfish was added two weeks earlier and has not been fed since Thursday.”", "“The care card says angelfish eat anything that fits in their mouths.”"], but: "“The tank lid was pushed back two inches to fit the new heater cord.”" },
      { who: 1, ev: ["“The tank lid was pushed back two inches to fit the new heater cord.”", "“The floor behind the tank was swept by the cleaners on Saturday night.”"], but: "“No guppy floated at the top.”" },
      { who: 2, ev: ["“The filter was making a dry rattle on Friday afternoon.”", "“A guppy can be pulled into an intake that has lost its sponge.”"], but: "“The care card says angelfish eat anything that fits in their mouths.”" },
    ],
    clears: [],
    note:
      "Nobody looked behind the tank before the cleaners came, which is the detail that keeps the jumping answer alive. Ask what each suspect would have left behind and whether anyone checked: the angelfish leaves nothing, the floor leaves a dried guppy, the filter leaves one in the intake. Only the last two can still be tested.",
  },
  7: {
    story:
      "Every afternoon at two the wall behind the reading corner thumped four times. Outside, the basketball hoop stands against that same wall. At two o'clock the fifth grade has recess. Mr. Blake watched four students take turns shooting, and each miss hit the backboard. The hot water pipes run inside that wall and the boiler fires at two. A pipe knocks when hot water hits cold metal. The class upstairs moved its music lesson to two o'clock in October. Their drum kit sits above the reading corner.",
    q: "What made the wall thump? Choose one and back it up.",
    why: [
      "a hoop on that wall, and every miss hitting the backboard",
      "pipes in the wall, and a boiler that fires at two",
      "a music lesson moved to two, with a drum kit overhead",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Outside, the basketball hoop stands against that same wall.”", "“Mr. Blake watched four students take turns shooting, and each miss hit the backboard.”"], but: "“The hot water pipes run inside that wall and the boiler fires at two.”" },
      { who: 1, ev: ["“The hot water pipes run inside that wall and the boiler fires at two.”", "“A pipe knocks when hot water hits cold metal.”"], but: "“At two o'clock the fifth grade has recess.”" },
      { who: 2, ev: ["“The class upstairs moved its music lesson to two o'clock in October.”", "“Their drum kit sits above the reading corner.”"], but: "“Outside, the basketball hoop stands against that same wall.”" },
    ],
    clears: [],
    note:
      "Three things now happen at two o'clock, so the time has stopped being evidence. That is the lesson here and it is worth naming: a clue that fits everybody fits nobody. What still separates them is four thumps, and the class should ask which suspect makes exactly four and then stops.",
  },
  8: {
    story:
      "Two maples stand at the front of the school. In October the one by the road had lost every leaf. The one by the field still held most of its own. The road tree stands beside the bus lane, where the plows pile salt each winter. A soil test from the road tree came back high in salt. The hose reaches the field tree and stops four feet short of the road one. The road tree went in two springs after the field tree. A young tree drops its leaves sooner in a hard year.",
    q: "Why did the road maple lose its leaves first? Pick one and prove it.",
    why: [
      "beside the bus lane, with a soil test high in salt",
      "a hose that stops four feet short of it",
      "planted two springs later than the other",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The road tree stands beside the bus lane, where the plows pile salt each winter.”", "“A soil test from the road tree came back high in salt.”"], but: "“The hose reaches the field tree and stops four feet short of the road one.”" },
      { who: 1, ev: ["“The hose reaches the field tree and stops four feet short of the road one.”", "“In October the one by the road had lost every leaf.”"], but: "“A soil test from the road tree came back high in salt.”" },
      { who: 2, ev: ["“The road tree went in two springs after the field tree.”", "“A young tree drops its leaves sooner in a hard year.”"], but: "“The one by the field still held most of its own.”" },
    ],
    clears: [],
    note:
      "The soil test is the only measurement in the story and that counts for a lot. Say so, and then ask the harder question: a tree four feet past the end of a hose is also a thirsty tree, and thirst and salt do the same thing to a leaf. Nobody tested the field tree's soil either.",
  },
  9: {
    story:
      "The class pumpkin sat on the sill from October first. By Halloween it had caved in on one side. The caved side faced the glass, where the sun struck all afternoon. The radiator under the window came on for the first time that week. A second pumpkin in the cool hallway stayed firm. Three small tooth marks show near the stem on the caved side. The custodian moved the pumpkin twice to clean the sill. He set it down hard the second time, and the class heard it.",
    q: "Why did the pumpkin cave in on one side? Make the case for one cause.",
    why: [
      "the sunny side, with the radiator on for the first time",
      "three small tooth marks near the stem",
      "moved twice, and set down hard the second time",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The caved side faced the glass, where the sun struck all afternoon.”", "“The radiator under the window came on for the first time that week.”"], but: "“Three small tooth marks show near the stem on the caved side.”" },
      { who: 1, ev: ["“Three small tooth marks show near the stem on the caved side.”", "“A second pumpkin in the cool hallway stayed firm.”"], but: "“The radiator under the window came on for the first time that week.”" },
      { who: 2, ev: ["“The custodian moved the pumpkin twice to clean the sill.”", "“He set it down hard the second time, and the class heard it.”"], but: "“The caved side faced the glass, where the sun struck all afternoon.”" },
    ],
    clears: [],
    note:
      "The tooth marks and the sunny side are on the same side of the pumpkin, which means the case has handed the class a coincidence and will not say which came first. The hallway pumpkin is the control and it works for two answers at once: it was never warm and it was never moved.",
  },
  10: {
    story:
      "On Thursday a line of blue footprints crossed the gym floor. The art room opened a gallon of blue paint that morning. Mr. Shaw carried the open can to the kiln room through the gym. His boots have flat heels, and the prints show a flat heel. Coach Rivas keeps a second pair of flat-heeled shoes in his office. He crossed the gym twice that morning to fetch cones. The prints measure nine inches, which is a big fourth grader or a small adult. A blue handprint sits on the wall at a child's height.",
    q: "Who left the blue footprints? Charge one of them and prove it.",
    why: [
      "carried the open can through the gym, in flat-heeled boots",
      "a second pair of flat-heeled shoes, and two crossings that morning",
      "prints of nine inches, and a handprint at a child's height",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Mr. Shaw carried the open can to the kiln room through the gym.”", "“His boots have flat heels, and the prints show a flat heel.”"], but: "“A blue handprint sits on the wall at a child's height.”" },
      { who: 1, ev: ["“Coach Rivas keeps a second pair of flat-heeled shoes in his office.”", "“He crossed the gym twice that morning to fetch cones.”"], but: "“The art room opened a gallon of blue paint that morning.”" },
      { who: 2, ev: ["“The prints measure nine inches, which is a big fourth grader or a small adult.”", "“A blue handprint sits on the wall at a child's height.”"], but: "“His boots have flat heels, and the prints show a flat heel.”" },
    ],
    clears: [],
    note:
      "The heel used to tell the two adults apart and now it does not, because Coach Rivas turns out to own flat-heeled shoes as well. That is worth pointing at. Nine inches is the measurement that keeps the student in the case, and the handprint is the only evidence nobody can explain away.",
  },
  11: {
    story:
      "Bus 12 reached school at 8:40 every day this week instead of 8:20. On Monday the city closed the bridge on Oak Street for repair. The detour sends Bus 12 around three extra blocks and through two lights. Mr. Hahn timed the detour himself at nineteen minutes added. The depot's sheet shows Bus 12 pulling out at 7:12 on three mornings, not 7:05. Two new families joined the route in January, at two new stops. Each stop takes about a minute with the lift. Nobody has written down what time the bus reaches the first stop.",
    q: "Why is Bus 12 arriving late? Pick one reason and quote the story.",
    why: [
      "three extra blocks and two lights, timed at nineteen minutes",
      "pulling out at 7:12 on three mornings instead of 7:05",
      "two new stops in January, about a minute each with the lift",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The detour sends Bus 12 around three extra blocks and through two lights.”", "“Mr. Hahn timed the detour himself at nineteen minutes added.”"], but: "“The depot's sheet shows Bus 12 pulling out at 7:12 on three mornings, not 7:05.”" },
      { who: 1, ev: ["“The depot's sheet shows Bus 12 pulling out at 7:12 on three mornings, not 7:05.”", "“Nobody has written down what time the bus reaches the first stop.”"], but: "“Bus 12 reached school at 8:40 every day this week instead of 8:20.”" },
      { who: 2, ev: ["“Two new families joined the route in January, at two new stops.”", "“Each stop takes about a minute with the lift.”"], but: "“On Monday the city closed the bridge on Oak Street for repair.”" },
    ],
    clears: [],
    note:
      "This one is arithmetic and the class can do it. Twenty minutes are missing. The detour is nineteen, the late starts are seven on three days only, the new stops are two. Ask what each suspect adds up to against twenty, and which of them explains why the bus was late every single day.",
  },
  12: {
    story:
      "The chess trophy shone in September and looked brown by December. The case sits beside the pool door, which is propped open each morning. Air from the pool room carries chlorine. A silver spoon left by the same door turned brown in a month. The soccer trophy in the front hall is still bright. The case lock has been broken since October and the door swings open. The trophy was lifted out for photographs twice in November. Its base is bare metal under a thin coat that has worn through at the handles.",
    q: "Why did the chess trophy turn brown? Argue for one cause.",
    why: [
      "pool air carrying chlorine, and a spoon that browned in a month",
      "a broken lock since October, and two trips out for photographs",
      "a thin coat worn through at the handles, over bare metal",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Air from the pool room carries chlorine.”", "“A silver spoon left by the same door turned brown in a month.”"], but: "“The case lock has been broken since October and the door swings open.”" },
      { who: 1, ev: ["“The case lock has been broken since October and the door swings open.”", "“The trophy was lifted out for photographs twice in November.”"], but: "“The soccer trophy in the front hall is still bright.”" },
      { who: 2, ev: ["“Its base is bare metal under a thin coat that has worn through at the handles.”", "“The chess trophy shone in September and looked brown by December.”"], but: "“A silver spoon left by the same door turned brown in a month.”" },
    ],
    clears: [],
    note:
      "The spoon is a clean little experiment nobody set up on purpose: same door, same air, same result. The broken lock is the interesting objection, because a case that will not shut lets more pool air in as well as more hands. Ask whether the lock helps the chlorine answer rather than beating it.",
  },
  13: {
    story:
      "The fourth grade planned a Thanksgiving lunch for noon. The turkey came out of the oven at ten and was dry by twelve. Mrs. Kerr had set the dial to 425 by mistake. The oven light had been out for a month, so nobody checked the number. The rolls baked in the same oven burned on the bottoms. The bird went in at six, which is four hours before it came out. The recipe card in the folder says three hours, not four. It also says to cover the breast with foil, and nobody did.",
    q: "Why was the turkey dry? Pick one cause and prove it from the story.",
    why: [
      "a dial set to 425, and rolls burned on the bottoms",
      "in at six and out at ten, against a card that says three hours",
      "a card that says three hours and asks for foil nobody used",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Mrs. Kerr had set the dial to 425 by mistake.”", "“The rolls baked in the same oven burned on the bottoms.”"], but: "“The recipe card in the folder says three hours, not four.”" },
      { who: 1, ev: ["“The bird went in at six, which is four hours before it came out.”", "“The oven light had been out for a month, so nobody checked the number.”"], but: "“Mrs. Kerr had set the dial to 425 by mistake.”" },
      { who: 2, ev: ["“The recipe card in the folder says three hours, not four.”", "“It also says to cover the breast with foil, and nobody did.”"], but: "“The turkey came out of the oven at ten and was dry by twelve.”" },
    ],
    clears: [],
    note:
      "The burned rolls are the strongest evidence in the story because they were in the same oven and nothing about the recipe touched them. Hold the class to that. The other two answers have to explain why the rolls burned, and the honest ones admit that an hour too long at a hundred degrees too hot is the same mistake counted twice.",
  },
  14: {
    story:
      "Room 12 baked two dozen cupcakes for the class party. Every one came out flat and dense. The baking powder tin at the back of the cupboard expired in 2021. A test spoonful of it in water did not fizz. Ava measured the flour by scooping the cup straight into the bag. Scooping packs in about half as much flour again as the recipe wants. The oven door was opened three times in the first ten minutes. A cake that is jolted early can fall before it sets.",
    q: "Why were the cupcakes flat? Choose one cause and back it up.",
    who: [
      "",
      "🥣 Flour scooped from the bag",
      "🚪 The oven door",
    ],
    why: [
      "a tin that expired in 2021 and would not fizz",
      "flour scooped from the bag, packing in half as much again",
      "a door opened three times in the first ten minutes",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The baking powder tin at the back of the cupboard expired in 2021.”", "“A test spoonful of it in water did not fizz.”"], but: "“Ava measured the flour by scooping the cup straight into the bag.”" },
      { who: 1, ev: ["“Ava measured the flour by scooping the cup straight into the bag.”", "“Scooping packs in about half as much flour again as the recipe wants.”"], but: "“A test spoonful of it in water did not fizz.”" },
      { who: 2, ev: ["“The oven door was opened three times in the first ten minutes.”", "“A cake that is jolted early can fall before it sets.”"], but: "“Every one came out flat and dense.”" },
    ],
    clears: [],
    note:
      "The water test is as close to proof as this story gets, and a student who leads with it is doing the right thing. Push them on dense, though. Dead powder makes a cake flat; too much flour makes it heavy. The word dense is doing work that the powder alone cannot explain.",
  },
  15: {
    story:
      "Priya's wool mittens went on easily in November and will not go on in January. The mittens were soaked at recess and dried on the radiator. The care tag says to lay them flat and keep them away from heat. Wool fibers lock together and tighten when they are heated wet. The mittens are now a third smaller than they were. Priya has moved up two shoe sizes since September. Her gloves from the same drawer are a stretchy knit that gives with any hand. The mittens were a hand-me-down and had already been washed many times.",
    q: "Why will the mittens not go on? Argue for one cause.",
    who: [
      "",
      "",
      "👕 An old hand-me-down",
    ],
    why: [
      "soaked at recess and dried on a radiator the tag warns against",
      "two shoe sizes up since September, with stretchy gloves that still give",
      "a hand-me-down already washed many times",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The mittens were soaked at recess and dried on the radiator.”", "“Wool fibers lock together and tighten when they are heated wet.”"], but: "“Priya has moved up two shoe sizes since September.”" },
      { who: 1, ev: ["“Priya has moved up two shoe sizes since September.”", "“Her gloves from the same drawer are a stretchy knit that gives with any hand.”"], but: "“The mittens are now a third smaller than they were.”" },
      { who: 2, ev: ["“The mittens were a hand-me-down and had already been washed many times.”", "“The care tag says to lay them flat and keep them away from heat.”"], but: "“Priya's wool mittens went on easily in November and will not go on in January.”" },
    ],
    clears: [],
    note:
      "The gloves used to prove Priya's hands had not grown and now they prove nothing, because a stretchy knit fits a hand of any size. That is the move worth naming. A third smaller is the fact that still decides it: hands do not grow by a third in two months, but wool does shrink by that much.",
  },
  16: {
    story:
      "The gingerbread house stood up on Monday and fell in on Wednesday. The class used royal icing on the walls and canned frosting on the roof. Royal icing dries hard like cement, and canned frosting stays soft. The roof pieces slid apart along the frosting seam. The room had been warm all week with the heat on. A second house, iced entirely with royal icing, has lost two candies from its roof. The roof slabs on the fallen house are the two biggest pieces in the kit. Nobody weighed anything before they built it.",
    q: "Why did the roof fall in? Pick one cause and prove it.",
    who: [
      "",
      "🌡️ The warm room",
      "🧱 The weight of the roof slabs",
    ],
    why: [
      "canned frosting that stays soft, and a seam that slid apart",
      "a warm room all week, and a second house losing candies",
      "the two biggest slabs in the kit, never weighed",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Royal icing dries hard like cement, and canned frosting stays soft.”", "“The roof pieces slid apart along the frosting seam.”"], but: "“The room had been warm all week with the heat on.”" },
      { who: 1, ev: ["“The room had been warm all week with the heat on.”", "“A second house, iced entirely with royal icing, has lost two candies from its roof.”"], but: "“The roof pieces slid apart along the frosting seam.”" },
      { who: 2, ev: ["“The roof slabs on the fallen house are the two biggest pieces in the kit.”", "“Nobody weighed anything before they built it.”"], but: "“Royal icing dries hard like cement, and canned frosting stays soft.”" },
    ],
    clears: [],
    note:
      "The second house used to be a clean control and now it is slipping too, which means the warm room is doing something to everybody. The seam is still the best single piece of evidence, because it says exactly where the house let go. Ask whether warm frosting and soft frosting are really two different answers.",
  },
  17: {
    story:
      "Half of the hallway light strand went dark on Monday morning. The other half is still lit. Mr. Cole pulled each bulb from the dark half and tested it. One bulb in the middle had a broken filament. The lights on this strand are wired in series, so one gap stops everything after it. The dark half starts exactly at that bulb. The strand joins a second strand at a plug halfway along, right by that bulb. The plug is loose enough to turn in its socket. The dark half is the half plugged into the second strand.",
    q: "Why did half the strand go dark? Make the case for one cause.",
    who: [
      "",
      "",
      "🔗 The series wiring",
    ],
    why: [
      "a broken filament where the dark half begins",
      "a loose plug joining the two strands, right at that point",
      "a series wiring that stops everything after one gap",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“One bulb in the middle had a broken filament.”", "“The dark half starts exactly at that bulb.”"], but: "“The plug is loose enough to turn in its socket.”" },
      { who: 1, ev: ["“The strand joins a second strand at a plug halfway along, right by that bulb.”", "“The plug is loose enough to turn in its socket.”"], but: "“One bulb in the middle had a broken filament.”" },
      { who: 2, ev: ["“The lights on this strand are wired in series, so one gap stops everything after it.”", "“The dark half is the half plugged into the second strand.”"], but: "“The other half is still lit.”" },
    ],
    clears: [],
    note:
      "The broken bulb and the loose plug are in the same place, which is why this case will not resolve itself. Both would darken everything after them and the story cannot say which came first. The useful question is what one test would separate them, and the class should get to swapping the bulb and leaving the plug alone.",
  },
  18: {
    story:
      "The classroom clock lost eleven minutes between Monday and Friday. The clock hangs directly above the radiator, which ran all week. Mr. Ellis moved a second clock to the same spot on Tuesday. By Friday that one had lost nine minutes too. The paper tag inside says the clock is rated for cool rooms only. Both clocks take the same batteries from the same drawer, bought last spring. A cold battery and a hot battery both push less current than a fresh one. The second hand on each clock jerks twice before it moves on.",
    q: "Why did the clock lose time? Choose one cause and quote the story.",
    why: [
      "hung over a radiator that ran all week, and rated for cool rooms",
      "the same drawer batteries, bought last spring, in both clocks",
      "a second hand that jerks twice before it moves on",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The clock hangs directly above the radiator, which ran all week.”", "“The paper tag inside says the clock is rated for cool rooms only.”"], but: "“Both clocks take the same batteries from the same drawer, bought last spring.”" },
      { who: 1, ev: ["“Both clocks take the same batteries from the same drawer, bought last spring.”", "“A cold battery and a hot battery both push less current than a fresh one.”"], but: "“Mr. Ellis moved a second clock to the same spot on Tuesday.”" },
      { who: 2, ev: ["“The second hand on each clock jerks twice before it moves on.”", "“By Friday that one had lost nine minutes too.”"], but: "“The paper tag inside says the clock is rated for cool rooms only.”" },
    ],
    clears: [],
    note:
      "The second clock is the experiment and it is a good one, but it shares a battery drawer with the first, so it tests the place and the batteries at the same time. That is the flaw to find. Ask what the test would have to look like to separate them, and the class will design a better one than the story did.",
  },
  19: {
    story:
      "The class rolled three balls for a snowman on Monday and stacked them even. By Thursday the bottom ball had slumped to one side. The snowman stands on the south side of the building. The sun hits that wall from noon until three. A puddle froze on the sunny side each night and melted again each day. The shaded side never dripped at all. The rope around the yard was down on Tuesday for the gritting truck. Fresh boot prints circle the snowman on the slumped side. The bottom ball was rolled last, when the snow had gone sticky and wet.",
    q: "Why did the snowman slump? Pick one cause and prove it.",
    why: [
      "a south wall in sun from noon, with a side that melts and refreezes",
      "a rope down on Tuesday, and fresh boot prints on the slumped side",
      "a bottom ball rolled last, when the snow had gone sticky and wet",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The sun hits that wall from noon until three.”", "“A puddle froze on the sunny side each night and melted again each day.”"], but: "“Fresh boot prints circle the snowman on the slumped side.”" },
      { who: 1, ev: ["“The rope around the yard was down on Tuesday for the gritting truck.”", "“Fresh boot prints circle the snowman on the slumped side.”"], but: "“The shaded side never dripped at all.”" },
      { who: 2, ev: ["“The bottom ball was rolled last, when the snow had gone sticky and wet.”", "“By Thursday the bottom ball had slumped to one side.”"], but: "“The sun hits that wall from noon until three.”" },
    ],
    clears: [],
    note:
      "The boot prints are on the slumped side, and so is the sun, so the case has put two suspects in the same place on purpose. The shaded side is the fact that does the most work: it never dripped and it never slumped, and nobody walked there either. Make the class say which of those two facts they are leaning on.",
  },
  20: {
    story:
      "The bird feeder emptied in two days instead of two weeks. The feeder hangs from a branch two feet from the trunk. Scratches run down the pole and along the branch above the feeder. A squirrel can jump four feet from a standing start. The base of the feeder has a crack where the two halves meet. A thin trail of seed runs from under the feeder into the long grass. The class switched to a finer mix in October that pours faster. Nobody has looked at the feeder between four o'clock and morning.",
    q: "Why did the feeder empty so fast? Argue for one cause.",
    why: [
      "scratches on the branch, and a jump of four feet",
      "a crack where the two halves meet, and a seed trail into the grass",
      "a finer mix since October that pours faster",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Scratches run down the pole and along the branch above the feeder.”", "“A squirrel can jump four feet from a standing start.”"], but: "“The base of the feeder has a crack where the two halves meet.”" },
      { who: 1, ev: ["“The base of the feeder has a crack where the two halves meet.”", "“A thin trail of seed runs from under the feeder into the long grass.”"], but: "“Scratches run down the pole and along the branch above the feeder.”" },
      { who: 2, ev: ["“The class switched to a finer mix in October that pours faster.”", "“Nobody has looked at the feeder between four o'clock and morning.”"], but: "“The bird feeder emptied in two days instead of two weeks.”" },
    ],
    clears: [],
    note:
      "The seed trail is the piece that changes everything, because the old story said no seed lay on the ground. Now some does. Ask how much a crack can spill in two days against what a squirrel can carry, and whether a finer mix would run through a crack faster than a coarse one. Two of these answers may be one answer.",
  },
  21: {
    story:
      "The cocoa at the winter party was gritty at the bottom of every cup. The recipe says to stir the powder into a little hot milk first. Room 8 poured all the cold milk in at once and stirred twice. Cocoa powder does not dissolve in cold liquid. Room 9 followed the recipe and had grit in four of its twenty cups. The tin Room 8 used had been open on the shelf since last winter. Damp powder goes lumpy and the lumps do not break up. Nobody sieved the powder in either room.",
    q: "Why was the cocoa gritty? Choose one cause and back it from the text.",
    who: [
      "",
      "",
      "🥄 Nobody sieving",
    ],
    why: [
      "cold milk poured in at once, and powder that will not dissolve cold",
      "a tin open since last winter, going lumpy with damp",
      "nobody sieving in either room, and grit in Room 9 too",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Room 8 poured all the cold milk in at once and stirred twice.”", "“Cocoa powder does not dissolve in cold liquid.”"], but: "“Room 9 followed the recipe and had grit in four of its twenty cups.”" },
      { who: 1, ev: ["“The tin Room 8 used had been open on the shelf since last winter.”", "“Damp powder goes lumpy and the lumps do not break up.”"], but: "“The recipe says to stir the powder into a little hot milk first.”" },
      { who: 2, ev: ["“Nobody sieved the powder in either room.”", "“Room 9 followed the recipe and had grit in four of its twenty cups.”"], but: "“Cocoa powder does not dissolve in cold liquid.”" },
    ],
    clears: [],
    note:
      "Room 9 is the control and it has stopped being clean: four of its twenty cups were gritty too. That means the method cannot be the whole answer. Get the class to compare every cup in Room 8 against four in twenty, and to notice that two things can both be true and one can still be bigger.",
  },
  22: {
    story:
      "Twenty valentines went into the class mailbox and came out with torn corners. The mailbox is a cardboard box with a slot cut in the lid. The slot is three inches wide and most of the envelopes are four inches across. Jamal pushed his through and the corner caught on the cardboard. Ms. Reyes had taped the slot edges, but the tape had peeled back. The box was carried down two flights of stairs and dropped once. Each tear is at a corner, and every one of them points the same way. A gnawed hole the size of a thumb sits low on the back of the box.",
    q: "What tore the valentines? Pick one cause and prove it.",
    who: [
      "",
      "📦 The box carried and dropped",
      "",
    ],
    why: [
      "a three-inch slot for four-inch envelopes, with the tape peeled back",
      "carried down two flights and dropped once",
      "a gnawed hole the size of a thumb, low on the back",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The slot is three inches wide and most of the envelopes are four inches across.”", "“Jamal pushed his through and the corner caught on the cardboard.”"], but: "“A gnawed hole the size of a thumb sits low on the back of the box.”" },
      { who: 1, ev: ["“The box was carried down two flights of stairs and dropped once.”", "“Ms. Reyes had taped the slot edges, but the tape had peeled back.”"], but: "“Each tear is at a corner, and every one of them points the same way.”" },
      { who: 2, ev: ["“A gnawed hole the size of a thumb sits low on the back of the box.”", "“Twenty valentines went into the class mailbox and came out with torn corners.”"], but: "“The slot is three inches wide and most of the envelopes are four inches across.”" },
    ],
    clears: [],
    note:
      "All the tears facing the same way is the fact that should decide this, and it is the one students walk past. Something that happens the same way twenty times in a row is a shape, not an accident. Ask what a mouse would leave and what a drop would leave, and whether either of them repeats exactly.",
  },
  23: {
    story:
      "The science fair volcano fizzed at home and did nothing on stage. The vinegar bottle on stage had been open since the last fair. Vinegar loses its strength once the bottle stays open. A fresh bottle made the model erupt over the table. The stage hall was eleven degrees colder than Mia's kitchen. A cold mixture reacts more slowly than a warm one. The baking soda box on stage had been left open beside a kettle. Damp baking soda gives off its gas early and has less left to give.",
    q: "Why did the volcano do nothing on stage? Make the case for one cause.",
    who: [
      "",
      "🥶 The colder hall",
      "🥄 Damp baking soda",
    ],
    why: [
      "a bottle open since the last fair, and a fresh one that erupted",
      "a hall eleven degrees colder than the kitchen",
      "a box left open beside a kettle, giving its gas off early",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The vinegar bottle on stage had been open since the last fair.”", "“A fresh bottle made the model erupt over the table.”"], but: "“The baking soda box on stage had been left open beside a kettle.”" },
      { who: 1, ev: ["“The stage hall was eleven degrees colder than Mia's kitchen.”", "“A cold mixture reacts more slowly than a warm one.”"], but: "“A fresh bottle made the model erupt over the table.”" },
      { who: 2, ev: ["“The baking soda box on stage had been left open beside a kettle.”", "“Damp baking soda gives off its gas early and has less left to give.”"], but: "“The science fair volcano fizzed at home and did nothing on stage.”" },
    ],
    clears: [],
    note:
      "The fresh bottle is nearly an experiment: same stage, same cold, same box, new vinegar, and it worked. That single sentence beats the cold hall and most of the baking soda argument. A student who finds it and says why it beats the others has done the whole job, whichever suspect they name.",
  },
  24: {
    story:
      "The paper crown for the play sat straight at dress rehearsal and tipped on opening night. Two bobby pins are all that hold the crown on. On opening night Eli wore it over his costume wig. The wig is an inch thicker than his own hair. The pins no longer reached his hair at all. One pin was found bent flat in the costume box after the show. The crown was stored under three other hats and came out with a soft dent in the band. A dented band sits unevenly however it is pinned.",
    q: "Why did the crown tip? Choose one cause and quote the story.",
    who: [
      "",
      "📌 A pin bent flat",
      "👑 A dent in the band",
    ],
    why: [
      "a wig an inch thicker, so the pins reached no hair",
      "one pin found bent flat in the costume box",
      "a soft dent in the band from being stored under three hats",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The wig is an inch thicker than his own hair.”", "“The pins no longer reached his hair at all.”"], but: "“One pin was found bent flat in the costume box after the show.”" },
      { who: 1, ev: ["“One pin was found bent flat in the costume box after the show.”", "“Two bobby pins are all that hold the crown on.”"], but: "“On opening night Eli wore it over his costume wig.”" },
      { who: 2, ev: ["“The crown was stored under three other hats and came out with a soft dent in the band.”", "“A dented band sits unevenly however it is pinned.”"], but: "“The paper crown for the play sat straight at dress rehearsal and tipped on opening night.”" },
    ],
    clears: [],
    note:
      "Two bobby pins used to clear the pins and now one of them is bent flat, which could be a cause or could be what a tipping crown does to a pin. The class should notice they cannot tell which. The wig is the only thing that changed between the two nights, and that is the argument to beat.",
  },
  25: {
    story:
      "The music room piano held its notes all year and stopped on Monday. Mr. Okafor looked underneath and found the pedal rod resting beside its slot. The piano was rolled across the room on Friday for the concert. A rod can shake loose when a piano is moved. A music stand fell against the pedal during the concert and nobody picked it up until after. Three keys in the middle sound thin and will not ring on. The felt on the dampers is worn down to the cloth on those three. Nothing was written in the room log all week.",
    q: "Why did the piano stop holding its notes? Pick one cause and prove it.",
    who: [
      "",
      "",
      "🎹 Worn damper felt",
    ],
    why: [
      "found resting beside its slot after the piano was rolled",
      "a music stand that fell against the pedal during the concert",
      "three middle keys sounding thin, with felt worn to the cloth",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Mr. Okafor looked underneath and found the pedal rod resting beside its slot.”", "“A rod can shake loose when a piano is moved.”"], but: "“A music stand fell against the pedal during the concert and nobody picked it up until after.”" },
      { who: 1, ev: ["“A music stand fell against the pedal during the concert and nobody picked it up until after.”", "“The piano was rolled across the room on Friday for the concert.”"], but: "“A rod can shake loose when a piano is moved.”" },
      { who: 2, ev: ["“Three keys in the middle sound thin and will not ring on.”", "“The felt on the dampers is worn down to the cloth on those three.”"], but: "“The music room piano held its notes all year and stopped on Monday.”" },
    ],
    clears: [],
    note:
      "The rod is out of its slot and that is a fact, but nothing in the story says what knocked it out, and two candidates happened on the same Friday. Worn felt is the odd one, because it takes years and the problem arrived on Monday. A student who argues the felt has to explain the date, and a student who ignores the date has not argued at all.",
  },
  26: {
    story:
      "Maya's kite flew well in March and dove straight down in April. In April she tied on a shorter tail to make it look neater. A kite's tail keeps the nose pointed up into the wind. Her friend's kite, with its full tail, flew fine beside hers. The March flight was on the open field and the April one was behind the sports hall. Wind coming over a building breaks up into gusts that drop a kite. One of Maya's bridle strings has a knot that slipped an inch. An uneven bridle tips the kite before the wind even takes it.",
    q: "Why did the kite dive? Make the case for one cause.",
    who: [
      "",
      "🏢 The sports hall wind",
      "🪢 A slipped bridle knot",
    ],
    why: [
      "a shorter tail, where a tail keeps the nose up",
      "flown behind the sports hall, where wind breaks into gusts",
      "a bridle knot slipped an inch, tipping the kite",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“In April she tied on a shorter tail to make it look neater.”", "“A kite's tail keeps the nose pointed up into the wind.”"], but: "“The March flight was on the open field and the April one was behind the sports hall.”" },
      { who: 1, ev: ["“The March flight was on the open field and the April one was behind the sports hall.”", "“Wind coming over a building breaks up into gusts that drop a kite.”"], but: "“Her friend's kite, with its full tail, flew fine beside hers.”" },
      { who: 2, ev: ["“One of Maya's bridle strings has a knot that slipped an inch.”", "“An uneven bridle tips the kite before the wind even takes it.”"], but: "“Maya's kite flew well in March and dove straight down in April.”" },
    ],
    clears: [],
    note:
      "The friend's kite is the best evidence in the story because it flew in the same April wind in the same place. That beats the building and leaves the tail and the bridle, both of which are on Maya's kite and not on her friend's. Ask which of the two changed in April, because only one of them did.",
  },
  27: {
    story:
      "Room 9 grew shamrocks on two windowsills, sowing one packet across both. The south window plants are pale and drooping. The north window plants are green. The south sill sits above the heater vent, which has run since February. A thermometer on the south sill reads eighty-four degrees. The packet says shamrocks want a cool room. The soil in the south pot was dry an hour after watering. The south pot is a thin plastic one and the north pot is clay. The south window gets six hours of direct sun and the north window gets none.",
    q: "Why are the south plants drooping? Choose one cause and quote the story.",
    who: [
      "",
      "☀️ Six hours of direct sun",
      "🪴 A thin plastic pot",
    ],
    why: [
      "a sill at eighty-four degrees, over a vent, for a plant wanting cool",
      "six hours of direct sun against none at the north window",
      "a thin plastic pot that was dry an hour after watering",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The south sill sits above the heater vent, which has run since February.”", "“A thermometer on the south sill reads eighty-four degrees.”"], but: "“The south window gets six hours of direct sun and the north window gets none.”" },
      { who: 1, ev: ["“The south window gets six hours of direct sun and the north window gets none.”", "“The packet says shamrocks want a cool room.”"], but: "“The south sill sits above the heater vent, which has run since February.”" },
      { who: 2, ev: ["“The south pot is a thin plastic one and the north pot is clay.”", "“The soil in the south pot was dry an hour after watering.”"], but: "“The north window plants are green.”" },
    ],
    clears: [],
    note:
      "Every difference in this story is on the south side, so pointing at the south side is not an answer by itself. The thermometer is the only number and it covers the vent and the sun together. The dry soil is the fact worth chasing: it tells you the plants were thirsty, and it does not tell you why.",
  },
  28: {
    story:
      "A puddle appears outside the art room every Tuesday and never on other days. On Tuesdays the kiln runs all morning in the room next door. A kiln pushes damp air out through a vent above the art room door. The puddle sits directly under that vent. Mr. Shaw taped a paper towel to the vent and it was soaked by noon. The floor is mopped every Tuesday morning by the early cleaner. A mop leaves water in a low spot, and that corner is the lowest in the hall. The drinking fountain was fixed in September and now runs on Tuesdays and Thursdays only.",
    q: "Where does the Tuesday puddle come from? Argue for one cause.",
    who: [
      "",
      "🧹 The Tuesday mop",
      "",
    ],
    why: [
      "a kiln that runs Tuesdays, venting over the door above the puddle",
      "a mop every Tuesday morning, and the lowest corner in the hall",
      "a fountain running Tuesdays and Thursdays since September",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A kiln pushes damp air out through a vent above the art room door.”", "“Mr. Shaw taped a paper towel to the vent and it was soaked by noon.”"], but: "“The floor is mopped every Tuesday morning by the early cleaner.”" },
      { who: 1, ev: ["“The floor is mopped every Tuesday morning by the early cleaner.”", "“A mop leaves water in a low spot, and that corner is the lowest in the hall.”"], but: "“The puddle sits directly under that vent.”" },
      { who: 2, ev: ["“The drinking fountain was fixed in September and now runs on Tuesdays and Thursdays only.”", "“A puddle appears outside the art room every Tuesday and never on other days.”"], but: "“Mr. Shaw taped a paper towel to the vent and it was soaked by noon.”" },
    ],
    clears: [],
    note:
      "The fountain argument fails on a day of the week and the class should find it: the fountain runs Thursdays too, and there is never a Thursday puddle. That is a clean piece of reasoning from a single word. The mop and the kiln both happen on Tuesday mornings and the story will not separate them.",
  },
  29: {
    story:
      "The school garden grew twelve sunflowers and nine lost their heads overnight. Each stalk ends in a clean angled cut rather than a tear. Deer tracks run along the outside of the fence and stop there. A deer can reach over a four-foot fence without jumping it. The nine that lost their heads all stood within arm's reach of the fence. The gate was found unlatched on the morning the heads went. A pair of garden shears was left out on the bed all week. Shears cut a stalk clean at an angle, which is also how a deer's teeth leave one.",
    q: "What took the sunflower heads? Pick one and prove it from the story.",
    who: [
      "",
      "🚪 The unlatched gate",
      "✂️ The shears left out",
    ],
    why: [
      "tracks outside the fence, and only the flowers within reach lost heads",
      "a gate found unlatched on the morning the heads went",
      "shears left out all week, which cut clean at an angle",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Deer tracks run along the outside of the fence and stop there.”", "“The nine that lost their heads all stood within arm's reach of the fence.”"], but: "“The gate was found unlatched on the morning the heads went.”" },
      { who: 1, ev: ["“The gate was found unlatched on the morning the heads went.”", "“A deer can reach over a four-foot fence without jumping it.”"], but: "“The nine that lost their heads all stood within arm's reach of the fence.”" },
      { who: 2, ev: ["“A pair of garden shears was left out on the bed all week.”", "“Shears cut a stalk clean at an angle, which is also how a deer's teeth leave one.”"], but: "“Deer tracks run along the outside of the fence and stop there.”" },
    ],
    clears: [],
    note:
      "The clean angled cut used to rule out everything but a deer, and the story now says shears leave the same cut. Once a clue fits two suspects it stops choosing between them. What still chooses is which flowers were taken: nine within reach of the fence and three in the middle untouched. Anything that got through the gate could have reached all twelve.",
  },
  30: {
    story:
      "A robin built a nest on the school ledge and sat on four eggs for nine days. On the tenth morning the robin was gone and the four eggs were cold. The ledge is beside the gym door, which was propped open all week for painting. Workers walked past the nest about thirty times a day. Robins will abandon a nest that is disturbed too often. A magpie has been seen on the gym roof every morning since Monday. One egg is cracked along the side and still in the nest. The week had two nights at thirty-eight degrees, colder than the forecast said.",
    q: "Why did the robin leave the nest? Choose one cause and back it up.",
    why: [
      "a propped door and thirty passes a day, which robins abandon a nest for",
      "a magpie on the gym roof every morning, and one egg cracked",
      "two nights at thirty-eight degrees, colder than forecast",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The ledge is beside the gym door, which was propped open all week for painting.”", "“Workers walked past the nest about thirty times a day.”"], but: "“A magpie has been seen on the gym roof every morning since Monday.”" },
      { who: 1, ev: ["“A magpie has been seen on the gym roof every morning since Monday.”", "“One egg is cracked along the side and still in the nest.”"], but: "“Robins will abandon a nest that is disturbed too often.”" },
      { who: 2, ev: ["“The week had two nights at thirty-eight degrees, colder than the forecast said.”", "“On the tenth morning the robin was gone and the four eggs were cold.”"], but: "“A robin built a nest on the school ledge and sat on four eggs for nine days.”" },
    ],
    clears: [],
    note:
      "A sitting robin keeps her own eggs warm, so cold nights explain cold eggs only after she has gone. That is a cause and effect to untangle out loud. The cracked egg is the hardest fact: it points at the magpie, and a bird that left in a hurry could have done it herself.",
  },
  31: {
    story:
      "The playground is clean except for one corner by the back gate. Wrappers pile up there every week. The wind on this field blows steadily from the west. The back gate corner is the east fence line. Wind carries loose wrappers until a fence stops them. The back gate is where the bus queue forms at half past three. The only bin on this side is ninety feet away by the basketball court. Ms. Diaz emptied the corner on Monday and it had refilled by Friday. The corner is the only part of the playground a duty teacher cannot see.",
    q: "Why does litter pile in that corner? Make the case for one cause.",
    why: [
      "a west wind and an east fence line that stops what it carries",
      "where the bus queue forms, and the one corner no duty teacher sees",
      "a nearest bin ninety feet away",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The wind on this field blows steadily from the west.”", "“Wind carries loose wrappers until a fence stops them.”"], but: "“The back gate is where the bus queue forms at half past three.”" },
      { who: 1, ev: ["“The back gate is where the bus queue forms at half past three.”", "“The corner is the only part of the playground a duty teacher cannot see.”"], but: "“The back gate corner is the east fence line.”" },
      { who: 2, ev: ["“The only bin on this side is ninety feet away by the basketball court.”", "“Ms. Diaz emptied the corner on Monday and it had refilled by Friday.”"], but: "“Wind carries loose wrappers until a fence stops them.”" },
    ],
    clears: [],
    note:
      "The corner is now the windward fence line, the bus queue and the blind spot all at once, which is how real litter corners work. Ask the class for a test rather than a winner. Emptying it on a still weekend, or standing a duty teacher there for a week, would each rule out one suspect and cost nothing.",
  },
  32: {
    story:
      "The fourth grade took ninety photographs at the aquarium and eighty came out black. The ten that worked were all taken in the lobby. A sign at the tank room door asks visitors to turn the flash off. Dev had turned the flash off as the sign asked. The tank rooms are lit only by the tanks themselves. A camera needs either light in the room or a flash. The battery warning blinked twice on the way in and nobody read it. A camera that is low on power stops firing the sensor before it stops showing a picture. The lens had a thumbprint across one half from the bus.",
    q: "Why did eighty photographs come out black? Pick one cause and prove it.",
    why: [
      "no flash and rooms lit only by the tanks",
      "a battery warning that blinked twice on the way in",
      "a thumbprint across half the lens from the bus",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The tank rooms are lit only by the tanks themselves.”", "“A camera needs either light in the room or a flash.”"], but: "“The battery warning blinked twice on the way in and nobody read it.”" },
      { who: 1, ev: ["“The battery warning blinked twice on the way in and nobody read it.”", "“A camera that is low on power stops firing the sensor before it stops showing a picture.”"], but: "“The ten that worked were all taken in the lobby.”" },
      { who: 2, ev: ["“The lens had a thumbprint across one half from the bus.”", "“Dev had turned the flash off as the sign asked.”"], but: "“The fourth grade took ninety photographs at the aquarium and eighty came out black.”" },
    ],
    clears: [],
    note:
      "The ten that worked are the control and they were all in the lobby, which is the bright room. That fits the light answer and works against the battery, because a flat battery does not care which room you stand in. The thumbprint would blur half a picture rather than blacken a whole one, and a student who says so is reasoning from what each cause would look like.",
  },
  33: {
    story:
      "Two bean plants grew in identical cups on the same shelf. One stands straight and one leans hard to the left. The leaning plant sits two feet to the right of the window. Plants grow toward the strongest light they can reach. The leaning plant points directly at the window. The straight plant sits under the ceiling light, which is on all day. The leaning plant's stem is thinner than the other's and bends at a touch. The shelf tilts about a finger's width down toward the window end.",
    q: "Why does one bean plant lean? Argue for one cause.",
    who: [
      "",
      "🌱 A thin weak stem",
      "📐 A tilting shelf",
    ],
    why: [
      "two feet from the window, and pointing directly at it",
      "a thinner stem that bends at a touch",
      "a shelf tilting a finger's width toward the window end",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The leaning plant points directly at the window.”", "“Plants grow toward the strongest light they can reach.”"], but: "“The shelf tilts about a finger's width down toward the window end.”" },
      { who: 1, ev: ["“The leaning plant's stem is thinner than the other's and bends at a touch.”", "“The straight plant sits under the ceiling light, which is on all day.”"], but: "“The leaning plant points directly at the window.”" },
      { who: 2, ev: ["“The shelf tilts about a finger's width down toward the window end.”", "“Two bean plants grew in identical cups on the same shelf.”"], but: "“Plants grow toward the strongest light they can reach.”" },
    ],
    clears: [],
    note:
      "The tilt and the window are in the same direction, which the story does on purpose. The experiment that settled the old case is gone, so ask the class to invent it: turn the cup, or shim the shelf level, and see which way the plant goes next. One of those tests separates the three in four days.",
  },
  34: {
    story:
      "The fifth grade sold ice cream at the spring fair. The last twenty cups were soup. A thermometer inside the freezer read twenty-two degrees, which is above freezing for ice cream. The lid had been propped open with a scoop since noon so servers could work faster. Warm air pours into a freezer whenever the lid is open. Every cup served before noon came out solid, a hundred of them. The freezer stands in full sun from eleven o'clock, and nobody moved it. The last twenty cups came from the tub nearest the lid opening. That tub had been dug into all morning and was half air by noon.",
    q: "Why were the last cups soup? Choose one cause and quote the story.",
    who: [
      "",
      "☀️ Full sun on the freezer",
      "🫙 The tub nearest the opening",
    ],
    why: [
      "a lid propped open with a scoop since noon",
      "standing in full sun from eleven, and never moved",
      "the tub nearest the opening, half air by noon",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The lid had been propped open with a scoop since noon so servers could work faster.”", "“Warm air pours into a freezer whenever the lid is open.”"], but: "“The freezer stands in full sun from eleven o'clock, and nobody moved it.”" },
      { who: 1, ev: ["“The freezer stands in full sun from eleven o'clock, and nobody moved it.”", "“Every cup served before noon came out solid, a hundred of them.”"], but: "“The lid had been propped open with a scoop since noon so servers could work faster.”" },
      { who: 2, ev: ["“The last twenty cups came from the tub nearest the lid opening.”", "“That tub had been dug into all morning and was half air by noon.”"], but: "“A thermometer inside the freezer read twenty-two degrees, which is above freezing for ice cream.”" },
    ],
    clears: [],
    note:
      "Noon is the hinge and three things happen near it: the lid goes up, the sun has been on the box for an hour, and one tub is nearly empty. The thermometer reading is the only measurement and it blames the whole freezer rather than any one of the three. A good answer uses the first hundred cups to date the problem.",
  },
  35: {
    story:
      "Field day ended with the fifty-meter ribbons handed out and one runner got the wrong color. Priya came in second across the line and was handed a third-place ribbon. The ribbon table was sorted into three piles by color. The second and third place ribbons are both shades of blue. Under the tent canopy the two piles looked identical. Two other runners also received a ribbon that did not match the sheet. Nobody checked a ribbon against the sheet before handing it over. The timer wrote the places on a wet sheet and two lines are smudged. The finish judge and the timer disagreed about third place at the time.",
    q: "How did Priya get the wrong ribbon? Pick one cause and prove it.",
    who: [
      "",
      "",
      "✅ No ribbon checked against the sheet",
    ],
    why: [
      "two shades of blue that looked identical under the canopy",
      "a wet sheet with two smudged lines, and a judge who disagreed",
      "no ribbon checked against the sheet before it was handed over",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The second and third place ribbons are both shades of blue.”", "“Under the tent canopy the two piles looked identical.”"], but: "“The timer wrote the places on a wet sheet and two lines are smudged.”" },
      { who: 1, ev: ["“The timer wrote the places on a wet sheet and two lines are smudged.”", "“The finish judge and the timer disagreed about third place at the time.”"], but: "“Priya came in second across the line and was handed a third-place ribbon.”" },
      { who: 2, ev: ["“Nobody checked a ribbon against the sheet before handing it over.”", "“Two other runners also received a ribbon that did not match the sheet.”"], but: "“Under the tent canopy the two piles looked identical.”" },
    ],
    clears: [],
    note:
      "Three runners got the wrong ribbon, and that number is the evidence. One mistake can be a smudge; three in a row is a system. Ask what each suspect would produce: a smudged line makes one error, look-alike piles make many, and no checking makes every error survive. The last one is not a cause so much as the reason nothing was caught.",
  },
  36: {
    story:
      "The class blew up forty balloons for the last-day party and eleven popped by lunch. All eleven had been taped to the window side of the room. The balloons on the inside wall are still full. The window side was in direct sun from ten o'clock on. Air inside a balloon expands as it warms, and the rubber stretches until it splits. The eleven popped between ten and twelve. The window-side balloons were blown up first and hardest, to get them done. The tape on that side was the rough kind and was pressed onto the rubber.",
    q: "Why did eleven balloons pop? Make the case for one cause.",
    who: [
      "",
      "💨 Blown up first and hardest",
      "🩹 Rough tape on the rubber",
    ],
    why: [
      "direct sun from ten, and eleven popping between ten and twelve",
      "blown up first and hardest, to get them done",
      "rough tape pressed straight onto the rubber",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The window side was in direct sun from ten o'clock on.”", "“Air inside a balloon expands as it warms, and the rubber stretches until it splits.”"], but: "“The window-side balloons were blown up first and hardest, to get them done.”" },
      { who: 1, ev: ["“The window-side balloons were blown up first and hardest, to get them done.”", "“The eleven popped between ten and twelve.”"], but: "“The balloons on the inside wall are still full.”" },
      { who: 2, ev: ["“The tape on that side was the rough kind and was pressed onto the rubber.”", "“All eleven had been taped to the window side of the room.”"], but: "“The window side was in direct sun from ten o'clock on.”" },
    ],
    clears: [],
    note:
      "Everything that happened to those eleven happened because they were on the window side, so the side is not an answer on its own. The timing is the strongest evidence left: they popped in the two hours after the sun arrived, and tape and overfilling do not wait for ten o'clock. A student who uses the clock is using the best thing in the story.",
  },
};
