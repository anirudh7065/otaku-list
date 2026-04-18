'use client';

import { useEffect, Suspense } from "react";
import AnimeListItems from "@/components/AnimeList/AnimeListItems";
import AnimeListLoader from "@/components/Loaders/AnimeListLoader";
import useGetData from "@/hooks/useGetData";
import { usePageQuery } from "@/hooks/usePageQuery";


function MyListContent({ type = "all", main = true, home = false }: { type?: "movie" | 'ona' | 'ova' | 'series' | 'all' | 'special', main?: boolean, home?: boolean }) {
    const { page, setPage } = usePageQuery();
    const url = home ? "/api/fetchTopAnime" : "/api/fetchMyAnime"

    const { anime, maxPages, loading, error } = useGetData({
        url,
        page,
        type,
    });
    if (error) {
        throw new Error(error);
    }
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);
    const title = home ? type === "all" ? "Top Anime" : "Top " + type.charAt(0).toUpperCase() + type.slice(1) : `${type === "movie" || type === "series" ? "Anime " : ""}${type.charAt(0).toUpperCase() + type.slice(1)} ${type === "all" || type === "special" ? "Anime" : ""}`;
    useEffect(() => {
        document.title = main ? title + " - Otakulist" : home ? "Home - Otakulist" : "My List - Otakulist";
    }, []);
    return (
        <main className="w-full min-h-screen ">
            {loading && <AnimeListLoader />}

            {!loading && (
                <AnimeListItems
                    myList={main}
                    title={title}
                    page={page}
                    animes={anime}
                    setPage={setPage}
                    maxPages={maxPages}
                />
            )}
        </main>
    );
}
export default function MyList({ type = "all", main = true, home = false }: { type?: "movie" | 'ona' | 'ova' | 'series' | 'all' | 'special', main?: boolean, home?: boolean }) {
    return (
        <Suspense fallback={<AnimeListLoader />}>
            <MyListContent type={type as "all" | "movie" | "ona" | "ova" | "series" | "special"} main={main} home={home} />
        </Suspense>
    );
}