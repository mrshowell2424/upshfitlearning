/**
 * The 95% Group Phonics Lesson Library skill numbers, and the Hub lesson that
 * teaches each one.
 *
 * WHY THIS EXISTS. The grade-level instructional plan assigns real children to
 * a PLL skill -- "Kylee S (tested 5.12)", "Arian R, PLL 6.4", "Blaze R, PLL
 * 5.10" -- and the grouping form a teacher carries into a meeting says nothing
 * else about them. The Hub's lessons are keyed cvc-a, vce, og3-04, so a
 * teacher holding that form had no way to find the lesson that matches their
 * group. This is that way.
 *
 * The list is PLL's own, from the List of Skills: Basic covers skills 2 to 5
 * (32 lessons), Advanced 6 to 9 (25), Multisyllable 10 to 15 (18). Seventy-five
 * in all, which is the figure the implementation guide gives.
 *
 * WHERE A SKILL HAS NO HUB LESSON the entry is null rather than the nearest
 * lesson. Two cases matter:
 *
 *   - 8.2, er/ir/ur, which the Hub does not teach at all. It has ar and or,
 *     and it has wor, and nothing between them. The map saying so is worth
 *     more than the map quietly pointing at ar-or.
 *   - the three Advanced phonogram skills, 8.4 to 8.6, which "VrrV and Vre"
 *     only partly covers. They point at it and say partial, because a teacher
 *     should know they are getting some of the skill rather than all of it.
 *
 * Skill 1 is letter names and sounds, which PLL itself does not have lessons
 * for: its own note says the library begins at skill 2.
 */

/**
 * [skill, what PLL calls it, Hub lesson key or null, "partial" where the Hub
 * lesson covers only some of the skill].
 */
export const PLL_SKILLS = [
  // BASIC · short vowels
  ["2.1", "Short Vowel, Short a", "cvc-a"],
  ["2.2", "Short Vowel, Short a (followed by nasals)", "cvc-a", "partial"],
  ["2.3", "Short Vowel, Short i", "cvc-mix"],
  ["2.4", "Short Vowel, Short o", "cvc-mix"],
  ["2.5", "Short Vowel, Short e", "cvc-mix"],
  ["2.6", "Short Vowel, Short u", "cvc-mix"],

  // BASIC · blends
  ["3.1", "Initial S-Blends", "blends"],
  ["3.2", "Initial L-Blends", "blends"],
  ["3.3", "Initial R-Blends", "blends"],
  ["3.4", "Initial 3-Letter Blends", "blends"],
  ["3.5", "Final-S Blends", "blends"],
  ["3.6", "Final-L and -T Blends", "blends"],
  ["3.7", "Final Preconsonant Nasal Blends", "blends"],
  ["3.8", "Past Tense Inflected -ed", "og2-12"],

  // BASIC · digraphs
  ["4.1", "Initial Digraphs ch/sh", "dig"],
  ["4.2", "Final Digraphs ch/sh", "dig"],
  ["4.3", "Digraphs th and wh", "dig"],
  ["4.4", "Final Digraph ck", "og1-04"],
  ["4.5", "Floss Rule", "floss"],
  ["4.6", "Initial qu and Final x", "og1-06"],

  // BASIC · silent e, open syllables, phonograms
  ["5.1", "Long Vowel Silent-e, Long a", "vce"],
  ["5.2", "Long Vowel Silent-e, Long i", "vce"],
  ["5.3", "Long Vowel Silent-e, Long a, e, i, o, u", "vce"],
  ["5.4", "Long Vowel Open Syllable", "og1-02"],
  ["5.5", "Phonograms ang, ing, and ong", "ng-nk"],
  ["5.6", "Phonograms ink, ank, and onk", "ng-nk"],
  ["5.7", "Phonograms ild and ind", "og2-06"],
  ["5.8", "Phonograms old, olt, and ost", "og2-06"],
  ["5.9", "Phonograms all, oll, and alk", "og2-06", "partial"],
  ["5.10", "Long Vowel Silent-e, Long e", "vce"],
  ["5.11", "Long Vowel Silent-e, Long o", "vce"],
  ["5.12", "Long Vowel Silent-e, Long u", "vce"],

  // ADVANCED · predictable vowel teams
  ["6.1", "Vowel Teams, oa and igh", "oa-ow", "partial"],
  ["6.2", "Vowel Teams, oe and ee", "ee-ea", "partial"],
  ["6.3", "Vowel Teams, ai and ay", "ai-ay"],
  ["6.4", "Vowel Teams, oi and oy", "og3-04"],
  ["6.5", "Vowel Teams, au and aw", "og3-04"],

  // ADVANCED · unpredictable vowel teams
  ["7.1", "Vowel Teams, Two Sounds of ie", "long-i", "partial"],
  ["7.2", "Vowel Teams, Two Sounds of ow", "oa-ow"],
  ["7.3", "Vowel Teams, Two Sounds of ea", "ee-ea"],
  ["7.4", "Vowel Teams, Two Sounds of oo", "og2-08"],
  ["7.5", "Vowel Teams, Two Sounds of ou", "og2-08"],
  ["7.6", "Vowel Teams, Two Sounds of ew", "og4-06"],

  // ADVANCED · vowel-r
  ["8.1", "Vowel-r: ar and or", "ar-or"],
  // The Hub teaches ar and or, and it teaches wor, and nothing in between.
  ["8.2", "Vowel-r: er, ir, and ur", null],
  ["8.3", "Words Beginning with w+ar and w+or", "og5-07"],
  ["8.4", "Vowel-r Phonograms air and are", "og2-09", "partial"],
  ["8.5", "Vowel-r Phonograms oar and ore", "og2-09", "partial"],
  ["8.6", "Vowel-r Phonograms ear and ere", "og2-09", "partial"],

  // ADVANCED · complex consonants
  ["9.1", "Silent Letters kn and gn", "og2-07"],
  ["9.2", "Silent Letters wr and mb", "og2-07"],
  ["9.3", "Complex Consonants ck and k", "og1-04"],
  ["9.4", "Complex Consonants tch and ch", "ck-tch"],
  ["9.5", "Hard and Soft c and g", "og3-01"],
  ["9.6", "Phonograms ace, age, and ice", "og3-01", "partial"],
  ["9.7", "Complex Consonants dge and ge", "og3-02"],
  ["9.8", "Past Tense Complex", "og2-12", "partial"],

  // MULTISYLLABLE · closed syllables
  ["10.1", "Closed, Single Syllable", "cvc-mix"],
  ["10.2", "Closed, Simple Multisyllable", "vccv"],
  ["10.3", "Closed, Complex Multisyllable", "og2-10"],
  ["10.4", "Closed, Schwa Multisyllable", "og3-09"],

  // MULTISYLLABLE · silent-e syllables
  ["11.1", "Long Vowel Silent-e, Single Syllable", "vce"],
  ["11.2", "Long Vowel Silent-e, Simple Multisyllable", "vccvce"],
  ["11.3", "Long Vowel Silent-e, Complex Multisyllable", "vccvce", "partial"],

  // MULTISYLLABLE · open syllables
  ["12.1", "Open, Single Syllable", "og1-02"],
  ["12.2", "Open, Simple Multisyllable", "og3-03"],
  ["12.3", "Open, Complex Multisyllable", "og4-05"],

  // MULTISYLLABLE · vowel team syllables
  ["13.1", "Predictable Vowel Team, Single Syllable", "ai-ay"],
  ["13.2", "Predictable Vowel Team, Multisyllable", "teams-all"],
  ["13.3", "Unpredictable Vowel Team, Single Syllable", "og2-08"],
  ["13.4", "Unpredictable Vowel Team, Multisyllable", "og4-06"],

  // MULTISYLLABLE · consonant-le
  ["14.1", "Consonant-le, Single and Multisyllable", "og3-08"],

  // MULTISYLLABLE · vowel-r syllables
  ["15.1", "Vowel-r, Single Syllable", "ar-or"],
  ["15.2", "Vowel-r, Simple Multisyllable", "og2-09"],
  ["15.3", "Vowel-r, Complex Multisyllable", "og2-09", "partial"],
];

/** Which PLL set a skill number belongs to. */
export function pllSet(skill) {
  const main = Number(String(skill).split(".")[0]);
  if (main >= 10) return "Multisyllable";
  if (main >= 6) return "Advanced";
  return "Basic";
}

/** Every PLL skill a Hub lesson answers to, as "5.1, 5.2, 5.3". */
export function skillsForLesson(key) {
  const base = String(key).split("|")[0];
  return PLL_SKILLS.filter((r) => r[2] === base).map((r) => r[0]);
}

/** The Hub lesson for a PLL skill number, or null where there is none. */
export function lessonForSkill(skill) {
  const row = PLL_SKILLS.find((r) => r[0] === String(skill));
  return row ? row[2] : null;
}
