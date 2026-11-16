/**
 * Grade 12, the debate version of each case. See scripts/mysteries/g5.debate.mjs
 * for what these files are and what the gate holds them to.
 *
 * The ordinary grade 12 case has an accurate record, an honest measurement
 * and a wrong conclusion, because something decided which cases ever reached
 * the page. Four suspects are real causes and the fifth is the filter in
 * front of the data.
 *
 * These put three filters in front of the same data. Each one would produce
 * the figure on its own, and the text cannot say which did. The question a
 * student leaves with is not which answer is right but what would have to be
 * counted, and by whom, before anybody could tell.
 */
export const DEBATES = {
  1: {
    story:
      "The library's weeding list is built from loan counts and it names four hundred books that have not gone out once in two years. Four explanations have been offered and each describes a real effect. Every one of the four hundred is on the top two shelves. The top shelf is two metres and ten centimetres from the floor. The step stool was taken away in September two years ago after a pupil fell from it. Ninety-four percent of all loans since then have come from below one metre fifty. Every one of the four hundred is also catalogued as reference or poetry. The library's own rule bars reference stock from loan altogether, and the poetry is all in the exam-set case. A book the rules will not let out cannot appear in a loan count whatever anybody wants. All four hundred were catalogued by a temporary assistant in the summer of two thousand and nineteen. Not one of them carries a shelfmark in the catalogue, and the search returns nothing for any of them. A reader who cannot find a record cannot place a request, and a request is what the count counts. The sixty-one worn spines on those shelves were all borrowed before the assistant started. The four hundred are older than the collection average by six years, which the loan data puts at nine percent fewer loans. The plain cloth bindings on that shelf go out at the same rate as the plain cloth bindings downstairs.",
    q: "Why have four hundred books never been borrowed? Prove your answer.",
    why: [
      "two metres ten from the floor, with the stool gone two years ago",
      "six years older than the average, worth nine percent fewer loans",
      "cloth bindings lending at the same rate as the cloth bindings downstairs",
      "all four hundred catalogued as reference or exam-set poetry",
      "catalogued in 2019 by a temporary assistant, with no shelfmark on any of them",
    ],
    open: [0, 3, 4],
    for: [
      { who: 0, ev: ["“The step stool was taken away in September two years ago after a pupil fell from it.”", "“Ninety-four percent of all loans since then have come from below one metre fifty.”"], but: "“A book the rules will not let out cannot appear in a loan count whatever anybody wants.”" },
      { who: 3, ev: ["“Every one of the four hundred is also catalogued as reference or poetry.”", "“The library's own rule bars reference stock from loan altogether, and the poetry is all in the exam-set case.”"], but: "“The sixty-one worn spines on those shelves were all borrowed before the assistant started.”" },
      { who: 4, ev: ["“All four hundred were catalogued by a temporary assistant in the summer of two thousand and nineteen.”", "“Not one of them carries a shelfmark in the catalogue, and the search returns nothing for any of them.”"], but: "“Ninety-four percent of all loans since then have come from below one metre fifty.”" },
    ],
    clears: [
      "Their age: “The four hundred are older than the collection average by six years, which the loan data puts at nine percent fewer loans.”",
      "Dull covers: “The plain cloth bindings on that shelf go out at the same rate as the plain cloth bindings downstairs.”",
    ],
    note:
      "Three filters, and all three would give a zero. The worn spines date the damage: those books were borrowed before 2019, which fits the cataloguing and the stool and says nothing about the reference rule. Ask what one experiment would separate all three, and somebody will say put a shelfmarked poetry book on a low shelf.",
  },
  2: {
    story:
      "The kitchen's uptake count says eleven pupils out of six hundred take the salad option, and the governors want it dropped. Four reasons have been given for the figure and each of them is a genuine problem. The salad is made in a single tray of about forty portions. The kitchen serves from half past eleven and the tray is empty by seven minutes past twelve. The uptake count is taken from the till report at the end of service at twenty to one. A tally kept at the counter for one week found a hundred and ninety pupils who asked for salad and were told it had gone. Since the supplier changed in September the salad has cost two pounds forty more than the pasta. It is also the only item on the counter that the free school meal allowance will not cover. Four hundred and ten of the six hundred are on that allowance and cannot buy it at any price. The salad is kept in the back fridge behind the counter and brought out only when it is asked for. It appears on neither the display nor the menu board at the door. A pupil who does not know a dish exists does not choose it and is not counted as refusing it. The portion weighs less than the hot options, which the trial put at four percent of uptake. The county survey's winter effect is a fifth, and the salad figure has not moved between June and January.",
    q: "Why does the count say eleven? Choose one cause and prove it from the text.",
    why: [
      "forty portions gone by twelve, counted at twenty to one",
      "the only item the free school meal allowance will not cover",
      "kept in the back fridge, on neither the display nor the board",
      "a portion weighing less, worth four percent of uptake",
      "a winter effect of a fifth, against a figure flat from June to January",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The kitchen serves from half past eleven and the tray is empty by seven minutes past twelve.”", "“A tally kept at the counter for one week found a hundred and ninety pupils who asked for salad and were told it had gone.”"], but: "“Four hundred and ten of the six hundred are on that allowance and cannot buy it at any price.”" },
      { who: 1, ev: ["“It is also the only item on the counter that the free school meal allowance will not cover.”", "“Four hundred and ten of the six hundred are on that allowance and cannot buy it at any price.”"], but: "“A tally kept at the counter for one week found a hundred and ninety pupils who asked for salad and were told it had gone.”" },
      { who: 2, ev: ["“The salad is kept in the back fridge behind the counter and brought out only when it is asked for.”", "“It appears on neither the display nor the menu board at the door.”"], but: "“The kitchen serves from half past eleven and the tray is empty by seven minutes past twelve.”" },
    ],
    clears: [
      "The portion size: “The portion weighs less than the hot options, which the trial put at four percent of uptake.”",
      "The season: “The county survey's winter effect is a fifth, and the salad figure has not moved between June and January.”",
    ],
    note:
      "A hundred and ninety asked for a dish that is not on the board, which should trouble the display answer and does not quite kill it. The allowance figure is the hardest to argue with and the easiest to overlook, because it is not about the salad at all. Ask how many of the hundred and ninety could have paid if the tray had been full.",
  },
  3: {
    story:
      "The breakage book says Haleby pencils break four times as often as Corwin pencils, and the school is about to stop buying Haleby. Four differences between the brands are offered and all four are real. Haleby pencils are issued to Years Seven and Eight and Corwin pencils to the sixth form. The breakage book is filled in by the stock cupboard when a class asks for replacements. Sixth formers buy their own replacements from the shop rather than asking. A fortnight of marked pencils, fifty of each brand given to the same Year Eight class, ended with nine Haleby and seven Corwin broken. Haleby leads test at four B on the laboratory scale and Corwin leads at H B, six grades apart. The laboratory's own drop test breaks a four B lead four times as often as an H B lead. Four times is the figure the breakage book reports, which is a coincidence or an explanation. The August Haleby delivery stood in eleven centimetres of flood water in the cupboard for a weekend. A seam test on that batch opens the glue line under a tenth of the force a dry pencil needs. Every Haleby pencil issued this year came out of that one flooded delivery. Haleby barrels are round and Corwin barrels hexagonal, and both brands sit in trays rather than on desks. Haleby pencils are two centimetres shorter, which the same drop test could not distinguish from noise.",
    q: "Do Haleby pencils really break more? Pick one cause and prove it.",
    why: [
      "two brands issued to two year groups with two habits of asking",
      "four B against H B, and a drop test that breaks four B four times as often",
      "round barrels against hexagonal, with both brands kept in trays",
      "a flooded August delivery whose seams open under a tenth of the force",
      "two centimetres shorter, which the drop test could not tell from noise",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The breakage book is filled in by the stock cupboard when a class asks for replacements.”", "“Sixth formers buy their own replacements from the shop rather than asking.”"], but: "“The laboratory's own drop test breaks a four B lead four times as often as an H B lead.”" },
      { who: 1, ev: ["“Haleby leads test at four B on the laboratory scale and Corwin leads at H B, six grades apart.”", "“Four times is the figure the breakage book reports, which is a coincidence or an explanation.”"], but: "“A fortnight of marked pencils, fifty of each brand given to the same Year Eight class, ended with nine Haleby and seven Corwin broken.”" },
      { who: 3, ev: ["“The August Haleby delivery stood in eleven centimetres of flood water in the cupboard for a weekend.”", "“A seam test on that batch opens the glue line under a tenth of the force a dry pencil needs.”"], but: "“Every Haleby pencil issued this year came out of that one flooded delivery.”" },
    ],
    clears: [
      "The round barrel: “Haleby barrels are round and Corwin barrels hexagonal, and both brands sit in trays rather than on desks.”",
      "The shorter length: “Haleby pencils are two centimetres shorter, which the same drop test could not distinguish from noise.”",
    ],
    note:
      "The marked fortnight is the only test run on one class with both brands, and it gives nine against seven, not four to one. That result costs the lead answer and the flood answer most of their size, and it leaves the reporting habit holding the rest. A laboratory figure that matches the headline exactly is the one to check hardest.",
  },
  4: {
    story:
      "The orchard record shows the north row yielding ninety kilograms a tree and the other four rows about thirty. The north row is to be propagated and the rest replaced. Four advantages of that row have been named and each is real. The north row is picked by the head gardener with the orchard ladder. The other four rows are picked by classes on a Friday afternoon, without the ladder, for safety. A count made from the ground in October found fruit still hanging above two metres on every tree in rows two to five. Nine trees in those rows were picked properly by the gardener afterwards and gave between seventy and eighty-eight kilograms. The north row sits above the old stable yard and its soil tests at eleven times the nitrogen of the clay rows. The county trial puts a nitrogen difference of that size at roughly three times the yield in apples. Nothing has been added to rows two to five since the orchard was laid out. The planting plan in the parish archive dates the north row to nineteen years before the others, not three. An apple tree of nineteen years carries about three times the crop of one of six. Every tree in the north row is half as tall again as the tallest tree in row three. The extra hour of sun is worth about eight percent of a yield on the county's own figures. Rows two to five are on clay, which the trial puts at a tenth of a yield behind gravel.",
    q: "Is the north row really the best? Choose one cause and prove it.",
    why: [
      "one row picked with the ladder and four picked without it",
      "an extra hour of sun, worth about eight percent of a yield",
      "stable yard soil at eleven times the nitrogen of the clay rows",
      "a planting plan dating the north row nineteen years earlier",
      "clay under rows two to five, a tenth of a yield behind gravel",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“A count made from the ground in October found fruit still hanging above two metres on every tree in rows two to five.”", "“Nine trees in those rows were picked properly by the gardener afterwards and gave between seventy and eighty-eight kilograms.”"], but: "“An apple tree of nineteen years carries about three times the crop of one of six.”" },
      { who: 2, ev: ["“The north row sits above the old stable yard and its soil tests at eleven times the nitrogen of the clay rows.”", "“The county trial puts a nitrogen difference of that size at roughly three times the yield in apples.”"], but: "“Nine trees in those rows were picked properly by the gardener afterwards and gave between seventy and eighty-eight kilograms.”" },
      { who: 3, ev: ["“The planting plan in the parish archive dates the north row to nineteen years before the others, not three.”", "“Every tree in the north row is half as tall again as the tallest tree in row three.”"], but: "“Nothing has been added to rows two to five since the orchard was laid out.”" },
    ],
    clears: [
      "More sun: “The extra hour of sun is worth about eight percent of a yield on the county's own figures.”",
      "Better drainage: “Rows two to five are on clay, which the trial puts at a tenth of a yield behind gravel.”",
    ],
    note:
      "The nine retested trees are the whole case: on clay, unfed, six years old and picked properly, they gave seventy to eighty-eight. Everything the soil and the age were supposed to explain survives that test unexplained. A class that leads with those nine has found the one measurement taken the same way in both groups.",
  },
  5: {
    story:
      "The bike shed log records two thefts in three years and the school is citing it to refuse a request for cameras. Four reasons for the low figure have been offered and every one of them is true of that shed. The log is written up from forms handed in at the school office. The office closes at four o'clock and the shed empties between half past three and six. A pupil who finds a bike gone at half past five comes back to a queue the next morning, and most do not bother. The local police hold nineteen reports of bicycles taken from that address in the same three years. The staff room was moved in the rebuild to the window directly above the shed. A rota keeps two members of staff at that window from seven in the morning until seven at night. A camera trial last term recorded eleven approaches to the hoops, and all eleven turned away when somebody moved inside. The gate into the compound is locked from eight in the morning until six at night. Reception holds the only key and signs it out eleven times a day on average. For the rest of the day the shed stands inside a fenced compound that nothing on wheels can leave. The address on the police reports covers the whole site, including the staff car park and the two garages. The frame is bolted into concrete and the hoops resist a cutter better than most. A spot survey put good locks at seventy-one percent, which the force's own figures price at a third of thefts.",
    q: "Why does the log show only two thefts? Pick one cause and prove it.",
    why: [
      "an office that shuts at four, before the shed empties",
      "a staffed window above the shed from seven until seven",
      "hoops bolted into concrete that resist a cutter better than most",
      "a gate locked eight until six, with one key at reception",
      "good locks on seventy-one percent, priced at a third of thefts",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The office closes at four o'clock and the shed empties between half past three and six.”", "“The local police hold nineteen reports of bicycles taken from that address in the same three years.”"], but: "“The address on the police reports covers the whole site, including the staff car park and the two garages.”" },
      { who: 1, ev: ["“A rota keeps two members of staff at that window from seven in the morning until seven at night.”", "“A camera trial last term recorded eleven approaches to the hoops, and all eleven turned away when somebody moved inside.”"], but: "“A pupil who finds a bike gone at half past five comes back to a queue the next morning, and most do not bother.”" },
      { who: 3, ev: ["“Reception holds the only key and signs it out eleven times a day on average.”", "“For the rest of the day the shed stands inside a fenced compound that nothing on wheels can leave.”"], but: "“The local police hold nineteen reports of bicycles taken from that address in the same three years.”" },
    ],
    clears: [
      "The bolted frame: “The frame is bolted into concrete and the hoops resist a cutter better than most.”",
      "Good locks: “A spot survey put good locks at seventy-one percent, which the force's own figures price at a third of thefts.”",
    ],
    note:
      "Nineteen police reports against two in the log is the strongest fact available until somebody reads what the address covers. Then it is nineteen reports from a site with a staff car park on it, and the comparison stops working. Ask what the school would have to ask the police for before the two numbers could be put side by side.",
  },
  6: {
    story:
      "Tank B has lost thirty-one fish in two years and tank A has lost four, and the club wants tank B stripped down. Four faults in tank B have been named and every one is real. Tank B is the quarantine tank, and every fish bought for the club spends its first three weeks in it. Tank A receives only fish that have already survived those three weeks. The trade's own figure for first-month losses is about a quarter, whatever tank a fish is in. Two hundred and ten fish have passed through tank B and sixty-eight through tank A. Thirty-one of two hundred and ten is fifteen percent, and four of sixty-eight is six. The heater in tank B sticks on, and the logger recorded thirty-four degrees for nine hours in March. Thirty-four degrees for nine hours is lethal to every species the club keeps. The logger shows the same stick three times since, each one for more than four hours. A nitrate test on tank B's gravel bed last month read a hundred and sixty milligrams a litre. Forty is the published limit for these species and eighty is where the trade expects deaths. The gravel has never been replaced and the bed is eleven years old. Tank B's filter is the older model and turns the water over at two thirds of tank A's rate. Tank B stands near the door, and a thermometer on its glass has never moved more than half a degree.",
    q: "Why has tank B lost thirty-one fish? Pick one cause and prove it.",
    why: [
      "a quarantine tank holding every new fish, against a tank of survivors",
      "a heater that stuck at thirty-four degrees for nine hours in March",
      "a filter turning the water over at two thirds of tank A's rate",
      "a door position, with a glass thermometer that never moves half a degree",
      "a gravel bed testing at a hundred and sixty milligrams of nitrate",
    ],
    open: [0, 1, 4],
    for: [
      { who: 0, ev: ["“Tank A receives only fish that have already survived those three weeks.”", "“Thirty-one of two hundred and ten is fifteen percent, and four of sixty-eight is six.”"], but: "“Thirty-four degrees for nine hours is lethal to every species the club keeps.”" },
      { who: 1, ev: ["“The heater in tank B sticks on, and the logger recorded thirty-four degrees for nine hours in March.”", "“The logger shows the same stick three times since, each one for more than four hours.”"], but: "“The trade's own figure for first-month losses is about a quarter, whatever tank a fish is in.”" },
      { who: 4, ev: ["“A nitrate test on tank B's gravel bed last month read a hundred and sixty milligrams a litre.”", "“Forty is the published limit for these species and eighty is where the trade expects deaths.”"], but: "“Tank A receives only fish that have already survived those three weeks.”" },
    ],
    clears: [
      "The older filter: “Tank B's filter is the older model and turns the water over at two thirds of tank A's rate.”",
      "The draught: “Tank B stands near the door, and a thermometer on its glass has never moved more than half a degree.”",
    ],
    note:
      "Fifteen percent against six is a real difference and it is a third of what the raw counts say, which is the point the solve version makes. The question here is what fills that remaining gap, and the heater and the nitrate both would. Ask whether a tank that kills a tenth of its stock should be stripped down even if the quarantine explains most of the rest.",
  },
  7: {
    story:
      "The noise file says Wednesday is the loudest day in the building by eleven decibels, and the timetable is about to be rewritten around it. Four reasons have been put forward and each is genuinely true of Wednesdays. The sound meter is not left running. It is fetched from the cupboard and switched on when somebody complains at the office. The office is staffed on Wednesdays and on no other day, because the administrator works one day a week. Forty-one of the forty-four readings in the file were taken on a Wednesday. Band practice is forty players in the room directly above the office, and it runs only on Wednesday lunchtimes. The meter stands on the office desk, and a reading taken through that ceiling runs twelve decibels above the corridor outside. Eleven decibels is what the file reports, and twelve is what the band adds to that one room. The corridor by the gym has carried the whole school four times a day since the yard was closed for resurfacing. On Wednesdays the games changeover puts six hundred pupils through it in nine minutes. A borrowed meter left recording in that corridor for a fortnight found it nine decibels above anywhere else in the building. The whole school eats in two sittings on Wednesdays, which the same fortnight priced at under a decibel. Wednesday afternoon games start indoors, and the sports hall is a separate building on its own meter.",
    q: "Why does the file say Wednesday? Choose one cause and prove it from the text.",
    why: [
      "a meter fetched only when somebody complains at a desk staffed on Wednesdays",
      "two lunch sittings, priced at under a decibel by the fortnight's meter",
      "forty players directly above the meter's desk, on Wednesday lunchtimes only",
      "six hundred pupils through the gym corridor in nine minutes",
      "indoor games in a separate building on its own meter",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“It is fetched from the cupboard and switched on when somebody complains at the office.”", "“Forty-one of the forty-four readings in the file were taken on a Wednesday.”"], but: "“Eleven decibels is what the file reports, and twelve is what the band adds to that one room.”" },
      { who: 2, ev: ["“Band practice is forty players in the room directly above the office, and it runs only on Wednesday lunchtimes.”", "“The meter stands on the office desk, and a reading taken through that ceiling runs twelve decibels above the corridor outside.”"], but: "“A borrowed meter left recording in that corridor for a fortnight found it nine decibels above anywhere else in the building.”" },
      { who: 3, ev: ["“On Wednesdays the games changeover puts six hundred pupils through it in nine minutes.”", "“A borrowed meter left recording in that corridor for a fortnight found it nine decibels above anywhere else in the building.”"], but: "“The office is staffed on Wednesdays and on no other day, because the administrator works one day a week.”" },
    ],
    clears: [
      "The two lunch sittings: “The whole school eats in two sittings on Wednesdays, which the same fortnight priced at under a decibel.”",
      "Indoor games: “Wednesday afternoon games start indoors, and the sports hall is a separate building on its own meter.”",
    ],
    note:
      "Forty-one readings out of forty-four on one day settles what the file is a record of, and it still leaves open what the building is actually like. The band and the corridor are both real, and the band answer is a second measurement fault sitting inside the first. Ask where the meter would have to stand to answer the question the governors think they asked.",
  },
  8: {
    story:
      "The grounds record blames the big sycamore for eighty-one percent of the leaf litter cleared each autumn, and a felling notice has been drafted. Four points in its favour are made and all of them are true. The record is compiled from the sweeping sheets, which are filled in for paths, steps and the yard. The sycamore is the only mature tree on the site standing over a path. The eleven limes, the beech and the two horse chestnuts all stand on grass, where leaves are mown in and nothing is swept. A netting trial last October caught fall over measured squares under every tree, and the sycamore produced nineteen percent of the leaf mass. Sycamore leaves are broad and heavy, and the trial measured them the moment they fell. Lime and beech leaves are light enough to go over the boundary wall in the first wind after they land. The groundsman's photographs show the lime bed bare two days after a fall and the sycamore litter still in place a fortnight later. Clearing is logged only between the first of November and the end of term. The eleven limes finish dropping by the twenty-fifth of October and the beech by the second of November. The sycamore does not start until the twelfth of November and is still dropping at Christmas. The sycamore has the widest crown on the site, and the trial corrected for crown area. It stands at the top of the slope, and the netting squares were laid both above and below every tree.",
    q: "Does the sycamore really drop most of it? Prove your answer from the text.",
    why: [
      "the only mature tree standing over a surface anybody sweeps",
      "the widest crown on the site, which the trial corrected for",
      "heavy leaves that stay while lime and beech go over the wall",
      "a log that opens on the first of November, after the limes have finished",
      "a position at the top of the slope, with netting squares above and below",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“The sycamore is the only mature tree on the site standing over a path.”", "“The eleven limes, the beech and the two horse chestnuts all stand on grass, where leaves are mown in and nothing is swept.”"], but: "“A netting trial last October caught fall over measured squares under every tree, and the sycamore produced nineteen percent of the leaf mass.”" },
      { who: 2, ev: ["“Lime and beech leaves are light enough to go over the boundary wall in the first wind after they land.”", "“The groundsman's photographs show the lime bed bare two days after a fall and the sycamore litter still in place a fortnight later.”"], but: "“Sycamore leaves are broad and heavy, and the trial measured them the moment they fell.”" },
      { who: 3, ev: ["“Clearing is logged only between the first of November and the end of term.”", "“The eleven limes finish dropping by the twenty-fifth of October and the beech by the second of November.”"], but: "“The sycamore is the only mature tree on the site standing over a path.”" },
    ],
    clears: [
      "Its size: “The sycamore has the widest crown on the site, and the trial corrected for crown area.”",
      "Its position on the slope: “It stands at the top of the slope, and the netting squares were laid both above and below every tree.”",
    ],
    note:
      "Three filters stand between the leaves and the record: where it is swept, what has blown away by then, and when the log opens. All three would turn nineteen percent into eighty-one, and the netting trial ran in October, which is the sycamore's quiet month. Ask what a trial run in December would have found.",
  },
  9: {
    story:
      "The growers' table shows Hallow King averaging two hundred and forty kilograms and every other variety under ninety, and the club has voted to grow nothing else. Four strengths of the variety are listed and all four are genuine. The table is compiled from weigh-in results at the county show. The show charges four pounds an entry and will not accept a pumpkin under a hundred kilograms. The club's own patch records, kept for every fruit whether entered or not, tell a different story. Hallow King averages a hundred and six kilograms across all its fruit, and the next variety averages ninety-four. Every pumpkin under a hundred kilograms is missing from the table, and most pumpkins are under a hundred kilograms. A pumpkin that splits before the weigh-in is withdrawn and never recorded at all. Forty-one percent of every other variety entered last year split before it reached the scales. Not one Hallow King split, because its skin is three times the thickness the others carry. The table therefore holds the Hallow Kings that grew and the few rivals that held together. Hallow King seed is sold by one supplier who will only supply growers holding a county class win. Every Hallow King in the table was grown by somebody who had already won with something else. A table of one variety grown only by champions is a table of champions, whatever the seed does. Its vines run longer, which the club's trial priced at four kilograms a fruit. It sets fruit nine days earlier, which the same trial priced at six.",
    q: "Does Hallow King really grow giants? Pick one cause and prove it.",
    why: [
      "a show that will not accept a pumpkin under a hundred kilograms",
      "longer vines, priced by the club's trial at four kilograms a fruit",
      "a skin three times the others' thickness, where forty-one percent of rivals split",
      "fruit set nine days earlier, priced by the same trial at six kilograms",
      "seed sold only to growers already holding a county class win",
    ],
    open: [0, 2, 4],
    for: [
      { who: 0, ev: ["“The show charges four pounds an entry and will not accept a pumpkin under a hundred kilograms.”", "“Every pumpkin under a hundred kilograms is missing from the table, and most pumpkins are under a hundred kilograms.”"], but: "“Hallow King averages a hundred and six kilograms across all its fruit, and the next variety averages ninety-four.”" },
      { who: 2, ev: ["“Forty-one percent of every other variety entered last year split before it reached the scales.”", "“Not one Hallow King split, because its skin is three times the thickness the others carry.”"], but: "“The club's own patch records, kept for every fruit whether entered or not, tell a different story.”" },
      { who: 4, ev: ["“Hallow King seed is sold by one supplier who will only supply growers holding a county class win.”", "“Every Hallow King in the table was grown by somebody who had already won with something else.”"], but: "“Not one Hallow King split, because its skin is three times the thickness the others carry.”" },
    ],
    clears: [
      "Its longer vines: “Its vines run longer, which the club's trial priced at four kilograms a fruit.”",
      "Its earlier fruit set: “It sets fruit nine days earlier, which the same trial priced at six.”",
    ],
    note:
      "Three filters sit between a seed and that table: a weight floor, a split rate and a rule about who may buy the seed. Each of them selects upward and the club's own records say the true gap is twelve kilograms. The splitting answer is the subtle one, because a thicker skin is both a real advantage and a reason the fruit survives to be counted.",
  },
  10: {
    story:
      "The signing-in book shows eighty-four percent of visitors arriving from the east of the town, and the governors are planning the new car park on that side. Four reasons have been given and each is genuinely true of the east. The signing-in book lives on the desk in the east lobby, because that is where reception is. The west entrance has a buzzer, a door release and no book at all. A counter on the west door was read for a fortnight in March and logged two hundred and twelve people. The east lobby book recorded two hundred and sixty-one in the same fortnight. The western bus route was withdrawn in September and the nearest western stop is now one point six kilometres away. Anybody coming from the west by bus now rides into town and out again on the eastern service. The eastern bus stops at the gate every twelve minutes from seven until seven. Eighty-eight percent of everyone who signs the book writes parent in the reason column. Both feeder primaries are east of the site, and the western primary feeds a different secondary entirely. A parent at this school is likelier to live east because of where the school takes its pupils from. The eastern housing holds nine hundred more households inside a mile, which the admissions map prices at six percent. The eastern approach has a pavement the whole way, and ninety-one percent of visitors arrive by car or bus.",
    q: "Do most visitors really come from the east? Prove your answer.",
    why: [
      "a book on the east desk and no book at all on the west door",
      "a western route withdrawn, putting the nearest stop a mile and a half away",
      "two feeder primaries east, with the western primary feeding elsewhere",
      "nine hundred more households inside a mile, priced at six percent",
      "a pavement the whole way east, where nine in ten arrive by car or bus",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The west entrance has a buzzer, a door release and no book at all.”", "“A counter on the west door was read for a fortnight in March and logged two hundred and twelve people.”"], but: "“Both feeder primaries are east of the site, and the western primary feeds a different secondary entirely.”" },
      { who: 1, ev: ["“The western bus route was withdrawn in September and the nearest western stop is now one point six kilometres away.”", "“Anybody coming from the west by bus now rides into town and out again on the eastern service.”"], but: "“The east lobby book recorded two hundred and sixty-one in the same fortnight.”" },
      { who: 2, ev: ["“Eighty-eight percent of everyone who signs the book writes parent in the reason column.”", "“Both feeder primaries are east of the site, and the western primary feeds a different secondary entirely.”"], but: "“A counter on the west door was read for a fortnight in March and logged two hundred and twelve people.”" },
    ],
    clears: [
      "The denser housing: “The eastern housing holds nine hundred more households inside a mile, which the admissions map prices at six percent.”",
      "The pavement: “The eastern approach has a pavement the whole way, and ninety-one percent of visitors arrive by car or bus.”",
    ],
    note:
      "Two hundred and twelve on the west door against two hundred and sixty-one in the east book is nowhere near eighty-four percent, and that comparison is the one hard measurement here. Note what the bus answer does: it makes westerners arrive from the east, so a true eastern figure would still be a lie about where people live. The car park question is about where visitors come from, not which door they use.",
  },
  11: {
    story:
      "The bus company's figures show ninety-seven percent of journeys on the school route arriving within five minutes of the timetable, and the complaints are being dismissed. Four reasons for genuine good performance have been offered and all four hold up. The company's measure is taken from journeys that were operated. A journey that is cancelled generates no arrival time, so it enters neither the top nor the bottom of the fraction. The operations log shows forty-one cancellations on this route in the same term, out of four hundred and six scheduled journeys. Three hundred and fifty-four of the four hundred and six scheduled journeys is eighty-seven percent. The timetable was rewritten in September with four minutes of slack at the midpoint and eleven at the terminus. A bus can now lose a quarter of an hour on the road and still be recorded as on time. The journey took thirty-one minutes in last year's timetable and takes forty-six in this one. The figure is calculated from the first of October, when the bus lane opened on the longest straight. September's journeys are excluded from the return as non-standard operating conditions. Twenty-nine of the forty-one cancellations and every one of the worst delays fall in September. The route keeps clear of the town centre, which the company's own modelling prices at two percent. The same two drivers work it, and the relief driver's eleven journeys are inside the ninety-seven percent.",
    q: "Is the service really ninety-seven percent punctual? Prove your answer.",
    why: [
      "forty-one cancellations that enter neither side of the fraction",
      "a route clear of the town centre, modelled at two percent",
      "fifteen minutes of new slack, on a journey grown from thirty-one minutes to forty-six",
      "two regular drivers, with the relief driver's journeys inside the figure",
      "a return calculated from October, with September excluded as non-standard",
    ],
    open: [0, 2, 4],
    for: [
      { who: 0, ev: ["“The operations log shows forty-one cancellations on this route in the same term, out of four hundred and six scheduled journeys.”", "“Three hundred and fifty-four of the four hundred and six scheduled journeys is eighty-seven percent.”"], but: "“September's journeys are excluded from the return as non-standard operating conditions.”" },
      { who: 2, ev: ["“The timetable was rewritten in September with four minutes of slack at the midpoint and eleven at the terminus.”", "“The journey took thirty-one minutes in last year's timetable and takes forty-six in this one.”"], but: "“A journey that is cancelled generates no arrival time, so it enters neither the top nor the bottom of the fraction.”" },
      { who: 4, ev: ["“September's journeys are excluded from the return as non-standard operating conditions.”", "“Twenty-nine of the forty-one cancellations and every one of the worst delays fall in September.”"], but: "“Three hundred and fifty-four of the four hundred and six scheduled journeys is eighty-seven percent.”" },
    ],
    clears: [
      "Avoiding the town centre: “The route keeps clear of the town centre, which the company's own modelling prices at two percent.”",
      "The regular drivers: “The same two drivers work it, and the relief driver's eleven journeys are inside the ninety-seven percent.”",
    ],
    note:
      "Three ways of not counting something: drop the cancelled journeys, widen the target, and exclude the bad month. None of them is a lie and all three move the figure. The slack answer is the one that would survive an audit, because a timetable is whatever the company says it is, and that is exactly why a pupil at a stop reads the clock instead.",
  },
  12: {
    story:
      "The record book shows nineteen home wins and three away wins, and the coach is being asked to explain a collapse on the road. Four causes have been offered and each is a real effect in school sport. The record book is kept by the fixtures secretary from the league return sheets. League returns are only submitted for competitive league fixtures. Friendlies are not returned, and the school plays almost all of its friendlies away because it cannot spare the pitch. The coach's own notebook lists forty-one away fixtures in the same period, of which the team won twenty-two. Eighteen of the twenty-five away league fixtures were played on artificial turf the squad has never trained on. The county's figures put a side in its first season on an unfamiliar surface at a third of its usual points. The one away league fixture played on grass was won by four goals. The coach missed twenty-two of the twenty-five away league fixtures, because they clash with his Thursday teaching. All three away wins came in the three fixtures he attended. He has been present at every home game without exception since the league began. Travel takes an hour and the squad is on the pitch twenty minutes after arriving, which the county prices at four percent. The home crowd averages eleven people, nine of whom are the squad's own parents.",
    q: "Why does the book show three away wins? Prove your answer from the text.",
    why: [
      "league returns only, with almost every friendly played away",
      "eighteen of twenty-five away fixtures on turf the squad has never trained on",
      "twenty-two of twenty-five away fixtures missed by the coach",
      "an hour's travel and twenty minutes to kick-off, priced at four percent",
      "a home crowd of eleven, nine of them the squad's own parents",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Friendlies are not returned, and the school plays almost all of its friendlies away because it cannot spare the pitch.”", "“The coach's own notebook lists forty-one away fixtures in the same period, of which the team won twenty-two.”"], but: "“All three away wins came in the three fixtures he attended.”" },
      { who: 1, ev: ["“Eighteen of the twenty-five away league fixtures were played on artificial turf the squad has never trained on.”", "“The one away league fixture played on grass was won by four goals.”"], but: "“The coach's own notebook lists forty-one away fixtures in the same period, of which the team won twenty-two.”" },
      { who: 2, ev: ["“The coach missed twenty-two of the twenty-five away league fixtures, because they clash with his Thursday teaching.”", "“All three away wins came in the three fixtures he attended.”"], but: "“He has been present at every home game without exception since the league began.”" },
    ],
    clears: [
      "The travel: “Travel takes an hour and the squad is on the pitch twenty minutes after arriving, which the county prices at four percent.”",
      "The home crowd: “The home crowd averages eleven people, nine of whom are the squad's own parents.”",
    ],
    note:
      "Three out of three with the coach there and nought out of twenty-two without him is the sort of pattern that convinces a room, and it is three matches. The notebook's twenty-two away wins is the fact that reframes everything, because those were mostly friendlies on grass with the coach present. Ask what the coach was doing on Thursdays.",
  },
  13: {
    story:
      "The feedback cards from the Christmas dinner came back at an average of four point seven out of five, and the kitchen is repeating the menu unchanged. Four reasons for genuine satisfaction have been put forward and each is fair. The cards were left face down on the tables and collected by the staff at two o'clock. Service began at half past twelve and the hall was timetabled to clear by half past one. A head count at twenty past one recorded a hundred and ninety pupils still seated out of four hundred and twenty served. Ninety-one cards were returned, all of them from tables still occupied at two. Anybody waiting for a bus, and anybody who did not like the food, had left an hour before. The card carries five questions and the average printed on the report is taken across all five. The first question asks how the hall looked, and the art department's decorations scored five from every card returned. The four questions about the food average three point nine on the same ninety-one cards. The pudding was handed out by the staff at the same moment as the cards. Printed across the top of the card is a line thanking pupils for their pudding and their time. Nobody has asked what a card handed out with a free pudding is measuring. The turkey was carved at the tables, which the kitchen's own trial last year moved by nought point two. The potatoes were a better variety, which the staff noticed and the cards never mention.",
    q: "Why did the dinner score four point seven? Pick one cause and prove it.",
    why: [
      "ninety-one cards, every one from a table still occupied at two",
      "carving at the tables, worth nought point two in the kitchen's own trial",
      "a better potato the staff noticed and the cards never mention",
      "a decorations question scoring five on every card, inside a five question average",
      "a pudding handed out with the card, and thanked for on the card",
    ],
    open: [0, 3, 4],
    for: [
      { who: 0, ev: ["“A head count at twenty past one recorded a hundred and ninety pupils still seated out of four hundred and twenty served.”", "“Ninety-one cards were returned, all of them from tables still occupied at two.”"], but: "“The four questions about the food average three point nine on the same ninety-one cards.”" },
      { who: 3, ev: ["“The first question asks how the hall looked, and the art department's decorations scored five from every card returned.”", "“The four questions about the food average three point nine on the same ninety-one cards.”"], but: "“Anybody waiting for a bus, and anybody who did not like the food, had left an hour before.”" },
      { who: 4, ev: ["“The pudding was handed out by the staff at the same moment as the cards.”", "“Printed across the top of the card is a line thanking pupils for their pudding and their time.”"], but: "“The first question asks how the hall looked, and the art department's decorations scored five from every card returned.”" },
    ],
    clears: [
      "Carving at the tables: “The turkey was carved at the tables, which the kitchen's own trial last year moved by nought point two.”",
      "The better potatoes: “The potatoes were a better variety, which the staff noticed and the cards never mention.”",
    ],
    note:
      "Three point nine on the food and five on the decorations averages to four point seven, which means the headline figure is mostly a review of the art department. That is the cleanest arithmetic in the case and the easiest to miss. The survivors and the pudding are both real on top of it, and all three would have to be fixed before the kitchen learned anything.",
  },
  14: {
    story:
      "The bake sale's sheet shows chocolate selling two hundred and ten cakes against lemon's forty, and next term's baking rota has been rewritten around chocolate. Four reasons have been offered and each is real. The rota tells the bakers how many of each to make, and it asked for two hundred and forty chocolate and forty-five lemon. Two hundred and ten of two hundred and forty chocolate cakes sold, which is eighty-eight percent. Forty of forty-five lemon cakes sold, which is eighty-nine percent. A count of what sold cannot tell you what would have sold, unless you also know what there was. The chocolate stood on the front table and the lemon table was set up behind the pillar in the corridor. A helper counted a hundred and forty people who bought at the front table and left without passing the pillar. The lemon table was cleared and packed away forty minutes before the sale ended, because nobody was passing it. The lemon cakes carried no icing and no label of any kind. The tally sheet has a column for chocolate and a column headed plain, and the counter filled in whichever looked right. A later check of the plain column found eleven lemon cakes recorded there rather than under their own flavour. Asked in the abstract most people name chocolate, which the trial put at a sixth. The chocolate cakes ran a few grams heavier, which the same trial could not measure at all.",
    q: "Does chocolate really outsell lemon? Choose one cause and prove it.",
    why: [
      "a rota asking for two hundred and forty chocolate and forty-five lemon",
      "a lemon table behind a pillar, missed by a hundred and forty buyers",
      "no icing, no label, and a tally column headed plain",
      "chocolate named most often in the abstract, which the trial put at a sixth",
      "chocolate cakes a few grams heavier, which the trial could not measure",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The rota tells the bakers how many of each to make, and it asked for two hundred and forty chocolate and forty-five lemon.”", "“Forty of forty-five lemon cakes sold, which is eighty-nine percent.”"], but: "“The lemon table was cleared and packed away forty minutes before the sale ended, because nobody was passing it.”" },
      { who: 1, ev: ["“The chocolate stood on the front table and the lemon table was set up behind the pillar in the corridor.”", "“A helper counted a hundred and forty people who bought at the front table and left without passing the pillar.”"], but: "“Two hundred and ten of two hundred and forty chocolate cakes sold, which is eighty-eight percent.”" },
      { who: 2, ev: ["“The lemon cakes carried no icing and no label of any kind.”", "“The tally sheet has a column for chocolate and a column headed plain, and the counter filled in whichever looked right.”"], but: "“A helper counted a hundred and forty people who bought at the front table and left without passing the pillar.”" },
    ],
    clears: [
      "Chocolate's reputation: “Asked in the abstract most people name chocolate, which the trial put at a sixth.”",
      "The larger cakes: “The chocolate cakes ran a few grams heavier, which the same trial could not measure at all.”",
    ],
    note:
      "Eighty-eight percent against eighty-nine percent is the whole answer and it takes two lines of division to find. Everything else in the case is an argument about why forty-five lemon cakes were not enough, which is a different question and a better one. Ask what the rota should say next term, and notice that nobody has the number that would tell them.",
  },
  15: {
    story:
      "The lost property audit lists ninety-four wool mittens and six acrylic, and a letter is being drafted advising parents against wool. Four reasons have been given and each is a real property of wool. The lost property box is emptied every Friday by the site team. Anything judged to have no value is bagged for the textile bank and not entered in the audit. The site team's standing instruction, written in two thousand and nine, treats synthetic gloves as having no resale value. A fortnight of logging everything that entered the box, with nothing discarded, recorded fifty-one wool and thirty-eight acrylic. Every pair of mittens sold by the school shop is acrylic and carries a name tape sewn into the cuff. A mitten with a name tape is walked back to its classroom and never reaches the box at all. Hand-knitted wool mittens have no tape, no label and nothing to tell anybody whose they are. Wool is warm enough that children pull it off the moment they come indoors. The same fortnight found that eighty-one percent of everything entering the box was taken off inside the building. Acrylic is thin enough to be worn indoors without anybody noticing, and a mitten still on a hand is not lost. They are bulkier and a coat pocket rarely takes them, which the fortnight could not separate from the rest. They are more often handed down and their elastic has gone, which the fortnight found on four pairs out of eighty-nine.",
    q: "Are wool mittens really lost more? Pick one cause and prove it from the text.",
    why: [
      "a standing instruction binning synthetic gloves before the audit",
      "name tapes sewn into every acrylic pair the school shop sells",
      "wool coming off indoors, where four fifths of the box is lost",
      "bulk that a coat pocket rarely takes, which the fortnight could not separate",
      "hand-me-downs with the elastic gone, found on four pairs in eighty-nine",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The site team's standing instruction, written in two thousand and nine, treats synthetic gloves as having no resale value.”", "“A fortnight of logging everything that entered the box, with nothing discarded, recorded fifty-one wool and thirty-eight acrylic.”"], but: "“A mitten with a name tape is walked back to its classroom and never reaches the box at all.”" },
      { who: 1, ev: ["“Every pair of mittens sold by the school shop is acrylic and carries a name tape sewn into the cuff.”", "“A mitten with a name tape is walked back to its classroom and never reaches the box at all.”"], but: "“Anything judged to have no value is bagged for the textile bank and not entered in the audit.”" },
      { who: 2, ev: ["“The same fortnight found that eighty-one percent of everything entering the box was taken off inside the building.”", "“Acrylic is thin enough to be worn indoors without anybody noticing, and a mitten still on a hand is not lost.”"], but: "“A fortnight of logging everything that entered the box, with nothing discarded, recorded fifty-one wool and thirty-eight acrylic.”" },
    ],
    clears: [
      "Their bulk: “They are bulkier and a coat pocket rarely takes them, which the fortnight could not separate from the rest.”",
      "Being handed down: “They are more often handed down and their elastic has gone, which the fortnight found on four pairs out of eighty-nine.”",
    ],
    note:
      "Fifty-one against thirty-eight is the real ratio and it is nothing like sixteen to one, so the letter is wrong whichever answer wins. What is left to argue is whether wool is lost more at all, and the name tape answer says the gap is about labelling rather than fibre. That is a different letter, addressed to the school shop.",
  },
  16: {
    story:
      "The gingerbread house recipe carries two hundred and eleven reviews online at an average of four point eight stars, and the class is using it unchanged. Four reasons for genuine quality have been offered and each stands up. A review can only be left by somebody who has made the house and photographed it. The site requires a photograph of the finished build before a review will post. A house that collapsed cannot be photographed finished, and its baker has nothing to upload. The author's own question thread, where no photograph is required, carries four hundred and six questions. A hundred and seventy of them describe a wall that slid or a roof that came down. The template prints to scale rather than being described in words, which is rare on that site. The site's own comparison of four hundred gingerbread recipes puts a scale template at nine tenths of a star. The site average is three point nine, and three point nine plus nine tenths is four point eight. The author moderates the thread and the site allows a recipe's owner to remove any review. The page history shows three hundred and eleven reviews posted and two hundred and eleven still standing. Every one of the hundred removed carried two stars or fewer, which the archive still holds. The dough includes an extra egg yolk, which the same comparison prices at a tenth of a star. The method weighs the icing sugar rather than using a cup, which that comparison could not measure.",
    q: "Is the recipe really four point eight? Choose one cause and prove it.",
    why: [
      "a photograph of a finished build required before a review will post",
      "an extra egg yolk, priced by the site's comparison at a tenth of a star",
      "a scale template, which that comparison puts at nine tenths of a star",
      "a weighed icing sugar the comparison could not measure",
      "a hundred reviews removed by the author, every one at two stars or fewer",
    ],
    open: [0, 2, 4],
    for: [
      { who: 0, ev: ["“The site requires a photograph of the finished build before a review will post.”", "“A hundred and seventy of them describe a wall that slid or a roof that came down.”"], but: "“The page history shows three hundred and eleven reviews posted and two hundred and eleven still standing.”" },
      { who: 2, ev: ["“The site's own comparison of four hundred gingerbread recipes puts a scale template at nine tenths of a star.”", "“The site average is three point nine, and three point nine plus nine tenths is four point eight.”"], but: "“Every one of the hundred removed carried two stars or fewer, which the archive still holds.”" },
      { who: 4, ev: ["“The page history shows three hundred and eleven reviews posted and two hundred and eleven still standing.”", "“Every one of the hundred removed carried two stars or fewer, which the archive still holds.”"], but: "“The author's own question thread, where no photograph is required, carries four hundred and six questions.”" },
    ],
    clears: [
      "The extra egg yolk: “The dough includes an extra egg yolk, which the same comparison prices at a tenth of a star.”",
      "Weighed icing sugar: “The method weighs the icing sugar rather than using a cup, which that comparison could not measure.”",
    ],
    note:
      "The template answer lands exactly on four point eight, which should make a reader suspicious rather than satisfied, and it is the only answer here that says the recipe is genuinely good. The other two say the number was built by what could not be posted and what was taken down. All three are consistent with the same page, and the question thread is the only place the failures survive.",
  },
  17: {
    story:
      "The maintenance file records sixty-one LED failures and nine filament failures this year, and the school is reverting to filament bulbs. Four reasons have been offered and each is a real weakness of the LEDs that were fitted. A failure is recorded when a bulb is brought to the caretaker's office and a form filled in. An LED fitting costs eighteen pounds and is replaced under warranty, which requires the form. A filament bulb costs forty pence and the cleaners change them from the trolley without telling anybody. The stores ledger shows eight hundred and ninety filament bulbs issued this year against ninety LED units. There are two hundred and ten filament fittings in the building and three hundred and forty LED ones. Every one of the three hundred and forty LED units sits in a sealed fitting of the type the maker advises against. The maker's own return data puts a driver in a sealed fitting at a four year life against twenty-five in an open one. Sixty-one failures from three hundred and forty units in a year is what a four year life looks like. The corridor circuit logged a hundred and six spikes above three hundred volts this year. The drivers in these units are rated to two hundred and seventy volts and have no protection fitted. A filament bulb has nothing in it a spike can damage, which is why nine is all the filaments managed. They were the framework's cheapest fitting, whose other two options use the same driver. They run four degrees hotter than specification, which the maker's data treats as within tolerance.",
    q: "Do the LEDs really fail more? Pick one cause and prove it from the file.",
    why: [
      "a form required for a warranty claim and never for a forty pence bulb",
      "the cheapest fitting on a framework whose other options share the driver",
      "three hundred and forty units in sealed fittings the maker advises against",
      "a hundred and six spikes above three hundred volts on unprotected drivers",
      "four degrees over specification, which the maker treats as within tolerance",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“An LED fitting costs eighteen pounds and is replaced under warranty, which requires the form.”", "“A filament bulb costs forty pence and the cleaners change them from the trolley without telling anybody.”"], but: "“Sixty-one failures from three hundred and forty units in a year is what a four year life looks like.”" },
      { who: 2, ev: ["“The maker's own return data puts a driver in a sealed fitting at a four year life against twenty-five in an open one.”", "“Sixty-one failures from three hundred and forty units in a year is what a four year life looks like.”"], but: "“The stores ledger shows eight hundred and ninety filament bulbs issued this year against ninety LED units.”" },
      { who: 3, ev: ["“The corridor circuit logged a hundred and six spikes above three hundred volts this year.”", "“The drivers in these units are rated to two hundred and seventy volts and have no protection fitted.”"], but: "“A failure is recorded when a bulb is brought to the caretaker's office and a form filled in.”" },
    ],
    clears: [
      "The cheap fittings: “They were the framework's cheapest fitting, whose other two options use the same driver.”",
      "Running hot: “They run four degrees hotter than specification, which the maker's data treats as within tolerance.”",
    ],
    note:
      "Eight hundred and ninety filament bulbs for two hundred and ten fittings is four changes a fitting a year, and the file calls that nine failures. That one division answers the headline and leaves the real question open: the LEDs are in the wrong fittings on a bad circuit and are failing at six times their design life. The right answer is not filament bulbs, and it is not these LEDs either.",
  },
  18: {
    story:
      "The checking book for the tower clock carries eleven years of weekly entries and not one records an error above thirty seconds. The clock is being left out of the restoration on the strength of it. Four reasons for genuine accuracy have been offered and each is fair. The book is filled in by the winder on Sunday mornings. The entry is made by comparing the tower clock against the winder's own wristwatch. The wristwatch is set each Sunday from the tower clock before the climb, because the kitchen radio is unreliable. A phone set by the national time signal was carried up in October and found the clock four minutes and twenty seconds slow. The nineteen ninety-eight rebuild fitted a temperature-compensated escapement of a type the maker certifies to two seconds a week. Two seconds a week is a hundred and four seconds a year, and the book has never shown more than thirty. The restorer's survey in March found that escapement in the condition it left the workshop in. The pendulum case was sealed in the same rebuild and carries a desiccant cartridge changed every August. The trade puts a sealed, dried pendulum at a tenth of the drift of one hanging in open air. The humidity logger in the case has read between forty and forty-two percent for eleven years. Stone keeps the tower at a steady temperature, which the same logger puts at one degree a year. It is wound every Sunday by the same person, and a fusee drive is even however it is wound.",
    q: "Is the clock really never wrong? Pick one cause and prove it from the book.",
    why: [
      "a wristwatch set from the tower clock before every climb",
      "a 1998 escapement certified to two seconds a week and still in that condition",
      "a sealed case with a desiccant cartridge and eleven years at forty percent",
      "stone holding the tower to one degree a year",
      "the same winder every Sunday on a drive that is even however it is wound",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The wristwatch is set each Sunday from the tower clock before the climb, because the kitchen radio is unreliable.”", "“A phone set by the national time signal was carried up in October and found the clock four minutes and twenty seconds slow.”"], but: "“The restorer's survey in March found that escapement in the condition it left the workshop in.”" },
      { who: 1, ev: ["“The nineteen ninety-eight rebuild fitted a temperature-compensated escapement of a type the maker certifies to two seconds a week.”", "“The restorer's survey in March found that escapement in the condition it left the workshop in.”"], but: "“Two seconds a week is a hundred and four seconds a year, and the book has never shown more than thirty.”" },
      { who: 2, ev: ["“The pendulum case was sealed in the same rebuild and carries a desiccant cartridge changed every August.”", "“The humidity logger in the case has read between forty and forty-two percent for eleven years.”"], but: "“A phone set by the national time signal was carried up in October and found the clock four minutes and twenty seconds slow.”" },
    ],
    clears: [
      "The stone tower: “Stone keeps the tower at a steady temperature, which the same logger puts at one degree a year.”",
      "The regular winding: “It is wound every Sunday by the same person, and a fusee drive is even however it is wound.”",
    ],
    note:
      "Even a certified escapement drifts a hundred seconds a year, and the book has never once recorded thirty. A record that is better than the best possible performance is not a record of performance. The phone settles what the clock is doing, and the two good answers about the mechanism are arguments about why it is not worse.",
  },
  19: {
    story:
      "Eleven years of readings show the field taking twice the snow depth of the car park, and the grounds plan treats the two as different microclimates. Four reasons have been offered and each is physically sound. The field reading is taken at the marker post, which was driven in beside the hedge in two thousand and twelve. The car park reading is taken in the open, in the middle of the hardstanding. Wind-blown snow piles against a hedge and scours the open ground beside it. A set of five measured stakes was put across the field last January at ten-metre spacings. The marker post read twenty-six centimetres and the open stakes read between nine and thirteen. The car park was resurfaced in two thousand and twelve with a dark asphalt that holds the day's heat. The county's thermal survey puts that surface four degrees above the grass beside it at dusk. Four degrees is the difference between snow that lies and snow that turns to water on landing. The car park is gritted at four o'clock on every afternoon a frost is forecast. The depth readings are taken at eight the following morning, sixteen hours later. Salt spread at that rate takes the first fifteen centimetres off anything that falls on it. The field is four metres higher, which the survey prices at a fifth of a degree. The sports hall shelters the car park from the west, and eleven years of readings include every wind direction.",
    q: "Does the field really get twice the snow? Prove your answer from the text.",
    why: [
      "a marker post driven in beside a hedge, where blown snow piles",
      "dark asphalt laid in 2012, four degrees above the grass at dusk",
      "gritting at four, sixteen hours before the depth is read",
      "four metres of height, priced at a fifth of a degree",
      "shelter from the west, across eleven years of every wind direction",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Wind-blown snow piles against a hedge and scours the open ground beside it.”", "“The marker post read twenty-six centimetres and the open stakes read between nine and thirteen.”"], but: "“Four degrees is the difference between snow that lies and snow that turns to water on landing.”" },
      { who: 1, ev: ["“The car park was resurfaced in two thousand and twelve with a dark asphalt that holds the day's heat.”", "“The county's thermal survey puts that surface four degrees above the grass beside it at dusk.”"], but: "“The marker post read twenty-six centimetres and the open stakes read between nine and thirteen.”" },
      { who: 2, ev: ["“The car park is gritted at four o'clock on every afternoon a frost is forecast.”", "“Salt spread at that rate takes the first fifteen centimetres off anything that falls on it.”"], but: "“The depth readings are taken at eight the following morning, sixteen hours later.”" },
    ],
    clears: [
      "The height: “The field is four metres higher, which the survey prices at a fifth of a degree.”",
      "The sports hall shelter: “The sports hall shelters the car park from the west, and eleven years of readings include every wind direction.”",
    ],
    note:
      "Two thousand and twelve is the year the post went in beside the hedge and the year the asphalt went down, which means the record changed twice at once and nobody can unpick it. The five stakes measure the field against itself and find the post reading double the open ground. That is the only comparison here that holds everything else constant.",
  },
  20: {
    story:
      "The nature club's three-year record names the robin the commonest bird in the school grounds, ahead of every other species. Four reasons have been given and each is a true fact about robins. The record is kept as sightings, with one mark made each time a species is seen. A robin alone on a post is one mark, and a flock of thirty starlings arriving together is also one mark. The club meets at lunchtime, and the counts are made between half past twelve and one. A ringing session run by the county trust at dawn last March caught and counted individual birds instead. It recorded four robins, sixty-one starlings, fifty-three house sparrows and thirty-eight goldfinches. A robin holds a quarter of a hectare all year, and the grounds hold eleven separate territories. The ringing session fell in the week the starling flock moves through, and none of those sixty-one has been seen since. A bird present on three hundred and sixty-five days outranks a bird present on four. The club's identification sheet lists robin, blackbird, pigeon and a box marked other. Sixty-one percent of all the marks in three years fall in that box. A sheet that names the robin and lumps everything else together will find robins. Robins are bold enough to feed with people standing nearby, which the ringing session also found. They sing through the winter and are heard before they are seen, and the record has no column for song.",
    q: "Is the robin really the commonest bird? Choose one cause and prove it.",
    why: [
      "one mark for a lone robin and one mark for a flock of thirty",
      "eleven territories held all year against a flock seen on four days",
      "boldness that lets them feed with people standing nearby",
      "a sheet naming three species and lumping the rest in a box",
      "winter song, heard before it is seen, with no column in the record",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“A robin alone on a post is one mark, and a flock of thirty starlings arriving together is also one mark.”", "“It recorded four robins, sixty-one starlings, fifty-three house sparrows and thirty-eight goldfinches.”"], but: "“The ringing session fell in the week the starling flock moves through, and none of those sixty-one has been seen since.”" },
      { who: 1, ev: ["“A robin holds a quarter of a hectare all year, and the grounds hold eleven separate territories.”", "“A bird present on three hundred and sixty-five days outranks a bird present on four.”"], but: "“It recorded four robins, sixty-one starlings, fifty-three house sparrows and thirty-eight goldfinches.”" },
      { who: 3, ev: ["“The club's identification sheet lists robin, blackbird, pigeon and a box marked other.”", "“Sixty-one percent of all the marks in three years fall in that box.”"], but: "“A robin alone on a post is one mark, and a flock of thirty starlings arriving together is also one mark.”" },
    ],
    clears: [
      "Their boldness: “Robins are bold enough to feed with people standing nearby, which the ringing session also found.”",
      "Their winter song: “They sing through the winter and are heard before they are seen, and the record has no column for song.”",
    ],
    note:
      "Eleven territories against four birds ringed is a contradiction nobody in the case notices, and it means the dawn session and the lunchtime club disagree about robins too. Commonest is the word doing the damage: commonest by individuals, by days present, or by times noticed are three different questions. Make the class pick one before they answer.",
  },
  21: {
    story:
      "The usage report for the drinks machine shows ninety-six percent of cups taken by staff, and the machine is being moved into the staff room. Four reasons have been offered and all four are genuine. The report is generated from the staff key fobs, which log every cup against a name for the billing. A pupil pays with a coin, and the coin mechanism has no counter wired to the reporting board. The engineer's visit in February logged total cups dispensed from the flow meter instead. It recorded four thousand one hundred cups in a fortnight against the key fob total of one thousand six hundred. Two thousand five hundred cups in that fortnight were paid for in coins. The machine stands in the corridor behind the staff room door, which has carried a code lock since September. A pupil who wants a drink has to find a member of staff willing to key them through. The code is not given to pupils and the door log records eleven pupil entries in a fortnight. The rule on hot drinks was extended in September from lessons to the whole school day. The catering contract switches the machine off at break and at lunch, which are the only times a pupil is free. Between those two changes there is no hour of the week in which a pupil may lawfully buy a cup. Staff have longer breaks and more of them, which the national figures price at a factor of two. Staff drink more hot drinks per head than teenagers by any national measure, which is another factor of two.",
    q: "Do only staff use the machine? Pick one cause and prove it from the report.",
    why: [
      "a report built from key fobs, with no counter on the coin mechanism",
      "longer and more frequent staff breaks, priced at a factor of two",
      "a code lock since September and eleven pupil entries in a fortnight",
      "a hot drinks rule extended to the whole day, with the machine off at break",
      "a national per-head difference worth another factor of two",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“A pupil pays with a coin, and the coin mechanism has no counter wired to the reporting board.”", "“Two thousand five hundred cups in that fortnight were paid for in coins.”"], but: "“The code is not given to pupils and the door log records eleven pupil entries in a fortnight.”" },
      { who: 2, ev: ["“The machine stands in the corridor behind the staff room door, which has carried a code lock since September.”", "“The code is not given to pupils and the door log records eleven pupil entries in a fortnight.”"], but: "“Two thousand five hundred cups in that fortnight were paid for in coins.”" },
      { who: 3, ev: ["“The rule on hot drinks was extended in September from lessons to the whole school day.”", "“The catering contract switches the machine off at break and at lunch, which are the only times a pupil is free.”"], but: "“The engineer's visit in February logged total cups dispensed from the flow meter instead.”" },
    ],
    clears: [
      "Longer staff breaks: “Staff have longer breaks and more of them, which the national figures price at a factor of two.”",
      "Drinking habits: “Staff drink more hot drinks per head than teenagers by any national measure, which is another factor of two.”",
    ],
    note:
      "Two and a half thousand coin cups in a fortnight and eleven pupil entries through the only door cannot both be true, and the case gives no way to reconcile them. Somebody is buying those cups, and the interesting question is who. Ask what the staff room move would do to the coin takings, and whether anybody has looked at them.",
  },
  22: {
    story:
      "The post count shows Year Nine sending two hundred and twelve cards and no other year reaching sixty. The tutor team is being asked what makes that year group different. Four explanations have been put forward and each is plausible. The single post box stands in the Year Nine corridor, outside room fourteen. Every other year group reaches it by crossing the quad or going up two flights. A second box was put in the Year Eleven corridor for three days as a trial this year. It took ninety-one cards in three days, against the main box's hundred and four over the same three days. The card-making club met eleven lunchtimes in February in the art rooms beside the Year Nine forms. Its register records a hundred and ninety-one of two hundred and three attendances from Year Nine. The club runs in the first lunch sitting, which is the only sitting Year Nine is free for. The charity link paid twenty pence a card to the hospice, and the Year Nine tutors added a competition. A prize was offered to the form posting the most cards, and the winning form posted a hundred and six. No other year group was told the competition existed. Year Nine has thirty-one more pupils than any other cohort, which is five percent of the school. The relationships unit runs in February for every year group from Seven to Eleven.",
    q: "Why did Year Nine send so many? Choose one cause and prove it.",
    why: [
      "the only post box, standing in the Year Nine corridor",
      "thirty-one more pupils than any cohort, five percent of the school",
      "a February unit that runs for every year from Seven to Eleven",
      "a card club beside the Year Nine forms, in the only sitting they are free for",
      "a prize competition no other year group was told about",
    ],
    open: [0, 3, 4],
    for: [
      { who: 0, ev: ["“A second box was put in the Year Eleven corridor for three days as a trial this year.”", "“It took ninety-one cards in three days, against the main box's hundred and four over the same three days.”"], but: "“A prize was offered to the form posting the most cards, and the winning form posted a hundred and six.”" },
      { who: 3, ev: ["“Its register records a hundred and ninety-one of two hundred and three attendances from Year Nine.”", "“The club runs in the first lunch sitting, which is the only sitting Year Nine is free for.”"], but: "“Every other year group reaches it by crossing the quad or going up two flights.”" },
      { who: 4, ev: ["“The charity link paid twenty pence a card to the hospice, and the Year Nine tutors added a competition.”", "“A prize was offered to the form posting the most cards, and the winning form posted a hundred and six.”"], but: "“Its register records a hundred and ninety-one of two hundred and three attendances from Year Nine.”" },
    ],
    clears: [
      "The cohort size: “Year Nine has thirty-one more pupils than any other cohort, which is five percent of the school.”",
      "The relationships unit: “The relationships unit runs in February for every year group from Seven to Eleven.”",
    ],
    note:
      "Ninety-one cards from a three day box in a corridor says the posting is about distance, and a hundred and six from one form says it is about a prize. Both are measured and both are large, and one competition form is half the year's total. Everything here is a filter on who could post, who was told, and who was free at the right lunchtime.",
  },
  23: {
    story:
      "Eleven of the last fourteen science fair prizes have gone to volcano projects, and the department is worried that judges are being won over by spectacle. Four reasons have been offered and each is reasonable. Judging runs between two o'clock and three o'clock on the Friday afternoon. A judge walks the hall and asks each entrant to show what their project does. A volcano can be made to erupt on request in forty seconds. The germination trial, the mould study, the rusting experiment and the yeast investigation all need between a day and three weeks to show anything. Those four entries can offer a judge a folder of results and nothing to watch. The entry rules require a risk assessment countersigned by a technician for any project using a culture, a heat source or three weeks of bench space. The technician has countersigned four such forms in fourteen years, because the form takes an hour of her time. A project nobody will countersign is a project that never reaches the hall at all. The newsletter prints the winner's photograph every year, and the entry form's example picture has been a volcano since two thousand and fifteen. Of the eighty-one entries this year, fifty-three were volcanoes and none of the rest was repeated twice. Eleven wins out of fourteen is close to what chance gives a field that is two thirds volcanoes. A volcano is visual, and the judges' score sheet has no mark for presentation. Its result needs no explanation, and every entry is judged from a written folder as well.",
    q: "Why do volcanoes win? Pick one cause and prove it from the text.",
    why: [
      "an hour of judging, and only one project that performs in forty seconds",
      "a visual result, on a score sheet with no mark for presentation",
      "a result needing no explanation, where every entry is judged on its folder too",
      "four countersigned risk assessments in fourteen years",
      "fifty-three volcanoes in a field of eighty-one entries",
    ],
    open: [0, 3, 4],
    for: [
      { who: 0, ev: ["“A volcano can be made to erupt on request in forty seconds.”", "“Those four entries can offer a judge a folder of results and nothing to watch.”"], but: "“Eleven wins out of fourteen is close to what chance gives a field that is two thirds volcanoes.”" },
      { who: 3, ev: ["“The technician has countersigned four such forms in fourteen years, because the form takes an hour of her time.”", "“A project nobody will countersign is a project that never reaches the hall at all.”"], but: "“Of the eighty-one entries this year, fifty-three were volcanoes and none of the rest was repeated twice.”" },
      { who: 4, ev: ["“Of the eighty-one entries this year, fifty-three were volcanoes and none of the rest was repeated twice.”", "“Eleven wins out of fourteen is close to what chance gives a field that is two thirds volcanoes.”"], but: "“A volcano can be made to erupt on request in forty seconds.”" },
    ],
    clears: [
      "Being visual: “A volcano is visual, and the judges' score sheet has no mark for presentation.”",
      "Its clear result: “Its result needs no explanation, and every entry is judged from a written folder as well.”",
    ],
    note:
      "Eleven out of fourteen stops being surprising the moment somebody notices that two thirds of the entries are volcanoes, and then the question moves to why. The countersigning rule answers that: the fair filters its own field a year before the judging starts. Three filters in a row, and the judges may have done nothing wrong at all.",
  },
  24: {
    story:
      "The museum's figures show the Tudor crown photographed eleven thousand times last year, more than the next four objects together, and the gallery is being rebuilt around it. Four reasons have been offered and each is genuine. The count comes from the photography permission scheme, where a visitor taps a card to unlock the no-flash rule in that room. Rooms two through seven are marked no photography because of loan conditions on their contents. There is no way for a visitor to photograph the Anglo-Saxon hoard or the illuminated psalter at all. The count of eleven thousand is a count of the one room where photography is permitted and logged. The crown is on the cover of the national schoolbook used by every secondary in the country. The museum's exit survey found seventy-eight percent of visitors naming it as the reason they came. A visitor who came for one object photographs that object and goes home. The crown is the last thing on the route before the shop, and the route is one way. The footfall counters logged four hundred thousand people past the crown and sixty thousand reaching room two. Six objects out of seven were seen by a seventh of the visitors the crown was seen by. It sits at eye level in an open case, and so do nine of the objects in rooms two to seven. It is lit from four sides, which the museum's own guide recommends for every case in the building.",
    q: "Why is the crown photographed most? Pick one cause and prove it.",
    why: [
      "six rooms where photography is banned and never logged",
      "a national schoolbook cover and seventy-eight percent naming it",
      "an open case at eye level, like nine objects in rooms two to seven",
      "four-sided lighting the museum's guide recommends everywhere",
      "four hundred thousand past the crown against sixty thousand reaching room two",
    ],
    open: [0, 1, 4],
    for: [
      { who: 0, ev: ["“Rooms two through seven are marked no photography because of loan conditions on their contents.”", "“The count of eleven thousand is a count of the one room where photography is permitted and logged.”"], but: "“The footfall counters logged four hundred thousand people past the crown and sixty thousand reaching room two.”" },
      { who: 1, ev: ["“The crown is on the cover of the national schoolbook used by every secondary in the country.”", "“The museum's exit survey found seventy-eight percent of visitors naming it as the reason they came.”"], but: "“There is no way for a visitor to photograph the Anglo-Saxon hoard or the illuminated psalter at all.”" },
      { who: 4, ev: ["“The crown is the last thing on the route before the shop, and the route is one way.”", "“The footfall counters logged four hundred thousand people past the crown and sixty thousand reaching room two.”"], but: "“The museum's exit survey found seventy-eight percent of visitors naming it as the reason they came.”" },
    ],
    clears: [
      "Its open case: “It sits at eye level in an open case, and so do nine of the objects in rooms two to seven.”",
      "Its lighting: “It is lit from four sides, which the museum's own guide recommends for every case in the building.”",
    ],
    note:
      "Three filters sit in front of this number and they stack: six rooms where nobody may photograph, a route that only a seventh of visitors finish, and a crowd that came for one object. A seven to one footfall difference will not by itself beat the next four objects combined, which is what the ban has to carry. Ask what the figure would look like if the loans ended.",
  },
  25: {
    story:
      "The school's figures show pupils who learn the piano scoring eleven points above the year average in maths, and a bid is being written to fund piano lessons for everybody. Four mechanisms have been proposed and each has some research behind it. Piano lessons at this school cost eighteen pounds a week and are arranged privately by families. Ninety-one percent of the pupils learning piano are not eligible for free school meals, against sixty-two percent of the year group. When the same figures are compared within the group that pays for lessons, the piano gap falls to two points. The school's maths assessment is weighted a third to fractions and ratio. The piano group scores thirty-one points above average on the fractions paper and two points below on everything else. An eleven point lead on a paper weighted that way is a lead on fractions wearing the name of maths. The school's study-habit survey records the piano group at fifty-one minutes of independent work a night. The year group averages eleven minutes on the same question, and the county prices that gap at eleven points. A child who practises an instrument every evening is a child who already sits down to work. Reading two staves at once trains two streams of information, which the published effect puts at a point. Performance is said to teach working under pressure, which the same review could not separate from zero.",
    q: "Why do pianists score higher in maths? Choose one cause and prove it.",
    why: [
      "eighteen pounds a week, and ninety-one percent outside free school meals",
      "two staves at once, worth about a point in the published effect",
      "thirty-one points above on fractions and two below on everything else",
      "fifty-one minutes of independent work a night against the year's eleven",
      "performing under pressure, which the review could not separate from zero",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“Ninety-one percent of the pupils learning piano are not eligible for free school meals, against sixty-two percent of the year group.”", "“When the same figures are compared within the group that pays for lessons, the piano gap falls to two points.”"], but: "“The piano group scores thirty-one points above average on the fractions paper and two points below on everything else.”" },
      { who: 2, ev: ["“The school's maths assessment is weighted a third to fractions and ratio.”", "“An eleven point lead on a paper weighted that way is a lead on fractions wearing the name of maths.”"], but: "“When the same figures are compared within the group that pays for lessons, the piano gap falls to two points.”" },
      { who: 3, ev: ["“The school's study-habit survey records the piano group at fifty-one minutes of independent work a night.”", "“The year group averages eleven minutes on the same question, and the county prices that gap at eleven points.”"], but: "“A child who practises an instrument every evening is a child who already sits down to work.”" },
    ],
    clears: [
      "Reading two staves: “Reading two staves at once trains two streams of information, which the published effect puts at a point.”",
      "Performing: “Performance is said to teach working under pressure, which the same review could not separate from zero.”",
    ],
    note:
      "Two points once you compare within the paying group is the single most important number here, and it survives whichever mechanism anybody prefers. The fractions result is the sharpest: a group two points below average on the rest of the paper is not better at maths. The study habit answer is the only one where the bid might still make sense, and it is also the one that may run backwards.",
  },
  26: {
    story:
      "Four years of club records show the field's wind running between eight and forty kilometres an hour and never outside it, and a member is writing that the site has unusually steady weather. Four reasons have been offered and each is physically real. The readings are taken by whoever turns up, from the handheld meter in the clubhouse. Nobody drives to a kite field on a still day, because there is nothing to do there. Nobody drives to a kite field in a gale either, because the club rules forbid flying above forty. The parish council's station logs every hour whether anybody is there or not, and records winds below eight on a hundred and ninety days a year. The parish station stands on the ridge four hundred metres away and a hundred and ten metres above the field. The county's terrain model puts a sheltered bowl at about half the wind speed measured on the ridge above it. Half of the station's range is almost exactly the range the club has been recording for four years. The poplars run the full western edge of the field and stand twenty-two metres high. The handheld meter is always used from the clubhouse step, eleven metres into their lee. A belt of trees that size takes the top off a gust and does nothing at all to a calm. The site is twelve kilometres inland, which the model prices at a tenth of the coastal range. The valley runs across the prevailing wind, which the same model treats as making no difference at this distance.",
    q: "Why has the wind never left that range? Pick one cause and prove it.",
    why: [
      "readings taken only by people who chose to drive out that day",
      "a bowl a hundred and ten metres below the station, at half its wind speed",
      "a meter used eleven metres into the lee of twenty-two metre poplars",
      "twelve kilometres inland, priced at a tenth of the coastal range",
      "a valley across the prevailing wind, which the model says makes no difference",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Nobody drives to a kite field on a still day, because there is nothing to do there.”", "“Nobody drives to a kite field in a gale either, because the club rules forbid flying above forty.”"], but: "“Half of the station's range is almost exactly the range the club has been recording for four years.”" },
      { who: 1, ev: ["“The parish station stands on the ridge four hundred metres away and a hundred and ten metres above the field.”", "“The county's terrain model puts a sheltered bowl at about half the wind speed measured on the ridge above it.”"], but: "“The parish council's station logs every hour whether anybody is there or not, and records winds below eight on a hundred and ninety days a year.”" },
      { who: 2, ev: ["“The poplars run the full western edge of the field and stand twenty-two metres high.”", "“The handheld meter is always used from the clubhouse step, eleven metres into their lee.”"], but: "“A belt of trees that size takes the top off a gust and does nothing at all to a calm.”" },
    ],
    clears: [
      "Being inland: “The site is twelve kilometres inland, which the model prices at a tenth of the coastal range.”",
      "The valley's line: “The valley runs across the prevailing wind, which the same model treats as making no difference at this distance.”",
    ],
    note:
      "Halving the ridge's range does land on the club's range, which makes the bowl a serious answer rather than a courtesy. What it cannot do is produce a hard floor: a bowl at half speed still reads four on a still day, and the club has never written down a four. Trees take the top off and never lift the bottom, and only the attendance answer does both.",
  },
  27: {
    story:
      "The club's find book records sixty-one four-leaf clovers from the top corner of the field and nine from everywhere else, and the corner is being fenced as a conservation plot. Four reasons have been offered and each is a real possibility. The find book records clovers found and has no column for time spent looking. The corner is where the club meets, because it is the only shaded spot and the gate is there. A log kept last summer recorded a hundred and forty searcher-hours in the corner and eleven across the rest of the field. Sixty-one finds in a hundred and forty hours is one every two and a quarter hours, against one every one and a quarter elsewhere. The ploughed part of the field was reseeded in two thousand and sixteen with a commercial white clover cultivar. That cultivar is bred for uniform three-leaflet growth and the seed house advertises it on exactly that. The corner was never ploughed and still carries the old wild strain the field was laid down with. The corner is cut once a year, in September, because no mower can turn in it. The rest of the field is cut every fortnight from April until October. A fourth leaflet sits at the top of a stem and is the first thing any mower takes off. The corner is damper, lying at the foot of the slope, and the trial beds found damp made no difference. Disturbance raises the mutation rate, and the unploughed corner is the least disturbed ground on the site.",
    q: "Is the corner really luckier? Choose one cause and prove it from the text.",
    why: [
      "a hundred and forty searcher-hours in the corner against eleven elsewhere",
      "an unploughed corner holding the wild strain, where the rest was reseeded",
      "damper ground, where the trial beds found damp made no difference",
      "one cut a year in the corner against a fortnightly cut everywhere else",
      "disturbance raising the mutation rate on the least disturbed ground there is",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“A log kept last summer recorded a hundred and forty searcher-hours in the corner and eleven across the rest of the field.”", "“Sixty-one finds in a hundred and forty hours is one every two and a quarter hours, against one every one and a quarter elsewhere.”"], but: "“That cultivar is bred for uniform three-leaflet growth and the seed house advertises it on exactly that.”" },
      { who: 1, ev: ["“That cultivar is bred for uniform three-leaflet growth and the seed house advertises it on exactly that.”", "“The corner was never ploughed and still carries the old wild strain the field was laid down with.”"], but: "“Sixty-one finds in a hundred and forty hours is one every two and a quarter hours, against one every one and a quarter elsewhere.”" },
      { who: 3, ev: ["“The rest of the field is cut every fortnight from April until October.”", "“A fourth leaflet sits at the top of a stem and is the first thing any mower takes off.”"], but: "“The corner is where the club meets, because it is the only shaded spot and the gate is there.”" },
    ],
    clears: [
      "The damper soil: “The corner is damper, lying at the foot of the slope, and the trial beds found damp made no difference.”",
      "Disturbance: “Disturbance raises the mutation rate, and the unploughed corner is the least disturbed ground on the site.”",
    ],
    note:
      "Measured by the hour the corner is the worst ground on the field, which should end the fencing proposal whichever answer wins. What is left is why the rest of the field is better per hour, and the cultivar and the mowing both answer it. Note that the mowing answer predicts the finds would appear if anybody looked in September.",
  },
  28: {
    story:
      "The site record shows four flooding incidents in the yard before two thousand and nineteen and seventy-one since, and a drainage contract worth ninety thousand pounds is being prepared. Four causes have been offered and each is real. The online estates form was introduced in January two thousand and nineteen and can be filled in from a phone in two minutes. Before that, a flood had to be reported by telephone to a county office open between ten and three. The caretaker's diary, kept since two thousand and eleven, mentions standing water between nine and fourteen times in every year of its record. The diary does not say how deep that water was or how long any of it stayed. The playground was resurfaced in two thousand and eighteen and the new asphalt tested at a two hundredth of the old infiltration rate. A yard that used to soak up what fell on it now sheds all of it towards one gully. The contractor's own figures put that change at six times the peak flow into the drain. The kerb line was laid in the same autumn, along the whole length of the western verge. It turns eleven hundred square metres of verge drainage back onto the yard, which is three times the yard's own area. Four times the catchment through a drain already at its limit floods on any ordinary shower. The bicycle store stands on a hundred and ten square metres of former grass, which is four percent of the catchment. Rainfall at the parish station has risen eight percent, which the contractor prices at under a flood a year.",
    q: "What changed in two thousand and nineteen? Prove your answer from the text.",
    why: [
      "a phone form in January 2019, replacing a call to an office open ten to three",
      "a 2018 resurfacing at a two hundredth of the old infiltration rate",
      "a hundred and ten square metres of former grass, four percent of the catchment",
      "eight percent more rainfall, priced at under a flood a year",
      "a kerb line turning eleven hundred square metres of verge back onto the yard",
    ],
    open: [0, 1, 4],
    for: [
      { who: 0, ev: ["“Before that, a flood had to be reported by telephone to a county office open between ten and three.”", "“The caretaker's diary, kept since two thousand and eleven, mentions standing water between nine and fourteen times in every year of its record.”"], but: "“The diary does not say how deep that water was or how long any of it stayed.”" },
      { who: 1, ev: ["“The playground was resurfaced in two thousand and eighteen and the new asphalt tested at a two hundredth of the old infiltration rate.”", "“The contractor's own figures put that change at six times the peak flow into the drain.”"], but: "“The caretaker's diary, kept since two thousand and eleven, mentions standing water between nine and fourteen times in every year of its record.”" },
      { who: 4, ev: ["“The kerb line was laid in the same autumn, along the whole length of the western verge.”", "“It turns eleven hundred square metres of verge drainage back onto the yard, which is three times the yard's own area.”"], but: "“A yard that used to soak up what fell on it now sheds all of it towards one gully.”" },
    ],
    clears: [
      "The bicycle store: “The bicycle store stands on a hundred and ten square metres of former grass, which is four percent of the catchment.”",
      "More rain: “Rainfall at the parish station has risen eight percent, which the contractor prices at under a flood a year.”",
    ],
    note:
      "The diary is the whole argument and the sentence after it is the whole counter-argument: nine to fourteen a year, and no record of how deep. Standing water and a flood may be two different events, and the diary cannot tell them apart. The resurfacing and the kerb both date from 2018, so if the yard did change, it changed the year before the record did.",
  },
  29: {
    story:
      "Bed four has produced the heaviest crop in each of six years and the garden club wants the other five beds rebuilt to match it. Four advantages have been named and each is genuine. Bed four stands beside the outside tap. The hose reaches bed four without being dragged and reaches bed five only if the coil is unwound across the path. A log kept last summer recorded eighty-one waterings for bed four and between nine and nineteen for the other five. Bed two was moved next to the tap in September and grew the heaviest crop this year. Bed two was also topped up in September with four barrows of the same bought compost bed four was filled with. Nothing has been added to the other four beds since the garden was laid out eleven years ago. The soil test in October read bed two and bed four alike and every other bed a third of their nitrogen. Bed four was rebuilt at the far end in September without its timber sides, which were too rotten to lift. It came fourth this year, and the club's own photographs show two chewed rows along its open edge. Every bed that has kept its sides has finished above every bed that has not, in all six years. It is the only raised bed, which the trial plots price at nine days of spring warmth. It faces south-west, and so does every bed in a garden laid out in one straight line.",
    q: "Why does bed four grow the best? Pick one cause and prove it from the log.",
    why: [
      "a hose that reaches bed four and eighty-one waterings to prove it",
      "the only raised bed, worth nine days of spring warmth in the trial plots",
      "four barrows of bought compost, and a soil test to match",
      "a south-west face shared by every bed in a straight line",
      "timber sides, and two chewed rows the year they came off",
    ],
    open: [0, 2, 4],
    for: [
      { who: 0, ev: ["“The hose reaches bed four without being dragged and reaches bed five only if the coil is unwound across the path.”", "“A log kept last summer recorded eighty-one waterings for bed four and between nine and nineteen for the other five.”"], but: "“Bed two was also topped up in September with four barrows of the same bought compost bed four was filled with.”" },
      { who: 2, ev: ["“Bed two was also topped up in September with four barrows of the same bought compost bed four was filled with.”", "“The soil test in October read bed two and bed four alike and every other bed a third of their nitrogen.”"], but: "“A log kept last summer recorded eighty-one waterings for bed four and between nine and nineteen for the other five.”" },
      { who: 4, ev: ["“Bed four was rebuilt at the far end in September without its timber sides, which were too rotten to lift.”", "“Every bed that has kept its sides has finished above every bed that has not, in all six years.”"], but: "“Bed two was moved next to the tap in September and grew the heaviest crop this year.”" },
    ],
    clears: [
      "Being raised: “It is the only raised bed, which the trial plots price at nine days of spring warmth.”",
      "Facing south-west: “It faces south-west, and so does every bed in a garden laid out in one straight line.”",
    ],
    note:
      "The swap looked like a clean experiment and it changed three things at once: the tap, the compost and the sides. Bed two gained the hose and four barrows of compost, and bed four lost the hose and its timber in the same week. Ask what a real test would look like, and somebody will say move one bed and change nothing else.",
  },
  30: {
    story:
      "The six brown hens have laid two thousand one hundred eggs between them and the six white hens nine hundred, and the school is about to buy only browns. Four reasons have been offered and each is a real difference between the two groups. The browns were bought from a commercial unit that sells its birds on at seventy-two weeks. That unit culls any bird falling below five eggs a week at the forty-week check. Every brown hen in the run is a bird that had already proved itself before the school saw it. The three whites that lay best average five point two eggs a week, which is the number the unit uses as its cut. The breed society runs a trial that raises day-old chicks of both strains side by side on the same feed. It puts the brown strain at about two and a half times the white strain's lifetime output. Two and a half times is very close to two thousand one hundred against nine hundred. The count covers eighteen months from the day both groups arrived in the run. The browns were already in lay and produced eggs in all eighteen of those months. The whites arrived as day-old chicks and did not lay their first egg until the twelfth month. Six birds laying for seven months cannot be compared with six birds laying for eighteen. They are heavier birds and their feed bill runs fifteen percent above the whites', which the trial counts as a cost. The browns arrived with a vaccination record, the whites without one, and no bird in either group has been ill.",
    q: "Why do the browns lay more? Pick one cause and prove it from the figures.",
    why: [
      "a unit that culls below five eggs a week before it sells a bird",
      "a side-by-side trial putting the strain at two and a half times the output",
      "a feed bill fifteen percent above the whites', counted as a cost",
      "a vaccination record on one side and no illness on either",
      "eighteen months of laying against seven, on the same count",
    ],
    open: [0, 1, 4],
    for: [
      { who: 0, ev: ["“That unit culls any bird falling below five eggs a week at the forty-week check.”", "“The three whites that lay best average five point two eggs a week, which is the number the unit uses as its cut.”"], but: "“It puts the brown strain at about two and a half times the white strain's lifetime output.”" },
      { who: 1, ev: ["“The breed society runs a trial that raises day-old chicks of both strains side by side on the same feed.”", "“Two and a half times is very close to two thousand one hundred against nine hundred.”"], but: "“Every brown hen in the run is a bird that had already proved itself before the school saw it.”" },
      { who: 4, ev: ["“The browns were already in lay and produced eggs in all eighteen of those months.”", "“The whites arrived as day-old chicks and did not lay their first egg until the twelfth month.”"], but: "“The three whites that lay best average five point two eggs a week, which is the number the unit uses as its cut.”" },
    ],
    clears: [
      "Eating more: “They are heavier birds and their feed bill runs fifteen percent above the whites', which the trial counts as a cost.”",
      "The vaccination record: “The browns arrived with a vaccination record, the whites without one, and no bird in either group has been ill.”",
    ],
    note:
      "The breed society's trial is the only comparison here that starts both groups as day-old chicks, which is exactly the fault the other two answers are pointing at. Eighteen months against seven already accounts for most of the gap on its own. Ask what the eggs per laying week would be, and notice that nobody in the case has worked it out.",
  },
  31: {
    story:
      "The eco club's survey reports ninety-one percent of pupils walking or cycling to school, and the travel plan has been signed off on that basis. Four reasons have been offered and each is real. The survey was handed out at the eco club's Thursday meeting and to the club's contacts in form time. It gathered a hundred and forty responses from a roll of eight hundred and ten. The club meets to campaign about transport, and joining it is a choice pupils make. The catchment is compact, and three quarters of the roll live inside a mile of the gate. The county's own travel model puts a one-mile catchment at eighty-four percent walking or cycling before anything else is done. Three quarters inside a mile is the second most compact catchment in the county. Parking at the gate and along both approach roads was removed in September under a council order. The nearest legal drop-off is now nine hundred metres away, at the far end of the park. A gate count in November found three hundred and nine arrivals by car at that drop-off, every one of whom walked the last nine hundred metres. The survey's own question asks whether a pupil walked any part of the journey. There is a safe crossing on the main road and a cycle lane marked all the way up the hill. The walking bus has run since two thousand and fourteen, and twenty-two pupils are on its register.",
    q: "Do ninety-one percent really walk? Choose one cause and prove it.",
    why: [
      "a hundred and forty responses, gathered at a club you choose to join",
      "three quarters inside a mile, which the county model puts at eighty-four percent",
      "a crossing on the main road and a cycle lane all the way up the hill",
      "a walking bus since 2014 with twenty-two on its register",
      "a drop-off nine hundred metres out, and a question that asks about any part",
    ],
    open: [0, 1, 4],
    for: [
      { who: 0, ev: ["“The survey was handed out at the eco club's Thursday meeting and to the club's contacts in form time.”", "“The club meets to campaign about transport, and joining it is a choice pupils make.”"], but: "“The county's own travel model puts a one-mile catchment at eighty-four percent walking or cycling before anything else is done.”" },
      { who: 1, ev: ["“The county's own travel model puts a one-mile catchment at eighty-four percent walking or cycling before anything else is done.”", "“Three quarters inside a mile is the second most compact catchment in the county.”"], but: "“It gathered a hundred and forty responses from a roll of eight hundred and ten.”" },
      { who: 4, ev: ["“The nearest legal drop-off is now nine hundred metres away, at the far end of the park.”", "“A gate count in November found three hundred and nine arrivals by car at that drop-off, every one of whom walked the last nine hundred metres.”"], but: "“The club meets to campaign about transport, and joining it is a choice pupils make.”" },
    ],
    clears: [
      "The crossing and cycle lane: “There is a safe crossing on the main road and a cycle lane marked all the way up the hill.”",
      "The walking bus: “The walking bus has run since two thousand and fourteen, and twenty-two pupils are on its register.”",
    ],
    note:
      "The question is the quiet trap: walked any part of the journey makes three hundred and nine car arrivals into walkers, and the figure stops being wrong and starts being useless. The county model says eighty-four percent before anything is done, which would make ninety-one almost believable. Ask what the travel plan is trying to change, and whether any of these three numbers would show it.",
  },
  32: {
    story:
      "The club's portfolio holds forty low-light photographs, every one of them sharp, and the camera is being recommended for the trip on that evidence. Four reasons have been offered and each is a genuine strength of the body. The portfolio is assembled each term from whatever members choose to submit. The card from the November evening shoot was still in the bag and held nine hundred and six frames. Two hundred and forty of them are low-light and fourteen were submitted. A count of the two hundred and forty found a hundred and ninety-one too blurred to use and thirty-five visibly noisy. Nobody deleted anything dishonestly, and the weak frames simply were not worth submitting. The file data records the stabiliser switched off on every one of the hundred and ninety-one blurred frames. It records the stabiliser switched on for all fourteen that were submitted and for every frame in the portfolio. A four stop stabiliser turns a sixth of a second into something a hand can hold, and nobody on that shoot knew it had a switch. The thirty-five noisy frames were all shot in the raw format, which bypasses the processor entirely. Every frame in the portfolio is a camera-produced file with the noise reduction applied. A rate measured on frames that switched the camera's own processing off is not a rate for this camera. Its sensor is physically large, and the blurred frames were shot on the same sensor as the sharp ones. The lens opens to one point four, and the file data shows that aperture on every frame of the shoot.",
    q: "Is the camera really that good in the dark? Prove your answer.",
    why: [
      "a portfolio built from whatever anybody chose to submit",
      "a large sensor, shared by the blurred frames and the sharp ones",
      "an aperture of one point four on every frame of the shoot",
      "a stabiliser switched off on all hundred and ninety-one blurred frames",
      "thirty-five noisy frames shot raw, with the processor bypassed",
    ],
    open: [0, 3, 4],
    for: [
      { who: 0, ev: ["“The portfolio is assembled each term from whatever members choose to submit.”", "“A count of the two hundred and forty found a hundred and ninety-one too blurred to use and thirty-five visibly noisy.”"], but: "“The file data records the stabiliser switched off on every one of the hundred and ninety-one blurred frames.”" },
      { who: 3, ev: ["“The file data records the stabiliser switched off on every one of the hundred and ninety-one blurred frames.”", "“It records the stabiliser switched on for all fourteen that were submitted and for every frame in the portfolio.”"], but: "“Nobody deleted anything dishonestly, and the weak frames simply were not worth submitting.”" },
      { who: 4, ev: ["“The thirty-five noisy frames were all shot in the raw format, which bypasses the processor entirely.”", "“Every frame in the portfolio is a camera-produced file with the noise reduction applied.”"], but: "“Two hundred and forty of them are low-light and fourteen were submitted.”" },
    ],
    clears: [
      "The large sensor: “Its sensor is physically large, and the blurred frames were shot on the same sensor as the sharp ones.”",
      "The fast lens: “The lens opens to one point four, and the file data shows that aperture on every frame of the shoot.”",
    ],
    note:
      "Every failure on that card has a setting attached to it, which makes the six percent a rate for the club rather than for the camera. That is a real distinction and also a convenient one, and a class should be asked which it is here. Whatever they decide, the portfolio still cannot answer the question, because it contains no failures at all.",
  },
  33: {
    story:
      "The compost trial reports tray C averaging thirty-one centimetres against tray A's nineteen, and the school is switching to the brand in tray C. Four advantages have been offered and each is real. The method sheet says to thin each tray to the strongest twelve seedlings at two weeks. Tray C was thinned on the fourteenth day as written, and trays A, B and D were not thinned at all. Tray C's average is the average of twelve chosen plants and tray A's is the average of all forty-one that came up. The twelve tallest plants in tray A average twenty-nine centimetres. The laboratory's report gives tray C at four times tray A's nitrogen in milligrams per litre. The fifth quoted on the summary sheet came from a different test on a different sample. Four times the nitrogen is the one figure here big enough to move a seedling twelve centimetres. A hundred and twenty seeds were sown in every tray and a hundred and six came up in tray C. Forty-one came up in tray A, and damping-off was recorded on the unpasteurised trays in week one. Pasteurising is what stops damping-off, and a seedling that survives it is a seedling that was never checked. Tray C scores better on the laboratory's water-holding measure, and every tray was watered to field capacity daily. Its texture is finer, which a small seed is said to prefer, and all four trays were sown the same way at the same depth.",
    q: "Why is tray C taller? Choose one cause and prove it from the method.",
    why: [
      "twelve chosen plants in tray C against all forty-one in tray A",
      "four times the nitrogen in milligrams per litre, not the fifth on the summary",
      "a water-holding score, on trays all watered to field capacity daily",
      "a finer texture, on four trays sown the same way at the same depth",
      "damping-off on the unpasteurised trays in week one",
    ],
    open: [0, 1, 4],
    for: [
      { who: 0, ev: ["“Tray C was thinned on the fourteenth day as written, and trays A, B and D were not thinned at all.”", "“The twelve tallest plants in tray A average twenty-nine centimetres.”"], but: "“The laboratory's report gives tray C at four times tray A's nitrogen in milligrams per litre.”" },
      { who: 1, ev: ["“The laboratory's report gives tray C at four times tray A's nitrogen in milligrams per litre.”", "“The fifth quoted on the summary sheet came from a different test on a different sample.”"], but: "“The twelve tallest plants in tray A average twenty-nine centimetres.”" },
      { who: 4, ev: ["“Forty-one came up in tray A, and damping-off was recorded on the unpasteurised trays in week one.”", "“Pasteurising is what stops damping-off, and a seedling that survives it is a seedling that was never checked.”"], but: "“A hundred and twenty seeds were sown in every tray and a hundred and six came up in tray C.”" },
    ],
    clears: [
      "Holding water: “Tray C scores better on the laboratory's water-holding measure, and every tray was watered to field capacity daily.”",
      "The finer texture: “Its texture is finer, which a small seed is said to prefer, and all four trays were sown the same way at the same depth.”",
    ],
    note:
      "Twenty-nine against thirty-one is the comparison the trial should have reported, and it leaves almost nothing for the nitrogen to explain. The pasteurising answer is the deepest one, because damping-off culls the weak and leaves tray A's forty-one already selected in the opposite direction. Two filters, pulling the same number two different ways.",
  },
  34: {
    story:
      "Three years of till data put vanilla at sixty-one percent of ice cream sales, and the kitchen is cutting the other flavours. Four reasons have been offered and each is fair. The freezer in the servery holds two tubs. One is permanently vanilla by standing instruction, because it is the safe choice. The second rotates through chocolate, strawberry, mint and toffee, one at a time. A stock audit shows vanilla available on every one of the five hundred and seventy serving days. Each of the other four flavours was available on between a hundred and ten and a hundred and thirty days. Measured per day available, vanilla sells eighty-one portions and toffee sells ninety-four. The kitchen serves a hot pudding on four hundred and ninety of those five hundred and seventy days. The catering standing order allows only vanilla to be served alongside a hot pudding. On a day with a hot pudding the second tub is sold as a separate item at a separate price. Vanilla is priced at forty pence and every other flavour at a pound ten, because the rest come in single-serve tubs. The till data shows ninety-one percent of pupils taking the cheapest item on whichever counter they use. A seventy pence gap on a school counter decides more than a flavour ever does. It is the flavour least likely to be refused, which the kitchen has never put a number to. It is chosen most often by the youngest pupils, who are a fifth of the roll rather than the largest group.",
    q: "Is vanilla really the favourite? Pick one cause and prove it from the till data.",
    why: [
      "one tub permanently vanilla, with four flavours sharing the second",
      "a standing order allowing only vanilla beside a hot pudding",
      "a flavour nobody refuses, which the kitchen has never put a number to",
      "forty pence against a pound ten, with nine in ten taking the cheapest",
      "the youngest pupils' choice, and a fifth of the roll rather than the largest group",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“A stock audit shows vanilla available on every one of the five hundred and seventy serving days.”", "“Each of the other four flavours was available on between a hundred and ten and a hundred and thirty days.”"], but: "“Vanilla is priced at forty pence and every other flavour at a pound ten, because the rest come in single-serve tubs.”" },
      { who: 1, ev: ["“The kitchen serves a hot pudding on four hundred and ninety of those five hundred and seventy days.”", "“The catering standing order allows only vanilla to be served alongside a hot pudding.”"], but: "“Measured per day available, vanilla sells eighty-one portions and toffee sells ninety-four.”" },
      { who: 3, ev: ["“Vanilla is priced at forty pence and every other flavour at a pound ten, because the rest come in single-serve tubs.”", "“The till data shows ninety-one percent of pupils taking the cheapest item on whichever counter they use.”"], but: "“Each of the other four flavours was available on between a hundred and ten and a hundred and thirty days.”" },
    ],
    clears: [
      "Being nobody's least favourite: “It is the flavour least likely to be refused, which the kitchen has never put a number to.”",
      "The youngest buyers: “It is chosen most often by the youngest pupils, who are a fifth of the roll rather than the largest group.”",
    ],
    note:
      "Eighty-one against ninety-four per day available is the number that answers the question, and it says toffee outsells vanilla whenever anybody can buy it. The other two answers explain why vanilla is on the counter at all, which is the kitchen's own decision three years back. Nothing here is a measurement of what pupils like.",
  },
  35: {
    story:
      "The appeal's figures show Year Eleven giving four hundred and ten pounds and no other year reaching ninety, and Year Eleven is to be held up as an example in assembly. Four reasons have been offered and each is plausible. Ribbons were offered to Year Eleven in form time, at the desk, by a tutor, with a tin passed along the row. Every other year group was told in assembly that ribbons could be collected from the office at break. A trial this year took the tin into four Year Eight forms in exactly the Year Eleven way. Those four forms gave a hundred and sixty-eight pounds in a week, from a year group that gave sixty-one pounds in the whole of last year's appeal. The cake stall took three hundred and forty-one pounds of the four hundred and ten over two lunchtimes. The appeal's figures count stall takings as giving, which no other year group had a stall to count. A cake stall sells cake, and most of what it takes is the price of a bun. The two Year Eleven tutors are the charity's county organisers and arranged a matched-giving scheme. Sixty-nine pounds of the four hundred and ten came from the tin, and half of that sixty-nine is the charity's match. Nobody offered a match to any other year group, or told them one existed. Year Eleven has the oldest pupils, who more often have money on them, which the office prices at a tenth. Leavers' years do give more to school appeals, by about a fifth on the office's own record.",
    q: "Why did Year Eleven give most? Choose one cause and prove it.",
    why: [
      "a tin passed along the row against a walk to the office at break",
      "the oldest pupils, with money on them, priced at a tenth",
      "a cake stall taking three hundred and forty-one of the four hundred and ten",
      "two tutors who are the charity's county organisers, and a match nobody else got",
      "a leavers' year, worth about a fifth on the office's own record",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“A trial this year took the tin into four Year Eight forms in exactly the Year Eleven way.”", "“Those four forms gave a hundred and sixty-eight pounds in a week, from a year group that gave sixty-one pounds in the whole of last year's appeal.”"], but: "“The cake stall took three hundred and forty-one pounds of the four hundred and ten over two lunchtimes.”" },
      { who: 2, ev: ["“The cake stall took three hundred and forty-one pounds of the four hundred and ten over two lunchtimes.”", "“The appeal's figures count stall takings as giving, which no other year group had a stall to count.”"], but: "“A cake stall sells cake, and most of what it takes is the price of a bun.”" },
      { who: 3, ev: ["“The two Year Eleven tutors are the charity's county organisers and arranged a matched-giving scheme.”", "“Sixty-nine pounds of the four hundred and ten came from the tin, and half of that sixty-nine is the charity's match.”"], but: "“Nobody offered a match to any other year group, or told them one existed.”" },
    ],
    clears: [
      "Older pupils: “Year Eleven has the oldest pupils, who more often have money on them, which the office prices at a tenth.”",
      "Being the leavers: “Leavers' years do give more to school appeals, by about a fifth on the office's own record.”",
    ],
    note:
      "Thirty-four pounds fifty is what Year Eleven actually put in a tin, once the stall and the match come out, and that is below three other year groups. The assembly is about to praise a year group for a cake stall and a scheme its tutors arranged. The Year Eight trial says the whole appeal is about who gets asked, and nobody has asked the other four years yet.",
  },
  36: {
    story:
      "Two hundred balloons were released with reply cards and sixty-three came back. Fifty-eight of the sixty-three were found in towns and villages, and the report concludes that the prevailing wind carries balloons towards settlements. Four reasons have been offered and each sounds sensible. A card can only come back if a person finds the balloon, reads the card, and posts it. Towns hold most of the people, so towns are where found balloons are found. The moorland downwind of the launch field holds four houses in eleven kilometres. The club walked a measured transect across that moorland three days after the launch and recovered twenty-nine balloons. A hundred and thirty-seven balloons were never heard of again, and the moor is the only place anyone has looked. Every one of the twenty-nine on the moor was still inflated and lying loose on open ground. Fifty-one of the fifty-eight found in towns were caught in a tree, a gutter or a wire. A balloon still inflated is a balloon that has not finished travelling, and a caught balloon has. The wind on the launch day came from the bearing that puts the town directly downwind of the field. The met record gives that bearing on three hundred and one days of the year at this station. A release made on almost any day of the year would send its balloons the same way. Towns sit in valleys and the valley wind funnels along them, which the met record treats as the same bearing. Warm air rising over a town affects how a light object descends, which nobody has measured here.",
    q: "Why were fifty-eight found in towns? Pick one cause and prove it.",
    why: [
      "a card that comes back only if somebody finds it and posts it",
      "a valley wind funnelling along towns, on the same bearing as the met record",
      "trees, gutters and wires holding fifty-one of the fifty-eight",
      "a launch day bearing the met record gives on three hundred and one days",
      "warm air over a town, which nobody here has measured",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“Towns hold most of the people, so towns are where found balloons are found.”", "“A hundred and thirty-seven balloons were never heard of again, and the moor is the only place anyone has looked.”"], but: "“Fifty-one of the fifty-eight found in towns were caught in a tree, a gutter or a wire.”" },
      { who: 2, ev: ["“Every one of the twenty-nine on the moor was still inflated and lying loose on open ground.”", "“Fifty-one of the fifty-eight found in towns were caught in a tree, a gutter or a wire.”"], but: "“The moorland downwind of the launch field holds four houses in eleven kilometres.”" },
      { who: 3, ev: ["“The wind on the launch day came from the bearing that puts the town directly downwind of the field.”", "“The met record gives that bearing on three hundred and one days of the year at this station.”"], but: "“The club walked a measured transect across that moorland three days after the launch and recovered twenty-nine balloons.”" },
    ],
    clears: [
      "The valley wind: “Towns sit in valleys and the valley wind funnels along them, which the met record treats as the same bearing.”",
      "Warm air over a town: “Warm air rising over a town affects how a light object descends, which nobody has measured here.”",
    ],
    note:
      "Twenty-nine balloons on eleven kilometres of moor that nobody reported is the fact the report does not have, and it was found by walking. The catching answer is the strongest rival because it would make towns genuinely the end of a balloon's journey rather than merely the place with people in it. The last case of the set ends where the whole grade began: a hundred and thirty-seven balloons are still missing, and the only place anyone looked turned out to be full of them.",
  },
};
