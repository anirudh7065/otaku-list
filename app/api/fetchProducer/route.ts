import { NextResponse, NextRequest } from "next/server";
import { withApiProtectionLogger } from "@/lib/withApiProtectionLogger";
import { upstreamFetch } from "@/lib/upstream";

export const revalidate = 3600;

export const GET = withApiProtectionLogger(async (req: NextRequest) => {
  const baseUrl = process.env.BASE_URL;
  const id = req.nextUrl.searchParams.get("id") ?? 1;
  const apiUrl = `${baseUrl}/producers/${id}`;

  try {
    const response = await upstreamFetch(apiUrl, { revalidate: 3600 });

    
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch anime data" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json({
      data: data.data,
    });
  } catch (error) {
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
