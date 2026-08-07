import { describe, it, expect } from "vitest";
import { hasAllAccess, hasActiveComp } from "@/lib/auth";

const future = () => new Date(Date.now() + 86_400_000).toISOString();
const past = () => new Date(Date.now() - 86_400_000).toISOString();

describe("hasActiveComp", () => {
  it("is false when there is no comp", () => {
    expect(hasActiveComp(null)).toBe(false);
    expect(hasActiveComp({})).toBe(false);
    expect(hasActiveComp({ comped_until: null })).toBe(false);
  });

  it("is true only while the comp is still running", () => {
    expect(hasActiveComp({ comped_until: future() })).toBe(true);
    expect(hasActiveComp({ comped_until: past() })).toBe(false);
  });

  it("treats an unparseable date as no comp rather than a live one", () => {
    expect(hasActiveComp({ comped_until: "not a date" })).toBe(false);
  });

  it("accepts a Date as well as a string", () => {
    expect(hasActiveComp({ comped_until: new Date(Date.now() + 60_000) })).toBe(true);
  });
});

describe("hasAllAccess", () => {
  it("denies anyone without a subscription row", () => {
    expect(hasAllAccess(null)).toBe(false);
    expect(hasAllAccess(undefined)).toBe(false);
  });

  it("grants paid tiers and denies free", () => {
    expect(hasAllAccess({ tier: "pro", status: "active" })).toBe(true);
    expect(hasAllAccess({ tier: "school", status: "active" })).toBe(true);
    expect(hasAllAccess({ tier: "free", status: "active" })).toBe(false);
  });

  it("denies a paid tier once the subscription has lapsed", () => {
    expect(hasAllAccess({ tier: "pro", status: "canceled" })).toBe(false);
    expect(hasAllAccess({ tier: "pro", status: "expired" })).toBe(false);
  });

  it("grants access on a live comp alone", () => {
    expect(hasAllAccess({ tier: "free", status: "active", comped_until: future() })).toBe(true);
  });

  it("denies once the comp has run out", () => {
    expect(hasAllAccess({ tier: "free", status: "active", comped_until: past() })).toBe(false);
  });

  it("keeps a comp alive even when Stripe has written the subscription off", () => {
    // The case the separate column exists for: a cancellation webhook sets tier
    // to free and status to canceled, and the hand-granted access survives it.
    expect(hasAllAccess({ tier: "free", status: "canceled", comped_until: future() })).toBe(true);
  });
});
