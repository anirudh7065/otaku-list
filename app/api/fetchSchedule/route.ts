import { NextResponse, NextRequest } from "next/server";
import type { newPost } from "@/types/newPost";

export const revalidate = 3600;

const RATE_LIMIT = 30;
const WINDOW = 60 * 1000; // 1 minute

const ipStore = new Map<string, { count: number; reset: number }>();

function rateLimit(ip: string) {
  const now = Date.now();
  const entry = ipStore.get(ip);

  if (!entry || now > entry.reset) {
    ipStore.set(ip, { count: 1, reset: now + WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  return true;
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown-ip";

  if (!rateLimit(ip)) {
    return NextResponse.json({ message: "Too many requests" }, { status: 429 });
  }
  const days = [
    "sundays",
    "mondays",
    "tuesdays",
    "wednesdays",
    "thursdays",
    "fridays",
    "saturdays",
  ];
  function jpnToIndIndex(day: string, time24: string) {
    let [h, m] = time24.split(":").map(Number);

    // subtract 3h 30m
    m -= 30;
    if (m < 0) {
      m += 60;
      h -= 1;
    }

    h -= 3;

    let dayIndex = days.indexOf(day);

    if (h < 0) {
      h += 24;
      dayIndex = (dayIndex - 1 + 7) % 7;
    }

    return dayIndex;
  }
  let page = 1;
  let hasNext = true;
  const all: newPost[] = [];

  try {
    while (hasNext) {
      const res = await fetch(
        `https://api.jikan.moe/v4/seasons/now?page=${page}&sfw=true`,
        { next: { revalidate: 600 } },
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Jikan error ${res.status}: ${text}`);
      }

      const json = await res.json();

      if (!json?.data || !Array.isArray(json.data)) {
        throw new Error("Invalid Jikan response structure");
      }

      all.push(...json.data);

      hasNext = json.pagination?.has_next_page ?? false;
      page++;

      // Jikan rate limit protection
      await new Promise((r) => setTimeout(r, 400));
    }

    // group by day
    const byDay: Record<number, newPost[]> = {};

    for (const anime of all) {
      const day = anime.broadcast?.day?.toLowerCase() || null;
      if (day === null) continue;
      if (!byDay[jpnToIndIndex(day, anime.broadcast?.time || "00:00")])
        byDay[jpnToIndIndex(day, anime.broadcast?.time || "00:00")] = [];
      byDay[jpnToIndIndex(day, anime.broadcast?.time || "00:00") || 0].push(
        anime,
      );
    }

    return NextResponse.json(byDay);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message:
            error.message === "fetch failed"
              ? "Internal Server Error"
              : error.message,
        },
        { status: 500 },
      );
    } else
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 },
      );
  }
}
