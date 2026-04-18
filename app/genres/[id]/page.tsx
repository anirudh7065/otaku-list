'use client';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import AnimeListItems from "@/components/AnimeList/AnimeListItems";
import genres from "@/constants/genresData.json";
import useGetData from "@/hooks/useGetData";
import { usePageQuery } from "@/hooks/usePageQuery";
import { Suspense } from "react";
import AnimeListLoader from "@/components/Loaders/AnimeListLoader";
import { notFound } from 'next/navigation';
import { Genres } from '@/types/genreType';

const GenreAnimeContent = () => {
    const param = useParams();
    const rawId = Number(Array.isArray(param?.id) ? param.id[0] : param?.id);
    const id = rawId ?? null;
    if (id === null || isNaN(id) || !(id >= 1 && id <= 83)) {
        notFound()
    }

    const { page, setPage } = usePageQuery();



    const { anime, maxPages, error, loading } = useGetData({
        url: "/api/fetchGenresByID",
        page, id
    });

    if (error) {
        throw new Error(error);
    }


    const parsedId = id;
    useEffect(() => {
        document.title = "Genre - "+genres.find((genre: Genres) => genre.mal_id === parsedId)?.name || 'Genre'
    }, [parsedId]);
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page, id]);

    return (
        <main className="py-10">
            {loading && <AnimeListLoader />}

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

        <Suspense fallback={<AnimeListLoader />}>

            <GenreAnimeContent />

        </Suspense>

    );

}


