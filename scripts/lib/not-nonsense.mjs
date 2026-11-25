/**
 * The short real words a 1934 dictionary does not have.
 *
 * scripts/lib/real-short-words.json is the Unix web2 list, which is thorough
 * about English words and silent about everything else: no abbreviations, no
 * clipped words, nothing coined after the Depression. Generating made-up
 * words against web2 alone produced `stat`, `chem`, `gov`, `feb`, `med`,
 * `def`, `rem` and `clos` -- every one of them a real string a child meets --
 * and a made-up-word probe that asks a child to read a real word as nonsense
 * teaches the opposite of what it is for.
 *
 * Scanning the Hub's own reading content instead was worse in both
 * directions: it missed most of these, because children's passages do not say
 * "chem" or "gov", and it blocked genuine nonsense like `vop` and `dake` that
 * happened to appear inside the data as something else.
 *
 * So this is enumerated by hand. It is the finite part of the problem: short
 * strings that are real for a reason web2 cannot know about.
 */

/** Abbreviations and clipped words, the class web2 is blindest to. */
const CLIPPED = [
  // Calendar and time
  "jan", "feb", "mar", "apr", "jun", "jul", "aug", "sep", "sept", "oct",
  "nov", "dec", "mon", "tue", "tues", "wed", "thu", "thur", "fri", "sat",
  "sun", "am", "pm", "hr", "hrs", "min", "mins", "sec", "secs", "yr", "yrs",
  // Measures and maths
  "cm", "mm", "km", "kg", "mg", "ml", "oz", "lb", "lbs", "ft", "in", "mi",
  "sq", "mph", "kph", "temp", "max", "min", "avg", "num", "qty", "pct",
  "stat", "stats", "calc", "geo", "trig", "exp", "sum", "div", "mult",
  // School and subjects
  "chem", "bio", "lab", "labs", "sci", "math", "maths", "lit", "econ",
  "phys", "psych", "gym", "rec", "pe", "ela", "iep", "sped", "esl", "ell",
  "quiz", "exam", "hw", "grad", "prek", "kinder", "prof", "dept", "uni",
  // Medical and body
  "med", "meds", "doc", "docs", "vet", "vets", "rem", "icu", "er", "ems",
  "flu", "temp", "rx", "ot", "pt", "slp", "adhd", "asd",
  // Government, places, orgs
  "gov", "govt", "fed", "feds", "dept", "admin", "mgr", "ceo", "cfo", "hq",
  "usa", "us", "uk", "eu", "un", "nasa", "fbi", "cia", "dmv", "irs",
  "st", "ave", "rd", "blvd", "apt", "po", "zip", "usps",
  // Tech
  "app", "apps", "web", "net", "url", "pdf", "jpg", "png", "gif", "html",
  "css", "js", "api", "ram", "cpu", "gpu", "usb", "wifi", "tech", "info",
  "demo", "spec", "specs", "sync", "auth", "db", "os", "ai", "ml", "vr", "ar",
  "blog", "vlog", "spam", "chat", "text", "dm", "pm", "emoji", "meme",
  "def", "config", "init", "repo", "dev", "prod", "env", "src", "img",
  // Everyday clipped words
  "ad", "ads", "bike", "phone", "fridge", "plane", "photo", "pic", "pics",
  "exam", "flu", "gas", "lunch", "memo", "pub", "taxi", "telly", "tv",
  "vac", "van", "zoo", "fan", "fax", "fab", "fav", "favs", "legit", "sus",
  "deli", "disco", "limo", "promo", "combo", "condo", "intro", "retro",
  "solo", "typo", "veggie", "cardi", "hippo", "rhino", "cello", "piano",
  "auto", "aero", "agro", "micro", "macro", "mini", "maxi", "semi", "multi",
  "co", "ex", "re", "un", "non", "pre", "pro", "sub", "mid", "mis",
  // Money, business, sport
  "biz", "inc", "ltd", "llc", "corp", "pos", "atm", "pin", "cash", "tax",
  "nfl", "nba", "mlb", "nhl", "ref", "refs", "sub", "subs", "ko", "mvp",
  "goal", "golf", "gym", "lap", "laps", "rep", "reps", "set", "sets",
  // Names and words that read as names
  "bob", "tom", "jim", "sam", "dan", "ben", "meg", "pam", "kim", "tim",
  "ron", "don", "jen", "liz", "max", "pat", "rob", "ted", "val", "deb",
  "gus", "hal", "ian", "jed", "ken", "len", "mel", "nat", "pip", "sid",
  "sue", "wes", "zac", "zeb", "abe", "ada", "ali", "ana", "eli", "eva",
  // Interjections and sounds a child reads as words
  "aha", "aw", "bah", "blah", "blech", "boo", "brr", "duh", "eek", "eh",
  "er", "erm", "ew", "gah", "ha", "hah", "heh", "hey", "hm", "hmm", "ho",
  "huh", "hup", "ick", "meh", "mm", "nah", "naw", "oi", "ooh", "oops",
  "ouch", "ow", "oy", "pff", "pfft", "phew", "psst", "sh", "shh", "tsk",
  "ugh", "uh", "um", "whoa", "wow", "yay", "yeah", "yep", "yikes", "yo",
  "yuck", "yum", "zap", "zing", "zonk", "oof", "argh", "gee", "golly",
  // Modern or informal words web2 predates
  "chill", "cool", "dude", "funk", "geek", "goth", "grunge", "hunk", "jazz",
  "jeep", "junk", "kid", "kids", "mall", "mom", "moms", "mum", "nerd",
  "punk", "rap", "rock", "sax", "snack", "soda", "techno", "teen", "tux",
  "wok", "yoga", "zen", "bus", "cab", "cop", "cops", "hug", "hugs", "jog",
  "mob", "mug", "nap", "pal", "pals", "pet", "pets", "pop", "pup", "tip",
  "van", "wig", "bop", "dud", "fib", "gig", "hip", "jet", "kit", "lab",
  "nab", "ump", "bum", "dip", "hum", "jam", "lap", "mop", "rib", "sip",
  "tab", "tub", "wad", "yam", "zig", "zag", "gel", "gum", "hog", "jab",
  "keg", "log", "mud", "nut", "pod", "rug", "sob", "tag", "vat", "web",
  "yak", "zip", "clos", "nos", "mos", "gis", "sel", "bok", "det", "pid",
  "pix", "vid", "vids", "sim", "sims", "mech", "mega", "ultra", "turbo",
  "cyber", "online", "offline", "upload", "stream", "screen", "laptop",
  // Slang real enough to be read as a word: a mook is a fool, a zoot suit is
  // a suit. Both came through four filters and were caught by reading.
  "mook", "zoot", "zoots", "mooks",
  // Found by reading 300 generated words. Every one of these is a real word
  // or name and none of them is in the 1934 dictionary.
  "yup", "lib", "neg", "pel", "pav", "biv", "lun", "yog", "rez", "mol",
  "yod", "tem", "rav", "zin", "dav", "jil", "heb", "jed", "kez", "vin",
  "gav", "pag", "zal", "vil", "suf", "fis", "nus", "rov", "bep", "hus",
  "dez", "jez", "mef", "wef", "gep", "yab", "jod", "zub", "gef", "vaf",
];

/**
 * Letter strings nobody hands a child, whatever a generator says.
 *
 * A dictionary cannot catch these, because the problem with them is precisely
 * that they are not words: they are how a ten-year-old would spell one. The
 * first run of the probe generator produced one of them.
 */
const NEVER = [
  "fuk", "fuc", "fuq", "phuk", "phuc", "fuks", "fuct", "fugg",
  "kunt", "cunt", "kunts", "kuntz",
  "shit", "shyt", "shet", "shiz", "schit", "shite",
  "piss", "pis", "pizz",
  "dik", "dic", "dick", "dyk", "dix", "dicks", "dix",
  "kok", "cok", "coc", "cawk", "kox", "cock",
  "tit", "tits", "tyt", "titz",
  "ass", "azz", "arse", "arss", "asss",
  "damn", "dam", "damm", "dammn",
  "hell", "hel", "helll",
  "crap", "krap", "crup", "krapp",
  "sux", "suk", "suc", "sukk", "sucks",
  "bich", "bitch", "bych", "biatch",
  "wank", "wanc", "wonk",
  "jizz", "jiz", "jism",
  "cum", "kum", "cumm",
  "fag", "fagg", "phag", "fags",
  "hoe", "hos", "hoez", "hoor",
  "slut", "slud", "sluts",
  "rape", "rayp", "rapey",
  "nig", "nigg", "nigs", "spic", "spik", "kike", "kyke", "wop", "chink",
  "gook", "gyp", "jap", "coon", "koon", "dago", "pak", "paki",
  "poop", "pee", "fart", "butt", "barf", "puke", "snot", "turd", "pud",
  "vom", "wee", "wiz", "poo", "bum", "fanny",
  "jew", "jews", "gay", "gays", "sex", "sexy", "porn", "pron", "porno",
  "nazi", "nazy", "naz", "kkk", "klan",
  "kuck", "cuck", "slong", "shlong", "rass", "phuck", "fck", "fuk",
];

/** Any of these inside a longer string sinks it, blend in front or not. */
const NEVER_RE =
  /(fuk|fuc|kunt|cunt|shit|bitch|nigg|piss|dick|cock|rape|jizz|slut|whore|penis|vagin|boob|turd|fart|cuck|kuck|schlong|shlong)/;


/**
 * Strings that sound exactly like a real word.
 *
 * THE FOURTH CLASS, and the one that matters most for a probe. "kup", "blak",
 * "kut", "stek" and "wuz" are not real words and no dictionary blocks them,
 * but a child who decodes them correctly says cup, black, cut, steak and was.
 * The examiner then cannot tell a correct read from a substitution, which is
 * the one thing a made-up-word probe exists to measure. A phonetic respelling
 * of a common word is therefore unusable however well it fits the pattern.
 *
 * Catching these properly wants a pronunciation dictionary. Until there is
 * one, this is the audited list: every candidate the generator has produced
 * that a reader would voice as an ordinary word.
 */
const RESPELLINGS = [
  "kup", "kap", "kut", "kat", "kot", "kit", "ket", "kof", "kof", "kuf",
  "blak", "blok", "brak", "brek", "stek", "stok", "stik", "snak", "trak",
  "kik", "kok", "kak", "pak", "bak", "sak", "tak", "rok", "sok", "lok",
  "dok", "jok", "nek", "bek", "dek", "pek", "wek", "chek", "shok", "thik",
  "sez", "wuz", "haz", "iz", "hiz", "duz", "dat", "dis", "dem", "den",
  "laf", "enuf", "tuf", "ruf", "cof", "frend", "hed", "red", "ded", "sed",
  "bred", "spred", "thred", "wen", "wot", "wat", "wich", "wile", "wip",
  "jum", "jump", "rop", "hom", "kom", "sum", "sun", "won", "tu", "too",
  "nite", "lite", "brite", "rite", "site", "mite", "tho", "thru", "rite",
  "fone", "foto", "graf", "laff", "stuf", "beleve", "fren", "yall", "soz",
  "chep", "cral", "wak", "tok", "luk", "buk", "gud", "woz", "shud", "wud",
  "kud", "cud", "kan", "ken", "ther", "wer", "yer", "ur", "becuz", "cuz",
  "prid", "snid", "graz", "draf", "chast", "bost", "cruch", "smoth", "wass",
  "pach", "tich", "yach", "sluch", "fril", "reff", "mut", "nud", "flus",
];

/** More clipped and modern words the first pass missed. */
const CLIPPED_MORE = [
  "hiv", "gop", "cred", "nav", "preg", "bril", "rif", "dep", "tek", "vib",
  "spen", "trav", "brun", "grik", "shem", "frak", "cring", "smosh", "swoll",
  "swole", "ded", "lol", "omg", "brb", "idk", "tbh", "imo", "fyi", "asap",
  "diy", "faq", "rsvp", "eta", "aka", "etc", "vs", "eg", "ie", "ok", "okay",
  "covid", "vax", "vaxx", "mask", "zoom", "uber", "wiki", "blog", "vlog",
  "selfie", "hash", "tag", "ping", "spam", "troll", "stan", "ship", "sus",
  "bae", "bro", "sis", "fam", "gran", "nan", "pa", "ma", "dada", "papa",
  "gas", "elec", "util", "rent", "mort", "loan", "debt", "fund", "etf",
  "ira", "hsa", "irs", "ssn", "dob", "ssa", "snap", "wic", "medi",
];

export const CLIPPED_WORDS = new Set([...CLIPPED, ...CLIPPED_MORE, ...RESPELLINGS]);
export const NEVER_WORDS = new Set(NEVER);

/** True when a generated string must not be shown to a child. */
export function unsafeWord(w) {
  const k = String(w).toLowerCase();
  return NEVER_WORDS.has(k) || NEVER_RE.test(k);
}

/**
 * True when a REAL word must not be shown to a child.
 *
 * The whole word, never a piece of it. unsafeWord above sinks anything with
 * one of those strings inside it, which is right for a made-up word -- a
 * generator that writes "accurape" has to be stopped whatever it was aiming
 * at -- and wrong for English, where the same rule throws out scrape, grape
 * and farther. A checker that objects to "grape" is a checker somebody turns
 * off, and then it is not there for "sex".
 */
export function unsafeRealWord(w) {
  return NEVER_WORDS.has(String(w).toLowerCase());
}

/** True when a generated string is actually a real word after all. */
export function looksReal(w, dictionary) {
  const k = String(w).toLowerCase();
  return dictionary.has(k) || CLIPPED_WORDS.has(k);
}
