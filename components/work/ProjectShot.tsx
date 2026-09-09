"use client";

/**
 * Renders a project's capture in the frame that matches its medium: a browser
 * window for the web work, a phone for the app. One entry point so a spread
 * never has to know which frame it is dealing with.
 */

import BrowserFrame from "@/components/work/BrowserFrame";
import PhoneFrame from "@/components/work/PhoneFrame";
import type { Shot } from "@/data/projects";

export default function ProjectShot({
  shot,
  label,
  height,
  sizes,
  className = "",
}: {
  shot?: Shot;
  /** Accessible fallback description while the file is absent. */
  label?: string;
  height?: string;
  sizes?: string;
  className?: string;
}) {
  if (shot?.frame === "phone") {
    return (
      <PhoneFrame
        shot={shot}
        label={label}
        height={height}
        {...(sizes ? { sizes } : {})}
        className={className}
      />
    );
  }
  return (
    <BrowserFrame
      shot={shot}
      label={label}
      ratio={shot?.ratio}
      spec={shot?.spec}
      height={height}
      {...(sizes ? { sizes } : {})}
      className={className}
    />
  );
}
