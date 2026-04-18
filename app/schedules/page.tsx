"use client"
import AnimeListItems from "@/components/AnimeList/AnimeListItems";
import AnimeScheduleLoader from "../../components/Loaders/AnimeScheduleLoader";
import useGetData from "@/hooks/useGetData";
import type { newPost } from "@/types/newPost";
export default function ScheduleContent() {

  const { anime, loading, error } = useGetData({
    url: "/api/fetchSchedule"
  });

  if (error) {
    throw new Error(error);
  }

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <main className="pt-10 pb-20">
      <h1 className="w-full text-4xl font-bold text-center">Schedule</h1>
      {loading && <AnimeScheduleLoader />}

      {!loading &&
        Object.entries(anime ?? {}).map(([day, val]) => {
          const uniqueAnime = Array.from(
            new Map((val as newPost[]).map(a => [a.mal_id, a])).values()
          );

          return (
            <AnimeListItems
              key={day}
              title={days[Number(day)]}
              animes={uniqueAnime}
              schedule={true}
            />
          );
        })}
    </main>
  )
}
