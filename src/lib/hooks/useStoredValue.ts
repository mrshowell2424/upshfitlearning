"use client";

import { useSyncExternalStore } from "react";

/**
 * Read a value out of localStorage without an effect.
 *
 * Two pages and the auth provider each did the same thing: start with an
 * empty value, then read localStorage in a mount effect and call setState.
 * That renders the page once with nothing, runs the effect and renders it
 * again — so a teacher's marks, or their preview tier, arrive a frame after
 * the page does and the screen visibly corrects itself.
 *
 * The usual fix, a lazy useState initialiser, does not work here. The
 * initialiser runs during render, and render happens on the server too,
 * where there is no localStorage. Guarding it with typeof window swaps one
 * fault for a worse one: the server would render the empty value, the
 * client would render the stored one, and the two would not match.
 *
 * useSyncExternalStore is the primitive React provides for exactly this. It
 * takes a server snapshot and a client snapshot and knows they differ, so
 * the markup matches on both sides and the stored value arrives without an
 * extra render.
 *
 * Writes go through writeStoredValue so that a change in one component
 * reaches every other component reading the same key. localStorage fires a
 * storage event for other tabs but not for the tab that wrote, which is why
 * there is a listener registry here as well.
 */

type Listener = () => void;

const listeners = new Map<string, Set<Listener>>();

function notify(key: string) {
  for (const fn of listeners.get(key) ?? []) fn();
}

/**
 * Where values go when the browser will not store them.
 *
 * In a private window, or with site data blocked, localStorage throws on
 * every call. The code this replaced handled that by keeping the change in
 * React state anyway, so a teacher ticking lessons off still saw the ticks
 * for the rest of the session — they just did not survive a refresh. That
 * behaviour is worth keeping, so a failed write falls back to here and
 * every later read comes from here too.
 */
const memory = new Map<string, string | null>();
let storageBroken = false;

/** Every read is wrapped: a private window or blocked site data throws. */
function read(key: string): string | null {
  if (storageBroken) return memory.get(key) ?? null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    storageBroken = true;
    return memory.get(key) ?? null;
  }
}

function subscribe(key: string, onChange: Listener) {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  set.add(onChange);

  // Another tab writing the same key.
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === key) onChange();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    set!.delete(onChange);
    if (set!.size === 0) listeners.delete(key);
    window.removeEventListener("storage", onStorage);
  };
}

/**
 * The raw string under `key`, or null where there is nothing stored, the
 * browser refused, or this is running on the server.
 *
 * Returning the raw string rather than a parsed object is deliberate: the
 * snapshot has to be comparable with Object.is between renders, and a fresh
 * object every time would loop. Parse it in the caller, inside a useMemo
 * keyed on this string.
 */
export function useStoredValue(key: string): string | null {
  return useSyncExternalStore(
    (onChange) => subscribe(key, onChange),
    () => read(key),
    () => null,
  );
}

/** Write (or, with null, clear) a key and tell every reader of it. */
export function writeStoredValue(key: string, value: string | null) {
  memory.set(key, value);
  if (!storageBroken) {
    try {
      if (value === null) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, value);
    } catch {
      // Private window or blocked site data. The change holds for this
      // session out of `memory`; it will not survive a refresh.
      storageBroken = true;
    }
  }
  notify(key);
}
