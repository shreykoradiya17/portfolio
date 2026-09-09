"use client";

/**
 * The link into a project.
 *
 * A real anchor with a real href — middle-click, keyboard, and crawlers all
 * behave normally. JS only enhances it, capturing the rect of the visual you
 * clicked so the transition can expand from exactly there.
 */

import { type ReactNode, type RefObject } from "react";
import { useTransition } from "@/lib/transition";
import type { Project } from "@/data/projects";

export default function ProjectLink({
  project,
  mediaRef,
  children,
  className = "",
  label = "View project",
  ...rest
}: {
  project: Pick<Project, "slug" | "index" | "name" | "category">;
  mediaRef?: RefObject<HTMLElement | null>;
  children: ReactNode;
  className?: string;
  label?: string;
  "aria-label"?: string;
}) {
  const { go } = useTransition();
  const href = `/work/${project.slug}`;

  return (
    <a
      href={href}
      className={className}
      data-cursor="view"
      data-cursor-label={label}
      onClick={(e) => {
        // Let the browser handle modified clicks — new tab must stay new tab.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        go(
          href,
          { index: project.index, name: project.name, category: project.category },
          mediaRef?.current?.getBoundingClientRect() ?? null
        );
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
