/**
 * Grade 11, the debate version of each case. See scripts/mysteries/g5.debate.mjs
 * for what these files are and what the gate holds them to.
 *
 * The ordinary grade 11 case makes every suspect genuinely guilty and asks
 * which one is big enough. Four causes are real, small and measured, and the
 * fifth is the right size for the number in front of you.
 *
 * These keep the arithmetic and change the sizes. Three suspects now carry a
 * quantity large enough to account for the whole gap on its own, so the class
 * cannot win by adding up the small ones. They have to argue about which
 * measurement to trust, where it was taken, and what it was measuring.
 */
export const DEBATES = {
  1: {
    story:
      "The stocktake says the library holds fourteen hundred fewer books than the catalogue claims, and four explanations are already in circulation. During the refit in August a contractor cleared two bays of withdrawn stock into a skip. Nobody marked those books as withdrawn, because marking them was the librarian's job and she was on leave. The two bays held between six and seven hundred books on each of their eleven shelves. The loans system was migrated to a new server in July and the outstanding-loan table did not come across. Nine hundred and forty books issued before July show in the new system as returned. A book the system thinks is back on the shelf is a book the stocktake expects to find. The theft log counts only the losses a member of staff reported in writing. A week-long audit of the two unstaffed study rooms in May watched between thirty and forty books leave unissued. Thirty-nine weeks at that rate is somewhere between eleven and fifteen hundred books a year. The shelf survey covered every room and turned up forty-one strays, all of them still inside the building. A single shelf was tallied twice on the second morning, which adds thirty to the count and narrows the gap rather than widening it.",
    q: "Where did fourteen hundred books go? Pick one and prove it with a number.",
    why: [
      "two bays of withdrawn stock into a skip, unmarked in the catalogue",
      "nine hundred and forty pre-July loans showing as returned",
      "forty-one strays, every one of them still inside the building",
      "thirty to forty a week leaving the unstaffed study rooms",
      "one shelf tallied twice, which narrows the gap rather than widening it",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“During the refit in August a contractor cleared two bays of withdrawn stock into a skip.”", "“The two bays held between six and seven hundred books on each of their eleven shelves.”"], but: "“Nine hundred and forty books issued before July show in the new system as returned.”" },
      { who: 1, ev: ["“The loans system was migrated to a new server in July and the outstanding-loan table did not come across.”", "“A book the system thinks is back on the shelf is a book the stocktake expects to find.”"], but: "“The two bays held between six and seven hundred books on each of their eleven shelves.”" },
      { who: 3, ev: ["“A week-long audit of the two unstaffed study rooms in May watched between thirty and forty books leave unissued.”", "“Thirty-nine weeks at that rate is somewhere between eleven and fifteen hundred books a year.”"], but: "“The theft log counts only the losses a member of staff reported in writing.”" },
    ],
    clears: [
      "Misshelved books: “The shelf survey covered every room and turned up forty-one strays, all of them still inside the building.”",
      "The double-counted shelf: “A single shelf was tallied twice on the second morning, which adds thirty to the count and narrows the gap rather than widening it.”",
    ],
    note:
      "Three numbers now reach fourteen hundred and only one of them was actually counted. The skip is an estimate of shelves, the migration is a database figure, and the theft number is one week scaled up by thirty-nine. Ask which of those three a student would bet on, and why a week in May is the weakest of them.",
  },
  2: {
    story:
      "The kitchen's bread order has gone from ninety loaves a week to a hundred and fifty, and the business manager wants to know who is eating it. The supplier changed its standard loaf in August from eight hundred grams to four hundred. Ninety of the old loaves was seventy-two kilograms of bread, and a hundred and fifty of the new ones is sixty. On that arithmetic the kitchen is buying more loaves and less bread than it did last year. The sandwich option opened in September and now sells a hundred and ten rounds a day. The kitchen measured that at sixty-two loaves a week, which is almost exactly the rise in the order. The bread rack was moved in August to the wall above the dishwasher vent. Steam from that vent softens the crusts, and the kitchen now bins thirty to thirty-five loaves a week as unusable. A loaf thrown away has to be ordered twice, once to be wasted and once to be eaten. The twelve pupils who joined in September account for about four loaves a week between them. The price per loaf fell in August, which changes what the school pays and not what it orders.",
    q: "Why has the bread order risen by sixty loaves? Prove your answer with a number.",
    why: [
      "a standard loaf halved in August, from eight hundred grams to four hundred",
      "twelve new pupils, worth about four loaves a week between them",
      "a hundred and ten rounds a day, measured at sixty-two loaves a week",
      "a rack moved over the dishwasher vent, binning thirty-five a week",
      "a price that fell in August, changing what the school pays",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“The supplier changed its standard loaf in August from eight hundred grams to four hundred.”", "“Ninety of the old loaves was seventy-two kilograms of bread, and a hundred and fifty of the new ones is sixty.”"], but: "“The kitchen measured that at sixty-two loaves a week, which is almost exactly the rise in the order.”" },
      { who: 2, ev: ["“The sandwich option opened in September and now sells a hundred and ten rounds a day.”", "“The kitchen measured that at sixty-two loaves a week, which is almost exactly the rise in the order.”"], but: "“On that arithmetic the kitchen is buying more loaves and less bread than it did last year.”" },
      { who: 3, ev: ["“The bread rack was moved in August to the wall above the dishwasher vent.”", "“Steam from that vent softens the crusts, and the kitchen now bins thirty to thirty-five loaves a week as unusable.”"], but: "“The sandwich option opened in September and now sells a hundred and ten rounds a day.”" },
    ],
    clears: [
      "Twelve new pupils: “The twelve pupils who joined in September account for about four loaves a week between them.”",
      "The price change: “The price per loaf fell in August, which changes what the school pays and not what it orders.”",
    ],
    note:
      "Three causes each cover the whole sixty, which means at least two of them are double counting something. Sixty-two sandwich loaves and thirty-five wasted loaves cannot both be new on top of the old ninety. The loaf size answer is the only one that explains why the bread went down while the loaves went up.",
  },
  3: {
    story:
      "The stock cupboard issued nine hundred pencils last year and three thousand this year, for a school that has barely changed size. The electric sharpener was installed in September beside the cupboard. A hand sharpener takes about a millimetre off a pencil and the electric one takes four before it stops. A pencil that used to last nine weeks now lasts three, and three times nine hundred is twenty-seven hundred. Breakages were counted again in March and ran at eleven a day across the school. Every broken pencil is swapped at the cupboard for a whole one that same morning. A hundred and ninety school days at eleven a day is just over two thousand pencils. Pupils take pencils home and the February sample found twenty-two school pencils in thirty bags. Six hundred bags at that rate hold about four hundred and forty pencils at any moment. The cupboard has refilled the school five times since September, and almost none of them come back. Forty more pupils joined, seven percent of six hundred, worth about sixty-three extra pencils at the old rate. The cupboard now issues by the box of twelve, which changes how pencils leave the shelf and not how fast they are used.",
    q: "Why did pencil use triple? Choose one cause and prove it with the arithmetic.",
    why: [
      "an electric sharpener taking four millimetres where a hand one takes about one",
      "forty more pupils, worth about sixty-three pencils at the old rate",
      "eleven breakages a day, each swapped for a whole pencil",
      "twenty-two school pencils in thirty bags, and five refills since September",
      "issuing by the box of twelve instead of singly",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“The electric sharpener was installed in September beside the cupboard.”", "“A pencil that used to last nine weeks now lasts three, and three times nine hundred is twenty-seven hundred.”"], but: "“A hundred and ninety school days at eleven a day is just over two thousand pencils.”" },
      { who: 2, ev: ["“Breakages were counted again in March and ran at eleven a day across the school.”", "“A hundred and ninety school days at eleven a day is just over two thousand pencils.”"], but: "“A hand sharpener takes about a millimetre off a pencil and the electric one takes four before it stops.”" },
      { who: 3, ev: ["“Pupils take pencils home and the February sample found twenty-two school pencils in thirty bags.”", "“The cupboard has refilled the school five times since September, and almost none of them come back.”"], but: "“Six hundred bags at that rate hold about four hundred and forty pencils at any moment.”" },
    ],
    clears: [
      "Forty more pupils: “Forty more pupils joined, seven percent of six hundred, worth about sixty-three extra pencils at the old rate.”",
      "Issuing by the box: “The cupboard now issues by the box of twelve, which changes how pencils leave the shelf and not how fast they are used.”",
    ],
    note:
      "A sharpener that eats four millimetres is also a sharpener that snaps points, so breakages at eleven a day may be the electric answer wearing a different coat. That is the question worth putting: are these three separate causes, or one cause measured three ways? Nothing in the text settles it, and saying so is the strongest answer available.",
  },
  4: {
    story:
      "The school orchard picked four hundred kilograms last autumn and ninety this one, and four causes have been proposed by four different people. The weather station logged minus three degrees on the night of the twenty-second of April. The trees were in full flower that night, and a frost at full flower kills the flowers outright. No flower means no fruit at all from that tree, not a reduced crop. The two trees against the south wall flower a week later than the rest, and they carried most of the ninety kilograms. The orchard records show the last pruning was six years ago, not three as the caretaker remembered. The county guide puts six unpruned years at seventy percent of yield, and seventy percent of four hundred is two hundred and eighty. Last autumn's four hundred kilograms was the heaviest crop this orchard has ever recorded. A tree that crops that hard sets almost no fruit buds for the year after, which is what biennial cropping means. The guide puts the off year of a swing that extreme at about a fifth of the on year. The hedge shades two of the eleven trees, which at the very worst costs two elevenths of a crop. Wasp damage was counted on a sample of two hundred apples and reached five percent of them.",
    q: "What took three quarters of the crop? Pick one cause and show the numbers.",
    why: [
      "minus three on the twenty-second of April, with the trees in full flower",
      "a hedge over two of the eleven trees, worth two elevenths at worst",
      "five percent of a two hundred apple sample damaged by wasps",
      "six unpruned years, which the guide puts at seventy percent of yield",
      "a record four hundred kilograms last autumn, and a fifth of that in an off year",
    ],
    open: [0, 3, 4],
    for: [
      { who: 0, ev: ["“The weather station logged minus three degrees on the night of the twenty-second of April.”", "“The two trees against the south wall flower a week later than the rest, and they carried most of the ninety kilograms.”"], but: "“The orchard records show the last pruning was six years ago, not three as the caretaker remembered.”" },
      { who: 3, ev: ["“The orchard records show the last pruning was six years ago, not three as the caretaker remembered.”", "“The county guide puts six unpruned years at seventy percent of yield, and seventy percent of four hundred is two hundred and eighty.”"], but: "“No flower means no fruit at all from that tree, not a reduced crop.”" },
      { who: 4, ev: ["“Last autumn's four hundred kilograms was the heaviest crop this orchard has ever recorded.”", "“The guide puts the off year of a swing that extreme at about a fifth of the on year.”"], but: "“The two trees against the south wall flower a week later than the rest, and they carried most of the ninety kilograms.”" },
    ],
    clears: [
      "The neighbour's hedge: “The hedge shades two of the eleven trees, which at the very worst costs two elevenths of a crop.”",
      "Wasps: “Wasp damage was counted on a sample of two hundred apples and reached five percent of them.”",
    ],
    note:
      "Six unpruned years and a record crop are both slow causes, and the frost is one night. The south wall trees are the fact that only the frost explains, because a late flowering is no protection at all against bad pruning or an off year. That single sentence is worth more than either percentage, and a class should be made to notice why.",
  },
  5: {
    story:
      "Noor's five-kilometre ride to school has gone from eighteen minutes to thirty-one, and she has four theories. The rear brake was adjusted in March and the pad has sat against the rim ever since. A wheel lifted off the ground and spun by hand stops in two seconds, where a free wheel spins for forty. A brake that never lets go is working against her for every metre of the ride. The rear tyre reads twelve on the gauge against the sixty printed on its wall. The club's rolling tests put a tyre at a fifth of its pressure at nine to twelve minutes over five kilometres. A tyre that soft also squirms in every corner and on every bump she takes. The detour was remeasured on the ground at two point eight kilometres, not the six hundred metres taken off the map. All of that two point eight climbs the hill out of the village rather than running flat. Eleven minutes is what she takes over that hill on the one morning she timed it. The new lights at the bridge were timed over a week and added forty seconds on average. There has been a headwind on most mornings this month, worth a minute at most on an exposed road.",
    q: "What is taking the extra thirteen minutes? Prove it with a number.",
    why: [
      "a pad against the rim since March, stopping a spun wheel in two seconds",
      "lights at the bridge, timed at forty seconds on average",
      "a tyre reading twelve against the sixty on its wall",
      "a detour remeasured at two point eight kilometres, all of it uphill",
      "a headwind worth a minute at most on an exposed road",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“The rear brake was adjusted in March and the pad has sat against the rim ever since.”", "“A wheel lifted off the ground and spun by hand stops in two seconds, where a free wheel spins for forty.”"], but: "“Eleven minutes is what she takes over that hill on the one morning she timed it.”" },
      { who: 2, ev: ["“The rear tyre reads twelve on the gauge against the sixty printed on its wall.”", "“The club's rolling tests put a tyre at a fifth of its pressure at nine to twelve minutes over five kilometres.”"], but: "“A brake that never lets go is working against her for every metre of the ride.”" },
      { who: 3, ev: ["“The detour was remeasured on the ground at two point eight kilometres, not the six hundred metres taken off the map.”", "“Eleven minutes is what she takes over that hill on the one morning she timed it.”"], but: "“The rear tyre reads twelve on the gauge against the sixty printed on its wall.”" },
    ],
    clears: [
      "The new traffic lights: “The new lights at the bridge were timed over a week and added forty seconds on average.”",
      "The headwind: “There has been a headwind on most mornings this month, worth a minute at most on an exposed road.”",
    ],
    note:
      "Three answers that each cover thirteen minutes cannot all be true, because the ride would then take an hour. Somebody has to argue that two of these measurements are measuring the same slow ride from different ends. The eleven minutes over the hill was timed once, and once is the weakest number in the case.",
  },
  6: {
    story:
      "The ninety-litre class tank drops nine litres a week, and the log carries four suggestions from four different weeks. The hose from the external filter weeps where it joins the canister inside the cabinet. The towel under that joint weighs one point one kilograms dry and two point four when it is changed each morning. That is one point three litres a day, which is nine litres a week. The tank lid was taken off in September and the room's dehumidifier has run beside it since. An open bowl of the same surface area, left beside the tank with the lid off, lost seven and a half litres in seven days. Dry moving air takes water off an open surface several times faster than still room air does. The filter outlet was raised in September and now falls fifteen centimetres onto the water. The cabinet top behind the tank is wet every morning and the wall above it is marked to a height of thirty centimetres. Water thrown onto a shelf and a wall never goes back into the tank. The gravel and ornaments were topped up in September, and a one-off soak cannot repeat itself every week. The eleven small fish push water aside and have never once removed any.",
    q: "Where are the nine litres going? Choose one and prove it with the figures.",
    why: [
      "a towel gaining one point three kilograms a day under the hose joint",
      "a lid off since September and a dehumidifier running beside the tank",
      "an outlet raised in September, marking the wall to thirty centimetres",
      "a one-off soak in September that cannot repeat itself weekly",
      "eleven small fish, which push water aside and remove none",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The towel under that joint weighs one point one kilograms dry and two point four when it is changed each morning.”", "“That is one point three litres a day, which is nine litres a week.”"], but: "“An open bowl of the same surface area, left beside the tank with the lid off, lost seven and a half litres in seven days.”" },
      { who: 1, ev: ["“The tank lid was taken off in September and the room's dehumidifier has run beside it since.”", "“An open bowl of the same surface area, left beside the tank with the lid off, lost seven and a half litres in seven days.”"], but: "“That is one point three litres a day, which is nine litres a week.”" },
      { who: 2, ev: ["“The filter outlet was raised in September and now falls fifteen centimetres onto the water.”", "“The cabinet top behind the tank is wet every morning and the wall above it is marked to a height of thirty centimetres.”"], but: "“Dry moving air takes water off an open surface several times faster than still room air does.”" },
    ],
    clears: [
      "The gravel: “The gravel and ornaments were topped up in September, and a one-off soak cannot repeat itself every week.”",
      "The fish: “The eleven small fish push water aside and have never once removed any.”",
    ],
    note:
      "The towel is a weighed number and the bowl is a weighed number, and together they are more than the tank loses. That is the signal that something is being counted twice, and the likeliest answer is that the splashing wets the towel. A class that notices nine plus seven and a half is greater than nine has done the real work.",
  },
  7: {
    story:
      "Assembly measured sixty-six decibels last year and seventy-eight this year, and four changes have been offered to explain it. The refit took out the full-length curtains and the carpet at the back and put down a hard floor. Reverberation time in the empty hall has gone from nought point nine seconds to two point six. In a room that holds its sound for nearly three seconds, every voice is still arriving while the next one starts. The new public address system was measured at eighty-two decibels a metre from the speaker, where the old one gave seventy. Its volume preset was left at maximum when the contractor handed it over in August. Twelve decibels is exactly the difference between seventy and eighty-two. The ceiling fan was replaced in the same refit with a larger three-speed unit. Tested alone in the empty hall on its top speed it reads seventy-six decibels. The caretaker has run it on top speed through every assembly since the hot week in September. Thirty more children come to assembly, and doubling a crowd buys three decibels, so thirty added to three hundred is less than half a decibel. The plastic chairs squeak, but a squeak is a brief sharp sound and not a lift in the whole level.",
    q: "Why is assembly twelve decibels louder? Pick one cause and show the numbers.",
    why: [
      "curtains, carpet and a soft floor gone, with reverberation at two point six seconds",
      "thirty added to three hundred, worth less than half a decibel",
      "a new system reading eighty-two a metre where the old gave seventy",
      "a larger fan reading seventy-six alone, run on top speed every assembly",
      "plastic chairs that squeak briefly rather than lifting the level",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“Reverberation time in the empty hall has gone from nought point nine seconds to two point six.”", "“In a room that holds its sound for nearly three seconds, every voice is still arriving while the next one starts.”"], but: "“Twelve decibels is exactly the difference between seventy and eighty-two.”" },
      { who: 2, ev: ["“The new public address system was measured at eighty-two decibels a metre from the speaker, where the old one gave seventy.”", "“Twelve decibels is exactly the difference between seventy and eighty-two.”"], but: "“The refit took out the full-length curtains and the carpet at the back and put down a hard floor.”" },
      { who: 3, ev: ["“The ceiling fan was replaced in the same refit with a larger three-speed unit.”", "“Tested alone in the empty hall on its top speed it reads seventy-six decibels.”"], but: "“Its volume preset was left at maximum when the contractor handed it over in August.”" },
    ],
    clears: [
      "Thirty more children: “Thirty more children come to assembly, and doubling a crowd buys three decibels, so thirty added to three hundred is less than half a decibel.”",
      "The new chairs: “The plastic chairs squeak, but a squeak is a brief sharp sound and not a lift in the whole level.”",
    ],
    note:
      "A twelve decibel difference at the speaker is not a twelve decibel difference in the room, and that is the trap the PA answer walks into. The fan at seventy-six would be near the whole measurement on its own, which should make a class suspicious rather than satisfied. Ask what the sixty-six was measured with, and where the meter stood.",
  },
  8: {
    story:
      "The yard floods to a depth of ten centimetres in any heavy rain, and leaves have been blamed for three autumns. The new sports hall roof was finished in July and plumbed into the same downpipe. The drain itself is a hundred millimetre pipe, which the manufacturer rates at two thousand litres an hour. Three hundred square metres of original roof taking thirty millimetres is nine thousand litres in one hour. The new roof adds a hundred and eighty square metres, which is another five thousand four hundred litres in the same hour. The gutter guards fitted in September are the mesh type, rated by their maker for ten millimetres of rain an hour. Rain arriving three times faster than that overshoots a mesh instead of passing through it. Water that overshoots a gutter lands in the yard and never reaches the drain at all. Thirty millimetres in an hour is a one-in-forty-year rainfall for this town. The yard has never once flooded in a storm smaller than twenty millimetres an hour. The gully was rodded and cleared the morning before the last storm and the yard still went under. The sycamores drop about twenty-five kilograms of litter each, which is a slow nuisance and not an hour's worth of water.",
    q: "Why does the yard flood? Choose one cause and prove it with the figures.",
    why: [
      "a second roof of a hundred and eighty square metres on the same downpipe",
      "a gully rodded clear the morning before the storm",
      "twenty-five kilograms of litter a tree, which is slow rather than sudden",
      "mesh guards rated for ten millimetres an hour taking thirty",
      "a one-in-forty-year hour of rain, where twenty millimetres has never flooded it",
    ],
    open: [0, 3, 4],
    for: [
      { who: 0, ev: ["“The new sports hall roof was finished in July and plumbed into the same downpipe.”", "“The new roof adds a hundred and eighty square metres, which is another five thousand four hundred litres in the same hour.”"], but: "“The yard has never once flooded in a storm smaller than twenty millimetres an hour.”" },
      { who: 3, ev: ["“The gutter guards fitted in September are the mesh type, rated by their maker for ten millimetres of rain an hour.”", "“Rain arriving three times faster than that overshoots a mesh instead of passing through it.”"], but: "“The drain itself is a hundred millimetre pipe, which the manufacturer rates at two thousand litres an hour.”" },
      { who: 4, ev: ["“Thirty millimetres in an hour is a one-in-forty-year rainfall for this town.”", "“The yard has never once flooded in a storm smaller than twenty millimetres an hour.”"], but: "“The new sports hall roof was finished in July and plumbed into the same downpipe.”" },
    ],
    clears: [
      "Leaves in the gully: “The gully was rodded and cleared the morning before the last storm and the yard still went under.”",
      "The sycamores: “The sycamores drop about twenty-five kilograms of litter each, which is a slow nuisance and not an hour's worth of water.”",
    ],
    note:
      "Nine thousand litres into a two thousand litre pipe already floods, which means the original roof alone is over the limit and the new one is not needed to explain it. That makes the storm answer much stronger than it looks. Ask whether a yard that only floods above twenty millimetres is a yard with a drainage problem or a yard with a weather problem.",
  },
  9: {
    story:
      "The competition pumpkin reached sixty kilograms when the seed packet promises two hundred, and four growers have offered four reasons. The main vine was cut through by a mower on the twenty-ninth of July, forty days in. A pumpkin is fed by its leaves, and everything they make travels to the fruit along that one vine. Before the cut it was drawing on about four hundred leaves and afterwards on the six beyond the break. The fruit measured eleven kilograms a day in July and under one kilogram a day in August. The June soil test was taken from the top spit, where the spring feed was still sitting. A second test in August, taken at root depth, came back at a tenth of the potassium a fruiting pumpkin needs. A fruit cannot swell past what its roots can lift, however many leaves are feeding it. The neighbour's leylandii reached full height in May and the patch now gets three hours of direct sun. The growers' table puts three hours of sun at about a third of a full yield, which is sixty-six kilograms. Ninety litres a day against a recommended eighty is more water than needed, and extra water swells a fruit. It was pollinated on the eleventh of June, four days late, which the guide prices at about a week of growing time.",
    q: "Why did the pumpkin stop at sixty kilograms? Prove it with a number.",
    why: [
      "a vine cut on the twenty-ninth of July, leaving six leaves of four hundred",
      "ninety litres a day against eighty, which swells a fruit rather than starving it",
      "a root-depth test showing a tenth of the potassium a fruiting plant needs",
      "four days late at pollination, worth about a week of growing time",
      "three hours of sun since May, which the table puts at a third of a yield",
    ],
    open: [0, 2, 4],
    for: [
      { who: 0, ev: ["“The main vine was cut through by a mower on the twenty-ninth of July, forty days in.”", "“The fruit measured eleven kilograms a day in July and under one kilogram a day in August.”"], but: "“The growers' table puts three hours of sun at about a third of a full yield, which is sixty-six kilograms.”" },
      { who: 2, ev: ["“The June soil test was taken from the top spit, where the spring feed was still sitting.”", "“A second test in August, taken at root depth, came back at a tenth of the potassium a fruiting pumpkin needs.”"], but: "“The fruit measured eleven kilograms a day in July and under one kilogram a day in August.”" },
      { who: 4, ev: ["“The neighbour's leylandii reached full height in May and the patch now gets three hours of direct sun.”", "“The growers' table puts three hours of sun at about a third of a full yield, which is sixty-six kilograms.”"], but: "“Before the cut it was drawing on about four hundred leaves and afterwards on the six beyond the break.”" },
    ],
    clears: [
      "Too much water: “Ninety litres a day against a recommended eighty is more water than needed, and extra water swells a fruit.”",
      "Late pollination: “It was pollinated on the eleventh of June, four days late, which the guide prices at about a week of growing time.”",
    ],
    note:
      "The sun answer lands on sixty-six kilograms, which is almost the weight the pumpkin actually reached, and a number that close should be checked rather than trusted. Eleven kilograms a day in July is the fact it cannot survive: a plant starved of light does not put on eleven kilograms a day in the month before it stops.",
  },
  10: {
    story:
      "The cleaners weigh what they sweep off the main corridor and it runs at four kilograms of dried mud a day. In October a shortcut appeared across the field, and the grass along it is worn to bare soil for forty metres. A count on three mornings found a hundred and eighty children using it. Twenty grams on a shoe is a smear nobody would notice, and a hundred and eighty of them is three point six kilograms. The boot room door has been locked since October because its handle was broken in the storm. The ninety children who play football now walk the main corridor in the boots they played in. Mud scraped off ninety pairs of football boots was weighed in one week at four point one kilograms a day. Thirty-one builders sign in through the side door now, not the six who started in September. The scraper mat by that door was lifted in October and has never been put back. A building site boot carries over a hundred grams, and thirty-one of them is more than three kilograms. The gravel path from the gate is dry and loose, and it sheds dust and never mud. Reception has its own door at the far end of the school and its own corridor.",
    q: "Where are the four kilograms coming from? Pick one and show the arithmetic.",
    why: [
      "a hundred and eighty children a morning on forty metres of bare soil",
      "a boot room locked since October, with ninety players in the corridor",
      "thirty-one builders and no scraper mat since October",
      "a dry loose gravel path that sheds dust and never mud",
      "a reception door and corridor at the far end of the school",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A count on three mornings found a hundred and eighty children using it.”", "“Twenty grams on a shoe is a smear nobody would notice, and a hundred and eighty of them is three point six kilograms.”"], but: "“Mud scraped off ninety pairs of football boots was weighed in one week at four point one kilograms a day.”" },
      { who: 1, ev: ["“The boot room door has been locked since October because its handle was broken in the storm.”", "“Mud scraped off ninety pairs of football boots was weighed in one week at four point one kilograms a day.”"], but: "“A count on three mornings found a hundred and eighty children using it.”" },
      { who: 2, ev: ["“Thirty-one builders sign in through the side door now, not the six who started in September.”", "“A building site boot carries over a hundred grams, and thirty-one of them is more than three kilograms.”"], but: "“The scraper mat by that door was lifted in October and has never been put back.”" },
    ],
    clears: [
      "The gravel path: “The gravel path from the gate is dry and loose, and it sheds dust and never mud.”",
      "The reception garden: “Reception has its own door at the far end of the school and its own corridor.”",
    ],
    note:
      "Three sources that each carry about four kilograms would give twelve, and the corridor yields four. Two of these three are measuring the same mud, and the likeliest overlap is the footballers who also take the shortcut. Everything in this case changed in October, which is a reason to ask what else did.",
  },
  11: {
    story:
      "The minibus burned two thousand six hundred litres last spring and three thousand four hundred this spring, and four reasons have been put forward. The second minibus failed its test in September and has been off the road since. This bus has covered the other route as well on Tuesdays, Thursdays and Fridays. The odometer reads nine thousand four hundred kilometres last spring and twelve thousand two hundred this spring. Thirty percent more distance in a vehicle that has not otherwise changed burns thirty percent more fuel. The route was altered in November and the new one is nine point two kilometres longer on twenty-six. That is thirty-five percent further on every one of the hundred and ninety mornings this bus runs. A longer route adds to the odometer exactly as a second route does, and the odometer cannot tell them apart. The depot gate controller failed in November and the drivers now wait with the engine running. The logs since then show an average of two hours twenty minutes idling a day. The manufacturer puts idling at this rate at about twenty-eight percent of a year's fuel. Fuel went up nine percent a litre in October, which raises the bill and leaves the litres where they were. The tyres were found twenty percent under pressure in February, which the maker prices at three percent of the fuel burned.",
    q: "Why has the fuel risen a third? Choose one cause and prove it with a number.",
    why: [
      "a second route on three days a week since September",
      "a nine percent price rise, which moves the bill and not the litres",
      "a route nine point two kilometres longer on twenty-six since November",
      "two hours twenty minutes a day idling at a broken depot gate",
      "tyres twenty percent down, priced at three percent of the fuel burned",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“This bus has covered the other route as well on Tuesdays, Thursdays and Fridays.”", "“The odometer reads nine thousand four hundred kilometres last spring and twelve thousand two hundred this spring.”"], but: "“A longer route adds to the odometer exactly as a second route does, and the odometer cannot tell them apart.”" },
      { who: 2, ev: ["“The route was altered in November and the new one is nine point two kilometres longer on twenty-six.”", "“That is thirty-five percent further on every one of the hundred and ninety mornings this bus runs.”"], but: "“The second minibus failed its test in September and has been off the road since.”" },
      { who: 3, ev: ["“The depot gate controller failed in November and the drivers now wait with the engine running.”", "“The logs since then show an average of two hours twenty minutes idling a day.”"], but: "“Thirty percent more distance in a vehicle that has not otherwise changed burns thirty percent more fuel.”" },
    ],
    clears: [
      "The price of fuel: “Fuel went up nine percent a litre in October, which raises the bill and leaves the litres where they were.”",
      "Soft tyres: “The tyres were found twenty percent under pressure in February, which the maker prices at three percent of the fuel burned.”",
    ],
    note:
      "The odometer is the only hard measurement here and it cannot say which of two answers put the kilometres on it. Idling is the one that burns fuel without moving the needle at all, which makes it the only answer the odometer argues against. That is a cleaner line of reasoning than picking the biggest percentage.",
  },
  12: {
    story:
      "The sports fund should hold two thousand four hundred pounds and the statement shows five hundred and sixty. The kit order was placed by the office in June and placed again by the coach in July. Both orders were paid, and the supplier's statement shows two payments of nine hundred and twenty pounds eleven days apart. One delivery was signed for and the second was never chased, because nobody knew to expect it. Eighteen hundred and forty pounds is exactly two times nine hundred and twenty. The engraver's own statement shows eleven invoices to this fund between September and March, not the one in the folder. Those eleven come to one thousand eight hundred and seventy pounds, every trophy in the cabinet engraved twice. The folder holds whichever invoice somebody remembered to file and nothing tells it from the rest. The account was moved in September onto the business tariff without anyone being told. That tariff charges a pound sixty a transaction and thirty-five pounds a month on top. The statement lists nine hundred and forty transactions since September, which is fifteen hundred pounds in charges alone. Unpaid subscriptions come to ninety-five pounds, and that is money which never arrived at all. The cash tin float was raised from twenty pounds to fifty in September, which moves thirty pounds rather than spending it.",
    q: "Where did eighteen hundred pounds go? Pick one and prove it from the statement.",
    why: [
      "two payments of nine hundred and twenty pounds, eleven days apart",
      "eleven engraver's invoices between September and March, not one",
      "ninety-five pounds in subscriptions that never arrived at all",
      "a business tariff charging a pound sixty on nine hundred and forty transactions",
      "a float raised from twenty pounds to fifty, moved rather than spent",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“Both orders were paid, and the supplier's statement shows two payments of nine hundred and twenty pounds eleven days apart.”", "“Eighteen hundred and forty pounds is exactly two times nine hundred and twenty.”"], but: "“Those eleven come to one thousand eight hundred and seventy pounds, every trophy in the cabinet engraved twice.”" },
      { who: 1, ev: ["“The engraver's own statement shows eleven invoices to this fund between September and March, not the one in the folder.”", "“Those eleven come to one thousand eight hundred and seventy pounds, every trophy in the cabinet engraved twice.”"], but: "“Eighteen hundred and forty pounds is exactly two times nine hundred and twenty.”" },
      { who: 3, ev: ["“The account was moved in September onto the business tariff without anyone being told.”", "“The statement lists nine hundred and forty transactions since September, which is fifteen hundred pounds in charges alone.”"], but: "“One delivery was signed for and the second was never chased, because nobody knew to expect it.”" },
    ],
    clears: [
      "Unpaid subscriptions: “Unpaid subscriptions come to ninety-five pounds, and that is money which never arrived at all.”",
      "The cash float: “The cash tin float was raised from twenty pounds to fifty in September, which moves thirty pounds rather than spending it.”",
    ],
    note:
      "Eighteen hundred and forty pounds being exactly twice nine hundred and twenty is the neatest fact in the case and the one most likely to be a coincidence. Three answers each nearly fill the hole and the fund only lost it once, so at most one of them can be the whole story. The honest finish is to ask for the bank statement and read it line by line.",
  },
  13: {
    story:
      "The turkey needed seven hours when the recipe allowed four and a half, and four reasons have been offered around the table. A probe thermometer left in the oven read a hundred and twenty degrees all afternoon. The dial had been turned to the setting marked with a snowflake, which is the slow defrost programme. Cooking at a hundred and twenty instead of a hundred and eighty is not a delay of minutes but a different rate altogether. The bird on the scales weighed nine and a half kilograms, not the five the recipe was written around. The recipe gives forty minutes a kilogram, and forty minutes times nine and a half is six hours twenty. A kitchen counting the tally marks on the fridge door found the oven opened thirty-one times. Each opening costs about five minutes of recovery, and thirty-one openings is two and a half hours. Eight people were carving, basting and checking in a kitchen with one oven and no timer. The bird was covered in foil for the first three hours, exactly as the recipe instructs. It stood out of the fridge for an hour before it went in, as the recipe asks.",
    q: "Why did the turkey take seven hours? Pick one cause and show the numbers.",
    why: [
      "a probe reading a hundred and twenty with the dial on the snowflake",
      "nine and a half kilograms where the recipe was written around five",
      "thirty-one openings at five minutes of recovery each",
      "three hours under foil, exactly as the recipe instructs",
      "an hour out of the fridge before it went in, as the recipe asks",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A probe thermometer left in the oven read a hundred and twenty degrees all afternoon.”", "“The dial had been turned to the setting marked with a snowflake, which is the slow defrost programme.”"], but: "“Each opening costs about five minutes of recovery, and thirty-one openings is two and a half hours.”" },
      { who: 1, ev: ["“The bird on the scales weighed nine and a half kilograms, not the five the recipe was written around.”", "“The recipe gives forty minutes a kilogram, and forty minutes times nine and a half is six hours twenty.”"], but: "“Cooking at a hundred and twenty instead of a hundred and eighty is not a delay of minutes but a different rate altogether.”" },
      { who: 2, ev: ["“A kitchen counting the tally marks on the fridge door found the oven opened thirty-one times.”", "“Each opening costs about five minutes of recovery, and thirty-one openings is two and a half hours.”"], but: "“The bird on the scales weighed nine and a half kilograms, not the five the recipe was written around.”" },
    ],
    clears: [
      "The foil: “The bird was covered in foil for the first three hours, exactly as the recipe instructs.”",
      "Straight from the fridge: “It stood out of the fridge for an hour before it went in, as the recipe asks.”",
    ],
    note:
      "Six hours twenty for the weight alone is already most of the seven hours, which makes the bird the quietly strongest answer and the one nobody picks. A probe reading taken once in a kitchen full of people opening the door thirty-one times may be measuring the door rather than the dial. Ask when that reading was taken.",
  },
  14: {
    story:
      "The bake sale took two hundred and forty pounds at the table and handed sixty-two pounds to the fund. The ingredients were bought at the corner shop on the morning of the sale. Butter, eggs and ground almonds for two hundred cakes cost a hundred and sixty-one pounds there. The same list at the supermarket two streets away comes to forty-three pounds. Nobody in the planning meeting ever subtracted the ingredients from the takings at all. The helpers' tray was refilled all afternoon and the tally sheet records a hundred and forty free cakes. At a pound and twenty each that is a hundred and sixty-eight pounds of stock out of the door. The price was cut to sixty pence at half past one, not half past three as the organiser remembers. A hundred and fifty cakes sold after that cut, which gave away ninety pounds against the full price. Sixty more went at twenty pence in the last half hour, which gave away sixty pounds more. Eleven cupcakes were dropped before the sale opened, which at a pound and twenty is thirteen pounds. The float of twenty pounds was counted into the takings and taken out again, so it moves nothing.",
    q: "Where did the other hundred and seventy-eight pounds go? Show the arithmetic.",
    why: [
      "a hundred and sixty-one pounds of ingredients from the corner shop",
      "eleven cakes dropped before opening, worth thirteen pounds",
      "a hundred and forty free cakes on the helpers' tally sheet",
      "a price cut at half past one, with two hundred and ten cakes sold under it",
      "a twenty pound float counted in and taken out again",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“Butter, eggs and ground almonds for two hundred cakes cost a hundred and sixty-one pounds there.”", "“The same list at the supermarket two streets away comes to forty-three pounds.”"], but: "“At a pound and twenty each that is a hundred and sixty-eight pounds of stock out of the door.”" },
      { who: 2, ev: ["“The helpers' tray was refilled all afternoon and the tally sheet records a hundred and forty free cakes.”", "“At a pound and twenty each that is a hundred and sixty-eight pounds of stock out of the door.”"], but: "“Nobody in the planning meeting ever subtracted the ingredients from the takings at all.”" },
      { who: 3, ev: ["“The price was cut to sixty pence at half past one, not half past three as the organiser remembers.”", "“A hundred and fifty cakes sold after that cut, which gave away ninety pounds against the full price.”"], but: "“The bake sale took two hundred and forty pounds at the table”" },
    ],
    clears: [
      "Crushed cupcakes: “Eleven cupcakes were dropped before the sale opened, which at a pound and twenty is thirteen pounds.”",
      "The float: “The float of twenty pounds was counted into the takings and taken out again, so it moves nothing.”",
    ],
    note:
      "Two hundred cakes were baked and the tallies here give away a hundred and forty free and sell three hundred and sixty. The numbers in this case cannot all be about the same sale, and noticing that is worth more than choosing between them. Only the ingredient bill is money that left the fund rather than cake that left the table.",
  },
  15: {
    story:
      "The knitted mittens keep hands warm on the playground and the bought ones do not, and four differences have been suggested. The bought knit has visible holes between the stitches that air passes straight through. The knitted pair was made on small needles at a tension that leaves no gaps. Held in front of a fan at twenty kilometres an hour, the bought pair dropped eleven degrees and the knitted pair two. Still air trapped in a fabric is what keeps a hand warm, and wind takes that air away. Measured on the gauge the knitted pair is eleven millimetres thick and the bought pair two. The textile table puts nine millimetres of that fabric at about seven degrees of difference. The playground test was run in sleet, with both pairs soaked through within ten minutes. Wet acrylic holds no air at all, and the table puts wet acrylic against wet wool at nine degrees. The knitted pair is wool and the bought pair acrylic, which is the only difference the sleet can act on. The knitted cuff is six centimetres longer, which keeps a wrist covered and is worth about half a degree. The bought pair is black and the knitted pair cream, and colour does nothing on a cloudy day.",
    q: "Why do the bought mittens fail? Choose one difference and prove it with a figure.",
    why: [
      "visible holes between the stitches, and eleven degrees lost in front of a fan",
      "eleven millimetres against two, which the table puts at seven degrees",
      "wool against acrylic in sleet, which the table puts at nine degrees",
      "a cuff six centimetres longer, worth about half a degree",
      "black against cream, which does nothing on a cloudy day",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The bought knit has visible holes between the stitches that air passes straight through.”", "“Held in front of a fan at twenty kilometres an hour, the bought pair dropped eleven degrees and the knitted pair two.”"], but: "“The playground test was run in sleet, with both pairs soaked through within ten minutes.”" },
      { who: 1, ev: ["“Measured on the gauge the knitted pair is eleven millimetres thick and the bought pair two.”", "“The textile table puts nine millimetres of that fabric at about seven degrees of difference.”"], but: "“The knitted pair was made on small needles at a tension that leaves no gaps.”" },
      { who: 2, ev: ["“The playground test was run in sleet, with both pairs soaked through within ten minutes.”", "“Wet acrylic holds no air at all, and the table puts wet acrylic against wet wool at nine degrees.”"], but: "“Still air trapped in a fabric is what keeps a hand warm, and wind takes that air away.”" },
    ],
    clears: [
      "The longer cuff: “The knitted cuff is six centimetres longer, which keeps a wrist covered and is worth about half a degree.”",
      "The colour: “The bought pair is black and the knitted pair cream, and colour does nothing on a cloudy day.”",
    ],
    note:
      "A tight knit on small needles is also a thick knit, so the gaps answer and the thickness answer may be one property measured twice. The sleet is the awkward detail, because the fan test was run dry and the playground was not. Ask which of these two tests actually matches the complaint.",
  },
  16: {
    story:
      "The gingerbread house fell in on itself twice, and four reasons were offered by four bakers. A royal icing joint cured for twelve hours holds about nine hundred grams before it gives way. The same joint after forty minutes holds about sixty grams. The house was assembled forty minutes after the icing was piped, because the class ends at three. Each wall is carrying two hundred and forty grams of roof once the panels are on. The sweets were weighed off the wreckage at three hundred and ten grams a wall, not the forty-six anyone remembered. Three hundred and ten grams of sweets on top of two hundred and forty of roof is more than five hundred a wall. A wall loaded at five hundred and fifty grams is past the twelve-hour strength of its own joints. The panels came out at two millimetres against the eight the pattern asks for. A gingerbread panel at a quarter of its thickness carries about a sixteenth of the load. Both collapses began with a wall bowing outward in the middle rather than a joint letting go. The kitchen was humid from the oven, and damp takes perhaps a tenth off the strength of royal icing. The board flexes if lifted from one corner, and both times it travelled flat on a tray.",
    q: "Why did the house collapse? Pick one cause and prove it with the weights.",
    why: [
      "forty minutes of curing against a joint that needs twelve hours",
      "a humid kitchen, worth perhaps a tenth off the icing's strength",
      "three hundred and ten grams of sweets a wall, weighed off the wreckage",
      "a board that flexes, but travelled flat on a tray both times",
      "panels at two millimetres where the pattern asks for eight",
    ],
    open: [0, 2, 4],
    for: [
      { who: 0, ev: ["“The same joint after forty minutes holds about sixty grams.”", "“The house was assembled forty minutes after the icing was piped, because the class ends at three.”"], but: "“Both collapses began with a wall bowing outward in the middle rather than a joint letting go.”" },
      { who: 2, ev: ["“The sweets were weighed off the wreckage at three hundred and ten grams a wall, not the forty-six anyone remembered.”", "“A wall loaded at five hundred and fifty grams is past the twelve-hour strength of its own joints.”"], but: "“The same joint after forty minutes holds about sixty grams.”" },
      { who: 4, ev: ["“The panels came out at two millimetres against the eight the pattern asks for.”", "“Both collapses began with a wall bowing outward in the middle rather than a joint letting go.”"], but: "“Each wall is carrying two hundred and forty grams of roof once the panels are on.”" },
    ],
    clears: [
      "The humid kitchen: “The kitchen was humid from the oven, and damp takes perhaps a tenth off the strength of royal icing.”",
      "The flexing board: “The board flexes if lifted from one corner, and both times it travelled flat on a tray.”",
    ],
    note:
      "Sixty grams of joint strength under two hundred and forty grams of roof is already a collapse, so the sweets and the thin panels are both arguing about a house that was never going to stand. The bowing wall is the only observation of how it actually failed, and it points away from the joints entirely. That one sentence should decide it.",
  },
  17: {
    story:
      "The hall's lighting cost forty pounds a month last year and three hundred and ten this year. The movement sensor fitted in September was wired to the wrong terminal and holds the lights on permanently. Thirty-six panels at eighteen watts is six hundred and forty-eight watts, and the hall was lit for ninety hours a month before. It is now lit for all seven hundred and twenty hours in a month, including every night and every weekend. Eight times the hours on the same fittings is eight times the bill. The festive string is the old filament kind and draws two thousand four hundred watts, not a hundred and twenty. It has been left on day and night since the first of December and nobody has a key to that socket. Two thousand four hundred watts running continuously is almost four times the draw of every panel in the hall. The leisure trust took the hall's evenings and weekends in September, which is four hundred and ninety extra hours a month. Lighting a hall for six times as many hours costs six times as much however efficient the fittings are. The new panels draw eighteen watts each where the old fittings drew fifty-eight, which means each new fitting costs less to run than the one it replaced. The unit price rose nine percent in October, worth three pounds sixty against last year.",
    q: "Why has the bill gone up eight times? Choose one cause and show the arithmetic.",
    why: [
      "a sensor wired to the wrong terminal, holding the lights on permanently",
      "panels at eighteen watts replacing fittings that drew fifty-eight",
      "a filament string at two thousand four hundred watts, on since December",
      "a nine percent unit price rise, worth three pounds sixty",
      "four hundred and ninety extra hours a month for the leisure trust",
    ],
    open: [0, 2, 4],
    for: [
      { who: 0, ev: ["“The movement sensor fitted in September was wired to the wrong terminal and holds the lights on permanently.”", "“Eight times the hours on the same fittings is eight times the bill.”"], but: "“The leisure trust took the hall's evenings and weekends in September, which is four hundred and ninety extra hours a month.”" },
      { who: 2, ev: ["“The festive string is the old filament kind and draws two thousand four hundred watts, not a hundred and twenty.”", "“It has been left on day and night since the first of December and nobody has a key to that socket.”"], but: "“The hall's lighting cost forty pounds a month last year and three hundred and ten this year.”" },
      { who: 4, ev: ["“The leisure trust took the hall's evenings and weekends in September, which is four hundred and ninety extra hours a month.”", "“Lighting a hall for six times as many hours costs six times as much however efficient the fittings are.”"], but: "“It is now lit for all seven hundred and twenty hours in a month, including every night and every weekend.”" },
    ],
    clears: [
      "The new panels: “The new panels draw eighteen watts each where the old fittings drew fifty-eight, which means each new fitting costs less to run than the one it replaced.”",
      "The unit price: “The unit price rose nine percent in October, worth three pounds sixty against last year.”",
    ],
    note:
      "The sensor and the bookings are both claims about hours, and they cannot both be added: a hall the trust is using is a hall the lights should be on in. The festive string is the one that does not depend on hours at all, and it only started in December. Ask what the bill did in October and November, and notice that the case never says.",
  },
  18: {
    story:
      "The end-of-day bell rings ninety seconds late by Friday and on time again on Monday, and four causes have been suggested. The caretaker synchronises the bell timer to the office clock every morning. The office clock is itself set each morning against the deputy head's watch. That watch was checked against the speaking clock and gains eighteen seconds a day. Eighteen seconds carried forward five mornings in a row is ninety seconds by Friday. The timer's quartz was replaced in September with an unbranded part from the market. Tested for a week against the speaking clock it ran eighteen seconds slow every day. A timer corrected each Monday and left alone until Friday accumulates exactly five days of its own drift. The relay that fires the bell has pitted contacts and now waits for its coil to warm before closing. Timed with a stopwatch on Friday afternoon it lagged eighteen seconds behind the timer's own signal. Contacts that burn a little on every firing lag further with each day of a week's use. The October power cut stopped the clock for forty minutes and showed as a jump on one afternoon. The timer is reset by hand each half term, which corrects an error rather than making one.",
    q: "Why is the bell ninety seconds late by Friday? Prove it with a number.",
    why: [
      "a watch at the top of the chain gaining eighteen seconds a day",
      "an unbranded quartz running eighteen seconds slow a day",
      "pitted relay contacts lagging eighteen seconds by Friday",
      "a power cut that stopped the clock and showed as one jump",
      "a half term reset by hand, which corrects an error rather than making one",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The office clock is itself set each morning against the deputy head's watch.”", "“That watch was checked against the speaking clock and gains eighteen seconds a day.”"], but: "“Tested for a week against the speaking clock it ran eighteen seconds slow every day.”" },
      { who: 1, ev: ["“The timer's quartz was replaced in September with an unbranded part from the market.”", "“A timer corrected each Monday and left alone until Friday accumulates exactly five days of its own drift.”"], but: "“The caretaker synchronises the bell timer to the office clock every morning.”" },
      { who: 2, ev: ["“The relay that fires the bell has pitted contacts and now waits for its coil to warm before closing.”", "“Timed with a stopwatch on Friday afternoon it lagged eighteen seconds behind the timer's own signal.”"], but: "“Eighteen seconds carried forward five mornings in a row is ninety seconds by Friday.”" },
    ],
    clears: [
      "The October power cut: “The October power cut stopped the clock for forty minutes and showed as a jump on one afternoon.”",
      "The half term reset: “The timer is reset by hand each half term, which corrects an error rather than making one.”",
    ],
    note:
      "Three different eighteens is the joke and the lesson. The quartz answer dies on one sentence, because a timer synchronised every morning cannot carry its own drift into Friday, and a student who finds that has read the mechanism rather than the number. The relay lags eighteen seconds on Friday and nobody timed it on Monday.",
  },
  19: {
    story:
      "The school was nineteen degrees at six on Thursday evening and eleven degrees at six on Friday morning. The boiler fault log shows a lockout at ten past eleven and no firing at all until the caretaker reset it at half past six. A building with the heating off does not lose heat faster; it simply stops being given any. The surveyor's figure for this building unheated on a night below zero is seven to nine degrees. The science block fire door was not propped but blown off its closer in Thursday's gale. It stood wide open to the north from before midnight until the caretaker found it. The surveyor puts a doorway that size open to a north wind at five to seven degrees overnight. Three of the north windows were found open on their top vents on Friday morning. Single glazing with an open vent above it is the surveyor's worst case for this building. He puts three such windows on a night below zero at about six degrees. The loft hatch above the stairs was left open, and the same survey prices that at half a degree. The thermostat is set back to twelve overnight, and twelve is above the eleven the building reached.",
    q: "What took eight degrees out of the building? Prove it with a number.",
    why: [
      "a lockout at ten past eleven and no firing until half past six",
      "a fire door blown off its closer, open to the north all night",
      "three north windows found open on their top vents",
      "a loft hatch left open, priced at half a degree",
      "a setback to twelve, which is above the eleven the building reached",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The boiler fault log shows a lockout at ten past eleven and no firing at all until the caretaker reset it at half past six.”", "“The surveyor's figure for this building unheated on a night below zero is seven to nine degrees.”"], but: "“It stood wide open to the north from before midnight until the caretaker found it.”" },
      { who: 1, ev: ["“The science block fire door was not propped but blown off its closer in Thursday's gale.”", "“The surveyor puts a doorway that size open to a north wind at five to seven degrees overnight.”"], but: "“A building with the heating off does not lose heat faster; it simply stops being given any.”" },
      { who: 2, ev: ["“Three of the north windows were found open on their top vents on Friday morning.”", "“He puts three such windows on a night below zero at about six degrees.”"], but: "“The surveyor's figure for this building unheated on a night below zero is seven to nine degrees.”" },
    ],
    clears: [
      "The open loft hatch: “The loft hatch above the stairs was left open, and the same survey prices that at half a degree.”",
      "The overnight setback: “The thermostat is set back to twelve overnight, and twelve is above the eleven the building reached.”",
    ],
    note:
      "The surveyor's seven to nine degrees already covers the whole fall, which means the door and the windows have nothing left to explain unless the boiler was working. Everything here happened in the same gale, and a gale that opens a door and a vent is also a gale that locks out a boiler. Ask which of these three is the cause of the other two.",
  },
  20: {
    story:
      "The feeders on the field are emptying two kilograms of seed a day, and four eaters have been blamed. The pigeons arrive at half past three, after the watchers have gone home, and the caretaker counted forty on and under the feeders. A woodpigeon eats about forty grams of grain a day, and forty of them is sixteen hundred grams. The birds that are seen all day are the ones that eat least. A dawn count on four mornings found between three and four hundred sparrows in the hedge beside the field. A sparrow eats around five grams a day, and four hundred sparrows is two thousand grams. The nine o'clock count of twenty on the feeders was counting the twenty that fit, not the flock behind them. The trail camera recorded nine different squirrels between six and eight in the morning. A grey squirrel eats perhaps eighty grams a day but will carry two hundred away to bury. Nine squirrels caching at that rate take eighteen hundred grams off the feeders before breakfast. The catch tray underneath was emptied and weighed for a week at sixty grams of spilled seed a day. The finches come in ones and twos, and a finch eats about what a sparrow eats.",
    q: "Who is eating two kilograms a day? Choose one and show the arithmetic.",
    why: [
      "forty pigeons after half past three, at forty grams each",
      "three to four hundred sparrows in the hedge, at five grams each",
      "nine squirrels on camera, each caching two hundred grams",
      "a catch tray weighed at sixty grams of spill a day",
      "finches in ones and twos, eating about what a sparrow eats",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The pigeons arrive at half past three, after the watchers have gone home, and the caretaker counted forty on and under the feeders.”", "“A woodpigeon eats about forty grams of grain a day, and forty of them is sixteen hundred grams.”"], but: "“A dawn count on four mornings found between three and four hundred sparrows in the hedge beside the field.”" },
      { who: 1, ev: ["“A dawn count on four mornings found between three and four hundred sparrows in the hedge beside the field.”", "“A sparrow eats around five grams a day, and four hundred sparrows is two thousand grams.”"], but: "“The nine o'clock count of twenty on the feeders was counting the twenty that fit, not the flock behind them.”" },
      { who: 2, ev: ["“The trail camera recorded nine different squirrels between six and eight in the morning.”", "“Nine squirrels caching at that rate take eighteen hundred grams off the feeders before breakfast.”"], but: "“The birds that are seen all day are the ones that eat least.”" },
    ],
    clears: [
      "Spillage: “The catch tray underneath was emptied and weighed for a week at sixty grams of spilled seed a day.”",
      "The finches: “The finches come in ones and twos, and a finch eats about what a sparrow eats.”",
    ],
    note:
      "Three counts, each one taken at a different hour, each one big enough to empty the feeders alone. Sparrows in a hedge are not sparrows on a feeder, and nine squirrels on a camera over two hours may be the same squirrel nine times. The caretaker's forty pigeons is the only count of animals actually at the food.",
  },
  21: {
    story:
      "The staff room urn used to boil in twelve minutes and now takes forty, and four explanations have been offered. The urn has three heating elements and an engineer measured the resistance across all three in February. Two of them are open circuit and have been since the power surge in January. One element doing the work of three takes three times as long to deliver the same heat. Twelve minutes multiplied by three is thirty-six, which is most of the forty. The lid was lost in January and has never been replaced. A test on this urn with a borrowed lid and without one put the difference at twenty-six minutes. An open urn boils off steam for the whole run and heats the staff room instead of the water. The elements were lifted out in February under nine millimetres of hard scale, not the millimetre anyone expected. The manual puts nine millimetres of scale at roughly three times a boiling time. Scale is a blanket between an element and the water, and it was last descaled eleven years ago. The urn is filled to eighteen litres rather than seventeen, which is six percent more water, or about forty seconds. The staff room has been two degrees colder since the radiator valve stuck, which costs under a minute from cold.",
    q: "Why does the urn take forty minutes? Pick one cause and show the numbers.",
    why: [
      "two of three elements open circuit since the January surge",
      "a litre more water, worth about forty seconds",
      "a room two degrees colder, worth under a minute from cold",
      "a lid lost in January, worth twenty-six minutes on test",
      "nine millimetres of scale, which the manual puts at three times the time",
    ],
    open: [0, 3, 4],
    for: [
      { who: 0, ev: ["“Two of them are open circuit and have been since the power surge in January.”", "“Twelve minutes multiplied by three is thirty-six, which is most of the forty.”"], but: "“A test on this urn with a borrowed lid and without one put the difference at twenty-six minutes.”" },
      { who: 3, ev: ["“The lid was lost in January and has never been replaced.”", "“A test on this urn with a borrowed lid and without one put the difference at twenty-six minutes.”"], but: "“One element doing the work of three takes three times as long to deliver the same heat.”" },
      { who: 4, ev: ["“The elements were lifted out in February under nine millimetres of hard scale, not the millimetre anyone expected.”", "“The manual puts nine millimetres of scale at roughly three times a boiling time.”"], but: "“Scale is a blanket between an element and the water, and it was last descaled eleven years ago.”" },
    ],
    clears: [
      "The extra litre: “The urn is filled to eighteen litres rather than seventeen, which is six percent more water, or about forty seconds.”",
      "The colder room: “The staff room has been two degrees colder since the radiator valve stuck, which costs under a minute from cold.”",
    ],
    note:
      "Eleven years of scale cannot explain a change that happened in January, and that is the question to put to the scale answer: when did it start. The lid test was run on the broken urn, so twenty-six minutes may be twenty-six minutes of one element struggling. Ask what that test would have shown in December.",
  },
  22: {
    story:
      "Three hundred and ten cards went into the school post and a hundred and ninety came out, and four losses have been offered. A second post box was put in the junior corridor on the Monday and nobody was told to empty it. It was opened on the following Friday and a hundred and three cards were taken out of it. Every card posted is somewhere, because nobody ever counted a card into the system twice. The roll used by the sorters was last year's list, printed before the September intake. A hundred and fourteen of this year's names do not appear on that list at all. A sorter who cannot find a name puts the card in the returns tray behind the desk. Ninety-one cards were posted in plain envelopes with the name written on the card inside. The sorters were told not to open anything, so none of those ninety-one was ever read. A card nobody can address is a card that never leaves the sorting room. Six were handed straight to the person, so they arrived without passing through the system. Four were found torn in the sorting tray with nothing legible left on them.",
    q: "Where did a hundred and twenty cards go? Choose one and prove it.",
    why: [
      "a hundred and three cards in a box nobody was told to empty",
      "a sorting roll printed before the September intake, missing a hundred and fourteen names",
      "ninety-one plain envelopes nobody was allowed to open",
      "six handed over in person, so they arrived outside the system",
      "four torn in the tray with nothing legible left",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A second post box was put in the junior corridor on the Monday and nobody was told to empty it.”", "“It was opened on the following Friday and a hundred and three cards were taken out of it.”"], but: "“A hundred and fourteen of this year's names do not appear on that list at all.”" },
      { who: 1, ev: ["“The roll used by the sorters was last year's list, printed before the September intake.”", "“A hundred and fourteen of this year's names do not appear on that list at all.”"], but: "“A sorter who cannot find a name puts the card in the returns tray behind the desk.”" },
      { who: 2, ev: ["“Ninety-one cards were posted in plain envelopes with the name written on the card inside.”", "“The sorters were told not to open anything, so none of those ninety-one was ever read.”"], but: "“It was opened on the following Friday and a hundred and three cards were taken out of it.”" },
    ],
    clears: [
      "Hand delivered: “Six were handed straight to the person, so they arrived without passing through the system.”",
      "Torn cards: “Four were found torn in the sorting tray with nothing legible left on them.”",
    ],
    note:
      "A hundred and three plus a hundred and fourteen plus ninety-one is three hundred and eight, which is almost every card posted. These groups must overlap heavily, and the likeliest overlap is that the cards in the second box were also the ones in plain envelopes. Only a hundred and twenty went missing, so at most one of these counts can be read at face value.",
  },
  23: {
    story:
      "The model volcano threw its foam thirty centimetres and the club record is two metres, and four differences have been proposed. The record attempt adds ten millilitres of washing-up liquid and this one used none. Gas on its own rises through the liquid and bursts at the surface, so most of it never lifts anything. Soap traps that gas as foam, and foam is what climbs the neck and keeps climbing. The same mixture with soap added was run afterwards and reached one metre seventy. The bottle neck measures seventy millimetres across where the record used twenty. A neck three and a half times as wide gives the gas twelve times the opening to leave by. Foam that is not forced through a narrow gap has no speed and nothing to climb with. The vinegar was tested on the club's meter at one percent acid rather than the five on the label. The caretaker has been topping that bottle up from the tap all term to keep it full. One percent against the record's eight is an eighth of the acid and an eighth of the gas. Forty grams of bicarbonate was used against the record's sixty, a third down on the gas. The room was four degrees cooler, which slows a reaction without changing how much gas it makes.",
    q: "Why did it only reach thirty centimetres? Prove your answer with a figure.",
    why: [
      "no washing-up liquid, where the record uses ten millilitres",
      "a neck of seventy millimetres against the record's twenty",
      "forty grams of bicarbonate against sixty, a third down on the gas",
      "vinegar measured at one percent acid, not the five on the label",
      "a room four degrees cooler, which changes the rate and not the gas",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The record attempt adds ten millilitres of washing-up liquid and this one used none.”", "“The same mixture with soap added was run afterwards and reached one metre seventy.”"], but: "“The vinegar was tested on the club's meter at one percent acid rather than the five on the label.”" },
      { who: 1, ev: ["“The bottle neck measures seventy millimetres across where the record used twenty.”", "“A neck three and a half times as wide gives the gas twelve times the opening to leave by.”"], but: "“The same mixture with soap added was run afterwards and reached one metre seventy.”" },
      { who: 3, ev: ["“The vinegar was tested on the club's meter at one percent acid rather than the five on the label.”", "“One percent against the record's eight is an eighth of the acid and an eighth of the gas.”"], but: "“Soap traps that gas as foam, and foam is what climbs the neck and keeps climbing.”" },
    ],
    clears: [
      "Less bicarbonate: “Forty grams of bicarbonate was used against the record's sixty, a third down on the gas.”",
      "The cooler room: “The room was four degrees cooler, which slows a reaction without changing how much gas it makes.”",
    ],
    note:
      "The retest with soap is the only controlled comparison in the case, and it was run in the same wide-necked bottle with the same weak vinegar. That one sentence costs the neck answer and the vinegar answer almost everything, because both of them were still true when it reached one metre seventy. A class that finds it has found what a control is for.",
  },
  24: {
    story:
      "Thirty-eight of the forty stones on the play's crown were on the floor by the end of the first rehearsal, and four reasons have been offered. The crown was sprayed with glitter spray before the stones went on. A pull test on a stone glued to bare card needed six hundred grams to shift it. The same glue on the glittered surface let go at four grams. The glue is holding perfectly well to a layer of loose glitter that is holding on to nothing. The varnish was sprayed over the stones after they were fixed, not before, and its solvent is acetone. A joint of this glue soaked in acetone for ten minutes loses nineteen twentieths of its strength. Every stone on the crown took that spray directly into its glue line. The thermometer taped under the stage lights read fifty-two degrees through the rehearsal. This glue is rated by its maker to thirty-five degrees and no higher. A sample of the same joint held at fifty-two let go under eight grams of pull. The stones weigh one point four grams each, and the glue is rated at two kilograms per square centimetre. The card base flexes when the crown is put on, and it was put on once.",
    q: "Why did the stones fall off? Pick one cause and prove it with the test figures.",
    why: [
      "glitter spray under the glue, and four grams against six hundred on bare card",
      "stones of one point four grams under a glue rated at two kilograms",
      "a base that flexes, and a crown that was put on once",
      "varnish sprayed into every glue line, with acetone as its solvent",
      "fifty-two degrees under the lights against a glue rated to thirty-five",
    ],
    open: [0, 3, 4],
    for: [
      { who: 0, ev: ["“A pull test on a stone glued to bare card needed six hundred grams to shift it.”", "“The same glue on the glittered surface let go at four grams.”"], but: "“Every stone on the crown took that spray directly into its glue line.”" },
      { who: 3, ev: ["“The varnish was sprayed over the stones after they were fixed, not before, and its solvent is acetone.”", "“A joint of this glue soaked in acetone for ten minutes loses nineteen twentieths of its strength.”"], but: "“The glue is holding perfectly well to a layer of loose glitter that is holding on to nothing.”" },
      { who: 4, ev: ["“The thermometer taped under the stage lights read fifty-two degrees through the rehearsal.”", "“A sample of the same joint held at fifty-two let go under eight grams of pull.”"], but: "“The same glue on the glittered surface let go at four grams.”" },
    ],
    clears: [
      "The weight of the stones: “The stones weigh one point four grams each, and the glue is rated at two kilograms per square centimetre.”",
      "The flexing base: “The card base flexes when the crown is put on, and it was put on once.”",
    ],
    note:
      "Four grams, eight grams and a twentieth of six hundred are all below the weight of a stone, so all three open answers predict a crown that cannot hold a single jewel. That is the uncomfortable finish: the evidence is consistent with three causes and the crown only failed once. The test on bare card is the one that was run on this crown's own materials.",
  },
  25: {
    story:
      "The stage floor dips eleven millimetres under the piano and the builder's limit is three. A cable run was cut through the main joist in two thousand and nineteen, taking its depth from two hundred and twenty millimetres to ninety. The stiffness of a joist goes with the cube of its depth, not with the depth itself. Ninety cubed against two hundred and twenty cubed leaves about seven percent of the original stiffness. A beam with a fourteenth of its stiffness bends fourteen times as far under the load it always carried. The piano was replaced in September and the new one weighs four hundred and eighty kilograms. The upright it replaced weighed a hundred and ninety, and it stood against the wall rather than mid-span. Four hundred and eighty kilograms on four castors over the centre of a joist is the worst place a load can sit. The choir has grown from eighteen singers to forty since the hall was last measured. Forty singers at sixty kilograms each is two and a half tonnes where there were a thousand and eighty kilograms. The eleven millimetres was measured during the carol concert, with the whole choir on the boards. The staging blocks at the back add a hundred and ten kilograms over the end wall. The lighting bar is hung from the ceiling and puts none of its weight on the floor.",
    q: "Why does the stage dip eleven millimetres? Pick one cause and show the numbers.",
    why: [
      "a joist cut from two hundred and twenty millimetres deep to ninety",
      "a new piano at four hundred and eighty kilograms, sitting mid-span",
      "a choir grown from eighteen singers to forty since the last measurement",
      "staging blocks adding a hundred and ten kilograms over the end wall",
      "a lighting bar hung from the ceiling, putting nothing on the floor",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A cable run was cut through the main joist in two thousand and nineteen, taking its depth from two hundred and twenty millimetres to ninety.”", "“Ninety cubed against two hundred and twenty cubed leaves about seven percent of the original stiffness.”"], but: "“The piano was replaced in September and the new one weighs four hundred and eighty kilograms.”" },
      { who: 1, ev: ["“The piano was replaced in September and the new one weighs four hundred and eighty kilograms.”", "“The upright it replaced weighed a hundred and ninety, and it stood against the wall rather than mid-span.”"], but: "“A beam with a fourteenth of its stiffness bends fourteen times as far under the load it always carried.”" },
      { who: 2, ev: ["“The choir has grown from eighteen singers to forty since the hall was last measured.”", "“The eleven millimetres was measured during the carol concert, with the whole choir on the boards.”"], but: "“Four hundred and eighty kilograms on four castors over the centre of a joist is the worst place a load can sit.”" },
    ],
    clears: [
      "The staging blocks: “The staging blocks at the back add a hundred and ten kilograms over the end wall.”",
      "The lighting bar: “The lighting bar is hung from the ceiling and puts none of its weight on the floor.”",
    ],
    note:
      "The cut joist has been there for years and the dip is new, which is the hardest question the strongest answer has to face. The reply is that a weak beam needs a load to show, and the piano and the choir both arrived this autumn. Ask whether the cause is the cut, the load, or the fact that nobody measured the stage in between.",
  },
  26: {
    story:
      "The kite flew well on the first day and will not leave the ground now, and four additions have been blamed. The string was changed after the first day from the thin nylon to the builder's line from the shed. Sixty metres of that line weighs two point one grams a metre. The thin nylon it replaced weighs a third of a gram a metre, or twenty grams over the same sixty. A hundred and twenty-six grams of line is more than the kite itself weighs. A kite does not only lift itself; it lifts every metre of string between it and the hand. The tail was replaced on the second day with four metres of towelling strip from the art room. Weighed dry on the kitchen scales that tail comes to a hundred and forty grams. The kite itself weighs ninety grams, so the tail alone is half as heavy again. The winder clipped to the bridle is the wooden one, with sixty metres of spare line still wound on it. Winder and spare line together were weighed at a hundred and sixty grams hanging below the kite. The paper took up damp overnight and a careful weighing showed six grams of water. Extra tape along the spars comes to four grams on the frame.",
    q: "Why will the kite not fly? Choose one addition and prove it with a weight.",
    why: [
      "sixty metres of builder's line at two point one grams a metre",
      "a towelling tail weighed dry at a hundred and forty grams",
      "six grams of water taken up by the paper overnight",
      "a wooden winder and spare line, weighed at a hundred and sixty grams",
      "extra tape along the spars, four grams on the frame",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“Sixty metres of that line weighs two point one grams a metre.”", "“A hundred and twenty-six grams of line is more than the kite itself weighs.”"], but: "“Winder and spare line together were weighed at a hundred and sixty grams hanging below the kite.”" },
      { who: 1, ev: ["“The tail was replaced on the second day with four metres of towelling strip from the art room.”", "“Weighed dry on the kitchen scales that tail comes to a hundred and forty grams.”"], but: "“A kite does not only lift itself; it lifts every metre of string between it and the hand.”" },
      { who: 3, ev: ["“The winder clipped to the bridle is the wooden one, with sixty metres of spare line still wound on it.”", "“Winder and spare line together were weighed at a hundred and sixty grams hanging below the kite.”"], but: "“The kite itself weighs ninety grams, so the tail alone is half as heavy again.”" },
    ],
    clears: [
      "The damp paper: “The paper took up damp overnight and a careful weighing showed six grams of water.”",
      "The extra tape: “Extra tape along the spars comes to four grams on the frame.”",
    ],
    note:
      "A ninety gram kite is now carrying four hundred and twenty-six grams of additions, and any one of the three would ground it alone. The useful distinction is where each weight hangs: line is spread along its length, a tail pulls from the back, and a winder is dead weight at one point. Ask which of those a kite can carry most of.",
  },
  27: {
    story:
      "Eleven seedlings came up from a tray of two hundred seeds and four reasons have been given. The seed was pressed in with a thumb to a depth of about two centimetres. The packet asks for five millimetres and says in bold that the seed needs light to germinate. A seed buried four times too deep in the dark never starts, whatever the compost or the temperature. A second tray from a different packet, sown at five millimetres, gave a hundred and sixty-eight. The packet was found at the back of the shed and is dated nine years ago, not last March. The seed house gives this species three good years and almost nothing after six. Nine-year-old seed of this kind is sold as bird food rather than as seed. The window above the sill was left on its latch through the whole of the cold snap. A thermometer taped to the tray read four degrees, not the fourteen anybody assumed. The packet says in the same bold type that below six degrees the seed will not start at all. The compost was the cheap bag left from last summer, which the trial tray priced near ten percent. The tray was watered once a week rather than kept damp, which the trial put at fifteen percent.",
    q: "Why did only eleven come up? Pick one cause and prove it from the packet.",
    why: [
      "two centimetres deep for a seed the packet says needs light",
      "a packet dated nine years ago for a species given three good years",
      "cheap compost from last summer, priced near ten percent",
      "a tray thermometer reading four degrees under a six degree floor",
      "weekly watering instead of damp, which the trial put at fifteen percent",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The packet asks for five millimetres and says in bold that the seed needs light to germinate.”", "“A second tray from a different packet, sown at five millimetres, gave a hundred and sixty-eight.”"], but: "“The packet was found at the back of the shed and is dated nine years ago, not last March.”" },
      { who: 1, ev: ["“The packet was found at the back of the shed and is dated nine years ago, not last March.”", "“The seed house gives this species three good years and almost nothing after six.”"], but: "“A seed buried four times too deep in the dark never starts, whatever the compost or the temperature.”" },
      { who: 3, ev: ["“A thermometer taped to the tray read four degrees, not the fourteen anybody assumed.”", "“The packet says in the same bold type that below six degrees the seed will not start at all.”"], but: "“A second tray from a different packet, sown at five millimetres, gave a hundred and sixty-eight.”" },
    ],
    clears: [
      "Cheap compost: “The compost was the cheap bag left from last summer, which the trial tray priced near ten percent.”",
      "Weekly watering: “The tray was watered once a week rather than kept damp, which the trial put at fifteen percent.”",
    ],
    note:
      "The second tray is the whole case and it changes two things at once: a different packet and a different depth. That is a broken experiment, and it is the commonest way a real comparison goes wrong. Ask what the second tray would have to have been for it to settle anything, and the class has designed the test themselves.",
  },
  28: {
    story:
      "The meter read sixty cubic metres a quarter last year and a hundred and eighty-nine this quarter. The cistern in the disabled toilet has been overflowing quietly into the pan since the handle was changed in January. The flow was caught in a jug and timed at nine hundred millilitres a minute. That is one and three tenths of a cubic metre a day, or a hundred and sixteen across a quarter. A trickle nobody can hear is using nearly twice what the whole school used last year. The kitchen's new dishwasher has a drain valve that sticks open, so the machine refills between cycles. The sub-meter under the kitchen read a hundred and twenty-two cubic metres this quarter. Its maker rates the machine at four, which is what the office budgeted for. The garden hose was put on a timer in February and has run four hours a night since. Four hours a night at the measured flow is a hundred and ten cubic metres across a quarter. The fortnight that metered the hose at three was run in January, before the timer went on. Forty more pupils joined, which at four litres a head a day is roughly six cubic metres in a quarter. The hand dryers that replaced the paper towels use no water whatsoever.",
    q: "Why has the water tripled? Choose one cause and prove it with the meter.",
    why: [
      "a cistern trickling nine hundred millilitres a minute since January",
      "forty more pupils, roughly six cubic metres in a quarter",
      "a kitchen sub-meter reading a hundred and twenty-two against a rating of four",
      "a hose on a timer four hours a night since February",
      "hand dryers in place of paper towels, using no water whatsoever",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“The flow was caught in a jug and timed at nine hundred millilitres a minute.”", "“That is one and three tenths of a cubic metre a day, or a hundred and sixteen across a quarter.”"], but: "“The sub-meter under the kitchen read a hundred and twenty-two cubic metres this quarter.”" },
      { who: 2, ev: ["“The kitchen's new dishwasher has a drain valve that sticks open, so the machine refills between cycles.”", "“The sub-meter under the kitchen read a hundred and twenty-two cubic metres this quarter.”"], but: "“Four hours a night at the measured flow is a hundred and ten cubic metres across a quarter.”" },
      { who: 3, ev: ["“The garden hose was put on a timer in February and has run four hours a night since.”", "“Four hours a night at the measured flow is a hundred and ten cubic metres across a quarter.”"], but: "“The flow was caught in a jug and timed at nine hundred millilitres a minute.”" },
    ],
    clears: [
      "Forty more pupils: “Forty more pupils joined, which at four litres a head a day is roughly six cubic metres in a quarter.”",
      "The hand dryers: “The hand dryers that replaced the paper towels use no water whatsoever.”",
    ],
    note:
      "A hundred and sixteen, a hundred and twenty-two and a hundred and ten come to three hundred and forty-eight, and the bill rose by a hundred and twenty-nine. At most one of these three can be right, and the kitchen sub-meter is the only one of them that was actually read rather than calculated from a rate. Measured beats computed, every time.",
  },
  29: {
    story:
      "The sunflowers reached one metre twenty where the packet promises three metres, and four causes have been named. The seed was sown along the row at ten centimetres apart where the packet asks for forty-five. A hundred and four plants are growing in a bed laid out for twelve. Each one has about a twentieth of the root space and the leaf room the spacing assumes. Three plants left at the end of the row, forty-five centimetres clear of their neighbours, are two metres eighty. The new fence went up in May and the bed now gets forty minutes of direct sun, not four hours. The trial bed held under an hour of sun all summer and its plants stopped at one metre ten. A sunflower is named for what it needs, and forty minutes is nothing like eight hours. The water butt ran dry on the ninth of July and was not refilled until the fourth of August. The bed had no water at all through twenty-six days of the hottest month on record. Trial plants held dry for three weeks in the same heat stopped at one metre fifteen. The compost was not fed after June, which cost the trial plants about fifteen centimetres. Slug damage was counted on every stem and showed on nine plants out of a hundred and four.",
    q: "Why did they stop at waist height? Pick one cause and show the figures.",
    why: [
      "a hundred and four plants in a bed laid out for twelve",
      "forty minutes of direct sun since the new fence went up in May",
      "no feed after June, worth about fifteen centimetres on the trial plants",
      "twenty-six days with no water at all in the hottest month on record",
      "slug damage on nine plants out of a hundred and four",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“A hundred and four plants are growing in a bed laid out for twelve.”", "“Three plants left at the end of the row, forty-five centimetres clear of their neighbours, are two metres eighty.”"], but: "“The trial bed held under an hour of sun all summer and its plants stopped at one metre ten.”" },
      { who: 1, ev: ["“The new fence went up in May and the bed now gets forty minutes of direct sun, not four hours.”", "“The trial bed held under an hour of sun all summer and its plants stopped at one metre ten.”"], but: "“Three plants left at the end of the row, forty-five centimetres clear of their neighbours, are two metres eighty.”" },
      { who: 3, ev: ["“The water butt ran dry on the ninth of July and was not refilled until the fourth of August.”", "“Trial plants held dry for three weeks in the same heat stopped at one metre fifteen.”"], but: "“Each one has about a twentieth of the root space and the leaf room the spacing assumes.”" },
    ],
    clears: [
      "No feeding after June: “The compost was not fed after June, which cost the trial plants about fifteen centimetres.”",
      "Slugs: “Slug damage was counted on every stem and showed on nine plants out of a hundred and four.”",
    ],
    note:
      "The three plants at the end of the row stood in the same shade and the same drought and reached two metres eighty. That single comparison answers the sun and the water at once, because whatever they suffered, those three suffered it too. A class that leads with those three has found the control hiding inside the case.",
  },
  30: {
    story:
      "The six hens laid twenty-eight eggs a week in July and nine a week in late October, and four causes have been suggested. Daylight in the run has fallen from sixteen hours in July to nine hours now. The guide is blunt about it: laying falls away sharply below twelve hours and stops near nine. Light reaching the eye is what tells a hen the season, and nothing about a sack of feed changes that. The neighbour's flock under a lamp on a timer is still laying at July's rate. Five of the six birds are in full moult, not the two the keeper counted from the doorway. A hen in full moult puts everything into feathers and lays nothing at all for six to eight weeks. Five birds laying nothing out of six would leave about five eggs a week, and nine are coming. The feed was changed in August to a brand printing the same protein figure on the sack. The county lab tested that sack in October and found nine percent protein against the sixteen a layer needs. A hen short of protein by nearly half cannot build a shell, let alone a clutch. Cold nights make a modest difference that the poultry guide declines to call a main cause. A fox got into the garden in September, which is worth a few days of laying and not a season.",
    q: "Why have the eggs stopped? Choose one cause and prove it from the guide.",
    why: [
      "sixteen hours of daylight in July against nine hours now",
      "five of the six birds in full moult, not the two counted from the doorway",
      "cold nights, which the guide declines to call a main cause",
      "a fox in September, worth a few days of laying and not a season",
      "a sack tested at nine percent protein where a layer needs sixteen",
    ],
    open: [0, 1, 4],
    for: [
      { who: 0, ev: ["“Daylight in the run has fallen from sixteen hours in July to nine hours now.”", "“The neighbour's flock under a lamp on a timer is still laying at July's rate.”"], but: "“Five birds laying nothing out of six would leave about five eggs a week, and nine are coming.”" },
      { who: 1, ev: ["“Five of the six birds are in full moult, not the two the keeper counted from the doorway.”", "“A hen in full moult puts everything into feathers and lays nothing at all for six to eight weeks.”"], but: "“Five birds laying nothing out of six would leave about five eggs a week, and nine are coming.”" },
      { who: 4, ev: ["“The county lab tested that sack in October and found nine percent protein against the sixteen a layer needs.”", "“A hen short of protein by nearly half cannot build a shell, let alone a clutch.”"], but: "“The neighbour's flock under a lamp on a timer is still laying at July's rate.”" },
    ],
    clears: [
      "The cold nights: “Cold nights make a modest difference that the poultry guide declines to call a main cause.”",
      "The fox: “A fox got into the garden in September, which is worth a few days of laying and not a season.”",
    ],
    note:
      "Nine eggs a week from six hens, five of which should be laying nothing, is the arithmetic that breaks the moult answer. The neighbour's lamp is the best evidence in the case because it holds the season constant and changes only the light. Ask what the neighbour feeds, and notice that nobody checked.",
  },
  31: {
    story:
      "General waste has gone from six bins a week to fourteen and four causes are being argued over. The canteen changed in September from washable trays to single-use boxes, cups and cutlery. Twelve hundred meals a day now leave four disposable items each behind them. Forty-eight hundred items a day is twenty-four thousand a week, and the bin measurements put that at six bins. Nothing else on the list produces rubbish every single day the school is open. The hired skip was taken away at the end of week two with the refit only half done. Everything broken out since has gone into the general bins, at about four bins a week by the caretaker's count. The site diary records rubble going into those bins on thirty-one days since October. The paper recycling has been refused every week since September, not the three weeks the office remembers. A refused load is tipped into general waste, and the contractor logs each one at five bins. Five bins a week of paper is more than the whole rise on its own. Forty more pupils is a seven percent rise on a roll of six hundred, or half a bin at the outside. The hedge was cut once in September, filling two bins, and has not been touched since.",
    q: "Why has the waste more than doubled? Pick one cause and show the numbers.",
    why: [
      "forty-eight hundred disposable items a day from the canteen",
      "a seven percent rise on six hundred, or half a bin at the outside",
      "a skip taken away in week two, with rubble logged on thirty-one days",
      "recycling refused every week since September, at five bins a load",
      "one hedge cut in September, filling two bins",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“Twelve hundred meals a day now leave four disposable items each behind them.”", "“Forty-eight hundred items a day is twenty-four thousand a week, and the bin measurements put that at six bins.”"], but: "“Five bins a week of paper is more than the whole rise on its own.”" },
      { who: 2, ev: ["“The hired skip was taken away at the end of week two with the refit only half done.”", "“The site diary records rubble going into those bins on thirty-one days since October.”"], but: "“Nothing else on the list produces rubbish every single day the school is open.”" },
      { who: 3, ev: ["“The paper recycling has been refused every week since September, not the three weeks the office remembers.”", "“A refused load is tipped into general waste, and the contractor logs each one at five bins.”"], but: "“Everything broken out since has gone into the general bins, at about four bins a week by the caretaker's count.”" },
    ],
    clears: [
      "Forty more pupils: “Forty more pupils is a seven percent rise on a roll of six hundred, or half a bin at the outside.”",
      "Hedge cuttings: “The hedge was cut once in September, filling two bins, and has not been touched since.”",
    ],
    note:
      "Six plus four plus five is fifteen bins of new waste against a rise of eight. Two of these three are counting the same bins, and the likeliest double is the rubble, because a caretaker counting bins of rubble is counting bins that also hold refused paper. Ask who did each count and what they were looking for.",
  },
  32: {
    story:
      "The camera is rated at four hundred shots a charge and managed forty on the trip, and four drains have been blamed. The wireless was switched on in September and has been hunting for a network ever since. The manual says a camera searching for a network with nothing to join drains a full pack in ninety minutes. It does that whether the camera is taking photographs or sitting in a bag. The trip lasted six hours, and the shots were simply what happened to be taken while the pack emptied. The thermometer on the rucksack read minus eighteen on the ridge, not the minus two forecast for the valley. The maker's table stops at minus ten, with a note that a pack below that delivers under a tenth of its charge. A tenth of four hundred is forty, which is the number of shots that were taken. The pack is eleven years old and its serial number is from the camera's first production run. The shop put it on a test rig in November and measured it holding eleven percent of its rated charge. Eleven percent of four hundred is forty-four, and forty shots were taken. The screen was left on maximum brightness, which that table prices at fifteen percent. The flash fired on twelve of the forty shots, worth a few percent across a day.",
    q: "Why did the battery last forty shots? Choose one and prove it with a figure.",
    why: [
      "a wireless hunting since September, draining a pack in ninety minutes",
      "minus eighteen on the ridge, below where the maker's table stops",
      "a screen on maximum brightness, priced at fifteen percent",
      "an eleven year old pack measured at eleven percent on a test rig",
      "a flash on twelve of forty shots, worth a few percent across a day",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The manual says a camera searching for a network with nothing to join drains a full pack in ninety minutes.”", "“The trip lasted six hours, and the shots were simply what happened to be taken while the pack emptied.”"], but: "“Eleven percent of four hundred is forty-four, and forty shots were taken.”" },
      { who: 1, ev: ["“The thermometer on the rucksack read minus eighteen on the ridge, not the minus two forecast for the valley.”", "“The maker's table stops at minus ten, with a note that a pack below that delivers under a tenth of its charge.”"], but: "“It does that whether the camera is taking photographs or sitting in a bag.”" },
      { who: 3, ev: ["“The pack is eleven years old and its serial number is from the camera's first production run.”", "“The shop put it on a test rig in November and measured it holding eleven percent of its rated charge.”"], but: "“A tenth of four hundred is forty, which is the number of shots that were taken.”" },
    ],
    clears: [
      "The bright screen: “The screen was left on maximum brightness, which that table prices at fifteen percent.”",
      "The flash: “The flash fired on twelve of the forty shots, worth a few percent across a day.”",
    ],
    note:
      "Two separate answers land on forty and forty-four, and a number that lands exactly is a number to distrust. The test rig is the only measurement taken on this pack rather than read off a table, and it was taken in November in a warm shop. Ask what that rig would have read on the ridge.",
  },
  33: {
    story:
      "All twenty-four bean plants in the growth experiment died in eleven days and four causes have been written up. The liquid feed was made up at five millilitres into five hundred millilitres of water. The label says five millilitres into five litres, so the solution is ten times the strength intended. A feed at ten times strength pulls water back out of the roots instead of giving anything to them. The control tray, fed from a bottle mixed by the technician, is forty centimetres tall. The radiator behind the bench was uncapped in week one when the heating was rebalanced. A probe left on the bench recorded fifty-one degrees every afternoon from the Tuesday on. A bean plant above forty degrees for an hour loses its leaves and does not get them back. The control tray stands under a drip line that waters it every morning without fail. The experiment tray was hand watered on alternate days by whoever remembered. Its pots were weighed bone dry on day six and again on day nine, and a bean dies in two dry days. The pots are seven centimetres where the method specifies nine, which crowds roots at four weeks and not at eleven days. The lamp sat fifty centimetres above the plants rather than thirty, and a high lamp only weakens a seedling slowly.",
    q: "Why did all twenty-four die? Pick one cause and prove it from the method.",
    why: [
      "feed mixed at ten times the strength the label gives",
      "a probe on the bench reading fifty-one degrees every afternoon",
      "seven centimetre pots, which crowd roots at four weeks not eleven days",
      "pots weighed bone dry on day six and again on day nine",
      "a lamp at fifty centimetres, which only weakens a seedling slowly",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The label says five millilitres into five litres, so the solution is ten times the strength intended.”", "“The control tray, fed from a bottle mixed by the technician, is forty centimetres tall.”"], but: "“Its pots were weighed bone dry on day six and again on day nine, and a bean dies in two dry days.”" },
      { who: 1, ev: ["“A probe left on the bench recorded fifty-one degrees every afternoon from the Tuesday on.”", "“A bean plant above forty degrees for an hour loses its leaves and does not get them back.”"], but: "“The control tray, fed from a bottle mixed by the technician, is forty centimetres tall.”" },
      { who: 3, ev: ["“The control tray stands under a drip line that waters it every morning without fail.”", "“Its pots were weighed bone dry on day six and again on day nine, and a bean dies in two dry days.”"], but: "“A feed at ten times strength pulls water back out of the roots instead of giving anything to them.”" },
    ],
    clears: [
      "The small pots: “The pots are seven centimetres where the method specifies nine, which crowds roots at four weeks and not at eleven days.”",
      "The lamp too high: “The lamp sat fifty centimetres above the plants rather than thirty, and a high lamp only weakens a seedling slowly.”",
    ],
    note:
      "The control tray is on the same bench, in the same fifty-one degrees, and it is forty centimetres tall. That sentence should end the heat answer, and the fact that it usually does not is worth showing a class. The control differs from the experiment in two ways, the feed and the watering, so it cannot separate those two.",
  },
  34: {
    story:
      "Two kilograms of ice cream was bought to give forty servings and it ran out after fourteen. The recipe sheet assumes a number twenty scoop, which holds forty-five millilitres. The scoop in the kitchen drawer is a number eight, which holds a hundred and twenty. Every serving went out at nearly three times the size the plan was written for. Two thousand grams divided by three times fifty is thirteen servings, and the fourteenth was the scrapings. The tally pencilled on the lid records fifteen tastings, not the six anyone admits to. Each tasting was served with the serving scoop rather than a teaspoon, at a hundred and twenty millilitres. Fifteen at a hundred and twenty is eighteen hundred millilitres, which is nearly the whole tub. The tub came out of the freezer at minus twenty-two and the server broke chunks off with a knife. Those chunks were weighed on the kitchen scales at between ninety and two hundred and ten grams. A plan written for fifty gram servings cannot survive a hundred and fifty gram chunk. The drip tray under the tub was weighed at the end at sixty grams. A careful scrape put the loss on the walls and the scoop at forty grams.",
    q: "Why did it only serve fourteen? Choose one cause and show the arithmetic.",
    why: [
      "a number eight scoop at a hundred and twenty where the sheet assumes forty-five",
      "a drip tray weighed at the end at sixty grams",
      "fifteen tastings on the lid tally, each at a hundred and twenty millilitres",
      "forty grams scraped off the walls and the scoop",
      "chunks knifed off a frozen tub at ninety to two hundred and ten grams",
    ],
    open: [0, 2, 4],
    for: [
      { who: 0, ev: ["“The scoop in the kitchen drawer is a number eight, which holds a hundred and twenty.”", "“Two thousand grams divided by three times fifty is thirteen servings, and the fourteenth was the scrapings.”"], but: "“Those chunks were weighed on the kitchen scales at between ninety and two hundred and ten grams.”" },
      { who: 2, ev: ["“The tally pencilled on the lid records fifteen tastings, not the six anyone admits to.”", "“Fifteen at a hundred and twenty is eighteen hundred millilitres, which is nearly the whole tub.”"], but: "“Two kilograms of ice cream was bought to give forty servings and it ran out after fourteen.”" },
      { who: 4, ev: ["“The tub came out of the freezer at minus twenty-two and the server broke chunks off with a knife.”", "“Those chunks were weighed on the kitchen scales at between ninety and two hundred and ten grams.”"], but: "“Every serving went out at nearly three times the size the plan was written for.”" },
    ],
    clears: [
      "The drip tray: “The drip tray under the tub was weighed at the end at sixty grams.”",
      "Waste on the tub walls: “A careful scrape put the loss on the walls and the scoop at forty grams.”",
    ],
    note:
      "The scoop answer and the chunk answer are the same complaint: servings three times the planned size. They differ only in whether the scoop or the knife decided that, and the weights overlap almost exactly. The tastings answer is the one that would mean fourteen servings and fifteen tastings out of a forty serving tub, which is its own kind of story.",
  },
  35: {
    story:
      "A thousand ribbons went out with a suggested donation of a pound fifty and the appeal raised four hundred and ten pounds. A count of a hundred consecutive donations gave an average of forty-two pence. Eight hundred and twenty ribbons at forty-two pence is three hundred and forty-four pounds. A suggested donation is a suggestion, and the arithmetic treated it as a price. Nobody did anything wrong, and the plan was built on a number that was never going to be collected. The boxes returned to the office on the Friday held seven hundred and ten ribbons, not the hundred and eighty first counted. Seven hundred and ten unsold at the suggested figure is a thousand and sixty-five pounds that was never asked for. A ribbon still in a box has not been refused, it has not been offered. The giving tally records two hundred and forty ribbons handed out free to helpers, governors and the two feeder schools. Two hundred and forty at a pound fifty is three hundred and sixty pounds of the target given away. Nobody told the helpers that the free ribbons came out of the same thousand. The ribbons cost a hundred and twenty pounds, money that left the account and was never in the target. Nine pounds in foreign coins went into the tin and no bank would take them.",
    q: "Why did the appeal raise four hundred? Pick one reason and show the figures.",
    why: [
      "a hundred donations averaging forty-two pence against a suggested pound fifty",
      "seven hundred and ten ribbons back in the boxes on Friday",
      "a hundred and twenty pounds of ribbons, never in the target",
      "two hundred and forty ribbons handed out free to helpers and governors",
      "nine pounds in foreign coins no bank would take",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“A count of a hundred consecutive donations gave an average of forty-two pence.”", "“A suggested donation is a suggestion, and the arithmetic treated it as a price.”"], but: "“The boxes returned to the office on the Friday held seven hundred and ten ribbons, not the hundred and eighty first counted.”" },
      { who: 1, ev: ["“The boxes returned to the office on the Friday held seven hundred and ten ribbons, not the hundred and eighty first counted.”", "“A ribbon still in a box has not been refused, it has not been offered.”"], but: "“Eight hundred and twenty ribbons at forty-two pence is three hundred and forty-four pounds.”" },
      { who: 3, ev: ["“The giving tally records two hundred and forty ribbons handed out free to helpers, governors and the two feeder schools.”", "“Two hundred and forty at a pound fifty is three hundred and sixty pounds of the target given away.”"], but: "“A ribbon still in a box has not been refused, it has not been offered.”" },
    ],
    clears: [
      "The cost of the ribbons: “The ribbons cost a hundred and twenty pounds, money that left the account and was never in the target.”",
      "Foreign coins: “Nine pounds in foreign coins went into the tin and no bank would take them.”",
    ],
    note:
      "Seven hundred and ten back in the boxes and two hundred and forty given away leaves fifty ribbons to have raised four hundred and ten pounds, at over eight pounds each. The counts cannot all be right, and the forty-two pence average assumed eight hundred and twenty were handed over. Ask which number somebody actually counted and which was assumed to make the sum work.",
  },
  36: {
    story:
      "The helium cylinder is labelled for four hundred and fifty balloons and it filled ninety. The label's figure assumes a balloon blown to twenty-three centimetres across, which is the size printed on the packet. The ones filled on the day measured thirty-eight centimetres, because a bigger balloon looked better. Volume goes with the cube of the width, and thirty-eight divided by twenty-three, cubed, is about four and a half. Four hundred and fifty divided by four and a half is a hundred, which is close to the ninety that were filled. The nozzle was left open on the bench over the lunch hour and found a quarter turn on at two. A timed test put that leak at nine litres a minute with the valve in that position. Ninety minutes at nine litres is eight hundred litres, which is well over half the cylinder. The supplier's docket shows this cylinder came back part-used in March and went out again without a refill. Its gauge read nineteen percent when the caretaker wheeled it into the hall, not the ninety-five anyone remembers. A fifth of a cylinder fills about ninety balloons at the label's own size. The hall was cold, and a cold gas takes up less room, which moves the gauge rather than the balloon count. Three of the balloons burst as they were filled and were swept up before the count began.",
    q: "Why did it only fill ninety? Choose one cause and prove it with the arithmetic.",
    why: [
      "balloons at thirty-eight centimetres where the label assumes twenty-three",
      "a nozzle a quarter turn open for the whole lunch hour",
      "a cold hall, which moves the gauge rather than the balloon count",
      "a gauge reading nineteen percent on a cylinder returned part-used in March",
      "three balloons burst in the filling and swept up before the count",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The ones filled on the day measured thirty-eight centimetres, because a bigger balloon looked better.”", "“Four hundred and fifty divided by four and a half is a hundred, which is close to the ninety that were filled.”"], but: "“Its gauge read nineteen percent when the caretaker wheeled it into the hall, not the ninety-five anyone remembers.”" },
      { who: 1, ev: ["“The nozzle was left open on the bench over the lunch hour and found a quarter turn on at two.”", "“Ninety minutes at nine litres is eight hundred litres, which is well over half the cylinder.”"], but: "“Volume goes with the cube of the width, and thirty-eight divided by twenty-three, cubed, is about four and a half.”" },
      { who: 3, ev: ["“Its gauge read nineteen percent when the caretaker wheeled it into the hall, not the ninety-five anyone remembers.”", "“A fifth of a cylinder fills about ninety balloons at the label's own size.”"], but: "“The ones filled on the day measured thirty-eight centimetres, because a bigger balloon looked better.”" },
    ],
    clears: [
      "The cold hall: “The hall was cold, and a cold gas takes up less room, which moves the gauge rather than the balloon count.”",
      "Burst balloons: “Three of the balloons burst as they were filled and were swept up before the count began.”",
    ],
    note:
      "Two answers land on ninety and the third takes half the cylinder, which between them is well past what a cylinder holds. The last case of grade 11 should end on the habit the whole grade is for: when three numbers each explain everything, the question is no longer which cause is operating but which measurement was taken, by whom, and when.",
  },
};
