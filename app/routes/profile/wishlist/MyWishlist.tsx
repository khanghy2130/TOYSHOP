import { useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ContextProps } from "~/utils/types/ContextProps.type";
import ProductItem, { WishlistProduct } from "./ProductItem";

export default function MyWishlist() {
    const { supabase, user, setWishlist, addNotification } =
        useOutletContext<ContextProps>();

    const [products, setProducts] = useState<WishlistProduct[]>([]);

    // refetch wishlist and fetch products
    useEffect(() => {
        if (!user) return;
        (async function () {
            // refetch wishlist
            const { data: wishlistData, error: wishlistError } = await supabase
                .from("WISHLIST")
                .select("product_id")
                .order("created_at", { ascending: true })
                .eq("user_id", user.id);

            if (wishlistError) {
                console.error("Error fetching wishlist", wishlistError);
                addNotification("Error fetching wishlist", "FAIL");
                return;
            }

            const newWishlist = wishlistData.map((item) => item.product_id);
            setWishlist(newWishlist);

            // fetch products
            const { data: productsData, error: productsError } = await supabase
                .from("PRODUCTS")
                .select("id, title")
                .in("id", newWishlist);

            if (productsError) {
                console.error(
                    "Error fetching wishlist products",
                    productsError,
                );
                addNotification("Error fetching wishlist products", "FAIL");
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
            setProducts(orderedProducts);
        })();
    }, []);

    return (
        <div className="w-full">
            <h1 className="mb-2 text-2xl font-medium text-textColor1">
                My wishlist
            </h1>

            {products.length === 0 ? (
                <p>Wishlist is empty.</p>
            ) : (
                <div className="flex flex-col">
                    {products.map((product) => (
                        <ProductItem
                            key={product.id}
                            product={product}
                            setProducts={setProducts}
                            products={products}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
