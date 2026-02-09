'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import AnimeListItems from "@/components/AnimeList/AnimeListItems";
import genres from "@/constants/genresData.json";
import useGetData from "@/hooks/useGetData";


const GenreAnime = () => {
    const param = useParams();
    const rawId = Array.isArray(param?.id) ? param.id[0] : param?.id;
    const id = rawId ?? null;

    const [page, setPage] = useState(1);
    
    const ref = useRef<HTMLDivElement>(null);

    const { anime, maxPages, loading } = useGetData({
        url: "/api/fetchGenres",
        page, id
    });
    const parsedId = id && parseInt(id, 10);
      useEffect(() => {
          ref.current?.scrollTo({ top: 0, behavior: "smooth" });
      }, [page, id]);

  return (
      <main ref={ref} className="w-full h-screen overflow-y-auto no-scrollbar">
          {loading && <div className="flex justify-center items-center h-screen w-full">
              <div className="w-24 h-24 border-4 border-gray-300 border-t-purple-900 rounded-full animate-spin"></div>
          </div>}

          {!loading && (
        <AnimeListItems
                  genre={true}
                  title={genres.find((genre) => genre.mal_id === parsedId)?.name || 'Genre'}
                  page={page}
                  anime={anime}
                  setPage={setPage}
                  maxPages={maxPages}
              />
          )}
      </main>
  )
}

export default GenreAnime