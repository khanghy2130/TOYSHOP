import { createContext, useContext, useState, useRef, useEffect } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { useFetcher } from "@remix-run/react";

const themes = ["light", "dark"] as const;
export type ThemeType = typeof themes[number]

type ThemeContextType = [ThemeType | null, Dispatch<SetStateAction<ThemeType | null>>];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({
    children, 
    specifiedTheme
}: { 
    children: ReactNode, 
    specifiedTheme: ThemeType | null; 
}) {
    const [theme, setTheme] = useState<ThemeType | null>(() => {
        if (specifiedTheme) {
            if (themes.includes(specifiedTheme)) {
                return specifiedTheme;
            } 
        }
        return "dark";
    });

    const persistTheme = useFetcher();
    // storing persistTheme as a ref
    const persistThemeRef = useRef(persistTheme);
    useEffect(() => {
        persistThemeRef.current = persistTheme;
    }, [persistTheme]);

    const mountRun = useRef(false);
    // this effect won't update the cookie on initial mount
    useEffect(() => {
        if (!mountRun.current) {
            mountRun.current = true;
            return;
        }
        if (!theme) return;
        persistThemeRef.current.submit(
            { theme }, { action: 'action/set-theme', method: 'POST' }
        );
    }, [theme]);

    return (
        <ThemeContext.Provider value={[theme, setTheme]}>
            {children}
        </ThemeContext.Provider>
    );
}

function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

function isTheme(value: unknown): value is ThemeType {
    return themes.includes(value as ThemeType);
}

export { ThemeProvider, useTheme, themes, isTheme };