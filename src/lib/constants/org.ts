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

/**
 * The team, as the old site described it.
 *
 * Stephanie's own section is the hero of the About page and is not repeated
 * here; what the old site added was that nobody is working from
 * off-the-shelf content and that the programmes answer to people outside the
 * organisation. Both are claims a district will want to see made.
 */
export const TEAM = [
  {
    initial: "L",
    name: "Learning Design Team",
    role: "Instructional Designers",
    blurb:
      "A dedicated team of curriculum developers and coaches who build every workshop, course, and resource from the ground up — no off-the-shelf content.",
  },
  {
    initial: "A",
    name: "Advisory Network",
    role: "Educators & Leaders",
    blurb:
      "We work alongside a growing network of school leaders, district administrators, and workforce development professionals who guide our programs and impact.",
  },
] as const

/** What the old site called the Upshift Difference. */
export const DIFFERENCE = [
  "Tailored to your context, your team, your goals",
  "Practical tools you can use the very next day",
  "Rooted in research, delivered with energy",
  "Ongoing support — not a one-and-done workshop",
] as const

/**
 * The three testimonials, quoted as published.
 *
 * Attributed by role rather than name, which is how they were given. They
 * are somebody else's words about this organisation, so they are carried
 * across unchanged or not at all.
 */
export const TESTIMONIALS = [
  {
    quote: "Our team walked away with tools we could use the very next day.",
    who: "District Leader",
    where: "K–12 School District",
  },
  {
    quote:
      "Upshift Learning changed the way I think about teaching. The strategies are real, practical, and they actually work.",
    who: "K–12 Educator",
    where: "Public School Teacher",
  },
  {
    quote: "This wasn't just another workshop. It was a shift.",
    who: "Corporate Learning Manager",
    where: "Fortune 500 Company",
  },
] as const

/**
 * The registration details, in the order the old site listed them.
 *
 * On the page for donors, partners and anyone verifying the organisation.
 * Written once because the About page and the Contact page both show them
 * and they must not drift apart.
 */
export const ORG_DETAILS = [
  { label: "Legal Organization Name", value: ORG.legalName },
  { label: "Nonprofit Status", value: ORG.status },
  { label: "Employer Identification (EIN)", value: ORG.ein },
  { label: "Charity / Ohio Charter Number", value: ORG.charter },
  { label: "State of Incorporation", value: ORG.state },
] as const
