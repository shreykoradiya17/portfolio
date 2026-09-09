"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";

/** Live local time in Shrey's timezone. Renders nothing until mounted so the
 *  server and client never disagree. */
export default function LocalTime({ withSeconds = true }: { withSeconds?: boolean }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: site.timezone,
      hour: "2-digit",
      minute: "2-digit",
      ...(withSeconds ? { second: "2-digit" as const } : {}),
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [withSeconds]);

  return (
    <span className="tnum" suppressHydrationWarning>
      {time ?? "--:--"} IST
    </span>
  );
}
