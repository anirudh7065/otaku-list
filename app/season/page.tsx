'use client';

import { useEffect, useState } from "react";
import AnimeListItems from "@/components/AnimeList/AnimeListItems";
import Loader from "@/components/Loader";
import useGetData from "@/hooks/useGetData";
import { usePageQuery } from "@/hooks/usePageQuery";
import { Suspense } from "react";

type seasonalAnime = "winter" | "spring" | "summer" | "fall";

function SeasonalListContent() {
    const date = new Date();
    const currentYear = date.getFullYear();

    const { page, setPage } = usePageQuery();

    const seasonOptions =
        date.getMonth() <= 2 ? "winter" :
            date.getMonth() <= 5 ? "spring" :
                date.getMonth() <= 8 ? "summer" : "fall";

    const [season, setSeason] = useState<seasonalAnime>(seasonOptions);
    const [year, setYear] = useState(currentYear);

    const [draftSeason, setDraftSeason] = useState<seasonalAnime>(seasonOptions);
    const [draftYear, setDraftYear] = useState(currentYear);

    const { anime, maxPages, loading,error } = useGetData({
        url: "/api/fetchSeasonalAnime",
        page,
        season,
        year,

    });
    if (error) {
        throw new Error(error);
    }

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);

    const years: number[] = [];
    for (let i = 1917; i <= currentYear; i++) years.push(i);

    const handleSearch = () => {
        setSeason(draftSeason);
        setYear(draftYear);
        setPage(1);
    };

    return (
        <div className="pt-10">

            <div className="w-full flex max-md:flex-col justify-center items-center pb-12 gap-4">

                <select
                    className="w-full max-w-sm rounded-lg border scrollbar-custom  bg-transparent p-2.5 text-sm"
                    value={draftSeason}
                    onChange={(e) => setDraftSeason(e.target.value as seasonalAnime)}
                >
                    <option className="bg-black" value="winter">Winter</option>
                    <option className="bg-black" value="spring">Spring</option>
                    <option className="bg-black" value="summer">Summer</option>
                    <option className="bg-black" value="fall">Fall</option>
                </select>

                <select
                    className="w-full max-w-sm rounded-lg border scrollbar-custom bg-transparent p-2.5 text-sm"
                    value={draftYear}
                    onChange={(e) => setDraftYear(parseInt(e.target.value))}
                >
                    {years.map((year) => (
                        <option key={year} className="bg-black" value={year}>{year}</option>
                    ))}
                </select>

                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleSearch}
                >
                    Search
                </button>

            </div>

            {loading && <Loader />}

            {!loading && (
                <AnimeListItems
                    title="Seasonal Anime"
                    page={page}
                    anime={anime}
                    setPage={setPage}
                    maxPages={maxPages}
                />
            )}

        </div>
    );
}

export default function SeasonalList() {

    return (

        <Suspense fallback={<Loader />}>

            <SeasonalListContent />

        </Suspense>

    );

}


