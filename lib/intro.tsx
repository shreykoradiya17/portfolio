"use client";

/**
 * Coordinates the opening sequence. The registration panel holds while fonts
 * actually load — a real wait, not a fake progress bar — then hands off to the
 * hero, which starts its entrance the moment `introDone` flips.
 *
 * Persisted in `sessionStorage` so it plays once per browser session and never
 * replays when returning to the home page from subpages or on route changes.
 */

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

const Ctx = createContext<{ introDone: boolean; finish: () => void }>({
  introDone: true,
  finish: () => {},
});

export function IntroProvider({ children }: { children: ReactNode }) {
  const [introDone, setDone] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("portfolio_intro_done") === "true") {
      setDone(true);
      document.documentElement.dataset.intro = "done";
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.intro = introDone ? "done" : "pending";
  }, [introDone]);

  const finish = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("portfolio_intro_done", "true");
      } catch {}
    }
    setDone(true);
  }, []);

  return (
    <Ctx.Provider value={{ introDone, finish }}>{children}</Ctx.Provider>
  );
}

export const useIntro = () => useContext(Ctx);
