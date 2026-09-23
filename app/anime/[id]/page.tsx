// app/anime/[id]/page.tsx
import type { Metadata } from "next";
import AnimeContent from "@/app/anime/[id]/AnimeContent";
import type { Episode } from "@/types/newPost";

// app/anime/[id]/page.tsx
async function getAnime(id: string) {
    const res = await fetch(
        `${process.env.APP_BASE_URL || "http://localhost:3000"}/api/fetchOneAnime?id=${id}`,
        {
            next: { revalidate: 3600 },
            headers: process.env.INTERNAL_KEY
                ? { "x-internal-key": process.env.INTERNAL_KEY }
                : {},
        },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.[0] ?? null;
}
async function getAnimeCharacters(id: string) {
    const res = await fetch(`${process.env.APP_BASE_URL || "http://localhost:3000"}/api/fetchCharacters?id=${id}`, {
        next: { revalidate: 3600 },
        headers: process.env.INTERNAL_KEY
            ? { "x-internal-key": process.env.INTERNAL_KEY }
            : {},
    });
    const data = await res.json();

    if (!res.ok) return null;

    return data.data ?? null;
}
async function getAnimeEpisodes(id: string): Promise<{ episodes: Episode[]; maxPage: number } | null> {
    const res = await fetch(`${process.env.APP_BASE_URL || "http://localhost:3000"}/api/fetchAnimeEpisode?id=${id}&page=1`, {
        next: { revalidate: 3600 },
        headers: process.env.INTERNAL_KEY
            ? { "x-internal-key": process.env.INTERNAL_KEY }
            : {},
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { episodes: data.data as Episode[], maxPage: data.maxPage };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const anime = await getAnime(id);
    return {
        title: anime?.title_english || anime?.title,
        description: anime?.synopsis?.slice(0, 160),
        openGraph: {
            images: [anime?.images?.jpg?.large_image_url],
        },
    };
}

export default async function AnimePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [anime, characters, episodeData] = await Promise.all([
        getAnime(id),
        getAnimeCharacters(id),
        getAnimeEpisodes(id),
    ]);
    return (
        <AnimeContent
            initialData={anime ?? undefined}
            characters={characters ?? []}
            episodes={episodeData}
        />
    );
}