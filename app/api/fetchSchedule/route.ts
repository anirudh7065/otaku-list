import { NextResponse, NextRequest } from "next/server";
import type { newPost } from "@/types/newPost";
import { withApiProtectionLogger } from "@/lib/withApiProtectionLogger";

export const revalidate = 36000;

// 🔥 move static data outside
const days = [
  "sundays",
  "mondays",
  "tuesdays",
  "wednesdays",
  "thursdays",
  "fridays",
  "saturdays",
];

// faster lookup instead of indexOf
const dayMap: Record<string, number> = {
  sundays: 0,
  mondays: 1,
  tuesdays: 2,
  wednesdays: 3,
  thursdays: 4,
  fridays: 5,
  saturdays: 6,
};

// 🔥 in-memory cache
let cache: Record<number, newPost[]> | null = null;
let lastFetch = 0;
const CACHE_TIME = 30 * 60 * 1000; // 30 min

// 🔥 optimized time conversion
function jpnToIndIndex(day: string, time24: string) {
  let h = (time24.charCodeAt(0) - 48) * 10 + (time24.charCodeAt(1) - 48);
  let m = (time24.charCodeAt(3) - 48) * 10 + (time24.charCodeAt(4) - 48);

  m -= 30;
  if (m < 0) {
    m += 60;
    h -= 1;
  }

  h -= 3;

  let dayIndex = dayMap[day];

  if (h < 0) {
    h += 24;
    dayIndex = (dayIndex + 6) % 7;
  }

  return dayIndex;
}

// 🔥 reusable fetch
const fetchPage = async (page: number) => {
  const res = await fetch(
    `https://api.jikan.moe/v4/schedules?page=${page}&sfw=true&kids=false`,
    { next: { revalidate: 36000 } },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Jikan error ${res.status}: ${text}`);
  }

  return res.json();
};

export const GET = withApiProtectionLogger(async (req: NextRequest) => {
  try {
    // ✅ return cached result if valid
    if (cache && Date.now() - lastFetch < CACHE_TIME) {
      return NextResponse.json(cache);
    }

    // 🔥 Step 1: first page
    const first = await fetchPage(1);
    const totalPages = first.pagination?.last_visible_page || 1;

    const pages = [first];

    // 🔥 Step 2: parallel batch fetching
    const BATCH_SIZE = 3;

    for (let i = 2; i <= totalPages; i += BATCH_SIZE) {
      const batch = [];

      for (let j = i; j < i + BATCH_SIZE && j <= totalPages; j++) {
        batch.push(fetchPage(j));
      }

      const results = await Promise.all(batch);
      pages.push(...results);

      // small delay to respect rate limit
      await new Promise((r) => setTimeout(r, 300));
    }

    // 🔥 flatten all data
    const all: newPost[] = pages.flatMap((p) => p.data || []);

    // 🔥 group by day
    const byDay: Record<number, newPost[]> = {};

    for (const anime of all) {
      const day = anime.broadcast?.day?.toLowerCase();
      if (!day || anime.airing === false) continue;

      const index = jpnToIndIndex(day, anime.broadcast?.time || "00:00");

      if (!byDay[index]) byDay[index] = [];
      byDay[index].push(anime);
    }

    // ✅ save cache
    cache = byDay;
    lastFetch = Date.now();

    return NextResponse.json(byDay);
  } catch (error) {
    console.error(error);

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
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
});
