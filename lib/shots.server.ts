import fs from "node:fs";
import path from "node:path";
import { projects, type Project } from "@/data/projects";

/**
 * Server only. Marks any capture that is not on disk as `missing`, so its frame
 * renders a labelled slot while keeping its kind, label, caption and ratio.
 *
 * A client-side `onError` fallback is not reliable here: the browser starts
 * loading the image while parsing the SSR markup and can fail it before React
 * has hydrated and attached the handler, leaving a broken <img> and a 400 in
 * the console instead of the slot.
 *
 * These pages are static, so this resolves once at build time and costs
 * nothing at runtime.
 */
export function resolveShots(project: Project): Project {
  if (!project.shots?.length) return project;
  return {
    ...project,
    shots: project.shots.map((shot) => {
      const file = path.join(process.cwd(), "public", shot.src);
      try {
        if (fs.statSync(file).isFile()) return shot;
      } catch {
        /* any stat failure counts as missing */
      }
      return { ...shot, missing: true };
    }),
  };
}

export function resolveProjects(): Project[] {
  return projects.map(resolveShots);
}
