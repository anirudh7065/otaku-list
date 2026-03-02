"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { newPost } from "@/types/newPost";
import { ArrowBigLeftDash } from "lucide-react";
import AnimeCountdown from "./AnimeCountDown";



const AnimeListItems = ({ title, page, anime, setPage, maxPages, genre = false, schedule = false }: {
    title: string, page?: number, anime: newPost[], setPage?: (page: number) => void

, maxPages?: number, genre?: boolean, schedule?: boolean }) => {
    const router = useRouter();
    

  return (
      <div className="cursor-pointer select-none ">
          <div className={`py-4 ${schedule ? " " : "px-15"} w-full flex justify-center gap-15 items-center mx-auto`} >
              {genre && <ArrowBigLeftDash className="size-14  max-md:hidden" onClick={()=>router.back()} />}
              <span className={` w-full font-bold text-center ${schedule ? "text-2xl my-6 bg-purple-900 py-2 " : "text-4xl py-5"}`}>
              {title}
              </span>
          </div>
          <div className="flex flex-wrap justify-center md:gap-6 gap-4 max-w-full  mx-auto">

              {anime?.length === 0 && <div className="flex justify-center items-center h-screen w-full">
                  <div className="w-24 h-24 border-4 border-gray-300 border-t-purple-900 rounded-full animate-spin"></div>
              </div>}
              
              {anime?.map((item, index) => (
                  <div key={index}>
                  <div
                      className="hover:-translate-y-2 transition-transform duration-200 rounded-2xl border-3 border-purple-200 shadow-md dark:border-purple-900 hover:scale-[1.02] h-56 w-42 hover:ring-3 hover:ring-purple-400 md:w-70 md:h-105 max-md:overflow-hidden relative
                      "
                      onClick={() => router.push(`/anime/${item.mal_id}?from=${encodeURIComponent(window.location.href)}`)}
                      >
                      <Image
                          src={item.images.webp.medium_image_url || item.images.jpg.medium_image_url ||item.images.webp.image_url || ""}
                          alt={item.title}
                          sizes="(max-width: 768px) 120px, 300px"
                          width={300}
                          height={300}
                          priority={index<6}
                          fetchPriority="high"
                          className="h-full md:h-84 w-full  md:p-4  object-cover bg-linear-to-br from-black via-gray-700  to-black rounded-t-xl transform-[translateZ(0)] will-change-transform "
                          />
                          <div className="md:text-[15px] text-xs md:px-1 text-center  md:border-t-4 md:py-3 py-2 border-purple-700  w-full md:h-18 overflow-hidden  h-12 max-md:relative max-md:bottom-12 max-md:bg-black/80 max-md:z-10 line-clamp-2"><span className="w-full line-clamp-2 font-bold ">{item.title}</span></div>
                  </div>
                 {item.airing && schedule && < AnimeCountdown  day={item?.broadcast.day ?? ""} time={item.broadcast.time || ""} />}
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