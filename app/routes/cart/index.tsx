import { Link, useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ContextProps } from "~/utils/types/ContextProps.type";
import { CartItem } from "./CartItemType";

export default function CartPage() {
    const { supabase, user } = useOutletContext<ContextProps>();

    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // fetch items in cart if logged in
    useEffect(() => {
        if (!user) return;
        (async function () {
            const { data, error } = await supabase
                .from("CARTS")
                .select(
                    `
                    id,
                    quantity,
                    product:product_id (
                        id,
                        title,
                        price,
                        discount
                    )
                `,
                )
                .eq("user_id", user.id)
                .returns<CartItem[]>();

            if (error) {
                console.error("Error fetching items in cart", error);
                return;
            }

            setCartItems(data);
        })();
    }, []);

    if (!user) {
        ////////
        <div>Not logged in</div>;
    }

    return (
        <div>
            <h1>cart page</h1>
            {cartItems.map((cartItem) => (
                <div key={cartItem.id}>
                    (COMPONENT) product: {cartItem.product.title}
                </div>
            ))}
            <Link to="/pay">
                <button disabled={cartItems.length === 0} className="btn">
                    Checkout
                </button>
            </Link>
        </div>
    );
}
