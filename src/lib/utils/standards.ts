/**
 * Standard codes are dotted and contain no spaces, which is what separates them
 * from a plain-language search. This deliberately covers every shape used across
 * subjects — RL.2.1, L.5.4, 2.NBT.B.5, 3.MD.A.1, 5.LS1.A, K.PS2.A, 3.5.C — rather
 * than only the two-letter ELA form.
 */
const STANDARD_CODE_PATTERN = /^[A-Za-z0-9]+(?:\.[A-Za-z0-9]+)+$/

export function isStandardCode(value: string): boolean {
  return STANDARD_CODE_PATTERN.test(value.trim())
}

/** Link to the standard detail page (blueprint, unpack, resources, generate). */
export function standardHref(code: string): string {
  return `/match/${encodeURIComponent(code.trim().toUpperCase())}`
}
