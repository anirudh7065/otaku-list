"use client"
import AnimeListItems from "@/components/AnimeList/AnimeListItems";
import AnimeScheduleLoader from "@/components/Loaders/AnimeScheduleLoader";
import useGetData from "@/hooks/useGetData";
import type { newPost } from "@/types/newPost";
import { useEffect,useState } from "react";
export default function AnimeScheduleContent({ InitialData }: { InitialData: { key: string, value: newPost[] } }) {

    const { anime, loading, error } = useGetData({
        url: "/api/fetchSchedule",
        enabled: !InitialData
    });
    const animeData: { key: string, value: newPost[] } = InitialData ?? anime;
    if (error) {
        throw new Error(error);
    }
    useEffect(() => {
        document.title = "Schedule - Otakulist";
    });

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
       (()=> setMounted(true))();
        document.title = "Schedule - Otakulist";
    }, []);

    if (!mounted) return <AnimeScheduleLoader />;
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return (
        <main className="pt-10 pb-20">
            <h1 className="w-full text-4xl font-bold text-center">Schedule</h1>
            {!animeData && loading && <AnimeScheduleLoader />}

            {animeData &&
                Object.entries(animeData ?? {}).map(([day, val]) => {
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
