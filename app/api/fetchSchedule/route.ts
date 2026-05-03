import { NextResponse, NextRequest } from "next/server";
import type { newPost } from "@/types/newPost";
import { withApiProtectionLogger } from "@/lib/withApiProtectionLogger";

export const revalidate = 36000;

const dayMap: Record<string, number> = {
  sundays: 0,
  mondays: 1,
  tuesdays: 2,
  wednesdays: 3,
  thursdays: 4,
  fridays: 5,
  saturdays: 6,
};

let cache: Record<number, newPost[]> | null = null;
let lastFetch = 0;
const CACHE_TIME = 30 * 60 * 1000;

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

const fetchPage = async (page: number) => {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const res = await fetch(
    `${baseUrl}/schedules?page=${page}&sfw=true&kids=false`,
    {
      headers: {
        "User-Agent": "OtakuList/1.0",
        Accept: "application/json",
      },
      next: { revalidate: 36000 },
    },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Jikan error ${res.status}: ${text}`);
  }
  return res.json();
};

const fetchPageWithRetry = async (
  page: number,
  retries = 3,
  delayMs = 500,
): Promise<newPost>=> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await fetchPage(page);
      return result;
    } catch (err) {
      console.warn(`Page ${page} attempt ${attempt} failed:`, err);
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, delayMs * attempt));
      }
    }
  }
  throw new Error(`Page ${page} failed after ${retries} retries`);
};

export const GET = withApiProtectionLogger(async (req: NextRequest) => {
  try {
    if (cache && Date.now() - lastFetch < CACHE_TIME) {
      return NextResponse.json(cache);
    }

    const first = await fetchPage(1);
    const totalPages = first.pagination?.last_visible_page || 1;
    const pages = [first];

    const BATCH_SIZE = 3;
    let hadPermanentFailures = false;

    for (let i = 2; i <= totalPages; i += BATCH_SIZE) {
      const batch: Promise<newPost>[] = [];

      for (let j = i; j < i + BATCH_SIZE && j <= totalPages; j++) {
        batch.push(fetchPageWithRetry(j));
      }

      const results = await Promise.allSettled(batch);
      const failedPages: number[] = [];

      results.forEach((result, idx) => {
        const pageNum = i + idx;
        if (result.status === "fulfilled") {
          pages.push(result.value);
        } else {
          failedPages.push(pageNum);
          console.error(
            `Page ${pageNum} permanently failed after retries:`,
            result.reason,
          );
        }
      });

      if (failedPages.length > 0) {
        hadPermanentFailures = true;
        console.warn(`Permanent failures on pages: ${failedPages.join(", ")}`);

        if (cache) {
          console.warn("Returning stale cache instead of partial data");
          return NextResponse.json(cache);
        }
      }

      await new Promise((r) => setTimeout(r, 300));
    }

    const all: newPost[] = pages.flatMap((p) => p.data || []);
    const byDay: Record<number, newPost[]> = {};

    for (const anime of all) {
      const day = anime.broadcast?.day?.toLowerCase();
      if (!day || anime.airing === false) continue;

      const index = jpnToIndIndex(day, anime.broadcast?.time || "00:00");
      if (!byDay[index]) byDay[index] = [];
      byDay[index].push(anime);
    }

    if (!hadPermanentFailures) {
      cache = byDay;
      lastFetch = Date.now();
    } else {
      console.warn("Cache not updated due to permanent fetch failures");
    }

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
