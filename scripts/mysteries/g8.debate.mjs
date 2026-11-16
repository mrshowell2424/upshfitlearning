/**
 * Grade 8, the debate version of each case. See scripts/mysteries/g5.debate.mjs
 * for what these files are and what the gate holds them to.
 *
 * The ordinary grade 8 case turns on a record that does not describe what it
 * claims to: a log written from memory, a count taken off the labels, a
 * reading taken during silent reading. The lesson is to stop trusting a
 * number because it is written down, and it works because exactly one thing
 * in the case is lying.
 *
 * The debate versions put a second and a third suspect record in play. Now
 * the log was written from memory AND the door seal is split. The count came
 * off the labels AND nobody opened a box at the door. The student can no
 * longer find the one bad record and stop; they have to argue about which
 * bad record accounts for the size of what went wrong.
 *
 * Five suspects means three open and two genuinely cleared, so the
 * elimination work survives and the argument sits on top of it.
 */
export const DEBATES = {
  1: {
    story:
      "The circulation report shows one copy of Hatchet checked out to two students at once. Ms. Vega holds both copies on the desk, and the spines are plainly different ages. The older copy was bought in 2011 and the newer one replaced a lost book in 2019. The 2019 replacement was entered by copying the record of the book it replaced. Copying a record copies its barcode, and two items then answer to one number. One of the two students borrowed a card from a friend in September and never gave it back. The desk scanner has misread two barcodes this term, both of them worn. The older copy's barcode is rubbed pale across its middle three digits. The system clock and the office clock match to the second. The report adds up what the records say and adds nothing of its own.",
    q: "How is one book out to two students? Pick one cause and prove it.",
    why: [
      "a 2019 record copied from the book it replaced",
      "a card borrowed in September and never given back",
      "two misreads this term, both on worn barcodes",
      "a system clock agreeing with the office to the second",
      "a report that adds nothing of its own",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The 2019 replacement was entered by copying the record of the book it replaced.”", "“Copying a record copies its barcode, and two items then answer to one number.”"], but: "“One of the two students borrowed a card from a friend in September and never gave it back.”" },
      { who: 1, ev: ["“One of the two students borrowed a card from a friend in September and never gave it back.”", "“Ms. Vega holds both copies on the desk, and the spines are plainly different ages.”"], but: "“Copying a record copies its barcode, and two items then answer to one number.”" },
      { who: 2, ev: ["“The desk scanner has misread two barcodes this term, both of them worn.”", "“The older copy's barcode is rubbed pale across its middle three digits.”"], but: "“The 2019 replacement was entered by copying the record of the book it replaced.”" },
    ],
    clears: [
      "The system clock: “The system clock and the office clock match to the second.”",
      "The circulation report: “The report adds up what the records say and adds nothing of its own.”",
    ],
    note:
      "Both students have a real book in their hands, and that fact survives every answer. The question is only how two objects came to share one number. A borrowed card explains who did the borrowing and not why the system allowed one item out twice.",
  },
  2: {
    story:
      "Food in the staff refrigerator spoiled over a week in which the log read 38 degrees daily. All five lines read exactly 38, with no variation of even a single degree. All five were written in the same blue pen in one continuous hand. A refrigerator opened and closed all day does not hold one reading for five days. The log was filled in on Friday afternoon from memory for the whole week. A dial thermometer left in overnight on Friday read 47 by morning. The door seal has a two-inch split along its lower edge that nobody has reported. A split seal lets warm air in steadily without the compressor ever stopping. The compressor has run without pause since Tuesday, which is not how it should behave. Friday's ice-water test put the inside thermometer at 32, dead right. The building logged no break in its supply at any hour that week.",
    q: "Why did the food spoil? Choose one cause and quote the story.",
    why: [
      "five identical lines in one hand, written Friday from memory",
      "a thermometer that read 32 correctly in ice water",
      "a two-inch split along the seal's lower edge",
      "no power interruption recorded in the building that week",
      "a compressor running without pause since Tuesday",
    ],
    open: [0, 2, 4],
    for: [
      { who: 0, ev: ["“All five were written in the same blue pen in one continuous hand.”", "“The log was filled in on Friday afternoon from memory for the whole week.”"], but: "“A dial thermometer left in overnight on Friday read 47 by morning.”" },
      { who: 2, ev: ["“The door seal has a two-inch split along its lower edge that nobody has reported.”", "“A split seal lets warm air in steadily without the compressor ever stopping.”"], but: "“All five lines read exactly 38, with no variation of even a single degree.”" },
      { who: 4, ev: ["“The compressor has run without pause since Tuesday, which is not how it should behave.”", "“A dial thermometer left in overnight on Friday read 47 by morning.”"], but: "“The log was filled in on Friday afternoon from memory for the whole week.”" },
    ],
    clears: [
      "A broken thermometer: “Friday's ice-water test put the inside thermometer at 32, dead right.”",
      "A power cut: “The building logged no break in its supply at any hour that week.”",
    ],
    note:
      "The log is a bad record and a bad record does not spoil food. That distinction is the whole case. Something made the refrigerator warm and something else hid it, and the honest answer says which suspect is doing which job.",
  },
  3: {
    story:
      "The order was for two hundred pencils and the supply closet holds one hundred and fifty. Eight boxes arrived, and every box label reads twenty-five count in bold print. Eight boxes at twenty-five each is the two hundred the invoice charged for. Mr. Hale opened every box and counted what was inside each one. Six boxes held twenty-five pencils and two held exactly eighteen apiece. The supplier changed its packaging in the autumn and kept printing the old label. Six twenty-fives and two eighteens come to one hundred and eighty-six, not two hundred. The delivery note is signed but nobody opened a box at the door. The shelf count of a hundred and fifty was taken by reading labels, not pencils. That closet has stayed locked since delivery and one key exists. Not a pencil has left that closet since the boxes came in.",
    q: "Where are the missing pencils? Make the case for one cause.",
    why: [
      "an old label kept in print after the packaging changed",
      "a closet locked since delivery, with one key",
      "a note signed without a box being opened at the door",
      "no pencil handed out since the boxes arrived",
      "a shelf count taken by reading labels, not pencils",
    ],
    open: [0, 2, 4],
    for: [
      { who: 0, ev: ["“The supplier changed its packaging in the autumn and kept printing the old label.”", "“Six boxes held twenty-five pencils and two held exactly eighteen apiece.”"], but: "“The delivery note is signed but nobody opened a box at the door.”" },
      { who: 2, ev: ["“The delivery note is signed but nobody opened a box at the door.”", "“Eight boxes at twenty-five each is the two hundred the invoice charged for.”"], but: "“The supplier changed its packaging in the autumn and kept printing the old label.”" },
      { who: 4, ev: ["“The shelf count of a hundred and fifty was taken by reading labels, not pencils.”", "“Six twenty-fives and two eighteens come to one hundred and eighty-six, not two hundred.”"], but: "“Mr. Hale opened every box and counted what was inside each one.”" },
    ],
    clears: [
      "Somebody taking them: “That closet has stayed locked since delivery and one key exists.”",
      "Pencils handed out: “Not a pencil has left that closet since the boxes came in.”",
    ],
    note:
      "There are three numbers here and the class should write all of them down: two hundred ordered, one hundred and eighty-six actually in the boxes, one hundred and fifty on the shelf. Fourteen went missing between the invoice and the delivery. Thirty-six more went missing between the delivery and the shelf, and only one answer touches that second gap.",
  },
  4: {
    story:
      "Group C's apples each weighed about forty grams more than every other group's. Group C weighed each apple sitting in a small plastic tray for steadiness. The other three groups set each apple directly on the scale plate. A scale zeroed empty counts whatever sits on it, tray included. The trays from that set weigh thirty-nine grams each on a checked balance. Group C zeroed its scale before the tray went on and not after. Group C's scale has not been checked against a known weight this year. The other three were all checked against a hundred-gram mass last week. Group C wrote its numbers from the display an hour after weighing, from notes. Calipers put every group's apples within a millimetre of each other. One crate on one morning supplied all four groups.",
    q: "Why are Group C's apples heavier? Pick one cause and back it up.",
    why: [
      "a thirty-nine gram tray, with the scale zeroed before it went on",
      "calipers matching every group to within a millimetre",
      "a scale never checked against a known weight this year",
      "one crate on one morning for all four groups",
      "numbers written an hour later, from notes",
    ],
    open: [0, 2, 4],
    for: [
      { who: 0, ev: ["“The trays from that set weigh thirty-nine grams each on a checked balance.”", "“Group C zeroed its scale before the tray went on and not after.”"], but: "“Group C's scale has not been checked against a known weight this year.”" },
      { who: 2, ev: ["“Group C's scale has not been checked against a known weight this year.”", "“The other three were all checked against a hundred-gram mass last week.”"], but: "“The trays from that set weigh thirty-nine grams each on a checked balance.”" },
      { who: 4, ev: ["“Group C wrote its numbers from the display an hour after weighing, from notes.”", "“Group C's apples each weighed about forty grams more than every other group's.”"], but: "“A scale zeroed empty counts whatever sits on it, tray included.”" },
    ],
    clears: [
      "Bigger apples: “Calipers put every group's apples within a millimetre of each other.”",
      "A different crate: “One crate on one morning supplied all four groups.”",
    ],
    note:
      "Thirty-nine grams and about forty grams is as close a match as this kind of evidence gets, and the class should say so out loud. An uncalibrated scale could be out by any amount at all, which makes it a worse explanation for a number that lands so precisely.",
  },
  5: {
    story:
      "Priya's bike computer says she rode fourteen miles on a route the map measures at eleven. It has said the same thing on four different rides this month. A bike computer counts wheel turns and multiplies by the wheel size it is set to. Her setting reads 2096 millimetres, the figure for a 700c road wheel. Her bike has 26-inch wheels, which roll about 2070 millimetres a turn. The ratio between fourteen and eleven is far larger than those two wheel figures explain. The map was measured along the road centre line and her route runs the verge. A verge route on a winding road can add a tenth to the distance. The computer has shown fourteen even on a ride she cut short at the bridge. No detour was taken, and her partner's computer showed eleven. The magnet sits tight, and a loose magnet undercounts rather than over.",
    q: "Why does the computer read fourteen? Choose one cause and prove it.",
    why: [
      "a 2096 setting on a wheel that rolls about 2070",
      "a map measured along the centre line, not the verge",
      "a partner's computer reading eleven on the same route",
      "a tight magnet, where a loose one would undercount",
      "fourteen shown even on a ride cut short at the bridge",
    ],
    open: [0, 1, 4],
    for: [
      { who: 0, ev: ["“Her setting reads 2096 millimetres, the figure for a 700c road wheel.”", "“Her bike has 26-inch wheels, which roll about 2070 millimetres a turn.”"], but: "“The ratio between fourteen and eleven is far larger than those two wheel figures explain.”" },
      { who: 1, ev: ["“The map was measured along the road centre line and her route runs the verge.”", "“A verge route on a winding road can add a tenth to the distance.”"], but: "“It has said the same thing on four different rides this month.”" },
      { who: 4, ev: ["“The computer has shown fourteen even on a ride she cut short at the bridge.”", "“A bike computer counts wheel turns and multiplies by the wheel size it is set to.”"], but: "“Her setting reads 2096 millimetres, the figure for a 700c road wheel.”" },
    ],
    clears: [
      "A detour: “No detour was taken, and her partner's computer showed eleven.”",
      "A loose magnet: “The magnet sits tight, and a loose magnet undercounts rather than over.”",
    ],
    note:
      "The wheel setting is only one percent out and the reading is twenty-seven percent out, which the case states in its own words. That gap is the heart of it. The ride she cut short is the hardest fact of all, because no wheel setting gives you the same number for two different distances.",
  },
  6: {
    story:
      "The nitrate test reads zero every week while the fish hang near the surface and eat poorly. Something is always breaking down waste, and the end of that process is nitrate. The kit's second bottle must be shaken hard for thirty seconds before use. Its contents settle into a layer that will not mix on its own. The class has been adding drops from a bottle nobody has shaken since October. A sample taken to the pet shop on Saturday tested at 80 parts per million. The kit was bought second hand and its printed date has been worn off the box. A reagent two years old gives a false low whether it is shaken or not. The class reads the colour against the chart under a yellow desk lamp. Yellow light makes a pink card look paler than it is. A stocked tank running since September cannot truly sit at zero nitrate. The filter turns, the heater sits at 76, and the water is clear.",
    q: "Why does the test read zero? Make the case for one cause.",
    why: [
      "a second bottle nobody has shaken since October",
      "bought second hand, with the date worn off the box",
      "zero in a stocked tank since September, which is not believable",
      "a running filter, a heater at 76 and clear water",
      "a colour read under a yellow desk lamp",
    ],
    open: [0, 1, 4],
    for: [
      { who: 0, ev: ["“The class has been adding drops from a bottle nobody has shaken since October.”", "“Its contents settle into a layer that will not mix on its own.”"], but: "“The kit was bought second hand and its printed date has been worn off the box.”" },
      { who: 1, ev: ["“The kit was bought second hand and its printed date has been worn off the box.”", "“A reagent two years old gives a false low whether it is shaken or not.”"], but: "“Its contents settle into a layer that will not mix on its own.”" },
      { who: 4, ev: ["“The class reads the colour against the chart under a yellow desk lamp.”", "“Yellow light makes a pink card look paler than it is.”"], but: "“A sample taken to the pet shop on Saturday tested at 80 parts per million.”" },
    ],
    clears: [
      "A very clean tank: “A stocked tank running since September cannot truly sit at zero nitrate.”",
      "The heater: “The filter turns, the heater sits at 76, and the water is clear.”",
    ],
    note:
      "Three ways to get a false low and the pet shop proves the water is at 80, so the tank is not in doubt at all. A pale reading is not the same as a zero reading, and the lamp answer has to explain a test that comes out blank rather than faint.",
  },
  7: {
    story:
      "A phone app recorded Room 4 at 55 decibels, which the report called a quiet classroom. All six readings fall between 10:05 and 10:08 on three different mornings. Room 4 holds silent independent reading from ten o'clock until ten fifteen. A measurement describes the moment it was taken and nothing on either side of it. On Thursday, during group work, the app itself reached 74 decibels. The report quoted only the six morning figures and left the Thursday ones out. The app was last calibrated in August against a meter that has since failed its own check. A phone microphone drifts by several decibels over a term of pocket use. A district meter put the room at 78 decibels at half past one. The phone's microphone was clear and free of dust when it was opened.",
    q: "Why does Room 4 read quiet? Pick one cause and quote the story.",
    why: [
      "six readings between 10:05 and 10:08, inside silent reading",
      "a microphone clear and free of dust when it was opened",
      "a district meter reading 78 at half past one",
      "calibrated against a meter that has since failed its own check",
      "six morning figures quoted and Thursday's left out",
    ],
    open: [0, 3, 4],
    for: [
      { who: 0, ev: ["“All six readings fall between 10:05 and 10:08 on three different mornings.”", "“Room 4 holds silent independent reading from ten o'clock until ten fifteen.”"], but: "“The app was last calibrated in August against a meter that has since failed its own check.”" },
      { who: 3, ev: ["“The app was last calibrated in August against a meter that has since failed its own check.”", "“A phone microphone drifts by several decibels over a term of pocket use.”"], but: "“On Thursday, during group work, the app itself reached 74 decibels.”" },
      { who: 4, ev: ["“The report quoted only the six morning figures and left the Thursday ones out.”", "“A measurement describes the moment it was taken and nothing on either side of it.”"], but: "“All six readings fall between 10:05 and 10:08 on three different mornings.”" },
    ],
    clears: [
      "A bad microphone: “The phone's microphone was clear and free of dust when it was opened.”",
      "A genuinely quiet room: “A district meter put the room at 78 decibels at half past one.”",
    ],
    note:
      "The app reached 74 on Thursday, which means the app can measure loud when loud is happening. That beats the calibration answer on its own evidence. What is left is whether the fault was in choosing the minute or in choosing which minutes to print, and those are two different kinds of wrong.",
  },
  8: {
    story:
      "Group B counted 340 fallen leaves in its square where the other groups counted around 90. Group B set its frame directly against the base of the north fence. Wind pushes fallen leaves until something stops them, and a fence stops them. Leaves pile deep along a barrier and thin out across open ground. The other four frames were set at random points across the open lawn. A sample taken where a thing collects will not describe the ground around it. Group B's frame is the wooden one, which measures one metre on the outside. The other four are the wire frames, which measure one metre on the inside. Group B counted every piece larger than a thumbnail as a leaf. The others left out anything torn, by the agreement made that morning. All five counted on the same Friday within half an hour of each other. Group B's tally was checked twice by two different students and matched.",
    q: "Why did Group B count 340? Choose one cause and prove it.",
    why: [
      "a frame set against the base of the north fence",
      "a wooden frame measured on the outside, not the inside",
      "every piece larger than a thumbnail counted as a leaf",
      "all five counting on one Friday within half an hour",
      "a tally checked twice by two students and matched",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Group B set its frame directly against the base of the north fence.”", "“Leaves pile deep along a barrier and thin out across open ground.”"], but: "“Group B's frame is the wooden one, which measures one metre on the outside.”" },
      { who: 1, ev: ["“Group B's frame is the wooden one, which measures one metre on the outside.”", "“The other four are the wire frames, which measure one metre on the inside.”"], but: "“Wind pushes fallen leaves until something stops them, and a fence stops them.”" },
      { who: 2, ev: ["“Group B counted every piece larger than a thumbnail as a leaf.”", "“The others left out anything torn, by the agreement made that morning.”"], but: "“The other four frames were set at random points across the open lawn.”" },
    ],
    clears: [
      "Counting at a different hour: “All five counted on the same Friday within half an hour of each other.”",
      "Careless counting: “Group B's tally was checked twice by two different students and matched.”",
    ],
    note:
      "340 against 90 is nearly four times, and the class should ask what each answer is worth. A frame measured outside instead of inside is a few percent of area. Counting torn pieces might add a third. Only the fence is the right size, and the arithmetic is how you show it rather than feel it.",
  },
  9: {
    story:
      "The pumpkin lost weight for three weeks, gained nine ounces in week four, and lost again after. Weeks one, two, three and five were weighed at noon in dry weather. Week four was weighed at seven in the morning after a night of heavy rain. The porch rail is open on the weather side and the pumpkin sat in the wet. Water on a surface is weighed along with whatever is under it. Nine ounces is about half a cup, which a wet skin can easily hold. The kitchen scale was dropped in week three and has not been checked since. A dropped scale can read high by a fixed amount until it is rezeroed. Week four was the only week the science room scale was used instead. The two scales have never been compared against one known weight. Every reading was photographed, and week four's photograph matches the sheet. A cut pumpkin on a porch loses water steadily and does not take it back.",
    q: "Why did week four gain weight? Make the case for one cause.",
    why: [
      "seven in the morning after a night of heavy rain",
      "a kitchen scale dropped in week three and never checked",
      "a photograph of week four matching the sheet",
      "a cut pumpkin that loses water and does not take it back",
      "the only week the science room scale was used",
    ],
    open: [0, 1, 4],
    for: [
      { who: 0, ev: ["“Week four was weighed at seven in the morning after a night of heavy rain.”", "“Nine ounces is about half a cup, which a wet skin can easily hold.”"], but: "“The kitchen scale was dropped in week three and has not been checked since.”" },
      { who: 1, ev: ["“The kitchen scale was dropped in week three and has not been checked since.”", "“A dropped scale can read high by a fixed amount until it is rezeroed.”"], but: "“Weeks one, two, three and five were weighed at noon in dry weather.”" },
      { who: 4, ev: ["“Week four was the only week the science room scale was used instead.”", "“The two scales have never been compared against one known weight.”"], but: "“Water on a surface is weighed along with whatever is under it.”" },
    ],
    clears: [
      "A miscopied number: “Every reading was photographed, and week four's photograph matches the sheet.”",
      "A pumpkin actually gaining: “A cut pumpkin on a porch loses water steadily and does not take it back.”",
    ],
    note:
      "A dropped kitchen scale would push weeks four and five both high, and week five came back down. That is the test the case hands you for free. The two-scale answer is the quiet one: nobody has ever compared them, so nobody knows what week four's number means.",
  },
  10: {
    story:
      "The print in the flowerbed measured eleven and a half inches, pointing to a very large shoe. The print was never measured in the bed itself before the rain came. It was scaled from a photograph, using a brick in the frame as the reference. The measurer assumed the bricks were eight inches long, as most bricks are. The school's walls are built of a seven-inch brick used only in this county. Every length taken from that photograph is therefore about one part in eight too large. The bed had been watered that morning and the soil was soft and loose. Soft wet soil spreads under a sole and records a print wider than the shoe. The photograph was taken at an angle of about thirty degrees to the ground. A length measured across a tilted photograph comes out longer than it is. Nobody at the school wears a shoe anywhere near eleven inches. The tape used on the photograph was checked against a steel rule and is true.",
    q: "Why did the print measure eleven and a half? Pick one cause and prove it.",
    why: [
      "an eight-inch assumption on a seven-inch brick",
      "nobody at the school wearing near eleven inches",
      "a tape checked against a steel rule and found true",
      "soft wet soil that spreads under a sole",
      "a photograph taken at thirty degrees to the ground",
    ],
    open: [0, 3, 4],
    for: [
      { who: 0, ev: ["“The measurer assumed the bricks were eight inches long, as most bricks are.”", "“The school's walls are built of a seven-inch brick used only in this county.”"], but: "“The photograph was taken at an angle of about thirty degrees to the ground.”" },
      { who: 3, ev: ["“The bed had been watered that morning and the soil was soft and loose.”", "“Soft wet soil spreads under a sole and records a print wider than the shoe.”"], but: "“Every length taken from that photograph is therefore about one part in eight too large.”" },
      { who: 4, ev: ["“The photograph was taken at an angle of about thirty degrees to the ground.”", "“A length measured across a tilted photograph comes out longer than it is.”"], but: "“It was scaled from a photograph, using a brick in the frame as the reference.”" },
    ],
    clears: [
      "A genuinely huge shoe: “Nobody at the school wears a shoe anywhere near eleven inches.”",
      "A faulty ruler: “The tape used on the photograph was checked against a steel rule and is true.”",
    ],
    note:
      "Three different errors all push the number the same way, which is why eleven and a half is so far out. The brick is worth an eighth, the tilt is worth something nobody has calculated, and the soil is worth whatever a soft bed gives. Ask the class to put a number on each before choosing.",
  },
  11: {
    story:
      "The October report shows ridership on route 6 down thirty percent from September. The driver says the bus is as full as it has ever been in her years there. The driver keeps a hand tally at the front door and that is the count. In late September the school began letting students board through the rear door. The tally sheet has no line for the rear door and never has had one. Students boarding at the rear are not counted anywhere in the system. The driver's clicker jammed twice in October and was replaced in the second week. A clicker that sticks records one press where two were made. The tally sheet's total is copied into the report by hand each Friday. Three Fridays in October the sheet and the report disagree by more than ten. Four more students now live along that route than did in September. No fare has ever been charged on route 6, so the box counts nothing.",
    q: "Why is ridership down thirty percent? Choose one cause and quote the story.",
    why: [
      "a rear door opened in September with no line on the sheet",
      "enrollment up four students over the same month",
      "a clicker that jammed twice before being replaced",
      "a fare box on a route that has never charged a fare",
      "a sheet copied by hand, disagreeing on three Fridays",
    ],
    open: [0, 2, 4],
    for: [
      { who: 0, ev: ["“In late September the school began letting students board through the rear door.”", "“Students boarding at the rear are not counted anywhere in the system.”"], but: "“The driver's clicker jammed twice in October and was replaced in the second week.”" },
      { who: 2, ev: ["“The driver's clicker jammed twice in October and was replaced in the second week.”", "“A clicker that sticks records one press where two were made.”"], but: "“Students boarding at the rear are not counted anywhere in the system.”" },
      { who: 4, ev: ["“The tally sheet's total is copied into the report by hand each Friday.”", "“Three Fridays in October the sheet and the report disagree by more than ten.”"], but: "“The driver keeps a hand tally at the front door and that is the count.”" },
    ],
    clears: [
      "Fewer students riding: “Four more students now live along that route than did in September.”",
      "The fare box: “No fare has ever been charged on route 6, so the box counts nothing.”",
    ],
    note:
      "Nobody disputes that the bus is full, so the thirty percent is a fact about the paperwork. Three places in that paperwork can lose a rider: the door, the clicker and the copying. Ask which of the three could lose thirty percent and which could only lose a handful.",
  },
  12: {
    story:
      "The relay trophy is engraved 1998, and the record book says the team won in 1997. The case holds eleven other trophies from eleven other seasons on the same shelf. Every one of them is engraved with a year one later than its season in the book. Trophies in this league are presented at the spring banquet following the autumn season. The engraving records the year of presentation, which the league has always done. The engraver for all twelve was the same firm, which kept one template on file. A template carried forward year to year carries its mistakes forward too. The 1998 plate was unscrewed and refitted in 2004 when the base was repaired. Screw holes on that plate are oval, which is what refitting leaves behind. What the book writes down is the season's year, which is a different thing. The eleven other trophies are not in question and nobody disputes their dates.",
    q: "Why does the trophy say 1998? Make the case for one cause.",
    why: [
      "presentation at the spring banquet after an autumn season",
      "one firm, one template, carried forward twelve times",
      "a book that records the season year, a different thing",
      "a plate unscrewed in 2004, with oval screw holes",
      "eleven others whose dates nobody disputes",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“Trophies in this league are presented at the spring banquet following the autumn season.”", "“The engraving records the year of presentation, which the league has always done.”"], but: "“The engraver for all twelve was the same firm, which kept one template on file.”" },
      { who: 1, ev: ["“The engraver for all twelve was the same firm, which kept one template on file.”", "“A template carried forward year to year carries its mistakes forward too.”"], but: "“Every one of them is engraved with a year one later than its season in the book.”" },
      { who: 3, ev: ["“The 1998 plate was unscrewed and refitted in 2004 when the base was repaired.”", "“Screw holes on that plate are oval, which is what refitting leaves behind.”"], but: "“Every one of them is engraved with a year one later than its season in the book.”" },
    ],
    clears: [
      "A wrong record book: “What the book writes down is the season's year, which is a different thing.”",
      "The other eleven trophies: “The eleven other trophies are not in question and nobody disputes their dates.”",
    ],
    note:
      "A template carried forward and a league rule about banquets look identical from the outside, and the class should feel how close those two answers sit. One says the engraving is correct and the other says it is wrong in the same way twelve times. Only one of them makes the trophy worth rebilling.",
  },
  13: {
    story:
      "The probe read 181 degrees and the thigh ran pink when it was carved. What the recipe asks for is the thickest part of the thigh, well clear of bone. The cook pushed the probe in until it met resistance and stopped. Resistance in a thigh means bone, and bone sits right against the oven's heat. Bone carries heat faster than meat and runs hotter than the flesh around it. Moved an inch back into the muscle, the same probe read 154. The oven's left side ran nine degrees hotter than its right on the day. The bird sat with its left thigh toward that side for the whole roast. The reading was taken once, at three o'clock, and written straight onto the card. A single reading in one spot describes one spot at one moment. That morning the probe was held in boiling water and showed 212 exactly. The recipe has been followed in this kitchen for eleven years without trouble.",
    q: "Why did the probe read 181? Pick one cause and back it up.",
    why: [
      "a probe pushed to resistance, which in a thigh means bone",
      "a boiling-water test reading 212 exactly",
      "a left side nine degrees hotter, with the left thigh toward it",
      "a recipe followed in this kitchen for eleven years",
      "one reading, taken once at three o'clock",
    ],
    open: [0, 2, 4],
    for: [
      { who: 0, ev: ["“The cook pushed the probe in until it met resistance and stopped.”", "“Resistance in a thigh means bone, and bone sits right against the oven's heat.”"], but: "“The oven's left side ran nine degrees hotter than its right on the day.”" },
      { who: 2, ev: ["“The oven's left side ran nine degrees hotter than its right on the day.”", "“The bird sat with its left thigh toward that side for the whole roast.”"], but: "“Moved an inch back into the muscle, the same probe read 154.”" },
      { who: 4, ev: ["“The reading was taken once, at three o'clock, and written straight onto the card.”", "“A single reading in one spot describes one spot at one moment.”"], but: "“Bone carries heat faster than meat and runs hotter than the flesh around it.”" },
    ],
    clears: [
      "A faulty thermometer: “That morning the probe was held in boiling water and showed 212 exactly.”",
      "The recipe: “The recipe has been followed in this kitchen for eleven years without trouble.”",
    ],
    note:
      "One inch and twenty-seven degrees is the measurement that carries this case. The oven answer has to explain why the same probe in the same bird a minute later read 154, which has nothing to do with which side was hotter.",
  },
  14: {
    story:
      "Period 2's cupcakes came out dry and tough and period 4's came out tender. Period 2 scooped the measuring cup straight down into the sack and levelled it. Period 4 spooned flour loosely into the cup and then levelled it off. Scooping packs flour into a cup and spooning leaves it loose. Weighed afterwards, period 2's cup came to 148 grams and period 4's to 123. That is a fifth more flour in a recipe where a fifth is the difference. Period 2's tray sat in the oven four minutes past the timer while a class was dismissed. Four extra minutes on a small cake dries it through rather than browning it. The recipe says one cup of flour and never says what a cup should weigh. A recipe that names a volume leaves the weight to whoever fills the cup. Both classes baked on the middle rack of the same oven at the same setting. The flour for both came out of one sack in one storeroom.",
    q: "Why was one batch dry and tough? Choose one cause and prove it.",
    why: [
      "a cup scooped into the sack and levelled, at 148 grams",
      "the middle rack of one oven at one setting for both",
      "one sack in one storeroom for both classes",
      "four minutes past the timer while a class was dismissed",
      "a recipe naming a volume and never a weight",
    ],
    open: [0, 3, 4],
    for: [
      { who: 0, ev: ["“Period 2 scooped the measuring cup straight down into the sack and levelled it.”", "“Weighed afterwards, period 2's cup came to 148 grams and period 4's to 123.”"], but: "“Period 2's tray sat in the oven four minutes past the timer while a class was dismissed.”" },
      { who: 3, ev: ["“Period 2's tray sat in the oven four minutes past the timer while a class was dismissed.”", "“Four extra minutes on a small cake dries it through rather than browning it.”"], but: "“Scooping packs flour into a cup and spooning leaves it loose.”" },
      { who: 4, ev: ["“The recipe says one cup of flour and never says what a cup should weigh.”", "“A recipe that names a volume leaves the weight to whoever fills the cup.”"], but: "“Weighed afterwards, period 2's cup came to 148 grams and period 4's to 123.”" },
    ],
    clears: [
      "The oven: “Both classes baked on the middle rack of the same oven at the same setting.”",
      "A different flour: “The flour for both came out of one sack in one storeroom.”",
    ],
    note:
      "Dry and tough are two words and they may have two causes. Extra flour makes a cake tough. Extra minutes make it dry. A student who assigns each word to a different suspect has read more carefully than one who picks a single name.",
  },
  15: {
    story:
      "The lost and found log shows fourteen pairs of mittens turned in and fourteen claimed. By that record nothing is missing, and yet three students are still without mittens. Seven of the fourteen entries turned out to be single mittens, not pairs. The log has one column headed pairs and no column for a single at all. Whoever logged a lone mitten wrote it in the only column there was. Seven singles counted as seven pairs inflates the record by seven mittens. Two students took away mittens that were not the ones they had lost. Nobody checks a name against an item when something is claimed at the desk. The log's two totals are copied from each other at the end of each week. A total copied from another total will always agree with it. Two people have been through the bin and it is empty. Every entry was written down as it happened and none was added later.",
    q: "Why is nothing missing on paper? Make the case for one cause.",
    why: [
      "seven singles written into the only column there was",
      "an empty bin, checked twice by two people",
      "two students who took mittens that were not theirs",
      "entries written as they happened, none added later",
      "two totals copied from each other at the end of each week",
    ],
    open: [0, 2, 4],
    for: [
      { who: 0, ev: ["“Seven of the fourteen entries turned out to be single mittens, not pairs.”", "“Seven singles counted as seven pairs inflates the record by seven mittens.”"], but: "“Two students took away mittens that were not the ones they had lost.”" },
      { who: 2, ev: ["“Two students took away mittens that were not the ones they had lost.”", "“Nobody checks a name against an item when something is claimed at the desk.”"], but: "“By that record nothing is missing, and yet three students are still without mittens.”" },
      { who: 4, ev: ["“The log's two totals are copied from each other at the end of each week.”", "“A total copied from another total will always agree with it.”"], but: "“Seven of the fourteen entries turned out to be single mittens, not pairs.”" },
    ],
    clears: [
      "Mittens still in the bin: “Two people have been through the bin and it is empty.”",
      "A counting error: “Every entry was written down as it happened and none was added later.”",
    ],
    note:
      "Three students are short and seven entries are wrong, so the numbers do not quite line up and that is worth sitting with. Two of these answers explain why the log balances. Only one explains why three children went home with cold hands.",
  },
  16: {
    story:
      "Every gingerbread batch comes out pale and soft though the dial is set to 350. An oven thermometer hung from the middle rack reads 325 after a full hour. A second thermometer, bought elsewhere, reads 324 on that same rack. The dial is a request for a temperature and not a report of one. An oven's dial can drift years out of true without anything looking wrong. Set to 375, the dial brings the rack thermometers to 350 and the batches brown properly. Both rack thermometers came from the same wholesaler in the same carton. Two instruments from one batch can be wrong together in the same direction. The dough was mixed with butter straight from the refrigerator rather than softened. Cold butter leaves a dough that spreads less and takes colour slowly. Three other kitchens run this recipe unchanged and it works for them. Twelve minutes was kept to every time, exactly as the card says.",
    q: "Why do the batches come out pale? Pick one cause and quote the story.",
    why: [
      "a dial set to 350 with the rack reading 325",
      "a recipe that works unchanged in three other kitchens",
      "twelve minutes throughout, exactly as written",
      "two thermometers from one carton and one wholesaler",
      "butter straight from the refrigerator, not softened",
    ],
    open: [0, 3, 4],
    for: [
      { who: 0, ev: ["“An oven thermometer hung from the middle rack reads 325 after a full hour.”", "“Set to 375, the dial brings the rack thermometers to 350 and the batches brown properly.”"], but: "“Both rack thermometers came from the same wholesaler in the same carton.”" },
      { who: 3, ev: ["“Both rack thermometers came from the same wholesaler in the same carton.”", "“Two instruments from one batch can be wrong together in the same direction.”"], but: "“Set to 375, the dial brings the rack thermometers to 350 and the batches brown properly.”" },
      { who: 4, ev: ["“The dough was mixed with butter straight from the refrigerator rather than softened.”", "“Cold butter leaves a dough that spreads less and takes colour slowly.”"], but: "“An oven thermometer hung from the middle rack reads 325 after a full hour.”" },
    ],
    clears: [
      "The recipe: “Three other kitchens run this recipe unchanged and it works for them.”",
      "The bake time: “Twelve minutes was kept to every time, exactly as the card says.”",
    ],
    note:
      "Two instruments agreeing is strong until you learn they came out of one carton, which is the sentence that turns this case around. The strongest evidence is the test: turning the dial up fixed the biscuits. Ask what that proves about the dial and what it proves about the thermometers.",
  },
  17: {
    story:
      "The display breaker trips within a minute every time the last string is plugged in. Each box is labelled twenty-five watts, and the plan multiplied twenty-five by twenty strings. The twenty-five watts on the box is the rating of a replacement bulb, not the string. Each string holds a hundred bulbs and the fine print gives its total as 240 watts. Twenty strings at 240 watts each comes to 4800 watts on one circuit. The display circuit was found to share its breaker with the kitchen's two freezers. Two freezers draw nine hundred watts between them before a single light goes on. The plan was drawn up for sixteen strings and four more were added in November. Nobody redid the arithmetic when the four strings were added. A new breaker went in and it trips in exactly the same way. Every cord carries a fifteen amp rating and all of them stay cool.",
    q: "Why does the breaker trip? Choose one cause and back it up.",
    why: [
      "a bulb rating on the box read as a string rating",
      "a new breaker that trips in exactly the same way",
      "cords rated fifteen amps and cool to the touch",
      "a breaker shared with the kitchen's two freezers",
      "a plan for sixteen strings, with four added in November",
    ],
    open: [0, 3, 4],
    for: [
      { who: 0, ev: ["“The twenty-five watts on the box is the rating of a replacement bulb, not the string.”", "“Each string holds a hundred bulbs and the fine print gives its total as 240 watts.”"], but: "“The display circuit was found to share its breaker with the kitchen's two freezers.”" },
      { who: 3, ev: ["“The display circuit was found to share its breaker with the kitchen's two freezers.”", "“Two freezers draw nine hundred watts between them before a single light goes on.”"], but: "“Twenty strings at 240 watts each comes to 4800 watts on one circuit.”" },
      { who: 4, ev: ["“The plan was drawn up for sixteen strings and four more were added in November.”", "“Nobody redid the arithmetic when the four strings were added.”"], but: "“Each string holds a hundred bulbs and the fine print gives its total as 240 watts.”" },
    ],
    clears: [
      "A faulty breaker: “A new breaker went in and it trips in exactly the same way.”",
      "The extension cords: “Every cord carries a fifteen amp rating and all of them stay cool.”",
    ],
    note:
      "Sixteen strings at 240 watts is 3840, which is already more than twice the circuit, so the four extra strings are not what broke it. That arithmetic kills one answer outright. The freezers matter and they are nine hundred watts against a four thousand watt overload.",
  },
  18: {
    story:
      "The hand-timed hundred metres came out four tenths faster than the electronic system's time. The hand timer stood at the finish line, a hundred metres from the starter. He started his watch when he heard the gun rather than when he saw the smoke. Sound travels a hundred metres in roughly three tenths of a second. A watch started three tenths late records a run three tenths shorter than it was. Human reaction at the finish adds a little more in the same direction. A timer who anticipates the finish stops the watch before the chest crosses. The same watch was used on a fifty metre run and came out two tenths fast. A stopwatch that runs fast loses time in proportion to the time it measures. Both systems were tested against each other over fifty metres and differed by half as much. The electronic timer takes its start from the gun's own signal and stops at a beam. A quicker number on a watch does not have to mean a quicker runner.",
    q: "Why is the hand time four tenths faster? Make the case for one cause.",
    why: [
      "a watch started on the sound, a hundred metres from the gun",
      "a faster time not always meaning a faster runner",
      "a watch two tenths fast over fifty metres",
      "a system starting on the gun's own electrical signal",
      "a timer stopping before the chest crosses",
    ],
    open: [0, 2, 4],
    for: [
      { who: 0, ev: ["“He started his watch when he heard the gun rather than when he saw the smoke.”", "“Sound travels a hundred metres in roughly three tenths of a second.”"], but: "“The same watch was used on a fifty metre run and came out two tenths fast.”" },
      { who: 2, ev: ["“The same watch was used on a fifty metre run and came out two tenths fast.”", "“A stopwatch that runs fast loses time in proportion to the time it measures.”"], but: "“Sound travels a hundred metres in roughly three tenths of a second.”" },
      { who: 4, ev: ["“A timer who anticipates the finish stops the watch before the chest crosses.”", "“Human reaction at the finish adds a little more in the same direction.”"], but: "“A watch started three tenths late records a run three tenths shorter than it was.”" },
    ],
    clears: [
      "A faster run: “A quicker number on a watch does not have to mean a quicker runner.”",
      "The electronic system: “The electronic timer takes its start from the gun's own signal and stops at a beam.”",
    ],
    note:
      "The fifty metre test is the measurement that separates these. The two systems differed by half as much over half the distance, which is what a proportional error looks like and is not what a fixed three-tenths head start looks like. Ask what each answer predicts for a two hundred.",
  },
  19: {
    story:
      "The weather station reported four inches and the school's own board recorded nine. The school clears its measuring board and takes a fresh reading every six hours. It took four readings through the storm and added them to reach nine inches. The station takes one reading at the end, measuring the depth that is still lying. Snow settles under its own weight from the moment it lands. Four separate fresh falls summed will always exceed the depth left at the end. The school board sits against the gym wall on the sheltered side. The station gauge stands in the open field where wind strips snow away. Wind can take a third off an open gauge and pile it against a wall. Each answers a question the other does not, which is not the same as being wrong. Afterwards the school ruler and the station gauge were laid together and matched. Both observers worked honestly and neither added anything up wrong.",
    q: "Why do the two numbers differ? Pick one cause and prove it.",
    who: ["", "", "", "", "🤝 Two methods, two questions"],
    why: [
      "four cleared-board readings added together",
      "a board sheltered by a wall and a gauge in the open",
      "a ruler and a gauge compared afterwards and agreeing",
      "honest numbers with no arithmetic error in either",
      "two methods each answering a different question",
    ],
    open: [0, 1, 4],
    for: [
      { who: 0, ev: ["“It took four readings through the storm and added them to reach nine inches.”", "“Four separate fresh falls summed will always exceed the depth left at the end.”"], but: "“The school board sits against the gym wall on the sheltered side.”" },
      { who: 1, ev: ["“The school board sits against the gym wall on the sheltered side.”", "“Wind can take a third off an open gauge and pile it against a wall.”"], but: "“The station takes one reading at the end, measuring the depth that is still lying.”" },
      { who: 4, ev: ["“Each answers a question the other does not, which is not the same as being wrong.”", "“Snow settles under its own weight from the moment it lands.”"], but: "“The weather station reported four inches and the school's own board recorded nine.”" },
    ],
    clears: [
      "A faulty ruler: “Afterwards the school ruler and the station gauge were laid together and matched.”",
      "An arithmetic error: “Both observers worked honestly and neither added anything up wrong.”",
    ],
    note:
      "Nine against four is more than double, and wind alone is worth about a third. That leaves a gap the summing explains and the wind does not. The third answer is the grown-up one: total snowfall and depth on the ground are two different measurements with two different right answers.",
  },
  20: {
    story:
      "The tally sheet records forty chickadees at the feeder in one hour on Saturday. Every landing on the perch got a mark on the sheet. One bird in the yard carries a numbered band from a ringing project nearby. That banded bird was recorded six separate times within the same hour. A tally of landings counts visits and cannot count individuals at all. At the busiest moment a photograph caught seven birds in frame. Seven birds making six visits each in an hour comes to about forty landings. A flock of thirty was reported two streets away on the same Saturday morning. Chickadees move in loose flocks and a yard can fill and empty in minutes. The sheet's heading says chickadees seen and the class read it as chickadees present. Seen and present are different words and the sheet never said which it meant. Three people watched side by side and their sheets differ by one mark. The feeder holds four perches and never showed more than four birds at once.",
    q: "Were there really forty chickadees? Choose one answer and quote the story.",
    why: [
      "a banded bird recorded six times within one hour",
      "a flock of thirty two streets away that same morning",
      "three observers agreeing within one mark",
      "four perches, never showing more than four at once",
      "a heading saying seen, read as present",
    ],
    open: [0, 1, 4],
    for: [
      { who: 0, ev: ["“That banded bird was recorded six separate times within the same hour.”", "“Seven birds making six visits each in an hour comes to about forty landings.”"], but: "“A flock of thirty was reported two streets away on the same Saturday morning.”" },
      { who: 1, ev: ["“A flock of thirty was reported two streets away on the same Saturday morning.”", "“Chickadees move in loose flocks and a yard can fill and empty in minutes.”"], but: "“At the busiest moment a photograph caught seven birds in frame.”" },
      { who: 4, ev: ["“The sheet's heading says chickadees seen and the class read it as chickadees present.”", "“Seen and present are different words and the sheet never said which it meant.”"], but: "“A tally of landings counts visits and cannot count individuals at all.”" },
    ],
    clears: [
      "A miscount: “Three people watched side by side and their sheets differ by one mark.”",
      "The observer's view: “The feeder holds four perches and never showed more than four birds at once.”",
    ],
    note:
      "The banded bird is the best evidence anybody has, because it is one known individual counted six times. The flock answer has to explain a photograph with seven birds in it. The third answer says nobody is wrong and the heading is, which is the most useful reading of all.",
  },
  21: {
    story:
      "The report says ninety-two percent of students prefer the school's cocoa to the shop's. The survey was handed out at the cocoa stand to students buying cocoa. Everyone asked had already chosen to spend money on the thing being asked about. A sample drawn from the people who already prefer something will prefer it. Students who dislike the cocoa had no way of entering the survey at all. The same question asked in homerooms the following week came back at fifty-four percent. The form asked whether students preferred our own fresh cocoa or the shop's. Calling one option fresh and the other the shop's is not a neutral pair. The ninety-two is a share of the two hundred who answered, not of the school. The school has nine hundred students and the report does not say so. Two hundred forms came back, a fair number for a school of this size. Two different students tallied every form and their totals matched.",
    q: "Why does the report say ninety-two percent? Make the case for one cause.",
    why: [
      "handed out at the stand, to students buying cocoa",
      "two hundred answering, a reasonable number for the school",
      "our own fresh cocoa set against the shop's",
      "every form tallied twice, with totals that matched",
      "a share of the two hundred, not of nine hundred",
    ],
    open: [0, 2, 4],
    for: [
      { who: 0, ev: ["“The survey was handed out at the cocoa stand to students buying cocoa.”", "“Students who dislike the cocoa had no way of entering the survey at all.”"], but: "“The form asked whether students preferred our own fresh cocoa or the shop's.”" },
      { who: 2, ev: ["“The form asked whether students preferred our own fresh cocoa or the shop's.”", "“Calling one option fresh and the other the shop's is not a neutral pair.”"], but: "“The same question asked in homerooms the following week came back at fifty-four percent.”" },
      { who: 4, ev: ["“The ninety-two is a share of the two hundred who answered, not of the school.”", "“The school has nine hundred students and the report does not say so.”"], but: "“A sample drawn from the people who already prefer something will prefer it.”" },
    ],
    clears: [
      "Too small a sample: “Two hundred forms came back, a fair number for a school of this size.”",
      "A tallying error: “Two different students tallied every form and their totals matched.”",
    ],
    note:
      "The homeroom result of fifty-four percent is the comparison that makes the case. Ask what was different between the two askings: the wording was the same, so the wording cannot be the whole story. Where you stand when you ask decided thirty-eight points of it.",
  },
  22: {
    story:
      "The report says students received fourteen valentines on average, and most students feel cheated. Twenty-eight students were counted and the total came to three hundred and ninety-two. Three students run the school's social accounts and received eighty-one, seventy-four and sixty-eight. The remaining twenty-five students received between two and nine cards each. Lined up in order, the middle student in the class received five cards. A mean can land well outside the range nearly everybody sits in. Four students were absent on the day the bags were counted and were left out. Those four bags were still hanging on the wall a week later, unopened. The word average appears nowhere on the sheet the class actually filled in. Somebody wrote average on the report when the sheet only gave a total and a count. Divide three hundred and ninety-two by twenty-eight and fourteen comes out exactly. Each bag went through two counts and no card landed in two bags.",
    q: "Why does the average say fourteen? Pick one cause and prove it.",
    why: [
      "three account holders at eighty-one, seventy-four and sixty-eight",
      "392 over 28 coming to exactly fourteen",
      "four absent, their bags unopened a week later",
      "every bag counted twice, no card counted twice",
      "the word average nowhere on the sheet the class filled in",
    ],
    open: [0, 2, 4],
    for: [
      { who: 0, ev: ["“Three students run the school's social accounts and received eighty-one, seventy-four and sixty-eight.”", "“Lined up in order, the middle student in the class received five cards.”"], but: "“Four students were absent on the day the bags were counted and were left out.”" },
      { who: 2, ev: ["“Four students were absent on the day the bags were counted and were left out.”", "“Those four bags were still hanging on the wall a week later, unopened.”"], but: "“A mean can land well outside the range nearly everybody sits in.”" },
      { who: 4, ev: ["“The word average appears nowhere on the sheet the class actually filled in.”", "“Somebody wrote average on the report when the sheet only gave a total and a count.”"], but: "“The remaining twenty-five students received between two and nine cards each.”" },
    ],
    clears: [
      "A division error: “Divide three hundred and ninety-two by twenty-eight and fourteen comes out exactly.”",
      "Double counting: “Each bag went through two counts and no card landed in two bags.”",
    ],
    note:
      "Three students hold two hundred and twenty-three of the three hundred and ninety-two cards, and the class can work that out. Four missing bags move a mean a little. Three enormous bags move it enormously. The word answer is the deepest: nobody chose a mean, somebody just wrote one.",
  },
  23: {
    story:
      "Group D's data sheet records no reaction at all, and the class wrote their model off. Their vinegar had been stored on the cold windowsill and was near freezing. A cold reaction runs slower and takes longer to build enough gas to rise. The instructions ask each group to observe for thirty seconds after pouring. The group recorded nothing, packed up and left the room at the thirty-second mark. The custodian found their cone overflowed and the table wet that evening. A sheet that says no reaction is a record of what somebody watched. Group D's cone was the one that sat under the window and took the paste drips. Dried paste narrowed its vent to about half the width of the others. A narrow vent holds foam back until the pressure behind it builds. The same balance weighed their soda to the same two grams. Their vinegar was poured from the jug that worked for five other groups.",
    q: "Why did Group D record nothing? Choose one cause and back it up.",
    why: [
      "vinegar near freezing from the cold windowsill",
      "the same balance, the same two grams",
      "the same jug that worked for five other groups",
      "a vent narrowed to half by dried paste",
      "thirty seconds of watching, then packing up",
    ],
    open: [0, 3, 4],
    for: [
      { who: 0, ev: ["“Their vinegar had been stored on the cold windowsill and was near freezing.”", "“A cold reaction runs slower and takes longer to build enough gas to rise.”"], but: "“Dried paste narrowed its vent to about half the width of the others.”" },
      { who: 3, ev: ["“Group D's cone was the one that sat under the window and took the paste drips.”", "“Dried paste narrowed its vent to about half the width of the others.”"], but: "“A cold reaction runs slower and takes longer to build enough gas to rise.”" },
      { who: 4, ev: ["“The group recorded nothing, packed up and left the room at the thirty-second mark.”", "“The custodian found their cone overflowed and the table wet that evening.”"], but: "“The instructions ask each group to observe for thirty seconds after pouring.”" },
    ],
    clears: [
      "Too little baking soda: “The same balance weighed their soda to the same two grams.”",
      "Weak vinegar: “Their vinegar was poured from the jug that worked for five other groups.”",
    ],
    note:
      "The cone did erupt, so nobody is arguing about whether the chemistry worked. Two answers explain the delay and one says the delay did not matter because nobody was watching long enough. A student who separates why it was late from why nobody saw it has split the case properly.",
  },
  24: {
    story:
      "Nine of the twenty-eight crowns would not close, all by about the same small amount. The assembly step glues one end over the other with a one-inch overlap. An inch of overlap takes an inch out of the circle the strip can make. Nobody added that inch to the length before cutting, because nobody wrote it down. The nine that failed are the nine largest measurements in the class. A missing allowance shows up first wherever the margin was already thinnest. The cloth tape has been washed twice and measures a hundred and two centimetres against a metre rule. A stretched tape reads a head smaller than it is, so the strip comes out short. Nine students measured their own heads alone while the rest worked in pairs. Measuring your own head alone pulls the tape tight and reads low. Each strip was cut to exactly the figure its owner had written down. The instruction sheet gives the overlap in its diagram but never in its text.",
    q: "Why would nine crowns not close? Pick one cause and prove it.",
    why: [
      "an inch of overlap nobody added before cutting",
      "a washed tape reading a hundred and two against a metre rule",
      "strips cut to exactly the number each student wrote",
      "nine who measured their own heads alone, pulling the tape tight",
      "an overlap shown in the diagram and never in the text",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“An inch of overlap takes an inch out of the circle the strip can make.”", "“Nobody added that inch to the length before cutting, because nobody wrote it down.”"], but: "“The cloth tape has been washed twice and measures a hundred and two centimetres against a metre rule.”" },
      { who: 1, ev: ["“The cloth tape has been washed twice and measures a hundred and two centimetres against a metre rule.”", "“A stretched tape reads a head smaller than it is, so the strip comes out short.”"], but: "“The nine that failed are the nine largest measurements in the class.”" },
      { who: 3, ev: ["“Nine students measured their own heads alone while the rest worked in pairs.”", "“Measuring your own head alone pulls the tape tight and reads low.”"], but: "“An inch of overlap takes an inch out of the circle the strip can make.”" },
    ],
    clears: [
      "Bad cutting: “Each strip was cut to exactly the figure its owner had written down.”",
      "The instructions: “The instruction sheet gives the overlap in its diagram but never in its text.”",
    ],
    note:
      "Nine failed and nine measured alone, and nine are the largest heads. Three facts and one number, which is the trap. Ask whether the nine who measured alone are the same nine with the largest heads, because the case never says and everything turns on it.",
  },
  25: {
    story:
      "The tuning app calls every note on the piano correct and the piano sounds flat beside the flute. An app's reference pitch can be changed in its settings by a single tap. This app's reference is set to 435 hertz rather than the standard 440. Every note it calls correct is therefore a little flat of where it should be. A steel tuning fork, which needs no battery, was tried against the piano. It sounded flat against the fork by the same amount it did against the flute. The hall was eleven degrees warmer than the music room where the flute lives. A warm flute plays sharp by close to the gap being argued over. The piano has not been tuned since the radiators came on in October. A soundboard losing moisture slackens every string by about the same amount. Put to the fork, the app's microphone called the fork flat as well. Straight out of its case, cold, the flute left the same gap.",
    q: "Why does the piano sound flat? Choose one cause and quote the story.",
    why: [
      "a reference set to 435 rather than the standard 440",
      "a hall eleven degrees warmer than the flute's room",
      "untuned since the radiators came on in October",
      "a microphone that read the fork as flat as well",
      "a flute played cold, with the gap just as wide",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“This app's reference is set to 435 hertz rather than the standard 440.”", "“Every note it calls correct is therefore a little flat of where it should be.”"], but: "“It sounded flat against the fork by the same amount it did against the flute.”" },
      { who: 1, ev: ["“The hall was eleven degrees warmer than the music room where the flute lives.”", "“A warm flute plays sharp by close to the gap being argued over.”"], but: "“A steel tuning fork, which needs no battery, was tried against the piano.”" },
      { who: 2, ev: ["“The piano has not been tuned since the radiators came on in October.”", "“A soundboard losing moisture slackens every string by about the same amount.”"], but: "“This app's reference is set to 435 hertz rather than the standard 440.”" },
    ],
    clears: [
      "The app's microphone: “Put to the fork, the app's microphone called the fork flat as well.”",
      "The tuning fork: “Straight out of its case, cold, the flute left the same gap.”",
    ],
    note:
      "The fork is the only thing here with no battery, no temperature and no settings, and the piano sounded flat against it. That beats the app answer outright. What is left is whether the piano really is flat or only sounds it beside a sharp flute.",
  },
  26: {
    story:
      "The club recorded a kite altitude of four hundred feet by counting the string let out. A kite's string is never a straight line from the hand to the kite. It hangs in a curve, and it leaves the hand at an angle well below vertical. A photograph of the line that day put its angle near forty-five degrees. At forty-five degrees, four hundred feet of string reaches roughly two hundred and eighty feet up. The curve of the line takes a further bite out of that number. The photograph was taken from the side, forty yards off, with a long lens. A long lens flattens an angle and makes it look shallower than it is. A second club measured the same kite by sighting angles from two points. Their figure came to two hundred and sixty feet, not four hundred. Their two sighting points were paced out rather than measured with a tape. Against a tape, the reel's counter counts true. Four hundred feet certainly came off the reel, and the counting was careful.",
    q: "How high was the kite? Make the case for one answer.",
    who: ["", "", "", "📷 The photographed angle", ""],
    why: [
      "string length counted straight up, at forty-five degrees",
      "a counter checked against a tape and counting true",
      "four hundred feet off the reel, carefully counted",
      "an angle shot from the side with a long lens",
      "a second figure from sighting points that were paced, not taped",
    ],
    open: [0, 3, 4],
    for: [
      { who: 0, ev: ["“A kite's string is never a straight line from the hand to the kite.”", "“At forty-five degrees, four hundred feet of string reaches roughly two hundred and eighty feet up.”"], but: "“The photograph was taken from the side, forty yards off, with a long lens.”" },
      { who: 3, ev: ["“The photograph was taken from the side, forty yards off, with a long lens.”", "“A long lens flattens an angle and makes it look shallower than it is.”"], but: "“The curve of the line takes a further bite out of that number.”" },
      { who: 4, ev: ["“Their two sighting points were paced out rather than measured with a tape.”", "“Their figure came to two hundred and sixty feet, not four hundred.”"], but: "“A second club measured the same kite by sighting angles from two points.”" },
    ],
    clears: [
      "A faulty reel counter: “Against a tape, the reel's counter counts true.”",
      "A miscount of the string: “Four hundred feet certainly came off the reel, and the counting was careful.”",
    ],
    note:
      "Nobody disputes the four hundred feet of string, so the only question is what that number was converted into. Two hundred and eighty, two hundred and sixty, and four hundred are three answers from one kite. Ask which of the three measurements had the fewest assumptions in it.",
  },
  27: {
    story:
      "The chart shows the shamrock growing four centimetres in a week after months of slow growth. Four centimetres in seven days would be remarkable for a plant of this kind. Measurements in weeks one through five were taken from the rim of the pot. Week six's measurement was taken from the surface of the soil instead. The soil sits about four centimetres below the rim of that pot. Measuring from a lower starting point adds the distance between the two points. Two students share the task and each had their own idea of where to start. The pot was topped up with fresh compost on the Friday before week six. Fresh compost settles over a week and the level drops as it does. The week six reading was taken with a wooden metre stick rather than the tape. That stick is missing its first centimetre, which has been snapped off. Measured from the rim again in week seven, the plant is back where week five left it.",
    q: "Why does week six show four centimetres? Pick one cause and back it up.",
    who: ["", "", "🪴 The compost top-up", "", ""],
    why: [
      "a starting point moved from the rim to the soil",
      "a plant back at week five height by week seven",
      "fresh compost added on the Friday before week six",
      "a metre stick missing its snapped-off first centimetre",
      "a chart that records the distance between two points",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“Week six's measurement was taken from the surface of the soil instead.”", "“The soil sits about four centimetres below the rim of that pot.”"], but: "“The pot was topped up with fresh compost on the Friday before week six.”" },
      { who: 2, ev: ["“The pot was topped up with fresh compost on the Friday before week six.”", "“Fresh compost settles over a week and the level drops as it does.”"], but: "“Measuring from a lower starting point adds the distance between the two points.”" },
      { who: 3, ev: ["“The week six reading was taken with a wooden metre stick rather than the tape.”", "“That stick is missing its first centimetre, which has been snapped off.”"], but: "“Two students share the task and each had their own idea of where to start.”" },
    ],
    clears: [
      "Real growth: “Measured from the rim again in week seven, the plant is back where week five left it.”",
      "The chart: “Measuring from a lower starting point adds the distance between the two points.”",
    ],
    note:
      "Four centimetres is also the depth from rim to soil, and a snapped stick loses one centimetre, not four. Doing that arithmetic rules out one answer cleanly. Week seven is the fact that proves nothing grew, whichever explanation wins.",
  },
  28: {
    story:
      "The school's rain gauge recorded two tenths of an inch from a storm that left standing water everywhere. Two tenths of an inch does not fill a parking lot or float a leaf. The gauge stands beneath the spreading branches of a large maple by the fence. A canopy catches most of the rain that falls on it and sheds it elsewhere. A gauge under a tree measures what gets through the tree, not what falls. The county station four miles away recorded one and three tenths of an inch. Rain gauges are supposed to stand clear of anything overhead for exactly this reason. The gauge's funnel is four inches across where the standard calls for eight. A narrow funnel collects a quarter of the water and reads a quarter as deep. The gauge was emptied and read at four in the afternoon, three hours before the storm ended. Emptied and checked over, the gauge is sound and dry with no crack. Out on the open lawn that week a second gauge caught one and two tenths.",
    q: "Why did the gauge read two tenths? Choose one cause and prove it.",
    who: ["", "", "🕓 Read three hours early", "", "📏 A four-inch funnel"],
    why: [
      "a maple canopy catching the rain before it lands",
      "a gauge emptied, checked and found sound and dry",
      "emptied and read three hours before the storm ended",
      "an open-lawn gauge reading one and two tenths that week",
      "a four-inch funnel where the standard calls for eight",
    ],
    open: [0, 2, 4],
    for: [
      { who: 0, ev: ["“The gauge stands beneath the spreading branches of a large maple by the fence.”", "“A gauge under a tree measures what gets through the tree, not what falls.”"], but: "“The gauge's funnel is four inches across where the standard calls for eight.”" },
      { who: 2, ev: ["“The gauge was emptied and read at four in the afternoon, three hours before the storm ended.”", "“Two tenths of an inch does not fill a parking lot or float a leaf.”"], but: "“A canopy catches most of the rain that falls on it and sheds it elsewhere.”" },
      { who: 4, ev: ["“The gauge's funnel is four inches across where the standard calls for eight.”", "“A narrow funnel collects a quarter of the water and reads a quarter as deep.”"], but: "“The county station four miles away recorded one and three tenths of an inch.”" },
    ],
    clears: [
      "A cracked gauge: “Emptied and checked over, the gauge is sound and dry with no crack.”",
      "A genuinely light storm: “Out on the open lawn that week a second gauge caught one and two tenths.”",
    ],
    note:
      "A narrow funnel does not change the depth a gauge reads, and a student who catches that has caught the one false rule in the case. Depth is depth whatever the mouth is. The tree and the early reading are both real, and only one of them is worth more than a tenth.",
  },
  29: {
    story:
      "The germination report says forty percent where the seed packet promises eighty-five. The count was taken on day seven, which is when the project sheet asked for it. This species takes fourteen to twenty-one days to come up, as the packet also states. A count taken at day seven catches only the earliest seeds in a slow species. A second count on day twenty-one put the same bed at eighty-three percent. The packet is three years out of date and was found at the back of the cupboard. Old seed comes up more slowly as well as less reliably. The bed was watered every morning from a can filled the night before. Water left standing overnight in a metal can picks up a taste seeds dislike. Sowing went in at the packet's depth, into soil tested at sixty-eight degrees. The class counted every seedling in every row and the count itself was careful.",
    q: "Why does the report say forty percent? Make the case for one cause.",
    who: ["", "", "", "🪣 The overnight watering can", ""],
    why: [
      "a count taken on day seven in a fourteen-day species",
      "a packet three years out of date from the back of the cupboard",
      "sowing at the packet's depth, in soil at sixty-eight degrees",
      "a can left standing overnight, picking up a taste",
      "a project sheet that asked for day seven",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The count was taken on day seven, which is when the project sheet asked for it.”", "“A count taken at day seven catches only the earliest seeds in a slow species.”"], but: "“The packet is three years out of date and was found at the back of the cupboard.”" },
      { who: 1, ev: ["“The packet is three years out of date and was found at the back of the cupboard.”", "“Old seed comes up more slowly as well as less reliably.”"], but: "“A second count on day twenty-one put the same bed at eighty-three percent.”" },
      { who: 3, ev: ["“The bed was watered every morning from a can filled the night before.”", "“Water left standing overnight in a metal can picks up a taste seeds dislike.”"], but: "“A second count on day twenty-one put the same bed at eighty-three percent.”" },
    ],
    clears: [
      "Cold soil: “Sowing went in at the packet's depth, into soil tested at sixty-eight degrees.”",
      "The project sheet: “The class counted every seedling in every row and the count itself was careful.”",
    ],
    note:
      "Eighty-three percent on day twenty-one is the fact that ends two of these arguments at once. Nothing killed those seeds and nothing poisoned them, because they came up. The old packet earns a mention for slowness and not for failure, and the class should say which half of that claim survives.",
  },
  30: {
    story:
      "The carton is marked large and the twelve eggs inside visibly differ in size. Two of them are noticeably smaller than the others and one is clearly bigger. That standard sets a minimum weight for a dozen, not for each individual egg. A dozen graded large must weigh at least twenty-four ounces in total. The twelve in this carton weigh twenty-five and a half ounces together. The two small eggs and the large one are all inside the allowed spread. The farm packed two cartons at once and the grader jammed partway through. A jam can send eggs from one chute into the carton under the next. The kitchen scale used for the weighing has not been zeroed since the spring. A scale reading an ounce and a half high would put a short dozen over the line. A check on the farm's grader found it sorting to the published standard. Eggs inside a correctly graded dozen vary, and the standard expects them to.",
    q: "Why do the eggs differ in size? Pick one cause and quote the story.",
    who: ["", "", "🔀 The grader jam", "", "⚖️ The kitchen scale"],
    why: [
      "a standard that sets a weight for the dozen, not the egg",
      "a grader checked and sorting to the published standard",
      "a jam partway through, with two cartons packed at once",
      "individual eggs varying inside a correctly graded dozen",
      "a scale not zeroed since the spring",
    ],
    open: [0, 2, 4],
    for: [
      { who: 0, ev: ["“That standard sets a minimum weight for a dozen, not for each individual egg.”", "“The two small eggs and the large one are all inside the allowed spread.”"], but: "“The farm packed two cartons at once and the grader jammed partway through.”" },
      { who: 2, ev: ["“The farm packed two cartons at once and the grader jammed partway through.”", "“A jam can send eggs from one chute into the carton under the next.”"], but: "“The twelve in this carton weigh twenty-five and a half ounces together.”" },
      { who: 4, ev: ["“The kitchen scale used for the weighing has not been zeroed since the spring.”", "“A scale reading an ounce and a half high would put a short dozen over the line.”"], but: "“That standard sets a minimum weight for a dozen, not for each individual egg.”" },
    ],
    clears: [
      "A broken grader: “A check on the farm's grader found it sorting to the published standard.”",
      "A mislabelled carton: “Eggs inside a correctly graded dozen vary, and the standard expects them to.”",
    ],
    note:
      "Twenty-five and a half against a minimum of twenty-four is a margin of an ounce and a half, and the unzeroed scale could be out by exactly that. Those two numbers meeting is the heart of the case. The first answer says nothing is wrong at all, and it may well be right.",
  },
  31: {
    story:
      "The almanac gives sunrise at 6:42 and the class first saw the sun at 6:51. The almanac's figure is calculated for the city centre at a flat sea horizon. The school sits in a valley with a wooded ridge standing to the east. The sun must climb above that ridge before anyone on the playground can see it. An almanac describes a horizon that most places on the ground do not have. From the hilltop above the school the sun appeared at 6:43 on the same morning. The ridge adds the same eight or nine minutes every clear day of the week. The school lies eleven miles west of the city centre the almanac is drawn for. Eleven miles west puts sunrise roughly a minute later than in the centre. The playground sight line crosses the gym roof, which stands higher than the ridge. Against the national time signal the classroom clock is right to the second. Four clear mornings running, the watching was done from the playground.",
    q: "Why was sunrise nine minutes late? Choose one cause and back it up.",
    who: ["", "", "", "", "🏫 The gym roof in the sight line"],
    why: [
      "a wooded ridge the sun must climb above first",
      "a clock agreeing with the national signal to the second",
      "a horizon the almanac assumes and the valley does not have",
      "a school eleven miles west of the city centre",
      "a sight line crossing the gym roof, higher than the ridge",
    ],
    open: [0, 3, 4],
    for: [
      { who: 0, ev: ["“The school sits in a valley with a wooded ridge standing to the east.”", "“From the hilltop above the school the sun appeared at 6:43 on the same morning.”"], but: "“The playground sight line crosses the gym roof, which stands higher than the ridge.”" },
      { who: 3, ev: ["“The school lies eleven miles west of the city centre the almanac is drawn for.”", "“Eleven miles west puts sunrise roughly a minute later than in the centre.”"], but: "“The ridge adds the same eight or nine minutes every clear day of the week.”" },
      { who: 4, ev: ["“The playground sight line crosses the gym roof, which stands higher than the ridge.”", "“An almanac describes a horizon that most places on the ground do not have.”"], but: "“From the hilltop above the school the sun appeared at 6:43 on the same morning.”" },
    ],
    clears: [
      "A slow clock: “Against the national time signal the classroom clock is right to the second.”",
      "Careless observing: “Four clear mornings running, the watching was done from the playground.”",
    ],
    note:
      "Eleven miles buys one minute and the gap is nine, so the arithmetic puts that answer in its place without dismissing it. The hilltop reading at 6:43 is the strongest evidence here, and the gym roof is the sentence that complicates it, because the hilltop has no gym roof in the way.",
  },
  32: {
    story:
      "Sorted by timestamp, the trip photographs show the group arriving before they left. Every photograph from the second camera sits exactly sixty minutes behind the first. A gap of exactly one hour, repeated across ninety files, is not a coincidence. The clocks were last compared in March, before the spring change of hour. The second camera's clock was never moved forward when the clocks changed. A timestamp records what a camera believed the time to be. The second camera's battery was replaced on the trip and its clock reset to default. A camera reset to default starts again at midnight on the first of January. The folder was sorted by file name, not by timestamp, before anyone checked. File names restart at one on each camera and interleave when two sets are merged. All the sorting program does is read each file's recorded time. Checked against a phone, the first camera's pictures match it to the minute.",
    q: "Why are the photographs out of order? Make the case for one cause.",
    who: ["", "", "", "🔋 The battery change and reset", "🔤 Sorting by file name"],
    why: [
      "a clock never moved forward at the spring change",
      "a program that reads the recorded time and nothing else",
      "one camera checked against a phone, matching to the minute",
      "a battery replaced on the trip, resetting the clock to default",
      "a folder sorted by file name, where both cameras start at one",
    ],
    open: [0, 3, 4],
    for: [
      { who: 0, ev: ["“The second camera's clock was never moved forward when the clocks changed.”", "“A gap of exactly one hour, repeated across ninety files, is not a coincidence.”"], but: "“The second camera's battery was replaced on the trip and its clock reset to default.”" },
      { who: 3, ev: ["“The second camera's battery was replaced on the trip and its clock reset to default.”", "“A camera reset to default starts again at midnight on the first of January.”"], but: "“Every photograph from the second camera sits exactly sixty minutes behind the first.”" },
      { who: 4, ev: ["“The folder was sorted by file name, not by timestamp, before anyone checked.”", "“File names restart at one on each camera and interleave when two sets are merged.”"], but: "“A timestamp records what a camera believed the time to be.”" },
    ],
    clears: [
      "The sorting program: “All the sorting program does is read each file's recorded time.”",
      "The phone photographs: “Checked against a phone, the first camera's pictures match it to the minute.”",
    ],
    note:
      "Exactly sixty minutes across ninety files is the strongest number in the case and it fits the clock change perfectly. A reset to January the first would be out by months, not an hour. The file name answer is the sly one, because it explains the disorder without touching the clocks at all.",
  },
  33: {
    story:
      "The fertilised beans grew half again as tall as the unfertilised ones in four weeks. The eight fertilised pots were lined up along the window and the other eight by the door. Light falling on a windowsill is several times what reaches a doorway. Two things changed between the groups, and only one of them was the fertiliser. In week five the two trays were swapped end for end without changing anything else. By week eight the plants at the window were taller whichever tray they came from. The fertiliser was mixed at double strength by mistake in the first week. Double strength feed can burn roots as easily as it can speed growth. The door pots sit over a floor vent that blows warm dry air upward. Dry moving air costs a seedling water it cannot replace fast enough. One schedule and one measured amount watered all sixteen pots. Sixteen pots of one size came out of one bag of soil.",
    q: "Why did one group grow taller? Pick one cause and prove it from the text.",
    who: ["", "", "", "", "🌬️ The floor vent by the door"],
    why: [
      "eight at the window and eight at a doorway",
      "a feed mixed at double strength in the first week",
      "one schedule and one measured amount for all sixteen",
      "one size of pot and one bag of soil for all sixteen",
      "a floor vent blowing warm dry air up at the door pots",
    ],
    open: [0, 1, 4],
    for: [
      { who: 0, ev: ["“The eight fertilised pots were lined up along the window and the other eight by the door.”", "“By week eight the plants at the window were taller whichever tray they came from.”"], but: "“The fertiliser was mixed at double strength by mistake in the first week.”" },
      { who: 1, ev: ["“The fertiliser was mixed at double strength by mistake in the first week.”", "“Double strength feed can burn roots as easily as it can speed growth.”"], but: "“Light falling on a windowsill is several times what reaches a doorway.”" },
      { who: 4, ev: ["“The door pots sit over a floor vent that blows warm dry air upward.”", "“Dry moving air costs a seedling water it cannot replace fast enough.”"], but: "“In week five the two trays were swapped end for end without changing anything else.”" },
    ],
    clears: [
      "Watering: “One schedule and one measured amount watered all sixteen pots.”",
      "Pot size or soil: “Sixteen pots of one size came out of one bag of soil.”",
    ],
    note:
      "The swap in week five is a real experiment and the class should say exactly what it proved: position beat tray. It does not separate light from the floor vent, because both of those belong to the position. A third tray, at the window with no fertiliser, would have answered everything.",
  },
  34: {
    story:
      "The ice cream in the door rack is soft while the freezer's display reads zero degrees. The display takes its reading from a sensor mounted at the back wall. Cold air sinks and pools at the bottom and back of a freezer compartment. The door rack sits at the front, at the top, and swings into the room when opened. A thermometer left in the door rack overnight read nineteen degrees by morning. A sensor reports the temperature where the sensor is and nowhere else. The freezer door was found ajar on two mornings last week. A door left ajar warms the front of a compartment long before the back. This ice cream is a low-fat brand the school has not bought before. Low-fat ice cream softens at a higher temperature than the full-fat kind. The compressor ran as it should all night and the seal held a sheet of paper. At the back, on that same night, a thermometer read one degree.",
    q: "Why is the ice cream soft? Choose one cause and quote the story.",
    who: ["", "🚪 The door left ajar", "", "", ""],
    why: [
      "a door rack at the front and top, where cold air never pools",
      "a door found ajar on two mornings last week",
      "a compressor running normally and a seal that passed",
      "a low-fat brand the school has not bought before",
      "a sensor at the back wall, reporting only where it sits",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“Cold air sinks and pools at the bottom and back of a freezer compartment.”", "“A thermometer left in the door rack overnight read nineteen degrees by morning.”"], but: "“The freezer door was found ajar on two mornings last week.”" },
      { who: 1, ev: ["“The freezer door was found ajar on two mornings last week.”", "“A door left ajar warms the front of a compartment long before the back.”"], but: "“A sensor reports the temperature where the sensor is and nowhere else.”" },
      { who: 3, ev: ["“This ice cream is a low-fat brand the school has not bought before.”", "“Low-fat ice cream softens at a higher temperature than the full-fat kind.”"], but: "“A thermometer left in the door rack overnight read nineteen degrees by morning.”" },
    ],
    clears: [
      "A weak compressor: “The compressor ran as it should all night and the seal held a sheet of paper.”",
      "Where the sensor sits: “At the back, on that same night, a thermometer read one degree.”",
    ],
    note:
      "Nineteen degrees at the front and one at the back is the measurement everything else has to answer to. The door answer and the physics answer predict the same reading, which is why they cannot be separated here. Ask what a night with the door properly shut would show.",
  },
  35: {
    story:
      "The two rolls of ribbon matched perfectly in the storeroom and clashed badly on stage. Both were checked against each other under the storeroom's fluorescent tube. Two dyes can reflect light identically under one kind of lamp and differently under another. A fluorescent tube and a stage lamp do not give out the same mix of colours. A dye lot difference invisible under one lamp is not invisible under all of them. Different dye lots, says the label on each core. The stage wash was changed this term from white lamps to a warm amber. Amber light pushes reds forward and leaves blues looking grey and dull. The checker who matched them is the only one in the group who sees reds poorly. One roll sat in the storeroom window for a month before it was used. Neither roll has been washed or left to fade, and both were handled with care. Side by side at the window in daylight the two plainly differ.",
    q: "Why did the ribbons clash on stage? Make the case for one cause.",
    who: ["", "", "🌞 A month in the storeroom window", "", "🎭 The amber stage wash"],
    why: [
      "a match made under one fluorescent tube only",
      "two different dye lots, recorded on the cores",
      "one roll a month in the storeroom window",
      "a checker who sees reds poorly",
      "a stage wash changed this term to warm amber",
    ],
    open: [0, 2, 4],
    for: [
      { who: 0, ev: ["“Both were checked against each other under the storeroom's fluorescent tube.”", "“Two dyes can reflect light identically under one kind of lamp and differently under another.”"], but: "“One roll sat in the storeroom window for a month before it was used.”" },
      { who: 2, ev: ["“One roll sat in the storeroom window for a month before it was used.”", "“Side by side at the window in daylight the two plainly differ.”"], but: "“Two dyes can reflect light identically under one kind of lamp and differently under another.”" },
      { who: 4, ev: ["“The stage wash was changed this term from white lamps to a warm amber.”", "“Amber light pushes reds forward and leaves blues looking grey and dull.”"], but: "“Both were checked against each other under the storeroom's fluorescent tube.”" },
    ],
    clears: [
      "Different dye lots: “Different dye lots, says the label on each core.”",
      "The checker's eyes: “The checker who matched them is the only one in the group who sees reds poorly.”",
    ],
    note:
      "The labels say the dye lots differ, so the dye is not in doubt and never was. What is in doubt is why nobody saw it. Three lamps and a month in a window are four chances to go wrong, and the class should ask which one happened first.",
  },
  36: {
    story:
      "The attendance figure is three hundred and four hundred and twenty balloons were given out. Four hundred and twenty left the table, and each visitor took exactly one. The attendance count was made by two staff walking the hall at a quarter to seven. People arrived from five thirty and others left before seven to catch buses. A count of who is present at one moment cannot total who came all evening. The balloon figure adds up every visitor across three hours of the event. Balloons were also given to the forty volunteers and to two visiting classes. The two staff started at opposite ends and met in the middle of the hall. Two walkers meeting in the middle will double count whoever moves between them. The hall has three rooms and the walk-through covered only the main one. Second balloons were refused, and the table was watched all evening. Stock at the balloon table was counted before the doors and again at the close.",
    q: "How many people came? Pick one answer and prove it.",
    who: ["", "🎈 Balloons to volunteers and classes", "", "", ""],
    why: [
      "a count taken at one moment across three hours of arrivals",
      "balloons given to forty volunteers and two visiting classes",
      "a stock counted before the doors and again at the end",
      "two walkers meeting in the middle, and only one room covered",
      "a word that means present, used for a total",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“People arrived from five thirty and others left before seven to catch buses.”", "“A count of who is present at one moment cannot total who came all evening.”"], but: "“Balloons were also given to the forty volunteers and to two visiting classes.”" },
      { who: 1, ev: ["“Balloons were also given to the forty volunteers and to two visiting classes.”", "“The balloon figure adds up every visitor across three hours of the event.”"], but: "“A count of who is present at one moment cannot total who came all evening.”" },
      { who: 3, ev: ["“The two staff started at opposite ends and met in the middle of the hall.”", "“The hall has three rooms and the walk-through covered only the main one.”"], but: "“People arrived from five thirty and others left before seven to catch buses.”" },
    ],
    clears: [
      "Visitors taking two balloons: “Second balloons were refused, and the table was watched all evening.”",
      "A miscount of the stock: “Stock at the balloon table was counted before the doors and again at the close.”",
    ],
    note:
      "Forty volunteers and two classes come off the four hundred and twenty before anybody argues, and the class can do that subtraction. Two rooms missed and a double count in the middle pull the three hundred in opposite directions. The honest answer gives a range, not a number.",
  },
};
