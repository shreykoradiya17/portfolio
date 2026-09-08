"use client";

import { useEffect } from "react";

/**
 * Background audio that plays continuously across the site.
 *
 * On scroll (wheel), we programmatically call `.click()` on a hidden button.
 * `HTMLElement.click()` fires a trusted click event which browsers accept
 * as user activation — unlike `dispatchEvent(new MouseEvent(...))`.
 * The click handler then calls `audio.play()`.
 */
export default function BackgroundAudio() {
  useEffect(() => {
    const audio = new Audio("/audio/mondamusic-calm-background-music-597263.mp3");
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.3;

    let started = false;

    // Hidden button that acts as the user-activation bridge
    const btn = document.createElement("button");
    btn.setAttribute("aria-hidden", "true");
    btn.style.cssText =
      "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;z-index:-1;";
    document.body.appendChild(btn);

    const playAudio = () => {
      if (started) return;
      audio
        .play()
        .then(() => {
          console.log("[BackgroundAudio] ✅ Playing!");
          started = true;
          cleanup();
        })
        .catch((err) => {
          console.warn("[BackgroundAudio] ❌ Play failed:", err.message);
        });
    };

    // When the hidden button is clicked (programmatically), try to play
    btn.addEventListener("click", playAudio);

    // On wheel scroll → trigger the hidden button's .click()
    const onWheel = () => {
      if (started) return;
      console.log("[BackgroundAudio] Wheel detected, triggering .click()");
      btn.click();
    };

    // Also listen for real user-activation events as fallback
    const onRealGesture = () => {
      if (started) return;
      playAudio();
    };

    document.addEventListener("wheel", onWheel, { capture: true, passive: true });
    document.addEventListener("pointerdown", onRealGesture, { capture: true });
    document.addEventListener("keydown", onRealGesture, { capture: true });
    document.addEventListener("touchstart", onRealGesture, { capture: true, passive: true });

    const cleanup = () => {
      document.removeEventListener("wheel", onWheel, { capture: true });
      document.removeEventListener("pointerdown", onRealGesture, { capture: true });
      document.removeEventListener("keydown", onRealGesture, { capture: true });
      document.removeEventListener("touchstart", onRealGesture, { capture: true });
      btn.removeEventListener("click", playAudio);
      btn.remove();
    };

    // Try autoplay immediately
    audio.play().then(() => {
      console.log("[BackgroundAudio] ✅ Autoplay succeeded!");
      started = true;
      cleanup();
    }).catch(() => {
      console.log("[BackgroundAudio] Autoplay blocked, waiting for scroll/interaction...");
    });

    return () => {
      cleanup();
      audio.pause();
      audio.src = "";
    };
  }, []);

  return null;
}
