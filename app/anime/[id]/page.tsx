"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation";
import useGetData from "@/hooks/useGetData";
import { ArrowBigLeftDash } from "lucide-react";



type Genre = {
    mal_id: number;
    name: string;
}
const AnimeContent = () => {
    // const anime: newPost[] = Anime as newPost[];
    const param = useParams();
    const searchParams = useSearchParams();
    const url = new URL(searchParams.get("from") || "", "http://localhost:3000");
    const rawId = Number(Array.isArray(param?.id) ? param.id[0] : param?.id);

    const id = rawId ?? null;
    const { anime, loading,error } = useGetData({
        url: "/api/fetchOneAnime",
        id
    });
    if (error) {
        throw new Error(error);
    }
    const router = useRouter();
    const [toggle, setToggle] = useState(false)
    const days = ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"];
    const synopsisScroll = useRef<HTMLDivElement>(null);

    function jpnToInd(day: string, time24: string) {
        let [h, m] = time24.split(":").map(Number);

        // subtract 3h 30m
        m -= 30;
        if (m < 0) {
            m += 60;
            h -= 1;
        }

        h -= 3;

        let dayIndex = days.indexOf(day);

        if (h < 0) {
            h += 24;
            dayIndex = (dayIndex - 1 + 7) % 7;
        }

        return days[dayIndex] + ` at ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} IST`
    }
    useEffect(() => {
        synopsisScroll.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, [toggle]);

    return (
        <main className="min-h-screen py-10">
            {loading && <div className="flex justify-center items-center h-screen w-full">
                <div className="w-24 h-24 border-4 border-gray-300 border-t-purple-900 rounded-full animate-spin"></div>
            </div>}
            {!loading && (
                <>
                    <div className="title w-full flex items-center">
                        <ArrowBigLeftDash className="size-10 ml-10 max-md:hidden cursor-pointer" onClick={() => router.push(url.pathname + url.search)} />
                        <div className="w-[90%] text-center mx-auto ">

                            <h1 className="text-center text-2xl max-md:text-xl text-purple-300 max-md:pb-2 max-md:border-b-2">{anime[0].title}</h1>
                            <h2 className="text-center text-2xl max-md:text-xl text-purple-200 max-md:pt-2 ">{anime[0].title_english}</h2>
                        </div>
                    </div>
                    <div className="main w-[90%] min-h-96 flex max-md:flex-col justify-center items-start my-10 gap-10 mx-auto">
                        <div className="md:w-[20%] w-full h-full">
                            <Image src={anime[0].images.jpg.image_url} alt={anime[0].title} width={300} height={300} className="w-full aspect-auto min-h-[90%] object-cover" />
                            <span className="flex justify-center items-center gap-1.5 text-xl w-full bg-purple-950">
                                Score:
                                <span className="text-purple-400 py-1"> {anime[0].score} </span> (
                                {anime[0].scored_by})
                            </span>
                            <span className="flex justify-center items-center gap-1.5 text-xl w-full border-t-black border-t-2 bg-purple-950">
                                Status:
                                <span className="text-purple-400 py-1"> {anime[0].status} </span>
                            </span>
                        </div>
                        <div className="w-full h-full flex flex-col gap-2">
                            {/* Synopsis */}
                            <div className="synopsis w-full flex flex-col gap-4">
                                <h2 className="text-3xl font-bold">Synopsis</h2>

                                <div
                                    ref={synopsisScroll}
                                    className={`relative transition-all duration-300 ${toggle ? "md:max-h-125 scrollbar-custom " : "md:max-h-32 max-h-85 overflow-hidden"
                                        }`}
                                >
                                    <p className="text-lg pr-2 ">
                                        {anime[0].synopsis}
                                    </p>

                                    {/* fade overlay when collapsed */}
                                    {(!toggle && anime[0].synopsis.length > 700) && (
                                        <div className="absolute bottom-0 left-0 w-full h-12 bg-linear-to-t from-black to-transparent pointer-events-none" />
                                    )}
                                </div>

                                {anime[0].synopsis.length > 700 && <button
                                    onClick={() => setToggle(!toggle)}
                                    className="self-end text-red-400 hover:text-red-300 transition"
                                >
                                    {toggle ? "Read Less" : "Read More"}
                                </button>}
                            </div>


                            <div className="flex items-center gap-4 flex-wrap">
                                <span className="text-lg">Genre :</span>

                                <div className="flex gap-2 text-sm flex-wrap">
                                    {anime[0].genres.map((genre: Genre, index: number) => (
                                        <button
                                            key={index}
                                            className="cursor-pointer py-1 px-3 border-2 border-purple-600 rounded-2xl hover:bg-purple-600 hover:text-white transition"
                                            onClick={() => router.push(`/genres/${genre.mal_id}`)}
                                        >
                                            {genre.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="text-lg">
                                <span>Brodcast :</span>
                                <span className="ml-2 text-purple-400">{jpnToInd(anime[0].broadcast.day || "Sundays", anime[0].broadcast.time || "17:00")}</span>
                            </div>
                            <div className="text-lg">
                                <span>Season :</span>
                                <span className="ml-2 text-purple-400">{anime[0].season === null ? "Unknown" : `${anime[0].season} ${anime[0].year}`}</span>
                            </div>
                            <div className="text-lg">
                                <span>Episodes :</span>
                                <span className="ml-2 text-purple-400">
                                    {anime[0].episodes === null ? "Unknown" : `${anime[0].episodes} Episodes of ${anime[0].duration}`}
                                </span>
                            </div>
                            <div className="text-lg flex gap-4">
                                <span>Studios : </span>
                                {anime[0]?.studios?.length > 0 ?
                                    <div className="flex gap-2 text-sm flex-wrap ">
                                        {
                                            anime[0]?.studios?.map((studio: { name: string, url: string }, index: number) => (
                                                <a
                                                    href={studio.url}
                                                    target="_bla"
                                                    key={index}
                                                    className="cursor-pointer py-1 px-3 border-2 border-purple-600 rounded-2xl hover:bg-purple-600 hover:text-white transition"
                                                >
                                                    {studio.name}
                                                </a>
                                            ))
                                        }
                                    </div>
                                    : <span className=" text-purple-400 text-lg">Unknown</span>}
                            </div>
                            <div className="text-lg">
                                <span>For More Info : </span>
                                <span className="ml-2 text-purple-400">
                                    <a href={anime[0].url} target="_blank" className="underline-offset-0">MyAnimeList</a>
                                </span>
                            </div>
                        </div>
                    </div>
                    {anime[0].trailer.embed_url && (

                        <iframe src={anime[0].trailer.embed_url || ""} className=" block md:w-200 md:h-100 w-[90%] h-60 mx-auto my-10"
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