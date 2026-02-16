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
  const baseUrl = process.env.BASE_URL;
  const id = req.nextUrl.searchParams.get("id") ?? 1;
  const apiUrl = `${baseUrl}/anime/${id}`;

  try {
    const response = await fetch(apiUrl, { next: { revalidate: 3600 } });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch anime data" },
        { status: response.status },
      );
    }

    const data: { data: newPost[] } =
      await response.json();
    return NextResponse.json({
      data:[ data.data],
    });
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
