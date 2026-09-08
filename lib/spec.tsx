"use client";

/**
 * SPEC MODE — the site's signature interaction.
 *
 * The whole design system is built as two layers: BUILT (what shipped) and
 * DRAWN (how it was specified). Spec mode surfaces the drawn layer over the
 * live page: column rules, section coordinates, spacing dimensions and
 * component names, in blueprint ink.
 *
 * State lives on `documentElement` so CSS does nearly all the work and React
 * re-renders stay cheap. It persists across route changes within a session,
 * because inspecting one page and then navigating should not silently reset it.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const KEY = "sp:spec";

interface SpecApi {
  spec: boolean;
  toggle: () => void;
  set: (v: boolean) => void;
}

const SpecCtx = createContext<SpecApi>({ spec: false, toggle: () => {}, set: () => {} });

export function SpecProvider({ children }: { children: ReactNode }) {
  const [spec, setSpec] = useState(false);

  // Restore within-session state before first paint of the drawn layer.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY) === "1") setSpec(true);
    } catch {
      /* private mode — spec simply starts off */
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.spec = spec ? "on" : "off";
    try {
      sessionStorage.setItem(KEY, spec ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [spec]);

  const toggle = useCallback(() => setSpec((v) => !v), []);

  // Keyboard: S toggles. Ignored while typing so it never hijacks a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t) {
        const tag = t.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || t.isContentEditable) return;
      }
      if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape") setSpec(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return <SpecCtx.Provider value={{ spec, toggle, set: setSpec }}>{children}</SpecCtx.Provider>;
}

export const useSpec = () => useContext(SpecCtx);
