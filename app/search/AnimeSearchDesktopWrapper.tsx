"use client";

import { useEffect, useRef } from "react";
import AnimeSearch from "./AnimeSearch";
import { useTitleLanguageToggle } from "@/context/TitleLanguageContext";

const AnimeSearchDesktopWrapper = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<{ clear: () => void }>(null);
    const {setTitleLanguageJP, titleLanguageJP} = useTitleLanguageToggle();

    useEffect(() => {
        const handler = (e: PointerEvent) => {
            if (!containerRef.current) return;

            if (!containerRef.current.contains(e.target as Node)) {
                searchRef.current?.clear();
            }
        };

        window.addEventListener("pointerdown", handler);
        return () => window.removeEventListener("pointerdown", handler);
    }, []);

    return (
        <div ref={containerRef} className="max-lg:hidden flex gap-2 items-center">
            <AnimeSearch ref={searchRef} />
            <div className="flex items-center justify-center h-7 rounded-2xl bg-zinc-800 overflow-hidden">
                <span className={`${!titleLanguageJP && "bg-primary-active text-black"} h-full place-content-center px-2 font-extrabold`} onClick={() => setTitleLanguageJP(false)}>EN</span>
                <span className={`${titleLanguageJP && "bg-primary-active text-black"} h-full place-content-center px-2 font-extrabold`} onClick={() => setTitleLanguageJP(true)}>JP</span>
            </div>
        </div>
    );
};

export default AnimeSearchDesktopWrapper;