'use client';

import { useEffect, useState, useRef } from "react";
import AnimeListItems from "@/components/AnimeList/AnimeListItems";
import Loader from "@/components/Loader";
import useGetData from "@/hooks/useGetData";

type seasonalAnime = "winter" | "spring" | "summer" | "fall"

export default function SeasonalList() {
    const date = new Date();
    const currentYear = date.getFullYear();

    const [page, setPage] = useState(1);
    const seasonOptions =
        date.getMonth() >= 0 && date.getMonth() <= 2 ? "winter" :
            date.getMonth() >= 3 && date.getMonth() <= 5 ? "spring" :
                date.getMonth() >= 6 && date.getMonth() <= 8 ? "summer" :
                    date.getMonth() >= 9 && date.getMonth() <= 11 ? "fall" : "winter";

    const [season, setSeason] = useState<seasonalAnime>(seasonOptions);
    const [year, setYear] = useState(currentYear);

    const [draftSeason, setDraftSeason] = useState<seasonalAnime>(seasonOptions);
    const [draftYear, setDraftYear] = useState(currentYear);
    const scrollRef = useRef<HTMLDivElement>(null);

    const { anime, maxPages, loading } = useGetData({
        url: "/api/fetchSeasonalAnime",
        page,
        season,
        year,
    });

    // 🔹 Auto scroll to top on page change
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);

    const years = [];
    for (let i = 2000; i <= currentYear; i++) years.push(i);

    const handleSearch = () => {
        setSeason(draftSeason);
        setYear(draftYear);
        setPage(1);
    };

    return (
        <div
            ref={scrollRef}
            className="no-scrollbar overflow-y-auto h-screen scroll-smooth"
        >
            <div className="w-full flex justify-center items-center pb-12 gap-4">
                <select
                    className="w-full max-w-sm rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
                    value={draftSeason}
                    onChange={(e) => setDraftSeason(e.target.value as seasonalAnime)}
                >
                    <option value="winter">Winter</option>
                    <option value="spring">Spring</option>
                    <option value="summer">Summer</option>
                    <option value="fall">Fall</option>
                </select>

                <select
                    className="w-full max-w-sm rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
                    value={draftYear}
                    onChange={(e) => setDraftYear(parseInt(e.target.value))}
                >
                    {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
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
