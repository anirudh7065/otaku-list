"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react"
import Link from "next/link";
import { useParams } from "next/navigation";
import useGetData from "@/hooks/useGetData";
import { ArrowBigLeftDash } from "lucide-react";
import jpnToInd from "@/lib/japaneseToIndianTime";
import CountdownDisplay from "@/app/anime/CountdownDisplay";
import { Star } from "lucide-react";
import type { newPost, RelationEntry } from "@/types/newPost";
import AnimeLoader from "@/app/anime/[id]/loading";
import type { CharacterType } from "@/types/characterType";

type Genre = {
    mal_id: number;
    name: string;
}

const AnimeContent = ({ initialData, characters }: { initialData?: newPost, characters?: CharacterType[] }) => {
    const param = useParams();
    const rawId = Number(Array.isArray(param?.id) ? param.id[0] : param?.id);
    const [zoom, setZoom] = useState(false);
    const [showAllRelations, setShowAllRelations] = useState(false);
    const prequel: RelationEntry[] = [];
    const sequel: RelationEntry[] = [];
    let others: RelationEntry[] = [];

    const id = rawId ?? null;
    //console.log(characters)

    const { anime: fetched, loading, error } = useGetData({
        url: "/api/fetchOneAnime",
        id,
        enabled: !initialData,
    });

    const animeData: newPost = initialData ?? fetched?.[0];

    if (animeData?.relations?.length > 0) {
        for (const rel of animeData.relations) {
            if (rel.relation === "Character" || rel.relation === "Adaptation") continue
            if (rel.relation === "Prequel") prequel.push(...rel.entry)
            else if (rel.relation === "Sequel") sequel.push(...rel.entry)
            else others.push(...rel.entry)
        }
    }
    others = others.filter((ani) => ani.type === "anime");
    const visibleOthers = showAllRelations ? others : others.slice(0, 5);

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


    const imageSrc =
        animeData?.images?.webp?.image_url ||
        animeData?.images?.webp?.large_image_url ||
        animeData?.images?.jpg?.image_url ||
        animeData?.images?.jpg?.large_image_url;
    const zoomImageSrc =
        animeData?.images?.webp?.large_image_url ||
        animeData?.images?.jpg?.large_image_url;

    useEffect(() => {
        document.title = animeData?.title || animeData?.title_japanese || animeData?.title_english || "Anime";
    }, [animeData]);

    useEffect(() => {
        synopsisScroll.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, [toggle]);

    return (
        <main className="min-h-screen py-10">
            {!animeData && loading && <AnimeLoader />}
            {animeData && (
                <>
                    <div className="title w-full flex items-center px-18">
                        <ArrowBigLeftDash className="size-12 max-md:hidden cursor-pointer" onClick={() => router.back()} />
                        <div className="w-[90%] text-center mx-auto">
                            <h1 className="text-center select-text text-2xl max-md:text-xl text-purple-300 max-md:pb-2 max-md:border-b-2">{animeData?.title}</h1>
                            <h2 className="text-center select-text text-2xl max-md:text-xl text-purple-200 max-md:pt-2">{animeData?.title_english}</h2>
                        </div>
                    </div>
                    <div className="main w-[90%] min-h-96 flex max-md:flex-col justify-center items-start my-10 gap-10 mx-auto">
                        <div className="md:w-[20%] w-full h-full">
                            {imageSrc && <>
                                <Image src={imageSrc} alt={animeData?.title} width={100} height={100} className="w-full aspect-auto min-h-[90%] object-cover" onClick={() => setZoom(!zoom)} />
                                {zoom && (
                                    <div className="size-screen bg-black/70 fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-100 flex-col gap-2">
                                        <button className="size-8 rounded-full text-xl font-bold absolute top-20 right-10 shadow-lg shadow-black md:right-1/3 bg-white text-black" onClick={() => setZoom(!zoom)}>X</button>
                                        <Image src={zoomImageSrc} alt={animeData?.title} width={1000} height={1000} className="aspect-auto object-contain w-100 max-md:w-[90%]" />
                                        <a href={zoomImageSrc} target="_blank" download className="px-4 py-2 bg-white text-xl text-black font-bold rounded-3xl">
                                            Download
                                        </a>
                                    </div>
                                )}
                            </>}
                            <div className="flex justify-center items-center gap-1.5 text-lg lg:text-xl bg-purple-950 w-full">
                                <div className="flex items-center gap-1">
                                    <Star color="#fff82e" size={15} fill="#fff82e" />
                                    <span className="text-purple-300 py-1">{animeData?.score ?? "-"}</span>
                                </div>
                                ({animeData?.scored_by ? memberParse(animeData.scored_by) : animeData?.scored_by ?? "-"})
                            </div>
                        </div>
                        <div className="w-full h-full flex flex-col gap-3">
                            <div className="flex items-center gap-4 flex-wrap">
                                <span className="text-lg">Genre :</span>
                                <div className="flex gap-2 text-sm flex-wrap">
                                    {animeData?.genres.map((genre: Genre, index: number) => (
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
                                <div className="flex gap-2 text-sm flex-wrap">
                                    {!animeData?.streaming?.length && <span className="text-lg text-purple-400">Not Available</span>}
                                    {animeData?.streaming?.map((stream: { name: string, url: string }, index: number) => (
                                        <a href={stream.url} key={index} target="_blank" className="cursor-pointer py-1 px-3 border-2 border-purple-600 rounded-2xl hover:bg-purple-600 hover:text-white">
                                            {stream.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <div className="text-lg flex gap-4">
                                <span>Studios : </span>
                                {animeData?.studios?.length > 0 ? (
                                    <div className="flex gap-2 text-sm flex-wrap">
                                        {animeData?.studios?.map((studio: { name: string, url: string, mal_id: number }, index: number) => (
                                            <Link href={"/studios/" + studio?.mal_id || ""} key={index} className="cursor-pointer py-1 px-3 border-2 border-purple-600 rounded-2xl hover:bg-purple-600 hover:text-white">
                                                {studio?.name}
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-purple-400 text-lg">Unknown</span>
                                )}
                            </div>
                            <div className="text-lg">
                                <span>Brodcast :</span>
                                <span className="ml-2 text-purple-400">{jpnToInd(animeData?.broadcast?.day || "Sundays", animeData?.broadcast?.time || "17:00") as string}</span>
                            </div>
                            <div className="text-lg">
                                <span>Season :</span>
                                <span className="ml-2 text-purple-400">{animeData?.season === null ? "Unknown" : `${animeData?.season} ${animeData?.year}`}</span>
                            </div>
                            <div className="text-lg">
                                <span>Episodes :</span>
                                <span className="ml-2 text-purple-400">
                                    {animeData?.episodes === null ? "Unknown" : `${animeData?.episodes} Episodes of ${animeData?.duration}`}
                                </span>
                            </div>
                            <div className="text-lg">
                                <span>Aired :</span>
                                <span className="ml-2 text-purple-400">{animeData?.aired.string}</span>
                            </div>
                            <div className="text-lg">
                                <span>Type :</span>
                                <span className="ml-2 text-purple-400">{animeData?.type ?? "Unknown"}</span>
                            </div>
                            <div className="text-lg">
                                <span>Status :</span>
                                <span className="ml-2 text-purple-400">{animeData?.status ?? "Unknown"}</span>
                            </div>
                            {animeData?.airing && (
                                <div className="text-lg">
                                    <span>Next Episode :</span>
                                    <CountdownDisplay animeData={animeData} />
                                </div>
                            )}
                            <div className="text-lg">
                                <span>For More Info : </span>
                                <span className="ml-2 text-purple-400">
                                    <a href={animeData?.url} target="_blank" className="underline-offset-0">MyAnimeList</a>
                                </span>
                            </div>
                        </div>
                    </div>
                    {
                        animeData.relations.length > 0 && (
                            <div className="w-[90%] my-4  mx-auto flex max-md:flex-col max-md:gap-5 justify-between">
                                {prequel.length > 0 ? <div className="flex flex-col gap-1 cursor-pointer border-2 border-purple-600 rounded-2xl hover:bg-purple-500/40 p-4 max-w-90 overflow-hidden" onClick={() => router.push(`/anime/${prequel[0].mal_id}`)}>
                                    <span>Prequel</span>
                                    <span className="text-purple-500 w-full line-clamp-1">{prequel[0].name}</span>
                                </div> : <span></span>}
                                {sequel.length > 0 ? <div className="flex flex-col gap-1 cursor-pointer border-2 border-purple-600 rounded-2xl hover:bg-purple-500/40 p-4 overflow-hidden max-w-90" onClick={() => router.push(`/anime/${sequel[0].mal_id}`)}>
                                    <span>Sequel</span>
                                    <span className="text-purple-500 w-full line-clamp-1">{sequel[0].name}</span>
                                </div> : <span></span>}
                            </div>
                        )
                    }
                    {animeData?.synopsis && (
                        <div className="synopsis w-[90%] mx-auto flex flex-col gap-4">
                            <h2 className="text-3xl font-bold">Synopsis</h2>
                            <div
                                ref={synopsisScroll}
                                className={`relative transition-all duration-300 ${toggle ? "md:max-h-125 scrollbar-custom" : "md:max-h-32 max-h-85 overflow-hidden"}`}
                            >
                                <p className="text-lg pr-2">{animeData?.synopsis}</p>
                                {(!toggle && animeData?.synopsis?.length > 700) && (
                                    <div className="absolute bottom-0 left-0 w-full h-12 bg-linear-to-t from-black to-transparent pointer-events-none" />
                                )}
                            </div>
                            {animeData?.synopsis?.length > 700 && (
                                <button onClick={() => setToggle(!toggle)} className="self-end text-red-400 hover:text-red-300 transition">
                                    {toggle ? "Read Less" : "Read More"}
                                </button>
                            )}
                        </div>
                    )}
                    {
                        characters && characters?.length > 0 && (
                            <div className="w-[90%] mx-auto my-4">
                                <h2 className="text-3xl font-bold my-2">Characters</h2>
                                <div className="flex overflow-x-scroll pb-5 mb:gap-4 gap-2 custom-scrollbar ">
                                    {characters.map((val: CharacterType, index: number) => (
                                        <div key={index} className="overflow-hidden min-w-20 border-2 rounded-2xl border-purple-700">

                                            {
                                                (val?.character?.images?.webp || val?.character?.images?.jpg?.image_url )&&
                                                <Image
                                                    src={val.character.images.webp.image_url || val.character.images.jpg.small_image_url}
                                                    alt={val.character.name}
                                                    loading="lazy"
                                                    width={50}
                                                    height={70}
                                                    className="w-20 h-30"
                                                />
                                            }
                                            <h3 className="text-[15px] w-20 text-center font-bold py-2">{val.character.name}</h3>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    }
                    {
                        animeData?.relations?.length > 0 && others.length > 0 && (
                            <div className="w-[90%] flex flex-col mx-auto">

                                <div className={`relative flex items-center flex-wrap w-full my-4 mx-auto ${showAllRelations && "flex-col items-start"}`}>
                                    <span className="font-bold mr-2">Other Related Anime :</span>

                                    {visibleOthers.map((rel: RelationEntry, i: number) => (
                                        <span
                                            key={rel.mal_id}
                                            className={`cursor-pointer pr-3 max-sm:border-none border-r-2 mr-3 border-white text-purple-600 hover:text-white flex gap-2  items-center ${i === visibleOthers.length - 1 && "border-none"} ${showAllRelations && " mb-2 border-none"}`}
                                            onClick={() => router.push(`/anime/${rel.mal_id}`)}
                                        >
                                            {rel?.name}
                                        </span>
                                    ))}
                                    {(!showAllRelations && others.length > 5) && <div className="absolute bottom-0 left-0 w-full h-8 bg-linear-to-t from-black to-transparent pointer-events-none" />}
                                </div>

                                {/* Read More / Less */}
                                {others.length > 5 && (
                                    <button
                                        onClick={() => setShowAllRelations(prev => !prev)}
                                        className="self-end text-red-400 hover:text-red-300 transition"
                                    >
                                        {showAllRelations ? "Read Less" : "Read More"}
                                    </button>
                                )}
                            </div>
                        )
                    }
                    {animeData?.trailer?.embed_url && (
                        <iframe
                            src={animeData?.trailer?.embed_url || ""}
                            className="block md:w-200 md:h-100 w-[90%] h-60 mx-auto my-10"
                            allowFullScreen
                        />
                    )}
                </>
            )}
        </main>
    );
}

export default AnimeContent;