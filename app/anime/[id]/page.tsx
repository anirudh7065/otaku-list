"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation";
import useGetData from "@/hooks/useGetData";
import { ArrowBigLeftDash } from "lucide-react";
import useCountdown from "@/hooks/useCountdown";
import jpnToInd from "@/constants/japaneseToIndianTime";
import { Star } from "lucide-react";
import type { newPost } from "@/types/newPost";
import AnimeLoader from "../../../components/Loaders/AnimeLoading";


type Genre = {
    mal_id: number;
    name: string;
}
const AnimeContent = () => {
    const param = useParams();
    const rawId = Number(Array.isArray(param?.id) ? param.id[0] : param?.id);
    const [zoom, setZoom] = useState(false);
    const id = rawId ?? null;
    const { anime, loading, error }:{anime: newPost[], loading: boolean, error: string} = useGetData({
        url: "/api/fetchOneAnime",
        id
    });
    if (error) {
        throw new Error(error);
    }
    const router = useRouter();
    const [toggle, setToggle] = useState(false)
    const synopsisScroll = useRef<HTMLDivElement>(null);

    const memberParse = (members: number) => {
        const num = Number(members);
        if (!num) return 0;

        if (num < 1_000) return num;
        if (num < 100_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
        if (num < 10_000_000) return (num / 100_000).toFixed(1).replace(/\.0$/, "") + "L";
        return (num / 10_000_000).toFixed(1).replace(/\.0$/, "") + "C";
    };
    const countdown = useCountdown(
        anime?.[0]?.airing ? jpnToInd : null,
        anime?.[0]?.broadcast.day ?? null,
        anime?.[0]?.broadcast.time ?? null
    );
    const imageSrc =
        anime[0]?.images?.webp?.image_url ||
        anime[0]?.images?.webp?.large_image_url ||
        anime[0]?.images?.jpg?.image_url ||
        anime[0]?.images?.jpg?.large_image_url
        ;

    useEffect(() => {
        synopsisScroll.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, [toggle]);

    return (
        <main className="min-h-screen py-10">
            {loading && <AnimeLoader />}
            {!loading && anime?.length !== 0 && (
                <>
                    <div className="title w-full flex items-center px-18">
                        <ArrowBigLeftDash className="size-12  max-md:hidden cursor-pointer" onClick={() => router.back()} />
                        <div className="w-[90%] text-center mx-auto ">

                            <h1 className="text-center select-text text-2xl max-md:text-xl text-purple-300 max-md:pb-2 max-md:border-b-2">{anime[0]?.title}</h1>
                            <h2 className="text-center select-text text-2xl max-md:text-xl text-purple-200 max-md:pt-2 ">{anime[0]?.title_english}</h2>
                        </div>
                    </div>
                    <div className="main w-[90%] min-h-96 flex max-md:flex-col justify-center items-start my-10 gap-10 mx-auto">
                        <div className="md:w-[20%] w-full h-full">

                            {imageSrc && <>
                                <Image src={imageSrc} alt={anime[0]?.title} width={500} height={500} className={`w-full aspect-auto min-h-[90%] object-cover `} onClick={() => setZoom(!zoom)} />
                                {zoom && <div className="size-screen bg-black/70 fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-100 flex-col gap-2" >
                                    <button className="size-8 rounded-full text-xl font-bold absolute top-20 right-10 shadow-lg shadow-black md:right-1/3 bg-white text-black" onClick={() => setZoom(!zoom)}>X</button>
                                    <Image src={imageSrc} alt={anime[0]?.title} width={1500} height={1500} className={`aspect-auto object-contain w-100 max-md:w-[90%] `} />
                                    <a
                                        href={imageSrc}
                                        target="_blank"
                                        download
                                        className="px-4 py-2 bg-white text-xl text-black font-bold rounded-3xl"
                                    >
                                        Download
                                    </a>

                                </div>}
                            </>}
                            <div className="flex justify-center items-center gap-1.5 text-lg lg:text-xl bg-purple-950  w-full ">
                                <div className="flex items-center gap-1">
                                    <Star color="#fff82e" size={15} fill="#fff82e" />
                                    <span className="text-purple-300 py-1"> {anime[0].score ?? "-"} </span>
                                </div>
                                ({anime[0].scored_by ? memberParse(anime[0].scored_by) : anime[0].scored_by ?? "-"})
                            </div>

                        </div>
                        <div className="w-full h-full flex flex-col gap-3">
                            {/* Synopsis */}


                            <div className="flex items-center gap-4 flex-wrap">
                                <span className="text-lg">Genre :</span>

                                <div className="flex gap-2 text-sm flex-wrap">
                                    {anime[0]?.genres.map((genre: Genre, index: number) => (
                                        <button
                                            key={index}
                                            className="cursor-pointer py-1 px-3 border-2 border-purple-600 rounded-2xl hover:bg-purple-600 hover:text-white"
                                            onClick={() => router.push(`/genres/${genre.mal_id}`)}
                                        >
                                            {genre?.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 flex-wrap">
                                <span className="text-lg">Streaming :</span>

                                <div className="flex gap-2 text-sm flex-wrap">{
                                    !anime[0]?.streaming?.length && <span className="text-lg  text-purple-400">Not Available</span>}
                                    {anime[0]?.streaming?.map((stream, index: number) => (
                                        <a
                                            href={stream.url}
                                            key={index}
                                            target="_blank"
                                            className="cursor-pointer py-1 px-3 border-2 border-purple-600 rounded-2xl hover:bg-purple-600 hover:text-white"
                                        >
                                            {stream.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <div className="text-lg flex gap-4">
                                <span>Studios : </span>
                                {anime[0]?.studios?.length > 0 ?
                                    <div className="flex gap-2 text-sm flex-wrap ">
                                        {
                                            anime[0]?.studios?.map((studio: { name: string, url: string }, index: number) => (
                                                <a
                                                    href={studio?.url}
                                                    target="_blank"
                                                    key={index}
                                                    className="cursor-pointer py-1 px-3 border-2 border-purple-600 rounded-2xl hover:bg-purple-600 hover:text-white"
                                                >
                                                    {studio?.name}
                                                </a>
                                            ))
                                        }
                                    </div>
                                    : <span className=" text-purple-400 text-lg">Unknown</span>}
                            </div>
                            <div className="text-lg">
                                <span>Brodcast :</span>
                                <span className="ml-2 text-purple-400">{jpnToInd(anime[0]?.broadcast?.day || "Sundays", anime[0]?.broadcast?.time || "17:00") as string}</span>
                            </div>
                            <div className="text-lg">
                                <span>Season :</span>
                                <span className="ml-2 text-purple-400">{anime[0]?.season === null ? "Unknown" : `${anime[0]?.season} ${anime[0]?.year}`}</span>
                            </div>
                            <div className="text-lg">
                                <span>Episodes :</span>
                                <span className="ml-2 text-purple-400">
                                    {anime[0]?.episodes === null ? "Unknown" : `${anime[0]?.episodes} Episodes of ${anime[0]?.duration}`}
                                </span>
                            </div>
                            <div className="text-lg">
                                <span>Aired :</span>
                                <span className="ml-2 text-purple-400">
                                    {anime[0]?.aired.string}
                                </span>
                            </div>
                            <div className="text-lg">
                                <span>Type :</span>
                                <span className="ml-2 text-purple-400">
                                    {anime[0]?.type ?? "Unknown"}
                                </span>
                            </div>
                            <div className="text-lg">
                                <span>Status :</span>
                                <span className="ml-2 text-purple-400">
                                    {anime[0]?.status ?? "Unknown"}
                                </span>
                            </div>
                            {
                                anime[0]?.airing && <div className="text-lg">
                                <span>Next Episode :</span>
                                <span className="ml-2 text-purple-400">
                                        {
                                            countdown
                                        }
                                </span>
                            </div>
                            }
                            <div className="text-lg">
                                <span>For More Info : </span>
                                <span className="ml-2 text-purple-400">
                                    <a href={anime[0]?.url} target="_blank" className="underline-offset-0">MyAnimeList</a>
                                </span>
                            </div>
                        </div>
                    </div>
                    {anime[0]?.synopsis &&
                    <div className="synopsis w-[90%] mx-auto flex flex-col gap-4">
                        <h2 className="text-3xl font-bold">Synopsis</h2>

                        <div
                            ref={synopsisScroll}
                            className={`relative transition-all duration-300 ${toggle ? "md:max-h-125 scrollbar-custom " : "md:max-h-32 max-h-85 overflow-hidden"
                                }`}
                        >
                            <p className="text-lg pr-2 ">
                                {anime[0]?.synopsis}
                            </p>

                            {/* fade overlay when collapsed */}
                            {(!toggle && anime[0]?.synopsis?.length > 700) && (
                                <div className="absolute bottom-0 left-0 w-full h-12 bg-linear-to-t from-black to-transparent pointer-events-none" />
                            )}
                        </div>

                        {anime[0]?.synopsis?.length > 700 && <button
                            onClick={() => setToggle(!toggle)}
                            className="self-end text-red-400 hover:text-red-300 transition"
                        >
                            {toggle ? "Read Less" : "Read More"}
                        </button>}
                    </div>
                }
                    {anime[0]?.trailer?.embed_url && (

                        <iframe src={anime[0]?.trailer?.embed_url || ""} className=" block md:w-200 md:h-100 w-[90%] h-60 mx-auto my-10"
                            allowFullScreen
                        >

                        </iframe>
                    )}

                </>
            )}
        </main>
    )
}

export default AnimeContent