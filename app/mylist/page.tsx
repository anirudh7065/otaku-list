'use client';

import { Suspense, useEffect } from "react";
import AnimeListItems from "@/components/AnimeList/AnimeListItems";
import Loader from "@/components/Loader";
import useGetData from "@/hooks/useGetData";
import { usePageQuery } from "@/hooks/usePageQuery";

function MyListContent() {
    const { page, setPage } = usePageQuery();

    const { anime, maxPages, loading,error} = useGetData({
        url: "/api/fetchMyAnime",
        page,

    });
    if (error) {
        throw new Error(error);
    }
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);

    return (
        <main className="w-full min-h-screen pt-10">
            {loading && <Loader />}

            {!loading && (
                <AnimeListItems
                    title="My List"
                    page={page}
                    anime={anime}
                    setPage={setPage}
                    maxPages={maxPages}
                />
            )}
        </main>
    );
}

export default function Mylist() {
    return (
        <Suspense fallback={<Loader />}>
            <MyListContent />
        </Suspense>
    );
}
