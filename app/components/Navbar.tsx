import { useEffect, useState } from 'react'
import { useTheme } from '~/utils/ThemeProvider';

export default function Navbar(){
    const [theme, setTheme] = useTheme();
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return <div>
        <button onClick={toggleTheme}>Theme: {theme}</button>
    </div>
}