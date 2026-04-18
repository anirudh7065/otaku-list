// app/sitemap.ts
import type { MetadataRoute } from "next";
import genresData from "./genres/genres.json";

const base = "https://av-otakulist.vercel.app";

const fetchPage = (page: number) =>
    fetch(`https://api.jikan.moe/v4/top/anime?page=${page}`, {
        next: { revalidate: 86400 },
    }).then((r) => r.json());

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const types = ["all", "movie", "ona", "ova", "series", "special"];

    const [batch1, batch2, batch3] = await Promise.all([
        fetchPage(1),
        fetchPage(2),
        fetchPage(3),
    ]);

    const allAnime = [
        ...(batch1?.data ?? []),
        ...(batch2?.data ?? []),
        ...(batch3?.data ?? []),
    ].filter(Boolean);

    const animeUrls = allAnime.map((a: { mal_id: number }) => ({
        url: `${base}/anime/${a.mal_id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    const topUrls = types.map((type) => ({
        url: `${base}/top/${type}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.7,
    }));

    const genreUrls = genresData.genres.map((g: { mal_id: number }) => ({
        url: `${base}/genres/${g.mal_id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
    }));

    return [
        { url: base, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
        { url: `${base}/season`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
        { url: `${base}/schedules`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
        { url: `${base}/genres`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
        { url: `${base}/search`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
        { url: `${base}/mylist`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 },
        ...topUrls,
        ...genreUrls,
        ...animeUrls,
    ];
}