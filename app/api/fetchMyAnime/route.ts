import { NextRequest, NextResponse } from "next/server";
import anime from "./anime_data.json" with { type: "json" };
import type { newPost } from "@/types/newPost";

export const dynamic = "force-static";

export async function GET(req: NextRequest) {
    
    const page = Number(req.nextUrl.searchParams.get("page") ?? 1);
    const res = (anime as newPost[]).slice((page - 1) * 25, page * 25);
    const maxPage = Math.ceil((anime as newPost[]).length / 25);
    return NextResponse.json({
        data: res,
        maxPage: maxPage,
    });
}