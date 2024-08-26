import { useOutletContext } from "@remix-run/react";
import { Tables } from "database.types";
import { ContextProps } from "~/utils/types/ContextProps.type";

type Props = {
    product: Tables<"PRODUCTS">;
};

export default function ProductCard({ product }: Props) {
    const { user, supabase } = useOutletContext<ContextProps>();

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
        }
    }

    return (
        <div className="mt-5 border-2 border-color-2">
            <p>Title: {product.title}</p>
            <p>Rating: {product.average_rating}</p>
            {!user ? null : (
                <div className="flex flex-row">
                    <button className="btn" onClick={addToCart}>
                        Add to cart
                    </button>
                    <button className="btn" onClick={addToWishlist}>
                        Add to wishlist
                    </button>
                </div>
            )}
        </div>
    );
}
