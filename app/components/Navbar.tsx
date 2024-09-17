import { useEffect, useState, useRef } from "react";
import { Link } from "@remix-run/react";

import brandTextImage from "~/assets/brand_text.png";
import logoImage from "~/assets/logo.png";
import useScrollBehavior from "../utils/Navbar/useScrollBehavior";

type Props = {
    cartCount: number;
    setSidePanelIsShown: SetState<boolean>;
};

export default function Navbar({ cartCount, setSidePanelIsShown }: Props) {
    const { navIsShown } = useScrollBehavior();

    return (
        <div
            className={
                (navIsShown ? "top-0" : "-top-32") +
                " fixed z-40 w-screen bg-black bg-opacity-70 px-2 text-lg text-primaryTextColor backdrop-blur-md transition-[top] duration-500 ease-in-out sm:px-5"
            }
        >
            <div className="mx-auto flex h-16 max-w-screen-lg flex-row justify-between">
                <Link to="/" className="flex py-2">
                    <img src={logoImage} className="h-full w-auto" />
                    <img
                        src={brandTextImage}
                        className="hidden h-full sm:block"
                    />
                </Link>
                <div className="flex align-middle">
                    <Link
                        to="/store"
                        className="flex align-middle hover:text-primaryColor"
                    >
                        <button className="flex items-center py-2">
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
                                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                                />
                            </svg>
                            <span className="ms-1 hidden md:block">Browse</span>
                        </button>
                    </Link>
                    <Link
                        to="/cart"
                        className="mx-3 flex align-middle hover:text-primaryColor sm:mx-8"
                    >
                        <button className="flex items-center py-2">
                            <div className="relative flex">
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
                                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                                    />
                                </svg>
                                {cartCount === 0 ? null : (
                                    <span className="absolute right-0 top-0 rounded-3xl bg-primaryColor px-1 text-sm font-bold text-primaryTextColor">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="ms-1 hidden md:block">Cart</span>
                        </button>
                    </Link>
                    <a className="flex align-middle hover:text-primaryColor">
                        <button
                            className="flex items-center py-2"
                            onClick={() => setSidePanelIsShown(true)}
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
                                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                />
                            </svg>
                            <span className="ms-1 hidden md:block">More</span>
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );
}
