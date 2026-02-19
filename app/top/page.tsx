'use client';

import { useEffect } from "react";
import AnimeListItems from "@/components/AnimeList/AnimeListItems";
import Loader from "@/components/Loader";
import useGetData from "@/hooks/useGetData";
import { usePageQuery } from "@/hooks/usePageQuery";
import { Suspense } from "react";
function TopContent() {
      const { page, setPage } = usePageQuery();
    

    const { anime, maxPages, loading,error } = useGetData({
        url: "/api/fetchTopAnime",
        page,
    });

    if (error) {
        throw new Error(error);
    }




    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);

    return (
        <main className="w-full min-h-screen  ">
            {loading && <Loader />}

            {!loading && (
                <AnimeListItems
                    title="Top Anime"
                    page={page}
                    anime={anime}
                    setPage={setPage}
                    maxPages={maxPages}
                />
            )}
        </main>
    );
}
export default function Top() {

    return (

        <Suspense fallback={<Loader />}>

            <TopContent />

        </Suspense>

    );

}


