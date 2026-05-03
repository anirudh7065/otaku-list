import { NextResponse, NextRequest } from "next/server";
import { withApiProtectionLogger } from "@/lib/withApiProtectionLogger";

export const revalidate = 36000;

export const GET = withApiProtectionLogger(async (req: NextRequest) => {
  const baseUrl = process.env.BASE_URL;
  const year = Number(req.nextUrl.searchParams.get("year") ?? 2026);
  const season = String(req.nextUrl.searchParams.get("season") ?? "winter");
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

  if (!year || !season || !page) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }
  if (
    season !== "winter" &&
    season !== "spring" &&
    season !== "summer" &&
    season !== "fall"
  ) {
    return NextResponse.json(
      { error: "Invalid season parameter" },
      { status: 400 },
    );
  }
  let apiUrl = `${baseUrl}/seasons/${year}/${season}?page=${page}&sfw=true&order_by=members&sort=desc`;

  try {
    let response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "OtakuList/1.0",
        Accept: "application/json",
      },
      next: { revalidate: 36000 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Kitsu API Response Error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch anime data" },
        { status: response.status },
      );
    }

    let data = await response.json();
    if (page > data.pagination.last_visible_page) {
      page = data.pagination.last_visible_page;
      apiUrl = `${baseUrl}/seasons/${year}/${season}?page=${page}&sfw=true&order_by=members&sort=desc`;
      response = await fetch(apiUrl, {
        headers: {
          "User-Agent": "OtakuList/1.0",
          Accept: "application/json",
        },
        next: { revalidate: 36000 },
      });

      data = await response.json();
    }

    return NextResponse.json({
      data: data.data,
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
