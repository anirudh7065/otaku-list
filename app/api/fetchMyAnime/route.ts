import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import type { newPost } from "@/types/newPost";
import { withApiProtectionLogger } from "@/lib/withApiProtectionLogger";
async function readJSON(path: string, fallback = []) {
  try {
    const data = await readFile(path, "utf8");
    if (!data.trim()) return fallback;
    return JSON.parse(data);
  } catch {
    return fallback;
  }
}
export const GET = withApiProtectionLogger(async (req: NextRequest) => {
  const anime = await readJSON("./anime_data.json");
  try {
    const maxPage = Math.ceil((anime as newPost[]).length / 25);
    const page =
      Number(req.nextUrl.searchParams.get("page") ?? 1) > maxPage
        ? maxPage
        : Number(req.nextUrl.searchParams.get("page") ?? 1);
    const res = (anime as newPost[]).slice((page - 1) * 25, page * 25);
    return NextResponse.json({
      data: res,
      maxPage: maxPage,
      page: page,
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
});
