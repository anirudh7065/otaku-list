"use client";
import useCountdown from "@/hooks/useCountdown";
import jpnToInd from "@/lib/japaneseToIndianTime";

export default function AnimeCountdown({
    day,
    time,
}: {
    day?: string;
    time?: string;
}) {
    const countdown = useCountdown(
        day && time ? jpnToInd : null,
        day ?? null,
        time ?? null
    );

    if (!day || !time) return null;

    return (
        <p className="text-xs md:text-lg py-2 text-purple-400 text-center">
            {countdown}
        </p>
    );
}
