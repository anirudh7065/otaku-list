'use client';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import AnimeListItems from "@/components/AnimeList/AnimeListItems";
import genres from "@/constants/genresData.json";
import useGetData from "@/hooks/useGetData";
import { usePageQuery } from "@/hooks/usePageQuery";
import { Suspense } from "react";
import Loader from "@/components/Loader";
import { notFound } from 'next/navigation';
import { Genres } from '@/types/genreType';

const GenreAnimeContent = () => {
    const param = useParams();
    const rawId = Number( Array.isArray(param?.id) ? param.id[0] : param?.id);
    const id = rawId ?? null;
    if(id === null || isNaN(id) || !(id >= 1 && id <= 83)) {
        notFound()
    }

    const { page, setPage } = usePageQuery();



    const { anime, maxPages,error, loading } = useGetData({
        url: "/api/fetchGenresByID",
        page, id
    });

    if (error) {
        throw new Error(error);
    }


    const parsedId = id;
      useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, [page, id]);

  return (
      <main className="py-10">
          {loading && <div className="flex justify-center items-center h-screen w-full">
              <div className="w-24 h-24 border-4 border-gray-300 border-t-purple-900 rounded-full animate-spin"></div>
          </div>}

          {!loading && (
        <AnimeListItems
                  genre={true}
                  title={genres.find((genre: Genres) => genre.mal_id === parsedId)?.name || 'Genre'}
                  page={page}
                  animes={anime}
                  setPage={setPage}
                  maxPages={maxPages}
              />
          )}
      </main>
  )
}

export default function GenreAnime() {

    return (

        <Suspense fallback={<Loader />}>

            <GenreAnimeContent />

        </Suspense>

    );

}


