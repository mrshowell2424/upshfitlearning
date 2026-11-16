/**
 * Grade 3, the debate version of each case. See scripts/mysteries/g5.debate.mjs
 * for what these files are and what the gate holds them to.
 *
 * Grade 3 is the original thirty-six, written for 2nd-4th, and they work
 * differently from the grades either side. The culprit is usually an animal
 * or the weather, and the other two suspects are people with alibis: in the
 * gym all morning, home sick, asleep upstairs. An alibi is the cleanest way
 * to clear somebody and the hardest thing to argue against.
 *
 * So the debate version takes the alibis away rather than contradicting them.
 * Coach Dan is no longer in the gym all morning; he came in at eight for a
 * whistle. Rosa was not asleep upstairs; her muddy slippers were by the back
 * door. Nobody is lying in either version. The debate simply stops answering
 * the question before the child has been asked it.
 */
export const DEBATES = {
  1: {
    story:
      "On Monday morning, Ms. Park opened the library and gasped. Books were all over the floor. A trail of sawdust led from the shelf to the class pet cage. The cage door stood open and Nibbles the hamster was gone. Coach Dan came in at eight to borrow a whistle from the desk. Leo was out sick on Friday, but his library key is still missing. Behind the beanbag was a nest of torn paper.",
    q: "Who made the mess? Pick one and show the words that prove it.",
    why: [
      "a sawdust trail, an open cage and a nest of torn paper",
      "in at eight to borrow a whistle from the desk",
      "out sick Friday, with his library key still missing",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A trail of sawdust led from the shelf to the class pet cage.”", "“Behind the beanbag was a nest of torn paper.”"], but: "“Coach Dan came in at eight to borrow a whistle from the desk.”" },
      { who: 1, ev: ["“Coach Dan came in at eight to borrow a whistle from the desk.”"], but: "“The cage door stood open and Nibbles the hamster was gone.”" },
      { who: 2, ev: ["“Leo was out sick on Friday, but his library key is still missing.”"], but: "“A trail of sawdust led from the shelf to the class pet cage.”" },
    ],
    clears: [],
    note:
      "Nobody has an alibi any more, so the children have to weigh evidence instead of crossing names off. The sawdust and the nest are the strongest words on the page and they point one way. A missing key and an early visit are both reasons to wonder, and neither explains torn paper behind a beanbag.",
  },
  2: {
    story:
      "At lunch, Omar opened his lunchbox and found a tuna sandwich. Omar hates tuna. His lunchbox is blue with a rocket sticker. Owen sat at the next table with the same blue box and no sticker. Ms. Bell lined up every lunchbox on one shelf that morning. She also packed three spare lunches for children who forgot theirs. Omar's sticker was peeling at one corner last week.",
    q: "How did Omar end up with the wrong lunch? Choose one answer and prove it.",
    who: ["", "", "🏷️ The peeling sticker"],
    why: [
      "the same blue box with no sticker, one table away",
      "lined every box on one shelf and packed three spares",
      "a sticker that was peeling at one corner last week",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Owen sat at the next table with the same blue box and no sticker.”"], but: "“Ms. Bell lined up every lunchbox on one shelf that morning.”" },
      { who: 1, ev: ["“She also packed three spare lunches for children who forgot theirs.”"], but: "“His lunchbox is blue with a rocket sticker.”" },
      { who: 2, ev: ["“Omar's sticker was peeling at one corner last week.”"], but: "“Owen sat at the next table with the same blue box and no sticker.”" },
    ],
    clears: [],
    note:
      "The sticker is the only thing that tells the two boxes apart, so a sticker that has fallen off turns one mix-up into a different one. Ask the class what Omar should look for on the box he is holding. Nobody here did anything wrong, which is worth saying out loud.",
  },
  3: {
    story:
      "Every day this week, pencils vanished from the cup in Room 12. The class parrot Kiwi flies out when her cage door is left open. Mr. Ortiz found fifteen pencils in a pile on top of the cabinet. Nina sits beside the pencil cup and was back from the nurse by ten. Mr. Ortiz took a handful of pencils to the office on Tuesday. Nobody counted them before he left.",
    q: "Where are the pencils going? Pick one answer and quote the story.",
    why: [
      "flies out when her cage is open, and fifteen on the cabinet",
      "sits beside the cup and was back from the nurse by ten",
      "took a handful to the office with nobody counting",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Mr. Ortiz found fifteen pencils in a pile on top of the cabinet.”"], but: "“Nina sits beside the pencil cup and was back from the nurse by ten.”" },
      { who: 1, ev: ["“Nina sits beside the pencil cup and was back from the nurse by ten.”"], but: "“The class parrot Kiwi flies out when her cage door is left open.”" },
      { who: 2, ev: ["“Mr. Ortiz took a handful of pencils to the office on Tuesday.”", "“Nobody counted them before he left.”"], but: "“Mr. Ortiz found fifteen pencils in a pile on top of the cabinet.”" },
    ],
    clears: [],
    note:
      "Fifteen pencils on a cabinet is the best evidence in the story, and a parrot is the only suspect who could get them up there. The teacher is the fun answer and the class should be allowed to make it, as long as they notice it does not explain the pile.",
  },
  4: {
    story:
      "The class picked apples at Red Barn Orchard. On the bus, Mia's bag of red apples was full of green ones. Her seat partner Jack had red apples and a big grin. Mr. Stone stopped the bus twice and walked down the aisle. The farmer loaded every bag into the luggage hold himself. Mia set her bag down by the gate while she tied her shoe.",
    q: "How did Mia end up with green apples? Make the case for one answer.",
    why: [
      "red apples in his bag and a big grin beside her",
      "stopped the bus twice and walked down the aisle",
      "loaded every bag into the hold himself",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Her seat partner Jack had red apples and a big grin.”"], but: "“The farmer loaded every bag into the luggage hold himself.”" },
      { who: 1, ev: ["“Mr. Stone stopped the bus twice and walked down the aisle.”"], but: "“Her seat partner Jack had red apples and a big grin.”" },
      { who: 2, ev: ["“The farmer loaded every bag into the luggage hold himself.”", "“Mia set her bag down by the gate while she tied her shoe.”"], but: "“On the bus, Mia's bag of red apples was full of green ones.”" },
    ],
    clears: [],
    note:
      "A grin is not evidence and the class should be pushed on that. Jack having red apples is evidence, but so does everybody who picked red ones. The bag set down by the gate is the quiet sentence that lets this be an accident, and the best answers find it.",
  },
  5: {
    story:
      "After school, Jada found her bike tire flat. A sharp thumbtack was stuck in the rubber. Tacks had spilled from the art room box onto the sidewalk. The art room door is next to the bike rack. Theo parked his scooter against Jada's bike at lunchtime. Mr. Hill moved three bikes out of the gateway that afternoon. Nobody saw the tire before three o'clock.",
    q: "What made the tire flat? Choose one answer and back it up.",
    why: [
      "a tack in the rubber, spilled from the art room box",
      "parked his scooter against her bike at lunchtime",
      "moved three bikes out of the gateway that afternoon",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A sharp thumbtack was stuck in the rubber.”", "“Tacks had spilled from the art room box onto the sidewalk.”"], but: "“Theo parked his scooter against Jada's bike at lunchtime.”" },
      { who: 1, ev: ["“Theo parked his scooter against Jada's bike at lunchtime.”"], but: "“A sharp thumbtack was stuck in the rubber.”" },
      { who: 2, ev: ["“Mr. Hill moved three bikes out of the gateway that afternoon.”", "“Nobody saw the tire before three o'clock.”"], but: "“The art room door is next to the bike rack.”" },
    ],
    clears: [],
    note:
      "There is a tack in the tire and nobody disputes it, so the real question is how it got there. Rolling over one is an accident; being pushed onto one is not. Ask what would be different about the tack's position in each case, and listen for children who want to go and look.",
  },
  6: {
    story:
      "On Monday the class fish tank was cloudy and green. All weekend it sat in bright sunlight by the window. The filter was unplugged when a cord got bumped during cleaning. The food can was refilled on Friday and nobody wrote down how much went in. Two helpers cleaned the tank on Friday and changed half the water. New water can cloud a tank for days.",
    q: "Why did the tank go cloudy? Pick one answer and prove it.",
    who: ["", "", "🧹 The Friday cleaning"],
    why: [
      "bright sun all weekend and a filter left unplugged",
      "a can refilled Friday with nobody writing down how much",
      "half the water changed on Friday by two helpers",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“All weekend it sat in bright sunlight by the window.”", "“The filter was unplugged when a cord got bumped during cleaning.”"], but: "“Two helpers cleaned the tank on Friday and changed half the water.”" },
      { who: 1, ev: ["“The food can was refilled on Friday and nobody wrote down how much went in.”"], but: "“All weekend it sat in bright sunlight by the window.”" },
      { who: 2, ev: ["“Two helpers cleaned the tank on Friday and changed half the water.”", "“New water can cloud a tank for days.”"], but: "“The filter was unplugged when a cord got bumped during cleaning.”" },
    ],
    clears: [],
    note:
      "Everything in this case happened on Friday, so the day cannot choose between them. A full food can no longer proves nobody overfed, because nobody knows what went in. The cleaning is the answer children rarely reach, and the sentence about new water is there for them to find.",
  },
  7: {
    story:
      "Every night at midnight the Garcias heard a loud tap-tap-tap on the roof. Dad climbed up and found acorns all over the shingles. A big oak hangs right over the house. A squirrel's nest sits in the roof corner. On windy nights the oak branches scrape the roof above Lucia's room. The neighbours' porch light switches off at midnight with a loud clunk. The sound comes at the same minute every night.",
    q: "What is making the noise? Choose one and show the words.",
    who: ["", "🌬️ The wind in the oak", ""],
    why: [
      "acorns on the shingles and a nest in the roof corner",
      "branches that scrape the roof on windy nights",
      "a porch light that clunks off at midnight",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Dad climbed up and found acorns all over the shingles.”", "“A squirrel's nest sits in the roof corner.”"], but: "“The sound comes at the same minute every night.”" },
      { who: 1, ev: ["“On windy nights the oak branches scrape the roof above Lucia's room.”"], but: "“Dad climbed up and found acorns all over the shingles.”" },
      { who: 2, ev: ["“The neighbours' porch light switches off at midnight with a loud clunk.”", "“The sound comes at the same minute every night.”"], but: "“A big oak hangs right over the house.”" },
    ],
    clears: [],
    note:
      "The same minute every night is the hardest fact here, and it fits a switch far better than an animal or the weather. Squirrels do not keep to a clock. Children who notice that are using a word they would normally read straight past.",
  },
  8: {
    story:
      "On Saturday, Dad and Lila raked a giant pile of leaves. They went inside for lunch and came back to leaves all over the street. The trees across the road were bending back and forth. The radio said gusts of thirty miles an hour. Pepper got out through the side gate at noon and came back muddy. The neighbour kids walked home past the yard after their soccer game.",
    q: "What scattered the leaves? Pick one answer and quote the story.",
    why: [
      "trees bending and gusts of thirty miles an hour",
      "out through the side gate at noon, and back muddy",
      "walked home past the yard after their game",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The trees across the road were bending back and forth.”", "“The radio said gusts of thirty miles an hour.”"], but: "“Pepper got out through the side gate at noon and came back muddy.”" },
      { who: 1, ev: ["“Pepper got out through the side gate at noon and came back muddy.”"], but: "“The radio said gusts of thirty miles an hour.”" },
      { who: 2, ev: ["“The neighbour kids walked home past the yard after their soccer game.”"], but: "“The trees across the road were bending back and forth.”" },
    ],
    clears: [],
    note:
      "Leaves all over the street is a wide mess, and that is the detail to lean on. A dog scatters a pile where it jumps in; wind takes it down the road. Ask where each suspect would have left the leaves, and the shape of the mess starts doing the work.",
  },
  9: {
    story:
      "The Lopez family carved a jack-o'-lantern and set it on the porch. By morning big chunks were missing from the top. Small hand-shaped prints were in the dirt by the steps. The trash can lid was knocked over and food was spread on the driveway. Rosa's muddy slippers were by the back door in the morning. Shadow the cat got out through the kitchen window on Tuesday night.",
    q: "Who chewed the pumpkin? Make the case for one answer.",
    why: [
      "hand-shaped prints, a knocked lid and food on the drive",
      "muddy slippers by the back door in the morning",
      "out through the kitchen window on Tuesday night",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Small hand-shaped prints were in the dirt by the steps.”", "“The trash can lid was knocked over and food was spread on the driveway.”"], but: "“Rosa's muddy slippers were by the back door in the morning.”" },
      { who: 1, ev: ["“Rosa's muddy slippers were by the back door in the morning.”"], but: "“Small hand-shaped prints were in the dirt by the steps.”" },
      { who: 2, ev: ["“Shadow the cat got out through the kitchen window on Tuesday night.”"], but: "“The trash can lid was knocked over and food was spread on the driveway.”" },
    ],
    clears: [],
    note:
      "Muddy slippers put Rosa outside and they do not put her on the porch roof or in the bin. Hand-shaped prints are the strongest words in the case and children should be asked whose hands are that small. A cat out at night still cannot tip a bin.",
  },
  10: {
    story:
      "After recess, muddy footprints crossed the clean classroom floor. They were small and round, with four toes. Daisy the therapy dog was curled on the beanbag at the end of the trail. The mat by the door was soaked and had been walked round by some children. Mrs. Moore wears boots with a round heel the size of a fist. The prints are about three inches across.",
    q: "Who left the muddy prints? Pick one and prove it from the story.",
    why: [
      "small round prints with four toes, ending at her beanbag",
      "a soaked mat that some children walked around",
      "boots with a round heel the size of a fist",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Daisy the therapy dog was curled on the beanbag at the end of the trail.”", "“They were small and round, with four toes.”"], but: "“Mrs. Moore wears boots with a round heel the size of a fist.”" },
      { who: 1, ev: ["“The mat by the door was soaked and had been walked round by some children.”"], but: "“They were small and round, with four toes.”" },
      { who: 2, ev: ["“Mrs. Moore wears boots with a round heel the size of a fist.”", "“The prints are about three inches across.”"], but: "“Daisy the therapy dog was curled on the beanbag at the end of the trail.”" },
    ],
    clears: [],
    note:
      "Four toes is the word that decides this and it takes one careful reader to find it. Mrs. Moore's heel is round too, which is why the story gives her a size. Ask what three inches across looks like, and let somebody measure it on the desk.",
  },
  11: {
    story:
      "When Eli got home he could not find his green backpack. He took it off on the bus to show his friend a toy. Ms. Joy found a green backpack under seat seven that night. Three children in Eli's class have green backpacks. His mother looked in his room but not in the hall closet. His little sister was carrying a green bag at breakfast.",
    q: "Where is Eli's backpack? Choose one answer and back it up.",
    why: [
      "taken off on the bus, and a green one under seat seven",
      "a room searched, but not the hall closet",
      "carrying a green bag at breakfast",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“He took it off on the bus to show his friend a toy.”", "“Ms. Joy found a green backpack under seat seven that night.”"], but: "“Three children in Eli's class have green backpacks.”" },
      { who: 1, ev: ["“His mother looked in his room but not in the hall closet.”"], but: "“He took it off on the bus to show his friend a toy.”" },
      { who: 2, ev: ["“His little sister was carrying a green bag at breakfast.”"], but: "“Ms. Joy found a green backpack under seat seven that night.”" },
    ],
    clears: [],
    note:
      "Three green backpacks in one class is the sentence that breaks the easy answer. A green bag under seat seven is a green bag, not his green bag. Ask the children what Eli could check to be sure, and look for the ones who say his name inside it.",
  },
  12: {
    story:
      "The Tigers' trophy sat in the case and the next day it was gone. A muddy cleat print was on the floor by the case. Sam still had mud on his cleats from practice. Coach Kim keeps the case key on her whistle cord. Mr. Lee mopped the hall at six and props the case open to dust it. The print points away from the case, toward the gym.",
    q: "Who took the trophy? Pick one answer and show the words.",
    why: [
      "mud still on his cleats from practice",
      "the case key on her whistle cord",
      "mopping at six and propping the case open to dust",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Sam still had mud on his cleats from practice.”", "“A muddy cleat print was on the floor by the case.”"], but: "“Coach Kim keeps the case key on her whistle cord.”" },
      { who: 1, ev: ["“Coach Kim keeps the case key on her whistle cord.”"], but: "“Sam still had mud on his cleats from practice.”" },
      { who: 2, ev: ["“Mr. Lee mopped the hall at six and props the case open to dust it.”", "“The print points away from the case, toward the gym.”"], but: "“A muddy cleat print was on the floor by the case.”" },
    ],
    clears: [],
    note:
      "The whole team wears cleats and the whole team had just been at practice, so a cleat print narrows this less than it seems. The direction of the print is the detail worth chasing. Who keeps a key matters too, and the class should notice that a locked case needs one.",
  },
  13: {
    story:
      "Grandma set a pumpkin pie on the porch to cool. An hour later one big slice was gone. Tiny three-toed prints crossed the flour on the steps. Feathers were stuck to the edge of the plate. A wild turkey was pecking by the fence all morning. Ella came out twice for napkins from the porch cupboard. Uncle Ray leaned his rake against the porch rail at ten.",
    q: "Who took the slice of pie? Make the case for one answer.",
    why: [
      "three-toed prints, feathers, and a turkey by the fence",
      "out twice for napkins from the porch cupboard",
      "a rake leaned against the porch rail at ten",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Tiny three-toed prints crossed the flour on the steps.”", "“A wild turkey was pecking by the fence all morning.”"], but: "“Ella came out twice for napkins from the porch cupboard.”" },
      { who: 1, ev: ["“Ella came out twice for napkins from the porch cupboard.”"], but: "“Feathers were stuck to the edge of the plate.”" },
      { who: 2, ev: ["“Uncle Ray leaned his rake against the porch rail at ten.”"], but: "“Tiny three-toed prints crossed the flour on the steps.”" },
    ],
    clears: [],
    note:
      "Feathers on the plate are hard to explain away and the class should start there. Being on the porch is not the same as taking pie, which is the difference between Ella and the turkey. One big slice is also worth noticing: a bird pecks rather than slices.",
  },
  14: {
    story:
      "Maya's dad baked twelve cupcakes and left them on the counter to cool. When Maya came home, nine were left. Ben had pink frosting on his chin. Rocket came in through the dog flap twice that afternoon. The counter is low enough for a dog to reach the near end. Grandma came home early and set her shopping bags down on the counter. Nobody counted the cupcakes after they came out of the tin.",
    q: "Where did three cupcakes go? Choose one answer and prove it.",
    why: [
      "pink frosting on his chin",
      "in through the dog flap twice, and a low counter",
      "home early, with shopping set on the counter",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Ben had pink frosting on his chin.”"], but: "“Rocket came in through the dog flap twice that afternoon.”" },
      { who: 1, ev: ["“Rocket came in through the dog flap twice that afternoon.”", "“The counter is low enough for a dog to reach the near end.”"], but: "“Ben had pink frosting on his chin.”" },
      { who: 2, ev: ["“Grandma came home early and set her shopping bags down on the counter. Nobody counted the cupcakes after they came out of the tin.”"], but: "“The counter is low enough for a dog to reach the near end.”" },
    ],
    clears: [],
    note:
      "Frosting on a chin proves Ben ate frosting. It does not prove he ate three cupcakes, and that gap is the whole lesson. The dog flap and the low counter are two sentences that work together, and children who use both are building a real case.",
  },
  15: {
    story:
      "After recess Ava had only one red mitten. Marshmallow the school cat was curled in the lost-and-found box on something red. Red fuzz was stuck to his white fur. Grace borrowed Ava's spare mitten on Tuesday and has not given it back. Mr. Ray gathers everything left on the field into the box each day. Ava took her mittens off at the swings and left them on the bar.",
    q: "Where is the mitten? Pick one answer and quote the story.",
    why: [
      "curled on something red, with red fuzz on his fur",
      "borrowed a spare on Tuesday and never gave it back",
      "gathers everything left on the field into the box",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Marshmallow the school cat was curled in the lost-and-found box on something red.”", "“Red fuzz was stuck to his white fur.”"], but: "“Mr. Ray gathers everything left on the field into the box each day.”" },
      { who: 1, ev: ["“Grace borrowed Ava's spare mitten on Tuesday and has not given it back.”"], but: "“Red fuzz was stuck to his white fur.”" },
      { who: 2, ev: ["“Mr. Ray gathers everything left on the field into the box each day.”", "“Ava took her mittens off at the swings and left them on the bar.”"], but: "“Marshmallow the school cat was curled in the lost-and-found box on something red.”" },
    ],
    clears: [],
    note:
      "The mitten is probably in the box, and the argument is about how it got there. A cat dragging it and an aide collecting it end in the same place, which is a good thing for children to notice. Taking the mittens off at the swings is the sentence that makes the aide's answer work.",
  },
  16: {
    story:
      "The class gingerbread house lost three gumdrops from its roof overnight. Small brown droppings sat on the shelf beside it. A tiny hole was chewed in the back wall. Ms. Ruiz dusted that shelf on Thursday and moved the house twice. Two students stayed late on Thursday to finish their reading. The gumdrops that went were the three nearest the edge. Nobody heard anything in the night.",
    q: "Who took the gumdrops? Choose one and show the words.",
    why: [
      "droppings on the shelf and a hole chewed in the back",
      "dusted that shelf and moved the house twice",
      "two who stayed late on Thursday to finish reading",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Small brown droppings sat on the shelf beside it.”", "“A tiny hole was chewed in the back wall.”"], but: "“Ms. Ruiz dusted that shelf on Thursday and moved the house twice.”" },
      { who: 1, ev: ["“Ms. Ruiz dusted that shelf on Thursday and moved the house twice.”"], but: "“A tiny hole was chewed in the back wall.”" },
      { who: 2, ev: ["“Two students stayed late on Thursday to finish their reading.”", "“The gumdrops that went were the three nearest the edge.”"], but: "“Small brown droppings sat on the shelf beside it.”" },
    ],
    clears: [],
    note:
      "A chewed hole is the one piece of evidence a person cannot easily have made, and it should anchor the argument. The three nearest the edge is the detail that keeps the children in the case, because it is what a hand in a hurry would take.",
  },
  17: {
    story:
      "The Kims' tree lights would not come on. June found the plug lying on the floor by the vacuum cleaner. Mum vacuumed under the tree that afternoon. The cat sleeps under the tree every evening and knocked an ornament down on Tuesday. Dad checked the first ten bulbs and stopped. The string has eighty bulbs on it. Nothing smelled burnt and no bulb looked black inside.",
    q: "Why will the lights not come on? Pick one answer and back it up.",
    why: [
      "a plug on the floor by the vacuum, used under the tree",
      "sleeps under the tree and knocked an ornament down",
      "only the first ten bulbs checked out of eighty",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“June found the plug lying on the floor by the vacuum cleaner.”", "“Mum vacuumed under the tree that afternoon.”"], but: "“The cat sleeps under the tree every evening and knocked an ornament down on Tuesday.”" },
      { who: 1, ev: ["“The cat sleeps under the tree every evening and knocked an ornament down on Tuesday.”"], but: "“Mum vacuumed under the tree that afternoon.”" },
      { who: 2, ev: ["“Dad checked the first ten bulbs and stopped.”", "“The string has eighty bulbs on it.”"], but: "“June found the plug lying on the floor by the vacuum cleaner.”" },
    ],
    clears: [],
    note:
      "Ten bulbs out of eighty is the number to stop on, because checking an eighth of something is not checking it. The plug on the floor is still the simplest answer, and the vacuum and the cat are two ways it could have got there. Nothing in the case chooses between them.",
  },
  18: {
    story:
      "After winter break the wall clock said 2:15 when it was half past eight. The hands were not moving at all. The battery was old and crusted white. The caretaker was in the room twice over break to fix a window. A power cut hit the school at 2:15 on the second day of break. Battery clocks do not stop in a power cut.",
    q: "Why did the clock stop? Choose one answer and prove it.",
    who: ["", "🧹 The caretaker", "🔌 The power cut"],
    why: [
      "an old battery crusted white, with the hands still",
      "in the room twice over break to fix a window",
      "a cut at 2:15 on the second day of break",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The battery was old and crusted white.”", "“The hands were not moving at all.”"], but: "“A power cut hit the school at 2:15 on the second day of break.”" },
      { who: 1, ev: ["“The caretaker was in the room twice over break to fix a window.”"], but: "“The battery was old and crusted white.”" },
      { who: 2, ev: ["“A power cut hit the school at 2:15 on the second day of break.”"], but: "“Battery clocks do not stop in a power cut.”" },
    ],
    clears: [],
    note:
      "The power cut at exactly 2:15 is the kind of coincidence that feels like proof, and the next sentence takes it away. That pair is the whole case. A crusted battery can also stop at any time, including 2:15, and children should be asked whether a matching time is really evidence.",
  },
  19: {
    story:
      "The class built a giant snowman at recess. After lunch he was half the size. His carrot nose lay on the ground. The sun was bright and the snow around him was wet and slushy. The thermometer by the door said forty-five degrees. A dog ran across the yard at lunchtime and the snow is too soft to hold a print. Two children came out early and were seen near the snowman.",
    q: "What happened to the snowman? Pick one and quote the story.",
    why: [
      "bright sun, slushy snow and forty-five degrees",
      "across the yard at lunchtime, on snow too soft for prints",
      "two out early and seen near the snowman",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The sun was bright and the snow around him was wet and slushy.”", "“The thermometer by the door said forty-five degrees.”"], but: "“Two children came out early and were seen near the snowman.”" },
      { who: 1, ev: ["“A dog ran across the yard at lunchtime and the snow is too soft to hold a print.”"], but: "“The thermometer by the door said forty-five degrees.”" },
      { who: 2, ev: ["“Two children came out early and were seen near the snowman.”", "“His carrot nose lay on the ground.”"], but: "“The sun was bright and the snow around him was wet and slushy.”" },
    ],
    clears: [],
    note:
      "No paw prints used to clear the dog and now the story says the snow is too soft to hold one. Missing evidence is not the same as evidence of nothing, and that is a big idea for eight-year-olds. Half the size, evenly, is what melting looks like; a push leaves a side knocked in.",
  },
  20: {
    story:
      "On Monday the bird feeder lay on the ground with every seed gone. Big hoof prints were in the snow under the tree. Bark was rubbed off the trunk at shoulder height. The branch it hung from is thin and bent low with the weight. Mr. Bell cleared snow from that path on Sunday with a shovel. Forty starlings came to the feeder on Saturday.",
    q: "What brought the feeder down? Make the case for one answer.",
    why: [
      "hoof prints and bark rubbed off at shoulder height",
      "forty of them at the feeder on Saturday",
      "clearing snow from that path on Sunday with a shovel",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Big hoof prints were in the snow under the tree.”", "“Bark was rubbed off the trunk at shoulder height.”"], but: "“Mr. Bell cleared snow from that path on Sunday with a shovel.”" },
      { who: 1, ev: ["“Forty starlings came to the feeder on Saturday.”", "“The branch it hung from is thin and bent low with the weight.”"], but: "“Big hoof prints were in the snow under the tree.”" },
      { who: 2, ev: ["“Mr. Bell cleared snow from that path on Sunday with a shovel.”"], but: "“Bark was rubbed off the trunk at shoulder height.”" },
    ],
    clears: [],
    note:
      "One small bird cannot pull a feeder down and forty of them on a thin branch is a different question. That is a sentence the old case did not let anybody ask. The rubbed bark is still the best evidence, and children should say what height shoulder height means for a deer.",
  },
  21: {
    story:
      "Grandpa made cocoa and set out a bowl of marshmallows. When Nora came back from washing her hands the bowl was empty. Max had white powder on his fingers and a puffy cheek. Grandpa put a handful into each mug before he stirred. The dog came in from the snow and was shut in the kitchen for ten minutes. The bowl was on the low shelf by the door.",
    q: "Who emptied the bowl? Choose one answer and show the words.",
    why: [
      "white powder on his fingers and a puffy cheek",
      "a handful into each mug before he stirred",
      "shut in the kitchen ten minutes, with the bowl on a low shelf",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Max had white powder on his fingers and a puffy cheek.”"], but: "“Grandpa put a handful into each mug before he stirred.”" },
      { who: 1, ev: ["“Grandpa put a handful into each mug before he stirred.”"], but: "“Max had white powder on his fingers and a puffy cheek.”" },
      { who: 2, ev: ["“The dog came in from the snow and was shut in the kitchen for ten minutes.”", "“The bowl was on the low shelf by the door.”"], but: "“When Nora came back from washing her hands the bowl was empty.”" },
    ],
    clears: [],
    note:
      "Empty is the word to push on. Grandpa took handfuls for the mugs, which may be most of the bowl, and Max may only have taken the last few. Two suspects can share one bowl, and a class that reaches that answer has done better than one that picks a single name.",
  },
  22: {
    story:
      "Five valentines were missing from Kai's paper bag after lunch. Ms. Rose found pink cards in the bushes under the open window. The flag on the pole was flapping hard. Kai's bag is the closest one to the window. Two children came back early from lunch for their coats. Ms. Rose tidied the bags into a neat row before lunch. Nobody counted the cards that morning.",
    q: "Where did the valentines go? Pick one answer and prove it.",
    why: [
      "an open window, cards in the bushes and a flapping flag",
      "two back early from lunch for their coats",
      "tidied the bags into a neat row before lunch",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Ms. Rose found pink cards in the bushes under the open window.”", "“The flag on the pole was flapping hard.”"], but: "“Two children came back early from lunch for their coats.”" },
      { who: 1, ev: ["“Two children came back early from lunch for their coats.”"], but: "“The flag on the pole was flapping hard.”" },
      { who: 2, ev: ["“Ms. Rose tidied the bags into a neat row before lunch.”", "“Nobody counted the cards that morning.”"], but: "“Kai's bag is the closest one to the window.”" },
    ],
    clears: [],
    note:
      "Cards in the bushes under the window is strong and it is not the whole story, because five went and the case never says how many were found. Nobody counted them that morning either. Ask how we would know five are missing at all, and watch a good argument start.",
  },
  23: {
    story:
      "At the science fair, Ben's volcano was supposed to fizz and bubble. He poured in the vinegar and nothing happened. Ruby looked at the box of baking soda. It was full of white powder, but the label said Powdered Sugar. The vinegar bottle had stood open on the kitchen shelf since last summer. Ms. Lane moved the table an hour before, and the cone leaned over. A leaning cone spills instead of fizzing upward.",
    q: "Why did the volcano not erupt? Pick one answer and prove it.",
    who: ["", "⚖️ The judge moving the table", ""],
    why: [
      "a box labelled Powdered Sugar, full of white powder",
      "moved the table an hour before, leaving the cone leaning",
      "a bottle left open on the shelf since last summer",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“It was full of white powder, but the label said Powdered Sugar.”"], but: "“The vinegar bottle had stood open on the kitchen shelf since last summer.”" },
      { who: 1, ev: ["“Ms. Lane moved the table an hour before, and the cone leaned over.”", "“A leaning cone spills instead of fizzing upward.”"], but: "“It was full of white powder, but the label said Powdered Sugar.”" },
      { who: 2, ev: ["“The vinegar bottle had stood open on the kitchen shelf since last summer.”"], but: "“He poured in the vinegar and nothing happened.”" },
    ],
    clears: [],
    note:
      "The label is the loudest clue and it is worth asking what a label proves. A box can be refilled. Nothing happened at all is the phrase to lean on, because a leaning cone would still have fizzed somewhere, and old vinegar would still have made a little gas.",
  },
  24: {
    story:
      "The night before the play, the king's gold crown went missing. The costume box had glitter spilled all over it. A trail of gold glitter led down the hall to the art room. Zoe was in the art room painting a castle, with glitter on her hands. Mr. Fox carried the costume box to the stage before rehearsal. Kenji took his crown home on Tuesday to practise wearing it.",
    q: "Where is the crown? Choose one answer and show the words.",
    why: [
      "a glitter trail to the art room, and glitter on her hands",
      "carried the costume box to the stage before rehearsal",
      "took his crown home on Tuesday to practise wearing it",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A trail of gold glitter led down the hall to the art room.”", "“Zoe was in the art room painting a castle, with glitter on her hands.”"], but: "“Mr. Fox carried the costume box to the stage before rehearsal.”" },
      { who: 1, ev: ["“Mr. Fox carried the costume box to the stage before rehearsal.”"], but: "“A trail of gold glitter led down the hall to the art room.”" },
      { who: 2, ev: ["“Kenji took his crown home on Tuesday to practise wearing it.”"], but: "“The costume box had glitter spilled all over it.”" },
    ],
    clears: [],
    note:
      "Gold glitter is everywhere in this case, which makes it weaker evidence than it looks: a box covered in it marks whoever touches it. Kenji taking the crown home is the plainest answer and the easiest to check, and children should notice nobody has asked him.",
  },
  25: {
    story:
      "In music class one piano key would not make a sound. Mrs. Song opened the top and found a striped sock stuck on the strings. The sock had a name tag that said Theo. Theo laid his wet socks on top of the piano after recess. The window above the piano was open all morning. The felt under that key is worn through to the wood. A worn key can stick without anything inside the piano.",
    q: "Why is the key silent? Pick one and quote the story.",
    who: ["", "🪟 The open window", "🎹 The worn felt"],
    why: [
      "a sock with his name tag, laid on the piano to dry",
      "open above the piano all morning",
      "worn through to the wood under that key",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The sock had a name tag that said Theo.”", "“Theo laid his wet socks on top of the piano after recess.”"], but: "“The felt under that key is worn through to the wood.”" },
      { who: 1, ev: ["“The window above the piano was open all morning.”"], but: "“The sock had a name tag that said Theo.”" },
      { who: 2, ev: ["“The felt under that key is worn through to the wood.”", "“A worn key can stick without anything inside the piano.”"], but: "“Mrs. Song opened the top and found a striped sock stuck on the strings.”" },
    ],
    clears: [],
    note:
      "A sock on the strings is real and the worn felt is real, and both can stop a key. The test is free and the class can say it: take the sock out and press the key again. Children who propose that have done the most useful thing in the lesson.",
  },
  26: {
    story:
      "On a windy March day, Zara flew her rainbow kite at the park. The string went slack and the kite disappeared. A rainbow tail now hangs from the top of a tall oak. The broken string is tangled in the branches. Sam was on the swings under that same oak. The string had a knot in it that Zara tied herself last week. A knotted string snaps at the knot when the wind pulls hard.",
    q: "Why did the kite come down? Make the case for one answer.",
    who: ["", "", "🪢 The knot in the string"],
    why: [
      "a rainbow tail in the oak and string tangled in the branches",
      "on the swings under that same oak",
      "a knot she tied last week, where a string snaps",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A rainbow tail now hangs from the top of a tall oak.”", "“The broken string is tangled in the branches.”"], but: "“The string had a knot in it that Zara tied herself last week.”" },
      { who: 1, ev: ["“Sam was on the swings under that same oak.”"], but: "“A rainbow tail now hangs from the top of a tall oak.”" },
      { who: 2, ev: ["“The string had a knot in it that Zara tied herself last week.”", "“A knotted string snaps at the knot when the wind pulls hard.”"], but: "“The broken string is tangled in the branches.”" },
    ],
    clears: [],
    note:
      "Everybody can see where the kite is, so the real question is why the string broke. The knot is the only answer that explains a break rather than a tangle. Ask where the broken end is, and whether anybody has looked at it.",
  },
  27: {
    story:
      "On St. Patrick's Day, green footprints went across the hallway. They started at the art room door. Inside, a can of green paint was tipped over on the floor. Leo's sneakers had wet green paint on the bottoms. Ms. Fern carried the paint can to the sink before she went for copies. The leprechaun trap by the door has a green smear on its lid.",
    q: "Who made the green footprints? Choose one and back it up.",
    who: ["", "🪤 Whoever set off the trap", ""],
    why: [
      "wet green paint on the bottoms of his sneakers",
      "a green smear on the lid of the trap",
      "carried the paint can to the sink before leaving",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Leo's sneakers had wet green paint on the bottoms.”"], but: "“Ms. Fern carried the paint can to the sink before she went for copies.”" },
      { who: 1, ev: ["“The leprechaun trap by the door has a green smear on its lid.”"], but: "“Inside, a can of green paint was tipped over on the floor.”" },
      { who: 2, ev: ["“Ms. Fern carried the paint can to the sink before she went for copies.”", "“They started at the art room door.”"], but: "“Leo's sneakers had wet green paint on the bottoms.”" },
    ],
    clears: [],
    note:
      "Paint on Leo's shoes proves Leo stepped in paint. It does not prove he tipped the can, and it does not prove the prints in the hall are his. Ask whether anybody has matched the prints to his sneakers, because the case never says they did.",
  },
  28: {
    story:
      "During a spring storm a puddle appeared in the middle of the hallway. Mr. Diaz looked up and saw a brown stain on the ceiling tile. Every few seconds a drop of water fell from it. The water fountain at the end of the hall was leaking at its pipe on Monday. A leak can run along a floor and gather in a low spot. Three children came in soaked and shook out their coats right there.",
    q: "Where did the puddle come from? Pick one answer and prove it.",
    who: ["", "🧥 Wet coats shaken out", ""],
    why: [
      "a brown ceiling stain with a drop falling every few seconds",
      "three children shaking out soaked coats right there",
      "a fountain pipe that was leaking on Monday",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Mr. Diaz looked up and saw a brown stain on the ceiling tile.”", "“Every few seconds a drop of water fell from it.”"], but: "“Three children came in soaked and shook out their coats right there.”" },
      { who: 1, ev: ["“Three children came in soaked and shook out their coats right there.”"], but: "“Every few seconds a drop of water fell from it.”" },
      { who: 2, ev: ["“The water fountain at the end of the hall was leaking at its pipe on Monday.”", "“A leak can run along a floor and gather in a low spot.”"], but: "“Mr. Diaz looked up and saw a brown stain on the ceiling tile.”" },
    ],
    clears: [],
    note:
      "A drop falling every few seconds is the strongest sentence in the case, because it is still happening while everybody watches. Shaken coats stop. Ask what the puddle will look like in an hour under each answer, and the class has designed a test without being told to.",
  },
  29: {
    story:
      "Mrs. Gray's class planted lettuce in the school garden. On Friday the lettuce had big bites taken out of it. There were long thin tracks in the dirt and a rabbit hole under the fence. The bird feeder hangs right above the lettuce bed and was empty by Thursday. Hungry birds will come down for leaves when the seed runs out. Speedy the turtle was taken out to the garden on Wednesday to see the sun.",
    q: "Who ate the lettuce? Choose one answer and show the words.",
    why: [
      "thin tracks in the dirt and a hole under the fence",
      "a feeder emptied by Thursday, right above the bed",
      "taken out to the garden on Wednesday to see the sun",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“There were long thin tracks in the dirt and a rabbit hole under the fence.”"], but: "“The bird feeder hangs right above the lettuce bed and was empty by Thursday.”" },
      { who: 1, ev: ["“The bird feeder hangs right above the lettuce bed and was empty by Thursday.”", "“Hungry birds will come down for leaves when the seed runs out.”"], but: "“There were long thin tracks in the dirt and a rabbit hole under the fence.”" },
      { who: 2, ev: ["“Speedy the turtle was taken out to the garden on Wednesday to see the sun.”"], but: "“On Friday the lettuce had big bites taken out of it.”" },
    ],
    clears: [],
    note:
      "Big bites is the phrase that separates these. A bird takes a peck, a rabbit takes a mouthful, and a turtle takes its time. Ask the class to show with their hands how big a bite each suspect would leave, and then look at the lettuce again.",
  },
  30: {
    story:
      "A robin built a nest in the bush outside Room 9. The class watched three blue eggs every day. One morning the eggs were gone. Pieces of blue shell lay at the bottom of the nest. Three fuzzy baby birds poked their heads up with their mouths open. A cat sits on the wall by that bush most afternoons. Shell broken by a hatching chick is cracked from the inside out.",
    q: "What happened to the eggs? Pick one and prove it from the story.",
    who: ["", "", "🧐 Which way the shell broke"],
    why: [
      "shell in the nest and three chicks with their mouths open",
      "on the wall by that bush most afternoons",
      "shell cracked from the inside out when a chick hatches",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Three fuzzy baby birds poked their heads up with their mouths open.”", "“Pieces of blue shell lay at the bottom of the nest.”"], but: "“A cat sits on the wall by that bush most afternoons.”" },
      { who: 1, ev: ["“A cat sits on the wall by that bush most afternoons.”"], but: "“Three fuzzy baby birds poked their heads up with their mouths open.”" },
      { who: 2, ev: ["“Shell broken by a hatching chick is cracked from the inside out.”"], but: "“One morning the eggs were gone.”" },
    ],
    clears: [],
    note:
      "Three eggs gone and three chicks arrived is the arithmetic that answers this, and most children will see it at once. The useful part is the last sentence, which tells them how to prove it rather than assume it. Looking at which way a shell is bent is real science.",
  },
  31: {
    story:
      "For Earth Day the class cleaned up Maple Park. Trash lay all around the picnic table. The can lid was off and the bag inside was ripped open. Wrappers had little bite marks on them. Muddy paw prints with five fingers led to the creek. The ranger emptied the can last week and left the lid leaning against it. A strong wind blew through the park on Tuesday night.",
    q: "Who made the mess? Make the case for one answer.",
    who: ["", "", "🌬️ Tuesday night's wind"],
    why: [
      "a ripped bag, bite marks and five-fingered prints",
      "emptied the can and left the lid leaning against it",
      "a strong wind through the park on Tuesday night",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Wrappers had little bite marks on them.”", "“Muddy paw prints with five fingers led to the creek.”"], but: "“The ranger emptied the can last week and left the lid leaning against it.”" },
      { who: 1, ev: ["“The ranger emptied the can last week and left the lid leaning against it.”"], but: "“Wrappers had little bite marks on them.”" },
      { who: 2, ev: ["“A strong wind blew through the park on Tuesday night.”", "“The can lid was off and the bag inside was ripped open.”"], but: "“Muddy paw prints with five fingers led to the creek.”" },
    ],
    clears: [],
    note:
      "Bite marks are the one thing wind cannot do, and the class should find them fast. A lid left leaning is not the same as a lid left tight, so the ranger is in the case now in a way she was not before. Three answers can all be partly true here.",
  },
  32: {
    story:
      "At the zoo, Ms. Ray took pictures with the class camera. Back on the bus, the camera was gone. Ty remembered her setting it on the bench by the penguins. The zoo worker at the penguin house found a camera on that bench. Ms. Ray carried an open tote bag all afternoon. The bus driver loaded twelve bags into the hold while the class queued.",
    q: "Where is the camera? Choose one answer and quote the story.",
    who: ["", "👜 The open tote bag", ""],
    why: [
      "set on the bench by the penguins, where a worker found one",
      "an open tote carried all afternoon",
      "loaded twelve bags into the hold while the class queued",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Ty remembered her setting it on the bench by the penguins.”", "“The zoo worker at the penguin house found a camera on that bench.”"], but: "“Ms. Ray carried an open tote bag all afternoon.”" },
      { who: 1, ev: ["“Ms. Ray carried an open tote bag all afternoon.”"], but: "“The zoo worker at the penguin house found a camera on that bench.”" },
      { who: 2, ev: ["“The bus driver loaded twelve bags into the hold while the class queued.”"], but: "“Ty remembered her setting it on the bench by the penguins.”" },
    ],
    clears: [],
    note:
      "A camera on that bench is strong and it is still a camera, not the camera. Zoos have more than one visitor. Ask what would make it certain, and listen for children who say the pictures inside it would show the class.",
  },
  33: {
    story:
      "The class planted bean seeds in cups. Every plant grew tall and green except one. Jin's plant was pale yellow and droopy. His cup had been moved into the dark supply closet to make room. The other cups sat on the sunny windowsill. Jin watered his plant every day and the soil was still wet. Roots sitting in wet soil rot and cannot drink. Jin's seed came from the bottom of the packet.",
    q: "Why is Jin's plant droopy? Pick one answer and back it up.",
    who: ["", "🪣 Too much water", "📦 A seed from the bottom of the packet"],
    why: [
      "moved into the dark closet, away from the sunny sill",
      "watered every day, with soil that is still wet",
      "a seed taken from the bottom of the packet",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“His cup had been moved into the dark supply closet to make room.”", "“The other cups sat on the sunny windowsill.”"], but: "“Jin watered his plant every day and the soil was still wet.”" },
      { who: 1, ev: ["“Jin watered his plant every day and the soil was still wet.”", "“Roots sitting in wet soil rot and cannot drink.”"], but: "“His cup had been moved into the dark supply closet to make room.”" },
      { who: 2, ev: ["“Jin's seed came from the bottom of the packet.”"], but: "“Every plant grew tall and green except one.”" },
    ],
    clears: [],
    note:
      "Watering every day used to clear the water and now it accuses it, which is a good surprise for a class that has met this case before. Pale and yellow fits the dark closet; droopy and wet fits the drowning. Both sentences are on the page and they point different ways.",
  },
  34: {
    story:
      "Mr. Fox put ice cream in the teacher lounge freezer. At two o'clock it was soup. The freezer door was open a crack with a box of paper plates stuck in it. Cold air was coming out into the room. Ms. Hall put the plates on the top shelf that morning. The lounge window faces south and the sun falls on the freezer all afternoon. The freezer was unplugged for ten minutes while the kettle was moved.",
    q: "Why did the ice cream melt? Choose one and show the words.",
    who: ["", "🔌 The ten minutes unplugged", "☀️ Sun on the freezer"],
    why: [
      "a door held open a crack by a box of plates",
      "ten minutes unplugged while the kettle was moved",
      "a south window with sun on the freezer all afternoon",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The freezer door was open a crack with a box of paper plates stuck in it.”", "“Cold air was coming out into the room.”"], but: "“The freezer was unplugged for ten minutes while the kettle was moved.”" },
      { who: 1, ev: ["“The freezer was unplugged for ten minutes while the kettle was moved.”"], but: "“Cold air was coming out into the room.”" },
      { who: 2, ev: ["“The lounge window faces south and the sun falls on the freezer all afternoon.”"], but: "“The freezer door was open a crack with a box of paper plates stuck in it.”" },
    ],
    clears: [],
    note:
      "Ten minutes is a short time and a whole morning is a long one, so this case can be argued with a clock. Cold air coming out into the room is the sentence that shows the door fault was still working at two. Ask which answer stops and which keeps going.",
  },
  35: {
    story:
      "On Field Day, Maya won a blue first-place ribbon and clipped it to her water bottle. When she came back from the sack race it was gone. A gust of wind blew everyone's hats around. Something blue was flapping against the fence at the edge of the field. Ally finished the sack race early and went back for her bottle. The clip on Maya's ribbon was bent open before the race.",
    q: "Where did the ribbon go? Pick one answer and prove it.",
    who: ["", "", "📎 The bent clip"],
    why: [
      "a gust of wind and something blue on the fence",
      "finished the sack race early and went back for her bottle",
      "a clip already bent open before the race",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“A gust of wind blew everyone's hats around.”", "“Something blue was flapping against the fence at the edge of the field.”"], but: "“Ally finished the sack race early and went back for her bottle.”" },
      { who: 1, ev: ["“Ally finished the sack race early and went back for her bottle.”"], but: "“Something blue was flapping against the fence at the edge of the field.”" },
      { who: 2, ev: ["“The clip on Maya's ribbon was bent open before the race.”"], but: "“A gust of wind blew everyone's hats around.”" },
    ],
    clears: [],
    note:
      "Something blue is not the same as the ribbon, and a careful reader will say so before anybody runs to the fence. The bent clip explains how the ribbon came off and says nothing about where it went. Two answers can both be needed, and that is worth naming.",
  },
  36: {
    story:
      "On the last day of school the class tied balloons to the playground fence. One by one they started to pop. The balloons were in bright sun and the thermometer said ninety degrees. The balloons in the shade by the door were still fine. The fence has a line of sharp wire ends along the top rail. The sunny balloons were blown up biggest because they went up first.",
    q: "Why did the balloons pop? Make the case for one answer.",
    who: ["", "📌 The sharp wire ends", "💨 Blown up biggest"],
    why: [
      "ninety degrees, with the shady ones still fine",
      "a line of sharp wire ends along the top rail",
      "blown up biggest because they went up first",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The balloons were in bright sun and the thermometer said ninety degrees.”", "“The balloons in the shade by the door were still fine.”"], but: "“The fence has a line of sharp wire ends along the top rail.”" },
      { who: 1, ev: ["“The fence has a line of sharp wire ends along the top rail.”"], but: "“The balloons in the shade by the door were still fine.”" },
      { who: 2, ev: ["“The sunny balloons were blown up biggest because they went up first.”"], but: "“On the last day of school the class tied balloons to the playground fence.”" },
    ],
    clears: [],
    note:
      "The shady balloons are the control and they are the best thing in the story, because they share the fence and not the sun. That beats the wire. The last sentence is the sly one: the sunny balloons were also the fullest, so sun and size travel together and the case cannot separate them.",
  },
};
