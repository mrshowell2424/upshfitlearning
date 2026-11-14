/**
 * The one place the brand suffix is spelled.
 *
 * Next appends a parent layout's `title.template` to a child's title -- but
 * only while every layout in between leaves the template alone. A layout
 * that sets `title` to a plain string resolves the title for its whole
 * subtree and takes the template with it, which is how /match/RL.4.6,
 * /lounge/[slug] and /resources/[id] briefly rendered their real names with
 * no brand on the end while their parents kept theirs.
 *
 * So any layout that both names itself and has children re-declares the
 * template, and takes it from here rather than retyping it -- the previous
 * round of this had nine pages spelling the suffix by hand, two of them with
 * the wrong dash.
 */
export const TITLE_TEMPLATE = "%s · Upshift Learning";
