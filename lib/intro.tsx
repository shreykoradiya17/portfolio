"use client";

/**
 * Coordinates the opening sequence. The registration panel holds while fonts
 * actually load — a real wait, not a fake progress bar — then hands off to the
 * hero, which starts its entrance the moment `introDone` flips.
 *
 * The layout persists across client navigation in the App Router, so this runs
 * once per full page load and never replays on a route change.
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const Ctx = createContext<{ introDone: boolean; finish: () => void }>({
  introDone: true,
  finish: () => {},
});

export function IntroProvider({ children }: { children: ReactNode }) {
  const [introDone, setDone] = useState(false);

  // Mirrored onto <html> so chrome that has no reason to subscribe to this
  // context can still transition in on the same beat, via CSS alone.
  useEffect(() => {
    document.documentElement.dataset.intro = introDone ? "done" : "pending";
  }, [introDone]);

  return (
    <Ctx.Provider value={{ introDone, finish: () => setDone(true) }}>{children}</Ctx.Provider>
  );
}

export const useIntro = () => useContext(Ctx);
