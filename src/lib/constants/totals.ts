/**
 * Headline numbers, in one place.
 *
 * These were previously written out in prose on the pricing page and as a
 * local constant on the matcher, which is how the pricing page came to
 * advertise "2,688+ resources" while the matcher counted 2,760. A number a
 * teacher is asked to pay against should not drift.
 *
 * Deliberately constants rather than live queries: the pricing page must
 * render even when the database is unreachable, and "0 standards" would be a
 * worse failure than a slightly stale count. Update them when the underlying
 * content changes — `bun run scripts/seed-standards-*.ts` reports the totals,
 * and /api/health shows both counts on demand.
 */

/** Resources in the library, from the Google Sheet. */
export const RESOURCE_TOTAL = 2786

/** Standards carrying a full unpack and lesson blueprint. */
export const STANDARD_TOTAL = 245
