/**
 * Grade 2, the debate version of each case. See scripts/mysteries/g5.debate.mjs
 * for what these files are and what the gate holds them to.
 *
 * Grade 2 runs fifty to seventy-six words in sentences of ten, which is not
 * room for three arguments of two quotes each. The gate asks for one quote
 * per suspect below grade 4, and most of these give two where they can.
 *
 * What a seven-year-old is learning here is smaller than an argument and it
 * is the thing every later grade is built on: find the words, say them out
 * loud, and say what they show. The debate version only changes what happens
 * after that, which is that the child next to them found different words.
 */
export const DEBATES = {
  1: {
    story:
      "A library book came back with wet pages. The book was in Sam's blue bag. Sam's water bottle was in the same bag. The lid was not screwed on. Ava had the book last week. It rained hard on the day she walked home. Sam's bag has a hole in the bottom. The wet spot is on the back cover.",
    q: "What made the book wet? Say who, and read out the words.",
    why: [
      "a bottle in the same bag with the lid not screwed on",
      "had the book last week, when it rained hard",
      "hard rain, and a bag with a hole in the bottom",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Sam's water bottle was in the same bag.”", "“The lid was not screwed on.”"], but: "“It rained hard on the day she walked home.”" },
      { who: 1, ev: ["“Ava had the book last week.”"], but: "“The wet spot is on the back cover.”" },
      { who: 2, ev: ["“It rained hard on the day she walked home.”", "“Sam's bag has a hole in the bottom.”"], but: "“Sam's water bottle was in the same bag.”" },
    ],
    clears: [],
    note:
      "Ask where the wet spot is and what sits there. A bottle lying on its side wets the middle; rain through a hole in the bottom wets the back cover. The children do not need the word evidence to do this. They need to point.",
  },
  2: {
    story:
      "Mia packed apple slices in a snack bag. At lunch the bag was empty. The bag had a small hole in one corner. A line of slices lay in her backpack. Jo sat next to Mia on the bus. Mia had a sticky hand at nine o'clock. The slices in the bag were still cold.",
    q: "Where did the apple slices go? Pick one and show the words.",
    why: [
      "a hole in one corner, with a line of slices in the pack",
      "sat next to Mia on the bus",
      "a sticky hand at nine o'clock",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The bag had a small hole in one corner.”", "“A line of slices lay in her backpack.”"], but: "“Mia had a sticky hand at nine o'clock.”" },
      { who: 1, ev: ["“Jo sat next to Mia on the bus.”"], but: "“A line of slices lay in her backpack.”" },
      { who: 2, ev: ["“Mia had a sticky hand at nine o'clock.”"], but: "“The bag had a small hole in one corner.”" },
    ],
    clears: [],
    note:
      "A line of slices is the picture to draw on the board. Things that fall make a line; things that are eaten do not. Sitting next to somebody is not evidence of anything, and saying so is a fine answer for a seven-year-old.",
  },
  3: {
    story:
      "Ben's new pencil was long on Monday. On Friday it was very short. The sharpener was full of his shavings. Ben sharpens after every page. Ben left his pencil on the rug on Wednesday. Two pencils in the cup look just like his. Ben's name is not on any of them.",
    q: "Why is Ben's pencil short? Choose one and read out the words.",
    why: [
      "a sharpener full of his shavings, after every page",
      "left on the rug on Wednesday",
      "two in the cup that look just like his, with no name",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The sharpener was full of his shavings.”", "“Ben sharpens after every page.”"], but: "“Ben left his pencil on the rug on Wednesday.”" },
      { who: 1, ev: ["“Ben left his pencil on the rug on Wednesday.”"], but: "“The sharpener was full of his shavings.”" },
      { who: 2, ev: ["“Two pencils in the cup look just like his.”", "“Ben's name is not on any of them.”"], but: "“Ben sharpens after every page.”" },
    ],
    clears: [],
    note:
      "If the pencil is short, it is still his pencil and it got smaller. If it was swapped, the short one belongs to somebody else. Ask the class which story the shavings fit, and then ask how Ben could ever tell his pencil from the others.",
  },
  4: {
    story:
      "Room 5 picked apples on Monday. By Friday six were soft and brown. The six soft ones sat in a sunny spot. The rest sat in the cool hall. The six came off the low branch by the road. The crate was dropped once on the way in. Warm air makes an apple go soft fast.",
    q: "Why did six apples go soft? Say which one, and show the words.",
    why: [
      "a sunny spot, where warm air makes an apple soft fast",
      "all six off the low branch by the road",
      "a crate dropped once on the way in",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The six soft ones sat in a sunny spot.”", "“Warm air makes an apple go soft fast.”"], but: "“The six came off the low branch by the road.”" },
      { who: 1, ev: ["“The six came off the low branch by the road.”"], but: "“The rest sat in the cool hall.”" },
      { who: 2, ev: ["“The crate was dropped once on the way in.”"], but: "“The six soft ones sat in a sunny spot.”" },
    ],
    clears: [],
    note:
      "The same six apples came off one branch and sat in one sunny spot, so the case has two answers pointing at the same fruit. That is worth saying plainly. Children who notice the six are the same six, twice over, have found the hard part.",
  },
  5: {
    story:
      "Lin's bike squeaked on every ride. The squeak came from the back wheel. The chain was dry and dusty. The back tire was soft and rubbed the frame. The back brake pad touched the wheel all the time. Her dad put oil on the chain. The squeak got quieter but did not stop.",
    q: "What is squeaking? Pick one and read out the words.",
    why: [
      "a chain that was dry and dusty",
      "a soft back tire that rubbed the frame",
      "a back pad touching the wheel all the time",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The chain was dry and dusty.”", "“Her dad put oil on the chain.”"], but: "“The squeak got quieter but did not stop.”" },
      { who: 1, ev: ["“The back tire was soft and rubbed the frame.”"], but: "“The chain was dry and dusty.”" },
      { who: 2, ev: ["“The back brake pad touched the wheel all the time.”"], but: "“Her dad put oil on the chain.”" },
    ],
    clears: [],
    note:
      "Quieter but not stopped is the whole case in four words. Something was fixed and something is left. Ask the class what that tells them, and look for the child who says there must be two squeaks.",
  },
  6: {
    story:
      "The fish tank water turned green. The tank sits in front of a sunny window. Green plants grow fast in sunlight. The filter has not been washed since the fall. Two helpers both fed the fish on Friday. A second tank sits in the dark hall. That water is still clear.",
    q: "Why did the water turn green? Choose one and show the words.",
    why: [
      "a sunny window, where green plants grow fast",
      "a filter not washed since the fall",
      "two helpers who both fed the fish on Friday",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The tank sits in front of a sunny window.”", "“A second tank sits in the dark hall.”"], but: "“The filter has not been washed since the fall.”" },
      { who: 1, ev: ["“The filter has not been washed since the fall.”"], but: "“That water is still clear.”" },
      { who: 2, ev: ["“Two helpers both fed the fish on Friday.”"], but: "“Green plants grow fast in sunlight.”" },
    ],
    clears: [],
    note:
      "The dark hall tank is the one to keep coming back to. Same room, same food, no sun, clear water. Children who use it are comparing two things on purpose, which is the beginning of every experiment they will ever run.",
  },
  7: {
    story:
      "A buzz came from the ceiling in Room 2. It buzzed only in the morning. One long light bulb flickers when it buzzes. The class turns the lights on at eight. The clock buzzes too when its battery is low. A bee nest sits under the roof outside that wall. Bees are busy in the morning sun.",
    q: "What is buzzing? Pick one and read out the words.",
    why: [
      "a long bulb that flickers when it buzzes",
      "a clock that buzzes when its battery is low",
      "a nest under the roof, and bees busy in the morning",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“One long light bulb flickers when it buzzes.”", "“The class turns the lights on at eight.”"], but: "“A bee nest sits under the roof outside that wall.”" },
      { who: 1, ev: ["“The clock buzzes too when its battery is low.”"], but: "“One long light bulb flickers when it buzzes.”" },
      { who: 2, ev: ["“A bee nest sits under the roof outside that wall.”", "“Bees are busy in the morning sun.”"], but: "“The class turns the lights on at eight.”" },
    ],
    clears: [],
    note:
      "Two things happen in the morning here: the lights go on and the bees wake up. Only in the morning used to point at one answer and now it points at two. The flickering bulb is the only clue you can see as well as hear.",
  },
  8: {
    story:
      "Room 3 raked leaves into one big pile. The next day the leaves were spread out. A strong wind blew all night long. The leaves lie in a long line. Two small footprints sit at the edge of the pile. The gate was open on Tuesday night. Dog hair is caught in the leaves.",
    q: "What spread the leaves? Say which one, and show the words.",
    why: [
      "a strong wind all night, and leaves in a long line",
      "two small footprints at the edge of the pile",
      "an open gate, and dog hair caught in the leaves",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A strong wind blew all night long.”", "“The leaves lie in a long line.”"], but: "“Two small footprints sit at the edge of the pile.”" },
      { who: 1, ev: ["“Two small footprints sit at the edge of the pile.”"], but: "“A strong wind blew all night long.”" },
      { who: 2, ev: ["“The gate was open on Tuesday night.”", "“Dog hair is caught in the leaves.”"], but: "“The leaves lie in a long line.”" },
    ],
    clears: [],
    note:
      "A long line is a shape, and shapes are evidence. Ask what shape a dog would leave and what shape a child jumping in would leave. Two footprints at the edge mean somebody stood there, which is not the same as somebody spreading leaves.",
  },
  9: {
    story:
      "The class pumpkin sat by the door. On Monday a puddle was under it. The bottom of the pumpkin was soft. The puddle is right under the soft spot. A thin cut runs across the lid where it was lifted. Small teeth marks show near the stem. The pumpkin is ten days old.",
    q: "Why is there a puddle? Pick one and read out the words.",
    why: [
      "a soft bottom, with the puddle right under it",
      "a thin cut across the lid where it was lifted",
      "small teeth marks near the stem",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The bottom of the pumpkin was soft.”", "“The puddle is right under the soft spot.”"], but: "“A thin cut runs across the lid where it was lifted.”" },
      { who: 1, ev: ["“A thin cut runs across the lid where it was lifted.”"], but: "“The puddle is right under the soft spot.”" },
      { who: 2, ev: ["“Small teeth marks show near the stem.”"], but: "“The bottom of the pumpkin was soft.”" },
    ],
    clears: [],
    note:
      "Right under is the phrase that does the work. Water comes out at the bottom and runs down, so the puddle sits where the hole is. The cut and the teeth marks are both near the top, and children can be asked what that means for a puddle on the floor.",
  },
  10: {
    story:
      "White footprints went down the hall. They came from the art room. The art class used white paint today. Each print is the size of a child's shoe. The paint tray sat on the floor. Mr. Ruiz keeps white shoes for the gym. A dog came in with the office helper at ten.",
    q: "Who left the white prints? Choose one and show the words.",
    why: [
      "small prints from the art room, with the tray on the floor",
      "keeps white shoes for the gym",
      "came in with the office helper at ten",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The art class used white paint today.”", "“The paint tray sat on the floor.”"], but: "“Mr. Ruiz keeps white shoes for the gym.”" },
      { who: 1, ev: ["“Mr. Ruiz keeps white shoes for the gym.”"], but: "“Each print is the size of a child's shoe.”" },
      { who: 2, ev: ["“A dog came in with the office helper at ten.”"], but: "“They came from the art room.”" },
    ],
    clears: [],
    note:
      "White shoes and white paint are two different whites, and that is a lovely thing for a class to untangle. A shoe print and a paw print look different too. Ask what the prints would look like for each suspect before anybody chooses.",
  },
  11: {
    story:
      "Theo could not find his red coat. He wore it on the bus. The driver found a red coat on seat 4. Theo always sits in seat 4. Two boys in his class have red coats. His mom has not looked in the car yet. He hung a coat in his cubby at nine.",
    q: "Where is the coat? Pick one and read out the words.",
    why: [
      "a red coat on seat 4, where he always sits",
      "a car that nobody has looked in yet",
      "a coat hung in his cubby at nine",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The driver found a red coat on seat 4.”", "“Theo always sits in seat 4.”"], but: "“Two boys in his class have red coats.”" },
      { who: 1, ev: ["“His mom has not looked in the car yet.”"], but: "“He wore it on the bus.”" },
      { who: 2, ev: ["“He hung a coat in his cubby at nine.”"], but: "“The driver found a red coat on seat 4.”" },
    ],
    clears: [],
    note:
      "Two boys with red coats is the sentence that makes this hard. A red coat on seat 4 is a red coat. Ask the children how Theo could be sure it is his, and somebody will say to look inside it for his name.",
  },
  12: {
    story:
      "The reading trophy looked shiny in the fall. Now it looks gray. The shelf is next to an open window. Gray dust sits on the window sill. The trophy was passed around the class in November. Its gold coat is worn thin at the handles. A wipe with a cloth made it shiny again.",
    q: "Why does the trophy look gray? Say which one, and show the words.",
    why: [
      "gray dust on the sill beside an open window",
      "passed around the whole class in November",
      "a gold coat worn thin at the handles",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Gray dust sits on the window sill.”", "“The shelf is next to an open window.”"], but: "“The trophy was passed around the class in November.”" },
      { who: 1, ev: ["“The trophy was passed around the class in November.”"], but: "“A wipe with a cloth made it shiny again.”" },
      { who: 2, ev: ["“Its gold coat is worn thin at the handles.”"], but: "“A wipe with a cloth made it shiny again.”" },
    ],
    clears: [],
    note:
      "A wipe fixed it, and that one fact decides a lot. Dust comes off on a cloth. Worn paint does not come back. Ask the class what a cloth can and cannot do, and the answer sorts itself out.",
  },
  13: {
    story:
      "The class made rolls for the fall feast. The rolls came out cold in the middle. Ten rolls were stacked in one pan. The rolls on the edge were warm. The oven door does not shut all the way. The timer rang before anyone set it twice. Rolls in the middle of a stack stay cold.",
    q: "Why were the rolls cold inside? Choose one and read out the words.",
    why: [
      "ten in one pan, where the middle of a stack stays cold",
      "a door that does not shut all the way",
      "a timer that rang before anyone set it twice",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Ten rolls were stacked in one pan.”", "“Rolls in the middle of a stack stay cold.”"], but: "“The oven door does not shut all the way.”" },
      { who: 1, ev: ["“The oven door does not shut all the way.”"], but: "“The rolls on the edge were warm.”" },
      { who: 2, ev: ["“The timer rang before anyone set it twice.”"], but: "“The rolls on the edge were warm.”" },
    ],
    clears: [],
    note:
      "The rolls on the edge were warm, and that sentence beats two of the three answers on its own. A cold oven or a short time makes every roll cold. Only the stack makes the middle ones cold and the edge ones warm.",
  },
  14: {
    story:
      "Room 1 baked cupcakes for a party. Each one sank in the middle. The class opened the oven three times to look. Cool air makes a cake fall. The batter was stirred for ten minutes. The oven dial sits between two numbers. Nobody wrote the heat down. The edges rose fine.",
    q: "Why did the cupcakes sink? Pick one and show the words.",
    why: [
      "a door opened three times, and cool air makes a cake fall",
      "batter stirred for ten minutes",
      "a dial sitting between two numbers, with nothing written down",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The class opened the oven three times to look.”", "“Cool air makes a cake fall.”"], but: "“The batter was stirred for ten minutes.”" },
      { who: 1, ev: ["“The batter was stirred for ten minutes.”"], but: "“The edges rose fine.”" },
      { who: 2, ev: ["“The oven dial sits between two numbers.”", "“Nobody wrote the heat down.”"], but: "“The edges rose fine.”" },
    ],
    clears: [],
    note:
      "The edges rose and the middles sank, which means the cakes started well and stopped. Ask when each suspect would have gone wrong. Bad batter would never rise at all, and a door opened three times goes wrong in the middle of the bake.",
  },
  15: {
    story:
      "Ana has two gloves. One glove is wet and one is dry. She made a snowball with her right hand. Her right glove is the wet one. Her right glove also hung closest to the heater. A hot heater makes snow on a glove melt fast. She walked home in the rain with one hand out.",
    q: "Why is one glove wet? Pick one and read out the words.",
    why: [
      "made with her right hand, and the right glove is wet",
      "the right glove hung closest to the heater",
      "walked home in the rain with one hand out",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“She made a snowball with her right hand.”", "“Her right glove is the wet one.”"], but: "“Her right glove also hung closest to the heater.”" },
      { who: 1, ev: ["“Her right glove also hung closest to the heater.”", "“A hot heater makes snow on a glove melt fast.”"], but: "“One glove is wet and one is dry.”" },
      { who: 2, ev: ["“She walked home in the rain with one hand out.”"], but: "“She made a snowball with her right hand.”" },
    ],
    clears: [],
    note:
      "Three things happened to the right hand and nothing happened to the left. Say that out loud and let the class see the shape of it. The heater answer is the sly one, because it does not wet a glove so much as melt what was already on it.",
  },
  16: {
    story:
      "Room 6 stuck candy on a gingerbread house. By morning the candy slid down. The class used soft frosting for glue. Soft frosting never gets hard. The candy on the roof fell first. The room was warm all night with the heat on. The roof candy is the biggest in the box.",
    q: "Why did the candy slide? Choose one and show the words.",
    who: ["", "🔥 The warm room", ""],
    why: [
      "soft frosting for glue, which never gets hard",
      "a warm room all night with the heat on",
      "the roof candy is the biggest in the box",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The class used soft frosting for glue.”", "“Soft frosting never gets hard.”"], but: "“The room was warm all night with the heat on.”" },
      { who: 1, ev: ["“The room was warm all night with the heat on.”"], but: "“Soft frosting never gets hard.”" },
      { who: 2, ev: ["“The roof candy is the biggest in the box.”", "“The candy on the roof fell first.”"], but: "“The class used soft frosting for glue.”" },
    ],
    clears: [],
    note:
      "The roof candy fell first and it is also the heaviest, which is a clue doing two jobs. Ask why the roof is the hardest place for glue to hold anything. Soft frosting and a warm room are close cousins and children may well say so.",
  },
  17: {
    story:
      "Six lights hang in the school window. Three of them went dark. The dark three are all on one end. One plug joins that end to the wall. The plug was pulled halfway out. The first bulb on that end is black inside. The bright three run from a second plug.",
    q: "Why did three lights go dark? Say which one, and show the words.",
    who: ["", "", "🔗 One string, one line"],
    why: [
      "a plug pulled halfway out of the wall",
      "the first bulb on that end is black inside",
      "the dark three all on one end, on one plug",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The plug was pulled halfway out.”", "“One plug joins that end to the wall.”"], but: "“The first bulb on that end is black inside.”" },
      { who: 1, ev: ["“The first bulb on that end is black inside.”"], but: "“The plug was pulled halfway out.”" },
      { who: 2, ev: ["“The dark three are all on one end.”", "“The bright three run from a second plug.”"], but: "“The plug was pulled halfway out.”" },
    ],
    clears: [],
    note:
      "Two broken things sit at the same end of the string. A plug half out and a black bulb would each turn off exactly those three lights. Ask the class how they would find out which one, and push the plug in is a very good answer.",
  },
  18: {
    story:
      "The class clock used to be quiet. Now it ticks very loudly. The class moved the clock to a bare wall. A bare wall sends sound back into the room. The old wall had a soft bulletin board on it. The clock got a new battery the same week. A fresh battery makes the hands push harder.",
    q: "Why is the clock loud now? Pick one and read out the words.",
    who: ["", "🔋 The new battery", "📌 The old bulletin board"],
    why: [
      "a bare wall that sends sound back into the room",
      "a fresh battery that makes the hands push harder",
      "an old wall with a soft bulletin board on it",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The class moved the clock to a bare wall.”", "“A bare wall sends sound back into the room.”"], but: "“The clock got a new battery the same week.”" },
      { who: 1, ev: ["“The clock got a new battery the same week.”", "“A fresh battery makes the hands push harder.”"], but: "“A bare wall sends sound back into the room.”" },
      { who: 2, ev: ["“The old wall had a soft bulletin board on it.”"], but: "“Now it ticks very loudly.”" },
    ],
    clears: [],
    note:
      "Two things changed in the same week, which is the oldest trap there is. One is about the clock and two are about the room. Ask what would happen if they put the clock back on the old wall and kept the new battery.",
  },
  19: {
    story:
      "Room 4 built a snowman on Monday. By Friday it was half as tall. Every day was warm and sunny. Water sat in a ring around the snowman. Snow turns to water when the air is warm. The gate was found open on Wednesday. Boot prints circle the snowman on one side.",
    q: "Why is the snowman short? Choose one and show the words.",
    who: ["", "👢 The boot prints", "🚪 The open gate"],
    why: [
      "warm sunny days, with water in a ring around it",
      "boot prints circling the snowman on one side",
      "a gate found open on Wednesday",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Every day was warm and sunny.”", "“Water sat in a ring around the snowman.”"], but: "“Boot prints circle the snowman on one side.”" },
      { who: 1, ev: ["“Boot prints circle the snowman on one side.”"], but: "“Snow turns to water when the air is warm.”" },
      { who: 2, ev: ["“The gate was found open on Wednesday.”"], but: "“Water sat in a ring around the snowman.”" },
    ],
    clears: [],
    note:
      "A ring of water is the best clue in this story and it is easy to walk past. Where did the water come from, and where did the snow go? Half as tall and still standing is the other one: a push knocks a snowman over, it does not shrink it.",
  },
  20: {
    story:
      "The bird feeder hangs by the window. On Tuesday it hung sideways. One of the two strings was snapped. The snapped end looks chewed, not cut. Squirrel tracks go up the tree. The string had been up since last spring. Old string breaks on its own in the cold. Birds use the feeder all day and they are light.",
    q: "What snapped the string? Pick one and read out the words.",
    who: ["", "🧵 Old worn string", ""],
    why: [
      "a chewed end, with tracks going up the tree",
      "string up since last spring, and old string breaks in the cold",
      "birds are light, and birds cannot chew a string",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The snapped end looks chewed, not cut.”", "“Squirrel tracks go up the tree.”"], but: "“The string had been up since last spring.”" },
      { who: 1, ev: ["“The string had been up since last spring.”", "“Old string breaks on its own in the cold. Birds use the feeder all day and they are light.”"], but: "“The snapped end looks chewed, not cut.”" },
      { who: 2, ev: ["“On Tuesday it hung sideways.”"], but: "“One of the two strings was snapped.”" },
    ],
    clears: [],
    note:
      "Chewed, not cut is four words that do a lot, and the class should learn to look at an end rather than at a whole. Old string frays when it breaks, which looks different again. Ask what the three kinds of end would look like under a magnifying glass.",
  },
  21: {
    story:
      "The cocoa was hot in the pot. In the cups it was only warm. The cups came out of a cold cupboard. A cold cup takes heat from the drink. The milk came straight from the fridge. The pot sat off the stove for ten minutes while cups were found.",
    q: "Why was the cocoa only warm? Say which one, and show the words.",
    why: [
      "cups out of a cold cupboard, taking heat from the drink",
      "milk straight from the fridge",
      "ten minutes off the stove while cups were found",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The cups came out of a cold cupboard.”", "“A cold cup takes heat from the drink.”"], but: "“The milk came straight from the fridge.”" },
      { who: 1, ev: ["“The milk came straight from the fridge.”"], but: "“The cocoa was hot in the pot.”" },
      { who: 2, ev: ["“The pot sat off the stove for ten minutes while cups were found.”"], but: "“The cups came out of a cold cupboard.”" },
    ],
    clears: [],
    note:
      "The cocoa was hot in the pot, so whatever cooled it happened after that. Point at the sentence and ask what comes next in the story. Cold milk went in earlier, which puts it out of the running, and children who spot that are reasoning about order.",
  },
  22: {
    story:
      "Room 7 made valentines with red paint. The next day two were stuck together. The two stuck ones were at the bottom of the pile. Wet paint sticks when paper lies on it. The class stacked them right away. Somebody spilled water on the table that afternoon. The glue pot was left open beside the pile.",
    q: "Why are two valentines stuck? Choose one and read out the words.",
    why: [
      "stacked right away, where wet paint sticks under paper",
      "a glue pot left open beside the pile",
      "water spilled on the table that afternoon",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The two stuck ones were at the bottom of the pile.”", "“Wet paint sticks when paper lies on it.”"], but: "“Somebody spilled water on the table that afternoon.”" },
      { who: 1, ev: ["“The glue pot was left open beside the pile.”"], but: "“The class stacked them right away.”" },
      { who: 2, ev: ["“Somebody spilled water on the table that afternoon.”"], but: "“Wet paint sticks when paper lies on it.”" },
    ],
    clears: [],
    note:
      "At the bottom of the pile is the clue that chooses, because that is where the weight is. Water on a table would wet the bottom ones too, so the class has two answers that fit the same two cards. Ask what colour the stuck part is.",
  },
  23: {
    story:
      "Sara's model volcano bubbled very slowly at school. It bubbled fast at home. At home she used warm vinegar. At school she used cold vinegar. Cold vinegar bubbles slower than warm. The school box of baking soda had been open all term. The school cone has a much smaller hole at the top.",
    q: "Why was it slow at school? Pick one and show the words.",
    why: [
      "cold vinegar at school, where cold bubbles slower",
      "a box of baking soda open all term",
      "a cone with a much smaller hole at the top",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“At school she used cold vinegar.”", "“Cold vinegar bubbles slower than warm.”"], but: "“The school box of baking soda had been open all term.”" },
      { who: 1, ev: ["“The school box of baking soda had been open all term.”"], but: "“At home she used warm vinegar.”" },
      { who: 2, ev: ["“The school cone has a much smaller hole at the top.”"], but: "“Cold vinegar bubbles slower than warm.”" },
    ],
    clears: [],
    note:
      "Three things were different between home and school, and only one of them is about the bubbles themselves. A small hole does not make less foam, it lets less out. Ask the class whether slow means less or just slower, because those are two different stories.",
  },
  24: {
    story:
      "Kai's paper crown fit at the first play. At the show it slid down. Kai got a haircut on Friday. Short hair takes up less room. The crown sat in a damp box over the weekend. Damp paper stretches and goes floppy. Kai wore a hat all morning before the show.",
    q: "Why did the crown slide down? Say which one, and read out the words.",
    who: ["", "💧 The damp box", "🧢 The hat he wore all morning"],
    why: [
      "a haircut on Friday, and short hair takes less room",
      "a damp box over the weekend, where paper stretches",
      "a hat worn all morning before the show",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Kai got a haircut on Friday.”", "“Short hair takes up less room.”"], but: "“The crown sat in a damp box over the weekend.”" },
      { who: 1, ev: ["“The crown sat in a damp box over the weekend.”", "“Damp paper stretches and goes floppy.”"], but: "“Kai got a haircut on Friday.”" },
      { who: 2, ev: ["“Kai wore a hat all morning before the show.”"], but: "“Kai's paper crown fit at the first play.”" },
    ],
    clears: [],
    note:
      "Two things can make a crown too big: a smaller head or a bigger crown. Write those on the board and sort the suspects into them. A class that can name the two ways has understood something, whichever name they end up picking.",
  },
  25: {
    story:
      "One key on the class piano made no sound. Every other key makes its sound. Mr. Okafor looked inside the piano. A pencil had fallen onto the strings. The pencil sat under that one hammer. The felt on that hammer is worn away to the wood. A bare hammer makes a thin sound, not none at all.",
    q: "Why is one key silent? Choose one and show the words.",
    who: ["", "🪵 The worn hammer felt", "🧐 What a bare hammer sounds like"],
    why: [
      "a pencil on the strings, right under that one hammer",
      "felt worn away to the wood on that hammer",
      "a bare hammer makes a thin sound, not none at all",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A pencil had fallen onto the strings.”", "“The pencil sat under that one hammer.”"], but: "“The felt on that hammer is worn away to the wood.”" },
      { who: 1, ev: ["“The felt on that hammer is worn away to the wood.”"], but: "“A pencil had fallen onto the strings.”" },
      { who: 2, ev: ["“A bare hammer makes a thin sound, not none at all.”", "“Every other key makes its sound.”"], but: "“The pencil sat under that one hammer.”" },
    ],
    clears: [],
    note:
      "No sound at all is the thing to hold on to. A worn hammer still makes a sound, so it cannot be the whole answer. Taking the pencil out and listening again is the test, and it costs nothing.",
  },
  26: {
    story:
      "Omar's kite would not go up high. It flew high last Saturday. Today he flew it near the school wall. The wall blocks the wind on that side. Out in the open field the wind is strong. He added a longer tail this morning. A heavy tail holds a kite down.",
    q: "Why would the kite not go high? Pick one and read out the words.",
    who: ["", "🎏 The longer tail", "🗓️ A different day"],
    why: [
      "flown near a wall that blocks the wind on that side",
      "a longer tail added this morning, and a heavy tail holds a kite down",
      "it flew high last Saturday and not today",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Today he flew it near the school wall.”", "“Out in the open field the wind is strong.”"], but: "“He added a longer tail this morning.”" },
      { who: 1, ev: ["“He added a longer tail this morning.”", "“A heavy tail holds a kite down.”"], but: "“The wall blocks the wind on that side.”" },
      { who: 2, ev: ["“It flew high last Saturday.”"], but: "“Out in the open field the wind is strong.”" },
    ],
    clears: [],
    note:
      "Two things changed since Saturday: where he stood and what he tied on. Ask which one he could change back most easily, and a child will say walk to the field. That is an experiment, and they thought of it themselves.",
  },
  27: {
    story:
      "Room 9 grew shamrocks in two pots. The plants in one pot are thin and pale. That pot sits far from the window. The other pot sits right on the sill. Plants need light to grow strong. The far pot also sits above the warm heater. The thin ones lean toward the window.",
    q: "Why are some shamrocks thin? Say which one, and show the words.",
    who: ["", "🔥 The heater below the pot", ""],
    why: [
      "a pot far from the window, where plants need light",
      "a pot sitting above the warm heater",
      "thin plants leaning toward the window",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“That pot sits far from the window.”", "“Plants need light to grow strong.”"], but: "“The far pot also sits above the warm heater.”" },
      { who: 1, ev: ["“The far pot also sits above the warm heater.”"], but: "“The thin ones lean toward the window.”" },
      { who: 2, ev: ["“The thin ones lean toward the window.”"], but: "“The other pot sits right on the sill.”" },
    ],
    clears: [],
    note:
      "Leaning toward the window is a plant telling you what it wants. That is a lovely idea for a seven-year-old and it belongs in the discussion. The heater is a fair answer and it does not explain the lean, which is the gap to point at.",
  },
  28: {
    story:
      "A wet spot shows up by the door each cold morning. Cold glass makes water drops on the inside. The door has a big glass window. The drops run down to the floor. On warm days the floor is dry. Snow comes in on boots at that same door. The mat by the door was taken away in January.",
    q: "Why is the floor wet? Choose one and read out the words.",
    who: ["", "👢 Snow off boots", "🧽 The mat that was taken away"],
    why: [
      "cold glass making drops that run down to the floor",
      "snow coming in on boots at that same door",
      "a mat taken away in January",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Cold glass makes water drops on the inside.”", "“On warm days the floor is dry.”"], but: "“Snow comes in on boots at that same door.”" },
      { who: 1, ev: ["“Snow comes in on boots at that same door.”"], but: "“The drops run down to the floor.”" },
      { who: 2, ev: ["“The mat by the door was taken away in January.”"], but: "“The door has a big glass window.”" },
    ],
    clears: [],
    note:
      "Only on cold mornings is the pattern, and all three suspects happen on cold mornings. That is the point to make. Dry on warm days fits the glass best, because boots and mats do not know what the weather is like until it snows.",
  },
  29: {
    story:
      "The garden lettuce has holes in the leaves. The holes are small and round. Slime trails shine on the dirt near the plants. Slugs leave slime when they move. The holes start at the bottom leaves. A bird was seen pecking the bed on Tuesday. The fence has a gap at one corner.",
    q: "What is eating the lettuce? Pick one and show the words.",
    why: [
      "slime trails on the dirt, and holes starting low",
      "a bird seen pecking the bed on Tuesday",
      "a gap at one corner of the fence",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Slime trails shine on the dirt near the plants.”", "“The holes start at the bottom leaves.”"], but: "“A bird was seen pecking the bed on Tuesday.”" },
      { who: 1, ev: ["“A bird was seen pecking the bed on Tuesday.”"], but: "“Slime trails shine on the dirt near the plants.”" },
      { who: 2, ev: ["“The fence has a gap at one corner.”"], but: "“The holes are small and round.”" },
    ],
    clears: [],
    note:
      "Where the holes start is the clue that chooses. Something crawling begins at the bottom and something flying begins at the top. Ask the children to show with their hands where each suspect would eat, and then look at the leaves.",
  },
  30: {
    story:
      "Four eggs sat in a nest on the school sign. For two weeks a bird sat on them. This week the nest is empty and clean. Four small birds now sit in the tree. A cat sits under that sign most days. Baby birds leave the nest when they can fly. One egg was always smaller than the rest.",
    q: "What happened to the eggs? Say which one, and read out the words.",
    who: ["", "🐈 The cat under the sign", "🥚 The one small egg"],
    why: [
      "four small birds in the tree, and the nest clean",
      "a cat that sits under that sign most days",
      "one egg that was always smaller than the rest",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Four small birds now sit in the tree.”", "“Baby birds leave the nest when they can fly.”"], but: "“A cat sits under that sign most days.”" },
      { who: 1, ev: ["“A cat sits under that sign most days.”"], but: "“Four small birds now sit in the tree.”" },
      { who: 2, ev: ["“One egg was always smaller than the rest.”"], but: "“This week the nest is empty and clean.”" },
    ],
    clears: [],
    note:
      "Four eggs and four birds is counting, and counting is proof a seven-year-old can hold. Ask how many birds there would be if a cat had come. The small egg is there for the children who want to worry about it, and they should be allowed to.",
  },
  31: {
    story:
      "The school yard is clean but one fence corner is not. Paper collects there every week. The wind blows toward that fence. Paper stops when it hits a fence. The bus line forms in that same corner at three. The trash can nearest that corner is often full by lunch.",
    q: "Why does paper collect there? Choose one and show the words.",
    who: ["", "🚌 The bus line at three", "🗑️ A can full by lunch"],
    why: [
      "wind blowing toward a fence that stops paper",
      "the bus line forming in that corner at three",
      "a nearest can that is often full by lunch",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The wind blows toward that fence.”", "“Paper stops when it hits a fence.”"], but: "“The bus line forms in that same corner at three.”" },
      { who: 1, ev: ["“The bus line forms in that same corner at three.”"], but: "“Paper stops when it hits a fence.”" },
      { who: 2, ev: ["“The trash can nearest that corner is often full by lunch.”"], but: "“The school yard is clean but one fence corner is not.”" },
    ],
    clears: [],
    note:
      "Three different reasons all land in the same corner, which is how real messy corners work. Ask the class for a way to find out: empty the can at lunch for a week, or watch the corner at three, and see which one changes it.",
  },
  32: {
    story:
      "The class took photos on the field trip. Many came out blurry. The blurry ones were all taken on the bus. The bus was going fast. A moving bus shakes the camera. The bus windows were dirty with rain. The clear ones were taken while standing still. The camera went back in its case between stops.",
    q: "Why are the photos blurry? Pick one and read out the words.",
    who: ["", "🪟 The dirty bus windows", "🏃 Standing still or not"],
    why: [
      "all taken on a bus going fast, which shakes the camera",
      "bus windows dirty with rain",
      "the clear ones taken while standing still",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The bus was going fast.”", "“A moving bus shakes the camera.”"], but: "“The bus windows were dirty with rain.”" },
      { who: 1, ev: ["“The bus windows were dirty with rain.”"], but: "“The blurry ones were all taken on the bus.”" },
      { who: 2, ev: ["“The clear ones were taken while standing still. The camera went back in its case between stops.”"], but: "“A moving bus shakes the camera.”" },
    ],
    clears: [],
    note:
      "Every blurry photo was taken on the bus, so the bus is certainly part of it. The question is which part. Shaking and a dirty window both happen on a bus, and the class can be asked what a photo through a dirty window would look like.",
  },
  33: {
    story:
      "Two bean plants sit on the class shelf. One has green leaves and one has yellow. The yellow one sits in a pot with no holes. Water fills the bottom of that pot. Roots rot when they sit in water. The yellow one is further from the window than the green one. It was planted a week later than the green one.",
    q: "Why are the leaves yellow? Say which one, and show the words.",
    who: ["", "🪟 Further from the window", "📅 Planted a week later"],
    why: [
      "a pot with no holes, with water in the bottom",
      "further from the window than the green one",
      "planted a week later than the green one",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The yellow one sits in a pot with no holes.”", "“Roots rot when they sit in water.”"], but: "“The yellow one is further from the window than the green one.”" },
      { who: 1, ev: ["“The yellow one is further from the window than the green one.”"], but: "“Water fills the bottom of that pot.”" },
      { who: 2, ev: ["“It was planted a week later than the green one.”"], but: "“One has green leaves and one has yellow.”" },
    ],
    clears: [],
    note:
      "A week younger would make a plant smaller, not yellow, and that difference is worth drawing out. Yellow is a sick colour, not a young one. Water in the bottom of a pot is something the class can go and check with a finger.",
  },
  34: {
    story:
      "The class made ice cream in a bag. Six bags turned hard and two stayed soft. The two soft bags had less ice in them. Ice must touch the bag to make it cold. The two soft bags were held by the same two children. Those two stopped shaking after one minute. Warm hands on a bag slow the freezing down.",
    q: "Why did two bags stay soft? Choose one and read out the words.",
    who: ["", "🤝 The two who stopped early", "🖐 Warm hands on the bag"],
    why: [
      "two bags with less ice, and ice must touch to cool",
      "two who stopped shaking after one minute",
      "warm hands on a bag slow the freezing down",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The two soft bags had less ice in them.”", "“Ice must touch the bag to make it cold.”"], but: "“Those two stopped shaking after one minute.”" },
      { who: 1, ev: ["“Those two stopped shaking after one minute.”"], but: "“The two soft bags had less ice in them.”" },
      { who: 2, ev: ["“Warm hands on a bag slow the freezing down.”", "“The two soft bags were held by the same two children.”"], but: "“Ice must touch the bag to make it cold.”" },
    ],
    clears: [],
    note:
      "The same two bags had less ice, were shaken less and were held by the same hands. Three answers and two bags. Ask what the class would have to do next time to find out, and listen for the child who says give everyone the same ice.",
  },
  35: {
    story:
      "Field day ribbons came in a box. Three had torn tops. The three torn ones hung on the same nail. The nail has a sharp edge. A sharp edge tears cloth. The three torn ones were also the last three pulled off the nail. The box was carried in under one arm and dropped once.",
    q: "What tore the ribbons? Pick one and show the words.",
    who: ["", "🤲 Pulled off last", "📦 The dropped box"],
    why: [
      "three on one nail that has a sharp edge",
      "the last three pulled off the nail",
      "a box carried under one arm and dropped once",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The three torn ones hung on the same nail.”", "“The nail has a sharp edge.”"], but: "“The three torn ones were also the last three pulled off the nail.”" },
      { who: 1, ev: ["“The three torn ones were also the last three pulled off the nail.”"], but: "“A sharp edge tears cloth.”" },
      { who: 2, ev: ["“The box was carried in under one arm and dropped once.”"], but: "“Three had torn tops.”" },
    ],
    clears: [],
    note:
      "The tears are all at the top, which is where a ribbon hangs and where a hand pulls. A drop would mark anywhere. Ask where each suspect leaves its mark, and let the class check whether all three tears are really in the same place.",
  },
  36: {
    story:
      "The class blew up balloons on Friday. On Monday they were small and soft. Air leaks slowly out of a balloon. Three days passed over the weekend. The balloons blown up Monday are still big. The room was very cold over the weekend. Cold air takes up less room than warm air.",
    q: "Why did the balloons shrink? Say which one, and read out the words.",
    who: ["", "🥶 The cold room", "🗓️ Three days passing"],
    why: [
      "air leaking slowly, over three days",
      "a very cold room over the weekend",
      "three days passed, and Monday's are still big",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Air leaks slowly out of a balloon.”", "“Three days passed over the weekend.”"], but: "“The room was very cold over the weekend.”" },
      { who: 1, ev: ["“The room was very cold over the weekend.”", "“Cold air takes up less room than warm air.”"], but: "“The balloons blown up Monday are still big.”" },
      { who: 2, ev: ["“The balloons blown up Monday are still big.”"], but: "“Cold air takes up less room than warm air.”" },
    ],
    clears: [],
    note:
      "If the cold did it, the balloons should get big again now the room is warm. Ask the class to put one on the windowsill and look after lunch. That is a real test and it takes an hour, and the answer is in the room with them.",
  },
};
