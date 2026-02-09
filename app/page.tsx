'use client';

import { useEffect, useState, useRef } from "react";
import AnimeListItems from "@/components/AnimeList/AnimeListItems";
import Loader from "@/components/Loader";
import useGetData from "@/hooks/useGetData";

export default function Home() {
  const [page, setPage] = useState(1);

  const ref = useRef<HTMLDivElement>(null);

  const { anime, maxPages, loading } = useGetData({
    url: "/api/fetchAnime",
    page,
  });

  useEffect(() => {
    ref.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);



  return (
    <main ref={ref} className="w-full h-screen overflow-y-auto no-scrollbar">
      {loading && <Loader />}

      {!loading && (
        <AnimeListItems
          title="All Anime"
          page={page}
          anime={anime}
          setPage={setPage}
          maxPages={maxPages}
        />
      )}
    </main>
  );
}
