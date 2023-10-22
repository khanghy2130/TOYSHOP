import { useEffect, useState } from 'react'

type ThemeType = "dark"|"light"|null

export default function Navbar(){
    // theme switching
    const [theme, setTheme] = useState<ThemeType>(null)
    useEffect(() => {
        // first render? get theme from local storage
        if (theme === null) {
            ///// unknown type => check type
            const lsTheme: any = window.localStorage.getItem("theme") || "dark" // default
            setTheme(lsTheme)
        } 
        // after first render? save theme
        else {
            window.localStorage.setItem("theme", theme)
            document.body.classList.remove('light', 'dark')
            document.body.classList.add(theme)
        }
    }, [theme])

    return <div>
        <button onClick={()=>setTheme("dark")}>dark</button>
        <button onClick={()=>setTheme("light")}>light</button>
    </div>
}