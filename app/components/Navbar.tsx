import { useEffect, useState, useRef } from 'react'
import { Link } from "@remix-run/react";
import { useTheme } from '~/utils/ThemeProvider';

import titleLogoImage from "~/assets/title_logo.png"

export default function Navbar(){
    const [theme, setTheme] = useTheme();
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    const lastScrollY = useRef<number>(0); // useRef allows handler to read updated data
    const [navIsShown, setNavIsShown] = useState<boolean>(true);

    const handleScroll = () => {
        setNavIsShown(window.scrollY <= lastScrollY.current);
        lastScrollY.current = window.scrollY;
    };

    // set up scroll event listener
    useEffect(()=>{
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [])

    const navShownStyle = navIsShown ? "top-0" : "-top-24";

    return <div className={navShownStyle +
    ' sticky transition-[top] ease-in-out duration-500 bg-red-800'}>
            {/* <button onClick={toggleTheme}>Theme: {theme}</button> */}

            <div className='
                flex flex-row justify-between
                max-w-screen-lg mx-auto h-auto
            '>
                <Link to="/">
                    <img src={titleLogoImage} 
                    className='w-40' />
                </Link>
                <div>
                    <Link to="/profile">
                        Profile
                    </Link>
                    <Link to="/store">
                        Store
                    </Link>
                    <Link to="/cart">
                        Cart
                    </Link>
                    <button>
                        More
                    </button>
                </div>
                
            </div>
        </div>
}