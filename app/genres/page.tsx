'use client'
import Link from "next/link";
import useGetData from "@/hooks/useGetData";
import Loader from "@/components/Loader";
import { Suspense } from "react";
import { GenreHeaderType } from "@/types/genreType";

const GenresContent = () => {

  const GenreHeader: GenreHeaderType = {
    genres: " Genres ",
    explicit_genres: "Explicit Genres",
    themes: "Themes",
    demographics: "Demographics",
  };
  const { genres, error, loading } = useGetData({
    url: "/api/fetchGenres",
  });


  if (error) {
    throw new Error(error);
  }
  return (
    <main className="w-full min-h-screen ">
      <h1 className="text-4xl font-bold text-center my-10">All Genres</h1>
      {loading ? (
        <Loader />
      ) : <section className="mb-10">
          {genres && Object.entries(genres)?.map(([key, val]) => (
            <article key={key}>
              <h1 className="w-full max-md:text-[25px] md:text-4xl font-bold text-center text-2xl my-6 bg-purple-900 py-3 ">{GenreHeader[key]}</h1>
          <div className=" md:w-[80%] w-[95%] py-4 px-2 pb-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mx-auto">
            {
                  val.length === 0 ? <p className="text-center mt-10">No {GenreHeader[key]} found</p>
                : val.map((genre) => (
                  <Link href={`/genres/${genre.mal_id}`} key={genre.mal_id} className="border p-4 rounded-lg hover:shadow-lg transition-shadow">
                    <h2 className="text-sm md:text-lg font-semibold">{genre.name}</h2>
                  </Link>
                ))
            }
          </div>
        </article>
        ))}
      </section>}
    </main>
  )
}
const Genres = () => {
  return (
    <Suspense fallback={<Loader />}>
      <GenresContent />
    </Suspense>
  )
}

export default Genres