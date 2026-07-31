"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type TitleLanguageContextType = {
    titleLanguageJP: boolean;
    setTitleLanguageJP: React.Dispatch<React.SetStateAction<boolean>>;
};

const TitleLanguageContext = createContext<
    TitleLanguageContextType | undefined
>(undefined);

export function TitleLanguageToggleProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [titleLanguageJP, setTitleLanguageJP] = useState(false);

    return (
        <TitleLanguageContext.Provider
            value={{ titleLanguageJP, setTitleLanguageJP }}
        >
            {children}
        </TitleLanguageContext.Provider>
    );
}

export function useTitleLanguageToggle() {
    const ctx = useContext(TitleLanguageContext);

    if (ctx === undefined) {
        throw new Error(
            "useTitleLanguageToggle must be used inside TitleLanguageToggleProvider"
        );
    }

    return ctx;
}