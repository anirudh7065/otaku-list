"use client"
import useCountdown from "@/hooks/useCountdown";
import jpnToInd from "@/lib/japaneseToIndianTime";
import type { newPost } from "@/types/newPost";
export default function CountdownDisplay({ animeData }: { animeData: newPost }) {
    const countdown = useCountdown(
        animeData?.airing ? jpnToInd : null,
        animeData?.broadcast?.day ?? null,
        animeData?.broadcast?.time ?? null
    );


    return <span className="ml-2 text-purple-400">{countdown}</span>
}

