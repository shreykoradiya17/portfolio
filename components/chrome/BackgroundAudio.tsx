"use client";

import { useEffect } from "react";

/**
 * Background audio that plays continuously across the site.
 *
 * Browser autoplay policy requires a real user gesture (click/tap/keypress)
 * to start audio. Scroll and mousemove do NOT count.
 *
 * This component listens on the document in the capture phase so the very
 * first click/tap anywhere on the page silently starts the music — the
 * click still reaches its intended target normally.
 */
export default function BackgroundAudio() {
  useEffect(() => {
    const audio = new Audio("/audio/mondamusic-calm-background-music-597263.mp3");
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.3;

    let started = false;

    const startAudio = () => {
      if (started) return;
      audio
        .play()
        .then(() => {
          started = true;
          removeAll();
        })
        .catch(() => {});
    };

    // Real user-activation events only — these are the ONLY events
    // browsers accept to unlock audio playback
    const EVENTS = ["pointerdown", "touchstart", "keydown"];

    const removeAll = () => {
      EVENTS.forEach((e) =>
        document.removeEventListener(e, startAudio, true)
      );
    };

    // Capture phase so it fires before anything else, and we do NOT
    // stopPropagation — the user's click/tap works as normal
    EVENTS.forEach((e) =>
      document.addEventListener(e, startAudio, { capture: true, passive: true })
    );

    return () => {
      removeAll();
      audio.pause();
      audio.src = "";
    };
  }, []);

  return null;
}
