"use client";

import { useEffect, useRef } from "react";
import AnimeSearch from "./AnimeSearch";

const AnimeSearchDesktopWrapper = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<{ clear: () => void }>(null);

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
        <div ref={containerRef} className="max-lg:hidden">
            <AnimeSearch ref={searchRef} />
        </div>
    );
};

export default AnimeSearchDesktopWrapper;
