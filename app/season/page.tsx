'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AnimeListItems from "@/components/AnimeList/AnimeListItems";
import AnimeListLoader from "@/components/AnimeList/AnimeListLoader";
import useGetData from "@/hooks/useGetData";
import { usePageQuery } from "@/hooks/usePageQuery";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";



type seasonalAnime = "winter" | "spring" | "summer" | "fall";

function SeasonalListContent() {
    const searchParams = useSearchParams();

    const seasonParam = searchParams.get("season") as seasonalAnime;
    const yearParam = searchParams.get("year");

    const date = new Date();
    const currentYear = date.getFullYear();

    const { page, setPage } = usePageQuery();

    const seasonOptions =
        date.getMonth() <= 2 ? "winter" :
            date.getMonth() <= 5 ? "spring" :
                date.getMonth() <= 8 ? "summer" : "fall";

    const validSeasons: seasonalAnime[] = ["winter", "spring", "summer", "fall"];

    let season: seasonalAnime = seasonOptions;
    let year: number = currentYear;

    if (yearParam !== null && yearParam.trim() !== "") {
        const parsedYear = Number(yearParam);

        if (Number.isFinite(parsedYear)) {
            if (parsedYear > currentYear) {
                year = currentYear;
                season = seasonOptions;
            } else if (parsedYear >= 1917) {
                year = parsedYear;
            }
        }
    }

    if (seasonParam && validSeasons.includes(seasonParam)) {
        season = seasonParam;
    }
    const [draftSeason, setDraftSeason] = useState<seasonalAnime>(season);
    const [draftYear, setDraftYear] = useState(year);

    const { anime, maxPages, loading, error } = useGetData({
        url: "/api/fetchSeasonalAnime",
        page,
        season,
        year,

    });
    if (error) {
        throw new Error(error);
    }

    useEffect(() => {
        document.title = "Season - " + season + " " + year || "Season";
    }, [season, year]);
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);

    const years: number[] = [];
    for (let i = 1917; i <= currentYear; i++) years.push(i);


    const router = useRouter();

    const handleSearch = () => {
        const params = new URLSearchParams(window.location.search);

        params.set("season", draftSeason);
        params.set("year", draftYear.toString());
        params.set("page", "1");

        router.replace("?" + params.toString());
    };

    return (
        <div className="pt-10">

            <div className="w-full flex max-md:flex-col justify-center items-center gap-4">

                <select
                    className="w-full max-w-sm max-md:w-[90%] rounded-lg border scrollbar-custom  bg-transparent p-2.5 text-sm"
                    value={draftSeason}
                    onChange={(e) => setDraftSeason(e.target.value as seasonalAnime)}
                >
                    <option className="bg-black" value="winter">Winter</option>
                    <option className="bg-black" value="spring">Spring</option>
                    <option className="bg-black" value="summer">Summer</option>
                    <option className="bg-black" value="fall">Fall</option>
                </select>

                <select
                    className="w-full max-w-sm max-md:w-[90%] rounded-lg border scrollbar-custom bg-transparent p-2.5 text-sm"
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

            {loading && <AnimeListLoader />}

            {!loading && (
                <AnimeListItems
                    title="Seasonal Anime"
                    page={page}
                    animes={anime}
                    setPage={setPage}
                    maxPages={maxPages}
                />
            )}

        </div>
    );
}

export default function SeasonalList() {

    return (

        <Suspense fallback={<AnimeListLoader />}>

            <SeasonalListContent />

        </Suspense>

    );

}


