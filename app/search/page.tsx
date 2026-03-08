'use client'
import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import useGetData from '@/hooks/useGetData'
import { usePageQuery } from '@/hooks/usePageQuery'
import Loader from '@/components/Loader'
import AnimeListItems from '@/components/AnimeList/AnimeListItems'

function SearchContent() {
    const searchParams = useSearchParams();
    const { page, setPage } = usePageQuery();



    const { anime, maxPages, loading, error } = useGetData({
        url: "/api/fetchSearch",
        query: decodeURIComponent(searchParams.get("q") || ""),
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
            {anime.length === 0 && !loading && (
                <div className='w-full flex justify-center items-center flex-col gap-4'>
                    <span className={`w-full max-md:text-[15px] md:text-lg font-bold text-center `}>
                        Search Result for &quot;{searchParams.get("q") || ""}&quot;
                    </span>

                    <span className={`w-full max-sm:text-[20px] md:text-lg font-bold text-center text-purple-400`}>
                       Matching Anime Not Found
                    </span>

                </div>

            )}
            {!loading && anime.length > 0 && (
                <AnimeListItems
                    title={`Search Result for "${searchParams.get("q") || ""}"`}
                    page={page}
                    animes={anime}
                    setPage={setPage}
                    maxPages={maxPages}
                />
            )}
        </main>
    );
}

export default function Search() {

    return (

        <Suspense fallback={<Loader />}>

            <SearchContent />

        </Suspense>

    );

}


