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
};
