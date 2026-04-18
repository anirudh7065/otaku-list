// app/anime/[id]/page.tsx
import type { Metadata } from "next";
import AnimeContent from "@/components/AnimeList/AnimeContent";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const res = await fetch(`${process.env.BASE_URL}/anime/${params.id}/full`, {
        next: { revalidate: 3600 },
    });
    const data = await res.json();
    const anime = data?.data;

    return {
        title: anime?.title_english || anime?.title,
        description: anime?.synopsis?.slice(0, 160),
        openGraph: {
            images: [anime?.images?.jpg?.large_image_url],
        },
    };
}

export default function AnimePage() {
    return <AnimeContent />;
}