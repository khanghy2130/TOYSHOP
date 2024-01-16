// navbar behavior: hide/show on scroll down/up
import { useEffect, useState, useRef } from 'react';

export default function useScrollBehavior(): ({navIsShown: boolean}){
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

    return { navIsShown };
}