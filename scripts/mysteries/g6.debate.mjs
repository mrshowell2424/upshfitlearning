/**
 * Grade 6, the debate version of each case. See scripts/mysteries/g5.debate.mjs
 * for what these files are and what the gate holds them to.
 *
 * Grade 6 is the first level with four suspects, and that changes the shape
 * of the exercise rather than just its size. Three are left open and one is
 * genuinely ruled out, so a student still has to do the elimination before
 * they can start the argument. Saying which suspect is out, and quoting the
 * line that puts them out, is half the answer here.
 */
export const DEBATES = {
  1: {
    story:
      "The reference desk logged eleven atlases missing in March. All eleven had been on the shelf in January. The library changed its labels in February and moved atlases out of 912. A volunteer refiled returns on two Saturdays in March. Taped to her cart was the January shelf guide, which still listed every atlas at 912. In March the 912 shelf held eleven atlases the catalog placed elsewhere. The loan system shows no atlas off the shelf between November and April. A box of eleven books went out to the book fair in March and three came back. The catalog was edited by four people during the February relabel, with no log kept. Two spines carry a geography label and an old 912 label at once.",
    q: "Where did the eleven atlases go? Pick one answer and prove it from the text.",
    why: [
      "the January guide on her cart, still listing every atlas at 912",
      "no atlas off the shelf between November and April",
      "eleven out to the book fair in March, and three back",
      "four editors in February with no log, and two spines double-labelled",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“Taped to her cart was the January shelf guide, which still listed every atlas at 912.”", "“In March the 912 shelf held eleven atlases the catalog placed elsewhere.”"], but: "“A box of eleven books went out to the book fair in March and three came back.”" },
      { who: 2, ev: ["“A box of eleven books went out to the book fair in March and three came back.”", "“The reference desk logged eleven atlases missing in March.”"], but: "“All eleven had been on the shelf in January.”" },
      { who: 3, ev: ["“The catalog was edited by four people during the February relabel, with no log kept.”", "“Two spines carry a geography label and an old 912 label at once.”"], but: "“The library changed its labels in February and moved atlases out of 912.”" },
    ],
    clears: ["Winter checkouts: “The loan system shows no atlas off the shelf between November and April.”"],
    note:
      "Eleven is the number to work with. It is the count of missing atlases, the count on the 912 shelf, and the count in the book fair box, and the case will not say which eleven is which. Rule the loans out first and say so. Then ask whether anything is actually missing, or whether the desk counted a shelf and the catalog counted a label.",
  },
  2: {
    story:
      "Dion's sandwich came out of his lunchbox soaked every day for a week. The bread was wet only on the side facing his thermos. Air holds water vapor, and cold surfaces pull that vapor back into drops. The classroom was warm and humid all week from the radiator. The thermos sat against the sandwich bag inside the closed box. By lunch the outside of the thermos ran with water. The thermos lid has a worn gasket and was found loose on Thursday. He fills it at the sink each morning and does not dry it before packing. The lunchbox is a sealed plastic box with no holes anywhere in it. A wet thermos in a closed box has nowhere to put its water.",
    q: "Why was the sandwich soaked? Choose one cause and back it from the story.",
    why: [
      "a cold surface in warm humid air, running with water by lunch",
      "a sealed plastic box with no holes anywhere in it",
      "a worn gasket, found loose on Thursday",
      "filled at the sink each morning and packed without drying",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“Air holds water vapor, and cold surfaces pull that vapor back into drops.”", "“By lunch the outside of the thermos ran with water.”"], but: "“The thermos lid has a worn gasket and was found loose on Thursday.”" },
      { who: 2, ev: ["“The thermos lid has a worn gasket and was found loose on Thursday.”", "“The bread was wet only on the side facing his thermos.”"], but: "“Air holds water vapor, and cold surfaces pull that vapor back into drops.”" },
      { who: 3, ev: ["“He fills it at the sink each morning and does not dry it before packing.”", "“A wet thermos in a closed box has nowhere to put its water.”"], but: "“By lunch the outside of the thermos ran with water.”" },
    ],
    clears: ["A hole in the lunchbox: “The lunchbox is a sealed plastic box with no holes anywhere in it.”"],
    note:
      "All three open answers put water on the outside of the thermos, so the wet bread does not choose between them. What might is amount: a few drops from the sink, a steady film from the air, or a leak from a loose lid. Ask which one would soak bread every day for five days running.",
  },
  3: {
    story:
      "Room 14 measured its pencils every Friday as a data lesson. In October the class lost an average of nine millimeters a week. In November that number jumped to twenty-six. The old sharpener broke on the first of November. The new one has a deeper cone and a wider blade. A single turn in the new sharpener removes nearly three times the wood. The new sharpener is electric and the class queued at it all November. Four pencils were never returned to the cup in the last week of November. Every pencil in the box is the same brand, bought in one order in September. Ms. Reyes measures what is in the cup on Friday, not what each child holds.",
    q: "Why did the pencils get shorter faster? Make the case for one answer.",
    why: [
      "a deeper cone taking nearly three times the wood a turn",
      "an electric sharpener with a queue at it all November",
      "one brand, bought in one order in September",
      "four never returned to the cup in the last week",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The new one has a deeper cone and a wider blade.”", "“A single turn in the new sharpener removes nearly three times the wood.”"], but: "“The new sharpener is electric and the class queued at it all November.”" },
      { who: 1, ev: ["“The new sharpener is electric and the class queued at it all November.”", "“The old sharpener broke on the first of November.”"], but: "“A single turn in the new sharpener removes nearly three times the wood.”" },
      { who: 3, ev: ["“Four pencils were never returned to the cup in the last week of November.”", "“Ms. Reyes measures what is in the cup on Friday, not what each child holds.”"], but: "“In November that number jumped to twenty-six.”" },
    ],
    clears: ["A different brand: “Every pencil in the box is the same brand, bought in one order in September.”"],
    note:
      "Nine to twenty-six is nearly three times, and so is the wood each turn takes, which makes the sharpener the neat answer. The queue argument is better than it looks, because a machine that is fun to use gets used more. The missing-pencil answer is about the measurement rather than the pencils: an average over a cup changes when pencils leave the cup.",
  },
  4: {
    story:
      "Six apple halves sat on a tray for the science fair. Five turned brown within an hour and one stayed white all afternoon. A cut apple browns because an enzyme in the flesh reacts with oxygen. Acid slows that enzyme down and can stop it almost completely. Priya squeezed lemon over one half before she set the tray out. The white half sat at the end of the tray nearest the open window. A draught from that window kept that corner about eight degrees cooler. Cold slows the same enzyme that acid does. A paper label had been laid face down across the white half until noon. All six halves were cut from one apple with one knife.",
    q: "Why did one half stay white? Pick one cause and prove it.",
    why: [
      "lemon squeezed over it, and acid slows the enzyme",
      "a draught keeping that corner eight degrees cooler",
      "one apple, one knife, six halves",
      "a paper label laid face down across it until noon",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“Priya squeezed lemon over one half before she set the tray out.”", "“Acid slows that enzyme down and can stop it almost completely.”"], but: "“A draught from that window kept that corner about eight degrees cooler.”" },
      { who: 1, ev: ["“A draught from that window kept that corner about eight degrees cooler.”", "“Cold slows the same enzyme that acid does.”"], but: "“Priya squeezed lemon over one half before she set the tray out.”" },
      { who: 3, ev: ["“A paper label had been laid face down across the white half until noon.”", "“A cut apple browns because an enzyme in the flesh reacts with oxygen.”"], but: "“Five turned brown within an hour and one stayed white all afternoon.”" },
    ],
    clears: ["A different apple: “All six halves were cut from one apple with one knife.”"],
    note:
      "The experiment has three things wrong with it and that is the lesson. One half got lemon, sat in the coldest spot, and spent the morning under a label, so whatever it proves, it does not prove the lemon. Ask the class how they would redo it, and insist that only one thing may change at a time.",
  },
  5: {
    story:
      "Marco's front tire read low every cold morning and fine every afternoon. He pumped it to forty pounds on Monday and it read thirty-two at dawn. By three o'clock the same tire read thirty-nine. Gas takes up less room when it gets colder and presses out less hard. The shed was thirty-eight degrees at dawn and seventy-one in the afternoon. The tube was patched twice last summer and one patch has lifted at its edge. A patch that lifts in the cold can seal again as the rubber warms. The valve core turns with a finger and has never been tightened. His rear tire, pumped the same morning, held forty all week.",
    q: "Why does the front tire read low in the morning? Argue for one cause.",
    why: [
      "thirty-eight degrees at dawn against seventy-one by afternoon",
      "a patch lifted at its edge since last summer",
      "a core that turns with a finger and was never tightened",
      "a rear tire that held forty all week",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Gas takes up less room when it gets colder and presses out less hard.”", "“The shed was thirty-eight degrees at dawn and seventy-one in the afternoon.”"], but: "“The tube was patched twice last summer and one patch has lifted at its edge.”" },
      { who: 1, ev: ["“The tube was patched twice last summer and one patch has lifted at its edge.”", "“A patch that lifts in the cold can seal again as the rubber warms.”"], but: "“By three o'clock the same tire read thirty-nine.”" },
      { who: 2, ev: ["“The valve core turns with a finger and has never been tightened.”", "“He pumped it to forty pounds on Monday and it read thirty-two at dawn.”"], but: "“Gas takes up less room when it gets colder and presses out less hard.”" },
    ],
    clears: ["Weight on the front: “His rear tire, pumped the same morning, held forty all week.”"],
    note:
      "The rear tire is the control and it does two jobs: it clears the weight and it makes trouble for the cold answer, because a rear tire sits in the same cold shed. A student who notices that has found the best objection in the case. A leak that reseals when it warms is the one explanation that survives it.",
  },
  6: {
    story:
      "The classroom tank ran clear for two years and went cloudy in four days. The water tested high for ammonia for the first time ever. A healthy tank carries bacteria in the filter that eat ammonia as fast as it appears. Those bacteria live in the filter sponge, not in the water. Ms. Oyelaran replaced the whole filter cartridge on Sunday, sponge and all. The new cartridge came sealed and sterile out of the box. A student fed the fish on Friday and again on Monday, not knowing about the other. The heater has read two degrees high since the thermostat was knocked in October. Warm water speeds up everything that rots in a tank. The fish count has been six since last spring.",
    q: "Why did the tank go cloudy? Choose one cause and quote the story.",
    why: [
      "a sealed sterile cartridge, sponge and all",
      "six fish since last spring",
      "fed Friday and Monday by two people who did not know",
      "a heater reading two degrees high since October",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“Ms. Oyelaran replaced the whole filter cartridge on Sunday, sponge and all.”", "“The new cartridge came sealed and sterile out of the box.”"], but: "“A student fed the fish on Friday and again on Monday, not knowing about the other.”" },
      { who: 2, ev: ["“A student fed the fish on Friday and again on Monday, not knowing about the other.”", "“The water tested high for ammonia for the first time ever.”"], but: "“Those bacteria live in the filter sponge, not in the water.”" },
      { who: 3, ev: ["“The heater has read two degrees high since the thermostat was knocked in October.”", "“Warm water speeds up everything that rots in a tank.”"], but: "“The classroom tank ran clear for two years and went cloudy in four days.”" },
    ],
    clears: ["A new fish: “The fish count has been six since last spring.”"],
    note:
      "The heater has been wrong since October and the tank went cloudy in four days, so the dates do most of the work here. Make the class use them. Sunday's cartridge and the double feeding both land in the same week, and the better answers notice that a tank with no bacteria left cannot handle a double feed either.",
  },
  7: {
    story:
      "A low hum filled Room 9 every afternoon and nobody could find it. The hum never came before one o'clock and always stopped by three. Room 9 shares a wall with the gym, where a ceiling fan runs on a timer. That fan starts at one and shuts off at three every school day. A room will ring back at a sound when the sound matches the room's own pitch. The gym fan turns at a rate that matches Room 9 almost exactly. The overhead lights in Room 9 switch to a second ballast at one each day. An old ballast hums at a steady low pitch of its own. The projector in Room 9 is left on standby and its fan runs warm by one. The pipes were capped off in August when the old boiler went, and carry nothing.",
    q: "What is humming in Room 9? Pick one and prove it from the text.",
    why: [
      "a gym fan on a timer from one to three, turning at a matching rate",
      "a second ballast switching in at one, humming low",
      "pipes capped off in August, carrying nothing",
      "a projector left on standby, its fan warm by one",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“That fan starts at one and shuts off at three every school day.”", "“The gym fan turns at a rate that matches Room 9 almost exactly.”"], but: "“The overhead lights in Room 9 switch to a second ballast at one each day.”" },
      { who: 1, ev: ["“The overhead lights in Room 9 switch to a second ballast at one each day.”", "“An old ballast hums at a steady low pitch of its own.”"], but: "“The hum never came before one o'clock and always stopped by three.”" },
      { who: 3, ev: ["“The projector in Room 9 is left on standby and its fan runs warm by one.”", "“A room will ring back at a sound when the sound matches the room's own pitch.”"], but: "“That fan starts at one and shuts off at three every school day.”" },
    ],
    clears: ["The pipes: “The pipes were capped off in August when the old boiler went, and carry nothing.”"],
    note:
      "Three things now start at one o'clock, so one o'clock has stopped being evidence. Three is where the case still has teeth: the gym fan stops at three and the hum stops at three, while a ballast and a projector run until the last bell. A student who argues from the stop rather than the start is reading more carefully.",
  },
  8: {
    story:
      "Four maples line the school drive and one stood bare three weeks early. A tree drops its leaves when it stops sending water and food to them. Drought and heat both start that shutdown sooner than cold does. The bare tree stands at the end of the row beside the asphalt lot. A thermometer in its bed read nine degrees warmer than the beds of the other three. The lot drains away from that bed instead of into it. The hose reaches the first three beds and the fourth is watered by bucket. Whoever carries the bucket has skipped it on four of the last ten rounds. The bare tree was replaced in its second year and is two years younger. A pest survey in July found nothing on any of the four.",
    q: "Why did one maple go bare early? Make the case for one cause.",
    why: [
      "nine degrees warmer, beside a lot that drains away from it",
      "a pest survey in July that found nothing",
      "watered by bucket, and skipped four rounds in ten",
      "replaced in its second year, two years younger than the rest",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“A thermometer in its bed read nine degrees warmer than the beds of the other three.”", "“The lot drains away from that bed instead of into it.”"], but: "“Whoever carries the bucket has skipped it on four of the last ten rounds.”" },
      { who: 2, ev: ["“The hose reaches the first three beds and the fourth is watered by bucket.”", "“Whoever carries the bucket has skipped it on four of the last ten rounds.”"], but: "“A thermometer in its bed read nine degrees warmer than the beds of the other three.”" },
      { who: 3, ev: ["“The bare tree was replaced in its second year and is two years younger.”", "“Four maples line the school drive and one stood bare three weeks early.”"], but: "“The lot drains away from that bed instead of into it.”" },
    ],
    clears: ["Insects or disease: “A pest survey in July found nothing on any of the four.”"],
    note:
      "Heat and dryness are the same shutdown by two routes, which the second sentence says outright. That makes the first two answers allies rather than rivals, and the strongest work in the room will be the student who says so and then argues which route matters more. The younger tree is the weakest case and it is not nothing.",
  },
  9: {
    story:
      "The front-step pumpkin stood firm on Friday and sat flat on Monday. Saturday night dropped to twenty-six degrees and Sunday climbed back to fifty. Water swells as it freezes and pushes outward on whatever holds it. A pumpkin is mostly water held inside stiff cell walls. When those walls burst, the flesh goes soft and the shape gives way. A split runs two inches along the base where it met the wet step. Soft rot starts at a split and spreads through the flesh in days. The step faces south and the pumpkin had sat in full sun for three weeks. A pumpkin that dries from one side caves toward the dry side. No tracks, teeth marks or droppings were found on the step or around it.",
    q: "Why did the pumpkin collapse? Choose one cause and back it up.",
    why: [
      "twenty-six degrees on Saturday night and fifty on Sunday",
      "no tracks, teeth marks or droppings anywhere near it",
      "a two-inch split at the base, on a wet step",
      "three weeks of full sun on a south-facing step",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“Saturday night dropped to twenty-six degrees and Sunday climbed back to fifty.”", "“When those walls burst, the flesh goes soft and the shape gives way.”"], but: "“A split runs two inches along the base where it met the wet step.”" },
      { who: 2, ev: ["“A split runs two inches along the base where it met the wet step.”", "“Soft rot starts at a split and spreads through the flesh in days.”"], but: "“The front-step pumpkin stood firm on Friday and sat flat on Monday.”" },
      { who: 3, ev: ["“The step faces south and the pumpkin had sat in full sun for three weeks.”", "“A pumpkin that dries from one side caves toward the dry side.”"], but: "“Water swells as it freezes and pushes outward on whatever holds it.”" },
    ],
    clears: ["An animal: “No tracks, teeth marks or droppings were found on the step or around it.”"],
    note:
      "Friday firm, Monday flat, is the strongest fact and it fits the freeze best, because rot takes days and drying takes weeks. Hold the class to that timescale. The split is the real complication: it could be where the rot got in, or it could be where the frozen flesh gave way, and the story will not say which.",
  },
  10: {
    story:
      "Frost covered the field on Tuesday and footprints showed on only half of it. The prints ran in a clear line along the fence and stopped at the open grass. The fence throws shade over the north half until nearly noon. The open half takes direct sun from eight o'clock onward. Frost melts wherever the sun reaches it and holds wherever it does not. By the time the class came out at ten, half the frost was gone. The line of prints ends at a gate that opens onto the lane. A second, smaller set of prints crosses the shaded half at an angle. The custodian's round takes him along the fence and back the same way. The whole field was white in the seven o'clock photograph on the office wall.",
    q: "Why did the prints show on only half the field? Pick one and prove it.",
    why: [
      "shade until noon on one half, sun from eight on the other",
      "a round that goes along the fence and back the same way",
      "a seven o'clock photograph showing the whole field white",
      "a second, smaller set crossing the shaded half",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“Frost melts wherever the sun reaches it and holds wherever it does not.”", "“By the time the class came out at ten, half the frost was gone.”"], but: "“The line of prints ends at a gate that opens onto the lane.”" },
      { who: 1, ev: ["“The custodian's round takes him along the fence and back the same way.”", "“The prints ran in a clear line along the fence and stopped at the open grass.”"], but: "“The open half takes direct sun from eight o'clock onward.”" },
      { who: 3, ev: ["“A second, smaller set of prints crosses the shaded half at an angle.”", "“The line of prints ends at a gate that opens onto the lane.”"], but: "“Frost melts wherever the sun reaches it and holds wherever it does not.”" },
    ],
    clears: ["Only half frosting: “The whole field was white in the seven o'clock photograph on the office wall.”"],
    note:
      "The photograph settles one suspect cleanly and everybody should use it. After that the question splits in two, and it is worth naming them separately: why the prints stop, and who made them. The sun answers the first and says nothing about the second, which is why the gate and the smaller prints are still in play.",
  },
  11: {
    story:
      "Bus 12 ran on time all month except on Tuesdays and Thursdays. On those two days it reached school between nine and twelve minutes late. A freight line crosses the route at the halfway point. The rail yard schedules a loaded outbound train for Tuesday and Thursday mornings. A loaded freight at that crossing holds traffic for about ten minutes. The driver logged a stopped train at the crossing on both late days. The depot sheet shows Bus 12 leaving at 7:09 on Tuesdays and Thursdays and 7:01 on the other three. A relief driver covers those two mornings and has driven the route since September. The regular driver clocks in at the depot on all five days. A traffic count found the same number of cars on all five mornings.",
    q: "Why is Bus 12 late on two days? Pick one cause and prove it from the text.",
    why: [
      "a loaded freight scheduled for those two mornings, logged both times",
      "leaving at 7:09 on those two days and 7:01 on the others",
      "traffic counts that show no difference between the days",
      "a relief driver who covers those two mornings",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The rail yard schedules a loaded outbound train for Tuesday and Thursday mornings.”", "“The driver logged a stopped train at the crossing on both late days.”"], but: "“The depot sheet shows Bus 12 leaving at 7:09 on Tuesdays and Thursdays and 7:01 on the other three.”" },
      { who: 1, ev: ["“The depot sheet shows Bus 12 leaving at 7:09 on Tuesdays and Thursdays and 7:01 on the other three.”", "“On those two days it reached school between nine and twelve minutes late.”"], but: "“A loaded freight at that crossing holds traffic for about ten minutes.”" },
      { who: 3, ev: ["“A relief driver covers those two mornings and has driven the route since September.”", "“The regular driver clocks in at the depot on all five days. A traffic count found the same number of cars on all five mornings.”"], but: "“The driver logged a stopped train at the crossing on both late days.”" },
    ],
    clears: ["Heavier traffic: “A traffic count found the same number of cars on all five mornings.”"],
    note:
      "This one is arithmetic. The lateness is nine to twelve minutes, the train is about ten, and the late start is eight. Ask what the two together would come to and whether the bus is late enough for both. The relief driver is the weakest and the most human, and a student who argues it has to say what a different driver actually does differently.",
  },
  12: {
    story:
      "The 1998 trophy went dull and grey in the case over one winter break. The four trophies beside it stayed bright the whole time. Silver turns dark when sulfur in the air reacts with its surface. Rubber bands and some foam release small amounts of sulfur as they age. The dull trophy sits on a foam pad that the others do not have. The custodian added that pad in December to stop a wobble. The 1998 trophy is the only one on the bottom shelf, beside the floor vent. The case lock was found open twice in January and the door ajar once. Every one of the five was polished on the same November afternoon.",
    q: "Why did one trophy go dull? Choose one cause and quote the story.",
    who: [
      "",
      "",
      "",
      "🌬️ The floor vent below it",
    ],
    why: [
      "a foam pad added in December, and foam releases sulfur as it ages",
      "polished with the other four on the same day in November",
      "a lock found open twice in January and the door ajar once",
      "the only one on the bottom shelf, right beside the floor vent",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“The dull trophy sits on a foam pad that the others do not have.”", "“The custodian added that pad in December to stop a wobble.”"], but: "“The 1998 trophy is the only one on the bottom shelf, beside the floor vent.”" },
      { who: 2, ev: ["“The case lock was found open twice in January and the door ajar once.”", "“Silver turns dark when sulfur in the air reacts with its surface.”"], but: "“The four trophies beside it stayed bright the whole time.”" },
      { who: 3, ev: ["“The 1998 trophy is the only one on the bottom shelf, beside the floor vent.”", "“Rubber bands and some foam release small amounts of sulfur as they age.”"], but: "“The custodian added that pad in December to stop a wobble.”" },
    ],
    clears: ["Missing a polish: “Every one of the five was polished on the same November afternoon.”"],
    note:
      "Two things are true of this trophy and no other: it has a foam pad and it sits alone by the vent. Both put more air past it than the rest get, which is why the vent argument is better than it first looks. The open lock is the one that explains dullness without explaining why only one went dull.",
  },
  13: {
    story:
      "The cafeteria turkey came out done on the left and underdone on the right. One thermometer read one hundred seventy-five degrees and the other one hundred forty-two. Ovens move heat with air, and anything blocking that air leaves a cold pocket. A full sheet of foil-covered rolls sat on the rack beside the right side. Those rolls went in at the same time as the turkey. The oven's fan motor has been replaced twice and the right vent is taped over. A fan pushing from one side only heats that side. The bird sat on a steel tray that overhangs the rack by four inches on the right. Steel under a bird shields it from the heat coming up underneath. It roasted for the whole four hours the recipe asks for.",
    q: "Why was one side of the turkey underdone? Make the case for one cause.",
    who: [
      "",
      "",
      "🌡️ A cold right side",
      "🍳 The tray under the bird",
    ],
    why: [
      "a full sheet of foil-covered rolls beside the right side",
      "the full four hours the recipe called for",
      "a right vent taped over, so that side never reaches temperature",
      "a steel tray overhanging the rack by four inches on the right",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“A full sheet of foil-covered rolls sat on the rack beside the right side.”", "“Those rolls went in at the same time as the turkey.”"], but: "“The oven's fan motor has been replaced twice and the right vent is taped over.”" },
      { who: 2, ev: ["“The oven's fan motor has been replaced twice and the right vent is taped over.”", "“A fan pushing from one side only heats that side.”"], but: "“Ovens move heat with air, and anything blocking that air leaves a cold pocket.”" },
      { who: 3, ev: ["“The bird sat on a steel tray that overhangs the rack by four inches on the right.”", "“Steel under a bird shields it from the heat coming up underneath. It roasted for the whole four hours the recipe asks for.”"], but: "“A full sheet of foil-covered rolls sat on the rack beside the right side.”" },
    ],
    clears: ["Not enough time: “It roasted for the whole four hours the recipe asks for.”"],
    note:
      "All three open answers block heat on the right, so the class is arguing about which blockage matters most rather than about where the problem is. That is a fair argument and the way to settle it is a test: move the rolls, untape the vent, change the tray, one at a time. A student who proposes that has done better than one who simply picks.",
  },
  14: {
    story:
      "Two dozen cupcakes came out of the same oven and one dozen stayed flat. Cupcakes rise on gas bubbles that baking soda makes when it meets acid. Those bubbles start forming the moment the wet and dry are stirred together. The first tray went in at once and the second waited forty minutes on the counter. The flat tray was the one that waited. The second tray was filled from the bottom of the bowl, where the batter had settled. Batter that settles is heavier at the bottom than at the top. The second tray went into an oven that had already run for twenty minutes. One bowl of batter was mixed at one time and split between the two trays.",
    q: "Why did one tray stay flat? Pick one cause and back it up.",
    who: [
      "",
      "",
      "",
      "🥣 Batter from the bottom of the bowl",
    ],
    why: [
      "forty minutes on the counter, with bubbles forming from the first stir",
      "a door nobody opened while either tray was baking",
      "one bowl of batter, mixed at one time",
      "filled from the bottom of the bowl, where the batter had settled",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“Those bubbles start forming the moment the wet and dry are stirred together.”", "“The first tray went in at once and the second waited forty minutes on the counter.”"], but: "“The second tray was filled from the bottom of the bowl, where the batter had settled.”" },
      { who: 1, ev: ["“The second tray went into an oven that had already run for twenty minutes.”", "“Two dozen cupcakes came out of the same oven and one dozen stayed flat.”"], but: "“The flat tray was the one that waited.”" },
      { who: 3, ev: ["“The second tray was filled from the bottom of the bowl, where the batter had settled.”", "“Batter that settles is heavier at the bottom than at the top.”"], but: "“Those bubbles start forming the moment the wet and dry are stirred together.”" },
    ],
    clears: ["A different batter: “One bowl of batter was mixed at one time and split between the two trays.”"],
    note:
      "Same bowl rules the recipe out, and everything left is about the forty minutes: the gas escaped, the batter settled, and the oven changed. Those are three consequences of one delay, and the honest answer says so. Ask which of the three would still have happened if the bowl had been stirred again before the second tray was filled.",
  },
  15: {
    story:
      "Ivy's mittens came in soaked on the inside and dry on the outside. Working hands give off water as vapor, and a coated shell will not let vapor out. Vapor turns back into water when it reaches the cold inside of the shell. Ivy dug in the snowbank for the whole twenty minutes. The mittens weighed more coming in than they did going out. The left cuff had worked out from under her sleeve by the end of recess. She packed snowballs with bare hands for five minutes and put the mittens back on wet. The seam across the right palm has come unstitched for about an inch. Her classmates in uncoated knit mittens came in damp all the way through.",
    q: "Why were the mittens wet inside? Argue for one cause.",
    who: [
      "",
      "",
      "🤲 Wet hands from snowballs",
      "",
    ],
    why: [
      "a coated shell that will not let her own vapor out",
      "a left cuff worked out from under her sleeve by the end",
      "five minutes of bare-handed snowballs, then mittens back on wet",
      "a right palm seam unstitched for about an inch",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“Working hands give off water as vapor, and a coated shell will not let vapor out.”", "“Vapor turns back into water when it reaches the cold inside of the shell.”"], but: "“The left cuff had worked out from under her sleeve by the end of recess.”" },
      { who: 1, ev: ["“The left cuff had worked out from under her sleeve by the end of recess.”", "“Ivy dug in the snowbank for the whole twenty minutes.”"], but: "“The mittens weighed more coming in than they did going out.”" },
      { who: 3, ev: ["“The seam across the right palm has come unstitched for about an inch.”", "“Her classmates in uncoated knit mittens came in damp all the way through.”"], but: "“Working hands give off water as vapor, and a coated shell will not let vapor out.”" },
    ],
    clears: ["Wet hands from snowballs: “She packed snowballs with bare hands for five minutes and put the mittens back on wet.”"],
    note:
      "Both mittens came in soaked, and the cuff fault is on the left while the seam fault is on the right. That is the detail that beats both of them, and it is one sentence apart from each. The vapor answer is the only one that acts on both hands at once, which is a good reason to prefer it and worth making the class say out loud.",
  },
  16: {
    story:
      "Six gingerbread walls came off one baking sheet and two cracked in half. A sheet of baked dough shrinks a little as it cools and gives up water. Dough cooling unevenly shrinks unevenly, and the stress splits it at the thinnest line. Four walls cooled on a rack in the open kitchen for an hour. The two that cracked were moved straight to the cold windowsill. A thermometer on that sill read thirty-one degrees that afternoon. The two cracked walls were cut from the last of the dough, rolled thin to make them fit. A thin wall carries the same shrinking stress across less gingerbread. The sill walls were laid flat on the stone and the rack walls had air underneath. No wall was lifted, stacked or knocked by anybody.",
    q: "Why did two walls crack? Choose one cause and prove it.",
    who: [
      "",
      "",
      "",
      "🧊 Cooling flat on cold stone",
    ],
    why: [
      "moved straight to a sill reading thirty-one degrees",
      "nobody touching, stacking or dropping any of the six",
      "cut from the last of the dough and rolled thin",
      "laid flat on cold stone, where the rack walls had air underneath",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“The two that cracked were moved straight to the cold windowsill.”", "“A thermometer on that sill read thirty-one degrees that afternoon.”"], but: "“The two cracked walls were cut from the last of the dough, rolled thin to make them fit.”" },
      { who: 2, ev: ["“The two cracked walls were cut from the last of the dough, rolled thin to make them fit.”", "“A thin wall carries the same shrinking stress across less gingerbread.”"], but: "“A thermometer on that sill read thirty-one degrees that afternoon.”" },
      { who: 3, ev: ["“The sill walls were laid flat on the stone and the rack walls had air underneath. No wall was lifted, stacked or knocked by anybody.”", "“Dough cooling unevenly shrinks unevenly, and the stress splits it at the thinnest line.”"], but: "“Six gingerbread walls came off one baking sheet and two cracked in half.”" },
    ],
    clears: ["Somebody handling them: “No wall was lifted, stacked or knocked by anybody.”"],
    note:
      "The same two walls are the thin ones, the cold ones and the ones on stone, so every difference lands on the same pair. That is the hardest shape a case can take and it is worth naming. The sentence about uneven cooling is the rule in the story, and the stone answer is the only one that uses it directly.",
  },
  17: {
    story:
      "Half the hallway light string went dark and the other half stayed lit. The dark half runs from the twenty-sixth bulb to the fiftieth. Each half of this string is wired so the current passes through every bulb in turn. When one bulb in such a line fails, the whole line it belongs to goes out. The twenty-sixth bulb rattled when he shook it and its filament was broken. The socket for the twenty-sixth bulb is cracked and the bulb sits loose in it. A bulb that is not seated breaks the line as surely as a broken filament does. Water from a leaking window ran down the wall behind bulbs twenty-six to thirty. The outlet reads full power on the tester and runs the lit half fine.",
    q: "Why did half the string go dark? Pick one cause and prove it from the text.",
    who: [
      "",
      "",
      "🔩 A cracked socket",
      "💧 Water behind the string",
    ],
    why: [
      "a twenty-sixth bulb that rattles, with a broken filament",
      "an outlet that tested at full power",
      "a cracked socket where the bulb sits loose",
      "water running down the wall behind bulbs twenty-six to thirty",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“The twenty-sixth bulb rattled when he shook it and its filament was broken.”", "“When one bulb in such a line fails, the whole line it belongs to goes out.”"], but: "“The socket for the twenty-sixth bulb is cracked and the bulb sits loose in it.”" },
      { who: 2, ev: ["“The socket for the twenty-sixth bulb is cracked and the bulb sits loose in it.”", "“A bulb that is not seated breaks the line as surely as a broken filament does.”"], but: "“The twenty-sixth bulb rattled when he shook it and its filament was broken.”" },
      { who: 3, ev: ["“Water from a leaking window ran down the wall behind bulbs twenty-six to thirty.”", "“The dark half runs from the twenty-sixth bulb to the fiftieth.”"], but: "“Each half of this string is wired so the current passes through every bulb in turn.”" },
    ],
    clears: ["The outlet: “The outlet reads full power on the tester and runs the lit half fine.”"],
    note:
      "Everything in this case points at bulb twenty-six and the class should say so before arguing. The question underneath is what caused what: a cracked socket lets a bulb rattle, rattling breaks a filament, and water gets into a cracked socket. Ordering those three is the real work, and the story deliberately leaves the order out.",
  },
  18: {
    story:
      "The hallway clock lost about four minutes a day all through January. For six years before that it had not drifted by a second. This clock keeps time with a thin metal wheel that turns at a fixed rate. Metal expands when it warms and that makes the wheel turn more slowly. The clock hangs directly above a radiator that was replaced in December. A thermometer taped beside the clock read ninety-four degrees in January. The battery was changed in December from the drawer of mixed spares. A battery that reads full voltage can still fail under load. The identical clock at the far end of the hall was also rehung in December. That one hangs over the stairwell, where the air is cold and still. The hands swing freely and the glass is unmarked.",
    q: "Why did the clock lose four minutes a day? Make the case for one cause.",
    who: [
      "",
      "",
      "",
      "📍 Where it was rehung",
    ],
    why: [
      "a new radiator below it, and ninety-four degrees beside it",
      "a December battery from the drawer of mixed spares",
      "nothing rubbing the hands and no struck glass",
      "rehung in December, over a radiator rather than a cold stairwell",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The clock hangs directly above a radiator that was replaced in December.”", "“A thermometer taped beside the clock read ninety-four degrees in January.”"], but: "“The battery was changed in December from the drawer of mixed spares.”" },
      { who: 1, ev: ["“The battery was changed in December from the drawer of mixed spares.”", "“A battery that reads full voltage can still fail under load.”"], but: "“Metal expands when it warms and that makes the wheel turn more slowly.”" },
      { who: 3, ev: ["“The identical clock at the far end of the hall was also rehung in December.”", "“That one hangs over the stairwell, where the air is cold and still. The hands swing freely and the glass is unmarked.”"], but: "“For six years before that it had not drifted by a second.”" },
    ],
    clears: ["Something rubbing the hands: “The hands swing freely and the glass is unmarked.”"],
    note:
      "The second clock used to be a clean control and it has stopped being one, because it was also rehung in December and it is also somewhere with a temperature. It is still useful, just not as proof. Three things changed in December and only one of them is measured, which is why the thermometer reading carries the most weight.",
  },
  19: {
    story:
      "Snow on the playground melted in stripes and left white bands between them. The bare stripes sit directly over the black rubber safety mat. The white bands sit over the light grey concrete beside it. Dark surfaces take in more sunlight and give that heat back as warmth. Light surfaces throw much of the same sunlight away again. A surface thermometer read fifty-one on the rubber and thirty-six on the concrete. The heating pipe to the gym runs under the rubber strip and not under the concrete. A buried pipe warms the ground above it whatever the sun is doing. The rubber strip is a hand's width lower than the concrete and water collects along it. A ruler at dawn showed the same depth of snow everywhere on the playground.",
    q: "Why did the snow melt in stripes? Choose one cause and quote the story.",
    who: [
      "",
      "",
      "🔥 A heating pipe underneath",
      "💧 A lower strip that collects water",
    ],
    why: [
      "fifty-one degrees on the dark rubber against thirty-six on the concrete",
      "no salt, sand or shovel near the playground all winter",
      "a gym heating pipe running under the rubber and not the concrete",
      "a strip a hand's width lower, where water collects",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“Dark surfaces take in more sunlight and give that heat back as warmth.”", "“A surface thermometer read fifty-one on the rubber and thirty-six on the concrete.”"], but: "“The heating pipe to the gym runs under the rubber strip and not under the concrete.”" },
      { who: 2, ev: ["“The heating pipe to the gym runs under the rubber strip and not under the concrete.”", "“A buried pipe warms the ground above it whatever the sun is doing.”"], but: "“Light surfaces throw much of the same sunlight away again.”" },
      { who: 3, ev: ["“The rubber strip is a hand's width lower than the concrete and water collects along it.”", "“Snow on the playground melted in stripes and left white bands between them.”"], but: "“A surface thermometer read fifty-one on the rubber and thirty-six on the concrete.”" },
    ],
    clears: ["Uneven snowfall: “A ruler at dawn showed the same depth of snow everywhere on the playground.”"],
    note:
      "The thermometer reading is real and it does not say why the rubber is warm. Sun and a buried pipe both produce exactly that reading, which is the trap. Ask what would separate them, and the class should arrive at reading the same two surfaces at night, when the sun is not a candidate at all.",
  },
  20: {
    story:
      "The window feeder emptied in two days all autumn and sat full for a week in November. Small birds will leave a feeder that has no cover within a short flight. They need somewhere to dart to when a hawk passes overhead. The lilac hedge eight feet from the feeder was cut back hard on the first of November. The nearest cover now stands forty feet away across open lawn. A sparrowhawk has been seen on the fence three mornings running since the hedge came down. The window behind the feeder was fitted with reflective film on the second of November. Birds avoid a feeder they cannot see a clear escape from. Birds were about the yard all week, on the fence and on the grass. A fresh sack was opened on the first and the ports are clear of ice.",
    q: "Why did the birds stop using the feeder? Pick one cause and prove it.",
    who: [
      "",
      "",
      "🦅 A sparrowhawk on the fence",
      "🪟 Reflective film on the window",
    ],
    why: [
      "a hedge cut back hard, leaving cover forty feet away",
      "seed unspoiled and ports clear of ice",
      "a sparrowhawk on the fence three mornings running",
      "reflective film fitted to the window behind it",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“The lilac hedge eight feet from the feeder was cut back hard on the first of November.”", "“The nearest cover now stands forty feet away across open lawn.”"], but: "“The window behind the feeder was fitted with reflective film on the second of November.”" },
      { who: 2, ev: ["“A sparrowhawk has been seen on the fence three mornings running since the hedge came down.”", "“They need somewhere to dart to when a hawk passes overhead.”"], but: "“Birds were about the yard all week, on the fence and on the grass.”" },
      { who: 3, ev: ["“The window behind the feeder was fitted with reflective film on the second of November.”", "“Birds avoid a feeder they cannot see a clear escape from.”"], but: "“The lilac hedge eight feet from the feeder was cut back hard on the first of November.”" },
    ],
    clears: ["Spoiled or blocked seed: “A fresh sack was opened on the first and the ports are clear of ice.”"],
    note:
      "The hedge came down on the first and the film went up on the second, which is as close as two causes can get without being the same day. The hawk is downstream of the hedge, and a good answer says so rather than treating it as a third option. Birds still in the yard is the fact that keeps all three alive.",
  },
  21: {
    story:
      "Two pitchers of cocoa were mixed side by side and one came out full of lumps. Dry powder clumps when a lot of liquid hits it all at once, because the outside of each clump turns to paste and seals the dry middle in. Adding a little liquid first makes a smooth paste that then thins out safely. Ms. Baptiste poured half a cup into the first pitcher and stirred before adding the rest. The whole quart went into the second pitcher at once. The second pitcher's powder came from the bottom of the tin, which had set hard in places. The second whisk has three bent wires and does not reach the pitcher's corners. Both were stirred for the same ninety seconds.",
    q: "Why was one pitcher lumpy? Argue for one cause.",
    who: [
      "",
      "",
      "",
      "🥢 A whisk with bent wires",
    ],
    why: [
      "a whole quart poured in at once, sealing the dry middles in",
      "ninety seconds of stirring in both pitchers",
      "powder from the bottom of the tin, set hard in places",
      "a whisk with three bent wires that misses the corners",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“The whole quart went into the second pitcher at once.”", "“Adding a little liquid first makes a smooth paste that then thins out safely.”"], but: "“The second pitcher's powder came from the bottom of the tin, which had set hard in places.”" },
      { who: 2, ev: ["“The second pitcher's powder came from the bottom of the tin, which had set hard in places.”", "“Two pitchers of cocoa were mixed side by side and one came out full of lumps.”"], but: "“The whole quart went into the second pitcher at once.”" },
      { who: 3, ev: ["“The second whisk has three bent wires and does not reach the pitcher's corners.”", "“Dry powder clumps when a lot of liquid hits it all at once, because the outside of each clump turns to paste and seals the dry middle in.”"], but: "“Both were stirred for the same ninety seconds.”" },
    ],
    clears: ["Not enough stirring: “Both were stirred for the same ninety seconds.”"],
    note:
      "Ninety seconds each clears the stirring time and does not clear the whisk, which is a distinction worth drawing out: the same time with a worse tool is not the same stirring. Powder set hard in a tin already contains lumps before any liquid arrives, and a student who spots that has found the one answer that does not need the pouring at all.",
  },
  22: {
    story:
      "Every valentine in Room 7 landed in the wrong bag on Friday afternoon. The bags hang along the back wall in an order set in September. That order is alphabetical by last name and has not changed all year. The class list taped to the table is alphabetical by first name instead. The helper worked straight down the printed list and straight along the wall. The two orders put a different child in the same position almost everywhere. Two bags fell off their hooks on Thursday and were rehung by whoever found them. Four children have the same first initial and their bags carry no photograph. Not one card was opened, and none went missing or came back torn.",
    q: "Why did every valentine land in the wrong bag? Make the case for one cause.",
    who: [
      "",
      "",
      "",
      "🔤 Four children sharing an initial",
    ],
    why: [
      "a wall by last name and a list by first name, worked straight down",
      "nobody opening a card, and nothing missing or torn",
      "two bags that fell on Thursday and were rehung by whoever found them",
      "four children sharing an initial, with no photograph on a bag",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“That order is alphabetical by last name and has not changed all year.”", "“The class list taped to the table is alphabetical by first name instead.”"], but: "“Two bags fell off their hooks on Thursday and were rehung by whoever found them.”" },
      { who: 2, ev: ["“Two bags fell off their hooks on Thursday and were rehung by whoever found them.”", "“The bags hang along the back wall in an order set in September.”"], but: "“Every valentine in Room 7 landed in the wrong bag on Friday afternoon.”" },
      { who: 3, ev: ["“Four children have the same first initial and their bags carry no photograph.”", "“The helper worked straight down the printed list and straight along the wall.”"], but: "“The two orders put a different child in the same position almost everywhere.”" },
    ],
    clears: ["Somebody opening the cards: “Not one card was opened, and none went missing or came back torn.”"],
    note:
      "Every card went wrong, and the word every is the whole argument. Two rehung bags move two cards. Four shared initials confuse four. Only two lists in different orders can put the entire class out at once, and a student who reasons from how many each cause would spoil has found the method this case is really teaching.",
  },
  23: {
    story:
      "Four model volcanoes erupted at the fair and the fifth only fizzed. Baking soda and vinegar make gas, and the gas is what pushes the foam up. Baking soda left open to damp air slowly reacts and loses its power. The fifth team's soda had sat open on a humid porch since September. Its surface was crusted and clumped rather than loose and powdery. The fifth team used a tall narrow cone with an opening the width of a thumb. A narrow opening slows foam down however much gas is made. The fifth cup of vinegar was poured at eight in the morning and used at two. Vinegar left standing in an open cup loses sharpness through the day. Each of the five measured two spoons of soda and half a cup of vinegar.",
    q: "Why did the fifth volcano only fizz? Pick one cause and prove it.",
    why: [
      "soda open on a humid porch since September, crusted and clumped",
      "vinegar poured at eight and used at two, standing open",
      "a tall narrow cone with an opening the width of a thumb",
      "two spoons and half a cup, the same as the other four",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The fifth team's soda had sat open on a humid porch since September.”", "“Its surface was crusted and clumped rather than loose and powdery.”"], but: "“The fifth cup of vinegar was poured at eight in the morning and used at two.”" },
      { who: 1, ev: ["“The fifth cup of vinegar was poured at eight in the morning and used at two.”", "“Vinegar left standing in an open cup loses sharpness through the day.”"], but: "“Its surface was crusted and clumped rather than loose and powdery.”" },
      { who: 2, ev: ["“The fifth team used a tall narrow cone with an opening the width of a thumb.”", "“A narrow opening slows foam down however much gas is made.”"], but: "“Baking soda and vinegar make gas, and the gas is what pushes the foam up.”" },
    ],
    clears: ["Wrong amounts: “Each of the five measured two spoons of soda and half a cup of vinegar.”"],
    note:
      "Two of these say less gas was made and one says the gas could not get out, which is a real difference worth naming. A narrow cone would still fill and hiss; weak ingredients would not. Ask what the fizz actually looked like, and notice that the case never says, which is a fair complaint to make about the evidence.",
  },
  24: {
    story:
      "Twenty paper crowns were made from one pattern and six will not close. The six that failed were all cut by the same two students. A head is measured around, and that measurement is the length the strip must reach. The pattern sheet lists the head width across instead of the distance around. A circle's distance around is a little more than three times its width. The six short crowns each measure close to a third of what they need. The card ran out and the last roll is two inches narrower than the first. Two pattern sheets sit in the folder and the older one is for a smaller size. The six failed crowns were cut on the afternoon the second sheet was found. No crown was trimmed, torn or re-cut once it had been measured.",
    q: "Why will six crowns not close? Argue for one cause.",
    why: [
      "a sheet listing width across, where a head is measured around",
      "no crown trimmed, torn or re-cut once measured",
      "a last roll two inches narrower than the first",
      "two sheets in the folder, the older one for a smaller size",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“The pattern sheet lists the head width across instead of the distance around.”", "“A circle's distance around is a little more than three times its width.”"], but: "“Two pattern sheets sit in the folder and the older one is for a smaller size.”" },
      { who: 2, ev: ["“The card ran out and the last roll is two inches narrower than the first.”", "“The six that failed were all cut by the same two students.”"], but: "“The six short crowns each measure close to a third of what they need.”" },
      { who: 3, ev: ["“Two pattern sheets sit in the folder and the older one is for a smaller size.”", "“The six failed crowns were cut on the afternoon the second sheet was found.”"], but: "“A circle's distance around is a little more than three times its width.”" },
    ],
    clears: ["Trimming them too short: “No crown was trimmed, torn or re-cut once it had been measured.”"],
    note:
      "A third is the number that decides this and the class should go to it straight away. Two inches off a roll is not a third of a crown. A smaller pattern might be, and the case never says how much smaller. Only the width-for-circumference mistake lands near a third on the arithmetic alone.",
  },
  25: {
    story:
      "The music room piano was tuned in October and sounded wrong by February. A piano string is stretched across a wooden frame that holds its tension. Wood takes in water from damp air and gives it up in dry air, swelling and shrinking as it does. A frame that shrinks lets every string go slightly slack at once. The music room humidity ran at fifty-five percent in October and nineteen in February. The tuner found every string flat by about the same amount. The piano was rolled to the hall for the winter concert and back again. One bass string was found with a loose coil at its tuning pin. A slack string pulls the frame out of balance and drags its neighbours flat. The other instruments all live in cases that hold their own air.",
    q: "Why did the piano go flat? Choose one cause and quote the story.",
    why: [
      "fifty-five percent humidity in October against nineteen in February",
      "rolled to the hall for the concert and back again",
      "other instruments living in cases that hold their own air",
      "a loose coil at a bass tuning pin",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The music room humidity ran at fifty-five percent in October and nineteen in February.”", "“A frame that shrinks lets every string go slightly slack at once.”"], but: "“The piano was rolled to the hall for the winter concert and back again.”" },
      { who: 1, ev: ["“The piano was rolled to the hall for the winter concert and back again.”", "“The tuner found every string flat by about the same amount.”"], but: "“Wood takes in water from damp air and gives it up in dry air, swelling and shrinking as it does.”" },
      { who: 3, ev: ["“One bass string was found with a loose coil at its tuning pin.”", "“A slack string pulls the frame out of balance and drags its neighbours flat.”"], but: "“The music room humidity ran at fifty-five percent in October and nineteen in February.”" },
    ],
    clears: ["A problem in the whole building: “The other instruments all live in cases that hold their own air.”"],
    note:
      "Every string flat by about the same amount is the sentence that carries this case, and all three open answers now claim it. Dry air slackens the frame, a trip jolts the whole instrument, and one loose string can drag its neighbours. Ask which of the three would leave the bass worse than the treble, because the story says it did not.",
  },
  26: {
    story:
      "Two kites flew on the same afternoon and only one would climb. A kite climbs on air that moves steadily in one direction. A building sends the wind over its roof and leaves a churning pocket behind it. That pocket pushes up, down and sideways by turns instead of steadily. The kite that failed was flown on the lawn right behind the gym. The one that climbed was flown in the open field beyond the gym. A ribbon held up on the lawn flapped in every direction at once. The failed kite's spine is bowed and its two halves no longer match. A kite with one half larger than the other turns instead of climbing. The failed kite's tail had been tied to the wrong corner that morning. The flag on the gym roof stood straight out the whole afternoon.",
    q: "Why would one kite not climb? Make the case for one cause.",
    why: [
      "a churning pocket behind the gym, and a ribbon flapping every way",
      "a roof flag standing straight out the whole afternoon",
      "a bowed spine, with the two halves no longer matching",
      "a tail tied to the wrong corner that morning",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“The kite that failed was flown on the lawn right behind the gym.”", "“A ribbon held up on the lawn flapped in every direction at once.”"], but: "“The failed kite's spine is bowed and its two halves no longer match.”" },
      { who: 2, ev: ["“The failed kite's spine is bowed and its two halves no longer match.”", "“A kite with one half larger than the other turns instead of climbing.”"], but: "“A ribbon held up on the lawn flapped in every direction at once.”" },
      { who: 3, ev: ["“The failed kite's tail had been tied to the wrong corner that morning.”", "“The one that climbed was flown in the open field beyond the gym.”"], but: "“That pocket pushes up, down and sideways by turns instead of steadily.”" },
    ],
    clears: ["No wind that day: “The flag on the gym roof stood straight out the whole afternoon.”"],
    note:
      "The ribbon is a measurement somebody actually took and it is the best thing in the story. It describes the lawn, though, not the kite, so it argues for the place rather than against the build. The cheapest test is already in the case: swap the two kites between the two spots and fly them again.",
  },
  27: {
    story:
      "The shamrock plant on the sill folded its leaves shut every afternoon at four. It opened again each morning on its own. Some plants fold their leaves on a daily rhythm set by light. A storage shed built in January now blocks the sill from three o'clock on. A second shamrock in the sunnier window folds at close to seven instead. The radiator under the sill cycles on at four and dries that soil fastest then. A shamrock folds its leaves to hold water in when the soil goes dry. The cleaner wipes that sill at four each afternoon before she leaves. A shamrock will also fold when a leaf is brushed or knocked. Not a leaf showed insect damage, mold or a mark of any kind.",
    q: "Why does the shamrock fold at four? Pick one cause and prove it.",
    why: [
      "a shed blocking the sill from three, where light once lasted later",
      "a radiator cycling on at four and drying that soil",
      "no insect damage, mold or mark on any leaf",
      "a cleaner wiping that sill at four each afternoon",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“A storage shed built in January now blocks the sill from three o'clock on.”", "“A second shamrock in the sunnier window folds at close to seven instead.”"], but: "“The cleaner wipes that sill at four each afternoon before she leaves.”" },
      { who: 1, ev: ["“The radiator under the sill cycles on at four and dries that soil fastest then.”", "“A shamrock folds its leaves to hold water in when the soil goes dry.”"], but: "“It opened again each morning on its own.”" },
      { who: 3, ev: ["“The cleaner wipes that sill at four each afternoon before she leaves.”", "“A shamrock will also fold when a leaf is brushed or knocked.”"], but: "“Some plants fold their leaves on a daily rhythm set by light.”" },
    ],
    clears: ["Pests or disease: “Not a leaf showed insect damage, mold or a mark of any kind.”"],
    note:
      "The second shamrock is the strongest evidence and it is worth slowing down on. It folds at seven in a sunnier window, which ties the folding to light rather than to the hour of four. Both other answers land exactly on four, and a student who notices that a clock-time match is weaker than a light match has read well.",
  },
  28: {
    story:
      "One puddle on the field lasted nine days and every other puddle dried in two. All of them filled during the same Saturday rain. Water leaves the ground by soaking down or drying off the top. Soil made of fine packed clay lets water through many times more slowly than sandy soil. A core sample from the dip came up as grey packed clay. Samples from the other spots came up brown and sandy. The dip is the lowest point on the field and the ground slopes to it from three sides. Rain that falls anywhere on that slope ends up in the dip. The dip sits in the shadow of the equipment shed from noon onward. A shaded puddle loses far less water off its top than a sunlit one. The dip is a shallow one, two inches at its deepest point.",
    q: "Why did one puddle last nine days? Choose one cause and back it up.",
    why: [
      "grey packed clay in the dip where the others came up sandy",
      "two inches at its deepest point",
      "the lowest point, with ground sloping to it from three sides",
      "shade from the equipment shed from noon onward",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“A core sample from the dip came up as grey packed clay.”", "“Samples from the other spots came up brown and sandy.”"], but: "“The dip sits in the shadow of the equipment shed from noon onward.”" },
      { who: 2, ev: ["“The dip is the lowest point on the field and the ground slopes to it from three sides.”", "“Rain that falls anywhere on that slope ends up in the dip.”"], but: "“All of them filled during the same Saturday rain.”" },
      { who: 3, ev: ["“The dip sits in the shadow of the equipment shed from noon onward.”", "“A shaded puddle loses far less water off its top than a sunlit one.”"], but: "“Soil made of fine packed clay lets water through many times more slowly than sandy soil.”" },
    ],
    clears: ["A deeper hole: “The dip is a shallow one, two inches at its deepest point.”"],
    note:
      "The story names the two ways water leaves the ground, and the open answers split neatly across them: clay blocks the way down, shade blocks the way off the top, and the slope keeps topping it up. Sorting the suspects into those three jobs before choosing is the method this case teaches.",
  },
  29: {
    story:
      "Two rows of sunflower seeds went in on the same morning and one row sprouted. A seed carries only enough stored food to push a shoot a short way up. A seed buried too deep runs out of food before the shoot reaches light. The sprouting row was planted half an inch down as the packet says. The second row was planted four inches down with a trowel. Three weeks on, the dug-up deep seeds had sprouted and then died below ground. The second row runs along the fence where the ground stays cold until May. The deep row was watered by hose and the shallow row by watering can. A hose on packed ground runs off rather than soaking in. Both rows came from one packet, dated this year.",
    q: "Why did one row never come up? Argue for one cause.",
    why: [
      "four inches down, where a seed runs out of food before the light",
      "one packet, dated this year, for both rows",
      "a hose on packed ground that runs off rather than soaking in",
      "along the fence, where the ground stays cold until May",
    ],
    open: [0, 2, 3],
    for: [
      { who: 0, ev: ["“The second row was planted four inches down with a trowel.”", "“Three weeks on, the dug-up deep seeds had sprouted and then died below ground.”"], but: "“The second row runs along the fence where the ground stays cold until May.”" },
      { who: 2, ev: ["“The deep row was watered by hose and the shallow row by watering can.”", "“A hose on packed ground runs off rather than soaking in.”"], but: "“A seed buried too deep runs out of food before the shoot reaches light.”" },
      { who: 3, ev: ["“The second row runs along the fence where the ground stays cold until May.”", "“A seed carries only enough stored food to push a shoot a short way up.”"], but: "“The sprouting row was planted half an inch down as the packet says.”" },
    ],
    clears: ["Dead seed: “Both rows came from one packet, dated this year.”"],
    note:
      "Sprouted and then died below ground is the fact that beats most of this. Seeds that sprouted were not too cold and were not too dry, because both of those stop a seed before it starts. Depth is the only suspect that lets a seed begin and then run out, and reasoning from when the seed failed is the whole trick.",
  },
  30: {
    story:
      "Six eggs went into a bowl of water and one floated while five sank. An egg has a small air pocket at its blunt end just inside the shell. The shell is slightly porous, so water leaves the egg slowly and air takes its place. The longer an egg is kept, the larger that air pocket grows. An egg floats once its air pocket is large enough to lift it. Marcus found a second date stamp on the floating egg reading five weeks earlier. The five sinking eggs all carried this week's stamp. The floating egg has a hairline crack across its blunt end. A cracked shell lets air in far faster than a sound one does. The floating egg had sat on the warm windowsill since Tuesday. All six came out of one carton from one farm.",
    q: "Why did one egg float? Pick one cause and prove it from the text.",
    why: [
      "a date stamp five weeks older than the other five",
      "a hairline crack across its blunt end",
      "one carton from one farm for all six",
      "sitting on the warm windowsill since Tuesday",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“Marcus found a second date stamp on the floating egg reading five weeks earlier.”", "“The five sinking eggs all carried this week's stamp.”"], but: "“The floating egg has a hairline crack across its blunt end.”" },
      { who: 1, ev: ["“The floating egg has a hairline crack across its blunt end.”", "“A cracked shell lets air in far faster than a sound one does.”"], but: "“An egg has a small air pocket at its blunt end just inside the shell.”" },
      { who: 3, ev: ["“The floating egg had sat on the warm windowsill since Tuesday.”", "“The shell is slightly porous, so water leaves the egg slowly and air takes its place.”"], but: "“The longer an egg is kept, the larger that air pocket grows.”" },
    ],
    clears: ["A different farm: “All six came out of one carton from one farm.”"],
    note:
      "Age, a crack and warmth all enlarge the same air pocket, so this is not three answers but three routes to one. Say that, then argue about speed: five weeks is slow and sure, a crack is fast, and four warm days sits between. The crack is also the one fact that might have been caused by the others rather than causing them.",
  },
  31: {
    story:
      "A class marked the flagpole's noon shadow in September and remeasured in December. The September mark sat eleven feet from the base and the December mark nineteen. The sun rides lower in the sky in winter than it does in autumn. A lower sun throws a longer shadow from the same object. A sun-angle table gave fifty-two degrees in September and thirty-one in December. The September reading was taken at clock noon and the December one at local noon. Clock noon and local noon can be most of an hour apart in December. The base was re-concreted in November and the pole now stands a foot nearer the wall. Both marks were measured out from the same chalk cross on the path. The pole's height was measured at twenty-nine feet on both days.",
    q: "Why did the shadow grow eight feet? Choose one cause and back it up.",
    why: [
      "fifty-two degrees in September against thirty-one in December",
      "re-concreted in November, standing a foot nearer the wall",
      "clock noon in September and local noon in December",
      "twenty-nine feet on both measuring days",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The sun rides lower in the sky in winter than it does in autumn.”", "“A sun-angle table gave fifty-two degrees in September and thirty-one in December.”"], but: "“The September reading was taken at clock noon and the December one at local noon.”" },
      { who: 1, ev: ["“The base was re-concreted in November and the pole now stands a foot nearer the wall.”", "“Both marks were measured out from the same chalk cross on the path.”"], but: "“A lower sun throws a longer shadow from the same object.”" },
      { who: 2, ev: ["“The September reading was taken at clock noon and the December one at local noon.”", "“Clock noon and local noon can be most of an hour apart in December.”"], but: "“A sun-angle table gave fifty-two degrees in September and thirty-one in December.”" },
    ],
    clears: ["The pole getting taller: “The pole's height was measured at twenty-nine feet on both days.”"],
    note:
      "The sun really is lower and the table proves it, so the honest question is not whether the shadow grew but whether it grew by eight feet. A moved base and a mistimed noon both push the same way and neither was corrected for. A strong answer works out roughly how much of the eight feet the angle alone accounts for.",
  },
  32: {
    story:
      "Every photo from the track meet came out sharp except the ones of the runners. The fences, the clouds and the seated crowd were all crisp in the same frames. A camera makes a picture by holding its shutter open for a slice of time. Anything that moves while the shutter is open smears across the picture. The settings log shows a shutter held open for a full quarter second. A sprinter covers about seven feet in a quarter of a second. The photographer took the camera off the tripod and panned it by hand after the first race. A hand-panned camera never matches a runner's speed exactly. The autofocus was set to lock on the nearest object, which was the rail. The front of the lens was wiped and checked before the first race.",
    q: "Why are only the runners blurred? Make the case for one cause.",
    why: [
      "a quarter-second shutter, with a sprinter covering seven feet",
      "taken off the tripod and panned by hand after the first race",
      "autofocus locked on the nearest object, which was the rail",
      "a lens wiped and checked before the first race",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“The settings log shows a shutter held open for a full quarter second.”", "“A sprinter covers about seven feet in a quarter of a second.”"], but: "“The photographer took the camera off the tripod and panned it by hand after the first race.”" },
      { who: 1, ev: ["“The photographer took the camera off the tripod and panned it by hand after the first race.”", "“A hand-panned camera never matches a runner's speed exactly.”"], but: "“The fences, the clouds and the seated crowd were all crisp in the same frames.”" },
      { who: 2, ev: ["“The autofocus was set to lock on the nearest object, which was the rail.”", "“Anything that moves while the shutter is open smears across the picture.”"], but: "“A sprinter covers about seven feet in a quarter of a second.”" },
    ],
    clears: ["A dirty lens: “The front of the lens was wiped and checked before the first race.”"],
    note:
      "Crisp fences in the same frame is the fact that does the most work, and it cuts hard against panning: a panned camera smears the background, not the subject. Point that out only after the class has argued it. The focus answer has to explain why the crowd, further away than the rail, came out sharp.",
  },
  33: {
    story:
      "A bean plant on the counter leaned hard toward the window by Friday. A plant grows the cells on its shaded side longer than those on its lit side. Growing longer on one side only is what bends a stem toward light. The window is the room's only light source and sits to the plant's left. A second bean under a lamp directly overhead stood perfectly straight all week. The counter itself slopes a finger's width down toward the window. A pot that sits on a slope leans, and the stem leans with it. The watering can is always tipped in from the window side of the pot. Roots grow toward the wetter side and pull the stem over with them. The stem is firm and green with no soft spot or break anywhere.",
    q: "Why does the bean plant lean? Pick one cause and quote the story.",
    why: [
      "a window on its left as the room's only light",
      "a counter sloping a finger's width toward the window",
      "a stem firm and green, with no soft spot or break",
      "a can always tipped in from the window side",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“The window is the room's only light source and sits to the plant's left.”", "“A second bean under a lamp directly overhead stood perfectly straight all week.”"], but: "“The counter itself slopes a finger's width down toward the window.”" },
      { who: 1, ev: ["“The counter itself slopes a finger's width down toward the window.”", "“A pot that sits on a slope leans, and the stem leans with it.”"], but: "“Growing longer on one side only is what bends a stem toward light.”" },
      { who: 3, ev: ["“The watering can is always tipped in from the window side of the pot.”", "“Roots grow toward the wetter side and pull the stem over with them.”"], but: "“A plant grows the cells on its shaded side longer than those on its lit side.”" },
    ],
    clears: ["Rot in the stem: “The stem is firm and green with no soft spot or break anywhere.”"],
    note:
      "Light, slope and watering all pull the same way, which the story arranges deliberately. The lamp-lit twin is a control and a partial one: it sits on the same sloping counter, so it argues against the light being necessary without clearing the slope. Ask what a spirit level and a turned pot would each settle.",
  },
  34: {
    story:
      "Two scoops came out of the freezer together and the metal bowl's scoop melted first. The plastic bowl's scoop still held its shape twenty minutes later. Heat moves into ice cream from whatever is touching it. Metal carries heat many times faster than plastic does. A patch of sun crosses the table from ten until noon and reaches only the metal bowl. Sunlight falling on a bowl warms it whatever the bowl is made of. The metal bowl had been stacked above the dishwasher vent all morning. A bowl that starts warm hands its heat straight to what goes into it. Both scoops were weighed at ninety grams from the same tub.",
    q: "Why did the metal bowl's scoop melt first? Choose one cause and prove it.",
    why: [
      "metal carrying heat many times faster than plastic",
      "a patch of sun reaching only the metal bowl",
      "stacked above the dishwasher vent all morning",
      "both weighed at ninety grams from one tub",
    ],
    open: [0, 1, 2],
    for: [
      { who: 0, ev: ["“Metal carries heat many times faster than plastic does.”", "“Heat moves into ice cream from whatever is touching it.”"], but: "“The metal bowl had been stacked above the dishwasher vent all morning.”" },
      { who: 1, ev: ["“A patch of sun crosses the table from ten until noon and reaches only the metal bowl.”", "“Sunlight falling on a bowl warms it whatever the bowl is made of.”"], but: "“Metal carries heat many times faster than plastic does.”" },
      { who: 2, ev: ["“The metal bowl had been stacked above the dishwasher vent all morning.”", "“A bowl that starts warm hands its heat straight to what goes into it.”"], but: "“The plastic bowl's scoop still held its shape twenty minutes later.”" },
    ],
    clears: ["A bigger scoop: “Both scoops were weighed at ninety grams from the same tub.”"],
    note:
      "Two of the three answers say the metal bowl was already warm and one says it merely carries heat well. That is a real distinction and the class should make it, because it points at different tests. Measuring both bowls with a thermometer before the scoops go in settles two suspects at once.",
  },
  35: {
    story:
      "A long red ribbon on the fence faded to pale pink along one stretch only. The faded stretch runs the length of the south-facing side. The rest of the ribbon, on the north side, is still deep red. Sunlight breaks down the dyes in fabric and lightens the color over time. The south side of this fence takes direct sun from morning until evening. The south rail was repainted in June and the painter wiped the ribbon with thinner. Thinner lifts dye straight off a fabric wherever it touches. The sprinkler head at the south corner has run on that stretch every morning since May. Water carries dye out of fabric a little at a time. The ribbon runs unbroken from end to end and was never cut.",
    q: "Why did one stretch of ribbon fade? Argue for one cause.",
    who: [
      "",
      "",
      "",
      "💦 The sprinkler at the corner",
    ],
    why: [
      "direct sun on the south side from morning until evening",
      "a south rail repainted in June, with thinner wiped on the ribbon",
      "one unbroken ribbon, never cut",
      "a sprinkler running on that stretch every morning since May",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“Sunlight breaks down the dyes in fabric and lightens the color over time.”", "“The south side of this fence takes direct sun from morning until evening.”"], but: "“The south rail was repainted in June and the painter wiped the ribbon with thinner.”" },
      { who: 1, ev: ["“The south rail was repainted in June and the painter wiped the ribbon with thinner.”", "“Thinner lifts dye straight off a fabric wherever it touches.”"], but: "“The faded stretch runs the length of the south-facing side.”" },
      { who: 3, ev: ["“The sprinkler head at the south corner has run on that stretch every morning since May.”", "“Water carries dye out of fabric a little at a time.”"], but: "“Sunlight breaks down the dyes in fabric and lightens the color over time.”" },
    ],
    clears: ["Two different ribbons: “The ribbon runs unbroken from end to end and was never cut.”"],
    note:
      "One ribbon, two colors, is the fact that makes this case work at all, and every answer has to respect it. All three open suspects act on the south stretch and nowhere else, so position cannot choose between them. Dates can: all season for the sun, May onward for the sprinkler, one afternoon in June for the thinner.",
  },
  36: {
    story:
      "Thirty foil balloons touched the gym ceiling on Friday and rested on the floor on Monday. A gas shrinks when it cools and takes up less room than it did warm. A balloon floats only while it pushes aside more air than it weighs. A balloon that shrinks pushes aside less air and stops floating. The gym heat is switched off from Friday evening until Monday morning. A logger in the gym recorded sixty-eight degrees Friday and forty-one on Sunday. The gym was at sixty-six degrees by nine on Monday and the balloons stayed down. A foil balloon loses a little helium through its valve over several days. Each balloon was retied on Friday with a longer ribbon and a small paper weight. Every knot still held and not one balloon had popped.",
    q: "Why did the balloons sink? Pick one cause and prove it from the text.",
    why: [
      "sixty-eight degrees on Friday and forty-one on Sunday",
      "a valve that loses a little helium over several days",
      "every knot holding and not one popped",
      "retied Friday with a longer ribbon and a paper weight",
    ],
    open: [0, 1, 3],
    for: [
      { who: 0, ev: ["“A logger in the gym recorded sixty-eight degrees Friday and forty-one on Sunday.”", "“The gym heat is switched off from Friday evening until Monday morning.”"], but: "“The gym was at sixty-six degrees by nine on Monday and the balloons stayed down.”" },
      { who: 1, ev: ["“A foil balloon loses a little helium through its valve over several days.”", "“The gym was at sixty-six degrees by nine on Monday and the balloons stayed down.”"], but: "“A gas shrinks when it cools and takes up less room than it did warm.”" },
      { who: 3, ev: ["“Each balloon was retied on Friday with a longer ribbon and a small paper weight.”", "“A balloon floats only while it pushes aside more air than it weighs.”"], but: "“Thirty foil balloons touched the gym ceiling on Friday and rested on the floor on Monday.”" },
    ],
    clears: ["A leak or a pop: “Every knot still held and not one balloon had popped.”"],
    note:
      "One sentence breaks the old answer wide open: the gym was warm again on Monday morning and the balloons were still down. Cold shrinks a balloon and warmth gives it back, so a cold weekend alone should have undone itself. A student who finds that line has found the strongest argument in the case, whichever side they take it to.",
  },
};
