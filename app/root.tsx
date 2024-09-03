import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import type { User } from "@supabase/supabase-js";
import { Database, Tables } from "database.types";

import { json } from "@remix-run/node";
import {
    Links,
    Meta,
    Outlet,
    Scripts,
    useLoaderData,
    useRevalidator,
} from "@remix-run/react";
import { useState, useEffect, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useLocation } from "@remix-run/react";

import stylesheet from "~/tailwind.css";
import {
    ThemeProvider,
    useTheme,
    ThemeType,
} from "~/utils/Navbar/ThemeProvider";
import { getThemeSession } from "./utils/Navbar/theme.server";

import Navbar from "./components/Navbar";
import SidePanel from "./components/SidePanel";
import insertNewUser from "./utils/insertNewUser";
import { RawCartItem } from "./utils/types/ContextProps.type";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: stylesheet },
];

export type LoaderData = {
    theme: ThemeType | null;
    env: { [key: string]: string };
};

export const loader: LoaderFunction = async ({ request }) => {
    const themeSession = await getThemeSession(request);

    const data: LoaderData = {
        theme: themeSession.getTheme(),
        env: {
            SUPABASE_URL: process.env.SUPABASE_URL!,
            SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
            SUPABASE_IMAGES_PATH: process.env.SUPABASE_IMAGES_PATH!,
        },
    };

    return json(data);
};

function App() {
    const { env } = useLoaderData<LoaderFunction>();
    const [supabase] = useState(() =>
        createBrowserClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY),
    );
    const [user, setUser] = useState<undefined | User>(undefined);
    // force rerender because user is still undefined briefly on first page load
    const [forceRerenderCounter, setForceRerenderCounter] = useState<number>(0);

    // recalls loaders when authentication state changes
    const revalidator = useRevalidator();
    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            revalidator.revalidate();
            // handle events
            if (event === "INITIAL_SESSION") {
                setUser(session?.user);
                setForceRerenderCounter(forceRerenderCounter + 1);
            } else if (event === "SIGNED_IN") {
                setUser(session!.user);
                // create new profile & avatar
                insertNewUser(supabase, {
                    id: session!.user.id!,
                    display_name:
                        session!.user.user_metadata.name ||
                        session!.user.user_metadata.email.split("@")[0],
                });
            } else if (event === "SIGNED_OUT") {
                setUser(undefined);
            }

            /* more events
            else if (event === "PASSWORD_RECOVERY") {
                // handle password recovery event
            } else if (event === "TOKEN_REFRESHED") {
                // handle token refreshed event
            } else if (event === "USER_UPDATED") {
                // handle user updated event
            }
            */
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase /*, revalidator*/]);

    const [theme] = useTheme();
    const [sidePanelIsShown, setSidePanelIsShown] = useState<boolean>(false);

    const [wishlist, setWishlist] = useState<number[]>([]);
    const [rawCartItems, setRawCartItems] = useState<RawCartItem[]>([]);
    const [cartCount, setCartCount] = useState<number>(0);

    // calculate cartCount
    useEffect(() => {
        setCartCount(
            rawCartItems.reduce(
                (total, curItem) => total + curItem.quantity,
                0,
            ),
        );
    }, [rawCartItems]);

    // fetch wishlist & cartCount
    useEffect(() => {
        if (!user) {
            setWishlist([]);
            setRawCartItems([]);
            return;
        }
        (async function () {
            const { data: wishlistData, error: wishlistError } = await supabase
                .from("WISHLIST")
                .select("product_id")
                .order("created_at", { ascending: false })
                .eq("user_id", user.id);

            if (wishlistError) {
                console.error("Error fetching wishlist", wishlistError);
            } else {
                setWishlist(wishlistData.map((item) => item.product_id));
            }

            const { data: rawCartItemsData, error: rawCartItemsError } =
                await supabase
                    .from("CARTS")
                    .select("product_id, quantity")
                    .eq("user_id", user.id);
            if (rawCartItemsError) {
                console.error(
                    "Error fetching raw cart items",
                    rawCartItemsError,
                );
            } else {
                setRawCartItems(rawCartItemsData);
            }
        })();
    }, [user]);

    // hide for specific routes
    const location = useLocation();
    const pathSegments = location.pathname.split("/").filter(Boolean); // Split and filter out empty segments
    const firstPathSegment = pathSegments[0];
    const routesToHideNavigation = ["login", "pay"];
    const shouldHideNavigation =
        routesToHideNavigation.includes(firstPathSegment);

    return (
        <html lang="en" className={theme ?? ""}>
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body key={forceRerenderCounter}>
                {shouldHideNavigation ? null : (
                    <>
                        <Navbar
                            cartCount={cartCount}
                            setSidePanelIsShown={setSidePanelIsShown}
                        />
                        <SidePanel
                            user={user}
                            supabase={supabase}
                            sidePanelIsShown={sidePanelIsShown}
                            setSidePanelIsShown={setSidePanelIsShown}
                        />
                    </>
                )}

                {/* space for navbar above main page content */}
                <div className="pt-24">
                    <Outlet
                        context={{
                            supabase,
                            user,
                            env,
                            wishlist,
                            setWishlist,
                            rawCartItems,
                            setRawCartItems,
                        }}
                    />
                </div>
                <Scripts />
            </body>
        </html>
    );
}

export default function AppWithProviders() {
    const data = useLoaderData<LoaderData>();
    return (
        <ThemeProvider specifiedTheme={data.theme}>
            <App />
        </ThemeProvider>
    );
}
