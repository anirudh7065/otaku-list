"use client";

import useGetData from "@/hooks/useGetData";
import { useParams } from "next/navigation";
import { usePageQuery } from "@/hooks/usePageQuery";
import { notFound } from "next/navigation";
import AnimeListItems from "@/components/AnimeList/AnimeListItems";
import AnimeListLoader from "@/components/AnimeList/AnimeListLoader";
import type { ProducerType } from "@/types/producertype";
import Image from "next/image";
import { useEffect } from "react";
import { newPost } from "@/types/newPost";
const AnimeStudiosContent = ({ studio }: { studio: ProducerType }) => {
    const param = useParams();
    const rawId = Number(Array.isArray(param?.id) ? param.id[0] : param?.id);
    const id = rawId ?? null;
    if (id === null || isNaN(id)) {
        notFound()
    }

    const { page, setPage } = usePageQuery();
    const { anime, loading, error, maxPages } = useGetData({
        url: "/api/fetchStudiosByID",
        page: page,
        id: id,
    });


    if (error?.message === "No Studio found") {
        notFound();
    }

    if (error) {
        throw error;
    }
    const date = new Date(studio?.established);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page, id]);


    return (
        <main>
            {studio && <section className="w-[90%] mx-auto my-5 min-h-62 border-b border-primary-dark">
                {studio?.titles?.length && <h1 className="bg-primary-dark mb-2  text-xl w-full text-center font-bold">{studio?.titles[0]?.title} {studio?.titles[1] && ` - ${studio?.titles[1]?.title}`}</h1>}
                {!studio?.titles?.length && <h1 className="bg-primary-dark mb-2  text-xl w-full text-center font-bold">{(anime as newPost[])[0]?.studios[0]?.name}</h1>}
                <article className="w-full ">
                    <p className="text-sm max-sm:mx-auto ">

                            {studio?.images?.jpg?.image_url && <Image
                                src={studio?.images?.jpg?.image_url}
                                alt={studio?.titles[0]?.title}
                                width={200}
                                height={200}
                                className="w-full md:w-50 md:h-50 max-md:mx-auto md:float-left md:mr-2 md:mb-1 max-md:mb-2 text-text-muted"
                            />}
                        {studio?.about}
                    </p>
                    <span className="font-bold py-3">Established : </span>
                    <span className="text-primary-active py-3">{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</span>
                </article>
            </section>}
            {loading && <AnimeListLoader />}
            {!loading && anime && <AnimeListItems
                animes={anime}
                title={(anime as newPost[])[0].studios[0].name + " Animelist"}
                maxPages={maxPages}
                setPage={setPage}
                page={page}
            />
            }
        </main>
    )
}

export default AnimeStudiosContent