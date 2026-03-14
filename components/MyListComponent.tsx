'use client';

import { useEffect,Suspense } from "react";
import AnimeListItems from "@/components/AnimeList/AnimeListItems";
import Loader from "@/components/Loader";
import useGetData from "@/hooks/useGetData";
import { usePageQuery } from "@/hooks/usePageQuery";


function MyListContent({type="all",main=true}: {type?:"movie"|'ona'|'ova'|'series'|'all'|'special',main?:boolean}) {
    const { page, setPage } = usePageQuery();

    const { anime, maxPages, loading, error } = useGetData({
        url: "/api/fetchMyAnime",
        page,
        type,
    });
    if (error) {
        throw new Error(error);
    }
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);
    const title = `${type === "movie" || type === "series" ? "Anime " : ""}${type.charAt(0).toUpperCase() + type.slice(1)} ${type==="all"||type==="special"?"Anime":""}`;
    return (
        <main className="w-full min-h-screen ">
            {loading && <Loader />}

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
export default function MyList({type="all",main=true}:{type?:"movie"|'ona'|'ova'|'series'|'all'|'special',main?:boolean}) {
    return (
        <Suspense fallback={<Loader />}>
            <MyListContent type={type as "all" | "movie" | "ona" | "ova" | "series" | "special"} main={main} />
        </Suspense>
    );
}