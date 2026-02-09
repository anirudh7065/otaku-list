"use client"
import type { newPost } from "@/types/newPost";
import Anime from "@/app/api/fetchMyAnime/anime_data.json"
import Image from "next/image";
import { useRouter } from "next/navigation";
import {useState} from "react"
const AnimeContent = () => {
    const anime: newPost[] = Anime as newPost[];
    const router = useRouter();
    const [toggle, setToggle] = useState(false)
    const days = ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"];

    function jpnToInd(day: string, time24:string) {
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

        return days[dayIndex]+` at ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} IST`
    }

    return (
        <main className="w-full h-screen overflow-y-auto no-scrollbar">
            <div className="title w-full bg-purple-950 ">
                <h1 className="text-center text-2xl text-purple-300">{anime[0].title}</h1>
                <h2 className="text-center text-2xl text-purple-200">{anime[0].title_english}</h2>
            </div>
            <div className="main w-[90%] min-h-96 flex justify-center items-start my-10 gap-10 mx-auto">
                <div className="w-[20%] h-full">
                    <Image src={anime[0].images.jpg.image_url} alt={anime[0].title} width={300} height={300} className="w-full aspect-auto h-[90%] object-cover" />
                    <span className="flex justify-center items-center text-xl w-full bg-purple-950">
                        Score:{" "}
                        <span className="text-purple-400">{anime[0].score}</span> (
                        {anime[0].scored_by})
                    </span>
                </div>
                <div className="w-full h-full flex flex-col gap-2">
                    {/* Synopsis */}
                    <div className="synopsis w-full flex flex-col gap-4">
                        <h2 className="text-3xl font-bold">Synopsis</h2>

                        <div
                            className={`relative transition-all duration-300 ${toggle ? "max-h-125 overflow-y-scroll " : "max-h-32 overflow-hidden"
                                }`}
                        >
                            <p className="text-lg pr-2 ">
                                {anime[0].synopsis}
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam
                                necessitatibus explicabo sunt dolorem omnis dolores at tempore labore
                                velit, quas expedita earum eius laborum similique? Rem commodi impedit
                                itaque nulla, quos tempora laborum iure asperiores officiis. Fugit
                                harum distinctio non et dolorum velit autem, quaerat maxime officia
                                repellat neque quam!
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum porro natus, minima necessitatibus inventore molestiae eaque ut unde, deserunt aut at. Architecto impedit id, commodi sapiente veritatis inventore quam, aspernatur aperiam quis ex, autem cum molestiae. Accusamus error temporibus qui expedita minus natus a, aliquam corporis beatae ipsam provident! Perspiciatis.
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae adipisci assumenda doloremque, saepe libero repellendus magnam alias nulla? Quo omnis possimus delectus suscipit qui alias. Quod neque quae itaque, fugiat sapiente architecto modi aspernatur sunt iste pariatur odit magni, a consequatur fugit excepturi libero maiores esse perspiciatis! Illo nobis voluptates labore nostrum harum voluptatem natus odio cum eos, dolorem aperiam sequi quasi aliquid explicabo ab sunt. Minima cupiditate placeat quaerat atque eum obcaecati? Modi, non fugiat cupiditate doloremque eum labore voluptas animi explicabo laborum eveniet quia reprehenderit tenetur atque esse porro, magni debitis odit molestiae iusto ut quasi, dignissimos dolores. Totam ex unde quis. Asperiores perferendis quibusdam placeat esse non atque, tempora rerum dolore consequatur corrupti dolorem, natus quidem blanditiis eligendi culpa tempore? Amet optio incidunt architecto iste eligendi voluptates esse! Fuga, magni dolor accusantium voluptatum a maiores doloremque qui, fugit id placeat vero quo velit? Ad autem soluta totam vitae similique tempore beatae esse voluptatibus. Consectetur ab nemo soluta et perferendis at atque, itaque a, necessitatibus fuga, esse minima doloremque dignissimos repellendus obcaecati omnis natus dolor assumenda rerum eveniet! Corporis facilis inventore dolores quibusdam, perferendis minus, nam alias voluptatibus nihil quia accusamus amet similique eaque enim animi iure perspiciatis! Quae eos nostrum fugiat sed sapiente asperiores neque eius dolorem corrupti voluptatem, cumque illum voluptas recusandae nihil, odio numquam inventore? Nostrum praesentium sapiente numquam ipsam quo. Perferendis minima neque, eum ut voluptates sunt vitae est tempora asperiores sit corrupti nulla blanditiis atque repellendus, iste provident beatae! Consectetur dicta iste expedita.
                            </p>

                            {/* fade overlay when collapsed */}
                            {!toggle && (
                                <div className="absolute bottom-0 left-0 w-full h-12 bg-linear-to-t from-black to-transparent pointer-events-none" />
                            )}
                        </div>

                        <button
                            onClick={() => setToggle(!toggle)}
                            className="self-end text-red-400 hover:text-red-300 transition"
                        >
                            {toggle ? "Read Less" : "Read More"}
                        </button>
                    </div>


                        <div className="flex items-center gap-4 flex-wrap">
                            <span className="text-lg">Genre :</span>

                            <div className="flex gap-2 text-sm flex-wrap">
                                {anime[0].genres.map((genre, index) => (
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
                            <span className="ml-2 text-purple-400">{anime[0].season} {anime[0].year}</span>
                        </div>
                        <div className="text-lg">
                            <span>Episodes :</span>
                        <span className="ml-2 text-purple-400">
                            {anime[0].episodes} Episodes of {anime[0].duration}
                        </span>
                        </div>
                </div>
            </div>
            <iframe src={anime[0].trailer.embed_url || ""}   className=" block w-150 h-100 mx-auto mb-10"></iframe>
            
        </main>
    )
}

export default AnimeContent