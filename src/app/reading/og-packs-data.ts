/**
 * The OG concept packs, as the Basic Reading page lists them.
 *
 * Extracted from content-reading-materials/og-packs/og-concepts.js, which the
 * pack pages themselves read at runtime, so the two cannot drift: regenerate
 * this rather than editing it by hand.
 *
 * Only the fields the index shows are here. A pack's roadmap, activities,
 * Survival Island chests, decodable and reading lists live in og-pack-data.js
 * and are served, gated, to the pack page.
 */

export interface OgLevel {
  level: number
  title: string
  grades: string
}

export interface OgConcept {
  id: string
  level: number
  name: string
  /** The spellings the pack covers, as the OG sequence words them. */
  patterns: string
}

export const OG_LEVELS: OgLevel[] = [
  { level: 1, title: "Level 1", grades: "1st–2nd" },
  { level: 2, title: "Level 2", grades: "2nd–3rd" },
  { level: 3, title: "Level 3", grades: "3rd–4th" },
  { level: 4, title: "Level 4", grades: "4th–5th" },
  { level: 5, title: "Level 5", grades: "5th" },
]

export const OG_CONCEPTS: OgConcept[] = [
  { id: "1-01", level: 1, name: "Short vowels · closed syllable", patterns: "a, e, i, o, u" },
  { id: "1-02", level: 1, name: "Open syllable (one syllable)", patterns: "he, me, hi, no, go" },
  { id: "1-03", level: 1, name: "Consonants", patterns: "p b t d f v h m n s g r l w z j y" },
  { id: "1-04", level: 1, name: "c, k, ck", patterns: "c, k, ck" },
  { id: "1-05", level: 1, name: "Consonant digraphs", patterns: "sh, ch, th, wh" },
  { id: "1-06", level: 1, name: "x and qu", patterns: "x, qu" },
  { id: "1-07", level: 1, name: "FLOSS rule", patterns: "ff, ll, ss, zz" },
  { id: "1-08", level: 1, name: "Silent e (VCe)", patterns: "a-e, e-e, i-e, o-e, u-e" },
  { id: "1-09", level: 1, name: "Blends", patterns: "initial, final, three-letter" },
  { id: "1-10", level: 1, name: "Suffix -s", patterns: "-s (voiced /z/, unvoiced /s/)" },
  { id: "1-11", level: 1, name: "Possessive 's", patterns: "'s" },
  { id: "1-12", level: 1, name: "VC/CV syllable division", patterns: "VC/CV, compound words, VC/CVCe" },
  { id: "1-13", level: 1, name: "Closed prefixes", patterns: "un-, non-" },
  { id: "2-01", level: 2, name: "Nasal blends (welded sounds)", patterns: "ing, ang, ong, ung, ink, ank, onk, unk" },
  { id: "2-02", level: 2, name: "Final y", patterns: "y says /ī/ or /ē/" },
  { id: "2-03", level: 2, name: "Trigraph -tch", patterns: "-tch vs. ch" },
  { id: "2-04", level: 2, name: "R-controlled vowels", patterns: "ar, er, ir, or, ur" },
  { id: "2-05", level: 2, name: "Vowel teams 1", patterns: "ai, ay, ee, ea, oa, ow, ey, oe" },
  { id: "2-06", level: 2, name: "Closed syllable exceptions", patterns: "ild, old, ost, ind, oll, olt" },
  { id: "2-07", level: 2, name: "Silent letters", patterns: "kn, wr, gh" },
  { id: "2-08", level: 2, name: "oo, ou, ow", patterns: "oo (book, moon), ou (out), ow (plow)" },
  { id: "2-09", level: 2, name: "VrrV and Vre", patterns: "VrrV (carry), Vre (care, here)" },
  { id: "2-10", level: 2, name: "VCCCV division", patterns: "VC/CCV, VCC/CV" },
  { id: "2-11", level: 2, name: "Consonant suffixes", patterns: "-ful, -less, -ness, -ment, -ly" },
  { id: "2-12", level: 2, name: "Vowel suffixes", patterns: "-ed, -ing, -est, -y, -en, -es" },
  { id: "2-13", level: 2, name: "Prefixes mis-, sub-, post-", patterns: "mis-, sub-, post-" },
  { id: "2-14", level: 2, name: "Doubling rule", patterns: "1-1-1 rule" },
  { id: "3-01", level: 3, name: "Soft c and soft g", patterns: "c before e/i/y says /s/, g before e/i/y says /j/" },
  { id: "3-02", level: 3, name: "Trigraph -dge", patterns: "-dge vs. -ge" },
  { id: "3-03", level: 3, name: "Open syllable V/CV", patterns: "V/CV (baby, spider, robot, music)" },
  { id: "3-04", level: 3, name: "Vowel teams 2", patterns: "oi, oy, au, aw, ea (bread), ie, igh" },
  { id: "3-05", level: 3, name: "Silent e rule (dropping)", patterns: "drop e before a vowel suffix" },
  { id: "3-06", level: 3, name: "Final y rule (changing)", patterns: "change y to i" },
  { id: "3-07", level: 3, name: "VC/V division", patterns: "VC/V (robin)" },
  { id: "3-08", level: 3, name: "Consonant-le", patterns: "-ble, -cle, -dle, -fle, -gle, -ple, -tle, -zle" },
  { id: "3-09", level: 3, name: "Schwa a", patterns: "unaccented a (soda, lagoon)" },
  { id: "3-10", level: 3, name: "Contractions", patterns: "n't, 's, 'll, 're, 've" },
  { id: "3-11", level: 3, name: "Final stable syllables", patterns: "-tion, -sion" },
  { id: "3-12", level: 3, name: "Derivational suffixes", patterns: "-ist, -able, -ible, -ive" },
  { id: "3-13", level: 3, name: "Open prefixes", patterns: "re-, pro-, pre-, de-" },
  { id: "4-01", level: 4, name: "Latin roots 1", patterns: "form, port, tract, rupt, scrib/script" },
  { id: "4-02", level: 4, name: "Latin roots 2", patterns: "spec/spect, struct, flect/flex, mit/miss, ject" },
  { id: "4-03", level: 4, name: "Latin roots 3", patterns: "duc/duct, grad/gress, cur/curs, vid/vis, aud, vert/vers" },
  { id: "4-04", level: 4, name: "Latin prefixes and suffixes", patterns: "trans-, inter-, -ure, -ous, -ic, -ar, -or, -ity" },
  { id: "4-05", level: 4, name: "V/V division", patterns: "V/V (neon, duet)" },
  { id: "4-06", level: 4, name: "Vowel teams 3", patterns: "ue, ei, eu, ew, eigh, ui" },
  { id: "4-07", level: 4, name: "Chameleon prefixes", patterns: "in-/im-/il-/ir-, con-/com-, dis-, ex-, sub-" },
  { id: "4-08", level: 4, name: "Connectives ti and ci", patterns: "-tian, -tial, -tious, -cian, -cial, -cious" },
  { id: "4-09", level: 4, name: "Advanced doubling rule", patterns: "accented final syllable" },
  { id: "5-01", level: 5, name: "Greek digraphs", patterns: "ph (phone), ch (school)" },
  { id: "5-02", level: 5, name: "Greek y", patterns: "y in myth, gym, cyber, type" },
  { id: "5-03", level: 5, name: "Silent Greek letters", patterns: "rh, mn, pn, ps" },
  { id: "5-04", level: 5, name: "Greek combining forms", patterns: "phon, tele, photo, bio, graph, ology, meter, geo, hydro, mono, poly" },
  { id: "5-05", level: 5, name: "French concepts", patterns: "ch (chef), ou (soup), que (antique)" },
  { id: "5-06", level: 5, name: "Scribal o and other schwas", patterns: "o next to m, n, v (bottom, month, oven)" },
  { id: "5-07", level: 5, name: "R-controlled wor", patterns: "wor (worm)" },
  { id: "5-08", level: 5, name: "Suffixes -al, -age, -ance, -ence", patterns: "-al, -age, -ance, -ence" },
  { id: "5-09", level: 5, name: "Word families aught, ought", patterns: "aught, ought" },
]

/** The href the pack page answers to, through /api/materials. */
export const ogPackHref = (code: string) => `og-packs/OG Pack.dc.html?c=${code}`
