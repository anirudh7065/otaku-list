"use client";
import { useEffect, useState } from "react";

type Converter = (
  day: string,
  time24: string,
  time: true,
) => { day: number; hour: number; minute: number };

function format(diff: number) {
  const totalSeconds = Math.floor(diff / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${days}d ${hours}h ${minutes}m ${seconds}s left`;
}

export default function useCountdown(
  fn: Converter | null,
  day: string | null,
  time24: string | null,
) {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!fn || !day || !time24) return;

    const tick = () => {
      const { day: targetDay, hour, minute } = fn(day, time24, true);

      const now = new Date();
      const currentDay = now.getDay();
      const daysUntil = (targetDay - currentDay + 7) % 7;

      const next = new Date(now);
      next.setDate(now.getDate() + daysUntil);
      next.setHours(hour, minute, 0, 0);

      if (daysUntil === 0 && now > next) {
        next.setDate(next.getDate() + 7);
      }

      const diff = next.getTime() - now.getTime();
      setCountdown(format(diff));
    };

    tick(); // run immediately
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [fn, day, time24]);

  return countdown;
}
