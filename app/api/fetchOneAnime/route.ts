import { NextResponse, NextRequest } from "next/server";
import type { newPost } from "@/types/newPost";
import { withApiProtectionLogger } from "@/lib/withApiProtectionLogger";

export const revalidate = 3600;

export const GET = withApiProtectionLogger(async (req: NextRequest) => {
  const baseUrl = process.env.BASE_URL;
  const id = req.nextUrl.searchParams.get("id") ?? 1;
  const apiUrl = `${baseUrl}/anime/${id}/full`;

  try {
    const response = await fetch(apiUrl, { next: { revalidate: 3600 } });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch anime data" },
        { status: response.status },
      );
    }

    const data: { data: newPost[] } = await response.json();
    return NextResponse.json({
      data: [data.data],
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      console.error(error);
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
