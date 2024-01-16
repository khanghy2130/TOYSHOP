import { Link } from '@remix-run/react';

import { useTheme } from '~/utils/Navbar/ThemeProvider';

import type { ContextProps } from '../utils/types/ContextProps.type';


type Props = {
    sidePanelIsShown: boolean;
    setSidePanelIsShown: React.Dispatch<React.SetStateAction<boolean>>;
    user: ContextProps["user"];
    supabase: ContextProps["supabase"]
};

export default function SidePanel(
    {sidePanelIsShown, setSidePanelIsShown, user, supabase}
: Props){
    const [theme, setTheme] = useTheme();
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    const logout = async () => {
        const {error} = await supabase.auth.signOut();
        if (error) alert("Error while logging out.");
    }

    return <div 
    className={(sidePanelIsShown ? "right-0" : "-right-96") + 
    ` fixed h-screen transition-[right] ease-in-out duration-500
    w-96 max-w-full bg-gray-800 flex flex-col items-center`
    }>
        <button className='btn' 
        onClick={()=>setSidePanelIsShown(false)}>CLOSE</button>
        <button className='btn' onClick={toggleTheme}>Theme: {theme}</button>

        {user? <div className='flex flex-col mt-12'>
            <p>Logged in as {user.email}</p>
            <button className='btn' onClick={logout}>Log out</button>
        </div> : <Link to="/login">
            <button className='btn'>Login</button>
        </Link>}

    </div>
}