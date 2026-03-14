import { NextRequest, NextResponse } from "next/server";
import type { newPost } from "@/types/newPost";
import { withApiProtectionLogger } from "@/lib/withApiProtectionLogger";
import anime from "./anime_data.json";

export const revalidate = 3600000;

export const GET = withApiProtectionLogger(async (req: NextRequest) => {
  try {
    const type = req.nextUrl.searchParams.get("type");
    const newAnime =
      type === "all"
        ? anime
        : type === "series"
          ? (anime as newPost[]).filter((ani) => ani.type === "TV")
          : type === "movie"
            ? (anime as newPost[]).filter((ani) => ani.type === "Movie")
            : type === "ona"
              ? (anime as newPost[]).filter((ani) => ani.type === "ONA")
              : type === "ova"
                ? (anime as newPost[]).filter((ani) => ani.type === "OVA")
                : type === "special"
                  ? (anime as newPost[]).filter(
                      (ani) => ani.type === "TV Special",
                    )
                  : (anime as newPost[]);
    const maxPage = Math.ceil((newAnime as newPost[]).length / 25);
    const page =
      Number(req.nextUrl.searchParams.get("page") ?? 1) > maxPage
        ? maxPage
        : Number(req.nextUrl.searchParams.get("page") ?? 1);
    const res = (newAnime as newPost[]).slice((page - 1) * 25, page * 25);
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
