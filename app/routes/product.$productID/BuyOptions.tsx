import { MouseEventHandler } from "react";
import { ProductInfo } from "./Types";
import { redirect, useOutletContext } from "@remix-run/react";
import { ContextProps } from "~/utils/types/ContextProps.type";

type Props = {
    chosenQuantity: number;
    setChosenQuantity: SetState<number>;
    productInfo: ProductInfo;
};

export function BuyOptions({
    chosenQuantity,
    setChosenQuantity,
    productInfo,
}: Props) {
    const { rawCartItems, setRawCartItems, user, supabase } =
        useOutletContext<ContextProps>();

    async function addToCart() {
        if (!user) {
            return redirect("/login");
        }

        if (!productInfo) {
            return console.error("productInfo not defined");
        }

        if (productInfo.quantity < chosenQuantity) {
            return console.error("not enough in stock");
        }

        // insert into CARTS table
        const { error: insertError } = await supabase
            .from("CARTS")
            .insert({
                user_id: user.id,
                product_id: Number(productInfo.id),
                quantity: chosenQuantity,
            })
            .select("product_id, quantity");

        if (insertError) {
            console.error("Error adding product to cart", insertError);
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
    }

    const isOutOfStock = productInfo.quantity <= 0;
    const isInCart = rawCartItems.some(
        (rci) => rci.product_id === productInfo.id,
    );

    return (
        <div>
            <StockCounter />
            {isOutOfStock ? null : isInCart ? (
                <p>In cart</p>
            ) : (
                <>
                    <select
                        value={chosenQuantity}
                        onChange={(e) =>
                            setChosenQuantity(Number(e.currentTarget.value))
                        }
                        className="text-black"
                    >
                        {Array.apply(
                            null,
                            Array(Math.min(productInfo.quantity, 5)),
                        ).map((x, i) => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                    </select>

                    <button className="btn" onClick={addToCart}>
                        Add to cart
                    </button>
                </>
            )}
        </div>
    );

    function StockCounter() {
        return (
            <p>
                {isOutOfStock
                    ? "Out of stock"
                    : productInfo.quantity > 10
                      ? "In stock"
                      : `Only ${productInfo.quantity} left in stock`}
            </p>
        );
    }
}
