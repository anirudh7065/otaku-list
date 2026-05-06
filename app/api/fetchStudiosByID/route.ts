import { NextResponse, NextRequest } from "next/server";
import { withApiProtectionLogger } from "@/lib/withApiProtectionLogger";

export const revalidate = 36000;

export const GET = withApiProtectionLogger(async (req: NextRequest) => {
  const baseUrl = process.env.BASE_URL;
  const id = Number(req.nextUrl.searchParams.get("id") ?? 1);
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
  const apiUrl = `${baseUrl}/anime?producer=${id}&page=${page}&order_by=members&sort=desc`;
  try {
    let response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "OtakuList/1.0",
        Accept: "application/json",
      },
      next: { revalidate: 36000 },
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Studios" },
        { status: response.status },
      );
    }
    let data = await response.json();
    if (page > data.pagination.last_visible_page) {
      page = data.pagination.last_visible_page;
      response = await fetch(
        `${baseUrl}/anime?producer=${id}&page=${page}&order_by=members&sort=desc`,
        {
          headers: {
            "User-Agent": "OtakuList/1.0",
            Accept: "application/json",
          },
          next: { revalidate: 36000 },
        },
      );

      data = await response.json();
    }

    if (data.data.length === 0) {
      return NextResponse.json({ message: "No Studio found" }, { status: 404 });
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
