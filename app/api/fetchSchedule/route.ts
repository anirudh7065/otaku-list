import { NextResponse, NextRequest } from "next/server";
import type { newPost } from "@/types/newPost";
import { withApiProtectionLogger } from "@/lib/withApiProtectionLogger";

export const revalidate = 3600;

export const GET = withApiProtectionLogger(async (req: NextRequest) => {
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
    } else
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 },
      );
  }
});
