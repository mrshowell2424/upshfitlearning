/**
 * The Science of Reading shelf: the assessments, notebooks and practice
 * material the Basic Reading programme runs on.
 *
 * Taken from the science-of-reading canvas export. The 58 OG concept packs in
 * that same file are deliberately not repeated here — they are already on
 * /reading, and a comparison found them identical, concepts and pack bodies
 * alike. These links were the only part of that file not already on the site.
 *
 * Two links from the export are left out on purpose: "Back to Plans" and
 * "Syllable types poster" point at sibling .dc.html files that do not exist
 * anywhere, so they would have shipped as dead links.
 *
 * Everything here lives in Google Drive, so these are plain outbound links
 * rather than materials served from our own store.
 */

export interface ReadingResource {
  title: string
  detail: string
  /** What opens: a PDF, a zip of files, a sheet, or a website. */
  kind: "PDF" | "ZIP" | "SHEET" | "WEB"
  href: string
}

export interface ResourceGroup {
  name: string
  blurb: string
  items: ReadingResource[]
}

/** The folder holding all of it, for a teacher who would rather browse. */
export const DRIVE_FOLDER =
  "https://drive.google.com/drive/folders/1HzAfK0VyVSobDJKYbaF51sFu0JChcHfO"

export const GROUPS: ResourceGroup[] = [
  {
    name: "Assessments",
    blurb: "Find out where a reader actually is before choosing where to start.",
    items: [
      {
        title: "PAST",
        detail: "Phonological Awareness Skills Test",
        kind: "ZIP",
        href: "https://drive.google.com/file/d/1ftG0wxRflIcIqErg-0n7lFUKeoBtwwGs/view",
      },
      {
        title: "PASI",
        detail: "Phonics and Word Reading Survey",
        kind: "ZIP",
        href: "https://drive.google.com/file/d/1DVgjBWBQP46kVPf1YjmSPecFKs3RUXbz/view",
      },
    ],
  },
  {
    name: "Notebooks",
    blurb: "The complete student notebook for a level, ready to print.",
    items: [
      {
        title: "Level 1 Complete Notebook",
        detail: "Basic Reading, Level 1",
        kind: "PDF",
        href: "https://drive.google.com/file/d/1Vk_zq13bnr4BA20BtcFwp4JXq9APtX1O/view",
      },
      {
        title: "Level 2 Complete Notebook",
        detail: "Basic Reading, Level 2",
        kind: "PDF",
        href: "https://drive.google.com/file/d/1H0BE5LB2C6vB4i6x9O8c01COUlr6Yf7W/view",
      },
      {
        title: "Level 4 Complete Notebook",
        detail: "Basic Reading, Level 4",
        kind: "PDF",
        href: "https://drive.google.com/file/d/1BzweFtxp7I_tDu8EJrQ19mbrOZ92tOzG/view",
      },
      {
        title: "LC Reading Collection L1",
        detail: "Student edition",
        kind: "PDF",
        href: "https://drive.google.com/file/d/13nYyfIAyvzGXZBSZg5cCK3tMzHTMLRFt/view",
      },
      {
        title: "Chapters 1–14",
        detail: "Chapter files",
        kind: "ZIP",
        href: "https://drive.google.com/file/d/1auCCf4r3syD40g1ey8Rq1f9_rU39A5nh/view",
      },
    ],
  },
  {
    name: "Practice",
    blurb: "What a reader works with once the concept has been taught.",
    items: [
      {
        title: "Decodable Passages",
        detail: "Emily Gibbons · OG-based stories, Levels 1–5",
        kind: "PDF",
        href: "https://drive.google.com/file/d/1kDYoMsqkhczgY3SWThZudjcfx9IWwKkg/view",
      },
      {
        title: "Heart Words",
        detail: "Word cards and practice",
        kind: "ZIP",
        href: "https://drive.google.com/file/d/1CXnr0NqKdDR-FDh9b6TFA2vn09-W9bcW/view",
      },
      {
        title: "Heart Word Magic",
        detail: "Really Great Reading",
        kind: "WEB",
        href: "https://www.reallygreatreading.com/resources/heart-word-magic",
      },
      {
        title: "Dictation Paper",
        detail: "Sound boxes and sentence lines",
        kind: "ZIP",
        href: "https://drive.google.com/file/d/1eVUP6BI8MLV7UR_W3vFbikHBjICSO_L2/view",
      },
      {
        title: "6 Minute Solutions",
        detail: "Partner fluency passages",
        kind: "ZIP",
        href: "https://drive.google.com/file/d/1K8H88UY5bmJAvSPiYSqatvrN5fP6v9QG/view",
      },
      {
        title: "Grammar Notebook Pages",
        detail: "Nouns, verbs, adjectives, adverbs, pronouns, articles, homophones",
        kind: "PDF",
        href: "https://drive.google.com/file/d/1HJ_EIl6mjiKPnogvhj-dKGif7LMHBcca/view",
      },
      {
        title: "Blooket Vocabulary · Week 4",
        detail: "harbor, harvest, ghost town, infected, convenient",
        kind: "SHEET",
        href: "https://docs.google.com/spreadsheets/d/18o6bmPUPVwpf3Zf5Wfx_0WgNhYwCKDEhb6pINKcZdHA/edit",
      },
    ],
  },
]

export const RESOURCE_COUNT = GROUPS.reduce((n, g) => n + g.items.length, 0)
