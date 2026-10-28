"use client";

import { useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { MATERIALS_PASS_MAX_AGE } from "@/lib/auth/materials-pass";

/**
 * Trades the signed-in token for the cookie that opens materials.
 *
 * A material is opened by clicking a link, and a link navigation carries
 * cookies rather than an Authorization header — see lib/auth/materials-pass.ts
 * for why the cookie exists at all. Any page offering a link into
 * /api/materials has to do this trade first, or every one of its links returns
 * {"error":"Sign in required"} to a teacher who is, in fact, signed in.
 *
 * It lives in a component because that is a standing obligation of the link,
 * not of one page. It used to be an effect copied into /reading and
 * /design-thinking, which is exactly why /science-of-reading and /og-packs
 * shipped without it: a page that linked materials had no way to inherit the
 * step, and nothing failed until someone clicked.
 *
 * Renders nothing. Drop it beside the links.
 */
export function MaterialsPass() {
  const { session } = useAuth();
  const token = session?.access_token;

  useEffect(() => {
    if (!token) return;

    let live = true;
    const unlock = () => {
      if (!live) return;
      fetch("/api/materials/unlock", {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
      }).catch(() => {
        /* the links will 401 and a reload fixes it — nothing to say here */
      });
    };

    unlock();

    // The pass expires after an hour, which is shorter than a page left open
    // on a classroom desk. Refreshing well inside that window means a teacher
    // never clicks a link that has quietly gone stale, and coming back to the
    // tab re-unlocks immediately rather than waiting for the next interval.
    const refresh = setInterval(unlock, (MATERIALS_PASS_MAX_AGE * 1000) / 2);
    const onFocus = () => document.visibilityState === "visible" && unlock();
    document.addEventListener("visibilitychange", onFocus);

    return () => {
      live = false;
      clearInterval(refresh);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [token]);

  return null;
}
