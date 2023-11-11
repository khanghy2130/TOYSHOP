import { useEffect, useState } from 'react'
import { Link } from "@remix-run/react";
import { useTheme } from '~/utils/ThemeProvider';

import titleLogoImage from "~/assets/title_logo.png"

export default function Navbar(){
    const [theme, setTheme] = useTheme();
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return <div>
        {/* <button onClick={toggleTheme}>Theme: {theme}</button> */}

        <div className=''>
            <div className='
                flex flex-row justify-between
                max-w-screen-lg mx-auto
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

    </div>
}