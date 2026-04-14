"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { newPost } from "@/types/newPost";
import { ArrowBigLeftDash, Star } from "lucide-react";
import AnimeCountdown from "./AnimeCountDown";




const AnimeListItems = ({ title, page, animes, setPage, maxPages, genre = false, schedule = false, myList=false }: {
    title: string, page?: number, animes: newPost[], setPage?: (page: number) => void

    , maxPages?: number, genre?: boolean, schedule?: boolean, myList?: boolean, }) => {
    const router = useRouter();

    const memberParse = (members: number) => {
        const num = Number(members);
        if (!num) return 0;

        if (num < 1_000) return num;
        if (num < 100_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
        if (num < 10_000_000) return (num / 100_000).toFixed(1).replace(/\.0$/, "") + "L";
        return (num / 10_000_000).toFixed(1).replace(/\.0$/, "") + "C";
    };

  return (
      <div className="cursor-pointer select-none w-screen ">
          <div className={`py-4 ${schedule ? " " : "px-15"} w-full flex justify-center gap-15 items-center mx-auto`} >
              {(genre || myList) && <ArrowBigLeftDash className="size-14  max-md:hidden" onClick={()=>router.back()} />}
              <span className={` w-full font-bold text-center ${schedule ? "text-2xl my-6 bg-purple-900 py-2 " : "text-4xl py-5"}`}>
              {title}
              </span>
          </div>
          <div className="flex flex-wrap justify-center md:gap-6 gap-4 max-w-full  mx-auto">

              {animes?.length === 0 && <div className="flex justify-center items-center h-screen w-full">
                  <div className="w-24 h-24 border-4 border-gray-300 border-t-purple-900 rounded-full animate-spin"></div>
              </div>}
              
              {animes?.map((anime, index) => (
                  <div key={index}>
                  <div
                      className="hover:-translate-y-2 transition-transform duration-200 rounded-2xl border-3 border-purple-200 shadow-md dark:border-purple-900 hover:scale-[1.02] h-56 w-40 hover:ring-3 hover:ring-purple-400 md:w-70 md:h-105 max-md:overflow-hidden relative
                      "
                          onClick={() => router.push(`/anime/${anime.mal_id}?from=${encodeURIComponent(window.location.href)}`)}
                      >
                      <Image
                              src={anime.images.webp.image_url|| anime.images.jpg.image_url || anime.images.webp.image_url || ""}
                              alt={anime.title}
                          sizes="(max-width: 768px) 120px, 300px"
                          width={300}
                          height={300}
                          priority={index<6}
                          fetchPriority="high"
                          className="h-full md:h-84 w-full  md:p-4  object-cover bg-linear-to-br from-black via-gray-700  to-black rounded-t-xl transform-[translateZ(0)] will-change-transform "
                          />
                          <div className="md:text-[18px] text-xs md:px-1 text-center  md:border-t-4 md:py-3 py-2 border-purple-700  w-full md:h-18 overflow-hidden  h-12 max-md:relative max-md:bottom-12 max-md:bg-black/80 max-md:z-10 line-clamp-2"><span className="w-full line-clamp-2 font-bold ">{anime.title}</span></div>
                  </div>
                      <div className="flex justify-center items-center gap-1.5 md:text-lg text-xs  w-full ">
                          <div className="flex items-center gap-1">
                          <Star color="#fff82e" size={15} fill="#fff82e" />
                              <span className="text-purple-400 py-1"> {anime.score ?? "-"} </span>
                          </div>
                          ({anime.members ? memberParse(anime.members) : anime.members ?? "-"})
                      </div>
                      {anime.airing && schedule && < AnimeCountdown day={anime?.broadcast.day ?? ""} time={anime.broadcast.time || ""} />}
                </div>
              ))}
          </div >
          {(setPage && page && maxPages) &&
              <div className="w-full flex justify-center items-center pb-20 md:pb-12  my-4 gap-4 ">

              <button
                  onClick={() => {
                          setPage(page <= maxPages ? page - 1 : maxPages)
                    }}
                    className="py-1 px-4 bg-amber-100 text-black rounded-3xl font-bold">Previous</button>
              <p className="py-2 px-4 bg-amber-100 text-black rounded-3xl font-bold">{page} / {maxPages}</p>
              <button
                  onClick={() => {
                      setPage(page <=maxPages ?page + 1: maxPages)
                    }
                } className={`${page === maxPages ? "hidden" : ""} py-1 px-4 bg-amber-100 text-black rounded-3xl font-bold`}>Next</button>
          </div>
        }
      </div>
  )
}

export default AnimeListItems