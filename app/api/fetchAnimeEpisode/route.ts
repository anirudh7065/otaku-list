import { NextResponse, NextRequest } from "next/server";
import type { Episode } from "@/types/newPost";
import { withApiProtectionLogger } from "@/lib/withApiProtectionLogger";
import { upstreamFetch } from "@/lib/upstream";

export const revalidate = 3600;

export const GET = withApiProtectionLogger(async (req: NextRequest) => {
  const baseUrl = process.env.BASE_URL;
  const id = req.nextUrl.searchParams.get("id") ?? 1;

  let page = Number(req.nextUrl.searchParams.get("page") ?? 1);
  if (
    !page ||
    Number.isNaN(page) ||
    page < 1 ||
    page > Number.MAX_SAFE_INTEGER ||
    !Number.isFinite(page)
  )
    page = 1;
  page = Math.floor(page);
  const apiUrl = `${baseUrl}/anime/${id}/episodes?page=${page}`;

  try {
    let response = await upstreamFetch(apiUrl, { revalidate: 3600 });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Jikan API Response Error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch anime data" },
        { status: response.status },
      );
    }

    let data = await response.json();
    if (page > data.pagination.last_visible_page) {
      page = data.pagination.last_visible_page;
      response = await upstreamFetch(
        `${baseUrl}/anime/${id}/episodes?page=${page}`,
        { revalidate: 3600 },
      );

      data = await response.json();
    }

    return NextResponse.json({
      data: data.data as Episode[],
      maxPage: data.pagination.last_visible_page,
      page: page,
    });
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
