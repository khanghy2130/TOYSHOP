import { useEffect, useState, useRef } from "react";
import { Link } from "@remix-run/react";

import titleLogoImage from "~/assets/title_logo.png";
import useScrollBehavior from "../utils/Navbar/useScrollBehavior";

type Props = {
    setSidePanelIsShown: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Navbar({ setSidePanelIsShown }: Props) {
    const { navIsShown } = useScrollBehavior();

    return (
        <div
            className={
                (navIsShown ? "top-0" : "-top-32") +
                " fixed z-50 w-screen bg-red-800 transition-[top] duration-500 ease-in-out"
            }
        >
            <div
                className="
                mx-auto flex h-auto
                max-w-screen-lg flex-row justify-between
            "
            >
                <Link to="/">
                    <img src={titleLogoImage} className="w-40" />
                </Link>
                <div>
                    <Link to="/profile">
                        <button className="btn">Profile</button>
                    </Link>
                    <Link to="/store">
                        <button className="btn">Store</button>
                    </Link>
                    <Link to="/cart">
                        <button className="btn">Cart</button>
                    </Link>
                    <button
                        className="btn"
                        onClick={() => setSidePanelIsShown(true)}
                    >
                        More
                    </button>
                </div>
            </div>
        </div>
    );
}
