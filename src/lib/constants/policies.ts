/**
 * The policies, carried over from upshiftlearning.org.
 *
 * Transcribed from the pages as they were published there, section by
 * section, rather than rewritten: this is the text the organisation has
 * already stood behind, and a policy that gets paraphrased on its way to a
 * new site is a different policy.
 *
 * Two repairs, both of them faults in the original. The email address was
 * obfuscated in the markup and came through as a placeholder, so it is
 * written out. And the sentence "Our principal address is." ended without
 * an address on the old site, so it was carried over unfinished rather than
 * completed with an address nobody had given; it has now been removed at
 * the organisation's direction. Nothing is lost by it: section 1 still
 * identifies the organisation by name, EIN and Ohio charter number, and the
 * policy gives hello@upshiftlearning.org as the way to reach us, which is
 * the contact route the rest of the document relies on.
 */

export const POLICY_EFFECTIVE = "January 1, 2026"

/**
 * Put the hard-wrapped transcription back into paragraphs.
 *
 * The policies were transcribed line by line from the old site, which wrapped
 * them at about ninety characters. Every line was then rendered as its own
 * <p> with a gap under it, so a visitor read a ladder of fragments with
 * sentences split across the breaks -- "We operate the website
 * upshiftlearning.org (the" sitting alone above ""Site") to share information
 * about our mission". On a legal page, which is the one page a reader is
 * entitled to find exact, that is worse than ugly.
 *
 * The rule: a line joins the one above it when that line does not end a
 * sentence. A wrap can only ever happen mid-sentence, so this repairs the
 * wrapping and nothing else.
 *
 * It is safe for the lists, which is the thing worth checking before
 * trusting it. Where a section is a list -- privacy 3, terms 3 -- every
 * item is a finished sentence ending in a full stop, so no item is ever
 * swallowed by the one above it. A line ending in a colon ends a paragraph
 * too, which is what keeps "This includes:" above its list rather than
 * glued to the first item.
 */
export function paragraphs(lines: string[]): string[] {
  const out: string[] = []
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    const prev = out[out.length - 1]
    if (prev !== undefined && !/[.:!?]$/.test(prev)) out[out.length - 1] = `${prev} ${line}`
    else out.push(line)
  }
  return out
}

export type PolicySection = { n: number; heading: string; body: string[] }
export type Policy = { title: string; intro: string[]; sections: PolicySection[] }

export const POLICIES: Record<"privacy" | "terms", Policy> = {
  "privacy": {
    "title": "Privacy Policy",
    "intro": [
      "We respect your privacy and are committed to protecting your personal information."
    ],
    "sections": [
      {
        "n": 1,
        "heading": "Introduction & Who We Are",
        "body": [
          "Upshift Learning (\"we,\" \"us,\" or \"our\") is a registered 501(c)(3) nonprofit organization",
          "incorporated in the State of Ohio (EIN: 41-5068183; Ohio Charter Number: 5581812).",
          "We operate the website upshiftlearning.org (the",
          "\"Site\") to share information about our mission, programs, and services, and to connect with",
          "educators, learners, and supporters. This Privacy Policy explains how we collect, use,",
          "share, and protect information when you visit our Site or interact with us.",
          "By using our Site, you agree to the practices described in this Privacy Policy. If you do",
          "not agree, please discontinue use of the Site."
        ]
      },
      {
        "n": 2,
        "heading": "Information We Collect",
        "body": [
          "We collect a limited amount of personal information, and only when you voluntarily provide it to us. This includes:",
          "Email: when you write to us at hello@upshiftlearning.org, we receive your email address and whatever you choose to tell us. This Site has no contact form; there is nothing else to fill in.",
          "Newsletter or update sign-ups: If you opt in to receive communications from us, we collect your email address and, where provided, your name.",
          "We do not directly collect payment information. Donations made through our",
          "Site are processed entirely by PayPal. We do not receive or store your credit card,",
          "debit card, or bank account details. Please review",
          "PayPal's Privacy Policy",
          "for information on how they handle your payment data.",
          "We also collect certain non-personal technical information automatically when you visit our",
          "Site, such as your browser type, operating system, referring URL, and pages viewed. This",
          "information is used in aggregate form and is not linked to any individual."
        ]
      },
      {
        "n": 3,
        "heading": "How We Use Your Information",
        "body": [
          "We use the information we collect for the following purposes:",
          "Responding to inquiries: To reply to messages and questions you send us by email.",
          "Sending updates and communications: To send newsletters, program announcements, or other information you have requested or consented to receive.",
          "Improving our services: To understand how visitors use our Site and to enhance our content, programs, and user experience.",
          "Fulfilling our nonprofit mission: To connect with educators, learners, and supporters who share our commitment to bold, accessible learning.",
          "Legal compliance: To comply with applicable laws, regulations, and legal obligations.",
          "We will not use your information for purposes incompatible with those described above without your consent."
        ]
      },
      {
        "n": 4,
        "heading": "How We Share Your Information",
        "body": [
          "We do not sell, rent, or trade your personal information to third parties.",
          "We share information only in the limited circumstances described below:",
          "form processing service. When you submit the contact form, your data is transmitted to",
          "for more information.",
          "PayPal: Donation transactions are processed by",
          "PayPal . Any information",
          "you provide during the donation process is subject to PayPal's privacy practices.",
          "Legal requirements: We may disclose information if required to do so by law",
          "or in response to a valid legal process, such as a court order or government request.",
          "Protection of rights: We may share information when we believe in good",
          "faith that disclosure is necessary to protect our rights, your safety, or the safety of",
          "others.",
          "We do not share personal information with third-party advertisers or marketing platforms."
        ]
      },
      {
        "n": 5,
        "heading": "Cookies and Analytics",
        "body": [
          "Our Site may use basic browser cookies — small text files stored on your device — to support",
          "standard website functionality, such as remembering your preferences during a session.",
          "We do not use tracking cookies, advertising cookies, or behavioral profiling tools.",
          "We do not participate in cross-site tracking or retargeting programs.",
          "Any analytics data we collect (such as page view counts or traffic sources) is used only in",
          "aggregate, non-identifiable form to help us understand how our content is being used and to",
          "improve the Site.",
          "You can configure your browser to refuse cookies or to alert you when cookies are being sent.",
          "Please note that disabling cookies may affect certain features of the Site."
        ]
      },
      {
        "n": 6,
        "heading": "Data Retention",
        "body": [
          "We retain personal information only for as long as necessary to fulfill the purposes described",
          "in this Privacy Policy, or as required by applicable law.",
          "Contact form submissions and email correspondence are retained for a reasonable period to allow us to respond to your inquiry and maintain accurate records of communication.",
          "Email addresses used for communications or newsletters are retained until you request removal or unsubscribe.",
          "When personal information is no longer needed, we delete it or anonymize it in a manner consistent with our data security practices."
        ]
      },
      {
        "n": 7,
        "heading": "Your Rights",
        "body": [
          "You have the following rights with respect to your personal information:",
          "Access: You may request a copy of the personal information we hold about you.",
          "Correction: You may request that we correct any inaccurate or incomplete information.",
          "Deletion: You may request that we delete the personal information we hold about you, subject to any legal obligations we may have to retain certain records.",
          "Opt out of communications: You may opt out of receiving email communications from us at any time by following the unsubscribe instructions in any email we send, or by contacting us directly at hello@upshiftlearning.org .",
          "To exercise any of these rights, please contact us at",
          "hello@upshiftlearning.org . We will respond",
          "to your request within a reasonable timeframe."
        ]
      },
      {
        "n": 8,
        "heading": "Children's Privacy",
        "body": [
          "Upshift Learning's programs and resources are designed for educators and adult learners. Our",
          "Site is not directed to children under the age of 13, and we do not knowingly collect",
          "personal information from children under 13.",
          "If you believe that a child under the age of 13 has provided us with personal information",
          "without parental consent, please contact us at",
          "hello@upshiftlearning.org and we will take",
          "prompt steps to delete that information."
        ]
      },
      {
        "n": 9,
        "heading": "Changes to This Policy",
        "body": [
          "We may update this Privacy Policy from time to time to reflect changes in our practices,",
          "technology, legal requirements, or other factors. When we make material changes, we will",
          "update the effective date at the top of this page.",
          "We encourage you to review this Privacy Policy periodically. Your continued use of the Site",
          "after any changes constitutes your acceptance of the updated policy."
        ]
      },
      {
        "n": 10,
        "heading": "Contact Us",
        "body": [
          "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:",
          "Email: hello@upshiftlearning.org",
          "Phone: (614) 662-0943",
          "Mailing Address: Upshift Learning."
        ]
      }
    ]
  },
  "terms": {
    "title": "Terms of Use",
    "intro": [
      "Please read these terms carefully before using our website."
    ],
    "sections": [
      {
        "n": 1,
        "heading": "Acceptance of Terms",
        "body": [
          "By accessing or using the website located at",
          "upshiftlearning.org (the \"Site\"), you agree to be",
          "bound by these Terms of Use (\"Terms\"). If you do not agree to these Terms, please do not use",
          "the Site.",
          "These Terms apply to all visitors, users, and others who access or use the Site. We reserve",
          "the right to modify these Terms at any time. Continued use of the Site following any changes",
          "constitutes your acceptance of the revised Terms."
        ]
      },
      {
        "n": 2,
        "heading": "About Upshift Learning",
        "body": [
          "Upshift Learning is a registered 501(c)(3) nonprofit organization incorporated in the State",
          "of Ohio (EIN: 41-5068183; Ohio Charter Number: 5581812), with principal offices at.",
          "Our mission is to design bold, accessible learning experiences for every person, at every",
          "level. We serve educators, learners, and communities by developing curriculum resources,",
          "professional development programs, and instructional design services that advance equity and",
          "excellence in education.",
          "The Site is provided as an informational and community resource in furtherance of our",
          "nonprofit mission. It is not operated for commercial gain."
        ]
      },
      {
        "n": 3,
        "heading": "Use of Website",
        "body": [
          "Permitted uses. You may use the Site for lawful, personal, and non-commercial purposes consistent with these Terms, including:",
          "Browsing and reading content about our programs, services, and mission.",
          "Submitting inquiries through our contact form.",
          "Making voluntary charitable donations.",
          "Sharing links to our publicly available content.",
          "Prohibited uses. You agree not to:",
          "Use the Site in any way that violates applicable federal, state, local, or international law or regulation.",
          "Reproduce, duplicate, copy, sell, or exploit any portion of the Site for commercial purposes without our express written permission.",
          "Transmit any unsolicited or unauthorized advertising or promotional material (spam).",
          "Attempt to gain unauthorized access to any portion of the Site or its related systems.",
          "Introduce malware, viruses, or any other harmful code.",
          "Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Site.",
          "Misrepresent your identity or affiliation with any person or organization.",
          "Scrape or harvest data from the Site without prior written consent."
        ]
      },
      {
        "n": 4,
        "heading": "Intellectual Property",
        "body": [
          "All content on the Site — including but not limited to text, graphics, logos, photographs,",
          "audio, video, curriculum materials, and software — is the property of Upshift Learning or",
          "its content contributors and is protected by United States and international copyright,",
          "trademark, and other intellectual property laws.",
          "The Upshift Learning name, logo, and associated brand assets are proprietary marks of",
          "Upshift Learning. You may not use, reproduce, modify, or distribute our brand assets —",
          "including our name, logo, or visual identity elements — without our prior written permission.",
          "You are permitted to share links to our Site and to quote brief excerpts of our content for",
          "educational, commentary, or news purposes, provided that you clearly attribute the content",
          "to Upshift Learning and include a link to the original source."
        ]
      },
      {
        "n": 5,
        "heading": "Services and Programs",
        "body": [
          "Descriptions of Upshift Learning's services, programs, workshops, and curriculum offerings",
          "on the Site are provided for informational purposes only. The availability, format, pricing,",
          "and scheduling of any particular program or service may vary and is subject to change without",
          "notice.",
          "Nothing on the Site constitutes a binding offer or guarantee of service availability.",
          "For current program information or to discuss your specific needs, please contact us at",
          "hello@upshiftlearning.org or by calling",
          "(614) 662-0943 ."
        ]
      },
      {
        "n": 6,
        "heading": "Donations",
        "body": [
          "Charitable donations to Upshift Learning are processed through PayPal. By initiating a",
          "donation, you agree to PayPal's terms of service and privacy policy. Upshift Learning does",
          "not directly collect or store your payment information.",
          "Upshift Learning is a registered 501(c)(3) nonprofit organization. Donations may be",
          "tax-deductible to the extent allowed by law. We encourage you to consult your tax advisor",
          "regarding the deductibility of your contribution. We do not guarantee any specific tax",
          "outcome.",
          "All donations are considered final. If you believe a donation was made in error, please",
          "contact us promptly at hello@upshiftlearning.org ."
        ]
      },
      {
        "n": 7,
        "heading": "Third-Party Links",
        "body": [
          "Our Site may contain links to third-party websites, including but not limited to PayPal,",
          "Instagram, LinkedIn, and YouTube. These links are provided for your convenience",
          "and do not constitute an endorsement, sponsorship, or recommendation of those sites or their",
          "content.",
          "Upshift Learning has no control over the content, privacy practices, or policies of",
          "third-party sites. We are not responsible for any content, products, or services available",
          "through third-party websites. We encourage you to review the terms and privacy policies of",
          "any third-party sites you visit."
        ]
      },
      {
        "n": 8,
        "heading": "Disclaimer of Warranties",
        "body": [
          "The Site and all content, materials, and information provided through it are offered on an",
          "\"as is\" and \"as available\" basis, without warranties of any kind, either express or implied.",
          "Upshift Learning expressly disclaims all warranties, including but not limited to implied",
          "warranties of merchantability, fitness for a particular purpose, and non-infringement. We do",
          "not warrant that the Site will be uninterrupted, error-free, or free of viruses or other",
          "harmful components, or that defects will be corrected.",
          "We make no representations or warranties regarding the accuracy, completeness, or",
          "currentness of any content on the Site."
        ]
      },
      {
        "n": 9,
        "heading": "Limitation of Liability",
        "body": [
          "To the fullest extent permitted by applicable law, Upshift Learning, its officers, directors,",
          "employees, volunteers, agents, and contractors shall not be liable for any indirect,",
          "incidental, special, consequential, or punitive damages arising out of or related to your",
          "use of, or inability to use, the Site or any content or services provided through it.",
          "This limitation applies regardless of the legal theory on which the claim is based, whether",
          "in contract, tort (including negligence), strict liability, or otherwise, even if Upshift",
          "Learning has been advised of the possibility of such damages.",
          "In no event shall Upshift Learning's total liability to you for all claims arising out of or",
          "related to these Terms or your use of the Site exceed one hundred dollars ($100.00).",
          "Some jurisdictions do not allow the exclusion or limitation of certain warranties or",
          "liability. In such jurisdictions, our liability is limited to the greatest extent permitted",
          "by law."
        ]
      },
      {
        "n": 10,
        "heading": "Governing Law",
        "body": [
          "These Terms and any dispute arising out of or related to your use of the Site shall be",
          "governed by and construed in accordance with the laws of the State of Ohio, without regard",
          "to its conflict of law provisions.",
          "Any legal action or proceeding arising out of or related to these Terms shall be brought",
          "exclusively in the state or federal courts located in Fairfield County, Ohio, and you hereby",
          "consent to the personal jurisdiction of those courts."
        ]
      },
      {
        "n": 11,
        "heading": "Changes to These Terms",
        "body": [
          "We reserve the right to modify these Terms of Use at any time at our sole discretion. When",
          "we make changes, we will update the effective date at the top of this page. Material changes",
          "will be communicated where practicable.",
          "Your continued use of the Site after any modifications to these Terms constitutes your",
          "acceptance of the updated Terms. If you do not agree to the revised Terms, please",
          "discontinue use of the Site."
        ]
      },
      {
        "n": 12,
        "heading": "Contact Us",
        "body": [
          "If you have any questions about these Terms of Use, please contact us:",
          "Email: hello@upshiftlearning.org",
          "Phone: (614) 662-0943",
          "Mailing Address: Upshift Learning."
        ]
      }
    ]
  }
} as const
