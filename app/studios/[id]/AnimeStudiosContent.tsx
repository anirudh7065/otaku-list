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

    console.log(maxPages, page)

    if (error?.message === "No Studio found") {
        notFound();
    }

    if (error) {
        throw error;
    }
    const date = new Date(studio.established);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page, id]);


    return (
        <main>
            <section className="w-[90%] mx-auto my-5 border-b border-purple-800">
                <h1 className="bg-purple-900 mb-2  text-xl w-full text-center font-bold">{studio.titles[0].title} {studio.titles[1] && ` - ${studio.titles[1].title}`}</h1>
                <article className="w-full flex gap-5 mb-4">

                    <figure className="w-60 h-60">
                        <Image
                            src={studio.images.jpg.image_url || ""}
                            alt={studio.titles[0].title}
                            width={200}
                            height={200}
                            className="w-full h-full"
                        />
                    </figure>
                    <section className="w-[calc(100%-200px)] flex flex-col gap-2 pt-2 ">

                        <p className="text-sm">
                            {studio.about}
                        </p>
                        <div>
                            <span className="font-bold">Established : </span>
                            <span className="text-purple-300">{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</span>
                        </div>
                    </section>
                </article>
            </section>
            {loading && <AnimeListLoader />}
            {!loading && anime && <AnimeListItems
                animes={anime}
                title={studio.titles[0].title + " Animelist"}
                maxPages={maxPages}
                setPage={setPage}
                page={page}
            />
            }
        </main>
    )
}

export default AnimeStudiosContent