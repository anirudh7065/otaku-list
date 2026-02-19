"use client";

import { useRef, useState } from "react";
import type { newPost } from "@/types/newPost";
import { useRouter } from "next/navigation";
import { useSearchToggle } from "@/context/SearchToggleContext";
import useGetData from "@/hooks/useGetData";
import Image from "next/image";
import { forwardRef, useImperativeHandle } from "react";


const AnimeSearch = forwardRef(function AnimeSearch({ cls }: { cls?: string }, ref) {

    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const { setSearchToggle } = useSearchToggle();

    const { anime, loading } = useGetData({
        url: "/api/fetchSearch",
        query: query.trim() ? query : undefined,
        page: 1,
    });

    const visibleResults = query.trim()
        ? anime
            .filter((a: newPost) => {
                const q = query.toLowerCase();
                return (
                    a.title?.toLowerCase().startsWith(q) ||
                    a.title_english?.toLowerCase().startsWith(q) ||
                    a.title_japanese?.startsWith(query)
                );
            })
            .slice(0, 5)
        : [];

    const closeSearch = () => {
        setQuery("");
        setActiveIndex(-1);
        setSearchToggle(false);
    };

    const goToAnime = (id: number) => {
        closeSearch();
        router.push(`/anime/${id}`);
    };

    const submitSearch = () => {
        const q = query.trim();
        if (!q) return;
        closeSearch();
        router.push(`/search?q=${encodeURIComponent(q)}`);
    };

    // keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => (i + 1) % visibleResults.length);
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) =>
                i <= 0 ? visibleResults.length - 1 : i - 1
            );
        }

        if (e.key === "Enter") {
            if (activeIndex >= 0) {
                goToAnime(visibleResults[activeIndex].mal_id);
            } else {
                submitSearch();
            }
        }

        if (e.key === "Escape") {
            closeSearch();
        }
    };
    useImperativeHandle(ref, () => ({
        clear() {
            setQuery("");
            setActiveIndex(-1);
        },
    }));




    return (
        <div
            ref={containerRef}
            className={`md:max-w-xl md:w-lg mx-auto max-sm:mt-4 relative z-50 max-sm:w-[90%] ${cls}`}
        >
            <div className="relative">
                <input
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setActiveIndex(-1);
                    }}
                    type="text"
                    onKeyDown={handleKeyDown}
                    placeholder="Search anime..."
                    className="w-full px-4 pr-10 py-2  border rounded-xl text-white border-gray-700 bg-zinc-900 focus:outline-none"
                />

                <button
                    type="button"
                    onClick={submitSearch}
                    className="absolute max-lg:hidden lg:right-2 top-1/2 -translate-y-1/2 z-10"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white opacity-80 hover:opacity-100"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </button>
            </div>


            {loading && query && (
                <p className="absolute left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl p-2">
                    Searching...
                </p>
            )}

            {visibleResults.length > 0 && (
                <ul className="absolute left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl max-h-100  overflow-hidden">
                    {visibleResults.map((anime: newPost, i: number) => (
                        <li
                            key={anime.mal_id}
                            onClick={() => goToAnime(anime.mal_id)}
                            className={`flex items-center gap-3 p-3 cursor-pointer  ${i === activeIndex
                                ? "bg-purple-700 text-white "
                                : "text-white hover:bg-zinc-800"
                                }`}
                        >
                            <Image
                                src={anime.images.webp.small_image_url || anime.images.jpg.small_image_url || ""}
                                width={20}
                                height={20}
                                alt={anime.title}
                                className="w-10 h-14 object-cover rounded"
                            />
                            <span>{anime.title}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
)


export default AnimeSearch