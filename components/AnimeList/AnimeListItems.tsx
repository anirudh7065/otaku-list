"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { newPost } from "@/types/newPost";
import { ArrowBigLeftDash } from "lucide-react";
import Link from "next/link";

const AnimeListItems = ({ title, page, anime, setPage, maxPages, genre = false }: { title: string, page: number, anime: newPost[], setPage: React.Dispatch<React.SetStateAction<number>>, maxPages: number, genre?: boolean }) => {
    const router = useRouter();

  return (
      <div className="">
          <div className="py-4 w-full flex justify-center items-center" >
              {genre && <ArrowBigLeftDash className="size-10" onClick={()=>router.back()} />}
              <span className="w-[80%] text-4xl font-bold text-center">
              {title}
              </span>
          </div>
          <div className="flex justify-center items-center flex-wrap">
              {anime?.length === 0 && <div className="flex justify-center items-center h-screen w-full">
                  <div className="w-24 h-24 border-4 border-gray-300 border-t-purple-900 rounded-full animate-spin"></div>
              </div>}
              
              {anime?.map((item, index) => (
                  <div key={index}
                      className="max-w-sm hover:-translate-y-3 transition-transform duration-200 hover:shadow-lg hover:shadow-purple-400 rounded-2xl border-3 border-purple-200 shadow-md dark:border-purple-900 m-4 h-105 w-75 "
                  >
                          <Link href={item.url} target="_blank">
                      <Image
                          src={item.images.jpg.image_url || item.images.webp.image_url}
                          alt={item.title}
                          width={300}
                          height={300}
                              className="h-[80%] w-full aspect-auto p-4  object-cover bg-linear-to-br from-black via-gray-700  to-black rounded-t-xl  backdrop-blur-md"
                          />
                      <h2 className="text-md px-1 font-bold text-center  border-t-4 py-2 border-purple-700 w-full h-20 overflow-hidden ">{item.title}</h2>
                      </Link>
                  </div>
              ))}
          </div >
          <div className="w-full flex justify-center items-center pb-12 gap-4">

              <button
                  onClick={() => {
                      setPage(page - 1)
                  }}
                  className="py-1 px-4 bg-amber-100 text-black rounded-3xl font-bold">Previous</button>
              <p className="py-2 px-4 bg-amber-100 text-black rounded-3xl font-bold">{page} / {maxPages}</p>
              <button
                  onClick={() => {
                      setPage(page + 1)
                  }
                  } className={`${page === maxPages ? "hidden" : ""} py-1 px-4 bg-amber-100 text-black rounded-3xl font-bold`}>Next</button>
          </div>
      </div>
  )
}

export default AnimeListItems