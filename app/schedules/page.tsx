import AnimeScheduleContent from "@/components/AnimeList/AnimeScheduleContent";
import type { newPost } from "@/types/newPost";
// app/anime/[id]/page.tsx
async function getAnime() {
  const res = await fetch(
    `${process.env.APP_BASE_URL || "http://localhost:3000"}/api/fetchSchedule`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data ?? null;
}


export default async function AnimePage() {
  const anime: { key: string, value: newPost[] } = await getAnime();
  return <AnimeScheduleContent InitialData={anime ?? undefined} />;
}