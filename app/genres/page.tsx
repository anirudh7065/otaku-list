import Link from "next/link";
import genres from "@/constants/genresData.json";
type Genre = {
  mal_id: number;
  name: string;
}

const Genres = () => {

  return (
    <main className="w-full min-h-screen ">
        <h1 className="text-4xl font-bold text-center mt-10">Genres</h1>
          {genres.length === 0 ? (
        <p className="text-center mt-10">Loading genres...</p>
      ) : (
        <div className=" md:w-[80%] w-[95%] py-4 px-2 pb-20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mx-auto">
          {genres?.map((genre: Genre) => (
            <Link   href={`/genres/${genre.mal_id}`} key={genre.mal_id} className="border p-4 rounded-lg hover:shadow-lg transition-shadow">
              <h2 className="text-sm md:text-lg font-semibold">{genre.name}</h2>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}

export default Genres