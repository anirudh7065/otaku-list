'use client';

import { useEffect, useState, useRef } from "react";
import AnimeListItems from "@/components/AnimeList/AnimeListItems";
import Loader from "@/components/Loader";
import useGetData from "@/hooks/useGetData";

export default function Mylist() {
    const [page, setPage] = useState(1);
    const scrollRef = useRef<HTMLDivElement>(null);

    const { anime, maxPages, loading } = useGetData({
        url: "/api/fetchMyAnime",
        page,
    });

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);


    return (
        <main
            ref={scrollRef}
            className="w-full no-scrollbar overflow-y-auto h-screen "
        >
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
