import { Link, useOutletContext, useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ContextProps } from "~/utils/types/ContextProps.type";
import { CartItem } from "./CartItemType";

export default function CartPage() {
    const { supabase, user } = useOutletContext<ContextProps>();

    const [searchParams, setSearchParams] = useSearchParams();
    const insufficientStockItem = searchParams.get("insufficientStockItem");

    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // receive insufficient in stock error
    useEffect(() => {
        if (insufficientStockItem) {
            //////
            console.log(`insufficient in stock item: ${insufficientStockItem}`);

            searchParams.delete("insufficientStockItem");
            setSearchParams(searchParams);
        }
    }, [insufficientStockItem, searchParams, setSearchParams]);

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
        return <div>Not logged in</div>;
    }

    return (
        <div>
            <h1>cart page</h1>
            {cartItems.map((cartItem) => (
                <div key={cartItem.id}>
                    (COMPONENT) product: {cartItem.product.title}; quantity:
                    {cartItem.quantity}
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
