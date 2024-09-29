import { Link, useLoaderData, useOutletContext } from "@remix-run/react";

import { ContextProps } from "~/utils/types/ContextProps.type";
import MyWishlist from "./wishlist/MyWishlist";
import MyOrders from "./orders/MyOrders";
import MyReviews from "./reviews/MyReviews";
import ProfileInfo from "./profile_info/ProfileInfo";
import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { WishlistProduct } from "./wishlist/ProductItem";
import {
    createServerClient,
    parseCookieHeader,
    serializeCookieHeader,
} from "@supabase/ssr";
import { Tables } from "database.types";

export const meta: MetaFunction = () => {
    return [{ title: "My profile" }];
};

export type loaderDataReturnType = {
    newWishlist: number[];
    orderedProducts: WishlistProduct[];
    ordersData: Tables<"ORDERS">[];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const headers = new Headers();
    const supabase = createServerClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return parseCookieHeader(
                        request.headers.get("Cookie") ?? "",
                    );
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        headers.append(
                            "Set-Cookie",
                            serializeCookieHeader(name, value, options),
                        ),
                    );
                },
            },
        },
    );

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) return null;

    // fetch wishlist
    const { data: wishlistData, error: wishlistError } = await supabase
        .from("WISHLIST")
        .select("product_id")
        .order("created_at", { ascending: true })
        .eq("user_id", user.id);

    if (wishlistError) {
        console.error("Error fetching wishlist", wishlistError);
        return null;
    }
    const newWishlist = wishlistData.map((item) => item.product_id as number);

    // fetch products
    const { data: productsData, error: productsError } = await supabase
        .from("PRODUCTS")
        .select("id, title")
        .in("id", newWishlist);

    if (productsError) {
        console.error("Error fetching wishlist products", productsError);
        return;
    }
    // order products by wishlist order
    const orderedProducts: WishlistProduct[] = [];
    for (let wi = 0; wi < newWishlist.length; wi++) {
        for (let pi = 0; pi < productsData.length; pi++) {
            const product = productsData[pi];
            if (product.id === newWishlist[wi]) {
                orderedProducts.push(product);
                break;
            }
        }
    }

    // fetch orders
    const { data: ordersData, error: ordersError } = await supabase
        .from("ORDERS")
        .select("*")
        .order("created_at", { ascending: false });

    if (ordersError) {
        console.error("Error fetching orders", ordersError);
        return null;
    }

    return { newWishlist, orderedProducts, ordersData };
};

export default function Profile() {
    const { user } = useOutletContext<ContextProps>();
    const loaderData = useLoaderData() as loaderDataReturnType | null;

    // unauthenticated render
    if (!user) {
        return (
            <div className="flex flex-col items-center">
                <h1 className="text-xl">Log in to see your profile.</h1>
                <Link to="/login">
                    <button className="mt-3 rounded-md bg-primaryColor px-3 py-1 text-xl font-medium text-primaryTextColor hover:bg-primaryColorMuted">
                        Login
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="relative flex w-full max-w-[1200px] flex-col md:flex-row md:items-start">
            <ProfileInfo />

            <div className="mt-10 flex flex-grow flex-col px-4 md:mt-0">
                <MyWishlist
                    newWishlist={loaderData?.newWishlist}
                    orderedProducts={loaderData?.orderedProducts}
                />
                <MyOrders ordersData={loaderData?.ordersData} />
                <MyReviews />
            </div>
        </div>
    );
}
