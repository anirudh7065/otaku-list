"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type SearchToggleContextType = {
    searchToggle: boolean;
    setSearchToggle: React.Dispatch<React.SetStateAction<boolean>>;
};

const SearchToggleContext = createContext<SearchToggleContextType | null>(null);

export function SearchToggleProvider({ children }: { children: ReactNode }) {
    const [searchToggle, setSearchToggle] = useState(false);

    return (
        <SearchToggleContext.Provider value={{ searchToggle, setSearchToggle }}>
            {children}
        </SearchToggleContext.Provider>
    );
}

export function useSearchToggle() {
    const ctx = useContext(SearchToggleContext);
    if (!ctx) {
        throw new Error("useSearchToggle must be used inside SearchToggleProvider");
    }
    return ctx;
}
