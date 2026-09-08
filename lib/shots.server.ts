import fs from "node:fs";
import path from "node:path";
import { projects, type Project } from "@/data/projects";

/**
 * Server only. Drops `shot` for any project whose capture is not on disk.
 *
 * A client-side `onError` fallback is not reliable here: the browser starts
 * loading the image during SSR markup parsing and can fail it before React has
 * hydrated and attached the handler, leaving a broken <img> and a 400 in the
 * console rather than the frame's labelled slot.
 *
 * Resolving it on the server means the decision is made once at build time for
 * these static pages, costs nothing at runtime, and the markup that ships is
 * always honest about what exists.
 */
export function resolveShot(project: Project): Project {
  if (!project.shot) return project;
  const file = path.join(process.cwd(), "public", project.shot.src);
  try {
    if (fs.statSync(file).isFile()) return project;
  } catch {
    /* fall through — treat any stat failure as missing */
  }
  return { ...project, shot: { ...project.shot, missing: true } };
}

export function resolveProjects(): Project[] {
  return projects.map(resolveShot);
}
