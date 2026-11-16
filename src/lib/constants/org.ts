/**
 * Who Upshift Learning is, in one place.
 *
 * These were living on a second website — upshiftlearning.org — which is
 * why they are here: the organisation had a site that said who it was and
 * a site that held what it made, and a teacher who found one had no way to
 * know about the other. Everything that site said now says it here.
 *
 * The EIN and the charter number are the numbers a donor, a district
 * finance office or a grant reviewer looks for, so they are published
 * rather than buried, and they are written once so the About page and the
 * footer cannot disagree about them.
 */

export const ORG = {
  name: "Upshift Learning",
  legalName: "Upshift Learning",
  tagline: "Your shift starts here.",
  promise: "We design bold learning for every person, at every level.",
  /** 501(c)(3), incorporated in Ohio. */
  status: "501(c)(3) Tax-Exempt",
  ein: "41-5068183",
  charter: "5581812",
  state: "Ohio, United States",
  phone: "(614) 662-0943",
  phoneHref: "tel:+16146620943",
  email: "hello@upshiftlearning.org",
  site: "upshiftlearning.org",
  social: {
    instagram: "https://instagram.com/upshiftlearning",
    linkedin: "https://linkedin.com/company/upshiftlearning",
    youtube: "https://youtube.com/@UpshiftLearning",
  },
  /** Dates carried over from the policies as they were published. */
  policyEffective: "January 1, 2026",
} as const

/**
 * The impact figures the organisation publishes.
 *
 * Written down rather than counted, because they are not countable from
 * anything in this repo: they come from the programmes Upshift has run.
 * Kept here so a page cannot quietly round them differently.
 */
export const IMPACT = [
  { figure: "9,000+", label: "Learners served across K–12 and corporate teams" },
  { figure: "1M+", label: "Students impacted through the educators we support" },
  { figure: "Global", label: "Communities across the world moving forward together" },
] as const

/** What Upshift offers, as the services page states it. */
export const SERVICES = [
  {
    icon: "🎯",
    name: "Workshops",
    blurb:
      "Hands-on, high-energy learning sessions designed to spark real change. We bring bold ideas and practical tools your team can use right away.",
    points: ["In-person or virtual", "Half-day, full-day, or multi-day", "Built for K–12 and corporate teams"],
  },
  {
    icon: "🧭",
    name: "Coaching",
    blurb:
      "One-on-one or small group support that meets you where you are. We help educators and leaders grow with confidence — at their own pace.",
    points: ["Instructional coaching", "Leadership coaching", "AI integration support"],
  },
  {
    icon: "🗺️",
    name: "Consulting",
    blurb:
      "Big-picture thinking for schools, districts, and organizations ready to level up. We help you build smarter systems and stronger teams.",
    points: ["Strategic planning", "Program design", "Organizational growth"],
  },
  {
    icon: "💻",
    name: "Online Courses",
    blurb:
      "Learn on your own time with courses built around real needs. No fluff — just practical, flexible learning you can act on fast.",
    points: ["Self-paced modules", "K–12 and corporate tracks", "AI and instructional design topics"],
  },
  {
    icon: "🎤",
    name: "Speaking",
    blurb:
      "Need an energizing voice for your next event? We bring fresh ideas, real stories, and a spark that gets people thinking and moving.",
    points: ["Keynotes", "Panel discussions", "Professional learning events"],
  },
  {
    icon: "🛠️",
    name: "Custom Resources + Tools",
    blurb:
      "Got a specific need? We design custom tools, templates, and resources built around your goals and your learners.",
    points: ["Workshop materials", "Implementation guides", "Coaching tools and frameworks"],
  },
  {
    icon: "🤖",
    name: "AI Integration Support",
    blurb:
      "We help schools and teams use AI in ways that are ethical, intentional, and learner-centered — so the tools work for people, not the other way around.",
    points: ["AI readiness planning", "Staff training and support", "Policy and practice guidance"],
  },
] as const

/** The four beliefs, as both the About and Mission pages state them. */
export const BELIEFS = [
  {
    icon: "🚀",
    name: "Innovation with Purpose",
    blurb: "Ethical, intentional, learner-centered use of tools and technology.",
  },
  {
    icon: "🤝",
    name: "Community + Belonging",
    blurb: "Safe spaces, global teamwork, and ongoing support for all learners.",
  },
  {
    icon: "🧠",
    name: "Intentional Learning Design",
    blurb: "Project-based learning, visible thinking, and strategy that leads the way.",
  },
  {
    icon: "⚡",
    name: "Learning for Impact",
    blurb: "Owning your story, building your brand, and pushing past self-doubt.",
  },
] as const
