import { NextResponse, NextRequest } from "next/server";

export const revalidate = 3600;

export async function GET(req: NextRequest) {
  const baseUrl = process.env.BASE_URL;
  const page = Number(req.nextUrl.searchParams.get("page") ?? 1);
  const apiUrl = `${baseUrl}/top/anime?page=${page}`;

  try {
    const response = await fetch(apiUrl, { next: { revalidate: 3600 } });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Kitsu API Response Error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch anime data" },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json({
      data: data.data,
      maxPage: data.pagination.last_visible_page,
    });
  } catch (error) {
    console.error("Error fetching anime:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
