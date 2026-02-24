import { NextRequest, NextResponse } from "next/server";
import anime from "./anime_data.json" with { type: "json" };
import type { newPost } from "@/types/newPost";


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
  try {

    const maxPage = Math.ceil((anime as newPost[]).length / 25);
    const page = Number(req.nextUrl.searchParams.get("page") ?? 1) > maxPage ? maxPage : Number(req.nextUrl.searchParams.get("page") ?? 1);
    const res = (anime as newPost[]).slice((page - 1) * 25, page * 25);
    return NextResponse.json({
      data: res,
      maxPage: maxPage,
      page: page
    });
  }catch(error){
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