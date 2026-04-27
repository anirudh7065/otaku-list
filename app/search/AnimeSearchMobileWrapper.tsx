'use client';
import AnimeSearch from "@/app/search/AnimeSearch";
import { useSearchToggle } from "@/context/SearchToggleContext";

const AnimeSearchMobileWrapper = () => {
    const { searchToggle, setSearchToggle } = useSearchToggle();

    if (!searchToggle) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            onClick={() => setSearchToggle(false)} 
        >
            <div
                className="mt-6 lg:hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <AnimeSearch />
            </div>
        </div>
    );
};

export default AnimeSearchMobileWrapper;
