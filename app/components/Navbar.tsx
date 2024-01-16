import { useEffect, useState, useRef } from 'react'
import { Link } from "@remix-run/react";

import titleLogoImage from "~/assets/title_logo.png"
import useScrollBehavior from '../utils/Navbar/useScrollBehavior';


type Props = {
    setSidePanelIsShown: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Navbar(
    {setSidePanelIsShown}
: Props){
    const {navIsShown} = useScrollBehavior();

    return <div className={(navIsShown ? "top-0" : "-top-32") +
    ' fixed transition-[top] ease-in-out duration-500 w-screen bg-red-800'}>
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
                        <button className='btn'>Profile</button>
                    </Link>
                    <Link to="/store">
                        <button className='btn'>Store</button>
                    </Link>
                    <Link to="/cart">
                        <button className='btn'>Cart</button>
                    </Link>
                    <button className='btn' onClick={()=>setSidePanelIsShown(true)}>
                        More
                    </button>
                </div>
                
            </div>
        </div>
}