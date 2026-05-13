import { NextResponse, NextRequest } from "next/server";
import { withApiProtectionLogger } from "@/lib/withApiProtectionLogger";
import { CharacterType } from "@/types/characterType";
export const revalidate = 3600;

export const GET = withApiProtectionLogger(async (req: NextRequest) => {
  const baseUrl = process.env.BASE_URL;
  const id = req.nextUrl.searchParams.get("id") ?? 1;
  const apiUrl = `${baseUrl}/anime/${id}/characters`;

    try {
        //console.log(apiUrl)

    const response = await fetch(apiUrl, {
      headers: {
        UserAgent: "OtakuList/1.0",
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch character data" },
        { status: response.status },
      );
    }

      const data = await response.json();
      const mainCharacters = (data.data as CharacterType[])
        ?.filter((c) => c.role === "Main")
        .sort((a, b) => b.favorites - a.favorites);
      console.log("maincharacter is ",mainCharacters);
    return NextResponse.json({
      data: mainCharacters,
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
