import { useTheme } from '~/utils/Navbar/ThemeProvider';

type Props = {
    sidePanelIsShown: boolean;
    setSidePanelIsShown: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SidePanel(
    {sidePanelIsShown, setSidePanelIsShown}
: Props){
    const [theme, setTheme] = useTheme();
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return <div 
    className={(sidePanelIsShown ? "right-0" : "-right-96") + 
    ` fixed h-screen transition-[right] ease-in-out duration-500
    w-96 max-w-full bg-gray-800 flex flex-col items-center`
    }>
        <button className='btn' 
        onClick={()=>setSidePanelIsShown(false)}>CLOSE</button>
        <button className='btn' onClick={toggleTheme}>Theme: {theme}</button>
    </div>
}