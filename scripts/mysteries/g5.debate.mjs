/**
 * Grade 5, the debate version of each case.
 *
 * The ordinary mystery has one answer. The text names a culprit and rules the
 * others out, and a child who quotes the right two sentences is right. That
 * teaches evidence, and it teaches it with a safety net: there is a line in
 * the case that settles the argument, so a wrong answer is wrong.
 *
 * This file tells the same thirty-six cases with the net taken away. The
 * deciding line is withheld and the clearings are replaced by evidence that
 * cuts both ways, so three of the suspects can each be argued for and none of
 * them can be argued for without the text. A student is no longer graded on
 * which name they pick. They are graded on whether they quoted the case,
 * said what the quote shows, and answered the line that works against them.
 *
 * Each entry holds:
 *   story   the same case, retold so that nothing settles it
 *   q       the question put to the class
 *   open    the three suspects still in play, by index into the suspect list
 *   for     one argument per open suspect: ev, the quotes behind it, and but,
 *           the line in the case that an honest answer has to deal with
 *   clears  the suspects who really are ruled out, still quoting the story
 *   note    for the teacher: what separates a strong answer from a guess
 *
 * The gate in scripts/check-mysteries.mjs refuses a debate whose story still
 * carries a clearing from the ordinary version, and refuses two arguments
 * built on the same sentence. Both would turn this back into a case with one
 * answer and a label on it.
 */
export const DEBATES = {
  1: {
    story:
      "Every book in the 500s was out of order on Monday morning. The call numbers ran backward from 599 to 500. The sign-out log shows three books taken Friday and all three back on the shelf. The custodian waxed that aisle Friday night. To wax it he lifted every book off and put it back. The aisle light had been out since Thursday. A sixth-grade class used the library Friday afternoon for a lesson on call numbers. Taped inside the cart was a worksheet titled Practice Shelving: Reverse Order. One student wrote her name on it and answered eleven of the twelve questions. Mrs. Kim saw a fifth grader slide a book behind the row on Friday. The whole row sits pushed back two inches from the shelf edge.",
    q: "Who put the books in backward order, and what in the case says so?",
    why: [
      "titled Reverse Order, taped in the cart after a lesson on call numbers",
      "lifted every book off to wax, in an aisle with no light",
      "three taken Friday, and all three back on the shelf",
      "seen sliding a book behind a row that now sits pushed back",
    ],
    open: [0, 1, 3],
    for: [
      {
        who: 0,
        ev: [
          "“Taped inside the cart was a worksheet titled Practice Shelving: Reverse Order.”",
          "“A sixth-grade class used the library Friday afternoon for a lesson on call numbers.”",
        ],
        but: "“One student wrote her name on it and answered eleven of the twelve questions.”",
      },
      {
        who: 1,
        ev: [
          "“To wax it he lifted every book off and put it back.”",
          "“The aisle light had been out since Thursday.”",
        ],
        but: "“The call numbers ran backward from 599 to 500.”",
      },
      {
        who: 3,
        ev: [
          "“Mrs. Kim saw a fifth grader slide a book behind the row on Friday.”",
          "“The whole row sits pushed back two inches from the shelf edge.”",
        ],
        but: "“Every book in the 500s was out of order on Monday morning.”",
      },
    ],
    clears: ["Checkouts: “three books taken Friday and all three back on the shelf.”"],
    note:
      "Three books cannot reorder a hundred, so the checkouts are out and everybody should say so. After that the case does not choose. The worksheet explains the exact backward order but not the one wrong answer. The custodian explains a whole shelf handled in the dark but not why it came back in perfect reverse. The hidden book explains a row pushed back but not a hundred call numbers. A strong answer names which fact its suspect cannot explain and says why it still picks that suspect.",
  },
  2: {
    story:
      "Four students in Room 12 had warm milk at lunch and the rest were cold. All twenty cartons came out of the same cooler at 11:40. The four warm ones belonged to students who sit at the window table. Those four set their cartons out at 11:45 and ate last, at 12:20. The window table gets direct sun from 11:30 until one o'clock. A thermometer left on that table for ten minutes read eighty-one degrees. The cooler door was propped open all morning for a delivery. Its dial reads forty, but nobody has checked the dial against a thermometer. The four warm cartons were the last four pulled from the back of the cooler. All twenty cartons carry the same date and came from one crate.",
    q: "Why was only some of the milk warm? Say who you would blame and prove it.",
    why: [
      "a thermometer on that table read eighty-one degrees",
      "propped open all morning, and the dial has never been checked",
      "all twenty cartons share one date and one crate",
      "set out at 11:45 by the four who ate last",
    ],
    open: [0, 1, 3],
    for: [
      {
        who: 0,
        ev: [
          "“The window table gets direct sun from 11:30 until one o'clock.”",
          "“A thermometer left on that table for ten minutes read eighty-one degrees.”",
        ],
        but: "“All twenty cartons came out of the same cooler at 11:40.”",
      },
      {
        who: 1,
        ev: [
          "“The cooler door was propped open all morning for a delivery.”",
          "“Its dial reads forty, but nobody has checked the dial against a thermometer.”",
          "“The four warm cartons were the last four pulled from the back of the cooler.”",
        ],
        but: "“The four warm ones belonged to students who sit at the window table.”",
      },
      {
        who: 3,
        ev: [
          "“Those four set their cartons out at 11:45 and ate last, at 12:20.”",
          "“Four students in Room 12 had warm milk at lunch and the rest were cold.”",
        ],
        but: "“A thermometer left on that table for ten minutes read eighty-one degrees.”",
      },
    ],
    clears: ["Bad milk: “All twenty cartons carry the same date and came from one crate.”"],
    note:
      "One crate and one date rules the milk itself out. The other three all fit the same four children, which is what makes this hard: they sit in the sun, they waited longest, and theirs came from the back of a cooler propped open all morning. The best answers notice that the four warm cartons are warm for three reasons at once, and argue for the one they think did most of the work.",
  },
  3: {
    story:
      "Mr. Dunn bought a box of thirty pink erasers in September. By November eleven were gone. He found three of them in the heating vent under the window. The vent sits directly below the pencil cup on the sill. An eraser is light and rolls, and the sill tilts half an inch toward the window. Two students were seen putting erasers in their pockets at the end of October. Erasers cost a nickel, and nobody counts them going out the door. The class searched desks once, in the first week of November, and found two. Nine desks were not opened, because those students were at band.",
    q: "Where did the other erasers go? Pick one answer and back it from the text.",
    why: [
      "three found in it, under a sill that tilts toward the window",
      "two seen pocketing erasers, and nobody counts them going out",
      "searched once, with nine desks never opened",
    ],
    open: [0, 1, 2],
    for: [
      {
        who: 0,
        ev: [
          "“He found three of them in the heating vent under the window.”",
          "“An eraser is light and rolls, and the sill tilts half an inch toward the window.”",
        ],
        but: "“By November eleven were gone.”",
      },
      {
        who: 1,
        ev: [
          "“Two students were seen putting erasers in their pockets at the end of October.”",
          "“Erasers cost a nickel, and nobody counts them going out the door.”",
        ],
        but: "“He found three of them in the heating vent under the window.”",
      },
      {
        who: 2,
        ev: [
          "“The class searched desks once, in the first week of November, and found two.”",
          "“Nine desks were not opened, because those students were at band.”",
        ],
        but: "“The vent sits directly below the pencil cup on the sill.”",
      },
    ],
    clears: [],
    note:
      "Three of the eleven are accounted for by the vent and two by the desks, which leaves six that nothing in the case places. That gap is the exercise. Every answer here is partly right, so the argument is about which explanation covers the most erasers, and a strong one says out loud how many it has explained and how many it has not.",
  },
  4: {
    story:
      "The fifth grade picked four bushels and found a third of them bruised two days later. The bruises are all on one side and about the size of a thumb. The students had been told to pick with a twist, not a pull. Fourteen of them pulled instead. A pulled apple comes away with the stem still attached. A loose stem in a crate presses into whatever it touches. The truck ride was twenty minutes. The road behind the orchard is gravel and washboarded. One crate was set down hard at the loading dock and its corner split. The bruised apples came from two crates, and nobody wrote down which two.",
    q: "What bruised the apples? Name one cause and quote the case.",
    why: [
      "fourteen pulled instead of twisting, leaving the stems attached",
      "twenty minutes over a washboarded gravel road",
      "one set down hard enough to split its corner",
    ],
    open: [0, 1, 2],
    for: [
      {
        who: 0,
        ev: [
          "“A pulled apple comes away with the stem still attached.”",
          "“A loose stem in a crate presses into whatever it touches.”",
        ],
        but: "“The bruised apples came from two crates, and nobody wrote down which two.”",
      },
      {
        who: 1,
        ev: [
          "“The truck ride was twenty minutes.”",
          "“The road behind the orchard is gravel and washboarded.”",
        ],
        but: "“The bruises are all on one side and about the size of a thumb.”",
      },
      {
        who: 2,
        ev: [
          "“One crate was set down hard at the loading dock and its corner split.”",
          "“The fifth grade picked four bushels and found a third of them bruised two days later.”",
        ],
        but: "“Fourteen of them pulled instead.”",
      },
    ],
    clears: [],
    note:
      "The sentence that used to settle this case is the one saying which crates the bruised apples came from, and it has been taken out. Now the stem explanation fits the size and shape of the bruise, the truck fits a third of the load, and the dropped crate fits one crate exactly. Ask which suspect explains the bruise being on one side only, and the room will divide usefully.",
  },
  5: {
    story:
      "Dev's bike pulled left every time he squeezed the brake. His father watched the wheels while Dev braked slowly in the driveway. The front brake pad on the left touched the rim a half second before the right one. One brake cable runs through a housing that had split near the handlebar. A split housing lets the cable stretch, which delays one side. The left tire reads thirty-four pounds and the right reads forty-one. A softer tire grips more and slows that wheel first. Dev's bike was hit in the rack in September and the front forks were straightened by hand. A frame held against a wall looks straight to the eye within a quarter inch.",
    q: "Why does the bike pull to one side? Make the case for one cause.",
    why: [
      "split near the handlebar, and the left pad lands first",
      "thirty-four pounds on the left against forty-one on the right",
      "hit in the rack in September and straightened by hand",
    ],
    open: [0, 1, 2],
    for: [
      {
        who: 0,
        ev: [
          "“One brake cable runs through a housing that had split near the handlebar.”",
          "“A split housing lets the cable stretch, which delays one side.”",
        ],
        but: "“The left tire reads thirty-four pounds and the right reads forty-one.”",
      },
      {
        who: 1,
        ev: [
          "“The left tire reads thirty-four pounds and the right reads forty-one.”",
          "“A softer tire grips more and slows that wheel first.”",
        ],
        but: "“The front brake pad on the left touched the rim a half second before the right one.”",
      },
      {
        who: 2,
        ev: [
          "“Dev's bike was hit in the rack in September and the front forks were straightened by hand.”",
          "“A frame held against a wall looks straight to the eye within a quarter inch.”",
        ],
        but: "“Dev's bike pulled left every time he squeezed the brake.”",
      },
    ],
    clears: [],
    note:
      "All three now have a measurement behind them, and the pull is to the left in every one. The useful question is which of them explains why the bike only pulls when he brakes. Two of the three predict a pull all the time, and a student who notices that has done the real work whichever name they end up writing.",
  },
  6: {
    story:
      "The class goldfish hung near the surface and gulped at the air for two days. A fish at the surface is trying to reach the layer with the most oxygen. The tank sits beside a radiator that came on when the weather turned. A thermometer in the water read eighty-two degrees, eight above the usual reading. Warm water holds less dissolved oxygen than cool water does. The filter ran all night, but its outflow no longer breaks the surface since the water level dropped. Moving water is how most of the oxygen gets in. The test strip is from a tube that expired in March. Ammonia burns the gills, and a burned fish breathes fast wherever it is.",
    q: "Why is the fish gulping at the surface? Argue for one cause.",
    why: [
      "eighty-two degrees, eight above the usual reading",
      "running, but its outflow no longer breaks the surface",
      "tested with a strip from a tube that expired in March",
    ],
    open: [0, 1, 2],
    for: [
      {
        who: 0,
        ev: [
          "“A thermometer in the water read eighty-two degrees, eight above the usual reading.”",
          "“Warm water holds less dissolved oxygen than cool water does.”",
        ],
        but: "“The filter ran all night, but its outflow no longer breaks the surface since the water level dropped.”",
      },
      {
        who: 1,
        ev: [
          "“Moving water is how most of the oxygen gets in.”",
          "“The tank sits beside a radiator that came on when the weather turned.”",
        ],
        but: "“A fish at the surface is trying to reach the layer with the most oxygen.”",
      },
      {
        who: 2,
        ev: [
          "“The test strip is from a tube that expired in March.”",
          "“Ammonia burns the gills, and a burned fish breathes fast wherever it is.”",
        ],
        but: "“A thermometer in the water read eighty-two degrees, eight above the usual reading.”",
      },
    ],
    clears: [],
    note:
      "Two of these take oxygen out of the water and one stops it going in, so the first two arguments agree about the mechanism and disagree about the cause. The chemistry argument is the interesting one, because the only reason it was ruled out before was a test strip, and the case now says the strip is nine months out of date. Evidence that cannot be trusted is not evidence that says no.",
  },
  7: {
    story:
      "A rattle came from the ceiling vent in Room 8 three or four times an hour. It stopped completely on Saturday and started again Monday. The rattle happens about ten seconds after the heat kicks on. A thin metal damper inside the duct swings when air first moves through it. The damper's pin has worn a groove and no longer holds it steady. Two screws on the ceiling grille turn freely without tightening. A loose grille buzzes when air pushes past it. The duct straps were fitted in August and one of them hangs an inch below the duct. On Saturday the building heat was off, so nothing moved in the duct at all.",
    q: "What is rattling in the vent? Pick a cause and prove it from the text.",
    why: [
      "worn into a groove, and the damper swings on the first air",
      "two on the grille turn freely without tightening",
      "one of them hangs an inch below the duct",
    ],
    open: [0, 1, 2],
    for: [
      {
        who: 0,
        ev: [
          "“A thin metal damper inside the duct swings when air first moves through it.”",
          "“The damper's pin has worn a groove and no longer holds it steady.”",
        ],
        but: "“Two screws on the ceiling grille turn freely without tightening.”",
      },
      {
        who: 1,
        ev: [
          "“Two screws on the ceiling grille turn freely without tightening.”",
          "“A loose grille buzzes when air pushes past it.”",
        ],
        but: "“The rattle happens about ten seconds after the heat kicks on.”",
      },
      {
        who: 2,
        ev: [
          "“The duct straps were fitted in August and one of them hangs an inch below the duct.”",
          "“It stopped completely on Saturday and started again Monday.”",
        ],
        but: "“A thin metal damper inside the duct swings when air first moves through it.”",
      },
    ],
    clears: [],
    note:
      "Saturday no longer clears anybody, because the heat was off and all three suspects need moving air. That is worth saying aloud: a test that every suspect passes has told you nothing. The ten-second delay is the detail that still does work, and the strongest answers use it, whichever side they are arguing.",
  },
  8: {
    story:
      "One maple at the school entrance dropped the leaves from a single branch in September. The rest of the tree stayed green. A groundskeeper found a deep cut in the bark where that branch meets the trunk. The cut came from a string trimmer used around the base in August. Water travels to a branch through a thin layer just under the bark. A cut that circles part of that layer starves whatever is above it. The branch is the lowest on the tree and the only one that reaches over the parking lot. Salt spray from the lot killed two shrubs on that side last winter. Three leaves in the fallen pile have small round holes near the stem.",
    q: "Why did one branch lose its leaves? Choose a cause and back it up.",
    why: [
      "deep, where that branch meets the trunk",
      "the only branch over the lot, and salt killed shrubs on that side",
      "small round holes in three of the fallen leaves",
    ],
    open: [0, 1, 2],
    for: [
      {
        who: 0,
        ev: [
          "“A groundskeeper found a deep cut in the bark where that branch meets the trunk.”",
          "“A cut that circles part of that layer starves whatever is above it.”",
        ],
        but: "“The branch is the lowest on the tree and the only one that reaches over the parking lot.”",
      },
      {
        who: 1,
        ev: [
          "“The branch is the lowest on the tree and the only one that reaches over the parking lot.”",
          "“Salt spray from the lot killed two shrubs on that side last winter.”",
        ],
        but: "“One maple at the school entrance dropped the leaves from a single branch in September.”",
      },
      {
        who: 2,
        ev: [
          "“Three leaves in the fallen pile have small round holes near the stem.”",
          "“The rest of the tree stayed green.”",
        ],
        but: "“The cut came from a string trimmer used around the base in August.”",
      },
    ],
    clears: [],
    note:
      "The branch now has three things wrong with it at once, which is what makes it arguable. Push on timing: the cut was made in August and the leaves fell in September, the salt came last winter, and three holes is a small number out of a whole branch. A student who argues from how long each cause takes to show is reasoning well even if they pick the salt.",
  },
  9: {
    story:
      "The entrance pumpkin held its shape for three weeks and caved in overnight on the twenty-second day. Nobody saw it happen. The temperature dropped to twenty-six degrees that night, the first freeze of the fall. A pumpkin is about ninety percent water, and water expands when it freezes. Expanding ice pushes the cell walls apart, and they do not go back when the ice melts. Two shallow scratches run across the base where it meets the step. The custodian moved the pumpkin twice that week to sweep under it. A soft patch the size of a hand sits on the underside, and it smells sour. The lobby pumpkin, kept at room temperature, is still firm after twenty-four days.",
    q: "Why did the pumpkin cave in? Make the case for one cause.",
    who: [
      "",
      "🦠 A sour soft patch underneath",
      "",
    ],
    why: [
      "twenty-six degrees that night, the first freeze of the fall",
      "scratches across the base and a sour soft patch underneath",
      "moved it twice that week to sweep under it",
    ],
    open: [0, 1, 2],
    for: [
      {
        who: 0,
        ev: [
          "“The temperature dropped to twenty-six degrees that night, the first freeze of the fall.”",
          "“Expanding ice pushes the cell walls apart, and they do not go back when the ice melts.”",
        ],
        but: "“A soft patch the size of a hand sits on the underside, and it smells sour.”",
      },
      {
        who: 1,
        ev: [
          "“Two shallow scratches run across the base where it meets the step.”",
          "“A soft patch the size of a hand sits on the underside, and it smells sour.”",
        ],
        but: "“The entrance pumpkin held its shape for three weeks and caved in overnight on the twenty-second day.”",
      },
      {
        who: 2,
        ev: [
          "“The custodian moved the pumpkin twice that week to sweep under it.”",
          "“The lobby pumpkin, kept at room temperature, is still firm after twenty-four days.”",
        ],
        but: "“A pumpkin is about ninety percent water, and water expands when it freezes.”",
      },
    ],
    clears: [],
    note:
      "The lobby pumpkin is the strongest single fact in the case and it can be used on two sides. It was never frozen and never moved, so it supports the freeze and the custodian equally well. Ask the class what one extra fact would settle it, and the answer they should reach is whether the lobby pumpkin was ever outdoors.",
  },
  10: {
    story:
      "Wet prints crossed the cafeteria floor on Wednesday in one direction only. Nothing led back. The prints start at the loading door and stop at the dish room. It had rained all morning and the delivery truck arrived at ten. The driver wore boots with a block tread, and the prints show a block tread. The dish room has a floor drain and a hose that was used at ten fifteen. Two of the kitchen staff had been outside at the dumpster that morning. Their non-slip shoes have a block tread under the heel and circles under the toe. The dish room door was propped and nobody checked who was behind it. The prints stop at the drain, where the floor is always wet.",
    q: "Who left the wet prints? Charge one of them and prove it from the case.",
    why: [
      "block tread boots, and a truck that arrived at ten",
      "outside at the dumpster, with block tread under the heel",
      "a dish room door propped, and nobody checking behind it",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“It had rained all morning and the delivery truck arrived at ten.”", "“The driver wore boots with a block tread, and the prints show a block tread.”"], but: "“Two of the kitchen staff had been outside at the dumpster that morning.”" },
      { who: 1, ev: ["“Two of the kitchen staff had been outside at the dumpster that morning.”", "“Their non-slip shoes have a block tread under the heel and circles under the toe.”"], but: "“The prints start at the loading door and stop at the dish room.”" },
      { who: 2, ev: ["“The dish room door was propped and nobody checked who was behind it.”", "“The prints stop at the drain, where the floor is always wet.”"], but: "“Nothing led back.”" },
    ],
    clears: [],
    note:
      "The tread no longer tells the suspects apart, because the kitchen shoes turn out to have a block tread too. That is the move worth drawing out: evidence that fits two suspects is not evidence against either. What still does work is where the prints start and where they stop, and a strong answer argues from the route rather than the sole.",
  },
  11: {
    story:
      "Bus 7 arrived at school with eleven students on Tuesday instead of the usual twenty-six. A city crew closed Pine Street at six that morning for a water main. Fifteen of the students live on Pine Street or the two streets behind it. The detour sign at the corner pointed walkers toward the school's east gate. Walking from Pine Street to the east gate takes nine minutes. The attendance office counted twenty-two in class by nine, not twenty-six. Four families reported a stomach bug going round that week. The driver's sheet shows he skipped the Elm Street stop to make up time. Six students wait at Elm Street. Nobody wrote down who boarded and who did not.",
    q: "Where were the other fifteen? Pick one explanation and back it from the text.",
    why: [
      "fifteen live there, and the sign sent walkers to the east gate",
      "twenty-two counted in class, and a bug going round that week",
      "Elm Street skipped to make up time, where six wait",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A city crew closed Pine Street at six that morning for a water main.”", "“The detour sign at the corner pointed walkers toward the school's east gate.”"], but: "“The attendance office counted twenty-two in class by nine, not twenty-six.”" },
      { who: 1, ev: ["“The attendance office counted twenty-two in class by nine, not twenty-six.”", "“Four families reported a stomach bug going round that week.”"], but: "“Walking from Pine Street to the east gate takes nine minutes.”" },
      { who: 2, ev: ["“The driver's sheet shows he skipped the Elm Street stop to make up time.”", "“Six students wait at Elm Street.”"], but: "“Fifteen of the students live on Pine Street or the two streets behind it.”" },
    ],
    clears: [],
    note:
      "Fifteen are missing from the bus and only four are missing from class, so no single suspect covers the whole number. That is the point. Ask the room to add up what their suspect explains: the closure covers fifteen but not the empty desks, the bug covers four, the skipped stop covers six. The best answers combine two and say so.",
  },
  12: {
    story:
      "The science fair trophy developed a crack across its base between June and September. The case sits against the south wall of the gym, which has no air conditioning. A logger left in the case recorded swings from sixty-one degrees to ninety-four. The base is a marble slab glued to a plastic plate underneath. Marble and plastic expand by different amounts when they are heated. Two materials glued together that expand differently pull apart at the joint. A chip the size of a pea is missing from one corner of the base. The crack begins at that corner. The case was unlocked for the summer open house and the trophy was handled. Nobody recorded who opened the case or when.",
    q: "What cracked the trophy base? Make the case for one cause.",
    why: [
      "sixty-one degrees to ninety-four, on a glued marble joint",
      "a pea-sized chip at the corner the crack starts from",
      "the case unlocked for the open house, with no record kept",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A logger left in the case recorded swings from sixty-one degrees to ninety-four.”", "“Two materials glued together that expand differently pull apart at the joint.”"], but: "“A chip the size of a pea is missing from one corner of the base.”" },
      { who: 1, ev: ["“A chip the size of a pea is missing from one corner of the base.”", "“The crack begins at that corner.”"], but: "“The case sits against the south wall of the gym, which has no air conditioning.”" },
      { who: 2, ev: ["“The case was unlocked for the summer open house and the trophy was handled.”", "“Nobody recorded who opened the case or when.”"], but: "“Marble and plastic expand by different amounts when they are heated.”" },
    ],
    clears: [],
    note:
      "Heat explains why the joint was weak and the chip explains where the crack started, which means the two best answers are not really rivals. Let the argument run until somebody says so. A student who writes that the heat loosened the joint and a knock at the corner finished it has read the case better than one who picks a single name.",
  },
  13: {
    story:
      "The fifth grade's holiday turkey came out browned outside and raw near the bone. It had come out of the freezer at nine that morning. A frozen turkey needs about twenty-four hours in a refrigerator for every five pounds. This one weighed sixteen pounds and had thawed five hours on the counter. Heat moves through a roasting bird from the outside in. Ice at the center absorbs heat without the temperature rising. The oven dial was set to 350. The oven itself has not been checked in four years. The bird went in at noon and came out at four, and the chart asks for four and a half hours. Nobody opened the oven door to look.",
    q: "Why was the turkey raw near the bone? Choose a cause and prove it.",
    why: [
      "sixteen pounds thawed for five hours on a counter",
      "a dial set to 350 on an oven unchecked for four years",
      "noon to four against a chart that asks for four and a half",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“This one weighed sixteen pounds and had thawed five hours on the counter.”", "“Ice at the center absorbs heat without the temperature rising.”"], but: "“The oven itself has not been checked in four years.”" },
      { who: 1, ev: ["“The oven dial was set to 350.”", "“The oven itself has not been checked in four years.”"], but: "“The fifth grade's holiday turkey came out browned outside and raw near the bone.”" },
      { who: 2, ev: ["“The bird went in at noon and came out at four, and the chart asks for four and a half hours.”", "“Nobody opened the oven door to look.”"], but: "“A frozen turkey needs about twenty-four hours in a refrigerator for every five pounds.”" },
    ],
    clears: [],
    note:
      "A browned outside is the fact that does the most work and it is easy to walk past. An oven running cold would not brown anything, so the strongest answers use the browning to argue against the oven even while admitting it has not been checked in four years. Half an hour short is real and small; nineteen hours of thawing short is real and large.",
  },
  14: {
    story:
      "Room 11 baked two trays of cupcakes from one bowl of batter. The first tray is light and the second is dense and chewy. The class kept stirring the bowl while the first tray baked. Stirring wheat batter builds gluten, and gluten makes a cake chewy. The second tray sat in the bowl being stirred for eighteen extra minutes. The second tray went in straight after the first, into an oven already hot. An oven runs hotter on its second load than on its first. The timer was set for eighteen minutes. Nobody heard it over the mixer. Both trays were scooped from the same bowl and nothing was added to either.",
    q: "Why was the second tray chewy? Name a cause and quote the case.",
    why: [
      "eighteen extra minutes of stirring, which builds gluten",
      "second into an oven already hot from the first tray",
      "a timer nobody heard over the mixer",
      "one bowl, and nothing added to either tray",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Stirring wheat batter builds gluten, and gluten makes a cake chewy.”", "“The second tray sat in the bowl being stirred for eighteen extra minutes.”"], but: "“An oven runs hotter on its second load than on its first.”" },
      { who: 1, ev: ["“The second tray went in straight after the first, into an oven already hot.”", "“An oven runs hotter on its second load than on its first.”"], but: "“The second tray sat in the bowl being stirred for eighteen extra minutes.”" },
      { who: 2, ev: ["“The timer was set for eighteen minutes.”", "“Nobody heard it over the mixer.”"], but: "“The first tray is light and the second is dense and chewy.”" },
    ],
    clears: ["A wrong ingredient: “Both trays were scooped from the same bowl and nothing was added to either.”"],
    note:
      "One bowl rules the ingredients out and everybody should say so first. After that, three things happened to the second tray and only the second tray: it was stirred longer, it met a hotter oven, and nobody was listening for the timer. Dense and chewy is the detail to argue from, because overbaking dries a cake rather than making it chewy.",
  },
  15: {
    story:
      "Noor's wool gloves came back from the wash stiff enough to stand up by themselves. Her brother washed them in hot water and put them through the dryer. Wool fibers are covered in tiny scales that open in heat and lock together. Once locked, the scales do not release, and the wool stays matted and stiff. The gloves also came out two sizes smaller than before. He used a new detergent with an enzyme that the bottle says breaks down protein. Wool is a protein fiber. The gloves were bought at a market stall with no label of any kind. Two loose threads had already pulled free before the wash.",
    q: "Why did the gloves come out stiff? Argue for one cause.",
    why: [
      "hot water and a dryer, which open the scales",
      "a new enzyme detergent that breaks down protein",
      "a market stall with no label, and threads already pulling free",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Her brother washed them in hot water and put them through the dryer.”", "“Wool fibers are covered in tiny scales that open in heat and lock together.”"], but: "“He used a new detergent with an enzyme that the bottle says breaks down protein.”" },
      { who: 1, ev: ["“He used a new detergent with an enzyme that the bottle says breaks down protein.”", "“Wool is a protein fiber.”"], but: "“The gloves also came out two sizes smaller than before.”" },
      { who: 2, ev: ["“The gloves were bought at a market stall with no label of any kind.”", "“Two loose threads had already pulled free before the wash.”"], but: "“Once locked, the scales do not release, and the wool stays matted and stiff.”" },
    ],
    clears: [],
    note:
      "Two sizes smaller is the fact that separates these. Heat and tumbling shrink wool; an enzyme weakens a fiber without pulling it in. Ask what each suspect predicts about the size and the room will sort itself out, though the enzyme argument is genuinely good and a student who makes it well has done the work.",
  },
  16: {
    story:
      "Room 6's gingerbread house stood square on Monday and leaned badly by Thursday. The back wall is a single slab of gingerbread eleven inches long. The room's humidity rose from thirty percent to sixty-eight after a warm week. Gingerbread absorbs water from damp air and softens as it does. A soft slab sags under its own weight even when the joints hold. The front wall, which is two shorter pieces, is still straight. The icing at the back seam has gone chalky and crumbles when touched. Fourteen gumdrops are glued along the top of the back wall and nowhere else. The lean is all in the long back wall.",
    q: "Why did the house lean? Pick a cause and prove it from the text.",
    why: [
      "humidity from thirty to sixty-eight percent, on an eleven-inch slab",
      "chalky at the back seam, and crumbling when touched",
      "fourteen gumdrops along the top of the back wall only",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Gingerbread absorbs water from damp air and softens as it does.”", "“A soft slab sags under its own weight even when the joints hold.”"], but: "“The icing at the back seam has gone chalky and crumbles when touched.”" },
      { who: 1, ev: ["“The icing at the back seam has gone chalky and crumbles when touched.”", "“The room's humidity rose from thirty percent to sixty-eight after a warm week.”"], but: "“The front wall, which is two shorter pieces, is still straight.”" },
      { who: 2, ev: ["“Fourteen gumdrops are glued along the top of the back wall and nowhere else.”", "“The lean is all in the long back wall.”"], but: "“The back wall is a single slab of gingerbread eleven inches long.”" },
    ],
    clears: [],
    note:
      "All three suspects now point at the same wall, which is why this one is hard and worth doing. The back wall is the longest, it carries all the candy, and its seam is the crumbling one. The question that splits the room is whether the damp softened the gingerbread or the icing, and the case deliberately says the humidity rose without saying what it reached first.",
  },
  17: {
    story:
      "The hallway light strand burned brightly in December and looked dim by January. The strand now runs through a second extension cord added after the holidays. The total length from the outlet is one hundred and ten feet. Voltage drops the further electricity travels along a thin cord. A meter at the far end read ninety-six volts instead of one hundred and twenty. The bulbs nearest the outlet are noticeably brighter than the ones at the end. Nine of the hundred bulbs are dark, all of them in the last ten feet. The plug at the cord joint is warm and will wobble if you touch it. A warm plug means current is meeting resistance at the joint.",
    q: "Why did the lights go dim? Make the case for one cause.",
    why: [
      "ninety-six volts at the far end of a hundred and ten feet",
      "nine dark, all of them in the last ten feet",
      "a warm plug at the cord joint that wobbles",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A meter at the far end read ninety-six volts instead of one hundred and twenty.”", "“Voltage drops the further electricity travels along a thin cord.”"], but: "“The plug at the cord joint is warm and will wobble if you touch it.”" },
      { who: 1, ev: ["“Nine of the hundred bulbs are dark, all of them in the last ten feet.”", "“The bulbs nearest the outlet are noticeably brighter than the ones at the end.”"], but: "“The total length from the outlet is one hundred and ten feet.”" },
      { who: 2, ev: ["“The plug at the cord joint is warm and will wobble if you touch it.”", "“A warm plug means current is meeting resistance at the joint.”"], but: "“The bulbs nearest the outlet are noticeably brighter than the ones at the end.”" },
    ],
    clears: [],
    note:
      "Everything in this case gets worse the further you go along the strand, so all three suspects produce the same pattern and the pattern cannot choose between them. Push on cause and effect instead: do nine dark bulbs make the rest dim, or does a dim strand kill the end bulbs first? A student who notices the direction of that arrow is doing real science.",
  },
  18: {
    story:
      "The gym clock gained four minutes a week all through October. This clock is not an ordinary battery clock. It syncs each night to a radio signal from a national time station. The gym's new scoreboard was installed in September on the wall directly below it. Electronic equipment can emit radio noise that blocks a weak time signal. A clock that cannot hear the signal falls back on its own timing, which drifts. The battery has been in the clock since the spring and has never been tested. The second hand pauses for a moment at the top of every minute. A hand that catches and jumps does not keep steady time. Nothing was ever checked behind the face.",
    q: "Why was the clock gaining time? Pick a cause and back it up.",
    why: [
      "a scoreboard fitted on the wall below it in September",
      "in since the spring, and never tested",
      "a second hand that pauses at the top of every minute",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The gym's new scoreboard was installed in September on the wall directly below it.”", "“A clock that cannot hear the signal falls back on its own timing, which drifts.”"], but: "“The second hand pauses for a moment at the top of every minute.”" },
      { who: 1, ev: ["“The battery has been in the clock since the spring and has never been tested.”", "“Nothing was ever checked behind the face.”"], but: "“The gym clock gained four minutes a week all through October.”" },
      { who: 2, ev: ["“The second hand pauses for a moment at the top of every minute.”", "“A hand that catches and jumps does not keep steady time.”"], but: "“It syncs each night to a radio signal from a national time station.”" },
    ],
    clears: [],
    note:
      "Gaining is the word to lean on. A tired battery and a catching hand both make a clock slow, not fast, and a student who argues that has used a fact the case never states outright. The scoreboard argument needs the September date to line up with October, and that is worth asking for by name.",
  },
  19: {
    story:
      "The snow along the school's front walk turned gray within two days. The snow on the playing field stayed white. The front walk runs twelve feet from the bus lane, where fourteen buses idle each morning. Diesel engines put fine soot into the air, and soot settles downwind. The prevailing wind here blows from the bus lane toward the walk. A paper towel wiped across the gray snow came away black. A bag of ice melt was split open by the door on the first cold morning. Ice melt turns gray as it takes up grit from a shoe. Delivery vans back up to the kitchen door at the near end of the walk.",
    q: "Why did only the front walk's snow turn gray? Choose a cause and prove it.",
    why: [
      "fourteen buses idling upwind, and a towel that came away black",
      "a split bag of ice melt by the door",
      "delivery vans backing to the kitchen door at the near end",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Diesel engines put fine soot into the air, and soot settles downwind.”", "“A paper towel wiped across the gray snow came away black.”"], but: "“A bag of ice melt was split open by the door on the first cold morning.”" },
      { who: 1, ev: ["“A bag of ice melt was split open by the door on the first cold morning.”", "“Ice melt turns gray as it takes up grit from a shoe.”"], but: "“The prevailing wind here blows from the bus lane toward the walk.”" },
      { who: 2, ev: ["“Delivery vans back up to the kitchen door at the near end of the walk.”", "“The snow on the playing field stayed white.”"], but: "“The snow along the school's front walk turned gray within two days.”" },
    ],
    clears: [],
    note:
      "The black towel is the strongest single piece of evidence and it does not name a source, because soot, grit and exhaust all come off black. Ask where each suspect would make the snow grayest: the wind spreads it along the whole walk, the split bag darkens one end, the vans darken the other. Then ask whether anybody looked.",
  },
  20: {
    story:
      "The school bird feeder went from busy to empty of birds in one week, though the seed level has not dropped. A window-washing crew hung reflective film on the glass behind it on Monday. Birds avoid a feeder when they cannot see a clear escape route. Reflections can look like open sky. Three birds struck the glass that week. A gray cat has been sitting on the wall by the shed since the weather turned. Tufts of feather were found under the feeder on Tuesday. The crew also moved the feeder two feet left to reach the window. Birds learn a feeder's exact place and look for it there.",
    q: "Why did the birds stop coming? Argue for one cause.",
    why: [
      "reflective film on the glass, and three strikes that week",
      "a gray cat on the wall, and feathers under the feeder",
      "moved two feet left so the crew could reach the window",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A window-washing crew hung reflective film on the glass behind it on Monday.”", "“Three birds struck the glass that week.”"], but: "“Tufts of feather were found under the feeder on Tuesday.”" },
      { who: 1, ev: ["“A gray cat has been sitting on the wall by the shed since the weather turned.”", "“Tufts of feather were found under the feeder on Tuesday.”"], but: "“Reflections can look like open sky.”" },
      { who: 2, ev: ["“The crew also moved the feeder two feet left to reach the window.”", "“Birds learn a feeder's exact place and look for it there.”"], but: "“though the seed level has not dropped.”" },
    ],
    clears: [],
    note:
      "The feathers fit a cat and they also fit a bird that hit a window, which is the trap in this case. The film, the cat and the move all arrived in the same week, so timing cannot separate them either. The honest answers say which fact they cannot explain, and the very best notice that the feeder was moved by the same crew that hung the film.",
  },
  21: {
    story:
      "Half the cups at the winter party had a thick layer of powder at the bottom and half did not. The cups with powder were all poured in the last five minutes. The pot sat on a cold counter for twenty minutes before the final pours. Cocoa powder is denser than milk and sinks whenever the liquid stops moving. Warm liquid keeps moving longer than cool liquid does. Two tins were opened that morning, one of them new. The new tin's powder is coarser and sits at the bottom of the tin. The last cups were the tall paper ones, which are narrower at the base. Powder gathers faster in a narrow base than a wide one.",
    q: "Why did half the cups have powder at the bottom? Make the case for one cause.",
    why: [
      "twenty minutes on a cold counter before the last pours",
      "a new tin whose powder is coarser",
      "tall paper ones, narrower at the base",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The pot sat on a cold counter for twenty minutes before the final pours.”", "“Warm liquid keeps moving longer than cool liquid does.”"], but: "“Two tins were opened that morning, one of them new.”" },
      { who: 1, ev: ["“Two tins were opened that morning, one of them new.”", "“The new tin's powder is coarser and sits at the bottom of the tin.”"], but: "“The cups with powder were all poured in the last five minutes.”" },
      { who: 2, ev: ["“The last cups were the tall paper ones, which are narrower at the base.”", "“Powder gathers faster in a narrow base than a wide one.”"], but: "“Cocoa powder is denser than milk and sinks whenever the liquid stops moving.”" },
    ],
    clears: [],
    note:
      "Every suspect in this case arrives at the end of the party, which is exactly why the timing cannot choose between them. The cooling pot, the second tin and the tall cups all belong to the last five minutes. Ask what would have had to be different for each one, and the class will land on an experiment rather than an opinion.",
  },
  22: {
    story:
      "Twenty valentines came out of the class printer with smudged ink along the right edge. The smudge appears only on card stock, not on plain paper. Card stock is thicker and travels a tighter curve through the paper path. A roller at the exit has a flat spot worn into it. It drags on a thick sheet. Plain paper is thin enough to pass the flat spot without touching. The toner cartridge is past its rated page count and has been shaken twice this month. Smudging along one edge is the first sign a cartridge gives. The card stock came from a box that sat open in the damp supply room all fall. Damp card stock takes ink unevenly.",
    q: "What smudged the valentines? Pick a cause and prove it from the case.",
    why: [
      "a flat spot that drags on thick sheets",
      "past its rated page count, and shaken twice this month",
      "a box left open in the damp supply room all fall",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A roller at the exit has a flat spot worn into it.”", "“It drags on a thick sheet.”"], but: "“The card stock came from a box that sat open in the damp supply room all fall.”" },
      { who: 1, ev: ["“The toner cartridge is past its rated page count and has been shaken twice this month.”", "“Smudging along one edge is the first sign a cartridge gives.”"], but: "“The smudge appears only on card stock, not on plain paper.”" },
      { who: 2, ev: ["“The card stock came from a box that sat open in the damp supply room all fall.”", "“Damp card stock takes ink unevenly.”"], but: "“Plain paper is thin enough to pass the flat spot without touching.”" },
    ],
    clears: [],
    note:
      "Card stock only is the fact that carries this case, and two of the three suspects explain it. The roller explains it by thickness and the damp box explains it by what was stored where. The toner argument has to get past that fact, and a student who takes it on honestly, rather than ignoring it, has written the better answer even if the conclusion is weaker.",
  },
  23: {
    story:
      "Theo's model volcano erupted so hard at the fair that it emptied in four seconds. It soaked the table. At home the same model had bubbled for half a minute. At home he added the vinegar through a narrow funnel over twenty seconds. At the fair he poured it straight in from the cup. A reaction that gets all its ingredients at once releases all its gas at once. He measured the baking soda at home and took it by eye at the fair. The fair's vinegar came from the school kitchen and the bottle says double strength. He widened the crater opening on Friday night so the foam would show better.",
    q: "Why did the volcano empty in four seconds? Argue for one cause.",
    why: [
      "poured straight in from the cup instead of through a funnel",
      "measured at home, taken by eye at the fair, and double strength",
      "widened on Friday night so the foam would show",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“At the fair he poured it straight in from the cup.”", "“A reaction that gets all its ingredients at once releases all its gas at once.”"], but: "“The fair's vinegar came from the school kitchen and the bottle says double strength.”" },
      { who: 1, ev: ["“He measured the baking soda at home and took it by eye at the fair.”", "“The fair's vinegar came from the school kitchen and the bottle says double strength.”"], but: "“At home he added the vinegar through a narrow funnel over twenty seconds.”" },
      { who: 2, ev: ["“He widened the crater opening on Friday night so the foam would show better.”", "“It soaked the table.”"], but: "“At home the same model had bubbled for half a minute.”" },
    ],
    clears: [],
    note:
      "Three things changed between the kitchen table and the fair, and the original case had only one. Make the class separate speed from amount: a stronger vinegar makes more gas, a faster pour makes the same gas arrive sooner, and a wider crater lets it out faster. All three end in four seconds, and only one of them would still soak the table if the others were fixed.",
  },
  24: {
    story:
      "The play's brass crown left a green mark on Lena's forehead after the Saturday show. It left no mark after Friday's. Brass contains copper, and copper reacts with acid to form a green compound. Sweat is mildly acidic, and the Saturday show ran under full stage lights with the heating on. Friday's dress rehearsal ran in a cool room with the work lights only. Two other actors in brass circlets had green marks on Saturday as well. The crown was touched up with gold craft paint on Saturday afternoon. That paint is sold as water-based and washes off on a damp cloth. The wardrobe box holds three brass crowns that look alike.",
    q: "What made the green mark? Pick a cause and prove it from the case.",
    why: [
      "full stage lights and the heating on, and sweat is acidic",
      "touched up with water-based gold paint that afternoon",
      "a wardrobe box holding three brass crowns that look alike",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Sweat is mildly acidic, and the Saturday show ran under full stage lights with the heating on.”", "“Two other actors in brass circlets had green marks on Saturday as well.”"], but: "“The crown was touched up with gold craft paint on Saturday afternoon.”" },
      { who: 1, ev: ["“The crown was touched up with gold craft paint on Saturday afternoon.”", "“That paint is sold as water-based and washes off on a damp cloth.”"], but: "“Friday's dress rehearsal ran in a cool room with the work lights only.”" },
      { who: 2, ev: ["“The wardrobe box holds three brass crowns that look alike.”", "“It left no mark after Friday's.”"], but: "“Brass contains copper, and copper reacts with acid to form a green compound.”" },
    ],
    clears: [],
    note:
      "Two other actors is the fact that does the heavy lifting, because whatever happened to Lena happened to them too. Ask whether the paint was on their circlets. The case does not say, and noticing that a crucial fact is missing is worth as much here as any quote.",
  },
  25: {
    story:
      "The class piano sounded fine in June and noticeably out of tune in September. Nobody touched it. The tuner found that the strings in the middle two octaves had all gone flat by about the same amount. A piano's strings pull on a wooden frame with about eighteen tons of total tension. Wood swells when the air is damp and shrinks when it dries. The school's humidity ran at seventy percent all summer with the ventilation off. As the soundboard swelled, the strings stretched and their pitch dropped. The summer music camp used the room for six weeks and the lid was found open in August. A tuning pin in the middle section turns more easily than the others. The piano was moved eight feet in July to make room for chairs.",
    q: "Why did the piano go out of tune? Make the case for one cause.",
    who: [
      "",
      "",
      "📌 A loose tuning pin",
    ],
    why: [
      "seventy percent humidity all summer with the ventilation off",
      "six weeks of music camp, and the lid found open in August",
      "a pin in the middle section that turns more easily than the rest",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The school's humidity ran at seventy percent all summer with the ventilation off.”", "“As the soundboard swelled, the strings stretched and their pitch dropped.”"], but: "“The summer music camp used the room for six weeks and the lid was found open in August.”" },
      { who: 1, ev: ["“The summer music camp used the room for six weeks and the lid was found open in August.”", "“The piano was moved eight feet in July to make room for chairs.”"], but: "“The tuner found that the strings in the middle two octaves had all gone flat by about the same amount.”" },
      { who: 2, ev: ["“A tuning pin in the middle section turns more easily than the others.”", "“A piano's strings pull on a wooden frame with about eighteen tons of total tension.”"], but: "“Wood swells when the air is damp and shrinks when it dries.”" },
    ],
    clears: [],
    note:
      "All of them went flat by about the same amount, and that one phrase is the whole argument. A loose pin lets one string go. A summer of playing wears some notes more than others. Only something acting on the whole instrument moves a whole section together, and a student who builds their answer on the word all has found the load-bearing sentence.",
  },
  26: {
    story:
      "Priya's box kite spun in tight circles instead of climbing. Her bridle, the short line that joins the kite to the flying line, is tied at two points. One of those knots had slipped about two inches toward the nose. A bridle sets the angle the kite meets the wind, and the two sides must match. When one side is shorter, the kite presents an uneven face and turns. A seam along the lower sail has opened about three inches and the cloth flaps there. Air spilling from one side of a sail pushes the kite the other way. The wind at the field shifted direction four times in ten minutes. Her brother's kite stayed up but circled twice before he landed it.",
    q: "Why did the kite spin instead of climbing? Choose a cause and back it up.",
    why: [
      "one knot slipped two inches toward the nose",
      "a seam open three inches along the lower sail",
      "a wind that shifted direction four times in ten minutes",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“One of those knots had slipped about two inches toward the nose.”", "“When one side is shorter, the kite presents an uneven face and turns.”"], but: "“A seam along the lower sail has opened about three inches and the cloth flaps there.”" },
      { who: 1, ev: ["“A seam along the lower sail has opened about three inches and the cloth flaps there.”", "“Air spilling from one side of a sail pushes the kite the other way.”"], but: "“A bridle sets the angle the kite meets the wind, and the two sides must match.”" },
      { who: 2, ev: ["“The wind at the field shifted direction four times in ten minutes.”", "“Her brother's kite stayed up but circled twice before he landed it.”"], but: "“Priya's box kite spun in tight circles instead of climbing.”" },
    ],
    clears: [],
    note:
      "The brother's kite used to clear the wind and now it half convicts it, because his circled too. Push on the difference between circling twice and spinning the whole time. A fault on the kite acts every second; a shifting wind acts four times in ten minutes. Whichever side a student takes, that distinction is the thing to insist on.",
  },
  27: {
    story:
      "One corner of the school's clover patch produces four-leaf clovers. The rate is nearly thirty times the usual one. A fourth leaf is a rare variation, normally appearing in about one plant in five thousand. Clover spreads by runners, so a patch can be one plant repeated many times. A genetics class tested leaves from the corner and from three meters away. The corner samples matched each other and not the others. The mower has never got into that corner, which sits inside a fence angle. A clover left uncut grows more leaves and holds them longer. The bag used to reseed the lawn each spring lists a different clover variety on the label. Nobody has ever counted the clovers outside the corner.",
    q: "Why does that corner produce so many four-leaf clovers? Argue for one cause.",
    why: [
      "corner samples that match each other and not the lawn",
      "a seed bag listing a different variety from the corner's",
      "never mowed, inside a fence angle",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Clover spreads by runners, so a patch can be one plant repeated many times.”", "“The corner samples matched each other and not the others.”"], but: "“Nobody has ever counted the clovers outside the corner.”" },
      { who: 1, ev: ["“The bag used to reseed the lawn each spring lists a different clover variety on the label.”", "“A fourth leaf is a rare variation, normally appearing in about one plant in five thousand.”"], but: "“The corner samples matched each other and not the others.”" },
      { who: 2, ev: ["“The mower has never got into that corner, which sits inside a fence angle.”", "“A clover left uncut grows more leaves and holds them longer.”"], but: "“Clover spreads by runners, so a patch can be one plant repeated many times.”" },
    ],
    clears: [],
    note:
      "The last sentence is the trap and the best students will find it. If nobody has counted the clovers outside the corner, then thirty times the usual rate is thirty times a number nobody measured here. The corner is also the only place anybody looks, because it is the only place worth kneeling down in. That is a real objection to every one of the three answers.",
  },
  28: {
    story:
      "A puddle forms on the band room floor every summer and never in winter. The room is below ground on three sides. The puddle sits directly under a cold water pipe that runs along the ceiling. Summer air in the room reaches seventy-eight degrees with sixty-five percent humidity. The pipe's surface stays at fifty-four degrees year round. Water vapor condenses on any surface colder than the dew point of the surrounding air. The roof above that corner was patched, not replaced, and the patch is seven years old. Groundwater rises in summer here and the three buried walls have no damp course. A rust ring has formed on the pipe at the joint above the puddle.",
    q: "Where does the summer puddle come from? Pick one and prove it.",
    why: [
      "a pipe at fifty-four degrees in air at sixty-five percent humidity",
      "a seven-year-old patch above that corner",
      "a rust ring at the joint right above the puddle",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The pipe's surface stays at fifty-four degrees year round.”", "“Water vapor condenses on any surface colder than the dew point of the surrounding air.”"], but: "“A rust ring has formed on the pipe at the joint above the puddle.”" },
      { who: 1, ev: ["“The roof above that corner was patched, not replaced, and the patch is seven years old.”", "“Groundwater rises in summer here and the three buried walls have no damp course.”"], but: "“The puddle sits directly under a cold water pipe that runs along the ceiling.”" },
      { who: 2, ev: ["“A rust ring has formed on the pipe at the joint above the puddle.”", "“Summer air in the room reaches seventy-eight degrees with sixty-five percent humidity.”"], but: "“A puddle forms on the band room floor every summer and never in winter.”" },
    ],
    clears: [],
    note:
      "A rust ring is the kind of evidence that looks decisive and is not: a pipe that sweats all summer will rust at its joints whether or not it leaks. Say that out loud only after the class has argued. The seasonal pattern is the strongest fact in the case, and it fits condensation and rising groundwater equally well.",
  },
  29: {
    story:
      "All six rows went in on one day, from a single packet of seed. Five rows came up thick. The sixth is nearly empty. The empty row is the one nearest the brick wall. A soil test showed the sixth row at pH 8.4 while the others read 6.6. Beans will not germinate well in soil much above pH 7.5. Old mortar between bricks releases lime, and lime raises soil pH. The wall was repointed with new mortar in April, a month before planting. The wall shades row six until two in the afternoon. The hose reaches row six last, and whoever waters usually stops before the end. The few plants that did come up in row six are small and yellow.",
    q: "Why did one row fail to come up? Make the case for one cause.",
    who: [
      "",
      "🌳 Shade from the wall",
      "",
    ],
    why: [
      "pH 8.4 against 6.6, beside a wall repointed in April",
      "shaded by the wall until two in the afternoon",
      "watered last, by whoever usually stops before the end",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A soil test showed the sixth row at pH 8.4 while the others read 6.6.”", "“The wall was repointed with new mortar in April, a month before planting.”"], but: "“The hose reaches row six last, and whoever waters usually stops before the end.”" },
      { who: 1, ev: ["“The wall shades row six until two in the afternoon.”", "“The few plants that did come up in row six are small and yellow.”"], but: "“Beans will not germinate well in soil much above pH 7.5.”" },
      { who: 2, ev: ["“The hose reaches row six last, and whoever waters usually stops before the end.”", "“The empty row is the one nearest the brick wall.”"], but: "“Old mortar between bricks releases lime, and lime raises soil pH.”" },
    ],
    clears: [],
    note:
      "Everything bad about row six comes from being next to the wall, so the suspects are not independent and the class should notice that. The pH reading is the only measurement in the case, which makes it the strongest evidence, but shade and water explain small and yellow better than lime does. The two-part answers are the good ones here.",
  },
  30: {
    story:
      "The class incubator held twelve eggs, and nine of them hatched on day twenty-one. The three that did not were all in the back left corner of the tray. The incubator's thermometer sat in the front right corner and read ninety-nine degrees all month. A second thermometer placed in the back left corner read ninety-four. The heating element is mounted on the front wall of the box. Chick embryos need a steady ninety-nine to one hundred degrees to develop. Five degrees below that stops development without obviously spoiling the egg. The tray was never turned, and an unturned egg can stick to its own shell membrane. The three were the oldest eggs in the carton, collected four days before the rest.",
    q: "Why did three eggs fail to hatch? Choose a cause and prove it.",
    who: [
      "",
      "🔄 A tray never turned",
      "📅 The three oldest eggs",
    ],
    why: [
      "the back left corner reading ninety-four, far from the element",
      "a tray never turned, and an egg that can stick to its membrane",
      "the oldest three, collected four days before the rest",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A second thermometer placed in the back left corner read ninety-four.”", "“The heating element is mounted on the front wall of the box.”"], but: "“The three were the oldest eggs in the carton, collected four days before the rest.”" },
      { who: 1, ev: ["“The tray was never turned, and an unturned egg can stick to its own shell membrane.”", "“The class incubator held twelve eggs, and nine of them hatched on day twenty-one.”"], but: "“The three that did not were all in the back left corner of the tray.”" },
      { who: 2, ev: ["“The three were the oldest eggs in the carton, collected four days before the rest.”", "“Five degrees below that stops development without obviously spoiling the egg.”"], but: "“A second thermometer placed in the back left corner read ninety-four.”" },
    ],
    clears: [],
    note:
      "The three failed eggs are now the oldest eggs and the coldest eggs at the same time, which is the hardest shape a case can take. Nothing in the text says which came first. Ask what one extra fact would settle it, and the answer is where the old eggs were put, which nobody wrote down.",
  },
  31: {
    story:
      "The school's recycling weight dropped by half in October while the trash weight rose by the same amount. In September the district replaced every bin lid with a new design. The new opening is a four-inch round hole. A flattened cereal box and a milk jug will not fit through a four-inch hole. Students who cannot fit an item into the recycling bin put it in the trash. The cafeteria's recycling, which uses the old open-top bins, did not drop at all. Nobody told the students the lids had changed. Two of the eight bins were taken away in September for the corridor works. The night cleaning contract changed hands in October and the new crew empties bins into one cart.",
    q: "Why did the recycling weight drop by half? Argue for one cause.",
    why: [
      "a four-inch hole that a milk jug will not go through",
      "two of eight bins taken away for the corridor works",
      "a new night crew emptying bins into one cart",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A flattened cereal box and a milk jug will not fit through a four-inch hole.”", "“The cafeteria's recycling, which uses the old open-top bins, did not drop at all.”"], but: "“Two of the eight bins were taken away in September for the corridor works.”" },
      { who: 1, ev: ["“Two of the eight bins were taken away in September for the corridor works.”", "“Nobody told the students the lids had changed.”"], but: "“The school's recycling weight dropped by half in October while the trash weight rose by the same amount.”" },
      { who: 2, ev: ["“The night cleaning contract changed hands in October and the new crew empties bins into one cart.”", "“Students who cannot fit an item into the recycling bin put it in the trash.”"], but: "“The cafeteria's recycling, which uses the old open-top bins, did not drop at all.”" },
    ],
    clears: [],
    note:
      "Two of eight bins is a quarter, and the drop is a half, so that suspect can be argued but not all the way. The new crew is the one worth arguing hardest, because if recycling and trash go into the same cart the weights would move exactly as they did. The cafeteria is the control and it belongs in every strong answer, on either side.",
  },
  32: {
    story:
      "Every photograph from the field trip has a dark band across the bottom third. The band shows up indoors and outdoors alike. A camera's shutter is two curtains that cross the sensor in sequence. At fast shutter speeds they travel as a moving slit rather than opening fully. If the second curtain sticks, part of the frame receives less light than the rest. Shots taken at slow speeds that day came out evenly lit. The lens hood was fitted back to front, which brings its rim into the bottom of the frame. The camera was set to a scene mode that darkens the lower half for landscapes. Nobody changed any setting after breakfast.",
    q: "What made the dark band? Pick a cause and back it from the case.",
    who: [
      "",
      "🛡️ The lens hood on backwards",
      "⚙️ A scene mode setting",
    ],
    why: [
      "a second curtain that sticks at fast speeds",
      "a lens hood fitted back to front, rim in the frame",
      "a scene mode that darkens the lower half",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“If the second curtain sticks, part of the frame receives less light than the rest.”", "“Shots taken at slow speeds that day came out evenly lit.”"], but: "“The lens hood was fitted back to front, which brings its rim into the bottom of the frame.”" },
      { who: 1, ev: ["“The lens hood was fitted back to front, which brings its rim into the bottom of the frame.”", "“The band shows up indoors and outdoors alike.”"], but: "“Shots taken at slow speeds that day came out evenly lit.”" },
      { who: 2, ev: ["“The camera was set to a scene mode that darkens the lower half for landscapes.”", "“Nobody changed any setting after breakfast.”"], but: "“Every photograph from the field trip has a dark band across the bottom third.”" },
    ],
    clears: [],
    note:
      "The slow-speed shots are the test in this case and they only rule out two of the three. A hood or a setting would darken those frames as well, so the evenly lit ones are strong evidence for the shutter. Make the class say what a hood's shadow looks like against a curtain's: one has an edge shaped like a rim, the other is a straight band.",
  },
  33: {
    story:
      "A classroom spider plant has full growth on its left side and almost none on its right. One can waters both sides on the same days. The right side faces a window with a heating vent directly beneath it. Hot dry air from the vent blows up across that side for six hours a day. Spider plants lose water through their leaves faster than their roots can replace it. Dry moving air makes that worse. The leaf tips on the right side are brown and crisp. The window faces north and the right side gets about two hours of weak light. The pot was repotted in autumn and the root ball sits off centre, with the right side close to the clay.",
    q: "Why is one side of the plant bare? Make the case for one cause.",
    who: [
      "",
      "🌥️ Too little light",
      "",
    ],
    why: [
      "hot dry air from the vent for six hours a day",
      "a north window giving the right side two hours of weak light",
      "a root ball off centre, with the right side against the clay",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Hot dry air from the vent blows up across that side for six hours a day.”", "“The leaf tips on the right side are brown and crisp.”"], but: "“The window faces north and the right side gets about two hours of weak light.”" },
      { who: 1, ev: ["“The window faces north and the right side gets about two hours of weak light.”", "“Spider plants lose water through their leaves faster than their roots can replace it.”"], but: "“One can waters both sides on the same days.”" },
      { who: 2, ev: ["“The pot was repotted in autumn and the root ball sits off centre, with the right side close to the clay.”", "“Dry moving air makes that worse.”"], but: "“A classroom spider plant has full growth on its left side and almost none on its right.”" },
    ],
    clears: [],
    note:
      "Brown crisp tips are a drying injury and not a shortage of light, which is the fact that separates the first two. The light argument has to explain the tips, and a student who tries is reasoning properly even if they end up switching sides. Watch for the easy error of treating the same can of water as proof that both sides got the same water.",
  },
  34: {
    story:
      "The fifth grade's homemade ice cream came out full of hard ice crystals instead of smooth. The mixture froze in the school freezer, which was set to minus ten degrees. Last year the class used an ice-and-salt bag, which holds about fourteen degrees. Slow freezing lets water molecules join into large crystals. The freezer cycles its compressor on and off, and the mix partly thawed and refroze nine times overnight. Each thaw and refreeze builds bigger crystals than the one before. Nobody stirred the mixture once it went in, where last year the bag was shaken for twenty minutes. The cream was the low-fat kind this year, and fat is what keeps crystals small. The tub sat uncovered on the top shelf.",
    q: "Why was the ice cream full of crystals? Choose a cause and prove it.",
    who: [
      "",
      "🥄 Never stirred",
      "🥛 Low-fat cream",
    ],
    why: [
      "nine thaws and refreezes as the compressor cycled",
      "never stirred, where last year the bag was shaken twenty minutes",
      "low-fat cream, and fat is what keeps crystals small",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The freezer cycles its compressor on and off, and the mix partly thawed and refroze nine times overnight.”", "“Each thaw and refreeze builds bigger crystals than the one before.”"], but: "“The cream was the low-fat kind this year, and fat is what keeps crystals small.”" },
      { who: 1, ev: ["“Nobody stirred the mixture once it went in, where last year the bag was shaken for twenty minutes.”", "“Slow freezing lets water molecules join into large crystals.”"], but: "“The mixture froze in the school freezer, which was set to minus ten degrees.”" },
      { who: 2, ev: ["“The cream was the low-fat kind this year, and fat is what keeps crystals small.”", "“The tub sat uncovered on the top shelf.”"], but: "“Last year the class used an ice-and-salt bag, which holds about fourteen degrees.”" },
    ],
    clears: [],
    note:
      "Three things changed from last year at once, which is what makes this a debate rather than a puzzle. The best answers set them against the one surprise in the case: the freezer was far colder than last year's bag, and colder should have helped. Any suspect that cannot explain why colder made it worse has work to do.",
  },
  35: {
    story:
      "Half the field day ribbons came out of storage faded nearly white. The other half kept their color. They were stored in one cabinet in two boxes. The faded ones were in the box on the top shelf, next to a south-facing window with no blind. The second box sat on the bottom shelf in shadow. Sunlight breaks down the dye molecules in colored cloth over time. The faded ribbons are palest on the side that faced the window. The cabinet door has a glass panel in its upper half. The top shelf is directly under an uninsulated roof and runs hot all summer. The top box was printed from the end of the dye batch, when the colour ran thin.",
    q: "Why did half the ribbons fade? Argue for one cause.",
    who: [
      "",
      "🔥 Heat under the roof",
      "🖨️ The end of the dye batch",
    ],
    why: [
      "a top shelf by a south window, palest on the window side",
      "a top shelf under an uninsulated roof, hot all summer",
      "printed from the end of the batch, when the colour ran thin",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Sunlight breaks down the dye molecules in colored cloth over time.”", "“The faded ribbons are palest on the side that faced the window.”"], but: "“The top shelf is directly under an uninsulated roof and runs hot all summer.”" },
      { who: 1, ev: ["“The top shelf is directly under an uninsulated roof and runs hot all summer.”", "“The second box sat on the bottom shelf in shadow.”"], but: "“The cabinet door has a glass panel in its upper half.”" },
      { who: 2, ev: ["“The top box was printed from the end of the dye batch, when the colour ran thin.”", "“Half the field day ribbons came out of storage faded nearly white.”"], but: "“The faded ribbons are palest on the side that faced the window.”" },
    ],
    clears: [],
    note:
      "Palest on the window side is the sentence that decides this, and it is the one to hold the class to. Heat and a thin dye batch would fade a ribbon evenly, so neither explains a direction. A student who argues for heat and admits they cannot explain the direction is ahead of a student who picks sunlight and never notices why.",
  },
  36: {
    story:
      "The helium balloons were floating at four o'clock. By nine the next morning they rested on the floor. The latex balloons sagged while the foil ones beside them still floated. Helium atoms are small enough to pass between the molecules of a latex wall. Foil balloons have a metal layer with no gaps that size. A balloon that loses helium also loses lift and sinks before it visibly shrinks. The heating went off at six and the hall fell to five degrees by morning. Gas shrinks as it cools, and a smaller balloon pushes aside less air. The latex balloons were filled first, two hours before the foil ones. The knots on three latex balloons had worked loose enough to wet a finger held against them.",
    q: "Why did only some balloons sink? Pick one cause and prove it.",
    who: [
      "",
      "🥶 The cold hall",
      "🪢 Three loose knots",
    ],
    why: [
      "helium passing straight through a latex wall",
      "the hall at five degrees by morning, and gas shrinks as it cools",
      "three knots loose enough to wet a finger",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Helium atoms are small enough to pass between the molecules of a latex wall.”", "“Foil balloons have a metal layer with no gaps that size.”"], but: "“The heating went off at six and the hall fell to five degrees by morning.”" },
      { who: 1, ev: ["“The heating went off at six and the hall fell to five degrees by morning.”", "“Gas shrinks as it cools, and a smaller balloon pushes aside less air.”"], but: "“The latex balloons sagged while the foil ones beside them still floated.”" },
      { who: 2, ev: ["“The knots on three latex balloons had worked loose enough to wet a finger held against them.”", "“The latex balloons were filled first, two hours before the foil ones.”"], but: "“A balloon that loses helium also loses lift and sinks before it visibly shrinks.”" },
    ],
    clears: [],
    note:
      "The foil balloons are the control and they beat the cold argument on their own, because they stood in the same five degrees and stayed up. That leaves the wall and the knots, and both of them are leaks through latex. Ask how many balloons each one explains: the knots account for three, and the case does not say how many sank.",
  },
};
