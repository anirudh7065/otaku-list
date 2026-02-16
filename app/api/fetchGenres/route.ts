import { NextResponse,NextRequest } from 'next/server';

export const revalidate = 3600;


const RATE_LIMIT = 30;
const WINDOW = 60 * 1000; // 1 minute

const ipStore = new Map<string, { count: number; reset: number }>();

function rateLimit(ip: string) {
  const now = Date.now();
  const entry = ipStore.get(ip);

  if (!entry || now > entry.reset) {
    ipStore.set(ip, { count: 1, reset: now + WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  return true;
}
export async function GET(req: NextRequest) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown-ip";
  
    if (!rateLimit(ip)) {
      return NextResponse.json({ message: "Too many requests" }, { status: 429 });
    }
    const baseUrl = process.env.BASE_URL;
    const id = Number(req.nextUrl.searchParams.get('id') ?? 2);
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
    const apiUrl = `${baseUrl}/anime?genres=${id}&page=${page}`;
    try {
    let response = await fetch(apiUrl,{next:{revalidate: 3600}});
    if (!response.ok) {
        return NextResponse.json({ error: 'Failed to fetch genres' }, { status: response.status });
    }
        let data = await response.json();
            if (page > data.pagination.last_visible_page) {
              page = data.pagination.last_visible_page;
              response = await fetch(`${baseUrl}/anime?page=${page}&sfw=true`, {
                next: { revalidate: 3600 },
              });

              data = await response.json();
            } 
        return NextResponse.json({ data: data.data, maxPage: data.pagination.last_visible_page ,page:page});
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
}