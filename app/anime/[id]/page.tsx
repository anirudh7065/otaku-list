// app/anime/[id]/page.tsx
import type { Metadata } from "next";
import AnimeContent from "@/app/anime/[id]/AnimeContent";
import type { CharacterType } from "@/types/characterType";

// app/anime/[id]/page.tsx
async function getAnime(id: string) {
    const res = await fetch(
        `${process.env.APP_BASE_URL || "http://localhost:3000"}/api/fetchOneAnime?id=${id}`,
        { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.[0] ?? null;
}
async function getAnimeCharacters(id: string) {
    const res = await fetch(`${process.env.APP_BASE_URL || "http://localhost:3000"}/api/fetchCharacters?id=${id}`, { next: { revalidate: 3600 } });
    const data = await res.json();

    if (!res.ok) return null;

    return data.data ?? null;
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
    const anime = await getAnime(id);
    const characters = await getAnimeCharacters(id);
    return <AnimeContent initialData={anime ?? undefined} characters={characters ?? []} />;
}