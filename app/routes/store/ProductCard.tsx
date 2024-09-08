import { useOutletContext } from "@remix-run/react";
import { Tables } from "database.types";
import { ContextProps } from "~/utils/types/ContextProps.type";

type Props = {
    product: Tables<"PRODUCTS">;
};

export default function ProductCard({ product }: Props) {
    const {
        user,
        supabase,
        setRawCartItems,
        rawCartItems,
        wishlist,
        setWishlist,
        addNotification,
    } = useOutletContext<ContextProps>();

    //// fetch image, hide card until image is loaded

    async function addToCart() {
        if (!user) {
            alert("not logged in");
            return;
            //////// pop up error
        }

        // insert into CARTS table
        const { error } = await supabase.from("CARTS").insert({
            user_id: user.id,
            product_id: Number(product.id),
            quantity: 1,
        });

        if (error) {
            console.error("Error adding product to cart", error);
            return;
        }

        const { data, error: selectError } = await supabase
            .from("CARTS")
            .select("product_id, quantity");

        if (selectError) {
            console.error("Error fetching cart items", selectError);
            return;
        }

        setRawCartItems(data);
        addNotification("Added to cart", "SUCCESS");
    }

    async function addToWishlist() {
        if (!user) {
            alert("not logged in");
            return;
            //////// pop up error
        }

        // Attempt to delete the row first and capture how many rows were deleted
        const { data: deletedRows, error: deleteError } = await supabase
            .from("WISHLIST")
            .delete()
            .eq("user_id", user.id)
            .eq("product_id", product.id)
            .select();

        if (deleteError) {
            console.error("Un-wishlist failed:", deleteError);
            return;
        }

        // If no rows were deleted, insert a new row
        if (deletedRows.length === 0) {
            const { error: insertError } = await supabase
                .from("WISHLIST")
                .insert([{ user_id: user.id, product_id: product.id }]);

            if (insertError) {
                console.error("Wishlist failed:", insertError);
            }
            setWishlist([...wishlist, product.id]);
            addNotification("Added to wishlist", "SUCCESS");
        } else {
            setWishlist(wishlist.filter((wi) => wi !== product.id));
            addNotification("Removed from wishlist", "SUCCESS");
        }
    }

    const isInCart = rawCartItems.some((rci) => rci.product_id === product.id);
    const isInWishlist = wishlist.includes(product.id);
    const outOfStock = product.quantity <= 0;

    return (
        <div className="mt-5 rounded-lg bg-gradient-to-br from-bgColor1 to-bgColor2 shadow-md dark:bg-gradient-to-tl">
            <p>Title: {product.title}</p>
            <p>Rating: {product.average_rating}</p>
            {!user ? null : (
                <div className="flex flex-row">
                    <button
                        className="btn"
                        disabled={isInCart || outOfStock}
                        onClick={addToCart}
                    >
                        {isInCart
                            ? "In cart"
                            : outOfStock
                              ? "Out of stock"
                              : addToCartTextRender}
                    </button>
                    <button
                        className="click-shrink text-primaryColor hover:text-primaryColorMuted"
                        onClick={addToWishlist}
                    >
                        {isInWishlist ? filledHeartIcon : emptyHeartIcon}
                    </button>
                </div>
            )}
        </div>
    );
}

const addToCartTextRender = (
    <div className="flex flex-row">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
        </svg>
        <span className="ms-1">Add to cart</span>
    </div>
);

const emptyHeartIcon = (
    <>
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
    </>
);

const filledHeartIcon = (
    <>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-8"
        >
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
        </svg>
    </>
);
