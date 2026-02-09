import { NextResponse,NextRequest } from 'next/server';

export const revalidate = 3600;
export async function GET(req: NextRequest) {
    const baseUrl = process.env.BASE_URL;
    const id = Number(req.nextUrl.searchParams.get('id') ?? 2);
    const page = Number(req.nextUrl.searchParams.get('page') ?? 1);
    const apiUrl = `${baseUrl}/anime?genres=${id}&page=${page}`;
    try {
    const response = await fetch(apiUrl,{next:{revalidate: 3600}});
    if (!response.ok) {
        return NextResponse.json({ error: 'Failed to fetch genres' }, { status: response.status });
    }
    const data = await response.json();
        return NextResponse.json({ data: data.data, maxPage: data.pagination.last_visible_page });
    } catch (error) {
    console.error('Error fetching genres:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}