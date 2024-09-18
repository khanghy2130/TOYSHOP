import { useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ContextProps } from "~/utils/types/ContextProps.type";
import ProductItem from "./ProductItem";
import { Tables } from "database.types";

////////// remove this route
export default function WishlistPage() {
    const { supabase, user, wishlist, setWishlist } =
        useOutletContext<ContextProps>();

    const [products, setProducts] = useState<Tables<"PRODUCTS">[]>([]);

    useEffect(() => {
        if (!user) return;
        (async function () {
            // fetch wishlist again
            const { data: wishlistData, error: wishlistError } = await supabase
                .from("WISHLIST")
                .select("product_id")
                .order("created_at", { ascending: true })
                .eq("user_id", user.id);

            if (wishlistError) {
                console.error("Error fetching wishlist", wishlistError);
                return;
            }

            const newWishlist = wishlistData.map((item) => item.product_id);
            setWishlist(newWishlist);

            // fetch products
            const { data: productsData, error: productsError } = await supabase
                .from("PRODUCTS")
                .select("*")
                .in("id", newWishlist);

            if (productsError) {
                console.error(
                    "Error fetching wishlisted products",
                    productsError,
                );
                return;
            }
            // order products by wishlist order
            const orderedProducts: Tables<"PRODUCTS">[] = [];
            for (let wi = 0; wi < newWishlist.length; wi++) {
                for (let pi = 0; pi < productsData.length; pi++) {
                    const product = productsData[pi];
                    if (product.id === newWishlist[wi]) {
                        orderedProducts.push(product);
                        break;
                    }
                }
            }
            setProducts(orderedProducts);
        })();
    }, []);

    if (!user) {
        return <p>Log in to see your wishlist</p>;
    }

    return (
        <div>
            <h1>
                Wishlist ({wishlist.length}); Products ({products.length})
            </h1>
            {/* ///// user remove action: remove from wishlist AND from products */}

            {products.map((product) => (
                <ProductItem key={product.id} product={product} />
            ))}
        </div>
    );
}
