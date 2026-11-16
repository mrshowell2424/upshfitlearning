/**
 * Grade 8 mysteries: thirty-six cases, one a week, on the same thirty-six
 * themes as every other grade. Week 9 is the pumpkin case in every room in
 * the building; only the reading level and the case itself change.
 *
 * Held to the band in scripts/reading-mystery-plan.json: 134-192 words, mean
 * sentence no longer than 17 words, four or five suspects, and at least two
 * proof quotes that are really in the story.
 *
 * The step up from grade 7 is where the fault lies. In a grade 7 case every
 * suspect really happened and the timing rules all but one of them out. In a
 * grade 8 case the culprit is frequently not an event at all but a record of
 * one: a log filled in from memory on Friday, a box whose label says
 * twenty-five and holds eighteen, a decibel reading taken during silent
 * reading, a scale zeroed without its tray. The student has to tell the thing
 * from the measurement of the thing, which is the move that makes the rest of
 * a science or history course readable, and the one that a case built only
 * out of true events cannot teach.
 *
 * The fifth suspect arrives in this grade. It is usually the piece of
 * evidence everybody has been trusting.
 *
 *   bun run scripts/mysteries/g8.src.mjs && bun run scripts/merge-mysteries.mjs
 *   bun run scripts/check-mysteries.mjs
 */
import { gradeMysteries } from "./build.mjs";

const CASES = [
  {
    t: "The Case of the Book in Two Places",
    tag: "📚 library",
    story:
      "The circulation report shows one copy of Hatchet checked out to two students at once. Neither student has ever met the other, and both have the book in hand. Ms. Vega holds both copies on the desk, and the spines are plainly different ages. The older copy was bought in 2011 and the newer one replaced a lost book in 2019. Every item in the catalog is supposed to carry a barcode of its own. The 2019 replacement was entered by copying the record of the book it replaced. Copying a record copies its barcode, and two items then answer to one number. The scanner was tested forty times on known items and misread nothing. Neither student's card has been lent, and both scanned their own at the desk. The system clock agrees with the office clock to the second. A report can only be as good as the records it adds up.",
    q: "How is one book checked out twice?",
    s: [
      { who: "🏷️ A duplicated barcode", why: "the 2019 replacement was entered by copying the record of the book it replaced" },
      { who: "💳 A borrowed library card", why: "neither student's card has been lent, and both scanned their own at the desk" },
      { who: "📡 A misreading scanner", why: "the scanner was tested forty times on known items and misread nothing" },
      { who: "🕐 The system clock", why: "the system clock agrees with the office clock to the second" },
      { who: "📊 The circulation report", why: "a report can only be as good as the records it adds up" },
    ],
    who: 0,
    answer: "Two books share one barcode, so the catalog sees a single copy.",
    proof: [
      "“The 2019 replacement was entered by copying the record of the book it replaced.”",
      "“Copying a record copies its barcode, and two items then answer to one number.”",
    ],
    clears: [
      "A borrowed card: “Neither student's card has been lent, and both scanned their own at the desk.”",
      "The scanner: “The scanner was tested forty times on known items and misread nothing.”",
      "The clock: “The system clock agrees with the office clock to the second.”",
      "The report: “A report can only be as good as the records it adds up.”",
    ],
    explain:
      "Nothing in the library did anything strange. Two real books are in two real hands. The catalog has only one record between them, so every true fact about both gets written into one line and comes out looking impossible.",
  },
  {
    t: "The Case of the Log That Read 38 All Week",
    tag: "🥪 lunchbox",
    story:
      "Food in the staff refrigerator spoiled over a week in which the log read 38 degrees daily. The log has a line for each weekday and a space for initials. All five lines read exactly 38, with no variation of even a single degree. All five were written in the same blue pen in one continuous hand. A refrigerator opened and closed all day does not hold one reading for five days. The thermometer inside was tested in ice water on Friday and read 32 correctly. The compressor runs and the door seal grips a sheet of paper firmly. No power interruption was recorded in the building at any point that week. A dial thermometer left in overnight on Friday read 47 by morning. The log was filled in on Friday afternoon from memory for the whole week. A record written after the fact is a memory, not a measurement.",
    q: "Why did the food spoil when the log said 38?",
    s: [
      { who: "📝 A log filled in from memory", why: "the log was filled in on Friday afternoon from memory for the whole week" },
      { who: "🌡️ A broken thermometer", why: "the thermometer inside was tested in ice water on Friday and read 32 correctly" },
      { who: "🚪 A failing door seal", why: "the compressor runs and the door seal grips a sheet of paper firmly" },
      { who: "⚡ A power cut", why: "no power interruption was recorded in the building at any point that week" },
      { who: "❄️ The refrigerator running warm", why: "a dial thermometer left in overnight on Friday read 47 by morning" },
    ],
    who: 0,
    answer: "The log was written on Friday from memory and never measured anything.",
    proof: [
      "“All five were written in the same blue pen in one continuous hand.”",
      "“A refrigerator opened and closed all day does not hold one reading for five days.”",
    ],
    clears: [
      "The thermometer: “The thermometer inside was tested in ice water on Friday and read 32 correctly.”",
      "The seal: “The compressor runs and the door seal grips a sheet of paper firmly.”",
      "A power cut: “No power interruption was recorded in the building at any point that week.”",
    ],
    explain:
      "The refrigerator really is running warm, and the Friday dial reading of 47 shows it. The log hid that for five days, and it hid it by never being a log. Five identical numbers in one pen is a page somebody filled out, not a week somebody measured.",
  },
  {
    t: "The Case of the Fifty Missing Pencils",
    tag: "✏️ pencil",
    story:
      "The order was for two hundred pencils and the supply closet holds one hundred and fifty. The invoice says two hundred and the delivery was signed for by the office. Eight boxes arrived, and every box label reads twenty-five count in bold print. Eight boxes at twenty-five each is the two hundred the invoice charged for. Mr. Hale opened every box and counted what was inside each one. Six boxes held twenty-five pencils and two held exactly eighteen apiece. The supplier changed its packaging in the autumn and kept printing the old label. The closet has been locked since the delivery and only Mr. Hale holds a key. No pencil has been handed out from that closet since the boxes arrived. Six twenty-fives and two eighteens come to one hundred and eighty-six, not two hundred. The count on the shelf was taken from the labels and not from the pencils.",
    q: "Where did the fifty pencils go?",
    s: [
      { who: "🏷️ The box labels", why: "the supplier changed its packaging in the autumn and kept printing the old label" },
      { who: "🔐 Somebody taking them", why: "the closet has been locked since the delivery and only Mr. Hale holds a key" },
      { who: "🚚 A short delivery", why: "the invoice says two hundred and the delivery was signed for by the office" },
      { who: "✍️ Pencils handed out", why: "no pencil has been handed out from that closet since the boxes arrived" },
      { who: "🧮 The shelf count", why: "the count on the shelf was taken from the labels and not from the pencils" },
    ],
    who: 0,
    answer: "Two boxes labelled twenty-five held eighteen pencils each.",
    proof: [
      "“Six boxes held twenty-five pencils and two held exactly eighteen apiece.”",
      "“The supplier changed its packaging in the autumn and kept printing the old label.”",
    ],
    clears: [
      "Somebody taking them: “The closet has been locked since the delivery and only Mr. Hale holds a key.”",
      "Handing them out: “No pencil has been handed out from that closet since the boxes arrived.”",
      "The shelf count: “The count on the shelf was taken from the labels and not from the pencils.”",
    ],
    explain:
      "The delivery was short and nobody noticed, because everyone who counted was reading labels. The school was charged for two hundred and received one hundred and eighty-six. The remaining gap is the shelf count, which also trusted the print on the box.",
  },
  {
    t: "The Case of the Heavier Apples",
    tag: "🍎 apple",
    story:
      "Group C's apples each weighed about forty grams more than every other group's. All four groups drew their apples from the same crate on the same morning. The apples were measured with a caliper and matched across groups to within a millimetre. Each group used an identical digital scale from the same classroom set. Group C weighed each apple sitting in a small plastic tray for steadiness. The other three groups set each apple directly on the scale plate. A scale zeroed empty counts whatever sits on it, tray included. The trays from that set weigh thirty-nine grams each on a checked balance. Group C zeroed its scale before the tray went on and not after. Every group recorded the number in the display without adjusting it. The apples themselves were never weighed, only the apples plus something else.",
    q: "Why were group C's apples heavier?",
    s: [
      { who: "🍽️ The tray on the scale", why: "group C weighed each apple sitting in a small plastic tray for steadiness" },
      { who: "🍏 Bigger apples", why: "the apples were measured with a caliper and matched across groups to within a millimetre" },
      { who: "⚖️ A faulty scale", why: "each group used an identical digital scale from the same classroom set" },
      { who: "📦 A different crate", why: "all four groups drew their apples from the same crate on the same morning" },
      { who: "🔢 The recorded numbers", why: "every group recorded the number in the display without adjusting it" },
    ],
    who: 0,
    answer: "Group C weighed the tray along with every apple.",
    proof: [
      "“Group C zeroed its scale before the tray went on and not after.”",
      "“The trays from that set weigh thirty-nine grams each on a checked balance.”",
    ],
    clears: [
      "Bigger apples: “The apples were measured with a caliper and matched across groups to within a millimetre.”",
      "The scale: “Each group used an identical digital scale from the same classroom set.”",
      "The crate: “All four groups drew their apples from the same crate on the same morning.”",
    ],
    explain:
      "Nothing is wrong with the scale and nothing is wrong with the apples. The thirty-nine grams of tray is in every one of group C's numbers, which is why the gap is the same size every time instead of varying the way a real difference would.",
  },
  {
    t: "The Case of the Ride That Grew",
    tag: "🚲 bike",
    story:
      "Priya's bike computer says she rode fourteen miles on a route the map measures at eleven. It has said the same thing on four different rides this month. The map distance was checked twice with a measuring wheel along the whole route. She did not take a detour, and her riding partner's computer read eleven. A bike computer counts wheel turns and multiplies by the wheel size it is set to. Her setting reads 2096 millimetres, the figure for a 700c road wheel. Her bike has 26-inch wheels, which roll about 2070 millimetres a turn. A wrong setting cannot change the distance ridden, only the distance displayed. The magnet is tight and a loose one would undercount, not overcount. Her partner's computer is set to the wheel size that partner's bike actually has. The ratio between fourteen and eleven is far larger than those two wheel figures explain.",
    q: "Why does the computer read three miles long?",
    s: [
      { who: "⚙️ The wheel size setting", why: "a wrong setting cannot change the distance ridden, only the distance displayed" },
      { who: "🗺️ A wrong map distance", why: "the map distance was checked twice with a measuring wheel along the whole route" },
      { who: "🔀 A detour", why: "she did not take a detour, and her riding partner's computer read eleven" },
      { who: "🧲 A loose magnet", why: "the magnet is tight and a loose one would undercount, not overcount" },
      { who: "🔢 The displayed number", why: "the ratio between fourteen and eleven is far larger than those two wheel figures explain" },
    ],
    who: 0,
    answer: "The computer is set for a wheel her bike does not have.",
    proof: [
      "“Her setting reads 2096 millimetres, the figure for a 700c road wheel.”",
      "“A wrong setting cannot change the distance ridden, only the distance displayed.”",
    ],
    clears: [
      "The map: “The map distance was checked twice with a measuring wheel along the whole route.”",
      "A detour: “She did not take a detour, and her riding partner's computer read eleven.”",
      "The magnet: “The magnet is tight and a loose one would undercount, not overcount.”",
    ],
    explain:
      "Priya rode eleven miles. She has ridden eleven miles every time. The only thing that grew is a number on a display, and the last line is the warning: the gap is bigger than the wheel figures alone account for, so the setting is further off than she thinks.",
  },
  {
    t: "The Case of the Test That Said Zero",
    tag: "🐠 fishtank",
    story:
      "The nitrate test reads zero every week while the fish hang near the surface and eat poorly. Zero nitrate in a stocked tank that has run since September is not believable. Something is always breaking down waste, and the end of that process is nitrate. The kit's second bottle must be shaken hard for thirty seconds before use. Its contents settle into a layer that will not mix on its own. The class has been adding drops from a bottle nobody has shaken since October. The kit's printed expiry is next June, so it has not run out of date. The tank's filter runs, the heater holds 76, and the water is clear. A sample taken to the pet shop on Saturday tested at 80 parts per million. A reading of zero from an unshaken bottle is not a measurement of anything.",
    q: "Why does the test read zero?",
    s: [
      { who: "🧪 The unshaken second bottle", why: "the class has been adding drops from a bottle nobody has shaken since October" },
      { who: "📅 An expired kit", why: "the kit's printed expiry is next June, so it has not run out of date" },
      { who: "🌀 A very clean tank", why: "zero nitrate in a stocked tank that has run since September is not believable" },
      { who: "🔥 The heater", why: "the tank's filter runs, the heater holds 76, and the water is clear" },
      { who: "0️⃣ The reading itself", why: "a reading of zero from an unshaken bottle is not a measurement of anything" },
    ],
    who: 0,
    answer: "The second bottle has not been shaken, so the test cannot work.",
    proof: [
      "“The kit's second bottle must be shaken hard for thirty seconds before use.”",
      "“A sample taken to the pet shop on Saturday tested at 80 parts per million.”",
    ],
    clears: [
      "An expired kit: “The kit's printed expiry is next June, so it has not run out of date.”",
      "A clean tank: “Zero nitrate in a stocked tank that has run since September is not believable.”",
      "The heater: “The tank's filter runs, the heater holds 76, and the water is clear.”",
    ],
    explain:
      "The fish were telling the truth the whole time and the kit was not. The pet shop sample settles it at 80. A result that is too good to be true is worth testing against something outside the instrument that produced it.",
  },
  {
    t: "The Case of the Quiet Reading",
    tag: "🔊 noise",
    story:
      "A phone app recorded Room 4 at 55 decibels, which the report called a quiet classroom. Every teacher who has taught in Room 4 describes it as among the loudest in the building. The app stamps each reading with the time it was taken, and the stamps survive. All six readings fall between 10:05 and 10:08 on three different mornings. Room 4 holds silent independent reading from ten o'clock until ten fifteen. A measurement describes the moment it was taken and nothing on either side of it. A sound meter borrowed from the district read 78 decibels at 1:30 that same week. The phone's microphone was clear and the app had been calibrated in August. The app's own readings during group work on Thursday reached 74 decibels. The report quoted only the six morning figures and left the Thursday ones out.",
    q: "Why does the report call Room 4 quiet?",
    s: [
      { who: "⏰ Readings taken during silent reading", why: "all six readings fall between 10:05 and 10:08 on three different mornings" },
      { who: "📱 A bad microphone", why: "the phone's microphone was clear and the app had been calibrated in August" },
      { who: "🤫 A genuinely quiet room", why: "a sound meter borrowed from the district read 78 decibels at 1:30 that same week" },
      { who: "🎚️ A miscalibrated app", why: "the app's own readings during group work on Thursday reached 74 decibels" },
      { who: "📄 The report", why: "the report quoted only the six morning figures and left the Thursday ones out" },
    ],
    who: 0,
    answer: "All six readings were taken during the quietest fifteen minutes of the day.",
    proof: [
      "“Room 4 holds silent independent reading from ten o'clock until ten fifteen.”",
      "“A measurement describes the moment it was taken and nothing on either side of it.”",
    ],
    clears: [
      "The microphone: “The phone's microphone was clear and the app had been calibrated in August.”",
      "A quiet room: “A sound meter borrowed from the district read 78 decibels at 1:30 that same week.”",
      "Calibration: “The app's own readings during group work on Thursday reached 74 decibels.”",
    ],
    explain:
      "The app worked. Every number it produced is accurate for the three minutes it covers. The report turned six accurate numbers about silent reading into a claim about a whole school day, and dropped the Thursday figures that would have shown the difference.",
  },
  {
    t: "The Case of the Quadrat by the Fence",
    tag: "🍂 leaves",
    story:
      "Group B counted 340 fallen leaves in its square where the other groups counted around 90. All five groups used a square frame measured at one metre on every side. All five counted whole leaves only, with torn pieces left out by agreement. All five counted on the same Friday morning within half an hour of each other. Group B set its frame directly against the base of the north fence. Wind pushes fallen leaves until something stops them, and a fence stops them. Leaves pile deep along a barrier and thin out across open ground. The other four frames were set at random points across the open lawn. A sample taken where a thing collects will not describe the ground around it. Group B counted carefully and counted correctly, and its number is still wrong for the lawn.",
    q: "Why is group B's count four times the others?",
    s: [
      { who: "🚧 The frame against the fence", why: "group B set its frame directly against the base of the north fence" },
      { who: "📐 A bigger frame", why: "all five groups used a square frame measured at one metre on every side" },
      { who: "🍁 Counting torn pieces", why: "all five counted whole leaves only, with torn pieces left out by agreement" },
      { who: "🕘 Counting at a different hour", why: "all five counted on the same Friday morning within half an hour of each other" },
      { who: "🔢 Careless counting", why: "group B counted carefully and counted correctly, and its number is still wrong for the lawn" },
    ],
    who: 0,
    answer: "Group B sampled the one place on the lawn where leaves pile up.",
    proof: [
      "“Wind pushes fallen leaves until something stops them, and a fence stops them.”",
      "“A sample taken where a thing collects will not describe the ground around it.”",
    ],
    clears: [
      "A bigger frame: “All five groups used a square frame measured at one metre on every side.”",
      "Torn pieces: “All five counted whole leaves only, with torn pieces left out by agreement.”",
      "The hour: “All five counted on the same Friday morning within half an hour of each other.”",
    ],
    explain:
      "This is the hardest kind of wrong number to catch, because nobody made a mistake. Group B's 340 is a true count of a real square metre. Where the square was placed is what makes it useless for describing the lawn.",
  },
  {
    t: "The Case of the Pumpkin That Gained Weight",
    tag: "🎃 pumpkin",
    story:
      "The pumpkin lost weight for three weeks, gained nine ounces in week four, and lost again after. A cut pumpkin drying on a porch loses water steadily and does not take it back. The same scale was used every week and its serial number is on every sheet. The scale was checked against a two-pound weight before and after week four. Every reading was photographed, and week four's photograph matches the sheet exactly. Weeks one, two, three and five were weighed at noon in dry weather. Week four was weighed at seven in the morning after a night of heavy rain. The porch rail is open on the weather side and the pumpkin sat in the wet. Water sitting on a surface is weighed along with whatever is under it. Nine ounces is about half a cup, which a wet pumpkin skin can easily hold.",
    q: "Why does week four show a gain?",
    s: [
      { who: "🌧️ Rainwater on the surface", why: "week four was weighed at seven in the morning after a night of heavy rain" },
      { who: "⚖️ A faulty scale", why: "the scale was checked against a two-pound weight before and after week four" },
      { who: "✍️ A miscopied number", why: "every reading was photographed, and week four's photograph matches the sheet exactly" },
      { who: "🎃 A pumpkin actually gaining", why: "a cut pumpkin drying on a porch loses water steadily and does not take it back" },
      { who: "🔀 A different scale", why: "the same scale was used every week and its serial number is on every sheet" },
    ],
    who: 0,
    answer: "Week four weighed the pumpkin plus a night of rain sitting on it.",
    proof: [
      "“Water sitting on a surface is weighed along with whatever is under it.”",
      "“Nine ounces is about half a cup, which a wet pumpkin skin can easily hold.”",
    ],
    clears: [
      "The scale: “The scale was checked against a two-pound weight before and after week four.”",
      "A miscopy: “Every reading was photographed, and week four's photograph matches the sheet exactly.”",
      "A real gain: “A cut pumpkin drying on a porch loses water steadily and does not take it back.”",
    ],
    explain:
      "Every check anyone ran was a check on the scale or the record, and both were fine. The thing nobody checked was what was on the pumpkin when it went on the scale. Four of the five weighings had a rule nobody had written down: noon, and dry.",
  },
  {
    t: "The Case of the Print That Measured Twelve",
    tag: "👣 footprints",
    story:
      "The print in the flowerbed measured eleven and a half inches, pointing to a very large shoe. Nobody at the school wears a shoe that size, and the search stalled there. The print was never measured in the bed itself before the rain came. It was measured from a photograph, using a brick in the frame as the scale. The measurer assumed the bricks were eight inches long, as most bricks are. The school's walls are built of a seven-inch brick used only in this county. Every length taken from that photograph is therefore about one part in eight too large. Corrected to a seven-inch brick, the print measures just over ten inches. A print pressed into soft soil also spreads wider than the sole that made it. A measurement is only as good as the thing it was compared against.",
    q: "Why did the print measure so large?",
    s: [
      { who: "🧱 The assumed brick length", why: "the measurer assumed the bricks were eight inches long, as most bricks are" },
      { who: "👟 A genuinely huge shoe", why: "corrected to a seven-inch brick, the print measures just over ten inches" },
      { who: "📏 A faulty ruler", why: "it was measured from a photograph, using a brick in the frame as the scale" },
      { who: "🌱 Soil spreading the print", why: "a print pressed into soft soil also spreads wider than the sole that made it" },
      { who: "📷 The photograph", why: "a measurement is only as good as the thing it was compared against" },
    ],
    who: 0,
    answer: "The scale brick was seven inches, not the eight that was assumed.",
    proof: [
      "“The school's walls are built of a seven-inch brick used only in this county.”",
      "“Every length taken from that photograph is therefore about one part in eight too large.”",
    ],
    clears: [
      "A huge shoe: “Corrected to a seven-inch brick, the print measures just over ten inches.”",
      "A ruler: “It was measured from a photograph, using a brick in the frame as the scale.”",
      "The soil: “A print pressed into soft soil also spreads wider than the sole that made it.”",
    ],
    explain:
      "No ruler was wrong and no photograph was faked. One assumption was carried into every number without being checked, and it was off by an inch. The soil spreading the print pushes the real shoe smaller still.",
  },
  {
    t: "The Case of the Vanishing Riders",
    tag: "🚌 bus",
    story:
      "The October report shows ridership on route 6 down thirty percent from September. Enrollment along that route rose by four students over the same month. The driver says the bus is as full as it has ever been in her years there. Riders are counted by a hand tally the driver keeps at the front door. In late September the school began letting students board through the rear door. The tally sheet has no line for the rear door and never has had one. Students boarding at the rear are not counted anywhere in the system. The fare box counts nothing, since this route has never charged a fare. The tally sheet's total and the number of bodies on the bus stopped matching in September. A count that only looks at one door measures that door, not the bus.",
    q: "Why does ridership appear to have fallen?",
    s: [
      { who: "🚪 Rear-door boarding", why: "in late september the school began letting students board through the rear door" },
      { who: "📉 Fewer students riding", why: "enrollment along that route rose by four students over the same month" },
      { who: "🖐️ A broken counter", why: "riders are counted by a hand tally the driver keeps at the front door" },
      { who: "💰 The fare box", why: "the fare box counts nothing, since this route has never charged a fare" },
      { who: "📋 The tally sheet", why: "the tally sheet has no line for the rear door and never has had one" },
    ],
    who: 0,
    answer: "Students boarding at the rear door are not counted at all.",
    proof: [
      "“Students boarding at the rear are not counted anywhere in the system.”",
      "“A count that only looks at one door measures that door, not the bus.”",
    ],
    clears: [
      "Fewer riders: “Enrollment along that route rose by four students over the same month.”",
      "A broken counter: “Riders are counted by a hand tally the driver keeps at the front door.”",
      "The fare box: “The fare box counts nothing, since this route has never charged a fare.”",
    ],
    explain:
      "Nothing happened to ridership. Something happened to the counting. The drop is exactly the size of the change in how students get on, and the report has no way of knowing that because its sheet was printed before the rear door opened.",
  },
  {
    t: "The Case of the Trophy With the Wrong Year",
    tag: "🏆 trophy",
    story:
      "The relay trophy is engraved 1998, and the record book says the team won in 1997. Somebody proposed that the engraver made a mistake and should be billed for it. The case holds eleven other trophies from eleven other seasons on the same shelf. Every one of them is engraved with a year one later than its season in the book. An error repeated eleven times in the same direction is not an error. Trophies in this league are presented at the spring banquet following the autumn season. The engraving records the year of presentation, which the league has always done. The record book records the year of the season, which is a different thing. The plate on the 1998 trophy is original and shows no sign of replacement. Two records can disagree completely and both be perfectly correct.",
    q: "Why does the trophy say 1998?",
    s: [
      { who: "🗓️ Presentation year versus season year", why: "the engraving records the year of presentation, which the league has always done" },
      { who: "✒️ An engraver's mistake", why: "an error repeated eleven times in the same direction is not an error" },
      { who: "📕 A wrong record book", why: "the record book records the year of the season, which is a different thing" },
      { who: "🔩 A replaced plate", why: "the plate on the 1998 trophy is original and shows no sign of replacement" },
      { who: "🏅 The other eleven trophies", why: "every one of them is engraved with a year one later than its season in the book" },
    ],
    who: 0,
    answer: "The engraving records the spring banquet, not the autumn season.",
    proof: [
      "“Trophies in this league are presented at the spring banquet following the autumn season.”",
      "“Two records can disagree completely and both be perfectly correct.”",
    ],
    clears: [
      "The engraver: “An error repeated eleven times in the same direction is not an error.”",
      "The record book: “The record book records the year of the season, which is a different thing.”",
      "A replaced plate: “The plate on the 1998 trophy is original and shows no sign of replacement.”",
    ],
    explain:
      "The clue is the pattern. One trophy off by a year is a mistake; twelve off by a year in the same direction is a rule nobody wrote down. Both records are accurate about different events, and the only error was assuming they were about the same one.",
  },
  {
    t: "The Case of the Thermometer in the Wrong Place",
    tag: "🦃 turkey",
    story:
      "The probe read 181 degrees, well past done, and the thigh ran pink when it was carved. The thermometer was tested in boiling water that morning and read 212 exactly. The oven was checked with a second thermometer and held its setting all afternoon. The recipe asks for the probe in the thickest part of the thigh, clear of bone. The cook pushed the probe in until it met resistance and stopped there. Resistance in a thigh means bone, and bone sits right against the oven's heat. Bone carries heat faster than meat and runs hotter than the flesh around it. A reading taken against bone describes the bone, not the meat beside it. Moved an inch back into the muscle, the same probe read 154. Nothing was wrong with the thermometer, the oven, the bird or the recipe.",
    q: "Why did the probe read done when the thigh was not?",
    s: [
      { who: "🦴 The probe resting on bone", why: "resistance in a thigh means bone, and bone sits right against the oven's heat" },
      { who: "🌡️ A faulty thermometer", why: "the thermometer was tested in boiling water that morning and read 212 exactly" },
      { who: "♨️ An uneven oven", why: "the oven was checked with a second thermometer and held its setting all afternoon" },
      { who: "📖 The recipe", why: "the recipe asks for the probe in the thickest part of the thigh, clear of bone" },
      { who: "🔢 The 181 reading", why: "a reading taken against bone describes the bone, not the meat beside it" },
    ],
    who: 0,
    answer: "The probe was touching bone, which runs hotter than the meat.",
    proof: [
      "“Bone carries heat faster than meat and runs hotter than the flesh around it.”",
      "“Moved an inch back into the muscle, the same probe read 154.”",
    ],
    clears: [
      "The thermometer: “The thermometer was tested in boiling water that morning and read 212 exactly.”",
      "The oven: “The oven was checked with a second thermometer and held its setting all afternoon.”",
      "The recipe: “The recipe asks for the probe in the thickest part of the thigh, clear of bone.”",
    ],
    explain:
      "The same probe gives two readings thirty degrees apart an inch from each other, which settles that the instrument is fine. Pushing in until something stops you is exactly the instruction the recipe warns against, and it puts the tip on the hottest thing in the bird.",
  },
  {
    t: "The Case of the Cup That Was Not a Cup",
    tag: "🧁 cupcake",
    story:
      "Period 2's cupcakes came out dry and tough and period 4's came out tender. Both classes worked from the same printed recipe, which asks for one cup of flour. Both drew that flour from the same sack in the same storeroom. Both baked on the middle rack of the same oven at the same setting. Both trays came out when the same timer reached eighteen minutes. Period 2 scooped the measuring cup straight down into the sack and levelled it. Period 4 spooned flour loosely into the cup and then levelled it off. Scooping packs flour into a cup and spooning leaves it loose. One cup of flour weighs anywhere from 120 to 150 grams depending on how it is filled. Weighed afterwards, period 2's cup came to 148 grams and period 4's to 123. That is a fifth more flour in a recipe where a fifth is the difference.",
    q: "Why were period 2's cupcakes dry?",
    s: [
      { who: "🥄 Scooping the cup into the sack", why: "period 2 scooped the measuring cup straight down into the sack and levelled it" },
      { who: "♨️ The oven", why: "both baked on the middle rack of the same oven at the same setting" },
      { who: "🌾 A different flour", why: "both drew that flour from the same sack in the same storeroom" },
      { who: "⏲️ Overbaking", why: "both trays came out when the same timer reached eighteen minutes" },
      { who: "📝 The one cup in the recipe", why: "one cup of flour weighs anywhere from 120 to 150 grams depending on how it is filled" },
    ],
    who: 0,
    answer: "Period 2 packed twenty-five grams more flour into the same cup.",
    proof: [
      "“Weighed afterwards, period 2's cup came to 148 grams and period 4's to 123.”",
      "“That is a fifth more flour in a recipe where a fifth is the difference.”",
    ],
    clears: [
      "The oven: “Both baked on the middle rack of the same oven at the same setting.”",
      "The flour: “Both drew that flour from the same sack in the same storeroom.”",
      "Overbaking: “Both trays came out when the same timer reached eighteen minutes.”",
    ],
    explain:
      "Both classes followed the recipe exactly, which is the point. A cup measures space, and flour can be loose or packed in the same space. The recipe never said which, so following it precisely still produced two different cakes — and the fifth suspect, that one cup, is as much to blame as the scooping.",
  },
  {
    t: "The Case of the Log That Balanced",
    tag: "🧤 mitten",
    story:
      "The lost and found log shows fourteen pairs of mittens turned in and fourteen claimed. By that record nothing is missing, and yet three students are still without mittens. Mr. Oyelaran emptied the bin and laid out everything that had come through it. Seven of the fourteen entries turned out to be single mittens, not pairs. The log has one column headed pairs and no column for a single at all. Whoever logged a lone mitten wrote it in the only column there was. Seven singles counted as seven pairs inflates the record by seven mittens. Claimed items were logged the same way, which is why the two totals still match. Two wrong numbers that are wrong by the same amount will balance perfectly. The bin itself is empty and has been checked twice by two people.",
    q: "Why are mittens missing when the log balances?",
    s: [
      { who: "📋 Singles logged as pairs", why: "seven of the fourteen entries turned out to be single mittens, not pairs" },
      { who: "🗑️ Mittens still in the bin", why: "the bin itself is empty and has been checked twice by two people" },
      { who: "🙋 Students claiming the wrong pair", why: "claimed items were logged the same way, which is why the two totals still match" },
      { who: "➕ A counting error", why: "two wrong numbers that are wrong by the same amount will balance perfectly" },
      { who: "📊 The balanced totals", why: "the log has one column headed pairs and no column for a single at all" },
    ],
    who: 0,
    answer: "Seven single mittens were logged in the only column there was.",
    proof: [
      "“The log has one column headed pairs and no column for a single at all.”",
      "“Seven singles counted as seven pairs inflates the record by seven mittens.”",
    ],
    clears: [
      "The bin: “The bin itself is empty and has been checked twice by two people.”",
      "Wrong claims: “Claimed items were logged the same way, which is why the two totals still match.”",
      "A counting error: “Two wrong numbers that are wrong by the same amount will balance perfectly.”",
    ],
    explain:
      "A balanced record feels like proof and is not. Both sides of this one were inflated the same way by the same form, so they agree with each other and disagree with the coat rack. The missing column is doing all the damage.",
  },
  {
    t: "The Case of the Dial That Said 350",
    tag: "🎄 ginger",
    story:
      "Every gingerbread batch comes out pale and soft though the dial is set to 350. The recipe has worked in three other kitchens without a single change to it. An oven thermometer hung from the middle rack reads 325 after a full hour. A second oven thermometer from a different shop reads 324 on the same rack. Two instruments that agree with each other and disagree with a dial are worth believing. The dial is a request for a temperature and not a report of one. An oven's dial can drift years out of true without anything looking wrong. Set to 375, the dial brings the rack thermometers to 350 and the batches brown properly. The bake time was held at twelve minutes throughout, exactly as written. Nothing about the dough, the recipe or the timing was ever the problem.",
    q: "Why do the batches come out pale?",
    s: [
      { who: "🎚️ A dial reading high", why: "an oven thermometer hung from the middle rack reads 325 after a full hour" },
      { who: "📖 The recipe", why: "the recipe has worked in three other kitchens without a single change to it" },
      { who: "⏲️ The bake time", why: "the bake time was held at twelve minutes throughout, exactly as written" },
      { who: "🌡️ A bad oven thermometer", why: "a second oven thermometer from a different shop reads 324 on the same rack" },
      { who: "🍪 The dough", why: "nothing about the dough, the recipe or the timing was ever the problem" },
    ],
    who: 0,
    answer: "The dial says 350 while the oven holds 325.",
    proof: [
      "“The dial is a request for a temperature and not a report of one.”",
      "“Set to 375, the dial brings the rack thermometers to 350 and the batches brown properly.”",
    ],
    clears: [
      "The recipe: “The recipe has worked in three other kitchens without a single change to it.”",
      "The time: “The bake time was held at twelve minutes throughout, exactly as written.”",
      "A bad thermometer: “A second oven thermometer from a different shop reads 324 on the same rack.”",
    ],
    explain:
      "Two thermometers from two shops agreeing within a degree is as close to independent confirmation as a kitchen gets. The dial is the one voice disagreeing, and the test at 375 proves the point by making the problem go away.",
  },
  {
    t: "The Case of the Twenty-Five Watt Label",
    tag: "💡 lights",
    story:
      "The display breaker trips within a minute every time the last string is plugged in. The circuit is rated for 1800 watts and the plan called for well under that. Each box is labelled twenty-five watts, and the plan multiplied twenty-five by twenty strings. Five hundred watts is nowhere near 1800, so the plan looked comfortable. The twenty-five watts on the box is the rating of a replacement bulb, not the string. Each string holds a hundred bulbs and the fine print gives its total as 240 watts. Twenty strings at 240 watts each comes to 4800 watts on one circuit. The breaker was swapped for a new one and trips in exactly the same way. The extension cords are rated for fifteen amps and are cool to the touch. A number on a box means nothing until you know what it is a number for.",
    q: "Why does the breaker keep tripping?",
    s: [
      { who: "🔢 Misreading the box label", why: "the twenty-five watts on the box is the rating of a replacement bulb, not the string" },
      { who: "🧯 A faulty breaker", why: "the breaker was swapped for a new one and trips in exactly the same way" },
      { who: "🪢 The extension cords", why: "the extension cords are rated for fifteen amps and are cool to the touch" },
      { who: "⚡ An undersized circuit", why: "the circuit is rated for 1800 watts and the plan called for well under that" },
      { who: "📐 The plan", why: "each box is labelled twenty-five watts, and the plan multiplied twenty-five by twenty strings" },
    ],
    who: 0,
    answer: "The twenty-five watts is one bulb, and each string draws 240.",
    proof: [
      "“Each string holds a hundred bulbs and the fine print gives its total as 240 watts.”",
      "“Twenty strings at 240 watts each comes to 4800 watts on one circuit.”",
    ],
    clears: [
      "The breaker: “The breaker was swapped for a new one and trips in exactly the same way.”",
      "The cords: “The extension cords are rated for fifteen amps and are cool to the touch.”",
      "The circuit: “The circuit is rated for 1800 watts and the plan called for well under that.”",
    ],
    explain:
      "The breaker is doing its job correctly. The plan asked a circuit built for 1800 watts to carry 4800, and it did so because of one number read as the wrong kind of number. The last line is the lesson: a figure without its unit attached is not information.",
  },
  {
    t: "The Case of the Time That Was Too Good",
    tag: "⏰ clock",
    story:
      "The hand-timed hundred metres came out four tenths faster than the electronic system's time. The electronic system starts on the gun's electrical signal and stops at a beam. The hand timer stood at the finish line, a hundred metres from the starter. He started his watch when he heard the gun rather than when he saw the smoke. Sound travels a hundred metres in roughly three tenths of a second. A watch started three tenths late records a run three tenths shorter than it was. Human reaction at the finish adds a little more in the same direction. Both systems were tested against each other over a fifty metre run and differed by half as much. The stopwatch itself was checked against a time signal and keeps accurate time. A faster time is not always a faster runner.",
    q: "Why was the hand time faster?",
    s: [
      { who: "🔊 Starting on the sound", why: "he started his watch when he heard the gun rather than when he saw the smoke" },
      { who: "🏃 A faster run", why: "a faster time is not always a faster runner" },
      { who: "⌚ A fast stopwatch", why: "the stopwatch itself was checked against a time signal and keeps accurate time" },
      { who: "💻 The electronic system", why: "the electronic system starts on the gun's electrical signal and stops at a beam" },
      { who: "🖐️ Reaction at the finish", why: "human reaction at the finish adds a little more in the same direction" },
    ],
    who: 0,
    answer: "The watch started three tenths late, when the sound of the gun arrived.",
    proof: [
      "“Sound travels a hundred metres in roughly three tenths of a second.”",
      "“A watch started three tenths late records a run three tenths shorter than it was.”",
    ],
    clears: [
      "A faster run: “A faster time is not always a faster runner.”",
      "The stopwatch: “The stopwatch itself was checked against a time signal and keeps accurate time.”",
      "The electronic system: “The electronic system starts on the gun's electrical signal and stops at a beam.”",
    ],
    explain:
      "The fifty metre test is the confirmation: half the distance, half the error, which is exactly what a sound delay does and not what a broken watch does. The runner ran the slower time. The watch recorded a shorter race.",
  },
  {
    t: "The Case of the Storm Measured Twice",
    tag: "⛄ snow",
    story:
      "The weather station reported four inches and the school's own board recorded nine. Both numbers were taken honestly, and neither observer made an arithmetic error. The school clears its measuring board and takes a fresh reading every six hours. It took four readings through the storm and added them to reach nine inches. The station takes one reading at the end, measuring the depth that is still lying. Snow settles under its own weight from the moment it lands. Four separate fresh falls summed will always exceed the depth left at the end. Both methods are standard, and each answers a question the other does not. The school ruler and the station gauge were compared afterwards and agree exactly. The storm ran for just under twenty-four hours from first flake to last. Drifting was ruled out because both sites are flat, open and sheltered from wind.",
    q: "Why do the two snow totals disagree?",
    s: [
      { who: "📏 Summing four cleared-board readings", why: "it took four readings through the storm and added them to reach nine inches" },
      { who: "🌬️ Drifting", why: "drifting was ruled out because both sites are flat, open and sheltered from wind" },
      { who: "📐 A faulty ruler", why: "the school ruler and the station gauge were compared afterwards and agree exactly" },
      { who: "➕ An arithmetic error", why: "both numbers were taken honestly, and neither observer made an arithmetic error" },
      { who: "❄️ One of the two being wrong", why: "both methods are standard, and each answers a question the other does not" },
    ],
    who: 0,
    answer: "The school summed four fresh falls and the station measured what was left lying.",
    proof: [
      "“Snow settles under its own weight from the moment it lands.”",
      "“Four separate fresh falls summed will always exceed the depth left at the end.”",
    ],
    clears: [
      "Drifting: “Drifting was ruled out because both sites are flat, open and sheltered from wind.”",
      "The ruler: “The school ruler and the station gauge were compared afterwards and agree exactly.”",
      "Arithmetic: “Both numbers were taken honestly, and neither observer made an arithmetic error.”",
    ],
    explain:
      "Nobody is wrong here, which is the hard part. Nine inches of snow fell and four inches were lying at the end, and both sentences are true at once. The disagreement is between two definitions of how much snow, not between two measurements.",
  },
  {
    t: "The Case of the Forty Chickadees",
    tag: "🐦 feeder",
    story:
      "The tally sheet records forty chickadees at the feeder in one hour on Saturday. The yard is small, and forty chickadees at once would fill the hedge completely. The observer marked the sheet every time a chickadee landed on the perch. One bird in the yard carries a numbered band from a ringing project nearby. That banded bird was recorded six separate times within the same hour. A tally of landings counts visits and cannot count individuals at all. Three observers watched together and their sheets agree within one mark. A photograph taken at the busiest moment shows seven birds in the frame. Seven birds making six visits each in an hour comes to about forty landings. The feeder holds four perches and never showed more than four birds at once. Nothing is wrong with the counting; the sheet simply counts a different thing.",
    q: "Were there really forty chickadees?",
    s: [
      { who: "🔁 Repeat visits by the same birds", why: "that banded bird was recorded six separate times within the same hour" },
      { who: "🐤 A flock of forty", why: "a photograph taken at the busiest moment shows seven birds in the frame" },
      { who: "✏️ A miscount", why: "three observers watched together and their sheets agree within one mark" },
      { who: "🪟 The observer's view", why: "the observer marked the sheet every time a chickadee landed on the perch" },
      { who: "📋 The tally sheet", why: "a tally of landings counts visits and cannot count individuals at all" },
    ],
    who: 0,
    answer: "About seven birds made forty landings between them.",
    proof: [
      "“That banded bird was recorded six separate times within the same hour.”",
      "“Seven birds making six visits each in an hour comes to about forty landings.”",
    ],
    clears: [
      "A flock of forty: “A photograph taken at the busiest moment shows seven birds in the frame.”",
      "A miscount: “Three observers watched together and their sheets agree within one mark.”",
      "The view: “The observer marked the sheet every time a chickadee landed on the perch.”",
    ],
    explain:
      "The banded bird is the whole case. It is one bird, and it is on the sheet six times, which proves the sheet counts landings. Forty is a perfectly accurate number and the word after it is wrong.",
  },
  {
    t: "The Case of the Ninety-Two Percent",
    tag: "☕ cocoa",
    story:
      "The report says ninety-two percent of students prefer the school's cocoa to the shop's. Two hundred students answered, which is a reasonable number for a school this size. The question was worded plainly and offered both options in a neutral order. Every form was tallied twice by two different students and the totals matched. The survey was handed out at the cocoa stand to students buying cocoa. Everyone asked had already chosen to spend money on the thing being asked about. A sample drawn from the people who already prefer something will prefer it. Students who dislike the cocoa had no way of entering the survey at all. The same question asked in homerooms the following week came back at fifty-four percent. Nobody who dislikes the cocoa was ever likely to be standing in that line. Who you ask decides your answer before the question is read.",
    q: "Why is the ninety-two percent misleading?",
    s: [
      { who: "📍 Surveying at the cocoa stand", why: "the survey was handed out at the cocoa stand to students buying cocoa" },
      { who: "🔢 Too small a sample", why: "two hundred students answered, which is a reasonable number for a school this size" },
      { who: "❓ A leading question", why: "the question was worded plainly and offered both options in a neutral order" },
      { who: "🧮 A tallying error", why: "every form was tallied twice by two different students and the totals matched" },
      { who: "📊 The ninety-two itself", why: "who you ask decides your answer before the question is read" },
    ],
    who: 0,
    answer: "Everyone surveyed had already bought cocoa at the stand.",
    proof: [
      "“A sample drawn from the people who already prefer something will prefer it.”",
      "“The same question asked in homerooms the following week came back at fifty-four percent.”",
    ],
    clears: [
      "Sample size: “Two hundred students answered, which is a reasonable number for a school this size.”",
      "The question: “The question was worded plainly and offered both options in a neutral order.”",
      "The tally: “Every form was tallied twice by two different students and the totals matched.”",
    ],
    explain:
      "Everything about this survey was done carefully except the one thing nobody thought of as a choice. The homeroom result at fifty-four percent is the same question asked of everybody, and it is thirty-eight points away.",
  },
  {
    t: "The Case of the Average Fourteen Cards",
    tag: "💌 valentine",
    story:
      "The report says students received fourteen valentines on average, and most students feel cheated. Twenty-eight students were counted and the total came to three hundred and ninety-two. Three hundred and ninety-two divided by twenty-eight is exactly fourteen, so the arithmetic holds. Every bag was counted twice and no card was counted in two bags. No student's bag was opened twice, and each count was initialled by two people. Three students run the school's social accounts and received eighty-one, seventy-four and sixty-eight. The remaining twenty-five students received between two and nine cards each. Lined up in order, the middle student in the class received five cards. A mean can sit far outside the range where almost everybody actually is. Half the class got five or fewer and the report still says fourteen. The mean and the middle are both true and they describe different classrooms.",
    q: "Why does the average feel wrong?",
    s: [
      { who: "📈 A mean pulled by three large counts", why: "three students run the school's social accounts and received eighty-one, seventy-four and sixty-eight" },
      { who: "➗ A division error", why: "three hundred and ninety-two divided by twenty-eight is exactly fourteen, so the arithmetic holds" },
      { who: "👜 Missed bags", why: "every bag was counted twice and no card was counted in two bags" },
      { who: "✌️ Double counting", why: "no student's bag was opened twice, and each count was initialled by two people" },
      { who: "🔢 The word average", why: "a mean can sit far outside the range where almost everybody actually is" },
    ],
    who: 0,
    answer: "Three students received over two hundred cards between them.",
    proof: [
      "“The remaining twenty-five students received between two and nine cards each.”",
      "“Lined up in order, the middle student in the class received five cards.”",
    ],
    clears: [
      "Division: “Three hundred and ninety-two divided by twenty-eight is exactly fourteen, so the arithmetic holds.”",
      "Missed bags: “Every bag was counted twice and no card was counted in two bags.”",
      "The mean: “A mean can sit far outside the range where almost everybody actually is.”",
    ],
    explain:
      "Fourteen is correct and useless. Not one student in this class received fourteen valentines, and half received five or fewer. The middle student is the number that describes the room, and the report did not ask for it.",
  },
  {
    t: "The Case of the Eruption Nobody Saw",
    tag: "🌋 volcano",
    story:
      "Group D's data sheet records no reaction at all, and the class wrote their model off. Their vinegar came from the same jug that worked for the other five groups. Their baking soda was weighed on the same balance to the same two grams. Their cone was built on the same mold, and its vent is the same width. The instructions ask each group to observe for thirty seconds after pouring. Group D's vinegar had been stored on the cold windowsill and was near freezing. A cold reaction runs slower and takes longer to build enough gas to rise. The group recorded nothing, packed up and left the room at the thirty-second mark. The custodian found their cone overflowed and the table wet that evening. A sheet that says no reaction is a record of what somebody watched.",
    q: "Why does the sheet say no reaction?",
    s: [
      { who: "🥶 Cold vinegar reacting slowly", why: "their vinegar had been stored on the cold windowsill and was near freezing" },
      { who: "🧂 Too little baking soda", why: "their baking soda was weighed on the same balance to the same two grams" },
      { who: "🧴 Weak vinegar", why: "their vinegar came from the same jug that worked for the other five groups" },
      { who: "🏔️ A blocked vent", why: "their cone was built on the same mold, and its vent is the same width" },
      { who: "📄 The thirty-second window", why: "the group recorded nothing, packed up and left the room at the thirty-second mark" },
    ],
    who: 0,
    answer: "The cold vinegar erupted after the group had stopped watching.",
    proof: [
      "“A cold reaction runs slower and takes longer to build enough gas to rise.”",
      "“The custodian found their cone overflowed and the table wet that evening.”",
    ],
    clears: [
      "The soda: “Their baking soda was weighed on the same balance to the same two grams.”",
      "The vinegar: “Their vinegar came from the same jug that worked for the other five groups.”",
      "The vent: “Their cone was built on the same mold, and its vent is the same width.”",
    ],
    explain:
      "The custodian's wet table is evidence nobody collected on purpose. The model worked. The observation window was built for a warm reaction, and a sheet that says no reaction is only ever a report about the seconds somebody was looking.",
  },
  {
    t: "The Case of the Crown an Inch Short",
    tag: "👑 crown",
    story:
      "Nine of the twenty-eight crowns would not close, all by about the same small amount. Each student measured their own head with the same cloth tape and wrote the number down. The tape was checked against a metre rule and is accurate along its whole length. The strips were cut to exactly the number each student had written. The assembly step glues one end over the other with a one-inch overlap. An inch of overlap takes an inch out of the circle the strip can make. Nobody added that inch to the length before cutting, because nobody wrote it down. Nineteen crowns closed because those students measure a head smaller than their strip. The nine that failed are the nine largest measurements in the class. A missing allowance shows up first wherever the margin was already thinnest.",
    q: "Why would nine crowns not close?",
    s: [
      { who: "🔗 The one-inch overlap", why: "the assembly step glues one end over the other with a one-inch overlap" },
      { who: "📏 A stretched tape", why: "the tape was checked against a metre rule and is accurate along its whole length" },
      { who: "✂️ Bad cutting", why: "the strips were cut to exactly the number each student had written" },
      { who: "🧒 Wrong measurements", why: "each student measured their own head with the same cloth tape and wrote the number down" },
      { who: "📋 The instructions", why: "nobody added that inch to the length before cutting, because nobody wrote it down" },
    ],
    who: 0,
    answer: "Every strip was cut an inch short of what the overlap needs.",
    proof: [
      "“An inch of overlap takes an inch out of the circle the strip can make.”",
      "“The nine that failed are the nine largest measurements in the class.”",
    ],
    clears: [
      "The tape: “The tape was checked against a metre rule and is accurate along its whole length.”",
      "The cutting: “The strips were cut to exactly the number each student had written.”",
      "The measurements: “Each student measured their own head with the same cloth tape and wrote the number down.”",
    ],
    explain:
      "All twenty-eight crowns are an inch short. Nineteen of them closed anyway because those heads had an inch to spare. Which nine failed tells you the error is the same size for everybody, which is what a missing allowance looks like.",
  },
  {
    t: "The Case of the App That Said 440",
    tag: "🎹 piano",
    story:
      "The tuning app calls every note on the piano correct and the piano sounds flat beside the flute. A warm flute does go sharp, which would explain part of a gap like this. The flute was played cold from its case and the gap was just as wide. The piano was also checked against a steel tuning fork, which needs no battery. It sounded flat against the fork by the same amount it did against the flute. An app's reference pitch can be changed in its settings by a single tap. This app's reference is set to 435 hertz rather than the standard 440. Every note it calls correct is therefore a little flat of where it should be. The app's microphone was tested on the fork and read the fork as flat too. An instrument that calls a known standard wrong is telling you about itself.",
    q: "Why does the app say the piano is in tune?",
    s: [
      { who: "🎚️ The app's 435 reference setting", why: "this app's reference is set to 435 hertz rather than the standard 440" },
      { who: "🎶 A warm flute running sharp", why: "the flute was played cold from its case and the gap was just as wide" },
      { who: "🎹 The piano itself", why: "it sounded flat against the fork by the same amount it did against the flute" },
      { who: "🎤 The app's microphone", why: "the app's microphone was tested on the fork and read the fork as flat too" },
      { who: "🔔 The tuning fork", why: "the piano was also checked against a steel tuning fork, which needs no battery" },
    ],
    who: 0,
    answer: "The app is set to 435 hertz, so flat notes read as correct.",
    proof: [
      "“This app's reference is set to 435 hertz rather than the standard 440.”",
      "“Every note it calls correct is therefore a little flat of where it should be.”",
    ],
    clears: [
      "The flute: “The flute was played cold from its case and the gap was just as wide.”",
      "The microphone: “The app's microphone was tested on the fork and read the fork as flat too.”",
      "The fork: “The piano was also checked against a steel tuning fork, which needs no battery.”",
    ],
    explain:
      "A warm flute really does go sharp, which is why that suspect is here and why it had to be tested rather than argued about. The fork settles everything. A fork cannot be out of tune, and the app called it flat.",
  },
  {
    t: "The Case of the Four Hundred Foot Kite",
    tag: "🪁 kite",
    story:
      "The club recorded a kite altitude of four hundred feet by counting the string let out. Four hundred feet of string did leave the reel, and the count was careful. A kite's string is never a straight line from the hand to the kite. It hangs in a curve, and it leaves the hand at an angle well below vertical. The line angle was photographed that day and measured at about forty-five degrees. At forty-five degrees, four hundred feet of string reaches roughly two hundred and eighty feet up. The curve of the line takes a further bite out of that number. The reel's counter was checked against a tape and counts accurately. A second club measured the same kite by sighting angles from two points. Their figure came to two hundred and sixty feet, not four hundred.",
    q: "How high was the kite really?",
    s: [
      { who: "📐 String length counted as height", why: "it hangs in a curve, and it leaves the hand at an angle well below vertical" },
      { who: "🎣 A faulty reel counter", why: "the reel's counter was checked against a tape and counts accurately" },
      { who: "🔢 A miscount of the string", why: "four hundred feet of string did leave the reel, and the count was careful" },
      { who: "📷 The photograph", why: "the line angle was photographed that day and measured at about forty-five degrees" },
      { who: "📊 The second club's figure", why: "their figure came to two hundred and sixty feet, not four hundred" },
    ],
    who: 0,
    answer: "Four hundred feet of string at forty-five degrees is far less than four hundred feet up.",
    proof: [
      "“At forty-five degrees, four hundred feet of string reaches roughly two hundred and eighty feet up.”",
      "“The curve of the line takes a further bite out of that number.”",
    ],
    clears: [
      "The counter: “The reel's counter was checked against a tape and counts accurately.”",
      "A miscount: “Four hundred feet of string did leave the reel, and the count was careful.”",
      "The photograph: “The line angle was photographed that day and measured at about forty-five degrees.”",
    ],
    explain:
      "Every number the club wrote down is correct. Four hundred feet of string went out. What they recorded was the length of the string and what they reported was the height of the kite, and those are two sides of a triangle.",
  },
  {
    t: "The Case of the Plant That Grew Four Centimetres",
    tag: "☘️ shamrock",
    story:
      "The chart shows the shamrock growing four centimetres in a week after months of slow growth. Nothing about the light, the water or the room changed during that week. Four centimetres in seven days would be remarkable for a plant of this kind. Measurements in weeks one through five were taken from the rim of the pot. Week six's measurement was taken from the surface of the soil instead. The soil sits about four centimetres below the rim of that pot. Measuring from a lower starting point adds the distance between the two points. Two students share the task and each had their own idea of where to start. Week seven, measured from the rim again, shows the plant back at its week five height. A growth chart records the distance between two points, and one of them moved.",
    q: "Did the plant really grow four centimetres?",
    s: [
      { who: "📍 A moved starting point", why: "week six's measurement was taken from the surface of the soil instead" },
      { who: "🌱 Real growth", why: "week seven, measured from the rim again, shows the plant back at its week five height" },
      { who: "💡 A change in conditions", why: "nothing about the light, the water or the room changed during that week" },
      { who: "📏 A different ruler", why: "measuring from a lower starting point adds the distance between the two points" },
      { who: "📈 The chart", why: "a growth chart records the distance between two points, and one of them moved" },
    ],
    who: 0,
    answer: "Week six was measured from the soil and the others from the rim.",
    proof: [
      "“The soil sits about four centimetres below the rim of that pot.”",
      "“Week seven, measured from the rim again, shows the plant back at its week five height.”",
    ],
    clears: [
      "Real growth: “Week seven, measured from the rim again, shows the plant back at its week five height.”",
      "Conditions: “Nothing about the light, the water or the room changed during that week.”",
      "The chart: “A growth chart records the distance between two points, and one of them moved.”",
    ],
    explain:
      "Week seven is the proof, and it looks at first like the plant shrank. It did not. The jump and the drop are the same four centimetres, which is the distance from the rim to the soil, appearing once and then disappearing again.",
  },
  {
    t: "The Case of the Gauge Under the Tree",
    tag: "🌧️ puddle",
    story:
      "The school's rain gauge recorded two tenths of an inch from a storm that left standing water everywhere. Two tenths of an inch does not fill a parking lot or float a leaf. The gauge was emptied, checked for cracks and found sound and dry. It was read at eight the next morning, before any evaporation could matter. The gauge stands beneath the spreading branches of a large maple by the fence. A canopy catches most of the rain that falls on it and sheds it elsewhere. A gauge under a tree measures what gets through the tree, not what falls. The county station four miles away recorded one and three tenths of an inch. A second gauge placed in the open lawn that week recorded one and two tenths. Rain gauges are supposed to stand clear of anything overhead for exactly this reason.",
    q: "Why did the gauge read two tenths?",
    s: [
      { who: "🌳 The maple canopy overhead", why: "the gauge stands beneath the spreading branches of a large maple by the fence" },
      { who: "💧 A cracked gauge", why: "the gauge was emptied, checked for cracks and found sound and dry" },
      { who: "🕗 Reading it too late", why: "it was read at eight the next morning, before any evaporation could matter" },
      { who: "☔ A genuinely light storm", why: "a second gauge placed in the open lawn that week recorded one and two tenths" },
      { who: "📍 Where the gauge stands", why: "rain gauges are supposed to stand clear of anything overhead for exactly this reason" },
    ],
    who: 0,
    answer: "The maple caught most of the rain before it reached the gauge.",
    proof: [
      "“A canopy catches most of the rain that falls on it and sheds it elsewhere.”",
      "“A gauge under a tree measures what gets through the tree, not what falls.”",
    ],
    clears: [
      "A crack: “The gauge was emptied, checked for cracks and found sound and dry.”",
      "The reading time: “It was read at eight the next morning, before any evaporation could matter.”",
      "A light storm: “A second gauge placed in the open lawn that week recorded one and two tenths.”",
    ],
    explain:
      "The gauge is accurate. It accurately reports the rain that reached it, which is the question nobody was asking. Where an instrument stands is part of what it measures, and this one has been measuring a maple tree for years.",
  },
  {
    t: "The Case of the Forty Percent Garden",
    tag: "🌻 garden",
    story:
      "The germination report says forty percent where the seed packet promises eighty-five. The class counted every seedling in every row and the count itself was careful. Seed was sown at the depth the packet gives, in soil tested at sixty-eight degrees. The bed was watered every morning and never allowed to dry out. The count was taken on day seven, which is when the project sheet asked for it. This species takes fourteen to twenty-one days to come up, as the packet also states. A count taken at day seven catches only the earliest seeds in a slow species. Counted again on day twenty-one, the same bed came to eighty-three percent. The forty percent and the eighty-three percent are the same bed on two mornings. A germination rate without a date attached is not a rate at all.",
    q: "Why did germination look so poor?",
    s: [
      { who: "📅 Counting on day seven", why: "the count was taken on day seven, which is when the project sheet asked for it" },
      { who: "🌰 Poor seed", why: "counted again on day twenty-one, the same bed came to eighty-three percent" },
      { who: "🌡️ Cold soil", why: "seed was sown at the depth the packet gives, in soil tested at sixty-eight degrees" },
      { who: "🚿 Watering", why: "the bed was watered every morning and never allowed to dry out" },
      { who: "📋 The project sheet", why: "a germination rate without a date attached is not a rate at all" },
    ],
    who: 0,
    answer: "The count was taken a week before most of the seed was due up.",
    proof: [
      "“This species takes fourteen to twenty-one days to come up, as the packet also states.”",
      "“A count taken at day seven catches only the earliest seeds in a slow species.”",
    ],
    clears: [
      "The seed: “Counted again on day twenty-one, the same bed came to eighty-three percent.”",
      "Cold soil: “Seed was sown at the depth the packet gives, in soil tested at sixty-eight degrees.”",
      "Watering: “The bed was watered every morning and never allowed to dry out.”",
    ],
    explain:
      "The seed was fine and the bed was fine and the counting was fine. The project sheet asked for a number on a day the species had not finished answering, and forty percent is a true count of an unfinished process.",
  },
  {
    t: "The Case of the Large Eggs That Were Not",
    tag: "🪺 eggs",
    story:
      "The carton is marked large and the twelve eggs inside visibly differ in size. Two of them are noticeably smaller than the others and one is clearly bigger. A customer complained that the carton had been packed with the wrong grade. The farm's grader was checked and is sorting correctly to the published standard. That standard sets a minimum weight for a dozen, not for each individual egg. A dozen graded large must weigh at least twenty-four ounces in total. The twelve in this carton weigh twenty-five and a half ounces together. Individual eggs within a correctly graded dozen vary and are supposed to. The two small eggs and the large one are all inside the allowed spread. The carton was packed and sealed at the farm and has not been opened since. A grade printed on a carton describes the carton and not any egg in it.",
    q: "Is the carton wrongly graded?",
    s: [
      { who: "📦 The grade describing the dozen", why: "that standard sets a minimum weight for a dozen, not for each individual egg" },
      { who: "🥚 Mixed grades in one carton", why: "the twelve in this carton weigh twenty-five and a half ounces together" },
      { who: "⚙️ A broken grader", why: "the farm's grader was checked and is sorting correctly to the published standard" },
      { who: "🏷️ A mislabelled carton", why: "a grade printed on a carton describes the carton and not any egg in it" },
      { who: "⚖️ The weighing", why: "individual eggs within a correctly graded dozen vary and are supposed to" },
    ],
    who: 0,
    answer: "Large is a weight for the whole dozen, not for each egg.",
    proof: [
      "“A dozen graded large must weigh at least twenty-four ounces in total.”",
      "“The twelve in this carton weigh twenty-five and a half ounces together.”",
    ],
    clears: [
      "The grader: “The farm's grader was checked and is sorting correctly to the published standard.”",
      "The label: “A grade printed on a carton describes the carton and not any egg in it.”",
      "The weighing: “Individual eggs within a correctly graded dozen vary and are supposed to.”",
    ],
    explain:
      "Nothing is wrong and nobody is at fault. The complaint comes from reading a word about twelve eggs as though it were a word about one. Twenty-five and a half ounces clears the standard with room to spare.",
  },
  {
    t: "The Case of the Sunrise Nine Minutes Late",
    tag: "🌎 earth",
    story:
      "The almanac gives sunrise at 6:42 and the class first saw the sun at 6:51. The observation was made from the playground on four clear mornings running. The classroom clock agrees with the national time signal to the second. The almanac's figure is calculated for the city centre at a flat sea horizon. The school sits in a valley with a wooded ridge standing to the east. The sun must climb above that ridge before anyone on the playground can see it. An almanac describes a horizon that most places on the ground do not have. From the hilltop above the school the sun appeared at 6:43 on the same morning. The ridge adds the same eight or nine minutes every clear day of the week. Both times are correct for the horizon each one was measured against.",
    q: "Why was sunrise nine minutes late?",
    s: [
      { who: "⛰️ The ridge to the east", why: "the sun must climb above that ridge before anyone on the playground can see it" },
      { who: "🕰️ A slow clock", why: "the classroom clock agrees with the national time signal to the second" },
      { who: "📕 A wrong almanac", why: "both times are correct for the horizon each one was measured against" },
      { who: "📍 The almanac's location", why: "the almanac's figure is calculated for the city centre at a flat sea horizon" },
      { who: "👀 Careless observing", why: "the observation was made from the playground on four clear mornings running" },
    ],
    who: 0,
    answer: "The ridge to the east hides the sun for nine more minutes.",
    proof: [
      "“An almanac describes a horizon that most places on the ground do not have.”",
      "“From the hilltop above the school the sun appeared at 6:43 on the same morning.”",
    ],
    clears: [
      "The clock: “The classroom clock agrees with the national time signal to the second.”",
      "The almanac: “Both times are correct for the horizon each one was measured against.”",
      "The observing: “The observation was made from the playground on four clear mornings running.”",
    ],
    explain:
      "The hilltop test is what turns an argument into an answer. Same sun, same morning, same town, two horizons nine minutes apart. The almanac was never wrong; it was answering for a sea horizon the playground does not have.",
  },
  {
    t: "The Case of the Photographs Out of Order",
    tag: "📷 camera",
    story:
      "Sorted by timestamp, the trip photographs show the group arriving before they left. Pictures from two cameras were put into one folder and sorted automatically. The sorting program reads each file's recorded time and does nothing else to it. Every photograph from the second camera sits exactly sixty minutes behind the first. A gap of exactly one hour, repeated across ninety files, is not a coincidence. The clocks were last compared in March, before the spring change of hour. The second camera's clock was never moved forward when the clocks changed. One camera's photographs were checked against a phone and match it to the minute. Nobody edited a file, and the original recorded times are all intact. Both cameras sat in the same bag and travelled the same route all week. A timestamp records what a camera believed the time to be.",
    q: "Why are the photographs out of order?",
    s: [
      { who: "🕐 A camera clock never changed", why: "the second camera's clock was never moved forward when the clocks changed" },
      { who: "💻 The sorting program", why: "the sorting program reads each file's recorded time and does nothing else to it" },
      { who: "📱 The phone photographs", why: "one camera's photographs were checked against a phone and match it to the minute" },
      { who: "✂️ Edited files", why: "nobody edited a file, and the original recorded times are all intact" },
      { who: "🗂️ The timestamps", why: "a timestamp records what a camera believed the time to be" },
    ],
    who: 0,
    answer: "One camera's clock was never moved forward in the spring.",
    proof: [
      "“Every photograph from the second camera sits exactly sixty minutes behind the first.”",
      "“A gap of exactly one hour, repeated across ninety files, is not a coincidence.”",
    ],
    clears: [
      "The program: “The sorting program reads each file's recorded time and does nothing else to it.”",
      "The phone: “One camera's photographs were checked against a phone and match it to the minute.”",
      "Edited files: “Nobody edited a file, and the original recorded times are all intact.”",
    ],
    explain:
      "Exactly sixty minutes, ninety times over, is the signature. Drift is ragged and an hour is a decision. One camera has been honestly recording a time that stopped being the time one Sunday in spring.",
  },
  {
    t: "The Case of the Fertiliser by the Window",
    tag: "🌱 plant",
    story:
      "The fertilised beans grew half again as tall as the unfertilised ones in four weeks. The report concluded that the fertiliser works and recommended it for the whole school. All sixteen pots were watered on the same schedule with the same measured amount. All sixteen pots are the same size and were filled from the same bag of soil. The eight fertilised pots were lined up along the window and the other eight by the door. Light falling on a windowsill is several times what reaches a doorway. Two things changed between the groups, and only one of them was the fertiliser. In week five the two trays were swapped end for end without changing anything else. By week eight the plants at the window were taller whichever tray they came from. An experiment with two differences cannot tell you which one did the work.",
    q: "Did the fertiliser make the plants taller?",
    s: [
      { who: "🪟 The window position", why: "by week eight the plants at the window were taller whichever tray they came from" },
      { who: "🧪 The fertiliser", why: "two things changed between the groups, and only one of them was the fertiliser" },
      { who: "💧 Watering", why: "all sixteen pots were watered on the same schedule with the same measured amount" },
      { who: "🪴 Pot size or soil", why: "all sixteen pots are the same size and were filled from the same bag of soil" },
      { who: "📄 The report", why: "an experiment with two differences cannot tell you which one did the work" },
    ],
    who: 0,
    answer: "The fertilised pots were also the pots at the window.",
    proof: [
      "“The eight fertilised pots were lined up along the window and the other eight by the door.”",
      "“By week eight the plants at the window were taller whichever tray they came from.”",
    ],
    clears: [
      "Watering: “All sixteen pots were watered on the same schedule with the same measured amount.”",
      "Pot size: “All sixteen pots are the same size and were filled from the same bag of soil.”",
      "The report: “An experiment with two differences cannot tell you which one did the work.”",
    ],
    explain:
      "The swap in week five is the move that rescues the experiment. The height followed the window and not the fertiliser, which is the one thing the first four weeks could never have shown. The fertiliser may still help; this study cannot say so.",
  },
  {
    t: "The Case of the Soft Ice Cream in a Cold Freezer",
    tag: "🍦 icecream",
    story:
      "The ice cream in the door rack is soft while the freezer's display reads zero degrees. The display takes its reading from a sensor mounted at the back wall. Cold air sinks and pools at the bottom and back of a freezer compartment. The door rack sits at the front, at the top, and swings into the room when opened. A thermometer left in the door rack overnight read nineteen degrees by morning. A thermometer left at the back on the same night read one degree. The compressor ran normally all night and the door seal passed a paper test. A tub moved from the door rack to the back shelf was firm within three hours. A sensor reports the temperature where the sensor is and nowhere else. The display has been accurate about the back wall this whole time.",
    q: "Why is the ice cream soft?",
    s: [
      { who: "🚪 The door rack being warmer", why: "a thermometer left in the door rack overnight read nineteen degrees by morning" },
      { who: "🌡️ A lying display", why: "a thermometer left at the back on the same night read one degree" },
      { who: "🔧 A weak compressor", why: "the compressor ran normally all night and the door seal passed a paper test" },
      { who: "🍨 The ice cream recipe", why: "a tub moved from the door rack to the back shelf was firm within three hours" },
      { who: "📍 Where the sensor sits", why: "a sensor reports the temperature where the sensor is and nowhere else" },
    ],
    who: 0,
    answer: "The door rack runs nineteen degrees while the sensor reads the cold back wall.",
    proof: [
      "“Cold air sinks and pools at the bottom and back of a freezer compartment.”",
      "“A tub moved from the door rack to the back shelf was firm within three hours.”",
    ],
    clears: [
      "The display: “A thermometer left at the back on the same night read one degree.”",
      "The compressor: “The compressor ran normally all night and the door seal passed a paper test.”",
      "The recipe: “A tub moved from the door rack to the back shelf was firm within three hours.”",
    ],
    explain:
      "The display is telling the truth and the truth is about one spot. Moving the tub is the experiment that settles it: the same ice cream firmed up in three hours without anybody changing a setting.",
  },
  {
    t: "The Case of the Ribbons That Matched Indoors",
    tag: "🎗️ ribbon",
    story:
      "The two rolls of ribbon matched perfectly in the storeroom and clashed badly on stage. Both were checked against each other under the storeroom's fluorescent tube. Nobody compared them under daylight or under the stage lights before the show. Two dyes can reflect light identically under one kind of lamp and differently under another. A fluorescent tube and a stage lamp do not give out the same mix of colours. Held side by side at the window in daylight, the two ribbons plainly differ. The rolls came from different dye lots, which the labels on the cores record. A dye lot difference invisible under one lamp is not invisible under all of them. Both rolls were handled carefully and neither has faded or been washed. A colour match is a statement about a pair of ribbons and a particular light.",
    q: "Why did the ribbons clash on stage?",
    s: [
      { who: "💡 Matching under one lamp only", why: "both were checked against each other under the storeroom's fluorescent tube" },
      { who: "🎨 Different dye lots", why: "a dye lot difference invisible under one lamp is not invisible under all of them" },
      { who: "☀️ Fading", why: "both rolls were handled carefully and neither has faded or been washed" },
      { who: "👁️ The checker's eyes", why: "held side by side at the window in daylight, the two ribbons plainly differ" },
      { who: "🏷️ The labels", why: "the rolls came from different dye lots, which the labels on the cores record" },
    ],
    who: 0,
    answer: "The two ribbons were only ever matched under the storeroom tube.",
    proof: [
      "“Two dyes can reflect light identically under one kind of lamp and differently under another.”",
      "“Nobody compared them under daylight or under the stage lights before the show.”",
    ],
    clears: [
      "Fading: “Both rolls were handled carefully and neither has faded or been washed.”",
      "The eyes: “Held side by side at the window in daylight, the two ribbons plainly differ.”",
      "The labels: “The rolls came from different dye lots, which the labels on the cores record.”",
    ],
    explain:
      "The dye lots really are different and the labels said so. The test that was run could not detect it, because a match under one lamp is not a match. The ribbons never changed; the light did.",
  },
  {
    t: "The Case of the Three Hundred Who Were Four Hundred",
    tag: "🎈 balloons",
    story:
      "The attendance figure is three hundred and four hundred and twenty balloons were given out. The balloon table counted its stock before the doors opened and again at the end. Four hundred and twenty left the table, and each visitor took exactly one. Volunteers refused second balloons, and the table was watched the whole evening. The attendance count was made by two staff walking the hall at a quarter to seven. They counted everybody standing in the hall at that one moment and wrote it down. People arrived from five thirty and others left before seven to catch buses. A count of who is present at one moment cannot total who came all evening. The balloon figure adds up every visitor across three hours of the event. Both numbers are right about different questions, and only one of them is attendance.",
    q: "How many people came?",
    s: [
      { who: "⏱️ A count taken at one moment", why: "the attendance count was made by two staff walking the hall at a quarter to seven" },
      { who: "🎈 Visitors taking two balloons", why: "volunteers refused second balloons, and the table was watched the whole evening" },
      { who: "📦 A miscount of the stock", why: "the balloon table counted its stock before the doors opened and again at the end" },
      { who: "🚶 A sloppy walk-through", why: "they counted everybody standing in the hall at that one moment and wrote it down" },
      { who: "📊 The word attendance", why: "both numbers are right about different questions, and only one of them is attendance" },
    ],
    who: 0,
    answer: "Four hundred and twenty came, and three hundred were in the hall at once.",
    proof: [
      "“A count of who is present at one moment cannot total who came all evening.”",
      "“The balloon figure adds up every visitor across three hours of the event.”",
    ],
    clears: [
      "Second balloons: “Volunteers refused second balloons, and the table was watched the whole evening.”",
      "The stock count: “The balloon table counted its stock before the doors opened and again at the end.”",
      "The walk-through: “They counted everybody standing in the hall at that one moment and wrote it down.”",
    ],
    explain:
      "Three hundred is a true count of a crowded room at a quarter to seven. It is the wrong kind of number for the question, because people kept arriving and leaving. The balloons counted each visitor once and never counted anyone twice.",
  },
];

gradeMysteries(8, CASES);
