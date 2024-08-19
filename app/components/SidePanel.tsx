import { Link } from "@remix-run/react";

import { useTheme } from "~/utils/Navbar/ThemeProvider";

import type { ContextProps } from "../utils/types/ContextProps.type";

type Props = {
    sidePanelIsShown: boolean;
    setSidePanelIsShown: SetState<boolean>;
    user: ContextProps["user"];
    supabase: ContextProps["supabase"];
};

export default function SidePanel({
    sidePanelIsShown,
    setSidePanelIsShown,
    user,
    supabase,
}: Props) {
    const [theme, setTheme] = useTheme();
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) alert("Error while logging out.");
    };

    return (
        <div
            className={
                (sidePanelIsShown ? "right-0" : "-right-96") +
                ` fixed z-50 flex h-screen w-96 max-w-full
    flex-col items-center bg-gray-800 transition-[right] duration-500 ease-in-out`
            }
        >
            <button className="btn" onClick={() => setSidePanelIsShown(false)}>
                CLOSE
            </button>
            <button className="btn" onClick={toggleTheme}>
                Theme: {theme}
            </button>

            {user ? (
                <div className="mt-12 flex flex-col items-center">
                    <p>Logged in as {user.user_metadata.full_name}!</p>
                    <Link to="/profile">
                        <button
                            className="btn"
                            onClick={() => setSidePanelIsShown(false)}
                        >
                            My profile
                        </button>
                    </Link>
                    <button className="btn" onClick={logout}>
                        Log out
                    </button>
                </div>
            ) : (
                <Link to="/login">
                    <button className="btn">Login</button>
                </Link>
            )}
        </div>
    );
}
