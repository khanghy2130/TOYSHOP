import { Link } from "@remix-run/react";
import { useTheme } from "~/utils/Navbar/ThemeProvider";

import { createAvatar } from "@dicebear/core";
import * as bigSmile from "@dicebear/big-smile";

import type { ContextProps } from "../utils/types/ContextProps.type";
import { useEffect, useState } from "react";
import SpinnerSVG from "./SpinnerSVG";
import { AddNotificationFunction } from "./useNotification";

type Props = {
    sidePanelIsShown: boolean;
    setSidePanelIsShown: SetState<boolean>;
    user: ContextProps["user"];
    supabase: ContextProps["supabase"];
    addNotification: AddNotificationFunction;
    userDisplayName: string;
};

export default function SidePanel({
    sidePanelIsShown,
    setSidePanelIsShown,
    user,
    supabase,
    addNotification,
    userDisplayName,
}: Props) {
    const [theme, setTheme] = useTheme();
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    const [avatarUri, setAvatarUri] = useState<string>("");

    // generate avatar
    useEffect(() => {
        if (!user) {
            setAvatarUri("");
            return;
        }
        (async function () {
            const { data, error } = await supabase
                .from("AVATARS")
                .select(`*`)
                .eq("id", user.id)
                .single();

            if (error) {
                console.error("Error fetching avatar");
                addNotification("Error fetching avatar", "FAIL");
                return;
            }

            setAvatarUri(
                createAvatar(bigSmile, {
                    accessoriesProbability: data.accessoriesProbability!,
                    backgroundColor: [data.backgroundColor!],
                    skinColor: [data.skinColor!],
                    hairColor: [data.hairColor!],
                    // expect errors of not matching types
                    // @ts-expect-error
                    hair: [data.hair!],
                    // @ts-expect-error
                    eyes: [data.eyes!],
                    // @ts-expect-error
                    mouth: [data.mouth!],
                    // @ts-expect-error
                    accessories: [data.accessories!],
                }).toDataUri(),
            );
        })();
    }, [user]);

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) addNotification("Error while logging out.", "FAIL");
    };

    // [link name, link path, icon element]
    const authenticatedLinks: [string, string, JSX.Element][] = [
        ["Profile", "/profile", profileIcon],
        ["Wishlist", "/profile?wishlist=true", heartIcon],
        ["Orders", "/profile?orders=true", orderIcon],
    ];

    return (
        <div
            className={
                (sidePanelIsShown ? "right-0" : "-right-96") +
                ` fixed z-50 flex h-screen w-96 max-w-full flex-col items-center overflow-y-auto border-l-2 border-bgColor2 bg-bgColor1 transition-[right] duration-500 ease-in-out`
            }
        >
            <div className="flex w-full flex-grow flex-col">
                {/* Close button & Theme toggle */}
                <div className="mb-6 flex justify-between">
                    <button
                        className="mx-2 my-2 text-textColor1 hover:text-primaryColor"
                        onClick={() => setSidePanelIsShown(false)}
                        title="Close"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-10"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18 18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                    <button
                        className="mx-2 my-2 text-textColor1 hover:text-primaryColor"
                        onClick={toggleTheme}
                        title="Toggle theme"
                    >
                        {theme === "light" ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-10"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-10"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                                />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Authenticated */}
                {user && (
                    <>
                        {/* Avatar & display name */}
                        <div className="flex flex-col items-center px-4">
                            <div className="h-28 w-28 items-center justify-center overflow-hidden rounded-lg">
                                {avatarUri === "" ? (
                                    <div className="h-1/3 w-1/3 text-primaryColor">
                                        <SpinnerSVG />
                                    </div>
                                ) : (
                                    <img
                                        className="h-full w-full"
                                        src={avatarUri}
                                    />
                                )}
                            </div>
                            <p className="text-xl">{userDisplayName}</p>
                        </div>

                        <div className="mt-6 flex flex-col px-4">
                            {/* Links */}
                            {authenticatedLinks.map(
                                ([linkName, linkPath, iconEle]) => (
                                    <Link
                                        to={linkPath}
                                        key={linkName}
                                        className="rounded-lg px-3 py-2 text-xl hover:bg-bgColor2"
                                        onClick={() =>
                                            setSidePanelIsShown(false)
                                        }
                                    >
                                        <div className="flex items-center">
                                            {iconEle}
                                            <span className="ms-2">
                                                {linkName}
                                            </span>
                                        </div>
                                    </Link>
                                ),
                            )}

                            <div className="my-4 h-1 w-full rounded-md bg-textColor1"></div>

                            {/* Log out button */}
                            <button
                                className="rounded-lg px-3 py-2 text-xl hover:bg-bgColor2"
                                onClick={logout}
                            >
                                <div className="flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="size-8"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                                        />
                                    </svg>
                                    <span className="ms-2">Log out</span>
                                </div>
                            </button>
                        </div>
                    </>
                )}

                {/* Unauthenticated */}
                {!user && (
                    <div className="flex flex-col items-center">
                        <h1 className="mb-4 text-lg">Log in to see profile</h1>
                        <Link to="/login">
                            <button
                                className="click-shrink rounded-md bg-primaryColor px-4 py-2 text-xl text-primaryTextColor hover:bg-primaryColorMuted"
                                onClick={() => setSidePanelIsShown(false)}
                            >
                                Login
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

const profileIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-8"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
    </svg>
);

const heartIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-8"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
    </svg>
);

const orderIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-8"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
        />
    </svg>
);
